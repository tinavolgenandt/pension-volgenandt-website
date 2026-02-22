# Beds24 Current Configuration Assessment

**Date:** 2026-02-22
**Account:** Pension Volgenandt (kontakt@pension-volgenandt.de)
**Assessed by:** Automated Playwright audit
**Reference:** [BEDS24-OPTIMIZATION-GUIDE.md](./BEDS24-OPTIMIZATION-GUIDE.md)

---

## Executive Summary

The Beds24 account is **partially configured** with basic property structure and Booking.com connectivity in place, but significant gaps exist in automation, pricing strategy, invoicing compliance, and channel distribution. The account is functional for receiving Booking.com reservations but leaves substantial revenue and efficiency on the table.

### Overall Score: 3/10

| Area | Score | Status |
|------|-------|--------|
| Property & Rooms | 5/10 | Functional but wrong structure |
| Channel Manager | 3/10 | Only Booking.com connected |
| Auto Actions | 1/10 | Nearly all disabled |
| Pricing | 2/10 | Flat rates only, no strategy |
| Guest Communication | 1/10 | Almost no automation |
| Invoicing | 3/10 | Template exists but non-compliant |
| Payments | 2/10 | PayPal only, no Stripe |
| Booking Engine | 5/10 | Responsive but poor deposit config |
| Upsell Items | 4/10 | Items exist but wrong VAT rates |

### Critical Issues (Must Fix)

1. **VAT on upsell items is 0%** -- Breakfast, pet, BBQ all should be 19%. This is a tax compliance violation.
2. **Invoice template missing Steuernummer** -- German law requires tax number on every invoice.
3. **E-Invoice section completely empty** -- Required for B2B invoicing compliance.
4. **Only 1 of 4 auto actions is active** -- And it's a cancellation confirmation, not a booking confirmation.
5. **No booking confirmation email for direct bookings** -- Guests booking directly get no confirmation.
6. **Property structure: 3 properties instead of 1** -- Should be 1 property with 5 rooms for proper management.

---

## 1. Property & Rooms

### Current Configuration

| Property | ID | Units |
|----------|----|-------|
| Ferienwohnung Emil's Kuhwiese | 257613 | 1 unit (541340) |
| Ferienwohnung Schöne Aussicht | 257610 | 1 unit (541337) |
| Pension Volgenandt | 261258 | 3 units: Balkonzimmer (548066), Rosengarten Zimmer (549252), Wohlfuehl-Appartement (549319) |

**Total:** 5 units across 3 properties

### Property Description (Pension Volgenandt)

| Field | Value | Status |
|-------|-------|--------|
| Type | Bed and Breakfast | OK |
| VAT | 7.00% | OK |
| Phone | +4916097719112 | OK |
| Email | kontakt@pension-volgenandt.de | OK |
| Contact | Ralf Volgenandt | OK |
| Address | Otto-Reutter-Str. 28, 37327 Leinefelde-Worbis, Thueringen | OK |
| Currency | EUR | OK |
| Website | EMPTY | Missing |
| License number | EMPTY | Missing |
| Property Templates 1-8 | ALL EMPTY | Missing |
| Features/Amenities | EMPTY | Missing |

### Channel Content (Pension Volgenandt)

| Field | Value | Status |
|-------|-------|--------|
| Check-in from | 14:00 | OK |
| Check-in to | 00:00 | Questionable -- midnight? |
| Check-out by | 11:00 | OK |
| Title (English) | EMPTY | Missing |
| Description (English) | EMPTY | Missing |
| Location (English) | EMPTY | Missing |
| Directions (English) | EMPTY | Missing |
| House Rules (English) | EMPTY | Missing |

### Issues

- **Wrong property structure:** The optimization guide recommends ONE property with 5 rooms. Currently set up as 3 separate properties. This makes cross-property management, reporting, and overbooking protection harder.
- **Empty property templates:** Templates 1-8 are unused. These should contain parking info, WiFi credentials, directions, house rules, etc. Auto action emails reference `[PROPERTYTEMPLATE1]` and `[PROPERTYTEMPLATE2]` which will render blank.
- **Missing website URL:** Should be `https://www.pension-volgenandt.de`
- **Empty channel content:** No English descriptions for Booking.com/Airbnb content. All title, description, location, directions, and house rules fields are blank.
- **Check-in "to" time of 00:00:** Late check-in until midnight seems unusual for a small pension. Verify this is intentional.

### Recommendation

