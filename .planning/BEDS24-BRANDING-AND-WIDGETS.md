# Beds24 Branding & Widget Improvements

**Purpose:** Make the Beds24 booking page (opens in new tab) feel like a continuation of the Pension Volgenandt website, and improve the on-site booking widgets for better UX/conversion.

**Last updated:** 2026-02-22 (widget configs tested via Widget Designer with Playwright)

---

## Beds24 Room IDs

| Room | Property ID | Room ID |
|---|---|---|
| Balkonzimmer | 261258 | 548066 |
| Rosengarten Zimmer | 261258 | 549252 |
| Wohlfühl-Appartement | 261258 | 549319 |

---

## Part 1: Beds24 Booking Page Branding

When a visitor clicks "Jetzt buchen" on the Nuxt site, the Beds24 booking page opens in a new tab. Right now it looks like generic Beds24 (blue buttons, Arial, gray backgrounds). Here's how to make it feel like the pension website.

### 1.1 Style Settings (Admin > Buchungsseite Unterkunft > Style)

Map the pension design system to Beds24's color picker fields:

| Beds24 Setting | Current (default) | Change to | Pension Token |
|---|---|---|---|
| Hintergrundfarbe Seite | `#f4f4f4` | `#fdfcf8` | warm-white |
| Hintergrundfarbe Content | `#f4f4f4` | `#fdfcf8` | warm-white |
| Textfarbe | `#424242` | `#234024` | sage-800 |
| Linkfarbe | `#008acc` | `#5d8f5e` | sage-500 |
| Rahmenfarbe | `#dfdfdf` | `#c8dfc8` | sage-200 |
| Highlight | `#ffffff` | `#f8f5ee` | cream |
| Formular Hintergrund | `#ffffff` | `#ffffff` | keep white |
| Verfügbar Hintergrund | `#f2f2f2` | `#e3efe3` | sage-100 |
| Nicht verfügbar bg | `#f2dede` | `#f2dede` | keep (red = intuitive) |
| Nicht verfügbar text | `#a94442` | `#a94442` | keep (red = intuitive) |
| **Button Stil** | flat | **flat** | keep flat |
| **Button Farbe** | `#008acc` | `#865725` | waldhonig-500 |
| **Button Textfarbe** | `#ffffff` | `#ffffff` | keep white |
| Schriftart | Arial | `DM Sans` | font-sans (see 1.2) |
| Schriftgröße | 14px | `16px` | closer to site's 18px base |

### 1.2 Custom Font via Developer Page (Admin > Developer > HTML HEAD top)

Beds24's font field accepts a font name as text but doesn't load it. Inject Google Fonts in HTML HEAD:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Lora:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
```

Then set Schriftart to `DM Sans` in Style settings. This loads both DM Sans (body) and Lora (for custom CSS headings).

### 1.3 Custom CSS (Admin > Developer > Individuelles CSS)

Fine-tune what the color pickers can't reach:

```css
/* Headings in Lora serif to match pension site */
h1, h2, h3, h4, h5, h6,
.offer-title, .room-title, .property-title {
  font-family: 'Lora', Georgia, serif !important;
  font-weight: 600;
}

/* Softer border radius to match pension's rounded-lg (8px) */
.btn, button, input, select, textarea, .card, .panel {
  border-radius: 8px !important;
}

/* Calendar available dates with sage tint */
.calendar td.available {
  background-color: #e3efe3 !important;
}

/* Booking button hover matches waldhonig-600 */
.btn-primary:hover, .book-button:hover {
  background-color: #71481d !important;
}

/* Form inputs get sage-500 focus ring instead of blue */
input:focus, select:focus, textarea:focus {
  border-color: #5d8f5e !important;
  box-shadow: 0 0 0 2px rgba(93, 143, 94, 0.25) !important;
  outline: none !important;
}

