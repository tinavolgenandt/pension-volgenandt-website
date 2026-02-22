# Pension Volgenandt - Website Redesign Proposal

**Date:** 2026-02-21
**Current Site:** www.pension-volgenandt.de (1&1 IONOS Website Builder, rated 3.5/10)
**Current Booking:** Beds24 (Owner ID: 135075)

---

## 1. Design Vision

### Brand Positioning

Pension Volgenandt is a family-run guesthouse in Breitenbach, Eichsfeld (Thuringia), offering **solitude, calm, and quiet surroundings** in the heart of a nature-rich German landscape. The redesign must authentically communicate this identity while converting visitors into guests.

### Design Philosophy: "Einfach Ankommen" (Simply Arrive)

This is **not** a luxury hotel website. Pension Volgenandt is a down-to-earth, family-run guesthouse -- the kind of place where the owner greets you personally, breakfast is homemade, and the garden is the main attraction. The design must reflect that **honest, unpretentious, warm character**.

The approach is **modern-minimal but grounded** -- clean and contemporary without feeling sterile or fancy. Think Scandinavian cabin website meets German Landpension: simple layouts, natural textures, honest photography (not polished stock photos), and a tone that says "come as you are."

**Core principles:**

1. **Clean but warm** -- Modern layout with natural colors and textures, not cold minimalism
2. **Honest photography** -- Real rooms, real garden, real breakfast. No staging, no filters
3. **Easy to use** -- Simple navigation, clear information, no fuss. The website should be as straightforward as the pension itself
4. **Mobile-first** -- 60%+ of hotel traffic is mobile; designed for touch
5. **Readable** -- Primary audience is 50-60 years old; large text, high contrast, no visual clutter

### Target Audiences

| Audience                      | Priority  | Needs                                                | Design Implications                                                            |
| ----------------------------- | --------- | ---------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Couples 50-60**             | Primary   | Quiet retreat, comfort, nature walks, good breakfast | Large text (18-20px), high contrast, warm imagery, easy booking, no pretension |
| **Families with children**    | Secondary | Space, outdoor activities, safety, value             | Family photos, activities section, room capacity info, child-friendly extras   |
| **Single business travelers** | Tertiary  | Affordable accommodation, Wi-Fi, proximity to work   | Clear pricing, quick info, straightforward booking                             |

---

## 2. Reference Site Analysis

### Pension zur Krone (www.pension-zurkrone.de) -- What Works

Analyzed via Playwright on 2026-02-21. Screenshots in `.playwright-mcp/`.

**Strengths to borrow:**

- **Full-width hero image slider** with text overlay -- creates strong first impression
- **Dual-font strategy** -- decorative script for H1 + clean sans for body creates a personal feel (though Allura is too ornate for our down-to-earth approach)
- **Alternating image-text cards** for property sections (image left/text right, then reversed)
- **Embedded YouTube video** on the homepage for an immersive property tour
- **Two-tier header** -- utility bar (phone, email, social) + main navigation
- **Fixed/sticky header** for persistent navigation
- **Partnership badges** in footer (DEHOGA, Bett+Bike, Wanderbares Deutschland) -- trust signals
- **Room presentation** with amenity bullet lists, prices displayed prominently ("ab EUR 70"), and direct "Jetzt buchen" CTAs
- **Proper legal compliance** -- Impressum, Datenschutz, Cookie Consent (Cookiebot)

**Weaknesses to avoid:**

- No online booking system (contact form only) -- we have Beds24
- Red brand color feels too aggressive for a calm brand
- Script font in navigation is hard to read at small sizes
- Overall look is still somewhat "hotel-ish" / traditional -- we want more modern and grounded
- Dense text blocks with no visual hierarchy aids
- WordPress technology creates dependency and maintenance overhead

### Chalten Suites Hotel (chaltensuiteshotel.com) -- What Works

**Strengths to borrow:**

- **Full-width YouTube hero video** as background -- immersive, sets mood instantly
- **Booking widget overlaid on hero** -- date picker + guest count + "Reservar" CTA above the fold
- **Three-column feature cards** below the hero with icons (rooms, breakfast, tourism)
- **Room carousel/slider** with horizontal scrolling, each room showing description + "Ver detalles" CTA
- **Guest review carousel** with quotes and source attribution ("Alejandro | Booking")
- **Photo gallery strip** with thumbnails linking to full-size lightbox
- **WhatsApp floating button** for instant contact (common in hospitality)
- **Newsletter signup** in the footer
- **Clean section separation** -- alternating white/dark backgrounds with generous padding

**Weaknesses to avoid:**

- Template-based look (TodoAlojamiento platform) -- lacks personality
- Small text on mobile
- No pricing visible on room cards
- Busy footer with too many elements
- No environmental/sustainability messaging

### Existing YouTube Aerial Video

