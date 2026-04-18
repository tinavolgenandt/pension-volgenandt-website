#!/usr/bin/env node
/**
 * Monthly statistics collection for Pension Volgenandt.
 *
 * Collects data from:
 *   1. Beds24 API v2 — stays overlapping the month (not just arrivals)
 *   2. Google Analytics 4 Data API — website traffic, Picknick, Paid Search
 *
 * Then:
 *   - Pushes aggregated data to Google Sheets (tab "Monatsdaten" + tab "Ausblick")
 *   - Sends a monthly HTML email summary
 *
 * Run via: node scripts/collect-stats.mjs
 * Triggered by: .github/workflows/monthly-stats.yml (1st of each month)
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
  GOOGLE_SHEETS_ID,
  SMTP_HOST = 'smtp.ionos.de',
  SMTP_PORT = '587',
  SMTP_USER,
  SMTP_PASS,
  REPORT_RECIPIENTS = 'kontakt@pension-volgenandt.de,tina.volgenandt@googlemail.com',
  LOOKER_STUDIO_URL = '',
} = process.env

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------
const now = new Date()
// Allow override via env for testing: REPORT_MONTH=4 REPORT_YEAR=2026
const year = process.env.REPORT_YEAR
  ? parseInt(process.env.REPORT_YEAR)
  : now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
const month = process.env.REPORT_MONTH
  ? parseInt(process.env.REPORT_MONTH)
  : now.getMonth() === 0 ? 12 : now.getMonth() // 1-indexed
const daysInMonth = new Date(year, month, 0).getDate()
const startDate = `${year}-${String(month).padStart(2, '0')}-01`
const endDate = `${year}-${String(month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`
const monthEndPlusOne = new Date(`${year}-${String(month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}T00:00:00`)
monthEndPlusOne.setDate(monthEndPlusOne.getDate() + 1)

const prevReportYear = year - 1
const prevStartDate = `${prevReportYear}-${String(month).padStart(2, '0')}-01`
const prevDaysInMonth = new Date(prevReportYear, month, 0).getDate()
const prevEndDate = `${prevReportYear}-${String(month).padStart(2, '0')}-${String(prevDaysInMonth).padStart(2, '0')}`

const MONTH_NAMES_DE = [
  '', 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
]
const monthLabel = `${MONTH_NAMES_DE[month]} ${year}`

console.log(`Collecting statistics for ${monthLabel} (${startDate} to ${endDate})`)

// Room units and occupancy base
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

/** Map apiSource to a readable channel category */
function mapChannel(apiSource) {
  if (!apiSource || apiSource === '' || apiSource === 'manual') return 'Manuell'
  if (apiSource.toLowerCase().includes('bookingcom') || apiSource === 'BookingCom') return 'Booking.com'
  if (apiSource.toLowerCase().includes('airbnb')) return 'Airbnb'
  if (apiSource === 'Beds24' || apiSource.toLowerCase().includes('beds24')) return 'Website'
  return apiSource
}

/**
 * Fetch Beds24 access token.
 * Returns token string or null on failure.
 */
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

/**
 * Fetch bookings from Beds24 that overlap a given date range.
 * Returns raw booking array or null.
 */
async function fetchBeds24Bookings(token, fromDate, toDate) {
  // arrivalTo + departureFrom = stays overlapping the date window
  const params = new URLSearchParams({
    propertyId: BEDS24_PROPERTY_ID,
    arrivalTo: toDate,
    departureFrom: fromDate,
    includeInvoice: 'true',
  })
  const res = await fetch(`https://api.beds24.com/v2/bookings?${params}`, {
    headers: { token },
  })
  const body = await res.json()
  const bookings = Array.isArray(body) ? body : body.data
  if (!Array.isArray(bookings)) {
    console.error('Beds24 unexpected response:', body)
    return null
  }
  return bookings
}

/**
 * Aggregate booking metrics for a set of raw Beds24 bookings overlapping a month.
 * Revenue is prorated to the nights that fall within [rangeStart, rangeEnd].
 */
