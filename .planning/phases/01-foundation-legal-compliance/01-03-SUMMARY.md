---
phase: 01-foundation-legal-compliance
plan: 03
subsystem: legal/consent
tags:
  [
    cookie-consent,
    TDDDG,
    DDG,
    DSGVO,
    impressum,
    datenschutz,
    agb,
    useCookie,
    SSR-safe,
    legal-compliance,
  ]

# Dependency graph
requires:
  - phase: 01-foundation-legal-compliance/02
    provides: 'default.vue layout, AppFooter with Cookie-Einstellungen button placeholder, base UI components'
provides:
  - 'SSR-safe cookie consent composable (useCookieConsent) with useCookie persistence (180-day expiry)'
  - 'Bottom-bar consent banner with equal-prominence Accept/Reject buttons (TDDDG S25 compliant)'
  - 'Category settings panel with 3 toggles (essential always on, booking, media)'
  - 'Complete Impressum page per DDG S5 with owner placeholders'
  - 'Complete Datenschutzerklaerung per DSGVO/TDDDG S25'
  - 'Complete AGB with 4-tier cancellation policy for Beherbergungsbetrieb'
  - "Consent-gating architecture: isAllowed('booking') and isAllowed('media') for future phases"
affects:
  - "05-booking-integration (Beds24 widget uses isAllowed('booking') from consent composable)"
  - "03-homepage (YouTube/Maps embeds use isAllowed('media'))"
  - 'All pages (cookie banner shown via default.vue layout on every page)'

# Tech tracking
tech-stack:
  added: []
  patterns:
    - 'useCookie composable pattern: SSR-safe cookie state via Nuxt useCookie (not localStorage)'
    - "Consent-gating with v-if: third-party components wrapped in v-if='isAllowed(category)' to prevent any loading before consent"
    - 'Draft state pattern: CookieSettings uses local ref synced from cookie on open, saved on close'
    - 'Legal page pattern: useSeoMeta + prose-content class + Lora headings + DM Sans body at 70ch max'

key-files:
  created:
    - 'app/composables/useCookieConsent.ts'
    - 'app/components/CookieConsent.vue'
    - 'app/components/CookieSettings.vue'
    - 'app/pages/impressum.vue'
    - 'app/pages/datenschutz.vue'
    - 'app/pages/agb.vue'
  modified:
    - 'app/layouts/default.vue'
    - 'app/components/AppFooter.vue'

key-decisions:
  - 'Consent banner renders with v-if (not v-show) to prevent any third-party script loading before consent'
  - 'Draft state pattern in CookieSettings: local ref synced from cookie on open, written back on save/close'
  - 'Legal pages reference DDG S5 and TDDDG S25 (current German law, not outdated TMG/TTDSG)'
  - 'AGB includes owner review disclaimer -- must be reviewed before production launch'
  - 'Prerender routes added back to nuxt.config.ts for /impressum/, /datenschutz/, /agb/'

patterns-established:
  - 'Cookie consent composable: single useCookieConsent() provides accept/reject/update/isAllowed/openSettings/closeSettings'
  - "Consent-gating: wrap third-party components in v-if='isAllowed(category)' so zero requests occur before user grants consent"
  - 'Legal page structure: useSeoMeta + section-based content with H2 headings, prose-content wrapper for 70ch max width'
  - 'German legal text: proper umlauts, current law references (DDG, DSGVO, TDDDG), Stand date stamp'

# Metrics
duration: 12min
completed: 2026-02-22
---

# Phase 1 Plan 3: Cookie Consent & Legal Pages Summary

**SSR-safe cookie consent system with TDDDG S25-compliant equal-prominence banner, 3-category settings panel (essential/booking/media), and three complete German legal pages (Impressum per DDG S5, Datenschutz per DSGVO, AGB with 4-tier Stornierung)**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-02-22T00:15:00Z
- **Completed:** 2026-02-22T00:27:00Z
- **Tasks:** 3 (2 auto + 1 human-verify checkpoint)
- **Files modified:** 8

## Accomplishments

