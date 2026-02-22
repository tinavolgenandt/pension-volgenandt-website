---
phase: 01-foundation-legal-compliance
plan: 02
subsystem: ui
tags:
  [
    vue-components,
    tailwindcss,
    responsive-layout,
    sticky-header,
    hamburger-menu,
    composable,
    vueuse,
  ]

# Dependency graph
requires:
  - phase: 01-foundation-legal-compliance/01
    provides: 'Nuxt 4 scaffold, Tailwind v4 design tokens (sage/waldhonig/charcoal), self-hosted fonts, app.config.ts'
provides:
  - 'BaseButton component with primary/secondary/outline variants and NuxtLink support'
  - 'BaseCard component with 8px radius, no shadow, optional padding'
  - 'BaseBadge component with sage/waldhonig/neutral variants'
  - 'BaseIcon SVG wrapper component (no icon library dependency)'
  - 'AppHeader: sticky with scroll compression, desktop nav + phone + CTA, mobile hamburger with Menu label'
  - 'AppFooter: above-footer CTA bar, 4-column grid (Brand/Kontakt/Entdecken/Rechtliches), copyright bar'
  - 'default.vue layout wrapping all pages with header + main + footer'
  - 'useScrollHeader composable for reactive scroll-aware header compression'
affects:
  - '01-03 (legal pages render inside default layout, cookie settings button in footer)'
  - '02-room-pages (RoomCard uses BaseCard, rooms page in nav)'
  - '03-homepage (hero and sections render inside default layout)'
  - 'All subsequent phases (every page uses default layout with header/footer)'

# Tech tracking
tech-stack:
  added: []
  patterns:
    - 'Auto-imported components: Nuxt auto-imports from app/components/ with path-based naming (UiBaseButton, AppHeader)'
    - 'useAppConfig() pattern: header and footer read nav/contact from app.config.ts at runtime'
    - 'CSS order utilities for mobile-first responsive reordering (order-1/order-2/order-3)'
    - 'VueUse composables: useWindowScroll for scroll detection, useScrollLock for body scroll locking'
    - 'Inline SVG icons: no icon library; SVG paths inlined directly for minimal bundle size'

key-files:
  created:
    - 'app/components/ui/BaseButton.vue'
    - 'app/components/ui/BaseCard.vue'
    - 'app/components/ui/BaseBadge.vue'
    - 'app/components/ui/BaseIcon.vue'
    - 'app/components/AppHeader.vue'
    - 'app/components/AppFooter.vue'
    - 'app/composables/useScrollHeader.ts'
    - 'app/layouts/default.vue'
  modified:
    - 'app/app.config.ts'
    - 'app/assets/css/main.css'
    - 'app/pages/index.vue'

key-decisions:
  - 'Fixed --radius-lg from 0.75rem (12px) to 0.5rem (8px) to match DSGN-01 design spec'
  - 'useScrollLock returns WritableComputedRef; synced with watch on isMenuOpen instead of passing ref directly'
  - 'Updated app.config.ts nav labels to use proper German umlauts (Aktivitaeten -> Aktivitaten) for display'
  - 'Updated address street to use Strasse umlaut for proper German rendering'
  - 'Cookie-Einstellungen rendered as button (not NuxtLink) with data-cookie-settings attribute for Plan 01-03 wiring'
  - 'Copyright year uses dynamic new Date().getFullYear() for automatic updates'

patterns-established:
  - 'Component prop pattern: withDefaults(defineProps<Props>(), {...}) for typed defaults'
  - 'Variant class mapping: Record<string, string> objects mapping prop values to Tailwind classes'
  - "Conditional NuxtLink: render as NuxtLink when 'to' prop provided, otherwise as native element"
  - 'Mobile-first responsive: hidden by default, show at nav: breakpoint (1024px)'
  - 'Hamburger menu pattern: isMenuOpen ref + useScrollLock + route watcher for auto-close'
  - 'Footer mobile reorder: CSS order classes with breakpoint prefixes'

# Metrics
duration: 7min
completed: 2026-02-22
---

# Phase 1 Plan 2: UI Components & Layout Shell Summary

**Responsive site shell with sticky compressing header (5 nav items + phone + waldhonig CTA), mobile hamburger with "Menu" label, 4-column footer with CTA bar, and 4 base UI components (Button/Card/Badge/Icon)**

## Performance

- **Duration:** ~7 min
- **Started:** 2026-02-21T23:57:59Z
- **Completed:** 2026-02-22T00:05:16Z
- **Tasks:** 3
- **Files modified:** 11

## Accomplishments

