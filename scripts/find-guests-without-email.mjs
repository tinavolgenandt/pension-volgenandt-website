/**
 * Finds direct bookings in Beds24 where no guest email is stored.
 * For each such guest, searches the kontakt@ IMAP inbox by name to find
 * an email address from prior correspondence.
 *
 * Usage:
 *   node scripts/find-guests-without-email.mjs
 *
 * Required env vars:
 *   BEDS24_REFRESH_TOKEN   (read scope is enough)
 *   IMAP_HOST              (default: imap.ionos.de)
 *   IMAP_USER              (default: kontakt@pension-volgenandt.de)
 *   IMAP_PASS
 *
 * Output: prints a table + saves .planning/guests-without-email.md
 *
 * Note: Beds24 token has read-only scope. Updating emails in Beds24
 * must be done manually (or via a token with bookings:write scope).
 */

import { ImapFlow } from 'imapflow'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const BEDS24_REFRESH_TOKEN = process.env.BEDS24_REFRESH_TOKEN
const BEDS24_PROPERTY_ID = process.env.BEDS24_PROPERTY_ID ?? '261258'
const IMAP_HOST = process.env.IMAP_HOST ?? 'imap.ionos.de'
const IMAP_USER = process.env.IMAP_USER ?? 'kontakt@pension-volgenandt.de'
const IMAP_PASS = process.env.IMAP_PASS

const ROOM_NAMES = {
  548066: 'Balkonzimmer',
  549252: 'Rosengarten',
  549319: 'Wohlfühl-Appartement',
  656178: 'Einzelzimmer',
  656179: "Emil's Kuhwiese",
  656180: 'Schöne Aussicht',
}

function mapChannel(src) {
  if (!src || src === '' || src === 'manual') return 'Direkt'
  const n = src.toLowerCase().replace(/[.\s-]/g, '')
  if (n.includes('bookingcom')) return 'Booking.com'
  if (n.includes('airbnb')) return 'Airbnb'
  if (n.includes('beds24')) return 'Website'
  return 'Direkt'
}

// ── Beds24 ───────────────────────────────────────────────────────────────────
async function getBeds24Token() {
  const res = await fetch('https://api.beds24.com/v2/authentication/token', {
    headers: { refreshToken: BEDS24_REFRESH_TOKEN },
  })
  const data = await res.json()
  if (!data.token) throw new Error(`Beds24 token error: ${JSON.stringify(data)}`)
  return data.token
}

async function fetchAllUpcomingDirect(token) {
  const today = new Date().toISOString().split('T')[0]
  // Look up to 18 months ahead
  const future = new Date()
  future.setMonth(future.getMonth() + 18)
  const to = future.toISOString().split('T')[0]

  const qs = new URLSearchParams({
    propertyId: BEDS24_PROPERTY_ID,
    arrivalFrom: today,
    arrivalTo: to,
    includeInvoice: 'false',
  })
  const res = await fetch(`https://api.beds24.com/v2/bookings?${qs}`, {
    headers: { token },
  })
  const body = await res.json()
  const arr = Array.isArray(body) ? body : (body.data ?? [])

  return arr.filter((b) => {
    const cancelled =
      (b.cancelTime && b.cancelTime !== 0 && b.cancelTime !== '0') ||
      (typeof b.status === 'string' && b.status.toLowerCase().includes('cancel'))
    if (cancelled) return false
    const channel = mapChannel(b.apiSource)
    // Only direct bookings (not Booking.com, Airbnb)
    return channel === 'Direkt' || channel === 'Website'
  })
}

// ── IMAP ─────────────────────────────────────────────────────────────────────
async function searchImapForGuest(client, firstName, lastName) {
  const results = []
  if (!firstName && !lastName) return results

  // Search all folders: INBOX + Sent
  const foldersToSearch = ['INBOX', 'Sent']

  for (const folder of foldersToSearch) {
    try {
      const lock = await client.getMailboxLock(folder)
      try {
        // Search by name — try last name first (more specific)
        const searchTerm = lastName || firstName
        const uids = await client.search({ text: searchTerm }, { uid: true })

        for (const uid of uids.slice(0, 30)) {
          // cap at 30 per folder
          const msg = await client.fetchOne(uid, { envelope: true }, { uid: true })
          if (!msg?.envelope) continue

          const { from, to, subject } = msg.envelope
          const allAddresses = [...(from ?? []), ...(to ?? [])]

          // Check if any address or name matches our guest
          const fullName = `${firstName ?? ''} ${lastName ?? ''}`.toLowerCase().trim()
          const nameMatches = allAddresses.some((addr) => {
            const addrName = (addr.name ?? '').toLowerCase()
            return (
              addrName.includes(firstName?.toLowerCase() ?? '___') ||
              addrName.includes(lastName?.toLowerCase() ?? '___') ||
              (firstName && lastName && addrName.includes(fullName))
            )
          })

          if (nameMatches) {
            // Collect the guest-side email (not kontakt@)
            const guestAddr = allAddresses.find(
              (a) => a.address && !a.address.includes('pension-volgenandt'),
            )
            if (guestAddr?.address) {
              results.push({
                email: guestAddr.address,
                name: guestAddr.name ?? '',
                subject: subject ?? '(kein Betreff)',
                folder,
              })
            }
          }
        }
      } finally {
        lock.release()
      }
    } catch {
      // folder may not exist — skip silently
    }
  }

  // Deduplicate by email address
  const seen = new Set()
  return results.filter((r) => {
    if (seen.has(r.email)) return false
    seen.add(r.email)
    return true
  })
}

