# Beds24 Implementation Plan - Pension Volgenandt

**Date:** 2026-03-01
**Source:** Owner discussion + live Beds24 audit (Playwright) + BEDS24-BACKUP-2026-03-01.md
**Reference:** BEDS24-BRANDING-AND-WIDGETS.md, BEDS24-OPTIMIZATION-GUIDE.md

---

## Core Strategy: Unify 3 Properties into 1

The current Beds24 setup splits what is physically one pension into 3 separate properties. This causes cascading problems: 3x branding, 3x auto actions, 3x invoicing, fragmented booking page, inconsistent guest experience. **Every change below assumes we first consolidate to 1 property.**

### Current (broken)

| Property | ID | Units | Problems |
|---|---|---|---|
| Pension Volgenandt | 261258 | Balkonzimmer, Rosengarten, Wohlfuehl-Appartement | Only these 3 show on booking page |
| Emil's Kuhwiese | 257613 | Emil's Kuhwiese | Separate booking page, separate settings |
| Schoene Aussicht | 257610 | Schoene Aussicht | Separate booking page, separate settings |
| _(missing)_ | - | Einzelzimmer | Not in Beds24 at all |

### Target (unified)

| Property | ID | Units (6 total) |
|---|---|---|
| Pension Volgenandt | 261258 | Einzelzimmer (NEW), Balkonzimmer, Rosengarten, Wohlfuehl-Appartement, Emil's Kuhwiese (MOVED), Schoene Aussicht (MOVED) |

**Single booking page:** `booking2.php?propid=261258` shows all 6 rooms.
**Single set of:** branding, auto actions, upsells, invoice template, property templates.

### Critical Bug Found: No Booking Button

**Verified via Playwright 2026-03-01:** The booking page has NO visible "Buchen" button. `Mehrfachbuchungen = Aktiviert` hides the booking action behind a tiny "Anzahl" dropdown that defaults to a placeholder. Guest must select "1" before any button appears. Since every room has exactly 1 unit, this dropdown is pointless and makes the page appear broken.

---

## Owner Decisions

| Topic | Decision | Action |
|-------|----------|--------|
| Seasonal pricing | Herbst -10%, Winter -20% | Follow owner |
| Cancellation | 7d free, 2-7d 50%, <2d 100% | Tiered policy |
| Upsell: Hund | 5 EUR/night (website price) | Fix in Beds24 |
| Upsell: Aufbettung | 10 EUR/person/night | Add new |
| Breakfast naming | Fruehstueck / Geniesser-Fruehstueck | Rename |
| Hausordnung | 100 EUR Strafe + Sachschaden | Create |
| Einzelzimmer | Weekend-only (Fr-So) | New unit + restriction (Beds24 + website) |
| Booking page header | Remove slideshow, branded top bar | New |
| Property structure | Unify to 1 property, all 6 rooms | Core change |
| Anzahlung | 100% bei Buchung (keep current) | No change needed |
| WLAN | Gaeste-WLAN / Pension_37327 | For auto action template |
| Steuernummer | 157/299/10837 | For invoice + E-Rechnung |
| Bankverbindung | Kreissparkasse Eichsfeld, DE28820570701106230767, BIC: HELADEF1EIC | For invoice |
| Google Bewertung | maps link (see Phase 6) | For review email |

---

## Part A: Website Code Changes (parallel)

### A1. Nachhaltigkeit text vertical alignment
- Add `items-center` to flex container on homepage

### A2. Schlafsofa description
- Change "fuer kleine Kinder" to "bspw. Kinder" in room YAML files

### A3. Einzelzimmer weekend-only note
- Add availability note to room page content
- Update Beds24 booking link with new unit ID once created
- **Also in Beds24:** Configure Check-in Tage = Freitag, Check-out Tage = Sonntag on the Einzelzimmer unit (see B2a)

---

## Part B: Beds24 Admin Changes

### Phase 1: Fix Booking + Unify Properties

This phase fixes the broken booking flow AND consolidates to 1 property. Do these together because the old properties will be deactivated anyway.