/* Links hover state */
a:hover {
  color: #456f46 !important;
}
```

**Note:** The exact CSS selectors need testing against the live booking page. Beds24 may use different class names. Open the booking page, inspect elements, and adjust selectors accordingly.

### 1.4 Layout Template Selection

Currently using template 3: "Einheit Slider, Beschreibung: Offerte Beschreibung, Price Table"

**Recommendation:** Keep template 3. Visitors already saw room details on the Nuxt site, they just need to pick dates and book.

### 1.5 Content Sections to Fill

These text blocks show on the booking page and are currently all empty:

| Section | What to write | Priority |
|---|---|---|
| **AGB** | Terms and conditions (legally required) | Critical |
| **Stornobedingungen** | Cancellation policy text | Critical |
| **Information zur Bestätigung** | "Vielen Dank für Ihre Buchung! Sie erhalten eine Bestätigung per E-Mail..." | High |
| **Nachricht / Einheit nicht verfügbar** | "Dieses Zimmer ist leider im gewählten Zeitraum belegt. Prüfen Sie alternative Termine oder kontaktieren Sie uns: +49..." | High |
| **Nachricht / Keine Einheiten verfügbar** | "Für den gewählten Zeitraum sind leider keine Zimmer verfügbar. Rufen Sie uns an..." | Medium |
| **Nachricht / Einheit kein Preis** | "Für diesen Zeitraum liegt kein Preis vor. Bitte kontaktieren Sie uns..." | Medium |
| Beschreibung Unterkunft - Buchungsseite 1 | Short welcome text: "Willkommen bei Pension Volgenandt - Ihr Zuhause im Schwarzwald" | Nice-to-have |

### 1.6 Behaviour Settings for New-Tab Flow

| Setting | Change to | Why |
|---|---|---|
| In neuem Fenster öffnen | `nie` | Booking page is already in a new tab from our site |
| URL nach Buchung | `https://pension-volgenandt.de/buchung/danke` | Redirect back to pension site after successful booking (create this page in Phase 5) |
| URL fehlgeschlagene Buchung | *(leave empty)* | Beds24 shows its own error handling |

### 1.7 Booking Page URL Parameters

When linking from the Nuxt site, use these URL params for best UX:

```
https://beds24.com/booking2.php?propid=261258&lang=de&referer=Website&numnight=2&numadult=2
```

| Param | Value | Purpose |
|---|---|---|
| `propid` | `261258` | Pension property |
| `roomid` | `548066` / `549252` / `549319` | Pre-filter to specific room |
| `lang` | `de` | Match visitor's language |
| `referer` | `Website` | Track conversions from website vs OTAs |
| `numnight` | `2` | Pre-fill default stay length |
| `numadult` | `2` | Pre-fill default guest count |

---

## Part 2: On-Site Widget Improvements

The Nuxt site uses Beds24 JavaScript widgets (`bookWidget.min.js` via jQuery) loaded consent-gated through `useBeds24Widget.ts`.

### Widget Script

```
Current:  https://media.xmlcal.com/widget/1.00/js/bookWidget.min.js
Update to: https://media.xmlcal.com/widget/1.01/js/bookWidget.min.js
```

### 2.1 BookingBox — Room Detail Pages

Current `Beds24Widget.vue` has wrong hex values and incomplete params. Replace with this **tested config** (from Widget Designer, 2026-02-22):

```js
$(container).bookWidget({
  widgetType: 'BookingBox',
  propid: props.beds24PropertyId,
  ...(props.beds24RoomId != null ? { roomid: props.beds24RoomId } : {}),
  widgetLang: 'de',
  dateFormat: 'dd.mm.yy',
  dateSelection: 2,                      // check-in + nights
  weekFirstDay: 1,                       // Monday
  peopleSelection: 2,                    // adults + children
  defaultNumAdult: 2,
  defaultNumNight: 2,
  showLabels: true,
  fontSize: '16px',
  // Colors (exact design token hex values)
  backgroundColor: '#fdfcf8',            // warm-white
  borderColor: '#c8dfc8',                // sage-200
  color: '#234024',                      // sage-800 (text)
  buttonBackgroundColor: '#865725',      // waldhonig-500 (CTA bg)
  buttonColor: '#ffffff',                // white (CTA text)
  buttonTitle: 'Jetzt buchen',
  availableBackgroundColor: '#e3efe3',   // sage-100
  availableColor: '#234024',             // sage-800
  unavailableBackgroundColor: '#f2dede',
  unavailableColor: '#a94442',
  pastBackgroundColor: '#f1f7f1',        // sage-50
  pastColor: '#a6c9a6',                  // sage-300
  requestBackgroundColor: '#f8f5ee',     // cream
  requestColor: '#865725',               // waldhonig-500
  searchLinkText: 'Verfügbarkeit prüfen',
  formAction: 'https://beds24.com/booking2.php',
  formTarget: '_blank',
})
```

