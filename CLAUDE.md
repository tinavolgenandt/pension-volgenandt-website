# Pension Volgenandt Website

Nuxt 4 website for a family-run guesthouse in Eichsfeld, Thuringia. German is the primary language with partial English support.

## Tech Stack

- **Framework:** Nuxt 4 (Vue 3, TypeScript)
- **Styling:** Tailwind CSS 4 (via @tailwindcss/vite)
- **Content:** @nuxt/content 3 (YAML collections in `content/`)
- **Booking:** Beds24 v2 API integration
- **Hosting:** IONOS (static generation via `nuxt generate`)
- **Package manager:** pnpm

## Project Structure

```
app/              # Nuxt app directory (components, pages, composables, utils)
content/          # YAML content collections (rooms, attractions, news, picknick, FAQ)
content/rooms-en/ # English room translations
public/img/       # Optimized production images (WebP)
scripts/          # CI/automation scripts (collect-stats.mjs)
.planning/        # Local dev docs, research, planning (GITIGNORED)
.archive/         # Archived utility scripts (GITIGNORED)
```

## Rules

### File Hygiene — STRICT

1. **NEVER place screenshots, PNGs, JPGs, or any image files in the project root directory.** The root `.gitignore` blocks `*.png`, `*.jpg`, `*.jpeg`, `*.heic` etc. at the root level. If you need to save a screenshot or reference image, place it in `.planning/screenshots/` (which is gitignored).

2. **NEVER commit unprocessed/raw images** (HEIC, large JPGs, WhatsApp exports) to git. Source images belong in `public/img/source-uploads/` (gitignored, local only). Only optimized WebP files go in `public/img/`.

3. **NEVER commit planning docs, research notes, or development documentation to git.** All planning and research files go in `.planning/` (gitignored). The only committed markdown files should be `README.md` and `CLAUDE.md`.

4. **NEVER commit sync scripts, one-off utility scripts, or result files to the project root.** Utility scripts go in `.archive/scripts/` (gitignored). Only scripts used by CI (`scripts/collect-stats.mjs`) are committed.

5. **NEVER commit `.playwright-mcp/` artifacts, `.output/`, `.nuxt/`, or build cache files.**

### Before Every Commit

- Run `npx eslint .` — must pass with 0 errors
- Run `npx prettier --check "app/**/*.{vue,ts,js}" "content/**/*.{yml,yaml}" "nuxt.config.ts" "content.config.ts"` — must pass
- Run `npx nuxi typecheck` — must pass
- Check `git status` for accidentally staged screenshots, temp files, or planning docs

### Code Style

- Prettier + prettier-plugin-tailwindcss for formatting
- ESLint via @nuxt/eslint
- Vue attributes order: `class` before event handlers (`@click`, `@submit`, etc.)
- No unused variables (prefix with `_` if intentionally unused)
- German UI text in components, English translations in `app/utils/translations.ts`

### Image Optimization — STRICT

1. **ALL production images must be WebP format.** No JPG/JPEG/PNG in `public/img/` except legacy PNGs that cannot be converted (e.g., map markers). Target max file sizes:
   - Hero/banner images (1920px max): 150-300 KB
   - Content images (1200px max): 80-150 KB
   - Gallery images (1600px max): 100-200 KB
   - Thumbnails (600px max): 25-50 KB

2. **Run the image optimizer before committing new images:**
   ```bash
   node scripts/optimize-images.mjs --delete-originals
   ```
   This converts JPGs to WebP (quality 80, max 1920px), re-optimizes oversized WebPs (>500KB), and deletes original JPGs.

3. **NEVER reference `.jpg` or `.jpeg` in Vue components or YAML content files.** All image paths must use `.webp` extension.

4. **New source images** go in `public/img/source-uploads/` (gitignored). After optimization, only the WebP output in `public/img/` is committed.

5. **Image provider:** The custom `static` provider in `app/providers/static.ts` is a pass-through — it does NOT optimize. All optimization must happen before build time via the script above.

### Content

- Room data lives in `content/rooms/*.yml` (German) and `content/rooms-en/*.yml` (English)
- Content schema defined in `content.config.ts`
- Images referenced in content YAML must exist as optimized WebP in `public/img/`

### Deployment

- Static site generated with `nuxt generate`
- Hosted on IONOS — deploy by pushing to `main`
- `scripts/collect-stats.mjs` runs monthly via GitHub Actions (do not remove)
- `scripts/optimize-images.mjs` — run manually before committing new images (not in CI)
