# Phase 1: Foundation & Legal Compliance - Research

**Researched:** 2026-02-22
**Domain:** Nuxt 4 SSG, Tailwind CSS v4, cookie consent (TDDDG/DSGVO), German legal pages
**Confidence:** HIGH

## Summary

This phase establishes the complete build pipeline for a Nuxt 4 static site with Tailwind CSS v4 design tokens, self-hosted variable fonts, a responsive layout (header + footer), a custom cookie consent system, and three legally required German pages (Impressum, Datenschutz, AGB).

The standard approach is: scaffold with `nuxi init`, configure Tailwind v4 via `@tailwindcss/vite` (not the legacy `@nuxtjs/tailwindcss` module), define all design tokens in a CSS-first `@theme` block, self-host Lora Variable and DM Sans Variable fonts via `@nuxt/fonts` with fontsource packages, and build a custom cookie consent composable using Nuxt's `useCookie` for SSR-safe persistence. The legal pages use hardcoded Vue page components with German legal text following DDG SS5 and TDDDG SS25 requirements.

Key discoveries: Nuxt 4 uses the `app/` directory structure (not flat root); Tailwind v4 has no `tailwind.config.js` -- everything is CSS-first via `@theme`; the `@nuxtjs/tailwindcss` module must NOT be used with Tailwind v4 (causes conflicts); `prettier-plugin-tailwindcss` requires a `tailwindStylesheet` option pointing to the CSS file for v4; and cookie consent must use `useCookie` (not localStorage) to avoid SSR hydration mismatches.

**Primary recommendation:** Use Nuxt 4.x with `@tailwindcss/vite`, CSS-first `@theme` design tokens, `@nuxt/fonts` for self-hosted variable fonts, and a custom `useCookieConsent` composable backed by Nuxt's `useCookie` for SSR-safe consent state.

## Standard Stack

### Core

| Library           | Version | Purpose                           | Why Standard                                                           |
| ----------------- | ------- | --------------------------------- | ---------------------------------------------------------------------- |
| nuxt              | ^4.3.1  | Full-stack Vue framework with SSG | Current stable major version; v3 EOL maintenance only through mid-2026 |
| tailwindcss       | ^4.2.0  | Utility-first CSS framework       | CSS-first config via @theme, 5x faster builds, no JS config file       |
| @tailwindcss/vite | ^4.2.0  | Vite plugin for Tailwind v4       | Official integration; replaces PostCSS plugin from v3                  |
| typescript        | ^5.7.0  | Type safety                       | Required by Nuxt 4 for strict type checking                            |
| vue-tsc           | ^2.2.0  | Vue TypeScript type checker       | Required for `nuxt typecheck` command                                  |
| pnpm              | ^9.x    | Package manager                   | Faster, disk-efficient; specified in requirements                      |

### Supporting

| Library                      | Version | Purpose                                                 | When to Use                                                                     |
| ---------------------------- | ------- | ------------------------------------------------------- | ------------------------------------------------------------------------------- |
| @nuxt/fonts                  | latest  | Font optimization and self-hosting                      | Auto-detects @fontsource packages, resolves locally                             |
| @fontsource-variable/lora    | latest  | Lora Variable font files (wght 400-700, ital)           | Heading typography -- self-hosted, zero CDN                                     |
| @fontsource-variable/dm-sans | latest  | DM Sans Variable font files (wght 100-1000, ital, opsz) | Body/UI typography -- self-hosted, zero CDN                                     |
| @nuxt/image                  | latest  | Image optimization for SSG                              | WebP/AVIF output, responsive srcsets, lazy loading; auto-uses ipxStatic for SSG |
| @nuxt/eslint                 | ^1.15.1 | Project-aware ESLint flat config                        | Generates Nuxt-specific rules via withNuxt() helper                             |
| prettier                     | ^3.x    | Code formatting                                         | Required by prettier-plugin-tailwindcss (ESM-only)                              |
| prettier-plugin-tailwindcss  | latest  | Tailwind class sorting                                  | Must be loaded LAST in plugins array; needs tailwindStylesheet for v4           |
| @vueuse/nuxt                 | latest  | VueUse composables with auto-import                     | useWindowScroll, useScrollLock, useMediaQuery for header behavior               |

### Alternatives Considered