**What changed vs current `Beds24Widget.vue`:**

| Param | Old (wrong) | New (correct) | Issue |
|---|---|---|---|
| `buttonColor` | `'#c8913a'` | N/A — renamed | Was setting button text color, not bg |
| — | — | `buttonBackgroundColor: '#865725'` | New: actual CTA bg color |
| — | — | `buttonColor: '#ffffff'` | New: CTA text color |
| `color` | `'#2d4a3e'` | `'#234024'` | Wrong hex for sage-800 |
| `backgroundColor` | `'#f9f7f4'` | `'#fdfcf8'` | Wrong hex for warm-white |
| `borderColor` | `'#bfc9c3'` | `'#c8dfc8'` | Wrong hex for sage-200 |
| `dateSelection` | `3` | `2` | 2 = check-in + nights (correct mode) |
| — | — | 12 new color params | Calendar date colors were missing |

### 2.2 AvailabilityCalendar — Room Detail Pages

New widget, not yet implemented. Shows 3 months of color-coded availability at a glance. **Tested config from Widget Designer:**

```js
$(calendarContainer).bookWidget({
  widgetType: 'AvailabilityCalendar',  // NOT 'Belegungskalender' — API name differs from UI
  propid: props.beds24PropertyId,
  ...(props.beds24RoomId != null ? { roomid: props.beds24RoomId } : {}),
  widgetLang: 'de',
  numMonth: 3,                           // show 3 months side-by-side
  dateFormat: 'dd.mm.yy',
  weekFirstDay: 1,                       // Monday
  defaultNumAdult: 2,
  defaultNumNight: 2,
  fontSize: '16px',
  // Colors
  backgroundColor: '#fdfcf8',            // warm-white
  borderColor: '#c8dfc8',                // sage-200
  color: '#234024',                      // sage-800 (text)
  availableBackgroundColor: '#e3efe3',   // sage-100
  availableColor: '#234024',             // sage-800
  unavailableBackgroundColor: '#f2dede',
  unavailableColor: '#a94442',
  pastBackgroundColor: '#f1f7f1',        // sage-50
  pastColor: '#a6c9a6',                  // sage-300
  requestBackgroundColor: '#f8f5ee',     // cream
  requestColor: '#865725',               // waldhonig-500
  searchLinkText: 'Verfügbarkeit prüfen',
  formAction: 'https://beds24.com/booking2.php',
  formTarget: '_blank',
})
```

**UX flow:** Visitor sees green/red/amber calendar dates -> clicks available date -> Beds24 booking page opens in new tab with date pre-selected.

> **Note:** Widget Designer generates `formAction: 'booking.php'` (legacy). Always use `booking2.php` (responsive).

### 2.3 BookingBoxMini — Room Cards on /zimmer

New widget for compact inline booking on room cards. **Tested config from Widget Designer:**

```js
$(miniContainer).bookWidget({
  widgetType: 'BookingBoxMini',
  propid: props.beds24PropertyId,
  ...(props.beds24RoomId != null ? { roomid: props.beds24RoomId } : {}),
  widgetLang: 'de',
  dateFormat: 'dd.mm.yy',
  dateSelection: 2,                      // check-in + nights
  weekFirstDay: 1,                       // Monday
  peopleSelection: 2,                    // adults + children
  defaultNumAdult: 2,
  defaultNumNight: 2,
  fontSize: '16px',
  // Colors
  backgroundColor: '#fdfcf8',            // warm-white
  borderColor: '#c8dfc8',                // sage-200
  color: '#234024',                      // sage-800
  buttonBackgroundColor: '#865725',      // waldhonig-500
  buttonColor: '#ffffff',
  buttonTitle: 'Jetzt buchen',
  availableBackgroundColor: '#e3efe3',
  availableColor: '#234024',
  unavailableBackgroundColor: '#f2dede',
  unavailableColor: '#a94442',
  pastBackgroundColor: '#f1f7f1',
  pastColor: '#a6c9a6',
  requestBackgroundColor: '#f8f5ee',
  requestColor: '#865725',
  searchLinkText: 'Verfügbarkeit prüfen',
  formAction: 'https://beds24.com/booking2.php',
  formTarget: '_blank',
})
```