#### B1. Prepare: Document Current Booking.com Mappings

Before changing anything, record the exact Booking.com channel mappings:

| Beds24 Unit | Beds24 Property | Booking.com Link |
|---|---|---|
| Balkonzimmer (548066) | 261258 | Aktiviert |
| Rosengarten (549252) | 261258 | Aktiviert |
| Wohlfuehl-Appartement (549319) | 261258 | Aktiviert |
| Emil's Kuhwiese (541340) | 257613 | Aktiviert |
| Schoene Aussicht (541337) | 257610 | Aktiviert |

Also note all existing pricing rules, features, and upsell items from BEDS24-BACKUP-2026-03-01.md (already documented).

#### B2. Create New Units Under Property 261258

Create 3 new units under Pension Volgenandt (261258):

**a) Einzelzimmer (NEW - never existed in Beds24)**

| Setting | Value |
|---------|-------|
| Name | Einzelzimmer |
| Einheit Typ | Einzelzimmer |
| Anzahl dieses Typs | 1 |
| Max Gaeste | 1 |
| Max Erwachsene | 1 |
| Max Kinder | 0 |
| Mindestaufenthalt | 2 |
| Unterkunftstyp (DE) | Zimmer |
| Unterkunftstyp (EN) | room |

Weekend-only restriction:
- Check-in Tage = Freitag only
- Check-out Tage = Sonntag only

**b) Emil's Kuhwiese (recreate under 261258)**

| Setting | Value | Source |
|---------|-------|--------|
| Name | Ferienwohnung Emil's Kuhwiese | Copy from 541340 |
| Einheit Typ | Ferienwohnung | Same as original |
| Anzahl dieses Typs | 1 | Same |
| Max Gaeste | 4 | Same (website says 3, but Beds24 had 4) |
| Max Erwachsene | 2 | Same |
| Max Kinder | 2 | Same |
| Mindestaufenthalt | 2 | Same |
| Tage nach Check-out blockieren | 1 | Same as original |

Copy ALL features from original unit 541340 (see backup: GRILL, LINENS, PLAY_AREA_OUTDOOR, HEATING, etc.)

**c) Schoene Aussicht (recreate under 261258)**

| Setting | Value | Source |
|---------|-------|--------|
| Name | Ferienwohnung Schoene Aussicht | Copy from 541337 |
| Einheit Typ | Ferienwohnung | Same |
| Anzahl dieses Typs | 1 | Same |
| Max Gaeste | 6 | Same |
| Max Erwachsene | 6 | Same |
| Max Kinder | 4 | Same |
| Mindestaufenthalt | 2 | Same |
| Tage nach Check-out blockieren | 1 | Same as original |

Copy ALL features from original unit 541337 (see backup: full list of 38+ features including rooms/beds/bathrooms).

#### B3. Set Up Pricing for New Units

**Einzelzimmer:**
- Daily price rule 1: 50.00 EUR, Channel "Direkt + Agent", Offerte 1
- Daily price rule 2: +15% Booking.com
- Daily price rule 3: +20% Airbnb

**Emil's Kuhwiese (new unit):**
- Daily price rule 1: 70.00 EUR (base), Channel "Direkt + Agent", Offerte 1
- Daily price rule 2: +15% OTA (Booking.com)
- Daily price rule 3: +15% Summer strict (Booking.com)
- Daily price rule 4: +20% Airbnb
(Copy exact structure from original 541340)

**Schoene Aussicht (new unit):**
- Daily price rule 1: 120.00 EUR (base "Vier Personen"), Channel "Direkt + Agent", Offerte 1
- Daily price rule 2: +15% OTA (Booking.com)
- Daily price rule 3: +15% Summer strict (Booking.com)
- Daily price rule 4: +20% Airbnb
(Copy exact structure from original 541337)

#### B4. Re-map Booking.com Connections

