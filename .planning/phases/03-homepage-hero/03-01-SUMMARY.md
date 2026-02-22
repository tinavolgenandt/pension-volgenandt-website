---
phase: 03-homepage-hero
plan: 01
subsystem: ui
tags: [hero-video, scroll-animation, embla-carousel, nuxt-content, homepage, vuese]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Design system tokens, layout shell, Tailwind v4, Nuxt 4 base
  - phase: 02-content-infrastructure
    provides: Room content collections, RoomsCard component, Nuxt Content setup
provides:
  - Homepage page assembly at / with all 7 sections wired
  - HeroVideo component with desktop video / mobile poster / sage-charcoal fallback
  - ScrollReveal composable and wrapper component for scroll-triggered animations
  - StarRating and ScrollIndicator utility components
  - Testimonials and attractions YAML data collections
  - Embla Carousel packages installed (for Plan 03-02 testimonial carousel)
  - FeaturedRooms section querying rooms with featured=true
  - 4 stub components for Plan 03-02 (Testimonials, ExperienceTeaser, SustainabilityTeaser, LocationMap)
  - Placeholder hero poster images for development
affects:
  - 03-homepage-hero (Plan 02 uses stubs, ScrollReveal, StarRating, content data)
  - 04-content-seo (homepage SEO meta established, section order finalized)

