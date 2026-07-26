#!/usr/bin/env node
/**
 * TEMPORARY diagnostic — not for production use, delete after use.
 * Inspects raw Beds24 fields for price=0 bookings to identify how
 * "blind"/blocked-night bookings are represented in the v2 API response.
 * Deliberately avoids logging guest PII (name/email/phone) since this repo
 * is public and workflow logs are visible to anyone.
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

async function main() {
  const token = await getToken()
  const params = new URLSearchParams({
    propertyId: BEDS24_PROPERTY_ID,
    arrivalFrom: '2026-05-01',
    arrivalTo: '2026-06-30',
    departureFrom: '2026-05-01',
    includeInvoice: 'false',
  })
  const res = await fetch(`https://api.beds24.com/v2/bookings?${params}`, { headers: { token } })
  const body = await res.json()
  const bookings = Array.isArray(body) ? body : (body.data ?? [])

  const zeroPrice = bookings.filter((b) => {
    const p = parseFloat(b.price)
    return isNaN(p) || p === 0
  })

  console.log(`Total bookings in window: ${bookings.length}`)
  console.log(`Zero-price bookings in window: ${zeroPrice.length}`)

  const statusCounts = {}
  const apiSourceCounts = {}
  for (const b of zeroPrice) {
    const s = String(b.status ?? 'undefined')
    statusCounts[s] = (statusCounts[s] || 0) + 1
    const src = String(b.apiSource ?? 'undefined')
    apiSourceCounts[src] = (apiSourceCounts[src] || 0) + 1
  }
  console.log('Status value counts among zero-price bookings:', JSON.stringify(statusCounts))
  console.log('apiSource value counts among zero-price bookings:', JSON.stringify(apiSourceCounts))

  console.log('\nAll field keys present on first zero-price booking:')
  console.log(zeroPrice[0] ? Object.keys(zeroPrice[0]).sort().join(', ') : '(none)')

  console.log('\nRedacted sample (no name/email/phone) of up to 10 zero-price bookings:')
  const PII_FIELDS = new Set([
    'firstName', 'lastName', 'email', 'guestEmail', 'phone', 'mobile',
    'address', 'street', 'zip', 'postcode', 'city', 'country', 'notes', 'comments',
  ])
  for (const b of zeroPrice.slice(0, 10)) {
    const redacted = {}
    for (const [k, v] of Object.entries(b)) {
      if (PII_FIELDS.has(k)) continue
      if (k === 'invoice' || k === 'invoiceItems') continue
      redacted[k] = v
    }
    console.log(JSON.stringify(redacted))
  }
}

main().catch((e) => {
  console.error('Fatal:', e.message)
  process.exit(1)
})
