# Beds24 Optimization Guide for Pension Volgenandt

**Date:** 2026-02-22 (updated post-audit)
**Assessment:** [BEDS24-CURRENT-ASSESSMENT.md](./BEDS24-CURRENT-ASSESSMENT.md)
**Current Score:** 3/10 -- significant gaps in automation, compliance, and revenue optimization

---

## Goals

1. **Automated guest communication** -- booking confirmations, pre-arrival info, payment reminders, post-stay follow-up
2. **Automated Rechnung (invoice)** -- compliant invoice template, auto-numbering, auto-send at checkout
3. **Improved conversion** -- better booking engine, lower abandonment, direct booking incentives
4. **Better pricing** -- seasonal rates, weekend surcharges, yield optimization, length-of-stay discounts

---

## Table of Contents

1. [Critical Fixes (Do First)](#1-critical-fixes-do-first)
2. [Prerequisites for Automation](#2-prerequisites-for-automation)
3. [Automated Guest Communication](#3-automated-guest-communication)
4. [Automated Invoicing (Rechnung)](#4-automated-invoicing-rechnung)
5. [Price Optimization](#5-price-optimization)
6. [Booking Engine & Conversion](#6-booking-engine--conversion)
7. [Payment Optimization](#7-payment-optimization)
8. [Channel Expansion (Airbnb)](#8-channel-expansion-airbnb)
9. [Template Variables Reference](#9-template-variables-reference)
10. [Implementation Checklist](#10-implementation-checklist)

---

## 1. Critical Fixes (Do First)

These are compliance issues and broken settings found during the audit. Fix before anything else.

### 1.1 Fix Upsell Item VAT Rates

**Problem:** All 4 upsell items have 0% VAT. German law requires 19% on services.

**Location:** Buchungsmaschine > Upselling (select each property)

| Item | Current VAT | Correct VAT |
|------|-------------|-------------|
| Normal Breakfast (10 EUR/person/day) | 0% | **19%** |
| Deluxe Breakfast (15 EUR/person/day) | 0% | **19%** |
| Pet (10 EUR/booking) | 0% | **19%** |
| Barbecue Set (10 EUR/booking) | 0% | **19%** |

**Steps:**
1. Go to Buchungsmaschine > Upselling
2. For each property in the dropdown (do this for all 3 properties):
   - Change MwSt. % from `0.00` to `19.00` for items 1-4
   - Click Speichern

Also add **German descriptions** (click the Deutsch tab):
- Item 1: "Normales Fruehstueck" / "Bitte waehlen Sie Normal- oder Deluxe-Fruehstueck"
- Item 2: "Deluxe Fruehstueck" / "Bitte waehlen Sie Normal- oder Deluxe-Fruehstueck"
- Item 3: "Haustier" / "Einmalige Gebuehr pro Aufenthalt"
- Item 4: "Grillset" / "Leihgebuehr pro Aufenthalt"

### 1.2 Fix Invoice Template

**Problem:** Current template is missing Steuernummer, guest address, booking details, and has English closing text on a German invoice.

See [Section 4](#4-automated-invoicing-rechnung) for the complete replacement template.

### 1.3 Fill E-Invoice Section

**Problem:** All E-Rechnung fields are empty. Required for B2B invoicing.

**Location:** Gaestemangement > Rechnungen > E-Rechnung

| Field | Value to Enter |
|-------|----------------|
| Name des Unternehmens | Zimmervermietung Ralf Volgenandt |
| Adresse | Otto-Reutter-Str. 28 |
| PLZ | 37327 |
| Stadt | Leinefelde-Worbis |
| Land | Germany |
| Tax number | [Steuernummer eintragen] |
| VAT number | [Falls vorhanden, USt-IdNr. eintragen] |

### 1.4 Enable Channel Manager Auto-Report

**Location:** Channel Manager > Einstellungen

Change "Auto-report invalid cards" from **No** to **Yes**. This ensures that Booking.com virtual cards that fail to charge are automatically reported, prompting Booking.com to request new payment details from the guest.

### 1.5 Set Website URL

**Location:** Unterkuenfte > Beschreibung (for each property)

Set Website to: `https://www.pension-volgenandt.de`

---

## 2. Prerequisites for Automation

Before setting up auto actions, these must be configured. They provide the data that auto action email templates pull from.

### 2.1 Outgoing Email

**Location:** Benutzerkonto > Ausgehende E-Mail

Verify that outgoing email is configured with:
- Sender email: `kontakt@pension-volgenandt.de`
- Sender name: `Pension Volgenandt`
- Reply-to: `kontakt@pension-volgenandt.de`

If using your own domain email, set up SPF/DKIM records to avoid spam filters. Alternatively, use Beds24's built-in email relay.

### 2.2 Property Templates (Content for Auto Emails)

**Location:** Unterkuenfte > Beschreibung > Property Template 1-4

Auto action emails reference these templates. Currently ALL EMPTY -- fill them:

| Template | Content to Add |
|----------|----------------|
| Template 1 (Parking) | "Kostenfreie Parkplaetze stehen direkt am Haus zur Verfuegung." |
| Template 2 (WiFi) | "WLAN-Name: PensionVolgenandt / Passwort: [Passwort eintragen]" |
| Template 3 (Directions) | "Von der A38 Abfahrt Leinefelde, Richtung Zentrum, nach 500m rechts in die Otto-Reutter-Str. Das Haus befindet sich auf der rechten Seite, Nr. 28." |
| Template 4 (House Rules) | "Ruhezeiten: 22:00-07:00 Uhr. Rauchen nur im Aussenbereich. Haustiere auf Anfrage (10 EUR/Aufenthalt)." |

**Important:** Do this for ALL 3 properties in the dropdown selector. Templates are per-property.

### 2.3 Channel Content Fields

**Location:** Unterkuenfte > Channel Content

Fill in at least the German tab for each property:
- Title / Beschreibung
- Location / Lage
- Directions / Anfahrt
- House Rules / Hausregeln

These are published to Booking.com and used by auto action templates via `[PROPERTYDIRECTIONS]`.

### 2.4 Cancellation Policy Text

**Location:** Unterkuenfte > Beschreibung

Set the cancellation policy text that `[PROPERTYCANCELPOLICY]` renders in emails:

```
Kostenlose Stornierung bis 14 Tage vor Anreise.
Bei spaeterer Stornierung wird die erste Nacht berechnet.
Bei Nichtanreise wird der volle Betrag faellig.
```

---

## 3. Automated Guest Communication

### Current State (from Audit)

| Auto Action | Status |
|-------------|--------|
| 460470: Email confirmation for channel bookings | DISABLED |
| 463027: Cancelled Booking Normal | DISABLED |
| 464470: Email Confirmation for Cancelled booking | ACTIVE |
| 464472: Cancelled Booking 1 Day | DISABLED |

**Only 1 of 4 actions is active, and it's a cancellation email.** No booking confirmations, no pre-arrival info, no payment reminders, no post-stay follow-up.

### Target: 8 Auto Actions

**Location:** Gaestemangement > Auto Actions

---

### Action 1: Booking Confirmation (Direct Bookings)

**Purpose:** Instant confirmation email when someone books directly via your booking engine or manually entered bookings.

| Setting | Value |
|---|---|
| Name | Buchungsbestaetigung Direktbuchung |
| Trigger Event | Booking |
| Trigger Time | 0 (immediate) |
| Source | Direct bookings only |
| Booking Status | Confirmed |
| Action | Send HTML email |
| Subject | Buchungsbestaetigung - [PROPERTYNAME] - [BOOKID] |

**Email Template:**
```html
<h2>Buchungsbestaetigung - [PROPERTYNAME]</h2>

<p>Liebe/r [GUESTFIRSTNAME],</p>

<p>vielen Dank fuer Ihre Buchung! Hier Ihre Buchungsdetails:</p>

<table>
  <tr><td><strong>Buchungsnr.:</strong></td><td>[BOOKID]</td></tr>
  <tr><td><strong>Anreise:</strong></td><td>[FIRSTNIGHT:{%A, %d. %B %Y}]</td></tr>
  <tr><td><strong>Abreise:</strong></td><td>[LEAVINGDAY:{%A, %d. %B %Y}]</td></tr>
  <tr><td><strong>Naechte:</strong></td><td>[NUMNIGHT]</td></tr>
  <tr><td><strong>Zimmer:</strong></td><td>[ROOMNAME]</td></tr>
  <tr><td><strong>Gaeste:</strong></td><td>[NUMADULT] Erwachsene, [NUMCHILD] Kinder</td></tr>
  <tr><td><strong>Gesamtpreis:</strong></td><td>[PRICE]</td></tr>
</table>

<p><strong>Check-in:</strong> [CHECKINSTART] - [CHECKINEND] Uhr<br>
<strong>Check-out:</strong> bis [CHECKOUTEND] Uhr</p>

<p><strong>Stornierungsbedingungen:</strong><br>
[PROPERTYCANCELPOLICY]</p>

[IF=:[INVOICEBALANCENUM]:0:|
<p><strong>Zahlung:</strong><br>
Bitte begleichen Sie den offenen Betrag von [INVOICEBALANCE] bis zur Anreise:</p>
<p>[PAYPALBUTTON]</p>
]

<p>Bei Fragen erreichen Sie uns unter [PROPERTYPHONE] oder [PROPERTYEMAIL].</p>

<p>Wir freuen uns auf Ihren Besuch!</p>

<p>Herzliche Gruesse,<br>
Familie Volgenandt<br>
[PROPERTYNAME]</p>
```

> **Note:** Action 460470 already exists but is DISABLED. Either enable and update it, or create new. Check if the existing template matches, then toggle to "Auto".

---

### Action 2: Channel Welcome Message (Booking.com)

**Purpose:** Personal welcome message sent through Booking.com's messaging API. Builds trust and gives the guest a direct contact.

| Setting | Value |
|---|---|
| Name | Willkommensnachricht Booking.com |
| Trigger Event | Booking |
| Trigger Time | 0 (immediate) |
| Source | Channel Manager |
| Booking Status | Confirmed |
| Action | Send Channel Message (plain text) |

**Plain text (channel API -- no links, no HTML, no special characters):**
```
Liebe/r [GUESTFIRSTNAME],

vielen Dank fuer Ihre Buchung bei [PROPERTYNAME]!

Anreise: [FIRSTNIGHT:{%d.%m.%Y}]
Abreise: [LEAVINGDAY:{%d.%m.%Y}]
Zimmer: [ROOMNAME]

Check-in: [CHECKINSTART] - [CHECKINEND] Uhr

Wir melden uns kurz vor Ihrer Anreise mit weiteren Infos.

Herzliche Gruesse,
Familie Volgenandt
```

> **Important:** Booking.com blocks messages containing URLs, HTML, or special characters like umlauts. Use ae/oe/ue instead of umlauts.

---

### Action 3: Pre-Arrival Info (2 Days Before Check-in)

**Purpose:** Send check-in instructions, directions, WiFi, parking info. Reduces "where are you?" calls and improves guest experience.

| Setting | Value |
|---|---|
| Name | Anreise-Info 2 Tage vorher |
| Trigger Event | Check-in |
| Trigger Time | -2 |
| Trigger Window | 2 days |
| Between Booking and Check-in | 1 to 999 (exclude same-day bookings) |
| Booking Status | Confirmed |
| Action | Send HTML email |
| Subject | Ihre Anreise bei [PROPERTYNAME] am [FIRSTNIGHT:{%d.%m.%Y}] |

**Email Template:**
```html
<h2>Anreiseinformationen - [PROPERTYNAME]</h2>

<p>Liebe/r [GUESTFIRSTNAME],</p>

<p>Ihr Aufenthalt beginnt in Kuerze! Hier die wichtigsten Infos:</p>

<h3>Check-in</h3>
<p><strong>Datum:</strong> [FIRSTNIGHT:{%A, %d. %B %Y}]<br>
<strong>Uhrzeit:</strong> [CHECKINSTART] - [CHECKINEND] Uhr<br>
Bitte teilen Sie uns Ihre voraussichtliche Ankunftszeit mit.</p>

<h3>Anfahrt</h3>
<p>[PROPERTYDIRECTIONS]</p>

<h3>Parken</h3>
<p>[PROPERTYTEMPLATE1]</p>

<h3>WLAN</h3>
<p>[PROPERTYTEMPLATE2]</p>

<h3>Hausregeln</h3>
<p>[PROPERTYTEMPLATE4]</p>

[IF=:[INVOICEBALANCENUM]:0:|
<h3>Zahlung</h3>
<p>Der offene Betrag von <strong>[INVOICEBALANCE]</strong> ist bitte bis zur Anreise zu begleichen:</p>
<p>[PAYPALBUTTON]</p>
]

<p>Bei Fragen: [PROPERTYPHONE] oder [PROPERTYEMAIL]</p>

<p>Wir freuen uns auf Sie!</p>
<p>Familie Volgenandt</p>
```

> **Prerequisite:** Property Templates 1, 2, 4 and `[PROPERTYDIRECTIONS]` must be filled (see Section 2.2). If empty, those sections will render blank.

---

### Action 4: Payment Reminder (7 Days Before, Outstanding Balance)

**Purpose:** Remind guests with unpaid balance to pay before arrival. Reduces no-pays.

| Setting | Value |
|---|---|
| Name | Zahlungserinnerung 7 Tage vorher |
| Trigger Event | Check-in |
| Trigger Time | -7 |
| Invoice Balance | Outstanding |
| Source | Direct bookings only |
| Booking Status | Confirmed |
| Action | Send HTML email |
| Subject | Zahlungserinnerung - [PROPERTYNAME] - Buchung [BOOKID] |

**Email Template:**
```html
<p>Liebe/r [GUESTFIRSTNAME],</p>

<p>Ihr Aufenthalt im [PROPERTYNAME] beginnt am [FIRSTNIGHT:{%d.%m.%Y}].</p>

<p>Der offene Betrag von <strong>[INVOICEBALANCE]</strong> ist bitte bis zur Anreise zu begleichen.</p>

<p>[PAYPALBUTTON]</p>

<p>Falls Sie bereits bezahlt haben, ignorieren Sie bitte diese Nachricht.</p>

<p>Herzliche Gruesse,<br>
Familie Volgenandt<br>
[PROPERTYNAME]</p>
```

> **Note:** Only fires for direct bookings with outstanding balance. Booking.com handles their own payment collection.

---

### Action 5: Invoice Number Assignment (At Check-in)

**Purpose:** Automatically assigns a sequential invoice number on check-in day. German law requires sequential invoice numbering.

| Setting | Value |
|---|---|
| Name | Rechnungsnummer zuweisen |
| Trigger Event | Check-in |
| Trigger Time | 0 |
| Booking Status | Confirmed |
| Action | Assign Invoice Number |

No email template needed -- this is a background action only.

> **Important:** Set the starting invoice number in Gaestemangement > Rechnungen before enabling. Use a number higher than any manually issued invoices (e.g., start at 2026001).

---

### Action 6: Invoice Email (At Checkout)

**Purpose:** Automatically sends the invoice to the guest on checkout day. This is the key automated Rechnung.

| Setting | Value |
|---|---|
| Name | Rechnung senden bei Abreise |
| Trigger Event | Check-out |
| Trigger Time | 0 |
| Booking Status | Confirmed |
| Action | Send HTML email with invoice PDF attachment |
| Subject | Rechnung [INVOICENUMBER] - [PROPERTYNAME] |

**Email Template:**
```html
<p>Liebe/r [GUESTFIRSTNAME],</p>

<p>vielen Dank fuer Ihren Aufenthalt im [PROPERTYNAME]!</p>

<p>Anbei erhalten Sie Ihre Rechnung Nr. <strong>[INVOICENUMBER]</strong>
ueber <strong>[INVOICEGROSS:1]</strong>.</p>

[IF=:[INVOICEBALANCENUM]:0:|
<p>Der offene Betrag von <strong>[INVOICEBALANCE]</strong> ist bitte innerhalb
von 7 Tagen zu begleichen:</p>
<p>[PAYPALBUTTON]</p>
]

[IF=:[INVOICEBALANCENUM]:0:
<p>Der Rechnungsbetrag wurde bereits beglichen. Vielen Dank!</p>
|]

<p>Herzliche Gruesse,<br>
Familie Volgenandt<br>
[PROPERTYNAME]</p>
```

> **Important:** In the action settings, enable "Attach Invoice PDF". This sends the formatted invoice from the invoice template as PDF attachment. For Booking.com guests, send via email (not channel API) since channel API rejects attachments. Filter by "has email address" to avoid sending to guests without email.

---

### Action 7: Post-Stay Review Request (1 Day After Checkout)

**Purpose:** Ask for a Google review and offer a return-booking discount. Builds reputation and encourages direct rebooking.

| Setting | Value |
|---|---|
| Name | Bewertung und Dankeschoen |
| Trigger Event | Check-out |
| Trigger Time | +1 |
| Booking Status | Confirmed |
| Source | All sources |
| Action | Send HTML email |
| Subject | Wie war Ihr Aufenthalt bei [PROPERTYNAME]? |

**Email Template:**
```html
<p>Liebe/r [GUESTFIRSTNAME],</p>

<p>wir hoffen, Sie hatten einen wunderschoenen Aufenthalt im [PROPERTYNAME]!</p>

<p>Wir wuerden uns sehr ueber eine Bewertung freuen -- Ihre Meinung hilft
anderen Gaesten bei der Entscheidung:</p>

<p><a href="https://g.page/r/[GOOGLE_PLACE_ID]/review">Bewertung auf Google schreiben</a></p>

<p>Als Dankeschoen erhalten Sie bei Ihrer naechsten Direktbuchung
<strong>5% Rabatt</strong> mit dem Code: <strong>DANKE5</strong></p>

<p>Buchen Sie direkt auf unserer Website und sparen Sie gegenueber
Booking.com und Airbnb!</p>

<p>Wir freuen uns auf ein Wiedersehen!</p>
<p>Familie Volgenandt<br>
[PROPERTYNAME]<br>
[PROPERTYPHONE]</p>
```

> **Action needed:** Replace `[GOOGLE_PLACE_ID]` with the actual Google review link. Find it at: Google Maps > Your business > Share > "Ask for reviews".

---

### Action 8: Cancellation Confirmation

**Purpose:** Confirm cancellation and keep the door open for rebooking.

| Setting | Value |
|---|---|
| Name | Stornierungsbestaetigung |
| Trigger Event | Booking |
| Trigger Time | 0 (immediate) |
| Booking Status | Cancelled |
| Action | Send HTML email |
| Subject | Stornierung Ihrer Buchung [BOOKID] - [PROPERTYNAME] |

**Email Template:**
```html
<p>Liebe/r [GUESTFIRSTNAME],</p>

<p>Ihre Buchung <strong>[BOOKID]</strong> fuer den
[FIRSTNIGHT:{%d.%m.%Y}] - [LEAVINGDAY:{%d.%m.%Y}]
wurde storniert.</p>

<p>Wir wuerden uns freuen, Sie ein anderes Mal bei uns begruessen zu duerfen.
Buchen Sie direkt auf unserer Website fuer den besten Preis.</p>

<p>Herzliche Gruesse,<br>
Familie Volgenandt<br>
[PROPERTYNAME]</p>
```

> **Note:** Action 464470 already exists and is ACTIVE. Verify its template matches, or update it.

---

### Auto Actions Summary

| # | Name | Trigger | Time | Source | What It Does |
|---|------|---------|------|--------|-------------|
| 1 | Buchungsbestaetigung | Booking | 0 | Direct | Confirmation + payment link |
| 2 | Willkommensnachricht | Booking | 0 | Channel | Welcome via Booking.com API |
| 3 | Anreise-Info | Check-in | -2 | All | Directions, WiFi, parking |
| 4 | Zahlungserinnerung | Check-in | -7 | Direct | Payment reminder if unpaid |
| 5 | Rechnungsnummer | Check-in | 0 | All | Assign invoice number |
| 6 | Rechnung senden | Check-out | 0 | All | Send invoice PDF |
| 7 | Bewertung | Check-out | +1 | All | Google review + DANKE5 code |
| 8 | Stornierung | Booking | 0 | All | Cancellation confirmation |

### Guest Journey with Automation

```
Booking ──► Action 1: Confirmation email (direct) / Action 2: Welcome message (channel)
   │
   │  7 days before check-in
   ├──► Action 4: Payment reminder (if unpaid, direct only)
   │
   │  2 days before check-in
   ├──► Action 3: Pre-arrival info (all guests)
   │
   │  Check-in day
   ├──► Action 5: Invoice number assignment (background)
   │
   │  Check-out day
   ├──► Action 6: Invoice PDF sent by email
   │
   │  1 day after check-out
   └──► Action 7: Review request + DANKE5 code

   Cancellation at any time
   └──► Action 8: Cancellation confirmation
```

### Testing Auto Actions

After creating each action:
1. Click the **Test** tab in the auto action editor
2. It shows which existing bookings would match the trigger conditions
3. Verify the right bookings appear (and wrong ones don't)
4. Send a test email to yourself before going live
5. Set to "Auto" only after testing

---

## 4. Automated Invoicing (Rechnung)

### Current Problems (from Audit)

| Issue | Impact |
|-------|--------|
| Missing Steuernummer | **Legal non-compliance** -- every German invoice must have tax number |
| No guest address block | Incomplete invoice, won't be accepted by businesses |
| English closing text ("Thank you very much...") | Wrong language for German pension |
| No booking details (dates, room, nights) | Missing required service description |
| No net/VAT/gross breakdown | Missing required tax breakdown |
| No payment/balance info | Guest doesn't know what's owed |
| No auto-numbering | Invoice numbers not assigned automatically |
| No auto-send | Invoices not sent automatically |

### Complete Invoice Template (Replace Current)

**Location:** Gaestemangement > Rechnungen > Rechnungsvorlage 1

Select **Pension Volgenandt** in the property dropdown, click the **Deutsch** tab, and replace the entire content:

```html
<table width="100%" style="margin-bottom:20px;">
<tr>
  <td style="vertical-align:top;">
    <strong style="font-size:16px;">Zimmervermietung Ralf Volgenandt</strong><br>
    Otto-Reutter-Str. 28<br>
    37327 Leinefelde-Worbis<br>
    Tel: [PROPERTYPHONE]<br>
    E-Mail: [PROPERTYEMAIL]<br>
    Web: www.pension-volgenandt.de<br>
    Steuernummer: [STEUERNUMMER HIER EINTRAGEN]
  </td>
  <td style="vertical-align:top; text-align:right;">
    <!-- Logo hier einfuegen falls vorhanden -->
  </td>
</tr>
</table>

<p style="font-size:11px; color:#666; margin-bottom:5px;">
Zimmervermietung Ralf Volgenandt, Otto-Reutter-Str. 28, 37327 Leinefelde-Worbis
</p>

<p>
<strong>[GUESTFULLNAME]</strong><br>
[GUESTADDRESS]<br>
[GUESTPOSTCODE] [GUESTCITY]<br>
[GUESTCOUNTRY]
</p>

<h2 style="margin-top:30px;">Rechnung Nr. [INVOICENUMBER]</h2>

<table style="margin-bottom:20px;">
  <tr><td style="padding-right:20px;">Rechnungsdatum:</td><td>[INVOICEDATE]</td></tr>
  <tr><td style="padding-right:20px;">Buchungsnr.:</td><td>[BOOKID]</td></tr>
  <tr><td style="padding-right:20px;">Anreise:</td><td>[FIRSTNIGHT:{%d.%m.%Y}]</td></tr>
  <tr><td style="padding-right:20px;">Abreise:</td><td>[LEAVINGDAY:{%d.%m.%Y}]</td></tr>
  <tr><td style="padding-right:20px;">Zimmer:</td><td>[ROOMNAME]</td></tr>
  <tr><td style="padding-right:20px;">Naechte:</td><td>[NUMNIGHT]</td></tr>
  <tr><td style="padding-right:20px;">Gaeste:</td><td>[NUMADULT] Erw., [NUMCHILD] Kinder</td></tr>
</table>

[INVOICETABLEVAT]

<table style="margin-top:15px; border-top:1px solid #ccc; padding-top:10px;">
  <tr><td style="padding-right:30px;">Nettobetrag:</td><td style="text-align:right;">[INVOICENET:1]</td></tr>
  <tr><td>zzgl. 7% USt (Uebernachtung):</td><td style="text-align:right;">[INVOICEVAT:1]</td></tr>
  <tr><td><strong>Bruttobetrag:</strong></td><td style="text-align:right;"><strong>[INVOICEGROSS:1]</strong></td></tr>
  <tr><td>Bereits bezahlt:</td><td style="text-align:right;">[INVOICEPAYMENTS]</td></tr>
  <tr><td><strong>Offener Betrag:</strong></td><td style="text-align:right;"><strong>[INVOICEBALANCE]</strong></td></tr>
</table>

<p style="margin-top:20px; font-size:11px; color:#666;">
Leistungsdatum entspricht dem Aufenthaltsdatum ([FIRSTNIGHT:{%d.%m.%Y}] - [LEAVINGDAY:{%d.%m.%Y}]).<br>
Zahlbar sofort ohne Abzug.
</p>

<p style="margin-top:30px;">
Vielen Dank fuer Ihren Aufenthalt bei [PROPERTYNAME]!<br>
Wir freuen uns auf ein Wiedersehen.
</p>

<p>Herzliche Gruesse,<br>
Familie Volgenandt</p>
```

> **Important:** Replace `[STEUERNUMMER HIER EINTRAGEN]` with the actual Steuernummer before saving.
>
> Place `[INVOICETABLEVAT]` outside of `<p>` tags -- it generates its own table.

### Kleinunternehmerregelung (Section 19 UStG)

If annual revenue < 22,000 EUR, replace the VAT breakdown with:
```html
<p style="font-size:11px;">
Kein Ausweis von Umsatzsteuer, da Kleinunternehmer
gemaess Paragraph 19 UStG.
</p>
```
And use `[INVOICETABLE]` instead of `[INVOICETABLEVAT]`.

### Also Do for English Tab

Copy a translated version into the English tab for international guests. Use `[GUESTLANGUAGE]` detection or let Beds24 auto-select based on guest language.

### Also Do for the Other 2 Properties

Repeat for Ferienwohnung Emil's Kuhwiese and Ferienwohnung Schoene Aussicht by selecting them in the property dropdown.

### Automated Invoice Flow

With Actions 5 and 6 from Section 3:

```
Check-in day ──► Action 5: Invoice number auto-assigned (e.g., 2026042)
Check-out day ──► Action 6: Invoice PDF emailed to guest automatically
```

No manual intervention needed. Invoice is generated from the template, numbered sequentially, and sent as PDF attachment.

---

## 5. Price Optimization

### Current State (from Audit)

| Setting | Current | Problem |
|---------|---------|---------|
| Base rates | Balkonzimmer 55, Rosengarten 55, Wohlfuehl 65 | OK as base |
| Seasonal pricing | NONE | Same price 365 days/year |
| Weekend surcharge | NONE | Fri/Sat same as Mon-Thu |
| Fixed Prices | EMPTY | No rate plans |
| Yield Optimizer | EMPTY | No dynamic pricing rules |
| Length-of-stay discount | NONE | No incentive for longer stays |
| Price multipliers | OTA 115%, Airbnb 120% | Good (already set) |
| Calendar horizon | ~11 months | Should be 18 months |

**Estimated revenue loss from flat pricing: 1,500-3,000 EUR/year**

### 5.1 Seasonal Pricing (Fixed Prices)

**Location:** Preise > Feste Preise

Beds24 uses the **lowest available price**. Strategy: set your HIGH season price as the daily default, then create Fixed Prices with lower rates for shoulder/low seasons.

**Step 1:** Raise daily prices to high-season rates:

| Room | Current Daily | New Daily (= High Season) |
|------|--------------|---------------------------|
| Balkonzimmer | 55.00 | **65.00** |
| Rosengarten Zimmer | 55.00 | **65.00** |
| Wohlfuehl-Appartement | 65.00 | **75.00** |

**Step 2:** Create Fixed Prices for lower seasons:

| Fixed Price Name | Date Range | Balkonzimmer | Rosengarten | Wohlfuehl |
|------------------|-----------|--------------|-------------|-----------|
| Nebensaison (Low) | Nov 1 - Mar 14 (excl. Christmas) | 49.00 | 49.00 | 59.00 |
| Uebergang (Shoulder) | Mar 15 - May 31, Oct 1 - Oct 31 | 55.00 | 55.00 | 65.00 |
| Weihnachten (Christmas) | Dec 20 - Jan 6 | 69.00 | 69.00 | 79.00 |
| Ostern (Easter) | varies yearly | 69.00 | 69.00 | 79.00 |

**Result:** Prices automatically adjust by season. High season (Jun-Sep) uses the daily rate. Lower seasons use Fixed Prices.

### 5.2 Weekend Surcharges

**Location:** Kalender > Preismultiplikator (per room)

Set price multipliers for Friday and Saturday nights:

| Day | Multiplier |
|-----|-----------|
| Monday-Thursday | 100 (no change) |
| Friday | 115 (15% more) |
| Saturday | 115 (15% more) |
| Sunday | 100 (no change) |

**Example:** Balkonzimmer high season: 65.00 x 1.15 = 74.75 EUR on Fri/Sat nights.

### 5.3 Yield Optimizer Rules

**Location:** Preise > Yield Optimiser

Create these 3 rules for Pension Volgenandt (3 rooms):

| Rule Name | Condition | Price Adjustment |
|-----------|-----------|-----------------|
| Hohe Nachfrage | 2+ rooms booked for same dates, arrival within 7 days | 125% (+25%) |
| Mittlere Nachfrage | 2+ rooms booked, arrival within 14 days | 110% (+10%) |
| Last-Minute Rabatt | 0 rooms booked for date, arrival within 3 days | 85% (-15%) |

**How it works:** When 2 of 3 pension rooms are booked and arrival is in 7 days, the remaining room automatically gets 25% more expensive. When nothing is booked and arrival is in 3 days, prices drop 15% to attract last-minute bookings.

### 5.4 Length-of-Stay Discounts

**Location:** Buchungsmaschine > Gutschein Codes (or Fixed Prices)

| Stay Length | Discount | Method |
|-------------|---------|--------|
| 3+ nights | 5% | Fixed Price with Min Stay = 3 |
| 7+ nights | 10% | Fixed Price with Min Stay = 7 |

Create as separate Fixed Prices that overlap with your seasonal prices. The lower price wins.

### 5.5 Extend Calendar to 18 Months

**Location:** Preise > Tagespreise

Ensure all rooms have daily prices entered for at least 18 months ahead. The dashboard already warns: "Balkonzimmer has no price after Jan 31, 2027."

Enter prices through at least August 2027.

### 5.6 Channel Price Strategy (Already Configured)

Current multipliers are good:
- **Direct bookings:** 100% (best price -- incentivizes direct booking)
- **Booking.com (OTA):** 115% (offsets ~15% commission)
- **Airbnb:** 120% (offsets 15.5% commission)

This means a room priced at 55 EUR direct shows as 63.25 EUR on Booking.com and 66.00 EUR on Airbnb. The guest sees that booking direct is cheapest.

### Pricing Impact Estimate

| Improvement | Annual Revenue Impact |
|-------------|----------------------|
| Seasonal high-season markup (+15-25%) | +800-1,500 EUR |
| Weekend surcharges (+15% Fri/Sat) | +400-800 EUR |
| Yield optimizer (dynamic pricing) | +300-600 EUR |
| Reduced low-season vacancy (-15% discount fills rooms) | +200-500 EUR |
| **Total** | **+1,700-3,400 EUR/year** |

---

## 6. Booking Engine & Conversion

### Current State (from Audit)

| Setting | Current | Status |
|---------|---------|--------|
| Booking page version | Responsive | OK |
| Checkout page version | Responsive | OK |
| Deposit 1 | **100%** | Too high -- kills conversion |
| Deposit 2 | **100%** | Too high |
| Booking type | Confirmed with Deposit 1 | OK concept, bad percentage |
| Short-term bookings | 1 day in advance | OK |
| Cancellation | Always possible | Too generous |
| Voucher codes | NONE | Missing |
| Branding customization | Unknown | Not audited |

### 6.1 Fix Deposit Settings (Biggest Conversion Killer)

**Location:** Buchungsmaschine > Anzahlungen Direktbuchungen

**Problem:** Deposit 1 is set to 100%. Guests must pay the FULL amount upfront to book. Combined with PayPal as the only payment method, this creates massive friction. Many guests will abandon.

**Fix:**

| Setting | Change To |
|---------|-----------|
| Anzahlung 1 Prozent | **30%** |
| Anzahlung 1 fester Betrag | 0.00 (keep) |
| Anzahlung 2 Prozent | **0%** (disable) |

Now guests pay 30% deposit to confirm, and the rest before check-in (collected via payment reminder auto action or manually).

### 6.2 Set Cancellation Policy

**Location:** Buchungsmaschine > Stornierung durch den Gast

**Current:** "immer" (always -- free cancellation anytime, even day-of)

**Change to:** **14 Tage vor Check-in** (14 days before check-in)

This protects against last-minute cancellations while still being guest-friendly. Match this with the cancellation policy text set in Section 2.4.

### 6.3 Create Voucher Code DANKE5

**Location:** Buchungsmaschine > Gutschein Codes

| Setting | Value |
|---------|-------|
| Code | DANKE5 |
| Discount | 5% |
| Type | Percentage |
| Valid from | 2026-01-01 |
| Valid to | 2027-12-31 |
| Max uses | Unlimited |

This code is referenced in the post-stay email (Action 7). Returning guests get 5% off direct bookings.

### 6.4 Direct Booking Discount

Create another voucher or a Fixed Price that gives direct bookers 5% less than the OTA price:

Since OTAs already show 115% of base price, direct bookers at 100% already get a better deal. Make this explicit on your booking page and website:

> "Buchen Sie direkt und sparen Sie bis zu 15% gegenueber Booking.com!"

### 6.5 Booking Page Branding

**Location:** Buchungsmaschine > Buchungsseite Unterkunft > Style

Match the booking page colors to your website:
- Primary color: Sage green (#7C8B6F or similar)
- Accent/CTA: Waldhonig (#D4A843 or similar)
- Font: Match website font

### 6.6 Booking Page Pictures

**Location:** Buchungsmaschine > Bilder

Upload at least:
- 3-5 property exterior/common area photos
- 3-5 photos per room

Photos dramatically improve booking engine conversion.

---

## 7. Payment Optimization

### Current State (from Audit)

| Gateway | Status |
|---------|--------|
| Stripe | NOT connected ("Nicht verwendet") |
| PayPal | Connected, email: Kontakt@pension-volgenandt.de |

### 7.1 Add Stripe (Recommended)

**Location:** Zahlungen > Zahlungsdienstleister > Stripe

| Feature | Stripe | PayPal |
|---------|--------|--------|
| EU card fee | **1.4% + 0.25 EUR** | 2.49% + 0.35 EUR |
| Auto-charge OTA virtual cards | **Yes** | No |
| Auto-charge guest cards | **Yes** | No |
| Scheduled payment collection | **Yes** | No |
| German consumer recognition | Lower | High |

**Strategy:** Stripe as primary (cheapest, most automation), PayPal as secondary (guest trust).

**Setup steps:**
1. Go to Zahlungen > Zahlungsdienstleister
2. Click Stripe > Connect
3. Complete Stripe onboarding (requires business details, bank account)
4. Set Stripe priority higher than PayPal

### 7.2 Payment Rules (After Stripe)

**Location:** Zahlungen > Zahlungsregeln

| Rule | Trigger | Amount | Method |
|------|---------|--------|--------|
| Deposit | At booking | 30% | Auto-charge card via Stripe |
| Balance | 14 days before check-in | Remaining | Auto-charge card via Stripe |
| Booking.com VCC | When card is valid | Full amount | Auto-charge virtual card via Stripe |

### 7.3 Savings Estimate

At 100 bookings/year, average 200 EUR:
- PayPal cost: 100 x (200 x 2.49% + 0.35) = **533 EUR/year**
- Stripe cost: 100 x (200 x 1.4% + 0.25) = **305 EUR/year**
- **Savings: ~228 EUR/year**

Plus the automation benefit: no manual payment chasing.

---

## 8. Channel Expansion (Airbnb)

### Why Add Airbnb

- Second-largest booking platform in Germany for vacation rentals
- Different guest demographic (more leisure, younger, international)
- Price multiplier already configured at 120% in Beds24
- Additional cost: only 5 x 0.55 = 2.75 EUR/month in Beds24

### Cost

| Item | Cost |
|------|------|
| Beds24 channel links | 2.75 EUR/month |
| Airbnb host commission | 15.5% per booking |
| **Net cost per 100 EUR booking** | **15.50 EUR** |

With the 120% price multiplier, a 55 EUR direct room shows as 66 EUR on Airbnb. After 15.5% commission: 66 - 10.23 = 55.77 EUR. You earn roughly the same as a direct booking.

### Setup Steps

1. **Prerequisites:**
   - German Impressum in Airbnb profile (required for DACH region)
   - At least 1 photo per listing (800x500px minimum)
   - Complete amenity list per listing

2. **Connect:**
   - Channel Manager > Add Channel > Airbnb
   - Authorize Beds24 to access your Airbnb account
   - Map each room to an Airbnb listing

3. **Sync level:** Start with "Prices and Availability" -- manage descriptions directly in Airbnb for more control

4. **Content needed per listing:**
   - 20+ photos with captions
   - Complete amenity list
   - House rules
   - Cancellation policy
   - Check-in instructions
   - Location description

### Estimated Revenue

Even capturing just 2 additional bookings/month through Airbnb at average 120 EUR:
- 24 bookings x 120 EUR = 2,880 EUR/year additional revenue
- Minus 15.5% commission: 2,434 EUR net
- Minus Beds24 cost: 2,434 - 33 = **~2,400 EUR/year net gain**

---

## 9. Template Variables Reference

### Guest Variables
| Variable | Output |
|---|---|
| `[GUESTFULLNAME]` | Title + first + last name |
| `[GUESTFIRSTNAME]` | First name |
| `[GUESTNAME]` | Last name |
| `[GUESTEMAIL]` | Email |
| `[GUESTPHONE]` | Phone |
| `[GUESTCOUNTRY]` | Country |
| `[GUESTADDRESS]` | Street address |
| `[GUESTPOSTCODE]` | Postal code |
| `[GUESTCITY]` | City |
| `[GUESTARRIVALTIME]` | Expected arrival time |
| `[GUESTLANGUAGE]` | Language preference |

### Booking Variables
| Variable | Output |
|---|---|
| `[BOOKID]` | Booking reference number |
| `[FIRSTNIGHT:{%d.%m.%Y}]` | Check-in (German date format) |
| `[LEAVINGDAY:{%d.%m.%Y}]` | Check-out (German date format) |
| `[FIRSTNIGHT:{%A, %d. %B %Y}]` | Check-in (long format with weekday) |
| `[NUMNIGHT]` | Number of nights |
| `[NUMADULT]` | Number of adults |
| `[NUMCHILD]` | Number of children |
| `[ROOMNAME]` | Room name(s) |
| `[PRICE]` | Total price with currency |
| `[STATUS]` | Booking status |
| `[REFERRER]` | Booking source |

### Property Variables
| Variable | Output |
|---|---|
| `[PROPERTYNAME]` | Pension Volgenandt |
| `[PROPERTYADDRESS]` | Full address |
| `[PROPERTYPHONE]` | +4916097719112 |
| `[PROPERTYEMAIL]` | kontakt@pension-volgenandt.de |
| `[PROPERTYDIRECTIONS]` | Directions text |
| `[CHECKINSTART]` / `[CHECKINEND]` | Check-in window (14:00 / 00:00) |
| `[CHECKOUTEND]` | Checkout time (11:00) |
| `[PROPERTYCANCELPOLICY]` | Cancellation policy text |
| `[PROPERTYTEMPLATE1]` | Parking info |
| `[PROPERTYTEMPLATE2]` | WiFi info |
| `[PROPERTYTEMPLATE3]` | Directions |
| `[PROPERTYTEMPLATE4]` | House rules |

### Invoice Variables
| Variable | Output |
|---|---|
| `[INVOICENUMBER]` | Sequential invoice number |
| `[INVOICEDATE]` | Invoice date |
| `[INVOICETABLE]` | Basic line items table |
| `[INVOICETABLEVAT]` | Line items with VAT breakdown |
| `[INVOICETABLEVATCOMPACT:$1.1$]` | Compact VAT table (currently used) |
| `[INVOICEBALANCE]` | Outstanding balance (formatted) |
| `[INVOICEBALANCENUM]` | Outstanding balance (number, for conditionals) |
| `[INVOICEGROSS:1]` | Total incl. VAT |
| `[INVOICENET:1]` | Total excl. VAT |
| `[INVOICEVAT:1]` | VAT amount |
| `[INVOICEPAYMENTS]` | Total payments received |

### Payment Variables
| Variable | Output |
|---|---|
| `[PAYLINK]` | Payment portal link |
| `[PAYBUTTON]` | Payment button (HTML) |
| `[PAYPALURL]` | PayPal payment link |
| `[PAYPALBUTTON]` | PayPal button (HTML) |

### Conditional Logic
```
[IF=:[INVOICEBALANCENUM]:0:Text if zero|Text if not zero]
[IF=:[GUESTLANGUAGE]:DE:German text|English text]
```

---

## 10. Implementation Checklist

### Phase 1: Compliance Fixes (30 min)

- [ ] Fix upsell item VAT to 19% (all 3 properties)
- [ ] Add Steuernummer to invoice template
- [ ] Fill E-Invoice section (company name, address, tax number)
- [ ] Fix invoice closing text from English to German
- [ ] Set website URL in property description
- [ ] Enable auto-report invalid cards in Channel Manager

### Phase 2: Prerequisites (30 min)

- [ ] Verify outgoing email is configured
- [ ] Fill Property Template 1 (Parking) for all 3 properties
- [ ] Fill Property Template 2 (WiFi) for all 3 properties
- [ ] Fill Property Template 3 (Directions) for all 3 properties
- [ ] Fill Property Template 4 (House Rules) for all 3 properties
- [ ] Set cancellation policy text in property description
- [ ] Fill channel content fields (description, directions, house rules)

### Phase 3: Invoice Template (30 min)

- [ ] Replace invoice template 1 with new template (Deutsch tab)
- [ ] Add English version in Englisch tab
- [ ] Set invoice starting number (e.g., 2026001)
- [ ] Repeat for all 3 properties
- [ ] Test by generating a sample invoice from an existing booking

### Phase 4: Auto Actions (2 hours)

- [ ] Action 1: Buchungsbestaetigung (direct bookings)
- [ ] Action 2: Willkommensnachricht (channel bookings)
- [ ] Action 3: Anreise-Info (2 days before)
- [ ] Action 4: Zahlungserinnerung (7 days before, if unpaid)
- [ ] Action 5: Rechnungsnummer zuweisen (at check-in)
- [ ] Action 6: Rechnung senden (at checkout, with PDF)
- [ ] Action 7: Bewertung + DANKE5 (1 day after checkout)
- [ ] Action 8: Stornierungsbestaetigung (update existing #464470)
- [ ] Test ALL actions with the Test tab
- [ ] Send test emails to yourself

### Phase 5: Pricing (1-2 hours)

- [ ] Raise daily prices to high-season rates (65/65/75)
- [ ] Create Fixed Price: Nebensaison (Nov-Mar, 49/49/59)
- [ ] Create Fixed Price: Uebergang (Apr-May + Oct, 55/55/65)
- [ ] Create Fixed Price: Weihnachten (Dec 20-Jan 6, 69/69/79)
- [ ] Set weekend multipliers: Fri/Sat = 115
- [ ] Add Yield Optimizer: Hohe Nachfrage rule
- [ ] Add Yield Optimizer: Mittlere Nachfrage rule
- [ ] Add Yield Optimizer: Last-Minute Rabatt rule
- [ ] Extend pricing calendar to 18 months (through Aug 2027+)

### Phase 6: Booking Engine (30 min)

- [ ] Change Deposit 1 from 100% to 30%
- [ ] Change cancellation from "immer" to "14 Tage vor Check-in"
- [ ] Create voucher code DANKE5 (5% off)
- [ ] Customize booking page branding (colors, fonts)
- [ ] Upload property and room photos

### Phase 7: Payments (1 hour)

- [ ] Connect Stripe payment gateway
- [ ] Set Stripe as primary, PayPal as secondary
- [ ] Configure payment rules (30% at booking, balance at -14 days)
- [ ] Test payment flow end-to-end

### Phase 8: Airbnb (2-3 hours)

- [ ] Ensure Impressum is set in Airbnb profile
- [ ] Prepare 20+ photos per listing
- [ ] Connect Airbnb in Channel Manager
- [ ] Map all rooms to Airbnb listings
- [ ] Set sync level to "Prices and Availability"
- [ ] Verify Airbnb price multiplier is 120%
- [ ] Complete Airbnb listing content
- [ ] Import any existing Airbnb bookings
- [ ] Enable two-way sync

---

## Revenue Impact Summary

| Improvement | Annual Impact |
|-------------|---------------|
| Seasonal pricing | +800-1,500 EUR |
| Weekend surcharges | +400-800 EUR |
| Yield optimizer | +300-600 EUR |
| Airbnb channel | +2,000-5,000 EUR |
| Stripe savings | +200-300 EUR |
| Direct booking incentives | +500-1,000 EUR |
| Reduced vacancy (discounts in low season) | +200-500 EUR |
| **Total estimated** | **+4,400-9,700 EUR/year** |

Against additional costs:
- Beds24 upgrade: ~130 EUR/year
- Airbnb commissions: ~15.5% of Airbnb revenue
- Stripe fees: ~1.4% per transaction (but cheaper than current PayPal)

**Net ROI: strongly positive from Phase 1 onwards.**

---

## Common Mistakes to Avoid

1. **0% VAT on breakfast/extras** -- ALREADY happening, fix immediately. 7% = accommodation only, 19% = everything else
2. **100% deposit for direct bookings** -- ALREADY happening, kills conversion. Use 30%
3. **No auto actions** -- ALREADY happening. Set up all 8 to automate guest journey
4. **Flat pricing year-round** -- ALREADY happening. Implement seasonal rates
5. **Links in Booking.com messages** -- Booking.com blocks them. Use plain text, no URLs
6. **PDF attachments to channel guests** -- Booking.com alias emails reject PDFs. Only attach invoice PDFs to guests with real email addresses
7. **English text on German invoices** -- ALREADY happening. Fix closing text
8. **Not testing Auto Actions** -- Always use Test tab before setting to "Auto"
9. **Property Templates empty** -- ALREADY happening. Pre-arrival emails will have blank sections until filled
10. **Calendar too short** -- ALREADY happening. Extend to 18 months minimum

---

## Sources

- [Beds24 Wiki: Auto Actions](https://wiki.beds24.com/index.php/Auto_Actions)
- [Beds24 Wiki: Template Variables](https://wiki.beds24.com/index.php/Template_Variables)
- [Beds24 Wiki: Invoice Template](https://wiki.beds24.com/index.php/Customise_Invoice_Template)
- [Beds24 Wiki: Tax/Steuer](https://wiki.beds24.com/wikiDE/index.php/Steuer)
- [Beds24 Wiki: Seasonal Prices](https://wiki.beds24.com/index.php/Seasonal_Prices)
- [Beds24 Wiki: Yield Optimiser](https://wiki.beds24.com/index.php/Yield_Optimiser)
- [Beds24 Wiki: Airbnb Mapping](https://wiki.beds24.com/index.php/Airbnb_Mapping)
- [Beds24 Wiki: Stripe](https://wiki.beds24.com/index.php/Stripe)
- [Beds24 Wiki: Payments](https://wiki.beds24.com/index.php/Category:Payments)
- [Beds24 Wiki: Responsive Booking Page](https://wiki.beds24.com/index.php/Responsive_Booking_Page)
- [Beds24 Blog: Guest Communication](https://blog.beds24.com/ultimate-guide-to-effective-guest-communication/)
- [Beds24 Blog: Yield Management](https://blog.beds24.com/yield-management-for-small-hotels-and-accommodation-providers/)

_Updated: 2026-02-22 (post-audit revision)_
