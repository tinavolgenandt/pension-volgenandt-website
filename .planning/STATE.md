# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-21)

**Core value:** Visitors can easily discover rooms, see prices, and book directly
**Current focus:** Phase 4.1 in progress (GitHub Pages hosting + GitHub Actions CI/CD).

## Current Position

Phase: 4.1 of 6 (GitHub Pages & GitHub Actions Hosting)
Plan: 1 of 2 in Phase 4.1
Status: In progress
Last activity: 2026-02-22 - Completed 04.1-01-PLAN.md (GitHub Actions workflow + Formspree contact form)

Progress: [#############-] 93% (13/14 plans)

## Performance Metrics

**Velocity:**

- Total plans completed: 13
- Average duration: 18min
- Total execution time: ~3.7 hours

**By Phase:**

| Phase                     | Plans | Total  | Avg/Plan |
| ------------------------- | ----- | ------ | -------- |
| 1. Foundation             | 3/3   | 44min  | 15min    |
| 2. Content Infrastructure | 3/3   | 50min  | 17min    |
| 3. Homepage & Hero        | 2/2   | ~66min | ~33min   |
| 4. Content & SEO          | 4/4   | ~90min | ~23min   |
| 4.1. GH Pages Hosting     | 1/2   | 5min   | 5min     |

**Recent Trend:**

- Last 5 plans: 04-01 (~50min), 04-02 (~15min), 04-03 (~14min), 04-04 (~11min), 04.1-01 (5min)
- Trend: Infrastructure/config plans execute much faster than content pages

_Updated after each plan completion_

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Roadmap]: 6-phase build order driven by legal emergency and dependency chain
- [Roadmap]: Legal pages in Phase 1 (not deferred) due to active Abmahnung risk
- [Roadmap]: Consent system in Phase 1 because booking integration depends on it
- [Roadmap]: Room pages before homepage because homepage reuses RoomCard component
- [Roadmap]: Content/SEO (Phase 4) before booking (Phase 5) -- complete site structure before adding Beds24
- [01-01]: node-linker=hoisted in .npmrc required for oxc-\* native bindings on Windows with pnpm
- [01-01]: tailwindcss() cast as any in nuxt.config.ts for Vite plugin type mismatch workaround
- [01-01]: Charcoal palette added for dark header/footer warm frame effect
- [01-02]: Fixed --radius-lg from 0.75rem to 0.5rem to match DSGN-01 8px spec
- [01-02]: useScrollLock WritableComputedRef synced via watch (not passed as ref)
- [01-02]: app.config.ts nav labels updated with proper German umlauts
- [01-02]: Cookie-Einstellungen as button with data-cookie-settings for Plan 01-03 wiring
- [02-01]: @nuxt/content was missing from Phase 1; installed as blocking fix
- [02-01]: better-sqlite3 needs prebuild-install on Windows (no node-gyp/build tools)
- [02-01]: Single Standardpreis pricing period per room; owner adds seasonal periods later
- [02-01]: beds24RoomId values are placeholder assignments; confirm with owner before Phase 5
- [02-02]: 2-column grid (md:grid-cols-2) for premium room card sizing
- [02-02]: Category grouping via Map preserving sortOrder insertion order
- [02-02]: RoomsCard compact prop for reuse in Weitere Zimmer (Plan 02-03)
- [02-02]: Plural category headings mapping (Ferienwohnung -> Ferienwohnungen)
- [01-03]: Consent banner uses v-if (not v-show) to prevent any third-party loading before consent
- [01-03]: CookieSettings draft state pattern: local ref synced from cookie on open, saved on close
- [01-03]: Legal pages reference DDG S5 and TDDDG S25 (not outdated TMG/TTDSG)
- [01-03]: AGB includes owner review disclaimer -- must be reviewed before production launch
- [01-03]: Prerender routes for /impressum/, /datenschutz/, /agb/ in nuxt.config.ts
- [02-03]: useGallery composable exposes readonly refs; mutations via methods only
- [02-03]: PriceTable dynamically determines occupancy columns from data union (no hardcoding)
- [02-03]: Lightbox wrapped in ClientOnly at parent Gallery.vue level, not inside Lightbox itself
- [02-03]: Hero image uses fetchpriority=high and loading=eager as LCP element
- [02-verify]: Breadcrumb (ROOM-03) deferred to Phase 4 where BreadcrumbList is built for ALL pages
- [02-verify]: Gallery photo count fixed -- all 7 rooms now have 5+ images (ROOM-04 satisfied)
- [03-01]: queryCollection works for single-file data collections (testimonials, attractions) -- no TS fallback needed
- [03-01]: Dynamic :src bindings on video source elements to prevent Vite static resolution of missing files
- [03-01]: useElementVisibility supports once/threshold directly (no need for useIntersectionObserver)
- [03-01]: embla-carousel-accessibility at 9.0.0-rc01 (latest available)
- [03-02]: Nuxt Icon CSS mask mode does not support fill; use mode="svg" with :deep(path) for filled icons
- [03-02]: Hero video layered poster-to-video fade using canplay event (not poster attribute)
- [03-02]: Video trimmed to 10s, re-encoded 720p CRF 35 (<800KB per format) for instant feel
- [03-02]: MP4 with -movflags faststart for progressive playback
- [03-02]: Attraction images from Wikimedia Commons (CC0/CC-BY/CC-BY-SA) as dev placeholders
- [04-01]: Renamed attractions collection to attractionsTeaser for homepage; new attractions collection for individual detail pages
- [04-01]: linkChecker.failOnError set to false for incremental builds (pages created across phases)
- [04-01]: Phosphor icons via @iconify-json/ph through existing @nuxt/icon (not separate phosphor module)
- [04-01]: MapConsent integrates with existing useCookieConsent composable for media consent category
- [04-02]: FAQPage schema uses defineWebPage({@type: 'FAQPage'}) + defineQuestion() (defineFaqPage does not exist in API)
- [04-02]: Contact info includes mobile number from app.config.ts alongside landline
- [04-02]: Aktivitaeten page fetches top 3 attractions dynamically from queryCollection
- [04-03]: AttractionsCard uses NuxtImg with responsive sizes for optimal loading
- [04-03]: Practical info on attraction pages rendered conditionally from YAML optional fields
- [04-03]: Explicit amenityMap import in room detail page for HotelRoom schema
- [04-03]: Activity pages use optional chaining for externalPortals to handle schema .default([])
- [04.1-01]: NUXT_APP_BASE_URL set as env var in workflow (not nuxt.config.ts) for GH Pages subpath
- [04.1-01]: Formspree form ID stored in app.config.ts as formspreeId (placeholder xPLACEHOLDER)
- [04.1-01]: No CNAME file -- site served at standard github.io URL; custom domain deferred

