/**
 * Booking.com Extranet – Texte aktualisieren
 *
 * Öffnet den Browser, wartet auf manuellen Login,
 * dann werden die Beschreibungstexte eingefügt.
 *
 * Nutzt page.pause() – im Playwright Inspector auf "Resume" (▶) klicken
 * um zum nächsten Schritt zu gehen.
 *
 * Ausführen: node scripts/booking-update.mjs
 */
import { chromium } from 'playwright';

// ─── Texte (einheitlich mit Website) ───────────────────────────

const PROPERTY_DESCRIPTION = `Die Pension Volgenandt liegt eingebettet in die sanfte Hügellandschaft des Eichsfelds, etwa einen Kilometer außerhalb von Breitenbach – ein Ort, an dem die Zeit ein wenig langsamer vergeht.

Simone und Ralf Volgenandt heißen Sie in ihrem Zuhause herzlich willkommen. Ob Sie die Burgen und Wanderwege der Region erkunden, den nahen Bärenpark besuchen oder einfach die Stille genießen möchten – hier finden Sie den Ausgangspunkt für erholsame Tage.

Unsere Zimmer und Ferienwohnungen bieten Ihnen Platz, Komfort und einen Blick ins Grüne. Der große Garten mit Biotop, Obstbäumen und Blühwiese lädt zum Verweilen ein. Eine voll ausgestattete Gemeinschaftsküche, Terrasse mit Grillmöglichkeit und kostenfreies WLAN stehen allen Gästen zur Verfügung.

Wir bewirtschaften unser Haus mit Sorgfalt und Liebe zur Natur – mit Solarenergie vom eigenen Dach, Holzpelletsheizung, eigenem Brunnen und einer biologischen Kläranlage. Ihr Vierbeiner ist bei uns herzlich willkommen.`;

const ROOM_DESCRIPTIONS = {
  'Balkonzimmer': `Gemütliches Zweibettzimmer mit eigenem Balkon und Blick in den Innenhof. Zwei Einzelbetten, die auf Wunsch zusammengestellt werden, eigenes Badezimmer mit Dusche. Morgens genießen Sie Ihren Kaffee auf dem Balkon. WLAN und TV inklusive. Gemeinschaftsküche und Terrasse zur Mitbenutzung.`,

  'Rosengarten': `Charmantes Zweibettzimmer mit Blick auf den gepflegten Rosengarten. Zwei Einzelbetten (zusammenstellbar), eigenes Badezimmer mit Dusche, geschmackvolle Einrichtung im ländlichen Stil. Lassen Sie sich vom Duft der Rosen in den Schlaf wiegen. WLAN und TV inklusive. Schlafsofa für ein Kind auf Anfrage. Gemeinschaftsküche und Terrasse zur Mitbenutzung.`,

  'Wohlfühl-Appartement': `Geräumiges Appartement mit Doppelbett, eigener Küchenzeile (Wasserkocher, Kühlschrank, Spüle) und Balkon zum Innenhof. Eigenes Badezimmer mit Dusche. Zusätzliches Schlafsofa – ideal für Familien mit Kind. WLAN und TV inklusive. Alles, was Sie für einen komfortablen Aufenthalt brauchen.`,

  'Schöne Aussicht': `Großzügige Ferienwohnung mit Panoramablick über die Hügellandschaft des Eichsfelds. Zwei Schlafzimmer mit je einem Doppelbett und eigenem Badezimmer bieten Platz für bis zu 6 Gäste. Großer Wohnbereich mit voll ausgestatteter Küche und zusätzlichen Schlafsofas. Drei Badezimmer insgesamt. WLAN und TV inklusive. Perfekt für Familien und kleine Gruppen.`,
};

