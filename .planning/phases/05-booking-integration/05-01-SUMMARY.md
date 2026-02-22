# Plan 05-01: Beds24 Widget Components & Consent Integration

## Status: Complete

## What Was Built

Integrated Beds24 JavaScript booking widgets (BookingBox + AvailabilityCalendar) into room detail pages with DSGVO-compliant consent gating. Zero requests to any Beds24/jQuery CDN before the visitor grants booking consent.

## Deliverables

| # | Task | Commit | Key Files |
|---|------|--------|-----------|
| 1 | Beds24 widget loading infrastructure + consent-gated components | d58f139 | `app/composables/useBeds24Widget.ts`, `app/components/booking/Beds24Widget.vue`, `app/components/booking/Beds24Calendar.vue` |
| 2 | Room detail page booking section with consent gating | d3684dc | `app/pages/zimmer/[slug].vue` |
| 3 | Room card conversion optimization | 901a280 | `app/components/rooms/Card.vue`, `app/pages/zimmer/index.vue` |

## Key Technical Decisions

- **Dynamic script loading**: jQuery and bookWidget.min.js are injected via `<script>` elements ONLY after booking consent, using a module-level promise to prevent duplicate loading
- **jQuery SRI**: jQuery loaded with `integrity='sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo='` and `crossOrigin='anonymous'` for Subresource Integrity
- **SSG hydration safety**: `showBooking` computed uses `import.meta.client` guard (same pattern as MapConsent) to prevent SSR/client mismatch
- **Widget initialization**: Uses `watch([isReady, containerRef], ..., { flush: 'post' })` to initialize jQuery plugin after DOM mount
- **Page restructure**: Booking section positioned after gallery + title, before price table + amenities (per CONTEXT.md layout order)
- **Phone CTA fallback**: Rooms without `beds24PropertyId` show "Dieses Zimmer ist nur telefonisch buchbar" with click-to-call
- **Card CTA**: Added "Verfügbarkeit prüfen" button and waldhonig-600 colored pricing for conversion

## Deviations

- No changes needed to `CookieConsent.vue` or `CookieSettings.vue` -- Buchung category already fully implemented in Phase 1
- No changes needed to `datenschutz.vue` -- Beds24 privacy section already added in Phase 1
- No CSP/nuxt.config.ts changes needed -- scripts load dynamically client-side, CSP would be at hosting level

## Issues

None.

## Verification

- `pnpm build` succeeds with zero errors
- Booking components use `v-if` (not `v-show`) ensuring zero DOM presence before consent
- Script loading is sequential (jQuery -> bookWidget.min.js) with proper error handling
- Widget pre-filtered by `beds24PropertyId`/`beds24RoomId` from room YAML data
- Form submission targets `booking2.php` in new tab (`formTarget: '_blank'`)
