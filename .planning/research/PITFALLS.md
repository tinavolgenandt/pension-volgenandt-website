# Domain Pitfalls: Nuxt 3 SSG Pension Website

**Project:** Pension Volgenandt Website Redesign
**Domain:** Hospitality -- German pension/guesthouse, SSG static site
**Researched:** 2026-02-21
**Overall confidence:** HIGH (verified against official docs, GitHub issues, and current community reports)

---

## Critical Pitfalls

Mistakes that cause rewrites, legal liability, or major rework. Address these during the phase indicated.

---

### CP1: Using @nuxtjs/tailwindcss Module with Tailwind CSS v4

**Phase:** 1 (Foundation / Scaffolding)
**Confidence:** HIGH -- verified against [Tailwind CSS v4 Nuxt installation guide](https://tailwindcss.com/docs/installation/framework-guides/nuxt) and [multiple GitHub discussions](https://github.com/tailwindlabs/tailwindcss/discussions/16236)

**What goes wrong:** The `@nuxtjs/tailwindcss` Nuxt module is designed for Tailwind v3 and uses the JavaScript config approach. Installing it alongside Tailwind v4 causes silent CSS failures, missing utility classes, or outright build errors. The module is not needed and will cause conflicts because Tailwind v4 uses `@tailwindcss/vite` as a Vite plugin, not a Nuxt module.

**Why it happens:** Developers familiar with Tailwind v3 in Nuxt instinctively install `@nuxtjs/tailwindcss`. Tutorials and AI-generated code often suggest this module. The naming makes it feel like the "official" way to use Tailwind in Nuxt.

**Consequences:**

- Styles silently fail to apply -- classes exist but produce no CSS
- Build succeeds but the site looks unstyled or partially styled
- Confusing error messages about conflicting PostCSS plugins
- Hours of debugging before realizing the module itself is the problem

**Prevention:**

1. Do NOT install `@nuxtjs/tailwindcss` at all
2. Install `@tailwindcss/vite` and `tailwindcss` as dependencies
3. Add `@tailwindcss/vite` as a Vite plugin in `nuxt.config.ts`:
   ```typescript
   import tailwindcss from '@tailwindcss/vite'
   export default defineNuxtConfig({
     css: ['~/assets/css/main.css'],
     vite: { plugins: [tailwindcss()] },
   })
   ```
4. Use `@import "tailwindcss"` in your CSS file, NOT `@tailwind base/components/utilities`

**Detection:** If Tailwind classes produce no visible styles after scaffolding, check whether `@nuxtjs/tailwindcss` is in your `modules` array. Remove it immediately.

---

### CP2: Tailwind CSS v4 Breaking Changes from v3 Patterns

**Phase:** 1 (Foundation / Scaffolding)
**Confidence:** HIGH -- verified against [official Tailwind v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide)

**What goes wrong:** Tailwind v4 renames, removes, and changes defaults for dozens of utilities. Code copied from Tailwind v3 tutorials, component libraries, or AI-generated output silently breaks. The most dangerous changes are _default value changes_ that produce valid but visually wrong output.

**Why it happens:** Tailwind v4 is less than a year old. Most online resources, tutorials, and AI training data reference v3 patterns. Even experienced developers will use v3 patterns out of muscle memory.

**Consequences:**

- `shadow-sm` now produces the size that `shadow-xs` does (entire shadow scale shifted)
- `rounded-sm` now produces `rounded-xs` size (radius scale shifted)
- `ring` produces 1px instead of 3px (changed default width)
- `border` defaults to `currentColor` instead of `gray-200` (unexpected dark borders)
- `outline-none` renamed to `outline-hidden`; `outline-none` now sets `outline-style: none`
- `bg-opacity-*` removed entirely (use slash syntax: `bg-black/50`)
- Variant stacking order reversed: `first:*:pt-0` becomes `*:first:pt-0`
- Arbitrary values with CSS variables use `()` not `[]`: `bg-(--brand-color)` not `bg-[--brand-color]`
- Button `cursor: pointer` is no longer default (must add explicitly)

**Prevention:**

1. Create a project-level reference card of renamed utilities and pin it to the project
2. When copying any Tailwind code from external sources, audit it against the [upgrade guide](https://tailwindcss.com/docs/upgrade-guide)
3. Add explicit `cursor-pointer` to all interactive elements (buttons, links)
4. Set border color in base layer if the gray-200 default is preferred:
   ```css
   @layer base {
     *,
     ::after,
     ::before,
     ::backdrop {
       border-color: var(--color-stone-200, currentColor);
     }
   }
   ```
5. Use `ring-3` explicitly instead of bare `ring` for focus states
6. Never trust AI-generated Tailwind code without checking against v4 syntax

**Detection:** Visual inconsistencies where borders are too dark, shadows are too small, or rings are too thin. Run a "visual diff" against design mockups after initial component creation.

---

### CP3: Hydration Mismatches in SSG Mode

**Phase:** 1-4 (any phase with interactive components)
**Confidence:** HIGH -- verified against [Nuxt hydration best practices](https://nuxt.com/docs/3.x/guide/best-practices/hydration) and [multiple GitHub discussions](https://github.com/nuxt/nuxt/discussions/16042)

**What goes wrong:** The HTML pre-rendered at build time does not match what Vue tries to render on the client. This causes Vue to throw hydration warnings, visual flickering, and in severe cases, broken interactivity where event listeners do not attach.

**Why it happens:** SSG pre-renders HTML during `nuxt generate` on a Node.js server. The client then "hydrates" this HTML by attaching Vue's reactivity. Any difference between server and client output causes a mismatch. Common triggers specific to this project:

1. **Browser-only APIs:** Using `window.innerWidth`, `navigator.userAgent`, or `document.cookie` in template expressions or computed properties. These are `undefined` during SSG build.
2. **Date/time rendering:** `new Date().toLocaleString()` produces different output at build time vs. user's browser (different locale, timezone).
3. **Random values:** `Math.random()` or `crypto.randomUUID()` for keys or IDs.
4. **Invalid HTML nesting:** `<p>` containing `<div>`, or `<a>` inside `<a>`.
5. **Conditional rendering based on reactive state not available at build time:** e.g., cookie consent state, viewport width.

**Consequences:**

- Console warnings that pollute development experience
- Visual flash where content renders, disappears, then re-renders
- Event listeners fail to attach on mismatched elements (buttons stop working)
- SEO impact if Googlebot encounters hydration errors

**Prevention:**

1. **Never use browser APIs in templates or computed properties directly.** Wrap in `onMounted`:
   ```typescript
   const isMobile = ref(false)
   onMounted(() => {
     isMobile.value = window.matchMedia('(max-width: 768px)').matches
   })
   ```
2. **Use `<ClientOnly>` for components that must differ:** Cookie consent banner, booking widget placeholder state, video player.
3. **Use `useCookie()` instead of `localStorage`:** `useCookie` is SSR-compatible and produces matching output on both server and client.
4. **Avoid formatting dates in templates.** Use the `<NuxtTime>` component or wrap date rendering in `<ClientOnly>`.
5. **Validate HTML structure:** Install `@nuxtjs/html-validator` as a dev dependency to catch nesting errors.
6. **Use CSS media queries instead of JavaScript for responsive layout differences.** `class="hidden md:block"` never causes hydration mismatch; `v-if="isMobile"` does.

**Detection:** Open browser DevTools console during development. Hydration mismatches show as `[Vue warn]: Hydration node mismatch` or `Hydration text content mismatch`. The warnings include the element where the mismatch occurred.

---

### CP4: Google Fonts Loaded from CDN -- German GDPR Violation

**Phase:** 1 (Foundation / Font Setup)
**Confidence:** HIGH -- verified against [LG Muenchen I ruling (3 O 17493/20)](https://gdprhub.eu/index.php?title=LG_M%C3%BCnchen_-_3_O_17493/20) and [multiple legal sources](https://www.forge12.com/en/blog/google-fonts-verstoesst-gegen-die-dsgvo-lg-muenchen-20-01-2022/)

**What goes wrong:** Loading Google Fonts from `fonts.googleapis.com` transfers the user's IP address to Google's US servers without consent, violating GDPR Art. 6(1)(a). The LG Muenchen I court ruled on January 20, 2022 that this constitutes an infringement of the user's right to informational self-determination and awarded EUR 100 in damages.

**Why it happens:** `@nuxt/fonts` can load from Google's CDN or self-host. If misconfigured or if a developer adds a `<link>` tag pointing to `fonts.googleapis.com` directly, the font loads externally. Some Nuxt modules or third-party libraries also inject Google Fonts CDN links.

**Consequences:**

- GDPR violation for every page load by every visitor
- Abmahnung (competitor cease-and-desist) risk: mass Abmahnungen were sent to thousands of German websites after this ruling
- EUR 100+ damages per affected visitor in theory
- Reputational harm for a hospitality business that promises guest comfort

**Prevention:**

1. Use `@nuxt/fonts` with local provider (confirmed self-hosting by default)
2. Verify after build: check the generated HTML for any `fonts.googleapis.com` or `fonts.gstatic.com` references
3. Add a Content Security Policy (CSP) header that blocks `fonts.googleapis.com`:
   ```
   font-src 'self';
   ```
4. Post-build audit: `grep -r "googleapis" .output/public/` should return zero results
5. Never add `<link href="https://fonts.googleapis.com/...">` manually

**Detection:** In browser DevTools Network tab, filter by "font" domain. Any request to `fonts.googleapis.com` or `fonts.gstatic.com` is a violation. Add this check to CI/CD pipeline.

---

### CP5: Cookie Consent Banner with Unequal Button Prominence (Dark Pattern)

**Phase:** 2 (when building cookie consent component)
**Confidence:** HIGH -- verified against [DSK guidance](https://www.cookieyes.com/blog/cookie-consent-requirements-germany/), [Usercentrics analysis](https://usercentrics.com/knowledge-hub/cookie-flood-control-consent-management-ordinance-tdddg/), and German court rulings

**What goes wrong:** The "Akzeptieren" (Accept) button is styled prominently (large, colored, obvious) while the "Ablehnen" (Reject) button is styled as a small text link, uses muted colors, or is hidden behind a "Einstellungen" (Settings) menu. German data protection authorities and courts have ruled this is a dark pattern that invalidates consent.

**Why it happens:** Maximizing tracking/analytics acceptance is a natural business instinct. Many consent banner templates and third-party libraries use this pattern by default. It feels like "good UX" to make the desired action prominent.

**Consequences:**

- Consent is legally invalid: all data processed under that consent has no legal basis
- DSGVO fines up to EUR 20 million or 4% of annual turnover
- Landesbeauftragter fuer Datenschutz (TLfDI in Thuringia) can order cease-and-desist
- Abmahnung risk from competitors
- Since the EinwV (Einwilligungsverwaltungsverordnung, April 2025) is now in effect, the regulatory landscape is tightening

**Prevention:**

1. "Akzeptieren" and "Ablehnen" must have **identical visual weight**: same size, same font weight, same button style, same hierarchy level
2. Both must be visible on the first layer of the banner (no hiding "Reject" behind "Settings")
3. Do NOT pre-check any consent category checkboxes
4. Cookie wall (blocking content until consent) is illegal under German law
5. Scrolling or continuing to browse does NOT constitute consent
6. Include a persistent "Cookie-Einstellungen" link in the footer to allow withdrawal
7. Test by asking someone unfamiliar with the site: "Which button rejects cookies?" If they cannot answer in 2 seconds, the design is a dark pattern.

**Detection:** Screenshot the consent banner and show it to someone who has not seen it before. Ask them to identify the reject option. If there is any hesitation, redesign.

---

### CP6: Beds24 Iframe Loaded Without Consent -- TDDDG Violation

**Phase:** 3-4 (Booking Integration)
**Confidence:** HIGH -- verified against [TDDDG SS 25 requirements](https://securiti.ai/blog/german-ttdsg-guide/) and [Beds24 privacy documentation](https://beds24.com/privacypolicy.html)

**What goes wrong:** The Beds24 booking iframe is embedded directly in the HTML with a `src` attribute, causing the browser to load it immediately. This sends the user's IP address to Beds24's servers and potentially sets cookies before the user has given consent under TDDDG SS 25.

**Why it happens:** The iframe seems "functional" (it is for booking), and developers may assume booking widgets are "strictly necessary." However, under German law, "strictly necessary" is interpreted in a **technical, not economic sense**. The website functions without the booking iframe -- users can see rooms, read content, and contact the pension by phone. The iframe is not technically necessary for the website to function.

**Consequences:**

- TDDDG violation for every page load where the iframe is present
- Potential DSGVO violation (data transfer to third party without legal basis)
- Invalid consent undermines the entire consent framework
- Regulatory action from TLfDI

**Prevention:**

1. Never set the iframe `src` attribute until consent is granted
2. Use `v-if` (not `v-show`) to conditionally render the iframe element:
   ```vue
   <iframe v-if="bookingConsented" :src="iframeSrc" />
   ```
   `v-if` prevents the DOM element from existing at all, so no HTTP request is made.
   `v-show` only hides the element with CSS -- the browser still loads the iframe.
3. Show a `ConsentPlaceholder` component explaining why the widget is not visible and offering an inline "Accept" button for the booking category
4. The consent cookie storing the user's choice itself is "strictly necessary" and does not require consent

**Detection:** Open the site in a private browser window. Before interacting with the cookie banner, check the Network tab for any requests to `beds24.com`. There should be zero.

---

### CP7: @nuxt/image with `ssr: false` -- No Image Optimization in SSG

**Phase:** 1 (if misconfigured) or 4-5 (when images are added)
**Confidence:** HIGH -- verified against [@nuxt/image static images documentation](https://image.nuxt.com/advanced/static-images)

**What goes wrong:** If `ssr: false` is set in `nuxt.config.ts`, `@nuxt/image` cannot optimize images during static generation. The `<NuxtImg>` component will render but serve original, unoptimized images. There is no error or warning -- the images simply are not processed.

**Why it happens:** Developers sometimes set `ssr: false` to avoid hydration issues or because they think SSG does not need SSR. In Nuxt 3, SSG _requires_ SSR to be enabled (`ssr: true`) -- the generate process uses SSR to pre-render pages, and `@nuxt/image`'s `ipxStatic` provider depends on this process.

**Consequences:**

- All images served at original resolution and format (no WebP/AVIF conversion)
- Page sizes balloon: a single unoptimized JPEG can be 2-5MB instead of 200KB
- LCP targets missed by a wide margin
- Lighthouse performance score drops to 20-40 instead of target 95+
- No responsive `srcset` generation -- all devices load the same large image

**Prevention:**

1. Ensure `ssr: true` is set (this is the default, so do not explicitly set `ssr: false`)
2. Verify `nitro.preset` is set to `'static'` (not absence of preset)
3. After running `nuxt generate`, check `.output/public/_ipx/` directory exists and contains optimized images
4. Images must be in `public/` directory for `ipxStatic` to find them during generation
5. Images conditionally rendered (e.g., in modals, behind `v-if`, or in carousels not visible on initial load) may not be crawled and optimized. Add explicit image routes to `nitro.prerender.routes` if needed.

**Detection:** After `nuxt generate`, check if `.output/public/_ipx/` directory exists and contains files. If it is empty or missing, image optimization is not working.

---

## Moderate Pitfalls

Mistakes that cause delays, significant debugging time, or technical debt.

---

### MP1: Nuxt Content v3 Collection Source Paths Not Matching

**Phase:** 2 (Content Infrastructure)
**Confidence:** HIGH -- verified against [Nuxt Content v3 collection docs](https://content.nuxt.com/docs/collections/define) and [GitHub issue #2932](https://github.com/nuxt/content/issues/2932)

**What goes wrong:** Content files exist in the `content/` directory but `queryCollection()` returns empty results or null. The collection `source` glob pattern in `content.config.ts` does not match the actual file paths, or the `content/` directory is inside a custom `srcDir` and Content v3 cannot find it.

**Why it happens:**

- `source: 'rooms/**.yml'` uses `**` which matches files in subdirectories. If files are directly in `content/rooms/`, use `rooms/*.yml` instead.
- Nuxt Content v3 does not respect the `srcDir` property from `nuxt.config.ts` -- the `content/` directory must be at the project root, not inside `app/`.
- YAML files with Zod validation errors silently fail: the file is skipped without a clear error message during build.

**Prevention:**

1. Keep the `content/` directory at the project root (not inside `app/` or `src/`)
2. Test collection queries immediately after defining them: add a page that dumps `queryCollection('rooms').all()` and verify output
3. Double-check glob patterns: `rooms/*.yml` for flat files, `rooms/**/*.yml` for nested
4. Run `nuxt generate` and check console output for Zod validation warnings
5. Use the Nuxt DevTools Content tab to inspect indexed content

**Detection:** `queryCollection().all()` returns empty array. Check Nuxt DevTools > Content panel to see if files are indexed.

---

### MP2: Nuxt Content v3 Sorting and Filtering Quirks

**Phase:** 2 (Content Infrastructure)
**Confidence:** MEDIUM -- based on [GitHub issue #3062](https://github.com/nuxt/content/issues/3062) and [discussion #3008](https://github.com/nuxt/content/discussions/3008)

**What goes wrong:** `queryCollection().order()` produces unexpected results: items with null values for the sort field are silently dropped from results instead of sorted to the end. Nested field queries using dot notation (`meta.slug`) do not work -- Content v3 queries are SQL-based and only support top-level fields.

**Why it happens:** Nuxt Content v3 switched from a document-based query system (v2) to a SQLite-based system. The query API looks similar but behaves differently. Developers migrating from v2 or following v2 tutorials encounter silent failures.

**Prevention:**

1. Always provide default values for fields used in sorting (e.g., `sortOrder: z.number().default(0)` in the Zod schema)
2. Keep your data schemas flat -- avoid nesting objects that you need to query or sort by
3. Test all queries with representative data during development, not just with one test file
4. If ordering seems wrong, check for null/undefined values in the sort field

**Detection:** Room order on the overview page does not match expected `sortOrder` values. Some rooms are missing from the list.

---

### MP3: Beds24 Iframe Height and Responsive Issues

**Phase:** 3-4 (Booking Integration)
**Confidence:** HIGH -- verified against [Beds24 iframe documentation](https://wiki.beds24.com/index.php/Embedded_Iframe) and [iframe resizing wiki](https://wiki.beds24.com/index.php/Iframe_Resizing)

**What goes wrong:** The Beds24 booking iframe has a fixed height (e.g., `height="1500"`). When the content inside the iframe changes (user selects dates, views different step), the iframe height does not adapt. This causes either:

- Large blank space below the iframe content (height too large)
- Content cut off with scrollbars inside the iframe (height too small)
- User scrolled to bottom of a long page, then navigating to a shorter page leaves them staring at blank space

On mobile devices, the iframe may not fit the viewport width, causing horizontal scrolling.

**Why it happens:** Cross-origin iframes cannot be measured by the parent page due to browser security restrictions. The Beds24 iframe is on a different domain (`beds24.com`), so `iframe.contentDocument.body.scrollHeight` throws a security error.

**Prevention:**

1. Use the `iframeResizer` library (v4.2.10+) as documented by Beds24:
   - Add the content script to Beds24's booking page settings (SETTINGS > BOOKING ENGINE > PROPERTY BOOKING PAGE > DEVELOPER)
   - Add the host script to the website
   - Remove fixed `height` attribute from the iframe
2. This library uses `postMessage` for cross-origin communication
3. For mobile: ensure `max-width: 100%` and `border: none` on the iframe
4. Set a reasonable `min-height` (e.g., `400px`) to prevent layout collapse before the iframe loads
5. Test the booking flow end-to-end on mobile devices (actual phones, not just DevTools emulation)
6. Note: iframeResizer can trigger security warnings in some browsers for cross-domain scripts

**Detection:** Complete a full booking flow on mobile. Check for horizontal scrolling, content cutoff, and blank space.

---

### MP4: Beds24 Third-Party Cookie Blocking

**Phase:** 3-4 (Booking Integration)
**Confidence:** HIGH -- verified against [Beds24 iframe documentation](https://wiki.beds24.com/index.php/Embedded_Iframe)

**What goes wrong:** Modern browsers increasingly block third-party cookies. The Beds24 iframe runs on `beds24.com`, which is a different origin from `pension-volgenandt.de`. When browsers block third-party cookies, the Beds24 widget cannot pass data between the booking widget (date picker on the parent page) and the iframe (booking engine), causing:

- Selected dates not appearing in the iframe
- Guest count not transferring
- Session data lost between booking steps

**Why it happens:** Safari, Firefox, and Brave already block third-party cookies by default. Chrome is phasing out third-party cookies. This is a growing problem that will affect more browsers over time.

**Prevention:**

1. Pass booking parameters via URL query parameters instead of relying on cookies:
   ```
   beds24.com/booking2.php?propid=XXX&checkin=2026-03-15&numnight=3&numadult=2
   ```
2. Ensure Beds24 booking engine settings have "Opening Checkin Date," "Length of Stay," and "Number of Guests" set to "Default" (not fixed values)
3. Remove `numadult` and `advancedays` from the iframe URL if using a separate date-picker widget
4. Test in Safari (strictest third-party cookie blocking) and Firefox (Enhanced Tracking Protection)
5. Do NOT build a custom date picker that tries to sync with the iframe via cookies

**Detection:** Test the booking flow in Safari private browsing. If dates or guest counts do not transfer to the iframe, third-party cookies are being blocked.

---

### MP5: Hero Video Blocking LCP and Wasting Mobile Bandwidth

**Phase:** 3 (Homepage / Hero)
**Confidence:** HIGH -- verified against [web.dev LCP documentation](https://web.dev/articles/lcp) and [performance optimization guides](https://aarontgrogg.com/blog/2026/01/06/improving-lcp-for-video-hero-components/)

**What goes wrong:** The hero video file is too large (>5MB), blocks the LCP element (poster image), or loads on mobile where it wastes bandwidth without providing value on small screens. Videos are NOT considered LCP candidates by the browser, but they can delay the LCP element (the poster image) by competing for bandwidth.

**Why it happens:** Raw drone footage is 50-200MB. Even after compression, developers often produce 10-20MB WebM files. The video `<source>` element triggers a download that competes with the poster image for bandwidth, delaying LCP.

**Prevention:**

1. **Compress aggressively:** Target 2-3MB for desktop WebM (VP9, 720p, 24fps, CRF 35-40):
   ```bash
   ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 38 -b:v 0 -vf "scale=1280:720" -an hero-desktop.webm
   ```
2. **Preload the poster image, NOT the video:**
   ```html
   <link rel="preload" as="image" href="/video/hero-poster.webp" fetchpriority="high" />
   ```
3. **Do not load video on mobile at all.** Use `v-if` with `onMounted` + `matchMedia`, not CSS `display: none` (which still downloads the video):
   ```typescript
   onMounted(() => {
     showVideo.value =
       window.matchMedia('(min-width: 768px)').matches &&
       !window.matchMedia('(prefers-reduced-motion: reduce)').matches
   })
   ```
4. **Add `preload="none"` or `preload="metadata"` to the video element** to prevent eager downloading
5. **Use a static poster image that is optimized for LCP:** WebP, 1920x1080, <200KB, with `fetchpriority="high"` and `loading="eager"`
6. **Never lazy-load the LCP element:** The poster image in the hero section must NOT have `loading="lazy"` -- this is a common mistake that delays LCP by 1-3 seconds

**Detection:** Run Lighthouse on the homepage. If LCP > 2.5s, check if the video is competing with the poster image. Check Network tab waterfall to see if video download starts before poster image completes.

---

### MP6: Dynamic Routes Not Pre-rendered in SSG

**Phase:** 2 (Room Pages)
**Confidence:** HIGH -- verified against [Nuxt prerendering documentation](https://nuxt.com/docs/3.x/getting-started/prerendering) and [community reports](https://github.com/nuxt/nuxt/issues/22084)

**What goes wrong:** `nuxt generate` with `crawlLinks: true` pre-renders all pages it can discover by following `<a href>` links from the root page. But if a dynamic route like `/zimmer/[slug]` is not linked from any crawlable page, it is silently skipped. The build succeeds, but the page does not exist in the output -- visitors get a 404.

**Why it happens:** During development (`nuxt dev`), all dynamic routes work because they are generated on-the-fly. But in SSG mode, only pages that the crawler discovers (or that are explicitly listed) get pre-rendered. If the room overview page is not yet built, or if it does not link to all room detail pages, those pages are missing from the static output.

**Prevention:**

1. Always have `crawlLinks: true` enabled (default) in `nitro.prerender`
2. Ensure the room overview page (`/zimmer/`) renders `<NuxtLink>` elements to ALL room detail pages
3. As a safety net, explicitly list dynamic routes in `nuxt.config.ts`:
   ```typescript
   nitro: {
     prerender: {
       crawlLinks: true,
       routes: [
         '/',
         '/zimmer/emils-kuhwiese',
         '/zimmer/schoene-aussicht',
         // ... all room slugs
       ],
     },
   }
   ```
4. After every `nuxt generate`, verify the output directory contains all expected pages:
   ```bash
   ls .output/public/zimmer/*/index.html
   ```
5. Add a CI check that counts the number of generated room pages and fails if fewer than expected

**Detection:** After `nuxt generate`, check `.output/public/zimmer/` for all expected room directories. If any are missing, those pages will 404 in production.

---

### MP7: ipxStatic Configuration Not Inheriting from ipx

**Phase:** 4-5 (Image Optimization)
**Confidence:** HIGH -- verified against [GitHub issue #1676](https://github.com/nuxt/image/issues/1676)

**What goes wrong:** During SSG, `@nuxt/image` uses the `ipxStatic` provider (not the `ipx` provider). However, `ipxStatic` does **not** inherit configuration from `ipx`. If you configure image quality, formats, or directory settings under the `ipx` key in `nuxt.config.ts`, those settings are silently ignored during `nuxt generate`. Images are processed with default settings instead of your custom configuration.

**Why it happens:** The `ipx` and `ipxStatic` providers share similar names but are separate providers with independent configuration. This is a known design issue in `@nuxt/image`.

**Prevention:**

1. Configure image settings at the top level of the `image` key (which applies to all providers):
   ```typescript
   image: {
     quality: 80,
     format: ['webp', 'avif'],
   }
   ```
2. If you need provider-specific settings, duplicate them for both `ipx` and `ipxStatic`
3. After `nuxt generate`, check a generated image file to verify it is in WebP/AVIF format and at the expected quality level
4. Test with a sample image: compare file size of original vs. generated version

**Detection:** Generated images in `.output/public/_ipx/` are larger than expected or in unexpected format. Compare `_ipx` output file sizes to verify optimization is working.

---

### MP8: Sitemap Missing Dynamic Routes in SSG

**Phase:** 5 (SEO)
**Confidence:** MEDIUM -- based on [Nuxt Sitemap docs](https://nuxtseo.com/docs/sitemap/getting-started/data-sources) and community reports

**What goes wrong:** The `@nuxtjs/sitemap` module generates a sitemap.xml, but in SSG mode, dynamic routes (like `/zimmer/emils-kuhwiese`) may not be included if the module cannot discover them. The sitemap is generated at build time and relies on the same crawling mechanism as pre-rendering.

**Why it happens:** The sitemap module discovers routes through Nuxt's page directory and the prerender crawler. If dynamic routes are not properly linked or not listed in `nitro.prerender.routes`, they are also missing from the sitemap.

**Prevention:**

1. Ensure the sitemap module is loaded in `nuxt.config.ts` modules
2. Verify that all dynamic routes are pre-rendered (see MP6) -- if a page is pre-rendered, it will typically appear in the sitemap
3. After build, inspect the generated `/sitemap.xml` file to verify all expected URLs are present
4. Configure `sitemap.siteUrl` in `nuxt.config.ts` to ensure correct absolute URLs

**Detection:** After `nuxt generate`, open `.output/public/sitemap.xml` and verify all expected URLs are present. Use Google Search Console's sitemap testing tool after deployment.

---

### MP9: Netlify Build Failures with pnpm

**Phase:** 6 (Deployment)
**Confidence:** HIGH -- verified against [Netlify docs](https://docs.netlify.com/build/configure-builds/manage-dependencies/) and [Nuxt deployment guide](https://nuxt.com/deploy/netlify)

**What goes wrong:** Netlify builds fail with "Failed to resolve import 'vue'" or similar module resolution errors. The build works locally but fails in Netlify's CI environment.

**Why it happens:** pnpm uses a strict dependency isolation model (symlinked `node_modules`). Netlify's build environment expects a flattened `node_modules` structure. Without the `--shamefully-hoist` flag, peer dependencies and transitive dependencies are not accessible at the expected paths.

**Prevention:**

1. Commit `pnpm-lock.yaml` to the repository (Netlify auto-detects pnpm from this file)
2. Set `PNPM_FLAGS` in `netlify.toml`:
   ```toml
   [build.environment]
     NODE_VERSION = "20"
     PNPM_FLAGS = "--shamefully-hoist"
   ```
3. Set build command to `pnpm run generate` (not `npm run generate`)
4. Set publish directory to `.output/public`
5. Test the exact build command locally before first deploy:
   ```bash
   PNPM_FLAGS="--shamefully-hoist" pnpm install && pnpm run generate
   ```

**Detection:** Build fails in Netlify with "cannot resolve" or "module not found" errors that do not occur locally. Check Netlify build logs for pnpm-related errors.

---

### MP10: Tailwind v4 @theme Keyframes and Animation Issues

**Phase:** 1-3 (whenever animations are added)
**Confidence:** HIGH -- verified against [GitHub issue #14622](https://github.com/tailwindlabs/tailwindcss/issues/14622) and [discussion #15133](https://github.com/tailwindlabs/tailwindcss/discussions/15133)

**What goes wrong:** Custom `@keyframes` defined inside the `@theme` block do not work when imported from external CSS files, when split across multiple `@theme` blocks, or when using `@apply` inside keyframe rules. Animations are defined but produce no visual effect.

**Why it happens:** Tailwind v4's CSS engine uses the first `@theme` block as the indicator for where to output `@keyframes` rules. If keyframes are in a separate imported file or in a secondary `@theme` block, they are not generated in the output CSS.

**Prevention:**

1. Define ALL `@keyframes` in the **same** `@theme` block as your design tokens in `main.css`
2. Always pair `@keyframes` with a corresponding `--animate-*` custom property:
   ```css
   @theme {
     --animate-fade-in: fade-in 500ms ease-out;
     @keyframes fade-in {
       from {
         opacity: 0;
         transform: translateY(8px);
       }
       to {
         opacity: 1;
         transform: translateY(0);
       }
     }
   }
   ```
3. Do NOT use `@apply` inside `@keyframes` -- it does not work in v4
4. Do NOT split your `@theme` block into multiple CSS files that are `@import`ed
5. Keep all design tokens and animations in a single `main.css` file

**Detection:** Elements with `animate-fade-in` class show no animation. Inspect the element in DevTools: if the `animation` property references a keyframe name but the `@keyframes` rule is missing from the stylesheet, the keyframes were not generated.

---

## Minor Pitfalls

Mistakes that cause annoyance, minor delays, or are easily fixable but worth avoiding.

---

### mP1: Nuxt Content v3 Module Load Order with Nuxt SEO

**Phase:** 5 (SEO Integration)
**Confidence:** MEDIUM -- based on [NuxtSEO + Content v3 docs](https://nuxtseo.com/docs/nuxt-seo/guides/nuxt-content)

**What goes wrong:** When using `@nuxtjs/seo` (or individual SEO modules like `@nuxtjs/sitemap`, `nuxt-schema-org`) alongside `@nuxt/content` v3, the module load order in `nuxt.config.ts` matters. If `@nuxt/content` is loaded before the SEO modules, frontmatter-based SEO data (title, description) may not be processed correctly.

**Prevention:** Load SEO modules **before** `@nuxt/content` in the modules array:

```typescript
modules: [
  '@nuxtjs/sitemap', // SEO first
  '@nuxtjs/robots', // SEO first
  'nuxt-schema-org', // SEO first
  '@nuxt/content', // Content last
  '@nuxt/image',
  '@nuxt/fonts',
  '@nuxt/scripts',
]
```

**Detection:** Page titles or descriptions from Markdown frontmatter do not appear in the HTML `<head>`. Check the generated HTML source for missing or default meta tags.

---

### mP2: Video Files in `assets/` Instead of `public/`

**Phase:** 3 (Hero Video)
**Confidence:** HIGH -- standard Vite/Nuxt behavior

**What goes wrong:** Placing video files in `app/assets/` (or just `assets/`) causes Vite to process them during the build. This adds 30-60 seconds to build time, may trigger memory errors for large files, and produces hashed filenames that break cache-busting strategies.

**Prevention:**

1. Put all video files in `public/video/` -- they are served as-is without processing
2. Pre-optimize videos with ffmpeg before adding to the repository
3. Reference as `/video/hero-desktop.webm` (absolute path from public root)

**Detection:** Build time is unexpectedly long. Check Vite's build output for large asset processing messages.

---

### mP3: Missing `prefers-reduced-motion` Respect

**Phase:** 3 (Hero Video, Animations)
**Confidence:** HIGH -- WCAG 2.1 AA requirement

**What goes wrong:** The hero video autoplays and scroll-reveal animations run for users who have set `prefers-reduced-motion: reduce` in their OS settings. This causes discomfort (vestibular disorders), accessibility failures, and Lighthouse accessibility score penalties.

**Prevention:**

1. Check `prefers-reduced-motion` before enabling video:
   ```typescript
   onMounted(() => {
     const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
     if (prefersReducedMotion.matches) {
       showVideo.value = false
     }
   })
   ```
2. Add a global CSS rule to disable animations:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *,
     *::before,
     *::after {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```
3. Test with the "Reduce motion" setting enabled in OS accessibility preferences

**Detection:** Enable "Reduce motion" in system settings and reload the page. Video should not autoplay and animations should not run.

---

### mP4: Incorrect Legal References (TMG/TTDSG Instead of DDG/TDDDG)

**Phase:** 5 (Legal Pages)
**Confidence:** HIGH -- verified against [IHK Bonn](https://www.ihk-bonn.de/recht-und-steuern/recht/aktuelles/das-digitale-dienste-gesetz-ersetzt-das-telemediengesetz) and [e-Recht24](https://www.e-recht24.de/datenschutz/12834-tdddg.html)

**What goes wrong:** The Impressum cites "SS 5 TMG" and the Datenschutzerklarung references "TTDSG" for cookie consent. Since May 14, 2024, the TMG has been replaced by the DDG (Digitale-Dienste-Gesetz) and the TTDSG has been renamed to TDDDG (Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz). Using the old law names is technically incorrect and signals that the legal pages are outdated.

**Why it happens:** Most Impressum generators and legal page templates still use the old names. AI-generated legal text trained on pre-2024 data will use "TMG" and "TTDSG."

**Prevention:**

1. Use "SS 5 DDG" instead of "SS 5 TMG" in the Impressum
2. Use "SS 25 TDDDG" instead of "SS 25 TTDSG" in the Datenschutzerklarung
3. Reference "Verantwortlich fuer den Inhalt nach SS 18 Abs. 2 MStV" (this has not changed)
4. When using an Impressum generator, verify it has been updated for DDG
5. Do NOT copy legal text from the old website or from AI without checking law references

**Detection:** Search the legal pages for "TMG" and "TTDSG." If found, replace with "DDG" and "TDDDG" respectively.

---

### mP5: Netlify Forms Hidden Form Fallback Missing

**Phase:** 5-6 (Contact Form / Deployment)
**Confidence:** MEDIUM -- based on [Netlify forms documentation](https://docs.netlify.com/manage/forms/setup/) and community experience

**What goes wrong:** The contact form works in development but submissions are silently dropped in production. Netlify's form detection parses the deploy output HTML for `data-netlify="true"` forms. With Nuxt 3 SSG, the form IS rendered in the static HTML, but Netlify's post-processing sometimes fails to detect it if the HTML structure is unusual.

**Prevention:**

1. Add a hidden fallback form in `public/form-fallback.html`:
   ```html
   <form name="contact" data-netlify="true" data-netlify-honeypot="bot-field" hidden>
     <input name="bot-field" />
     <input name="name" />
     <input name="email" />
     <input name="phone" />
     <input name="message" />
   </form>
   ```
2. Ensure the `name` attribute on the form matches the `form-name` value in the POST body
3. Include `<input type="hidden" name="form-name" value="contact" />` inside the Vue form
4. Test form submission in the deployed Netlify preview before going live

**Detection:** Submit a test form in the Netlify deploy preview. Check Netlify dashboard > Forms to verify the submission appears.

---

### mP6: EinwV (Consent Management Ordinance) Confusion

**Phase:** 2 (Cookie Consent)
**Confidence:** MEDIUM -- based on [Usercentrics analysis](https://usercentrics.com/knowledge-hub/cookie-flood-control-consent-management-ordinance-tdddg/) and [Didomi reporting](https://www.didomi.io/blog/german-consent-management-ordinance)

**What goes wrong:** Developers hear about the new Einwilligungsverwaltungsverordnung (EinwV, effective April 1, 2025) and think existing cookie consent approaches are now invalid or need major changes.

**Reality:** The EinwV creates a **voluntary** framework for centralized consent management services. It does NOT change the underlying consent requirements of TDDDG SS 25. No certified consent management services exist yet (as of early 2026). Existing custom cookie consent banners remain fully legal.

**Prevention:**

1. Do NOT delay the cookie consent implementation waiting for EinwV certification
2. Continue building the custom consent banner as planned
3. The EinwV may become relevant in v1.1+ if certified services emerge and the pension wants to integrate them
4. Keep the consent composable modular so it could be extended later

**Detection:** N/A -- this is a planning/knowledge pitfall, not a technical one.

---

### mP7: Schema.org Structured Data Not Validated

**Phase:** 5 (SEO)
**Confidence:** HIGH -- based on [Google structured data guidelines](https://developers.google.com/search/docs/advanced/structured-data)

**What goes wrong:** Schema.org JSON-LD is generated by `nuxt-schema-org` but contains errors that prevent Google from displaying rich results. Common issues: missing required fields, incorrect data types, reviews markup that violates Google's self-serving review guidelines.

**Prevention:**

1. After generating the static site, validate each page type with [Google's Rich Results Test](https://search.google.com/test/rich-results)
2. Do NOT add `AggregateRating` markup with reviews scraped from Booking.com or Google -- Google requires reviews to be collected on the website itself
3. Test `LodgingBusiness`, `HotelRoom`, `BreadcrumbList`, and `FAQPage` schemas individually
4. Use `nuxt-schema-org`'s built-in validation warnings during development

**Detection:** After deployment, check Google Search Console for structured data errors. Run pages through the Rich Results Test.

---

### mP8: Images with Special Characters in Filenames

**Phase:** 2-4 (Content / Image Optimization)
**Confidence:** MEDIUM -- based on [GitHub issue #815](https://github.com/nuxt/image/issues/815)

**What goes wrong:** `@nuxt/image`'s `ipxStatic` provider returns a `403: Fetch error` during static generation for image URLs containing special characters (umlauts, spaces, question marks). German room names with umlauts (e.g., "Wohlfuehl-Appartement", "Schoene-Aussicht") can cause issues if used directly in filenames.

**Prevention:**

1. Use only ASCII characters, hyphens, and lowercase letters in image filenames
2. Replace umlauts: ae, oe, ue, ss (not a, o, u, s)
3. Replace spaces with hyphens
4. Good: `emils-kuhwiese-wohnzimmer.webp`
5. Bad: `Emil's Kuhwiese Wohnzimmer.webp` or `wohlfuhl-appartement.webp`

**Detection:** `nuxt generate` produces `403` or `404` errors for specific images. Check build output for IPX-related errors.

---

## Phase-Specific Warning Summary

| Phase            | Pitfall(s)                                                                                              | Severity | Key Action                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| 1: Foundation    | CP1 (wrong Tailwind module), CP2 (v4 breaking changes), CP4 (Google Fonts CDN), MP10 (@theme keyframes) | CRITICAL | Set up Tailwind v4 correctly from day one. Verify font self-hosting.                             |
| 2: Content       | MP1 (Content v3 paths), MP2 (sorting quirks), mP8 (image filenames), CP5 (consent dark pattern)         | MODERATE | Test queryCollection immediately. Use ASCII filenames. Design consent banner with equal buttons. |
| 3: Homepage/Hero | MP5 (video LCP), mP2 (video in assets/), mP3 (reduced motion), CP3 (hydration mismatch)                 | MODERATE | Compress video aggressively. Use public/ directory. Respect prefers-reduced-motion.              |
| 4: Booking       | CP6 (iframe without consent), MP3 (iframe height), MP4 (third-party cookies)                            | CRITICAL | Gate iframe behind consent with v-if. Use iframeResizer. Pass params via URL.                    |
| 5: SEO/Legal     | mP1 (module order), mP4 (wrong law names), mP7 (Schema validation), MP8 (sitemap), mP5 (Netlify forms)  | MODERATE | Use DDG/TDDDG. Validate Schema.org. Check sitemap completeness.                                  |
| 6: Deploy        | MP9 (pnpm on Netlify), CP7 (@nuxt/image ssr:false), MP6 (dynamic routes)                                | MODERATE | Set PNPM_FLAGS. Verify ssr:true. Check all pages generated.                                      |

---

## Sources

### Official Documentation (HIGH confidence)

- [Tailwind CSS v4 Nuxt Installation](https://tailwindcss.com/docs/installation/framework-guides/nuxt)
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Nuxt 3 Hydration Best Practices](https://nuxt.com/docs/3.x/guide/best-practices/hydration)
- [Nuxt 3 Prerendering](https://nuxt.com/docs/3.x/getting-started/prerendering)
- [@nuxt/image Static Images](https://image.nuxt.com/advanced/static-images)
- [Nuxt Content v3 Collections](https://content.nuxt.com/docs/collections/define)
- [Beds24 Embedded Iframe Wiki](https://wiki.beds24.com/index.php/Embedded_Iframe)
- [Beds24 Iframe Resizing Wiki](https://wiki.beds24.com/index.php/Iframe_Resizing)
- [Netlify Nuxt Deployment](https://docs.netlify.com/build/frameworks/framework-setup-guides/nuxt/)
- [Netlify Dependency Management](https://docs.netlify.com/build/configure-builds/manage-dependencies/)
- [web.dev LCP Documentation](https://web.dev/articles/lcp)

### Legal Sources (HIGH confidence)

- [LG Muenchen I - Google Fonts Ruling (3 O 17493/20)](https://gdprhub.eu/index.php?title=LG_M%C3%BCnchen_-_3_O_17493/20)
- [IHK Bonn - DDG Replaces TMG](https://www.ihk-bonn.de/recht-und-steuern/recht/aktuelles/das-digitale-dienste-gesetz-ersetzt-das-telemediengesetz)
- [Usercentrics - TDDDG Cookie Consent](https://usercentrics.com/knowledge-hub/cookie-flood-control-consent-management-ordinance-tdddg/)
- [CookieYes - German Cookie Consent Requirements](https://www.cookieyes.com/blog/cookie-consent-requirements-germany/)
- [Didomi - German Consent Management Ordinance](https://www.didomi.io/blog/german-consent-management-ordinance)

### GitHub Issues / Community (MEDIUM confidence)

- [Tailwind v4 @theme Keyframes Issue #14622](https://github.com/tailwindlabs/tailwindcss/issues/14622)
- [Tailwind v4 Keyframes Discussion #15133](https://github.com/tailwindlabs/tailwindcss/discussions/15133)
- [Nuxt Content v3 srcDir Issue #2932](https://github.com/nuxt/content/issues/2932)
- [Nuxt Content v3 Sorting Issue #3062](https://github.com/nuxt/content/issues/3062)
- [Nuxt Content v3 Nested Query Discussion #3008](https://github.com/nuxt/content/discussions/3008)
- [@nuxt/image ipxStatic Config Issue #1676](https://github.com/nuxt/image/issues/1676)
- [@nuxt/image Special Characters Issue #815](https://github.com/nuxt/image/issues/815)
- [Nuxt SSG Routes Issue #22084](https://github.com/nuxt/nuxt/issues/22084)
- [Nuxt Hydration Discussion #16042](https://github.com/nuxt/nuxt/discussions/16042)
- [Tailwind v4 @nuxtjs/tailwindcss Conflict Discussion #16236](https://github.com/tailwindlabs/tailwindcss/discussions/16236)

### Performance / UX (MEDIUM confidence)

- [Aaron T. Grogg - Improving LCP for Video Hero Components](https://aarontgrogg.com/blog/2026/01/06/improving-lcp-for-video-hero-components/)
- [Mastering Nuxt - Fixing Hydration Errors](https://masteringnuxt.com/blog/fixing-hydration-errors-in-nuxt-a-practical-guide)
- [Nuxt Hydration and Date Formatting](https://www.leopold.is/blog/nuxt-hydration-issues-and-dates/)