Consolidating into 1 property with 5 rooms is a significant restructuring effort that would require re-mapping all channel connections. For now, focus on filling in the missing content fields and property templates within the existing structure.

---

## 2. Channel Manager

### Current Configuration

| Channel | Status | Links |
|---------|--------|-------|
| Booking.com | Connected (API) | 5 links (all 5 units) |
| Airbnb | NOT connected | 0 links |
| All others | NOT connected | 0 links |

### Settings

| Setting | Value | Status |
|---------|-------|--------|
| Allow channel changes | All | OK |
| Auto-report invalid cards | No | Should be Yes |
| Import cancellation fees | Yes | OK |

### Issues

- **No Airbnb connection** -- Missing a major revenue channel. The optimization guide estimates ~37 EUR/month for adding Airbnb (5 links x 0.55 EUR + room costs already paid). The real cost is Airbnb's 15.5% host commission on bookings.
- **Auto-report invalid cards = No** -- Should be enabled. Booking.com virtual cards that fail to charge should be auto-reported so Booking.com can request a new card from the guest.
- **No direct booking channel optimization** -- Price multipliers are pre-configured (OTA 115%, Airbnb 120%) which is good, but without Airbnb connected, the Airbnb multiplier is unused.

### Recommendation

1. Enable "Auto-report invalid cards"
2. Connect Airbnb as next priority channel (see Section 7 of optimization guide)
3. Ensure all 5 units are mapped to both Booking.com and Airbnb

---

## 3. Auto Actions

### Current Configuration

| ID | Name | Status | Trigger |
|----|------|--------|---------|
| 460470 | Email confirmation for channel bookings | DISABLED | Unknown |
| 463027 | Cancelled Booking Normal | DISABLED | Unknown |
| 464470 | Email Confirmation for Cancelled booking | ACTIVE (Auto) | On cancellation |
| 464472 | Cancelled Booking 1 Day | DISABLED | Unknown |

### Comparison with Recommended Setup (7 actions)

| Recommended Action | Current Status |
|--------------------|---------------|
| 1. Booking Confirmation (Direct) | MISSING -- Action 460470 is disabled |
| 2. Channel Welcome Message | MISSING |
| 3. Pre-Arrival Info (2 days before) | MISSING |
| 4. Payment Reminder (7 days before) | MISSING |
| 5. Invoice Number Assignment | MISSING |
| 6. Post-Stay Thank You + Review | MISSING |
| 7. Cancellation Confirmation | PARTIAL -- Action 464470 is active |

### Issues

- **Only 1 of 7 recommended actions is active**, and it's the least impactful one (cancellation confirmation).
- **No booking confirmation for direct bookings** -- Guests who book directly receive no automated confirmation email. This is a critical gap that damages trust and could lead to no-shows.
- **No pre-arrival information** -- Guests receive no check-in instructions, directions, WiFi info, or parking details before arrival.
- **No payment reminders** -- No automated reminder for guests with outstanding balances.
- **No invoice number assignment** -- Invoices are not automatically numbered, which is a German legal requirement for sequential numbering.
- **No post-stay follow-up** -- No review requests or thank-you messages to encourage repeat bookings and reviews.
- **No channel welcome message** -- Booking.com guests don't receive a personal welcome message through the channel API.
- **Disabled confirmation email (460470)** -- This was set up but disabled. Unclear why.

### Recommendation

Implement all 7 auto actions from the optimization guide Section 4. This is the highest-impact improvement area. Start with:
1. Booking Confirmation (Direct) -- immediate trust builder
2. Pre-Arrival Info -- reduces guest questions
3. Invoice Number Assignment -- legal compliance
4. Payment Reminder -- revenue protection

---

## 4. Pricing

### Current Rates

| Room | Base Price | OTA (115%) | Airbnb (120%) |
|------|-----------|------------|---------------|
| Balkonzimmer | 55.00 EUR | 63.25 EUR | 66.00 EUR |
| Rosengarten Zimmer | 55.00 EUR | 63.25 EUR | 66.00 EUR |
| Wohlfuehl-Appartement | 65.00 EUR | 74.75 EUR | 78.00 EUR |

### Pricing Features Status

| Feature | Status |
|---------|--------|
| Seasonal pricing | NOT configured |
| Weekend surcharges | NOT configured |
| Fixed Prices | EMPTY (no entries) |
| Yield Optimizer | EMPTY (no rules) |
| Length-of-stay discounts | NOT configured |
| Early bird discounts | NOT configured |
| Last-minute discounts | NOT configured |
| Non-refundable rate | NOT configured |
| Price multipliers (channel) | Configured (OTA 115%, Airbnb 120%) |

