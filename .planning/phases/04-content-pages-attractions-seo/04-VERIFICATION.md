---
phase: 04-content-pages-attractions-seo
verified: 2026-02-22T11:30:00Z
status: gaps_found
score: 3/5 must-haves verified
gaps:
  - truth: 'Google Rich Results Test validates BedAndBreakfast schema, HotelRoom+Offer, FAQPage, and BreadcrumbList'
    status: partial
    reason: 'BedAndBreakfast @type incorrect (module produces LocalBusiness not BedAndBreakfast); BreadcrumbList absent from prerendered HTML; HotelRoom+Offer and FAQPage correctly implemented'
    artifacts:
      - path: 'nuxt.config.ts'
        issue: 'schemaOrg.identity uses type:LocalBusiness with subtype:BedAndBreakfast. Module produces @type:[Organization,LocalBusiness] with non-standard subtype property. Google Rich Results expects @type:BedAndBreakfast.'
      - path: 'app/components/ui/BreadcrumbNav.vue'
        issue: 'useBreadcrumbItems({schemaOrg:true}) is called but BreadcrumbList does not appear in prerendered HTML for any subpage.'
    missing:
      - 'Fix schemaOrg.identity to produce @type:BedAndBreakfast'
      - 'Verify and fix BreadcrumbList schema emission during SSG prerender'
  - truth: 'Every page has unique meta title max 60 chars, meta description max 155 chars, canonical URL, OG tags, hreflang=de; sitemap.xml and robots.txt accessible'
    status: failed
    reason: 'All meta titles exceed 60 chars due to titleTemplate duplication; homepage and room pages lack og:image and hreflang link tag'
    artifacts:
      - path: 'nuxt.config.ts (via nuxt-seo-utils titleTemplate)'
        issue: 'titleTemplate appends Pension Volgenandt to all page titles that already include Pension Volgenandt. Produces: Familie & Kinder | Pension Volgenandt | Pension Volgenandt (62 chars). All exceed 60-char limit.'
      - path: 'app/pages/index.vue'
        issue: 'Homepage has no og:image. No hreflang link tag.'
      - path: 'app/pages/zimmer/[slug].vue'
        issue: 'Room detail pages have no og:image, no og:description, and no hreflang link tag.'
    missing:
      - 'Override titleTemplate in nuxt.config.ts to disable site name appending, OR strip Pension Volgenandt from page-level title strings'
      - 'Add og:image to homepage (useSeoMeta with ogImage)'
      - 'Add og:image and og:description to room detail pages (useSeoMeta)'
      - 'Add hreflang link tag to homepage and room pages (useHead)'
      - 'Confirm robots.txt is accessible for static deployment'
---

# Phase 4: Content Pages, Attractions & SEO Verification Report

**Phase Goal:** All content pages are live, attraction landing pages target uncontested SEO keywords, and the site has complete structured data and technical SEO
**Verified:** 2026-02-22T11:30:00Z
**Status:** gaps_found
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| #   | Truth                                                                                                                                         | Status   | Evidence                                                                                                                                                                                    |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Familie, Aktivitaeten, Nachhaltigkeit, Kontakt pages with complete German content                                                             | VERIFIED | All 4 pages exist with 160-202 lines; FeatureGrid, PageBanner, BookingCta, SoftCta components assembled; Kontakt has FAQ accordion                                                          |
| 2   | Kontakt page has contact form, click-to-call, email link, map, driving directions                                                             | VERIFIED | Form.vue (122 lines) has Netlify Forms AJAX; DirectionsMap.vue wraps Leaflet inside MapConsent; kontakt.vue has tel: and mailto: links                                                      |
| 3   | Ausflugsziele overview + 5 attraction detail pages + 2 activity pages all render with SEO                                                     | VERIFIED | ausflugsziele/index.vue (139 lines), [slug].vue (174 lines) with 404 guard; wandern.vue and radfahren.vue (157 lines each); 5 attraction YAML files; all 8 routes in nitro.prerender.routes |
| 4   | Google Rich Results Test validates BedAndBreakfast, HotelRoom+Offer, FAQPage, BreadcrumbList schemas                                          | PARTIAL  | HotelRoom+Offer confirmed in room HTML; FAQPage confirmed in kontakt HTML; BedAndBreakfast WRONG type in output; BreadcrumbList absent from all prerendered HTML                            |
| 5   | Every page has unique meta title max 60 chars, description max 155 chars, canonical, OG tags, hreflang; sitemap.xml and robots.txt accessible | FAILED   | Title duplication: all titles 62-76 chars confirmed in HTML; homepage missing og:image and hreflang; room pages missing og:image, og:description, hreflang                                  |

