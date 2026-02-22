# Requirements: Pension Volgenandt Website v1.0

**Defined:** 2026-02-21
**Core Value:** Visitors can easily discover rooms, see prices, and book directly -- without leaving the site or encountering a dated, confusing experience.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation & Tooling

- [x] **FOUN-01**: Project scaffolded with Nuxt 4 (^4.3.1), TypeScript strict, pnpm
- [x] **FOUN-02**: Tailwind CSS v4 configured via `@tailwindcss/vite` with CSS-first `@theme` design tokens (sage green palette, waldhonig CTA, warm white backgrounds)
- [x] **FOUN-03**: ESLint flat config via `@nuxt/eslint` module with Vue/TypeScript rules
- [x] **FOUN-04**: Prettier configured with `prettier-plugin-tailwindcss` for class sorting
- [x] **FOUN-05**: Makefile with commands: `dev`, `build`, `preview`, `generate`, `lint`, `lint:fix`, `format`, `typecheck`, `clean`
- [x] **FOUN-06**: DM Sans font self-hosted via `@nuxt/fonts` + `@fontsource-variable/dm-sans` (no Google CDN -- GDPR court ruling)
- [x] **FOUN-07**: `@nuxt/image` configured for SSG with WebP/AVIF output, responsive srcsets, lazy loading
- [ ] **FOUN-08**: Nuxt Content v3 configured with YAML data collections and Zod validation schemas

### Design System & Layout

- [x] **DSGN-01**: Base UI components: Button, Card, Badge, Icon (consistent 8px border radius, no drop shadows)
- [x] **DSGN-02**: AppHeader -- sticky header with logo, navigation (Zimmer, Familie, Aktivitaeten, Nachhaltigkeit, Kontakt), clickable phone number, "Verfuegbarkeit pruefen" CTA
- [x] **DSGN-03**: AppFooter -- 4-column layout: logo+tagline, contact (address, phone, email), quick links, legal links (Impressum, Datenschutz, AGB) + copyright
- [x] **DSGN-04**: Default layout with header, content area, footer -- responsive (mobile-first)
- [x] **DSGN-05**: Typography: 18px body text, 1.7 line height, max 70ch line length, left-aligned, all text resizable
- [x] **DSGN-06**: Touch targets minimum 48x48px (56px preferred for CTAs)
- [x] **DSGN-07**: Scroll-triggered fade-in animations with `prefers-reduced-motion` respect
- [ ] **DSGN-08**: BreadcrumbNav component on all subpages

### Legal & Compliance

- [x] **LEGL-01**: Impressum page with full business details per DDG SS5 (name, address, phone, email, tax ID, responsible person)
- [x] **LEGL-02**: Datenschutzerklaerung page with comprehensive DSGVO/GDPR privacy policy (Art. 13/14) -- correct law reference: TDDDG SS25 (not TTDSG)
- [x] **LEGL-03**: AGB page with booking terms and cancellation policy
- [x] **LEGL-04**: Cookie consent banner with equal-prominence Accept/Reject buttons (TDDDG SS25 compliant, no dark patterns)
- [x] **LEGL-05**: Cookie consent controls three categories: essential (always on), booking (Beds24), media (YouTube, Maps)
- [x] **LEGL-06**: No third-party scripts/iframes load before consent (Beds24, YouTube, analytics) -- use `v-if` not `v-show`
- [ ] **LEGL-07**: All prices displayed with VAT included and "pro Nacht" unit (PAngV compliance)

### Room Pages

- [ ] **ROOM-01**: Room data stored in Nuxt Content YAML files with Zod-validated schema (name, slug, description, amenities, capacity, price, beds24PropertyId, beds24RoomId, images, extras)
- [ ] **ROOM-02**: Room overview page (`/zimmer/`) with RoomCard grid showing photo, name, key features, starting price, CTA
- [ ] **ROOM-03**: Individual room detail pages (`/zimmer/[slug]`) for all 7 room types with breadcrumb
- [ ] **ROOM-04**: Room photo gallery with image carousel and lightbox (5-8 photos per room)
- [ ] **ROOM-05**: Amenity grid with icons (size, beds, bathroom, WiFi, terrace/balkon, TV, kitchen)
- [ ] **ROOM-06**: Price card showing "ab EUR X / Nacht" + extras pricing (breakfast EUR 10/15, dog EUR 10, BBQ EUR 10)
- [ ] **ROOM-07**: "Weitere Zimmer" section on each room detail page showing other room cards

### Booking Integration