### Dashboard Warning

> "Balkonzimmer has no price after Jan 31, 2027"

The pricing calendar only extends ~11 months. The optimization guide recommends maintaining 18 months of availability and pricing.

### Issues

- **Completely flat pricing** -- Same rate 365 days/year. No seasonal variation means:
  - Overpriced during low season (Nov-Mar), losing bookings to competitors
  - Underpriced during high season (Jun-Sep, holidays), leaving money on the table
- **No weekend surcharges** -- Fri/Sat demand is typically higher but priced the same as midweek.
- **No yield optimization** -- The built-in yield optimizer is not used at all. Even basic rules (raise prices when 4+ rooms booked, lower when 0-1 rooms booked near check-in) would improve revenue.
- **No fixed prices** -- No seasonal rate bands configured.
- **Calendar too short** -- Less than 12 months of pricing. Should be 18 months to capture early bookings.
- **No length-of-stay incentives** -- No discounts for 3+ or 7+ night stays.

### Recommendation (from Optimization Guide Section 6)

1. **Seasonal pricing:** High season (Jun-Sep) +15-25%, Low season (Nov-Mar) -10-20%
2. **Weekend surcharge:** Fri/Sat +15-20% via price multiplier
3. **Yield optimizer:** Add 2-3 basic rules for demand-based pricing
4. **Extend calendar:** Maintain pricing 18 months ahead
5. **Length-of-stay discount:** 5% for 3+ nights, 10% for 7+ nights
6. **Consider non-refundable rate:** 5-10% discount for non-refundable bookings

---

## 5. Guest Communication

### Outgoing Email

Not inspected in detail during this audit. This is a prerequisite for all auto actions -- outgoing email must be properly configured at Settings > Account > Outgoing Email before auto actions can send emails.

### Confirmations Page

Not inspected. This controls the booking confirmation page shown to guests after completing a booking on the booking engine.

### Current State

- **No automated booking confirmation** for direct bookings
- **No pre-arrival email** with check-in instructions
- **No post-stay follow-up** or review request
- **No payment reminders**
- Only active auto action is a cancellation confirmation email
- **Channel content fields are empty** -- No descriptions, house rules, or directions published to Booking.com
- **Property Templates 1-8 are empty** -- These are referenced by auto action email templates for parking, WiFi, etc.

### Issues

- Guests booking directly get no confirmation at all
- Booking.com guests only see what's on Booking.com (no personalized welcome)
- No mechanism to collect reviews or encourage repeat bookings
- No pre-arrival information reduces guest satisfaction and increases manual inquiries

### Recommendation

1. Verify outgoing email is configured
2. Fill Property Templates 1-3 (parking, WiFi, directions)
3. Implement all 7 auto actions (see Section 3 above)
4. Fill channel content fields (description, house rules, directions) in English and German

---

## 6. Invoicing

### Invoice Template 1 (Pension Volgenandt)

**Template exists** with the following structure:

```
Header:
  Zimmervermietung Ralf Volgenandt
  [PROPERTYADDRESS]
  [PROPERTYPOSTCODE] [PROPERTYCITY]
  [PROPERTYEMAIL]
  www.pension-volgenandt.de
  [PROPERTYPHONE]

Sender line:
  Zimmervermietung Ralf Volgenandt, Otto-Reutter-Str. 28, 37327 Leinefelde-Worbis

Body:
  Rechnung
  Rechnungsnummer: [INVOICENUMBER]
  Liefer-/Leistungsdatum: [INVOICEDATE]
  Rechnungs-datum: [INVOICEDATE]
  [INVOICETABLEVATCOMPACT:$1.1$]

Footer:
  "Thank you very much for choosing [PROPERTYNAME]. We hope you enjoyed your stay with us."
  "Best regards, [PROPERTYNAME]"
```

### Invoice Templates 2 & 3

Both EMPTY.

### E-Invoice Section (E-Rechnung)

| Field | Value |
|-------|-------|
| Name des Unternehmens | EMPTY |
| Adresse | EMPTY |
| PLZ | EMPTY |
| Stadt | EMPTY |
| Land | EMPTY (not selected) |
| Tax number | EMPTY |
| VAT number | EMPTY |

