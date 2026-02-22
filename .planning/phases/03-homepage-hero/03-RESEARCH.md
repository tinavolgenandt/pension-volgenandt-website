# Phase 3: Homepage & Hero - Research

**Researched:** 2026-02-22
**Domain:** Hero video component, scroll animations, testimonial carousel, OpenStreetMap embedding, homepage section architecture (Nuxt 4 + Vue 3 + Tailwind v4)
**Confidence:** HIGH

## Summary

Phase 3 builds the homepage as a single scrollable page with 8 sections: hero (video/poster), welcome, featured rooms, testimonials carousel, experience teaser, sustainability teaser, map + address, and footer. The primary technical challenges are: (1) responsive hero with desktop video and mobile poster image, (2) scroll-triggered staggered animations that respect `prefers-reduced-motion`, (3) a lightweight testimonial carousel with autoplay, swipe, and accessibility, (4) an OpenStreetMap embed that requires no cookies or consent, and (5) content data management for testimonials and attractions.

The standard approach is: build the hero as a custom Vue component using `<video>` with `<picture>` fallback controlled by CSS media queries and a `<ClientOnly>` wrapper for the video element; use VueUse's `useElementVisibility` composable with CSS transitions for scroll animations (toggling a `.visible` class); use Embla Carousel (7KB gzipped, WCAG 2.1 AA compliant) for the testimonials slider; generate a static map image at build time and serve it as a regular `<NuxtImg>` (zero third-party requests, zero consent needed); store testimonials and attractions data in Nuxt Content v3 YAML data collections with Zod validation.

**Primary recommendation:** Build all scroll animations as a single reusable `useScrollReveal` composable wrapping VueUse's `useElementVisibility`. Use Embla Carousel for testimonials (not vue3-carousel -- Embla has better accessibility, smaller bundle, and a dedicated accessibility plugin). For the map, use a pre-generated static image to guarantee zero third-party data transmission -- this is the only approach that truly satisfies "no cookies, no consent needed" under German DSGVO law.

## Standard Stack

### Core (Phase 3 additions to existing Phase 1+2 stack)

| Library                        | Version | Purpose                | Why Standard                                                                  |
| ------------------------------ | ------- | ---------------------- | ----------------------------------------------------------------------------- |
| `embla-carousel-vue`           | ^8.x    | Testimonial carousel   | 7KB gzipped, Vue 3 native, WCAG 2.1 AA, dependency-free core, composable API  |
| `embla-carousel-autoplay`      | ^8.x    | Carousel auto-rotation | Official Embla plugin, pause-on-hover, configurable interval                  |
| `embla-carousel-accessibility` | ^8.x    | Carousel ARIA support  | Official plugin, screen reader announcements, keyboard nav, dot button labels |

### Supporting (already in stack from Phase 1+2)

| Library                | Version | Purpose                                                                               | When to Use                            |
| ---------------------- | ------- | ------------------------------------------------------------------------------------- | -------------------------------------- |
| `@vueuse/nuxt`         | ^14.x   | `useElementVisibility` for scroll animations, `useMediaQuery` for responsive behavior | Every section that fades in on scroll  |
| `@nuxt/image`          | ^2.x    | `<NuxtImg>` for all images (hero poster, welcome photo, attraction cards, static map) | All image elements                     |
| `@nuxt/content`        | ^3.x    | YAML data collections for testimonials and attractions                                | Structured content with Zod validation |
| `@nuxt/icon`           | ^1.x    | Lucide icons for sustainability proof points, star ratings, scroll indicator          | Icon display throughout homepage       |
| `@iconify-json/lucide` | latest  | Icon data                                                                             | Already installed from Phase 2         |

### Alternatives Considered

| Instead of                  | Could Use                         | Tradeoff                                                                                                                                                                                                                                                                                                                |
| --------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Embla Carousel              | vue3-carousel (v0.17)             | vue3-carousel is Vue-native but has no dedicated accessibility plugin, larger bundle, less consistent ARIA support. Embla is framework-agnostic but has superior a11y (dedicated plugin with WCAG 2.1 AA), smaller bundle (7KB vs ~15KB), and better swipe precision.                                                   |
| Embla Carousel              | Swiper.js                         | Swiper is feature-rich but 45KB+ gzipped -- far too heavy for a single testimonial slider. Overkill for 5-6 text cards.                                                                                                                                                                                                 |
| Embla Carousel              | Pure CSS scroll-snap carousel     | Works for simple cases but lacks autoplay, accessibility announcements, and programmatic control. Testimonial auto-rotation requires JS.                                                                                                                                                                                |
| Static map image            | Leaflet + @nuxtjs/leaflet         | Leaflet requires `<ClientOnly>` wrapper, loads Leaflet JS (~40KB), and requests tiles from tile.openstreetmap.org (or .de) which transmits user IP addresses to third-party servers. Under German DSGVO (per eRecht24), this requires cookie consent. Does NOT satisfy the "no cookies, no consent needed" requirement. |
| Static map image            | Leaflet + self-hosted tile proxy  | Satisfies DSGVO but requires a running tile proxy server. This is an SSG site on Netlify/Cloudflare Pages -- no server-side proxy available. Overly complex for showing a single pension location.                                                                                                                      |
| VueUse useElementVisibility | Custom IntersectionObserver       | VueUse handles SSR safety, cleanup, and edge cases. Custom implementation risks hydration mismatches and memory leaks from unobserved elements.                                                                                                                                                                         |
| VueUse useElementVisibility | VueUse useIntersectionObserver    | useIntersectionObserver is more powerful but more verbose (callback-based). useElementVisibility returns a simple boolean ref -- perfect for toggling CSS classes. Use useIntersectionObserver only if threshold/rootMargin customization is needed.                                                                    |
| CSS transitions             | Framer Motion / GSAP / Motion One | External animation libraries add 10-50KB for effects achievable with CSS `transition` + `transform` + `opacity`. The design spec calls for simple fade-up animations -- CSS handles this perfectly.                                                                                                                     |

