# Phase 4: Content Pages, Attractions & SEO - Research

**Researched:** 2026-02-22
**Domain:** Content pages (Vue components), Phosphor Icons (duotone), OpenStreetMap (Leaflet with consent), contact forms (Netlify Forms/Formspree), FAQ accordion, Schema.org structured data (BedAndBreakfast, FAQPage, BreadcrumbList), Nuxt SEO module (@nuxtjs/seo), breadcrumbs, meta tags, sitemap, robots.txt
**Confidence:** HIGH

## Summary

Phase 4 is the largest phase in the roadmap, delivering all content pages (Familie, Aktivitaeten, Nachhaltigkeit, Kontakt), 5 attraction landing pages, 2 activity pages, an Ausflugsziele overview page with interactive map, a FAQ accordion section with structured data, and complete technical SEO across the entire site. It depends on Phases 1-3 for the design system, layout, content infrastructure (Nuxt Content v3 YAML collections), and homepage patterns.

The standard approach is: use `@nuxtjs/seo` as the unified SEO module (bundles sitemap, robots, schema-org, breadcrumbs, OG images, link checker, and site config) instead of installing individual SEO modules separately. Use `@nuxt/icon` + `@iconify-json/ph` for Phosphor Icons through the existing Iconify infrastructure (the Iconify Phosphor set includes all 6 weights -- thin, light, regular, bold, fill, duotone -- as separate icon names with the naming pattern `ph:icon-name-duotone`). For the Ausflugsziele overview map, use `@nuxtjs/leaflet` with a two-click consent wrapper (static placeholder image that loads the interactive Leaflet map only after user clicks to consent). For the contact form, build for Netlify Forms with a Formspree fallback strategy (the hosting decision between Netlify and Cloudflare Pages must be made before this phase). For structured data, use `nuxt-schema-org`'s `defineLocalBusiness` with `@type: 'BedAndBreakfast'` for site identity and raw `useSchemaOrg` calls for FAQPage and HotelRoom+Offer schemas.

Key discoveries: (1) Google restricted FAQ rich results in September 2023 to government/health sites only -- FAQPage schema still has SEO value for AI citations and search understanding but will NOT produce visible rich snippets for this pension site; (2) the Iconify `@iconify-json/ph` package contains all 9,072 Phosphor icon variants (all 6 weights) and works through the existing `@nuxt/icon` module, so there is NO need for a separate `nuxt-phosphor-icons` module or `@phosphor-icons/vue` library; (3) `@nuxtjs/seo` includes `nuxt-seo-utils` which provides `useBreadcrumbItems()` -- an auto-generated breadcrumb composable with Schema.org BreadcrumbList integration, eliminating the need for a custom breadcrumb component; (4) OpenStreetMap tiles from tile.openstreetmap.org transmit user IP addresses to third-party servers outside the EU, requiring DSGVO consent -- the Ausflugsziele interactive map MUST use a two-click consent pattern or consent-gated loading.

**Primary recommendation:** Install `@nuxtjs/seo` as a single module replacing all individual SEO modules. Use `@iconify-json/ph` with the existing `@nuxt/icon` for Phosphor Icons. Build the Ausflugsziele map with `@nuxtjs/leaflet` wrapped in a consent-gated component that shows a static placeholder until the user clicks to load the interactive map. Build the contact form with Netlify Forms (hidden form detection pattern for SSG).

## Standard Stack

### Core (Phase 4 additions to existing Phase 1+2+3 stack)

| Library            | Version | Purpose                         | Why Standard                                                                                                                                                          |
| ------------------ | ------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@nuxtjs/seo`      | ^3.4.x  | Unified SEO module              | Bundles 7 sub-modules: sitemap, robots, schema-org, seo-utils, og-image, link-checker, site-config. Single install, zero-config defaults, all modules share site URL. |
| `@iconify-json/ph` | latest  | Phosphor Icons data for Iconify | All 9,072 Phosphor icon variants (6 weights x 1,512 base icons) served through existing `@nuxt/icon`. No separate module needed.                                      |
| `@nuxtjs/leaflet`  | ^1.3.x  | Leaflet map for Vue/Nuxt        | Official Nuxt module wrapping vue-leaflet. Auto-imports LMap, LTileLayer, LMarker, LPopup. Required for Ausflugsziele overview and Kontakt page maps.                 |

### Supporting (already in stack from Phase 1+2+3)

| Library              | Version | Purpose                    | When to Use                                                                 |
| -------------------- | ------- | -------------------------- | --------------------------------------------------------------------------- |
| `@nuxt/content`      | ^3.x    | YAML data collections      | Attraction data files, FAQ data, activity data                              |
| `@nuxt/icon`         | ^1.x    | Icon component via Iconify | Renders Phosphor icons using `<Icon name="ph:icon-name-duotone" />` pattern |
| `@nuxt/image`        | ^2.x    | Image optimization         | All page photos, banner images, attraction photos                           |
| `@vueuse/nuxt`       | ^14.x   | Composable utilities       | `useElementVisibility` for scroll animations on content pages               |
| `embla-carousel-vue` | ^8.x    | Carousel component         | Not directly used in Phase 4, but available if needed                       |

### Replaced/Superseded

| Don't Install                  | Replaced By                       | Reason                                                                                                                            |
| ------------------------------ | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `@nuxtjs/sitemap` (standalone) | `@nuxtjs/seo` (bundled)           | `@nuxtjs/seo` includes sitemap module. Installing both causes conflicts.                                                          |
| `@nuxtjs/robots` (standalone)  | `@nuxtjs/seo` (bundled)           | `@nuxtjs/seo` includes robots module.                                                                                             |
| `nuxt-schema-org` (standalone) | `@nuxtjs/seo` (bundled)           | `@nuxtjs/seo` includes schema-org module.                                                                                         |
| `nuxt-phosphor-icons`          | `@nuxt/icon` + `@iconify-json/ph` | Low download count (4,962/month), uncertain Nuxt 4 compat. Iconify approach reuses existing infrastructure.                       |
| `@phosphor-icons/vue`          | `@nuxt/icon` + `@iconify-json/ph` | Direct Vue library requires manual imports and loses auto-import + server bundle benefits of @nuxt/icon.                          |
| `@iconify-json/lucide`         | Keep alongside `@iconify-json/ph` | Lucide was installed in Phase 2 for amenity icons. Keep it -- both icon sets work through @nuxt/icon simultaneously. No conflict. |

### Alternatives Considered

| Instead of           | Could Use              | Tradeoff                                                                                                                                                                                                                                |
| -------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@nuxtjs/seo` bundle | Individual modules     | More control but 7 separate installs, 7 separate configs, more maintenance. The bundle has sensible defaults and is maintained by the same author.                                                                                      |
| `@nuxtjs/leaflet`    | Static map images only | Zero consent issues but no interactivity. The Ausflugsziele overview page needs pins for 7 attractions -- a static image cannot show hover states or popups. The two-click consent pattern solves DSGVO while preserving interactivity. |
| Netlify Forms        | Formspree              | Formspree works on any host (including Cloudflare Pages) but has a lower free tier (50 submissions/month vs 100 for Netlify). If hosting is Netlify, use Netlify Forms. If hosting is Cloudflare Pages, use Formspree.                  |
| Netlify Forms        | Web3Forms              | GDPR-friendly, 250 free submissions/month, works anywhere. Good fallback if neither Netlify Forms nor Formspree fits.                                                                                                                   |
| Custom FAQ accordion | Headless UI accordion  | Headless UI adds a dependency for a simple expand/collapse interaction. A custom accordion using Vue `v-show` + CSS transitions is ~30 lines and fully accessible with proper ARIA attributes.                                          |

**Installation:**

```bash
# Phase 4 additions (Phase 1+2+3 deps already installed)
pnpm add -D @iconify-json/ph
pnpm add @nuxtjs/seo @nuxtjs/leaflet
```

## Architecture Patterns

### Recommended Project Structure (Phase 4 additions)

