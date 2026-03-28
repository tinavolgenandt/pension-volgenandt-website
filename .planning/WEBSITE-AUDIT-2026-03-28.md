# Pension Volgenandt Website - Comprehensive Audit Report

**Date:** 2026-03-28
**Auditor:** Senior Developer & UI/UX Designer Review
**Stack:** Nuxt 4 SSG + Tailwind CSS v4 + TypeScript + Nuxt Content v3

---

## Executive Summary

The Pension Volgenandt website is a well-architected Nuxt 4 SSG site with strong foundations: clean TypeScript, good component structure, proper SEO meta tags, Schema.org structured data, DSGVO-compliant cookie consent, and a cohesive sage-green design system. However, **critical performance issues** (primarily 627MB of unoptimized images) and several accessibility/SEO gaps prevent it from achieving the target 95+ Lighthouse scores.

### Overall Ratings (1-10 Scale)

| Category | Rating | Notes |
|----------|--------|-------|
| **Performance / Speed** | 3/10 | 627MB images folder, 109 files >1MB, no build-time optimization pipeline |
| **SEO** | 7/10 | Good meta tags + Schema.org, but missing some structured data types |
| **Accessibility** | 6/10 | Good ARIA basics, but gaps in forms, skip nav, live regions |
| **Design / UI/UX** | 8/10 | Cohesive design system, good visual hierarchy, minor mobile gaps |
| **Code Quality** | 8/10 | Clean TypeScript, good patterns, minor duplication |
| **Security / Legal** | 8/10 | DSGVO compliant, cookie consent correct, legal pages present |

---

## 1. PERFORMANCE & SPEED (Rating: 3/10)

### Critical: Image Optimization Crisis

This is the **single biggest issue** with the site. The `/public/img/` directory is **627MB**.

| Metric | Value |
|--------|-------|
| Total images | 276 (151 JPG + 125 WebP) |
| Images > 500KB | 122 files |
| Images > 1MB | 109 files |
| Images > 5MB | 38 files |
| Total oversized (>500KB) | 551MB |
| Largest files | 13MB each (baerenpark JPGs) |

**Worst offenders (13MB each):**
- `attractions/baerenpark-worbis.jpg`
- `attractions/baerenpark-baer-wald-fruehling.jpg`
- `attractions/baerenpark-baer-wald.jpg`

**Multiple 11MB files:**
- `rooms/rosengarten-bad-4.jpg`
- `garten/pension-eingang-sommer.jpg`
- `garten/garten-sitzecke-apfelbaum.jpg`
- `content/pension-eingang-sommer.jpg`
- `attractions/heiligenstadt-holzskulptur-wald.jpg`

**Impact:** These unoptimized images will cause:
- LCP (Largest Contentful Paint) > 10 seconds on 3G
- Massive bandwidth consumption for users
- GitHub Pages deployment sluggishness (repo size)
- Failed Lighthouse performance audits

### Recommendations: Image Optimization

1. **Build-time image pipeline (Priority: CRITICAL)**
   - Add `sharp` or `squoosh` build script to:
     - Convert ALL JPGs to WebP (80% quality = ~90% size reduction)
     - Generate AVIF variants (even smaller, 70% savings over WebP)
     - Resize to max 1920px wide (hero), 1200px (content), 800px (thumbnails)
     - Generate responsive srcsets (400w, 800w, 1200w, 1920w)
   - Expected result: 627MB -> ~30-50MB

2. **Immediate quick wins:**
   - Delete duplicate JPG originals where WebP versions already exist
   - All 38 files over 5MB need immediate reprocessing
   - Room/attraction hero images should be max 200-300KB as WebP

3. **`<NuxtImg>` configuration:**
   - Currently using a custom `static` provider that's just a pass-through
   - Consider using `ipx` provider for on-the-fly resizing during build
   - Add `width` and `height` to all `<NuxtImg>` to prevent CLS
   - Several `<NuxtImg>` components are missing explicit `width`/`height` (e.g., `nachhaltigkeit.vue` lines 132-138)

