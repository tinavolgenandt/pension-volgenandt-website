#!/usr/bin/env node
/**
 * TEMPORARY diagnostic — not for production use, delete after use.
 * Compares the exact booking set + revenue MTD's aggregateBookings sees for
 * July 1-25 vs what the revenue-history query sees for the same nights, to
 * find why the two computed totals disagree. No guest PII logged (public repo).
 */
const BEDS24_REFRESH_TOKEN = process.env.BEDS24_REFRESH_TOKEN
const BEDS24_PROPERTY_ID = process.env.BEDS24_PROPERTY_ID || '261258'

async function getToken() {
  const res = await fetch('https://api.beds24.com/v2/authentication/token', {
    headers: { refreshToken: BEDS24_REFRESH_TOKEN },
  })
  const data = await res.json()
  if (!data.token) throw new Error(`Auth failed: ${JSON.stringify(data)}`)
  return data.token
}

async function fetchAll(token, params) {
  const results = []
  let pageToken = null
  do {
    const qs = new URLSearchParams({ propertyId: BEDS24_PROPERTY_ID, ...params })
    if (pageToken) qs.set('pageToken', pageToken)
    const res = await fetch(`https://api.beds24.com/v2/bookings?${qs}`, { headers: { token } })
    const body = await res.json()
    const arr = Array.isArray(body) ? body : (body.data ?? [])
    if (Array.isArray(arr)) results.push(...arr)
    pageToken = body.nextPageToken ?? null
  } while (pageToken)
  return results
}

function redact(b) {
  return {
    id: b.id,
    masterId: b.masterId,
    status: b.status,
    roomId: b.roomId,
    price: b.price,
    arrival: b.arrival,
    departure: b.departure,
    apiSource: b.apiSource,
    channel: b.channel,
  }
}

function isBlind(b) {
  return typeof b.status === 'string' && b.status.toLowerCase() === 'black'
}
function isCancelled(b) {
  return (
    (b.cancelTime && b.cancelTime !== 0 && b.cancelTime !== '0') ||
    (typeof b.status === 'string' && b.status.toLowerCase().includes('cancel'))
  )
}

async function main() {
  const token = await getToken()

  const mtdSet = await fetchAll(token, {
    arrivalTo: '2026-07-25',
    departureFrom: '2026-07-01',
    includeInvoice: 'false',
  })
  const historySet = await fetchAll(token, {
    arrivalTo: '2026-07-25',
    departureFrom: '2025-08-01',
    includeInvoice: 'true',
  })

  console.log(`MTD-style fetch (departureFrom=07-01, includeInvoice=false): ${mtdSet.length} bookings`)
  console.log(`History-style fetch (departureFrom=2025-08-01, includeInvoice=true): ${historySet.length} bookings`)

  const rsMs = new Date('2026-07-01T00:00:00').getTime()
  const reMs = new Date('2026-07-26T00:00:00').getTime()

  function mtdRevenueSum(set) {
    let total = 0
    for (const b of set) {
      if (isBlind(b) || isCancelled(b)) continue
      const arrival = new Date(b.arrival).getTime()
      const departure = new Date(b.departure).getTime()
      const totalNights = Math.max(1, Math.round((departure - arrival) / 86400000))
      const clampedStart = Math.max(arrival, rsMs)
      const clampedEnd = Math.min(departure, reMs)
      const nightsInRange = Math.max(0, Math.round((clampedEnd - clampedStart) / 86400000))
      const price = parseFloat(b.price) || 0
      total += (nightsInRange / totalNights) * price
    }
    return total
  }

  console.log(`Revenue via MTD-style set: ${mtdRevenueSum(mtdSet).toFixed(2)}`)
  console.log(`Revenue via History-style set: ${mtdRevenueSum(historySet).toFixed(2)}`)

  const mtdIds = new Set(mtdSet.map((b) => b.id))
  const historyIds = new Set(historySet.map((b) => b.id))

  const onlyInMtd = mtdSet.filter((b) => !historyIds.has(b.id))
  const onlyInHistory = historySet.filter((b) => !mtdIds.has(b.id))

  console.log(`\nBookings only in MTD-style set (${onlyInMtd.length}):`)
  for (const b of onlyInMtd) console.log(JSON.stringify(redact(b)))

  console.log(`\nBookings only in History-style set (${onlyInHistory.length}):`)
  for (const b of onlyInHistory) console.log(JSON.stringify(redact(b)))

  // Also check: same booking present in both, but with a DIFFERENT price value
  console.log(`\nBookings present in both but with different price:`)
  const historyById = new Map(historySet.map((b) => [b.id, b]))
  for (const b of mtdSet) {
    const h = historyById.get(b.id)
    if (h && String(h.price) !== String(b.price)) {
      console.log(`id=${b.id} mtdPrice=${b.price} historyPrice=${h.price}`)
    }
  }
}

main().catch((e) => {
  console.error('Fatal:', e.message)
  process.exit(1)
})
