---
phase: 02-content-infrastructure-room-pages
verified: 2026-02-22T12:00:00Z
status: gaps_found
score: 9/11 must-haves verified
gaps:
  - truth: 'Visitor clicking a room card reaches a detail page with breadcrumb (ROOM-03)'
    status: failed
    reason: 'ROOM-03 explicitly requires a breadcrumb on room detail pages. No BreadcrumbNav component exists and [slug].vue contains no breadcrumb markup.'
    artifacts:
      - path: 'app/pages/zimmer/[slug].vue'
        issue: 'No breadcrumb element present anywhere in the template'
      - path: 'app/components/'
        issue: 'No BreadcrumbNav component exists in any subdirectory'
    missing:
      - 'BreadcrumbNav component (DSGN-08 deferred to Phase 4, but ROOM-03 requires it in Phase 2)'
      - 'Breadcrumb markup on /zimmer/[slug] showing: Startseite > Zimmer > [Room Name]'
  - truth: 'Room photo gallery meets ROOM-04 requirement of 5-8 photos per room'
    status: partial
    reason: 'ROOM-04 specifies 5-8 photos per room. Four rooms have only 4 total images (hero + 3 gallery). Only wohlfuehl-appartement (6) and emils-kuhwiese/schoene-aussicht (5 each) meet the minimum.'
    artifacts:
      - path: 'content/rooms/balkonzimmer.yml'
        issue: '4 total images (hero + 3 gallery) -- below 5-photo minimum'
      - path: 'content/rooms/doppelzimmer.yml'
        issue: '4 total images (hero + 3 gallery) -- below 5-photo minimum'
      - path: 'content/rooms/einzelzimmer.yml'
        issue: '4 total images (hero + 3 gallery) -- below 5-photo minimum'
      - path: 'content/rooms/rosengarten.yml'
        issue: '4 total images (hero + 3 gallery) -- below 5-photo minimum'
    missing:
      - '1 additional gallery entry in balkonzimmer.yml (e.g. /img/rooms/balkonzimmer-4.jpg)'
      - '1 additional gallery entry in doppelzimmer.yml (e.g. /img/rooms/doppelzimmer-4.jpg)'
      - '1 additional gallery entry in einzelzimmer.yml (e.g. /img/rooms/einzelzimmer-4.jpg)'
      - '1 additional gallery entry in rosengarten.yml (e.g. /img/rooms/rosengarten-4.jpg)'
human_verification:
  - test: 'Gallery lightbox interactivity: keyboard navigation, Escape key, touch swipe'
    expected: 'Lightbox opens from thumbnail click; arrow keys navigate; Escape closes; swipe works on mobile'
    why_human: 'Interactive runtime behavior cannot be verified by static code analysis'
  - test: 'Room overview visual quality and category grouping'
    expected: 'Ferienwohnungen (3), Doppelzimmer (3), Einzelzimmer (1) sections; hover lift effect; blur placeholders'
    why_human: 'Visual quality requires browser rendering'
  - test: 'Price format readability in German context'
    expected: 'ab 55 EUR / Nacht inkl. MwSt. -- both this and ROADMAP format (ab EUR X) are PAngV compliant'
    why_human: 'Owner may have a format preference; no legal requirement mandates order'
---

# Phase 2: Content Infrastructure & Room Pages -- Verification Report

**Phase Goal:** Visitors can browse all 7 room types with photos, amenities, and pricing -- the core product is visible and browsable
**Verified:** 2026-02-22T12:00:00Z
**Status:** gaps_found
**Re-verification:** No -- initial verification