4. **Hero video optimization:**
   - hero.mp4 (682KB) and hero.webm (796KB) are already well-optimized
   - The poster + video crossfade pattern in `HeroVideo.vue` is excellent
   - Consider adding `preload="metadata"` instead of `preload="auto"` to reduce initial payload

### Other Performance Issues

5. **Font loading:**
   - Using `@nuxt/fonts` (good) with `@fontsource-variable` (good - self-hosted)
   - Consider adding `font-display: swap` explicitly if not already set by the module
   - Two variable fonts (DM Sans + Lora) is reasonable

6. **JavaScript bundle:**
   - Leaflet is loaded even on pages that don't use maps
   - `embla-carousel` is loaded on homepage even for users who don't interact with testimonials
   - Consider `defineAsyncComponent` for heavy components:
     - `<ContactDirectionsMap>` (Leaflet)
     - `<HomeLocationMap>` (Leaflet)
     - `<HomeTestimonials>` (Embla Carousel)
     - `<BookingBeds24Widget>` / `<BookingBeds24Calendar>` (already consent-gated, good)

7. **CSS:**
   - Leaflet CSS is imported globally in `main.css` line 1 - only needed on 2 pages
   - Consider dynamic import via the components that use it

8. **Prerendering:**
   - `nitro.prerender.crawlLinks: true` is good
   - But 53 explicit routes + crawl may cause slow builds
   - Consider removing explicit routes and relying solely on crawlLinks

---

## 2. SEO (Rating: 7/10)

### What's Done Well
- Every page has `useSeoMeta()` with title, ogTitle, description, ogDescription, ogImage
- Canonical URLs and hreflang="de" on all pages
- Schema.org `BedAndBreakfast` entity in `app.vue` with address, geo, amenities
- `HotelRoom` + `Product` + `Offer` structured data on room detail pages
- `FAQPage` structured data on contact page
- Sitemap auto-generated via `@nuxtjs/seo`
- robots.txt allows all
- `lang="de"` set on `<html>`
- BreadcrumbNav component present on subpages

### What's Missing

9. **Missing structured data types:**
   - No `BreadcrumbList` schema (the visual breadcrumb exists but no JSON-LD)
   - No `LocalBusiness` opening hours
   - No `AggregateRating` on the business entity (Google reviews)
   - No `ImageGallery` schema on room pages
   - No `Event` schema on news/aktuelles pages
   - Room `Offer` should include `availability` and `validFrom`/`validThrough` dates

10. **Meta tag gaps:**
    - No `twitter:card` / `twitter:site` meta tags (Twitter/X card support)
    - `og:locale` not set (should be `de_DE`)
    - No `og:site_name` set per-page
    - Missing `article:published_time` on news articles
    - No `geo.region` / `geo.placename` meta tags for local SEO

11. **Content SEO gaps:**
    - No `<h1>` on the homepage - the `<h1>` "Pension Volgenandt" is inside HeroVideo which is decorative. The `Welcome` section should have the primary keyword-rich h1
    - Several pages duplicate title/ogTitle and description/ogDescription (fine but wasteful)
    - News/Aktuelles articles don't have individual `useSchemaOrg` structured data
    - Attraction detail pages need `TouristAttraction` schema
    - The `titleTemplate` on homepage is `'%s'` (overrides global), but inner pages need a `titleTemplate: '%s | Pension Volgenandt'` pattern

12. **Technical SEO:**
    - `_robots.txt` in public (underscore prefix) - confirm it's being served correctly at `/robots.txt`
    - No `<link rel="preconnect">` for external domains (beds24.com, googletagmanager.com)
    - Missing `dns-prefetch` hints
    - Consider adding `sitemap` link in `<head>`

### SEO Recommendations (Prioritized)

