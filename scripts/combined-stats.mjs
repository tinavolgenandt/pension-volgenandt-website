#!/usr/bin/env node
/**
 * Combined weekly + month-to-date statistics for Pension Volgenandt.
 * Runs every Friday at 07:00 UTC via GitHub Actions.
 * Replaces weekly-stats.mjs (weekly email) and collect-stats.mjs (monthly email).
 *
 * Email sections:
 *   1. Diese Woche  — new bookings, picknick, website sessions, next-week arrivals
 *   2. [Month] bisher — MTD occupancy, revenue, channel split, year-over-year
 *   3. Vorausschau  — remaining months of the current year
 */

import { google } from 'googleapis'
import { createTransport } from 'nodemailer'

// ---------------------------------------------------------------------------
// Config
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

// Weekly period: last 7 complete days (last Fri → yesterday/Thu)
const weekEnd = addDays(today, -1)
const weekStart = addDays(today, -7)
const prevWeekEnd = addDays(today, -8)
const prevWeekStart = addDays(today, -14)

// Next week: Mon → Sun
const dayOfWeek = today.getDay() // 0=Sun … 6=Sat
const daysUntilNextMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 7 : 8 - dayOfWeek
const nextWeekStart = addDays(today, daysUntilNextMonday)
const nextWeekEnd = addDays(nextWeekStart, 6)

// Month-to-date: 1st of current month → yesterday
// If today is the 1st, yesterday belongs to last month — show that full month instead.
const nowYear = today.getFullYear()
const nowMonth = today.getMonth() + 1 // 1-indexed
const firstOfThisMonth = new Date(nowYear, nowMonth - 1, 1)

let mtdYear, mtdMonth, mtdStart, mtdEnd
if (weekEnd < firstOfThisMonth) {
  // Today is the 1st: show the completed previous month
  mtdMonth = nowMonth === 1 ? 12 : nowMonth - 1
  mtdYear = nowMonth === 1 ? nowYear - 1 : nowYear
  const daysInPrev = new Date(mtdYear, mtdMonth, 0).getDate()
  mtdStart = new Date(mtdYear, mtdMonth - 1, 1)
  mtdEnd = new Date(mtdYear, mtdMonth - 1, daysInPrev)
} else {
  mtdYear = nowYear
  mtdMonth = nowMonth
  mtdStart = firstOfThisMonth
  mtdEnd = weekEnd // yesterday
}

// Same period last year for year-over-year comparison
const prevMtdStart = new Date(mtdYear - 1, mtdMonth - 1, 1)
const prevMtdEnd = new Date(mtdYear - 1, mtdMonth - 1, mtdEnd.getDate())

const MONTH_NAMES_DE = [
  '',
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
]

const monthLabel = `${MONTH_NAMES_DE[mtdMonth]} ${mtdYear}`
const fmt = (d) => d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
const weekLabel = `${fmt(weekStart)} – ${fmt(weekEnd)}`

console.log(`Combined report: week ${weekLabel}`)
console.log(`MTD: ${toIsoDate(mtdStart)} – ${toIsoDate(mtdEnd)} (${monthLabel})`)

// Room config
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