| #   | Truth                                                          | Status   | Evidence                                                                                                      |
| --- | -------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| 1   | Room data in YAML files validated by Zod schema                | VERIFIED | content.config.ts defines rooms collection; source: rooms/\*.yml; full Zod schema with 16 amenity enum values |
| 2   | Adding a new room YAML auto-generates a room page              | VERIFIED | queryCollection queries all files matching glob; crawlLinks: true; [slug].vue handles any slug dynamically    |
| 3   | queryCollection returns all 7 rooms with correct types         | VERIFIED | 7 YAML files with valid schema fields; SUMMARY confirms zero validation errors at dev startup                 |
| 4   | Amenity enum values map to Lucide icon names and German labels | VERIFIED | amenities.ts exports amenityMap with 16 entries; wifi -> lucide:wifi -> Kostenloses WLAN; proper umlauts      |
| 5   | /zimmer/ shows grid of all 7 rooms grouped by category         | VERIFIED | index.vue fetches rooms ordered by sortOrder; groups via Map; renders RoomsCard in md:grid-cols-2             |
| 6   | Each card shows photo, name, features, price with VAT          | VERIFIED | Card.vue renders NuxtImg, h3 name, shortDescription, maxGuests + highlights, ab X EUR / Nacht + inkl. MwSt.   |
| 7   | Room detail page at /zimmer/[slug] with all sections           | VERIFIED | [slug].vue assembles Gallery, Description, Amenities, PriceTable, Extras, OtherRooms; 404 on missing slug     |
| 8   | Photo gallery with lightbox (keyboard, swipe, navigation)      | VERIFIED | Gallery.vue + Lightbox.vue + useGallery; useFocusTrap + useSwipe from VueUse; keyboard handlers               |
| 9   | All prices include VAT and show pro Nacht unit (LEGL-07)       | VERIFIED | PriceTable.vue has pro Nacht per cell and Alle Preise inkl. MwSt. footer; Card.vue has inkl. MwSt.            |
| 10  | Room detail page has breadcrumb (ROOM-03)                      | FAILED   | No BreadcrumbNav component exists; [slug].vue template has no breadcrumb markup                               |
| 11  | Room gallery meets 5-8 photo minimum (ROOM-04)                 | PARTIAL  | 4 rooms have only 4 total images; gallery infrastructure works but YAML needs additional entries              |

**Score:** 9/11 truths verified

---

## Required Artifacts

| Artifact                                | Expected                             | Status   | Details                                                                                         |
| --------------------------------------- | ------------------------------------ | -------- | ----------------------------------------------------------------------------------------------- |
| content.config.ts                       | Rooms collection with Zod schema     | VERIFIED | 97 lines; defineCollection type:data; source rooms/\*.yml; full Zod schema                      |
| app/utils/amenities.ts                  | AmenityInfo + amenityMap 16 entries  | VERIFIED | 23 lines; exports AmenityInfo interface and amenityMap record with 16 entries                   |
| content/rooms/emils-kuhwiese.yml        | beds24PropertyId: 257613; featured   | VERIFIED | 81 lines; beds24PropertyId: 257613; sortOrder: 1; featured: true                                |
| content/rooms/schoene-aussicht.yml      | beds24PropertyId: 257610; featured   | VERIFIED | 80 lines; beds24PropertyId: 257610; sortOrder: 2; featured: true                                |
| content/rooms/balkonzimmer.yml          | Doppelzimmer with balkon amenity     | VERIFIED | 78 lines; category: Doppelzimmer; balkon in amenities                                           |
| content/rooms/rosengarten.yml           | Doppelzimmer room data               | VERIFIED | 77 lines; valid schema; sortOrder: 5; startingPrice: 45                                         |
| content/rooms/wohlfuehl-appartement.yml | Ferienwohnung with kitchen amenities | VERIFIED | 84 lines; sortOrder: 3; featured: true; kueche/kuehlschrank/kaffeemaschine                      |
| content/rooms/doppelzimmer.yml          | Doppelzimmer room data               | VERIFIED | 77 lines; sortOrder: 6; startingPrice: 40                                                       |
| content/rooms/einzelzimmer.yml          | Single-occupancy only pricing        | VERIFIED | 75 lines; only 1-person rate at 38 EUR; sortOrder: 7                                            |
| app/components/rooms/Card.vue           | Room card with compact mode          | VERIFIED | 88 lines; NuxtLink to /zimmer/slug; compact prop; hover effects; price with inkl. MwSt.         |
| app/pages/zimmer/index.vue              | Room overview page                   | VERIFIED | 84 lines; queryCollection; groupedRooms computed; category headings; RoomsCard grid             |
| app/composables/useGallery.ts           | Gallery state composable             | VERIFIED | 54 lines; exports useGallery + GalleryImage; readonly refs; all navigation methods              |
| app/components/rooms/Gallery.vue        | Hero + thumbnail strip               | VERIFIED | 87 lines; combines heroImage + gallery; useGallery; ClientOnly Lightbox; thumbnail highlighting |
| app/components/rooms/Lightbox.vue       | Fullscreen overlay with a11y         | VERIFIED | 173 lines; Teleport; useFocusTrap; useSwipe; keyboard handler; aria-modal; 48px buttons         |
| app/components/rooms/Description.vue    | Expandable Mehr lesen                | VERIFIED | 49 lines; isExpanded ref; toggle button; aria-expanded; max-h transition                        |
| app/components/rooms/Amenities.vue      | Icon grid using amenityMap           | VERIFIED | 87 lines; imports amenityMap; fixed specs first then dynamic amenities; fallback for unknown    |
| app/components/rooms/PriceTable.vue     | Dynamic pricing table + PAngV        | VERIFIED | 102 lines; dynamic occupancy columns; pro Nacht; Alle Preise inkl. MwSt.                        |
| app/components/rooms/Extras.vue         | Zusatzleistungen list                | VERIFIED | 43 lines; v-if on empty array; name + description + price EUR unit format                       |
| app/components/rooms/OtherRooms.vue     | Weitere Zimmer with compact cards    | VERIFIED | 42 lines; grid of RoomsCard compact=true; h2 Weitere Zimmer                                     |
| app/pages/zimmer/[slug].vue             | Detail page assembling all sections  | VERIFIED | 89 lines; queryCollection with slug filter; 404 handling; all 6 components present              |
| BreadcrumbNav component                 | Breadcrumb for ROOM-03               | MISSING  | No BreadcrumbNav in app/components/; [slug].vue has no breadcrumb markup                        |

