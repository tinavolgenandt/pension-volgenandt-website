# Architecture: Nuxt 3 SSG Pension Website

**Project:** Pension Volgenandt Website Redesign
**Researched:** 2026-02-21
**Overall Confidence:** HIGH (Nuxt 3, Tailwind v4, Nuxt Content v3 all verified against official docs)

---

## 1. System Overview

The architecture is a **fully static site** (SSG) with **client-side interactive islands** for booking, consent, and forms. Every page is pre-rendered at build time and served from a CDN. All dynamic behavior runs exclusively in the browser.

```
+------------------------------------------------------------------+
|                     BUILD TIME (nuxt generate)                    |
|                                                                   |
|  content.config.ts          nuxt.config.ts                        |
|       |                          |                                |
|  Nuxt Content v3            Nuxt 3 + Nitro                        |
|  (YAML data collections)    (SSG preset: static)                  |
|       |                          |                                |
|  Room/Activity data  --->  Pages + Components  --->  .output/public/ |
|  Testimonials               Layouts                  (static HTML)  |
|                             @nuxt/image (ipxStatic)                |
|                                                                   |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|                     RUNTIME (Browser)                             |
|                                                                   |
|  Cookie Consent Banner                                            |
|       |                                                           |
|       |-- consent granted --> @nuxt/scripts loads:                |
|       |                       - Beds24 iframe (booking)           |
|       |                       - YouTube embeds                    |
|       |                       - Analytics (if added)              |
|       |                                                           |
|       |-- consent denied  --> Show fallback placeholders          |
|                                                                   |
|  Contact Form --> POST to Netlify Forms / Formspree API           |
|  Map Embed --> OpenStreetMap tile (no cookies, no consent needed)  |
|                                                                   |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|                     CDN (Netlify / Cloudflare Pages)              |
|                                                                   |
|  Static HTML + CSS + JS + optimized images + video                |
|  Global edge distribution, free SSL, auto-deploy from git         |
+------------------------------------------------------------------+
```

**Key architectural principle:** The site works fully without JavaScript. All content is in pre-rendered HTML. JavaScript adds interactivity (booking widget, consent, animations) but is not required for content consumption.

---

## 2. Nuxt Content v3 Schema for Room Data