```
content/
  attractions/                   # Attraction YAML data (1 per attraction)
    baerenpark-worbis.yml
    burg-bodenstein.yml
    burg-hanstein.yml
    skywalk-sonnenstein.yml
    baumkronenpfad-hainich.yml
  activities/                    # Activity YAML data (1 per activity)
    wandern.yml
    radfahren.yml
  faq/
    index.yml                    # FAQ items array for /kontakt/ page

app/
  components/
    content/                     # Shared content page components
      PageBanner.vue             # Thin photo-backed banner (300px desktop / 200px mobile)
      FeatureGrid.vue            # 2x2 or 3x2 icon feature grid
      SoftCta.vue                # Soft CTA block ("Oder rufen Sie uns an...")
      BookingCta.vue             # Booking CTA block (links to room pages)
      DistanceBadge.vue          # "12 km / 15 min" distance badge
      HostTip.vue                # "Unser Tipp: ..." callout box
    attractions/                 # Attraction-specific components
      Card.vue                   # <AttractionsCard> for overview grid
      MapConsent.vue             # Two-click consent wrapper for Leaflet map
      Map.vue                    # Leaflet map with attraction pins
    contact/                     # Contact page components
      Form.vue                   # Contact form (Netlify Forms / Formspree)
      FaqAccordion.vue           # FAQ accordion with expand/collapse
      FaqItem.vue                # Single FAQ item
      DirectionsMap.vue          # OpenStreetMap with pension pin (consent-gated)
    ui/
      BreadcrumbNav.vue          # Breadcrumb navigation component

  pages/
    familie.vue                  # /familie/
    aktivitaeten/
      index.vue                  # /aktivitaeten/
      wandern.vue                # /aktivitaeten/wandern/
      radfahren.vue              # /aktivitaeten/radfahren/
    nachhaltigkeit.vue           # /nachhaltigkeit/
    kontakt.vue                  # /kontakt/ (includes FAQ accordion)
    ausflugsziele/
      index.vue                  # /ausflugsziele/ (map + card grid)
      [slug].vue                 # /ausflugsziele/[slug] (attraction detail)
    [...slug].vue                # Custom 404 page (catch-all)

content.config.ts                # Add attractions + activities + faq collections
```

### Pattern 1: Phosphor Icons via Iconify (@nuxt/icon)

**What:** Use Phosphor Icons through the existing `@nuxt/icon` + Iconify infrastructure. The `@iconify-json/ph` package provides all 9,072 Phosphor icon variants (1,512 base icons x 6 weights). Access different weights by appending the weight suffix to the icon name.

**When to use:** All feature icons on content pages, attraction badges, and inline icons throughout Phase 4.

**Naming convention:**

```
ph:icon-name           → regular weight (default)
ph:icon-name-thin      → thin weight
ph:icon-name-light     → light weight
ph:icon-name-bold      → bold weight
ph:icon-name-fill      → fill weight (solid)
ph:icon-name-duotone   → duotone weight (two-tone)
```

**Example -- per CONTEXT.md decisions (duotone for feature highlights, regular for body, fill for small inline):**

```vue
<!-- Feature grid: 40px duotone icons -->
<Icon name="ph:tree-duotone" class="size-10 text-sage-600" />

<!-- Body text inline: regular weight -->
<Icon name="ph:map-pin" class="inline size-5 text-sage-500" />

<!-- Small inline badges: fill weight -->
<Icon name="ph:star-fill" class="size-4 text-waldhonig-400" />
```

**Duotone color control:** Phosphor duotone icons use `currentColor` for the primary stroke and a reduced-opacity version for the secondary fill. In Iconify/SVG mode, the secondary layer has `opacity: 0.2` by default. Control the primary color with Tailwind text color classes. To adjust the secondary opacity, target the SVG layer with CSS:

```css
/* Increase duotone secondary opacity from 0.2 to 0.3 */
:deep(svg .duotone-secondary) {
  opacity: 0.3;
}
```