- [ ] **BOOK-01**: Beds24 booking widget embedded via iframe with consent gating (`v-if="bookingConsented"`)
- [ ] **BOOK-02**: ConsentPlaceholder component shown when booking consent not yet granted
- [ ] **BOOK-03**: Per-room booking: each room detail page passes its `beds24PropertyId` and `beds24RoomId` to pre-filter the widget
- [ ] **BOOK-04**: BookingBar -- sticky desktop bar / floating mobile button for quick access to booking on every page
- [ ] **BOOK-05**: iframeResizer for dynamic Beds24 iframe height adjustment
- [ ] **BOOK-06**: Beds24 upsell items configured: Fruehstueck (EUR 10), Geniesser-Fruehstueck (EUR 15), Hund (EUR 10), BBQ-Set (EUR 10)

### Homepage

- [x] **HOME-01**: HeroVideo section -- looping drone video background (desktop >768px), static poster image (mobile), "Pension Volgenandt" + "Ruhe finden im Eichsfeld" text overlay
- [x] **HOME-02**: Hero video files: WebM (VP9, 720p, <3MB) primary + MP4 fallback + WebP poster
- [x] **HOME-03**: Welcome section -- "Willkommen bei uns" with rewritten welcome text from current site + lifestyle photo
- [x] **HOME-04**: Rooms preview -- 3-column grid of featured RoomCards with "Alle Zimmer ansehen" link
- [x] **HOME-05**: Experience teaser -- "Erleben Sie das Eichsfeld" with activity highlights and distance badges
- [x] **HOME-06**: Testimonials carousel -- "Was unsere Gaeste sagen" with 3+ guest quotes and star ratings
- [x] **HOME-07**: Sustainability teaser -- "Natuerlich nachhaltig" with icons (Solar, Bio-Klaeranlage, Kompost) + "Mehr erfahren" link
- [x] **HOME-08**: Location/map section with OpenStreetMap embed (no cookies, no consent needed) and address

### Content Pages

- [ ] **CONT-01**: Familie page (`/familie/`) -- rewritten Kind & Kegel content from current site for target audience: children's vehicles, playground, garden, toys, highchairs, children's beds
- [ ] **CONT-02**: Aktivitaeten page (`/aktivitaeten/`) -- activity cards with photos, descriptions, distance badges, external links to attractions
- [ ] **CONT-03**: Nachhaltigkeit page (`/nachhaltigkeit/`) -- expanded sustainability content: solar energy, bio-Klaeranlage, recycling, composting, insect protection, ecosystem
- [ ] **CONT-04**: Kontakt page (`/kontakt/`) -- contact form (Netlify Forms or Formspree), phone with click-to-call (`tel:` link), email, address, OpenStreetMap, driving directions from A38 and train station
- [ ] **CONT-05**: FAQ section with 10-15 questions covering booking, amenities, location, attractions -- with FAQPage schema
- [ ] **CONT-06**: All text content sourced from current pension-volgenandt.de website, rewritten for target audience (couples 50-60, clear, warm, unpretentious German)

### Attraction Landing Pages

- [ ] **ATTR-01**: Attraction page template with: H1 with keyword, distance/driving time from pension, practical info (hours, prices), why visit, CTA to book, internal links to rooms, 2-3 photos
- [ ] **ATTR-02**: Baerenpark Worbis landing page (`/ausflugsziele/baerenpark-worbis/`) -- targeting "ubernachtung barenpark worbis"
- [ ] **ATTR-03**: Burg Bodenstein landing page (`/ausflugsziele/burg-bodenstein/`) -- targeting "pension nahe burg bodenstein"
- [ ] **ATTR-04**: Burg Hanstein landing page (`/ausflugsziele/burg-hanstein/`)
- [ ] **ATTR-05**: Skywalk Sonnenstein landing page (`/ausflugsziele/skywalk-sonnenstein/`)
- [ ] **ATTR-06**: Baumkronenpfad Hainich landing page (`/ausflugsziele/baumkronenpfad-hainich/`)
- [ ] **ATTR-07**: Wandern im Eichsfeld page (`/aktivitaeten/wandern/`) -- targeting "wandern eichsfeld unterkunft"
- [ ] **ATTR-08**: Radfahren / Leine-Radweg page (`/aktivitaeten/radfahren/`) -- targeting "radfahren leine-radweg unterkunft"
- [ ] **ATTR-09**: Ausflugsziele overview page (`/ausflugsziele/`) linking to all attraction pages

### SEO & Structured Data