**Score:** 3/5 truths verified

### Required Artifacts

| Artifact                                 | Expected                        | Status   | Details                                                                                                       |
| ---------------------------------------- | ------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| app/pages/familie.vue                    | Familie page with full content  | VERIFIED | 169 lines; useSeoMeta with ogImage; canonical and hreflang links                                              |
| app/pages/nachhaltigkeit.vue             | Nachhaltigkeit page             | VERIFIED | 172 lines; useSeoMeta with ogImage; canonical and hreflang                                                    |
| app/pages/aktivitaeten/index.vue         | Aktivitaeten overview           | VERIFIED | 176 lines; dynamic queryCollection for top 3 attractions                                                      |
| app/pages/kontakt.vue                    | Kontakt with form, map, FAQ     | VERIFIED | 202 lines; FAQPage schema; ContactForm, DirectionsMap, FaqAccordion assembled                                 |
| app/components/contact/Form.vue          | AJAX contact form               | VERIFIED | 122 lines; Netlify Forms hidden detection; 3-state UI (default/submitting/submitted)                          |
| app/components/contact/DirectionsMap.vue | Map with consent gate           | VERIFIED | 33 lines; wraps LMap inside AttractionsMapConsent                                                             |
| app/pages/ausflugsziele/index.vue        | Ausflugsziele overview with map | VERIFIED | 139 lines; queryCollection; consent-gated Leaflet map; card grid                                              |
| app/pages/ausflugsziele/[slug].vue       | Dynamic attraction detail       | VERIFIED | 174 lines; 404 guard; SEO from YAML; practical info conditional rendering                                     |
| app/pages/aktivitaeten/wandern.vue       | Wandern activity page           | VERIFIED | 157 lines; 3 routes with difficulty badges; external portal links                                             |
| app/pages/aktivitaeten/radfahren.vue     | Radfahren activity page         | VERIFIED | 157 lines; 3 routes; optional chaining for externalPortals                                                    |
| app/components/attractions/Card.vue      | Attraction card component       | VERIFIED | Used in ausflugsziele overview grid; NuxtImg with responsive sizes                                            |
| app/components/attractions/Map.vue       | Leaflet map with pins           | VERIFIED | Used in ausflugsziele and DirectionsMap; pension + attraction markers                                         |
| app/pages/[...slug].vue                  | Catch-all 404 route             | VERIFIED | Exists; renders error.vue                                                                                     |
| app/error.vue                            | Styled error page               | VERIFIED | Navigation links to Startseite, Zimmer, Kontakt                                                               |
| app/pages/zimmer/[slug].vue              | Room page with HotelRoom schema | PARTIAL  | HotelRoom+Offer schema verified in HTML; MISSING og:image, og:description, hreflang                           |
| app/pages/index.vue                      | Homepage with OG tags           | PARTIAL  | Page exists; uses useHead only; MISSING og:image; MISSING hreflang                                            |
| nuxt.config.ts                           | SEO config + prerender routes   | PARTIAL  | All Phase 4 routes in prerender.routes; WRONG schemaOrg.identity type; titleTemplate causes 62-76 char titles |
| content/attractions/\*.yml               | 5 attraction YAML files         | VERIFIED | All 5 present with seoTitle (max 60 chars per schema), seoDescription (max 155 chars), coordinates            |
| content/activities/\*.yml                | 2 activity YAML files           | VERIFIED | wandern.yml and radfahren.yml with routes, difficulty, externalPortals                                        |
| content/faq/index.yml                    | 12 FAQ items                    | VERIFIED | 4 categories (buchung, ausstattung, umgebung, anreise); used in FAQPage schema                                |

### Key Link Verification

