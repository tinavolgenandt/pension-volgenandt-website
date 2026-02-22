---
phase: 04-content-pages-attractions-seo
plan: 02
subsystem: ui, seo
tags:
  [
    vue-pages,
    phosphor-icons,
    netlify-forms,
    faq-accordion,
    leaflet,
    schema-org,
    FAQPage,
    contact-form,
    german-content,
  ]

# Dependency graph
requires:
  - phase: 04-content-pages-attractions-seo
    provides: 'PageBanner, FeatureGrid, SoftCta, BookingCta, DistanceBadge, HostTip, BreadcrumbNav, MapConsent components; attractions/faq data collections; @nuxtjs/seo; @nuxtjs/leaflet'
  - phase: 01-foundation-legal-compliance
    provides: 'Design tokens (sage, waldhonig, cream), cookie consent composable, app.config.ts contact info'
provides:
  - '4 content pages (/familie/, /nachhaltigkeit/, /aktivitaeten/, /kontakt/) with full German content'
  - 'Contact form component with Netlify Forms hidden detection and AJAX submission'
  - 'FAQ accordion (3 components) with ARIA attributes and smooth expand/collapse'
  - 'Consent-gated directions map for Kontakt page using MapConsent'
  - 'FAQPage structured data on /kontakt/ via defineWebPage + defineQuestion'
  - 'Per-page SEO: unique meta title, description, canonical URL, OG tags, hreflang on all 4 pages'
affects:
  - '04-03 (attraction/activity pages use same content page pattern)'
  - '05-booking-integration (Kontakt page form may need adjustment if hosting changes from Netlify)'

# Tech tracking
tech-stack:
  added: []
  patterns:
    [
      'Netlify Forms hidden detection + AJAX POST with URL-encoded body',
      'FAQ accordion with single-open state and ARIA aria-expanded',
      'FAQPage schema via defineWebPage + defineQuestion',
      'Content page assembly pattern with shared components',
    ]

key-files:
  created:
    - 'app/pages/familie.vue'
    - 'app/pages/nachhaltigkeit.vue'
    - 'app/pages/aktivitaeten/index.vue'
    - 'app/pages/kontakt.vue'
    - 'app/components/contact/Form.vue'
    - 'app/components/contact/FaqAccordion.vue'
    - 'app/components/contact/FaqItem.vue'
    - 'app/components/contact/DirectionsMap.vue'
  modified:
    - 'nuxt.config.ts'

key-decisions:
  - "FAQPage schema uses defineWebPage({@type: 'FAQPage'}) + defineQuestion() instead of non-existent defineFaqPage()"
  - 'Contact info includes mobile number from app.config.ts alongside landline for better accessibility'
  - 'Aktivitaeten page fetches top 3 attractions dynamically from queryCollection for automatic updates'

patterns-established:
  - 'Content page assembly: PageBanner -> intro -> FeatureGrid -> narrative -> checklist -> SoftCta -> BookingCta'
  - 'Kontakt page layout: contact info + form side-by-side (md:grid-cols-2), directions + map, FAQ accordion'
  - 'FAQ accordion: FaqAccordion manages single-open state, FaqItem handles ARIA and transitions'
  - 'Netlify Forms: hidden form for SSG detection + visible form with @submit.prevent AJAX'

# Metrics
duration: 15min
completed: 2026-02-22
---

# Phase 4 Plan 02: Content Pages & Kontakt with FAQ Summary

**4 German content pages (Familie, Nachhaltigkeit, Aktivitaeten, Kontakt) with Netlify Forms contact form, 12-item FAQ accordion with FAQPage schema, consent-gated OpenStreetMap, and per-page SEO meta**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-02-22T08:45:46Z
- **Completed:** 2026-02-22T09:01:00Z
- **Tasks:** 3
- **Files modified:** 9

## Accomplishments

- 4 complete content pages in warm German "Wir" family voice, each following the locked page pattern (banner, intro, feature grid, narrative, CTAs)
- Contact form ready for Netlify Forms with hidden detection form, honeypot spam protection, and AJAX submission with success/error states
- FAQ accordion with 12 items across 4 categories, single-open state management, ARIA accessibility attributes, and smooth CSS transitions
- FAQPage structured data on /kontakt/ for AI search citations and general search comprehension
- Consent-gated OpenStreetMap on /kontakt/ with pension marker via MapConsent (reused from 04-01)
- Unique SEO meta (title, description, OG tags, canonical URL, hreflang) on every content page

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Familie, Nachhaltigkeit, and Aktivitaeten content pages** - `4d8df9a` (feat)
2. **Task 2: Create Kontakt page sub-components (form, FAQ accordion, directions map)** - `37bede0` (feat)
3. **Task 3: Assemble Kontakt page with all sections** - `1b18d0c` (feat)