// Same detection Beds24 invoice items use for the "Frühstück" line item (see server/invoice-draft.php)
function isBreakfastItem(desc) {
  const lower = (desc || '').toLowerCase()
  return lower.includes('frühstück') || lower.includes('fruehstueck') || lower.includes('breakfast')
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

// Weekly: bookings CREATED within [rangeStart, rangeEnd], filtered client-side by bookingTime
async function getNewBookings(token, rangeStart, rangeEnd) {
  const broadFrom = toIsoDate(addDays(rangeStart, -365))
  const broadTo = toIsoDate(addDays(rangeEnd, 730))
  const all = await fetchBeds24(token, {
    arrivalFrom: broadFrom,
    arrivalTo: broadTo,
    departureFrom: broadFrom,
  })
  const startMs = rangeStart.getTime()
  const endMs = rangeEnd.getTime() + 86400000

  let confirmed = 0
  let revenue = 0
  let zeroPriceCount = 0
  const byChannel = {}

  for (const b of all) {
    if (!b.bookingTime) continue
    const bt = new Date(b.bookingTime.replace(' ', 'T')).getTime()
    if (bt < startMs || bt >= endMs) continue
    const isCancelled =
      (b.cancelTime && b.cancelTime !== 0 && b.cancelTime !== '0') ||
      (typeof b.status === 'string' && b.status.toLowerCase().includes('cancel'))
    if (isCancelled) continue
    confirmed++
    const ch = mapChannel(b.apiSource)
    byChannel[ch] = (byChannel[ch] || 0) + 1
    const price = parseFloat(b.price) || 0
    if (price === 0) {
      zeroPriceCount++
      console.warn(`New booking with €0 price: ID=${b.id}, arrival=${b.arrival}, room=${b.roomId}`)
    }
    revenue += price
  }

  return { confirmed, revenue, zeroPriceCount, byChannel }
}

// Confirmed arrivals in [rangeStart, rangeEnd]
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

// Aggregate stays overlapping [rangeStart, rangeEnd] (ISO date strings)
function aggregateBookings(bookings, rangeStart, rangeEnd) {
  const rsMs = new Date(`${rangeStart}T00:00:00`).getTime()
  const reMs = new Date(`${rangeEnd}T00:00:00`).getTime() + 86400000

  let totalBookings = 0
  let cancellations = 0
  let totalRevenue = 0
  let totalNightsInRange = 0
  let zeroPriceBookings = 0
  const byRoom = {}
  const byChannel = { Direkt: 0, 'Booking.com': 0, Website: 0, Airbnb: 0 }

  for (const b of bookings) {
    totalBookings++
    const isCancelled =
      b._forceCancelled ||
      (b.cancelTime && b.cancelTime !== 0 && b.cancelTime !== '0') ||
      (typeof b.status === 'string' && b.status.toLowerCase().includes('cancel'))
    if (isCancelled) {
      cancellations++
      continue
    }

    const arrival = new Date(b.arrival).getTime()
    const departure = new Date(b.departure).getTime()
    const totalNights = Math.max(1, Math.round((departure - arrival) / 86400000))
    const clampedStart = Math.max(arrival, rsMs)
    const clampedEnd = Math.min(departure, reMs)
    const nightsInRange = Math.max(0, Math.round((clampedEnd - clampedStart) / 86400000))
    totalNightsInRange += nightsInRange

    const fullPrice = parseFloat(b.price) || 0
    if (fullPrice === 0) {
      zeroPriceBookings++
      console.warn(
        `Booking with €0 price: ID=${b.id}, arrival=${b.arrival}, room=${ROOM_NAMES[String(b.roomId)] || b.roomId}`,
      )
    }
    totalRevenue += (nightsInRange / totalNights) * fullPrice

    const roomName = ROOM_NAMES[String(b.roomId)] || 'Unbekannt'
    byRoom[roomName] = (byRoom[roomName] || 0) + 1

    const ch = mapChannel(b.apiSource)
    if (ch in byChannel) byChannel[ch]++
    else byChannel['Direkt']++
  }

  const confirmed = totalBookings - cancellations
  const daysInRange = Math.round((reMs - rsMs) / 86400000)
  const totalAvailable = TOTAL_UNITS * daysInRange
  const occupancyRate =
    totalAvailable > 0 ? ((totalNightsInRange / totalAvailable) * 100).toFixed(1) : '0'
  const avgStay = confirmed > 0 ? (totalNightsInRange / confirmed).toFixed(1) : '0'
  const cancellationRate =
    totalBookings > 0 ? ((cancellations / totalBookings) * 100).toFixed(1) : '0'
  const topRoom = Object.entries(byRoom).sort((a, b) => b[1] - a[1])[0]

  return {
    confirmedBookings: confirmed,
    cancellations,
    cancellationRate,
    totalRevenue: totalRevenue.toFixed(2),
    totalNightsInRange,
    avgStay,
    occupancyRate,
    zeroPriceBookings,
    byRoom,
    byChannel,
    topRoom: topRoom ? topRoom[0] : '–',
  }
}

// Month-to-date: fetches stays overlapping [startDate, endDate] (ISO strings)
async function collectMTD(token, startDate, endDate) {
  const [active, cancelled] = await Promise.all([
    fetchBeds24(token, { arrivalTo: endDate, departureFrom: startDate }).catch(() => []),
    fetchBeds24(token, {
      arrivalTo: endDate,
      departureFrom: startDate,
      status: 'cancelled',
    }).catch(() => []),
  ])
  const all = [
    ...(active ?? []),
    ...(cancelled ?? []).map((b) => ({ ...b, _forceCancelled: true })),
  ]
  return aggregateBookings(all, startDate, endDate)
}

// Outlook: remaining months of current calendar year
async function collectOutlook(token) {
  const futureMths = []
  for (let m = mtdMonth + 1; m <= 12; m++) futureMths.push({ year: mtdYear, month: m })
  if (futureMths.length === 0) return []

  return Promise.all(
    futureMths.map(async ({ year: y, month: m }) => {
      const days = new Date(y, m, 0).getDate()
      const from = `${y}-${String(m).padStart(2, '0')}-01`
      const to = `${y}-${String(m).padStart(2, '0')}-${String(days).padStart(2, '0')}`
      const bookings = await fetchBeds24(token, { arrivalTo: to, departureFrom: from }).catch(
        () => [],
      )
      const agg = aggregateBookings(bookings, from, to)
      return {
        monthLabel: `${MONTH_NAMES_DE[m]} ${y}`,
        confirmedBookings: agg.confirmedBookings,
        totalNights: agg.totalNightsInRange,
        occupancyRate: agg.occupancyRate,
      }
    }),
  )
}

// Last 12 calendar months, oldest → newest, including the current (partial) month.
// e.g. run in July 2026 → ['2025-08', ..., '2026-07']
function last12MonthKeys() {
  const keys = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(mtdYear, mtdMonth - 1 - i, 1)
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  return keys
}

// Revenue development of the last 12 months: monthly totals, per-room totals,
// and the breakfast share (from Beds24 invoice items, same detection as
// server/invoice-draft.php's isBreakfastItem()).
async function collectRevenueHistory(token) {
  const monthKeys = last12MonthKeys()
  if (!token)
    return { monthKeys, monthlyRevenue: {}, roomRevenue: {}, totalRevenue: 0, breakfastRevenue: 0 }

  const oldestKey = monthKeys[0]
  const [oldestYear, oldestMonth] = oldestKey.split('-').map(Number)
  const historyStart = toIsoDate(new Date(oldestYear, oldestMonth - 1, 1))
  const historyEnd = toIsoDate(today)

  const [active, cancelled] = await Promise.all([
    fetchBeds24(token, {
      arrivalFrom: historyStart,
      arrivalTo: historyEnd,
      departureFrom: historyStart,
      includeInvoice: 'true',
    }).catch(() => []),
    fetchBeds24(token, {
      arrivalFrom: historyStart,
      arrivalTo: historyEnd,
      departureFrom: historyStart,
      includeInvoice: 'true',
      status: 'cancelled',
    }).catch(() => []),
  ])
  const cancelledIds = new Set((cancelled ?? []).map((b) => b.id))

  const monthlyRevenue = Object.fromEntries(monthKeys.map((k) => [k, 0]))
  const roomRevenue = Object.fromEntries(Object.values(ROOM_NAMES).map((n) => [n, 0]))
  let totalRevenue = 0
  let breakfastRevenue = 0

  for (const b of active ?? []) {
    const isCancelled =
      cancelledIds.has(b.id) ||
      (b.cancelTime && b.cancelTime !== 0 && b.cancelTime !== '0') ||
      (typeof b.status === 'string' && b.status.toLowerCase().includes('cancel'))
    if (isCancelled) continue

    const arrival = new Date(b.arrival)
    const monthKey = `${arrival.getFullYear()}-${String(arrival.getMonth() + 1).padStart(2, '0')}`
    if (!(monthKey in monthlyRevenue)) continue // outside the 12-month window

    const price = parseFloat(b.price) || 0
    monthlyRevenue[monthKey] += price
    totalRevenue += price

    const roomName = ROOM_NAMES[String(b.roomId)] || 'Unbekannt'
    roomRevenue[roomName] = (roomRevenue[roomName] || 0) + price

    const invoiceItems = b.invoice?.items ?? b.invoiceItems ?? []
    for (const item of invoiceItems) {
      const desc = item.description ?? item.desc ?? ''
      if (!isBreakfastItem(desc)) continue
      const unit = parseFloat(item.amount ?? item.unitPrice ?? 0) || 0
      const qty = parseFloat(item.qty ?? item.quantity ?? 1) || 1
      breakfastRevenue += unit * qty
    }
  }

  return { monthKeys, monthlyRevenue, roomRevenue, totalRevenue, breakfastRevenue }
}

// Confirmed reservations without a price (price = 0 or missing) — for manual
// follow-up in Beds24. Scans the same 12-month lookback plus the next 180
// days of upcoming arrivals, so both stale past bookings and new/unpriced
// upcoming ones surface.
async function collectZeroPriceBookings(token) {
  if (!token) return []

  const monthKeys = last12MonthKeys()
  const [oldestYear, oldestMonth] = monthKeys[0].split('-').map(Number)
  const rangeFrom = toIsoDate(new Date(oldestYear, oldestMonth - 1, 1))
  const rangeTo = toIsoDate(addDays(today, 180))

  const all = await fetchBeds24(token, {
    arrivalFrom: rangeFrom,
    arrivalTo: rangeTo,
    departureFrom: rangeFrom,
  }).catch(() => [])

  const zeroPriced = all.filter((b) => {
    const isCancelled =
      (b.cancelTime && b.cancelTime !== 0 && b.cancelTime !== '0') ||
      (typeof b.status === 'string' && b.status.toLowerCase().includes('cancel'))
    if (isCancelled) return false
    const price = parseFloat(b.price)
    return isNaN(price) || price === 0
  })

  return zeroPriced
    .map((b) => ({
      id: b.id,
      arrival: b.arrival?.slice(0, 10) ?? '?',
      departure: b.departure?.slice(0, 10) ?? '?',
      roomName: ROOM_NAMES[String(b.roomId)] || `Zimmer ${b.roomId}`,
      guestName: [b.firstName, b.lastName].filter(Boolean).join(' ').trim() || 'Unbekannt',
    }))
    .sort((a, b) => a.arrival.localeCompare(b.arrival))
}

// ---------------------------------------------------------------------------
// GA4 — weekly sessions + MTD sessions + picknick (this week)
// ---------------------------------------------------------------------------
async function getGA4Data() {
  if (!GA4_PROPERTY_ID || !GOOGLE_SERVICE_ACCOUNT_KEY) {
    console.warn('GA4 credentials not set, skipping GA4')
    return null
  }

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

  const run = (requestBody) =>
    analyticsData.properties
      .runReport({ property: `properties/${GA4_PROPERTY_ID}`, requestBody })
      .catch(() => ({ data: { rows: [] } }))

  const [
    weekThisRes,
    weekPrevRes,
    mtdRes,
    mtdPrevRes,
    picknickRes,
    picknickPrevRes,
    qrThisRes,
    qrPrevRes,
  ] = await Promise.all([
    // Weekly sessions (this week)
    run({
      dateRanges: [{ startDate: toIsoDate(weekStart), endDate: toIsoDate(weekEnd) }],
      metrics: [{ name: 'sessions' }],
    }),
    // Weekly sessions (previous week, for trend)
    run({
      dateRanges: [{ startDate: toIsoDate(prevWeekStart), endDate: toIsoDate(prevWeekEnd) }],
      metrics: [{ name: 'sessions' }],
    }),
    // MTD sessions + pageviews
    run({
      dateRanges: [{ startDate: toIsoDate(mtdStart), endDate: toIsoDate(mtdEnd) }],
      metrics: [{ name: 'sessions' }, { name: 'screenPageViews' }],
    }),
    // MTD sessions same period last year
    run({
      dateRanges: [{ startDate: toIsoDate(prevMtdStart), endDate: toIsoDate(prevMtdEnd) }],
      metrics: [{ name: 'sessions' }],
    }),
    // Picknick pages this week (landing + danke)
    run({
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
    }),
    // Picknick pages previous week (for trend)
    run({
      dateRanges: [{ startDate: toIsoDate(prevWeekStart), endDate: toIsoDate(prevWeekEnd) }],
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
    }),
    // QR code scans this week (utm_medium=print)
    run({
      dateRanges: [{ startDate: toIsoDate(weekStart), endDate: toIsoDate(weekEnd) }],
      metrics: [{ name: 'sessions' }],
      dimensionFilter: {
        filter: {
          fieldName: 'sessionMedium',
          stringFilter: { matchType: 'EXACT', value: 'print' },
        },
      },
    }),
    // QR code scans previous week
    run({
      dateRanges: [{ startDate: toIsoDate(prevWeekStart), endDate: toIsoDate(prevWeekEnd) }],
      metrics: [{ name: 'sessions' }],
      dimensionFilter: {
        filter: {
          fieldName: 'sessionMedium',
          stringFilter: { matchType: 'EXACT', value: 'print' },
        },
      },
    }),
  ])

  const sessionsThis = parseInt(weekThisRes.data.rows?.[0]?.metricValues?.[0]?.value ?? '0')
  const sessionsPrev = parseInt(weekPrevRes.data.rows?.[0]?.metricValues?.[0]?.value ?? '0')
  const mtdSessions = parseInt(mtdRes.data.rows?.[0]?.metricValues?.[0]?.value ?? '0')
  const mtdPageviews = parseInt(mtdRes.data.rows?.[0]?.metricValues?.[1]?.value ?? '0')
  const mtdSessionsPY = parseInt(mtdPrevRes.data.rows?.[0]?.metricValues?.[0]?.value ?? '0')

  let picknickLanding = 0
  let picknickDanke = 0
  for (const r of picknickRes.data.rows || []) {
    const path = r.dimensionValues[0].value
    const views = parseInt(r.metricValues[0].value)
    if (path.includes('/danke') || path.includes('/thanks')) picknickDanke += views
    else picknickLanding += views
  }

  let picknickLandingPrev = 0
  let picknickDankePrev = 0
  for (const r of picknickPrevRes.data.rows || []) {
    const path = r.dimensionValues[0].value
    const views = parseInt(r.metricValues[0].value)
    if (path.includes('/danke') || path.includes('/thanks')) picknickDankePrev += views
    else picknickLandingPrev += views
  }

  const qrScansThis = parseInt(qrThisRes.data.rows?.[0]?.metricValues?.[0]?.value ?? '0')
  const qrScansPrev = parseInt(qrPrevRes.data.rows?.[0]?.metricValues?.[0]?.value ?? '0')

  return {
    sessionsThis,
    sessionsPrev,
    mtdSessions,
    mtdPageviews,
    mtdSessionsPY,
    picknickLanding,
    picknickDanke,
    picknickLandingPrev,
    picknickDankePrev,
    qrScansThis,
    qrScansPrev,
  }
}

// ---------------------------------------------------------------------------
// Email HTML
// ---------------------------------------------------------------------------
const fmtEur = (n) =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n)