- Complete responsive layout shell visible on every page via default.vue layout
- Sticky header with smooth scroll compression (80px to 64px), desktop nav + phone tel: link + CTA, mobile hamburger with "Menu" text label
- 4-column footer with above-footer waldhonig CTA bar, contact info, navigation links, legal links + cookie settings button, copyright bar
- 4 reusable base UI components (BaseButton, BaseCard, BaseBadge, BaseIcon) with consistent 8px radius and 48px+ touch targets
- Mobile footer reorders: Contact first (phone prominent for 50-60 age audience), then Nav, Brand, Legal
- All contact info sourced from app.config.ts via useAppConfig()

## Task Commits

Each task was committed atomically:

1. **Task 1: Base UI components and scroll composable** - `7edc405` (feat)
2. **Task 2: AppHeader with sticky compression and mobile hamburger** - `aea5579` (feat)
3. **Task 3: AppFooter with CTA bar, 4-column layout, and default layout** - `a161758` (feat)

## Files Created/Modified

- `app/components/ui/BaseButton.vue` - Reusable button with primary/secondary/outline variants, sm/md/lg sizes, NuxtLink support
- `app/components/ui/BaseCard.vue` - Card wrapper with 8px radius, no shadow, optional padding
- `app/components/ui/BaseBadge.vue` - Small badge/tag component with sage/waldhonig/neutral variants
- `app/components/ui/BaseIcon.vue` - Lightweight SVG wrapper (no icon library dependency)
- `app/components/AppHeader.vue` - Sticky header with scroll compression, desktop nav, mobile hamburger menu
- `app/components/AppFooter.vue` - 4-column footer with CTA bar, contact, nav, legal, copyright
- `app/composables/useScrollHeader.ts` - Reactive scroll-aware header compression composable
- `app/layouts/default.vue` - Default layout wrapping pages with header + main + footer
- `app/app.config.ts` - Updated nav labels with proper German umlauts, address with Strasse umlaut
- `app/assets/css/main.css` - Fixed --radius-lg to 0.5rem (8px) matching DSGN-01 spec
- `app/pages/index.vue` - Updated with component demos and scroll content for testing

## Decisions Made

- **--radius-lg fix:** Changed from 0.75rem (12px) to 0.5rem (8px) to match the DSGN-01 design specification of consistent 8px border radius across all components. This corrects the value set in Plan 01-01.
- **useScrollLock API:** VueUse's `useScrollLock` returns a `WritableComputedRef<boolean>`, not accepting a reactive ref as second argument. Used `watch` on `isMenuOpen` to sync the lock state.
- **German umlauts in config:** Updated nav labels and address to use proper UTF-8 German characters for correct display, while keeping ASCII URL paths.
- **Dynamic copyright year:** Used `new Date().getFullYear()` instead of hardcoded year for automatic updates.
- **Cookie button placeholder:** Rendered Cookie-Einstellungen as a `<button>` with `data-cookie-settings` attribute rather than a link, ready for Plan 01-03 to wire up the consent panel.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed --radius-lg design token value**

- **Found during:** Task 1 (Base UI components)
- **Issue:** `--radius-lg` was set to 0.75rem (12px) in Plan 01-01, but DSGN-01 specifies consistent 8px border radius. Plan 01-02 uses `rounded-lg` expecting 8px.
- **Fix:** Changed `--radius-lg: 0.75rem` to `--radius-lg: 0.5rem` and adjusted `--radius-md: 0.375rem`
- **Files modified:** app/assets/css/main.css
- **Verification:** Components render with correct 8px radius
- **Committed in:** 7edc405 (Task 1 commit)

**2. [Rule 1 - Bug] Fixed useScrollLock type mismatch**

- **Found during:** Task 2 (AppHeader)
- **Issue:** `useScrollLock(document.body, isMenuOpen)` passed a `Ref<boolean>` where VueUse expects a plain `boolean` for `initialState` parameter. TypeScript error TS2345.
- **Fix:** Used the returned `WritableComputedRef` from `useScrollLock()` and synced it via `watch` on `isMenuOpen`
- **Files modified:** app/components/AppHeader.vue
- **Verification:** `make typecheck` passes with 0 errors
- **Committed in:** aea5579 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (2 bugs)
**Impact on plan:** Both fixes necessary for correct behavior and type safety. No scope creep.

## Issues Encountered

None - all tasks completed without significant problems.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Complete site shell ready: every page wrapped in header + footer via default layout
- Base UI components available for legal pages (Plan 01-03) and all future phases
- Footer Cookie-Einstellungen button ready for Plan 01-03 consent system wiring
- All design token classes (sage, waldhonig, charcoal, font-serif, font-sans) verified working in components
- app.config.ts nav and contact data driving header/footer content, ready for future pages

---

_Phase: 01-foundation-legal-compliance_
_Completed: 2026-02-22_
