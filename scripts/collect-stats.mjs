#!/usr/bin/env node
/**
 * Monthly statistics collection for Pension Volgenandt.
 *
 * Collects data from:
 *   1. Beds24 API v2 (bookings, revenue, occupancy)
 *   2. Google Analytics 4 Data API (website traffic)
 *   3. IONOS inquiry log (contact form submissions)
 *
 * Then:
 *   - Pushes aggregated data to a Google Sheet
 *   - Sends a monthly HTML email summary
 *
 * Run via: node scripts/collect-stats.mjs
 * Triggered by: .github/workflows/monthly-stats.yml (1st of each month)
 */

import { google } from 'googleapis'
import { createTransport } from 'nodemailer'

// ---------------------------------------------------------------------------
// Configuration from environment variables
// ---------------------------------------------------------------------------
const {
  BEDS24_REFRESH_TOKEN,
  BEDS24_PROPERTY_ID = '261258',
  GA4_PROPERTY_ID,
  GOOGLE_SERVICE_ACCOUNT_KEY, // base64-encoded JSON
  GOOGLE_SHEETS_ID,
  IONOS_LOG_API_KEY,
  SMTP_HOST = 'smtp.ionos.de',
  SMTP_PORT = '587',
  SMTP_USER,
  SMTP_PASS,
  REPORT_RECIPIENTS = 'kontakt@pension-volgenandt.de,tina.volgenandt@googlemail.com',
  LOOKER_STUDIO_URL = '',
} = process.env

// Calculate previous month date range
const now = new Date()
const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
const month = now.getMonth() === 0 ? 12 : now.getMonth() // 1-indexed
const monthStr = `${year}-${String(month).padStart(2, '0')}`
const startDate = `${monthStr}-01`
const daysInMonth = new Date(year, month, 0).getDate()
const endDate = `${monthStr}-${String(daysInMonth).padStart(2, '0')}`

const MONTH_NAMES_DE = [
  '', 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
]
const monthLabel = `${MONTH_NAMES_DE[month]} ${year}`

console.log(`Collecting statistics for ${monthLabel} (${startDate} to ${endDate})`)

// Room name mapping
const ROOM_NAMES = {
  548066: 'Balkonzimmer',
  549252: 'Rosengarten',
  549319: 'Wohlfühl-Appartement',
  656178: 'Einzelzimmer',
  656179: "Emil's Kuhwiese",
  656180: 'Schöne Aussicht',
}
const TOTAL_UNITS = Object.keys(ROOM_NAMES).length

