# Phase 2: Content Infrastructure & Room Pages - Research

**Researched:** 2026-02-22
**Domain:** Nuxt Content v3 YAML data collections, room page components, photo gallery/lightbox, icon system, pricing schema
**Confidence:** HIGH

## Summary

Phase 2 builds the content infrastructure (Nuxt Content v3 YAML collections with Zod validation) and all room-facing UI: the room overview page (`/zimmer/`), individual room detail pages (`/zimmer/[slug]`), photo gallery with lightbox, amenity icon grid, pricing tables with seasonal support, and "Weitere Zimmer" cross-linking.

The standard approach is: define a `rooms` data collection in `content.config.ts` with a Zod schema, create one YAML file per room in `content/rooms/`, query with `queryCollection('rooms')` in page components, and build the gallery/lightbox as a custom Vue component using VueUse composables (`useSwipe`, `useFocusTrap`) for touch and accessibility. Icons use `@nuxt/icon` with the Lucide icon set. No external gallery library is needed -- the requirements are specific enough that a custom component is cleaner than adapting a generic library.

**Primary recommendation:** Build the gallery/lightbox as a custom component. Use `@nuxt/icon` with `@iconify-json/lucide` for amenity icons. Design the YAML schema with a flat `pricing` array supporting flexible seasonal rates and per-occupancy variants.

## Standard Stack

### Core (Phase 2 additions to existing Phase 1 stack)

| Library                | Version | Purpose            | Why Standard                                                                                                                 |
| ---------------------- | ------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `@nuxt/content`        | ^3.x    | Content management | SQL-based data collections with Zod validation; YAML file support; type-safe queries. Already in project stack from Phase 1. |
| `@nuxt/icon`           | ^1.x    | Icon component     | 200,000+ Iconify icons via `<Icon>` component; server bundle for SSG; tree-shakeable per collection.                         |
| `@iconify-json/lucide` | latest  | Lucide icon set    | Clean, consistent line icons; covers all needed amenity icons; 1300+ icons; MIT licensed.                                    |
| `focus-trap`           | ^7.x    | Focus management   | Required dependency for VueUse `useFocusTrap`; traps keyboard focus inside lightbox overlay.                                 |

### Supporting (already in stack from Phase 1)

| Library        | Version | Purpose              | When to Use                                                                                                                    |
| -------------- | ------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `@vueuse/nuxt` | ^14.x   | Composable utilities | `useSwipe` for touch gallery navigation; `useFocusTrap` for lightbox accessibility; `useMediaQuery` for responsive behavior.   |
| `@nuxt/image`  | ^2.x    | Image optimization   | All room photos use `<NuxtImg>` for WebP/AVIF generation, responsive srcsets, lazy loading. Hero image uses `loading="eager"`. |

### Alternatives Considered