| Priority | Action | Impact |
|----------|--------|--------|
| HIGH | Add BreadcrumbList JSON-LD schema | Rich results in SERP |
| HIGH | Add AggregateRating to BedAndBreakfast entity | Star ratings in SERP |
| HIGH | Add TouristAttraction schema to attraction pages | Rich results |
| HIGH | Set titleTemplate to `'%s | Pension Volgenandt'` for inner pages | Consistent branding |
| MEDIUM | Add twitter:card meta tags | Social sharing |
| MEDIUM | Add og:locale de_DE | Social sharing |
| MEDIUM | Add LocalBusiness openingHours | Knowledge panel |
| MEDIUM | Add Event schema to news articles | Event rich results |
| LOW | Add geo meta tags | Local SEO signal |
| LOW | Add preconnect hints | Minor perf boost |

---

## 3. ACCESSIBILITY (Rating: 6/10)

### What's Done Well
- `role="dialog"` and `aria-label` on cookie consent banner
- `aria-label` on all navigation elements ("Hauptnavigation", "Mobile Navigation")
- `aria-expanded` and `aria-controls` on hamburger menu
- `aria-hidden="true"` on decorative SVGs and icons
- Gallery buttons have `aria-label` with image descriptions
- Lightbox has `role="dialog"`, `aria-modal="true"`, focus trap, keyboard navigation (Escape, ArrowLeft/Right)
- `aria-live="polite"` on image counter in lightbox
- `prefers-reduced-motion` respected in HeroVideo (video hidden, animations disabled)
- `:focus-visible` global style with waldhonig-500 outline
- Touch swipe support in lightbox
- Star rating component (assumed accessible)

### Accessibility Issues

13. **Missing skip navigation link (WCAG 2.4.1)**
    - No "Skip to content" link at the top of the page
    - The fixed header + mobile menu means keyboard users must tab through all nav items on every page
    - **Fix:** Add `<a href="#main-content" class="sr-only focus:not-sr-only ...">Zum Inhalt springen</a>` before AppHeader, and `id="main-content"` on `<main>`

14. **Contact form accessibility gaps (WCAG 1.3.1, 3.3.1, 3.3.2):**
    - No `aria-required="true"` on required fields (relying only on HTML `required`)
    - No `aria-describedby` linking error messages to fields
    - Error message div (`v-if="errorMessage"`) has no `role="alert"` or `aria-live="assertive"` - screen readers won't announce errors
    - No per-field validation feedback (only a global error message)
    - Missing `autocomplete` attributes on name/email fields (`autocomplete="name"`, `autocomplete="email"`)
    - Honeypot field uses `style="display: none"` - should use `aria-hidden="true"` as well

15. **Cookie consent accessibility:**
    - No focus trap on cookie banner - keyboard users can tab past it
    - Banner should receive focus on appearance
    - No `aria-live` announcement when banner appears
    - "Nur Notwendige" button should be the first focusable element (currently "Datenschutzerklärung" link receives focus first)

16. **Map components:**
    - Maps are consent-gated (good), but the MapConsent component (blocking content) should explain what the map shows to screen reader users
    - No text alternative provided for the map content when consent is denied

17. **Image alt text:**
    - Generally excellent - all content images have descriptive German alt text
    - Some `<NuxtImg>` in shared components might receive empty alt if parent doesn't pass imageAlt prop
    - The desktop hero poster uses CSS `background-image` with no text alternative (the mobile version has alt text via `<NuxtImg>`)

18. **Heading hierarchy issues:**
    - Homepage: `<h1>` "Pension Volgenandt" in hero, then `<h2>` "Willkommen" etc. - acceptable but decorative h1 should be reconsidered
    - Footer has `<h3>` headings without a parent `<h2>` in the page structure
    - Some pages have section headings that skip levels (h2 -> h4)

19. **Color contrast:**
    - `text-sage-300` on `bg-charcoal-900` (header tagline, footer links) needs contrast verification
    - `text-sage-200` on `bg-charcoal-900` (navigation items) - borderline
    - `text-sage-600` text on white/cream backgrounds may be insufficient for small text (< 4.5:1)
    - Error message: `text-red-700` on `bg-red-50` should be verified

20. **Miscellaneous a11y:**
    - Carousel testimonials have no `aria-roledescription="carousel"` or `aria-label`
    - Carousel lacks live region to announce slide changes
    - No `<nav aria-label="Breadcrumb">` wrapper on breadcrumbs (check BreadcrumbNav component)
    - External links to Beds24 booking should have accessible indication they open in new tab (`aria-label` mentioning "opens in new window" or similar)