// ---------------------------------------------------------------------------
// 1. Beds24 API
// ---------------------------------------------------------------------------
async function collectBeds24Data() {
  if (!BEDS24_REFRESH_TOKEN) {
    console.warn('BEDS24_REFRESH_TOKEN not set, skipping Beds24 data')
    return null
  }

  // Get access token
  const tokenRes = await fetch('https://api.beds24.com/v2/authentication/token', {
    headers: { refreshToken: BEDS24_REFRESH_TOKEN },
  })
  const tokenData = await tokenRes.json()
  if (!tokenData.token) {
    console.error('Beds24 token exchange failed:', tokenData)
    return null
  }
  const token = tokenData.token

  // Fetch bookings for the month
  const params = new URLSearchParams({
    propertyId: BEDS24_PROPERTY_ID,
    arrivalFrom: startDate,
    arrivalTo: endDate,
    includeInvoice: 'true',
  })
  const bookingsRes = await fetch(`https://api.beds24.com/v2/bookings?${params}`, {
    headers: { token },
  })
  const bookingsBody = await bookingsRes.json()

  // Beds24 v2 wraps results: { success, data: [...] }
  const bookings = Array.isArray(bookingsBody) ? bookingsBody : bookingsBody.data
  if (!Array.isArray(bookings)) {
    console.error('Beds24 bookings response unexpected:', bookingsBody)
    return null
  }

  // Calculate metrics
  let totalBookings = 0
  let cancellations = 0
  let totalRevenue = 0
  let totalNights = 0
  let totalBookedRoomNights = 0
  const byRoom = {}
  const byChannel = {}
  const guestCountries = {}

  for (const b of bookings) {
    totalBookings++

    // Beds24 v2: cancelTime is set for cancelled bookings
    if (b.cancelTime) {
      cancellations++
      continue
    }

    // Revenue from price field
    if (b.price) {
      totalRevenue += parseFloat(b.price) || 0
    }

    // Nights
    const arrival = new Date(b.arrival)
    const departure = new Date(b.departure)
    const nights = Math.max(1, Math.round((departure - arrival) / 86400000))
    totalNights += nights
    totalBookedRoomNights += nights

    // By room (Beds24 v2: roomId = unit ID, unitId = sub-unit index)
    const roomId = String(b.roomId || 'unknown')
    const roomName = ROOM_NAMES[roomId] || roomId
    byRoom[roomName] = (byRoom[roomName] || 0) + 1

    // By channel (Beds24 v2: apiSource or referer)
    const channel = b.apiSource || b.referer || 'Direkt'
    byChannel[channel] = (byChannel[channel] || 0) + 1

    // Guest country
    const country = b.country || 'Unbekannt'
    if (country && country !== 'Unbekannt') {
      guestCountries[country] = (guestCountries[country] || 0) + 1
    }
  }

  const confirmedBookings = totalBookings - cancellations
  const avgStay = confirmedBookings > 0 ? (totalNights / confirmedBookings).toFixed(1) : '0'
  const totalAvailableRoomNights = TOTAL_UNITS * daysInMonth
  const occupancyRate = totalAvailableRoomNights > 0
    ? ((totalBookedRoomNights / totalAvailableRoomNights) * 100).toFixed(1)
    : '0'
  const cancellationRate = totalBookings > 0
    ? ((cancellations / totalBookings) * 100).toFixed(1)
    : '0'

  // Top room
  const topRoom = Object.entries(byRoom).sort((a, b) => b[1] - a[1])[0]
  // Top channel
  const topChannel = Object.entries(byChannel).sort((a, b) => b[1] - a[1])[0]
  // Top country
  const topCountry = Object.entries(guestCountries).sort((a, b) => b[1] - a[1])[0]

  return {
    totalBookings,
    confirmedBookings,
    cancellations,
    cancellationRate,
    totalRevenue: totalRevenue.toFixed(2),
    avgStay,
    occupancyRate,
    topRoom: topRoom ? topRoom[0] : '–',
    topChannel: topChannel ? topChannel[0] : '–',
    topCountry: topCountry ? topCountry[0] : '–',
    byRoom,
    byChannel,
    guestCountries,
  }
}

// ---------------------------------------------------------------------------
// 2. Google Analytics 4 Data API
// ---------------------------------------------------------------------------
async function collectGA4Data() {
  if (!GA4_PROPERTY_ID || !GOOGLE_SERVICE_ACCOUNT_KEY) {
    console.warn('GA4 credentials not set, skipping GA4 data')
    return null
  }

  const keyJson = JSON.parse(Buffer.from(GOOGLE_SERVICE_ACCOUNT_KEY, 'base64').toString())
  const auth = new google.auth.GoogleAuth({
    credentials: keyJson,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  })

  const analyticsData = google.analyticsdata({ version: 'v1beta', auth })

  // Run report
  const res = await analyticsData.properties.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
      dimensions: [],
    },
  })

  const row = res.data.rows?.[0]
  const sessions = row?.metricValues?.[0]?.value || '0'
  const users = row?.metricValues?.[1]?.value || '0'
  const pageviews = row?.metricValues?.[2]?.value || '0'
  const bounceRate = parseFloat(row?.metricValues?.[3]?.value || '0').toFixed(1)
  const avgSessionDuration = parseFloat(row?.metricValues?.[4]?.value || '0').toFixed(0)

  // Top pages
  const pagesRes = await analyticsData.properties.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: 'screenPageViews' }],
      dimensions: [{ name: 'pagePath' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10,
    },
  })

  const topPages = (pagesRes.data.rows || []).map((r) => ({
    page: r.dimensionValues[0].value,
    views: r.metricValues[0].value,
  }))

  // Traffic sources
  const sourcesRes = await analyticsData.properties.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: 'sessions' }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10,
    },
  })

  const sources = (sourcesRes.data.rows || []).map((r) => ({
    source: r.dimensionValues[0].value,
    sessions: r.metricValues[0].value,
  }))

  // Device categories
  const devicesRes = await analyticsData.properties.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: 'sessions' }],
      dimensions: [{ name: 'deviceCategory' }],
    },
  })

  const devices = (devicesRes.data.rows || []).map((r) => ({
    device: r.dimensionValues[0].value,
    sessions: r.metricValues[0].value,
  }))

  // Countries
  const countriesRes = await analyticsData.properties.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: 'sessions' }],
      dimensions: [{ name: 'country' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10,
    },
  })

  const countries = (countriesRes.data.rows || []).map((r) => ({
    country: r.dimensionValues[0].value,
    sessions: r.metricValues[0].value,
  }))

  const topPage = topPages[0]?.page || '–'
  const topSource = sources[0]?.source || '–'

  return {
    sessions,
    users,
    pageviews,
    bounceRate,
    avgSessionDuration,
    topPages,
    sources,
    devices,
    countries,
    topPage,
    topSource,
  }
}