function aggregateBookings(bookings, rangeStart, rangeEnd, totalUnits) {
  if (!bookings) return null

  const rangeStartMs = new Date(`${rangeStart}T00:00:00`).getTime()
  const rangeEndMs = new Date(`${rangeEnd}T00:00:00`).getTime() + 86400000 // exclusive next day

  let totalBookings = 0
  let cancellations = 0
  let totalRevenue = 0
  let totalNightsInRange = 0
  const byRoom = {}
  const byChannel = { Manuell: 0, 'Booking.com': 0, Website: 0, Airbnb: 0, Sonstige: 0 }

  for (const b of bookings) {
    totalBookings++
    if (b.cancelTime) { cancellations++; continue }

    const arrival = new Date(b.arrival).getTime()
    const departure = new Date(b.departure).getTime()
    const totalNights = Math.max(1, Math.round((departure - arrival) / 86400000))

    // Prorate: count only nights within the range
    const clampedStart = Math.max(arrival, rangeStartMs)
    const clampedEnd = Math.min(departure, rangeEndMs)
    const nightsInRange = Math.max(0, Math.round((clampedEnd - clampedStart) / 86400000))
    totalNightsInRange += nightsInRange

    // Prorated revenue
    const fullPrice = parseFloat(b.price) || 0
    totalRevenue += (nightsInRange / totalNights) * fullPrice

    // By room
    const roomName = ROOM_NAMES[String(b.roomId)] || 'Unbekannt'
    byRoom[roomName] = (byRoom[roomName] || 0) + 1

    // By channel
    const channel = mapChannel(b.apiSource)
    if (channel in byChannel) byChannel[channel]++
    else byChannel['Sonstige']++
  }

  const confirmedBookings = totalBookings - cancellations
  const daysInRange = Math.round((rangeEndMs - rangeStartMs) / 86400000)
  const totalAvailableNights = totalUnits * daysInRange
  const occupancyRate = totalAvailableNights > 0
    ? ((totalNightsInRange / totalAvailableNights) * 100).toFixed(1)
    : '0'
  const avgStay = confirmedBookings > 0
    ? (totalNightsInRange / confirmedBookings).toFixed(1)
    : '0'
  const cancellationRate = totalBookings > 0
    ? ((cancellations / totalBookings) * 100).toFixed(1)
    : '0'

  const topRoom = Object.entries(byRoom).sort((a, b) => b[1] - a[1])[0]

  return {
    totalBookings,
    confirmedBookings,
    cancellations,
    cancellationRate,
    totalRevenue: totalRevenue.toFixed(2),
    totalNightsInRange,
    avgStay,
    occupancyRate,
    byRoom,
    byChannel,
    topRoom: topRoom ? topRoom[0] : '–',
  }
}

// ---------------------------------------------------------------------------
// 1. Beds24 — current month
// ---------------------------------------------------------------------------
async function collectBeds24Current(token) {
  if (!token) return null
  const bookings = await fetchBeds24Bookings(token, startDate, endDate)
  return aggregateBookings(bookings, startDate, endDate, TOTAL_UNITS)
}

// ---------------------------------------------------------------------------
// 2. Beds24 — same month previous year
// ---------------------------------------------------------------------------
async function collectBeds24PreviousYear(token) {
  if (!token) return null
  const bookings = await fetchBeds24Bookings(token, prevStartDate, prevEndDate)
  // Gracefully return null if empty (Beds24 migration started mid-2025)
  if (!bookings || bookings.length === 0) return null
  return aggregateBookings(bookings, prevStartDate, prevEndDate, TOTAL_UNITS)
}

// ---------------------------------------------------------------------------
// 3. Beds24 — outlook: remaining months of current year
// ---------------------------------------------------------------------------
async function collectBeds24Outlook(token) {
  if (!token) return []

  const currentCalendarYear = now.getFullYear()

  // Collect future months from the month after the report month until December
  const futureMths = []
  for (let m = month + 1; m <= 12; m++) {
    futureMths.push({ year: currentCalendarYear, month: m })
  }
  // If report month is December, no outlook
  if (futureMths.length === 0) return []

  const results = await Promise.all(
    futureMths.map(async ({ year: y, month: m }) => {
      const days = new Date(y, m, 0).getDate()
      const from = `${y}-${String(m).padStart(2, '0')}-01`
      const to = `${y}-${String(m).padStart(2, '0')}-${String(days).padStart(2, '0')}`
      const bookings = await fetchBeds24Bookings(token, from, to).catch(() => null)
      const agg = aggregateBookings(bookings, from, to, TOTAL_UNITS)
      return {
        monthLabel: `${MONTH_NAMES_DE[m]} ${y}`,
        confirmedBookings: agg?.confirmedBookings ?? 0,
        totalNights: agg?.totalNightsInRange ?? 0,
        occupancyRate: agg?.occupancyRate ?? '0',
      }
    }),
  )
  return results
}