### Accessibility Recommendations

| Priority | Action | WCAG |
|----------|--------|------|
| HIGH | Add skip navigation link | 2.4.1 |
| HIGH | Add `role="alert"` to form error messages | 4.1.3 |
| HIGH | Add `autocomplete` to form fields | 1.3.5 |
| HIGH | Verify and fix color contrast ratios | 1.4.3 |
| MEDIUM | Add focus trap to cookie banner | 2.1.1 |
| MEDIUM | Add carousel ARIA attributes | 4.1.2 |
| MEDIUM | Add "opens in new window" to external links | - |
| LOW | Add `aria-describedby` field-error linking | 3.3.1 |
| LOW | Standardize heading hierarchy | 1.3.1 |

---

## 4. DESIGN & UI/UX (Rating: 8/10)

### What's Done Well
- **Design system:** Cohesive sage-green + waldhonig (forest honey amber) palette with OKLCH colors
- **Typography:** DM Sans (body) + Lora (headings) variable fonts - warm, professional, and legible
- **Visual hierarchy:** Clear section breaks with alternating bg-cream/bg-sage-50/white
- **Hero section:** Video background with poster fallback + smooth crossfade is premium
- **Room pages:** Well-structured gallery + pricing + amenities + booking flow
- **Mobile navigation:** Animated dropdown with scroll lock, equal-prominence CTA
- **Footer:** 4-column grid with smart mobile reordering (contact first on mobile)
- **CTAs:** Consistent waldhonig-500/600 amber buttons, good size (48px+ touch targets)
- **Reduced motion:** Respected in hero animations and video
- **Cookie consent:** Equal-prominence buttons per TDDDG (good legal compliance)

### Design Issues & Recommendations

21. **CTA consistency:**
    - Header "Jetzt buchen" links directly to beds24.com
    - Footer "Verfügbarkeit prüfen" links to /zimmer
    - Room page has "Jetzt buchen" next to price
    - **Inconsistent CTAs may confuse users about the booking flow**
    - **Recommendation:** Standardize the primary CTA journey. Homepage -> /zimmer -> room detail -> Beds24

22. **Mobile UX gaps:**
    - `pb-[28%]` on hero text content is a magic number that may not work on all viewport heights
    - Cookie banner on mobile (`p-3`) may crowd the hero content
    - No mobile-specific image sizes defined on several pages (using `sizes="100vw"` everywhere)

23. **Loading states:**
    - No skeleton/loading states for async content (rooms, testimonials, FAQ)
    - `useAsyncData` calls block rendering but no visual feedback
    - Gallery image loading has no placeholder/blur-up
    - **Recommendation:** Add `placeholder` prop to NuxtImg for blur-up effect

24. **Empty states:**
    - No fallback UI if room data fails to load (other than 404)
    - No fallback if testimonials are empty (the section just disappears)
    - FAQ section disappears silently if no items

25. **Scroll animations:**
    - `ScrollReveal` component wraps every homepage section
    - On slow connections, users may see blank areas that "pop in"
    - Consider IntersectionObserver threshold of 0.05 instead of 0.15 for earlier reveal
    - Consider `will-change: opacity, transform` for smoother animations

26. **Trust signals missing:**
    - No Google review score/badge on homepage
    - No DEHOGA rating badge
    - No "Verified by Beds24" or booking security badge
    - No guest count / years in business indicator
    - **For a pension targeting 50-60 age group, trust signals are critical**

27. **Print styles:**
    - No print stylesheet
    - Users may want to print directions, room details, or price lists
    - **Recommendation:** Add basic `@media print` styles (hide nav, footer CTA, fix images)

---

## 5. CODE QUALITY (Rating: 8/10)

