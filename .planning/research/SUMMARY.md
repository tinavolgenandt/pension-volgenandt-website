# Project Research Summary

**Project:** Pension Volgenandt Website Redesign
**Domain:** Hospitality — family-run German guesthouse (Pension), 7 room types, rural Thuringia
**Researched:** 2026-02-21
**Confidence:** HIGH

## Executive Summary

Pension Volgenandt needs a modern, legally compliant static website to replace its current outdated presence. The recommended approach is Nuxt 4 (v4.3.1) with full static site generation (SSG) via `nuxt generate`, deployed to Netlify or Cloudflare Pages. This is a well-understood problem domain with established patterns: YAML-based content management, consent-gated third-party embeds, and a component hierarchy that separates data fetching (pages) from presentation (components). The current site is missing legally required pages (Impressum, Datenschutz) which creates immediate Abmahnung risk — this is the single most urgent issue to address before any other work.

The biggest technical risks are specific to the German legal context and the 2026 tooling landscape. Nuxt 3 is EOL as of January 31, 2026; starting this project on Nuxt 3 would mean building on an unsupported framework from day one. Tailwind CSS v4 replaces the familiar `tailwind.config.ts` file with a CSS-first `@theme` block — a significant mental model shift that causes silent failures when developers fall back to v3 patterns. On the legal side, the Beds24 booking iframe must be gated behind explicit cookie consent under TDDDG §25 (not TTDSG, which was renamed in 2024), and Google Fonts must never be loaded from Google's CDN due to German court rulings establishing GDPR liability per page load.

The recommended build order is six phases that respect technical dependencies: Foundation (scaffolding, design system, consent, legal pages) → Content Infrastructure and Room Pages → Homepage and Hero → Booking Integration → Remaining Pages and SEO → Optimization and Launch. Legal pages come first in Phase 1 because they eliminate the compliance emergency immediately and serve as a low-complexity validation of the full build pipeline. Booking integration is deliberately late (Phase 4) because it depends on the consent system being built and tested first.

---

## Key Findings

### Recommended Stack

Nuxt 4 (^4.3.1) with TypeScript, Tailwind CSS v4 via `@tailwindcss/vite` (not the legacy `@nuxtjs/tailwindcss` module), and pnpm v10 as the package manager. Content is managed via `@nuxt/content` v3 with YAML data collections for rooms, activities, and testimonials — no external CMS required, owner edits files directly. Fonts are self-hosted via `@nuxt/fonts` with `@fontsource-variable/dm-sans` from npm (no CDN, GDPR-safe). ESLint uses mandatory flat config (`eslint.config.mjs`) via `@nuxt/eslint` module; Prettier handles formatting separately with `prettier-plugin-tailwindcss` for class sorting.

**Core technologies:**

- **Nuxt 4 (^4.3.1):** Meta-framework — Nuxt 3 is EOL (Jan 31, 2026), no security patches. Non-negotiable upgrade.
- **Tailwind CSS v4 + `@tailwindcss/vite`:** CSS-first utility framework — `@theme` blocks replace `tailwind.config.ts`. Direct Vite plugin, no Nuxt module wrapper.
- **`@nuxt/content` v3:** File-based CMS — YAML data collections with Zod validation, SQLite-backed querying at build time.
- **`@nuxt/fonts` + `@fontsource-variable/dm-sans`:** Self-hosted fonts — npm provider avoids Google CDN, satisfying German GDPR court rulings.
- **`@nuxt/scripts` (^0.13.x, beta):** Consent-gated third-party loading — `useScriptTriggerConsent()` for Beds24 iframe and future analytics.
- **`nuxt-schema-org` + `@nuxtjs/sitemap` + `@nuxtjs/robots`:** SEO stack — LodgingBusiness, HotelRoom, FAQPage, BreadcrumbList schemas; auto-generated sitemap.xml.
- **`@nuxtjs/i18n` (^10.2.x):** Installed for v1.0 German-only but architected for English expansion in v1.1.

**Note:** `@nuxt/scripts` is still in beta (v0.13.x). API is functional but may change. Monitor for breaking changes.

### Expected Features

**Must have (table stakes — blocks launch):**