| Instead of                       | Could Use                         | Tradeoff                                                                                                                                       |
| -------------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Custom cookie consent composable | nuxt-simple-cookie-consent module | Module is headless + reactive, but only targets Nuxt 3 with unverified Nuxt 4 compat; custom composable is ~50 lines and guaranteed compatible |
| @tailwindcss/vite                | @nuxtjs/tailwindcss module        | Legacy module does NOT support Tailwind v4 and WILL cause conflicts; must use @tailwindcss/vite                                                |
| @nuxt/fonts                      | Manual CSS @font-face             | @nuxt/fonts auto-detects fontsource packages, handles subsetting, generates optimal preloads                                                   |
| Custom scroll composable         | @vueuse/nuxt useWindowScroll      | VueUse is battle-tested; avoid SSR pitfalls of custom window event listeners                                                                   |

**Installation:**

```bash
# Core
pnpm add nuxt@^4

# Tailwind CSS v4
pnpm add -D tailwindcss @tailwindcss/vite

# Fonts (self-hosted)
pnpm add @fontsource-variable/lora @fontsource-variable/dm-sans

# Nuxt modules
pnpm add @nuxt/fonts @nuxt/image @nuxt/eslint @vueuse/nuxt

# Dev tooling
pnpm add -D typescript vue-tsc prettier prettier-plugin-tailwindcss
```

## Architecture Patterns

### Recommended Project Structure

```
pension-volgenandt-website/
├── app/
│   ├── assets/
│   │   └── css/
│   │       └── main.css          # @import "tailwindcss" + @theme tokens
│   ├── components/
│   │   ├── ui/                   # Base UI: Button, Card, Badge, Icon
│   │   ├── AppHeader.vue         # Sticky header with nav, phone, CTA
│   │   ├── AppFooter.vue         # 4-column footer with CTA bar
│   │   └── CookieConsent.vue     # Cookie consent banner component
│   ├── composables/
│   │   ├── useCookieConsent.ts   # Cookie consent state (useCookie-backed)
│   │   └── useScrollHeader.ts    # Header compress-on-scroll behavior
│   ├── layouts/
│   │   └── default.vue           # Header + <slot /> + Footer
│   ├── pages/
│   │   ├── impressum.vue         # Legal: Impressum (DDG SS5)
│   │   ├── datenschutz.vue       # Legal: Datenschutzerklaerung (DSGVO)
│   │   └── agb.vue               # Legal: AGB booking terms
│   ├── plugins/                  # (empty for now)
│   ├── utils/                    # (empty for now)
│   ├── app.vue                   # Root: <NuxtLayout><NuxtPage /></NuxtLayout>
│   └── app.config.ts             # Runtime app config (contact details, etc.)
├── public/
│   ├── favicon.ico
│   └── img/                      # Static images (existing 8 images)
├── server/                       # (empty for Phase 1)
├── nuxt.config.ts                # Main config: modules, vite plugins, app.head
├── eslint.config.mjs             # ESLint flat config via withNuxt()
├── .prettierrc                   # Prettier + tailwindcss plugin config
├── tsconfig.json                 # Extends .nuxt/tsconfig.json (auto-generated)
├── Makefile                      # dev, build, preview, generate, lint, format, typecheck, clean
├── package.json
└── pnpm-lock.yaml
```

### Pattern 1: CSS-First Design Tokens with @theme

**What:** Define all design tokens (colors, fonts, spacing, radii) in a single CSS file using Tailwind v4's `@theme` directive. No tailwind.config.js.
**When to use:** Always with Tailwind v4. This replaces the JavaScript configuration entirely.
**Example:**

```css
/* app/assets/css/main.css */
/* Source: https://tailwindcss.com/docs/theme */

@import 'tailwindcss';

@theme {
  /* Typography */
  --font-serif: 'Lora Variable', Georgia, serif;
  --font-sans: 'DM Sans Variable', ui-sans-serif, system-ui, sans-serif;

  /* Sage green palette */
  --color-sage-50: oklch(0.97 0.01 145);
  --color-sage-100: oklch(0.94 0.02 145);
  --color-sage-200: oklch(0.88 0.04 145);
  --color-sage-300: oklch(0.8 0.06 145);
  --color-sage-400: oklch(0.7 0.08 145);
  --color-sage-500: oklch(0.6 0.09 145);
  --color-sage-600: oklch(0.5 0.08 145);
  --color-sage-700: oklch(0.42 0.07 145);
  --color-sage-800: oklch(0.34 0.06 145);
  --color-sage-900: oklch(0.26 0.05 145);
  --color-sage-950: oklch(0.18 0.04 145);

  /* Terracotta CTA palette */
  --color-waldhonig-50: oklch(0.97 0.02 45);
  --color-waldhonig-100: oklch(0.93 0.04 40);
  --color-waldhonig-200: oklch(0.86 0.08 38);
  --color-waldhonig-300: oklch(0.78 0.12 35);
  --color-waldhonig-400: oklch(0.7 0.14 30);
  --color-waldhonig-500: oklch(0.62 0.15 28);
  --color-waldhonig-600: oklch(0.55 0.14 25);
  --color-waldhonig-700: oklch(0.48 0.12 25);
  --color-waldhonig-800: oklch(0.4 0.1 25);
  --color-waldhonig-900: oklch(0.32 0.08 25);

  /* Warm backgrounds */
  --color-cream: oklch(0.97 0.01 85);
  --color-warm-white: oklch(0.99 0.005 85);

  /* Border radius -- 8px consistent */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;

  /* Custom breakpoints */
  --breakpoint-nav: 64rem; /* 1024px -- mobile nav breakpoint */
}
```