const MONTH_ABBR_DE = MONTH_NAMES_DE.map((m) => m.slice(0, 3))

// Inline HTML/CSS horizontal bar chart — no external chart service, no JS,
// renders reliably in email clients (Gmail, Outlook, Apple Mail, ...).
function buildRevenueHistorySection(revHistory) {
  const { monthKeys, monthlyRevenue, roomRevenue, totalRevenue, breakfastRevenue } = revHistory
  if (totalRevenue <= 0) return ''

  const maxMonthly = Math.max(...monthKeys.map((k) => monthlyRevenue[k] ?? 0), 1)

  const chartRows = monthKeys
    .map((k) => {
      const [y, m] = k.split('-').map(Number)
      const label = `${MONTH_ABBR_DE[m]} ${String(y).slice(2)}`
      const value = monthlyRevenue[k] ?? 0
      const widthPct = Math.max(2, Math.round((value / maxMonthly) * 100))
      return `
        <tr>
          <td style="padding:3px 8px 3px 0;font-size:11px;color:#666;white-space:nowrap;width:46px;">${label}</td>
          <td style="padding:3px 0;">
            <div style="background:#e5e0d5;border-radius:3px;">
              <div style="background:#3d5a3e;border-radius:3px;width:${widthPct}%;height:14px;"></div>
            </div>
          </td>
          <td style="padding:3px 0 3px 8px;font-size:11px;color:#2d3b28;font-weight:600;text-align:right;white-space:nowrap;width:64px;">${fmtEur(value)}</td>
        </tr>`
    })
    .join('')

  const roomRows = Object.entries(roomRevenue)
    .sort((a, b) => b[1] - a[1])
    .map(
      ([room, revenue]) => `
      <tr>
        <td style="padding:4px 0;color:#4a4a4a;font-size:13px;">${room}</td>
        <td style="padding:4px 0;text-align:right;font-weight:600;color:#2d3b28;font-size:13px;">${fmtEur(revenue)}</td>
      </tr>`,
    )
    .join('')

  const breakfastPct = totalRevenue > 0 ? ((breakfastRevenue / totalRevenue) * 100).toFixed(1) : '0'

  return `
    <tr><td style="padding:0 24px 4px;">
      <h2 style="font-size:15px;color:#2d3b28;border-bottom:2px solid #c9a84c;padding-bottom:5px;margin:0 0 12px;">Erlösentwicklung (letzte 12 Monate)</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">${chartRows}</table>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td colspan="2" style="padding-bottom:4px;font-weight:600;color:#3d5a3e;font-size:12px;">Nach Zimmer:</td></tr>
        ${roomRows}
        <tr><td colspan="2" style="padding-top:6px;border-top:1px solid #f0ede6;"></td></tr>
        <tr>
          <td style="padding:5px 0;font-weight:700;color:#2d3b28;font-size:13px;">Gesamt</td>
          <td style="padding:5px 0;text-align:right;font-weight:700;color:#2d3b28;font-size:13px;">${fmtEur(totalRevenue)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0 0;color:#888;font-size:12px;">davon Frühstück</td>
          <td style="padding:8px 0 0;text-align:right;color:#888;font-size:12px;">${fmtEur(breakfastRevenue)} (${breakfastPct}%)</td>
        </tr>
      </table>
    </td></tr>`
}