// ---------------------------------------------------------------------------
// 4. Google Analytics 4
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

  // --- 4a. Overall sessions + year-over-year (two separate calls) ---
  const overallMetrics = [
    { name: 'sessions' },
    { name: 'screenPageViews' },
    { name: 'bounceRate' },
    { name: 'averageSessionDuration' },
  ]
  const [currentOverallRes, prevOverallRes] = await Promise.all([
    analyticsData.properties.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      requestBody: { dateRanges: [{ startDate, endDate }], metrics: overallMetrics },
    }),
    analyticsData.properties.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      requestBody: { dateRanges: [{ startDate: prevStartDate, endDate: prevEndDate }], metrics: overallMetrics },
    }).catch(() => ({ data: { rows: [] } })),
  ])

  const currentRow = (currentOverallRes.data.rows || [])[0]
  const prevRow = (prevOverallRes.data.rows || [])[0]

  const sessions = parseInt(currentRow?.metricValues?.[0]?.value || '0')
  const pageviews = parseInt(currentRow?.metricValues?.[1]?.value || '0')
  const bounceRate = parseFloat(currentRow?.metricValues?.[2]?.value || '0').toFixed(1)
  const avgSessionDuration = parseFloat(currentRow?.metricValues?.[3]?.value || '0').toFixed(0)

  const sessionsPY = parseInt(prevRow?.metricValues?.[0]?.value || '0')
  const pageviewsPY = parseInt(prevRow?.metricValues?.[1]?.value || '0')

  // --- 4b. Top pages ---
  const pagesRes = await analyticsData.properties.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: 'screenPageViews' }],
      dimensions: [{ name: 'pagePath' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 8,
    },
  })
  const topPages = (pagesRes.data.rows || []).map((r) => ({
    page: r.dimensionValues[0].value,
    views: parseInt(r.metricValues[0].value),
  }))

  // --- 4c. Traffic sources ---
  const sourcesRes = await analyticsData.properties.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: 'sessions' }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 8,
    },
  })
  const sources = (sourcesRes.data.rows || []).map((r) => ({
    source: r.dimensionValues[0].value,
    sessions: parseInt(r.metricValues[0].value),
  }))

  // Paid Search sessions specifically
  const paidSearchRow = sources.find((s) => s.source === 'Paid Search')
  const paidSearchSessions = paidSearchRow?.sessions ?? 0

  // --- 4d. Conversion events (Buchungsinteressierte = Beds24 widget submit) ---
  const eventsRes = await analyticsData.properties.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: 'eventCount' }],
      dimensions: [{ name: 'eventName' }],
    },
  }).catch(() => ({ data: { rows: [] } }))
  const eventRows = eventsRes.data.rows || []
  const buchungsinteressierte = parseInt(
    eventRows.find((r) => r.dimensionValues[0].value === 'Buchungsinteressierte')?.metricValues[0].value || '0',
  )

  // --- 4e. Picknick-specific page views ---
  const picknickPagesRes = await analyticsData.properties.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: 'screenPageViews' }],
      dimensions: [{ name: 'pagePath' }],
      dimensionFilter: {
        orGroup: {
          expressions: [
            { filter: { fieldName: 'pagePath', stringFilter: { matchType: 'BEGINS_WITH', value: '/picknick' } } },
            { filter: { fieldName: 'pagePath', stringFilter: { matchType: 'BEGINS_WITH', value: '/en/picnic' } } },
          ],
        },
      },
    },
  }).catch(() => ({ data: { rows: [] } }))

  let picknickLandingViews = 0
  let picknickDankeViews = 0
  for (const r of picknickPagesRes.data.rows || []) {
    const path = r.dimensionValues[0].value
    const views = parseInt(r.metricValues[0].value)
    if (path.includes('/danke') || path.includes('/thanks')) picknickDankeViews += views
    else picknickLandingViews += views
  }

  return {
    sessions,
    pageviews,
    bounceRate,
    avgSessionDuration,
    sessionsPY,
    pageviewsPY,
    topPages,
    sources,
    paidSearchSessions,
    buchungsinteressierte,
    picknickLandingViews,
    picknickDankeViews, // = completed picknick bookings
  }
}

