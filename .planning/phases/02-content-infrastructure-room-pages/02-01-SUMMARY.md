---
phase: 02-content-infrastructure-room-pages
plan: 01
subsystem: content
tags: [nuxt-content, zod, yaml, lucide, icons, rooms, data-collection]

# Dependency graph
requires:
  - phase: 01-foundation-legal-compliance
    provides: Nuxt 4 project with Tailwind, TypeScript, and base modules
provides:
  - Rooms data collection with Zod schema validation (content.config.ts)
  - 7 room YAML data files with pricing, amenities, gallery placeholders
  - Amenity-to-icon/label mapping utility (amenityMap)
  - @nuxt/icon module configured with Lucide icon set
  - SSG prerender routes for all room pages
affects:
  - 02-02 (room overview page uses queryCollection('rooms'))
  - 02-03 (room detail page uses room YAML data for gallery, pricing, amenities)
  - 03-homepage-hero (homepage room previews query featured rooms)
  - 05-booking-integration (beds24PropertyId and beds24RoomId fields)

# Tech tracking
tech-stack:
  added: ["@nuxt/content@3.11.2", "@nuxt/icon@2.2.1", "@iconify-json/lucide@1.2.92", "focus-trap@8.0.0"]
  patterns: ["Nuxt Content v3 data collection with Zod schema", "YAML-driven room data with type-safe queries", "Amenity enum mapped to Lucide icons and German labels"]

key-files:
  created:
    - content.config.ts
    - app/utils/amenities.ts
    - content/rooms/emils-kuhwiese.yml
    - content/rooms/schoene-aussicht.yml
    - content/rooms/balkonzimmer.yml
    - content/rooms/rosengarten.yml
    - content/rooms/wohlfuehl-appartement.yml
    - content/rooms/doppelzimmer.yml
    - content/rooms/einzelzimmer.yml
  modified:
    - nuxt.config.ts
    - package.json
    - .gitignore

key-decisions:
  - "Installed @nuxt/content (missing from Phase 1 despite plan assumption)"
  - "Used prebuild-install to get better-sqlite3 native binary on Windows (no build tools available)"
  - "Added .data/ to .gitignore for Nuxt Content SQLite dev database"
  - "Single Standardpreis pricing period per room (owner adds seasonal periods later)"

patterns-established:
  - "Room data as YAML in content/rooms/*.yml with Zod validation at build time"
  - "amenityMap utility maps enum values to Lucide icon names and German labels"
  - "Explicit SSG prerender routes as safety net alongside crawlLinks"

# Metrics
duration: 20min
completed: 2026-02-22
---

# Phase 2 Plan 01: Content Infrastructure Summary

**Nuxt Content v3 rooms data collection with Zod schema, 7 room YAML files, amenity icon mapping, and Lucide icon module**

## Performance

- **Duration:** 20 min
- **Started:** 2026-02-22T00:11:28Z
- **Completed:** 2026-02-22T00:31:54Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments

- Rooms data collection defined in content.config.ts with complete Zod schema (identity, pricing, media, amenities, extras, display fields)
- 7 room YAML files created with realistic placeholder data, proper German text with umlauts, and Beds24 property/room IDs
- Amenity utility maps 16 amenity types to Lucide icon names and German labels
- @nuxt/icon configured with local server bundle for SSG and Lucide collection auto-discovered
- SSG prerender routes added for /zimmer/ and all 7 room detail pages
- Dev server confirms: "Processed 2 collections and 7 files" with zero validation errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Phase 2 dependencies and configure modules** - `cbe9bfa` (feat)
   - Note: nuxt.config.ts changes were lost due to concurrent commit race from parallel Phase 01-03 execution; re-applied in Task 2
2. **Task 2: Create content collection schema, amenity utility, and room YAML data** - `192b9e5` (feat)

## Files Created/Modified

- `content.config.ts` - Rooms data collection with Zod schema (amenity enum, pricing periods, extras, room schema)
- `app/utils/amenities.ts` - AmenityInfo interface and amenityMap (16 entries mapping to Lucide icons and German labels)
- `content/rooms/emils-kuhwiese.yml` - Ferienwohnung, 45m2, 4 guests, beds24PropertyId 257613, sortOrder 1, featured
- `content/rooms/schoene-aussicht.yml` - Ferienwohnung, 40m2, 3 guests, beds24PropertyId 257610, sortOrder 2, featured
- `content/rooms/wohlfuehl-appartement.yml` - Ferienwohnung, 50m2, 4 guests, beds24PropertyId 261258, sortOrder 3, featured
- `content/rooms/balkonzimmer.yml` - Doppelzimmer with balkon amenity, 25m2, 2 guests, sortOrder 4
- `content/rooms/rosengarten.yml` - Doppelzimmer, 22m2, 2 guests, sortOrder 5
- `content/rooms/doppelzimmer.yml` - Doppelzimmer, 20m2, 2 guests, sortOrder 6
- `content/rooms/einzelzimmer.yml` - Einzelzimmer, 15m2, 1 guest, sortOrder 7
- `nuxt.config.ts` - Added @nuxt/content and @nuxt/icon to modules, icon serverBundle, prerender routes
- `package.json` - Added @nuxt/content, @nuxt/icon, @iconify-json/lucide, focus-trap
- `.gitignore` - Added .data/ for Nuxt Content SQLite dev database

