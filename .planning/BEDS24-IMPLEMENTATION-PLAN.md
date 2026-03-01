# Beds24 & Website Optimization - Implementation Plan

**Date:** 2026-03-01
**Source:** Owner discussion notes + BEDS24-CURRENT-ASSESSMENT.md
**Reference:** BEDS24-OPTIMIZATION-GUIDE.md

---

## Owner Notes vs Assessment: Key Differences

| Topic | Assessment Recommendation | Owner Decision | Action |
|-------|--------------------------|----------------|--------|
| Seasonal pricing | 4 seasons (high/shoulder/low/holiday) | Simpler: Herbst -10%, Winter -20% | Follow owner |
| Cancellation | 14 days free, then 100% | 7 days free, 2 days 50%, after 100% | Follow owner (tiered) |
| Upsell: Hund | 10 EUR/booking (current Beds24) | 5 EUR/night (as on website) | Fix to match website |
| Upsell: Aufbettung | Not mentioned | 10 EUR/person/night (add new) | Add as new upsell item |
| Breakfast naming | "Normal/Deluxe Breakfast" | "Frühstück / Genießer-Frühstück" wie Website | Rename to match website |
| Hausordnung | Basic template in guide | Detailed, 100 EUR Strafe + Sachschaden | Create new per owner |
| Einzelzimmer | Not mentioned | Nur Wochenende buchbar (Fr-So) | New booking restriction |
| Invoice | Replace with new template | Aktuelle Rechnung als Vorlage nachbauen | Keep structure, fix compliance |
| Stripe | Add as primary gateway | Not mentioned by owner | Defer (not requested) |
| Weekend surcharges | +15% Fri/Sat | Not mentioned by owner | Defer (not requested) |
| Yield optimizer | 3 rules | Not mentioned by owner | Defer (not requested) |
| Property restructuring | 1 property with 5 rooms | Not mentioned by owner | Defer (not requested) |

---

## Part A: Website Code Changes

### A1. Nachhaltigkeit Text vertical alignment
- **Page:** Willkommen (Homepage)
- **Issue:** Text next to sustainability image not vertically centered
- **Fix:** Add `items-center` to the flex/grid container

### A2. Schlafsofa description text
- **Where:** Room pages with Schlafsofas (Wohlfühl-Appartement, Ferienwohnungen)
- **Change:** Remove "für kleine Kinder" → replace with "bspw. Kinder"
- **Files:** Room YAML/content files

### A3. Einzelzimmer weekend-only booking
- **Where:** Einzelzimmer room configuration
- **Change:** Add note that Einzelzimmer is only bookable Friday-Sunday
- **Implementation:**
  - Add availability note to room page content
  - Configure in Beds24: min check-in day = Friday, max check-out day = Sunday (or use booking rules)

---

## Part B: Beds24 Admin Changes

### Phase 1: Tax Compliance & Upsell Items (URGENT)

#### B1. Fix upsell VAT rates to 19%
- **Location:** Buchungsmaschine > Upselling (all 3 properties)
- **All items:** Change MwSt. from 0% to 19%

#### B2. Upsell items - match website exactly
Current Beds24 vs Website:

| # | Beds24 Now | Website | Action |
|---|-----------|---------|--------|
| 1 | Normal Breakfast, 10 EUR/person/day, 0% VAT | Frühstück, 10 EUR/person/night | Rename, fix VAT to 19% |
| 2 | Deluxe Breakfast, 15 EUR/person/day, 0% VAT | Genießer-Frühstück, 15 EUR/person/night | Rename, fix VAT to 19% |
| 3 | Pet, 10 EUR/booking, 0% VAT | Hund, 5 EUR/night | Rename, fix price to 5 EUR, change to per-night, fix VAT to 19% |
| 4 | Barbecue Set, 10 EUR/booking, 0% VAT | Grill-Set, 10 EUR/use | Rename, fix VAT to 19% |
| 5 | (unused) | Aufbettung, 10 EUR/person/night | CREATE NEW: 10 EUR/person/night, 19% VAT |

**German descriptions to set (Deutsch tab):**
- Item 1: Name "Frühstück" / Beschreibung "Brötchen, Brotbelag, hausgemachte Marmelade & Kaffee oder Tee"
- Item 2: Name "Genießer-Frühstück" / Beschreibung "Brötchen, regionale Wurstspezialitäten, hausgemachte Marmelade, saisonales Obst, frischer Saft & Kaffee oder Tee"
- Item 3: Name "Hund" / Beschreibung "Ihr Vierbeiner ist bei uns herzlich willkommen"
- Item 4: Name "Grill-Set" / Beschreibung "Inkl. Grillbesteck und -pfannen"
- Item 5: Name "Aufbettung" / Beschreibung "Zusätzlicher Schlafplatz auf dem Schlafsofa – 10 EUR pro Person/Nacht"