### Pattern 2: SSR-Safe Cookie Consent Composable

**What:** A custom composable using Nuxt's `useCookie` for persistence, providing reactive consent state that works during SSR and avoids hydration mismatches.
**When to use:** For managing cookie consent categories (essential, booking, media) without third-party dependencies.
**Example:**

```typescript
// app/composables/useCookieConsent.ts
// Source: Nuxt useCookie docs (https://nuxt.com/docs/4.x/api/composables/use-cookie)

interface ConsentPreferences {
  essential: boolean // Always true, non-toggleable
  booking: boolean // Beds24 widget (Phase 5)
  media: boolean // YouTube, Maps (Phase 3+)
}

export function useCookieConsent() {
  const consent = useCookie<ConsentPreferences | null>('cookie_consent', {
    maxAge: 60 * 60 * 24 * 180, // 180 days
    sameSite: 'lax',
    path: '/',
    default: () => null, // null = no choice made yet
  })

  const hasConsented = computed(() => consent.value !== null)

  function acceptAll() {
    consent.value = { essential: true, booking: true, media: true }
  }

  function rejectAll() {
    consent.value = { essential: true, booking: false, media: false }
  }

  function updateCategory(category: keyof ConsentPreferences, value: boolean) {
    if (category === 'essential') return // Cannot disable essential
    consent.value = { ...consent.value!, [category]: value }
  }

  function isAllowed(category: keyof ConsentPreferences): boolean {
    if (category === 'essential') return true
    return consent.value?.[category] ?? false
  }

  return {
    consent: readonly(consent),
    hasConsented,
    acceptAll,
    rejectAll,
    updateCategory,
    isAllowed,
  }
}
```

### Pattern 3: Nuxt 4 Default Layout with Header/Footer

**What:** A default layout wrapping all pages with AppHeader and AppFooter, using the standard Nuxt 4 `app/layouts/` convention.
**When to use:** For the site-wide layout structure.
**Example:**

```vue
<!-- app/layouts/default.vue -->
<!-- Source: https://nuxt.com/docs/4.x/directory-structure/app/layouts -->
<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
    <CookieConsent />
  </div>
</template>
```