- Clear room pages with photos (5-8 photos per room minimum; current 8 total images for 7 rooms is insufficient)
- Visible pricing on every room card ("ab EUR X / Nacht inkl. MwSt." — PAngV requirement)
- Beds24 booking widget embedded on every room page, consent-gated
- Mobile-first responsive design (70%+ of hotel bookings on mobile)
- Prominent, clickable phone number in header (target audience aged 50-60 still calls to book)
- Location map using OpenStreetMap (no cookies, no consent required)
- Guest testimonials / social proof
- SSL/HTTPS (free via Netlify/Cloudflare)
- **Impressum (§5 DDG)** — legally required, currently missing, Abmahnung risk up to EUR 50,000
- **Datenschutzerklarung (GDPR Art. 13/14)** — currently missing
- Cookie consent banner with equal-prominence Accept/Reject buttons (TDDDG §25)
- SEO basics: meta tags, sitemap.xml, structured data, alt text
- Amenity information per room with icon grid
- Check-in/check-out times (not yet documented in proposal)
- Parking information (not yet documented in proposal)
- Written driving directions (map alone is insufficient for rural location)

**Should have (differentiators, launch is weaker without):**

- Hero drone video (desktop only, static poster on mobile)
- Sustainability page (solar, bio-Klaranlage, composting — genuine differentiator)
- FAQ section with FAQPage schema (high SEO ROI, low effort — added to v1.0 scope)
- Prominent pet policy ("Hund: EUR 10/Nacht" — major search filter)
- "Direktbucher-Vorteil" messaging near booking widget (drives direct vs. OTA)
- Schema.org LodgingBusiness + HotelRoom + BreadcrumbList structured data
- Distance badges on activities ("Baumkronenpfad: 25 min")

**Defer to v1.1:**

- Multi-language / English translation (German-only for launch, i18n architecture ready)
- Blog / news section (requires ongoing content, empty blog is worse than none)
- Chat / WhatsApp widget (requires real-time response capacity)
- Advanced analytics (start cookieless with Plausible if needed — no consent required)
- Weather widget (third-party API dependency)
- Newsletter signup

**Legal requirements summary (Germany-specific):**

- Impressum: cite "§5 DDG" (not §5 TMG — law changed May 2024)
- Datenschutz: cite "§25 TDDDG" (not §25 TTDSG — renamed May 2024)
- Cookie consent: equal-prominence buttons, no dark patterns, no cookie wall
- PAngV: all prices shown as total incl. VAT with "pro Nacht" unit
- AGB: not legally mandatory but strongly recommended for accommodation businesses
- BFSG (WCAG 2.1 AA): micro-enterprise exemption ambiguous when booking function present — comply anyway, target audience benefits directly

### Architecture Approach

The architecture is a fully static site (SSG) with client-side interactive islands. Every page is pre-rendered at build time via `nuxt generate` and served from CDN. JavaScript is progressive enhancement — the site works without JS, adding booking widget interactivity, consent management, and animations in-browser. Content flows from YAML files through Nuxt Content v3's SQL-backed collection system into typed component props at build time. Cookie consent state (stored in a first-party cookie via `useCookie()`) gates all third-party embeds reactively using `v-if` (not `v-show`, which still loads the resource).

**Major components:**

1. **Content Layer** — YAML files (`content/rooms/*.yml`, `content/activities/*.yml`, `content/testimonials.yml`) validated by Zod schemas via `content.config.ts`. Queried at build time with `queryCollection()`.
2. **Consent System** — Custom `useCookieConsent()` composable managing three categories: essential (always on), booking (Beds24), media (YouTube, Maps). Drives `v-if` conditional rendering of third-party content.
3. **UI Component Hierarchy** — `ui/` (base primitives), `app/` (layout: header, footer, consent banner), `sections/` (page sections), `rooms/` (room display), `booking/` (Beds24 integration), `activities/` (activity cards).
4. **Booking Integration** — Beds24 iframe via URL params (`propid`, `roomid`, `lang=de`). Per-room property IDs stored in YAML, passed as props to `BookingWidget`. `iframeResizer` handles dynamic height on different booking steps. Consent gate uses `v-if="bookingConsented"` — iframe element does not exist in DOM until consent granted.
5. **Design System** — Tailwind CSS v4 with custom `@theme` tokens: sage green brand palette (oklch), waldhonig CTA color (4.6:1 contrast on white), DM Sans Variable at 18px base (accessibility for 50-60 age target), custom `--radius-card`, `--shadow-card`, and `--animate-fade-in` keyframe.
6. **Deployment Pipeline** — `nuxt generate` → `.output/public/` → Netlify (preferred) or Cloudflare Pages. Netlify Forms for contact form with hidden HTML fallback for detection. Cache headers on `_ipx/`, `video/`, `img/` for immutable assets.

