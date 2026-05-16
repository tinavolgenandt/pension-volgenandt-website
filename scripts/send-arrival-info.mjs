/**
 * Arrival information email
 *
 * Usage:
 *   node scripts/send-arrival-info.mjs --preview
 *     → saves HTML to .planning/preview-arrival-email.html and opens it
 *
 *   node scripts/send-arrival-info.mjs \
 *     --to "max.mustermann@example.com" \
 *     --name "Familie Mustermann" \
 *     --arrival "15. Juni 2026" \
 *     --departure "18. Juni 2026" \
 *     --room "Ferienwohnung Schöne Aussicht"
 *     → sends the email via SMTP
 *
 * SMTP credentials are read from environment variables (same as weekly-stats):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 *
 * WiFi credentials: set WIFI_NAME and WIFI_PASS below (or via env vars).
 */

import nodemailer from 'nodemailer'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ── WiFi credentials ────────────────────────────────────────────────────────
const WIFI_NAME = process.env.WIFI_NAME ?? 'Gäste'
const WIFI_PASS = process.env.WIFI_PASS ?? 'Pension_37327'

// ── Parse CLI arguments ──────────────────────────────────────────────────────
const args = process.argv.slice(2)
const get = (flag) => {
  const i = args.indexOf(flag)
  return i !== -1 ? args[i + 1] : null
}
const isPreview = args.includes('--preview')
const toEmail = get('--to')
const guestName = get('--name') ?? 'Liebe Gäste'
const arrival = get('--arrival') ?? '–'
const departure = get('--departure') ?? '–'
const roomName = get('--room') ?? ''