---

## Key Link Verification

| From                                | To                                | Via                    | Status | Details                                                                                       |
| ----------------------------------- | --------------------------------- | ---------------------- | ------ | --------------------------------------------------------------------------------------------- |
| content.config.ts                   | content/rooms/\*.yml              | source glob            | WIRED  | source: rooms/\*.yml in defineCollection                                                      |
| nuxt.config.ts                      | @nuxt/content + @nuxt/icon        | modules array          | WIRED  | Both in modules; icon serverBundle: local                                                     |
| nuxt.config.ts                      | All 7 room slugs                  | nitro.prerender.routes | WIRED  | /zimmer/ + 7 slug routes listed explicitly                                                    |
| app/pages/zimmer/index.vue          | queryCollection rooms             | Nuxt Content           | WIRED  | queryCollection(rooms).order(sortOrder ASC).all()                                             |
| app/pages/zimmer/index.vue          | app/components/rooms/Card.vue     | RoomsCard              | WIRED  | RoomsCard v-for with all props spread                                                         |
| app/components/rooms/Card.vue       | /zimmer/[slug]                    | NuxtLink               | WIRED  | :to template literal /zimmer/slug on wrapping NuxtLink                                        |
| app/pages/zimmer/[slug].vue         | queryCollection rooms             | slug filter            | WIRED  | .where(slug = slug).first() + .where(slug \!= slug)                                           |
| app/pages/zimmer/[slug].vue         | All 6 section components          | template usage         | WIRED  | RoomsGallery, RoomsDescription, RoomsAmenities, RoomsPriceTable, RoomsExtras, RoomsOtherRooms |
| app/components/rooms/Gallery.vue    | app/composables/useGallery.ts     | composable call        | WIRED  | useGallery(allImages) with all returned methods used                                          |
| app/components/rooms/Gallery.vue    | app/components/rooms/Lightbox.vue | ClientOnly             | WIRED  | ClientOnly > RoomsLightbox with events wired                                                  |
| app/components/rooms/Lightbox.vue   | useFocusTrap                      | @vueuse/integrations   | WIRED  | import + activate/deactivate on isOpen watch                                                  |
| app/components/rooms/Lightbox.vue   | useSwipe                          | @vueuse/core           | WIRED  | useSwipe(imageContainerRef) with direction check in onSwipeEnd                                |
| app/components/rooms/Amenities.vue  | app/utils/amenities.ts            | amenityMap import      | WIRED  | import amenityMap from ~/utils/amenities; iterated in displayItems computed                   |
| app/components/rooms/OtherRooms.vue | app/components/rooms/Card.vue     | compact prop           | WIRED  | RoomsCard :compact=true in grid                                                               |

