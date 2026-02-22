# Roadmap: Pension Volgenandt Website v1.0

## Overview

This roadmap delivers a complete website redesign for Pension Volgenandt, replacing the current 1&1 IONOS site (rated 3.5/10) with a modern Nuxt 4 SSG site. The build order is driven by two hard constraints: legal compliance must come first (the current site is missing legally required Impressum and Datenschutz pages), and the cookie consent system must exist before any third-party integrations are built. Room pages precede the homepage because the homepage reuses room card components. Content pages, attraction landing pages, and SEO come before booking integration so that the full site structure is stable before adding the Beds24 widget. A final optimization and deployment phase ships to production.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & Legal Compliance** - Nuxt 4 scaffold, Tailwind v4 design system, layout, cookie consent, legal pages
- [x] **Phase 2: Content Infrastructure & Room Pages** - Nuxt Content YAML collections, room data, room overview and detail pages
- [x] **Phase 3: Homepage & Hero** - Hero video, welcome section, room previews, testimonials, sustainability teaser
- [x] **Phase 4: Content Pages, Attractions & SEO** - Familie, Aktivitaeten, Nachhaltigkeit, Kontakt, attraction landing pages, structured data, sitemap
- [ ] **Phase 4.1: GitHub Pages Hosting & GitHub Actions CI/CD** (INSERTED) - GitHub Pages deployment, GitHub Actions build pipeline, automatic SSG builds
- [ ] **Phase 5: Booking Integration** - Beds24 iframe with consent gating, booking bar, per-room filtering
- [ ] **Phase 6: Optimization & Launch** - Performance tuning, accessibility audit, Lighthouse scores, deployment, DNS cutover

## Phase Details

### Phase 1: Foundation & Legal Compliance

**Goal**: Visitors see a working site with correct layout, legal pages, and cookie consent -- eliminating the current Abmahnung risk and establishing the full build pipeline
**Depends on**: Nothing (first phase)
**Requirements**: FOUN-01, FOUN-02, FOUN-03, FOUN-04, FOUN-05, FOUN-06, FOUN-07, DSGN-01, DSGN-02, DSGN-03, DSGN-04, DSGN-05, DSGN-06, LEGL-01, LEGL-02, LEGL-03, LEGL-04, LEGL-05, LEGL-06
**Plans:** 3 plans
**Success Criteria** (what must be TRUE):

1. Running `make dev` starts the Nuxt 4 dev server; `make build` produces a static site in `.output/public/`; `make lint`, `make format`, and `make typecheck` all pass with zero errors
2. Visitor sees a responsive site with sticky header (logo, navigation, phone number, CTA), 4-column footer, and consistent design tokens (sage green palette, DM Sans 18px body, waldhonig CTA buttons with 48px+ touch targets)
3. Visitor can navigate to Impressum (`/impressum/`), Datenschutz (`/datenschutz/`), and AGB (`/agb/`) pages that display complete, legally correct content citing DDG §5 and TDDDG §25
4. First-time visitor sees a cookie consent banner with equal-prominence Accept/Reject buttons; no third-party requests appear in Network tab before consent is granted
5. No requests to `googleapis.com` or any external font CDN appear at any point -- fonts are self-hosted from npm

Plans:

- [x] 01-01-PLAN.md -- Project scaffolding, Nuxt 4 + Tailwind v4 + tooling + design tokens
- [x] 01-02-PLAN.md -- Base UI components, AppHeader, AppFooter, default layout
- [x] 01-03-PLAN.md -- Cookie consent system and three legal pages (Impressum, Datenschutz, AGB)

### Phase 2: Content Infrastructure & Room Pages

**Goal**: Visitors can browse all 7 room types with photos, amenities, and pricing -- the core product is visible and browsable
**Depends on**: Phase 1 (needs design system, layout, and base components)
**Requirements**: FOUN-08, LEGL-07, ROOM-01, ROOM-02, ROOM-03, ROOM-04, ROOM-05, ROOM-06, ROOM-07
**Success Criteria** (what must be TRUE):

1. Room data lives in YAML files (`content/rooms/*.yml`) validated by Zod schemas; adding a new room YAML file automatically generates a new room page at build time
2. Visitor navigating to `/zimmer/` sees a grid of all 7 room cards, each showing a photo, room name, key features, and starting price with "ab EUR X / Nacht" including VAT
3. Visitor clicking a room card reaches a detail page (`/zimmer/[slug]`) with photo gallery/lightbox, amenity icon grid, price card with extras pricing (breakfast, dog, BBQ), and a "Weitere Zimmer" section showing other rooms
4. All displayed prices include VAT and show "pro Nacht" unit (PAngV compliance)