**Recommended Phosphor icons for content pages (Claude's Discretion):**

| Feature                 | Icon Name                  | Weight  |
| ----------------------- | -------------------------- | ------- |
| Spielplatz (playground) | `ph:baby-duotone`          | duotone |
| Garten (garden)         | `ph:plant-duotone`         | duotone |
| Fahrrad (bicycle)       | `ph:bicycle-duotone`       | duotone |
| Wandern (hiking)        | `ph:mountains-duotone`     | duotone |
| Solarenergie            | `ph:sun-duotone`           | duotone |
| Kompost/Recycling       | `ph:recycle-duotone`       | duotone |
| Wasser/Klaeranlage      | `ph:drop-duotone`          | duotone |
| Insektenschutz          | `ph:butterfly-duotone`     | duotone |
| Telefon                 | `ph:phone`                 | regular |
| Email                   | `ph:envelope-simple`       | regular |
| Anfahrt/Richtung        | `ph:navigation-arrow`      | regular |
| Uhr/Oeffnungszeiten     | `ph:clock`                 | regular |
| Entfernung              | `ph:map-pin-line`          | regular |
| Kinder                  | `ph:baby-duotone`          | duotone |
| Kinderbett              | `ph:bed-duotone`           | duotone |
| Hochstuhl               | `ph:armchair-duotone`      | duotone |
| Tiere/Hund              | `ph:dog-duotone`           | duotone |
| Fruehstueck             | `ph:coffee-duotone`        | duotone |
| Parkplatz               | `ph:car-duotone`           | duotone |
| WLAN                    | `ph:wifi-high-duotone`     | duotone |
| Burg/Kultur             | `ph:castle-turret-duotone` | duotone |
| Natur/Baum              | `ph:tree-duotone`          | duotone |
| Stern/Bewertung         | `ph:star-fill`             | fill    |
| Pfeil rechts            | `ph:arrow-right`           | regular |
| Chevron unten (FAQ)     | `ph:caret-down`            | regular |

### Pattern 2: Thin Photo-Backed Subpage Banner

**What:** A reusable banner component for all content pages: thin photo (300px desktop / 200px mobile), dark gradient overlay, H1 + subtitle as real text, breadcrumbs.

**When to use:** Every content page and attraction page.

```vue
<!-- app/components/content/PageBanner.vue -->
<script setup lang="ts">
defineProps<{
  image: string
  imageAlt: string
  title: string
  subtitle?: string
}>()
</script>

<template>
  <section class="relative h-[200px] overflow-hidden md:h-[300px]">
    <!-- Banner photo -->
    <NuxtImg
      :src="image"
      :alt="imageAlt"
      class="absolute inset-0 h-full w-full object-cover"
      loading="eager"
      sizes="100vw"
    />

    <!-- Dark gradient overlay (bottom-to-top, 80% at bottom) -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

    <!-- Text content -->
    <div class="relative z-10 flex h-full flex-col justify-end px-6 pb-6 md:px-12 lg:px-24">
      <BreadcrumbNav class="mb-2" />
      <h1 class="font-serif text-3xl font-bold text-white md:text-4xl">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="mt-1 text-lg text-white/90">
        {{ subtitle }}
      </p>
    </div>
  </section>
</template>
```

### Pattern 3: Content Page Assembly Pattern

**What:** Each content page follows the locked pattern from CONTEXT.md: thin photo banner -> personal intro -> icon feature grid -> narrative section with photo -> detail list -> soft CTA -> booking CTA.

**When to use:** All content pages (/familie/, /nachhaltigkeit/, /aktivitaeten/).

```vue
<!-- app/pages/familie.vue (structural example) -->
<script setup lang="ts">
useSeoMeta({
  title: 'Familie & Kinder | Pension Volgenandt',
  ogTitle: 'Familie & Kinder | Pension Volgenandt',
  description: 'Familienurlaub im Eichsfeld: Spielplatz, Garten, Kinderfahrzeuge und mehr.',
  ogDescription: 'Familienurlaub im Eichsfeld: Spielplatz, Garten, Kinderfahrzeuge und mehr.',
  ogImage: '/img/banners/familie-banner.webp',
  ogType: 'website',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://www.pension-volgenandt.de/familie/' }],
})
</script>

<template>
  <div>
    <!-- 1. Thin photo banner -->
    <ContentPageBanner
      image="/img/banners/familie-banner.webp"
      image-alt="Kinder spielen im Garten der Pension Volgenandt"
      title="Familie & Kinder"
      subtitle="Bei uns sind die Kleinen die Groessten"
    />

    <!-- 2. Personal intro (2-3 sentences, "Wir" voice) -->
    <section class="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p class="text-lg leading-relaxed text-sage-800">
        Wir wissen, wie wichtig ein Urlaub mit der Familie ist...
      </p>
    </section>

    <!-- 3. Icon feature grid (2x2 or 3x2 desktop / single column mobile) -->
    <section class="bg-cream px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <ContentFeatureGrid :features="familyFeatures" />
      </div>
    </section>

    <!-- 4. Narrative section with photo -->
    <section class="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <div class="grid items-center gap-8 md:grid-cols-2">
        <NuxtImg
          src="/img/content/familie-garten.webp"
          alt="..."
          class="rounded-lg"
          loading="lazy"
        />
        <div>
          <h2 class="font-serif text-2xl font-bold text-sage-900">...</h2>
          <p class="mt-4 leading-relaxed text-sage-800">...</p>
        </div>
      </div>
    </section>

    <!-- 5. Detail list -->
    <!-- 6. Soft CTA -->
    <ContentSoftCta />

    <!-- 7. Booking CTA -->
    <ContentBookingCta />
  </div>
</template>
```

### Pattern 4: Nuxt Content Data Collections for Attractions & FAQ

**What:** Define `attractions`, `activities`, and `faq` data collections in `content.config.ts`. Each attraction gets its own YAML file for rich content. FAQ items are stored in a single YAML file since they all belong to the /kontakt/ page.

```typescript
// content.config.ts (additions to existing Phase 2 config)
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

const attractionSchema = z.object({
  name: z.string(),
  slug: z.string(),
  seoTitle: z.string().max(60),
  seoDescription: z.string().max(155),
  heroImage: z.string(),
  heroImageAlt: z.string(),
  distanceKm: z.number(),
  drivingMinutes: z.number(),
  category: z.enum(['natur', 'kultur', 'aktivitaet']),
  shortDescription: z.string(), // For card display
  intro: z.string(), // 2-3 sentence personal intro
  content: z.string(), // Full article content (3-5 paragraphs)
  hostTip: z.string(), // "Unser Tipp: ..." recommendation
  bestTimeToVisit: z.string().optional(),
  openingHours: z.string().optional(),
  entryPrice: z.string().optional(),
  website: z.string().url().optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  gallery: z
    .array(
      z.object({
        src: z.string(),
        alt: z.string(),
      }),
    )
    .default([]),
  sortOrder: z.number().default(0),
})

const activitySchema = z.object({
  name: z.string(),
  slug: z.string(),
  seoTitle: z.string().max(60),
  seoDescription: z.string().max(155),
  heroImage: z.string(),
  heroImageAlt: z.string(),
  intro: z.string(),
  regionDescription: z.string(), // General overview of the Eichsfeld for this activity
  routes: z
    .array(
      z.object({
        name: z.string(),
        distance: z.string(), // "12 km"
        difficulty: z.enum(['leicht', 'mittel', 'schwer']),
        highlight: z.string(), // One-line highlight
        externalUrl: z.string().url().optional(), // komoot/outdooractive link
      }),
    )
    .min(3)
    .max(5),
  externalPortals: z
    .array(
      z.object({
        name: z.string(), // "komoot", "outdooractive"
        url: z.string().url(),
      }),
    )
    .default([]),
})

const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(), // Can include markdown links
  category: z.enum(['buchung', 'ausstattung', 'umgebung', 'anreise']),
  relatedPage: z.string().optional(), // e.g., "/familie/" for cross-linking
  sortOrder: z.number().default(0),
})

// Add to collections in content.config.ts:
// attractions: defineCollection({
//   type: 'data',
//   source: 'attractions/*.yml',
//   schema: attractionSchema,
// }),
// activities: defineCollection({
//   type: 'data',
//   source: 'activities/*.yml',
//   schema: activitySchema,
// }),
// faq: defineCollection({
//   type: 'data',
//   source: 'faq/index.yml',
//   schema: z.object({ items: z.array(faqItemSchema) }),
// }),
```

### Pattern 5: Two-Click Consent Map Wrapper for Leaflet

**What:** A consent wrapper component that shows a static placeholder image with an overlay button. When the user clicks "Karte laden", the interactive Leaflet map loads. This satisfies DSGVO because no third-party tile server is contacted until the user explicitly consents.

**When to use:** All Leaflet maps on the site -- both the Ausflugsziele overview map and the Kontakt page directions map. This replaces the Phase 3 static-only map approach for pages that need interactivity.

**DSGVO rationale:** Loading tiles from tile.openstreetmap.org transmits the user's IP address to servers outside the EU (Fastly CDN). Under Art. 6 DSGVO, this is personal data processing requiring consent. The two-click pattern (placeholder -> user click -> load map) satisfies TDDDG SS25 because the user initiates the data transfer.

```vue
<!-- app/components/attractions/MapConsent.vue -->
<script setup lang="ts">
defineProps<{
  placeholderImage: string
  placeholderAlt: string
  height?: string
}>()

const mapConsented = ref(false)
const { isAllowed } = useCookieConsent()

// If media consent already granted via cookie banner, skip two-click
const shouldShowMap = computed(() => mapConsented.value || isAllowed('media'))

function loadMap() {
  mapConsented.value = true
}
</script>

<template>
  <div :class="height ?? 'h-[350px] md:h-[450px]'" class="relative overflow-hidden rounded-lg">
    <!-- Placeholder (shown until consent) -->
    <div v-if="!shouldShowMap" class="relative h-full">
      <NuxtImg
        :src="placeholderImage"
        :alt="placeholderAlt"
        class="h-full w-full object-cover"
        loading="lazy"
      />
      <div class="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
        <Icon name="ph:map-pin-duotone" class="mb-3 size-12 text-white" />
        <p class="mb-4 px-4 text-center text-white">
          Zum Laden der interaktiven Karte wird eine Verbindung zu OpenStreetMap-Servern
          hergestellt.
        </p>
        <button
          class="rounded-lg bg-waldhonig-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-waldhonig-600"
          @click="loadMap"
        >
          Karte laden
        </button>
        <a
          href="https://www.openstreetmap.org/?mlat=51.3747&mlon=10.2197#map=13/51.3747/10.2197"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-2 text-sm text-white/80 underline"
        >
          Auf OpenStreetMap ansehen
        </a>
      </div>
    </div>

    <!-- Interactive Leaflet map (loaded after consent) -->
    <ClientOnly v-if="shouldShowMap">
      <slot />
    </ClientOnly>
  </div>
</template>
```

### Pattern 6: FAQ Accordion Component

**What:** A custom accordion component for the FAQ section on /kontakt/. Each item expands/collapses with a smooth CSS transition. Uses proper ARIA attributes for accessibility.

```vue
<!-- app/components/contact/FaqItem.vue -->
<script setup lang="ts">
defineProps<{
  question: string
  answer: string
  isOpen: boolean
}>()

defineEmits<{
  toggle: []
}>()
</script>

<template>
  <div class="border-b border-sage-200">
    <button
      class="flex w-full items-center justify-between py-5 text-left"
      :aria-expanded="isOpen"
      @click="$emit('toggle')"
    >
      <span class="pr-4 text-lg font-semibold text-sage-900">
        {{ question }}
      </span>
      <Icon
        name="ph:caret-down"
        class="size-5 shrink-0 text-sage-500 transition-transform duration-300"
        :class="isOpen ? 'rotate-180' : ''"
      />
    </button>
    <div
      class="overflow-hidden transition-all duration-300"
      :class="isOpen ? 'max-h-96 pb-5' : 'max-h-0'"
    >
      <p class="leading-relaxed text-sage-700" v-html="answer" />
    </div>
  </div>
</template>
```

```vue
<!-- app/components/contact/FaqAccordion.vue -->
<script setup lang="ts">
interface FaqItem {
  question: string
  answer: string
  category: string
  relatedPage?: string
}

defineProps<{
  items: FaqItem[]
}>()

const openIndex = ref<number | null>(null)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <div>
    <ContactFaqItem
      v-for="(item, index) in items"
      :key="index"
      :question="item.question"
      :answer="item.answer"
      :is-open="openIndex === index"
      @toggle="toggle(index)"
    />
  </div>
</template>
```

### Pattern 7: @nuxtjs/seo Configuration

**What:** Unified SEO module providing sitemap, robots, schema-org, breadcrumbs, OG images, and link checking. Requires site URL configuration.

```typescript
// nuxt.config.ts (Phase 4 additions)
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/seo', // MUST load before @nuxt/content
    '@nuxtjs/leaflet',
    // ... existing modules from Phase 1-3
  ],

  // Central site config -- shared by all SEO sub-modules
  site: {
    url: 'https://www.pension-volgenandt.de',
    name: 'Pension Volgenandt',
    description: 'Familiaer gefuehrte Pension in Breitenbach, Eichsfeld.',
    defaultLocale: 'de',
  },

  // Schema.org identity -- BedAndBreakfast
  schemaOrg: {
    identity: {
      type: 'LocalBusiness',
      subtype: 'BedAndBreakfast',
      name: 'Pension Volgenandt',
      description:
        'Familiaer gefuehrte Pension in Breitenbach, Eichsfeld. Ferienwohnungen und Zimmer mit Blick ins Gruene.',
      url: 'https://www.pension-volgenandt.de',
      logo: '/img/logo.webp',
      telephone: '+49 3605 542775',
      email: 'kontakt@pension-volgenandt.de',
      address: {
        streetAddress: 'Otto-Reuter-Strasse 28',
        addressLocality: 'Leinefelde-Worbis OT Breitenbach',
        postalCode: '37327',
        addressRegion: 'Thueringen',
        addressCountry: 'DE',
      },
      geo: {
        latitude: 51.3747,
        longitude: 10.2197,
      },
      sameAs: [], // Add social media URLs when available
      amenityFeature: [
        { name: 'WiFi', value: true },
        { name: 'Parking', value: true },
        { name: 'Breakfast', value: true },
      ],
      petsAllowed: true,
    },
  },

  // Sitemap configuration
  sitemap: {
    // Auto-discovers all prerendered routes
    // Nuxt Content pages are included automatically
  },

  // Robots configuration
  robots: {
    // Allow all crawlers by default
    // Block AI training bots if desired
    groups: [{ userAgent: '*', allow: '/' }],
  },

  // SEO Utils configuration
  seoUtils: {
    automaticBreadcrumbs: true, // Auto-generate BreadcrumbList schema
  },
})
```

### Pattern 8: Per-Page SEO Meta

**What:** Each page sets unique meta title, description, canonical URL, and Open Graph tags using `useSeoMeta()` and `useHead()`.

```typescript
// Example: attraction page SEO setup
// app/pages/ausflugsziele/[slug].vue
const attraction =
  /* fetched from queryCollection */

  useSeoMeta({
    title: attraction.seoTitle, // max 60 chars
    ogTitle: attraction.seoTitle,
    description: attraction.seoDescription, // max 155 chars
    ogDescription: attraction.seoDescription,
    ogImage: `https://www.pension-volgenandt.de${attraction.heroImage}`,
    ogType: 'article',
  })