// ─── Main ──────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║  Booking.com Extranet – Texte aktualisieren          ║');
  console.log('║                                                      ║');
  console.log('║  Bei jedem Stopp: im Playwright-Inspector auf        ║');
  console.log('║  "Resume" (▶) klicken um fortzufahren.              ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 200,
    args: ['--start-maximized'],
  });
  const context = await browser.newContext({
    viewport: null,
    locale: 'de-DE',
  });
  const page = await context.newPage();

  // ── Step 1: Login ──
  console.log('🌐 Öffne Booking.com Extranet...');
  await page.goto('https://admin.booking.com');

  console.log('\n✋ STOPP 1: Bitte einloggen, dann im Inspector ▶ Resume klicken');
  await page.pause();

  // ── Step 2: Hotel ID ermitteln ──
  console.log('\n🔍 Suche Hotel-ID...');
  let hotelId = null;

  // Aus URL extrahieren
  const urlMatch = page.url().match(/hotel_id=(\d+)/);
  if (urlMatch) hotelId = urlMatch[1];

  // Aus Links auf der Seite
  if (!hotelId) {
    hotelId = await page.evaluate(() => {
      const link = document.querySelector('a[href*="hotel_id="]');
      if (link) {
        const m = link.href.match(/hotel_id=(\d+)/);
        return m ? m[1] : null;
      }
      const input = document.querySelector('input[name="hotel_id"]');
      return input ? input.value : null;
    }).catch(() => null);
  }

  if (hotelId) {
    console.log(`✅ Hotel-ID: ${hotelId}`);
  } else {
    console.log('⚠️  Hotel-ID nicht gefunden. Bitte manuell zur Beschreibungsseite navigieren.');
  }

  // ── Step 3: Objektbeschreibung ──
  console.log('\n📝 SCHRITT 1: Objektbeschreibung');
  console.log('─'.repeat(50));

  if (hotelId) {
    console.log('   Navigiere zur Beschreibungsseite...');
    await page.goto(
      `https://admin.booking.com/hotel/hoteladmin/extranet_ng/manage/property/description.html?hotel_id=${hotelId}&lang=de`,
      { timeout: 20000 }
    ).catch(() => {});
    await page.waitForLoadState('networkidle').catch(() => {});
  }

  // Versuche Textfeld zu finden und zu füllen
  let filled = await fillFirstTextarea(page, PROPERTY_DESCRIPTION, 'Objektbeschreibung');

  if (!filled) {
    console.log('   ⚠️  Kein Textfeld gefunden.');
    console.log('   → Navigiere manuell zur Beschreibung.');
    console.log('   → Text wird in Zwischenablage kopiert.');
    await clipboardCopy(page, PROPERTY_DESCRIPTION);
    console.log('\n✋ STOPP: Manuell navigieren + Strg+V, dann ▶ Resume');
    await page.pause();

    // Nochmal versuchen
    filled = await fillFirstTextarea(page, PROPERTY_DESCRIPTION, 'Objektbeschreibung');
    if (!filled) {
      console.log('   → Bitte manuell einfügen (Text ist in Zwischenablage)');
      console.log('\n✋ STOPP: Text einfügen + speichern, dann ▶ Resume');
      await page.pause();
    }
  }

  if (filled) {
    console.log('\n✋ STOPP: Bitte prüfen & speichern, dann ▶ Resume');
    await page.pause();
  }

  // ── Step 4: Zimmerbeschreibungen ──
  console.log('\n\n📝 SCHRITT 2: Zimmerbeschreibungen');
  console.log('─'.repeat(50));

  for (const [roomName, description] of Object.entries(ROOM_DESCRIPTIONS)) {
    console.log(`\n🏠 ${roomName}`);
    await clipboardCopy(page, description);
    console.log(`   📋 Text für "${roomName}" in Zwischenablage kopiert`);
    console.log(`   → Navigiere zum Zimmer "${roomName}" → Beschreibung`);
    console.log('\n✋ STOPP: Zum Zimmer navigieren, dann ▶ Resume');
    await page.pause();

    // Versuche Textfeld zu füllen
    const roomFilled = await fillFirstTextarea(page, description, roomName);
    if (!roomFilled) {
      console.log(`   → Strg+V zum Einfügen (Text ist in Zwischenablage)`);
    }

    console.log('\n✋ STOPP: Prüfen & speichern, dann ▶ Resume');
    await page.pause();
  }

  // ── Step 5: Fotos ──
  console.log('\n\n📸 SCHRITT 3: Titelbild');
  console.log('─'.repeat(50));
  console.log('   → Navigiere zu: Fotos');
  console.log('   → Ziehe die Außenansicht an Position 1 (Hauptbild)');
  console.log('\n✋ STOPP: Fotos sortieren, dann ▶ Resume');
  await page.pause();

  // ── Fertig ──
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  ✅ Fertig! Alle Texte aktualisiert.                 ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  await browser.close();
}

// ─── Helpers ───────────────────────────────────────────────────

async function fillFirstTextarea(page, text, label) {
  const selectors = [
    'textarea[name*="descr"]',
    'textarea[name*="hotel_description"]',
    'textarea[data-testid*="description"]',
    '#hotel_description',
    '#description',
    'textarea',
  ];

  for (const sel of selectors) {
    try {
      const els = await page.$$(sel);
      for (const el of els) {
        if (await el.isVisible().catch(() => false)) {
          await el.click();
          await page.keyboard.press('Control+A');
          await el.fill(text);
          console.log(`   ✅ "${label}" eingefügt!`);
          return true;
        }
      }
    } catch { /* weiter */ }
  }
  return false;
}

async function clipboardCopy(page, text) {
  try {
    await page.evaluate(async (t) => {
      await navigator.clipboard.writeText(t);
    }, text);
    return true;
  } catch {
    try {
      await page.evaluate((t) => {
        const ta = document.createElement('textarea');
        ta.value = t;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }, text);
      return true;
    } catch {
      console.log('   ⚠️  Zwischenablage nicht verfügbar. Text:');
      console.log(text);
      return false;
    }
  }
}

// ─── Run ───────────────────────────────────────────────────────

main().catch(err => {
  console.error('❌ Fehler:', err.message);
  process.exit(1);
});