**Installation:**

```bash
# Phase 3 additions (Phase 1+2 deps already installed)
pnpm add embla-carousel-vue embla-carousel-autoplay embla-carousel-accessibility
```

## Architecture Patterns

### Recommended Project Structure (Phase 3 additions)

```
content/
  testimonials/               # Testimonial YAML data (1 file for all)
    index.yml                 # Array of 5-6 testimonials
  attractions/                # Attraction teaser data (1 file for all)
    index.yml                 # Array of 4 featured attractions

app/
  components/
    home/                     # Homepage-specific section components
      HeroVideo.vue           # Hero with video (desktop) / poster (mobile)
      Welcome.vue             # Welcome section with lifestyle photo
      FeaturedRooms.vue       # 3-col featured room cards
      Testimonials.vue        # Embla carousel with star ratings
      ExperienceTeaser.vue    # Attraction grid with hero card
      SustainabilityTeaser.vue # Icon proof points
      LocationMap.vue         # Static map image + address
    ui/
      ScrollReveal.vue        # Wrapper component for scroll animations
      StarRating.vue          # Star rating display (filled stars)
      ScrollIndicator.vue     # Animated chevron at hero bottom

  composables/
    useScrollReveal.ts        # Scroll animation composable

  pages/
    index.vue                 # Homepage -- assembles all sections
```

### Pattern 1: Hero Video with Mobile Poster Fallback

**What:** A responsive hero component that shows a looping muted video on desktop (>768px) and a static WebP poster image on mobile. Uses CSS media queries to hide/show elements, NOT JavaScript detection, to prevent layout shift. The video element is wrapped in `<ClientOnly>` because HTML5 video cannot be server-rendered.

**When to use:** For the full-viewport hero section at the top of the homepage.

**Key considerations:**

- The `<picture>` element (mobile poster) is always rendered in HTML for SEO/accessibility and hidden via CSS on desktop
- The `<video>` element uses `<ClientOnly>` to avoid SSR hydration issues
- Poster attribute on `<video>` provides a fallback while video loads on desktop
- `fetchpriority="high"` on the mobile image for good LCP
- The gradient overlay is a CSS pseudo-element or overlay div, not baked into the video

```vue
<!-- app/components/home/HeroVideo.vue -->
<script setup lang="ts">
const scrollIndicatorVisible = ref(true)

function handleScrollIndicatorClick() {
  const welcome = document.getElementById('willkommen')
  welcome?.scrollIntoView({ behavior: 'smooth' })
}

if (import.meta.client) {
  const { y } = useWindowScroll()
  watch(y, (scrollY) => {
    scrollIndicatorVisible.value = scrollY < 100
  })
}
</script>

<template>
  <section class="relative h-dvh w-full overflow-hidden">
    <!-- Mobile poster (always in DOM, hidden on desktop) -->
    <picture class="absolute inset-0 md:hidden">
      <NuxtImg
        src="/img/hero/hero-mobile.webp"
        alt="Luftaufnahme der Pension Volgenandt im gruenen Eichsfeld"
        class="h-full w-full object-cover"
        loading="eager"
        fetchpriority="high"
        width="750"
        height="1334"
      />
    </picture>

    <!-- Desktop video (client-only, hidden on mobile) -->
    <ClientOnly>
      <video
        autoplay
        muted
        loop
        playsinline
        preload="auto"
        poster="/img/hero/hero-poster.webp"
        class="absolute inset-0 hidden h-full w-full object-cover md:block"
      >
        <source src="/video/hero.webm" type="video/webm" />
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>
    </ClientOnly>

    <!-- Gradient overlay (sage-charcoal tinted) -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-sage-900/70 via-sage-900/30 to-transparent"
      style="--tw-gradient-from-position: 0%; --tw-gradient-via-position: 40%; --tw-gradient-to-position: 60%"
    />

    <!-- Text content (bottom-left, lower 40%) -->
    <div
      class="absolute inset-x-0 bottom-0 flex h-[40%] flex-col justify-end px-6 pb-20 md:px-12 lg:px-24"
    >
      <h1
        class="hero-animate font-sans text-4xl font-bold tracking-wide text-white md:text-5xl"
        style="animation-delay: 300ms; text-shadow: 0 1px 3px rgba(0,0,0,0.3)"
      >
        Pension Volgenandt
      </h1>
      <p
        class="hero-animate mt-3 font-sans text-lg text-white/90 md:text-[22px]"
        style="animation-delay: 550ms; text-shadow: 0 1px 3px rgba(0,0,0,0.3)"
      >
        Ruhe finden im Eichsfeld
      </p>
      <div class="hero-animate mt-6" style="animation-delay: 800ms">
        <NuxtLink
          to="/zimmer/"
          class="inline-block w-full rounded-lg bg-waldhonig-400 px-8 py-4 text-center font-sans text-lg font-semibold text-white transition-all hover:scale-[1.02] hover:bg-waldhonig-600 md:inline-block md:w-auto md:text-left"
        >
          Zimmer entdecken
        </NuxtLink>
      </div>
    </div>

    <!-- Scroll indicator -->
    <ScrollIndicator
      :visible="scrollIndicatorVisible"
      class="hero-animate"
      style="animation-delay: 1500ms"
      @click="handleScrollIndicatorClick"
    />
  </section>
</template>

<style scoped>
/* Staggered entrance animation */
.hero-animate {
  opacity: 0;
  transform: translateY(20px);
  animation: hero-fade-up 700ms ease-out forwards;
}

@keyframes hero-fade-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .hero-animate {
    opacity: 1;
    transform: none;
    animation: none;
  }
}

/* Mobile: stronger gradient */
@media (max-width: 767px) {
  .bg-gradient-to-t {
    --tw-gradient-from: rgb(44 62 45 / 0.8);
  }
}
</style>
```