// ---------------------------------------------------------------------------
// 5. Push to Google Sheets
// ---------------------------------------------------------------------------
async function pushToGoogleSheet(current, prevYear, outlook, ga4) {
  if (!GOOGLE_SERVICE_ACCOUNT_KEY || !GOOGLE_SHEETS_ID) {
    console.warn('Google Sheets not configured, skipping')
    return
  }

  const keyJson = JSON.parse(Buffer.from(GOOGLE_SERVICE_ACCOUNT_KEY, 'base64').toString())
  const auth = new google.auth.GoogleAuth({
    credentials: keyJson,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  const sheets = google.sheets({ version: 'v4', auth })

  // --- Tab 1: Monatsdaten (time-series) ---
  const headers = [
    'Monat',
    // Beds24 current
    'Nächte im Haus', 'Buchungen', 'Stornierungen', 'Storno-Rate', 'Umsatz (€)',
    'Auslastung', 'Ø Aufenthalt (Nächte)',
    // Buchungskanäle
    'Manuell', 'Booking.com', 'Website', 'Airbnb',
    // Beds24 Vorjahr
    'VJ Nächte', 'VJ Buchungen', 'VJ Umsatz (€)', 'VJ Auslastung',
    // Website GA4
    'Sessions', 'Seitenaufrufe', 'Absprungrate',
    'VJ Sessions', 'VJ Seitenaufrufe',
    'Paid Search Sessions', 'Buchungsinteressierte',
    // Picknick
    'Picknick-Aufrufe', 'Picknick-Buchungen',
  ]

  const row = [
    monthLabel,
    // Beds24 current
    current?.totalNightsInRange ?? 0,
    current?.confirmedBookings ?? 0,
    current?.cancellations ?? 0,
    current?.cancellationRate ?? '0',
    current?.totalRevenue ?? '0',
    current?.occupancyRate ? `${current.occupancyRate}%` : '0%',
    current?.avgStay ?? '0',
    // Channels
    current?.byChannel?.Manuell ?? 0,
    current?.byChannel?.['Booking.com'] ?? 0,
    current?.byChannel?.Website ?? 0,
    current?.byChannel?.Airbnb ?? 0,
    // Vorjahr
    prevYear?.totalNightsInRange ?? 0,
    prevYear?.confirmedBookings ?? 0,
    prevYear?.totalRevenue ?? '0',
    prevYear?.occupancyRate ? `${prevYear.occupancyRate}%` : '0%',
    // GA4 current
    ga4?.sessions ?? 0,
    ga4?.pageviews ?? 0,
    ga4?.bounceRate ? `${ga4.bounceRate}%` : '0%',
    ga4?.sessionsPY ?? 0,
    ga4?.pageviewsPY ?? 0,
    ga4?.paidSearchSessions ?? 0,
    ga4?.buchungsinteressierte ?? 0,
    // Picknick
    ga4?.picknickLandingViews ?? 0,
    ga4?.picknickDankeViews ?? 0,
  ]

  // Ensure header exists
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId: GOOGLE_SHEETS_ID,
    range: 'Monatsdaten!A1:Z1',
  })
  if (!existing.data.values || existing.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SHEETS_ID,
      range: 'Monatsdaten!A1',
      valueInputOption: 'RAW',
      requestBody: { values: [headers] },
    })
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId: GOOGLE_SHEETS_ID,
    range: 'Monatsdaten!A:Z',
    valueInputOption: 'RAW',
    requestBody: { values: [row] },
  })

  // --- Tab 2: Ausblick (overwrite each month, auto-create tab if missing) ---
  if (outlook && outlook.length > 0) {
    const sheetMeta = await sheets.spreadsheets.get({ spreadsheetId: GOOGLE_SHEETS_ID })
    const ausblickExists = (sheetMeta.data.sheets || []).some((s) => s.properties?.title === 'Ausblick')
    if (!ausblickExists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: GOOGLE_SHEETS_ID,
        requestBody: { requests: [{ addSheet: { properties: { title: 'Ausblick' } } }] },
      })
      console.log('Created "Ausblick" sheet tab')
    }

    const outlookHeaders = ['Monat', 'Buchungen', 'Nächte gebucht', 'Auslastung', 'Stand']
    const outlookRows = outlook.map((o) => [
      o.monthLabel,
      o.confirmedBookings,
      o.totalNights,
      `${o.occupancyRate}%`,
      new Date().toLocaleDateString('de-DE'),
    ])

    await sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SHEETS_ID,
      range: 'Ausblick!A1',
      valueInputOption: 'RAW',
      requestBody: { values: [outlookHeaders, ...outlookRows] },
    })
  }

  console.log('Google Sheets updated successfully')
}