Plans:

- [x] 02-01-PLAN.md -- Content infrastructure: Nuxt Content v3 rooms collection, Zod schema, icon module, 7 room YAML data files, amenity utility
- [x] 02-02-PLAN.md -- Room overview page: RoomCard component and /zimmer/ page with category-grouped 2-column grid
- [x] 02-03-PLAN.md -- Room detail page: Gallery/lightbox, amenities, pricing, extras, description, Weitere Zimmer, /zimmer/[slug] assembly

### Phase 3: Homepage & Hero

**Goal**: Visitors landing on the homepage immediately understand what Pension Volgenandt offers and feel invited to explore rooms or book
**Depends on**: Phase 2 (homepage reuses RoomCard component for featured rooms preview)
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07, HOME-08, DSGN-07
**Plans:** 2 plans
**Success Criteria** (what must be TRUE):

1. Desktop visitor (>768px) sees a looping drone video hero with text overlay "Pension Volgenandt" and "Ruhe finden im Eichsfeld"; mobile visitor sees a static poster image instead
2. Scrolling the homepage reveals: welcome section with lifestyle photo, 3-column featured room cards with "Alle Zimmer ansehen" link, experience teaser with distance badges, testimonials with star ratings, and sustainability teaser with icons
3. Homepage includes an OpenStreetMap embed (no cookies, no consent needed) showing the pension location and address
4. Scroll-triggered fade-in animations play on section entry; setting `prefers-reduced-motion: reduce` in OS settings disables all animations

Plans:

- [x] 03-01-PLAN.md -- Shared infrastructure (scroll animations, utility components, content data), hero video, welcome section, featured rooms, homepage assembly
- [x] 03-02-PLAN.md -- Testimonials carousel, experience teaser, sustainability teaser, location map, visual verification

### Phase 4: Content Pages, Attractions & SEO

**Goal**: All content pages are live, attraction landing pages target uncontested SEO keywords, and the site has complete structured data and technical SEO
**Depends on**: Phase 2 (content pages reuse components), Phase 3 (homepage content patterns)
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, ATTR-01, ATTR-02, ATTR-03, ATTR-04, ATTR-05, ATTR-06, ATTR-07, ATTR-08, ATTR-09, SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-08, SEO-09, SEO-10, SEO-11, SEO-12, DSGN-08
**Success Criteria** (what must be TRUE):

1. Visitor can navigate to Familie (`/familie/`), Aktivitaeten (`/aktivitaeten/`), Nachhaltigkeit (`/nachhaltigkeit/`), and Kontakt (`/kontakt/`) pages with complete, rewritten German content sourced from the current site
2. Kontakt page has a working contact form (Netlify Forms or Formspree), click-to-call phone link, email, OpenStreetMap, and driving directions from A38 and train station
3. Visitor can browse an Ausflugsziele overview page (`/ausflugsziele/`) linking to 5 individual attraction landing pages (Baerenpark, Burg Bodenstein, Burg Hanstein, Skywalk Sonnenstein, Baumkronenpfad Hainich) plus 2 activity pages (Wandern, Radfahren), each with H1 keyword, distance from pension, practical info, and booking CTA
4. Google Rich Results Test validates BedAndBreakfast schema on homepage, HotelRoom+Offer on room pages, FAQPage on FAQ section, and BreadcrumbList on all subpages
5. Every page has a unique meta title (max 60 chars), meta description (max 155 chars), canonical URL, Open Graph tags, and hreflang="de" declaration; sitemap.xml and robots.txt are generated and accessible

Plans:

- [x] 04-01-PLAN.md -- SEO infrastructure (@nuxtjs/seo, Phosphor Icons, Leaflet), shared content components, content data collections + YAML files
- [x] 04-02-PLAN.md -- Content pages (Familie, Nachhaltigkeit, Aktivitaeten, Kontakt with form + FAQ + map)
- [x] 04-03-PLAN.md -- Attraction overview + detail pages, activity pages (Wandern, Radfahren), 404, HotelRoom schema, prerender routes
- [x] 04-04-PLAN.md -- Gap closure: Fix BedAndBreakfast schema type, BreadcrumbList emission, meta title duplication, missing OG/hreflang tags

### Phase 4.1: GitHub Pages Hosting & GitHub Actions CI/CD (INSERTED)

**Goal**: The site is deployed to GitHub Pages via a GitHub Actions CI/CD pipeline -- every push to main automatically builds and publishes the static site, replacing the need for Netlify or Cloudflare Pages
**Depends on**: Phase 4 (all content pages stable before deploying)
**Plans:** 2 plans
**Success Criteria** (what must be TRUE):

