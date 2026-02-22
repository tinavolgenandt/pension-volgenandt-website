---
phase: 02-content-infrastructure-room-pages
plan: 03
subsystem: ui
tags:
  [
    vue,
    nuxt-content,
    rooms,
    gallery,
    lightbox,
    pricing,
    pangv,
    accessibility,
    composable,
    detail-page,
  ]

# Dependency graph
requires:
  - phase: 02-content-infrastructure-room-pages
    provides: Rooms data collection with Zod schema and 7 room YAML files (Plan 02-01)
  - phase: 02-content-infrastructure-room-pages
    provides: RoomsCard component with compact variant and room overview page (Plan 02-02)
  - phase: 01-foundation-legal-compliance
    provides: Design system, layout shell, base UI components
provides:
  - Room detail page at /zimmer/[slug] with full room data rendering
  - useGallery composable for image gallery state management
  - Lightbox component with focus trap, keyboard nav, swipe, 48px touch targets
  - PriceTable with dynamic occupancy columns and PAngV compliance
  - Extras, Description, Amenities, OtherRooms section components
  - Gallery component with hero image + thumbnail strip
affects: [03-homepage-hero, 05-booking-integration, 06-optimization-launch]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - 'useGallery composable pattern for UI state with readonly refs and computed navigation'
    - 'ClientOnly wrapper for interactive-only components to prevent hydration mismatch'
    - 'Dynamic table column generation from data (PriceTable occupancy detection)'
    - 'Teleport + focus trap + keyboard handler pattern for accessible modals'

key-files:
  created:
    - app/composables/useGallery.ts
    - app/components/rooms/Gallery.vue
    - app/components/rooms/Lightbox.vue
    - app/components/rooms/Description.vue
    - app/components/rooms/Amenities.vue
    - app/components/rooms/PriceTable.vue
    - app/components/rooms/Extras.vue
    - app/components/rooms/OtherRooms.vue
    - app/pages/zimmer/[slug].vue
  modified: []

key-decisions:
  - 'useGallery composable encapsulates all gallery state (currentIndex, lightbox, navigation) with readonly exposed refs'
  - 'PriceTable dynamically determines occupancy columns from data union -- Einzelzimmer correctly shows only 1-Person column'
  - 'Lightbox wrapped in ClientOnly in parent Gallery.vue, not inside Lightbox itself, preventing hydration mismatches'
  - 'Hero image uses fetchpriority=high and loading=eager as LCP element'

patterns-established:
  - 'Composable pattern: expose readonly refs and computed, mutate via methods only'
  - 'ClientOnly wrapper at parent level for components that need DOM (Teleport, focus trap)'
  - 'Accessible modal: Teleport to body + focus trap + keyboard handler + aria-modal'
  - 'Dynamic table columns: compute column set from data, render conditionally'

# Metrics
duration: 15min
completed: 2026-02-22
---

# Phase 2 Plan 3: Room Detail Pages Summary

**Room detail page with gallery/lightbox, expandable description, amenity grid, dynamic pricing table, extras, and cross-navigation to all other rooms**

## Performance

- **Duration:** 15 min
- **Started:** 2026-02-22T03:15:00Z
- **Completed:** 2026-02-22T03:30:00Z
- **Tasks:** 3 (2 auto + 1 checkpoint)
- **Files created:** 9

## Accomplishments

- Built complete room detail page assembling 8 components at `/zimmer/[slug]` with queryCollection data fetching
- Gallery with hero image (LCP-optimized) + thumbnail strip + fullscreen lightbox with focus trap, keyboard nav, touch swipe, and 48px touch targets
- PriceTable dynamically determines occupancy columns from pricing data -- Einzelzimmer correctly renders only 1-Person column without hardcoding
- All 7 room detail pages render correctly with HTTP 200, passing vue-tsc typecheck

## Task Commits

Each task was committed atomically:

1. **Task 1: Gallery composable, lightbox, description, amenities** - `03425c5` (feat)
2. **Task 2: Pricing, extras, other-rooms, detail page assembly** - `ca6ece3` (feat)
3. **Task 3: Visual/functional verification** - checkpoint approved (no commit needed)

## Files Created/Modified

- `app/composables/useGallery.ts` - Gallery state management composable (currentIndex, lightbox, navigation)
- `app/components/rooms/Gallery.vue` - Hero image + thumbnail strip, integrates useGallery and Lightbox
- `app/components/rooms/Lightbox.vue` - Fullscreen overlay with focus trap, keyboard nav, swipe, accessible controls
- `app/components/rooms/Description.vue` - Expandable description with "Mehr lesen" / "Weniger anzeigen" toggle
- `app/components/rooms/Amenities.vue` - Icon grid with room specs (guests, beds, size) and amenities from amenityMap
- `app/components/rooms/PriceTable.vue` - Seasonal pricing table with dynamic occupancy columns and PAngV compliance
- `app/components/rooms/Extras.vue` - Zusatzleistungen list with prices and units
- `app/components/rooms/OtherRooms.vue` - "Weitere Zimmer" grid using RoomsCard compact variant
- `app/pages/zimmer/[slug].vue` - Room detail page assembling all components with queryCollection data fetching

## Decisions Made

- useGallery composable exposes readonly refs and computed properties, mutations only via methods -- prevents external state corruption
- PriceTable dynamically computes occupancy columns from the union of all rate occupancy values across all pricing periods, so rooms with only 1-person rates (Einzelzimmer) automatically show a single column without special-casing
- Lightbox is wrapped in ClientOnly at the Gallery.vue parent level rather than inside Lightbox.vue itself, cleanly separating SSR concerns from component logic
- Hero image gets `fetchpriority="high"` and `loading="eager"` as the LCP element; all other images use lazy loading

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 2 is now complete: all 7 rooms have data (02-01), overview page (02-02), and detail pages (02-03)
- Phase 3 (Homepage & Hero) can begin -- it reuses RoomsCard component for featured rooms preview
- Room detail pages provide the foundation for Phase 5 booking widget integration (Beds24 iframe placement)
- Photography: Room YAML files still reference placeholder image paths; actual photos needed before production

---

_Phase: 02-content-infrastructure-room-pages_
_Completed: 2026-02-22_