### Invoice Line Items

| Setting | Value |
|---------|-------|
| Darstellung Uebernachtungspreis | pro Buchung |
| Beschreibung pro Buchung (EN) | EMPTY |
| Beschreibung pro Datum (EN) | EMPTY |
| Rechnungstabelle Zeilenabstand | 15px |

### Issues

1. **Missing Steuernummer** -- German law requires the tax number (Steuernummer) or VAT ID (USt-IdNr.) on every invoice. The template has no tax number.
2. **English thank-you text** -- The invoice body is German but the closing text is in English ("Thank you very much..."). Should be German for a German pension.
3. **E-Invoice section completely empty** -- For B2B invoicing (e.g., business travelers), the E-Rechnung fields must be filled.
4. **Missing guest address block** -- The template doesn't include `[GUESTFULLNAME]`, `[GUESTADDRESS]`, `[GUESTPOSTCODE]`, `[GUESTCITY]` for the recipient.
5. **Missing booking details** -- No `[FIRSTNIGHT]`, `[LEAVINGDAY]`, `[NUMNIGHT]`, `[ROOMNAME]` in the invoice body.
6. **No net/VAT/gross breakdown** -- Uses `[INVOICETABLEVATCOMPACT]` but doesn't show separate net, VAT, and gross totals.
7. **No payment/balance section** -- Missing `[INVOICEPAYMENTS]` and `[INVOICEBALANCE]`.
8. **No Leistungsdatum reference** -- German invoices must state that the service date corresponds to the stay dates.
9. **Invoice number not auto-assigned** -- No auto action to assign sequential invoice numbers.

### Recommendation

Replace the current template with the comprehensive template from the optimization guide Section 5, which includes:
- Full business header with Steuernummer
- Guest address block
- Complete booking details table
- `[INVOICETABLEVAT]` with net/VAT/gross breakdown
- Payment and balance information
- German closing text
- Legal note about Leistungsdatum

---

## 7. Payments

### Current Configuration

| Gateway | Status | Priority | Details |
|---------|--------|----------|---------|
| Stripe | NOT connected | - | "Nicht verwendet" (not used) |
| PayPal | Connected | 1 (lowest) | Email: Kontakt@pension-volgenandt.de |

### Issues

1. **No Stripe** -- Missing the most cost-effective payment gateway:
   - Stripe: 1.4% + 0.25 EUR (EU cards) vs PayPal: 2.49% + 0.35 EUR
   - Stripe enables auto-charging Booking.com virtual cards
   - Stripe enables scheduled payment collection
   - Stripe enables card-on-file for direct bookings
2. **PayPal only** -- While German consumers trust PayPal, it's more expensive and doesn't support auto-charging. Every payment requires guest action.
3. **No payment automation** -- Without Stripe, there's no way to:
   - Auto-charge deposits
   - Auto-charge remaining balance before check-in
   - Auto-charge Booking.com virtual cards
   - Schedule payment collection

### Cost Impact Example

On a 200 EUR booking:
- PayPal: 200 x 2.49% + 0.35 = **5.33 EUR**
- Stripe: 200 x 1.4% + 0.25 = **3.05 EUR**
- **Savings: 2.28 EUR per booking**

At 100 bookings/year, that's ~228 EUR/year saved.

### Recommendation

1. Connect Stripe as primary payment gateway
2. Keep PayPal as secondary (guest-facing option)
3. Set up payment rules for automated collection:
   - 30% deposit at booking (direct bookings)
   - Remaining balance 14 days before check-in
4. Enable auto-charging of Booking.com virtual cards

---

## 8. Booking Engine

### Current Configuration

| Setting | Value | Status |
|---------|-------|--------|
| Version Buchungsseite | Responsive | OK |
| Version Check-out Seite | Responsive | OK |
| Standard Layout | 1 | OK |
| Booking page URL | beds24.com/booking2.php?propid=261258 | Active |

### Deposit Settings (Direct Bookings)

| Setting | Value | Status |
|---------|-------|--------|
| Buchungsstatus bei nicht erfolgter Zahlung | Anfrage (Request) | OK |
| Waehrung | EUR | OK |
| Anzahlung 1 Prozent | 100% | Problematic |
| Anzahlung 1 fester Betrag | 0.00 | OK |
| Anzahlung 2 Prozent | 100% | Problematic |
| Anzahlung 2 fester Betrag | 0.00 | OK |

### Booking Types

