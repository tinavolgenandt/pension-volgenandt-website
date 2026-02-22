---
phase: 01-foundation-legal-compliance
plan: 01
subsystem: infra
tags: [nuxt4, tailwindcss-v4, typescript, eslint, prettier, pnpm, design-tokens, fontsource]

# Dependency graph
requires: []
provides:
  - 'Nuxt 4.3.1 project scaffold with working dev server, build pipeline, and type checking'
  - 'Tailwind CSS v4 design token system: sage green (11 shades), waldhonig CTA (10 shades), charcoal, cream/warm-white'
  - 'Self-hosted variable fonts: Lora Variable (serif headings) + DM Sans Variable (sans body)'
  - 'ESLint flat config, Prettier with Tailwind class sorting, TypeScript strict mode'
  - 'Makefile with 9 commands: dev, build, preview, generate, lint, lint-fix, format, typecheck, clean'
  - 'app.config.ts with contact details, legal placeholders, and navigation items'
affects:
  - '01-02 (layout components use design tokens and app config)'
  - '01-03 (legal pages use layout and design system)'
  - 'All subsequent phases (build pipeline, design tokens, fonts)'

# Tech tracking
tech-stack:
  added:
    - 'nuxt@4.3.1'
    - 'tailwindcss@4.2.0 + @tailwindcss/vite@4.2.0'
    - '@fontsource-variable/lora@5.2.8'
    - '@fontsource-variable/dm-sans@5.2.8'
    - '@nuxt/fonts@0.14.0'
    - '@nuxt/image@2.0.0'
    - '@nuxt/eslint@1.15.1'
    - '@vueuse/nuxt@14.2.1'
    - 'prettier@3.8.1 + prettier-plugin-tailwindcss@0.7.2'
    - 'typescript@5.9.3 + vue-tsc@3.2.5'
  patterns:
    - 'CSS-first Tailwind v4 @theme design tokens (no tailwind.config.js)'
    - 'Vite plugin integration for Tailwind (not @nuxtjs/tailwindcss module)'
    - 'app/ directory structure (Nuxt 4 convention)'
    - 'Makefile-driven build commands'

key-files:
  created:
    - 'nuxt.config.ts'
    - 'app/assets/css/main.css'
    - 'app/app.vue'
    - 'app/app.config.ts'
    - 'app/pages/index.vue'
    - 'eslint.config.mjs'
    - '.prettierrc'
    - 'Makefile'
    - '.npmrc'
  modified:
    - '.gitignore'
    - 'package.json'

key-decisions:
  - 'Used node-linker=hoisted in .npmrc to resolve oxc-* native binding installation issue on Windows'
  - 'Cast tailwindcss() as any in nuxt.config.ts to work around Vite plugin type mismatch between @tailwindcss/vite and Nuxt 4'
  - 'Removed prerender routes from nuxt.config.ts (legal pages dont exist yet, will be added in Plan 01-03)'
  - 'Used lint-fix (hyphen) instead of lint:fix (colon) in Makefile for cross-platform compatibility'
  - 'Added charcoal palette (800/900/950) for dark header/footer warm frame effect per CONTEXT'

patterns-established:
  - 'CSS-first design tokens: all palettes, fonts, radii, breakpoints defined in @theme block in main.css'
  - 'oklch color space: all custom colors use oklch for perceptual uniformity'
  - 'Base typography: 18px body, 1.7 line-height, Lora serif headings, DM Sans sans body'
  - 'Tailwind v4 plugin: use @tailwindcss/vite with any cast, never @nuxtjs/tailwindcss'

# Metrics
duration: 25min
completed: 2026-02-22
---

# Phase 1 Plan 1: Project Scaffolding Summary

**Nuxt 4.3.1 scaffold with Tailwind v4 CSS-first design tokens (sage/waldhonig/charcoal oklch palettes), self-hosted Lora + DM Sans variable fonts, and zero-error toolchain (ESLint, Prettier, TypeScript strict, Makefile)**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-02-21T23:30:35Z
- **Completed:** 2026-02-22T00:00:00Z
- **Tasks:** 2
- **Files modified:** 17

## Accomplishments

- Nuxt 4.3.1 project scaffolded with all dependencies resolving cleanly
- Tailwind v4 design token system with 3 custom palettes (sage, waldhonig, charcoal) and warm backgrounds
- Self-hosted variable fonts (Lora + DM Sans) via @fontsource-variable packages -- zero CDN requests
- Full toolchain: ESLint (0 errors), Prettier (Tailwind class sorting), TypeScript strict (0 errors)
- Makefile with 9 build commands all working
- Dev server starts on localhost:3000; build produces .output/public/

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Nuxt 4 project and install all dependencies** - `2fcf6e5` (feat)
2. **Task 2: Configure design tokens, tooling, and app config** - `fdd19ce` (feat)

## Files Created/Modified