### Roadmap Evolution

- Phase 4.1 inserted after Phase 4: GitHub Pages with GitHub Actions for hosting and automatic build (URGENT) -- replaces Netlify/Cloudflare Pages hosting assumption; contact form must switch to Formspree or similar

### Pending Todos

- Confirm beds24RoomId mappings with owner before Phase 5 booking integration
- After fresh pnpm install on Windows, run `npx prebuild-install` in node_modules/better-sqlite3/
- Replace placeholder map image with real OSM screenshot before launch
- Replace Wikimedia Commons attraction images with owner's own photos before launch
- Replace placeholder hero images in attraction YAML files with real photography before production
- Replace placeholder banner images for content pages (/img/banners/\*-banner.webp) before launch
- Replace Formspree placeholder ID (xPLACEHOLDER) in app.config.ts with real form ID before contact form is functional
- Set GitHub Pages source to "GitHub Actions" in repo Settings > Pages before first deployment

### Blockers/Concerns

- Photography: Room YAML files reference placeholder image paths (/img/rooms/\*.jpg); actual photos needed before production
- Photography: Attraction YAML files reference placeholder image paths (/img/attractions/\*.webp); actual photos needed before production
- Photography: Content page banners reference placeholder paths (/img/banners/\*-banner.webp); actual photos needed before production
- Room data: beds24RoomId assignments are placeholders; confirm exact Beds24 room IDs from owner
- Formspree: Contact form has placeholder ID; create Formspree account and replace xPLACEHOLDER before launch
- Windows dev environment: better-sqlite3 prebuilt binaries may be lost after pnpm install; document workaround
- Owner action before launch: Fill [INHABER_NAME] and [STEUERNUMMER] placeholders in /impressum/, review AGB terms

## Session Continuity

Last session: 2026-02-22
Stopped at: Completed 04.1-01-PLAN.md; ready for 04.1-02
Resume file: None

---

_Last updated: 2026-02-22_