**IMPORTANT FINDING:** Booking.com Hotel IDs are tied to Beds24 properties, NOT individual rooms. Each of the 3 Beds24 properties has its own Booking.com Hotel ID. You CANNOT simply remap room IDs across properties within Beds24. This requires coordinated action on the Booking.com Extranet.

**Approach (Booking.com Extranet + Beds24):**

1. **Booking.com Extranet:** Add "Ferienwohnung Emil's Kuhwiese" and "Ferienwohnung Schoene Aussicht" as new room types under the existing Pension Volgenandt Booking.com Hotel ID (the one connected to Beds24 property 261258)
2. **Beds24:** On property 261258, go to Channel Manager > Booking.com > click "Get Codes" to retrieve the new Booking.com room IDs
3. **Beds24:** Map the new Emil's Kuhwiese and Schoene Aussicht units (under 261258) to these new Booking.com room IDs
4. **Booking.com Extranet:** Close availability on the OLD standalone listings for Emil's Kuhwiese (257613) and Schoene Aussicht (257610). Do NOT delete yet — wait for existing bookings to complete
5. **Beds24:** Verify all 5 OTA rooms sync correctly (calendar, prices, availability) under property 261258
6. **After all old bookings completed:** Close/deactivate the old Booking.com listings entirely

**Gotchas (from Beds24 docs):**
- Disconnecting in Beds24 does NOT close the Booking.com listing — it stays bookable → risk of overbookings
- Deleting prices in Beds24 does NOT delete them on Booking.com
- Each Booking.com room ID can only be mapped to ONE Beds24 room — never duplicate
- Consider filing a Beds24 support ticket before starting this step

**Owner:** Owner will help with Booking.com Extranet login if needed.

#### B5. Deactivate Old Properties

Once Booking.com and all channels are confirmed working on the new units:
1. Block all dates on old units (541340, 541337) to prevent new bookings
2. Keep old properties (257613, 257610) until all existing bookings on them have checked out
3. After last checkout, deactivate the old properties

**Do NOT delete** - keep them deactivated in case you need to reference historical bookings or channel data.

#### B6. Disable Mehrfachbuchungen

**Location:** Buchungsmaschine > Buchungsseite Unterkunft > Anzeige
**Setting:** `Mehrfachbuchungen` = `Deaktiviert`
**Apply to:** Property 261258 (the only one remaining)

This immediately fixes the broken booking flow: each room gets a direct "Buchen" button instead of the hidden "Anzahl" dropdown.

#### B7. Booking Page Display Settings

Configure on property 261258 (now the only property):

| Setting | Value | Why |
|---------|-------|-----|
| Mehrfachbuchungen | Deaktiviert | Show direct Buchen button |
| Nicht verfuegbare Einheiten | Verstecken | Don't show booked rooms |
| Preisanzeige (Nächte) | Pro Nacht | Match website "ab XX EUR/Nacht" |
| Preisanzeige (Person) | Pro Einheit | Per room, not per person |
| Standard Nächte | 2 | Match minimum stay |
| Standard Erwachsene | 2 | Most common |
| Limit Einheiten anzeigen | 10 | Show all rooms |
| Buchungen erlauben | Anfragen und Buchungen zulassen | Keep |

#### B8. Room Display Order

| Position | Room | Verkaufsprioritaet |
|----------|------|--------------------|
| 1 | Ferienwohnung Emil's Kuhwiese | 1 |
| 2 | Ferienwohnung Schoene Aussicht | 2 |
| 3 | Wohlfuehl-Appartement | 3 |
| 4 | Balkonzimmer | 4 |
| 5 | Rosengarten | 5 |
| 6 | Einzelzimmer | 6 |

#### B9. Set Up Upsell Items (once, on property 261258)

Now only need to configure upsells ONCE instead of 3 times:

| # | Name (DE) | Amount | Per | Period | VAT | Available on |
|---|-----------|--------|-----|--------|-----|-------------|
| 1 | Fruehstueck | 10 EUR | Person | taeglich | 19% | All 6 rooms |
| 2 | Geniesser-Fruehstueck | 15 EUR | Person | taeglich | 19% | All 6 rooms |
| 3 | Hund | 5 EUR | Buchung | taeglich | 19% | Balkon, Wohlfuehl, Emil's (NOT Rosengarten, Schoene Aussicht, Einzelzimmer) |
| 4 | Grill-Set | 10 EUR | Buchung | einmalig | 19% | All 6 rooms |
| 5 | Aufbettung | 10 EUR | Person | taeglich | 19% | Rosengarten, Wohlfuehl, Emil's, Schoene Aussicht |

**German descriptions:**
- 1: "Broetchen, Brotbelag, hausgemachte Marmelade & Kaffee oder Tee"
- 2: "Broetchen, regionale Wurstspezialitraeten, hausgemachte Marmelade, saisonales Obst, frischer Saft & Kaffee oder Tee"
- 3: "Ihr Vierbeiner ist bei uns herzlich willkommen"
- 4: "Inkl. Grillbesteck und -pfannen"
- 5: "Zusaetzlicher Schlafplatz auf dem Schlafsofa"

#### B10. Verify Everything Works

- [ ] `booking2.php?propid=261258&lang=de` shows all 6 rooms
- [ ] Each room has a visible "Buchen" button (no Anzahl dropdown)
- [ ] Clicking "Buchen" proceeds to checkout
- [ ] Prices are correct for each room
- [ ] Booking.com calendar syncs correctly for all 5 OTA rooms
- [ ] Existing bookings on old properties are not affected
- [ ] Upsell items appear correctly per room

---

### Phase 2: Booking Page Branding

Now that we have 1 property, branding is done **once**.

#### B11. Custom Header (Replace Image Slideshow)

**Current:** Large image slideshow (generic, wastes space)
**Target:** Slim branded top bar matching pension-volgenandt.de

```
+-----------------------------------------------------------------------+
| [Logo: "Pension Volgenandt"]     [Subtitle: "Buchungsseite"]  [Phone] |
| [Tagline: "Ruhe finden im Eichsfeld"]                                |
+-----------------------------------------------------------------------+
```

**Design (matching AppHeader.vue):**
- Background: `#1c1f23` (charcoal-900)
- Logo: "Pension Volgenandt" in Lora serif, bold, white, ~20px
- Tagline: "Ruhe finden im Eichsfeld" in DM Sans, `#a6c9a6` (sage-300), ~12px
- Right: "Buchungsseite" in DM Sans, `#c8dfc8` (sage-200) + phone number

**CSS to hide slideshow + custom header HTML:** Inject via Developer > HTML HEAD / Individuelles CSS. Test exact selectors against live DOM.

```css
/* Hide default slideshow */
.b24-top-image-slider, .b24-property-images,
#propertyslider, .bk2-slider-container { display: none !important; }
```

```html
<div id="pension-header" style="background:#1c1f23;padding:16px 24px;display:flex;justify-content:space-between;align-items:center;font-family:'DM Sans',sans-serif;margin:-20px -20px 20px -20px;width:calc(100% + 40px)">
  <div>
    <div style="font-family:'Lora',Georgia,serif;font-weight:700;font-size:20px;color:#fff">Pension Volgenandt</div>
    <div style="font-size:12px;color:#a6c9a6;margin-top:2px">Ruhe finden im Eichsfeld</div>
  </div>
  <div style="display:flex;align-items:center;gap:24px">
    <span style="font-size:14px;color:#c8dfc8;font-weight:500">Buchungsseite</span>
    <a href="tel:+4916097719112" style="font-size:14px;color:#c8dfc8;text-decoration:none">0160 97719112</a>
  </div>
</div>
```

#### B12. Apply Branding (Colors, Fonts, CSS)

**Style Settings (Admin > Buchungsseite Unterkunft > Style):**