### Critical Pitfalls

1. **Wrong Tailwind module: `@nuxtjs/tailwindcss` instead of `@tailwindcss/vite`** (Phase 1) — Tailwind v4 uses a direct Vite plugin, not a Nuxt module. Installing the module causes silent CSS failures. Prevention: use `vite: { plugins: [tailwindcss()] }` in `nuxt.config.ts`; never install `@nuxtjs/tailwindcss`.

2. **Beds24 iframe loaded without TDDDG consent** (Phase 4) — Loading the iframe directly sends IP to Beds24 before consent, violating TDDDG §25. Prevention: use `v-if` (not `v-show`) to conditionally render the iframe only after `bookingConsented` is true; show `ConsentPlaceholder` until then. Test: open Network tab in private browser before interacting with consent banner — zero requests to `beds24.com` expected.

3. **Google Fonts loaded from CDN** (Phase 1) — German court ruling (LG München I, Jan 2022) established per-visitor GDPR liability for IP transfers to Google. Prevention: `@nuxt/fonts` with npm provider + `@fontsource-variable/dm-sans`. Post-build audit: `grep -r "googleapis" .output/public/` must return zero results.

4. **Cookie consent dark pattern: unequal button prominence** (Phase 1) — "Ablehnen" styled as small text link while "Akzeptieren" is a large colored button invalidates consent under TDDDG. Fines up to EUR 20M. Prevention: identical visual weight for both buttons, both visible on first layer, no pre-checked boxes.

5. **Hydration mismatches from browser APIs in SSR context** (Phases 1-4) — Using `window.matchMedia`, `navigator.userAgent`, or `document.cookie` in templates causes `[Vue warn]: Hydration mismatch`. Prevention: wrap browser-only code in `onMounted()`; use `useCookie()` for consent state; prefer CSS media queries over JS for responsive layout differences; use `<ClientOnly>` for components that inherently differ between server/client.

6. **Wrong German law names in legal pages** (Phase 5) — Using outdated "§5 TMG" and "§25 TTDSG" in Impressum and Datenschutz signals outdated pages. Correct references since May 2024: "§5 DDG" and "§25 TDDDG". Detection: grep for "TMG" and "TTDSG" in legal page content.

---

## Implications for Roadmap

Based on the combined research, the architecture's dependency chain maps clearly to a 6-phase build sequence. The legal emergency (missing Impressum and Datenschutz) and the consent system must both be resolved before any third-party integrations are built.

### Phase 1: Foundation and Legal Compliance

**Rationale:** Everything depends on the design system and layout. Cookie consent must exist before booking integration. Legal pages eliminate the compliance emergency immediately and validate the full build pipeline cheaply. Legal pages are the lowest-complexity content pages and can be deployed quickly.
**Delivers:** Working Nuxt 4 project, Tailwind v4 design system, base UI components, default layout (header/footer), cookie consent banner, Impressum, Datenschutz, AGB pages.
**Addresses:** T9 (SSL), T10 (legal pages), T11 (cookie consent), T5 (contact info in footer/header)
**Avoids:** CP1 (wrong Tailwind module), CP4 (Google Fonts CDN), CP5 (consent dark pattern), mP4 (wrong law names)
**Research flag:** Standard patterns, well-documented. No deeper research needed.

### Phase 2: Content Infrastructure and Room Pages

**Rationale:** Room data is the core product. Building YAML schemas and room display components early unblocks both the room overview page and the homepage room preview section. The detail page template is the most complex page and benefits from early attention.
**Delivers:** All 7 room YAML data files with Zod validation, room card component, room overview page (`/zimmer/`), room detail pages (`/zimmer/[slug]`) with gallery, amenities, pricing, and extras.
**Addresses:** T1 (room photos), T2 (visible pricing), T13 (amenities), T14 (breakfast info), T15 (check-in times)
**Avoids:** MP1 (Content v3 path mismatches), MP2 (sorting quirks — use `sortOrder` default of 0), mP8 (ASCII-only image filenames), MP6 (dynamic routes not pre-rendered — link all rooms from overview page)
**Research flag:** Standard patterns. Nuxt Content v3 is well-documented. Test `queryCollection()` immediately after scaffolding.

### Phase 3: Homepage and Hero

