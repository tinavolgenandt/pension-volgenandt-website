# Beds24 Phase 1 - Completed Changes

**Date:** 2026-03-01 / 2026-03-02
**Scope:** Fix Booking + Unify Properties (B1-B10)
**Reference:** BEDS24-IMPLEMENTATION-PLAN.md, BEDS24-BACKUP-2026-03-01.md

---

## What Was Done

### B1. Documented Current Booking.com Mappings

Recorded all existing Booking.com channel mappings before making changes. All 5 units (Balkonzimmer, Rosengarten, Wohlfuehl-Appartement, Emil's Kuhwiese, Schoene Aussicht) had active Booking.com sync. Full backup saved in `BEDS24-BACKUP-2026-03-01.md`.

### B2. Created 3 New Units Under Property 261258

Added 3 units to Pension Volgenandt (261258) so all rooms live under one property:

| Unit | ID | Type | Max Guests | Max Adults | Max Children |
|------|----|------|------------|------------|--------------|
| Einzelzimmer | 656178 | Einzel | 1 | 1 | 0 |
| Ferienwohnung Emil's Kuhwiese | 656179 | Doppel | 4 | 2 | 2 |
| Ferienwohnung Schoene Aussicht | 656180 | Ferienwohnung | 6 | 6 | 4 |

Settings replicated from original units (min stay 2, max stay 365, restriction Stay Through, etc.). Emil's Kuhwiese and Schoene Aussicht have 1-day block after checkout.

### B3. Set Up Pricing for New Units

**Price Rules (4 per unit):**

| Rule | Name | Adjustment | Channels |
|------|------|------------|----------|
| 1 | Base (Doppelzimmer/Vier Personen) | Base price | Direkt + Agent |
| 2 | OTA's | +15% linked to Rule 1 | Booking.com + other OTAs |
| 3 | Summer strict | +15% linked to Rule 1 | Booking.com only |
| 4 | AirBnB | +20% linked to Rule 1 | Airbnb only |

Channel configurations matched exactly to the original units.

**Daily Prices Set (March 2026 - March 2027):**

| Unit | Base Price/Night |
|------|-----------------|
| Einzelzimmer | EUR 50.00 |
| Emil's Kuhwiese | EUR 70.00 |
| Schoene Aussicht | EUR 120.00 |

### B6. Disabled Mehrfachbuchungen

Changed `Mehrere buchen` from **Aktiviert** to **Deaktiviert** on property 261258.

**Why this matters:** The old setting hid the booking button behind a confusing "Anzahl" dropdown. Guests had to select "1" from a dropdown before any "Buchen" button appeared. Since every room has exactly 1 unit, this dropdown was pointless and made the page look broken. Now a clear "Buchen" button appears directly on each available room.

Setting location: Buchungsmaschine > Buchungsseite Unterkunft > Konfiguration (`pagetype=bookingpagedesign2`)

### B7. Verified Booking Page Display Settings

All display settings on property 261258 already matched the target configuration:

| Setting | Value |
|---------|-------|
| Art Preise | pro Einheit |
| Art Gesamtpreis | Gesamt fuer alle Naechte |
| Standard Naechte | 2 |
| Anzahl Gaeste | 2 |
| Mindestanzahl Naechte | 2 |
| Maximale Anzahl Gaeste | Max. Belegung |
| Maximale Einheiten pro Seite | 10 |
| Reihenfolge Einheiten | Verkaufsprioritaet |
| Typ Buchungsseite | Anfragen und Buchungen zulassen |
| Extra Marketingspalte | Nein |

No changes needed.

### B8. Verified Room Display Order

Room order uses Verkaufsprioritaet (all units set to priority 5). No changes needed.

### B9. Updated Upsell Items

Reconfigured all 5 upsell items on property 261258:

| # | Old Name | New Name | Price | Per | Period | VAT |
|---|----------|----------|-------|-----|--------|-----|
| 1 | Normales Fruehstueck | Fruehstueck | 10.00 | Person | taeglich | 19% |
| 2 | Fruehstueck Deluxe | Geniesser-Fruehstueck | 15.00 | Person | taeglich | 19% |
| 3 | Haustier (10 EUR, einmalig) | Hund (5 EUR, taeglich) | 5.00 | Buchung | taeglich | 19% |
| 4 | BBQ Set | Grill-Set | 10.00 | Buchung | einmalig | 19% |
| 5 | _(unused)_ | Aufbettung **(NEW)** | 10.00 | Person | taeglich | 19% |

**Key changes:**
- All items renamed to match owner's preferred naming
- VAT changed from 0% to 19% on all items
- Hund: price reduced 10 -> 5 EUR, period changed einmalig -> taeglich (matches website price)
- New descriptions added (DE + EN) with specific details about each item
- Aufbettung added as new optional upsell for sofa bed sleeping places

### B10. Verified Booking Page

Confirmed at `booking2.php?propid=261258&lang=de&numnight=2&numadult=2`:

- All 6 rooms visible on one page
- "Buchen" buttons appear directly (no more hidden Anzahl dropdown)
- Prices correct: Rosengarten EUR 110 (55x2), Emil's EUR 140 (70x2), Schoene Aussicht EUR 240 (120x2)
- Unavailable rooms show correct status (Balkonzimmer: "Nicht verfuegbar", Einzelzimmer: "Maximale Belegung ueberschritten" for 2-adult search)

---

### B4. Re-mapped Booking.com Connections (DONE 2026-03-01)

Created 2 new room types in Booking.com Extranet under Pension Volgenandt (Hotel ID 8065762):

| Unit | Beds24 ID | Booking.com Room Type | Booking.com ID |
|------|-----------|-----------------------|----------------|
| Ferienwohnung Emil's Kuhwiese | 656179 | One-Bedroom Apartment with Balcony | 806576204 |
| Ferienwohnung Schoene Aussicht | 656180 | Two-Bedroom Apartment with View | 806576205 |

Configured in Beds24 Channel Manager > Booking.com:
- Set Einheit IDs (806576204, 806576205) and Rate Plan ID (25043745)
- Activated sync for both units
- Set Booking.com rate codes on all OTA (+15%) and Summer strict (+15%) price rules
- Also fixed missing rate code on Wohlfuehl-Appartement OTA rule
- Triggered initial sync updates

**Final Booking.com mapping (Pension Volgenandt - 261258):**

| Unit | Beds24 ID | Einheit ID | Rate Plan | Status |
|------|-----------|------------|-----------|--------|
| Balkonzimmer | 548066 | 806576202 | 25043745 | Aktiviert |
| Rosengarten Zimmer | 549252 | 806576201 | 25043745 | Aktiviert |
| Wohlfuehl-Appartement | 549319 | 806576203 | 25043745 | Aktiviert |
| Einzelzimmer | 656178 | - | - | Deaktiviert |
| FW Emil's Kuhwiese | 656179 | 806576204 | 25043745 | Aktiviert |
| FW Schoene Aussicht | 656180 | 806576205 | 25043745 | Aktiviert |

### B5. Deactivated Old Properties (DONE 2026-03-01)

Deactivated Booking.com sync on old standalone properties:
- Ferienwohnung Emil's Kuhwiese (257613) - unit 541340 - Hotel 8447794 → Deaktiviert
- Ferienwohnung Schoene Aussicht (257610) - unit 541337 - Hotel 7474517 → Deaktiviert

Properties kept in Beds24 for historical booking data. Old Booking.com hotel listings (8447794, 7474517) should be closed separately in Booking.com Extranet when ready.

---

## Phase 1 - FULLY COMPLETE

All tasks B1-B10 are done.

### Before
- 3 separate properties, 3 separate booking pages
- No Einzelzimmer in Beds24
- Broken booking button (hidden behind Anzahl dropdown)
- Upsell items: wrong names, wrong prices, no VAT, no Aufbettung
- Emil's Kuhwiese and Schoene Aussicht on separate Booking.com hotel IDs

### After
- 1 unified property (261258) with all 6 rooms
- Single booking page showing all rooms with working "Buchen" buttons
- Correct pricing with OTA markup rules
- Updated upsell items with proper names, prices, and 19% VAT
- New Aufbettung upsell option
- All 5 rooms synced to Booking.com under single Hotel ID 8065762
- Old standalone properties deactivated

---

## Phase 2 - COMPLETED (2026-03-01)

### B11. Custom Header (Replace Image Slideshow)

Injected via Developer page (`bookingpagedesigndeveloper`) on property 261258:

**HTML HEAD top (`customheadtop`):** Google Fonts (DM Sans + Lora)
**HTML BODY top (`custombodytop`):** Custom branded header div with:
- Background: #1c1f23 (charcoal-900)
- "Pension Volgenandt" in Lora serif, white
- "Ruhe finden im Eichsfeld" tagline in sage-300
- "Buchungsseite" label + phone number (0160 97719112)

**Custom CSS (`bookingcss`):**
- Hide default property slideshow (`.b24-top-image-slider`, `#propertyslider`, etc.)
- Hide property-level carousel (`#carousel-generic-p261258`)
- Hide broken logo image (`img[src*="pension-volgenandt.de/s/misc/logo"]`)
- Lora serif for headings, 8px border-radius on inputs/buttons
- Button hover (#71481d), focus states (sage border + shadow), link hover (#456f46)

### B12. Apply Branding (Colors, Fonts, CSS)

Style settings (`bookingpagedesignstyle`) on property 261258:

| Setting | Value |
|---------|-------|
| Hintergrundfarbe Seite | fdfcf8 |
| Hintergrundfarbe Content | fdfcf8 |
| Textfarbe | 234024 |
| Linkfarbe | 5d8f5e |
| Rahmenfarbe | c8dfc8 |
| Highlight (strip from/to) | f8f5ee |
| Highlight Text | 234024 |
| Formular Hintergrund | ffffff |
| Button Stil | flat |
| Button Farbe | 865725 |
| Button Textfarbe | ffffff |
| Schriftgroesse | 16px |

### Room Images Fix

- Removed broken logo.jpeg URL from property external images (pic_261258_11)
- Set external images for new rooms:
  - Einzelzimmer (656178): 4 website images (pension-volgenandt.de)
  - Emil's Kuhwiese (656179): 10 Airbnb images from old property 257613
  - Schoene Aussicht (656180): 10 Airbnb images from old property 257610
- External images saved but may need Beds24 cache refresh to appear
- CSS hides broken fallback images; rooms show property-level photos as interim

---

## Phase 4 - COMPLETED (2026-03-01)

### Room Descriptions (roomsdescription pages)

Set `roomdescDE` for all 6 units:

| Unit | ID | Description Summary |
|------|----|-------------------|
| Balkonzimmer | 548066 | Zweibettzimmer mit Balkon, Innenhof-Blick, ab 55 EUR |
| Rosengarten | 549252 | Zweibettzimmer mit Rosengarten-Blick, Schlafsofa, ab 55 EUR |
| Wohlfühl-Appartement | 549319 | Appartement mit Küchenzeile, Balkon, ab 65 EUR |
| Einzelzimmer | 656178 | Kompakt, nur Wochenende, ab 50 EUR |
| Emil's Kuhwiese | 656179 | Ferienwohnung mit Küche, Terrasse, haustierfreundlich, ab 70 EUR |
| Schöne Aussicht | 656180 | Große FW, 2 Schlafzimmer, Panoramablick, ab 120 EUR |

### Booking Page Content (bookingpagedesigncontent)

Set on property 261258:

| Field | Content |
|-------|---------|
| propdesctopDE | Welcome text with 25.000m² garden, direct booking benefits |
| propbookpageconfirmbookDE | Thank-you message with contact info |
| propbookpagenotavailDE | Room unavailable message with phone number |
| propbookpagenopriceDE | No price message with email |
| propbookpagenoroomsavailDE | No rooms message with phone number |
| metalegalpolicyDE / metacancelpolicyDE | Already set (7-day free cancellation) |

---

## Phase 5 - COMPLETED (2026-03-01)

### B13. Invoice Template (communicationinvoicing)

Set on property 261258:

- **invoicecommentDE**: Full invoice header with business details (Zimmervermietung Ralf Volgenandt), guest address, invoice number, date, [INVOICETABLEVAT], payment terms
- **invoicecomment3DE**: Footer with Steuernr. 157/299/10837, IBAN DE28820570701106230767, BIC HELADEF1EIC

### B14. E-Invoice Fields

| Field | Value |
|-------|-------|
| einvname | Zimmervermietung Ralf Volgenandt |
| einvstreet | Otto-Reutter-Str. 28 |
| einvpostcode | 37327 |
| einvcity | Leinefelde-Worbis |
| einvtax | 157/299/10837 |
| einvcountry2 | 149 (Germany) |

---

## Phase 6 - COMPLETED (2026-03-01)

### Auto Actions (communicationautoemails)

All on property 261258. All set to **Auto** with DE + EN HTML email bodies using brand colors (#865725 gold, #5d8f5e sage, #234024 forest).

| ID | Plan | Name | Trigger | Key Settings |
|----|------|------|---------|-------------|
| 562303 | B18 | Rechnungsnummer bei Check-out zuweisen | Check-out, sofort | Assigns sequential invoice number |
| 562304 | B15 | Buchungsbestätigung | Buchung, sofort, Alle Quellen | Booking details, check-in/out times, cancellation policy, contact |
| 562305 | B19 | Rechnung senden nach Check-out | Check-out, +8h | Invoice PDF attachment (Rechnungsvorlage 1), booking summary |
| 562306 | B16 | Anreise-Info | Check-in -2 Tage, 10:00 | Booking details, check-in/out, Anfahrt (A38), Parken, WLAN (Pension_37327), Hausordnung |
| 562307 | B17 | Zahlungserinnerung | Check-in -7 Tage, 10:00 | Balance filter: Positiv only. Bank details (IBAN, BIC), booking reference as Verwendungszweck |
| 562308 | B20 | Bewertungsanfrage | Check-out +1 Tag, 14:00 | Google review button, DANKE5 voucher code (5% discount) |

**Old actions (Naturhaeuschen.Volgenandt):** 4 legacy actions kept as-is (3 deaktiviert, 1 auto for cancelled booking confirmation).

---

## Room Images Update (2026-03-01)

Replaced all external images with pension-volgenandt.de website photos:
- Balkonzimmer: 6 images (incl. balcony photos)
- Rosengarten: 3 images
- Wohlfühl-Appartement: 7 images (incl. balcony .webp)
- Einzelzimmer: 4 images (unchanged, already correct)
- Emil's Kuhwiese: 4 images (replaced old Airbnb photos)
- Schöne Aussicht: 8 images (replaced old Airbnb photos)

Cleared 10 old Booking.com property-level external images. Fixed position assignments (`picval201+`) for all rooms.

---

## Phase 7: Seasonal Pricing - PARTIALLY COMPLETE (2026-03-01)

### Pricing Scheme
- **Base** (Apr-Sep): Full price
- **Herbst** (Oct-Nov): -10%
- **Winter** (Dec-Mar): -20%

### Per-Room Prices (per night)

| Room | Base | Herbst (-10%) | Winter (-20%) |
|------|------|---------------|---------------|
| Einzelzimmer (656178) | 50 | 45 | 40 |
| Balkonzimmer (548066) | 55 | 50 | 44 |
| Rosengarten (549252) | 55 | 50 | 44 |
| Wohlfühl-App (549319) | 65 | 59 | 52 |
| Emil's Kuhwiese (656179) | 70 | 63 | 56 |
| Schöne Aussicht (656180) | 120 | 108 | 96 |

### Verified Working

- **Winter Mar 2026** (Mar 2-31, 2026): All 6 rooms correct
- **Herbst Oct-Nov 2026**: All 6 rooms correct (verified on booking page)
- **Winter Dec 2026-Mar 2027**: All 6 rooms correct (verified on booking page)
- **Base Apr-Sep 2027 - Schöne Aussicht only**: EUR 120/night correct

### NOT Working - Needs Fix

**Base Apr-Sep 2027 for 5 rooms** (Balkonzimmer, Rosengarten, Wohlfühl, Einzelzimmer, Emil's Kuhwiese): Show "Für diesen Zeitraum liegt kein Preis vor" on the booking page.

**Root cause**: The daily prices modal uses a jQuery datepicker with a hidden `altField` (`#calpopupmodaldateto_hide`). When setting `.value` directly on the hidden field, the datepicker widget resets it. The jQuery datepicker `setDate` API updates the visible field but does NOT sync to the hidden field. The server reads the hidden field for the end date, so saves beyond the existing calendar range silently fail (save only a single day instead of the full range).

**Workaround needed**: Either:
1. Set prices manually in Beds24 UI for Apr-Sep 2027
2. Use Beds24 API v2 (JSON API) to set daily prices programmatically
3. Find the correct way to trigger the datepicker's altField sync

### OTA Price Verification

OTA price rules (+15% Booking.com, +20% Airbnb) are linked rules that auto-calculate from the base daily price. Since the base daily prices are correct for Herbst and Winter, the OTA prices will also be correct for those periods.

---

## Outstanding Manual Tasks

**Close old Booking.com hotel listings:** The old standalone Booking.com listings are still "Open / bookable":
- Emil's Kuhwiese: Hotel ID **8447794** (old property 257613)
- Schöne Aussicht: Hotel ID **7474517** (old property 257610)

These must be closed in the **Booking.com Extranet** (not Beds24). Beds24 sync was already deactivated, but the Booking.com listings themselves remain open and could receive bookings that won't sync. Owner can do this manually, or it can be done in a future session with Extranet access.

---

## Upcoming Phases

| Phase | Scope | Status |
|-------|-------|--------|
| **Einzelzimmer Weekend-Only** | Set Check-in Tage = Freitag, Check-out Tage = Sonntag on unit 656178 (roomsetup page). Planned in B2a but NOT yet implemented. | Not done |
| **Phase 7 Fix** | Set base prices Apr-Sep 2027 for 5 rooms | Blocked (datepicker issue) |
| **Phase 8: Booking Engine** | Tiered cancellation policy, deposit rules, voucher DANKE5 | Not started |
| **Phase 9: Airbnb** | Channel connection + mapping | Not started |
| **Website (parallel)** | A1 Nachhaltigkeit alignment, A2 Schlafsofa text, A3 Einzelzimmer page | Not started |
| **Booking.com Cleanup** | Close old hotel listings 8447794 + 7474517 in Extranet | Manual / owner |

See `BEDS24-IMPLEMENTATION-PLAN.md` for full details on each phase.

---

_Completed via Playwright browser automation on Beds24 v3 control panel._
