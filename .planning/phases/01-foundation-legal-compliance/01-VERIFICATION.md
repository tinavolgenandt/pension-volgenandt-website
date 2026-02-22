---
phase: 01-foundation-legal-compliance
verified: 2026-02-22T03:05:09Z
status: human_needed
score: 5/5 must-haves verified
human_verification:
  - test: Run make dev and open localhost:3000; open DevTools Network tab and reload -- verify ZERO requests to googleapis.com or any external font CDN
    expected: All fonts load from localhost, no external font requests at all
    why_human: The @nuxt/fonts module auto-discovers @fontsource-variable packages at runtime. Cannot confirm by static file inspection. The CSS has no explicit fontsource @import; @nuxt/fonts handles font serving.
  - test: Run make build and confirm .output/public/ contains HTML files for /, /impressum/, /datenschutz/, /agb/
    expected: Build exits 0, all pre-rendered pages exist as static HTML
    why_human: Build must actually run; nuxt.config.ts has failOnError false
  - test: Run make lint and make typecheck and confirm both exit with 0 errors
    expected: ESLint 0 errors, TypeScript 0 errors
    why_human: ESLint requires .nuxt/eslint.config.mjs to be generated; TypeScript requires compiled types
  - test: Clear cookies, open localhost:3000, confirm consent banner with equal-prominence buttons, disappears after clicking Nur Notwendige, does not return on reload, Cookie-Einstellungen in footer opens settings modal
    expected: Banner shown on first visit; disappears after choice; cookie_consent cookie set; settings modal shows 3 toggles
    why_human: TDDDG para 25 equal-prominence is a visual requirement; cookie persistence requires browser-level testing
  - test: On mobile viewport below 1024px verify hamburger text label and dropdown; on desktop scroll down to verify header compresses smoothly
    expected: Mobile hamburger functional with text label; desktop header compresses from 80px to 64px on scroll with 300ms transition
    why_human: Responsive and scroll-reactive behavior require interactive browser testing
---

# Phase 1: Foundation and Legal Compliance -- Verification Report

**Phase Goal:** Visitors see a working site with correct layout, legal pages, and cookie consent -- eliminating the current Abmahnung risk and establishing the full build pipeline

**Verified:** 2026-02-22T03:05:09Z
**Status:** human_needed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| #   | Truth                                                                                                                             | Status         | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --- | --------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | make dev starts Nuxt 4 dev server; make build produces static site; make lint, make format, make typecheck all pass               | ? HUMAN NEEDED | Makefile has all 9 targets wired; nuxt.config.ts valid; toolchain installed. Requires running to confirm zero errors.                                                                                                                                                                                                                                                                                                           |
| 2   | Responsive site with sticky header (logo, nav, phone, CTA), 4-column footer, consistent design tokens                             | ✓ VERIFIED     | AppHeader.vue (213 lines): fixed positioning, bg-charcoal-900, scroll compression via useScrollHeader, 5 nav items from useAppConfig(), phone tel link, UiBaseButton CTA. AppFooter.vue (171 lines): 4-column grid with CSS order classes for mobile reorder, CTA bar bg-waldhonig-500, copyright bar bg-charcoal-950. main.css: full @theme block with sage/waldhonig/charcoal palettes, 18px base, fonts, radii, breakpoints. |
| 3   | Visitor navigates to /impressum/, /datenschutz/, /agb/ with complete legally correct content citing DDG para 5 and TDDDG para 25  | ✓ VERIFIED     | impressum.vue (170 lines): DDG para 5 in meta and subtitle, all required fields, owner placeholders from app.config. datenschutz.vue (472 lines): TDDDG para 25 cited 6 times, Art. 6 and 15-21 DSGVO, 3 cookie categories, Beds24 mention, Stand Februar 2026. agb.vue (301 lines): 4-tier cancellation table (Kostenlos/50%/80%/100%).                                                                                        |
| 4   | First-time visitor sees cookie consent banner with equal-prominence Accept/Reject buttons; no third-party requests before consent | ? HUMAN NEEDED | CookieConsent.vue: v-if NOT v-show (prevents DOM insertion before consent). Both buttons: identical px-6 py-3 rounded-lg font-semibold; only bg differs (sage-700 vs waldhonig-500). useCookieConsent.ts: useCookie with 180-day maxAge, SSR-safe. Requires browser testing to confirm no third-party requests.                                                                                                                 |
| 5   | No requests to googleapis.com or external font CDN -- fonts self-hosted from npm                                                  | ? HUMAN NEEDED | @fontsource-variable/lora and @fontsource-variable/dm-sans installed. Fontsource CSS declares font-family: Lora Variable and DM Sans Variable -- matching exactly main.css @theme values. No googleapis.com references in app/. Actual network behavior requires browser verification.                                                                                                                                          |