### Pattern 2: Scroll Reveal Composable

**What:** A reusable composable that wraps VueUse's `useElementVisibility` to toggle a `.visible` class on elements when they scroll into view. Animations are pure CSS transitions. Respects `prefers-reduced-motion` at the CSS level.

**When to use:** Every homepage section that fades in on scroll.

```typescript
// app/composables/useScrollReveal.ts
import { useElementVisibility } from '@vueuse/core'
import type { MaybeComputedElementRef } from '@vueuse/core'

export function useScrollReveal(target: MaybeComputedElementRef) {
  const isVisible = useElementVisibility(target, {
    threshold: 0.15, // Trigger when 15% visible
    once: true, // Only animate in once, then stop observing
  })

  return { isVisible }
}
```

```vue
<!-- app/components/ui/ScrollReveal.vue -->
<script setup lang="ts">
interface Props {
  delay?: number // ms delay for staggered children
  direction?: 'up' | 'left' | 'right' | 'none' // animation direction
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  direction: 'up',
})

const target = useTemplateRef('reveal')
const { isVisible } = useScrollReveal(target)
</script>

<template>
  <div
    ref="reveal"
    class="scroll-reveal"
    :class="[isVisible ? 'scroll-reveal--visible' : '', `scroll-reveal--${direction}`]"
    :style="{ transitionDelay: `${delay}ms` }"
  >
    <slot />
  </div>
</template>

<style scoped>
.scroll-reveal {
  opacity: 0;
  transition:
    opacity 700ms ease-out,
    transform 700ms ease-out;
}

.scroll-reveal--up {
  transform: translateY(24px);
}

.scroll-reveal--left {
  transform: translateX(-24px);
}

.scroll-reveal--right {
  transform: translateX(24px);
}

.scroll-reveal--none {
  transform: none;
}

.scroll-reveal--visible {
  opacity: 1;
  transform: translateY(0) translateX(0);
}

@media (prefers-reduced-motion: reduce) {
  .scroll-reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
```

**Staggered usage (e.g., room cards):**

```vue
<ScrollReveal v-for="(room, index) in featuredRooms" :key="room.slug" :delay="index * 150">
  <RoomsCard :room="room" />
</ScrollReveal>
```

### Pattern 3: Testimonial Carousel with Embla

**What:** Embla Carousel with autoplay, accessibility plugin, and custom navigation. Shows one testimonial at a time with star ratings.

```vue
<!-- app/components/home/Testimonials.vue (simplified) -->
<script setup lang="ts">
import useEmblaCarousel from 'embla-carousel-vue'
import Autoplay from 'embla-carousel-autoplay'
import Accessibility from 'embla-carousel-accessibility'

const { data: testimonials } = await useAsyncData('testimonials', () =>
  queryCollection('testimonials').all(),
)

const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' }, [
  Autoplay({ delay: 6000, stopOnInteraction: true }),
  Accessibility(),
])

const prevSlide = () => emblaApi.value?.scrollPrev()
const nextSlide = () => emblaApi.value?.scrollNext()
</script>
```

### Pattern 4: Static Map Image for Zero-Consent Location Display

**What:** Pre-generate a static map image (PNG/WebP) showing the pension location with a marker. Serve it as a regular image via `<NuxtImg>`. Zero external requests, zero cookies, zero consent needed.