### What's Done Well
- TypeScript strict mode enabled
- Clean Vue 3 Composition API with `<script setup>`
- Proper use of composables (`useCookieConsent`, `useScrollHeader`, `useGallery`, `useScrollReveal`)
- Smart consent-gating pattern for third-party integrations
- Good component decomposition (shared, ui, feature-specific)
- Content in YAML with Nuxt Content v3 collections
- Proper error handling in contact form
- Clean app.config.ts for centralized site configuration

### Code Issues

28. **Inline SVGs duplicated:**
    - Phone icon SVG is copy-pasted in AppHeader (2x) and AppFooter (2x)
    - Email icon SVG duplicated in AppFooter
    - **Recommendation:** Use `<Icon name="lucide:phone" />` consistently (already used elsewhere)

29. **Hardcoded Beds24 URLs:**
    - `https://beds24.com/booking2.php?propid=261258&lang=de&referer=Website&numnight=2&numadult=2` appears 3 times in AppHeader (desktop + mobile + mobile menu)
    - Should be centralized in `app.config.ts`

30. **Missing error boundaries:**
    - `error.vue` exists but not reviewed - should handle gracefully
    - No `<ErrorBoundary>` components wrapping critical sections

31. **Potential memory leak:**
    - `useScrollLock(document.body)` in AppHeader accesses `document` in setup but is guarded by `import.meta.client` - OK
    - `emblaApi.on('select', onSelect)` in Testimonials - no explicit cleanup (Embla may handle this internally)

32. **Type safety gaps:**
    - `amenityMap[a]?.label ?? a` in room detail page uses string indexing without type guard
    - Some `useAsyncData` return values are used without null checks (`faqData.value?.items ?? []` is good, but `room.value.name` after the null check could still have type issues)

---

## 6. SECURITY & LEGAL (Rating: 8/10)

### What's Done Well
- Cookie consent with granular categories (essential, booking, media, statistics)
- Equal-prominence Accept/Reject per TDDDG
- GA4 only loads after statistics consent
- Beds24 widgets only load after booking consent
- Maps only load after media consent
- No external font CDN requests
- Honeypot field for spam protection on contact form
- `rel="noopener"` on external links

### Issues

33. **Contact form:**
    - Sends data to `https://api.pension-volgenandt.de/send-mail.php` - ensure HTTPS, CSRF protection, and rate limiting on the backend
    - No CAPTCHA or client-side rate limiting
    - No Content-Security-Policy headers configured

34. **Missing security headers:**
    - No CSP, X-Frame-Options, X-Content-Type-Options visible in config
    - Should be set via Nitro or hosting platform (GitHub Pages has limited header support)
    - Consider Cloudflare or similar for security headers

35. **Cookie consent duration:**
    - 180 days is standard and compliant
    - Consider adding consent version tracking for re-consent when categories change

---

## Priority Action Plan

### Phase 6 - Optimization & Launch Checklist

#### P0 - Must Fix Before Launch (Week 1)

1. **Image optimization pipeline** - Convert all JPGs to WebP/AVIF, resize to max 1920px, generate srcsets. Expected: 627MB -> ~40MB
2. **Skip navigation link** - Add "Zum Inhalt springen"
3. **Form accessibility** - Add `role="alert"`, `autocomplete`, `aria-required`
4. **Color contrast audit** - Verify all sage/charcoal combinations meet WCAG AA

#### P1 - High Impact (Week 2)

5. **BreadcrumbList JSON-LD** - Add structured data for breadcrumbs
6. **AggregateRating schema** - Add Google review score to BedAndBreakfast entity
7. **TouristAttraction schema** - Add to attraction detail pages
8. **Lazy-load Leaflet** - Use `defineAsyncComponent` for map components
9. **Cookie banner focus trap** - Trap focus until user makes a choice
10. **Centralize Beds24 URL** - Move to app.config.ts

#### P2 - Medium Impact (Week 3)

11. **Twitter card meta tags** - Add og:locale, twitter:card
12. **NuxtImg width/height** - Add explicit dimensions to prevent CLS
13. **Trust signals** - Add Google review badge, years in business, guest count
14. **Print styles** - Basic print stylesheet
15. **Carousel a11y** - Add ARIA roledescription, live region
16. **Preconnect hints** - Add for beds24.com, googletagmanager.com