// Confirmed reservations without a price — flagged for manual follow-up in Beds24.
function buildZeroPriceSection(zeroPriceBookings) {
  if (!zeroPriceBookings || zeroPriceBookings.length === 0) return ''

  const MAX_ROWS = 15
  const shown = zeroPriceBookings.slice(0, MAX_ROWS)
  const overflow = zeroPriceBookings.length - shown.length

  const rows = shown
    .map(
      (b) => `
      <tr>
        <td style="padding:4px 6px;font-size:12px;color:#4a4a4a;">${b.id}</td>
        <td style="padding:4px 6px;font-size:12px;color:#4a4a4a;">${b.arrival} – ${b.departure}</td>
        <td style="padding:4px 6px;font-size:12px;color:#4a4a4a;">${b.roomName}</td>
        <td style="padding:4px 6px;font-size:12px;color:#4a4a4a;">${b.guestName}</td>
      </tr>`,
    )
    .join('')

  const overflowRow =
    overflow > 0
      ? `<tr><td colspan="4" style="padding:4px 6px;font-size:11px;color:#888;font-style:italic;">+ ${overflow} weitere — vollständige Liste in Beds24</td></tr>`
      : ''

  return `
    <tr><td style="padding:0 24px 4px;">
      <h2 style="font-size:15px;color:#2d3b28;border-bottom:2px solid #c9a84c;padding-bottom:5px;margin:0 0 12px;">&#x26A0;&#xFE0F; Reservierungen ohne Preisangabe</h2>
      <p style="margin:0 0 8px;font-size:12px;color:#888;">Zur Nachverfolgung — bitte Preis in Beds24 prüfen und nachtragen.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr style="background:#f8f7f4;">
          <th style="padding:5px 6px;text-align:left;font-size:11px;color:#888;font-weight:600;">ID</th>
          <th style="padding:5px 6px;text-align:left;font-size:11px;color:#888;font-weight:600;">Zeitraum</th>
          <th style="padding:5px 6px;text-align:left;font-size:11px;color:#888;font-weight:600;">Zimmer</th>
          <th style="padding:5px 6px;text-align:left;font-size:11px;color:#888;font-weight:600;">Gast</th>
        </tr>
        ${rows}
        ${overflowRow}
      </table>
    </td></tr>`
}