**Why not Leaflet/iframe:** Under German DSGVO (confirmed by eRecht24), any approach that loads tiles from tile.openstreetmap.org or tile.openstreetmap.de transmits the user's IP address to a third-party server. This is personal data processing under Art. 6 DSGVO and requires consent. The requirements explicitly state "no cookies, no consent needed." The only truly consent-free approach for an SSG site without a server-side proxy is a static pre-rendered image.

**How to generate:**

1. Use an online tool (e.g., osm-static-maps, Geoapify free tier, or screenshot from OSM) to generate a map image at the correct zoom level with a marker
2. Save as WebP in `public/img/map/` (e.g., `pension-location.webp`)
3. Display with `<NuxtImg>` -- excellent LCP, zero JS, zero external requests
4. Wrap with a link to Google Maps / OSM directions for interactive use

**Coordinates:** 51.3747 N, 10.2197 E (Breitenbach, Eichsfeld approximate)

```vue
<!-- app/components/home/LocationMap.vue -->
<template>
  <section id="anfahrt" class="py-20 md:py-24">
    <div class="mx-auto max-w-6xl px-6">
      <h2 class="font-sans text-3xl font-bold text-sage-900 md:text-4xl">So finden Sie uns</h2>

      <div class="mt-8 grid gap-8 md:grid-cols-2">
        <!-- Static map image -->
        <a
          href="https://www.openstreetmap.org/?mlat=51.3747&mlon=10.2197#map=14/51.3747/10.2197"
          target="_blank"
          rel="noopener noreferrer"
          class="group overflow-hidden rounded-lg"
        >
          <NuxtImg
            src="/img/map/pension-location.webp"
            alt="Karte mit Standort der Pension Volgenandt in Breitenbach, Eichsfeld"
            class="w-full transition-transform group-hover:scale-[1.02]"
            width="600"
            height="400"
            loading="lazy"
          />
          <span class="mt-2 block text-sm text-sage-600">
            Klicken fur interaktive Karte auf OpenStreetMap
          </span>
        </a>

        <!-- Address + directions -->
        <div>
          <address class="text-lg text-sage-800 not-italic">
            <strong>Pension Volgenandt</strong><br />
            Otto-Reuter-Strasse 28<br />
            37327 Leinefelde-Worbis OT Breitenbach
          </address>
          <!-- Phone, email, directions text -->
        </div>
      </div>
    </div>
  </section>
</template>
```

### Pattern 5: Nuxt Content Data Collections for Homepage Data

**What:** Define `testimonials` and `attractions` data collections alongside the existing `rooms` collection. Use `type: 'data'` since these are not page content.

```typescript
// content.config.ts (additions to existing Phase 2 config)
const testimonialSchema = z.object({
  name: z.string(),        // First name only
  quote: z.string(),       // The testimonial text
  rating: z.number().min(1).max(5), // Star rating
})

const attractionSchema = z.object({
  name: z.string(),
  slug: z.string(),
  shortDescription: z.string(),
  image: z.string(),
  imageAlt: z.string(),
  distanceKm: z.number(),
  featured: z.boolean().default(false), // true = large hero card
  category: z.enum(['natur', 'kultur']),
})

// Add to collections:
testimonials: defineCollection({
  type: 'data',
  source: 'testimonials/index.yml',
  schema: z.object({
    items: z.array(testimonialSchema).min(3),
  }),
}),
attractions: defineCollection({
  type: 'data',
  source: 'attractions/index.yml',
  schema: z.object({
    items: z.array(attractionSchema).min(4),
  }),
}),
```

### Anti-Patterns to Avoid

- **Loading video on mobile:** Never serve the `<video>` element on screens < 768px. The CONTEXT.md explicitly requires no video on mobile -- use a purpose-cropped portrait WebP poster instead. Hide with `hidden md:block`, not `v-if` (to prevent CLS).
- **Using `v-show` for hero video/poster switching:** Use CSS classes (`hidden md:block` / `md:hidden`) so both elements exist in the DOM for SEO. `v-show` would render both in JS but `display:none` is fragile with SSR.
- **Lazy-loading the hero image:** The mobile hero poster IS the LCP element. It MUST use `loading="eager"` and `fetchpriority="high"`. Never lazy-load above-the-fold content.
- **Animation libraries for simple fade-ups:** GSAP, Framer Motion, and similar add 10-50KB for effects achievable with CSS transitions. The design spec calls for opacity + translateY -- pure CSS handles this perfectly.
- **Interactive Leaflet map without consent:** Under German DSGVO, loading tiles from any external OSM server transmits user IP addresses (personal data) to third parties. This requires consent per TDDDG SS25. Use a static image instead.
- **Testimonials as hardcoded component data:** Store testimonials in YAML data collections for easy editing without touching Vue components. This follows the Nuxt Content pattern established in Phase 2 for rooms.
- **Forgetting `once: true` on scroll observers:** Without `once`, the IntersectionObserver keeps running after the element animates in, wasting resources. Always stop observing after the first visibility trigger.

## Don't Hand-Roll