// ── Email HTML ───────────────────────────────────────────────────────────────
function buildHtml() {
  const roomLine = roomName
    ? `<tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Zimmer</td><td style="padding:4px 0 4px 16px;font-size:14px;font-weight:600;color:#1a2e1a;">${roomName}</td></tr>`
    : ''

  return /* html */ `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Ihre Anreiseinformationen – Pension Volgenandt</title>
</head>
<body style="margin:0;padding:0;background:#f4f7f4;font-family:Georgia,serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f4;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Header -->
  <tr>
    <td style="background:#2d4a2d;padding:32px 40px;border-radius:12px 12px 0 0;text-align:center;">
      <p style="margin:0;font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#ffffff;letter-spacing:0.5px;">
        Pension Volgenandt
      </p>
      <p style="margin:6px 0 0;font-size:13px;color:#a8c5a8;">
        Breitenbach · Eichsfeld · Thüringen
      </p>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="background:#ffffff;padding:40px 40px 32px;border-radius:0 0 12px 12px;">

      <!-- Greeting -->
      <p style="margin:0 0 8px;font-size:18px;color:#1a2e1a;">
        Liebe/-r ${guestName},
      </p>
      <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#4a5e4a;">
        Wir freuen uns sehr auf Ihren Besuch. In dieser E-Mail finden Sie alle wichtigen
        Informationen für Ihre Anreise.
      </p>

      <!-- Booking summary -->
      <div style="background:#f4f7f4;border-radius:8px;padding:20px 24px;margin-bottom:28px;">
        <table cellpadding="0" cellspacing="0" style="width:100%;">
          <tr>
            <td style="padding:4px 0;color:#6b7280;font-size:14px;">Anreise</td>
            <td style="padding:4px 0 4px 16px;font-size:14px;font-weight:600;color:#1a2e1a;">${arrival} · ab 14:00 Uhr</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#6b7280;font-size:14px;">Abreise</td>
            <td style="padding:4px 0 4px 16px;font-size:14px;font-weight:600;color:#1a2e1a;">${departure} · bis 11:00 Uhr</td>
          </tr>
          ${roomLine}
        </table>
      </div>

      <!-- Address & Parking -->
      <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:28px;">
        <tr>
          <td style="vertical-align:top;padding-right:24px;width:50%;">
            <p style="margin:0 0 6px;font-size:15px;font-weight:bold;color:#1a2e1a;">📍 Adresse</p>
            <p style="margin:0;font-size:14px;line-height:1.7;color:#4a5e4a;">
              Pension Volgenandt<br />
              Otto-Reuter-Straße 28<br />
              37327 Leinefelde-Worbis OT Breitenbach
            </p>
            <a href="https://www.google.com/maps/search/?api=1&query=Pension+Volgenandt+Otto-Reuter-Straße+28+37327+Leinefelde-Worbis"
               style="display:inline-block;margin-top:8px;font-size:13px;color:#2d4a2d;font-weight:600;text-decoration:underline;">
              In Google Maps öffnen →
            </a>
          </td>
          <td style="vertical-align:top;width:50%;">
            <p style="margin:0 0 6px;font-size:15px;font-weight:bold;color:#1a2e1a;">🚗 Anfahrt</p>
            <p style="margin:0;font-size:14px;line-height:1.7;color:#4a5e4a;">
              A38 Ausfahrt Leinefelde, Richtung Breitenbach – ca. 5 Minuten.<br />
              Kostenlose Parkplätze direkt vor dem Haus.
            </p>
          </td>
        </tr>
      </table>

      <hr style="border:none;border-top:1px solid #e5ebe5;margin:0 0 28px;" />

      <!-- WiFi -->
      <p style="margin:0 0 6px;font-size:15px;font-weight:bold;color:#1a2e1a;">📶 WLAN</p>
      <div style="background:#f4f7f4;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="color:#6b7280;font-size:14px;padding-right:16px;">Netzwerk</td>
            <td style="font-size:15px;font-weight:bold;color:#1a2e1a;font-family:monospace;">${WIFI_NAME}</td>
          </tr>
          <tr>
            <td style="color:#6b7280;font-size:14px;padding-right:16px;padding-top:6px;">Passwort</td>
            <td style="font-size:15px;font-weight:bold;color:#1a2e1a;font-family:monospace;padding-top:6px;">${WIFI_PASS}</td>
          </tr>
        </table>
      </div>

      <!-- Frühstück -->
      <p style="margin:0 0 6px;font-size:15px;font-weight:bold;color:#1a2e1a;">🥐 Frühstück</p>
      <p style="margin:0 0 12px;font-size:14px;line-height:1.7;color:#4a5e4a;">
        Frühstück bitte mindestens <strong>1 Tag vor der Anreise</strong> dazubuchen –
        einfach kurz per Nachricht oder telefonisch Bescheid geben.
      </p>
      <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:28px;">
        <tr>
          <td style="font-size:14px;color:#4a5e4a;padding:8px 0;border-bottom:1px solid #e5ebe5;">
            <strong style="color:#1a2e1a;">Frühstück</strong>
            <span style="display:block;color:#9ca3af;font-size:13px;margin-top:2px;">2 Brötchen, Käse- &amp; Wurst-Aufschnitt, Ei oder Joghurt, hausgemachte Marmelade, Kaffee oder Tee</span>
          </td>
          <td style="font-size:14px;font-weight:600;color:#1a2e1a;text-align:right;vertical-align:top;padding:8px 0;border-bottom:1px solid #e5ebe5;white-space:nowrap;">
            10 € / Person
          </td>
        </tr>
        <tr>
          <td style="font-size:14px;color:#4a5e4a;padding:8px 0;">
            <strong style="color:#1a2e1a;">Genießer-Frühstück</strong>
            <span style="display:block;color:#9ca3af;font-size:13px;margin-top:2px;">3 Brötchen, Käse- &amp; Wurst-Aufschnitt, Ei oder Joghurt, hausgemachte Marmelade, saisonales Obst, frischer Saft &amp; Kaffee oder Tee</span>
          </td>
          <td style="font-size:14px;font-weight:600;color:#1a2e1a;text-align:right;vertical-align:top;padding:8px 0;white-space:nowrap;">
            15 € / Person
          </td>
        </tr>
      </table>

      <hr style="border:none;border-top:1px solid #e5ebe5;margin:0 0 28px;" />

      <!-- Picknick-Korb -->
      <table cellpadding="0" cellspacing="0" style="width:100%;background:#fef9ec;border-radius:10px;margin-bottom:28px;">
        <tr>
          <td style="padding:20px 24px;">
            <p style="margin:0 0 4px;font-size:16px;font-weight:bold;color:#1a2e1a;">
              🧺 Picknick-Korb – ab 19 € pro Person
            </p>
            <p style="margin:0 0 12px;font-size:14px;line-height:1.7;color:#4a5e4a;">
              Regional &amp; hausgemacht, mit Geschirr und Decke. Entspannen Sie in unserem Garten,
              nehmen Sie den Korb auf einen Ausflug ins Eichsfeld mit oder genießen Sie Ihr
              Lieblingsplätzchen in der Natur – wir packen alles für Sie ein.
            </p>
            <a href="https://www.pension-volgenandt.de/picknick/"
               style="display:inline-block;background:#c07d2a;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:10px 20px;border-radius:8px;">
              Picknick-Korb bestellen →
            </a>
          </td>
        </tr>
      </table>

      <!-- Ausflugstipps -->
      <table cellpadding="0" cellspacing="0" style="width:100%;background:#f4f7f4;border-radius:10px;margin-bottom:32px;">
        <tr>
          <td style="padding:20px 24px;">
            <p style="margin:0 0 8px;font-size:16px;font-weight:bold;color:#1a2e1a;">
              🗺 Ausflugstipps fürs Eichsfeld
            </p>
            <a href="https://www.pension-volgenandt.de/ausflugsziele/"
               style="display:inline-block;color:#2d4a2d;font-size:14px;font-weight:600;text-decoration:underline;">
              Alle Ausflugsziele mit Beschreibungen ansehen →
            </a>
          </td>
        </tr>
      </table>

      <!-- Contact -->
      <p style="margin:0 0 4px;font-size:15px;font-weight:bold;color:#1a2e1a;">📞 Fragen?</p>
      <p style="margin:0 0 4px;font-size:14px;line-height:1.7;color:#4a5e4a;">
        Simone &amp; Ralf Volgenandt sind gerne für Sie da.
      </p>
      <p style="margin:0;font-size:14px;color:#4a5e4a;">
        Telefon: <a href="tel:+4916097719112" style="color:#2d4a2d;">+49 160 97719112</a>
        &nbsp;·&nbsp;
        E-Mail: <a href="mailto:kontakt@pension-volgenandt.de" style="color:#2d4a2d;">kontakt@pension-volgenandt.de</a>
      </p>

    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="padding:20px 40px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">
        Pension Volgenandt · Breitenbach · Eichsfeld ·
        <a href="https://www.pension-volgenandt.de" style="color:#9ca3af;">www.pension-volgenandt.de</a>
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>

</body>
</html>`
}