- [ ] **SEO-01**: Schema.org BedAndBreakfast markup on homepage/sitewide with full property details, amenities, geo coordinates
- [ ] **SEO-02**: Schema.org HotelRoom + Offer markup on each room detail page with pricing, occupancy, bed type
- [ ] **SEO-03**: Schema.org FAQPage markup on FAQ section
- [ ] **SEO-04**: Schema.org BreadcrumbList on all subpages
- [ ] **SEO-05**: Unique meta title (max 60 chars) and description (max 155 chars) per page -- German, keyword-optimized per SEO research
- [ ] **SEO-06**: XML sitemap via `@nuxtjs/sitemap` including all pages, room pages, attraction pages
- [ ] **SEO-07**: robots.txt via `@nuxtjs/robots` -- allow all, reference sitemap
- [ ] **SEO-08**: Canonical URLs on every page via `useHead()`
- [ ] **SEO-09**: Open Graph tags (og:title, og:description, og:image, og:type) for social sharing
- [ ] **SEO-10**: Descriptive German alt text on every image (keyword-integrated where natural)
- [ ] **SEO-11**: hreflang `de` declaration (single language, architecture ready for i18n expansion)
- [ ] **SEO-12**: Custom 404 page with navigation and search

### Performance & Accessibility

- [ ] **PERF-01**: Lighthouse Performance score 95+ (mobile)
- [ ] **PERF-02**: Lighthouse Accessibility score 95+ -- WCAG 2.1 AA compliance
- [ ] **PERF-03**: Lighthouse SEO score 100
- [ ] **PERF-04**: Lighthouse Best Practices score 100
- [ ] **PERF-05**: LCP < 2.5s, FCP < 1.5s, CLS < 0.1, TBT < 200ms, TTFB < 200ms
- [ ] **PERF-06**: Total page weight < 1.5 MB (excluding hero video), hero video < 5 MB (desktop only)
- [ ] **PERF-07**: JavaScript bundle < 150 KB gzipped, CSS < 30 KB purged, fonts < 100 KB woff2
- [ ] **PERF-08**: All images optimized: WebP/AVIF format, responsive srcsets (640-1920w), lazy loading, blur placeholders
- [ ] **PERF-09**: Keyboard navigation works for all interactive elements
- [ ] **PERF-10**: Color contrast meets WCAG AA (4.5:1 body text, 3:1 large text) -- verified in design system

### Deployment

- [ ] **DEPL-01**: Static site generation via `nuxt generate` -- all pages pre-rendered
- [ ] **DEPL-02**: Deployed to Netlify or Cloudflare Pages with global CDN
- [ ] **DEPL-03**: HTTPS enforced (free SSL via hosting provider)
- [ ] **DEPL-04**: Contact form submission working (Netlify Forms or Formspree)
- [ ] **DEPL-05**: DNS configured for pension-volgenandt.de pointing to new hosting

## v2 Requirements

Deferred to future milestone. Tracked but not in current roadmap.

### Internationalization

- **I18N-01**: English translation of all pages with hreflang tags
- **I18N-02**: Language switcher in header

### Content Marketing

- **BLOG-01**: Blog/news section with seasonal content, local events, travel tips
- **BLOG-02**: Newsletter signup integration

### Enhanced Features

- **FEAT-01**: WhatsApp floating button for instant contact
- **FEAT-02**: Cookieless analytics (Plausible or Fathom)
- **FEAT-03**: Advanced image gallery with virtual room tours
- **FEAT-04**: Weather widget for Eichsfeld region
- **FEAT-05**: Additional attraction landing pages (Neunspringe Brauerei, Burg Scharfenstein, Grenzlandmuseum, Duderstadt)

### Monteur Market

- **MONT-01**: Monteurzimmer-specific landing page targeting business traveler keywords
- **MONT-02**: Long-term stay pricing display

## Out of Scope

| Feature                            | Reason                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------- |
| Headless CMS (Storyblok, Directus) | Nuxt Content YAML files sufficient for v1; add CMS if owner needs visual editor |
| Custom Beds24 subdomain branding   | EUR 19/month optional; not required for launch                                  |
| Mobile app                         | Web-only, mobile-responsive design serves mobile users                          |
| Real-time chat                     | Requires real-time response capacity; phone is primary contact                  |
| Professional photography           | Use existing photos + current site images; commission later if budget allows    |
| New drone video                    | Use existing YouTube aerial footage; reshoot later                              |
| Google Analytics                   | Use cookieless analytics (Plausible) in v2 to avoid consent complexity          |
| Self-hosted booking system         | Beds24 works, just needs better configuration                                   |
| WordPress or other CMS platform    | Nuxt 4 SSG chosen for performance, control, and free hosting                    |
| Server-side rendering (SSR)        | Full SSG for maximum performance and free hosting                               |

## Traceability