- **Video:** "Luftaufnahme Pension Volgenandt" (youtube.com/watch?v=vFCz9DN1r8E)
- **Duration:** 18 seconds (ideal loop length -- under recommended 15s max, close enough)
- **Content:** Drone flyover of the pension property and surrounding landscape
- **Quality:** Usable but dated (5 years old, 731 views)
- **Recommendation:** Use as a starting point. For the redesign, commission a new 10-15 second drone clip at 720p optimized for web (<5MB), ideally shot in golden hour or with morning mist. Until then, extract and optimize this video for use as hero background.

---

## 3. Proposed Page Structure

### Sitemap

```
/                       Homepage (hero video, room preview, about teaser, reviews)
/zimmer/                Rooms & Apartments overview
/zimmer/emils-kuhwiese/ Room detail: Ferienwohnung Emil's Kuhwiese
/zimmer/schoene-aussicht/ Room detail: Ferienwohnung Schone Aussicht
/zimmer/balkonzimmer/   Room detail: Balkonzimmer
/zimmer/rosengarten/    Room detail: Rosengarten Zimmer
/zimmer/appartement/    Room detail: Wohlfuhl-Appartement
/zimmer/doppelzimmer/   Room detail: Doppelzimmer
/zimmer/einzelzimmer/   Room detail: Einzelzimmer
/familie/               Family & Children (Kind & Kegel -- strongest existing content)
/aktivitaeten/          Activities & Surroundings
/nachhaltigkeit/        Sustainability (unique differentiator)
/kontakt/               Contact & Directions
/impressum/             Legal: Impressum (TMG SS 5)
/datenschutz/           Legal: Datenschutzerklaerung (GDPR)
/agb/                   Legal: AGB (terms & conditions)
```

**Key changes from current site:**

- Individual room detail pages (currently all on one page)
- Sustainability gets its own page (currently buried as "Ein kleiner Umweltgedanke")
- Proper legal pages (currently missing Impressum, broken Datenschutz link)
- Clean, SEO-friendly URL slugs
- "Uber uns" content moves to homepage welcome section (no separate "about" page)

### Homepage Sections

```
+----------------------------------------------------------+
|  [HEADER: Logo | Nav: Zimmer, Familie, Aktivitaten,      |
|   Nachhaltigkeit, Kontakt | "Verfugbarkeit prufen" CTA]  |
+----------------------------------------------------------+
|                                                          |
|  [HERO SECTION - Full-width]                             |
|  Background: Looping drone video (desktop) /             |
|              Static landscape image (mobile)             |
|                                                          |
|  "Pension Volgenandt"                                    |
|  "Ruhe finden im Eichsfeld"                             |
|                                                          |
|  [Check-in] [Check-out] [Gaste] [Verfugbarkeit prufen]  |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  [WELCOME SECTION]                                       |
|  "Willkommen bei uns"                                    |
|  Brief 2-3 sentence welcome text                         |
|  Lifestyle photo (garden/breakfast scene)                |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  [ROOMS PREVIEW - 3-column grid on desktop]              |
|  Card: Photo | "Emils Kuhwiese" | 2-3 features |        |
|        "ab EUR 70/Nacht" | "Details ansehen"             |
|  Card: Photo | "Schone Aussicht" | ...                   |
|  Card: Photo | "Balkonzimmer" | ...                      |
|                                                          |
|  "Alle Zimmer ansehen" link                              |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  [EXPERIENCE SECTION - Image + text side by side]        |
|  "Erleben Sie das Eichsfeld"                             |
|  Hiking, cycling, nature highlights                      |
|  Distance badges (e.g., "Baumkronenpfad: 25 min")       |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  [TESTIMONIALS CAROUSEL]                                 |
|  "Was unsere Gaste sagen"                                |
|  2-3 rotating guest quotes with star ratings             |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  [SUSTAINABILITY TEASER]                                 |
|  "Naturlich nachhaltig"                                  |
|  Icons: Solar | Bio-Klaranlage | Kompost                |
|  Brief text + "Mehr erfahren" link                       |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  [LOCATION / MAP]                                        |
|  Embedded map with pension marker                        |
|  Address + "Anfahrt planen" link                         |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  [FOOTER]                                                |
|  Col 1: Logo + brief tagline                             |
|  Col 2: Contact (address, phone, email)                  |
|  Col 3: Quick links (Zimmer, Aktivitaten, Kontakt)       |
|  Col 4: Legal (Impressum, Datenschutz, AGB)              |
|  Bottom: Copyright + Social icons                        |
|                                                          |
+----------------------------------------------------------+
```

### Room Detail Page Template