| From                     | To                     | Via                                           | Status    | Details                                                                            |
| ------------------------ | ---------------------- | --------------------------------------------- | --------- | ---------------------------------------------------------------------------------- |
| kontakt.vue              | FAQPage schema         | useSchemaOrg + defineWebPage + defineQuestion | WIRED     | Confirmed in HTML: @type:[WebPage,FAQPage] with Question nodes                     |
| zimmer/[slug].vue        | HotelRoom schema       | useSchemaOrg                                  | WIRED     | Confirmed in HTML: @type:[HotelRoom,Product] with Offer array                      |
| ausflugsziele/index.vue  | attractions collection | queryCollection(attractions)                  | WIRED     | Fetches all attractions ordered by sortOrder                                       |
| ausflugsziele/[slug].vue | attraction YAML        | queryCollection where slug matches            | WIRED     | 404 guard present; SEO values read from attraction data                            |
| aktivitaeten/wandern.vue | activities collection  | queryCollection where slug=wandern            | WIRED     | Route cards rendered from YAML data                                                |
| kontakt.vue              | faq collection         | queryCollection(faq)                          | WIRED     | faqItems used in accordion and schema generation                                   |
| nuxt.config.ts           | BedAndBreakfast schema | schemaOrg.identity                            | NOT_WIRED | type:LocalBusiness produces @type:[Organization,LocalBusiness] not BedAndBreakfast |
| BreadcrumbNav.vue        | BreadcrumbList schema  | useBreadcrumbItems({schemaOrg:true})          | NOT_WIRED | No BreadcrumbList JSON-LD in any prerendered HTML page                             |
| index.vue                | og:image               | useSeoMeta ogImage                            | MISSING   | Homepage only uses useHead; no useSeoMeta call at all                              |
| zimmer/[slug].vue        | og:image               | useSeoMeta ogImage                            | MISSING   | Room page uses useHead only; no useSeoMeta                                         |
| All pages                | hreflang=de            | useHead link rel=alternate                    | PARTIAL   | Content pages have hreflang; index.vue and zimmer/[slug].vue do NOT                |
| nuxt-seo-utils           | titleTemplate          | site.name config                              | BROKEN    | Auto-appends site name to titles already containing site name; 62-76 char results  |

### Requirements Coverage

| Requirement                              | Status    | Blocking Issue                                                              |
| ---------------------------------------- | --------- | --------------------------------------------------------------------------- |
| Familie page with German content         | SATISFIED | Page exists with full content, FeatureGrid, BookingCta                      |
| Aktivitaeten hub page                    | SATISFIED | Dynamic overview with top 3 attractions from YAML                           |
| Nachhaltigkeit page                      | SATISFIED | 172-line page with sustainability commitments                               |
| Kontakt page with form                   | SATISFIED | Netlify Forms AJAX, click-to-call, email, map                               |
| Ausflugsziele overview                   | SATISFIED | Consent-gated Leaflet map + card grid                                       |
| Attraction detail pages x5               | SATISFIED | Dynamic template rendering all 5 YAML entries with 404 guard                |
| Activity pages (wandern, radfahren)      | SATISFIED | Both pages with routes, difficulty badges, external portals                 |
| Schema.org BedAndBreakfast               | BLOCKED   | nuxt.config.ts identity config produces wrong @type                         |
| Schema.org HotelRoom+Offer on room pages | SATISFIED | Confirmed in prerendered HTML                                               |
| Schema.org FAQPage on Kontakt            | SATISFIED | Confirmed in prerendered HTML                                               |
| BreadcrumbList schema on subpages        | BLOCKED   | useBreadcrumbItems({schemaOrg:true}) not appearing in HTML                  |
| Meta titles max 60 chars                 | BLOCKED   | titleTemplate duplication pushes all titles to 62-76 chars                  |
| OG tags on all pages                     | BLOCKED   | Homepage and room pages missing og:image                                    |
| hreflang=de on all pages                 | BLOCKED   | Homepage and room detail pages missing hreflang                             |
| sitemap.xml accessible                   | SATISFIED | Auto-generated with all 25 routes                                           |
| robots.txt accessible                    | UNCERTAIN | Configured via @nuxtjs/robots; not found in .output; needs deployment check |
| Custom 404 page                          | SATISFIED | [...slug].vue catch-all with styled error.vue                               |

### Anti-Patterns Found