- `package.json` - All dependencies declared (nuxt 4.3.1, tailwindcss 4.2, fonts, modules, tooling)
- `nuxt.config.ts` - Nuxt 4 config with Tailwind vite plugin, modules, TypeScript strict, image optimization
- `app/assets/css/main.css` - Tailwind v4 @theme design tokens (sage, waldhonig, charcoal, fonts, radii, breakpoints)
- `app/app.vue` - Root component with NuxtLayout + NuxtPage
- `app/app.config.ts` - Runtime config with contact details, legal placeholders, nav items
- `app/pages/index.vue` - Placeholder homepage using design token classes
- `eslint.config.mjs` - ESLint flat config via @nuxt/eslint withNuxt()
- `.prettierrc` - Prettier config with tailwindcss plugin and tailwindStylesheet for v4
- `Makefile` - 9 build commands: dev, build, preview, generate, lint, lint-fix, format, typecheck, clean
- `tsconfig.json` - TypeScript config referencing .nuxt/ generated configs
- `.gitignore` - Updated with Nuxt, environment, IDE, and OS ignores
- `.npmrc` - node-linker=hoisted for oxc-\* native binding resolution
- `public/favicon.ico` - Default favicon from nuxi init
- `public/robots.txt` - Default robots.txt from nuxi init
- `public/img/` - 8 images copied from static/img/ (Nuxt 4 convention)

## Decisions Made

- **node-linker=hoisted:** Required to fix oxc-parser/oxc-transform/oxc-minify native binding resolution failure on Windows with pnpm. The default symlinked layout prevents Nuxt 4's transitive dependencies from finding platform-specific native bindings.
- **tailwindcss() as any:** The @tailwindcss/vite plugin returns types from a different Vite version than what Nuxt 4 expects (rollup type mismatch in hotUpdate). Cast to any is the standard workaround. Does not affect runtime behavior.
- **Deferred prerender routes:** Removed `/impressum`, `/datenschutz`, `/agb` from nitro.prerender.routes because those pages will be created in Plan 01-03. Build was failing with 404 errors on prerender. Set `failOnError: false` instead.
- **lint-fix vs lint:fix:** Used hyphen in Makefile target name because colons require escaping in Make and are fragile on Windows.
- **Added charcoal palette:** The plan's @theme block only had sage and waldhonig. Added charcoal-800/900/950 for the dark header/footer "warm frame" effect described in CONTEXT.md.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] oxc-\* native binding resolution on Windows**

- **Found during:** Task 1 (pnpm install / nuxi prepare)
- **Issue:** pnpm with default symlinked node_modules failed to install optional platform-specific native bindings for oxc-parser, oxc-transform, and oxc-minify (transitive deps of Nuxt 4.3.1)
- **Fix:** Added `.npmrc` with `node-linker=hoisted` and explicitly installed `@oxc-parser/binding-win32-x64-msvc`, `@oxc-transform/binding-win32-x64-msvc`, `@oxc-minify/binding-win32-x64-msvc`
- **Files modified:** .npmrc, package.json
- **Verification:** `pnpm nuxi prepare` succeeds
- **Committed in:** 2fcf6e5 (Task 1 commit)

**2. [Rule 1 - Bug] Vite plugin type mismatch in nuxt.config.ts**

- **Found during:** Task 2 (make typecheck)
- **Issue:** `tailwindcss()` plugin returns types incompatible with Nuxt's expected Vite PluginOption type (rollup MinimalPluginContext mismatch)
- **Fix:** Cast to `any` with eslint-disable comment
- **Files modified:** nuxt.config.ts
- **Verification:** `make typecheck` passes with 0 errors
- **Committed in:** fdd19ce (Task 2 commit)

**3. [Rule 3 - Blocking] Prerender routes for non-existent pages**

- **Found during:** Task 2 (make build)
- **Issue:** `nitro.prerender.routes` included `/impressum`, `/datenschutz`, `/agb` but those pages don't exist until Plan 01-03, causing build failure
- **Fix:** Replaced explicit routes with `failOnError: false`; routes will be re-added in Plan 01-03
- **Files modified:** nuxt.config.ts
- **Verification:** `make build` completes successfully
- **Committed in:** fdd19ce (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (1 bug, 2 blocking)
**Impact on plan:** All auto-fixes necessary for the toolchain to function on Windows. No scope creep.

## Issues Encountered

- **nuxi init interactive prompts:** The `nuxi init` command required `--template minimal` and `--gitInit false` flags to avoid interactive prompts in the CI/automation environment. Resolved by providing all options via command-line flags.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Build pipeline complete and verified (dev, build, lint, format, typecheck all pass)
- Design token system ready for component development (sage-_, waldhonig-_, charcoal-\*, cream, warm-white, font-serif, font-sans)
- app.config.ts ready with contact details and nav items for header/footer components (Plan 01-02)
- Legal page placeholders in owner-facing fields need filling before launch (not blocking for development)

---

_Phase: 01-foundation-legal-compliance_
_Completed: 2026-02-22_