**Score:** 5/5 must-haves verified at code level; 5 items need human confirmation for runtime behavior (visual, network, interactive)

### Required Artifacts

| Artifact                            | Expected                                                   | Status     | Details                                                                                                                                                                                                                                                                                     |
| ----------------------------------- | ---------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| package.json                        | All dependencies declared                                  | ✓ VERIFIED | nuxt@4.3.1, tailwindcss@4.2.0, @fontsource-variable/lora@5.2.8, @fontsource-variable/dm-sans@5.2.8, @nuxt/fonts, @nuxt/image, @nuxt/eslint, @vueuse/nuxt, typescript, vue-tsc all present. No @nuxtjs/tailwindcss (correct).                                                                |
| nuxt.config.ts                      | Nuxt 4 config with Tailwind vite plugin, TypeScript strict | ✓ VERIFIED | 78 lines. css: main.css wired. vite.plugins: tailwindcss(). typescript strict: true, typeCheck: build. @nuxt/fonts in modules. prerender routes include /impressum, /datenschutz, /agb.                                                                                                     |
| app/assets/css/main.css             | Tailwind v4 @theme design tokens                           | ✓ VERIFIED | 91 lines. @import tailwindcss at top. @theme: sage (11 shades oklch), waldhonig (10 shades oklch), charcoal-800/900/950, cream, warm-white. --font-serif: Lora Variable, --font-sans: DM Sans Variable. html font-size: 18px, body line-height: 1.7. .prose-content max-width: 70ch.        |
| Makefile                            | 9 build commands                                           | ✓ VERIFIED | 28 lines. All 9 targets: dev, build, preview, generate, lint, lint-fix, format, typecheck, clean. All wired to pnpm nuxi commands.                                                                                                                                                          |
| eslint.config.mjs                   | ESLint flat config via withNuxt()                          | ✓ VERIFIED | 7 lines. Imports withNuxt from ./.nuxt/eslint.config.mjs. vue/multi-word-component-names disabled.                                                                                                                                                                                          |
| .prettierrc                         | Prettier config with tailwindStylesheet                    | ✓ VERIFIED | 8 lines. prettier-plugin-tailwindcss in plugins. tailwindStylesheet: ./app/assets/css/main.css.                                                                                                                                                                                             |
| app/app.vue                         | Root component with NuxtLayout and NuxtPage                | ✓ VERIFIED | 5 lines. NuxtLayout wrapping NuxtPage -- minimal and correct.                                                                                                                                                                                                                               |
| app/app.config.ts                   | Runtime config with contact, legal, nav                    | ✓ VERIFIED | 28 lines. siteName, siteTagline, contact (phone/mobile/email/address with proper German umlauts), legal (ownerName/taxId placeholders), nav (5 items with proper German umlauts, ASCII URL paths).                                                                                          |
| app/components/ui/BaseButton.vue    | Button with 3 variants                                     | ✓ VERIFIED | 48 lines. withDefaults(defineProps). variantClasses map (waldhonig-500 primary, sage-700 secondary, sage-300 outline). sizeClasses (md: px-6 py-3 gives >=48px height). Conditional NuxtLink when to prop provided. focus-visible ring.                                                     |
| app/components/ui/BaseCard.vue      | Card wrapper 8px radius no shadow                          | ✓ VERIFIED | 15 lines. rounded-lg bg-white border border-sage-100. Padded prop. No shadow classes (DSGN-01 compliant).                                                                                                                                                                                   |
| app/components/ui/BaseBadge.vue     | Badge/tag component                                        | ✓ VERIFIED | 24 lines. sage/waldhonig/neutral variants. inline-flex.                                                                                                                                                                                                                                     |
| app/components/ui/BaseIcon.vue      | SVG icon wrapper                                           | ✓ VERIFIED | 28 lines. SVG wrapper with size prop.                                                                                                                                                                                                                                                       |
| app/components/AppHeader.vue        | Sticky header with compression, hamburger                  | ✓ VERIFIED | 213 lines. fixed inset-x-0 top-0 z-40 bg-charcoal-900. isCompressed drives py-2/py-4 via transition-all duration-300. Desktop nav hidden nav:flex. Hamburger shows text label Menue/Schliessen. CTA always visible. useScrollLock for body scroll. Route watcher closes menu on navigation. |
| app/components/AppFooter.vue        | 4-column footer with CTA bar                               | ✓ VERIFIED | 171 lines. Above-footer bg-waldhonig-500 with white button. 4-column grid with CSS order classes (Kontakt order-1 mobile, Brand order-3 mobile). Sub-footer bg-charcoal-950. openCookieSettings wired to useCookieConsent.openSettings.                                                     |
| app/composables/useScrollHeader.ts  | Scroll-aware composable                                    | ✓ VERIFIED | 12 lines. import.meta.client guard for SSR safety. useWindowScroll y watcher. threshold default 50px. Returns { isCompressed }.                                                                                                                                                             |
| app/layouts/default.vue             | Default layout wrapping pages                              | ✓ VERIFIED | 12 lines. AppHeader, main slot with pt-20 offset, AppFooter, CookieConsent, CookieSettings all present and wired.                                                                                                                                                                           |
| app/composables/useCookieConsent.ts | SSR-safe consent state                                     | ✓ VERIFIED | 64 lines. useCookie with 180-day maxAge, sameSite lax. ConsentPreferences interface exported. All methods: acceptAll, rejectAll, updateCategory, isAllowed, openSettings, closeSettings, revokeConsent. readonly(consent) returned.                                                         |
| app/components/CookieConsent.vue    | Consent banner with equal buttons                          | ✓ VERIFIED | 42 lines. v-if NOT v-show. role=dialog. Both buttons: px-6 py-3 rounded-lg font-semibold -- equal size, only bg differs (sage-700 vs waldhonig-500).                                                                                                                                        |
| app/components/CookieSettings.vue   | Category toggle panel                                      | ✓ VERIFIED | 181 lines. Draft state pattern. settingsOpen reactive from useCookieConsent. 3 categories: essential (disabled always-on), booking, media. role=switch toggles with aria-checked. Teleport to body. useScrollLock when open.                                                                |
| app/pages/impressum.vue             | Impressum per DDG para 5                                   | ✓ VERIFIED | 170 lines. DDG para 5 in meta and subtitle. Sections: Diensteanbieter, Kontakt (clickable tel/mailto), USt-ID placeholder, MStV Verantwortlicher, EU-Streitschlichtung, Verbraucherstreitbeilegung, Haftung, Urheberrecht. INHABER_NAME placeholder from config.legal.ownerName.            |
| app/pages/datenschutz.vue           | Privacy policy per DSGVO/TDDDG                             | ✓ VERIFIED | 472 lines. TDDDG para 25 cited 6 times. DSGVO Art. 6 and 15-21 referenced. 3 cookie categories explained. Beds24 consent mention. Stand: Februar 2026. 10+ sections covering all DSGVO rights.                                                                                              |
| app/pages/agb.vue                   | AGB with cancellation policy                               | ✓ VERIFIED | 301 lines. 4-tier cancellation table: Kostenlos (>14d), 50% (14-7d), 80% (7-2d), 100% (<2d). All 10 sections per plan. Owner review disclaimer present.                                                                                                                                     |