Renders as: **[Check-in date] [2 Nachte] / [2 Erwachsene] [0 Kinder] / [Jetzt buchen]**

### 2.4 Widget Types Summary

| UI Name | API `widgetType` | Use case | Key unique params |
|---|---|---|---|
| Booking Box | `'BookingBox'` | Room detail pages | `showLabels`, full date/guest pickers |
| Belegungskalender | `'AvailabilityCalendar'` | Room detail pages | `numMonth` (3 months side-by-side) |
| Booking Box Mini | `'BookingBoxMini'` | Room cards on /zimmer | Compact inline layout |
| Streifen | `'Strip'` | Hero section (optional) | Horizontal strip |

### 2.5 Complete Widget Parameter Reference

Parameter names from actual generated code (not the German UI labels):

| Category | Parameter | Values | Notes |
|---|---|---|---|
| **Widget** | `widgetType` | `'BookingBox'`, `'AvailabilityCalendar'`, `'BookingBoxMini'`, `'Strip'` | API names differ from UI |
| **Property** | `propid` | number | 261258 for Pension |
| **Property** | `roomid` | number | 548066, 549252, 549319 |
| **Language** | `widgetLang` | `'de'`, `'en'` | Widget UI language |
| **Dates** | `dateFormat` | `'dd.mm.yy'` etc. | Date format |
| **Dates** | `weekFirstDay` | `1` = Monday | First day of week |
| **Dates** | `dateSelection` | `1`=check-in only, `2`=check-in+nights, `3`=check-in+checkout, `4`=all | Date input mode |
| **Guests** | `peopleSelection` | `0`=none, `1`=guests, `2`=adults+children | Guest input mode |
| **Defaults** | `defaultNumNight` | number | Pre-filled nights |
| **Defaults** | `defaultNumAdult` | number | Pre-filled adults |
| **Defaults** | `defaultNumChild` | number | Pre-filled children |
| **Limits** | `maxAdult` | number | Max adults dropdown |
| **Limits** | `maxChild` | number | Max children dropdown |
| **Calendar** | `numMonth` | 1-12 | Months shown (AvailabilityCalendar only) |
| **Visual** | `fontSize` | `'16px'` etc. | Font size |
| **Visual** | `showLabels` | boolean | Show field labels |
| **Visual** | `shadow` | boolean | Drop shadow |
| **Visual** | `heading` | string | Widget heading text |
| **Visual** | `width` | `'auto'`, `'100%'`, `'300px'` etc. | Widget width |
| **Colors** | `backgroundColor` | hex | Widget background |
| **Colors** | `borderColor` | hex | Widget border |
| **Colors** | `color` | hex | Text color |
| **Colors** | `buttonBackgroundColor` | hex | CTA button bg |
| **Colors** | `buttonColor` | hex | CTA button **text** (NOT bg!) |
| **Colors** | `buttonTitle` | string | CTA button label |
| **Colors** | `availableBackgroundColor` | hex | Available dates bg |
| **Colors** | `availableColor` | hex | Available dates text |
| **Colors** | `unavailableBackgroundColor` | hex | Unavailable dates bg |
| **Colors** | `unavailableColor` | hex | Unavailable dates text |
| **Colors** | `pastBackgroundColor` | hex | Past dates bg |
| **Colors** | `pastColor` | hex | Past dates text |
| **Colors** | `requestBackgroundColor` | hex | On-request dates bg |
| **Colors** | `requestColor` | hex | On-request dates text |
| **Labels** | `searchLinkText` | string | Search/link label text |
| **Behavior** | `formAction` | URL | Where form submits (use `booking2.php`!) |
| **Behavior** | `formTarget` | `'_blank'`, `'_self'`, `'_parent'`, `'_top'` | Target window |
| **Tracking** | `referrer` | string | Referrer tracking text |