```
+----------------------------------------------------------+
| [Breadcrumb: Startseite > Zimmer > Emils Kuhwiese]       |
+----------------------------------------------------------+
|                                                          |
| [PHOTO GALLERY - Full-width image carousel/lightbox]     |
|  Main image + 4-6 thumbnails                             |
|                                                          |
+----------------------------------------------------------+
|                                                          |
| [ROOM INFO - Two columns]                                |
|                                                          |
| Left (60%):                                              |
|   "Ferienwohnung Emil's Kuhwiese"                        |
|   Description paragraph                                  |
|   Amenity grid (icons):                                  |
|     Grosse | Betten | Bad | WLAN | Terrasse | TV        |
|                                                          |
| Right (40%):                                             |
|   Price card:                                            |
|     "ab EUR 70 / Nacht"                                  |
|     "Fruhstuck: EUR 10 / Person"                         |
|     [Check-in] [Check-out]                               |
|     [Verfugbarkeit prufen] CTA                           |
|                                                          |
+----------------------------------------------------------+
|                                                          |
| [EXTRAS]                                                 |
|  Bookable add-ons: Fruhstuck, Geniesser-Fruhstuck,      |
|  BBQ Set, Hund                                           |
|                                                          |
+----------------------------------------------------------+
|                                                          |
| [OTHER ROOMS - Horizontal scroll]                        |
|  "Weitere Zimmer & Ferienwohnungen"                      |
|  3 compact room cards                                    |
|                                                          |
+----------------------------------------------------------+
```

---

## 4. Visual Design System

### Design Character: Modern & Grounded

The visual language should feel like **a well-kept Landhaus that got a modern renovation** -- not a design hotel, not a resort brochure. Think natural materials (wood, linen, stone), honest colors from the surrounding landscape, and clean modern typography that's easy to read without looking fancy.

**Mood references:** Scandinavian cabin rental sites, modern Bauernhof stays, Airbnb "countryside" listings with great photography. NOT: boutique hotel luxury, spa resorts, city design hotels.

### Color Palette

Earthy, natural, grounded. The palette comes directly from the Eichsfeld landscape -- forest greens, warm wood tones, meadow light. No gold, no shimmer, nothing that says "luxury."

```
PRIMARY
  Sage Green     #7A9B6D   -- Main brand color (forest, nature, grounded)
  Sage Dark      #4A6741   -- Links, buttons
  Sage Light     #A8C49A   -- Subtle highlights, hover backgrounds

BACKGROUNDS
  Warm White     #FAFAF7   -- Primary background (slightly warm, not sterile)
  Stone          #F0EDE8   -- Alternating section background (like natural stone)
  White          #FFFFFF   -- Cards, overlays

SECONDARY
  Warm Wood      #8B7355   -- Accents, borders (like a wooden beam)
  Sand           #C4B59B   -- Light secondary, tags, badges

ACCENT
  Terracotta     #C07B54   -- CTA buttons, booking actions (warm, earthy, not fancy)
  Terracotta Hover #A86842 -- Hover state

NEUTRAL
  Charcoal       #333333   -- Body text (simple, readable, no color-tinting)
  Grey           #6B6B6B   -- Secondary text, captions
  Light Grey     #D4D0CB   -- Borders, dividers
```

The key difference from a luxury palette: **no gold, no honey, no shimmer**. The CTA color is **waldhonig** instead of gold -- warm and inviting but earthy, like a clay pot on the windowsill.

**WCAG Contrast Verification:**
| Combination | Ratio | Rating |
|-------------|-------|--------|
| #333333 on #FAFAF7 (body text) | ~12:1 | AAA |
| #4A6741 on #FAFAF7 (links) | ~5.8:1 | AA |
| #FFFFFF on #C07B54 (CTA text on waldhonig) | ~4.6:1 | AA |
| #FFFFFF on #4A6741 (white on dark green) | ~6.5:1 | AA |

### Typography

**Font Pairing: DM Sans + DM Sans**

A single font family keeps things simple and unpretentious -- no serif/sans contrast that signals "boutique hotel." DM Sans is modern, friendly, geometric, and extremely readable. It has the warmth of a humanist sans-serif without any of the formality of a serif.

| Role                | Font    | Weight         | Size (Desktop) | Size (Mobile) |
| ------------------- | ------- | -------------- | -------------- | ------------- |
| H1 (page titles)    | DM Sans | 700 (Bold)     | 48px           | 32px          |
| H2 (section titles) | DM Sans | 600 (Semibold) | 36px           | 26px          |
| H3 (card titles)    | DM Sans | 600 (Semibold) | 24px           | 20px          |
| Body text           | DM Sans | 400 (Regular)  | 18px           | 18px          |
| Body large          | DM Sans | 400            | 20px           | 18px          |
| UI / labels         | DM Sans | 500 (Medium)   | 16px           | 16px          |
| Button text         | DM Sans | 600            | 18px           | 16px          |
| Small / caption     | DM Sans | 400            | 14px           | 14px          |

**Why DM Sans:**

