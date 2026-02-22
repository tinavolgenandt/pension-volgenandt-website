# Pension Volgenandt Website

## What This Is

A complete website redesign for Pension Volgenandt, a family-run guesthouse in Breitenbach, Eichsfeld (Thuringia, Germany). Replaces the current 1&1 IONOS website builder site (rated 3.5/10) with a modern, fast, SEO-optimized Nuxt 4 static site with embedded Beds24 booking integration. Target audience: couples 50-60, families, business travelers.

## Core Value

Visitors can easily discover rooms, see prices, and book directly — without leaving the site or encountering a dated, confusing experience.

## Current Milestone: v1.0 Website Redesign

**Goal:** Build and launch the complete new pension website with all pages, booking integration, legal compliance, and modern build tooling.

**Target features:**

- Modern Nuxt 4 + Tailwind CSS v4 SSG site with TypeScript
- Full build tooling (ESLint, Prettier, type checking, Makefile)
- Homepage with hero video, room previews, testimonials, sustainability teaser
- Individual room detail pages with galleries, amenities, pricing
- Beds24 booking widget embedded on every page
- Content pages: Family, Activities, Sustainability, Contact with map
- Legal pages: Impressum, Datenschutz, AGB
- Cookie consent banner (DSGVO/TDDDG compliant)
- Full Schema.org structured data (LodgingBusiness, Room, BreadcrumbList)
- SEO: sitemap, robots.txt, canonical URLs, meta tags, alt text on all images
- Performance: <2.5s LCP, 95+ Lighthouse scores
- Accessibility: WCAG AA, 95+ Lighthouse accessibility
- Image optimization pipeline (WebP/AVIF, responsive srcsets, lazy loading)
- Content in Nuxt Content (Markdown/YAML) for easy editing

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Nuxt 4 SSG with TypeScript, Tailwind CSS v4, modern build tooling
- [ ] Makefile with lint, format, typecheck, build, dev commands
- [ ] Design system: sage green palette, DM Sans typography, component library
- [ ] Homepage with hero video, booking widget, room cards, testimonials
- [ ] Room overview and individual detail pages with pricing
- [ ] Beds24 booking widget embedded site-wide
- [ ] Content pages (Familie, Aktivitaeten, Nachhaltigkeit, Kontakt)
- [ ] Legal pages (Impressum, Datenschutz, AGB) + cookie consent
- [ ] Full SEO: structured data, sitemap, meta tags, alt text
- [ ] Performance optimization: images, video, Core Web Vitals
- [ ] Accessibility: WCAG AA compliance
- [ ] Deployment setup (Netlify/Cloudflare Pages)

### Out of Scope

- Multi-language support (English) — defer to v1.1, German-only for launch
- Blog/news section — not needed for v1
- Headless CMS — start with Nuxt Content files, add CMS later if owner needs visual editing
- Custom Beds24 subdomain branding — EUR 19/month optional upgrade, not required
- Mobile app — web only
- Real-time chat/WhatsApp widget — defer to v1.1
- Professional photography commission — use existing photos, upgrade later
- New drone video — use existing YouTube aerial footage

## Context

- **Current site:** www.pension-volgenandt.de on 1&1 IONOS Website Builder (3.5/10 rating)
- **Booking system:** Beds24 (Owner ID: 135075) — keep and optimize, don't replace
- **3 Beds24 properties:** Emil's Kuhwiese (257613), Schone Aussicht (257610), Pension Volgenandt (261258)
- **7 room types total:** 2 apartments, 5 rooms (Balkonzimmer, Rosengarten, Wohlfuhl-Appartement, Doppelzimmer, Einzelzimmer)
- **Address:** Otto-Reuter-Straße 28, 37327 Leinefelde-Worbis OT Breitenbach
- **Legal:** Missing Impressum (legally mandatory), broken Datenschutz link, no cookie consent
- **Images:** 8 optimized images already in `static/img/` with descriptive German naming
- **Design research:** Analyzed Pension zur Krone + Chalten Suites Hotel for reference
- **Existing assessments:** `.planning/website-assessment.md`, `.planning/redesign-proposal.md`, `.planning/booking-system-assessment.md`, `.planning/design-research.md`

## Constraints

- **Tech stack:** Nuxt 4 + Vue 3 + Tailwind CSS v4 + TypeScript + pnpm — per research (Nuxt 3 EOL Jan 2026)
- **Build tooling:** ESLint, Prettier, TypeScript strict, Makefile for common commands
- **Hosting:** Static (SSG) on Netlify or Cloudflare Pages (free tier)
- **Booking:** Must use existing Beds24 account (embedded widget, not redirect)
- **Legal:** German DDG §5 (Impressum), DSGVO/GDPR, TDDDG §25 (cookie consent) compliance required
- **Accessibility:** WCAG AA minimum, no viewport zoom restrictions
- **Performance:** <2.5s LCP, <1.5s FCP, <200ms TBT, <0.1 CLS
- **Audience:** Primary 50-60 age group — large text (18px+), high contrast, simple navigation
- **Content language:** German only for v1.0

## Key Decisions

| Decision                               | Rationale                                                                                   | Outcome    |
| -------------------------------------- | ------------------------------------------------------------------------------------------- | ---------- |
| Nuxt 4 SSG over WordPress/other CMS    | Full performance control, no runtime server, free hosting, TypeScript. Nuxt 3 EOL Jan 2026. | -- Pending |
| Keep Beds24 over switching platforms   | Already configured, best price/feature ratio, optimize config instead                       | -- Pending |
| Tailwind CSS v4 over component library | Utility-first, design tokens, purges unused CSS, matches modern stack                       | -- Pending |
| DM Sans single font family             | Readable, friendly, modern, single-family simplicity, free                                  | -- Pending |
| Terracotta CTA color over gold/green   | Warm + earthy, 4.6:1 contrast on white, not pretentious                                     | -- Pending |
| Nuxt Content over headless CMS         | Simple YAML/MD files, no external dependency, owner can learn later                         | -- Pending |
| Makefile for build commands            | Universal, no extra dependency, works across all platforms                                  | -- Pending |

---

_Last updated: 2026-02-21 after roadmap creation — updated Nuxt 3→4 and TMG/TTDSG→DDG/TDDDG per research_