| Problem                               | Don't Build                                                           | Use Instead                                          | Why                                                                                                                               |
| ------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Testimonial carousel                  | Custom swipe/slide logic with touch events                            | Embla Carousel (`embla-carousel-vue`)                | Touch precision, momentum scrolling, accessibility plugin, keyboard nav, autoplay with pause-on-hover, loop support -- all in 7KB |
| Scroll-triggered visibility detection | Custom `window.addEventListener('scroll')` with getBoundingClientRect | VueUse `useElementVisibility`                        | SSR-safe, uses IntersectionObserver under the hood, auto-cleanup, `once` option for single-fire                                   |
| Star rating display                   | Manual SVG star rendering logic                                       | Lucide `star` + `star-half` icons with computed fill | Consistent with existing icon system from Phase 2                                                                                 |
| Responsive image handling             | Manual `<picture>` srcset generation                                  | `<NuxtImg>` from `@nuxt/image`                       | Automatic WebP/AVIF, responsive srcsets, lazy loading, blur placeholders                                                          |
| Scroll indicator bounce animation     | JavaScript-driven animation loop                                      | Pure CSS `@keyframes` with `animation` property      | Zero JS overhead, GPU-composited, automatic `prefers-reduced-motion` respect via CSS                                              |

**Key insight:** Phase 3 is primarily a composition phase -- it assembles existing infrastructure (design tokens, components, content collections) into a cohesive page. The only new external dependency is the carousel library. Everything else uses CSS, VueUse composables, and Nuxt Content patterns already established in Phases 1-2.

## Common Pitfalls

### Pitfall 1: Hero Video Blocking LCP

**What goes wrong:** The hero video file (2-5MB WebM) blocks the page's Largest Contentful Paint because the browser waits for video frames before painting.
**Why it happens:** Video elements with `preload="auto"` download the full file before the first frame can be decoded and displayed.
**How to avoid:** Always set a `poster` attribute on the `<video>` element pointing to a lightweight WebP image. The poster displays instantly while the video loads in the background. On mobile, skip the video entirely and show the poster image via `<NuxtImg>` with `fetchpriority="high"`.
**Warning signs:** LCP > 2.5s on desktop; LCP > 4s on mobile throttled connection.

### Pitfall 2: CSS Animation Delay Without opacity:0 Initial State

**What goes wrong:** Elements flash visible for one frame before the animation starts, causing a visual flicker.
**Why it happens:** The animation-delay pauses before playing the keyframe. If the element's default state is `opacity: 1`, it shows at full opacity during the delay, then jumps to `opacity: 0` when the animation starts, then fades in.
**How to avoid:** Set `opacity: 0` as the default state on animated elements AND use `animation-fill-mode: forwards` (or the shorthand `forwards` in the animation property) so the final state persists.
**Warning signs:** Brief flash of content before fade-in animation plays.

### Pitfall 3: Scroll Animations Firing on SSR

**What goes wrong:** During server-side rendering, `IntersectionObserver` is undefined, causing runtime errors. Or all elements render as "visible" during SSR, so nothing animates on the client.
**Why it happens:** IntersectionObserver is a browser API. It doesn't exist in the Node.js SSR context.
**How to avoid:** VueUse's `useElementVisibility` already handles this -- it returns `false` on the server and only starts observing after mount. But if building custom logic, always guard with `if (import.meta.client)` or use `onMounted`.
**Warning signs:** "IntersectionObserver is not defined" error during `nuxt generate`; elements visible without animation on first load.

### Pitfall 4: Carousel Accessibility Missing

**What goes wrong:** Screen readers cannot navigate testimonials; keyboard users cannot cycle through slides; ARIA labels are missing.
**Why it happens:** Most carousel implementations focus on visual functionality and ignore assistive technology.
**How to avoid:** Use Embla's `embla-carousel-accessibility` plugin which adds ARIA roles, labels, live region announcements, and keyboard controls automatically. Ensure prev/next buttons have proper `aria-label` attributes.
**Warning signs:** Lighthouse accessibility audit flags missing ARIA attributes on carousel elements.

### Pitfall 5: OpenStreetMap Iframe Sets Cookies

**What goes wrong:** Embedding OSM via `<iframe src="openstreetmap.org/export/embed.html">` sets `_osm_*` and `_pk_*` cookies AND transmits user IP addresses to OSM servers (located in the UK/US).
**Why it happens:** The OSM embed includes Matomo/Piwik analytics tracking and session cookies.
**How to avoid:** Do NOT use the OSM iframe embed or Leaflet with external tile servers. Use a pre-generated static map image. This is the only approach that satisfies "no cookies, no consent needed" for a German website under DSGVO.
**Warning signs:** `_osm_location`, `_pk_id`, `_pk_ses` cookies appearing in browser; network requests to tile.openstreetmap.org.

### Pitfall 6: Staggered Animation Delay Accumulation

**What goes wrong:** When using `v-for` with staggered delays (index _ 150ms), elements far down in the list have excessively long delays (e.g., 6th item = 750ms), making the section feel sluggish.
**Why it happens:** Linear delay multiplication without a cap.
**How to avoid:** Cap the maximum delay. For a 3-column grid, use `Math.min(index _ 150, 400)`. For the hero entrance, use fixed delays per element (300ms, 550ms, 800ms, 1500ms as specified in CONTEXT.md).
**Warning signs:** Last elements in a group take noticeably long to appear, especially on slow scroll.