- **Modern but friendly** -- geometric structure with soft, rounded terminals. Feels approachable, not corporate
- **Single-family simplicity** -- one font for everything = no fuss, just like the pension itself
- **Excellent readability** -- large x-height, open apertures, clear at 18px+ for the 50-60 age group
- **Free** via Google Fonts, variable font for performance
- **Widely supported** -- used by modern brands that want to feel accessible, not exclusive

**Alternative if a heading accent is desired:** Use **DM Serif Display** only for H1 page titles -- it's the serif companion to DM Sans. Warm, readable, slightly more character than DM Sans Bold but still grounded (not ornate like Playfair Display).

**Typography rules:**

- Line height: 1.7 for body, 1.2 for headings
- Max line length: 70 characters (`max-w-prose`)
- Always left-aligned (never justified)
- No uppercase transforms on running text (only on small labels/badges if needed)
- All text fully resizable (no `maximum-scale` restriction)

### Spacing & Layout

- Section padding: 80px vertical (desktop), 56px (mobile) -- generous but not extravagant
- Content max-width: 1200px, centered
- Grid: 12-column on desktop, single column on mobile
- Card gap: 24px
- Touch targets: minimum 48x48px (56px preferred for CTAs)
- Border radius: 8px (cards), 8px (images), 8px (buttons) -- consistent, not too round, not too sharp
- No drop shadows on cards -- use subtle borders or background color shifts instead (less "polished")

### Motion & Animation

Minimal. The site should feel **solid and reliable**, not animated and flashy. Animations are functional, not decorative.

| Element          | Animation                       | Duration | Trigger          |
| ---------------- | ------------------------------- | -------- | ---------------- |
| Section elements | Simple fade-in (opacity 0 -> 1) | 500ms    | Scroll into view |
| Room cards       | Slight border-color change      | 200ms    | Hover            |
| Hero video       | None (just plays)               | --       | On load          |
| Page transitions | None (instant navigation, SSG)  | --       | Navigation       |
| Image gallery    | Simple slide                    | 400ms    | Click/swipe      |
| CTA buttons      | Background darken               | 150ms    | Hover            |

**No parallax, no Ken Burns, no scale transforms, no elaborate reveals.** The content is the experience -- the UI just gets out of the way.

**Reduced motion:** All animations respect `prefers-reduced-motion: reduce`. When active, everything is instant.

---

## 5. Component Library

### Key Components

| Component             | Description                                                     | Usage                    |
| --------------------- | --------------------------------------------------------------- | ------------------------ |
| `AppHeader`           | Sticky header with logo, nav (5-7 items), CTA button            | Every page               |
| `AppFooter`           | 4-column footer with contact, links, legal, social              | Every page               |
| `HeroVideo`           | Full-width video background with text overlay + booking widget  | Homepage                 |
| `HeroImage`           | Full-width image with text overlay + breadcrumb                 | Subpages                 |
| `BookingWidget`       | Check-in/out date picker + guests + CTA                         | Hero, sticky bar         |
| `BookingBar`          | Compact sticky booking bar (desktop) / floating button (mobile) | Every page               |
| `RoomCard`            | Photo + name + features + price + CTA                           | Rooms overview, homepage |
| `RoomGallery`         | Image carousel with thumbnails and lightbox                     | Room detail              |
| `FeatureGrid`         | Icon + title + short text in 3-column grid                      | Homepage, room detail    |
| `TestimonialCarousel` | Rotating guest quotes with star ratings                         | Homepage                 |
| `ActivityCard`        | Photo + activity name + distance badge                          | Activities page          |
| `SustainabilityIcon`  | Icon + label for eco features (solar, bio, etc.)                | Homepage, sustainability |
| `ContactForm`         | Name, email, phone, message, GDPR consent                       | Contact page             |
| `MapEmbed`            | OpenStreetMap or Google Maps embed with pension marker          | Contact, homepage        |
| `CookieConsent`       | GDPR-compliant cookie banner                                    | Every page               |
| `BreadcrumbNav`       | Page hierarchy trail                                            | All subpages             |
| `SeoHead`             | Dynamic meta tags, OG, structured data                          | Every page               |

### Booking Integration Architecture

```
                  Website (Nuxt 3 SSG)
                         |
            +------------+------------+
            |            |            |
     BookingWidget  BookingBar   RoomDetail
            |            |            |
            +------+-----+-----+-----+
                   |           |
              [Beds24 JS Widget API]
                   |
          Beds24 Backend (existing)
                   |
        +----------+----------+
        |          |          |
   Booking.com  Airbnb  Direct Bookings
```

**Implementation approach:**

1. Embed Beds24 booking widget via their JavaScript API
2. Style the widget to match the site's design tokens (colors, fonts, spacing)
3. Each room detail page passes its `propid` / room type to pre-filter the widget
4. Homepage widget shows all properties
5. Booking bar on every page triggers the widget in a modal overlay
6. No external redirects to beds24.com

---