```vue
<!-- app/app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

### Pattern 4: Header Scroll Compression

**What:** Use VueUse's `useWindowScroll` to detect scroll position and compress the header height, with SSR safety via `onMounted`.
**When to use:** For the sticky header that compresses from full height to ~60-64px on scroll.
**Example:**

```typescript
// app/composables/useScrollHeader.ts
export function useScrollHeader(threshold = 50) {
  const isCompressed = ref(false)

  if (import.meta.client) {
    const { y } = useWindowScroll()
    watch(y, (scrollY) => {
      isCompressed.value = scrollY > threshold
    })
  }

  return { isCompressed }
}
```

### Anti-Patterns to Avoid

- **Using @nuxtjs/tailwindcss module with Tailwind v4:** This module is for Tailwind v3 only. It WILL conflict with `@tailwindcss/vite`. Use the Vite plugin directly.
- **Creating tailwind.config.js:** Tailwind v4 uses CSS-first configuration via `@theme`. There is no JavaScript config file.
- **Using localStorage for consent state:** Causes SSR hydration mismatches. Use Nuxt's `useCookie` composable instead.
- **Modifying tsconfig.json directly:** Nuxt 4 auto-generates TypeScript config in `.nuxt/`. Customize via `nuxt.config.ts` typescript options.
- **Placing source files in project root instead of app/:** Nuxt 4 uses the `app/` directory for all frontend code. Components go in `app/components/`, pages in `app/pages/`, etc.
- **Pre-checked cookie consent checkboxes:** Violates TDDDG SS25. All non-essential categories must default to unchecked/rejected.

## Don't Hand-Roll

| Problem                              | Don't Build                                     | Use Instead                                              | Why                                                                                      |
| ------------------------------------ | ----------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Font loading and optimization        | Custom @font-face with preload links            | `@nuxt/fonts` module + `@fontsource-variable/*` packages | Handles subsetting, preloads, font-display, woff2 compression automatically              |
| Image optimization pipeline          | Sharp scripts, custom WebP conversion           | `@nuxt/image` with ipxStatic provider                    | Automatic format conversion, responsive srcsets, lazy loading; works with nuxt generate  |
| ESLint configuration for Nuxt/Vue/TS | Manual eslint.config.mjs with dozens of plugins | `@nuxt/eslint` module with `withNuxt()`                  | Project-aware config generation, auto-detects your file structure, includes Vue/TS rules |
| CSS class sorting                    | Manual ordering conventions                     | `prettier-plugin-tailwindcss`                            | Automatic, consistent, no mental overhead                                                |
| Scroll position tracking             | Custom `window.addEventListener('scroll')`      | `@vueuse/nuxt` with `useWindowScroll`                    | SSR-safe, debounced, reactive, handles cleanup                                           |
| Scroll lock (mobile menu)            | Custom `overflow: hidden` toggling              | `@vueuse/nuxt` with `useScrollLock`                      | Handles iOS Safari quirks, body scroll position, cleanup                                 |
| Responsive breakpoint detection      | Custom `matchMedia` listeners                   | `@vueuse/nuxt` with `useMediaQuery`                      | SSR-safe, reactive, handles cleanup                                                      |

**Key insight:** Nuxt 4's module ecosystem provides battle-tested solutions for most infrastructure concerns. The only custom code needed is the cookie consent composable (because it must match the exact consent categories from the requirements) and the design token definitions (because they encode the specific sage/waldhonig/cream palette).

## Common Pitfalls

### Pitfall 1: @nuxtjs/tailwindcss Module with Tailwind v4

**What goes wrong:** Site fails to build or Tailwind classes don't work. Conflicting PostCSS configurations.
**Why it happens:** The `@nuxtjs/tailwindcss` Nuxt module wraps Tailwind v3's PostCSS plugin. Tailwind v4 uses a completely different architecture (`@tailwindcss/vite` Vite plugin). Installing both causes conflicts.
**How to avoid:** Do NOT install `@nuxtjs/tailwindcss`. Install only `tailwindcss` and `@tailwindcss/vite`. Configure via `vite.plugins` in `nuxt.config.ts`.
**Warning signs:** Error messages about PostCSS plugin conflicts; Tailwind classes rendering as plain text.

### Pitfall 2: SSR Hydration Mismatch with Consent State

**What goes wrong:** Console warnings about hydration mismatch; consent banner flickers on page load.
**Why it happens:** Using `localStorage` or `document.cookie` directly causes different HTML on server vs client during SSR. The server doesn't have access to these APIs.
**How to avoid:** Use Nuxt's `useCookie` composable, which is SSR-aware and works on both server and client. For UI that depends on consent state, use `<ClientOnly>` wrapper or check `import.meta.client` before accessing browser-only APIs.
**Warning signs:** Hydration mismatch warnings in browser console; banner appearing then disappearing on page load.

### Pitfall 3: Missing tailwindStylesheet in Prettier Config

**What goes wrong:** Prettier doesn't sort Tailwind classes, or sorts them incorrectly.
**Why it happens:** `prettier-plugin-tailwindcss` defaults to looking for `tailwind.config.js` (v3 pattern). Tailwind v4 has no config file -- it uses a CSS stylesheet.
**How to avoid:** Set `"tailwindStylesheet": "./app/assets/css/main.css"` in `.prettierrc`.
**Warning signs:** Classes not being sorted despite plugin being installed; warnings about missing Tailwind config.

### Pitfall 4: Files Outside app/ Directory

**What goes wrong:** Components, pages, or composables are not auto-imported; 404 errors on pages.
**Why it happens:** Nuxt 4 defaults to the `app/` directory structure. Placing files at the project root (e.g., `components/` instead of `app/components/`) means they won't be detected.
**How to avoid:** Always place frontend code under `app/`. The only root-level directories should be `public/`, `server/`, and `shared/`.
**Warning signs:** Auto-imports not working; "component not found" errors; pages returning 404.

### Pitfall 5: Cookie Consent Banner Without Equal Reject Button

**What goes wrong:** Legal non-compliance; risk of Abmahnung (cease-and-desist).
**Why it happens:** Many consent implementations make "Accept" prominent and hide "Reject" or require extra clicks. German courts have ruled this violates TDDDG SS25.
**How to avoid:** Both "Akzeptieren" and "Ablehnen" buttons must have equal visual prominence (same size, same contrast, same position hierarchy). No dark patterns.
**Warning signs:** "Accept" button is colored/large while "Reject" is small/grey text link.

### Pitfall 6: External Font CDN Requests (GDPR Violation)

**What goes wrong:** Google Fonts requests appear in Network tab, violating GDPR (German court ruling, LG Muenchen I, January 2022).
**Why it happens:** Using CDN-hosted fonts or accidentally importing from Google Fonts URL instead of local npm packages.
**How to avoid:** Use `@fontsource-variable/*` npm packages with `@nuxt/fonts`. The fonts module resolves fonts locally from disk by default (`remote: false`). Verify no external font requests in Network tab.
**Warning signs:** Requests to `fonts.googleapis.com` or `fonts.gstatic.com` in browser Network tab.

### Pitfall 7: nuxt generate Requires SSR Enabled for Image Optimization

**What goes wrong:** Images are not optimized during static generation; WebP/AVIF variants not created.
**Why it happens:** `@nuxt/image` with `ipxStatic` requires SSR to be enabled (which is the default). If someone sets `ssr: false`, image optimization silently stops working.
**How to avoid:** Keep `ssr: true` (default). Do not disable it for SSG builds.
**Warning signs:** Generated images are original format/size; no `/_ipx/` paths in generated output.

### Pitfall 8: Impressum Must Reference DDG SS5, Not TMG SS5

**What goes wrong:** Legal page references outdated law (TMG was replaced by DDG on May 14, 2024).
**Why it happens:** Many templates and generators still reference the old Telemediengesetz (TMG). The Digitale-Dienste-Gesetz (DDG) replaced it.
**How to avoid:** All legal references must cite DDG SS5 (not TMG SS5) and TDDDG SS25 (not TTDSG SS25). The substantive requirements are the same, only the law names changed.
**Warning signs:** Legal text mentioning "TMG" or "TTDSG" instead of "DDG" or "TDDDG".

## Code Examples

### nuxt.config.ts -- Complete Phase 1 Configuration

```typescript
// nuxt.config.ts
// Sources: https://tailwindcss.com/docs/installation/framework-guides/nuxt
//          https://nuxt.com/docs/4.x/api/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Global CSS entry point (contains @theme tokens)
  css: ['./app/assets/css/main.css'],

  // Nuxt modules
  modules: ['@nuxt/fonts', '@nuxt/image', '@nuxt/eslint', '@vueuse/nuxt'],

  // Tailwind v4 via Vite plugin (NOT @nuxtjs/tailwindcss)
  vite: {
    plugins: [tailwindcss()],
  },

  // TypeScript strict mode
  typescript: {
    strict: true,
    typeCheck: 'build', // Type check at build time, not during dev (performance)
  },

  // Image optimization
  image: {
    format: ['avif', 'webp'],
    quality: 80,
  },

  // SSG configuration
  nitro: {
    prerender: {
      routes: ['/impressum', '/datenschutz', '/agb'],
    },
  },

  // Global head defaults
  app: {
    head: {
      htmlAttrs: { lang: 'de' },
      title: 'Pension Volgenandt -- Ruhe finden im Eichsfeld',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
})
```

### eslint.config.mjs -- ESLint Flat Config

```javascript
// eslint.config.mjs
// Source: https://eslint.nuxt.com/packages/module
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Additional custom rules can be added here
  {
    rules: {
      'vue/multi-word-component-names': 'off', // Allow single-word page names
    },
  },
)
```

### .prettierrc -- Prettier with Tailwind Plugin

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./app/assets/css/main.css"
}
```

### Makefile -- Build Commands

```makefile
# Makefile
.PHONY: dev build preview generate lint lint\:fix format typecheck clean

dev:
	pnpm nuxi dev

build:
	pnpm nuxi build

preview:
	pnpm nuxi preview

generate:
	pnpm nuxi generate

lint:
	pnpm eslint .

lint\:fix:
	pnpm eslint . --fix

format:
	pnpm prettier --write "app/**/*.{vue,ts,css,json}"