| Requirement | Phase   | Status   |
| ----------- | ------- | -------- |
| FOUN-01     | Phase 1 | Complete |
| FOUN-02     | Phase 1 | Complete |
| FOUN-03     | Phase 1 | Complete |
| FOUN-04     | Phase 1 | Complete |
| FOUN-05     | Phase 1 | Complete |
| FOUN-06     | Phase 1 | Complete |
| FOUN-07     | Phase 1 | Complete |
| FOUN-08     | Phase 2 | Pending  |
| DSGN-01     | Phase 1 | Complete |
| DSGN-02     | Phase 1 | Complete |
| DSGN-03     | Phase 1 | Complete |
| DSGN-04     | Phase 1 | Complete |
| DSGN-05     | Phase 1 | Complete |
| DSGN-06     | Phase 1 | Complete |
| DSGN-07     | Phase 3 | Complete |
| DSGN-08     | Phase 4 | Pending  |
| LEGL-01     | Phase 1 | Complete |
| LEGL-02     | Phase 1 | Complete |
| LEGL-03     | Phase 1 | Complete |
| LEGL-04     | Phase 1 | Complete |
| LEGL-05     | Phase 1 | Complete |
| LEGL-06     | Phase 1 | Complete |
| LEGL-07     | Phase 2 | Complete |
| ROOM-01     | Phase 2 | Complete |
| ROOM-02     | Phase 2 | Complete |
| ROOM-03     | Phase 2 | Complete |
| ROOM-04     | Phase 2 | Complete |
| ROOM-05     | Phase 2 | Complete |
| ROOM-06     | Phase 2 | Complete |
| ROOM-07     | Phase 2 | Complete |
| BOOK-01     | Phase 5 | Pending  |
| BOOK-02     | Phase 5 | Pending  |
| BOOK-03     | Phase 5 | Pending  |
| BOOK-04     | Phase 5 | Pending  |
| BOOK-05     | Phase 5 | Pending  |
| BOOK-06     | Phase 5 | Pending  |
| HOME-01     | Phase 3 | Complete |
| HOME-02     | Phase 3 | Complete |
| HOME-03     | Phase 3 | Complete |
| HOME-04     | Phase 3 | Complete |
| HOME-05     | Phase 3 | Complete |
| HOME-06     | Phase 3 | Complete |
| HOME-07     | Phase 3 | Complete |
| HOME-08     | Phase 3 | Complete |
| CONT-01     | Phase 4 | Pending  |
| CONT-02     | Phase 4 | Pending  |
| CONT-03     | Phase 4 | Pending  |
| CONT-04     | Phase 4 | Pending  |
| CONT-05     | Phase 4 | Pending  |
| CONT-06     | Phase 4 | Pending  |
| ATTR-01     | Phase 4 | Pending  |
| ATTR-02     | Phase 4 | Pending  |
| ATTR-03     | Phase 4 | Pending  |
| ATTR-04     | Phase 4 | Pending  |
| ATTR-05     | Phase 4 | Pending  |
| ATTR-06     | Phase 4 | Pending  |
| ATTR-07     | Phase 4 | Pending  |
| ATTR-08     | Phase 4 | Pending  |
| ATTR-09     | Phase 4 | Pending  |
| SEO-01      | Phase 4 | Pending  |
| SEO-02      | Phase 4 | Pending  |
| SEO-03      | Phase 4 | Pending  |
| SEO-04      | Phase 4 | Pending  |
| SEO-05      | Phase 4 | Pending  |
| SEO-06      | Phase 4 | Pending  |
| SEO-07      | Phase 4 | Pending  |
| SEO-08      | Phase 4 | Pending  |
| SEO-09      | Phase 4 | Pending  |
| SEO-10      | Phase 4 | Pending  |
| SEO-11      | Phase 4 | Pending  |
| SEO-12      | Phase 4 | Pending  |
| PERF-01     | Phase 6 | Pending  |
| PERF-02     | Phase 6 | Pending  |
| PERF-03     | Phase 6 | Pending  |
| PERF-04     | Phase 6 | Pending  |
| PERF-05     | Phase 6 | Pending  |
| PERF-06     | Phase 6 | Pending  |
| PERF-07     | Phase 6 | Pending  |
| PERF-08     | Phase 6 | Pending  |
| PERF-09     | Phase 6 | Pending  |
| PERF-10     | Phase 6 | Pending  |
| DEPL-01     | Phase 6 | Pending  |
| DEPL-02     | Phase 6 | Pending  |
| DEPL-03     | Phase 6 | Pending  |
| DEPL-04     | Phase 6 | Pending  |
| DEPL-05     | Phase 6 | Pending  |

**Coverage:**

- v1 requirements: 86 total
- Mapped to phases: 86
- Unmapped: 0

---

_Requirements defined: 2026-02-21_
_Last updated: 2026-02-22 -- Phase 3 requirements marked Complete_