useHead({
  htmlAttrs: { lang: 'de' },
  link: [
    {
      rel: 'canonical',
      href: `https://www.pension-volgenandt.de/ausflugsziele/${attraction.slug}/`,
    },
    {
      rel: 'alternate',
      hreflang: 'de',
      href: `https://www.pension-volgenandt.de/ausflugsziele/${attraction.slug}/`,
    },
  ],
})
```

### Pattern 9: Breadcrumb Component using useBreadcrumbItems()

**What:** The `@nuxtjs/seo` bundle includes `nuxt-seo-utils` which provides `useBreadcrumbItems()` -- a composable that auto-generates breadcrumbs from the route path and integrates with Schema.org BreadcrumbList.

**Design decision (Claude's Discretion):** Place breadcrumbs inside the banner, above the H1, to keep them visually connected to the page context while maintaining the thin banner design.

```vue
<!-- app/components/ui/BreadcrumbNav.vue -->
<script setup lang="ts">
const items = useBreadcrumbItems({
  schemaOrg: true, // Auto-generates BreadcrumbList structured data
  overrides: [
    { label: 'Startseite' }, // Override "Home" with German label
  ],
})
</script>

<template>
  <nav aria-label="Breadcrumb">
    <ol class="flex flex-wrap items-center gap-1 text-sm text-white/80">
      <li v-for="(item, index) in items" :key="item.to || index">
        <NuxtLink
          v-if="item.to && index < items.length - 1"
          :to="item.to"
          class="transition-colors hover:text-white"
        >
          {{ item.label }}
        </NuxtLink>
        <span v-else class="font-medium text-white" aria-current="page">
          {{ item.label }}
        </span>
        <Icon
          v-if="index < items.length - 1"
          name="ph:caret-right"
          class="mx-1 size-3 text-white/60"
        />
      </li>
    </ol>
  </nav>
</template>
```

**Customizing labels per page:**

```typescript
// app/pages/familie.vue
definePageMeta({
  breadcrumb: {
    label: 'Familie & Kinder',
  },
})
```

### Pattern 10: Contact Form (Netlify Forms with SSG)

**What:** Netlify Forms detects forms in the pre-rendered HTML at deploy time. For Nuxt SSG, a hidden HTML form must exist in the static output so Netlify's deploy bot can register it. The actual form submission uses AJAX with URL-encoded body.

**Key requirement:** The form body must be URL-encoded, NOT JSON.

```vue
<!-- app/components/contact/Form.vue -->
<script setup lang="ts">
const formData = reactive({
  name: '',
  email: '',
  message: '',
})

