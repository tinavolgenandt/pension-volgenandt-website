#!/usr/bin/env node
/**
 * Backfill theoretical prices for Beds24 bookings where price = 0.
 *
 * Usage:
 *   node scripts/fix-booking-prices.mjs              # dry-run (shows changes, no writes)
 *   node scripts/fix-booking-prices.mjs --apply      # apply price updates to Beds24
 *
 * Env vars required:
 *   BEDS24_REFRESH_TOKEN  — same token used by collect-stats.mjs
 *   BEDS24_PROPERTY_ID    — defaults to 261258
 */

const BEDS24_REFRESH_TOKEN = process.env.BEDS24_REFRESH_TOKEN
const BEDS24_PROPERTY_ID = process.env.BEDS24_PROPERTY_ID || '261258'
const APPLY = process.argv.includes('--apply')

if (!BEDS24_REFRESH_TOKEN) {
  console.error('Error: BEDS24_REFRESH_TOKEN env var is required.')
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Static rates — direct-booking standard prices from YAML room configs.
// Tiers are sorted by maxOccupancy ascending.
// Lookup: first tier where maxOccupancy >= numGuests wins.
// ---------------------------------------------------------------------------
const ROOM_RATES = {
  548066: {
    name: 'Balkonzimmer',
    rates: [{ maxOccupancy: 99, pricePerNight: 58 }],
  },
  549252: {
    name: 'Rosengarten',
    rates: [
      { maxOccupancy: 2, pricePerNight: 58 },
      { maxOccupancy: 99, pricePerNight: 68 },
    ],
  },
  549319: {
    name: 'Wohlfühl-Appartement',
    rates: [
      { maxOccupancy: 2, pricePerNight: 65 },
      { maxOccupancy: 99, pricePerNight: 75 },
    ],
  },
  656178: {
    name: 'Einzelzimmer',
    rates: [{ maxOccupancy: 99, pricePerNight: 50 }],
  },
  656179: {
    name: "Emil's Kuhwiese",
    rates: [
      { maxOccupancy: 2, pricePerNight: 73 },
      { maxOccupancy: 99, pricePerNight: 83 },
    ],
  },
  656180: {
    name: 'Schöne Aussicht',
    rates: [
      { maxOccupancy: 4, pricePerNight: 126 },
      { maxOccupancy: 5, pricePerNight: 136 },
      { maxOccupancy: 99, pricePerNight: 146 },
    ],
  },
}

function calcTheoreticalPrice(roomId, numGuests, nights) {
  const room = ROOM_RATES[String(roomId)]
  if (!room) return null
  const guests = Math.max(1, numGuests)
  const tier =
    room.rates.find((r) => r.maxOccupancy >= guests) ?? room.rates[room.rates.length - 1]
  return Math.round(tier.pricePerNight * nights * 100) / 100
}

// ---------------------------------------------------------------------------
// Beds24 API helpers
// ---------------------------------------------------------------------------
async function getBeds24Token() {
  const res = await fetch('https://api.beds24.com/v2/authentication/token', {
    headers: { refreshToken: BEDS24_REFRESH_TOKEN },
  })
  const data = await res.json()
  if (!data.token) throw new Error(`Beds24 auth failed: ${JSON.stringify(data)}`)
  return data.token
}

async function fetchAllBookings(token) {
  const bookings = []
  let nextPageToken = null
  let page = 0

  do {
    page++
    const params = new URLSearchParams({
      propertyId: BEDS24_PROPERTY_ID,
      departureFrom: '2018-01-01',
      includeInvoice: 'false',
    })
    if (nextPageToken) params.set('pageToken', nextPageToken)

    const res = await fetch(`https://api.beds24.com/v2/bookings?${params}`, {
      headers: { token },
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`GET /v2/bookings failed (${res.status}): ${text}`)
    }

    const body = await res.json()
    const rows = Array.isArray(body) ? body : (body.data ?? [])
    bookings.push(...rows)
    nextPageToken = body.nextPageToken ?? null

    process.stdout.write(
      `\r  Page ${page}: ${rows.length} fetched — total: ${bookings.length}   `,
    )
  } while (nextPageToken)

  console.log()
  return bookings
}

async function patchBookingPrice(token, bookingId, price) {
  const res = await fetch('https://api.beds24.com/v2/bookings', {
    method: 'POST',
    headers: {
      token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([{ id: bookingId, price }]),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`POST /v2/bookings (update ${bookingId}) failed (${res.status}): ${text}`)
  }
  return res.json()
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log(`\nBeds24 Price Backfill`)
  console.log(`Mode      : ${APPLY ? 'APPLY (writing to Beds24)' : 'DRY-RUN (no changes)'}`)
  console.log(`Property  : ${BEDS24_PROPERTY_ID}\n`)

  const token = await getBeds24Token()
  console.log('Fetching all bookings...')
  const allBookings = await fetchAllBookings(token)
  console.log(`Total bookings: ${allBookings.length}`)

  const zeroPriceBookings = allBookings.filter((b) => {
    const p = parseFloat(b.price)
    return isNaN(p) || p === 0
  })
  console.log(`Bookings with price = 0: ${zeroPriceBookings.length}\n`)

  if (zeroPriceBookings.length === 0) {
    console.log('Nothing to fix — all bookings already have a price.')
    return
  }

  const col = (s, w) => String(s ?? '').padEnd(w)
  const header = [
    col('ID', 10),
    col('Arrival', 12),
    col('Departure', 12),
    col('Room', 26),
    col('Guests', 7),
    col('Nights', 7),
    'Theoretical Price',
  ].join('')
  console.log(header)
  console.log('-'.repeat(header.length))

  let fixable = 0
  let skipped = 0
  let updateErrors = 0

  for (const b of zeroPriceBookings) {
    const arrival = new Date(b.arrival)
    const departure = new Date(b.departure)
    const nights = Math.max(1, Math.round((departure - arrival) / 86400000))
    const numGuests = (parseInt(b.numAdult) || 1) + (parseInt(b.numChild) || 0)
    const roomInfo = ROOM_RATES[String(b.roomId)]
    const theoreticalPrice = calcTheoreticalPrice(b.roomId, numGuests, nights)

    const arrStr = b.arrival?.slice(0, 10) ?? '?'
    const depStr = b.departure?.slice(0, 10) ?? '?'
    const roomName = roomInfo?.name ?? `Room ${b.roomId}`

    if (theoreticalPrice === null) {
      console.log(
        [col(b.id, 10), col(arrStr, 12), col(depStr, 12), col(roomName, 26), col(numGuests, 7), col(nights, 7), 'SKIP — unknown room ID'].join(''),
      )
      skipped++
      continue
    }

    console.log(
      [col(b.id, 10), col(arrStr, 12), col(depStr, 12), col(roomName, 26), col(numGuests, 7), col(nights, 7), `€${theoreticalPrice}`].join(''),
    )
    fixable++

    if (APPLY) {
      try {
        await patchBookingPrice(token, b.id, theoreticalPrice)
      } catch (err) {
        console.error(`  ERROR updating booking ${b.id}: ${err.message}`)
        updateErrors++
      }
    }
  }

  console.log('\n--- Summary ---')
  console.log(`Total 0-price bookings : ${zeroPriceBookings.length}`)
  console.log(`Fixable                : ${fixable}`)
  console.log(`Skipped (unknown room) : ${skipped}`)
  if (APPLY) {
    console.log(`Updated successfully   : ${fixable - updateErrors}`)
    if (updateErrors > 0) console.log(`Errors                 : ${updateErrors}`)
  } else {
    console.log(`\nRe-run with --apply to write these prices to Beds24.`)
  }
}

main().catch((err) => {
  console.error('\nFatal error:', err.message)
  process.exit(1)
})