## Code Examples

### Star Rating Component (Claude's Discretion: filled stars)

The CONTEXT.md gives discretion on star rating display. Use filled stars (visual, universally understood, works at small sizes):

```vue
<!-- app/components/ui/StarRating.vue -->
<script setup lang="ts">
interface Props {
  rating: number // 1-5
  size?: string // Tailwind size class
}

const props = withDefaults(defineProps<Props>(), {
  size: 'size-5',
})

const fullStars = computed(() => Math.floor(props.rating))
const hasHalfStar = computed(() => props.rating % 1 >= 0.5)
const emptyStars = computed(() => 5 - fullStars.value - (hasHalfStar.value ? 1 : 0))
</script>

<template>
  <div class="flex items-center gap-0.5" :aria-label="`${rating} von 5 Sternen`" role="img">
    <Icon
      v-for="n in fullStars"
      :key="`full-${n}`"
      name="lucide:star"
      :class="[size, 'fill-waldhonig-400 text-waldhonig-400']"
    />
    <Icon
      v-if="hasHalfStar"
      name="lucide:star-half"
      :class="[size, 'fill-waldhonig-400 text-waldhonig-400']"
    />
    <Icon
      v-for="n in emptyStars"
      :key="`empty-${n}`"
      name="lucide:star"
      :class="[size, 'text-sage-300']"
    />
  </div>
</template>
```

### Sustainability Icons (Claude's Discretion: Lucide choices)

The CONTEXT.md specifies thin-line icons in sage-600 within sage-100 circles. Recommended Lucide icons:

| Proof Point                                             | Icon Name         | Rationale                                                                           |
| ------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------- |
| Solarenergie -- "Eigener Strom vom Dach"                | `lucide:sun`      | Universal solar/energy symbol, clean at 64px, available in Lucide (confirmed)       |
| Bio-Klaranlage -- "Naturliche Abwasserreinigung"        | `lucide:droplets` | Water/liquid symbol, represents water treatment, available in Lucide (confirmed)    |
| Kompost & Kreislauf -- "Grunschnitt wird zu Gartenerde" | `lucide:recycle`  | Recycling/circular symbol, explicitly tagged "sustainability" in Lucide (confirmed) |

```vue
<!-- Sustainability icon proof point -->
<div class="flex flex-col items-center text-center md:flex-row md:items-start md:text-left">
  <div class="flex size-16 shrink-0 items-center justify-center rounded-full bg-sage-100">
    <Icon name="lucide:sun" class="size-8 text-sage-600" />
  </div>
  <div class="mt-3 md:ml-4 md:mt-0">
    <h3 class="font-sans text-lg font-semibold text-sage-900">Solarenergie</h3>
    <p class="mt-1 text-sage-700">Eigener Strom vom Dach</p>
  </div>
</div>
```

### Scroll Indicator Component

```vue
<!-- app/components/ui/ScrollIndicator.vue -->
<script setup lang="ts">
defineProps<{
  visible: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    class="scroll-indicator absolute bottom-6 left-1/2 -translate-x-1/2 transition-opacity duration-300"
    :class="visible ? 'opacity-100' : 'pointer-events-none opacity-0'"
    aria-label="Zum Inhalt scrollen"
    @click="$emit('click')"
  >
    <Icon name="lucide:chevron-down" class="size-8 text-white" />
  </button>
</template>

<style scoped>
.scroll-indicator {
  animation: bounce-gentle 2s ease-in-out infinite;
}

@keyframes bounce-gentle {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-indicator {
    animation: none;
  }
}
</style>
```

### Testimonial YAML Data File

```yaml
# content/testimonials/index.yml
items:
  - name: 'Sabine'
    quote: 'Ein wunderbarer Ort der Ruhe. Die Pension liegt traumhaft schoen und die Gastgeber sind herzlich und aufmerksam.'
    rating: 5

  - name: 'Thomas'
    quote: 'Sehr saubere Zimmer, ein herrliches Fruehstueck und die Lage mitten im Gruenen ist einfach perfekt fuer eine Auszeit.'
    rating: 5

  - name: 'Monika'
    quote: 'Wir kommen seit Jahren hierher und fuehlen uns jedes Mal wie zu Hause. Der Garten ist ein Traum!'
    rating: 5

  - name: 'Juergen'
    quote: 'Idealer Ausgangspunkt fuer Wanderungen im Eichsfeld. Das Fruehstueck mit regionalen Produkten war hervorragend.'
    rating: 4

  - name: 'Andrea'
    quote: 'Ruhige Lage, freundliche Vermieter und ein tolles Preis-Leistungs-Verhaeltnis. Sehr empfehlenswert!'
    rating: 5
```

### Attraction Teaser YAML Data File