**Confidence:** HIGH -- verified against [Nuxt Content v3 docs](https://content.nuxt.com/docs/getting-started)

### 2.1 content.config.ts

Room data uses Nuxt Content v3's **data collections** with Zod schemas. This provides type safety, validation, and auto-generated TypeScript types.

```typescript
// content.config.ts
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

const amenityEnum = z.enum([
  'wifi',
  'tv',
  'balkon',
  'terrasse',
  'kueche',
  'kuehlschrank',
  'kaffeemaschine',
  'dusche',
  'badewanne',
  'parkplatz',
  'garten',
  'bettwaesche',
  'handtuecher',
  'foehn',
  'schreibtisch',
  'heizung',
])

const roomSchema = z.object({
  // Identity
  name: z.string(),
  slug: z.string(),
  type: z.enum(['ferienwohnung', 'zimmer']),
  shortDescription: z.string(),
  description: z.string(),

  // Beds24 integration
  beds24PropertyId: z.number(),
  beds24RoomId: z.number().optional(),

  // Capacity
  maxGuests: z.number(),
  beds: z.string(), // e.g. "1 Doppelbett" or "2 Einzelbetten"
  sizeM2: z.number().optional(),

  // Pricing
  pricePerNight: z.number(), // Starting price in EUR
  priceNote: z.string().optional(), // e.g. "ab" prefix, seasonal notes

  // Media
  heroImage: z.string(), // Path relative to assets
  gallery: z.array(z.string()), // Array of image paths
  heroImageAlt: z.string(),
  galleryAlts: z.array(z.string()),

  // Features
  amenities: z.array(amenityEnum),
  highlights: z.array(z.string()), // 2-3 key selling points for cards

  // Extras
  extras: z
    .array(
      z.object({
        name: z.string(),
        price: z.number(),
        unit: z.string(), // e.g. "pro Person", "pro Nacht"
      }),
    )
    .optional(),

  // Display order
  sortOrder: z.number().default(0),
  featured: z.boolean().default(false), // Show on homepage
})

const testimonialSchema = z.object({
  quote: z.string(),
  author: z.string(),
  source: z.string().optional(), // e.g. "Booking.com", "Google"
  rating: z.number().min(1).max(5),
  date: z.string().optional(),
})

const activitySchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  category: z.enum(['wandern', 'radfahren', 'kultur', 'natur', 'familie']),
  distanceKm: z.number().optional(),
  drivingMinutes: z.number().optional(),
  image: z.string(),
  imageAlt: z.string(),
  externalUrl: z.string().optional(),
  sortOrder: z.number().default(0),
})

export default defineContentConfig({
  collections: {
    rooms: defineCollection({
      type: 'data',
      source: 'rooms/**.yml',
      schema: roomSchema,
    }),
    testimonials: defineCollection({
      type: 'data',
      source: 'testimonials.yml',
      schema: testimonialSchema,
    }),
    activities: defineCollection({
      type: 'data',
      source: 'activities/**.yml',
      schema: activitySchema,
    }),
    // Page content (Markdown with frontmatter)
    pages: defineCollection({
      type: 'page',
      source: 'pages/**.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        heroImage: z.string().optional(),
        heroImageAlt: z.string().optional(),
      }),
    }),
  },
})
```

### 2.2 Example Room YAML File

```yaml
# content/rooms/emils-kuhwiese.yml
name: "Ferienwohnung Emil's Kuhwiese"
slug: emils-kuhwiese
type: ferienwohnung
shortDescription: 'Gemutliche Ferienwohnung mit Blick auf die grunen Wiesen des Eichsfelds.'
description: |
  Die Ferienwohnung Emil's Kuhwiese bietet Ihnen auf ca. 45 m2 alles,
  was Sie fur einen entspannten Aufenthalt brauchen. Die voll ausgestattete
  Kuche ermoglicht Selbstversorgung, wahrend die Terrasse zum Fruhstuck
  im Grunen einladt.

beds24PropertyId: 257613
maxGuests: 4
beds: '1 Doppelbett, 1 Schlafsofa'
sizeM2: 45

pricePerNight: 70
priceNote: 'ab'

heroImage: /img/emils-kuhwiese-wohnzimmer.webp
gallery:
  - /img/emils-kuhwiese-schlafzimmer.webp
  - /img/emils-kuhwiese-kueche.webp
  - /img/emils-kuhwiese-terrasse.webp
  - /img/emils-kuhwiese-bad.webp
heroImageAlt: "Wohnzimmer der Ferienwohnung Emil's Kuhwiese mit Sofa und Blick ins Grune"
galleryAlts:
  - 'Schlafzimmer mit Doppelbett'
  - 'Voll ausgestattete Kuche'
  - 'Terrasse mit Gartenblick'
  - 'Modernes Badezimmer mit Dusche'

amenities:
  - wifi
  - tv
  - kueche
  - terrasse
  - parkplatz
  - bettwaesche
  - handtuecher

highlights:
  - 'Eigene Kuche fur Selbstversorger'
  - 'Terrasse mit Gartenblick'
  - 'Bis zu 4 Gaste'

extras:
  - name: 'Fruhstuck'
    price: 10
    unit: 'pro Person'
  - name: 'Geniesser-Fruhstuck'
    price: 15
    unit: 'pro Person'
  - name: 'Hund'
    price: 10
    unit: 'pro Nacht'

sortOrder: 1
featured: true
```

### 2.3 Querying Room Data in Pages

```vue
<!-- app/pages/zimmer/index.vue -->
<script setup lang="ts">
const { data: rooms } = await useAsyncData('rooms', () =>
  queryCollection('rooms').order('sortOrder', 'ASC').all(),
)

const featured = computed(() => rooms.value?.filter((r) => r.featured) ?? [])
</script>
```

```vue
<!-- app/pages/zimmer/[slug].vue -->
<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: room } = await useAsyncData(`room-${slug}`, () =>
  queryCollection('rooms').where('slug', '=', slug).first(),
)

if (!room.value) {
  throw createError({ statusCode: 404, message: 'Zimmer nicht gefunden' })
}
</script>
```

### 2.4 Data Flow: Content to Rendered Page

```
content/rooms/emils-kuhwiese.yml
    |
    | (validated by Zod schema at build time)
    v
Nuxt Content SQLite DB (build-time indexed)
    |
    | queryCollection('rooms').where('slug', '=', 'emils-kuhwiese').first()
    v
<script setup> in pages/zimmer/[slug].vue
    |
    | (passes typed data to template)
    v
<RoomDetail :room="room" />  -->  <RoomGallery :images="room.gallery" />
                              -->  <RoomAmenities :amenities="room.amenities" />
                              -->  <BookingWidget :property-id="room.beds24PropertyId" />
                              -->  <RoomExtras :extras="room.extras" />
    |
    | (nuxt generate pre-renders to static HTML)
    v
.output/public/zimmer/emils-kuhwiese/index.html
```

---

## 3. Consent-Aware Third-Party Script Loading

**Confidence:** HIGH -- verified against [@nuxt/scripts docs](https://scripts.nuxt.com/) and [useScriptTriggerConsent API](https://scripts.nuxt.com/docs/api/use-script-trigger-consent)

### 3.1 The TTDSG/GDPR Pattern

German TTDSG (Telekommunikation-Telemedien-Datenschutz-Gesetz) requires that **no non-essential cookies or scripts are loaded until the user gives explicit, informed consent**. This is stricter than generic GDPR -- the default must be "off" and opt-in only.

**Scripts requiring consent:**

- Beds24 booking iframe (loads third-party content, may set cookies)
- YouTube video embeds (sets cookies, tracking)
- Google Maps embed (if used instead of OpenStreetMap)
- Analytics (if added later)

**Scripts NOT requiring consent:**

- OpenStreetMap tiles (no cookies, no tracking)
- Self-hosted fonts (no third-party)
- The site's own JavaScript

### 3.2 Architecture: Custom Consent + @nuxt/scripts

The recommended pattern uses `@nuxt/scripts`'s `useScriptTriggerConsent()` composable combined with a **custom-built cookie consent banner** (no third-party consent library needed -- keeps it simple, avoids another dependency).

**Why custom over a library:** The consent needs are simple (3 categories max), the UI must match the design system exactly, and avoiding a third-party consent tool means one fewer script to consent about.

```
+---------------------------------------------------+
|              Cookie Consent State                  |
|                                                    |
|  useCookieConsent() composable (custom)            |
|  - Stores consent in a cookie (JSON)               |
|  - Provides reactive consent state per category     |
|  - Categories: essential, booking, media            |
|                                                    |
+---------------------------------------------------+
         |                    |                |
         v                    v                v
  [essential]           [booking]          [media]
  Always active         Beds24 iframe      YouTube embeds
  (no toggle)           Analytics (future) Google Maps (if used)
         |                    |                |
         v                    v                v
  Site JS, fonts,       useScriptTrigger    useScriptTrigger
  OpenStreetMap         Consent()           Consent()
  (load immediately)    (load after         (load after
                         consent)            consent)
```

### 3.3 Implementation: Custom Consent Composable

```typescript
// app/composables/useCookieConsent.ts

export type ConsentCategory = 'essential' | 'booking' | 'media'

interface ConsentState {
  essential: boolean // Always true, not toggleable
  booking: boolean // Beds24, analytics
  media: boolean // YouTube, Google Maps
  timestamp: string // When consent was given
  version: string // Consent version for re-prompting
}

const CONSENT_COOKIE = 'pv_consent'
const CONSENT_VERSION = '1.0'

export function useCookieConsent() {
  const consent = useCookie<ConsentState | null>(CONSENT_COOKIE, {
    maxAge: 60 * 60 * 24 * 180, // 180 days
    sameSite: 'lax',
    default: () => null,
  })

  const hasConsented = computed(() => consent.value !== null)

  const isAccepted = (category: ConsentCategory): boolean => {
    if (category === 'essential') return true
    return consent.value?.[category] ?? false
  }

  const acceptAll = () => {
    consent.value = {
      essential: true,
      booking: true,
      media: true,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    }
  }

  const acceptSelected = (categories: ConsentCategory[]) => {
    consent.value = {
      essential: true,
      booking: categories.includes('booking'),
      media: categories.includes('media'),
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    }
  }

  const denyAll = () => {
    consent.value = {
      essential: true,
      booking: false,
      media: false,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    }
  }

  const resetConsent = () => {
    consent.value = null
  }

  // Check if consent version changed (re-prompt needed)
  const needsReConsent = computed(() => {
    if (!consent.value) return true
    return consent.value.version !== CONSENT_VERSION
  })

  return {
    consent: readonly(consent),
    hasConsented,
    needsReConsent,
    isAccepted,
    acceptAll,
    acceptSelected,
    denyAll,
    resetConsent,
  }
}
```

### 3.4 Implementation: Consent-Gated Script Loading

```vue
<!-- app/components/booking/BookingWidget.vue -->
<script setup lang="ts">
const props = defineProps<{
  propertyId: number
  roomId?: number
}>()

const { isAccepted } = useCookieConsent()

// Reactive: becomes true when user accepts 'booking' category
const bookingConsented = computed(() => isAccepted('booking'))

// Build the Beds24 iframe URL
const iframeSrc = computed(() => {
  const base = `https://beds24.com/booking2.php`
  const params = new URLSearchParams({
    propid: String(props.propertyId),
    referer: 'iFrame',
    lang: 'de',
  })
  if (props.roomId) {
    params.set('roomid', String(props.roomId))
  }
  return `${base}?${params.toString()}`
})
</script>