| Type | Setting |
|------|---------|
| Regulaere Buchungen | Bestaetigt mit Anzahlung 1 (confirmed with deposit 1) |
| Kurzfristige Buchungen | 1 Tag im Voraus, Bestaetigt mit Anzahlung 1 |
| Besondere Buchungsperiode | Geschlossen (closed) |

### Cancellation

| Setting | Value |
|---------|-------|
| Stornierung moeglich | immer (always) |

### Issues

1. **100% deposit required** -- Both Deposit 1 and Deposit 2 are set to 100%. This means guests must pay the full amount upfront to book directly. With only PayPal as payment gateway, this creates a high barrier to direct bookings. Many guests will abandon the booking. Consider 30% deposit instead.
2. **Free cancellation always** -- No time limit on cancellations combined with 100% upfront payment is contradictory. If you charge 100% upfront, you need a clear cancellation/refund policy. If you want flexible cancellation, a lower deposit makes more sense.
3. **No booking engine customization** -- Branding (colors, fonts) has not been checked but should match the website's sage green palette.
4. **No voucher codes** -- No DANKE5 or similar voucher codes set up for returning guests.
5. **Short-term bookings** set to 1 day in advance -- this is reasonable.

### Recommendation

1. Reduce Deposit 1 to 30% (standard for pension/B&B)
2. Set cancellation to "14 Tage vor Check-in" (14 days before)
3. Customize booking page branding to match website
4. Create voucher code DANKE5 for 5% returning guest discount
5. Set up a "direct booking discount" of 5% below OTA rates

---

## 9. Upsell Items

### Current Configuration (Pension Volgenandt)

| # | Item | Amount | Per | Period | VAT | Status |
|---|------|--------|-----|--------|-----|--------|
| 1 | Normal Breakfast | 10.00 EUR | Person | Daily | **0%** | Optional |
| 2 | Deluxe Breakfast | 15.00 EUR | Person | Daily | **0%** | Optional |
| 3 | Pet | 10.00 EUR | Booking | One-time | **0%** | Optional |
| 4 | Barbecue Set | 10.00 EUR | Booking | One-time | **0%** | Optional |
| 5 | (unused) | - | - | - | - | Not used |

### Issues

1. **ALL upsell items have 0% VAT** -- This is **incorrect and a tax compliance violation**:
   - Breakfast: Should be **19%** (food service, not accommodation)
   - Pet fee: Should be **19%** (service, not accommodation)
   - Barbecue Set: Should be **19%** (service/rental, not accommodation)
   - Only accommodation itself qualifies for the reduced 7% rate
2. **No images** assigned to any upsell items -- Upsell items with images convert better.
3. **English-only descriptions** -- Items show "Normal Breakfast" and "Please choose either Deluxe or Normal Breakfast" in English. German descriptions should also be provided (check Deutsch tab).
4. **Breakfast descriptions are confusing** -- Both breakfast items say "Please choose either Deluxe or Normal Breakfast" which is redundant. Only one should have this note, or it should be clearer.

### Recommendation

1. **Immediately fix VAT rates** to 19% for all 4 items
2. Add German descriptions (Normales Fruehstueck, Deluxe Fruehstueck, Haustier, Grillset)
3. Add images to each upsell item
4. Consider adding more upsell items (e.g., parking if applicable, late check-out, early check-in, bike rental)

---

## 10. Dashboard Observations

### Active Bookings (as of 2026-02-22)

| Guest | Room | Check-in | Check-out | Source |
|-------|------|----------|-----------|--------|
| Tischlerei Grimm | Rosengarten Zimmer | Active | Feb 27 | APP |
| Koch | Wohlfuehl-Appartement | Feb 24 | Feb 28 | APP |
| Sigmar Runde | Wohlfuehl-Appartement | Mar 6 | Mar 8 | APP |

### Observations

- **Referrer "APP"** on all recent bookings -- This suggests bookings are being entered manually via the Beds24 app rather than coming through Booking.com API or direct booking engine. This could indicate the channel manager sync is not working optimally, or these are walk-in/phone bookings.
- **0.00 costs** shown on some bookings -- Prices not appearing in booking records could indicate pricing configuration issues.
- **Balkonzimmer and Emil's Kuhwiese appear unbooked** -- Low occupancy for 2 of 5 units.

---

## Priority Action Plan