```yaml
# content/attractions/index.yml
items:
  - name: 'Alternativer Baerenpark Worbis'
    slug: baerenpark-worbis
    shortDescription: 'Erleben Sie Braun- und Schwarzbaeren in naturnahen Gehegen'
    image: /img/attractions/baerenpark.webp
    imageAlt: 'Braunbaer im Alternativen Baerenpark Worbis'
    distanceKm: 12
    featured: true
    category: natur

  - name: 'Burg Hanstein'
    slug: burg-hanstein
    shortDescription: 'Eine der groessten Burgruinen Mitteldeutschlands'
    image: /img/attractions/burg-hanstein.webp
    imageAlt: 'Burgruine Hanstein im Eichsfeld'
    distanceKm: 18
    featured: false
    category: kultur

  - name: 'Burg Bodenstein'
    slug: burg-bodenstein
    shortDescription: 'Mittelalterliche Hoehenburg mit Familienhotel und Veranstaltungen'
    image: /img/attractions/burg-bodenstein.webp
    imageAlt: 'Burg Bodenstein im Eichsfeld'
    distanceKm: 15
    featured: false
    category: kultur

  - name: 'Baumkronenpfad Hainich'
    slug: baumkronenpfad-hainich
    shortDescription: 'Wandeln Sie in den Baumkronen des UNESCO-Weltnaturerbes'
    image: /img/attractions/baumkronenpfad.webp
    imageAlt: 'Baumkronenpfad im Nationalpark Hainich'
    distanceKm: 45
    featured: false
    category: natur
```

### Homepage Assembly

```vue
<!-- app/pages/index.vue -->
<script setup lang="ts">
// SEO meta
useHead({
  title: 'Pension Volgenandt | Ruhe finden im Eichsfeld',
  meta: [
    {
      name: 'description',
      content:
        'Familiaer gefuehrte Pension in Breitenbach, Eichsfeld. Ferienwohnungen und Zimmer mit Blick ins Gruene. Wandern, Burgen, Baerenpark in der Naehe.',
    },
  ],
})
</script>

<template>
  <div>
    <HomeHeroVideo />

    <ScrollReveal>
      <HomeWelcome id="willkommen" />
    </ScrollReveal>

    <ScrollReveal>
      <HomeFeaturedRooms />
    </ScrollReveal>

    <ScrollReveal>
      <HomeTestimonials />
    </ScrollReveal>

    <ScrollReveal>
      <HomeExperienceTeaser />
    </ScrollReveal>

    <ScrollReveal>
      <HomeSustainabilityTeaser />
    </ScrollReveal>

    <ScrollReveal>
      <HomeLocationMap />
    </ScrollReveal>
  </div>
</template>
```

## State of the Art

| Old Approach                                            | Current Approach                               | When Changed                                             | Impact                                                                                     |
| ------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| JS scroll listeners + getBoundingClientRect             | IntersectionObserver via VueUse                | IntersectionObserver has >97% browser support since 2020 | 10x less JS execution during scroll; no layout thrashing                                   |
| Swiper.js (45KB+) or Slick (30KB+ jQuery) for carousels | Embla Carousel (7KB gzipped)                   | Embla v8 released 2023, Vue 3 support stable             | 80% smaller bundle, better a11y, no jQuery dependency                                      |
| Google Maps iframe for location                         | Static map image (SSG) or Leaflet with consent | Post-GDPR enforcement in Germany                         | Eliminates consent requirement entirely with static image; avoids Schrems II complications |
| `scroll-behavior: smooth` polyfill                      | Native CSS `scroll-behavior: smooth`           | All modern browsers support since 2020                   | Zero JS for smooth scrolling; works with `prefers-reduced-motion`                          |
| JavaScript video source switching                       | CSS `hidden`/`block` with media queries        | Current best practice                                    | No layout shift; both elements in DOM; SEO-friendly                                        |

**Deprecated/outdated:**

- **AOS (Animate on Scroll) library:** Adds 14KB for effects achievable with CSS transitions + IntersectionObserver. Was popular 2018-2022 but now unnecessary.
- **jQuery-based carousels (Slick, Owl):** jQuery itself is 30KB+. Modern Vue 3 carousels are framework-native and smaller.
- **OpenStreetMap iframe embed (`/export/embed.html`):** Sets cookies, includes Matomo tracking, not DSGVO-compliant. Never use for German websites.

## Open Questions