> **Naming gotcha:** `buttonColor` = button **text** color, `buttonBackgroundColor` = button **background**. Confusing but matches the Beds24 API.

---

## Part 3: Recommended Widget Placement

### Room Detail Page (`/zimmer/[slug]`)

```
+-------------------------------------+
| Hero Image / Gallery                |
+-------------------------------------+
| Room Title + Quick Facts            |
+-------------------+-----------------+
|                   | +-----------+   |
| Room Description  | | BookingBox|   |
| & Amenities       | | Date pick |   |
|                   | | + Buchen  |   |
|                   | +-----------+   |
+-------------------+-----------------+
| +----------------------------------+|
| | AvailabilityCalendar (3 months)  ||
| | Green=available Red=booked       ||
| +----------------------------------+|
+-------------------------------------+
| Extras (Fruhstuck, Hund, BBQ)      |
+-------------------------------------+
| Location / Anfahrt                  |
+-------------------------------------+
```

### Room Overview Page (`/zimmer`)

```
+-------------------------------------+
| Page Title: Unsere Zimmer           |
+-------------------------------------+
| +-------------+ +-------------+     |
| | Room Card   | | Room Card   |     |
| | Image       | | Image       |     |
| | Name+Price  | | Name+Price  |     |
| | [MiniBook]  | | [MiniBook]  |     |
| | -> Details  | | -> Details  |     |
| +-------------+ +-------------+     |
| +-------------+                     |
| | Room Card   |                     |
| | ...         |                     |
| +-------------+                     |
+-------------------------------------+
```

---

## Part 4: Implementation Checklist

### Beds24 Admin (no code changes)

- [ ] **Style page:** Apply all color values from 1.1
- [ ] **Developer > HTML HEAD:** Add Google Fonts link (1.2)
- [ ] **Style page:** Set Schriftart to `DM Sans`, Schriftgrosse to `16px`
- [ ] **Developer > Individuelles CSS:** Add custom CSS from 1.3
- [ ] **Inhalt page:** Fill AGB, Stornobedingungen, confirmation text, error messages (1.5)
- [ ] **Verhalten page:** Set "In neuem Fenster offnen" to `nie` (1.6)
- [ ] **Verhalten page:** Set "URL nach Buchung" to thank-you page URL (1.6)

### Nuxt Code (Phase 5)

- [ ] Update widget script URL from v1.00 to v1.01 in `useBeds24Widget.ts`
- [ ] Replace BookingBox config in `Beds24Widget.vue` with corrected params from 2.1
- [ ] Add AvailabilityCalendar widget component for room detail pages (2.2)
- [ ] Add BookingBoxMini widget component for room cards on /zimmer (2.3)
- [ ] Add room IDs to YAML files (Balkonzimmer=548066, Rosengarten=549252, Wohlfuhl-Appartement=549319)
- [ ] Create `/buchung/danke` thank-you page for post-booking redirect
- [ ] Pass `referer=Website` in all booking URLs for conversion tracking

---

## Color Reference Card

Hex values for Beds24 (converted from oklch design tokens via canvas):

| Token | Hex | Usage |
|---|---|---|
| sage-50 | `#f1f7f1` | past calendar dates bg |
| sage-100 | `#e3efe3` | available dates bg |
| sage-200 | `#c8dfc8` | borders |
| sage-300 | `#a6c9a6` | past dates text (dimmed) |
| sage-500 | `#5d8f5e` | links |
| sage-600 | `#456f46` | link hover |
| sage-800 | `#234024` | body text, available dates text |
| waldhonig-500 | `#865725` | CTA button bg, on-request text |
| waldhonig-600 | `#71481d` | button hover |
| cream | `#f8f5ee` | highlight, on-request dates bg |
| warm-white | `#fdfcf8` | page/widget background |