<template>
  <!-- Consent granted: show iframe -->
  <div v-if="bookingConsented" class="booking-widget">
    <iframe
      :src="iframeSrc"
      width="100%"
      height="800"
      style="border: none; overflow: auto;"
      loading="lazy"
      title="Buchung - Pension Volgenandt"
    />
  </div>

  <!-- Consent not yet given: show placeholder with explanation -->
  <ConsentPlaceholder
    v-else
    category="booking"
    title="Online-Buchung"
    description="Um die Buchungsfunktion zu nutzen, akzeptieren Sie bitte
                 die Nutzung von Beds24 in den Cookie-Einstellungen."
    icon="calendar"
  />
</template>
```

### 3.5 Consent Placeholder Component

```vue
<!-- app/components/app/ConsentPlaceholder.vue -->
<script setup lang="ts">
const props = defineProps<{
  category: 'booking' | 'media'
  title: string
  description: string
  icon?: string
}>()

const { acceptSelected, consent } = useCookieConsent()

function acceptThisCategory() {
  const current = consent.value
  const categories: ConsentCategory[] = ['essential', props.category]
  // Preserve any previously accepted categories
  if (current?.booking) categories.push('booking')
  if (current?.media) categories.push('media')
  acceptSelected([...new Set(categories)])
}
</script>

<template>
  <div class="rounded-card bg-stone-100 p-8 text-center">
    <p class="text-charcoal mb-2 text-lg font-semibold">{{ title }}</p>
    <p class="text-grey mx-auto mb-4 max-w-prose">{{ description }}</p>
    <button
      class="bg-terra-400 hover:bg-terra-500 rounded-card px-6 py-3 font-semibold text-white transition-colors"
      @click="acceptThisCategory"
    >
      Inhalte laden
    </button>
    <p class="text-grey mt-2 text-sm">
      <NuxtLink to="/datenschutz" class="underline">Datenschutzerklaerung</NuxtLink>
    </p>
  </div>
</template>
```

### 3.6 Using @nuxt/scripts for Future Analytics

For analytics scripts (not yet needed but architecture-ready):

```typescript
// app/composables/useAnalytics.ts
export function useAnalytics() {
  const { isAccepted } = useCookieConsent()

  // Only load when booking consent is given
  const consentTrigger = useScriptTriggerConsent({
    consent: computed(() => isAccepted('booking')),
  })

  // Example: Plausible Analytics (privacy-friendly, could be added later)
  // useScript('https://plausible.io/js/script.js', {
  //   trigger: consentTrigger,
  //   'data-domain': 'pension-volgenandt.de',
  // })
}
```

---

## 4. Hero Video Architecture

**Confidence:** MEDIUM -- pattern is standard web practice; Nuxt-specific aspects verified

### 4.1 Strategy: Progressive Enhancement

```
Desktop (>768px viewport):
  1. Show poster image immediately (LCP candidate -- preloaded)
  2. After page load, autoplay muted looping video over poster
  3. Video fades in over poster with CSS transition

Mobile (<768px viewport):
  1. Show optimized static image only (saves bandwidth)
  2. No video loaded at all (not just hidden -- not fetched)
```

### 4.2 Video Files (Pre-processed, in public/)

Video files go in `public/video/` (NOT `assets/`) because they should not be processed by Vite/webpack -- they are pre-optimized via ffmpeg before being added to the project.

```
public/
  video/
    hero-desktop.webm       # VP9, 720p, 24fps, ~3MB (primary)
    hero-desktop.mp4        # H.264, 720p, 24fps, ~4MB (fallback)
    hero-poster.webp        # Static poster, 1920x1080, ~200KB
    hero-poster-mobile.webp # Mobile poster, 768x1024, ~100KB
```

### 4.3 HeroVideo Component

```vue
<!-- app/components/sections/HeroVideo.vue -->
<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()

// Detect viewport for conditional video loading
const showVideo = ref(false)

onMounted(() => {
  // Only load video on desktop viewports
  // Using matchMedia instead of window.innerWidth for reliability
  const mql = window.matchMedia('(min-width: 768px)')
  showVideo.value = mql.matches

  // Also respect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (prefersReducedMotion.matches) {
    showVideo.value = false
  }
})
</script>

<template>
  <section class="relative h-[70vh] max-h-[800px] min-h-[500px] overflow-hidden">
    <!-- Mobile: static image (always rendered for SSG) -->
    <NuxtImg
      src="/video/hero-poster-mobile.webp"
      alt="Luftaufnahme der Pension Volgenandt im grunen Eichsfeld"
      class="absolute inset-0 h-full w-full object-cover md:hidden"
      loading="eager"
      fetchpriority="high"
      preload
      width="768"
      height="1024"
    />

    <!-- Desktop: poster image (shown until video loads) -->
    <NuxtImg
      src="/video/hero-poster.webp"
      alt="Luftaufnahme der Pension Volgenandt im grunen Eichsfeld"
      class="absolute inset-0 hidden h-full w-full object-cover md:block"
      loading="eager"
      fetchpriority="high"
      preload
      width="1920"
      height="1080"
    />

    <!-- Desktop: video (loaded client-side only, fades in over poster) -->
    <video
      v-if="showVideo"
      class="absolute inset-0 hidden h-full w-full object-cover md:block"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
      poster="/video/hero-poster.webp"
    >
      <source src="/video/hero-desktop.webm" type="video/webm" />
      <source src="/video/hero-desktop.mp4" type="video/mp4" />
    </video>

    <!-- Dark overlay for text readability -->
    <div class="absolute inset-0 bg-black/40" />

    <!-- Content overlay -->
    <div
      class="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white"
    >
      <h1 class="mb-4 text-4xl font-bold drop-shadow-lg md:text-6xl">
        {{ title }}
      </h1>
      <p class="mb-8 max-w-2xl text-xl drop-shadow-md md:text-2xl">
        {{ subtitle }}
      </p>
      <slot name="booking-widget" />
    </div>
  </section>