| Setting | Value | Token |
|---|---|---|
| Hintergrundfarbe Seite | `#fdfcf8` | warm-white |
| Hintergrundfarbe Content | `#fdfcf8` | warm-white |
| Textfarbe | `#234024` | sage-800 |
| Linkfarbe | `#5d8f5e` | sage-500 |
| Rahmenfarbe | `#c8dfc8` | sage-200 |
| Highlight | `#f8f5ee` | cream |
| Formular Hintergrund | `#ffffff` | white |
| Button Stil | flat | - |
| Button Farbe | `#865725` | waldhonig-500 |
| Button Textfarbe | `#ffffff` | white |
| Schriftart | DM Sans | - |
| Schriftgroesse | 16px | - |

**Google Fonts (Developer > HTML HEAD top):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Lora:wght@600;700&display=swap" rel="stylesheet">
```

**Custom CSS (Developer > Individuelles CSS):**
```css
h1,h2,h3,h4,h5,h6 { font-family:'Lora',Georgia,serif !important; font-weight:600; }
.btn,button,input,select,textarea { border-radius:8px !important; }
.btn-primary:hover,.book-button:hover { background-color:#71481d !important; }
input:focus,select:focus,textarea:focus { border-color:#5d8f5e !important; box-shadow:0 0 0 2px rgba(93,143,94,.25) !important; outline:none !important; }
a:hover { color:#456f46 !important; }
```

---

### Phase 3: Room Images

Upload website images to each unit. Location: Unterkuenfte > Pension Volgenandt > [Unit] > Bilder

For each room: delete old images, upload in order (first = hero), set German captions.

| Room | Source files | # Images | Notes |
|------|-------------|----------|-------|
| Einzelzimmer | `einzelzimmer-*.jpg` | 3 | Missing room photo - need new photo |
| Balkonzimmer | `balkonzimmer-*.jpg` | 7 of 10 | Select best: balcony, beds, bathroom, kitchen |
| Rosengarten | `rosengarten-*.jpg` | 7 | Hero, room, bathroom, garden views, kitchen |
| Wohlfuehl-App. | `wohlfuehl-appartement-*.jpg` | 6 | Hero, kitchenette, bathroom, balcony, kitchen |
| Emil's Kuhwiese | `emils-kuhwiese-*.jpg` | 3 | Need more photos (kitchen, terrace, garden) |
| Schoene Aussicht | `schoene-aussicht-*.jpg` | 7 | Living, play area, bedrooms, dining |

All source images in `/public/img/rooms/`.

---

### Phase 4: Room Descriptions & Texts

Replace generic pension-level descriptions with room-specific content from the website.

#### Room Descriptions (per unit)

**Einzelzimmer:**
> Kompaktes Einzelzimmer - ideal fuer Alleinreisende. Eigenes Badezimmer mit Dusche. Zugang zur Gemeinschaftskueche. Nur am Wochenende buchbar (Freitag bis Sonntag).
> - 1 Gast | Einzelbett | Eigenes Bad | ab 50 EUR/Nacht

**Balkonzimmer:**
> Gemuetliches Zweibettzimmer mit eigenem Balkon und Blick in den ruhigen Innenhof. Zwei Einzelbetten koennen zu einem Doppelbett zusammengestellt werden. Eigenes Badezimmer mit Dusche.
> - Bis zu 2 Gaeste | Eigener Balkon | 2 Einzelbetten (verbindbar) | ab 58 EUR/Nacht

**Rosengarten:**
> Charmantes Zweibettzimmer mit Blick auf unseren wunderschoenen Rosengarten. Laendlich eingerichtet mit viel Liebe zum Detail. Auf Wunsch Aufbettung per Schlafsofa moeglich.
> - Bis zu 3 Gaeste | Rosengarten-Blick | 2 Einzelbetten + Schlafsofa | ab 58 EUR/Nacht

**Wohlfuehl-Appartement:**
> Komfortables Appartement mit eigener Kuechenzeile direkt im Zimmer - Wasserkocher, Mini-Kuehlschrank und Spuele. Doppelbett und Schlafsofa bieten Platz fuer bis zu 3 Gaeste. Eigener Balkon zum Innenhof.
> - Bis zu 3 Gaeste | Kuechenzeile im Zimmer | Balkon | ab 65 EUR/Nacht

**Emil's Kuhwiese:**
> Gemaechliche Ferienwohnung mit eigener Kueche fuer Selbstversorger und privater Terrasse mit Gartenblick. Doppelbett und Schlafsofa bieten Platz fuer bis zu 3 Gaeste. Hunde willkommen.
> - Bis zu 3 Gaeste | Eigene Kueche | Terrasse | Haustierfreundlich | ab 73 EUR/Nacht

**Schoene Aussicht:**
> Grosszuegige Ferienwohnung mit Panoramablick ueber die Eichsfelder Huegellandschaft. Zwei Schlafzimmer mit eigenem Bad, geraemiger Wohnbereich mit Kueche. Perfekt fuer Familien.
> - Bis zu 6 Gaeste | 2 Schlafzimmer mit Bad | Panoramablick | ab 126 EUR/Nacht

#### Property-Level Description (Buchungsseite 1)

> Willkommen bei Pension Volgenandt - Ihr Zuhause im Eichsfeld. Unsere familiegefuehrte Pension liegt eingebettet in einen 25.000m2 grossen Garten zwischen Breitenbach und Hundeshagen. Waehlen Sie Ihr Wunschzimmer und buchen Sie direkt - zum besten Preis, ohne Vermittlungsgebuehren.

#### Booking Page Content Sections

| Section | Content |
|---------|---------|
| Stornobedingungen | Kostenlose Stornierung bis 7 Tage vor Anreise. 2-7 Tage vorher: 50% Gebuehr. Weniger als 2 Tage / Nichtanreise: 100%. |
| Bestaetigung | Vielen Dank! Sie erhalten eine Bestaetigung per E-Mail. Fragen? 0160 97719112 oder Kontakt@pension-volgenandt.de |
| Nicht verfuegbar | Dieses Zimmer ist im gewaehlten Zeitraum belegt. Probieren Sie andere Termine oder rufen Sie uns an: 0160 97719112 |
| Keine Einheiten | Leider keine Zimmer verfuegbar. Rufen Sie uns an: 0160 97719112 |
| Kein Preis | Fuer diesen Zeitraum liegt kein Preis vor. Kontaktieren Sie uns: Kontakt@pension-volgenandt.de |

---

### Phase 5: Invoice

Rebuild to match the existing invoice format (see RECHNUNG_202601019.pdf).

#### B13. Invoice Template (Property 261258)

**Header:**
```
Zimmervermietung Ralf Volgenandt
Otto-Reutter-Str. 28
37327 Leinefelde-Worbis
Telefon: 03605/542775
kontakt@pension-volgenandt.de
www.pension-volgenandt.de
```

**Document title:** "Rechnung"

**Meta fields (3 columns):**
| Rechnungsnummer | Liefer-/Leistungsdatum | Rechnungsdatum |

**Intro line:** "Unsere Leistungen stellen wir Ihnen wie folgt in Rechnung:"

**Line items table:**
| Rechnungspositionen | Anzahl | Einzelpreis | Steuersatz | Gesamt |

- Uebernachtung [Zimmer]: X Tag, price, **7% USt** (accommodation = 7%)
- Fruehstueck/Extras: Y Stueck, price, **19% USt** (food/services = 19%)
- Uebernachtungszeitraum: Anreise/Abreise dates, 0%, 0.00 EUR (info line)

**Tax breakdown:**
```
Nettobetrag                    XXX,XX EUR
0% USt von Netto: X,XX EUR      0,00 EUR
19% USt von Netto: X,XX EUR     X,XX EUR
7% USt von Netto: X,XX EUR      X,XX EUR
Gesamtbetrag                   XXX,XX EUR
```

**Payment terms:** "Zahlbar bis zum [Anreisedatum] ohne Abzug."
**Closing:** "Vielen Dank fuer Ihre Reservierung!"

**Footer:**
```
Steuernr.: 157/299/10837
Kreissparkasse Eichsfeld
DE28820570701106230767
BIC: HELADEF1EIC
```

**VAT rates:**
- Accommodation (Uebernachtung): **7%** (reduced rate for short-term accommodation in Germany)
- Breakfast, pet fee, BBQ, extras: **19%** (standard rate)

#### B14. E-Invoice Section (Property 261258)

| Field | Value |
|-------|-------|
| Name | Zimmervermietung Ralf Volgenandt |
| Strasse | Otto-Reutter-Str. 28 |
| PLZ | 37327 |
| Stadt | Leinefelde-Worbis |
| Land | Deutschland |
| Steuernummer | 157/299/10837 |
| Telefon | 03605/542775 |
| E-Mail | kontakt@pension-volgenandt.de |
| IBAN | DE28820570701106230767 |
| BIC | HELADEF1EIC |
| Bank | Kreissparkasse Eichsfeld |

Now done ONCE on property 261258 instead of 3 times.

---

### Phase 6: Auto Actions

All on property 261258 (one set instead of three):

| # | Action | Trigger | Content |
|---|--------|---------|---------|
| B15 | Buchungsbestaetigung | On booking, direct, confirmed | Details, check-in info, cancellation, payment link |
| B16 | Anreise-Info | Check-in -2 days | Check-in time, Anfahrt, WLAN, Parken, Hausordnung |
| B17 | Zahlungserinnerung | Check-in -7 days, balance > 0 | Outstanding amount, payment link |
| B18 | Rechnungsnummer | Check-in day | Assign sequential invoice number |
| B19 | Rechnung senden | Check-out day | Invoice PDF (needs B13 + B18) |
| B20 | Bewertungsanfrage | Check-out +1 day | Google review link (see below), DANKE5 code |

**Google Review Link:** https://www.google.com/maps/place/Pension+Volgenandt/@51.4122701,10.3194437,17z/data=!3m1!4b1!4m9!3m8!1s0x47a4e7f6898bd1e7:0xba82640946e15fd5!5m2!4m1!1i2!8m2!3d51.4122668!4d10.322024!16s%2Fg%2F1hm5njfj8?entry=ttu

**Prerequisites (do first):**

Property Templates (one set on 261258):
- Template 1 (Parken): "Kostenfreie Parkplaetze direkt am Haus."
- Template 2 (WLAN): "Gaeste-WLAN / Pension_37327"
- Template 3 (Anfahrt): "A38 Abfahrt Leinefelde, Richtung Zentrum. Otto-Reutter-Str. 28."
- Template 4 (Hausordnung): See below

**Hausordnung:**
```
HAUSORDNUNG - Pension Volgenandt
1. Ruhezeiten: 22:00 - 07:00 Uhr
2. Rauchen in allen Raeumen strengstens untersagt.
3. Haustiere nur nach Anmeldung, 5 EUR/Nacht.
4. Check-in: ab 14:00 | Check-out: bis 11:00
5. Einrichtung bitte pfleglich behandeln.
6. Parken: Kostenfreie Parkplaetze am Haus.
7. Muell bitte trennen.
Bei Verstoessen: 100 EUR Vertragsstrafe. Sachschaeden zum Zeitwert.
```

---

### Phase 7: Seasonal Pricing — PARTIALLY COMPLETE

| Saison | Zeitraum | Anpassung |
|--------|----------|-----------|
| Fruehling/Sommer | Apr - Sep | Basispreis |
| Herbst | Okt - Nov | -10% |
| Winter | Dez - Maer | -20% |

**Actual prices used** (based on real base prices, not plan's theoretical prices):

| Zimmer | Basis | Herbst (-10%) | Winter (-20%) |
|--------|-------|---------------|---------------|
| Einzelzimmer (656178) | 50 | 45 | 40 |
| Balkonzimmer (548066) | 55 | 50 | 44 |
| Rosengarten (549252) | 55 | 50 | 44 |
| Wohlfuehl-App. (549319) | 65 | 59 | 52 |
| Emil's Kuhwiese (656179) | 70 | 63 | 56 |
| Schoene Aussicht (656180) | 120 | 108 | 96 |

**Done:** Winter Mar 2026, Herbst Oct-Nov 2026, Winter Dec 2026-Mar 2027 — all verified on booking page.
**TODO:** Base prices Apr-Sep 2027 for 5 rooms (all except Schoene Aussicht). See BEDS24-PHASE1-COMPLETED.md for technical details on the datepicker issue blocking automated saves for this period.

---

### Phase 8: Booking Engine Settings

| Setting | Value | Notes |
|---------|-------|-------|
| Anzahlung 1 | 100% (keep) | Full payment at booking, no change |
| Regulaere Buchungen Buchungstyp | Bestaetigt mit Anzahlung 1 - ueber Zahlungsdienstleister | 100% paid via PayPal at booking |
| Stornierung | Tiered policy text (see Phase 4) | Update cancellation text |
| Gutscheincode | DANKE5 = 5% discount | New |

---

### Phase 9: Airbnb

1. Channel Manager > Add Channel > Airbnb
2. Authorize Beds24
3. Map each room to existing Airbnb listing
4. Verify 120% multiplier active
5. Einzelzimmer: probably not on Airbnb (too small)

---

## Execution Order

```
Phase 1: FIX BOOKING + UNIFY ────────── (B1-B10)    ✅ DONE
Phase 2: Branding ────────────────────── (B11, B12)  ✅ DONE
Phase 3: Room Images ─────────────────── external     ✅ DONE (website photos)
Phase 4: Room Texts ──────────────────── descriptions  ✅ DONE
Phase 5: Invoice ─────────────────────── (B13, B14)  ✅ DONE
Phase 6: Auto Actions ────────────────── (B15-B20)   ✅ DONE
Phase 7: Seasonal Pricing ────────────── all 6 rooms  ⚠️ PARTIAL (Herbst/Winter done, Base Apr-Sep 2027 needs fix for 5 rooms)
Phase 8: Booking Engine ──────────────── cancellation, deposit, voucher  ❌ NOT STARTED
Phase 9: Airbnb ──────────────────────── channel connection              ❌ NOT STARTED

Website: A1, A2, A3 ─────────────────── parallel                        ❌ NOT STARTED
```

---

## Deferred

| Item | Why |
|------|-----|
| Stripe payment | Owner didn't request |
| Weekend surcharges | Owner didn't request |
| Yield optimizer | Owner didn't request |
| Length-of-stay discounts | Owner didn't request |

---

## Resolved Questions

| # | Question | Answer |
|---|----------|--------|
| 1 | WLAN-Zugangsdaten | Gaeste-WLAN / Pension_37327 |
| 2 | Steuernummer | 157/299/10837 |
| 3 | Anzahlung | 100% bei Buchung (keep current) |
| 4 | Google Bewertungslink | Maps link added to Phase 6 |
| 5 | Aufbettung | Rosengarten, Wohlfuehl, Emil's, Schoene Aussicht (confirmed) |
| 6 | Einzelzimmer Foto | Later (skip in Phase 3 for now) |
| 7 | Emil's Kuhwiese Fotos | Yes, but later |
| 8 | Booking.com Re-mapping | Requires Booking.com Extranet action (see B4 details). Owner will help with login. |

## Remaining Open Questions

1. **Booking.com Extranet login:** Owner to provide access when Phase 1 B4 is reached
2. ~~**Invoice numbering scheme:** Current format is YYYYMM### (e.g. 202601019). Keep this or change?~~ **RESOLVED: Keep YYYYMM### format**

---

_Plan created: 2026-03-01_
_Updated: 2026-03-01 - Unified around single-property strategy, fixed broken booking bug_
_Updated: 2026-03-01 - All open questions resolved, invoice template from PDF, Booking.com research (Extranet required), WLAN/Steuernr/bank details added, 100% deposit confirmed_
_Updated: 2026-03-01 - Phases 1-6 complete. Room images updated. Phase 7 seasonal pricing partially complete (Herbst/Winter done, Base Apr-Sep 2027 blocked by datepicker bug for 5 rooms)_