## Decisions Made

- **Installed @nuxt/content as production dependency:** Plan assumed it was installed in Phase 1, but it was not. Required for content collections to work. (Rule 3 - Blocking)
- **Used prebuild-install for better-sqlite3:** Windows environment lacks native build tools (node-gyp). The `prebuild-install` command downloaded prebuilt binaries for win32-x64 successfully.
- **Single "Standardpreis" pricing period:** Each room starts with one pricing period. Owner adds seasonal periods (Hauptsaison/Nebensaison) later by adding entries to the YAML pricing array.
- **beds24RoomId assigned sequentially for Pension Volgenandt property:** Rooms 1-5 within property 261258 assigned as placeholder IDs; exact Beds24 room IDs need confirmation from owner.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed missing @nuxt/content dependency**

- **Found during:** Task 1 (dependency installation)
- **Issue:** Plan said "Do NOT install @nuxt/content -- already installed from Phase 1" but it was not present in package.json or node_modules
- **Fix:** Added `pnpm add @nuxt/content` to the install command
- **Files modified:** package.json, pnpm-lock.yaml
- **Verification:** `pnpm ls @nuxt/content` shows 3.11.2 installed
- **Committed in:** 192b9e5 (Task 2 commit, since Task 1 nuxt.config changes were lost)

**2. [Rule 3 - Blocking] Resolved better-sqlite3 native binding failure on Windows**

- **Found during:** Task 2 (dev server startup)
- **Issue:** `better-sqlite3` requires native bindings that were not compiled during pnpm install (no node-gyp/build tools on this Windows system)
- **Fix:** Ran `npx prebuild-install` inside the better-sqlite3 package directory to download prebuilt binaries for win32-x64
- **Files modified:** node_modules/better-sqlite3/build/Release/better_sqlite3.node (not committed)
- **Verification:** `pnpm dev` starts successfully with "Processed 2 collections and 7 files"
- **Committed in:** N/A (node_modules not tracked)

**3. [Rule 3 - Blocking] Re-applied nuxt.config.ts module changes after concurrent commit race**

- **Found during:** Task 2 (file verification)
- **Issue:** Task 1 committed nuxt.config.ts, but a concurrent Phase 01-03 execution also committed the file, overwriting the module additions
- **Fix:** Re-applied @nuxt/content and @nuxt/icon to modules array, icon config, and prerender routes in Task 2
- **Files modified:** nuxt.config.ts
- **Verification:** `npx nuxi typecheck` passes, dev server starts with content and icon modules active
- **Committed in:** 192b9e5

**4. [Rule 1 - Bug] Fixed YAML files with unicode escape sequences instead of UTF-8 characters**

- **Found during:** Task 2 (YAML file creation)
- **Issue:** Write tool produced literal `\u00fc` text in YAML files instead of actual UTF-8 characters. YAML block scalars (`>-`) do not process unicode escapes, so umlauts would display as literal `\u00fc` strings.
- **Fix:** Rewrote all YAML files using Node.js `fs.writeFileSync()` which correctly interprets JS unicode escapes and writes UTF-8 bytes
- **Files modified:** All 7 content/rooms/\*.yml files
- **Verification:** Read tool confirms proper umlauts in all files
- **Committed in:** 192b9e5

**5. [Rule 2 - Missing Critical] Added .data/ to .gitignore**

- **Found during:** Task 2 (pre-commit status check)
- **Issue:** Nuxt Content creates a `.data/` directory with SQLite database during dev server; would be committed accidentally
- **Fix:** Added `.data/` to .gitignore
- **Files modified:** .gitignore
- **Verification:** `git status` no longer shows .data/ as untracked
- **Committed in:** 192b9e5

---

**Total deviations:** 5 auto-fixed (1 bug, 1 missing critical, 3 blocking)
**Impact on plan:** All auto-fixes necessary for correct operation on Windows. No scope creep. The @nuxt/content omission from Phase 1 was the primary surprise; the better-sqlite3 native binding issue is a known Windows development environment challenge.

## Issues Encountered

- Concurrent execution of Phase 01-03 and Phase 02-01 caused a commit race on nuxt.config.ts, requiring re-application of changes in Task 2
- The better-sqlite3 native module required manual prebuild-install; future `pnpm install` on this machine may need the same step (the prebuilt binary lives in node_modules, not in git)

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Content infrastructure is ready for Plan 02-02 (room overview page) and Plan 02-03 (room detail page)
- `queryCollection('rooms').order('sortOrder', 'ASC').all()` will return all 7 rooms
- Amenity mapping utility is auto-imported by Nuxt from app/utils/
- Room hero images and gallery images reference placeholder paths (/img/rooms/\*.jpg) -- actual photos needed before production
- beds24RoomId values are placeholder assignments; confirm with owner before Phase 5 booking integration
- Note: After `pnpm install` on a fresh clone, `npx prebuild-install` may be needed in node_modules/better-sqlite3/ on Windows systems without build tools

---

_Phase: 02-content-infrastructure-room-pages_
_Completed: 2026-02-22_
