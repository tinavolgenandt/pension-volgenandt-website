---
phase: 03-homepage-hero
plan: 02
subsystem: ui
tags: [testimonials, carousel, attractions, sustainability, location-map, homepage]

# Dependency graph
requires:
  - phase: 03-homepage-hero
    plan: 01
    provides: Stub components, ScrollReveal, StarRating, content data collections, Embla packages
provides:
  - Testimonials carousel with Embla autoplay, accessibility, star ratings, SSR fallback
  - ExperienceTeaser attraction grid with hero card + 3 smaller cards, waldhonig distance badges
  - SustainabilityTeaser with 3 icon proof points (Solarenergie, Bio-Klaranlage, Kompost)
  - LocationMap with static map placeholder, address, phone, email, OpenStreetMap link
  - Complete homepage with all 7 sections fully implemented
affects:
  - 04-content-seo (homepage patterns established, attraction teaser links to /ausflugsziele/)

# Tech tracking
tech-stack:
  patterns:
    - Embla Carousel with autoplay + accessibility plugins, ClientOnly wrapper, SSR fallback
    - queryCollection for testimonials and attractions data (single-file YAML collections)
    - Hero card + smaller cards grid layout for featured content
    - Static map approach (no external requests, no cookies)
    - Nuxt Icon mode="svg" with :deep(path) CSS for filled icon styling

key-files:
  modified:
    - app/components/home/Testimonials.vue (stub → full Embla carousel)
    - app/components/home/ExperienceTeaser.vue (stub → attraction grid)
    - app/components/home/SustainabilityTeaser.vue (stub → 3 icon proof points)
    - app/components/home/LocationMap.vue (stub → static map + address + contact)
    - app/components/home/HeroVideo.vue (poster-to-video fade fix)
    - app/components/ui/StarRating.vue (mode="svg" fix for filled stars)
  created:
    - public/img/map/pension-location.png (static map placeholder)
    - public/img/attractions/baerenpark.webp (Wikimedia Commons CC-BY)
    - public/img/attractions/burg-hanstein.webp (Wikimedia Commons CC-BY-SA)
    - public/img/attractions/burg-bodenstein.webp (Wikimedia Commons CC-BY-SA)
    - public/img/attractions/baumkronenpfad.webp (Wikimedia Commons CC-BY-SA)
    - public/img/welcome/lifestyle.webp (Wikimedia Commons CC0)
    - public/video/hero.webm (VP9 720p 10s, 796KB)
    - public/video/hero.mp4 (H.264 720p 10s, 682KB)
    - public/img/hero/hero-poster.webp (extracted from video, 13KB)
    - public/img/hero/hero-mobile.webp (portrait crop, 6KB)

key-decisions:
  - "Nuxt Icon CSS mask mode does not support fill CSS; switched to mode='svg' with :deep(path) for StarRating filled stars"
  - 'Hero video: layered poster-to-video fade using canplay event, not poster attribute (eliminates black flash)'
  - 'Video trimmed to 10s and re-encoded at 720p CRF 35 for fast loading (<800KB per format)'
  - 'Attraction images sourced from Wikimedia Commons (CC0/CC-BY/CC-BY-SA) as development placeholders'
  - 'LocationMap uses static PNG placeholder (not Geoapify API) -- owner can replace with real screenshot'
  - 'MP4 encoded with -movflags faststart for progressive playback'

patterns-established:
  - 'Embla carousel: useEmblaCarousel + Autoplay + Accessibility plugins, ClientOnly with SSR fallback template'
  - 'Icon proof points: sage-100 circle backgrounds with sage-600 Lucide icons, responsive grid/stack layout'
  - 'Poster-to-video: CSS z-index stacking (poster z-1, video z-2, gradient z-3) with opacity transitions'

# Metrics
duration: ~45min (including checkpoint visual review and fixes)
completed: 2026-02-22
---

# Phase 3 Plan 02: Homepage Sections & Visual Verification Summary