function buildEmail({
  bookings,
  nextArrivals,
  mtd,
  prevMtd,
  outlook,
  ga4,
  revHistory,
  zeroPriceBookings,
}) {
  const trendBadge = (curr, prev) => {
    if (!prev || prev === 0 || curr == null) return ''
    const pct = ((curr - prev) / prev) * 100
    const sign = pct >= 0 ? '+' : ''
    const color = pct >= 0 ? '#3d5a3e' : '#c0392b'
    const arrow = pct >= 0 ? '↑' : '↓'
    return ` <span style="color:${color};font-weight:700;font-size:11px;">${arrow} ${sign}${pct.toFixed(0)}%</span>`
  }

  // Weekly KPI cards
  const card = (icon, value, label, sub = '') => `
    <td style="width:50%;padding:6px;">
      <div style="background:#f7f5f0;border-radius:8px;padding:18px 14px;text-align:center;">
        <div style="font-size:26px;line-height:1.2;">${icon}</div>
        <div style="font-size:30px;font-weight:700;color:#3d5a3e;margin:6px 0 2px;line-height:1;">${value}</div>
        <div style="font-size:13px;font-weight:600;color:#555;line-height:1.3;">${label}</div>
        ${sub ? `<div style="font-size:12px;color:#888;margin-top:5px;line-height:1.4;">${sub}</div>` : ''}
      </div>
    </td>`

  const sessionsDiff = ga4 ? ga4.sessionsThis - ga4.sessionsPrev : 0
  const trendSign = sessionsDiff >= 0 ? '↑' : '↓'
  const trendColor = sessionsDiff >= 0 ? '#3d5a3e' : '#c0392b'
  const sessionsTrend = ga4
    ? `<span style="color:${trendColor};font-weight:700;">${trendSign} ${Math.abs(sessionsDiff)}</span> vs. Vorwoche`
    : '&nbsp;'

  const picknickDankeBadge = ga4 ? trendBadge(ga4.picknickDanke, ga4.picknickDankePrev) : ''
  const picknickLandingBadge = ga4 ? trendBadge(ga4.picknickLanding, ga4.picknickLandingPrev) : ''
  const picknickSub =
    ga4 && (ga4.picknickLanding > 0 || ga4.picknickLandingPrev > 0)
      ? `${ga4.picknickLanding} Besuche${picknickLandingBadge}`
      : ''

  const newBookingsSub =
    bookings.confirmed > 0
      ? fmtEur(bookings.revenue) +
        ' Gesamtwert' +
        (bookings.zeroPriceCount > 0 ? ` · ${bookings.zeroPriceCount} ohne Preis` : '')
      : '&nbsp;'

  const weeklyCards = `
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        ${card('🏠', bookings.confirmed, 'Neue Buchungen', newBookingsSub)}
        ${card('🧺', `${ga4?.picknickDanke ?? '–'}${picknickDankeBadge}`, 'Picknick-Buchungen', picknickSub)}
      </tr>
      <tr>
        ${card('🌐', ga4?.sessionsThis ?? '–', 'Website-Besucher', sessionsTrend)}
        ${card(
          '📅',
          nextArrivals,
          'Ankünfte nächste Woche',
          'Mo ' + fmt(nextWeekStart) + ' – So ' + fmt(nextWeekEnd),
        )}
      </tr>
    </table>`

  // Weekly channel breakdown (only shown when there were bookings)
  let channelHtml = ''
  if (bookings.confirmed > 0) {
    const rows = Object.entries(bookings.byChannel)
      .sort((a, b) => b[1] - a[1])
      .map(
        ([ch, n]) => `
        <tr>
          <td style="padding:4px 0;color:#666;font-size:13px;">${ch}</td>
          <td style="padding:4px 0;font-size:13px;font-weight:700;color:#3d5a3e;text-align:right;">${n}</td>
        </tr>`,
      )
      .join('')
    channelHtml = `
    <tr><td style="padding:0 24px 20px;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.8px;">Buchungsherkunft diese Woche</p>
      <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
    </td></tr>`
  }

  // QR code scan row (only shown when either week had scans)
  let qrHtml = ''
  if (ga4 && (ga4.qrScansThis > 0 || ga4.qrScansPrev > 0)) {
    const qrBadge = trendBadge(ga4.qrScansThis, ga4.qrScansPrev)
    qrHtml = `
    <tr><td style="padding:0 24px 20px;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.8px;">QR-Code Scans (Druckmaterial)</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:4px 0;color:#666;font-size:13px;">Scans diese Woche</td>
          <td style="padding:4px 0;font-size:13px;font-weight:700;color:#3d5a3e;text-align:right;">${ga4.qrScansThis}${qrBadge}</td>
        </tr>
      </table>
    </td></tr>`
  }

  // MTD section
  const tblRow = (label, value, sub = '') => `
    <tr>
      <td style="padding:5px 0;color:#4a4a4a;font-size:13px;">${label}</td>
      <td style="padding:5px 0;text-align:right;font-weight:600;color:#2d3b28;font-size:13px;">${value}${sub ? ` <span style="font-weight:400;color:#888;font-size:11px;">${sub}</span>` : ''}</td>
    </tr>`

  const prevYearAvailable = prevMtd != null && prevMtd.confirmedBookings >= 3
  const currRev = parseFloat(mtd.totalRevenue)
  const prevRev = prevYearAvailable ? parseFloat(prevMtd.totalRevenue) : null
  const currOcc = parseFloat(mtd.occupancyRate)
  const prevOcc = prevYearAvailable ? parseFloat(prevMtd.occupancyRate) : null

  let mtdRows = ''
  mtdRows += tblRow(
    'Bestätigte Buchungen',
    mtd.confirmedBookings,
    prevYearAvailable
      ? `VJ: ${prevMtd.confirmedBookings}${trendBadge(mtd.confirmedBookings, prevMtd.confirmedBookings)}`
      : '',
  )
  mtdRows += tblRow(
    'Nächte im Haus',
    mtd.totalNightsInRange,
    prevYearAvailable
      ? `VJ: ${prevMtd.totalNightsInRange}${trendBadge(mtd.totalNightsInRange, prevMtd.totalNightsInRange)}`
      : '',
  )
  mtdRows += tblRow(
    'Auslastung',
    `${mtd.occupancyRate}%`,
    prevOcc != null ? `VJ: ${prevOcc}%${trendBadge(currOcc, prevOcc)}` : '',
  )
  mtdRows += tblRow(
    'Umsatz',
    `${currRev.toLocaleString('de-DE', { minimumFractionDigits: 0 })} €`,
    prevRev != null
      ? `VJ: ${prevRev.toLocaleString('de-DE', { minimumFractionDigits: 0 })} €${trendBadge(currRev, prevRev)}`
      : '',
  )
  if (mtd.zeroPriceBookings > 0) {
    mtdRows += tblRow(
      '&#x26A0;&#xFE0F; Buchungen ohne Preisangabe',
      mtd.zeroPriceBookings,
      'bitte in Beds24 prüfen',
    )
  }
  mtdRows += tblRow('Stornierungen', `${mtd.cancellations} (${mtd.cancellationRate}%)`)
  mtdRows += tblRow('Ø Aufenthalt', `${mtd.avgStay} Nächte`)
  mtdRows += tblRow('Beliebtestes Zimmer', mtd.topRoom)

  if (ga4?.mtdSessions) {
    mtdRows += tblRow(
      'Website-Sitzungen',
      ga4.mtdSessions,
      ga4.mtdSessionsPY
        ? `VJ: ${ga4.mtdSessionsPY}${trendBadge(ga4.mtdSessions, ga4.mtdSessionsPY)}`
        : '',
    )
  }

  // MTD channel split
  const chTotal = mtd.confirmedBookings || 1
  const hasChannels = Object.values(mtd.byChannel).some((n) => n > 0)
  if (hasChannels) {
    mtdRows += `<tr><td colspan="2" style="padding-top:10px;padding-bottom:2px;font-weight:600;color:#3d5a3e;font-size:12px;">Buchungskanäle:</td></tr>`
    for (const [name, count] of Object.entries(mtd.byChannel)) {
      if (count === 0) continue
      const pct = ((count / chTotal) * 100).toFixed(0)
      mtdRows += tblRow(`&nbsp;&nbsp;${name}`, `${count} (${pct}%)`)
    }
  }

  const mtdDayRange = `${fmt(mtdStart)} – ${fmt(mtdEnd)}`
  const mtdHtml = `
    <tr><td style="padding:0 24px 4px;">
      <h2 style="font-size:15px;color:#2d3b28;border-bottom:2px solid #c9a84c;padding-bottom:5px;margin:0 0 12px;">
        ${monthLabel} bisher
        <span style="font-size:11px;font-weight:400;color:#999;">(${mtdDayRange})</span>
      </h2>
      <table width="100%" cellpadding="0" cellspacing="0">${mtdRows}</table>
    </td></tr>`

  // Outlook table
  let outlookHtml = ''
  if (outlook && outlook.length > 0) {
    let rows = `
      <table style="width:100%;border-collapse:collapse;">
        <tr style="background:#2d3b28;color:#fff;">
          <th style="padding:7px 10px;text-align:left;font-size:12px;font-weight:600;">Monat</th>
          <th style="padding:7px 10px;text-align:center;font-size:12px;font-weight:600;">Buchungen</th>
          <th style="padding:7px 10px;text-align:center;font-size:12px;font-weight:600;">Nächte</th>
          <th style="padding:7px 10px;text-align:center;font-size:12px;font-weight:600;">Auslastung</th>
        </tr>`
    for (const [i, o] of outlook.entries()) {
      const bg = i % 2 === 0 ? '#f8f7f4' : '#fff'
      const occNum = parseFloat(o.occupancyRate)
      const occColor = occNum >= 70 ? '#3d5a3e' : occNum >= 40 ? '#c9a84c' : '#c0392b'
      rows += `
        <tr style="background:${bg};">
          <td style="padding:6px 10px;font-size:13px;font-weight:600;">${o.monthLabel}</td>
          <td style="padding:6px 10px;text-align:center;font-size:13px;">${o.confirmedBookings}</td>
          <td style="padding:6px 10px;text-align:center;font-size:13px;">${o.totalNights}</td>
          <td style="padding:6px 10px;text-align:center;font-size:13px;color:${occColor};font-weight:600;">${o.occupancyRate}%</td>
        </tr>`
    }
    rows += '</table>'
    outlookHtml = `
    <tr><td style="padding:0 24px 4px;">
      <h2 style="font-size:15px;color:#2d3b28;border-bottom:2px solid #c9a84c;padding-bottom:5px;margin:0 0 12px;">Vorausschau ${mtdYear}</h2>
      ${rows}
    </td></tr>`
  }

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#333;background:#f7f5f0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;padding:20px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;max-width:560px;">

  <!-- Header -->
  <tr><td style="background:#3d5a3e;padding:22px 28px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:19px;font-weight:700;letter-spacing:0.3px;">Wochenrückblick & Monatsstand</h1>
    <p style="margin:5px 0 0;color:#c8d8c0;font-size:12px;">${weekLabel} &nbsp;&middot;&nbsp; Pension Volgenandt</p>
  </td></tr>

  <!-- Diese Woche -->
  <tr><td style="padding:20px 24px 4px;">
    <h2 style="font-size:15px;color:#2d3b28;border-bottom:2px solid #c9a84c;padding-bottom:5px;margin:0 0 12px;">Diese Woche (${weekLabel})</h2>
    ${weeklyCards}
  </td></tr>

  ${channelHtml}

  ${qrHtml}

  <tr><td style="height:8px;"></td></tr>

  ${mtdHtml}

  <tr><td style="height:8px;"></td></tr>

  ${outlookHtml}

  <tr><td style="height:8px;"></td></tr>

  ${buildRevenueHistorySection(revHistory)}

  <tr><td style="height:8px;"></td></tr>

  ${buildZeroPriceSection(zeroPriceBookings)}

  <!-- Footer -->
  <tr><td style="padding:16px 28px;text-align:center;border-top:1px solid #f0ede6;">
    <p style="margin:0;font-size:11px;color:#bbb;">
      Automatischer Wochenbericht &middot; Pension Volgenandt &middot; ${new Date().toLocaleDateString('de-DE')}
    </p>
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
  console.log('Starting combined statistics collection...\n')

  const token = await getBeds24Token().catch((e) => {
    console.error('Beds24 auth error:', e.message)
    return null
  })

  const mtdStartStr = toIsoDate(mtdStart)
  const mtdEndStr = toIsoDate(mtdEnd)
  const prevMtdStartStr = toIsoDate(prevMtdStart)
  const prevMtdEndStr = toIsoDate(prevMtdEnd)

  const [bookings, nextArrivals, mtd, prevMtd, outlook, ga4, revHistory, zeroPriceBookings] =
    await Promise.all([
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

      token
        ? collectMTD(token, mtdStartStr, mtdEndStr).catch((e) => {
            console.error('Beds24 MTD error:', e.message)
            return null
          })
        : Promise.resolve(null),

      token
        ? collectMTD(token, prevMtdStartStr, prevMtdEndStr).catch(() => null)
        : Promise.resolve(null),

      token
        ? collectOutlook(token).catch((e) => {
            console.error('Beds24 outlook error:', e.message)
            return []
          })
        : Promise.resolve([]),

      getGA4Data().catch((e) => {
        console.error('GA4 error:', e.message)
        return null
      }),

      collectRevenueHistory(token).catch((e) => {
        console.error('Beds24 revenue history error:', e.message)
        return {
          monthKeys: last12MonthKeys(),
          monthlyRevenue: {},
          roomRevenue: {},
          totalRevenue: 0,
          breakfastRevenue: 0,
        }
      }),

      collectZeroPriceBookings(token).catch((e) => {
        console.error('Beds24 zero-price bookings error:', e.message)
        return []
      }),
    ])

  console.log(
    `Week: ${bookings.confirmed} new bookings (€${bookings.revenue.toFixed(0)}), ${nextArrivals} arrivals next week`,
  )
  if (mtd) {
    console.log(
      `MTD: ${mtd.confirmedBookings} bookings, ${mtd.totalNightsInRange} nights, ${mtd.occupancyRate}% occ, €${mtd.totalRevenue}`,
    )
  }
  if (outlook.length > 0) {
    console.log(
      `Outlook: ${outlook.length} months (${outlook[0].monthLabel} – ${outlook[outlook.length - 1].monthLabel})`,
    )
  }
  if (ga4) {
    console.log(
      `GA4: week=${ga4.sessionsThis} sessions (prev=${ga4.sessionsPrev}), MTD=${ga4.mtdSessions} sessions`,
    )
  }
  console.log(
    `Revenue history: €${revHistory.totalRevenue.toFixed(0)} total, €${revHistory.breakfastRevenue.toFixed(0)} breakfast`,
  )
  if (zeroPriceBookings.length > 0) {
    console.log(`Zero-price reservations flagged for follow-up: ${zeroPriceBookings.length}`)
  }

  // MTD can be null if Beds24 is unavailable — build email with what we have,
  // but guard against a null mtd crashing buildEmail
  const safeMtd = mtd ?? {
    confirmedBookings: 0,
    cancellations: 0,
    cancellationRate: '0',
    totalRevenue: '0',
    totalNightsInRange: 0,
    avgStay: '0',
    occupancyRate: '0',
    byRoom: {},
    byChannel: { Direkt: 0, 'Booking.com': 0, Website: 0, Airbnb: 0 },
    topRoom: '–',
  }

  const html = buildEmail({
    bookings,
    nextArrivals,
    mtd: safeMtd,
    prevMtd,
    outlook,
    ga4,
    revHistory,
    zeroPriceBookings,
  })

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
    subject: `Wochenrückblick ${weekLabel} – ${monthLabel} – Pension Volgenandt`,
    html,
  })

  console.log(`Combined report sent to: ${recipients.join(', ')}`)
}

main().catch((err) => {
  console.error('Combined stats failed:', err)
  process.exit(1)
})