</template>
```

### 4.4 Performance Considerations

| Concern           | Solution                                                                              |
| ----------------- | ------------------------------------------------------------------------------------- |
| LCP impact        | Poster image is preloaded with `fetchpriority="high"`. Video loads after              |
| Mobile bandwidth  | Video is not loaded on mobile at all (not just hidden)                                |
| Reduced motion    | Respects `prefers-reduced-motion` -- shows poster only                                |
| File size         | WebM VP9 at 720p/24fps keeps the file under 3MB                                       |
| CLS               | Fixed height container (`h-[70vh]`) prevents layout shift                             |
| SSG compatibility | Poster images are in static HTML. Video is client-side only (`v-if` with `onMounted`) |

---

## 5. Component Architecture

**Confidence:** HIGH -- Nuxt 3 component conventions verified against [official docs](https://nuxt.com/docs/3.x/directory-structure/components)

### 5.1 Component Hierarchy

Nuxt 3 auto-imports all components from `app/components/`. Subdirectory names become prefixes (e.g., `app/components/booking/Widget.vue` becomes `<BookingWidget />`).

```
app/components/
|
+-- ui/                          # Base design system primitives
|   +-- Button.vue               # <UiButton> -- primary, secondary, ghost variants
|   +-- Card.vue                 # <UiCard> -- clickable card container
|   +-- Badge.vue                # <UiBadge> -- small label (price, distance)
|   +-- Icon.vue                 # <UiIcon> -- SVG icon wrapper
|   +-- Heading.vue              # <UiHeading> -- H1-H3 with consistent styling
|   +-- Container.vue            # <UiContainer> -- max-w-content centered wrapper
|   +-- Section.vue              # <UiSection> -- vertical section with padding
|
+-- app/                         # App-wide structural components
|   +-- Header.vue               # <AppHeader> -- sticky nav with logo + CTA
|   +-- Footer.vue               # <AppFooter> -- 4-column footer
|   +-- CookieConsent.vue        # <AppCookieConsent> -- GDPR banner
|   +-- ConsentPlaceholder.vue   # <AppConsentPlaceholder> -- blocked content fallback
|   +-- BreadcrumbNav.vue        # <AppBreadcrumbNav> -- page hierarchy
|   +-- SeoHead.vue              # <AppSeoHead> -- meta tags composable wrapper
|
+-- booking/                     # Beds24 integration components
|   +-- Widget.vue               # <BookingWidget> -- full booking iframe
|   +-- Bar.vue                  # <BookingBar> -- compact sticky bar (desktop)
|   +-- FloatingButton.vue       # <BookingFloatingButton> -- mobile FAB
|   +-- QuickSearch.vue          # <BookingQuickSearch> -- date picker in hero
|
+-- rooms/                       # Room-specific components
|   +-- Card.vue                 # <RoomsCard> -- room card for overview/homepage
|   +-- Gallery.vue              # <RoomsGallery> -- image carousel + lightbox
|   +-- Amenities.vue            # <RoomsAmenities> -- icon grid of amenities
|   +-- Extras.vue               # <RoomsExtras> -- bookable add-ons list
|   +-- PriceCard.vue            # <RoomsPriceCard> -- price + CTA sidebar
|   +-- OtherRooms.vue           # <RoomsOtherRooms> -- "See also" carousel
|
+-- sections/                    # Page section components
|   +-- HeroVideo.vue            # <SectionsHeroVideo> -- homepage hero
|   +-- HeroImage.vue            # <SectionsHeroImage> -- subpage hero
|   +-- Welcome.vue              # <SectionsWelcome> -- intro text + image
|   +-- RoomPreview.vue          # <SectionsRoomPreview> -- featured rooms grid
|   +-- Experience.vue           # <SectionsExperience> -- activities teaser
|   +-- Testimonials.vue         # <SectionsTestimonials> -- guest reviews carousel
|   +-- Sustainability.vue       # <SectionsSustainability> -- eco icons + text
|   +-- Map.vue                  # <SectionsMap> -- OpenStreetMap embed
|   +-- ContactForm.vue          # <SectionsContactForm> -- contact form
|
+-- activities/                  # Activities page components
    +-- Card.vue                 # <ActivitiesCard> -- activity with distance badge
    +-- CategoryFilter.vue       # <ActivitiesCategoryFilter> -- filter by type
```

### 5.2 Naming Convention

| Rule                         | Example                                  | Reason                          |
| ---------------------------- | ---------------------------------------- | ------------------------------- |
| Subdirectory = prefix        | `booking/Widget.vue` = `<BookingWidget>` | Nuxt auto-import convention     |
| PascalCase filenames         | `PriceCard.vue` not `price-card.vue`     | Vue SFC convention              |
| Component prefix = domain    | `Rooms*`, `Booking*`, `Sections*`        | Prevents naming collisions      |
| UI components = `Ui*` prefix | `<UiButton>`, `<UiCard>`                 | Clearly marks base components   |
| App-wide = `App*` prefix     | `<AppHeader>`, `<AppFooter>`             | Distinguishes from section/page |

### 5.3 Component Design Principles

1. **Props down, events up.** Data flows from pages to components via props. User actions emit events.
2. **No direct content fetching in components.** Pages fetch data with `useAsyncData()`, then pass to components as props. Components are presentation-only.
3. **Composables for shared logic.** Business logic lives in `app/composables/`, not in components.
4. **Slots for composition.** Use named slots where child content varies (e.g., `<SectionsHeroVideo>` has a `booking-widget` slot).
5. **Tailwind for styling.** No `<style>` blocks except where truly necessary (e.g., third-party iframe styling). Use utility classes.

---

## 6. Tailwind CSS v4 Design System

**Confidence:** HIGH -- verified against [official Tailwind v4 docs](https://tailwindcss.com/docs/theme)

### 6.1 CSS-First Configuration (No tailwind.config.ts)

Tailwind CSS v4 replaces the JavaScript config file with CSS `@theme` blocks. All design tokens are defined in the main CSS file.

```css
/* app/assets/css/main.css */
@import 'tailwindcss';