| File                                | Line                     | Pattern                                                        | Severity | Impact                                                      |
| ----------------------------------- | ------------------------ | -------------------------------------------------------------- | -------- | ----------------------------------------------------------- |
| nuxt.config.ts                      | schemaOrg.identity block | type:LocalBusiness produces wrong @type                        | BLOCKER  | BedAndBreakfast schema fails Google Rich Results validation |
| nuxt.config.ts                      | titleTemplate config     | Site name auto-appended to titles already containing site name | BLOCKER  | All page titles 62-76 chars, exceed 60-char SEO limit       |
| app/pages/index.vue                 | script setup             | No useSeoMeta call                                             | BLOCKER  | Homepage missing og:image for social sharing                |
| app/pages/zimmer/[slug].vue         | script setup             | useHead only, no useSeoMeta                                    | BLOCKER  | Room pages missing og:image and og:description              |
| app/pages/index.vue                 | useHead links            | No hreflang link tag                                           | WARNING  | Incomplete hreflang vs other pages                          |
| app/pages/zimmer/[slug].vue         | useHead links            | No hreflang link tag                                           | WARNING  | Inconsistent hreflang vs all other content pages            |
| app/components/ui/BreadcrumbNav.vue | useBreadcrumbItems       | schemaOrg:true but schema not emitted                          | WARNING  | BreadcrumbList structured data absent from all subpages     |

### Human Verification Required

#### 1. Leaflet Map Rendering

**Test:** Navigate to /ausflugsziele, click the Karte laden consent button, observe the map
**Expected:** Interactive map appears with pension marker and 5 attraction markers with popup labels
**Why human:** Consent gate and Leaflet tile loading cannot be verified from static HTML

#### 2. Contact Form Submission

**Test:** Fill out form on /kontakt with name, email, message; submit; observe UI state
**Expected:** Spinner during submit, then success confirmation; no page reload; Netlify dashboard shows submission
**Why human:** Netlify Forms AJAX requires a live network request and Netlify account verification

#### 3. robots.txt Accessibility After Deployment

**Test:** Access https://www.pension-volgenandt.de/robots.txt after Netlify deployment
**Expected:** Returns User-agent: \* Allow: / with Sitemap directive
**Why human:** @nuxtjs/robots may generate robots.txt as a server route rather than static file; only verifiable post-deployment

#### 4. BreadcrumbList in Fresh Build HTML

**Test:** Run nuxt generate, then view page source of /familie on the resulting output
**Expected:** JSON-LD script tag containing @type:BreadcrumbList with ItemList entries
**Why human:** Current .output was built before the final commit (09:57 build vs 10:00 last commit); fresh SSG build needed to confirm current state

## Gaps Summary

Two gaps block the phase goal of complete structured data and technical SEO:

### Gap 1: Schema.org Identity Type (Partial)

The nuxt-schema-org module identity configuration does not support BedAndBreakfast as a first-class type. The current config in nuxt.config.ts uses type: LocalBusiness with subtype: BedAndBreakfast, which produces @type: ["Organization", "LocalBusiness"] with a non-standard subtype property that Google does not recognize. Google Rich Results Test requires @type: "BedAndBreakfast" to validate this schema type. The fix requires using the correct nuxt-schema-org API to emit the right @type directly.

The BreadcrumbList gap is related: useBreadcrumbItems({schemaOrg:true}) is called in BreadcrumbNav.vue but no BreadcrumbList JSON-LD appears in any prerendered HTML page. This may be a module compatibility issue between nuxt-schema-org v5 and the SSG prerender phase in the current project configuration.

### Gap 2: Meta Title Duplication and Missing OG Tags (Failed)

The nuxt-seo-utils titleTemplate automatically appends "| Pension Volgenandt" to every page title via the site.name configuration. All pages already include "Pension Volgenandt" at the end of their page-level title strings, resulting in duplication confirmed in built HTML output:

- "Familie & Kinder | Pension Volgenandt | Pension Volgenandt" = 62 chars (limit: 60)
- "Aktivitaeten im Eichsfeld | Pension Volgenandt | Pension Volgenandt" = 67 chars
- "Ferienwohnung Emils Kuhwiese | Pension Volgenandt | Pension Volgenandt" = 75 chars

The fix is to strip "| Pension Volgenandt" from all page-level useHead title strings and let titleTemplate append it once, OR to disable titleTemplate site name appending in nuxt.config.ts.

Additionally, the homepage (app/pages/index.vue) and room detail pages (app/pages/zimmer/[slug].vue) are missing useSeoMeta calls entirely. Both pages need ogImage, ogDescription, and hreflang link tags to match the pattern established on all other Phase 4 content pages.

---

_Verified: 2026-02-22T11:30:00Z_
_Verifier: Claude (gsd-verifier)_