#### P3 - Nice to Have (Week 4)

17. **AVIF format** - Add as primary with WebP fallback
18. **Blur-up placeholders** - Add to NuxtImg
19. **Loading skeletons** - For async content
20. **Event schema** - On news articles
21. **Replace inline SVGs** - Use Icon component consistently
22. **Security headers** - CSP via hosting platform

---

## Lighthouse Score Estimates

### Current (estimated):
- Performance: **35-45** (massive images destroy this)
- Accessibility: **75-80** (good basics, missing skip nav + form issues)
- Best Practices: **80-85** (good overall)
- SEO: **85-90** (meta tags present, missing some structured data)

### After P0+P1 fixes (estimated):
- Performance: **85-95** (images optimized, lazy loading)
- Accessibility: **90-95** (all WCAG AA issues addressed)
- Best Practices: **90-95**
- SEO: **95-100** (full structured data)

---

## Technical Debt Summary

| Area | Debt Level | Notes |
|------|-----------|-------|
| Images | CRITICAL | 627MB, needs full pipeline |
| SEO Schema | LOW | Missing a few types, easy to add |
| Accessibility | MEDIUM | Skip nav + form fixes needed |
| Code duplication | LOW | SVGs + Beds24 URL |
| Bundle size | LOW | Leaflet loaded globally |
| Testing | HIGH | No tests found (unit/e2e) |
| CI/CD | LOW | GitHub Actions present but review needed |

---

## Comparison to Industry Best Practices

### Hotel/Pension Website Standards (2025-2026)

| Standard | Status | Gap |
|----------|--------|-----|
| Core Web Vitals (LCP < 2.5s) | FAIL | Images need optimization |
| Core Web Vitals (CLS < 0.1) | AT RISK | Missing width/height on some images |
| Core Web Vitals (INP < 200ms) | LIKELY PASS | SSG with minimal JS |
| Schema.org LodgingBusiness | PASS | BedAndBreakfast implemented |
| Schema.org HotelRoom + Offer | PASS | With pricing |
| WCAG 2.2 AA | PARTIAL | ~80% compliant |
| DSGVO/TDDDG Cookie Consent | PASS | Equal prominence, granular consent |
| Mobile-first responsive | PASS | Tailwind responsive, mobile nav |
| Self-hosted fonts | PASS | @fontsource-variable |
| Structured booking flow | PARTIAL | Beds24 integration present but UX could be smoother |
| Google Business Profile link | MISSING | No link to or from GBP |
| Social proof / reviews | PARTIAL | Testimonials carousel, no live review score |
| Multilingual | N/A | German-only by design (v1.0 scope) |

---

---

## 7. ADDITIONAL FINDINGS FROM DEEP ANALYSIS

### Image Asset Breakdown by Directory