1. Pushing to `main` triggers a GitHub Actions workflow that runs `nuxt build --preset github_pages` and deploys the `.output/public/` directory to GitHub Pages
2. The site is accessible at the GitHub Pages URL (or custom domain if configured) with HTTPS enforced
3. Build failures in the Actions workflow are clearly reported; successful deploys are automatic with no manual steps
4. The contact form solution works with GitHub Pages hosting (Formspree, since Netlify Forms won't be available)

Plans:

- [ ] 04.1-01-PLAN.md -- GitHub Actions workflow, CNAME file, contact form migration to Formspree
- [ ] 04.1-02-PLAN.md -- Configure GitHub Pages source + Formspree account, verify deployment

### Phase 5: Booking Integration

**Goal**: Visitors can check availability and book directly on the site without leaving -- the core conversion flow works end-to-end
**Depends on**: Phase 1 (consent system), Phase 2 (room YAML data with beds24PropertyId/beds24RoomId), Phase 4 (all content pages stable)
**Requirements**: BOOK-01, BOOK-02, BOOK-03, BOOK-04, BOOK-05, BOOK-06
**Success Criteria** (what must be TRUE):

1. Visitor who has granted booking consent sees the Beds24 widget embedded as an iframe on room detail pages; the iframe is pre-filtered to the specific room's property and room ID
2. Visitor who has NOT granted booking consent sees a ConsentPlaceholder component explaining what the widget does and offering a button to grant consent -- zero requests to beds24.com exist in Network tab
3. Every page shows a BookingBar (sticky desktop bar) or floating booking button (mobile) for quick access to availability checking
4. Beds24 iframe height adjusts dynamically via iframeResizer as the visitor navigates booking steps (calendar, guest details, confirmation)

Plans:

- [ ] 05-01-PLAN.md -- iframe-resizer install, BookingWidget + BookingConsentPlaceholder, room detail page wiring
- [ ] 05-02-PLAN.md -- BookingBar (sticky desktop bar + mobile FAB), layout integration, visual verification

### Phase 6: Optimization & Launch

**Goal**: The site meets all performance and accessibility targets, is deployed to production CDN, and DNS is cut over from the old host
**Depends on**: All previous phases (optimization requires stable content)
**Requirements**: PERF-01, PERF-02, PERF-03, PERF-04, PERF-05, PERF-06, PERF-07, PERF-08, PERF-09, PERF-10, DEPL-01, DEPL-02, DEPL-03, DEPL-04, DEPL-05
**Success Criteria** (what must be TRUE):

1. Lighthouse mobile scores: Performance 95+, Accessibility 95+, SEO 100, Best Practices 100
2. Core Web Vitals pass: LCP < 2.5s, FCP < 1.5s, CLS < 0.1, TBT < 200ms; total page weight < 1.5 MB (excluding hero video); JS bundle < 150 KB gzipped
3. All images serve as WebP/AVIF with responsive srcsets (640-1920w), lazy loading, and blur placeholders; hero video is < 5 MB WebM with MP4 fallback
4. Keyboard navigation works for all interactive elements; color contrast meets WCAG AA (4.5:1 body, 3:1 large text); site is usable without JavaScript
5. Site is live at pension-volgenandt.de via GitHub Pages with HTTPS enforced, contact form submissions working, and all pages pre-rendered

Plans:

- [ ] 06-01: Performance optimization and image pipeline
- [ ] 06-02: Accessibility audit, deployment, and DNS cutover

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 4.1 -> 5 -> 6

| Phase                                         | Plans Complete | Status      | Completed  |
| --------------------------------------------- | -------------- | ----------- | ---------- |
| 1. Foundation & Legal Compliance              | 3/3            | Complete    | 2026-02-22 |
| 2. Content Infrastructure & Room Pages        | 3/3            | Complete    | 2026-02-22 |
| 3. Homepage & Hero                            | 2/2            | Complete    | 2026-02-22 |
| 4. Content Pages, Attractions & SEO           | 4/4            | Complete    | 2026-02-22 |
| 4.1. GitHub Pages & GitHub Actions (INSERTED) | 0/2            | Not started | -          |
| 5. Booking Integration                        | 0/2            | Not started | -          |
| 6. Optimization & Launch                      | 0/2            | Not started | -          |

---

_Roadmap created: 2026-02-21_
_Last updated: 2026-02-22 - Phase 4.1 planned (2 plans in 2 waves)_