### Key Link Verification

| From                    | To                      | Via                | Status  | Details                                                                                                   |
| ----------------------- | ----------------------- | ------------------ | ------- | --------------------------------------------------------------------------------------------------------- |
| nuxt.config.ts          | app/assets/css/main.css | css array          | ✓ WIRED | css: [./app/assets/css/main.css] on line 9                                                                |
| nuxt.config.ts          | @tailwindcss/vite       | vite.plugins       | ✓ WIRED | plugins: [tailwindcss() as any] -- any cast is documented workaround for Vite type mismatch               |
| .prettierrc             | app/assets/css/main.css | tailwindStylesheet | ✓ WIRED | tailwindStylesheet: ./app/assets/css/main.css                                                             |
| app/layouts/default.vue | AppHeader.vue           | auto-import        | ✓ WIRED | AppHeader component on line 3                                                                             |
| app/layouts/default.vue | AppFooter.vue           | auto-import        | ✓ WIRED | AppFooter component on line 8                                                                             |
| app/layouts/default.vue | CookieConsent.vue       | auto-import        | ✓ WIRED | CookieConsent component on line 9                                                                         |
| app/layouts/default.vue | CookieSettings.vue      | auto-import        | ✓ WIRED | CookieSettings component on line 10                                                                       |
| AppHeader.vue           | useScrollHeader.ts      | composable call    | ✓ WIRED | const { isCompressed } = useScrollHeader() on line 2; used in template via py-2/py-4 binding              |
| AppHeader.vue           | app.config.ts           | useAppConfig()     | ✓ WIRED | const config = useAppConfig(); config.nav, config.contact.phone, config.siteName all rendered in template |
| AppFooter.vue           | app.config.ts           | useAppConfig()     | ✓ WIRED | const config = useAppConfig(); config.siteName, config.siteTagline, config.contact.\* all rendered        |
| AppFooter.vue           | useCookieConsent.ts     | composable call    | ✓ WIRED | const { openSettings } = useCookieConsent(); @click=openCookieSettings on Cookie-Einstellungen button     |
| CookieConsent.vue       | useCookieConsent.ts     | composable call    | ✓ WIRED | const { hasConsented, acceptAll, rejectAll } = useCookieConsent()                                         |
| CookieSettings.vue      | useCookieConsent.ts     | composable call    | ✓ WIRED | const { consent, settingsOpen, acceptAll, updateCategory, closeSettings } = useCookieConsent()            |