**Aufbettung logic:** Charge 10 EUR/person/night when guests exceed standard occupancy of the room. Configure per room based on standard occupancy.

---

### Phase 2: Invoice (Rechnungslegung)

#### B3. Fix invoice template
- **Location:** Gästemanagement > Rechnungen > Rechnungsvorlage 1
- **Approach:** Keep current layout structure as base (owner wants current invoice as template), but fix:
  - Add Steuernummer
  - Add guest address block ([GUESTFULLNAME], [GUESTADDRESS], etc.)
  - Add booking details ([FIRSTNIGHT], [LEAVINGDAY], [NUMNIGHT], [ROOMNAME])
  - Fix English closing text → German
  - Add net/VAT/gross breakdown
  - Add payment/balance section
  - Add Leistungsdatum note

#### B4. Fill E-Invoice section
- **Location:** Gästemanagement > Rechnungen > E-Rechnung
- Fill: Name, Adresse, PLZ, Stadt, Land, Steuernummer

---

### Phase 3: Auto Actions (Automatische E-Mails)

#### B5. Buchungsbestätigung für Direktbuchungen
- Enable/update existing Action 460470 or create new
- Trigger: On booking, direct bookings only, confirmed
- Content: Booking details, check-in info, cancellation policy, payment link

#### B6. Anreise-Info (2 Tage vor Check-in)
- NEW auto action
- Trigger: Check-in -2 days
- Content: Check-in time, Anfahrt, WLAN, Parken, Hausordnung
- **Prerequisite:** Fill Property Templates 1-4 first

#### B7. Zahlungserinnerung
- NEW auto action
- Trigger: Check-in -7 days, outstanding balance, direct bookings only
- Content: Outstanding amount, payment link

#### B8. Rechnung automatisch senden bei Abreise
- NEW auto action
- Trigger: Check-out day
- Content: Invoice PDF attachment
- **Prerequisite:** Invoice template fixed (B3), invoice numbering action (B9)

#### B9. Rechnungsnummer zuweisen
- NEW auto action (background)
- Trigger: Check-in day
- Action: Assign sequential invoice number

#### B10. Bewertungsanfrage nach Aufenthalt
- NEW auto action
- Trigger: Check-out +1 day
- Content: Google review link, DANKE5 code

#### B11. Hausordnung erstellen
- **Content for Property Template 4 and Anreise-Info email:**

```
HAUSORDNUNG - Pension Volgenandt

1. Ruhezeiten: 22:00 - 07:00 Uhr
2. Rauchen ist in allen Räumen und Gemeinschaftsbereichen strengstens untersagt.
3. Haustiere nur nach vorheriger Anmeldung und gegen Gebühr (5 EUR/Nacht).
4. Check-in: ab 14:00 Uhr | Check-out: bis 11:00 Uhr
5. Bitte behandeln Sie die Einrichtung pfleglich.
6. Parken: Kostenfreie Parkplätze direkt am Haus.
7. Müll bitte trennen (Restmüll, Papier, Gelber Sack).

Bei Verstößen gegen die Hausordnung wird eine Vertragsstrafe
von 100,00 EUR erhoben. Darüber hinausgehende Sachschäden
werden zum Zeitwert in Rechnung gestellt.

Wir wünschen Ihnen einen angenehmen Aufenthalt!
Familie Volgenandt
```

#### B12. Property Templates füllen (Voraussetzung für Auto-Emails)
- **Template 1 (Parken):** "Kostenfreie Parkplätze stehen direkt am Haus zur Verfügung."
- **Template 2 (WLAN):** "WLAN-Name: [Name] / Passwort: [Passwort]" (vom Besitzer erfragen)
- **Template 3 (Anfahrt):** "Von der A38 Abfahrt Leinefelde, Richtung Zentrum. Das Haus befindet sich in der Otto-Reutter-Str. 28."
- **Template 4 (Hausordnung):** See B11 above
- **DO FOR ALL 3 PROPERTIES**

---

### Phase 4: Preise (Saisonale Anpassung)

#### B13. Saisonale Preise konfigurieren
Owner's simplified model:

| Saison | Zeitraum | Anpassung |
|--------|----------|-----------|
| Frühling/Sommer (Standard) | Apr - Sep | Basispreis (keine Änderung) |
| Herbst | Okt - Nov | -10% |
| Winter | Dez - Mär | -20% |