| Directory | Size |
|---|---|
| attractions/ | 231 MB |
| garten/ | 228 MB |
| source-uploads/ | 79 MB |
| rooms/ | 55 MB |
| content/ | 30 MB |
| **TOTAL img/** | **627 MB** |

**Key discovery:** `/public/img/source-uploads/` (79 MB) contains raw upload originals that **should not be deployed to production at all**. Also, `pension-eingang-sommer.jpg` exists in BOTH `/img/content/` and `/img/garten/` (11 MB each = 22 MB duplicated).

### NuxtImage Provider Is a No-Op

The custom `static` image provider (`app/providers/static.ts`) does **zero image processing** - no resizing, no format conversion, no quality reduction. It simply prepends the base URL. This means `<NuxtImg>` provides no optimization whatsoever; the raw JPGs are served as-is. The `sizes` attributes on `<NuxtImg>` components are decorative - they generate `srcset` but all point to the same unprocessed original.

### Missing Structured Data (Agent-Confirmed)

| Schema Type | Where to Add | Priority | Status |
|---|---|---|---|
| `BedAndBreakfast` | `app.vue` (global) | Critical | DONE |
| `HotelRoom` + `Product` + `Offer` | `zimmer/[slug].vue` | Critical | DONE |
| `FAQPage` + `Question` | `kontakt.vue` | High | DONE |
| `BreadcrumbList` | Auto via `@nuxtjs/seo` | High | DONE (via definePageMeta) |
| `TouristAttraction` | `ausflugsziele/[slug].vue` | **High** | MISSING |
| `Article` / `NewsArticle` | `aktuelles/[slug].vue` | **High** | MISSING |
| `WebSite` | `index.vue` or `app.vue` | Medium | MISSING |
| `ItemList` (rooms) | `zimmer/index.vue` | Medium | MISSING |
| `ItemList` (attractions) | `ausflugsziele/index.vue` | Medium | MISSING |
| `AggregateRating` | `app.vue` BedAndBreakfast | **High** | MISSING |
| `ContactPage` | `kontakt.vue` | Low | MISSING |

### WCAG 2.2 Level A Failures (Must Fix)

1. **No skip navigation link** (WCAG 2.4.1) - `app/layouts/default.vue`
2. **No `role="alert"` on form error messages** (WCAG 4.1.3) - `contact/Form.vue` line 105, `picknick/BookingForm.vue` line 300
3. **Cookie consent banner has no focus management** (WCAG 2.4.3) - `CookieConsent.vue`

### Legal Update: DDG Section 5

The best practices research agent found that the German Impressum is now governed by **DDG Section 5** (not TMG) since May 2024. The site references DDG §5 in planning docs - verify the actual Impressum page content is updated. Also: the **Cookie Consent Control Ordinance** took effect April 2025 - verify compliance.

### Nuxt 4 Performance Opportunity: Lazy Hydration

Nuxt 4's built-in lazy hydration directives (`hydrate-on-visible`, `hydrate-on-idle`, `hydrate-on-interaction`) can reduce JS significantly. Static content like legal pages and attraction cards could become `.server.vue` components for **zero client JS** (up to 83% less JavaScript reported in benchmarks).

### Beds24 URL Centralization

The Beds24 booking URL `https://beds24.com/booking2.php?propid=261258&lang=de&referer=Website&numnight=2&numadult=2` is hardcoded in 3 places in `AppHeader.vue`. Both the architecture and SEO agents flagged this. Should be extracted to `app.config.ts`.

### Room YAML Files Missing SEO Fields

Unlike attraction YAML files (which have `seoTitle` and `seoDescription`), room YAML files lack dedicated SEO fields. This limits per-room SEO control in SERPs.

### Carousel Autoplay + Reduced Motion

The Embla carousel in `Testimonials.vue` auto-advances every 6 seconds but does NOT check `prefers-reduced-motion`. It should pause autoplay for users who prefer reduced motion.

### Potential ogImage Path Issue

`zimmer/index.vue` may reference a broken ogImage path `/img/rooms/emils-kuhwiese/hero.webp` - the actual file naming pattern is `/img/rooms/emils-kuhwiese-schlafzimmer-2.webp`. Verify this resolves.

---

## 8. COMPLETE QUICK WINS (Highest ROI, Lowest Effort)

1. **Add `twitterCard: 'summary_large_image'`** globally in `app.vue` - 1 line, covers all pages
2. **Add skip nav link** - 2 lines in `default.vue` + 1 id attribute on `<main>`
3. **Add `role="alert"` to error messages** - 1 attribute in 2 form components
4. **Add `autocomplete` to form fields** - 3 attributes in contact form
5. **Set global `titleTemplate: '%s | Pension Volgenandt'`** in nuxt.config.ts
6. **Delete `source-uploads/` directory** from public - saves 79 MB immediately
7. **Centralize Beds24 URL** in app.config.ts
8. **Add `seoTitle`/`seoDescription`** fields to room YAML files
9. **Add canonical URLs** to 3 legal pages (impressum, datenschutz, agb)
10. **Verify ogImage path** on zimmer/index.vue

---

*Generated by comprehensive code review, static analysis, architecture audit, and 6 parallel specialized agents (code architecture, image assets, best practices research, build analysis, SEO audit, accessibility & design). All findings reference the repository as of 2026-03-28.*
