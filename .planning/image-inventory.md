# Image Inventory - Pension Volgenandt

**Date:** 2026-02-21
**Format:** JPEG (mozjpeg, quality 88)
**EXIF:** Stripped (GPS coordinates removed for privacy)
**Location:** `static/img/`

---

## Naming Schema

Pattern: `[category]-[subject]-[descriptor]-[season].jpg`

- **All lowercase**, kebab-case, no spaces, no umlauts (`ae` not `ä`)
- Categories: `hero-`, `garten-`, `landschaft-`, `gebaeude-`
- SEO-friendly: Google reads hyphens as word separators

---

## Image Catalog

### Hero Images (2400px wide - full-bleed use)

| Filename                           | Dimensions | Size  | Description                                                                                                  | Use                               |
| ---------------------------------- | ---------- | ----- | ------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| `hero-pension-einfahrt-sommer.jpg` | 2400x1800  | 1.4MB | Front approach: pension building with cobblestone driveway, flower garden borders, tall conifers, summer sky | **Primary hero image (homepage)** |
| `hero-pension-gebaeude-garten.jpg` | 2400x1800  | 1.4MB | Wider angle: pension building from driveway with garden beds, lawn, and mature trees                         | Secondary hero / about page       |

### Landscape / Mood (1800px wide)

| Filename                                   | Dimensions | Size  | Description                                                                                             | Use                                        |
| ------------------------------------------ | ---------- | ----- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `landschaft-aussicht-felder-fruehling.jpg` | 1800x1192  | 484KB | Elevated view from building: garden with pond, birch trees, green fields stretching to horizon (spring) | Umgebung/activities page, section divider  |
| `landschaft-wiese-sonnenuntergang.jpg`     | 1800x1350  | 595KB | Golden hour meadow: wild grass in foreground, tree silhouettes against sunset sky (summer evening)      | Mood image, about page, section background |
| `landschaft-winterzauber-schnee.jpg`       | 1800x1201  | 577KB | Winter scene: snow-covered garden and fields, sunny day, bare trees with long shadows                   | Seasonal section, winter activities        |

### Garden (1800px wide)

| Filename                           | Dimensions | Size  | Description                                                                                   | Use                    |
| ---------------------------------- | ---------- | ----- | --------------------------------------------------------------------------------------------- | ---------------------- |
| `garten-rasen-baeume-sommer.jpg`   | 1800x1350  | 687KB | Manicured lawn with ornamental trees, tall cypress/conifer centerpiece, flower beds, blue sky | Garden/grounds section |
| `garten-teich-seerosen-blumen.jpg` | 1800x1350  | 544KB | Garden pond with water lilies, purple loosestrife (Blutweiderich) flowers, lush vegetation    | Garden detail, gallery |

### Building / Entrance (1800px wide)

| Filename                                | Dimensions | Size  | Description                                                                                             | Use                               |
| --------------------------------------- | ---------- | ----- | ------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `gebaeude-eingang-parkplatz-schild.jpg` | 1800x2400  | 1.4MB | "Gäste Pension" parking sign among lush greenery, yellow shrubs, garden path (**portrait orientation**) | Anfahrt/contact page, mobile hero |

---

## Statistics

| Metric      | Original               | Optimized                       |
| ----------- | ---------------------- | ------------------------------- |
| Total files | 8 (3 HEIC, 5 JPEG)     | 8 JPEG                          |
| Total size  | ~30 MB                 | ~7.1 MB                         |
| Reduction   | --                     | **76%**                         |
| Max width   | 4496px                 | 2400px (hero) / 1800px (others) |
| EXIF/GPS    | Present (privacy risk) | Stripped                        |
| Format      | Mixed HEIC/JPEG        | Unified JPEG (mozjpeg)          |

---

## Processing Applied

1. **HEIC -> JPEG conversion** via `heic-convert` (3 files)
2. **Auto-rotation** based on EXIF orientation tag
3. **Resize** to max 2400px (hero) or 1800px (other) maintaining aspect ratio
4. **mozjpeg compression** at quality 88 (optimal quality/size balance)
5. **EXIF stripping** including GPS coordinates (privacy)
6. **Descriptive renaming** with kebab-case SEO-friendly names

---

## Future: @nuxt/image Pipeline

These JPEG source files are optimized for the `@nuxt/image` pipeline:

- `@nuxt/image` will generate **WebP** and **AVIF** variants at build time
- Responsive `srcset` breakpoints: 375, 640, 768, 1024, 1280, 1920px
- Final served sizes will be ~50-70% smaller than these source JPEGs
- Source files stay in the repo; generated variants are build artifacts

When the Nuxt 3 project is initialized, move these to:

```
app/assets/images/
├── hero/
│   ├── hero-pension-einfahrt-sommer.jpg
│   └── hero-pension-gebaeude-garten.jpg
├── landscape/
│   ├── landschaft-aussicht-felder-fruehling.jpg
│   ├── landschaft-wiese-sonnenuntergang.jpg
│   └── landschaft-winterzauber-schnee.jpg
├── garden/
│   ├── garten-rasen-baeume-sommer.jpg
│   └── garten-teich-seerosen-blumen.jpg
└── building/
    └── gebaeude-eingang-parkplatz-schild.jpg
```

---

## Missing Images (To Be Sourced)

Based on the redesign proposal, the following images are still needed:

| Category                                      | Needed                       | Priority |
| --------------------------------------------- | ---------------------------- | -------- |
| Room interiors (each of 7 rooms)              | ~2-3 per room = 14-21 photos | High     |
| Breakfast / dining                            | 2-3 photos                   | High     |
| Bathroom details                              | 1 per room = 7 photos        | Medium   |
| Activities (Baumkronenpfad, Draisine, hiking) | 3-5 photos                   | Medium   |
| Seasonal variants (autumn)                    | 2-3 photos                   | Low      |
| Pet-friendly (dog in garden)                  | 1-2 photos                   | Low      |
| Solar/sustainability                          | 1-2 photos                   | Low      |
| OG/social share image                         | 1 (1200x630, custom)         | Medium   |