const isSubmitting = ref(false)
const isSubmitted = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const body = new URLSearchParams({
      'form-name': 'kontakt',
      ...formData,
    })

    await $fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })

    isSubmitted.value = true
  } catch (error) {
    errorMessage.value =
      'Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder rufen Sie uns an.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <!-- Hidden form for Netlify detection (must be in pre-rendered HTML) -->
  <form name="kontakt" data-netlify="true" data-netlify-honeypot="bot-field" hidden>
    <input type="text" name="name" />
    <input type="email" name="email" />
    <textarea name="message" />
  </form>

  <!-- Success state -->
  <div v-if="isSubmitted" class="rounded-lg bg-sage-50 p-8 text-center">
    <Icon name="ph:check-circle-duotone" class="mx-auto mb-4 size-12 text-sage-600" />
    <h3 class="text-xl font-semibold text-sage-900">Vielen Dank!</h3>
    <p class="mt-2 text-sage-700">
      Wir haben Ihre Nachricht erhalten und melden uns schnellstmoeglich bei Ihnen.
    </p>
  </div>

  <!-- Form -->
  <form
    v-else
    name="kontakt"
    method="POST"
    data-netlify="true"
    data-netlify-honeypot="bot-field"
    @submit.prevent="handleSubmit"
  >
    <input type="hidden" name="form-name" value="kontakt" />
    <!-- Honeypot (hidden from users, catches bots) -->
    <div class="hidden">
      <input name="bot-field" />
    </div>

    <div class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-sage-800"> Name </label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          name="name"
          required
          class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
        />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-sage-800"> E-Mail </label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          name="email"
          required
          class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
        />
      </div>

      <div>
        <label for="message" class="block text-sm font-medium text-sage-800"> Nachricht </label>
        <textarea
          id="message"
          v-model="formData.message"
          name="message"
          rows="5"
          required
          class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
        />
      </div>

      <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4 text-red-700">
        {{ errorMessage }}
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full rounded-lg bg-waldhonig-500 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-waldhonig-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {{ isSubmitting ? 'Wird gesendet...' : 'Nachricht senden' }}
      </button>
    </div>
  </form>
</template>
```

### Pattern 11: FAQPage Structured Data

**What:** Add FAQPage schema to the /kontakt/ page using `useSchemaOrg()`. Even though Google no longer shows FAQ rich results for non-government/health sites, the schema still has value for AI search tools, voice assistants, and general search understanding.

```typescript
// app/pages/kontakt.vue
useSchemaOrg([
  defineFaqPage({
    mainEntity: faqItems.value.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }),
])
```

### Pattern 12: Custom 404 Page

**What:** A catch-all route that renders a friendly 404 page with navigation links to help visitors find what they need.

```vue
<!-- app/pages/[...slug].vue -->
<script setup lang="ts">
// Only render this for routes that don't match any page
throw createError({
  statusCode: 404,
  message: 'Seite nicht gefunden',
})
</script>
```

```vue
<!-- app/error.vue -->
<script setup lang="ts">
const error = useError()
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-6 text-center">
    <h1 class="font-serif text-6xl font-bold text-sage-300">404</h1>
    <h2 class="mt-4 text-2xl font-semibold text-sage-900">Seite nicht gefunden</h2>
    <p class="mt-2 text-sage-700">
      Die gesuchte Seite existiert leider nicht oder wurde verschoben.
    </p>
    <div class="mt-8 flex flex-wrap justify-center gap-4">
      <NuxtLink to="/" class="rounded-lg bg-waldhonig-500 px-6 py-3 font-semibold text-white">
        Zur Startseite
      </NuxtLink>
      <NuxtLink to="/zimmer/" class="rounded-lg bg-sage-100 px-6 py-3 font-semibold text-sage-800">
        Zimmer ansehen
      </NuxtLink>
      <NuxtLink to="/kontakt/" class="rounded-lg bg-sage-100 px-6 py-3 font-semibold text-sage-800">
        Kontakt
      </NuxtLink>
    </div>
  </div>
</template>
```

### Anti-Patterns to Avoid

- **Installing individual SEO modules alongside @nuxtjs/seo:** The bundle includes all sub-modules. Installing `@nuxtjs/sitemap` separately alongside `@nuxtjs/seo` causes conflicts.
- **Loading @nuxtjs/seo AFTER @nuxt/content in modules array:** `@nuxtjs/seo` must come BEFORE `@nuxt/content` for proper content collection SEO integration.
- **Using `@phosphor-icons/vue` directly:** Bypasses `@nuxt/icon`'s server bundle and auto-import system. Loses tree-shaking benefits in SSG. Use `@iconify-json/ph` through `@nuxt/icon` instead.
- **Loading Leaflet maps without consent:** Any connection to tile.openstreetmap.org transmits user IP to third-party servers outside EU. Must use two-click consent pattern.
- **Setting meta descriptions longer than 155 characters:** Google truncates at ~155 chars. Keep descriptions concise.
- **Expecting FAQ rich results from Google:** Since September 2023, FAQ rich results are restricted to government/health sites. Implement FAQPage schema anyway for AI/voice search value, but do not expect visible rich snippets.
- **Using JSON body for Netlify Forms AJAX:** Must be URL-encoded (`application/x-www-form-urlencoded`), not JSON. Netlify's form processing does not accept JSON.
- **Forgetting the hidden form for Netlify SSG:** Netlify's deploy bot scans pre-rendered HTML for forms. A hidden `<form>` with matching field names must exist in the static HTML for form detection to work.

## Don't Hand-Roll

| Problem                               | Don't Build                                   | Use Instead                                      | Why                                                                                                            |
| ------------------------------------- | --------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| XML sitemap generation                | Custom sitemap builder                        | `@nuxtjs/seo` (includes sitemap)                 | Auto-discovers routes, handles Nuxt Content, generates lastmod timestamps, supports sitemap.xsl styling        |
| robots.txt                            | Manual robots.txt file                        | `@nuxtjs/seo` (includes robots)                  | Environment-aware (blocks indexing in dev), AI bot management, integrates with sitemap                         |
| Schema.org structured data            | Hand-written JSON-LD in `<head>`              | `@nuxtjs/seo` (includes schema-org)              | Graph-based system with auto-linked nodes, type-safe `define*()` helpers, automatic WebSite + WebPage defaults |
| Breadcrumb navigation + schema        | Custom breadcrumb parser                      | `useBreadcrumbItems()` from nuxt-seo-utils       | Auto-generates from route path, integrates BreadcrumbList schema, supports label overrides                     |
| Icon rendering for 6 Phosphor weights | Manual SVG imports from `@phosphor-icons/vue` | `@nuxt/icon` + `@iconify-json/ph`                | Server bundle, auto-import, consistent API with existing Lucide icons, zero config                             |
| Spam protection for contact form      | Custom captcha or rate limiting               | Netlify Forms honeypot (`data-netlify-honeypot`) | Built-in spam filtering, no user friction, no third-party captcha scripts                                      |
| Open Graph image dimensions           | Manual image resizing                         | `@nuxtjs/seo` (includes og-image)                | Auto-generates OG images from page title/description if no custom image specified                              |

**Key insight:** `@nuxtjs/seo` is the linchpin of Phase 4. It replaces 6-7 separate concerns (sitemap, robots, schema, breadcrumbs, OG images, link checking, canonical URLs) with a single module that has sensible zero-config defaults and shared site configuration. This is the biggest "don't hand-roll" item in the entire phase.

## Common Pitfalls

### Pitfall 1: @nuxtjs/seo Module Load Order

**What goes wrong:** Schema.org identity not applied, sitemap missing Nuxt Content routes, breadcrumbs empty.
**Why it happens:** `@nuxtjs/seo` must be loaded BEFORE `@nuxt/content` in the `modules` array. If loaded after, the schema-org and sitemap modules cannot detect content collections.
**How to avoid:** Place `'@nuxtjs/seo'` first (or at least before `'@nuxt/content'`) in the modules array.
**Warning signs:** Schema.org output in DevTools missing identity node; /sitemap.xml missing content routes.

### Pitfall 2: Leaflet Map Hydration Errors Without ClientOnly

**What goes wrong:** SSR errors during `nuxt generate`: "window is not defined" or "document is not defined".
**Why it happens:** Leaflet requires browser DOM APIs (window, document) that do not exist during server-side rendering.
**How to avoid:** Always wrap `<LMap>` and related components in a `<ClientOnly>` wrapper. The consent wrapper component already handles this by only rendering the map slot after consent.
**Warning signs:** Build errors mentioning `window is not defined`; blank map areas in production.

### Pitfall 3: Netlify Forms Not Detected in SSG Build

**What goes wrong:** Form submissions return 404 or "Form not found" error.
**Why it happens:** Netlify's deploy bot scans the pre-rendered HTML for forms with `data-netlify="true"`. Vue components that only render forms client-side (behind `v-if`) are invisible to the bot.
**How to avoid:** Include a hidden HTML form with matching field names that is always present in the static HTML. The hidden form has `hidden` attribute but contains all input fields with matching `name` attributes.
**Warning signs:** Forms work in dev but fail in production; Netlify dashboard shows 0 forms detected.

### Pitfall 4: Missing Trailing Slashes on Canonical URLs

**What goes wrong:** Google indexes both `/familie` and `/familie/` as separate pages, splitting page authority.
**Why it happens:** Nuxt SSG generates directories with `index.html` files (e.g., `/familie/index.html`), served at `/familie/`. But canonical URLs might omit the trailing slash.
**How to avoid:** Always include trailing slashes in canonical URLs and internal links. Configure `@nuxtjs/seo` site URL with trailing slash convention. Use `router.options.trailingSlash: true` in nuxt.config if needed.
**Warning signs:** Google Search Console shows duplicate pages with and without trailing slashes.

### Pitfall 5: Duotone Icons Rendering as Regular Weight

**What goes wrong:** All Phosphor icons display in regular weight despite using `-duotone` suffix.
**Why it happens:** The `@iconify-json/ph` package might not be installed, causing @nuxt/icon to fall back to fetching from CDN where the duotone variant might not resolve correctly.
**How to avoid:** Verify `@iconify-json/ph` is installed as a devDependency. Check the icon name uses the correct suffix format: `ph:tree-duotone` (not `ph:tree:duotone` or `phosphor:tree-duotone`).
**Warning signs:** All icons look the same weight; no visible two-tone effect; network requests to Iconify CDN instead of local bundle.

### Pitfall 6: OpenStreetMap Tile Server Choice

**What goes wrong:** Using `tile.openstreetmap.de` (German servers) thinking it avoids DSGVO issues, but legal consensus is unclear.
**Why it happens:** Some sources claim openstreetmap.de tiles are EU-hosted and therefore DSGVO-safe without consent. But legal experts disagree -- any external tile server involves third-party data processing.
**How to avoid:** Always use the two-click consent pattern regardless of which tile server is used. This eliminates legal ambiguity entirely. Use `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` as the standard tile URL.
**Warning signs:** Legal uncertainty; conflicting advice online about openstreetmap.de compliance.

### Pitfall 7: FAQPage Schema Expecting Rich Results

**What goes wrong:** Developer implements FAQPage schema expecting Google FAQ rich snippets, then is confused when they never appear.
**Why it happens:** Since September 2023, Google restricted FAQ rich results to well-known government and health websites only. A pension website will never receive FAQ rich results.
**How to avoid:** Implement FAQPage schema for its secondary benefits (AI search citations, voice assistant answers, Bing rich results, general search comprehension) but do NOT include it in success criteria that require visible rich snippets in Google Search.
**Warning signs:** Google Rich Results Test validates the schema but Preview shows "Not eligible for rich results."

### Pitfall 8: Content Pages with Identical Meta Descriptions

**What goes wrong:** Google Search Console flags "duplicate meta descriptions" for multiple content pages.
**Why it happens:** Copy-pasting meta descriptions or using generic descriptions like "Pension Volgenandt in Breitenbach" across multiple pages.
**How to avoid:** Each page MUST have a unique meta description (max 155 chars) that describes what is specifically on that page. Store `seoTitle` and `seoDescription` in the YAML data files for attractions and activities to enforce uniqueness at the data level.
**Warning signs:** Google Search Console "Enhancements > Meta descriptions" report shows duplicates.

## Code Examples

### Attraction YAML Data File

```yaml
# content/attractions/baerenpark-worbis.yml
name: 'Alternativer Baerenpark Worbis'
slug: baerenpark-worbis
seoTitle: 'Baerenpark Worbis | Pension nahe Baerenpark'
seoDescription: 'Besuchen Sie den Alternativen Baerenpark Worbis -- nur 12 km von unserer Pension. Tipps, Oeffnungszeiten und Unterkunft im Eichsfeld.'
heroImage: /img/attractions/baerenpark-worbis.webp
heroImageAlt: 'Braunbaer im Alternativen Baerenpark Worbis'
distanceKm: 12
drivingMinutes: 15
category: natur
shortDescription: 'Braun- und Schwarzbaeren in naturnahen Gehegen erleben'
intro: >-
  Der Alternative Baerenpark Worbis ist einer der beliebtesten Ausflugsziele
  in unserer Naehe. Hier leben Baeren und Woelfe, die aus schlechter Haltung
  gerettet wurden, in grossen naturnahen Gehegen.
content: >-
  Nur 12 Kilometer von unserer Pension entfernt liegt der Alternative
  Baerenpark in Worbis. Auf einer Flaeche von 4 Hektar leben hier
  Braunbaeren, Schwarzbaeren und Woelfe in artgerechten Gehegen.

  Der Park wurde als Auffangstation fuer Baeren aus schlechter Haltung
  gegruendet und bietet Besuchern einen einzigartigen Einblick in das
  Leben dieser faszinierenden Tiere. Ein Rundweg fuehrt durch den
  gesamten Park, vorbei an Beobachtungspunkten und Informationstafeln.

  Fuer Familien mit Kindern gibt es einen grossen Abenteuerspielplatz
  und ein Streichelgehege. Im Parkrestaurant koennen Sie sich bei
  regionaler Kueche staerken.
hostTip: >-
  Unser Tipp: Kommen Sie am besten morgens, wenn die Baeren
  am aktivsten sind. Der Rundweg dauert etwa 1-2 Stunden.
bestTimeToVisit: 'Fruehjahr bis Herbst, morgens'
openingHours: 'Taeglich 10:00 - 18:00 (Maerz-Oktober), 10:00 - 16:00 (November-Februar)'
entryPrice: 'Erwachsene 11 EUR, Kinder (4-14) 6 EUR'
website: 'https://www.baer.de'
coordinates:
  lat: 51.3891
  lng: 10.2064
gallery:
  - src: /img/attractions/baerenpark-baer.webp
    alt: 'Braunbaer im Baerenpark Worbis'
  - src: /img/attractions/baerenpark-spielplatz.webp
    alt: 'Abenteuerspielplatz im Baerenpark'
sortOrder: 1
```

### FAQ YAML Data File

```yaml
# content/faq/index.yml
items:
  # Buchung & Logistik
  - question: 'Wie kann ich ein Zimmer buchen?'
    answer: >-
      Sie koennen direkt ueber unsere Website buchen, uns eine E-Mail an
      kontakt@pension-volgenandt.de schreiben oder telefonisch unter
      +49 3605 542775 erreichen. Wir bestaetigen Ihre Buchung
      innerhalb von 24 Stunden.
    category: buchung
    sortOrder: 1

  - question: 'Wie sind die Check-in und Check-out Zeiten?'
    answer: >-
      Check-in ist ab 15:00 Uhr, Check-out bis 10:00 Uhr. Wenn Sie
      frueher ankommen oder spaeter abreisen moechten, sprechen Sie
      uns einfach an -- wir finden fast immer eine Loesung.
    category: buchung
    sortOrder: 2

  - question: 'Wie ist die Stornierungspolitik?'
    answer: >-
      Eine kostenlose Stornierung ist bis 7 Tage vor Anreise moeglich.
      Bei kurzfristigeren Absagen berechnen wir die erste Nacht.
      Details finden Sie in unseren <a href="/agb/">AGB</a>.
    category: buchung
    relatedPage: /agb/
    sortOrder: 3

  - question: 'Gibt es kostenlose Parkplaetze?'
    answer: >-
      Ja, wir haben ausreichend kostenlose Parkplaetze direkt vor
      dem Haus. Eine Reservierung ist nicht noetig.
    category: ausstattung
    sortOrder: 4

  - question: 'Bieten Sie Fruehstueck an?'
    answer: >-
      Ja! Wir bieten ein reichhaltiges Fruehstueck fuer 10 EUR
      pro Person und ein Geniesser-Fruehstueck mit regionalen
      Spezialitaeten fuer 15 EUR pro Person. Bitte geben Sie
      bei der Buchung Bescheid.
    category: ausstattung
    sortOrder: 5

  - question: 'Sind Hunde willkommen?'
    answer: >-
      Ja, Hunde sind bei uns herzlich willkommen! Wir berechnen
      5 EUR pro Nacht. Unser grosser Garten bietet viel Auslauf,
      und die Umgebung ist ideal fuer Spaziergaenge mit Hund.
    category: ausstattung
    sortOrder: 6

  - question: 'Ist die Pension familienfreundlich?'
    answer: >-
      Auf jeden Fall! Wir haben einen grossen Garten mit Spielplatz,
      Kinderfahrzeuge, Kinderbetten und Hochstuehle. Mehr dazu auf
      unserer <a href="/familie/">Familienseite</a>.
    category: ausstattung
    relatedPage: /familie/
    sortOrder: 7

  - question: 'Wie komme ich zur Pension?'
    answer: >-
      Von der A38 nehmen Sie die Ausfahrt Leinefelde und folgen der
      Beschilderung Richtung Breitenbach. Die Fahrt vom Autobahnkreuz
      dauert etwa 10 Minuten. Vom Bahnhof Leinefelde sind es 8 km --
      wir holen Sie gerne ab!
    category: anreise
    sortOrder: 8

  - question: 'Was kann man in der Umgebung unternehmen?'
    answer: >-
      Das Eichsfeld bietet vieles: den Baerenpark Worbis (12 km),
      Burg Hanstein (18 km), den Baumkronenpfad Hainich (45 km)
      und herrliche Wanderwege direkt vor der Tuer. Alle Ausflugsziele
      finden Sie auf unserer <a href="/ausflugsziele/">Ausflugsseite</a>.
    category: umgebung
    relatedPage: /ausflugsziele/
    sortOrder: 9

  - question: 'Wann ist die beste Reisezeit?'
    answer: >-
      Das Eichsfeld ist zu jeder Jahreszeit schoen. Im Fruehling
      bluehen die Wiesen, der Sommer laedt zum Wandern und Radfahren
      ein, der Herbst verzaubert mit Laubfaerbung, und im Winter
      geniessen Sie die Ruhe bei Spaziergaengen durch verschneite Waelder.
    category: umgebung
    sortOrder: 10

  - question: 'Haben Sie WLAN?'
    answer: >-
      Ja, kostenloses WLAN steht Ihnen in allen Zimmern und
      Ferienwohnungen zur Verfuegung.
    category: ausstattung
    sortOrder: 11

  - question: 'Gibt es einen Aufzug?'
    answer: >-
      Nein, unsere Pension hat keinen Aufzug. Einige Zimmer im
      Erdgeschoss sind barrierefrei erreichbar. Bitte sprechen Sie
      uns bei Bedarf an -- wir finden eine passende Loesung.
    category: ausstattung
    sortOrder: 12
```

### HotelRoom + Offer Schema for Room Pages

```typescript
// app/pages/zimmer/[slug].vue (Schema.org addition)
// This schema is added to room pages created in Phase 2
useSchemaOrg([
  {
    '@type': ['HotelRoom', 'Product'],
    name: room.value.name,
    description: room.value.shortDescription,
    image: `https://www.pension-volgenandt.de${room.value.heroImage}`,
    occupancy: {
      '@type': 'QuantitativeValue',
      maxValue: room.value.maxGuests,
    },
    bed: {
      '@type': 'BedDetails',
      typeOfBed: room.value.beds,
    },
    amenityFeature: room.value.amenities.map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenityMap[a]?.label ?? a,
      value: true,
    })),
    offers: room.value.pricing.flatMap((period) =>
      period.rates.map((rate) => ({
        '@type': 'Offer',
        name: `${room.value.name} - ${period.label}`,
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: rate.pricePerNight,
          priceCurrency: 'EUR',
          unitCode: 'DAY',
        },
        businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut',
        eligibleQuantity: {
          '@type': 'QuantitativeValue',
          value: rate.occupancy,
          unitText: 'Personen',
        },
      })),
    ),
  },
])
```

### Ausflugsziele Overview Page with Map

```vue
<!-- app/pages/ausflugsziele/index.vue (structural example) -->
<script setup lang="ts">
const { data: attractions } = await useAsyncData('attractions', () =>
  queryCollection('attractions').order('sortOrder', 'ASC').all(),
)