// ── Preview mode ─────────────────────────────────────────────────────────────
if (isPreview) {
  const planningDir = path.join(__dirname, '..', '.planning')
  if (!fs.existsSync(planningDir)) fs.mkdirSync(planningDir, { recursive: true })

  const outFile = path.join(planningDir, 'preview-arrival-email.html')
  fs.writeFileSync(outFile, buildHtml(), 'utf-8')
  console.log(`Preview saved: ${outFile}`)

  try {
    const open = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open'
    execSync(`${open} "${outFile}"`)
  } catch {
    console.log('Open manually in your browser.')
  }
  process.exit(0)
}

// ── Send mode ─────────────────────────────────────────────────────────────────
if (!toEmail) {
  console.error('Usage: node scripts/send-arrival-info.mjs --to "email" --name "Name" --arrival "Datum" --departure "Datum" [--room "Zimmer"]')
  console.error('       node scripts/send-arrival-info.mjs --preview')
  process.exit(1)
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? 'smtp.ionos.de',
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

await transporter.sendMail({
  from: `"Simone & Ralf Volgenandt" <${process.env.SMTP_USER}>`,
  to: toEmail,
  subject: `Ihre Anreiseinformationen – Pension Volgenandt`,
  html: buildHtml(),
})

console.log(`✓ Arrival info sent to ${toEmail}`)
