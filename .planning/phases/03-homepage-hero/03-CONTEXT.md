# Phase 3: Homepage & Hero - Context

**Gathered:** 2026-02-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the homepage that is the first thing visitors see when arriving at pension-volgenandt.de. Includes hero video/poster, welcome section, featured room cards, experience teaser, testimonials, sustainability teaser, and OpenStreetMap embed. All content sections are assembled into a single scrollable page with scroll-triggered animations.

New capabilities (interactive attraction maps, route planners, full content pages) belong in Phase 4.

</domain>

<decisions>
## Implementation Decisions

### Hero presentation

- **Text positioning:** Bottom-left aligned, within the lower 40% of the viewport. Upper 60% is unobstructed drone footage
- **H1:** "Pension Volgenandt" — DM Sans Bold, 48px desktop / 36px mobile, white, +0.02em letter-spacing
- **Tagline:** "Ruhe finden im Eichsfeld" — DM Sans Regular, 22px desktop / 18px mobile, white at 90% opacity
- **Text shadow:** `0 1px 3px rgba(0,0,0,0.3)` as safety net for lighter video frames
- **Overlay:** Bottom-to-top gradient using sage-charcoal (#2C3E2D) — 70% opacity at bottom, fading to 0% at 60% height. Brand-tinted, not generic black. Preserves landscape in upper portion
- **CTA:** "Zimmer entdecken" — waldhonig (#C07B54), white text, DM Sans Semibold 18px, 16px 32px padding, 8px radius. Left-aligned below tagline, not centered on page. Hover: #A86842 with subtle scale(1.02)
- **Scroll indicator:** Single thin white chevron, centered bottom, gentle bounce animation (6-8px translateY, 2s ease-in-out). Clickable (smooth scrolls to welcome section). Fades out after 100px scroll
- **Entrance animation:** Staggered fade-up, pure CSS. H1 at 300ms, tagline at 550ms, CTA at 800ms, scroll indicator at 1500ms. Duration 700ms each, ease-out, translateY(20px). Respects `prefers-reduced-motion`
- **Desktop video:** Full viewport, looping, muted, autoplay, playsinline. WebM primary + MP4 fallback
- **Mobile (< 768px):** No video — dedicated portrait poster image (WebP, ~750x1334, < 250KB). Purpose-cropped composition, not letterboxed video frame. Stronger gradient (80% opacity at bottom). CTA stretches full-width

### Content section flow

- **Section order (conversion-focused):** Hero → Welcome (lifestyle photo) → Featured Room Cards (3-col) → Testimonials → Experience/Attractions Teaser → Sustainability Teaser → Map + Address → Footer
- **Visual rhythm:** Mixed treatment — most sections on white background, testimonials and sustainability get full-bleed colored backgrounds for emphasis
- **Testimonials background:** Sage-tinted full-bleed
- **Sustainability background:** Sage-50 (#f4f7f3) full-bleed
- **Section spacing:** Follow design system (80px vertical desktop, 56px mobile)
- **Scroll animations:** Staggered elements — individual items within sections animate in sequence (e.g., room cards appear one by one). 700ms pace, consistent with hero animation style. Respects `prefers-reduced-motion`

### Testimonials & social proof

- **Display format:** Carousel/slider — one testimonial visible at a time, auto-rotates or swipe/arrows
- **Data source:** Mix of hand-picked Google reviews and owner-selected guest quotes, stored in a YAML/JSON config file
- **Count:** 5-6 testimonials in the rotation
- **Info per testimonial:** Quote text, first name, star rating (1-5). Minimal — no photos, dates, or room types
- **Star rating style:** Claude's discretion

### Experience teaser (attractions preview)

- **Layout:** Grid with hero attraction — one large featured card (Barenpark) plus smaller cards for others
- **Featured attractions:** Barenpark (hero/large), Burg Hanstein, Burg Bodenstein, Baumkronenpfad Hainich — culture + nature mix
- **Distance badges:** Terracotta pill-shaped badge in top-right corner of each card photo, overlapping the image slightly. Shows "12 km" format
- **CTA:** Link to /ausflugsziele/ for the full list

### Sustainability teaser

- **Structure:** Statement-first, evidence-second. H2 "Naturlich nachhaltig" + 1-2 sentence subtext + 3-column icon row + text link CTA
- **Voice:** "Gelebter Alltag" (lived daily practice) framing. First-person plural "wir". Modest, specific, anti-greenwashing
- **Subtext example:** "Nachhaltigkeit ist bei uns kein Trend, sondern gelebter Alltag. Unser Zuhause im Eichsfeld pflegen wir mit derselben Sorgfalt wie Ihren Aufenthalt."
- **Three icon proof points:**
  1. Solarenergie — "Eigener Strom vom Dach" (solar icon)
  2. Bio-Klaranlage — "Naturliche Abwasserreinigung" (water/leaf icon)
  3. Kompost & Kreislauf — "Grunschnitt wird zu Gartenerde" (recycle icon)
- **Icons:** Thin-line style in sage-600, within subtle sage-100 circles (64px). Mobile: stacked vertically, left-aligned
- **No numbers in teaser** — save statistics for /nachhaltigkeit/ page
- **CTA:** Text link only — "Mehr uber unsere Nachhaltigkeit erfahren →" in sage-600. Not a button. Hover: underline + sage-700
- **No certifications unless actually held** — self-made badges destroy credibility
- **SEO:** H2 "Naturlich nachhaltig" as actual `<h2>` tag; amenityFeature in BedAndBreakfast schema

### Claude's Discretion

- Star rating display style for testimonials (filled stars vs numeric)
- Exact icon choices for sustainability proof points (from Lucide/Phosphor family)
- Loading skeleton design for dynamic content
- Exact spacing and typography refinements within the design system
- Error state handling
- Carousel auto-rotation timing and controls
- Welcome section layout details (text/image split)
- OpenStreetMap embed styling and zoom level

</decisions>

<specifics>
## Specific Ideas

- Hero text positioning lets the Eichsfeld landscape breathe — visitor gets a brief moment of pure nature before text gently rises into place (the "arrival feeling")
- Sustainability framing explicitly avoids greenwashing: no vague "we are green" claims, only tangible on-property features (solar, Klaranlage, compost) that guests can see
- Testimonials placed immediately after room cards for conversion reinforcement — see rooms, then hear what guests say
- Experience teaser uses Barenpark as the hero attraction (strongest visual draw) with castles + nature as supporting cards
- Mobile hero uses a purpose-cropped portrait image, not a letterboxed video frame — fills the screen properly

</specifics>

<deferred>
## Deferred Ideas

- **Interactive attractions map** with pension location, all attractions marked, route planning, and share buttons — belongs on /ausflugsziele/ page in Phase 4. Research map solutions (Mapbox, Leaflet with custom tiles) that match the design aesthetic
- Detailed sustainability statistics with kWh numbers, water savings — belongs on /nachhaltigkeit/ page in Phase 4

</deferred>

---

_Phase: 03-homepage-hero_
_Context gathered: 2026-02-22_