1. **Nuxt Content v3: Single-file data collections**
   - What we know: `type: 'data'` collections work well for rooms (one file per item). For testimonials (5-6 items, all in one file), the collection source pattern might need `index.yml` rather than `*.yml` globbing.
   - What's unclear: Whether a single-file data collection (vs. one-file-per-item) works identically with `queryCollection()`. The rooms pattern uses `source: 'rooms/*.yml'` (multiple files). For testimonials, we want `source: 'testimonials/index.yml'` (single file containing an array).
   - Recommendation: Test during implementation. If single-file collections don't work as expected, fall back to a simple TypeScript data file in `app/data/testimonials.ts` -- the data is small enough that it doesn't need the content collection machinery.

2. **Static map image generation tooling**
   - What we know: Multiple tools exist (py-staticmaps, Geoapify free tier, manual screenshot). Need a ~600x400 WebP image with a marker at the pension coordinates.
   - What's unclear: Best tool for a one-time generation on a Windows development machine.
   - Recommendation: Use Geoapify Static Maps API free tier (600 requests/day) to generate the image once during development. URL format: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:10.2197,51.3747&zoom=13&marker=lonlat:10.2197,51.3747;color:%237A9B6D&apiKey=YOUR_KEY`. Save the result as `public/img/map/pension-location.webp`. Alternatively, screenshot from openstreetmap.org at the right zoom and add a marker in an image editor.

3. **Embla Carousel with Nuxt 4 SSG**
   - What we know: Embla is framework-agnostic with a dedicated Vue 3 composable. It should work with `<ClientOnly>` wrapper since carousels need DOM.
   - What's unclear: Whether Embla's Vue composable works during `nuxt generate` without explicit `<ClientOnly>` wrapping.
   - Recommendation: Wrap the carousel in `<ClientOnly>` to be safe. During SSR, show the first testimonial as static content (no-JS fallback). This provides both SEO value and graceful degradation.

4. **Exact coordinates for the pension**
   - What we know: Address is Otto-Reuter-Strasse 28, 37327 Leinefelde-Worbis OT Breitenbach.
   - What's unclear: Precise lat/lon coordinates (51.3747, 10.2197 is approximate for Breitenbach).
   - Recommendation: Verify coordinates by searching the address on openstreetmap.org before generating the static map.

## Sources

### Primary (HIGH confidence)

- **VueUse `useElementVisibility`** -- https://vueuse.org/core/useElementVisibility/ -- API docs, composable signature, options, `once` parameter
- **VueUse `useIntersectionObserver`** -- https://vueuse.org/core/useintersectionobserver/ -- Full API docs, callback signature, directive usage
- **Embla Carousel Vue docs** -- https://www.embla-carousel.com/get-started/vue/ -- Installation, composable API, plugin integration, autoplay setup
- **Embla Carousel Accessibility plugin** -- https://www.embla-carousel.com/plugins/accessibility/ -- ARIA support, keyboard nav, screen reader announcements, WCAG 2.1 AA
- **Lucide Icons** -- https://lucide.dev/icons/ -- Confirmed: `sun`, `droplets`, `recycle`, `leaf`, `star`, `star-half`, `chevron-down` all exist
- **Nuxt Content v3 data collections** -- https://content.nuxt.com/docs/collections/types -- `type: 'data'` for YAML collections

### Secondary (MEDIUM confidence)

- **eRecht24 OSM DSGVO analysis** -- https://www.e-recht24.de/dsg/12709-openstreetmaps.html -- Consent required for OSM embed in Germany; self-hosted tiles are consent-free. Germany's leading legal compliance resource.
- **Dr. DSGVO OSM analysis** -- https://dr-dsgvo.de/ist-openstreetmap-datenschutzkonform-nutzbar-en/ -- Confirms OSM standard embed is not DSGVO-compliant; self-hosted server required for consent-free use
- **OSM Community Forum (DSGVO thread)** -- https://community.openstreetmap.org/t/osm-dsgvo-konform-und-ohne-einwilligung-nutzen/96228 -- German legal debate; no consensus on tile.openstreetmap.de compliance; proxy or self-host recommended
- **Aaron Grogg: Improving LCP for Video Hero** -- https://aarontgrogg.com/blog/2026/01/06/improving-lcp-for-video-hero-components/ -- Picture/video layering technique for LCP optimization
- **Bundlephobia Embla Carousel** -- ~7KB gzipped per multiple sources; vue3-carousel ~15KB. Swiper 45KB+.
- **OpenStreetMap Static Map Images wiki** -- https://wiki.openstreetmap.org/wiki/Static_map_images -- Comprehensive list of static map generation tools

### Tertiary (LOW confidence)

- **vue3-carousel-nuxt Nuxt module** -- Exists on npm but unclear Nuxt 4 compat; low download count. Not recommended over raw embla-carousel-vue.
- **@nuxtjs/leaflet module** -- States compat >=Nuxt 3.0.0 but no explicit Nuxt 4 testing confirmed. Underlying vue-leaflet has SSR limitations requiring `<ClientOnly>`.
- **Geoapify Static Maps API** -- Free tier exists (600 req/day), adequate for one-time map generation during development. Pricing/terms may change.

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- Embla Carousel is well-documented with Vue 3 composable, VueUse composables verified via official docs, Nuxt Content patterns established in Phase 2
- Architecture: HIGH -- Homepage section pattern is standard Vue component composition; scroll animation pattern is well-established IntersectionObserver + CSS transitions
- Pitfalls: HIGH -- DSGVO/OSM issue confirmed by multiple German legal sources (eRecht24, Dr. DSGVO); video LCP optimization is well-documented; animation pitfalls are standard CSS knowledge
- Map approach: MEDIUM -- Static image approach is technically straightforward but the one-time generation workflow needs to be validated. The legal reasoning (DSGVO requires consent for OSM) is HIGH confidence per eRecht24.

**Research date:** 2026-02-22
**Valid until:** 2026-03-22 (30 days -- stable domain, no fast-moving libraries)