**Testimonials carousel, experience teaser, sustainability teaser, location map, and visual checkpoint with user-directed fixes**

## Performance

- **Duration:** ~45 min (including checkpoint review)
- **Started:** 2026-02-22
- **Completed:** 2026-02-22
- **Tasks:** 3 (2 auto + 1 checkpoint)
- **Files modified:** 17

## Accomplishments

- Testimonials carousel with Embla autoplay (6s), accessibility plugin, prev/next arrows, dot indicators, star ratings, sage-50 background, and SSR fallback showing first testimonial
- ExperienceTeaser displays 4 attractions in hero+grid layout with waldhonig distance badges ("12 km" format) and staggered scroll animations
- SustainabilityTeaser shows "Natuerlich nachhaltig" with 3 icon proof points (Solarenergie, Bio-Klaranlage, Kompost) in sage-100 circles on sage-50 background
- LocationMap shows static map placeholder linked to OpenStreetMap with full address, phone (tel: link), and email (mailto: link)
- Hero video: real drone footage (YouTube source) converted to optimized WebM/MP4 with layered poster-to-video fade
- Star rating: fixed Nuxt Icon CSS mask incompatibility by switching to SVG mode
- Attraction images sourced from Wikimedia Commons for all 4 locations

## Task Commits

Each task was committed atomically:

1. **Task 1: Testimonials carousel and Experience teaser** - `35b81d2` (feat)
2. **Task 2: Sustainability teaser, Location map** - `1555e0c` (feat)
3. **Checkpoint: Visual verification + orchestrator corrections** - `8739c9d` (fix)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Star rating shows 0/5 (unfilled stars)**

- **Found during:** Checkpoint visual review (user reported)
- **Issue:** Nuxt Icon renders in CSS mask mode where `fill-*` classes have no effect; stars appeared as outlines
- **Fix:** Added `mode="svg"` to Icon components and `:deep(path) { fill: var(--color-waldhonig-400) }` CSS
- **Files modified:** app/components/ui/StarRating.vue
- **Committed in:** 8739c9d

**2. [Rule 1 - Bug] Hero video black screen / slow loading**

- **Found during:** Checkpoint visual review (user reported)
- **Issue:** 20-second 4.3MB video too large; `poster` attribute on video element didn't prevent black flash during buffering
- **Fix:** Trimmed to 10s, re-encoded at 720p (WebM 796KB, MP4 682KB), implemented layered poster-to-video CSS transition using `canplay` event
- **Files modified:** app/components/home/HeroVideo.vue, public/video/hero.webm, public/video/hero.mp4, public/img/hero/hero-poster.webp, public/img/hero/hero-mobile.webp
- **Committed in:** 8739c9d

**3. [Rule 2 - Critical] Missing attraction images**

- **Found during:** Checkpoint visual review (user reported)
- **Issue:** ExperienceTeaser cards had no images (placeholder paths referenced nonexistent files)
- **Fix:** Sourced real images from Wikimedia Commons (CC0/CC-BY/CC-BY-SA) for all 4 attraction locations
- **Files modified:** public/img/attractions/\*.webp
- **Committed in:** 8739c9d

---

**Total deviations:** 3 auto-fixed (1 bug, 1 critical, 1 bug)
**Impact on plan:** All fixes were within plan scope. No scope creep. User checkpoint enabled early detection.

## Issues Encountered

- Port 3000 occupied during dev server restart; Nuxt auto-switched to 3001
- Pre-existing uncommitted changes from Phase 1 (SEO modules, schema.org config) were committed separately as fix(01)

## User Setup Required

None.

## Next Phase Readiness

- Complete homepage with all 7 sections functional and visually verified
- Attraction teaser links to /ausflugsziele/ ready for Phase 4 attraction pages
- Sustainability teaser links to /nachhaltigkeit/ ready for Phase 4 content pages
- Hero video and poster optimized for production performance targets

---

_Phase: 03-homepage-hero_
_Completed: 2026-02-22_