- Cookie consent composable using Nuxt `useCookie` for SSR-safe persistence (180-day expiry, no hydration mismatches)
- Bottom-bar consent banner with equal-prominence "Alle akzeptieren" and "Nur Notwendige" buttons (TDDDG S25 compliance -- both solid buttons, same size, same padding)
- Category settings panel accessible from footer "Cookie-Einstellungen" button with three toggle rows: essential (always on/disabled), booking (Beds24), media (YouTube/Maps)
- Complete Impressum page citing DDG S5 with contact details, EU-Streitschlichtung, and owner placeholders
- Comprehensive Datenschutzerklaerung covering DSGVO rights (Art. 15-21), TDDDG S25 cookie categories, Beds24 consent mention, hosting, SSL, and contact form processing
- AGB with standard Beherbergungsbetrieb terms: 4-tier cancellation policy (14d free, 14-7d 50%, 7-2d 80%, <2d 100%), check-in/check-out times, liability, house rules
- All legal pages pre-rendered at build time via nitro.prerender routes

## Task Commits

Each task was committed atomically:

1. **Task 1: Cookie consent composable, banner, and settings panel** - `591de4b` (feat)
2. **Task 2: Three legal pages (Impressum, Datenschutz, AGB)** - `d14dd4f` (feat)
3. **Task 3: Human verification checkpoint** - approved (no commit -- verification only)

## Files Created/Modified

- `app/composables/useCookieConsent.ts` - SSR-safe consent state with useCookie, accept/reject/update/isAllowed/openSettings/closeSettings
- `app/components/CookieConsent.vue` - Bottom-bar consent banner with v-if guard, equal-prominence Accept/Reject buttons
- `app/components/CookieSettings.vue` - Modal settings panel with 3 category toggles, draft state pattern, useScrollLock
- `app/pages/impressum.vue` - Complete Impressum per DDG S5 with owner placeholders
- `app/pages/datenschutz.vue` - Comprehensive Datenschutzerklaerung per DSGVO/TDDDG S25
- `app/pages/agb.vue` - Booking terms with 4-tier cancellation, check-in/out, liability, house rules
- `app/layouts/default.vue` - Updated to include CookieConsent and CookieSettings components
- `app/components/AppFooter.vue` - Wired Cookie-Einstellungen button to useCookieConsent().openSettings()

## Decisions Made

- **v-if over v-show for consent:** Consent banner and gated components use `v-if` so the DOM subtree does not exist before consent, preventing any third-party script loading (LEGL-06 requirement).
- **Draft state in CookieSettings:** Settings panel uses a local ref that syncs from the cookie when opened and writes back on save. This prevents partial/unsaved state from persisting if the user closes without saving.
- **DDG S5 and TDDDG S25 references:** Legal pages cite current German law (DDG replaced TMG; TDDDG S25 replaced TTDSG). This avoids citations to outdated legislation.
- **AGB owner review disclaimer:** AGB includes a clear "Diese AGB wurden als Vorlage erstellt und muessen vor Veroeffentlichung vom Betreiber geprueft werden" disclaimer since these are template terms.
- **Prerender routes:** Added /impressum/, /datenschutz/, /agb/ to nuxt.config.ts nitro.prerender.routes for static generation.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] nuxt.config.ts state conflict from external process**

- **Found during:** Task 1 (Cookie consent setup)
- **Issue:** An external process modified nuxt.config.ts during execution, creating a conflicting state
- **Fix:** Reverted to correct state and re-applied the needed changes (prerender routes)
- **Files modified:** nuxt.config.ts
- **Verification:** `make build` passes, legal pages pre-render correctly
- **Committed in:** 591de4b (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Minor -- config file conflict resolved immediately. No scope creep.

## Issues Encountered

None beyond the config file conflict noted above.

## User Setup Required

None - no external service configuration required. Owner placeholders in Impressum ([INHABER_NAME], [STEUERNUMMER]) and AGB must be filled before production launch.

## Next Phase Readiness

- **Phase 1 complete:** All three plans delivered -- scaffold, layout, consent, legal pages
- **Consent architecture ready for Phase 5:** `isAllowed('booking')` gate exists for Beds24 widget integration
- **Consent architecture ready for Phase 3:** `isAllowed('media')` gate exists for YouTube/Maps embeds
- **Legal pages live:** /impressum/, /datenschutz/, /agb/ accessible from footer and pre-rendered
- **Owner action needed before launch:** Fill INHABER_NAME and STEUERNUMMER placeholders in Impressum, review AGB terms

---

_Phase: 01-foundation-legal-compliance_
_Completed: 2026-02-22_