useSeoMeta({
  title: 'Ausflugsziele im Eichsfeld | Pension Volgenandt',
  description:
    'Entdecken Sie Baerenpark, Burgen und Wanderwege rund um unsere Pension im Eichsfeld. Alle Ausflugsziele mit Entfernung und Tipps.',
})
</script>

<template>
  <div>
    <ContentPageBanner
      image="/img/banners/ausflugsziele-banner.webp"
      image-alt="Blick ueber das Eichsfeld"
      title="Ausflugsziele"
      subtitle="Entdecken Sie das Eichsfeld"
    />

    <!-- Interactive map with consent wrapper -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto max-w-6xl">
        <AttractionsMapConsent
          placeholder-image="/img/map/ausflugsziele-placeholder.webp"
          placeholder-alt="Karte der Ausflugsziele rund um die Pension Volgenandt"
        >
          <AttractionsMap :attractions="attractions" />
        </AttractionsMapConsent>
      </div>
    </section>

    <!-- Attraction card grid -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AttractionsCard
          v-for="attraction in attractions"
          :key="attraction.slug"
          v-bind="attraction"
        />
      </div>
    </section>
  </div>
</template>
```

### Leaflet Map Component with Attraction Pins

```vue
<!-- app/components/attractions/Map.vue -->
<script setup lang="ts">
defineProps<{
  attractions: Array<{
    name: string
    slug: string
    coordinates: { lat: number; lng: number }
    distanceKm: number
    shortDescription: string
  }>
}>()