// ---------------------------------------------------------------------------
// 3. Email Inquiry Log
// ---------------------------------------------------------------------------
async function collectInquiryData() {
  if (!IONOS_LOG_API_KEY) {
    console.warn('IONOS_LOG_API_KEY not set, skipping inquiry data')
    return null
  }

  const url = `https://api.pension-volgenandt.de/get-inquiry-log.php?key=${IONOS_LOG_API_KEY}&month=${monthStr}`
  const res = await fetch(url)
  const data = await res.json()

  if (!data.entries) return null

  const entries = data.entries
  const total = entries.length
  const byType = {}

  for (const e of entries) {
    const type = e.type || 'Kontaktanfrage'
    byType[type] = (byType[type] || 0) + 1
  }

  return { total, byType }
}

// ---------------------------------------------------------------------------
// 4. Push to Google Sheet
// ---------------------------------------------------------------------------
async function pushToGoogleSheet(beds24, ga4, inquiries) {
  if (!GOOGLE_SERVICE_ACCOUNT_KEY || !GOOGLE_SHEETS_ID) {
    console.warn('Google Sheets credentials not set, skipping sheet update')
    return
  }

  const keyJson = JSON.parse(Buffer.from(GOOGLE_SERVICE_ACCOUNT_KEY, 'base64').toString())
  const auth = new google.auth.GoogleAuth({
    credentials: keyJson,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })

  const row = [
    monthLabel,
    beds24?.confirmedBookings ?? '–',
    beds24?.cancellations ?? '–',
    beds24?.totalRevenue ?? '–',
    beds24?.occupancyRate ? `${beds24.occupancyRate}%` : '–',
    beds24?.avgStay ?? '–',
    beds24?.cancellationRate ? `${beds24.cancellationRate}%` : '–',
    beds24?.topRoom ?? '–',
    beds24?.topChannel ?? '–',
    beds24?.topCountry ?? '–',
    ga4?.sessions ?? '–',
    ga4?.users ?? '–',
    ga4?.pageviews ?? '–',
    ga4?.bounceRate ? `${ga4.bounceRate}%` : '–',
    ga4?.topPage ?? '–',
    ga4?.topSource ?? '–',
    inquiries?.total ?? '–',
  ]

  // Check if header row exists
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId: GOOGLE_SHEETS_ID,
    range: 'Monatsdaten!A1:Q1',
  })

  if (!existing.data.values || existing.data.values.length === 0) {
    // Write header row
    await sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SHEETS_ID,
      range: 'Monatsdaten!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          'Monat', 'Buchungen', 'Stornierungen', 'Umsatz (€)', 'Auslastung',
          'Ø Aufenthalt (Nächte)', 'Storno-Rate', 'Top Zimmer', 'Top Kanal',
          'Top Land (Gäste)', 'Sessions', 'Nutzer', 'Seitenaufrufe',
          'Absprungrate', 'Top Seite', 'Top Quelle', 'Anfragen',
        ]],
      },
    })
  }

  // Append data row
  await sheets.spreadsheets.values.append({
    spreadsheetId: GOOGLE_SHEETS_ID,
    range: 'Monatsdaten!A:Q',
    valueInputOption: 'RAW',
    requestBody: { values: [row] },
  })

  console.log('Google Sheet updated successfully')
}