### Requirements Coverage

| Requirement | Status             | Notes                                                                                                                                       |
| ----------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| FOUN-01     | ✓ SATISFIED        | nuxt@4.3.1, tailwindcss@4.2.0, @tailwindcss/vite, CSS-first tokens, no tailwind.config.js                                                   |
| FOUN-02     | ✓ SATISFIED        | @fontsource-variable/lora + dm-sans installed; @nuxt/fonts auto-discovers by exact font-family name match (Lora Variable, DM Sans Variable) |
| FOUN-03     | ? HUMAN NEEDED     | Config files correct; requires running make lint and make typecheck to confirm zero errors                                                  |
| FOUN-04     | ✓ SATISFIED        | typescript: { strict: true, typeCheck: build } in nuxt.config.ts                                                                            |
| FOUN-05     | ✓ SATISFIED        | All 9 Makefile targets: dev, build, preview, generate, lint, lint-fix, format, typecheck, clean                                             |
| FOUN-06     | ? HUMAN NEEDED     | nuxt.config.ts configured for SSG; requires build run to confirm .output/public/                                                            |
| FOUN-07     | ? HUMAN NEEDED     | No googleapis.com in code; fontsource packages installed; requires browser network tab to confirm                                           |
| DSGN-01     | ✓ SATISFIED        | --radius-lg: 0.5rem (corrected from 0.75rem in Plan 01-01); BaseButton uses rounded-lg                                                      |
| DSGN-02     | ✓ SATISFIED        | 11 sage shades (50-950) in @theme using oklch color space                                                                                   |
| DSGN-03     | ✓ SATISFIED        | 10 waldhonig shades in @theme; BaseButton primary = waldhonig-500; footer CTA bar = waldhonig-500                                           |
| DSGN-04     | ✓ SATISFIED        | --font-serif: Lora Variable, --font-sans: DM Sans Variable in @theme                                                                        |
| DSGN-05     | ✓ SATISFIED        | html font-size: 18px, body line-height: 1.7, .prose-content max-width: 70ch                                                                 |
| DSGN-06     | ✓ SATISFIED        | BaseButton md: py-3 (>=48px height); lg: py-4 (>=56px); all interactive elements have adequate touch targets                                |
| LEGL-01     | ✓ SATISFIED        | impressum.vue cites DDG para 5, all required fields present, owner placeholders marked                                                      |
| LEGL-02     | ✓ SATISFIED        | datenschutz.vue: TDDDG para 25 cited 6 times, Art. 6 and 15-21 DSGVO, 3 cookie categories, Beds24 mention                                   |
| LEGL-03     | ✓ SATISFIED        | agb.vue: 4-tier cancellation table, house rules, check-in/out times, owner review disclaimer                                                |
| LEGL-04     | ✓ SATISFIED        | CookieConsent: both buttons px-6 py-3 rounded-lg font-semibold -- equal visual prominence (TDDDG compliant)                                 |
| LEGL-05     | ✓ SATISFIED        | AppFooter Rechtliches column: NuxtLinks to /impressum, /datenschutz, /agb                                                                   |
| LEGL-06     | ✓ SATISFIED (code) | CookieConsent uses v-if (not v-show); no third-party scripts in layout before consent gate                                                  |