## Files Created/Modified

- `app/pages/familie.vue` - Familie & Kinder page with family amenities feature grid, garden narrative, practical checklist
- `app/pages/nachhaltigkeit.vue` - Nachhaltigkeit page with sustainability features, solar/garden narratives, regional products highlight
- `app/pages/aktivitaeten/index.vue` - Aktivitaeten overview with Wandern/Radfahren activity cards and top 3 attraction cards from queryCollection
- `app/pages/kontakt.vue` - Contact page assembling form, FAQ, map, directions; FAQPage schema via defineWebPage + defineQuestion
- `app/components/contact/Form.vue` - Netlify Forms with hidden detection, honeypot, AJAX URL-encoded POST, 3 states (default/submitting/submitted)
- `app/components/contact/FaqAccordion.vue` - FAQ accordion container managing single-open state
- `app/components/contact/FaqItem.vue` - FAQ item with aria-expanded, caret rotation, max-h transition animation
- `app/components/contact/DirectionsMap.vue` - Consent-gated Leaflet map with pension marker using AttractionsMapConsent
- `nuxt.config.ts` - Added prerender routes for /familie/, /nachhaltigkeit/, /aktivitaeten/, /kontakt/

## Decisions Made

- **FAQPage schema approach:** The plan referenced `defineFaqPage()` which does not exist in the @unhead/schema-org API. Used `defineWebPage({ '@type': 'FAQPage' })` combined with `defineQuestion()` for each FAQ item instead -- this is the correct API for the installed version.
- **Mobile number included on Kontakt:** Added mobile number (`0160 97719112`) from app.config.ts alongside the landline number, providing visitors two phone contact options for better accessibility (especially for the 55+ target audience).
- **Aktivitaeten dynamic attractions:** The Aktivitaeten page uses `queryCollection('attractions').order('sortOrder', 'ASC').limit(3)` to automatically show the top 3 attractions, so adding new attractions in 04-03 will automatically update this page.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added prerender routes for new content pages**

- **Found during:** Task 1 (content page creation)
- **Issue:** New pages at /familie/, /nachhaltigkeit/, /aktivitaeten/, /kontakt/ would not be prerendered without adding them to nitro.prerender.routes
- **Fix:** Added all 4 routes to the prerender configuration in nuxt.config.ts
- **Files modified:** nuxt.config.ts
- **Verification:** Build completes successfully
- **Committed in:** 4d8df9a (Task 1 commit)

**2. [Rule 1 - Bug] Used correct FAQPage schema API**

- **Found during:** Task 3 (Kontakt page assembly)
- **Issue:** Plan specified `defineFaqPage()` which does not exist in the @unhead/schema-org API. Using it would cause a runtime error.
- **Fix:** Used `defineWebPage({ '@type': 'FAQPage' })` combined with `defineQuestion()` per item, which is the correct approach for the installed library version.
- **Files modified:** app/pages/kontakt.vue
- **Verification:** Typecheck passes, build succeeds
- **Committed in:** 1b18d0c (Task 3 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes necessary for correct operation. No scope creep.

## Issues Encountered

- Nuxt cache corruption caused initial build failure (ENOENT on manifest.json). Resolved by clearing `node_modules/.cache/nuxt/` and running `nuxt prepare` before retrying the build.

## User Setup Required

None - no external service configuration required. Netlify Forms will auto-detect the hidden form at deploy time.

## Next Phase Readiness

- All 4 content pages live and ready for visual review
- FAQ data served from content/faq/index.yml -- editable without code changes
- Attraction cards on /aktivitaeten/ dynamically query the attractions collection (populated in 04-01)
- Contact form ready for Netlify deployment (hidden form detection pattern)
- Placeholder banner images referenced -- real photography needed before launch
- Plan 04-03 can now build attraction detail pages, activity pages, and Ausflugsziele overview
- Link checker warnings for /ausflugsziele/, /aktivitaeten/wandern/, /aktivitaeten/radfahren/ will resolve when 04-03 creates those pages

---

_Phase: 04-content-pages-attractions-seo_
_Completed: 2026-02-22_