// Pension coordinates (center of map)
const pensionCoords = [51.3747, 10.2197] as [number, number]
</script>

<template>
  <LMap
    :zoom="10"
    :center="pensionCoords"
    :use-global-leaflet="false"
    style="height: 100%; width: 100%"
  >
    <LTileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
      layer-type="base"
      name="OpenStreetMap"
    />

    <!-- Pension marker -->
    <LMarker :lat-lng="pensionCoords">
      <LPopup>
        <strong>Pension Volgenandt</strong><br />
        Otto-Reuter-Strasse 28<br />
        37327 Breitenbach
      </LPopup>
    </LMarker>

    <!-- Attraction markers -->
    <LMarker
      v-for="attraction in attractions"
      :key="attraction.slug"
      :lat-lng="[attraction.coordinates.lat, attraction.coordinates.lng]"
    >
      <LPopup>
        <strong>{{ attraction.name }}</strong
        ><br />
        {{ attraction.distanceKm }} km von der Pension<br />
        <NuxtLink :to="`/ausflugsziele/${attraction.slug}/`"> Mehr erfahren </NuxtLink>
      </LPopup>
    </LMarker>
  </LMap>
</template>
```

### Prerender Routes Configuration

```typescript
// nuxt.config.ts (Phase 4 additions to nitro.prerender.routes)
export default defineNuxtConfig({
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        // Phase 1 routes
        '/',
        '/impressum/',
        '/datenschutz/',
        '/agb/',
        // Phase 2 routes (room detail pages)
        '/zimmer/',
        '/zimmer/emils-kuhwiese/',
        '/zimmer/schoene-aussicht/',
        '/zimmer/balkonzimmer/',
        '/zimmer/rosengarten/',
        '/zimmer/wohlfuehl-appartement/',
        '/zimmer/doppelzimmer/',
        '/zimmer/einzelzimmer/',
        // Phase 4 routes
        '/familie/',
        '/aktivitaeten/',
        '/nachhaltigkeit/',
        '/kontakt/',
        '/ausflugsziele/',
        '/ausflugsziele/baerenpark-worbis/',
        '/ausflugsziele/burg-bodenstein/',
        '/ausflugsziele/burg-hanstein/',
        '/ausflugsziele/skywalk-sonnenstein/',
        '/ausflugsziele/baumkronenpfad-hainich/',
        '/aktivitaeten/wandern/',
        '/aktivitaeten/radfahren/',
      ],
    },
  },
})
```

## State of the Art

| Old Approach                                         | Current Approach                                           | When Changed                 | Impact                                                                 |
| ---------------------------------------------------- | ---------------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------- |
| Individual SEO modules (sitemap, robots, schema-org) | `@nuxtjs/seo` unified bundle v3.4+                         | 2024-2025                    | Single install, shared config, consistent defaults                     |
| Manual JSON-LD in `<head>`                           | `useSchemaOrg()` with `define*()` helpers                  | nuxt-schema-org stable 2024  | Type-safe, graph-based, automatic WebSite/WebPage defaults             |
| Custom breadcrumb parser                             | `useBreadcrumbItems()` from nuxt-seo-utils v7              | nuxt-seo-utils v7 (Jan 2026) | Auto-generates from route path, Schema.org integration built-in        |
| FAQ rich results in Google Search                    | FAQ schema for AI/voice only                               | Sept 2023                    | Google restricted FAQ rich results to government/health sites          |
| Direct Leaflet map embed                             | Two-click consent wrapper                                  | Post-GDPR enforcement        | Required for DSGVO compliance on German websites                       |
| `nuxt-icon` (old) or manual SVGs                     | `@nuxt/icon` v1.0 with Iconify collections                 | 2025                         | Dual CSS/SVG rendering, server bundle, 200K+ icons from any collection |
| `phosphor-vue` (legacy)                              | `@phosphor-icons/vue` or `@iconify-json/ph` via @nuxt/icon | 2024                         | Tree-shakeable, improved performance, all 6 weights                    |

**Deprecated/outdated:**

- `phosphor-vue` npm package: Legacy, replaced by `@phosphor-icons/vue`.
- Individual `@nuxtjs/sitemap` / `@nuxtjs/robots` installs alongside `@nuxtjs/seo`: Causes conflicts.
- Expecting FAQ rich results from Google for non-government sites: Restricted since September 2023.
- OpenStreetMap `<iframe>` embed: Sets cookies, includes Matomo tracking, not DSGVO-compliant.

## Hosting Decision Impact

**Critical prior decision from STATE.md:** "Hosting decision: Netlify vs. Cloudflare Pages affects contact form approach (Phase 4). Decide before Phase 4."

| Hosting Platform     | Contact Form Approach    | Pros                                                                         | Cons                                                                                               |
| -------------------- | ------------------------ | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Netlify**          | Netlify Forms (built-in) | Zero config, 100 free submissions/month, spam filtering, email notifications | Locked to Netlify hosting                                                                          |
| **Cloudflare Pages** | Formspree or Web3Forms   | Platform-independent, works with any host                                    | External service dependency, lower free tier (Formspree: 50/month) or requires API key (Web3Forms) |

**Recommendation:** If no hosting decision has been made yet, Netlify is the simpler choice for this project. The contact form works with zero additional configuration, and the free tier (100 submissions/month) is more than sufficient for a small pension. If Cloudflare Pages is chosen for other reasons (better performance, no build-minute limits), use Formspree as the form backend.

**Build the form component with an abstraction layer** so the backend can be swapped without changing the UI:

- Extract the form submission logic into a composable (`useContactForm`)
- The composable handles URL encoding and submission
- Switching from Netlify Forms to Formspree only requires changing the submission URL and removing the hidden form

## Open Questions

1. **Hosting platform decision**
   - What we know: STATE.md flags this as a blocker: "Hosting decision: Netlify vs. Cloudflare Pages affects contact form approach (Phase 4). Decide before Phase 4."
   - What's unclear: Which platform has been selected.
   - Recommendation: Default to Netlify for simplest contact form integration. Build the form component with a composable abstraction so switching to Formspree is a minimal change.

2. **Static map placeholder image for Leaflet consent wrapper**
   - What we know: The two-click consent pattern needs a static placeholder image showing the approximate map area with attraction pins.
   - What's unclear: How to generate this image efficiently.
   - Recommendation: Generate a screenshot from openstreetmap.org at the appropriate zoom level, add pin markers in an image editor, save as WebP. Alternatively, use Geoapify Static Maps API free tier (same approach as Phase 3 research). One image for the Ausflugsziele overview, one for the Kontakt page.

3. **Exact coordinates for attractions**
   - What we know: Approximate coordinates can be looked up on OpenStreetMap.
   - What's unclear: Precise lat/lng for each of the 5 attractions and 2 activities.
   - Recommendation: Look up each attraction on openstreetmap.org during implementation and record coordinates in the YAML files. The coordinates do not need to be GPS-precise -- they are for map pin placement.

4. **Content writing for attraction pages**
   - What we know: Each attraction page needs 3-5 paragraphs of original content, host tips, practical info, and photos.
   - What's unclear: Whether factual details (opening hours, prices, seasonal availability) have been verified for each attraction.
   - Recommendation: Write content during implementation based on publicly available information from each attraction's official website. Mark any unverified details with comments in the YAML files for owner review before launch.

5. **Banner photos for content pages**
   - What we know: CONTEXT.md specifies each content page gets its own contextual photo for the thin banner.
   - What's unclear: Whether sufficient photos exist or need to be sourced/created.
   - Recommendation: Use placeholder photos during development. The banner component works with any image. Flag photo needs to the owner as a pre-launch checklist item.

6. **Formspree endpoint if Cloudflare Pages**
   - What we know: Formspree requires creating an account and form endpoint.
   - What's unclear: Whether a Formspree account has been set up.
   - Recommendation: If Cloudflare Pages is chosen, create a Formspree account during implementation. The free tier (50 submissions/month) is sufficient for a pension website. The form endpoint URL goes in `app.config.ts`.

## Sources

### Primary (HIGH confidence)

- [Nuxt SEO -- Installation](https://nuxtseo.com/docs/nuxt-seo/getting-started/installation) -- Bundled modules, installation command, site config
- [Nuxt SEO -- Module Configuration Guide](https://nuxtseo.com/docs/nuxt-seo/guides/using-the-modules) -- Sub-module configs, site config, Content integration
- [Nuxt SEO -- useBreadcrumbItems()](https://nuxtseo.com/docs/seo-utils/api/breadcrumbs) -- Breadcrumb composable API, schema integration, label customization
- [Nuxt SEO -- Schema.org Identity Setup](https://nuxtseo.com/docs/schema-org/guides/setup-identity) -- defineLocalBusiness with BedAndBreakfast subtype
- [Nuxt SEO -- useSchemaOrg() API](https://nuxtseo.com/docs/schema-org/api/use-schema-org) -- Composable API, define\* functions, graph system
- [Nuxt SEO -- Default Schema.org](https://nuxtseo.com/docs/schema-org/guides/default-schema-org) -- Auto-generated WebSite/WebPage nodes
- [Unhead -- defineLocalBusiness API](https://unhead.unjs.io/docs/schema-org/api/schema/local-business) -- Properties, subtypes, example code
- [Iconify Phosphor Icon Set](https://icon-sets.iconify.design/ph/) -- 9,072 icons, 6 weights, MIT license, naming convention
- [@phosphor-icons/vue GitHub](https://github.com/phosphor-icons/vue) -- Props (color, size, weight, mirrored), tree-shaking guidance
- [Netlify Forms Setup](https://docs.netlify.com/manage/forms/setup/) -- HTML forms, JS/AJAX submission, honeypot, hidden form detection
- [Nuxt Leaflet Module](https://nuxt.com/modules/leaflet) -- Installation, components, usage
- [Nuxt Leaflet Usage](https://leaflet.nuxtjs.org/getting-started/usage) -- LMap, LTileLayer, LMarker, use-global-leaflet
- [Schema.org Hotels](https://schema.org/docs/hotels.html) -- BedAndBreakfast, HotelRoom, Offer, MTE pattern
- [Google FAQPage Structured Data](https://developers.google.com/search/docs/appearance/structured-data/faqpage) -- Required properties, eligibility restrictions
- [Nuxt 4 SEO and Meta](https://nuxt.com/docs/4.x/getting-started/seo-meta) -- useHead, useSeoMeta composables

### Secondary (MEDIUM confidence)

- [eRecht24 OSM DSGVO Analysis](https://www.e-recht24.de/dsg/12709-openstreetmaps.html) -- Consent required for OSM embed in Germany
- [Dr. DSGVO OSM Analysis](https://dr-dsgvo.de/ist-openstreetmap-datenschutzkonform-nutzbar/) -- OSM standard embed not DSGVO-compliant
- [OSM Community Forum DSGVO](https://community.openstreetmap.org/t/osm-dsgvo-konform-und-ohne-einwilligung-nutzen/96228) -- German legal debate on tile compliance
- [Nuxt SEO v7 Release Notes](https://nuxtseo.com/docs/seo-utils/releases/v7) -- Improved breadcrumbs, requires Nuxt v3.16+
- [Netlify Forms + Nuxt SSG Guide](https://mayashavin.com/articles/contact-form-netlify-form-nuxt-3-static) -- Hidden form pattern for Vue/Nuxt
- [Formspree vs Netlify Forms](https://vanillawebsites.co.uk/blog/netlify-forms-vs-formspree/) -- Feature comparison
- [Nuxt SEO -- Open Graph Tags](https://nuxtseo.com/learn/mastering-meta/open-graph) -- Required properties, image specs (1200x630, 5MB max)
- [Nuxt SEO -- Canonical URLs](https://nuxtseo.com/learn/controlling-crawlers/canonical-urls) -- Trailing slash handling
- [Schemantra BedAndBreakfast Schema](https://schemantra.com/schema_list/BedAndBreakfast) -- JSON-LD generator and examples

### Tertiary (LOW confidence)

- [nuxt-phosphor-icons module](https://nuxt-phosphor-icons.vercel.app/) -- 4,962 monthly downloads, 10 GitHub stars, no confirmed Nuxt 4 compat. NOT recommended.
- [@nuxtjs/leaflet Nuxt 4 compat](https://nuxt.com/modules/leaflet) -- States compat >=Nuxt 3.0.0 but no explicit Nuxt 4 testing confirmed. Underlying vue-leaflet has SSR limitations requiring ClientOnly.
- Phosphor duotone secondary opacity CSS control -- Based on Iconify SVG output analysis, not official documentation. Verify during implementation.

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- @nuxtjs/seo is well-documented, actively maintained (v3.4.0, last update Mar 2025), with comprehensive configuration guides. @iconify-json/ph verified on Iconify with all 6 weights. @nuxtjs/leaflet is the official Nuxt Leaflet module.
- Architecture: HIGH -- Content page patterns follow established Phase 2+3 conventions. Data collections use verified Nuxt Content v3 APIs. Breadcrumb and schema patterns use official nuxt-seo-utils APIs.
- SEO: HIGH -- Schema.org types verified against schema.org/docs/hotels.html. FAQPage restriction confirmed by Google's official documentation. useSeoMeta API verified via Nuxt 4 docs.
- DSGVO/Leaflet: MEDIUM -- Two-click consent pattern is well-established practice, but the exact legal status of tile.openstreetmap.de vs .org is debated. Conservative approach (always use consent) eliminates ambiguity.
- Contact form: MEDIUM -- Netlify Forms pattern for SSG is well-documented, but the hosting decision is still pending. Formspree fallback is straightforward but adds an external dependency.
- Pitfalls: HIGH -- All pitfalls derived from official documentation, confirmed GitHub issues, or established German legal requirements.

**Research date:** 2026-02-22
**Valid until:** 2026-03-22 (30 days -- stable ecosystem; @nuxtjs/seo and Nuxt 4 are mature releases)