**Rationale:** The homepage is the highest-visibility page but depends on Phase 2's room card component (for the featured rooms preview section) and Phase 1's consent system (for the booking bar). Hero video requires pre-processing with ffmpeg before development begins.
**Delivers:** Hero video component (desktop only, poster fallback on mobile), welcome section, featured rooms preview, experience teaser, testimonials carousel, sustainability teaser, complete homepage assembly.
**Addresses:** D1 (hero drone video), D3 (brand philosophy), T7 (social proof), T8 (fast page load)
**Avoids:** MP5 (video blocking LCP — compress to <3MB WebM, preload poster, never lazy-load hero), mP2 (video in `assets/` — use `public/video/`), mP3 (prefers-reduced-motion — disable video if set), CP3 (hydration mismatches — use `onMounted` + `matchMedia` for video toggling)
**Research flag:** Hero video performance is moderately complex. Refer to PITFALLS.md MP5 for ffmpeg command and preload strategy.

### Phase 4: Booking Integration

**Rationale:** Booking integration is the highest-complexity system. It depends on Phase 1's consent composable and Phase 2's room YAML data (for per-room `beds24PropertyId` props). Deliberately late to ensure consent architecture is solid before embedding third-party content.
**Delivers:** `BookingWidget` with consent gate, `ConsentPlaceholder` component, Beds24 integration on all room detail pages, `BookingBar` (desktop sticky), `BookingFloatingButton` (mobile FAB), iframeResizer for dynamic height, end-to-end booking flow testing.
**Addresses:** T3 (integrated booking), A7 (no custom booking UI)
**Avoids:** CP6 (iframe without consent — use `v-if`, not `v-show`), MP3 (iframe height — implement iframeResizer), MP4 (third-party cookie blocking — pass params via URL, not cookies), A2 (no mandatory registration)
**Research flag:** Beds24 iframeResizer setup requires consulting Beds24 wiki (linked in ARCHITECTURE.md section 3). Test full booking flow in Safari (strictest third-party cookie blocking).

### Phase 5: Remaining Pages, SEO, and Schema

**Rationale:** Secondary pages (activities, family, sustainability, contact) are independent of each other and can be built in any order. SEO and structured data is last in this phase because it depends on stable page structure and content.
**Delivers:** Activities page with distance badges and category filter, family page, sustainability page, contact page with form and OpenStreetMap embed, FAQ section (added to v1.0 scope), breadcrumb navigation, Schema.org structured data (LodgingBusiness, HotelRoom, FAQPage, BreadcrumbList), sitemap.xml.
**Addresses:** D2 (sustainability), D4 (distance badges), D6 (family page), D7 (seasonal content), D11 (Schema.org), D12 (FAQ), D13 (pet policy), T6 (location/map), T16 (directions), T17 (parking), L1-L6 (all legal)
**Avoids:** mP1 (SEO modules before `@nuxt/content` in modules array), mP7 (Schema.org validation — use Google Rich Results Test), MP8 (sitemap missing dynamic routes), mP4 (correct DDG/TDDDG law names), mP5 (Netlify forms fallback HTML)
**Research flag:** Netlify Forms detection with Nuxt SSG is moderately complex — follow the hidden fallback HTML pattern from ARCHITECTURE.md section 7.3.

### Phase 6: Optimization and Launch

**Rationale:** Optimization comes last when all content and functionality is stable. Performance work on moving targets wastes effort.
**Delivers:** Full Lighthouse audit and remediation (target 95+ Performance, 100 Accessibility, 100 SEO), image optimization verification, cross-browser testing (Safari for third-party cookie issues, Firefox for Enhanced Tracking Protection), accessibility audit (keyboard navigation, screen reader, 4.5:1 contrast), deployment configuration, DNS migration, post-launch monitoring.
**Addresses:** T4 (mobile-first), T8 (<3s page load), L6 (WCAG 2.1 AA accessibility)
**Avoids:** CP7 (`ssr: false` breaking image optimization — verify `ssr: true`), MP7 (ipxStatic config — configure at top-level `image` key), MP6 (missing dynamic routes — `ls .output/public/zimmer/*/index.html`), MP9 (Netlify pnpm failure — set `PNPM_FLAGS=--shamefully-hoist`)
**Research flag:** Standard deployment patterns. Well-documented for both Netlify and Cloudflare Pages.

### Phase Ordering Rationale