/* ===========================
   DESIGN TOKENS
   =========================== */

@theme {
  /* -- Colors: Sage Green (brand) -- */
  --color-sage-50: #f4f7f3;
  --color-sage-100: #e6ede3;
  --color-sage-200: #cddbc7;
  --color-sage-300: #a8c49a;
  --color-sage-400: #7a9b6d;
  --color-sage-500: #5a7d4e;
  --color-sage-600: #4a6741;
  --color-sage-700: #3b5234;
  --color-sage-800: #31432c;
  --color-sage-900: #2c3e2d;

  /* -- Colors: Stone (backgrounds) -- */
  --color-stone-50: #fafaf7;
  --color-stone-100: #f0ede8;
  --color-stone-200: #e4ddd3;
  --color-stone-300: #d4d0cb;

  /* -- Colors: Wood (accents) -- */
  --color-wood-300: #c4b59b;
  --color-wood-400: #8b7355;
  --color-wood-500: #5c4a37;

  /* -- Colors: Terra (CTA) -- */
  --color-terra-400: #c07b54;
  --color-terra-500: #a86842;
  --color-terra-600: #8f5835;

  /* -- Colors: Semantic -- */
  --color-charcoal: #333333;
  --color-grey: #6b6b6b;

  /* -- Typography -- */
  --font-sans: 'DM Sans', system-ui, sans-serif;

  /* -- Spacing -- */
  --spacing-section: 5rem;
  --spacing-section-sm: 3.5rem;

  /* -- Border Radius -- */
  --radius-card: 0.5rem;

  /* -- Breakpoints (keep defaults, just documenting) -- */
  /* --breakpoint-sm: 40rem;  640px */
  /* --breakpoint-md: 48rem;  768px */
  /* --breakpoint-lg: 64rem;  1024px */
  /* --breakpoint-xl: 80rem;  1280px */

  /* -- Animations -- */
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

/* ===========================
   CUSTOM UTILITIES
   =========================== */

@utility container-content {
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: 1rem;
}

/* ===========================
   BASE STYLES
   =========================== */

@layer base {
  html {
    font-size: 100%;
    scroll-behavior: smooth;
  }

  body {
    font-family: var(--font-sans);
    color: var(--color-charcoal);
    background-color: var(--color-stone-50);
    line-height: 1.7;
    font-size: 1.125rem; /* 18px base */
  }

  /* Respect reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

### 6.2 Usage in Components

With Tailwind v4 `@theme`, all design tokens automatically generate utility classes:

```vue
<!-- Using custom colors as utilities -->
<button class="bg-terra-400 hover:bg-terra-500 text-white font-semibold
               px-6 py-3 rounded-card transition-colors">
  Verfugbarkeit prufen
</button>

<!-- Using custom spacing -->
<section class="py-section md:py-section-sm">
  <div class="container-content">
    <!-- content -->
  </div>
</section>

<!-- Using custom colors as CSS variables in edge cases -->
<div :style="{ borderColor: `var(--color-sage-300)` }">
```

---

## 7. Contact Form Submission (SSG)

**Confidence:** HIGH -- verified against [Netlify Forms docs](https://docs.netlify.com/manage/forms/setup/) and community guides

### 7.1 Recommended: Netlify Forms (if hosting on Netlify)

Netlify Forms works with SSG by detecting `data-netlify="true"` in the pre-rendered HTML. **Critical gotcha for Nuxt 3:** Netlify's form detection parses the deploy output HTML. With SSG, forms in Vue components ARE rendered in the output HTML, but you need a hidden form in `public/` as a safety net.

```
app/
  pages/kontakt.vue              # Actual form page
  public/
    form-fallback.html           # Hidden form for Netlify detection
```

### 7.2 Implementation

```vue
<!-- app/components/sections/ContactForm.vue -->
<script setup lang="ts">
interface FormData {
  name: string
  email: string
  phone: string
  message: string
  privacy: boolean
}

const form = reactive<FormData>({
  name: '',
  email: '',
  phone: '',
  message: '',
  privacy: false,
})

const status = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')
const errorMessage = ref('')

async function handleSubmit() {
  if (!form.privacy) return

  status.value = 'submitting'

  try {
    const body = new URLSearchParams({
      'form-name': 'contact',
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
    })

    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })

    if (response.ok) {
      status.value = 'success'
    } else {
      throw new Error(`Form submission failed: ${response.status}`)
    }
  } catch (e) {
    status.value = 'error'
    errorMessage.value =
      'Entschuldigung, es gab einen Fehler. Bitte versuchen Sie es erneut oder kontaktieren Sie uns telefonisch.'
  }
}
</script>

<template>
  <form
    name="contact"
    method="POST"
    data-netlify="true"
    data-netlify-honeypot="bot-field"
    @submit.prevent="handleSubmit"
  >
    <!-- Honeypot for spam protection -->
    <div class="hidden">
      <input name="bot-field" />
    </div>
    <input type="hidden" name="form-name" value="contact" />

    <!-- Form fields -->
    <div class="grid gap-6 md:grid-cols-2">
      <div>
        <label for="name" class="mb-1 block text-sm font-medium">Name *</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          name="name"
          required
          class="rounded-card w-full border border-stone-300 px-4 py-3 focus:border-sage-400 focus:ring-2 focus:ring-sage-400"
        />
      </div>
      <div>
        <label for="email" class="mb-1 block text-sm font-medium">E-Mail *</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          name="email"
          required
          class="rounded-card w-full border border-stone-300 px-4 py-3 focus:border-sage-400 focus:ring-2 focus:ring-sage-400"
        />
      </div>
    </div>

    <div class="mt-4">
      <label for="phone" class="mb-1 block text-sm font-medium">Telefon</label>
      <input
        id="phone"
        v-model="form.phone"
        type="tel"
        name="phone"
        class="rounded-card w-full border border-stone-300 px-4 py-3 focus:border-sage-400 focus:ring-2 focus:ring-sage-400"
      />
    </div>

    <div class="mt-4">
      <label for="message" class="mb-1 block text-sm font-medium">Nachricht *</label>
      <textarea
        id="message"
        v-model="form.message"
        name="message"
        rows="5"
        required
        class="rounded-card w-full border border-stone-300 px-4 py-3 focus:border-sage-400 focus:ring-2 focus:ring-sage-400"
      />
    </div>

    <div class="mt-4">
      <label class="flex items-start gap-3">
        <input
          v-model="form.privacy"
          type="checkbox"
          name="privacy"
          required
          class="mt-1 h-5 w-5"
        />
        <span class="text-grey text-sm">
          Ich habe die
          <NuxtLink to="/datenschutz" class="text-sage-600 underline">
            Datenschutzerklaerung
          </NuxtLink>
          gelesen und stimme der Verarbeitung meiner Daten zu. *
        </span>
      </label>
    </div>

    <UiButton type="submit" class="mt-6" :disabled="status === 'submitting' || !form.privacy">
      {{ status === 'submitting' ? 'Wird gesendet...' : 'Nachricht senden' }}
    </UiButton>

    <p v-if="status === 'success'" class="mt-4 font-medium text-sage-600">
      Vielen Dank! Wir melden uns in Kuerze bei Ihnen.
    </p>
    <p v-if="status === 'error'" class="mt-4 text-red-600">
      {{ errorMessage }}
    </p>
  </form>
</template>
```

### 7.3 Fallback HTML for Netlify Detection

```html
<!-- public/form-fallback.html -->
<!-- This file ensures Netlify detects the form during deploy -->
<form name="contact" data-netlify="true" data-netlify-honeypot="bot-field" hidden>
  <input name="bot-field" />
  <input name="name" />
  <input name="email" />
  <input name="phone" />
  <input name="message" />
  <input name="privacy" type="checkbox" />
</form>
```

### 7.4 Alternative: Formspree (if hosting on Cloudflare Pages)

If deploying to Cloudflare Pages instead of Netlify, Netlify Forms is not available. Use Formspree (free tier: 50 submissions/month, sufficient for a pension).

```typescript
// Only change: POST to Formspree endpoint instead of '/'
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: form.name,
    email: form.email,
    phone: form.phone,
    message: form.message,
  }),
})
```

---

## 8. Deployment Pipeline

**Confidence:** HIGH -- verified against [Netlify docs](https://docs.netlify.com/integrations/frameworks/nuxt/) and [Cloudflare Pages docs](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nuxt-site/)

### 8.1 Nuxt Configuration for SSG

```typescript
// nuxt.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Full static generation
  ssr: true,
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      // Ensure all room pages are pre-rendered even if not linked
      // (safety net -- crawlLinks should find them, but be explicit)
    },
  },

  // Tailwind CSS v4 via Vite plugin
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },

  // Modules
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/scripts',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-schema-org',
  ],

  // @nuxt/image
  image: {
    quality: 80,
    format: ['webp', 'avif'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1920,
    },
  },

  // @nuxt/fonts
  fonts: {
    families: [{ name: 'DM Sans', provider: 'google', weights: [400, 500, 600, 700] }],
  },

  // Sitemap
  sitemap: {
    siteUrl: 'https://www.pension-volgenandt.de',
  },

  // Schema.org
  schemaOrg: {
    identity: {
      type: 'LodgingBusiness',
      name: 'Pension Volgenandt',
      url: 'https://www.pension-volgenandt.de',
      logo: '/img/logo.webp',
      address: {
        streetAddress: 'Otto-Reuter-Strasse 28',
        addressLocality: 'Leinefelde-Worbis OT Breitenbach',
        postalCode: '37327',
        addressCountry: 'DE',
      },
    },
  },

  // App configuration
  app: {
    head: {
      htmlAttrs: { lang: 'de' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
})
```

### 8.2 Netlify Deployment

```toml
# netlify.toml
[build]
  command = "pnpm run generate"
  publish = ".output/public"

[build.environment]
  NODE_VERSION = "20"
  PNPM_FLAGS = "--shamefully-hoist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/_ipx/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/video/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/img/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 8.3 Cloudflare Pages Deployment (Alternative)

No config file needed. Set in the Cloudflare dashboard:

| Setting                | Value                               |
| ---------------------- | ----------------------------------- |
| Framework preset       | NuxtJS                              |
| Build command          | `pnpm run generate`                 |
| Build output directory | `.output/public`                    |
| Node.js version        | 20                                  |
| Environment variable   | `PNPM_FLAGS` = `--shamefully-hoist` |

### 8.4 Build Scripts

```json
// package.json (scripts section)
{
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "typecheck": "nuxt typecheck"
  }
}
```

```makefile
# Makefile
.PHONY: dev build generate preview lint format typecheck clean

dev:
	pnpm dev

build:
	pnpm build

generate:
	pnpm generate

preview:
	pnpm preview

lint:
	pnpm lint

lint-fix:
	pnpm lint:fix

format:
	pnpm format

typecheck:
	pnpm typecheck

clean:
	rm -rf .output .nuxt node_modules/.cache
```

---

## 9. Complete File Structure

```
pension-volgenandt-website/
|
+-- .planning/                    # Project documentation
|   +-- research/                 # Research files (this file)
|   +-- PROJECT.md
|   +-- MILESTONES.md
|
+-- .github/
|   +-- workflows/
|       +-- deploy.yml            # CI/CD (optional, Netlify auto-deploys)
|
+-- app/
|   +-- assets/
|   |   +-- css/
|   |       +-- main.css          # Tailwind v4 @theme + base styles
|   |
|   +-- components/
|   |   +-- ui/                   # Base design system
|   |   +-- app/                  # App-wide (header, footer, consent)
|   |   +-- booking/              # Beds24 integration
|   |   +-- rooms/                # Room display components
|   |   +-- sections/             # Page sections (hero, testimonials, etc.)
|   |   +-- activities/           # Activity components
|   |
|   +-- composables/
|   |   +-- useCookieConsent.ts   # Cookie consent state management
|   |   +-- useScrollReveal.ts    # Intersection Observer for fade-in
|   |   +-- useSchemaOrg.ts       # Page-specific structured data
|   |
|   +-- layouts/
|   |   +-- default.vue           # Header + slot + Footer + CookieConsent
|   |
|   +-- pages/
|   |   +-- index.vue             # Homepage
|   |   +-- zimmer/
|   |   |   +-- index.vue         # Room overview
|   |   |   +-- [slug].vue        # Room detail (dynamic)
|   |   +-- familie.vue           # Family page
|   |   +-- aktivitaeten.vue      # Activities page
|   |   +-- nachhaltigkeit.vue    # Sustainability page
|   |   +-- kontakt.vue           # Contact page
|   |   +-- impressum.vue         # Legal: Impressum
|   |   +-- datenschutz.vue       # Legal: Privacy policy
|   |   +-- agb.vue               # Legal: Terms
|   |
|   +-- public/
|       +-- img/                  # Static images (already optimized)
|       +-- video/                # Hero video files (pre-optimized)
|       +-- favicon.ico
|       +-- form-fallback.html    # Netlify form detection fallback
|
+-- content/
|   +-- rooms/                    # Room YAML data files
|   |   +-- emils-kuhwiese.yml
|   |   +-- schoene-aussicht.yml
|   |   +-- balkonzimmer.yml
|   |   +-- rosengarten.yml
|   |   +-- appartement.yml
|   |   +-- doppelzimmer.yml
|   |   +-- einzelzimmer.yml
|   |
|   +-- activities/               # Activity YAML data files
|   |   +-- baumkronenpfad.yml
|   |   +-- eichsfeld-wanderweg.yml
|   |   +-- ...
|   |
|   +-- testimonials.yml          # Guest reviews
|   |
|   +-- pages/                    # Markdown content pages
|       +-- familie.md
|       +-- aktivitaeten.md
|       +-- nachhaltigkeit.md
|       +-- impressum.md
|       +-- datenschutz.md
|       +-- agb.md
|
+-- content.config.ts             # Nuxt Content collection definitions
+-- nuxt.config.ts                # Nuxt configuration
+-- package.json
+-- pnpm-lock.yaml
+-- tsconfig.json
+-- .eslintrc.cjs                 # ESLint config
+-- .prettierrc                   # Prettier config
+-- Makefile                      # Build commands
+-- netlify.toml                  # Netlify deployment config
```

---

## 10. Integration Points Map

All places where systems connect -- the most likely sources of bugs and complexity.

| Integration        | Source                       | Target                                     | Mechanism                         | Consent Required?    | Complexity |
| ------------------ | ---------------------------- | ------------------------------------------ | --------------------------------- | -------------------- | ---------- |
| Room data to pages | `content/rooms/*.yml`        | `pages/zimmer/[slug].vue`                  | `queryCollection()` at build time | No                   | Low        |
| Beds24 booking     | `BookingWidget.vue`          | `beds24.com/booking2.php`                  | iframe with URL params            | Yes (booking)        | Medium     |
| Beds24 per-room    | Room YAML `beds24PropertyId` | `BookingWidget` prop                       | Prop passing                      | Yes (booking)        | Low        |
| Hero video         | `public/video/`              | `HeroVideo.vue`                            | Native `<video>` element          | No (self-hosted)     | Low        |
| Cookie consent     | `useCookieConsent()`         | All third-party components                 | Reactive computed + v-if          | N/A (IS the consent) | Medium     |
| Contact form       | `ContactForm.vue`            | Netlify Forms API                          | URL-encoded POST to `/`           | No                   | Medium     |
| Image optimization | `app/assets/images/`         | `<NuxtImg>` component                      | `@nuxt/image` ipxStatic at build  | No                   | Low        |
| Font loading       | Google Fonts CDN             | `@nuxt/fonts` module                       | Self-hosted at build time         | No (self-hosted)     | Low        |
| Map embed          | OpenStreetMap tile server    | `<iframe>` or Leaflet                      | Tile URL, no API key              | No (no cookies)      | Low        |
| Schema.org         | `nuxt-schema-org`            | HTML `<script type="application/ld+json">` | Auto-generated at build           | No                   | Low        |
| Sitemap            | `@nuxtjs/sitemap`            | `/sitemap.xml`                             | Auto-generated at build           | No                   | Low        |

### Critical Integration: Beds24 iframe + Cookie Consent

This is the **highest complexity integration**. The Beds24 widget is an iframe that loads third-party content. The consent system must:

1. Block the iframe entirely until consent is given (no `src` attribute, not just hidden)
2. Show a meaningful placeholder with an explanation in German
3. Allow the user to grant consent inline (without re-opening the banner)
4. Load the iframe reactively when consent state changes
5. Persist consent across page navigations (cookie-based)
6. Pass the correct `propid` parameter per room page

The `v-if` approach (section 3.4) handles this cleanly because Vue does not render the iframe element at all until the condition is true, meaning no HTTP request to Beds24 is made.

---

## 11. Suggested Build Order for Phases

Based on dependency analysis of the architecture above, here is the recommended build order:

### Phase 1: Foundation (No external dependencies)

Build order within phase:

1. Project scaffolding: `nuxt.config.ts`, `content.config.ts`, Tailwind v4 setup
2. Design tokens in `main.css` (`@theme` block with all colors, fonts, spacing)
3. Base UI components: `UiButton`, `UiCard`, `UiContainer`, `UiSection`, `UiHeading`
4. Layout: `default.vue` with `AppHeader` + `AppFooter`
5. Cookie consent composable + banner component
6. Legal pages (Impressum, Datenschutz, AGB) -- these are content-only, good for testing the pipeline

**Why this order:** Everything else depends on the design system and layout. Cookie consent must exist before any third-party integration. Legal pages are the simplest content pages and validate the full build pipeline.

### Phase 2: Content Infrastructure + Room Pages

Build order within phase:

1. Room YAML data files (all 7 rooms)
2. `RoomsCard` component
3. Rooms overview page (`/zimmer/`)
4. `RoomsGallery`, `RoomsAmenities`, `RoomsPriceCard`, `RoomsExtras` components
5. Room detail page template (`/zimmer/[slug].vue`)
6. `RoomsOtherRooms` component (cross-linking)

**Why this order:** Room data is the core content. Building the card first enables both the overview page and homepage preview. The detail page needs all sub-components before assembly.

### Phase 3: Homepage + Hero

Build order within phase:

1. Hero video preparation (ffmpeg processing)
2. `HeroVideo` component with mobile poster fallback
3. `SectionsWelcome` component
4. `SectionsRoomPreview` (uses `RoomsCard` from Phase 2)
5. `SectionsExperience` teaser
6. `SectionsTestimonials` carousel
7. `SectionsSustainability` teaser
8. Homepage assembly (`index.vue`)

**Why this order:** Hero is the most complex visual component. Other sections are simpler and can be built quickly once the hero is done. Room preview reuses Phase 2 components.

### Phase 4: Booking Integration

Build order within phase:

1. `AppConsentPlaceholder` component
2. `BookingWidget` component (iframe + consent gate)
3. Integrate `BookingWidget` into room detail pages
4. `BookingQuickSearch` component (date picker overlay for hero)
5. `BookingBar` (desktop sticky) / `BookingFloatingButton` (mobile FAB)
6. End-to-end booking flow testing

**Why this order:** The consent placeholder must exist first. The basic widget comes before the hero integration and sticky bar. E2E testing is last because all pieces must be in place.

### Phase 5: Remaining Pages + Polish

Build order within phase:

1. Activity YAML data + `ActivitiesCard` component
2. Activities page
3. Family page
4. Sustainability page
5. Contact page with form + map
6. Testimonials data
7. `AppBreadcrumbNav` on all subpages
8. Schema.org structured data per page type
9. Scroll reveal animations (fade-in on scroll)

### Phase 6: Optimization + Launch

1. Image optimization audit (all images through `<NuxtImg>`)
2. Lighthouse performance audit
3. Accessibility audit (keyboard nav, screen reader, contrast)
4. SEO audit (structured data testing, sitemap verification)
5. Cross-browser testing
6. Deployment configuration (Netlify/Cloudflare)
7. DNS migration
8. Post-launch monitoring

---

## 12. Anti-Patterns to Avoid

| Anti-Pattern                                        | Why It's Bad                                            | What to Do Instead                          |
| --------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------- |
| Loading Beds24 widget without consent               | TTDSG violation, legal risk                             | Always gate behind consent check            |
| Using `<style scoped>` extensively with Tailwind    | Conflicts with utility-first approach, increases bundle | Use Tailwind utilities in templates         |
| Fetching data inside components                     | Makes components hard to test and reuse                 | Fetch in pages, pass as props               |
| Using `@nuxtjs/tailwindcss` module with Tailwind v4 | Module is for v3, conflicts with v4's Vite plugin       | Use `@tailwindcss/vite` directly            |
| Putting video files in `assets/`                    | Vite tries to process them, increases build time        | Put in `public/video/`                      |
| Using Google Maps without consent                   | Sets cookies, needs consent, adds complexity            | Use OpenStreetMap (no cookies needed)       |
| Hardcoding Beds24 property IDs in components        | Breaks if IDs change, can't reuse                       | Store in room YAML data, pass as props      |
| Building a custom date picker for booking           | Duplicates Beds24 functionality, sync issues            | Use Beds24's built-in date picker in iframe |
| Using `ssr: false` with `@nuxt/image`               | Images won't be optimized at build time                 | Keep `ssr: true` (default)                  |
| Using JavaScript config file for Tailwind v4        | v4 uses CSS-first `@theme`, JS config is legacy         | Define all tokens in `main.css`             |

---

## Sources

### Official Documentation (HIGH confidence)

- [Nuxt Content v3 - Getting Started](https://content.nuxt.com/docs/getting-started)
- [Nuxt Content v3 - YAML Files](https://content.nuxt.com/docs/files/yaml)
- [Nuxt Content v3 - Collection Types](https://content.nuxt.com/docs/collections/types)
- [Nuxt Content v3 - Define Collections](https://content.nuxt.com/docs/collections/define)
- [Nuxt Content v3 - Schema Validators](https://content.nuxt.com/docs/collections/validators)
- [Nuxt Scripts - useScriptTriggerConsent](https://scripts.nuxt.com/docs/api/use-script-trigger-consent)
- [Nuxt Scripts - Consent Guide](https://scripts.nuxt.com/docs/guides/consent)
- [Nuxt Image - Static Images](https://image.nuxt.com/advanced/static-images)
- [Nuxt Image - IPX Provider](https://image.nuxt.com/providers/ipx)
- [Tailwind CSS v4 - Theme Variables](https://tailwindcss.com/docs/theme)
- [Tailwind CSS v4 - Nuxt Installation](https://tailwindcss.com/docs/installation/framework-guides/nuxt)
- [Nuxt 3 - Components Directory](https://nuxt.com/docs/3.x/directory-structure/components)
- [Nuxt 3 - Auto-imports](https://nuxt.com/docs/3.x/guide/concepts/auto-imports)
- [Nuxt 3 - Prerendering](https://nuxt.com/docs/3.x/getting-started/prerendering)
- [Netlify - Nuxt Integration](https://docs.netlify.com/integrations/frameworks/nuxt/)
- [Netlify - Forms Setup](https://docs.netlify.com/manage/forms/setup/)
- [Cloudflare Pages - Nuxt Deployment](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nuxt-site/)

### Beds24 Documentation (HIGH confidence)

- [Beds24 Wiki - Embedded Iframe](https://wiki.beds24.com/index.php/Embedded_Iframe)
- [Beds24 Wiki - Make Your Own Booking Widget](https://wiki.beds24.com/index.php/Make_Your_Own_Booking_Widget)
- [Beds24 Wiki - Booking Widget on Your Website](https://wiki.beds24.com/index.php/Booking_Widget_opening_Booking_Page_on_Your_Own_Website)

### Community / Guides (MEDIUM confidence)

- [Maya Shavin - Netlify Form + Nuxt 3 Static](https://mayashavin.com/articles/contact-form-netlify-form-nuxt-3-static)
- [Nick Frostbutter - Deploy Nuxt SSG with Cloudflare Pages](https://nick.af/articles/deploy-nuxt-ssg-with-cloudflare-pages)
- [Mastering Nuxt - Tailwind CSS v4 on Nuxt 3](https://masteringnuxt.com/blog/installing-tailwind-css-v4-on-nuxt-3)
- [nuxt-simple-cookie-consent (GitHub)](https://github.com/criting/nuxt-simple-cookie-consent)
- [DebugBear - Nuxt Scripts Guide](https://www.debugbear.com/blog/nuxt-scripts)