## 6. Technology Stack

### Core Stack

| Layer               | Technology   | Version             | Rationale                                                       |
| ------------------- | ------------ | ------------------- | --------------------------------------------------------------- |
| **Framework**       | Nuxt 3       | 3.x (latest)        | Vue 3-based, SSG for perfect performance, SEO-first, TypeScript |
| **UI Framework**    | Vue 3        | 3.x                 | Composition API, reactivity, component model                    |
| **Styling**         | Tailwind CSS | v4                  | Utility-first, design tokens, responsive, purge unused CSS      |
| **Build Tool**      | Vite         | (bundled with Nuxt) | Instant HMR, fast builds, native ESM                            |
| **Language**        | TypeScript   | 5.x                 | Type safety, better DX, IDE support                             |
| **Package Manager** | pnpm         | latest              | Fast, disk-efficient                                            |

### Nuxt 3 Modules

| Module            | Purpose                                                                     |
| ----------------- | --------------------------------------------------------------------------- |
| `@nuxt/image`     | Image optimization -- automatic WebP/AVIF, responsive srcsets, lazy loading |
| `@nuxt/fonts`     | Automatic font loading optimization (DM Sans)                               |
| `@nuxtjs/i18n`    | Internationalization -- German primary, English future                      |
| `@nuxtjs/sitemap` | Auto-generate XML sitemap for SEO                                           |
| `@nuxtjs/robots`  | robots.txt management                                                       |
| `nuxt-schema-org` | Structured data (LodgingBusiness, Room, FAQPage, BreadcrumbList)            |
| `@vueuse/nuxt`    | Utility composables (intersection observer for scroll animations, etc.)     |
| `@nuxt/scripts`   | Safe third-party script loading (Beds24 widget, analytics, cookie consent)  |

### Content Management

| Option                        | Approach                                                                                                                                                                     |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nuxt Content**              | Markdown/YAML files in `/content/` directory for room descriptions, activity listings, text blocks. Owner can edit Markdown files or we build a simple admin interface later |
| **Alternative: Headless CMS** | If the owner needs a visual editor, connect Storyblok or Directus (self-hosted). Not needed initially -- start with Nuxt Content                                             |

### Rendering Strategy

**Full SSG (Static Site Generation)** -- all pages pre-rendered at build time:

| Page              | Rendering         | Notes                              |
| ----------------- | ----------------- | ---------------------------------- |
| All content pages | SSG               | Pre-rendered HTML, served from CDN |
| Booking widget    | CSR (client-side) | Beds24 JS loads in browser         |
| Contact form      | CSR (client-side) | Form submission via API            |
| Cookie consent    | CSR (client-side) | Dynamic consent state              |

**Result:** Near-instant page loads, perfect Core Web Vitals, optimal SEO.

### Hosting & Deployment

| Service                           | Purpose                                | Cost                              |
| --------------------------------- | -------------------------------------- | --------------------------------- |
| **Netlify** (recommended)         | SSG hosting with global CDN            | Free tier (100GB bandwidth/month) |
| **Alternative: Vercel**           | Same capabilities                      | Free tier                         |
| **Alternative: Cloudflare Pages** | Same capabilities, best global CDN     | Free tier                         |
| **Domain**                        | pension-volgenandt.de (keep existing)  | Already owned                     |
| **DNS**                           | Cloudflare (free) or current registrar | Free                              |
| **Email**                         | Keep existing provider                 | Already configured                |

**Deployment pipeline:**

```
Git push to main
    -> Netlify auto-builds (nuxt generate)
    -> Deploys to global CDN
    -> Cache invalidation
    -> Live in ~60 seconds
```

### Image Pipeline

```
Source images (JPG/PNG, any size)
    |
    v
@nuxt/image processes at build time
    |
    +-> WebP (primary format, 30-50% smaller)
    +-> AVIF (modern format, 50-70% smaller, with WebP fallback)
    +-> Responsive sizes: 640w, 768w, 1024w, 1280w, 1920w
    +-> Lazy loading via loading="lazy" + IntersectionObserver
    +-> Blur placeholder (LQIP) while loading
```

### Hero Video Pipeline

```
Source: Aerial drone footage (existing YouTube video or new filming)
    |
    v
ffmpeg processing:
    +-> WebM (VP9, 720p, 24fps, ~3MB) -- primary
    +-> MP4 (H.264, 720p, 24fps, ~4MB) -- fallback
    +-> Static poster image (WebP, 1920x1080, ~200KB) -- mobile + preload
    |
    v
Served from CDN (Netlify/Cloudflare)
    - Desktop (>768px): autoplay muted loop video
    - Mobile (<768px): static poster image only (saves bandwidth)
```

---

## 7. SEO Strategy

### Technical SEO

