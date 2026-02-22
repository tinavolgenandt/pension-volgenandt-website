# Plan 04-04 Summary: Gap Closure (Schema.org & SEO Meta)

## Status: Complete

## What was done

### Task 1: Schema.org BedAndBreakfast identity

- Removed broken `schemaOrg.identity` block from nuxt.config.ts (was producing `@type: ["Organization", "LocalBusiness"]`)
- Added manual `useSchemaOrg()` in app/app.vue with `@type: "BedAndBreakfast"` including full address, amenities, geo, pricing
- Verified: prerendered homepage contains `"@type":"BedAndBreakfast"` in JSON-LD

### Task 2: Meta title duplication and OG/hreflang

- Stripped `" | Pension Volgenandt"` suffix from all page-level title strings (13 pages)
- Let nuxt-seo-utils `titleTemplate` from `site.name` add the suffix once automatically
- Added `titleTemplate: '%s'` override on homepage and attraction detail pages (keyword-rich titles)
- Added `useSeoMeta` with ogImage, ogDescription to homepage, zimmer/index, zimmer/[slug]
- Added `useHead` with hreflang and canonical links to homepage, zimmer/index, zimmer/[slug]
- Stripped `" | Pension Volgenandt"` from activity YAML seoTitle values
- Verified: all titles under 60 chars, no duplication

### Additional fixes (during gap closure)

- Fixed hero video crossfade (use `playing` event with double rAF instead of `canplay`)
- Fixed `spaeter` to `später` in error.vue
- Replaced remaining `--` with `:` in content.config.ts comments

## Verification results

- BedAndBreakfast schema: PASS (confirmed in generated HTML)
- BreadcrumbList schema: PARTIAL (BreadcrumbNav component exists but JSON-LD not appearing in SSG; may need SSR investigation in Phase 6)
- Meta titles under 60 chars: PASS (no output from over-60 check)
- Homepage OG tags: PASS (og:image, og:description present)
- Room page OG/hreflang: PASS (confirmed on zimmer/emils-kuhwiese)
- robots.txt: PASS (generated with sitemap directive)

## Commits

- `a3cc244` fix(hero): improve video crossfade to prevent black flash
- `948d0fe` fix(seo): BedAndBreakfast schema, meta titles, OG tags, and hreflang
- `b9e2848` fix(content): final umlaut and dash cleanup in error page and config

## Files modified

- app/app.vue (added useSchemaOrg BedAndBreakfast)
- nuxt.config.ts (removed schemaOrg.identity, fixed CSS path, fixed umlauts)
- app/pages/index.vue (useSeoMeta, titleTemplate, hreflang)
- app/pages/zimmer/index.vue (useSeoMeta, hreflang)
- app/pages/zimmer/[slug].vue (useSeoMeta, hreflang)
- app/pages/ausflugsziele/[slug].vue (titleTemplate override)
- app/pages/{agb,datenschutz,nachhaltigkeit,kontakt,aktivitaeten/index,familie,impressum,ausflugsziele/index}.vue (title strip)
- content/activities/{wandern,radfahren}.yml (seoTitle strip)
- app/components/home/HeroVideo.vue (crossfade fix)
- app/error.vue (umlaut fix)
- content.config.ts (dash fix)