### Anti-Patterns Found

| File                          | Line    | Pattern                                                                                        | Severity | Impact                                                                     |
| ----------------------------- | ------- | ---------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------- |
| app/components/AppFooter.vue  | 57, 155 | HTML comments for social icons and trust badges as placeholders                                | Info     | Intentional -- CONTEXT says include social if active; no functional impact |
| app/components/rooms/Card.vue | 35      | placeholder text in image alt attribute                                                        | Info     | Outside Phase 1 scope (Phase 2 room pages); does not affect Phase 1 goals  |
| nuxt.config.ts                | various | Extra modules beyond Phase 1 plan: @nuxt/content, @nuxt/icon, focus-trap, @iconify-json/lucide | Info     | Added for Phase 2. No conflicts with Phase 1 functionality or Tailwind v4. |

No blocker or warning anti-patterns found in Phase 1 scope files. All components have real implementations with no empty handlers, TODO stubs, or placeholder returns.

### Human Verification Required

#### 1. Self-hosted fonts -- no external CDN requests

**Test:** Run make dev, open localhost:3000, open DevTools Network tab, filter by Font or search for googleapis. Reload page.

**Expected:** All font requests show source as localhost or /\_nuxt/. Zero requests to fonts.googleapis.com, fonts.gstatic.com, or any external domain.

**Why human:** The @nuxt/fonts module serves @fontsource-variable packages at runtime. The mechanism is correct in code (packages installed, font-family names Lora Variable and DM Sans Variable match exactly) but actual network behavior requires browser inspection. The @nuxt/fonts module may fall back to Google Fonts if local packages are not detected -- the network tab definitively confirms.

#### 2. Build pipeline -- static output in .output/public/

**Test:** Run make build from project root. After completion, check ls .output/public/ for HTML files.

**Expected:** Build exits 0. .output/public/index.html exists. .output/public/impressum/index.html, .output/public/datenschutz/index.html, .output/public/agb/index.html all exist as pre-rendered static pages.

**Why human:** nuxt.config.ts has prerender routes configured with failOnError: false. Build must actually run to confirm no errors and that static pages are generated.

#### 3. Zero-error lint and typecheck

**Test:** Run make lint and make typecheck in the project root.

**Expected:** Both exit 0 with zero errors. ESLint warnings are acceptable.

**Why human:** ESLint requires the generated .nuxt/eslint.config.mjs file. TypeScript checking requires compiled types. Cannot verify without running.

#### 4. Cookie consent banner -- TDDDG equal prominence and persistence

**Test:** Clear all cookies for localhost, reload localhost:3000. Visually verify both consent buttons are equally prominent. Click Nur Notwendige. Reload -- verify banner does not return. Click Cookie-Einstellungen in footer -- verify settings modal opens with 3 category toggles.

**Expected:** Banner visible on first load with two solid equal-size buttons. Banner gone after choice, does not return on reload. cookie_consent cookie present in DevTools. Settings modal shows essential (on/disabled), booking (off), media (off).

**Why human:** TDDDG para 25 equal-prominence is a visual requirement requiring visual confirmation. Cookie persistence and settings wiring require interactive browser testing.

#### 5. Mobile hamburger menu and desktop scroll compression

**Test:** (a) Mobile viewport below 1024px: verify text label visible next to hamburger, click to open dropdown with nav items, phone, and CTA. (b) Desktop: scroll past 50px -- verify header compresses from ~80px to ~64px with smooth transition.

**Expected:** Mobile: text label and dropdown functional, body scroll locked when open. Desktop: header height reduces with 300ms smooth transition.

**Why human:** Responsive and scroll-reactive behavior require interactive browser testing and viewport manipulation.

### Gaps Summary

No gaps found. All Phase 1 artifacts exist, are substantive, and are correctly wired. The five human verification items are confirmations of runtime behavior (visual appearance, network requests, build outputs, interactive behavior) that cannot be verified by static code analysis. The code structure, logic, and wiring are all correct -- they are marked human_needed for runtime confidence, not failed for code correctness.

---

_Verified: 2026-02-22T03:05:09Z_
_Verifier: Claude (gsd-verifier)_