| Element               | Implementation                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| **Structured Data**   | `LodgingBusiness` (organization), `Room` (per room), `BreadcrumbList`, `FAQPage` via `nuxt-schema-org` |
| **Sitemap**           | Auto-generated XML sitemap via `@nuxtjs/sitemap`                                                       |
| **robots.txt**        | Via `@nuxtjs/robots`                                                                                   |
| **Canonical URLs**    | Auto-generated per page                                                                                |
| **hreflang**          | `de` primary, `en` when English is added                                                               |
| **Meta tags**         | Dynamic title, description, OG tags per page via `useHead()`                                           |
| **Page speed**        | SSG + CDN = <200ms TTFB, <2.5s LCP target                                                              |
| **Mobile-friendly**   | Responsive design, no viewport restrictions                                                            |
| **HTTPS**             | Enforced (Netlify/Cloudflare provides free SSL)                                                        |
| **Alt text**          | Every image gets descriptive German alt text                                                           |
| **Heading hierarchy** | Strict H1 > H2 > H3 per page                                                                           |
| **Internal linking**  | Room cards link to details, breadcrumbs, related rooms                                                 |

### Target Lighthouse Scores

| Category       | Current     | Target  |
| -------------- | ----------- | ------- |
| Performance    | 48 (mobile) | **95+** |
| Accessibility  | 70          | **95+** |
| Best Practices | 73          | **100** |
| SEO            | 83          | **100** |

### Local SEO

- Google Business Profile optimization (already exists, needs updating)
- Local schema markup with `GeoCoordinates`, `areaServed`
- "Pension in Eichsfeld" / "Ferienwohnung Breitenbach" keyword targeting
- German-language content with natural keyword integration

---

## 8. Legal Compliance (Germany)

| Requirement                         | Status        | Action                                                             |
| ----------------------------------- | ------------- | ------------------------------------------------------------------ |
| **Impressum** (TMG SS 5)            | MISSING       | Create with full business details, tax ID, responsible person      |
| **Datenschutzerklarung** (GDPR)     | BROKEN LINK   | Create comprehensive privacy policy                                |
| **Cookie Consent** (ePrivacy/TTDSG) | MISSING       | Implement GDPR-compliant cookie banner (e.g., Cookiebot or custom) |
| **AGB**                             | MISSING       | Create terms and conditions for bookings                           |
| **Booking cancellation policy**     | Unclear       | Display clearly on room pages and booking flow                     |
| **Price display** (PAngV)           | NOT COMPLIANT | Show prices with VAT included, indicate "per night"                |

---

## 9. Performance Budget

| Metric                                | Budget                      |
| ------------------------------------- | --------------------------- |
| **Total page weight** (without video) | < 1.5 MB                    |
| **Hero video**                        | < 5 MB (desktop only)       |
| **LCP**                               | < 2.5s                      |
| **FCP**                               | < 1.5s                      |
| **CLS**                               | < 0.1                       |
| **TBT**                               | < 200ms                     |
| **TTFB**                              | < 200ms                     |
| **JavaScript bundle**                 | < 150 KB (gzipped)          |
| **CSS**                               | < 30 KB (Tailwind purged)   |
| **Fonts**                             | < 100 KB (subset, woff2)    |
| **Largest image**                     | < 300 KB (WebP, responsive) |

---

## 10. Project Structure

```
pension-volgenandt-website/
|
+-- .planning/               # Assessment & design docs (this folder)
+-- .github/                  # CI/CD workflows
|
+-- app/
|   +-- assets/
|   |   +-- css/
|   |   |   +-- main.css      # Tailwind directives + custom styles
|   |   +-- images/           # Source images (processed by @nuxt/image)
|   |   +-- video/            # Hero video files (WebM + MP4)
|   |
|   +-- components/
|   |   +-- app/              # App-wide: AppHeader, AppFooter, CookieConsent
|   |   +-- booking/          # BookingWidget, BookingBar, BookingModal
|   |   +-- rooms/            # RoomCard, RoomGallery, RoomAmenities
|   |   +-- sections/         # HeroVideo, HeroImage, Testimonials, FeatureGrid
|   |   +-- ui/               # Button, Card, Badge, Icon (base components)
|   |
|   +-- composables/          # Shared logic (useBooking, useAnimation, etc.)
|   +-- layouts/
|   |   +-- default.vue       # Main layout (header + content + footer)
|   |
|   +-- pages/
|   |   +-- index.vue         # Homepage
|   |   +-- zimmer/
|   |   |   +-- index.vue     # Rooms overview
|   |   |   +-- [slug].vue    # Room detail (dynamic route)
|   |   +-- familie.vue       # Family / Kind & Kegel
|   |   +-- aktivitaeten.vue  # Activities
|   |   +-- nachhaltigkeit.vue # Sustainability
|   |   +-- kontakt.vue       # Contact
|   |   +-- impressum.vue     # Legal
|   |   +-- datenschutz.vue   # Legal
|   |   +-- agb.vue           # Legal
|   |
|   +-- content/              # Nuxt Content (Markdown/YAML)
|   |   +-- rooms/            # Room data: emils-kuhwiese.yml, etc.
|   |   +-- activities/       # Activity descriptions
|   |   +-- testimonials.yml  # Guest reviews
|   |   +-- sustainability.md # Eco content
|   |
|   +-- public/               # Static files (favicon, robots.txt override)
|
+-- nuxt.config.ts            # Nuxt configuration
+-- tailwind.config.ts        # Tailwind design tokens
+-- tsconfig.json             # TypeScript config
+-- package.json
+-- pnpm-lock.yaml
```