**Current base prices (from website/Beds24):**

| Zimmer | Basispreis | Herbst (-10%) | Winter (-20%) |
|--------|-----------|---------------|---------------|
| Einzelzimmer | 50 EUR | 45 EUR | 40 EUR |
| Balkonzimmer | 58 EUR | 52 EUR | 46 EUR |
| Rosengarten | 58 EUR | 52 EUR | 46 EUR |
| Wohlfühl-Appartement | 65 EUR | 59 EUR | 52 EUR |
| Emil's Kuhwiese | 73 EUR | 66 EUR | 58 EUR |
| Schöne Aussicht | 126 EUR | 113 EUR | 101 EUR |

**Implementation:** Use Beds24 Fixed Prices or daily price overrides for seasonal periods.

#### B14. Kalender auf 18 Monate erweitern
- Extend pricing for all rooms through at least September 2027
- Currently only ~11 months (ends around Jan 2027)

---

### Phase 5: Buchungsmaschine

#### B15. Stornierungsbedingungen (tiered)
Owner wants:
- **7+ Tage vor Check-in:** Kostenlose Stornierung (100% Erstattung)
- **2-7 Tage vor Check-in:** 50% Stornierungsgebühr
- **Weniger als 2 Tage / No-Show:** 100% Stornierungsgebühr

**Note:** Beds24 may not support tiered cancellation natively for direct bookings. Check if this can be configured via cancellation rules or if it needs to be communicated via policy text only.

#### B16. Anzahlung reduzieren
- Change from 100% to a lower percentage (assessment recommends 30%)
- Owner didn't specify exact percentage but agrees 100% is too high

#### B17. Gutscheincode DANKE5
- **Location:** Buchungsmaschine > Gutschein Codes
- Code: DANKE5
- Discount: 5%
- Type: Percentage

---

### Phase 6: Airbnb anbinden

#### B18. Airbnb Channel verbinden
- Inserate existieren bereits auf Airbnb
- Preismultiplikator 120% ist schon konfiguriert
- Alle 5 Unterkünfte einbinden
- **Steps:**
  1. Channel Manager > Add Channel > Airbnb
  2. Authorize Beds24 access
  3. Map each room to existing Airbnb listing
  4. Set sync to "Prices and Availability"
  5. Verify 120% multiplier is active for all rooms

---

## Execution Order

```
Phase 1: Upsell & VAT fix ──────────── (B1, B2)         ~30 min
Phase 2: Invoice fix ────────────────── (B3, B4)         ~45 min
Phase 3: Auto Actions ──────────────── (B5-B12)         ~2-3 hrs
  └─ B11+B12 first (prerequisites for emails)
  └─ Then B5, B6, B7, B9, B8, B10 (in dependency order)
Phase 4: Seasonal pricing ──────────── (B13, B14)       ~1 hr
Phase 5: Booking engine ────────────── (B15, B16, B17)  ~30 min
Phase 6: Airbnb ────────────────────── (B18)            ~2 hrs

Website: A1, A2, A3 ───────────────── parallel          ~30 min
```

---

## Items NOT in Owner Notes (Deferred)

These were recommended in the assessment but NOT mentioned by the owner. Park for later:

| Item | Why Deferred |
|------|-------------|
| Stripe payment gateway | Owner didn't mention, requires business setup |
| Weekend surcharges (+15% Fri/Sat) | Owner didn't mention |
| Yield optimizer rules | Owner didn't mention |
| Property restructuring (3→1) | Too disruptive, owner didn't mention |
| Length-of-stay discounts | Owner didn't mention |
| Auto-report invalid cards | Minor, do when convenient |
| Booking page branding | Already planned in BEDS24-BRANDING-AND-WIDGETS.md |
| Website URL in property | Quick fix, do when in admin |

---

## Open Questions for Owner

1. **WLAN-Zugangsdaten:** Name und Passwort für Property Template 2?
2. **Steuernummer:** Für Rechnungsvorlage und E-Rechnung benötigt
3. **Anzahlung:** 30% oder anderer Prozentsatz? (aktuell 100%)
4. **Google Bewertungslink:** Für die Bewertungsanfrage-Email
5. **Aufbettung Verfügbarkeit:** Welche Zimmer erlauben Aufbettung? (Website zeigt: Rosengarten, Wohlfühl, Emil's Kuhwiese, Schöne Aussicht)
6. **Einzelzimmer:** Beds24-Konfiguration für "nur Wochenende" - soll das auch für Booking.com gelten?

---

_Plan created: 2026-03-01_
