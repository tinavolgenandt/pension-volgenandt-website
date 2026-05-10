#!/usr/bin/env node
/**
 * Weekly statistics for Pension Volgenandt.
 *
 * Runs every Friday at 07:00 UTC via GitHub Actions.
 * Covers the 7-day period from last Friday through yesterday (Thursday).
 *
 * Tracks:
 *   - New bookings made this week (Beds24, filtered by creation date)
 *   - Picknick completions this week (GA4 thank-you page views)
 *   - Website sessions this week vs. the previous 7 days (GA4)
 *   - Confirmed arrivals next week (Beds24)
 */

import { google } from 'googleapis'
import { createTransport } from 'nodemailer'

// ---------------------------------------------------------------------------
// Config (same secrets as monthly report — no new secrets needed)
// ---------------------------------------------------------------------------
const {
  BEDS24_REFRESH_TOKEN,
  BEDS24_PROPERTY_ID = '261258',
  GA4_PROPERTY_ID,
  GOOGLE_SERVICE_ACCOUNT_KEY,
  SMTP_HOST = 'smtp.ionos.de',
  SMTP_PORT = '587',
  SMTP_USER,
  SMTP_PASS,
  REPORT_RECIPIENTS = 'kontakt@pension-volgenandt.de,tina.volgenandt@googlemail.com',
} = process.env

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------
function toIsoDate(d) {
  return d.toISOString().split('T')[0]
}

function addDays(d, n) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

const today = new Date()
today.setHours(0, 0, 0, 0)

// Report period: last 7 days ending yesterday (Fri → Thu, complete days only)
const weekEnd = addDays(today, -1) // yesterday (Thu)
const weekStart = addDays(today, -7) // 7 days ago (last Fri)

// Previous 7-day window for comparison
const prevWeekEnd = addDays(today, -8)
const prevWeekStart = addDays(today, -14)

// Next week: Mon → Sun (day-of-week aware so manual runs also show correct dates)
const dayOfWeek = today.getDay() // 0=Sun, 1=Mon, ..., 6=Sat
const daysUntilNextMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 7 : 8 - dayOfWeek
const nextWeekStart = addDays(today, daysUntilNextMonday) // Mon
const nextWeekEnd = addDays(nextWeekStart, 6) // Sun

const fmt = (d) => d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
const weekLabel = `${fmt(weekStart)} – ${fmt(weekEnd)}`

console.log(`Weekly report: ${weekLabel}`)

// ---------------------------------------------------------------------------
// Beds24 helpers
// ---------------------------------------------------------------------------
async function getBeds24Token() {
  if (!BEDS24_REFRESH_TOKEN) return null
  const res = await fetch('https://api.beds24.com/v2/authentication/token', {
    headers: { refreshToken: BEDS24_REFRESH_TOKEN },
  })
  const data = await res.json()
  if (!data.token) {
    console.error('Beds24 token exchange failed:', data)
    return null
  }
  return data.token
}

function mapChannel(src) {
  if (!src || src === '' || src === 'manual') return 'Direkt'
  const n = src.toLowerCase().replace(/[.\s-]/g, '')
  if (n.includes('bookingcom')) return 'Booking.com'
  if (n.includes('airbnb')) return 'Airbnb'
  if (n.includes('beds24')) return 'Website'
  return 'Direkt'
}

async function fetchBeds24(token, params) {
  const qs = new URLSearchParams({
    propertyId: BEDS24_PROPERTY_ID,
    includeInvoice: 'false',
    ...params,
  })
  const res = await fetch(`https://api.beds24.com/v2/bookings?${qs}`, { headers: { token } })
  const body = await res.json()
  const arr = Array.isArray(body) ? body : body.data
  return Array.isArray(arr) ? arr : []
}

/**
 * New bookings created within [rangeStart, rangeEnd] (filtered by bookingTime).
 * Fetches a broad arrival window and filters client-side.
 */
async function getNewBookings(token, rangeStart, rangeEnd) {
  // Broad window: arrivals from 1 year ago to 2 years ahead catches any booking
  // created this week regardless of when the guest actually arrives.
  const broadFrom = toIsoDate(addDays(rangeStart, -365))
  const broadTo = toIsoDate(addDays(rangeEnd, 730))

  const all = await fetchBeds24(token, {
    arrivalFrom: broadFrom,
    arrivalTo: broadTo,
    departureFrom: broadFrom,
  })

  const startMs = rangeStart.getTime()
  const endMs = rangeEnd.getTime() + 86400000 // end of rangeEnd day

  const newBookings = all.filter((b) => {
    if (!b.bookingTime) return false
    // bookingTime can be "2026-05-01 08:47:49" or ISO format
    const bt = new Date(b.bookingTime.replace(' ', 'T')).getTime()
    return bt >= startMs && bt < endMs
  })

  let confirmed = 0
  let revenue = 0
  const byChannel = {}

  for (const b of newBookings) {
    const isCancelled =
      (b.cancelTime && b.cancelTime !== 0 && b.cancelTime !== '0') ||
      (typeof b.status === 'string' && b.status.toLowerCase().includes('cancel'))
    if (isCancelled) continue

    confirmed++
    const ch = mapChannel(b.apiSource)
    byChannel[ch] = (byChannel[ch] || 0) + 1
    revenue += parseFloat(b.price) || 0
  }

  return { confirmed, revenue, byChannel }
}