---

## 11. Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f4f7f3',
          100: '#e6ede3',
          200: '#cddbc7',
          300: '#a8c49a',
          400: '#7a9b6d', // Primary brand
          500: '#5a7d4e',
          600: '#4a6741', // Dark / links / buttons
          700: '#3b5234',
          800: '#31432c',
          900: '#2c3e2d',
        },
        stone: {
          50: '#FAFAF7', // Primary background (warm white)
          100: '#F0EDE8', // Alt section background
          200: '#E4DDD3',
          300: '#D4D0CB', // Borders
        },
        wood: {
          300: '#C4B59B', // Sand / badges
          400: '#8B7355', // Warm wood accent
          500: '#5C4A37', // Dark wood
        },
        terra: {
          400: '#C07B54', // CTA: waldhonig
          500: '#A86842', // CTA hover
          600: '#8F5835', // CTA active
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        body: ['1.125rem', { lineHeight: '1.75' }], // 18px
        'body-lg': ['1.25rem', { lineHeight: '1.75' }], // 20px
      },
      maxWidth: {
        prose: '70ch',
        content: '1200px',
      },
      spacing: {
        section: '5rem', // 80px section padding
        'section-sm': '3.5rem', // 56px mobile section padding
      },
      borderRadius: {
        card: '0.5rem', // 8px -- consistent everywhere
      },
    },
  },
} satisfies Config
```

---

## 12. Content Migration Checklist

### Text Content (from current site)

| Current Page              | Migration Target                            | Status                                  |
| ------------------------- | ------------------------------------------- | --------------------------------------- |
| Uber uns (homepage)       | Homepage welcome section                    | Rewrite (shorter, more impactful)       |
| Ferienwohnungen & Zimmer  | `/zimmer/` overview + individual room pages | Rewrite + add prices, amenity details   |
| Kind & Kegel              | `/familie/`                                 | Keep (strongest content), light edit    |
| Aktivitaten               | `/aktivitaeten/`                            | Rewrite (add distances, seasonal info)  |
| Ein kleiner Umweltgedanke | `/nachhaltigkeit/`                          | Expand with specifics (kWh solar, etc.) |
| Kontakt                   | `/kontakt/`                                 | Keep address/phone, add map, fix form   |

### Images (from current site)

- Current images are unoptimized JPGs on 1&1 servers
- All images need: download, rename descriptively, add alt text, process through @nuxt/image pipeline
- Commission new photography if budget allows -- honest, natural shots: rooms as they actually look (not staged), the garden on a normal day, a real breakfast table, seasonal views. No heavy editing, no luxury staging

### New Content Needed

| Content                      | Priority | Notes                                              |
| ---------------------------- | -------- | -------------------------------------------------- |
| Room descriptions (per room) | P0       | Name, description, amenities list, capacity, price |
| Prices per room (per night)  | P0       | Seasonal pricing if applicable                     |
| Extras pricing               | P0       | Breakfast EUR 10/15, dog EUR 10, BBQ EUR 10        |
| Guest testimonials           | P1       | Source from Booking.com/Google reviews             |
| Impressum                    | P0       | Legal requirement                                  |
| Datenschutzerklarung         | P0       | Legal requirement                                  |
| AGB                          | P1       | Booking terms                                      |
| Image alt text (German)      | P0       | Every image needs descriptive alt text             |

---

## 13. Development Phases

### Phase 1: Foundation (Week 1-2)

- Project setup: Nuxt 3 + Tailwind CSS + TypeScript + modules
- Design system: colors, typography, spacing, base components (`Button`, `Card`, `Icon`)
- Layout: `AppHeader`, `AppFooter`, `default.vue` layout
- Legal pages: Impressum, Datenschutz (content from owner)
- Cookie consent implementation
- Basic SEO setup: structured data, sitemap, robots.txt

### Phase 2: Core Pages (Week 3-4)

- Homepage with hero video, sections, booking widget placeholder
- Rooms overview page with room cards
- Room detail page template (dynamic route `[slug].vue`)
- Content files for all rooms (Nuxt Content YAML)
- Image pipeline setup and optimization
- Scroll animations (fade-in reveals)

### Phase 3: Booking Integration (Week 5)

- Beds24 widget embedding (JavaScript API)
- BookingWidget component (hero section)
- BookingBar component (sticky header / floating mobile button)
- Room-specific booking pre-filtering
- Configure Beds24 upsell items (breakfast, extras)
- Test full booking flow end-to-end

### Phase 4: Remaining Pages & Polish (Week 6-7)

- Family page (Kind & Kegel)
- Activities page
- Sustainability page
- Contact page with form + map
- Testimonials section (with manual or API-sourced reviews)
- Mobile optimization and testing
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Accessibility audit (keyboard nav, screen reader, contrast)

### Phase 5: Launch (Week 8)

- Performance audit (Lighthouse, PageSpeed Insights)
- SEO final check (structured data testing, sitemap verification)
- DNS migration from 1&1 to Netlify/Cloudflare
- Go-live monitoring
- Google Search Console setup
- Google Business Profile update with new website

---

## 14. Cost Estimate

### Development

| Item                                    | Estimated Effort |
| --------------------------------------- | ---------------- |
| Design system + base components         | 2-3 days         |
| Homepage (hero video, sections)         | 2-3 days         |
| Room pages (overview + detail template) | 2-3 days         |
| Beds24 booking integration              | 2-3 days         |
| Remaining content pages                 | 2-3 days         |
| Legal pages + cookie consent            | 1 day            |
| SEO + structured data                   | 1 day            |
| Testing + polish                        | 2-3 days         |
| **Total**                               | **~15-20 days**  |

### Ongoing Costs

| Item                        | Monthly Cost                        |
| --------------------------- | ----------------------------------- |
| Hosting (Netlify free tier) | EUR 0                               |
| Domain (already owned)      | EUR 0/month (annual renewal)        |
| Beds24 (existing)           | ~EUR 35/month                       |
| SSL certificate             | EUR 0 (included with Netlify)       |
| **Total ongoing**           | **~EUR 35/month** (same as current) |

### Optional Investments

| Item                                         | One-time Cost |
| -------------------------------------------- | ------------- |
| Professional photography session             | EUR 300-600   |
| New drone video (10-15s, 720p optimized)     | EUR 200-400   |
| Beds24 custom branding (remove "powered by") | EUR 19/month  |
| Google Workspace (professional email)        | EUR 6/month   |

---

## 15. Summary

### What Changes

| Aspect            | Current                               | Proposed                                 |
| ----------------- | ------------------------------------- | ---------------------------------------- |
| **Platform**      | 1&1 IONOS Website Builder             | Nuxt 3 + Tailwind CSS (SSG)              |
| **Hosting**       | 1&1 shared hosting                    | Netlify CDN (global, free)               |
| **Design**        | Dated, cluttered, low contrast        | Modern-minimal, clean, down-to-earth     |
| **Typography**    | Decorative script (hard to read)      | DM Sans (friendly, modern, readable)     |
| **Colors**        | Olive green + rainbow headings        | Sage green + warm white + waldhonig CTAs |
| **Vibe**          | Trying to look fancy but dated        | Honest, grounded, "come as you are"      |
| **Hero**          | Static photo                          | Looping drone video (desktop)            |
| **Booking**       | External redirect to beds24.com       | Embedded widget on every page            |
| **Pricing**       | Hidden in booking system              | Visible on every room card               |
| **Extras**        | Not bookable                          | Breakfast, dog fee, BBQ bookable         |
| **Legal**         | Missing Impressum, broken Datenschutz | Full compliance                          |
| **SEO**           | 83/100, no structured data            | 100/100, full Schema.org markup          |
| **Performance**   | 48/100 mobile                         | 95+/100 mobile                           |
| **Accessibility** | 70/100, 94% images lack alt           | 95+/100, full WCAG AA compliance         |
| **Rooms**         | All on one page, no prices            | Individual pages with prices and gallery |
| **Mobile**        | Poor (22.3s LCP)                      | Excellent (<2.5s LCP)                    |

### What Stays the Same

- **Domain:** pension-volgenandt.de
- **Booking system:** Beds24 (optimized, not replaced)
- **Content spirit:** Warm, family-run, down-to-earth, nature-loving
- **Monthly cost:** ~EUR 35/month (Beds24 only, hosting is free)
- **Kind & Kegel content:** Strongest existing page, kept and enhanced

---

_Proposal based on analysis of 2 reference websites (Pension zur Krone, Chalten Suites Hotel), the existing pension aerial video, comprehensive market research of hospitality design trends 2025-2026, and audit of the current website. All design decisions optimized for the target audience (50-60 year old couples, families, business travelers) and the brand identity (down-to-earth, minimalistic, modern, calm, nature, Eichsfeld)._

_Detailed design research available in: `.planning/design-research.md`_
_Current website audit: `.planning/website-assessment.md`_
_Booking system assessment: `.planning/booking-system-assessment.md`_
