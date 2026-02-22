# Technology Stack

**Project:** Pension Volgenandt Website
**Researched:** 2026-02-21
**Overall confidence:** HIGH

---

## CRITICAL: Use Nuxt 4, Not Nuxt 3

The project brief says "Nuxt 3" but this is outdated. **Nuxt 4.3.1** is the current stable version (released February 7, 2026). Nuxt 3 entered end-of-life on January 31, 2026 and is no longer receiving bug fixes or security patches. Starting a new project on Nuxt 3 in February 2026 would be building on a dead framework version.

Nuxt 4 is not a dramatic rewrite -- it is a stability-focused major release with:

- New `app/` directory structure (cleaner separation of app vs server code)
- Improved data fetching (`useAsyncData`/`useFetch` with automatic sharing)
- Better TypeScript support with project-based separation
- Faster dev server (native `fs.watch`, socket-based CLI-Vite communication)
- All Nuxt 3 modules work with Nuxt 4 (the ecosystem has had a year to adapt)

**Decision: Use Nuxt 4.3.x for this project. No debate.**

Sources: [Nuxt 4.0 Announcement](https://nuxt.com/blog/v4), [Nuxt Releases](https://github.com/nuxt/nuxt/releases), [Nuxt EOL dates](https://endoflife.date/nuxt)

---

## Recommended Stack

### Core Framework

| Technology     | Version | Purpose        | Why                                                                                         |
| -------------- | ------- | -------------- | ------------------------------------------------------------------------------------------- |
| **Nuxt**       | ^4.3.1  | Meta-framework | Current stable. SSG support, auto-imports, file-based routing, Nitro engine. Nuxt 3 is EOL. |
| **Vue**        | ^3.5.x  | UI framework   | Ships with Nuxt 4. Composition API, `<script setup>`, reactivity system.                    |
| **TypeScript** | ^5.7.x  | Type safety    | Nuxt 4 has first-class TS support. Strict mode catches bugs early. Ships with Nuxt.         |
| **Vite**       | ^6.x    | Build tool     | Ships with Nuxt 4. Fast HMR, ESM-native, Rollup-based production builds.                    |

**Confidence:** HIGH -- verified via [Nuxt releases](https://github.com/nuxt/nuxt/releases) and [Nuxt 4 blog](https://nuxt.com/blog/v4).

### Styling

| Technology            | Version | Purpose               | Why                                                                                                                     |
| --------------------- | ------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Tailwind CSS**      | ^4.1.x  | Utility CSS framework | CSS-first config via `@theme`, zero-config content detection, Oxide engine (Rust compiler). Up to 5x faster builds.     |
| **@tailwindcss/vite** | ^4.1.x  | Vite integration      | Official Tailwind v4 Vite plugin. Replaces `@nuxtjs/tailwindcss` module entirely. Direct Vite plugin = simpler, faster. |

**IMPORTANT: Do NOT use `@nuxtjs/tailwindcss` module.** That module wraps the old Tailwind v3 approach. Tailwind v4 uses `@tailwindcss/vite` directly as a Vite plugin. This is the official recommendation from both Tailwind and Nuxt documentation.

**Confidence:** HIGH -- verified via [Tailwind CSS official Nuxt guide](https://tailwindcss.com/docs/installation/framework-guides/nuxt) and [Tailwind v4 announcement](https://tailwindcss.com/blog/tailwindcss-v4).

### Nuxt Modules

| Module              | Version | Purpose              | Why                                                                                                                                                     |
| ------------------- | ------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **@nuxt/image**     | ^2.0.0  | Image optimization   | WebP/AVIF generation, responsive srcsets, lazy loading. Processes images at build time for SSG.                                                         |
| **@nuxt/fonts**     | ^0.12.x | Font loading         | Self-hosts fonts automatically. NPM provider resolves from `@fontsource/*` packages with `remote: false` (no CDN). Critical for German GDPR compliance. |
| **@nuxt/scripts**   | ^0.13.x | Third-party scripts  | Non-blocking script loading for Beds24 widget. Consent management built-in. Still in beta but functional.                                               |
| **@nuxt/eslint**    | ^1.15.x | ESLint integration   | Project-aware flat config generation. DevTools integration. Generates `.nuxt/eslint.config.mjs`.                                                        |
| **nuxt-schema-org** | ^5.0.x  | Structured data      | Schema.org JSON-LD generation. 30+ node types. LodgingBusiness, Room, BreadcrumbList for this project.                                                  |
| **@nuxtjs/sitemap** | ^7.6.x  | Sitemap generation   | Auto-generates sitemap.xml from routes. Integrates with i18n.                                                                                           |
| **@nuxtjs/robots**  | ^5.7.x  | Robots.txt           | Generates robots.txt. Configurable rules per environment.                                                                                               |
| **@nuxtjs/i18n**    | ^10.2.x | Internationalization | German-only for v1.0 but install now for proper route structure. Defer English to v1.1.                                                                 |
| **@nuxt/content**   | ^3.x    | Content management   | SQL-based storage (v3). Markdown/YAML files for room data, page content. Easy editing without CMS.                                                      |
| **@vueuse/nuxt**    | ^14.2.x | Composable utilities | Auto-imported VueUse composables. useIntersectionObserver, useMediaQuery, useScroll, etc.                                                               |

**Confidence:** HIGH for core modules (verified npm versions). MEDIUM for @nuxt/scripts (still beta, API may change).

Sources: npm registry searches, [Nuxt Modules](https://nuxt.com/modules), [Nuxt Image v2](https://nuxt.com/blog/nuxt-image-v2), [Nuxt Fonts providers](https://fonts.nuxt.com/get-started/providers), [@nuxt/scripts](https://scripts.nuxt.com/)

### Dev Tooling

| Tool                            | Version | Purpose                | Why                                                                                                    |
| ------------------------------- | ------- | ---------------------- | ------------------------------------------------------------------------------------------------------ |
| **ESLint**                      | ^9.x    | Linting                | Flat config is default since v9. Required by @nuxt/eslint.                                             |
| **Prettier**                    | ^3.x    | Formatting             | Code formatting. Separated from ESLint concerns.                                                       |
| **prettier-plugin-tailwindcss** | ^0.7.x  | Tailwind class sorting | Official Tailwind plugin. Auto-sorts utility classes. Requires `tailwindStylesheet` option for v4.     |
| **eslint-config-prettier**      | ^10.x   | ESLint/Prettier compat | Disables ESLint rules that conflict with Prettier. Essential when using both tools.                    |
| **pnpm**                        | ^10.x   | Package manager        | Fast, disk-efficient. Note: v10+ requires `pnpm approve-builds` for packages with postinstall scripts. |

**Confidence:** HIGH -- standard tooling, well-documented.

### Font Package

| Package                          | Version | Purpose      | Why                                                                                                                                    |
| -------------------------------- | ------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| **@fontsource-variable/dm-sans** | latest  | DM Sans font | Variable font, single file, self-hosted via npm. @nuxt/fonts resolves from node_modules with `remote: false`. No CDN = GDPR compliant. |

**Confidence:** HIGH -- @fontsource is the standard approach for self-hosted fonts. German court rulings (LG Munchen, Jan 2022) prohibit loading Google Fonts from CDN without consent.

---

## Tailwind CSS v4: CSS-First Configuration

This is the single biggest "gotcha" for developers coming from Tailwind v3. **There is no `tailwind.config.ts` file.** Everything is configured in CSS.

### Installation

```bash
pnpm add tailwindcss @tailwindcss/vite
```

### nuxt.config.ts Integration

```typescript
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-02-21',

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },
})
```

### Main CSS File (`app/assets/css/main.css`)

```css
@import 'tailwindcss';

/* === Design Tokens for Pension Volgenandt === */
@theme {
  /* Color palette - sage green + warm earth tones */
  --color-sage-50: oklch(0.97 0.02 155);
  --color-sage-100: oklch(0.94 0.04 155);
  --color-sage-200: oklch(0.88 0.06 155);
  --color-sage-300: oklch(0.8 0.08 155);
  --color-sage-400: oklch(0.72 0.1 155);
  --color-sage-500: oklch(0.62 0.1 155);
  --color-sage-600: oklch(0.52 0.1 155);
  --color-sage-700: oklch(0.42 0.08 155);
  --color-sage-800: oklch(0.32 0.06 155);
  --color-sage-900: oklch(0.22 0.04 155);

  /* Terracotta CTA color - 4.6:1 contrast on white */
  --color-waldhonig-500: oklch(0.58 0.14 35);
  --color-waldhonig-600: oklch(0.5 0.14 35);
  --color-waldhonig-700: oklch(0.42 0.12 35);

  /* Typography */
  --font-sans: 'DM Sans Variable', ui-sans-serif, system-ui, sans-serif;

  /* Spacing scale (inherits Tailwind defaults, extend as needed) */

  /* Border radius tokens */
  --radius-card: 0.75rem;

  /* Shadows for cards */
  --shadow-card: 0 1px 3px 0 oklch(0 0 0 / 0.1), 0 1px 2px -1px oklch(0 0 0 / 0.1);
}

/* Base styles for the 50-60 age target audience */
@layer base {
  html {
    font-size: 18px; /* Larger base for readability */
  }
}
```

### Key @theme Concepts

| Concept                          | Syntax                        | Example                                                                     |
| -------------------------------- | ----------------------------- | --------------------------------------------------------------------------- |
| Add a token                      | `--namespace-name: value;`    | `--color-sage-500: oklch(...)` creates `bg-sage-500`, `text-sage-500`, etc. |
| Override a default               | `--namespace-name: newvalue;` | `--breakpoint-sm: 30rem;` changes the `sm:` breakpoint                      |
| Remove all defaults in namespace | `--namespace-*: initial;`     | `--color-*: initial;` removes all default colors                            |
| Reference other variables        | `@theme inline { ... }`       | `--font-sans: var(--font-dm-sans);`                                         |
| Define animations                | `@keyframes` inside `@theme`  | See Tailwind docs                                                           |

**Confidence:** HIGH -- verified via [Tailwind CSS theme variables docs](https://tailwindcss.com/docs/theme).

---

## ESLint Flat Config Setup

### Architecture

Two approaches exist. **Use the module approach** (`@nuxt/eslint` in `nuxt.config.ts` modules) for this project because it generates project-aware config automatically.

### Installation

```bash
pnpm add -D @nuxt/eslint eslint eslint-config-prettier prettier prettier-plugin-tailwindcss
```

### nuxt.config.ts

```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    // ... other modules
  ],

  eslint: {
    checker: true, // Shows ESLint errors in dev overlay
  },
})
```

### eslint.config.mjs

```javascript
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    tooling: true, // Enable tooling rules (TypeScript, Vue)
  },
})
  .append({
    // Prettier compatibility - disable conflicting rules
    name: 'prettier-compat',
    rules: {
      // eslint-config-prettier disables these, but be explicit
    },
  })
  .override('nuxt/typescript', {
    rules: {
      // Project-specific TypeScript overrides if needed
    },
  })
```

### How ESLint and Prettier Coexist

The strategy: **ESLint handles code quality rules, Prettier handles formatting.** Do NOT use `features.stylistic` in the ESLint config when using Prettier -- they would conflict.

1. `@nuxt/eslint-config` is "unopinionated" by default -- it only includes rules for TypeScript, Vue, and Nuxt best practices. No formatting rules.
2. `eslint-config-prettier` disables any ESLint rules that would conflict with Prettier.
3. Prettier runs separately (via `prettier --write`) for formatting.
4. `prettier-plugin-tailwindcss` sorts Tailwind classes during Prettier formatting.

### .prettierrc

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

The `tailwindStylesheet` option is **required** for Tailwind v4 -- it tells the Prettier plugin where your Tailwind configuration (the `@theme` block) lives, since there is no `tailwind.config.ts` anymore.

### .prettierignore

```
.nuxt
.output
node_modules
dist
coverage
```

**Confidence:** HIGH -- verified via [Nuxt ESLint blog](https://nuxt.com/blog/eslint-module), [ESLint Nuxt docs](https://eslint.nuxt.com/packages/module).

---

## Nuxt 4 Project Structure

```
pension-volgenandt-website/
  app/                        # Application code (Nuxt 4 convention)
    assets/
      css/
        main.css              # Tailwind @theme + base styles
    components/
      ui/                     # Generic UI components
      sections/               # Page sections (Hero, RoomCard, etc.)
      layout/                 # Header, Footer, Navigation
    composables/              # Custom composables
    content/                  # Nuxt Content markdown/yaml (rooms, pages)
    layouts/
      default.vue
    middleware/
    pages/
      index.vue               # Homepage
      zimmer/
        index.vue             # Room overview
        [slug].vue            # Room detail
      familie.vue
      aktivitaeten.vue
      nachhaltigkeit.vue
      kontakt.vue
      impressum.vue
      datenschutz.vue
      agb.vue
    plugins/
    utils/
    app.vue                   # Root component
    app.config.ts             # App-level config
    error.vue                 # Error page
  server/                     # Server code (API routes if needed)
  public/                     # Static assets (favicon, robots fallback)
    img/                      # Source images for @nuxt/image
  shared/                     # Shared types/utils between app and server
  nuxt.config.ts              # Nuxt configuration
  eslint.config.mjs           # ESLint flat config
  .prettierrc                 # Prettier config
  tsconfig.json               # TypeScript config (Nuxt generates this)
  Makefile                    # Dev commands
  package.json
  pnpm-lock.yaml
```

Key point: In Nuxt 4, the `~` alias points to `app/` (the `srcDir`). So `~/components` resolves to `app/components/`.

**Confidence:** HIGH -- verified via [Nuxt 4 directory structure docs](https://nuxt.com/docs/4.x/directory-structure) and [Nuxt 4 announcement](https://nuxt.com/blog/v4).

---

## Nuxt 4 SSG Configuration

### nuxt.config.ts (Full Example)

```typescript
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-02-21',

  // Static site generation
  ssr: true, // Required for SSG (default)

  // Modules
  modules: [
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/scripts',
    '@nuxt/eslint',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-schema-org',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxtjs/i18n',
  ],

  // CSS
  css: ['~/assets/css/main.css'],

  // Vite plugins (Tailwind v4)
  vite: {
    plugins: [tailwindcss()],
  },

  // Dev tools
  devtools: { enabled: true },

  // ESLint
  eslint: {
    checker: true,
  },

  // Fonts - self-hosted, no CDN
  fonts: {
    families: [{ name: 'DM Sans Variable', provider: 'npm' }],
  },

  // Image optimization
  image: {
    // IPX processes images at build time for SSG
    quality: 80,
    format: ['avif', 'webp'],
  },

  // Sitemap
  site: {
    url: 'https://www.pension-volgenandt.de',
    name: 'Pension Volgenandt',
  },

  // Robots
  robots: {
    // Allow all by default for a public site
  },

  // i18n - German only for v1.0
  i18n: {
    locales: [{ code: 'de', language: 'de-DE' }],
    defaultLocale: 'de',
  },

  // Schema.org
  schemaOrg: {
    identity: {
      type: 'LodgingBusiness',
      name: 'Pension Volgenandt',
      url: 'https://www.pension-volgenandt.de',
      address: {
        streetAddress: 'Otto-Reuter-Strasse 28',
        addressLocality: 'Leinefelde-Worbis OT Breitenbach',
        postalCode: '37327',
        addressCountry: 'DE',
      },
    },
  },

  // Scripts (Beds24 widget)
  scripts: {
    // Configure Beds24 embed script with consent management
  },

  // Nitro (build engine)
  nitro: {
    prerender: {
      // Crawl all routes for SSG
      crawlLinks: true,
      routes: ['/'],
    },
  },
})
```

### Build Command

```bash
npx nuxi generate  # Builds static site to .output/public/
```

The `nuxt generate` command prerenders every discovered route as static HTML. With `crawlLinks: true`, Nitro follows internal links to discover all routes automatically.

**Confidence:** HIGH -- verified via [Nuxt 4 deployment docs](https://nuxt.com/docs/4.x/getting-started/deployment).

---

## @nuxt/fonts: Self-Hosting for GDPR

German courts (LG Munchen I, January 2022) have ruled that loading Google Fonts directly from Google CDN violates GDPR because it transmits the visitor's IP address to Google without consent. Fines of EUR 100+ per violation.

### Solution: @fontsource + @nuxt/fonts npm provider

```bash
pnpm add @fontsource-variable/dm-sans
```

The `@nuxt/fonts` npm provider resolves fonts from `node_modules` with `remote: false` by default -- meaning zero CDN requests. The font files are bundled into the static build.

No `@import url('fonts.googleapis.com/...')` anywhere in the project. No CDN. No GDPR issue.

**Confidence:** HIGH -- verified via [Nuxt Fonts providers docs](https://fonts.nuxt.com/get-started/providers).

---

## @nuxt/image for SSG

When using `nuxt generate`, @nuxt/image:

1. Processes all `<NuxtImg>` and `<NuxtPicture>` components at build time
2. Generates optimized variants (WebP, AVIF) at specified sizes
3. Saves processed images alongside static HTML in `.output/public/`
4. No runtime image processing server needed

### Important: `ssr: true` Required

@nuxt/image **cannot** optimize images during static generation if `ssr: false`. Since we use SSG (which is `ssr: true` by default), this works automatically.

### Usage in Components

```vue
<NuxtImg
  src="/img/pension-front.jpg"
  alt="Pension Volgenandt Vorderansicht"
  width="800"
  height="600"
  format="avif,webp"
  loading="lazy"
  sizes="sm:100vw md:50vw lg:800px"
/>
```

**Confidence:** HIGH -- verified via [Nuxt Image static docs](https://image.nuxt.com/advanced/static-images).

---

## Makefile

```makefile
.PHONY: dev build generate preview lint format typecheck clean install

# Development
dev:
	pnpm exec nuxi dev

# Production build (SSR)
build:
	pnpm exec nuxi build

# Static site generation
generate:
	pnpm exec nuxi generate

# Preview static build locally
preview:
	pnpm exec nuxi preview

# Linting
lint:
	pnpm exec eslint .

lint-fix:
	pnpm exec eslint . --fix

# Formatting
format:
	pnpm exec prettier --write "app/**/*.{vue,ts,js,css,md,json}"

format-check:
	pnpm exec prettier --check "app/**/*.{vue,ts,js,css,md,json}"

# Type checking
typecheck:
	pnpm exec nuxi typecheck

# All checks (CI-friendly)
check: lint format-check typecheck

# Clean build artifacts
clean:
	rm -rf .nuxt .output node_modules/.cache

# Install dependencies
install:
	pnpm install

# Full rebuild
rebuild: clean install generate
```

**Confidence:** HIGH -- standard commands, verified with Nuxt CLI documentation.

---

## Alternatives Considered

| Category          | Recommended                           | Alternative                             | Why Not                                                                                                                                              |
| ----------------- | ------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework version | Nuxt 4.3.x                            | Nuxt 3.21.x                             | Nuxt 3 is EOL (Jan 2026). No security patches. Starting new project on dead version is irresponsible.                                                |
| CSS framework     | Tailwind CSS v4 + `@tailwindcss/vite` | `@nuxtjs/tailwindcss` module            | Module wraps old v3 approach. v4 uses direct Vite plugin. Official Tailwind docs recommend `@tailwindcss/vite`.                                      |
| CSS config        | CSS-first `@theme`                    | `tailwind.config.ts`                    | Config file is Tailwind v3 approach. v4 moved to CSS-first. Config file still works for migration but is legacy.                                     |
| Font loading      | `@nuxt/fonts` + `@fontsource` (npm)   | Google Fonts CDN                        | CDN violates German GDPR rulings. Self-hosting is legally required.                                                                                  |
| Font loading      | `@nuxt/fonts` npm provider            | `@nuxtjs/google-fonts` module           | Same CDN issue. `@nuxt/fonts` with npm provider is the modern replacement.                                                                           |
| ESLint config     | `@nuxt/eslint` (module + flat config) | `.eslintrc.js` (legacy format)          | Legacy format deprecated in ESLint v9. Flat config is the standard.                                                                                  |
| Formatting        | Prettier (separate)                   | ESLint Stylistic (`features.stylistic`) | Prettier is industry standard, has better Vue/HTML formatting, and the Tailwind class sorting plugin. Using ESLint for formatting is a niche choice. |
| Package manager   | pnpm                                  | npm / yarn                              | Faster, disk-efficient, strict dependency resolution. Project requirement.                                                                           |
| Component library | None (custom Tailwind)                | Nuxt UI / Vuetify / PrimeVue            | Overkill for a 10-page pension website. Tailwind utilities + custom components = smaller bundle, full design control.                                |
| CMS               | Nuxt Content (file-based)             | Strapi / Sanity / WordPress             | No external dependency. Owner can edit YAML/MD files. Defer headless CMS to later if visual editing is needed.                                       |
| Deployment        | Netlify or Cloudflare Pages           | Vercel / self-hosted                    | Free tier for static sites. Nuxt SSG = just HTML/CSS/JS files. Any static host works.                                                                |

---

## What NOT to Add (and Why)

| Do Not Add                            | Why Not                                                                                             |
| ------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `@nuxtjs/tailwindcss` module          | Tailwind v4 uses `@tailwindcss/vite` directly. The Nuxt module is for v3.                           |
| `tailwind.config.ts`                  | Tailwind v4 is CSS-first. Use `@theme` in your CSS file.                                            |
| `.eslintrc.js` / `.eslintrc.json`     | Legacy format. Use `eslint.config.mjs` (flat config).                                               |
| `eslint-plugin-prettier`              | Unnecessary. Just use `eslint-config-prettier` to disable conflicts, run Prettier separately.       |
| `@nuxtjs/google-fonts`                | Deprecated approach. Use `@nuxt/fonts` with npm provider.                                           |
| Nuxt UI / Headless UI / Radix         | Component libraries add bundle weight. Custom components with Tailwind are sufficient for 10 pages. |
| `@nuxtjs/color-mode`                  | Not needed unless dark mode is planned. Not in scope for v1.0.                                      |
| Pinia                                 | Not needed for a static content site. `useState` composable covers the minimal state needs.         |
| Vue Router (explicit)                 | Nuxt handles routing via file-based pages. Do not install vue-router separately.                    |
| `postcss` / `autoprefixer` (explicit) | Tailwind v4 handles this internally via the Vite plugin. No separate PostCSS config needed.         |

---

## Installation Commands

```bash
# Initialize Nuxt 4 project
pnpm create nuxt pension-volgenandt-website

# Core dependencies
pnpm add tailwindcss @tailwindcss/vite

# Font package (self-hosted)
pnpm add @fontsource-variable/dm-sans

# Nuxt modules
pnpm add @nuxt/image @nuxt/fonts @nuxt/scripts @nuxt/content @vueuse/nuxt
pnpm add nuxt-schema-org @nuxtjs/sitemap @nuxtjs/robots @nuxtjs/i18n

# Dev dependencies
pnpm add -D @nuxt/eslint eslint eslint-config-prettier prettier prettier-plugin-tailwindcss
```

Note: Since the project already has a git repo, we will initialize Nuxt inside the existing directory rather than creating a new one.

---

## Version Summary Table

| Package                      | Version | Confidence | Verification                                                                                                                            |
| ---------------------------- | ------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| nuxt                         | ^4.3.1  | HIGH       | [GitHub releases](https://github.com/nuxt/nuxt/releases), [EOL dates](https://endoflife.date/nuxt)                                      |
| tailwindcss                  | ^4.1.x  | HIGH       | [Tailwind releases](https://github.com/tailwindlabs/tailwindcss/releases), [Official blog](https://tailwindcss.com/blog/tailwindcss-v4) |
| @tailwindcss/vite            | ^4.1.x  | HIGH       | [Official Nuxt guide](https://tailwindcss.com/docs/installation/framework-guides/nuxt)                                                  |
| @nuxt/image                  | ^2.0.0  | HIGH       | [npm](https://www.npmjs.com/package/@nuxt/image), [Nuxt Image v2 blog](https://nuxt.com/blog/nuxt-image-v2)                             |
| @nuxt/fonts                  | ^0.12.x | HIGH       | [npm](https://www.npmjs.com/package/@nuxt/fonts), [Nuxt Fonts docs](https://fonts.nuxt.com/)                                            |
| @nuxt/scripts                | ^0.13.x | MEDIUM     | [npm](https://www.npmjs.com/package/@nuxt/scripts) -- still in beta                                                                     |
| @nuxt/eslint                 | ^1.15.x | HIGH       | [npm](https://www.npmjs.com/package/@nuxt/eslint), [ESLint Nuxt docs](https://eslint.nuxt.com/)                                         |
| @nuxt/content                | ^3.x    | HIGH       | [Nuxt Content v3 blog](https://content.nuxt.com/blog/v3)                                                                                |
| nuxt-schema-org              | ^5.0.x  | HIGH       | [npm](https://www.npmjs.com/package/nuxt-schema-org), [Nuxt SEO docs](https://nuxtseo.com/)                                             |
| @nuxtjs/sitemap              | ^7.6.x  | HIGH       | [npm](https://www.npmjs.com/package/@nuxtjs/sitemap)                                                                                    |
| @nuxtjs/robots               | ^5.7.x  | HIGH       | [npm](https://www.npmjs.com/package/@nuxtjs/robots)                                                                                     |
| @nuxtjs/i18n                 | ^10.2.x | HIGH       | [npm](https://www.npmjs.com/package/@nuxtjs/i18n), [i18n docs](https://i18n.nuxtjs.org/)                                                |
| @vueuse/nuxt                 | ^14.2.x | HIGH       | [npm](https://www.npmjs.com/package/@vueuse/nuxt)                                                                                       |
| eslint                       | ^9.x    | HIGH       | Standard tooling                                                                                                                        |
| prettier                     | ^3.x    | HIGH       | Standard tooling                                                                                                                        |
| prettier-plugin-tailwindcss  | ^0.7.x  | HIGH       | [npm](https://www.npmjs.com/package/prettier-plugin-tailwindcss)                                                                        |
| eslint-config-prettier       | ^10.x   | HIGH       | Standard tooling                                                                                                                        |
| @fontsource-variable/dm-sans | latest  | HIGH       | [Fontsource](https://fontsource.org/)                                                                                                   |
| pnpm                         | ^10.x   | HIGH       | Standard tooling                                                                                                                        |

---

## Gotchas and Breaking Changes

### Nuxt 4 Gotchas

1. **app/ directory is default** -- If you put `pages/` in the project root, Nuxt 4 auto-detects the old structure but the new convention is `app/pages/`. Use the new structure for a new project.

2. **`compatibilityDate` is important** -- Set it to today's date. It controls behavior of Nitro, @nuxt/image, and other modules. Changing it later can alter behavior.

3. **Shallow reactivity model** -- Nuxt 4 uses shallow reactivity by default for `useAsyncData`/`useFetch`. Deep nested reactive objects need explicit handling. For this static site, this is unlikely to matter.

4. **pnpm v10 `approve-builds`** -- Some packages with native binaries (better-sqlite3, sharp) require `pnpm approve-builds` to allow postinstall scripts. @nuxt/image uses sharp internally.

### Tailwind v4 Gotchas

1. **No tailwind.config.ts** -- Everything in CSS. If you create a config file out of habit, it will be ignored.

2. **`@import "tailwindcss"` not `@tailwind base/components/utilities`** -- The old three-directive approach is gone. Single import.

3. **`@theme` not `theme.extend`** -- Adding colors is `--color-sage-500: value` in a `@theme` block, not `extend.colors.sage[500]` in a JS config.

4. **`prettier-plugin-tailwindcss` needs `tailwindStylesheet`** -- In Prettier config, you must point to your CSS file containing the `@theme` block. Without this, class sorting may not work correctly with custom utilities.

5. **No PostCSS config needed** -- `@tailwindcss/vite` handles everything. Do not create `postcss.config.js`.

### ESLint Gotchas

1. **`eslint.config.mjs` not `.eslintrc`** -- Flat config is the only format for ESLint v9+. Legacy format will not be found.

2. **Do NOT use `features.stylistic` with Prettier** -- They conflict. Either use ESLint Stylistic (no Prettier) OR Prettier (no stylistic). We chose Prettier.

3. **@nuxt/eslint generates `.nuxt/eslint.config.mjs`** -- This is a project-aware config. Your `eslint.config.mjs` at root extends from it via the module.

---

## Sources

### Primary (HIGH confidence)

- [Nuxt 4.0 Announcement](https://nuxt.com/blog/v4)
- [Nuxt GitHub Releases](https://github.com/nuxt/nuxt/releases)
- [Tailwind CSS v4 Announcement](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind CSS v4 Nuxt Installation Guide](https://tailwindcss.com/docs/installation/framework-guides/nuxt)
- [Tailwind CSS Theme Variables Documentation](https://tailwindcss.com/docs/theme)
- [Nuxt ESLint Blog Post](https://nuxt.com/blog/eslint-module)
- [Nuxt ESLint Module Documentation](https://eslint.nuxt.com/packages/module)
- [Nuxt ESLint Config Documentation](https://eslint.nuxt.com/packages/config)
- [Nuxt Fonts Providers](https://fonts.nuxt.com/get-started/providers)
- [Nuxt Image Static Images](https://image.nuxt.com/advanced/static-images)
- [Nuxt 4 Deployment](https://nuxt.com/docs/4.x/getting-started/deployment)
- [Nuxt 4 Directory Structure](https://nuxt.com/docs/4.x/directory-structure)

### Secondary (MEDIUM confidence)

- [Nuxt EOL Dates](https://endoflife.date/nuxt)
- [Mastering Nuxt: Installing Tailwind v4](https://masteringnuxt.com/blog/installing-tailwind-css-v4-on-nuxt-3)
- [prettier-plugin-tailwindcss GitHub](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
- [Nuxt Scripts](https://scripts.nuxt.com/)

### npm Registry (version verification)

- All package versions verified via npm search results dated February 2026