/** Confirmed arrivals in [rangeStart, rangeEnd]. */
async function getArrivals(token, rangeStart, rangeEnd) {
  const all = await fetchBeds24(token, {
    arrivalFrom: toIsoDate(rangeStart),
    arrivalTo: toIsoDate(rangeEnd),
    departureFrom: toIsoDate(rangeStart),
  })
  return all.filter((b) => {
    const isCancelled =
      (b.cancelTime && b.cancelTime !== 0 && b.cancelTime !== '0') ||
      (typeof b.status === 'string' && b.status.toLowerCase().includes('cancel'))
    return !isCancelled
  }).length
}

// ---------------------------------------------------------------------------
// GA4 helpers
// ---------------------------------------------------------------------------
async function getGA4Data() {
  if (!GA4_PROPERTY_ID || !GOOGLE_SERVICE_ACCOUNT_KEY) return null

  let credentials
  try {
    credentials = JSON.parse(Buffer.from(GOOGLE_SERVICE_ACCOUNT_KEY, 'base64').toString())
  } catch {
    credentials = JSON.parse(GOOGLE_SERVICE_ACCOUNT_KEY)
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  })
  const analyticsData = google.analyticsdata({ version: 'v1beta', auth })

  // Sessions: this week vs previous week (two separate calls — avoids named-dateRange parsing issues)
  const [sessionsThisRes, sessionsPrevRes] = await Promise.all([
    analyticsData.properties
      .runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        requestBody: {
          dateRanges: [{ startDate: toIsoDate(weekStart), endDate: toIsoDate(weekEnd) }],
          metrics: [{ name: 'sessions' }],
        },
      })
      .catch((e) => {
        console.error('GA4 sessions (this week) error:', e.message)
        return { data: { rows: [] } }
      }),
    analyticsData.properties
      .runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        requestBody: {
          dateRanges: [{ startDate: toIsoDate(prevWeekStart), endDate: toIsoDate(prevWeekEnd) }],
          metrics: [{ name: 'sessions' }],
        },
      })
      .catch((e) => {
        console.error('GA4 sessions (prev week) error:', e.message)
        return { data: { rows: [] } }
      }),
  ])

  const sessionsThis = parseInt(sessionsThisRes.data.rows?.[0]?.metricValues?.[0]?.value ?? '0')
  const sessionsPrev = parseInt(sessionsPrevRes.data.rows?.[0]?.metricValues?.[0]?.value ?? '0')

  // Picknick pages: landing + danke (= completed bookings)
  const picknickRes = await analyticsData.properties
    .runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      requestBody: {
        dateRanges: [{ startDate: toIsoDate(weekStart), endDate: toIsoDate(weekEnd) }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        dimensionFilter: {
          orGroup: {
            expressions: [
              {
                filter: {
                  fieldName: 'pagePath',
                  stringFilter: { matchType: 'BEGINS_WITH', value: '/picknick' },
                },
              },
              {
                filter: {
                  fieldName: 'pagePath',
                  stringFilter: { matchType: 'BEGINS_WITH', value: '/en/picnic' },
                },
              },
            ],
          },
        },
      },
    })
    .catch(() => ({ data: { rows: [] } }))

  let picknickLanding = 0
  let picknickDanke = 0
  for (const r of picknickRes.data.rows || []) {
    const path = r.dimensionValues[0].value
    const views = parseInt(r.metricValues[0].value)
    if (path.includes('/danke') || path.includes('/thanks')) picknickDanke += views
    else picknickLanding += views
  }

  return { sessionsThis, sessionsPrev, picknickLanding, picknickDanke }
}