// ---------------------------------------------------------------------------
// 6. Build HTML Email
// ---------------------------------------------------------------------------
function buildEmailHtml(current, prevYear, outlook, ga4) {
  const kpi = (label, value, sub = '') => `
    <td style="padding:12px 16px;text-align:center;background:#f8f7f4;border-radius:8px;vertical-align:top;">
      <div style="font-size:22px;font-weight:bold;color:#4a6741;">${value}</div>
      ${sub ? `<div style="font-size:11px;color:#7a8c75;margin-top:2px;">${sub}</div>` : ''}
      <div style="font-size:11px;color:#6b7c68;margin-top:4px;">${label}</div>
    </td>`

  const tableRow = (label, value, note = '') => `
    <tr>
      <td style="padding:5px 12px;color:#4a4a4a;">${label}</td>
      <td style="padding:5px 12px;text-align:right;font-weight:600;color:#2d3b28;">${value}${note ? ` <span style="font-weight:400;color:#888;font-size:11px;">${note}</span>` : ''}</td>
    </tr>`

  const section = (title, content) => `
    <div style="margin-top:24px;">
      <h2 style="font-size:17px;color:#2d3b28;border-bottom:2px solid #c9a84c;padding-bottom:6px;margin-bottom:14px;">${title}</h2>
      ${content}
    </div>`

  // --- KPI row ---
  const currNights = current?.totalNightsInRange ?? 0
  const prevNights = prevYear?.totalNightsInRange ?? null
  const currRev = current?.totalRevenue ? `${parseFloat(current.totalRevenue).toLocaleString('de-DE', { minimumFractionDigits: 0 })} €` : '–'
  const currOcc = current?.occupancyRate ? `${current.occupancyRate}%` : '–'
  const prevOcc = prevYear?.occupancyRate ?? null

  let kpis = '<table style="width:100%;border-spacing:8px;"><tr>'
  kpis += kpi('Nächte im Haus', currNights, prevNights != null ? `VJ: ${prevNights}` : '')
  kpis += kpi('Buchungen', current?.confirmedBookings ?? '–', prevYear ? `VJ: ${prevYear.confirmedBookings}` : '')
  kpis += kpi('Umsatz', currRev, prevYear?.totalRevenue ? `VJ: ${parseFloat(prevYear.totalRevenue).toLocaleString('de-DE', { minimumFractionDigits: 0 })} €` : '')
  kpis += kpi('Auslastung', currOcc, prevOcc ? `VJ: ${prevOcc}%` : '')
  kpis += kpi('Sessions', ga4?.sessions ?? '–', ga4?.sessionsPY ? `VJ: ${ga4.sessionsPY}` : '')
  kpis += '</tr></table>'

  // --- Buchungen section ---
  let bookingsHtml = ''
  if (current) {
    let rows = ''
    rows += tableRow('Übernachtungen im Haus', currNights, prevNights != null ? `VJ: ${prevNights}` : '')
    rows += tableRow('Bestätigte Buchungen', current.confirmedBookings, prevYear ? `VJ: ${prevYear.confirmedBookings}` : '')
    rows += tableRow('Stornierungen', `${current.cancellations} (${current.cancellationRate}%)`)
    rows += tableRow('Gesamtumsatz (proratiert)', `${currRev}`, prevYear?.totalRevenue ? `VJ: ${parseFloat(prevYear.totalRevenue).toLocaleString('de-DE', { minimumFractionDigits: 0 })} €` : '')
    rows += tableRow('Ø Aufenthalt', `${current.avgStay} Nächte`)
    rows += tableRow('Auslastung', currOcc, prevOcc ? `VJ: ${prevOcc}%` : '')
    rows += tableRow('Beliebtestes Zimmer', current.topRoom)

    // Channel split
    const ch = current.byChannel
    const total = current.confirmedBookings || 1
    rows += '<tr><td colspan="2" style="padding-top:10px;padding-bottom:2px;font-weight:600;color:#4a6741;font-size:13px;">Buchungskanäle:</td></tr>'
    for (const [name, count] of Object.entries(ch)) {
      if (count === 0) continue
      const pct = ((count / total) * 100).toFixed(0)
      rows += tableRow(`  ${name}`, `${count} (${pct}%)`)
    }

    // By room breakdown
    if (Object.keys(current.byRoom).length > 0) {
      rows += '<tr><td colspan="2" style="padding-top:10px;padding-bottom:2px;font-weight:600;color:#4a6741;font-size:13px;">Nach Zimmer:</td></tr>'
      for (const [room, count] of Object.entries(current.byRoom).sort((a, b) => b[1] - a[1])) {
        rows += tableRow(`  ${room}`, count)
      }
    }

    bookingsHtml = section('Buchungen & Umsatz', `<table style="width:100%;">${rows}</table>`)
  }

  // --- Outlook section ---
  let outlookHtml = ''
  if (outlook && outlook.length > 0) {
    let tableContent = `
      <table style="width:100%;border-collapse:collapse;">
        <tr style="background:#2d3b28;color:#fff;">
          <th style="padding:8px 12px;text-align:left;font-size:13px;">Monat</th>
          <th style="padding:8px 12px;text-align:center;font-size:13px;">Buchungen</th>
          <th style="padding:8px 12px;text-align:center;font-size:13px;">Nächte</th>
          <th style="padding:8px 12px;text-align:center;font-size:13px;">Auslastung</th>
        </tr>`
    for (const [i, o] of outlook.entries()) {
      const bg = i % 2 === 0 ? '#f8f7f4' : '#fff'
      const occNum = parseFloat(o.occupancyRate)
      const occColor = occNum >= 70 ? '#4a6741' : occNum >= 40 ? '#c9a84c' : '#c0392b'
      tableContent += `
        <tr style="background:${bg};">
          <td style="padding:7px 12px;font-weight:600;">${o.monthLabel}</td>
          <td style="padding:7px 12px;text-align:center;">${o.confirmedBookings}</td>
          <td style="padding:7px 12px;text-align:center;">${o.totalNights}</td>
          <td style="padding:7px 12px;text-align:center;color:${occColor};font-weight:600;">${o.occupancyRate}%</td>
        </tr>`
    }
    tableContent += '</table>'
    outlookHtml = section(`Vorausschau bis Dezember ${year}`, tableContent)
  }

  // --- Website section ---
  let websiteHtml = ''
  if (ga4) {
    let rows = ''
    rows += tableRow('Sessions', ga4.sessions, ga4.sessionsPY ? `VJ: ${ga4.sessionsPY}` : '')
    rows += tableRow('Seitenaufrufe', ga4.pageviews, ga4.pageviewsPY ? `VJ: ${ga4.pageviewsPY}` : '')
    rows += tableRow('Absprungrate', `${ga4.bounceRate}%`)
    rows += tableRow('Ø Sitzungsdauer', `${ga4.avgSessionDuration}s`)

    if (ga4.sources.length > 0) {
      rows += '<tr><td colspan="2" style="padding-top:10px;padding-bottom:2px;font-weight:600;color:#4a6741;font-size:13px;">Traffic-Quellen:</td></tr>'
      for (const s of ga4.sources.slice(0, 6)) {
        rows += tableRow(`  ${s.source}`, `${s.sessions} Sessions`)
      }
    }

    rows += tableRow('Paid Search Sessions (Google Ads)', ga4.paidSearchSessions)
    rows += tableRow('Buchungsinteressierte (Beds24 Widget)', ga4.buchungsinteressierte)

    if (ga4.topPages.length > 0) {
      rows += '<tr><td colspan="2" style="padding-top:10px;padding-bottom:2px;font-weight:600;color:#4a6741;font-size:13px;">Top Seiten:</td></tr>'
      for (const p of ga4.topPages.slice(0, 6)) {
        rows += tableRow(`  ${p.page}`, `${p.views} Aufrufe`)
      }
    }

    websiteHtml = section('Website-Traffic', `<table style="width:100%;">${rows}</table>`)
  }

  // --- Picknick section ---
  let picknickHtml = ''
  if (ga4 && (ga4.picknickLandingViews > 0 || ga4.picknickDankeViews > 0)) {
    const convRate = ga4.picknickLandingViews > 0
      ? ((ga4.picknickDankeViews / ga4.picknickLandingViews) * 100).toFixed(1)
      : '0'
    let rows = ''
    rows += tableRow('Aufrufe /picknick/', ga4.picknickLandingViews)
    rows += tableRow('Abgeschlossene Buchungen (/danke/)', ga4.picknickDankeViews)
    rows += tableRow('Conversion-Rate', `${convRate}%`)
    picknickHtml = section('Picknick-Korb', `<table style="width:100%;">${rows}</table>`)
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
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:620px;margin:0 auto;padding:24px;color:#333;">
  <div style="text-align:center;padding:20px 0;border-bottom:3px solid #c9a84c;">
    <h1 style="font-size:22px;color:#2d3b28;margin:0;">Pension Volgenandt</h1>
    <p style="color:#6b7c68;margin:6px 0 0;">Monatsbericht ${monthLabel}</p>
  </div>

  ${kpis}
  ${bookingsHtml}
  ${outlookHtml}
  ${websiteHtml}
  ${picknickHtml}
  ${dashboardLink}

  <p style="text-align:center;color:#999;font-size:11px;margin-top:28px;border-top:1px solid #eee;padding-top:14px;">
    Automatisch erstellt am ${new Date().toLocaleDateString('de-DE')}
  </p>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// 7. Send Email
// ---------------------------------------------------------------------------
async function sendEmail(html) {
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

  // Get Beds24 token once, reuse for all calls
  const token = await getBeds24Token().catch((e) => {
    console.error('Beds24 auth error:', e.message)
    return null
  })

  // Run all data collection in parallel
  const [current, prevYear, outlook, ga4] = await Promise.all([
    collectBeds24Current(token).catch((e) => { console.error('Beds24 current error:', e.message); return null }),
    collectBeds24PreviousYear(token).catch((e) => { console.error('Beds24 VJ error:', e.message); return null }),
    collectBeds24Outlook(token).catch((e) => { console.error('Beds24 outlook error:', e.message); return [] }),
    collectGA4Data().catch((e) => { console.error('GA4 error:', e.message); return null }),
  ])

  console.log('\n--- Results ---')
  if (current) {
    console.log(`Beds24 (aktuell): ${current.confirmedBookings} Buchungen, ${current.totalNightsInRange} Nächte, ${current.totalRevenue}€, ${current.occupancyRate}% Auslastung`)
    console.log(`  Kanäle: Manuell=${current.byChannel.Manuell} Booking.com=${current.byChannel['Booking.com']} Website=${current.byChannel.Website}`)
  }
  if (prevYear) {
    console.log(`Beds24 (VJ): ${prevYear.confirmedBookings} Buchungen, ${prevYear.totalNightsInRange} Nächte, ${prevYear.totalRevenue}€`)
  }
  if (outlook.length > 0) {
    console.log(`Ausblick: ${outlook.length} Monate (${outlook[0].monthLabel} bis ${outlook[outlook.length - 1].monthLabel})`)
  }
  if (ga4) {
    console.log(`GA4: ${ga4.sessions} Sessions, ${ga4.paidSearchSessions} Paid Search, ${ga4.buchungsinteressierte} Buchungsinteressierte`)
    console.log(`  Picknick: ${ga4.picknickLandingViews} Aufrufe, ${ga4.picknickDankeViews} Buchungen`)
  }

  await pushToGoogleSheet(current, prevYear, outlook, ga4).catch((e) => {
    console.error('Google Sheets error:', e.message)
  })

  const html = buildEmailHtml(current, prevYear, outlook, ga4)
  await sendEmail(html).catch((e) => {
    console.error('Email error:', e.message)
  })

  console.log('\nDone!')
}

main().catch((e) => {
  console.error('Fatal error:', e)
  process.exit(1)
})