- **Legal pages in Phase 1** (not Phase 5) because the current site has no Impressum or Datenschutz — this is an active legal liability that must be eliminated before anything else goes live.
- **Consent system in Phase 1** (not Phase 4 with booking) because the consent composable must exist before any third-party component is built. Building booking integration first and bolting consent on afterward is an anti-pattern that leads to leaky consent gates.
- **Room pages in Phase 2** (before homepage) because the homepage's featured rooms preview reuses the room card component. Building homepage first and then rooms creates duplicate work.
- **Booking integration in Phase 4** (after consent and rooms) because it is the highest-complexity integration and should sit on a solid foundation. Early integration of Beds24 before consent is established creates TDDDG violations that require retroactive rearchitecting.
- **SEO and Schema.org in Phase 5** (not Phase 1) because structured data depends on stable content (room data, amenity lists, geo coordinates) that is only finalized in earlier phases.

### Research Flags

Phases needing deeper research during planning:

- **Phase 4 (Booking Integration):** Beds24 iframeResizer setup requires consulting Beds24 wiki for the specific `propid`/`roomid` parameters and iframeResizer content script configuration. Also investigate whether Beds24 sets tracking cookies (vs. functional cookies) to determine if it belongs in "booking" or "essential" consent category.
- **Phase 5 (Contact Form):** If deploying to Cloudflare Pages instead of Netlify, switch to Formspree (free tier: 50 submissions/month). Decision on hosting platform determines form approach.

Phases with well-documented patterns (research-phase not needed):

- **Phase 1 (Foundation):** Nuxt 4 + Tailwind v4 integration is official-documented. STACK.md provides complete `nuxt.config.ts` and CSS setup.
- **Phase 2 (Content):** Nuxt Content v3 YAML collections are official-documented. ARCHITECTURE.md provides complete `content.config.ts` and example YAML.
- **Phase 6 (Deployment):** Standard Netlify/Cloudflare Pages deployment with `nuxt generate`. ARCHITECTURE.md provides `netlify.toml`.

---

## Confidence Assessment

| Area         | Confidence | Notes                                                                                                                                                                                                                                                                        |
| ------------ | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stack        | HIGH       | All core technologies verified against official docs and npm releases dated February 2026. Nuxt 4.3.1 and Tailwind v4.1.x confirmed current stable. Only `@nuxt/scripts` (beta, v0.13.x) is MEDIUM — API may change.                                                         |
| Features     | HIGH       | German pension domain is well-understood. Legal requirements verified against IHK, e-Recht24, and court ruling sources. Schema.org types verified against official schema.org and Google Developers docs.                                                                    |
| Architecture | HIGH       | All major patterns verified against official Nuxt, Tailwind, and Beds24 documentation. Consent-gated iframe pattern confirmed. One note: ARCHITECTURE.md still references "Nuxt 3" in its title and some code comments — treat all patterns as Nuxt 4 (they are compatible). |
| Pitfalls     | HIGH       | All critical pitfalls verified against official docs and GitHub issues with issue numbers. Legal pitfalls verified against court rulings and official German legal sources.                                                                                                  |

**Overall confidence:** HIGH

### Gaps to Address

- **Beds24 cookie behavior:** Whether Beds24 sets functional-only cookies vs. tracking cookies determines if it belongs in the "booking" or "essential" consent category. Investigate in Beds24 privacy policy and wiki before finalizing the consent composable. If Beds24 cookies are purely functional for the booking session, the legal case for "essential" is stronger (but still not guaranteed under strict German interpretation — the conservative approach is to require consent).

- **Hosting platform decision (Netlify vs. Cloudflare Pages):** This affects contact form implementation (Netlify Forms vs. Formspree) and whether `netlify.toml` or Cloudflare dashboard configuration is used. Decide before Phase 5.

- **Photography readiness:** The current site has 8 total images for 7 room types. Table stake T1 requires 5-8 photos per room minimum. If the EUR 300-600 photography session has not been scheduled, this blocks Phase 2 from delivering complete room pages. Confirm timeline early.

- **Beds24 property and room IDs:** The YAML schema includes `beds24PropertyId` and `beds24RoomId` fields. These must be retrieved from the Beds24 account before room YAML files can be finalized. Collect from owner before Phase 2 begins.

- **Actual room slugs and pricing:** ARCHITECTURE.md uses placeholder room names. The canonical list of 7 room names and their base prices must be confirmed with the owner before YAML data files are created.