// ---------------------------------------------------------------------------
// 5. HTML Email
// ---------------------------------------------------------------------------
function buildEmailHtml(beds24, ga4, inquiries) {
  const kpi = (label, value) => `
    <td style="padding:12px 16px;text-align:center;background:#f8f7f4;border-radius:8px;">
      <div style="font-size:24px;font-weight:bold;color:#4a6741;">${value}</div>
      <div style="font-size:12px;color:#6b7c68;margin-top:4px;">${label}</div>
    </td>`

  const tableRow = (label, value) => `
    <tr>
      <td style="padding:6px 12px;color:#4a4a4a;">${label}</td>
      <td style="padding:6px 12px;text-align:right;font-weight:600;color:#2d3b28;">${value}</td>
    </tr>`

  const section = (title, content) => `
    <div style="margin-top:24px;">
      <h2 style="font-size:18px;color:#2d3b28;border-bottom:2px solid #c9a84c;padding-bottom:8px;margin-bottom:16px;">${title}</h2>
      ${content}
    </div>`

  // KPIs
  let kpis = '<table style="width:100%;border-spacing:8px;"><tr>'
  kpis += kpi('Buchungen', beds24?.confirmedBookings ?? '–')
  kpis += kpi('Umsatz', beds24?.totalRevenue ? `${beds24.totalRevenue} €` : '–')
  kpis += kpi('Auslastung', beds24?.occupancyRate ? `${beds24.occupancyRate}%` : '–')
  kpis += kpi('Besucher', ga4?.users ?? '–')
  kpis += kpi('Anfragen', inquiries?.total ?? '–')
  kpis += '</tr></table>'

  // Bookings section
  let bookingsHtml = ''
  if (beds24) {
    let rows = ''
    rows += tableRow('Bestätigte Buchungen', beds24.confirmedBookings)
    rows += tableRow('Stornierungen', `${beds24.cancellations} (${beds24.cancellationRate}%)`)
    rows += tableRow('Gesamtumsatz', `${beds24.totalRevenue} €`)
    rows += tableRow('Ø Aufenthalt', `${beds24.avgStay} Nächte`)
    rows += tableRow('Auslastung', `${beds24.occupancyRate}%`)
    rows += tableRow('Beliebtestes Zimmer', beds24.topRoom)
    rows += tableRow('Top Buchungskanal', beds24.topChannel)
    rows += tableRow('Top Herkunftsland', beds24.topCountry)

    if (Object.keys(beds24.byRoom).length > 0) {
      rows += '<tr><td colspan="2" style="padding-top:12px;font-weight:600;color:#4a6741;">Nach Zimmer:</td></tr>'
      for (const [room, count] of Object.entries(beds24.byRoom).sort((a, b) => b[1] - a[1])) {
        rows += tableRow(`  ${room}`, count)
      }
    }

    bookingsHtml = section('Buchungen & Umsatz', `<table style="width:100%;">${rows}</table>`)
  }

  // Website section
  let websiteHtml = ''
  if (ga4) {
    let rows = ''
    rows += tableRow('Sessions', ga4.sessions)
    rows += tableRow('Nutzer', ga4.users)
    rows += tableRow('Seitenaufrufe', ga4.pageviews)
    rows += tableRow('Absprungrate', `${ga4.bounceRate}%`)
    rows += tableRow('Ø Sitzungsdauer', `${ga4.avgSessionDuration}s`)

    if (ga4.topPages.length > 0) {
      rows += '<tr><td colspan="2" style="padding-top:12px;font-weight:600;color:#4a6741;">Top Seiten:</td></tr>'
      for (const p of ga4.topPages.slice(0, 5)) {
        rows += tableRow(`  ${p.page}`, `${p.views} Aufrufe`)
      }
    }

    if (ga4.sources.length > 0) {
      rows += '<tr><td colspan="2" style="padding-top:12px;font-weight:600;color:#4a6741;">Traffic-Quellen:</td></tr>'
      for (const s of ga4.sources.slice(0, 5)) {
        rows += tableRow(`  ${s.source}`, `${s.sessions} Sessions`)
      }
    }

    websiteHtml = section('Website-Traffic', `<table style="width:100%;">${rows}</table>`)
  }

  // Inquiries section
  let inquiriesHtml = ''
  if (inquiries && inquiries.total > 0) {
    let rows = tableRow('Gesamt', inquiries.total)
    for (const [type, count] of Object.entries(inquiries.byType)) {
      rows += tableRow(`  ${type}`, count)
    }
    inquiriesHtml = section('Kontaktanfragen', `<table style="width:100%;">${rows}</table>`)
  }

  const dashboardLink = LOOKER_STUDIO_URL
    ? `<p style="text-align:center;margin-top:24px;">
        <a href="${LOOKER_STUDIO_URL}" style="display:inline-block;padding:12px 24px;background:#c9a84c;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
          Dashboard öffnen
        </a>
      </p>`
    : ''

  return `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#333;">
  <div style="text-align:center;padding:24px 0;border-bottom:3px solid #c9a84c;">
    <h1 style="font-size:24px;color:#2d3b28;margin:0;">Pension Volgenandt</h1>
    <p style="color:#6b7c68;margin:8px 0 0;">Monatsbericht ${monthLabel}</p>
  </div>

  ${kpis}
  ${bookingsHtml}
  ${websiteHtml}
  ${inquiriesHtml}
  ${dashboardLink}

  <p style="text-align:center;color:#999;font-size:12px;margin-top:32px;border-top:1px solid #eee;padding-top:16px;">
    Automatisch erstellt am ${new Date().toLocaleDateString('de-DE')}
  </p>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// 6. Send Email
// ---------------------------------------------------------------------------
async function sendEmail(html) {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn('SMTP credentials not set, skipping email')
    console.log('Email HTML preview saved (would have been sent)')
    return
  }

  const transporter = createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT),
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    tls: { rejectUnauthorized: false },
  })

  const recipients = REPORT_RECIPIENTS.split(',').map((e) => e.trim())

  await transporter.sendMail({
    from: `"Pension Volgenandt" <${SMTP_USER}>`,
    to: recipients.join(', '),
    subject: `Monatsbericht ${monthLabel} – Pension Volgenandt`,
    html,
  })

  console.log(`Email sent to: ${recipients.join(', ')}`)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('Starting monthly statistics collection...\n')

  const [beds24, ga4, inquiries] = await Promise.all([
    collectBeds24Data().catch((e) => { console.error('Beds24 error:', e.message); return null }),
    collectGA4Data().catch((e) => { console.error('GA4 error:', e.message); return null }),
    collectInquiryData().catch((e) => { console.error('Inquiry error:', e.message); return null }),
  ])

  console.log('\n--- Results ---')
  if (beds24) console.log(`Beds24: ${beds24.confirmedBookings} bookings, ${beds24.totalRevenue}€ revenue, ${beds24.occupancyRate}% occupancy`)
  if (ga4) console.log(`GA4: ${ga4.sessions} sessions, ${ga4.users} users, ${ga4.pageviews} pageviews`)
  if (inquiries) console.log(`Inquiries: ${inquiries.total} total`)

  // Push to Google Sheet
  await pushToGoogleSheet(beds24, ga4, inquiries).catch((e) => {
    console.error('Google Sheets error:', e.message)
  })

  // Build and send email
  const html = buildEmailHtml(beds24, ga4, inquiries)
  await sendEmail(html).catch((e) => {
    console.error('Email error:', e.message)
  })

  console.log('\nDone!')
}

main().catch((e) => {
  console.error('Fatal error:', e)
  process.exit(1)
})