### Immediate (This Week) -- Compliance & Critical Fixes

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 1 | Fix upsell item VAT rates to 19% | Tax compliance | 5 min |
| 2 | Add Steuernummer to invoice template | Legal compliance | 10 min |
| 3 | Fix invoice template (German closing text, add guest address, booking details) | Legal compliance | 30 min |
| 4 | Fill E-Invoice section | B2B compliance | 10 min |
| 5 | Enable Auto Action 460470 (booking confirmation) | Guest experience | 15 min |

### Short-Term (Next 2 Weeks) -- Automation & Revenue

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 6 | Fill Property Templates 1-3 (parking, WiFi, directions) | Enables pre-arrival emails | 20 min |
| 7 | Create all 7 auto actions per optimization guide | Major efficiency gain | 2-3 hours |
| 8 | Set up seasonal pricing (high/low/shoulder) | Revenue optimization | 1-2 hours |
| 9 | Add weekend surcharges (Fri/Sat +15%) | Revenue optimization | 30 min |
| 10 | Extend pricing calendar to 18 months | Capture early bookings | 30 min |

### Medium-Term (Next Month) -- Growth

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 11 | Connect Stripe payment gateway | Cost savings, automation | 1 hour |
| 12 | Reduce direct booking deposit to 30% | More direct bookings | 5 min |
| 13 | Set cancellation policy to 14 days | Revenue protection | 5 min |
| 14 | Add Yield Optimizer rules | Dynamic pricing | 30 min |
| 15 | Connect Airbnb channel | New revenue channel | 2-3 hours |
| 16 | Customize booking engine branding | Better conversion | 1 hour |
| 17 | Create DANKE5 voucher code | Repeat bookings | 10 min |
| 18 | Fill channel content (descriptions, house rules) | Better OTA performance | 1-2 hours |
| 19 | Set website URL in property description | SEO/linking | 2 min |
| 20 | Enable auto-report invalid cards | Revenue protection | 2 min |

### Estimated Revenue Impact

| Improvement | Estimated Annual Impact |
|-------------|------------------------|
| Seasonal pricing (avoiding underpricing in summer) | +500-1,500 EUR |
| Weekend surcharges | +300-800 EUR |
| Yield optimizer | +200-500 EUR |
| Airbnb channel (new bookings) | +2,000-5,000 EUR |
| Stripe savings vs PayPal | +200-300 EUR |
| Direct booking incentives | +500-1,000 EUR (saved OTA commissions) |
| **Total estimated impact** | **+3,700-9,100 EUR/year** |

---

## Appendix: Pages Inspected

| Page | URL | Data Captured |
|------|-----|---------------|
| Properties | ?pagetype=properties | 3 properties, 5 units |
| Rooms (all 3 properties) | ?pagetype=rooms | Unit IDs and names |
| Property Description | ?pagetype=propertydescription | Address, VAT, contact, templates |
| Channel Content | ?pagetype=syncronisercontentdata | Check-in/out times, content fields |
| Channel Manager | ?pagetype=synchroniser | Booking.com connected, 5 links |
| Dashboard | ?pagetype=dashboard | Active bookings, warnings |
| Daily Prices | ?pagetype=rates3 | Base rates, multipliers |
| Yield Optimizer | ?pagetype=rates3 (yield tab) | Empty |
| Fixed Prices | ?pagetype=rates3 (fixed tab) | Empty |
| Auto Actions | ?pagetype=communicationautoemails | 4 actions, 1 active |
| Payment Gateways | ?pagetype=paymentgateways | Stripe not connected |
| PayPal | ?pagetype=propertydepositpaypal | Connected, priority 1 |
| Invoicing | ?pagetype=communicationinvoicing | Template 1 exists, issues found |
| Booking Engine | ?pagetype=bookingpage2 | Responsive, 100% deposit |
| Upselling | ?pagetype=propertyupsellitems | 4 items, 0% VAT (wrong) |

### Pages Not Inspected

| Page | Reason |
|------|--------|
| Outgoing Email (Account settings) | Not navigated to during audit |
| Booking Page Design/Style | Not navigated to during audit |
| Booking Page Pictures | Not navigated to during audit |
| Voucher Codes | Not navigated to during audit |
| Widgets | Not navigated to during audit |
| Guest Login | Not navigated to during audit |
| Overbooking Protection (Room setup) | Not navigated to during audit |

---

_Assessment completed: 2026-02-22_
_Reference: [BEDS24-OPTIMIZATION-GUIDE.md](./BEDS24-OPTIMIZATION-GUIDE.md)_
