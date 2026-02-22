# Phase 5: Booking Integration - Context

**Gathered:** 2026-02-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Integrate Beds24 booking widgets into the site so visitors can check availability and book directly. Widgets are consent-gated per DSGVO. Beds24 is the source of truth for pricing and availability; static content (descriptions, amenities, images) stays in YAML. No iframe embedding — JavaScript widgets only. Actual booking completion happens on Beds24's responsive booking page in a new tab.

Out of scope: invoicing automation, guest communication automation, guest self-service portal (these are Beds24 dashboard configuration, not website code).

</domain>

<decisions>
## Implementation Decisions

### Room data source
- **Beds24 is the source of truth** for pricing and availability
- Static room content (descriptions, amenities, images) stays in YAML files
- Show Beds24 live prices everywhere (room cards, detail pages), not just in booking widget
- **Fallback strategy**: Show YAML price immediately on page load, silently replace with Beds24 live price once fetched client-side. If API unreachable, YAML price persists with "ab" (starting from) prefix
- Since site is SSG on GitHub Pages, live prices require client-side fetching or build-time API calls

### Booking widget experience
- Use **Beds24 JavaScript widgets** (BookingBox, AvailabilityCalendar) — NO iframes
- Each room detail page gets: availability calendar (color-coded dates) + BookingBox (date picker + booking form)
- When visitor clicks to book, opens **Beds24 responsive booking page in a new tab**
- Widgets must be nicely integrated into the site's design system and user flow
- A booking button should also be available on the site (research: "Add a booking button to your web site" approach from Beds24 docs)
- Researcher should investigate Beds24 widget customization options (CSS overrides, color params, font params)

### Widget styling
- **Claude's discretion**: Match the site's design system (sage green, DM Sans, rounded corners, waldhonig accents) as closely as Beds24's widget CSS customization allows

### Consent & privacy flow
- **New "Buchung" consent category** added to existing cookie consent system
- Expand existing cookie banner with radio/switch buttons for service categories (including booking)
- Must be fully DSGVO-compliant (TDDDG §25)
- **Zero requests to beds24.com before booking consent is granted**
- When booking consent NOT granted: widget area is **hidden entirely** (not a placeholder card)
- Header "Verfügbarkeit prüfen" button and room page CTAs still work — they link to /zimmer/ which shows room info regardless of consent
- When consent IS granted: widgets load and render in their designated areas

### BookingBar & CTAs
- **No sticky booking bar** on desktop or mobile
- **No floating action button** on mobile
- Use the existing **"Verfügbarkeit prüfen" button in the header navigation** as the primary booking CTA
- This button links to `/zimmer/` (rooms overview page)
- Room cards and booking widgets on /zimmer/ and room detail pages should be **more prominent and conversion-focused** than current design
- **Room detail pages**: booking section (availability calendar + BookingBox) positioned **near the top**, after hero image/gallery but before amenities and description
- Researcher should investigate pension/hotel conversion best practices for widget placement, visual hierarchy, and CTAs

### Beds24 API integration
- Beds24 API V2 is available at no extra cost (included in plan)
- Token-based auth: invite code → refresh token → access token (24h expiry)
- **API tokens MUST NOT be exposed in client-side code**
- For build-time price fetching: token stored as GitHub Actions secret
- Community TypeScript SDK available: `@lionlai/beds24-v2-sdk`
- Rate limit: 100 credits per 5 minutes (sufficient for build-time fetching)
- Key endpoints: `/properties` (room data), `/inventory/rooms/calendar` (pricing/availability), `/inventory/rooms/offers` (calculated prices)

### Claude's Discretion
- Exact widget placement and spacing on room pages
- CSS customization extent for Beds24 widgets (match design system as closely as possible)
- Build-time vs client-side price fetching strategy (based on API constraints and SSG limitations)
- Error handling for API failures
- Loading state design while prices fetch
- Conversion optimization details (CTA text, button prominence, visual hierarchy)

</decisions>

<specifics>
## Specific Ideas

- "We need one source of truth for everything related to rooms — availability, pricing, names. Images and descriptions can stay on the page."
- "No iframes — that's not secure." Use Beds24 JavaScript widgets only.
- "We have the Verfügbarkeit prüfen button in top menu — use that!" as primary booking CTA
- "The button and widgets should be more upfront and better visible" — optimize for conversion
- User shared these Beds24 documentation pages for research:
  - https://wiki.beds24.com/index.php/Category:API_V2
  - https://wiki.beds24.com/index.php/Arrivals_API
  - https://wiki.beds24.com/index.php/Responsive_Booking_Page
- Beds24 API research completed — full capabilities documented (see API integration decisions above)

</specifics>

<deferred>
## Deferred Ideas

- **Rechnungsstellung (invoicing) automation** — configure in Beds24 dashboard Auto Actions, not website code
- **Gästekommunikation (guest communication) automation** — Beds24 Auto Actions with email templates (`[GUESTNAME]`, `[INVOICETABLE]` variables)
- **Guest booking management portal** — Beds24 guest services feature, separate from website
- **Custom booking UI via serverless proxy** (Cloudflare Worker + full API integration) — deferred for potential future phase if widget approach proves insufficient
- **Build-time API fetching via GitHub Actions cron** — could be added later to bake fresh pricing into static pages every 6 hours
- **Beds24 account setup and room configuration** — prerequisite owner task, not website development

</deferred>

---

*Phase: 05-booking-integration*
*Context gathered: 2026-02-22*