- **Schema.org review guidelines:** The research notes that `AggregateRating` markup requires reviews collected directly on the site (not scraped from Booking.com). A mechanism for collecting first-party reviews (contact form follow-up, manual entry) should be established before Schema.org ratings markup is added.

---

## Sources

### Primary (HIGH confidence)

- [Nuxt 4.0 Announcement](https://nuxt.com/blog/v4) — framework version decision
- [Nuxt GitHub Releases](https://github.com/nuxt/nuxt/releases) — version verification
- [Tailwind CSS v4 Announcement](https://tailwindcss.com/blog/tailwindcss-v4) — CSS-first config approach
- [Tailwind CSS v4 Nuxt Installation Guide](https://tailwindcss.com/docs/installation/framework-guides/nuxt) — `@tailwindcss/vite` setup
- [Tailwind CSS Theme Variables](https://tailwindcss.com/docs/theme) — `@theme` block syntax
- [Nuxt ESLint Module](https://eslint.nuxt.com/packages/module) — flat config setup
- [Nuxt Content v3 Collections](https://content.nuxt.com/docs/collections/define) — YAML data schema
- [Nuxt Fonts Providers](https://fonts.nuxt.com/get-started/providers) — npm provider self-hosting
- [Nuxt Image Static Images](https://image.nuxt.com/advanced/static-images) — SSG image optimization
- [Nuxt Scripts Consent Guide](https://scripts.nuxt.com/docs/guides/consent) — third-party script gating
- [Beds24 Embedded Iframe Wiki](https://wiki.beds24.com/index.php/Embedded_Iframe) — iframe parameters
- [Beds24 Iframe Resizing Wiki](https://wiki.beds24.com/index.php/Iframe_Resizing) — iframeResizer setup
- [Schema.org LodgingBusiness](https://schema.org/LodgingBusiness) — structured data types
- [Google Hotels Schema](https://developers.google.com/hotels/hotel-content/proto-reference/lodging-schema) — HotelRoom markup
- [LG München I Ruling (3 O 17493/20)](https://gdprhub.eu/index.php?title=LG_M%C3%BCnchen_-_3_O_17493/20) — Google Fonts GDPR ruling
- [IHK Bonn: DDG replaces TMG](https://www.ihk-bonn.de/recht-und-steuern/recht/aktuelles/das-digitale-dienste-gesetz-ersetzt-das-telemediengesetz) — law name update
- [Usercentrics: TDDDG Cookie Consent](https://usercentrics.com/knowledge-hub/cookie-flood-control-consent-management-ordinance-tdddg/) — consent requirements
- [Netlify Nuxt Integration](https://docs.netlify.com/integrations/frameworks/nuxt/) — deployment
- [Cloudflare Pages Nuxt Deployment](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nuxt-site/) — deployment
- [web.dev LCP Documentation](https://web.dev/articles/lcp) — video hero performance

### Secondary (MEDIUM confidence)

- [Nuxt EOL Dates](https://endoflife.date/nuxt) — Nuxt 3 EOL confirmation
- [Tailwind v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide) — breaking changes reference
- [CookieYes: German Cookie Consent](https://www.cookieyes.com/blog/cookie-consent-requirements-germany/) — TDDDG requirements
- [barrierefix: BFSG Compliance](https://www.barrierefix.de/en/blog/bfsg-2025-ultimativer-compliance-guide-kmu) — accessibility law
- [Usercentrics: EinwV Analysis](https://usercentrics.com/knowledge-hub/cookie-flood-control-consent-management-ordinance-tdddg/) — consent regulation update
- [Mastering Nuxt: Tailwind v4 on Nuxt](https://masteringnuxt.com/blog/installing-tailwind-css-v4-on-nuxt-3) — integration guide

### Tertiary — GitHub Issues (MEDIUM confidence, specific bugs)

- [Tailwind v4 @theme Keyframes #14622](https://github.com/tailwindlabs/tailwindcss/issues/14622) — keyframe scoping pitfall
- [Nuxt Content v3 srcDir #2932](https://github.com/nuxt/content/issues/2932) — content directory placement
- [@nuxt/image ipxStatic Config #1676](https://github.com/nuxt/image/issues/1676) — ipxStatic inheritance gap
- [@nuxt/image Special Characters #815](https://github.com/nuxt/image/issues/815) — filename constraints
- [Nuxt SSG Routes #22084](https://github.com/nuxt/nuxt/issues/22084) — dynamic route pre-rendering

---

_Research completed: 2026-02-21_
_Ready for roadmap: yes_