// ---------------------------------------------------------------------------
// Email HTML
// ---------------------------------------------------------------------------
function buildEmail({ bookings, nextArrivals, ga4 }) {
  const fmtEur = (n) =>
    new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(n)

  const sessionsDiff = ga4 ? ga4.sessionsThis - ga4.sessionsPrev : 0
  const trendSign = sessionsDiff >= 0 ? '↑' : '↓'
  const trendColor = sessionsDiff >= 0 ? '#3d5a3e' : '#b94040'
  const trendText = `<span style="color:${trendColor};font-weight:700;">${trendSign} ${Math.abs(sessionsDiff)}</span> vs. Vorwoche`

  const card = (icon, value, label, sub = '') => `
    <td style="width:50%;padding:6px;">
      <div style="background:#f7f5f0;border-radius:8px;padding:18px 14px;text-align:center;">
        <div style="font-size:26px;line-height:1.2;">${icon}</div>
        <div style="font-size:30px;font-weight:700;color:#3d5a3e;margin:6px 0 2px;line-height:1;">${value}</div>
        <div style="font-size:13px;font-weight:600;color:#555;line-height:1.3;">${label}</div>
        ${sub ? `<div style="font-size:12px;color:#888;margin-top:5px;line-height:1.4;">${sub}</div>` : ''}
      </div>
    </td>`

  // Channel breakdown (only if there were bookings)
  let channelSection = ''
  if (bookings.confirmed > 0) {
    const rows = Object.entries(bookings.byChannel)
      .sort((a, b) => b[1] - a[1])
      .map(
        ([ch, n]) =>
          `<tr>
            <td style="padding:4px 0;color:#666;font-size:13px;">${ch}</td>
            <td style="padding:4px 0;font-size:13px;font-weight:700;color:#3d5a3e;text-align:right;">${n}</td>
          </tr>`,
      )
      .join('')

    channelSection = `
    <tr><td style="padding:0 28px 20px;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.8px;">Buchungsherkunft</p>
      <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
    </td></tr>`
  }

  // Picknick conversion note
  const picknickSub =
    ga4 && ga4.picknickLanding > 0 ? `${ga4.picknickLanding} Besuche der Picknick-Seite` : ''

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#333;background:#f7f5f0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;padding:20px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;max-width:560px;">

  <!-- Header -->
  <tr><td style="background:#3d5a3e;padding:22px 28px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:19px;font-weight:700;letter-spacing:0.3px;">Wochenrückblick</h1>
    <p style="margin:5px 0 0;color:#c8d8c0;font-size:12px;">${weekLabel} &nbsp;&middot;&nbsp; Pension Volgenandt</p>
  </td></tr>

  <!-- KPI cards -->
  <tr><td style="padding:20px 22px 4px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        ${card('🏠', bookings.confirmed, 'Neue Buchungen', bookings.confirmed > 0 ? fmtEur(bookings.revenue) + ' Gesamtwert' : '&nbsp;')}
        ${card('🧺', ga4?.picknickDanke ?? '–', 'Picknick-Buchungen', picknickSub)}
      </tr>
      <tr>
        ${card('🌐', ga4?.sessionsThis ?? '–', 'Website-Besucher', ga4 ? trendText : '&nbsp;')}
        ${card('📅', nextArrivals, 'Ankünfte nächste Woche', 'Mo ' + fmt(nextWeekStart) + ' – So ' + fmt(nextWeekEnd))}
      </tr>
    </table>
  </td></tr>

  ${channelSection}

  <!-- Footer -->
  <tr><td style="padding:16px 28px;text-align:center;border-top:1px solid #f0ede6;">
    <p style="margin:0;font-size:11px;color:#bbb;">Automatischer Wochenrückblick &middot; Pension Volgenandt</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const token = await getBeds24Token()

  const [bookings, nextArrivals, ga4] = await Promise.all([
    token
      ? getNewBookings(token, weekStart, weekEnd).catch((e) => {
          console.error('Beds24 new bookings error:', e.message)
          return { confirmed: 0, revenue: 0, byChannel: {} }
        })
      : Promise.resolve({ confirmed: 0, revenue: 0, byChannel: {} }),
    token
      ? getArrivals(token, nextWeekStart, nextWeekEnd).catch((e) => {
          console.error('Beds24 arrivals error:', e.message)
          return 0
        })
      : Promise.resolve(0),
    getGA4Data().catch((e) => {
      console.error('GA4 error:', e.message)
      return null
    }),
  ])

  console.log(`New bookings: ${bookings.confirmed} (€${bookings.revenue.toFixed(0)})`)
  console.log(`Next week arrivals: ${nextArrivals}`)
  if (ga4) {
    console.log(`Sessions: ${ga4.sessionsThis} (prev: ${ga4.sessionsPrev})`)
    console.log(`Picknick: ${ga4.picknickDanke} Buchungen, ${ga4.picknickLanding} Besuche`)
  }

  const html = buildEmail({ bookings, nextArrivals, ga4 })

  if (!SMTP_USER || !SMTP_PASS) {
    console.warn('SMTP credentials not set, skipping email send')
    return
  }

  const transporter = createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT),
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    tls: { rejectUnauthorized: false },
  })

  const recipients = REPORT_RECIPIENTS.split(',').map((s) => s.trim())
  await transporter.sendMail({
    from: `"Pension Volgenandt" <${SMTP_USER}>`,
    to: recipients.join(', '),
    subject: `Wochenrückblick ${weekLabel} – Pension Volgenandt`,
    html,
  })

  console.log(`Weekly report sent to: ${recipients.join(', ')}`)
}

main().catch((err) => {
  console.error('Weekly stats failed:', err)
  process.exit(1)
})