---

## Requirements Coverage

| Requirement                                                  | Status    | Blocking Issue                                                                    |
| ------------------------------------------------------------ | --------- | --------------------------------------------------------------------------------- |
| FOUN-08: Nuxt Content v3 YAML collections + Zod              | SATISFIED | --                                                                                |
| LEGL-07: All prices with VAT and pro Nacht unit              | SATISFIED | --                                                                                |
| ROOM-01: Room data in YAML with full schema                  | SATISFIED | --                                                                                |
| ROOM-02: Overview page with RoomCard grid + price            | SATISFIED | --                                                                                |
| ROOM-03: Detail pages for all 7 rooms WITH breadcrumb        | BLOCKED   | No BreadcrumbNav component; detail pages work but breadcrumb absent               |
| ROOM-04: Gallery with carousel/lightbox, 5-8 photos per room | PARTIAL   | 4 rooms have 4 photos; gallery UI fully functional; YAML needs additional entries |
| ROOM-05: Amenity grid with icons                             | SATISFIED | --                                                                                |
| ROOM-06: Price card with ab EUR X / Nacht + extras pricing   | SATISFIED | --                                                                                |
| ROOM-07: Weitere Zimmer section on detail pages              | SATISFIED | --                                                                                |

---

## Anti-Patterns Found

| File                          | Line | Pattern     | Severity | Impact                                                                          |
| ----------------------------- | ---- | ----------- | -------- | ------------------------------------------------------------------------------- |
| app/components/rooms/Card.vue | 35   | placeholder | Info     | NuxtImg placeholder prop for blur-up effect -- valid implementation, not a stub |

No blocker or warning anti-patterns found. All 13 implementation files have real, substantive implementations.

---

## Human Verification Required

### 1. Gallery Lightbox Interactivity

**Test:** Open /zimmer/emils-kuhwiese, click a gallery thumbnail to open lightbox
**Expected:** Dark overlay appears; ArrowLeft/ArrowRight navigate images; Escape key closes; thumbnail strip highlights active image; on mobile swipe left/right navigates
**Why human:** Interactive runtime behavior cannot be verified by static code analysis

### 2. Room Overview Visual Quality

**Test:** Open /zimmer/ and review the complete page
**Expected:** H1 Unsere Zimmer; Ferienwohnungen section (3 cards); Doppelzimmer section (3 cards); Einzelzimmer section (1 card); blur placeholders for missing images; hover lift effect
**Why human:** Visual quality and layout correctness require browser rendering

### 3. Price Format User Preference

**Test:** Review price display format on room cards
**Expected:** ab 55 EUR / Nacht inkl. MwSt. -- ROADMAP says ab EUR X / Nacht; Card.vue uses ab X EUR / Nacht; both are PAngV compliant
**Why human:** Owner may prefer a specific format; no legal requirement mandates currency-amount order

---

## Gaps Summary

Two gaps prevent full requirement satisfaction for ROOM-03 and ROOM-04:

**Gap 1 -- Missing Breadcrumb (ROOM-03 Blocked):** ROOM-03 requires room detail pages to include a breadcrumb. No BreadcrumbNav component exists anywhere in the codebase. The [slug].vue template has no breadcrumb markup. A minimal breadcrumb showing Startseite > Zimmer > [Room Name] is needed.

**Gap 2 -- Photo Count Below Minimum (ROOM-04 Partial):** Four rooms (balkonzimmer, doppelzimmer, einzelzimmer, rosengarten) have only 4 total images each (1 hero + 3 gallery entries), short of the 5-photo minimum in ROOM-04. The gallery infrastructure is fully functional. The fix requires adding one additional placeholder gallery entry to each of the four under-count YAML files. This is a data gap, not an infrastructure gap.

The phase goal is substantially achieved: the core browsing experience works end-to-end. Both gaps are small targeted fixes.

---

_Verified: 2026-02-22T12:00:00Z_
_Verifier: Claude (gsd-verifier)_
