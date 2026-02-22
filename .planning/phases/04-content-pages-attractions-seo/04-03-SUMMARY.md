---
phase: 04-content-pages-attractions-seo
plan: 03
subsystem: ui, seo
tags:
  [
    leaflet,
    attractions,
    map,
    consent,
    schema-org,
    HotelRoom,
    404,
    prerender,
    wandern,
    radfahren,
    ausflugsziele,
  ]

# Dependency graph
requires:
  - phase: 04-content-pages-attractions-seo
    provides: 'PageBanner, FeatureGrid, SoftCta, BookingCta, DistanceBadge, HostTip, BreadcrumbNav, MapConsent components; attractions/activities YAML data; @nuxtjs/seo, @nuxtjs/leaflet modules'
  - phase: 02-content-infrastructure
    provides: 'Room detail pages at app/pages/zimmer/[slug].vue with rooms collection; amenityMap utility'
provides:
  - 'Ausflugsziele overview page with consent-gated Leaflet map and attraction card grid'
  - 'Dynamic attraction detail template rendering 5 pages from YAML data'
  - 'Wandern and Radfahren activity pages with route recommendations and external portal links'
  - 'Custom 404 error page with navigation links'
  - 'HotelRoom+Offer Schema.org structured data on room detail pages'
  - 'All Phase 4 routes in nitro.prerender.routes'
affects:
  - '05-booking-integration (HotelRoom schema established on room pages)'
  - 'Production launch (all content pages now exist, link checker should resolve)'

# Tech tracking
tech-stack:
  added: []
  patterns:
    [
      'Leaflet map with attraction pins via @nuxtjs/leaflet',
      'Dynamic [slug] route with YAML data fetching',
      'HotelRoom+Offer schema via useSchemaOrg',
      'Catch-all 404 route with styled error page',
    ]

key-files:
  created:
    - 'app/pages/ausflugsziele/index.vue'
    - 'app/pages/ausflugsziele/[slug].vue'
    - 'app/pages/aktivitaeten/wandern.vue'
    - 'app/pages/aktivitaeten/radfahren.vue'
    - 'app/components/attractions/Card.vue'
    - 'app/components/attractions/Map.vue'
    - 'app/pages/[...slug].vue'
    - 'app/error.vue'
  modified:
    - 'app/pages/zimmer/[slug].vue'
    - 'nuxt.config.ts'

key-decisions:
  - 'AttractionsCard uses NuxtImg with responsive sizes for optimal loading'
  - 'Practical info on attraction pages rendered conditionally from YAML optional fields'
  - 'Activity pages use optional chaining for externalPortals to handle schema .default([])'
  - 'Explicit amenityMap import in room detail page for HotelRoom schema'

patterns-established:
  - 'Dynamic content page pattern: fetch YAML by slug, 404 guard, SEO from data, content rendering'
  - 'Difficulty badge pattern: leicht=sage, mittel=waldhonig, schwer=charcoal color mapping'
  - 'Category badge pattern: natur=sage, kultur=waldhonig, aktivitaet=charcoal on attraction cards'
  - 'Custom 404 with catch-all [...slug].vue + app/error.vue pattern'

# Metrics
duration: 14min
completed: 2026-02-22
---

# Phase 4 Plan 03: Attraction Pages, Activity Pages, 404 & Room Schema Summary

**Ausflugsziele overview with consent-gated Leaflet map, 5 attraction detail pages, 2 activity pages with route cards, custom 404 page, and HotelRoom+Offer Schema.org on room pages**

## Performance

- **Duration:** ~14 min
- **Started:** 2026-02-22T08:46:53Z
- **Completed:** 2026-02-22T09:01:00Z
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments

- Ausflugsziele overview page with consent-gated interactive Leaflet map showing pension and 5 attraction markers, plus a responsive card grid with category badges
- Dynamic attraction detail template rendering Baerenpark Worbis, Burg Bodenstein, Burg Hanstein, Skywalk Sonnenstein, and Baumkronenpfad Hainich from YAML data with practical info, host tips, and galleries
- Wandern and Radfahren activity pages with 3 routes each, difficulty badges, and external portal links to komoot/outdooractive
- Custom 404 error page with styled layout and navigation links to Startseite, Zimmer, and Kontakt
- HotelRoom+Offer Schema.org structured data on all room detail pages with amenity mapping and pricing offers
- All Phase 4 routes (8 new) added to nitro.prerender.routes for SSG

## Task Commits

Each task was committed atomically:

1. **Task 1: Ausflugsziele overview page, attraction card, and map** - `e9ea49d` (feat)
2. **Task 2: Attraction detail template and activity pages** - `059c7de` (feat)
3. **Task 3: HotelRoom schema, 404 page, prerender routes** - `c59d4d1` (feat)

## Files Created/Modified

- `app/components/attractions/Card.vue` - Photo card with category badge, distance badge, and description for overview grid
- `app/components/attractions/Map.vue` - Leaflet map with pension marker and attraction markers with popups
- `app/pages/ausflugsziele/index.vue` - Overview page with consent-gated map, card grid, and activity links
- `app/pages/ausflugsziele/[slug].vue` - Dynamic attraction detail template with SEO, practical info, gallery
- `app/pages/aktivitaeten/wandern.vue` - Wandern page with 3 hiking routes and difficulty badges
- `app/pages/aktivitaeten/radfahren.vue` - Radfahren page with 3 cycling routes and external portals
- `app/pages/[...slug].vue` - Catch-all 404 route
- `app/error.vue` - Styled error page with navigation links
- `app/pages/zimmer/[slug].vue` - Added HotelRoom+Offer Schema.org structured data
- `nuxt.config.ts` - Added 8 Phase 4 routes to nitro.prerender.routes

## Decisions Made

- **AttractionsCard responsive images:** Used NuxtImg with sizes attribute for optimal responsive loading across grid breakpoints
- **Practical info conditional rendering:** Only shows opening hours, entry price, best time to visit, and website if data exists in YAML, avoiding empty sections
- **Optional chaining for externalPortals:** Schema default([]) generates a potentially undefined type in TypeScript; used `v-if` guard with `&&` check
- **Explicit amenityMap import:** Added explicit import from ~/utils/amenities in room detail page rather than relying on auto-import, matching existing pattern in RoomsAmenities component

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript error with externalPortals optional access**

- **Found during:** Task 3 (Build verification)
- **Issue:** `activity.externalPortals.length` causes TS18048 because the Zod schema `.default([])` generates a possibly undefined type
- **Fix:** Changed `v-if="activity.externalPortals.length > 0"` to `v-if="activity.externalPortals && activity.externalPortals.length > 0"` in both activity pages
- **Files modified:** app/pages/aktivitaeten/wandern.vue, app/pages/aktivitaeten/radfahren.vue
- **Verification:** Build passes without TypeScript errors
- **Committed in:** c59d4d1 (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor type safety fix. No scope creep.

## Issues Encountered

- Build cache corruption after clean (`mdc-highlighter.mjs` missing). Resolved by running `nuxt prepare` before build to regenerate types and build artifacts.
- `pnpm typecheck` script not available in package.json; used `vue-tsc --noEmit` and `pnpm build` for type verification instead.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All Phase 4 content pages are now complete (Plans 04-01, 04-02, 04-03)
- Link checker 404 warnings for Phase 4 pages should now be resolved (all referenced pages exist)
- Placeholder images in YAML files still need real photography before production
- HotelRoom schema on room pages ready for Beds24 booking integration in Phase 5
- Build passes with all routes configured

---

_Phase: 04-content-pages-attractions-seo_
_Completed: 2026-02-22_
