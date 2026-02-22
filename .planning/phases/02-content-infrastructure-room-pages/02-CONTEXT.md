# Phase 2: Content Infrastructure & Room Pages - Context

**Gathered:** 2026-02-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Visitors can browse all 7 room types with photos, amenities, and pricing. This phase delivers the Nuxt Content YAML collections with Zod validation, room data files, the room overview page (`/zimmer/`), and individual room detail pages (`/zimmer/[slug]`). Booking integration, homepage room previews, and attraction cross-links are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Room Card Design (Overview Page)

- 2-column grid on desktop (larger cards, more visual space per room — premium feel)
- Cards show: photo, room name, key features (capacity, highlights), starting price, and short description
- Whole card is clickable, subtle lift/elevation on hover — no separate "Details" button
- Rooms grouped by type (e.g., "Doppelzimmer", "Ferienwohnung") with section headings on the overview page
- Display order within groups defined by YAML data (owner-curated)

### Photo Gallery (Detail Page)

- Hero image + visible thumbnail strip below + lightbox on click
- All thumbnails shown — never truncated, no "+N more" counters (critical for 50-60 audience; Baymard: 50-80% miss truncated images)
- Hero image loads eagerly (LCP element); thumbnails lazy-loaded
- YAML schema has a dedicated `heroImage` field to set the hero independently from gallery order
- Lightbox includes: large centered image, dark backdrop, left/right arrows (large, obvious), close button (48px+ touch target), thumbnail strip at bottom for jumping between photos
- Keyboard navigation (arrow keys, Escape) and swipe on touch devices
- No auto-advancing carousel — user-initiated only

### Pricing & Extras Display

- Price table with variants (1 person, 2 persons) — not just a single "ab" price
- Seasonal pricing supported — YAML schema accommodates a flexible number of rate periods (Hauptsaison, Nebensaison, etc.) to be filled in by owner later
- All prices include VAT with "pro Nacht" unit (PAngV compliance)
- Extras listed in a separate "Zusatzleistungen" section below the price table: each extra with its price and short description (Frühstück EUR 10, Genießer-Frühstück EUR 15, Hund EUR 10, BBQ-Set EUR 10)

### Room Detail Page Flow

- Information order top to bottom: Photos → Title → Description → Amenities → Price Table + Extras → Weitere Zimmer
- Room description: short intro (2-3 sentences) shown, "Mehr lesen" expand for full text
- Amenities displayed as icon grid: icon + label per amenity (bed count, capacity, size, WiFi, terrace/balkon, TV, bathroom, kitchen) — scannable at a glance
- "Weitere Zimmer" shows all 6 other rooms as small cards in a compact grid — visitor sees every alternative

### Claude's Discretion

- Exact card spacing, shadows, and hover animation timing
- Thumbnail size in the gallery strip (guideline: ~100-120px wide on desktop)
- Mobile adaptations for gallery (horizontal scroll vs 2-column thumbnail grid)
- Icon set choice for amenities
- "Mehr lesen" expand animation behavior
- Loading states and error handling
- Responsive breakpoints for the 2-column card grid (when to collapse to 1 column)

</decisions>

<specifics>
## Specific Ideas

- Gallery pattern researched against Baymard Institute, NNGroup, and hotel conversion data — hero + thumbnails chosen specifically for the 50-60 age target audience who miss hidden carousel content
- Cards should feel premium but not corporate — the 2-column layout gives each room breathing space, matching the pension's unhurried, personal character
- Grouping rooms by type helps visitors who already know what they want ("Ich suche eine Ferienwohnung") navigate directly

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 02-content-infrastructure-room-pages_
_Context gathered: 2026-02-21_