| Instead of          | Could Use                           | Tradeoff                                                                                                                                                                                                                   |
| ------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Custom lightbox     | lightGallery (npm `lightgallery`)   | Feature-rich but 50KB+ with plugins; CSS conflicts with Tailwind; Vue 3/Nuxt 4 integration has known issues ([GitHub #1580](https://github.com/sachinchoolur/lightGallery/issues/1580)); overkill for 5-8 images per room. |
| Custom lightbox     | vue-easy-lightbox                   | Lightweight but no thumbnail strip support; limited customization for the hero+thumbnails pattern required by CONTEXT.md decisions.                                                                                        |
| Custom lightbox     | vue-lightbox-advanced               | Has accessibility features but low npm downloads; uncertain maintenance; would still need customization for the exact UX specified.                                                                                        |
| @nuxt/icon + Lucide | Inline SVG components               | More control but requires manual SVG management; no icon search/discovery tooling; loses Iconify ecosystem benefits.                                                                                                       |
| @nuxt/icon + Lucide | Heroicons (@iconify-json/heroicons) | Good quality but fewer icons (300 vs 1300); missing several hospitality-specific icons (no bed-double, no shower-head, no kitchen-specific icons).                                                                         |

**Installation:**

```bash
# Phase 2 additions (Phase 1 deps already installed)
pnpm add -D @nuxt/icon @iconify-json/lucide
pnpm add focus-trap
```

Note: `@nuxt/content`, `@vueuse/nuxt`, and `@nuxt/image` are already installed from Phase 1.

## Architecture Patterns

### Recommended Project Structure (Phase 2 additions)

```
content/
  rooms/                          # Room YAML data files (1 per room)
    emils-kuhwiese.yml
    schoene-aussicht.yml
    balkonzimmer.yml
    rosengarten.yml
    wohlfuehl-appartement.yml
    doppelzimmer.yml
    einzelzimmer.yml

content.config.ts                 # Collection definitions + Zod schemas (project root)

app/
  components/
    rooms/                        # Room-specific components
      Card.vue                    # <RoomsCard> -- overview card (2-col grid)
      Gallery.vue                 # <RoomsGallery> -- hero + thumbnail strip
      Lightbox.vue                # <RoomsLightbox> -- fullscreen overlay
      Amenities.vue               # <RoomsAmenities> -- icon grid
      PriceTable.vue              # <RoomsPriceTable> -- seasonal pricing table
      Extras.vue                  # <RoomsExtras> -- Zusatzleistungen section
      OtherRooms.vue              # <RoomsOtherRooms> -- "Weitere Zimmer" grid
      Description.vue             # <RoomsDescription> -- "Mehr lesen" expand

  pages/
    zimmer/
      index.vue                   # Room overview page (/zimmer/)
      [slug].vue                  # Room detail page (/zimmer/[slug])

  composables/
    useGallery.ts                 # Gallery state: current image, lightbox open/close
```

### Pattern 1: Nuxt Content v3 Data Collection for Rooms

**What:** Define a `rooms` data collection with Zod validation in `content.config.ts`. Each room is a YAML file in `content/rooms/`. The collection uses `type: 'data'` because rooms are not page content -- they are structured data rendered by page components.

**When to use:** For all structured data that does not directly correspond to a webpage route but needs querying, validation, and type safety.

**Key insight:** Data collections auto-generate these base fields: `id`, `stem` (file path without extension), `extension`, and `meta`. The `stem` field equals the YAML filename without `.yml`, making it usable as a slug for routing. However, defining an explicit `slug` field in the schema is more robust because it decouples the URL path from the filename.

```typescript
// content.config.ts (project root)
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

// Amenity enum -- used for both validation and icon mapping
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

// Pricing period schema -- flexible seasonal support
const pricingPeriodSchema = z.object({
  label: z.string(), // "Hauptsaison", "Nebensaison", etc.
  dateRange: z.string().optional(), // "01.04. - 31.10." (display only)
  rates: z.array(
    z.object({
      occupancy: z.number(), // 1, 2 (number of persons)
      pricePerNight: z.number(), // EUR amount incl. VAT
    }),
  ),
})

// Extra/add-on schema
const extraSchema = z.object({
  name: z.string(), // "Frühstück", "Hund", "BBQ-Set"
  description: z.string().optional(), // Short description
  price: z.number(), // EUR amount
  unit: z.string(), // "pro Person / Nacht", "pro Nacht"
})

// Room schema
const roomSchema = z.object({
  // Identity
  name: z.string(),
  slug: z.string(),
  type: z.enum(['ferienwohnung', 'doppelzimmer', 'einzelzimmer']),
  category: z.string(), // Display label: "Ferienwohnung", "Doppelzimmer"
  shortDescription: z.string(), // 2-3 sentences for card
  description: z.string(), // Full description for detail page

  // Beds24 integration (needed in Phase 5, define now)
  beds24PropertyId: z.number(),
  beds24RoomId: z.number().optional(),

  // Capacity & features
  maxGuests: z.number(),
  beds: z.string(), // "1 Doppelbett", "2 Einzelbetten"
  sizeM2: z.number().optional(),

  // Pricing
  pricing: z.array(pricingPeriodSchema).min(1),
  startingPrice: z.number(), // Lowest "ab" price for card display

  // Media
  heroImage: z.string(), // Independent hero image path
  heroImageAlt: z.string(),
  gallery: z.array(
    z.object({
      src: z.string(),
      alt: z.string(),
    }),
  ),

  // Amenities
  amenities: z.array(amenityEnum),
  highlights: z.array(z.string()), // 2-3 key selling points for cards

  // Extras
  extras: z.array(extraSchema).default([]),

  // Display
  sortOrder: z.number().default(0),
  featured: z.boolean().default(false),
})

export default defineContentConfig({
  collections: {
    rooms: defineCollection({
      type: 'data',
      source: 'rooms/*.yml',
      schema: roomSchema,
    }),
  },
})
```

### Pattern 2: Room Data YAML File Structure

**What:** Each room is a single YAML file with all data needed for both the card view and detail page.

**Design decisions reflected:**

- `heroImage` is separate from `gallery` array (per CONTEXT.md: hero independently from gallery order)
- `pricing` supports flexible seasonal periods with per-occupancy rates (per CONTEXT.md: price table with variants)
- `gallery` items pair `src` with `alt` (keeps alt text co-located with image reference)
- `startingPrice` is denormalized for card display (avoids computing min price from nested pricing array in templates)

```yaml
# content/rooms/emils-kuhwiese.yml
name: "Ferienwohnung Emil's Kuhwiese"
slug: emils-kuhwiese
type: ferienwohnung
category: 'Ferienwohnung'
shortDescription: >-
  Gemütliche Ferienwohnung mit Blick auf die grünen Wiesen
  des Eichsfelds. Eigene Küche, Terrasse und Platz für
  bis zu 4 Gäste.
description: >-
  Die Ferienwohnung Emil's Kuhwiese bietet Ihnen auf ca. 45 m²
  alles, was Sie für einen entspannten Aufenthalt brauchen.
  Die voll ausgestattete Küche ermöglicht Selbstversorgung,
  während die Terrasse zum Frühstück im Grünen einlädt.

  Ein Doppelbett und ein Schlafsofa bieten Platz für Familien
  oder kleine Gruppen. WLAN, Fernseher und ein eigenes
  Badezimmer mit Dusche gehören selbstverständlich dazu.

beds24PropertyId: 257613
beds24RoomId: null

maxGuests: 4
beds: '1 Doppelbett, 1 Schlafsofa'
sizeM2: 45

pricing:
  - label: 'Standardpreis'
    rates:
      - occupancy: 1
        pricePerNight: 55
      - occupancy: 2
        pricePerNight: 70

startingPrice: 55

heroImage: /img/rooms/emils-kuhwiese-wohnzimmer.jpg
heroImageAlt: "Wohnzimmer der Ferienwohnung Emil's Kuhwiese mit Sofa und Blick ins Grüne"
gallery:
  - src: /img/rooms/emils-kuhwiese-schlafzimmer.jpg
    alt: 'Schlafzimmer mit Doppelbett'
  - src: /img/rooms/emils-kuhwiese-kueche.jpg
    alt: 'Voll ausgestattete Küche'
  - src: /img/rooms/emils-kuhwiese-terrasse.jpg
    alt: 'Terrasse mit Gartenblick'
  - src: /img/rooms/emils-kuhwiese-bad.jpg
    alt: 'Modernes Badezimmer mit Dusche'

amenities:
  - wifi
  - tv
  - kueche
  - terrasse
  - parkplatz
  - bettwaesche
  - handtuecher
  - dusche

highlights:
  - 'Eigene Küche für Selbstversorger'
  - 'Terrasse mit Gartenblick'
  - 'Bis zu 4 Gäste'

extras:
  - name: 'Frühstück'
    description: 'Reichhaltiges Frühstücksbuffet'
    price: 10
    unit: 'pro Person / Nacht'
  - name: 'Genießer-Frühstück'
    description: 'Erweitertes Frühstück mit regionalen Spezialitäten'
    price: 15
    unit: 'pro Person / Nacht'
  - name: 'Hund'
    price: 10
    unit: 'pro Nacht'

sortOrder: 1
featured: true
```

### Pattern 3: Querying Room Data in Pages

**What:** Pages fetch room data using `queryCollection()` and pass to components as props. Components never fetch data directly.

```vue
<!-- app/pages/zimmer/index.vue -->
<script setup lang="ts">
// Fetch all rooms, ordered by sortOrder
const { data: rooms } = await useAsyncData('rooms', () =>
  queryCollection('rooms').order('sortOrder', 'ASC').all(),
)

// Group rooms by category for section headings
const roomsByCategory = computed(() => {
  if (!rooms.value) return new Map()
  const groups = new Map<string, typeof rooms.value>()
  for (const room of rooms.value) {
    const existing = groups.get(room.category) ?? []
    existing.push(room)
    groups.set(room.category, existing)
  }
  return groups
})
</script>
```

```vue
<!-- app/pages/zimmer/[slug].vue -->
<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

// Fetch this room
const { data: room } = await useAsyncData(`room-${slug}`, () =>
  queryCollection('rooms').where('slug', '=', slug).first(),
)

if (!room.value) {
  throw createError({ statusCode: 404, message: 'Zimmer nicht gefunden' })
}

// Fetch other rooms for "Weitere Zimmer"
const { data: otherRooms } = await useAsyncData('other-rooms', () =>
  queryCollection('rooms').where('slug', '!=', slug).order('sortOrder', 'ASC').all(),
)
</script>
```

### Pattern 4: Custom Gallery + Lightbox Component

**What:** A composable manages gallery state; the gallery component renders hero + thumbnails; the lightbox is a separate overlay component with focus trap, keyboard nav, and swipe support.

**Why custom over library:** The CONTEXT.md specifies very precise behavior (hero + all thumbnails visible + lightbox with thumbnail strip at bottom + keyboard + swipe + no auto-advance). No existing Vue 3 library matches this exact pattern without significant customization. Building custom with VueUse composables is cleaner, smaller, and fully controllable.

```typescript
// app/composables/useGallery.ts
interface GalleryImage {
  src: string
  alt: string
}

export function useGallery(images: Ref<GalleryImage[]>) {
  const currentIndex = ref(0)
  const isLightboxOpen = ref(false)

  const currentImage = computed(() => images.value[currentIndex.value])
  const hasNext = computed(() => currentIndex.value < images.value.length - 1)
  const hasPrev = computed(() => currentIndex.value > 0)

  function goTo(index: number) {
    if (index >= 0 && index < images.value.length) {
      currentIndex.value = index
    }
  }

  function next() {
    if (hasNext.value) currentIndex.value++
  }

  function prev() {
    if (hasPrev.value) currentIndex.value--
  }

  function openLightbox(index?: number) {
    if (index !== undefined) currentIndex.value = index
    isLightboxOpen.value = true
  }

  function closeLightbox() {
    isLightboxOpen.value = false
  }

  return {
    currentIndex: readonly(currentIndex),
    currentImage,
    isLightboxOpen: readonly(isLightboxOpen),
    hasNext,
    hasPrev,
    goTo,
    next,
    prev,
    openLightbox,
    closeLightbox,
  }
}
```

```vue
<!-- app/components/rooms/Lightbox.vue (simplified structure) -->
<script setup lang="ts">
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { useSwipe } from '@vueuse/core'

const props = defineProps<{
  images: { src: string; alt: string }[]
  currentIndex: number
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  navigate: [index: number]
}>()

const lightboxRef = useTemplateRef('lightbox')
const imageRef = useTemplateRef('image-container')

// Focus trap -- activate on next tick after v-if renders
const { activate, deactivate } = useFocusTrap(lightboxRef, {
  immediate: false,
})

watch(
  () => props.isOpen,
  async (open) => {
    if (open) {
      await nextTick()
      activate()
    } else {
      deactivate()
    }
  },
)

// Keyboard navigation
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowRight') emit('navigate', props.currentIndex + 1)
  if (e.key === 'ArrowLeft') emit('navigate', props.currentIndex - 1)
}

// Touch swipe
const { direction } = useSwipe(imageRef, {
  onSwipeEnd() {
    if (direction.value === 'left') emit('navigate', props.currentIndex + 1)
    if (direction.value === 'right') emit('navigate', props.currentIndex - 1)
  },
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      ref="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Bildergalerie"
      class="fixed inset-0 z-50 flex flex-col bg-black/90"
      @keydown="onKeydown"
    >
      <!-- Close button (48px+ touch target) -->
      <button
        class="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white"
        aria-label="Galerie schließen"
        @click="$emit('close')"
      >
        <Icon name="lucide:x" size="24" />
      </button>

      <!-- Main image area with nav arrows -->
      <div ref="image-container" class="flex flex-1 items-center justify-center px-16 py-4">
        <!-- Left arrow -->
        <button
          v-if="currentIndex > 0"
          class="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white"
          aria-label="Vorheriges Bild"
          @click="$emit('navigate', currentIndex - 1)"
        >
          <Icon name="lucide:chevron-left" size="28" />
        </button>

        <!-- Image -->
        <NuxtImg
          :src="images[currentIndex].src"
          :alt="images[currentIndex].alt"
          class="max-h-full max-w-full object-contain"
          loading="eager"
        />

        <!-- Right arrow -->
        <button
          v-if="currentIndex < images.length - 1"
          class="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white"
          aria-label="Nächstes Bild"
          @click="$emit('navigate', currentIndex + 1)"
        >
          <Icon name="lucide:chevron-right" size="28" />
        </button>
      </div>

      <!-- Thumbnail strip at bottom -->
      <div class="flex justify-center gap-2 overflow-x-auto p-4">
        <button
          v-for="(image, i) in images"
          :key="image.src"
          class="h-14 w-20 shrink-0 overflow-hidden rounded border-2 transition-colors"
          :class="i === currentIndex ? 'border-white' : 'border-transparent opacity-60'"
          :aria-label="`Bild ${i + 1}: ${image.alt}`"
          @click="$emit('navigate', i)"
        >
          <NuxtImg
            :src="image.src"
            :alt="image.alt"
            class="h-full w-full object-cover"
            width="80"
            height="56"
            loading="lazy"
          />
        </button>
      </div>
    </div>
  </Teleport>
</template>
```

### Pattern 5: Amenity Icon Mapping

**What:** Map amenity enum values from YAML to Lucide icon names and German display labels.

```typescript
// app/utils/amenities.ts
export interface AmenityInfo {
  icon: string // Lucide icon name
  label: string // German display label
}

export const amenityMap: Record<string, AmenityInfo> = {
  wifi: { icon: 'lucide:wifi', label: 'Kostenloses WLAN' },
  tv: { icon: 'lucide:tv', label: 'Fernseher' },
  balkon: { icon: 'lucide:fence', label: 'Balkon' },
  terrasse: { icon: 'lucide:sun', label: 'Terrasse' },
  kueche: { icon: 'lucide:cooking-pot', label: 'Küche' },
  kuehlschrank: { icon: 'lucide:refrigerator', label: 'Kühlschrank' },
  kaffeemaschine: { icon: 'lucide:coffee', label: 'Kaffeemaschine' },
  dusche: { icon: 'lucide:shower-head', label: 'Dusche' },
  badewanne: { icon: 'lucide:bath', label: 'Badewanne' },
  parkplatz: { icon: 'lucide:circle-parking', label: 'Kostenloser Parkplatz' },
  garten: { icon: 'lucide:trees', label: 'Garten' },
  bettwaesche: { icon: 'lucide:bed', label: 'Bettwäsche' },
  handtuecher: { icon: 'lucide:hand', label: 'Handtücher' },
  foehn: { icon: 'lucide:wind', label: 'Föhn' },
  schreibtisch: { icon: 'lucide:lamp-desk', label: 'Schreibtisch' },
  heizung: { icon: 'lucide:heater', label: 'Heizung' },
}
```

```vue
<!-- app/components/rooms/Amenities.vue -->
<script setup lang="ts">
import { amenityMap } from '~/utils/amenities'

defineProps<{
  amenities: string[]
  sizeM2?: number
  maxGuests: number
  beds: string
}>()
</script>

<template>
  <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
    <!-- Room specs always shown first -->
    <div class="flex items-center gap-3">
      <Icon name="lucide:users" size="20" class="shrink-0 text-sage-600" />
      <span>{{ maxGuests }} Gäste</span>
    </div>
    <div class="flex items-center gap-3">
      <Icon name="lucide:bed-double" size="20" class="shrink-0 text-sage-600" />
      <span>{{ beds }}</span>
    </div>
    <div v-if="sizeM2" class="flex items-center gap-3">
      <Icon name="lucide:ruler" size="20" class="shrink-0 text-sage-600" />
      <span>{{ sizeM2 }} m&sup2;</span>
    </div>

    <!-- Dynamic amenities from YAML -->
    <div v-for="amenity in amenities" :key="amenity" class="flex items-center gap-3">
      <Icon
        :name="amenityMap[amenity]?.icon ?? 'lucide:check'"
        size="20"
        class="shrink-0 text-sage-600"
      />
      <span>{{ amenityMap[amenity]?.label ?? amenity }}</span>
    </div>
  </div>
</template>
```

### Pattern 6: Pre-rendering Dynamic Room Routes for SSG

**What:** Ensure all `/zimmer/[slug]` routes are pre-rendered during `nuxt generate`.

**Two mechanisms work together:**

1. `crawlLinks: true` (default) -- Nitro crawls `<NuxtLink>` elements on `/zimmer/` overview page and discovers all room detail pages.
2. Safety net -- Explicitly list room routes in `nuxt.config.ts` in case the overview page is incomplete during development.

```typescript
// nuxt.config.ts (safety net for SSG)
export default defineNuxtConfig({
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/zimmer/',
        // Explicit room routes as safety net
        '/zimmer/emils-kuhwiese',
        '/zimmer/schoene-aussicht',
        '/zimmer/balkonzimmer',
        '/zimmer/rosengarten',
        '/zimmer/wohlfuehl-appartement',
        '/zimmer/doppelzimmer',
        '/zimmer/einzelzimmer',
      ],
    },
  },
})
```

**Verification:** After `nuxt generate`, check that all room pages exist:

```bash
ls .output/public/zimmer/*/index.html | wc -l
# Should output: 7
```

### Anti-Patterns to Avoid

- **Fetching data inside room components:** Components receive data as props. Only pages use `queryCollection()`.
- **Using `v-show` for lightbox:** Use `v-if` so the overlay DOM is not rendered when hidden. This prevents focus trap issues and reduces DOM size.
- **Nesting objects in YAML schema for queryable fields:** Nuxt Content v3's SQL-based queries only support top-level field filtering. Keep fields you need to `where()` or `order()` at the top level of the schema.
- **Using gallery index as slug:** The `stem` field (filename without extension) could serve as a slug, but an explicit `slug` field is more robust because it decouples the URL from the filesystem.
- **Lazy-loading the hero image:** The hero image on the room detail page is the LCP element. It must use `loading="eager"` and `fetchpriority="high"`.
- **Truncating thumbnails with "+N more":** CONTEXT.md explicitly forbids this. Show all thumbnails. Baymard research shows 50-80% of users miss truncated images.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem                         | Don't Build                                   | Use Instead                                                         | Why                                                                                                                                                 |
| ------------------------------- | --------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Focus trapping in lightbox      | Custom tab-cycling logic                      | `useFocusTrap` from `@vueuse/integrations` + `focus-trap` library   | Edge cases: shadow DOM, dynamic content, iframe focus, screen reader interaction. The library handles all of these.                                 |
| Touch swipe detection           | Custom touchstart/touchmove/touchend handlers | `useSwipe` from `@vueuse/core`                                      | Threshold detection, direction calculation, passive event handling, and cleanup are all handled. 50px default threshold prevents accidental swipes. |
| Icon rendering + tree-shaking   | Manual SVG imports or inline SVGs             | `@nuxt/icon` with `@iconify-json/lucide`                            | Server bundle serves icons on-demand; client bundle stays small; icons are cached; DevTools integration for discovery.                              |
| Image optimization              | Manual sharp/imagemin pipeline                | `@nuxt/image` `<NuxtImg>` component                                 | Generates WebP/AVIF, responsive srcsets, lazy loading placeholders, all at build time for SSG.                                                      |
| Zod schema validation           | Custom validation functions                   | Nuxt Content v3's built-in Zod integration                          | Type-safe queries, build-time validation errors, auto-generated TypeScript types from schema.                                                       |
| Responsive breakpoint detection | `window.innerWidth` checks                    | CSS media queries (Tailwind `md:`, `lg:`) or VueUse `useMediaQuery` | CSS approach avoids hydration mismatches. `useMediaQuery` is SSR-safe when used in `onMounted`.                                                     |

**Key insight:** The lightbox is the one component where hand-rolling is the RIGHT choice. The specific requirements (hero + all thumbnails + bottom strip + keyboard + swipe + no auto-advance) don't match any existing library closely enough. Building with VueUse composables (useFocusTrap, useSwipe) gives full control while avoiding the hardest accessibility problems.

## Common Pitfalls

### Pitfall 1: Nuxt Content v3 Collection Source Paths Not Matching

**What goes wrong:** YAML files exist in `content/rooms/` but `queryCollection('rooms').all()` returns empty results.
**Why it happens:** The `source` glob pattern uses `**` (matches subdirectories) when files are flat, or `content/` directory is placed inside `app/` instead of at the project root.
**How to avoid:**

- Keep `content/` at the project root (not inside `app/`)
- Use `'rooms/*.yml'` for flat files, `'rooms/**/*.yml'` for nested
- Test collection queries immediately after creation -- dump results to page
- Use Nuxt DevTools Content tab to verify files are indexed
  **Warning signs:** `queryCollection().all()` returns `[]`; no Zod validation errors in console.

### Pitfall 2: Nuxt Content v3 Sorting with Null/Missing Values

**What goes wrong:** `queryCollection().order('sortOrder', 'ASC')` drops items where `sortOrder` is null or undefined from results entirely.
**Why it happens:** SQL-based query engine treats NULL values differently from file-based engines. Items with NULL sort values are excluded from ordered results.
**How to avoid:** Always set `.default(0)` on Zod schema fields used in `order()` calls. Verify all YAML files include the sort field.
**Warning signs:** Room overview page shows fewer than 7 rooms; no error messages.

### Pitfall 3: Image Filenames with Special Characters

**What goes wrong:** `@nuxt/image` ipxStatic provider returns `403: Fetch error` during `nuxt generate` for images with umlauts, spaces, or apostrophes in filenames.
**Why it happens:** URL encoding issues in the IPX image pipeline when processing special characters in static mode.
**How to avoid:**

- Use only ASCII lowercase letters, digits, and hyphens in image filenames
- Replace umlauts: `ae`, `oe`, `ue`, `ss`
- Never use spaces or apostrophes
- Good: `emils-kuhwiese-wohnzimmer.jpg`
- Bad: `Emil's Kühwiese Wohnzimmer.jpg`
  **Warning signs:** `nuxt generate` produces 403 or 404 errors for specific images.

### Pitfall 4: Hydration Mismatch from Gallery State

**What goes wrong:** Gallery/lightbox state (current image index, lightbox open/close) initialized on the server produces different HTML than the client hydration.
**Why it happens:** Vue SSR renders the component once on the server; if any reactive state depends on browser APIs or differs between server and client, hydration fails.
**How to avoid:**

- Initialize all gallery state with safe defaults (index 0, lightbox closed)
- Use `<ClientOnly>` wrapper for the lightbox component (it is never visible on initial render)
- Use CSS media queries (`hidden md:block`) instead of `v-if="isMobile"` for responsive gallery layout
- Wrap any `window.matchMedia` usage in `onMounted()`
  **Warning signs:** Console warnings `[Vue warn]: Hydration node mismatch`; visual flicker on page load.

### Pitfall 5: Dynamic Routes Not Pre-rendered

**What goes wrong:** Room detail pages work in `nuxt dev` but return 404 in production after `nuxt generate`.
**Why it happens:** `crawlLinks` only discovers pages that are linked from other pre-rendered pages. If the room overview page has not been built yet or does not `<NuxtLink>` to all rooms, those room detail pages are skipped.
**How to avoid:**

- Ensure `/zimmer/` overview page renders `<NuxtLink>` to every room
- Add explicit routes to `nitro.prerender.routes` as safety net
- After `nuxt generate`, verify: `ls .output/public/zimmer/*/index.html`
  **Warning signs:** Fewer than 7 directories in `.output/public/zimmer/`.

### Pitfall 6: Gallery Images Not Optimized in SSG

**What goes wrong:** Gallery images rendered inside a lightbox (behind `v-if`) are not processed by `@nuxt/image` during static generation because the crawler never "sees" them in the pre-rendered HTML.
**Why it happens:** `ipxStatic` processes images it encounters during pre-rendering. Images inside `v-if="false"` blocks are not rendered, so their optimized variants are never generated.
**How to avoid:**

- The hero image and thumbnail strip (always visible) will be processed automatically
- For lightbox images: use the same `src` paths as the thumbnails. Since the thumbnails are rendered in the visible page, `@nuxt/image` processes those paths. The lightbox uses the same paths at larger dimensions.
- Alternatively, generate all image variants explicitly by adding them to a hidden preload section or configuring `nitro.prerender` routes for image paths.
  **Warning signs:** Lightbox images load slowly or appear as original unoptimized files.

## Code Examples

### Room Card Component (Overview Page)

```vue
<!-- app/components/rooms/Card.vue -->
<script setup lang="ts">
defineProps<{
  name: string
  slug: string
  category: string
  shortDescription: string
  heroImage: string
  heroImageAlt: string
  startingPrice: number
  maxGuests: number
  highlights: string[]
}>()
</script>

<template>
  <NuxtLink
    :to="`/zimmer/${slug}`"
    class="group rounded-card shadow-card block transform overflow-hidden bg-white transition-shadow transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
  >
    <!-- Room photo -->
    <div class="aspect-[4/3] overflow-hidden">
      <NuxtImg
        :src="heroImage"
        :alt="heroImageAlt"
        width="600"
        height="450"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        sizes="sm:100vw md:50vw"
      />
    </div>

    <!-- Card content -->
    <div class="p-5">
      <h3 class="text-charcoal mb-1 text-lg font-semibold">{{ name }}</h3>
      <p class="text-grey mb-3 line-clamp-2 text-sm">{{ shortDescription }}</p>

      <!-- Key features -->
      <div class="mb-3 flex flex-wrap gap-2">
        <span class="text-sm text-sage-700">{{ maxGuests }} Gäste</span>
        <span
          v-for="highlight in highlights.slice(0, 2)"
          :key="highlight"
          class="text-sm text-sage-700"
        >
          &middot; {{ highlight }}
        </span>
      </div>

      <!-- Price -->
      <p class="text-charcoal text-lg font-semibold">
        ab {{ startingPrice }} &euro;
        <span class="text-grey text-sm font-normal">/ Nacht inkl. MwSt.</span>
      </p>
    </div>
  </NuxtLink>
</template>
```

### Price Table Component

```vue
<!-- app/components/rooms/PriceTable.vue -->
<script setup lang="ts">
interface Rate {
  occupancy: number
  pricePerNight: number
}

interface PricingPeriod {
  label: string
  dateRange?: string
  rates: Rate[]
}

defineProps<{
  pricing: PricingPeriod[]
}>()
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full border-collapse text-left">
      <thead>
        <tr class="border-b-2 border-sage-200">
          <th class="text-charcoal py-3 pr-4 font-semibold">Zeitraum</th>
          <th class="text-charcoal px-4 py-3 text-right font-semibold">1 Person</th>
          <th class="text-charcoal py-3 pl-4 text-right font-semibold">2 Personen</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="period in pricing" :key="period.label" class="border-b border-stone-200">
          <td class="py-3 pr-4">
            <span class="font-medium">{{ period.label }}</span>
            <span v-if="period.dateRange" class="text-grey block text-sm">
              {{ period.dateRange }}
            </span>
          </td>
          <td
            v-for="rate in period.rates"
            :key="rate.occupancy"
            class="px-4 py-3 text-right font-semibold"
          >
            {{ rate.pricePerNight }} &euro;
            <span class="text-grey block text-sm font-normal">pro Nacht</span>
          </td>
        </tr>
      </tbody>
    </table>
    <p class="text-grey mt-2 text-sm">Alle Preise inkl. MwSt.</p>
  </div>
</template>
```

### "Mehr lesen" Expand Component

```vue
<!-- app/components/rooms/Description.vue -->
<script setup lang="ts">
defineProps<{
  shortDescription: string
  description: string
}>()

const isExpanded = ref(false)
</script>

<template>
  <div>
    <p class="text-charcoal leading-relaxed">{{ shortDescription }}</p>

    <div
      class="overflow-hidden transition-all duration-300"
      :class="isExpanded ? 'mt-4 max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'"
    >
      <p class="text-charcoal leading-relaxed whitespace-pre-line">{{ description }}</p>
    </div>

    <button
      class="mt-3 cursor-pointer font-medium text-sage-600 transition-colors hover:text-sage-700"
      :aria-expanded="isExpanded"
      @click="isExpanded = !isExpanded"
    >
      {{ isExpanded ? 'Weniger anzeigen' : 'Mehr lesen' }}
      <Icon
        :name="isExpanded ? 'lucide:chevron-up' : 'lucide:chevron-down'"
        size="16"
        class="ml-1 inline"
      />
    </button>
  </div>
</template>
```

## State of the Art

| Old Approach                            | Current Approach                                  | When Changed            | Impact                                                                                                                                 |
| --------------------------------------- | ------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Nuxt Content v2 `queryContent()`        | Nuxt Content v3 `queryCollection()`               | Content v3 release 2025 | SQL-based queries; different API; `source` patterns instead of `fetchContentWhere`; collections must be defined in `content.config.ts` |
| Nuxt Content v2 `_dir.yml` for ordering | v3 Zod schema with `sortOrder` field + `.order()` | Content v3              | Must provide explicit sort fields; no implicit file-prefix ordering for data collections                                               |
| Tailwind v3 `shadow-sm`                 | Tailwind v4 `shadow-xs` (scale shifted)           | Tailwind v4             | All shadow classes shifted down one size. `shadow-sm` in v4 = old `shadow-xs`. Use `shadow-card` custom token instead.                 |
| `@nuxtjs/tailwindcss` module            | `@tailwindcss/vite` plugin                        | Tailwind v4             | Module is for v3 only. v4 uses direct Vite plugin. Already addressed in Phase 1.                                                       |
| `nuxt-icon` (old package)               | `@nuxt/icon` v1.0                                 | Nuxt Icon v1.0 2025     | Dual CSS/SVG rendering; server bundle architecture; better SSG support. Use `@nuxt/icon` not `nuxt-icon`.                              |

**Deprecated/outdated:**

- `queryContent()` -- replaced by `queryCollection()` in Content v3
- `nuxt-icon` (npm package) -- superseded by `@nuxt/icon` (official Nuxt module)
- Fixed-height `<iframe>` for lightbox alternatives -- modern approach uses CSS `object-contain` and viewport units

## Open Questions

1. **Room photos availability**
   - What we know: Current site has 8 images for 7 rooms (see image-inventory.md). Phase 2 needs 5-8 photos per room = 35-56 room photos.
   - What's unclear: Whether the owner has additional room photos available or whether placeholder images are needed during development.
   - Recommendation: Start with placeholder images (1 per room from existing inventory) during development. Flag to owner early that room photography is blocking full Phase 2 completion. The YAML schema and all components work the same with 1 photo or 8.

2. **Room data completeness**
   - What we know: STATE.md lists "Room data: Canonical room names, slugs, base prices, and Beds24 property/room IDs needed from owner before Phase 2" as a blocker.
   - What's unclear: Whether all 7 room names, prices, and Beds24 IDs have been confirmed.
   - Recommendation: Create YAML files with best-guess data from the current website. Mark uncertain fields with comments. The schema validation will catch any missing required fields at build time.

3. **Seasonal pricing structure**
   - What we know: CONTEXT.md says "flexible number of rate periods to be filled in by owner later."
   - What's unclear: How many seasons the owner uses and what the date ranges are.
   - Recommendation: Design the schema to support any number of pricing periods. Start with a single "Standardpreis" period per room. The owner adds seasons later by adding entries to the `pricing` array.

4. **Lucide icon coverage for all amenities**
   - What we know: Lucide has icons for most amenities (bed, wifi, tv, shower, coffee, parking, etc.) but some may need creative mapping (e.g., "towels" mapped to "hand" icon).
   - What's unclear: Whether all amenity icons are visually clear enough for the target audience.
   - Recommendation: Implement the amenity map as shown in the code example. Review icon clarity during visual testing. Swap individual icons if they are confusing -- the map makes this a one-line change.

## Sources

### Primary (HIGH confidence)

- [Nuxt Content v3 - Define Collections](https://content.nuxt.com/docs/collections/define) -- defineCollection API, Zod schema, source patterns
- [Nuxt Content v3 - Collection Types](https://content.nuxt.com/docs/collections/types) -- page vs data types, auto-generated fields
- [Nuxt Content v3 - queryCollection](https://content.nuxt.com/docs/utils/query-collection) -- where, order, first, all, count methods
- [Nuxt Content v3 - YAML Files](https://content.nuxt.com/docs/files/yaml) -- YAML format support, querying with stem
- [Nuxt Content v3 - Getting Started](https://content.nuxt.com/docs/getting-started) -- SQL-based storage, type safety
- [@nuxt/icon Module](https://nuxt.com/modules/icon) -- installation, configuration, custom collections
- [Nuxt Icon v1.0 Blog Post](https://nuxt.com/blog/nuxt-icon-v1-0) -- dual rendering, server bundle, SSG compatibility
- [VueUse useFocusTrap](https://vueuse.org/integrations/usefocustrap/) -- focus trap composable API, v-if handling
- [VueUse useSwipe](https://vueuse.org/core/useswipe/) -- touch swipe detection
- [Nuxt 4 Prerendering](https://nuxt.com/docs/4.x/getting-started/prerendering) -- crawlLinks, explicit routes, prerenderRoutes
- [@nuxt/image Static Images](https://image.nuxt.com/advanced/static-images) -- ipxStatic provider, SSG image optimization
- [Lucide Icons](https://lucide.dev/icons/) -- icon names for amenity mapping

### Secondary (MEDIUM confidence)

- [lightGallery Vue 3 Docs](https://www.lightgalleryjs.com/docs/vue-image-video-gallery/) -- evaluated and rejected for this project
- [lightGallery Nuxt 3 Issue #1580](https://github.com/sachinchoolur/lightGallery/issues/1580) -- Vue 3/Nuxt compatibility problems
- [Baymard: Truncating Gallery Thumbnails](https://baymard.com/blog/truncating-product-gallery-thumbnails) -- 50-80% of users miss truncated images
- [Baymard: Always Use Thumbnails](https://baymard.com/blog/always-use-thumbnails-additional-images) -- thumbnails on mobile improve gallery discovery
- [Nuxt Content v3 Sorting Issue #3062](https://github.com/nuxt/content/issues/3062) -- NULL sort values drop items
- [Nuxt Content v3 Source Path Issue #2932](https://github.com/nuxt/content/issues/2932) -- content directory location
- [@nuxt/image Special Characters Issue #815](https://github.com/nuxt/image/issues/815) -- filename encoding problems
- [Telerik: Focus Trap in Vue 3](https://www.telerik.com/blogs/how-to-trap-focus-modal-vue-3) -- focus trap implementation patterns
- [Smashing Magazine: Better Carousel UX](https://www.smashingmagazine.com/2022/04/designing-better-carousel-ux/) -- user-initiated only, no auto-advance

### Tertiary (LOW confidence)

- [Lucide Hotel Amenity Icons Issue #2765](https://github.com/lucide-icons/lucide/issues/2765) -- requested but may not all exist; verify individual icons

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- Nuxt Content v3, @nuxt/icon, and @nuxt/image are well-documented official modules with verified APIs
- Architecture: HIGH -- Data collection pattern verified against official docs; query API confirmed; component patterns follow Nuxt conventions
- Gallery/Lightbox: MEDIUM -- Custom build is the right approach, but the exact implementation needs validation during development. VueUse composables are verified but the integration pattern is not from an official source.
- Pitfalls: HIGH -- All pitfalls verified against official docs or GitHub issues with confirmed reproduction

**Research date:** 2026-02-22
**Valid until:** 2026-03-22 (30 days -- Nuxt Content v3 and @nuxt/icon are stable releases)