// ── Main ─────────────────────────────────────────────────────────────────────
console.log('Fetching Beds24 token…')
const token = await getBeds24Token()

console.log('Fetching upcoming direct bookings…')
const bookings = await fetchAllUpcomingDirect(token)
const noEmail = bookings.filter((b) => !b.email || b.email.trim() === '')

console.log(`Total upcoming direct bookings: ${bookings.length}`)
console.log(`Without email address:          ${noEmail.length}\n`)

if (noEmail.length === 0) {
  console.log('✓ All direct bookings have an email address.')
  process.exit(0)
}

// ── IMAP search ──────────────────────────────────────────────────────────────
let imapClient = null
if (IMAP_PASS) {
  console.log(`Connecting to IMAP (${IMAP_HOST})…`)
  imapClient = new ImapFlow({
    host: IMAP_HOST,
    port: 993,
    secure: true,
    auth: { user: IMAP_USER, pass: IMAP_PASS },
    logger: false,
  })
  await imapClient.connect()
  console.log('IMAP connected.\n')
} else {
  console.warn('IMAP_PASS not set — skipping email search in inbox.\n')
}

// ── Build report ─────────────────────────────────────────────────────────────
const report = []

for (const b of noEmail) {
  const firstName = b.firstName ?? ''
  const lastName = b.lastName ?? ''
  const room = ROOM_NAMES[b.roomId] ?? `Room ${b.roomId}`
  const arrival = b.arrival ?? '?'
  const departure = b.departure ?? '?'
  const bookingId = b.id ?? '?'

  let foundEmails = []
  if (imapClient) {
    process.stdout.write(`  Searching IMAP for: ${firstName} ${lastName}… `)
    foundEmails = await searchImapForGuest(imapClient, firstName, lastName)
    console.log(foundEmails.length > 0 ? `→ found: ${foundEmails.map((e) => e.email).join(', ')}` : '→ nichts gefunden')
  }

  report.push({ bookingId, firstName, lastName, room, arrival, departure, foundEmails })
}

if (imapClient) await imapClient.logout()

// ── Output ───────────────────────────────────────────────────────────────────
const lines = [
  '# Direktbuchungen ohne E-Mail-Adresse',
  '',
  `Stand: ${new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}`,
  '',
]

for (const g of report) {
  const emailBlock =
    g.foundEmails.length > 0
      ? g.foundEmails.map((e) => `  - **${e.email}** (${e.name}) — aus: "${e.subject}" [${e.folder}]`).join('\n')
      : '  - ❌ keine E-Mail im Postfach gefunden'

  lines.push(`## ${g.firstName} ${g.lastName}`)
  lines.push(`- **Buchungs-ID:** ${g.bookingId}`)
  lines.push(`- **Zimmer:** ${g.room}`)
  lines.push(`- **Anreise:** ${g.arrival}   **Abreise:** ${g.departure}`)
  lines.push(`- **E-Mail in Beds24:** *(leer)*`)
  lines.push(`- **Gefunden im Postfach:**`)
  lines.push(emailBlock)
  lines.push('')
}

lines.push('---')
lines.push('> E-Mail-Adressen bitte manuell in Beds24 unter der jeweiligen Buchung nachtragen.')
lines.push('> (Das API-Token hat nur Lese-Zugriff.)')

const md = lines.join('\n')
console.log('\n' + md)

// Save to .planning/
const planDir = path.join(__dirname, '..', '.planning')
if (!fs.existsSync(planDir)) fs.mkdirSync(planDir, { recursive: true })
const outFile = path.join(planDir, 'guests-without-email.md')
fs.writeFileSync(outFile, md, 'utf-8')
console.log(`\nReport saved: ${outFile}`)