# Tech tracking
tech-stack:
  added:
    - embla-carousel-vue@8.6.0
    - embla-carousel-autoplay@8.6.0
    - embla-carousel-accessibility@9.0.0-rc01
  patterns:
    - ScrollReveal composable + wrapper (useElementVisibility with once:true, threshold:0.15)
    - Homepage section component pattern (app/components/home/*.vue)
    - Content data collections for non-page YAML data (testimonials, attractions)
    - Hero entrance staggered CSS animation with animation-delay
    - Dynamic :src bindings on video sources to avoid Vite static resolution

key-files:
  created:
    - app/components/home/HeroVideo.vue
    - app/components/home/Welcome.vue
    - app/components/home/FeaturedRooms.vue
    - app/components/home/Testimonials.vue (stub)
    - app/components/home/ExperienceTeaser.vue (stub)
    - app/components/home/SustainabilityTeaser.vue (stub)
    - app/components/home/LocationMap.vue (stub)
    - app/composables/useScrollReveal.ts
    - app/components/ui/ScrollReveal.vue
    - app/components/ui/StarRating.vue
    - app/components/ui/ScrollIndicator.vue
    - content/testimonials/index.yml
    - content/attractions/index.yml
    - public/img/hero/hero-poster.webp
    - public/img/hero/hero-mobile.webp
  modified:
    - content.config.ts
    - package.json
    - pnpm-lock.yaml
    - app/pages/index.vue

key-decisions:
  - 'queryCollection path works for testimonials/attractions single-file data collections (no TypeScript fallback needed)'
  - 'Dynamic :src bindings on video source elements to prevent Vite static resolution of missing video files'
  - 'useElementVisibility (not useIntersectionObserver) for scroll reveal -- supports once and threshold directly'
  - 'embla-carousel-accessibility installed at 9.0.0-rc01 (latest available for the accessibility plugin)'

patterns-established:
  - 'ScrollReveal: useScrollReveal composable + UiScrollReveal wrapper for scroll-triggered CSS fade-in animations'
  - 'Homepage sections: individual components in app/components/home/ assembled in app/pages/index.vue'
  - 'Hero entrance: CSS @keyframes with animation-delay per element, prefers-reduced-motion disables all'
  - 'Media fallback: bg-[#2C3E2D] on hero section element as solid color fallback when all media assets missing'

# Metrics
duration: 21min
completed: 2026-02-22
---

# Phase 3 Plan 01: Homepage Hero & Infrastructure Summary

**Full-viewport hero with video/poster/sage-charcoal fallback, staggered entrance animations, scroll-reveal system, featured room cards, and homepage assembly with all 7 sections**

## Performance

- **Duration:** 21 min
- **Started:** 2026-02-22T07:01:28Z
- **Completed:** 2026-02-22T07:23:02Z
- **Tasks:** 3
- **Files modified:** 18

## Accomplishments

- HeroVideo component renders full-viewport hero with desktop video, mobile poster, sage-charcoal gradient overlay, and staggered entrance animations (H1 300ms, tagline 550ms, CTA 800ms, scroll indicator 1500ms)
- Hero renders gracefully when video/poster files are missing -- bg-[#2C3E2D] fallback ensures gradient, text, and CTA remain visible
- ScrollReveal composable and wrapper component provide reusable scroll-triggered fade-in animations across all homepage sections
- FeaturedRooms section queries 3 rooms with featured=true from Nuxt Content and displays them with staggered scroll reveal
- Homepage page at / fully assembled with all 7 sections in correct CONTEXT.md order, with SEO title and meta description
- Testimonials and attractions YAML data collections loaded via queryCollection (no TypeScript fallback needed)
- Embla Carousel packages installed and ready for Plan 03-02 testimonial carousel

## Task Commits

Each task was committed atomically:

1. **Task 1: Infrastructure -- Embla install, content data collections, YAML data** - `e116040` (feat)
2. **Task 2: Scroll animation composable and utility components** - `b972fd1` (feat)
3. **Task 3: Hero section, welcome, featured rooms, stubs, homepage assembly** - `f7c3a38` (feat)

## Files Created/Modified

- `app/components/home/HeroVideo.vue` - Full-viewport hero with video/poster, gradient overlay, staggered entrance, scroll indicator
- `app/components/home/Welcome.vue` - Welcome section with 2-column layout, greeting text, lifestyle photo placeholder
- `app/components/home/FeaturedRooms.vue` - 3-column featured room card grid querying rooms with featured=true
- `app/components/home/Testimonials.vue` - Stub placeholder for Plan 03-02
- `app/components/home/ExperienceTeaser.vue` - Stub placeholder for Plan 03-02
- `app/components/home/SustainabilityTeaser.vue` - Stub placeholder for Plan 03-02
- `app/components/home/LocationMap.vue` - Stub placeholder for Plan 03-02
- `app/composables/useScrollReveal.ts` - Scroll animation composable wrapping useElementVisibility
- `app/components/ui/ScrollReveal.vue` - Reusable scroll animation wrapper with CSS transitions
- `app/components/ui/StarRating.vue` - Star rating display with filled/half/empty stars
- `app/components/ui/ScrollIndicator.vue` - Bouncing chevron scroll indicator
- `content/testimonials/index.yml` - 5 testimonials with name, quote, rating
- `content/attractions/index.yml` - 4 featured attractions with name, slug, image, distance
- `content.config.ts` - Updated with testimonials and attractions data collections
- `app/pages/index.vue` - Homepage assembly with all 7 sections and SEO meta
- `public/img/hero/hero-poster.webp` - Placeholder desktop video poster (sage-charcoal gradient)
- `public/img/hero/hero-mobile.webp` - Placeholder mobile hero poster (sage-charcoal gradient)
- `package.json` - Added embla-carousel-vue, embla-carousel-autoplay, embla-carousel-accessibility

## Decisions Made

- **queryCollection works for single-file data collections:** Testimonials and attractions YAML files load correctly via `queryCollection('testimonials')` and `queryCollection('attractions')`. No TypeScript fallback needed. The absence of `app/data/testimonials.ts` signals this to Plan 03-02.
- **Dynamic :src on video sources:** Vite statically resolves `<source src="...">` attributes during build, causing errors when video files don't exist yet. Using `:src="videoSources.webm"` with a script constant prevents Vite from resolving at build time while still producing correct runtime HTML.
- **useElementVisibility over useIntersectionObserver:** VueUse v14's `useElementVisibility` directly supports `once` and `threshold` options, making the simpler API sufficient without needing the more verbose callback-based `useIntersectionObserver`.
- **embla-carousel-accessibility at 9.0.0-rc01:** The accessibility plugin resolved to a release candidate version. It's the latest available and provides WCAG 2.1 AA support.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Dynamic :src bindings on video source elements**

- **Found during:** Task 3 (HeroVideo component)
- **Issue:** Build failed with `Rollup failed to resolve import "/video/hero.mp4"` because Vite statically resolves `<source src="...">` attributes and the video files don't exist yet
- **Fix:** Changed `src="/video/hero.webm"` to `:src="videoSources.webm"` using script constants, preventing Vite static analysis while producing correct runtime HTML
- **Files modified:** app/components/home/HeroVideo.vue
- **Verification:** `make build` passes successfully
- **Committed in:** f7c3a38 (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Auto-fix necessary for build to pass. No scope creep.

## Issues Encountered

- Pre-existing uncommitted changes found in `content/rooms/*.yml` and `nuxt.config.ts` working tree (not from this execution). These were excluded from Task 3 commit to maintain atomic task boundaries.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All shared infrastructure (ScrollReveal, StarRating, ScrollIndicator, content data collections, Embla packages) ready for Plan 03-02
- 4 stub components (Testimonials, ExperienceTeaser, SustainabilityTeaser, LocationMap) in place for Plan 03-02 to replace with full implementations
- Data loading path confirmed: queryCollection works (absence of `app/data/testimonials.ts` signals this)
- Placeholder hero images will need replacement with real photography before production

---

_Phase: 03-homepage-hero_
_Completed: 2026-02-22_