typecheck:
	pnpm nuxi typecheck

clean:
	rm -rf .nuxt .output node_modules/.cache
```

### app.config.ts -- Runtime Contact Details

```typescript
// app/app.config.ts
// Source: Nuxt app.config docs
export default defineAppConfig({
  contact: {
    phone: '+49 3605 542775',
    mobile: '+49 160 97719112',
    email: 'kontakt@pension-volgenandt.de',
    address: {
      street: 'Otto-Reuter-Stra\u00dfe 28',
      city: '37327 Leinefelde-Worbis OT Breitenbach',
      country: 'Deutschland',
    },
  },
  legal: {
    // Placeholders -- owner must fill before launch
    ownerName: '[OWNER_NAME]',
    taxId: '[STEUERNUMMER_OR_UST_IDNR]',
    authority: '[AUFSICHTSBEHOERDE_IF_APPLICABLE]',
  },
  nav: [
    { label: 'Zimmer', to: '/zimmer' },
    { label: 'Familie', to: '/familie' },
    { label: 'Aktivit\u00e4ten', to: '/aktivitaeten' },
    { label: 'Nachhaltigkeit', to: '/nachhaltigkeit' },
    { label: 'Kontakt', to: '/kontakt' },
  ],
})
```

### Font Import via @nuxt/fonts

```typescript
// nuxt.config.ts -- fonts configuration
// @nuxt/fonts auto-detects @fontsource-variable packages from package.json
// No explicit font config needed -- just install the packages and reference in CSS

