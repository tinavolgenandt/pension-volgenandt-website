# Phase 4: Content Pages, Attractions & SEO - Context

**Gathered:** 2026-02-22
**Status:** Ready for planning

<domain>
## Phase Boundary

All content pages (Familie, Aktivitaeten, Nachhaltigkeit, Kontakt) are live with complete rewritten German content. Attraction landing pages target uncontested local SEO keywords ("Pension nahe Baerenpark", etc.). FAQ section with structured data. Complete technical SEO (structured data, meta tags, sitemap, breadcrumbs) across the entire site. No new capabilities — booking integration, room pages, and homepage are handled in other phases.

</domain>

<decisions>
## Implementation Decisions

### Content page tone & voice

- Warm, personal first-person family voice throughout ("Wir freuen uns...", "Unsere Enkel haben hier gespielt")
- All content rewritten from scratch — use existing site only as factual reference for what amenities/features exist
- Consistent "Wir" voice across all pages including FAQ answers

### Content page structure & icons

- Scannable layout with Phosphor Icons (duotone weight for feature highlights, regular for body, fill for small inline icons)
- No emojis, ever — only Phosphor icon components
- Page pattern per content page: thin photo banner → personal intro (2-3 sentences, "Wir" voice) → icon feature grid → narrative section with photo → detail list → soft CTA → booking CTA
- Never more than 4 lines of text without a visual break (icon, heading, image, or whitespace)
- Icon feature grids: 2x2 or 3x2 desktop / single column mobile, 40px duotone icons

### Subpage hero/banner

- Thin photo-backed banner (300px desktop / 200px mobile), NOT full-viewport hero
- Each content page gets its own contextual photo — no repeating the same image
- Dark gradient overlay (bottom-to-top, 80% opacity at bottom), H1 + subtitle as real text on top
- No CTA, no animation, no scroll indicator in the banner
- Breadcrumbs for navigation context
- Full video hero stays exclusive to the homepage

### Attraction landing pages

- Mini travel guide depth: what to expect, host tips, best time to visit, 3-5 paragraphs + photos per attraction
- Personal host voice with recommendations: "Unser Tipp: ..." style callouts throughout
- 5 attraction pages: Baerenpark, Burg Bodenstein, Burg Hanstein, Skywalk Sonnenstein, Baumkronenpfad Hainich
- 2 activity pages: Wandern, Radfahren
- Each attraction page includes: distance badge from pension, opening hours, practical info, booking CTA

### Ausflugsziele overview page

- Map + card grid layout: OpenStreetMap at top showing all attraction/activity pins, then card grid below for browsing
- Photo card per attraction: name, distance badge, one-line description, link to detail page

### Activity pages (Wandern, Radfahren)

- General overview of the Eichsfeld region's character for the activity
- Top 3 host-picked routes per activity with basic info (distance, difficulty, highlight)
- Link to external route portals (komoot, outdooractive) for detailed navigation

### Contact page

- Minimal form: Name, Email, Message — three fields only, lowest friction
- Phone, email, and form presented with equal prominence (not phone-first, not form-first)
- Text-based driving directions from A38 and train station, plus OpenStreetMap with pension pin
- No operating hours, check-in/out times, or availability info on this page — keep it simple

### FAQ

- Lives as an accordion section on the /kontakt/ page (not a separate /faq/ page)
- Accordion expand/collapse interaction for each question
- Covers booking & logistics AND local area topics (check-in, parking, breakfast, cancellation, pets, what's nearby, how to get here, family-friendly, best season)
- Warm family voice in answers: "Ja, Hunde sind bei uns willkommen! Wir berechnen 5 EUR pro Nacht."
- Cross-links to relevant content pages where applicable (e.g. family question → /familie/)
- FAQPage structured data for SEO on the contact page

### Claude's Discretion

- Exact number of FAQ items (somewhere appropriate for the content — not too thin, not overwhelming)
- Phosphor icon selection per feature/amenity (choose fitting icons from the library)
- Exact page-specific banner photo assignments
- Content page section ordering fine-tuning within the established pattern
- Specific wording of soft CTAs per page
- How to structure the breadcrumb component (above banner vs inside banner)

</decisions>

<specifics>
## Specific Ideas

- Icon set: Phosphor Icons with duotone weight for warmth — specifically chosen for nature/hospitality aesthetic over corporate icon sets like Heroicons
- Research-backed: scannable layouts improve measured usability by 47% (NNGroup); thin photo banners outperform full heroes on subpages for conversion and LCP performance
- Distance badges on attraction pages: "Bärenpark Worbis — 12 km / 15 min" style, compact badge component
- Activity pages link to komoot/outdooractive for detailed route navigation rather than hosting GPX tracks
- Every content page ends with phone number as alternative to booking: "Oder rufen Sie uns direkt an: +49 36074 XXXXX" — the 55+ demographic still prefers calling

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 04-content-pages-attractions-seo_
_Context gathered: 2026-02-22_