// The @theme block in main.css handles font-family assignment:
// --font-serif: 'Lora Variable', Georgia, serif;
// --font-sans: 'DM Sans Variable', ui-sans-serif, system-ui, sans-serif;
```

Lora Variable supports: weight 400-700, italic axis, Latin/Latin Extended/Cyrillic subsets.
DM Sans Variable supports: weight 100-1000, italic axis, optical size 9-40, Latin/Latin Extended subsets.

### Cookie Consent Banner Component

```vue
<!-- app/components/CookieConsent.vue -->
<template>
  <div
    v-if="!hasConsented"
    class="fixed inset-x-0 bottom-0 z-50 border-t border-sage-200 bg-warm-white p-4 shadow-lg"
    role="dialog"
    aria-label="Cookie-Einstellungen"
  >
    <div class="mx-auto max-w-screen-xl">
      <p class="mb-4 font-sans text-base text-sage-800">
        Wir verwenden Cookies, um Ihnen die bestmoegliche Erfahrung zu bieten. Weitere Informationen
        finden Sie in unserer
        <NuxtLink to="/datenschutz" class="underline">Datenschutzerklaerung</NuxtLink>.
      </p>
      <div class="flex flex-wrap gap-3">
        <!-- Equal-prominence buttons: TDDDG SS25 compliant -->
        <button
          class="rounded-md bg-waldhonig-500 px-6 py-3 font-sans font-semibold text-white"
          @click="acceptAll"
        >
          Alle akzeptieren
        </button>
        <button
          class="rounded-md bg-sage-700 px-6 py-3 font-sans font-semibold text-white"
          @click="rejectAll"
        >
          Nur Notwendige
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { hasConsented, acceptAll, rejectAll } = useCookieConsent()
</script>
```

## State of the Art

| Old Approach                        | Current Approach                | When Changed           | Impact                                                            |
| ----------------------------------- | ------------------------------- | ---------------------- | ----------------------------------------------------------------- |
| tailwind.config.js (JS)             | @theme directive in CSS         | Tailwind v4 (Jan 2025) | No JS config; all tokens in CSS; CSS vars generated automatically |
| @nuxtjs/tailwindcss module          | @tailwindcss/vite plugin        | Tailwind v4 (Jan 2025) | Direct Vite integration; module causes conflicts with v4          |
| PostCSS plugin for Tailwind         | Vite plugin (@tailwindcss/vite) | Tailwind v4 (Jan 2025) | 5x faster full builds, 100x faster incremental                    |
| Root-level components/, pages/      | app/components/, app/pages/     | Nuxt 4 (mid-2025)      | Cleaner separation from config/tooling files                      |
| TMG SS5 + TTDSG SS25                | DDG SS5 + TDDDG SS25            | May 14, 2024           | Same substantive requirements, new law names                      |
| @tailwind base/components/utilities | @import "tailwindcss"           | Tailwind v4 (Jan 2025) | Single import replaces three directives                           |
| Multiple tsconfig.json files        | Single root tsconfig.json       | Nuxt 4 (mid-2025)      | Nuxt auto-generates separate configs per context                  |

**Deprecated/outdated:**

- `@nuxtjs/tailwindcss` module: Incompatible with Tailwind v4. Use `@tailwindcss/vite` instead.
- `tailwind.config.js` / `tailwind.config.ts`: Replaced by CSS-first `@theme` in v4.
- `@tailwind base; @tailwind components; @tailwind utilities;`: Replaced by `@import "tailwindcss";` in v4.
- TMG / TTDSG law references: Replaced by DDG / TDDDG since May 2024.
- `future: { compatibilityVersion: 4 }` in nuxt.config: No longer needed in Nuxt 4; v4 features enabled by default.

## Cookie Consent Design Decision (Claude's Discretion)

**Recommendation: Three-category system with simple accept/reject initial choice.**

The requirements specify three categories: essential (always on), booking (Beds24), media (YouTube, Maps). For the initial banner, use a simple two-button interface: "Alle akzeptieren" and "Nur Notwendige". This is the cleanest TDDDG-compliant approach for a site with only two optional categories.

Add a "Cookie-Einstellungen" link in the footer (Column 4: Rechtliches) that opens a settings panel where users can toggle individual categories. This satisfies the TDDDG requirement that users be able to accept/reject each purpose separately.

For Phase 1, the booking and media categories will have no scripts to manage (those come in Phase 3 and 5). The composable and UI should still define all three categories so the architecture is ready when those phases arrive.

## DDG SS5 Impressum Required Fields

Per DDG SS5 (verified via gesetze-im-internet.de), the Impressum must contain:

1. **Name and address** of the service provider (Inhaber full name + Otto-Reuter-Strasse 28, 37327 Leinefelde-Worbis OT Breitenbach)
2. **Email address** for direct electronic contact (kontakt@pension-volgenandt.de) -- a contact form alone is NOT sufficient (Munich court ruling, Feb 2025)
3. **Phone number** for rapid contact (+49 3605 542775)
4. **Trade register entry** (if applicable -- Handelsregister, Registergericht, Registernummer)
5. **VAT ID** (Umsatzsteuer-Identifikationsnummer or Steuernummer -- placeholder needed from owner)
6. **Supervisory authority** (Aufsichtsbehoerde, if business requires approval -- placeholder needed)
7. **Professional credentials** (if regulated profession -- likely N/A for a pension)
8. **Responsible for content per SS18 Abs. 2 MStV** (Verantwortlich fuer den Inhalt)

The page must be labeled "Impressum" (not "Legal Notice"), accessible from every page (typically via footer link), and must not require more than 2 clicks to reach.

## Open Questions

1. **Exact sage green oklch values**
   - What we know: The palette should be a sage green with 10 shades (50-950). The @theme example above uses estimated oklch values.
   - What's unclear: The exact oklch or hex values have not been specified by the owner/designer.
   - Recommendation: Generate a balanced sage green palette in oklch format during implementation. Test for WCAG AA contrast ratios (4.5:1 for body text on cream backgrounds).

2. **Logo availability**
   - What we know: The header needs a logo; the footer needs a light version.
   - What's unclear: Whether a logo file (SVG preferred) exists or needs to be created.
   - Recommendation: Use a text-based logo placeholder ("Pension Volgenandt" in Lora Variable) for Phase 1. Replace with actual logo when available.

3. **nuxt-simple-cookie-consent vs custom composable**
   - What we know: The module provides headless consent management with reactive composable, but targets Nuxt 3 specifically. No confirmed Nuxt 4 compatibility.
   - What's unclear: Whether the module works with Nuxt 4 out of the box.
   - Recommendation: Build a custom `useCookieConsent` composable (~50 lines). It is simple enough that a dependency is not warranted, and guaranteed Nuxt 4 compatible.

4. **Trust badge assets (DEHOGA, secure booking)**
   - What we know: Footer Column 4 should include trust badges.
   - What's unclear: Whether the pension has DEHOGA membership or other certifications.
   - Recommendation: Include placeholder trust badge areas in the footer. The owner confirms which badges apply.

## Sources

### Primary (HIGH confidence)

- [Tailwind CSS v4 @theme docs](https://tailwindcss.com/docs/theme) -- Complete @theme directive syntax, namespaces, override patterns
- [Tailwind CSS Nuxt installation guide](https://tailwindcss.com/docs/installation/framework-guides/nuxt) -- Official step-by-step setup with @tailwindcss/vite
- [Nuxt 4 directory structure](https://nuxt.com/docs/4.x/directory-structure) -- app/ directory layout, auto-imports
- [Nuxt 4 layouts](https://nuxt.com/docs/4.x/directory-structure/app/layouts) -- Layout system, default.vue, NuxtLayout usage
- [Nuxt 4 TypeScript](https://nuxt.com/docs/4.x/guide/concepts/typescript) -- Strict mode, typeCheck configuration
- [Nuxt 4 SEO meta](https://nuxt.com/docs/4.x/getting-started/seo-meta) -- useHead, useSeoMeta, definePageMeta
- [Nuxt 4 useCookie](https://nuxt.com/docs/4.x/api/composables/use-cookie) -- SSR-safe cookie composable with all options
- [Nuxt 4 deployment/SSG](https://nuxt.com/docs/4.x/getting-started/deployment) -- nuxt generate, static output
- [Nuxt Fonts installation](https://fonts.nuxt.com/get-started/installation) -- Module setup, auto-detection
- [Nuxt Fonts providers](https://fonts.nuxt.com/get-started/providers) -- Fontsource/npm provider, local resolution
- [Nuxt Image configuration](https://image.nuxt.com/get-started/configuration) -- Format, quality, provider options
- [Nuxt Image static generation](https://image.nuxt.com/advanced/static-images) -- ipxStatic behavior, SSR requirement
- [DDG SS5 full text](https://www.gesetze-im-internet.de/ddg/__5.html) -- Mandatory Impressum fields
- [Fontsource Lora install](https://fontsource.org/fonts/lora/install) -- Axes (wght 400-700, ital), import paths
- [Fontsource DM Sans install](https://fontsource.org/fonts/dm-sans/install) -- Axes (wght 100-1000, ital, opsz), import paths
- [@nuxt/eslint GitHub](https://github.com/nuxt/eslint) -- v1.15.1, withNuxt() pattern
- [prettier-plugin-tailwindcss GitHub](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) -- tailwindStylesheet option for v4

### Secondary (MEDIUM confidence)

- [Nuxt 4.0 announcement](https://nuxt.com/blog/v4) -- Breaking changes, app/ directory, migration notes
- [Nuxt 4.3 blog](https://nuxt.com/blog/v4-3) -- Latest features, route rule layouts
- [TDDDG SS25 requirements](https://securiti.ai/blog/german-ttdsg-guide/) -- Consent requirements, equal-prominence buttons
- [DDG Impressum guidance](https://www.mth-partner.de/en/internet-law-imprint-obligation-according-to-the-german-gdpr-create-a-legally-compliant-imprint/) -- Required fields overview
- [Cookie consent Germany requirements](https://cookie-script.com/blog/cookie-consent-requirements-in-germany) -- Dark pattern restrictions, reject button ruling
- [nuxt-simple-cookie-consent](https://github.com/criting/nuxt-simple-cookie-consent) -- Headless module API, Nuxt 3 target
- [VueUse useWindowScroll](https://vueuse.org/core/usewindowscroll/) -- Scroll tracking composable
- [VueUse useScrollLock](https://vueuse.org/core/usescrolllock/) -- Body scroll lock for mobile menu

### Tertiary (LOW confidence)

- Nuxt 4 compatibilityDate handling -- some reported issues with Nitro 2.12.4 ignoring the setting; may be resolved in 4.3.x
- @vueuse/nuxt explicit Nuxt 4 support -- module actively maintained but Nuxt 4 compat not explicitly documented; highly likely to work as it is widely used

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- All libraries verified via official docs; versions confirmed via npm/GitHub releases
- Architecture: HIGH -- Nuxt 4 directory structure and Tailwind v4 @theme patterns verified via official documentation
- Cookie consent: HIGH -- Custom composable pattern verified via useCookie docs; TDDDG requirements verified via legal sources
- Legal requirements: HIGH -- DDG SS5 text verified via gesetze-im-internet.de; TDDDG SS25 requirements confirmed via multiple legal sources
- Font configuration: HIGH -- Fontsource package details verified; @nuxt/fonts provider behavior confirmed
- Pitfalls: HIGH -- All pitfalls derived from official migration guides and documented breaking changes

**Research date:** 2026-02-22
**Valid until:** 2026-03-22 (30 days -- stable ecosystem; Nuxt 4 and Tailwind v4 are mature releases)
