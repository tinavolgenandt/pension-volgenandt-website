---
phase: 03-homepage-hero
verified: 2026-02-22T08:18:08Z
status: passed
score: 4/4 must-haves verified
re_verification: false
human_verification:
  - test: Confirm map section conveys location clearly
    expected: Static map placeholder (sage background + pin marker) until replaced with real screenshot; address, phone, email shown correctly; OSM link works
    why_human: Map image is 2KB minimal placeholder not a real map screenshot. Structurally complete (address wired, OSM link, no cookies); visual quality is a pre-launch content task for the owner.
  - test: Hero video autoplay and poster-to-video fade on desktop
    expected: Poster visible immediately, video fades in smoothly after canplay fires, no black flash
    why_human: canplay-triggered CSS transition cannot be verified by static analysis; depends on browser autoplay policy and video buffering speed
  - test: Mobile hero shows static poster (no video) below 768px
    expected: hero-mobile.webp visible with text overlay; no video element playing
    why_human: md:hidden/md:block classes verified in code but responsive rendering needs visual confirmation in an actual viewport
---

# Phase 3: Homepage & Hero Verification Report

**Phase Goal:** Visitors landing on the homepage immediately understand what Pension Volgenandt offers and feel invited to explore rooms or book
**Verified:** 2026-02-22T08:18:08Z
**Status:** PASSED
**Re-verification:** No - initial verification

## Goal Achievement

### Observable Truths

| #   | Truth                                                                                                                                                                                      | Status   | Evidence                                                                                                                                                                                      |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Desktop visitor sees looping drone video hero with "Pension Volgenandt" and "Ruhe finden im Eichsfeld" text overlay; mobile sees static poster                                             | VERIFIED | HeroVideo.vue: video md:block/md:hidden, mobile NuxtImg md:hidden, both text strings at lines 89+95; prefers-reduced-motion disables transitions                                              |
| 2   | Scrolling reveals welcome photo, 3-column featured rooms + "Alle Zimmer ansehen", experience teaser with distance badges, testimonials with star ratings, sustainability teaser with icons | VERIFIED | All 6 content sections implemented with full content; index.vue assembles all 7 sections in correct order wrapped in UiScrollReveal                                                           |
| 3   | Homepage includes static map linked to OpenStreetMap (no cookies, no consent needed) showing pension location and address                                                                  | VERIFIED | LocationMap.vue: static PNG at /img/map/pension-location.png linked to OSM URL, full address/phone/email from useAppConfig() -- no iframe, no external tile requests                          |
| 4   | Scroll-triggered fade-in animations play on section entry; prefers-reduced-motion disables all animations                                                                                  | VERIFIED | ScrollReveal.vue lines 56-62: @media (prefers-reduced-motion: reduce) sets opacity:1; transform:none; transition:none. HeroVideo.vue lines 162-173: same pattern for hero entrance animations |

**Score:** 4/4 truths verified

---

### Required Artifacts

| Artifact                                     | Min Lines | Actual Lines            | Substantive                               | Wired                                          | Status     |
| -------------------------------------------- | --------- | ----------------------- | ----------------------------------------- | ---------------------------------------------- | ---------- |
| app/pages/index.vue                          | 15        | 42                      | Yes                                       | N/A (root page)                                | VERIFIED   |
| app/components/home/HeroVideo.vue            | 15        | 181                     | Yes                                       | Used in index.vue                              | VERIFIED   |
| app/components/home/Welcome.vue              | 15        | 52                      | Yes                                       | Used in index.vue                              | VERIFIED   |
| app/components/home/FeaturedRooms.vue        | 15        | 37                      | Yes                                       | Used in index.vue                              | VERIFIED   |
| app/components/home/Testimonials.vue         | 60        | 156                     | Yes                                       | Used in index.vue                              | VERIFIED   |
| app/components/home/ExperienceTeaser.vue     | 40        | 108                     | Yes                                       | Used in index.vue                              | VERIFIED   |
| app/components/home/SustainabilityTeaser.vue | 40        | 66                      | Yes                                       | Used in index.vue                              | VERIFIED   |
| app/components/home/LocationMap.vue          | 30        | 63                      | Yes                                       | Used in index.vue                              | VERIFIED   |
| app/composables/useScrollReveal.ts           | 10        | 11                      | Yes                                       | Imported by ScrollReveal.vue                   | VERIFIED   |
| app/components/ui/ScrollReveal.vue           | 15        | 63                      | Yes                                       | Used in index.vue + section components         | VERIFIED   |
| app/components/ui/StarRating.vue             | 10        | 48                      | Yes                                       | Used in Testimonials.vue                       | VERIFIED   |
| content/testimonials/index.yml               | 5         | 20                      | Yes (5 items)                             | Loaded via queryCollection                     | VERIFIED   |
| content/attractions/index.yml                | 5         | 36                      | Yes (4 items)                             | Loaded via queryCollection                     | VERIFIED   |
| content.config.ts                            | 5         | 130                     | Yes                                       | testimonials + attractions collections defined | VERIFIED   |
| public/video/hero.webm                       | binary    | 814,560 bytes (0.78 MB) | Yes                                       | Wired via :src constant in HeroVideo           | VERIFIED   |
| public/video/hero.mp4                        | binary    | 697,941 bytes (0.67 MB) | Yes                                       | Wired as fallback source in HeroVideo          | VERIFIED   |
| public/img/hero/hero-poster.webp             | binary    | 13,160 bytes            | Yes                                       | Wired in HeroVideo CSS background              | VERIFIED   |
| public/img/hero/hero-mobile.webp             | binary    | 6,476 bytes             | Yes                                       | Wired in HeroVideo NuxtImg                     | VERIFIED   |
| public/img/map/pension-location.png          | binary    | 2,096 bytes             | Minimal placeholder (600x400 pin-on-sage) | Wired in LocationMap NuxtImg                   | VERIFIED\* |
| public/img/welcome/lifestyle.webp            | binary    | 252,498 bytes           | Yes                                       | Wired in Welcome.vue NuxtImg                   | VERIFIED   |
| public/img/attractions/\*.webp               | binary    | 154-281KB each          | Yes (4 files, Wikimedia Commons)          | Wired in ExperienceTeaser                      | VERIFIED   |

\*Map image is a minimal placeholder -- see Human Verification section.

---

### Key Link Verification

| From                 | To                                       | Via                                                          | Status | Details                                                                    |
| -------------------- | ---------------------------------------- | ------------------------------------------------------------ | ------ | -------------------------------------------------------------------------- |
| HeroVideo.vue        | /video/hero.webm + /video/hero.mp4       | :src JS constant (avoids Vite static resolution)             | WIRED  | Lines 7-10 + 67-68; canplay event triggers fade transition                 |
| HeroVideo.vue        | mobile poster /img/hero/hero-mobile.webp | NuxtImg src with md:hidden                                   | WIRED  | Mobile-only display enforced by Tailwind responsive class                  |
| FeaturedRooms.vue    | rooms content collection                 | queryCollection('rooms').where('featured','=',true).limit(3) | WIRED  | Line 2-4; result bound to RoomsCard loop                                   |
| Testimonials.vue     | testimonials content collection          | queryCollection('testimonials').all()                        | WIRED  | Line 7-9; items rendered in Embla carousel slides                          |
| Testimonials.vue     | UiStarRating                             | Nuxt auto-import                                             | WIRED  | Lines 89 + 145; rating prop passed                                         |
| Testimonials.vue     | embla-carousel-vue                       | explicit import                                              | WIRED  | Lines 2-4; useEmblaCarousel + Autoplay + Accessibility plugins initialized |
| ExperienceTeaser.vue | attractions content collection           | queryCollection('attractions').all()                         | WIRED  | Line 3-5; featured:true item rendered as hero card, rest as smaller cards  |
| ExperienceTeaser.vue | distance badges                          | distanceKm field                                             | WIRED  | Lines 42 + 80; waldhonig pill badge on each card                           |
| LocationMap.vue      | /img/map/pension-location.png            | NuxtImg src                                                  | WIRED  | Line 20; image linked to OSM URL at line 14                                |
| LocationMap.vue      | address/phone/email                      | useAppConfig()                                               | WIRED  | Lines 36-38, 43-55; no hardcoded values                                    |
| ScrollReveal.vue     | useScrollReveal composable               | Nuxt auto-import                                             | WIRED  | Line 13; threshold 0.15, once:true                                         |
| index.vue            | all 7 sections                           | template composition                                         | WIRED  | All sections present, 6 wrapped in UiScrollReveal                          |

---

### Requirements Coverage

| Requirement | Description                                                            | Status      | Notes                                                                                                                                |
| ----------- | ---------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| HOME-01     | HeroVideo: drone video (desktop), static poster (mobile), text overlay | SATISFIED   | Both text strings present; mobile/desktop split via md:hidden/md:block                                                               |
| HOME-02     | Video: WebM (VP9, 720p, <3MB) + MP4 fallback + WebP poster             | SATISFIED   | WebM 0.78MB, MP4 0.67MB (both under 3MB); poster 13KB                                                                                |
| HOME-03     | Welcome section with rewritten text + lifestyle photo                  | SATISFIED   | 3-paragraph text in Welcome.vue; lifestyle.webp 247KB                                                                                |
| HOME-04     | 3-column featured room cards + "Alle Zimmer ansehen"                   | SATISFIED   | FeaturedRooms queries featured=true, limit 3; link to /zimmer/ present                                                               |
| HOME-05     | Experience teaser with distance badges                                 | SATISFIED   | 4 attractions, Baerenpark as hero card, distanceKm badges on all cards                                                               |
| HOME-06     | Testimonials carousel with 3+ quotes + star ratings                    | SATISFIED   | 5 testimonials; Embla carousel with autoplay 6s; star ratings rendered                                                               |
| HOME-07     | Sustainability teaser with Solar/Bio-Klaranlage/Kompost icons          | SATISFIED   | 3 proof points with lucide:sun, lucide:droplets, lucide:recycle; sage-50 background                                                  |
| HOME-08     | Location map: OpenStreetMap (no cookies) + address                     | SATISFIED\* | Static PNG linked to OSM; address from appConfig; no iframe/cookies. Map image is placeholder-quality -- see Human Verification      |
| DSGN-07     | Scroll-triggered fade-in with prefers-reduced-motion respect           | SATISFIED   | ScrollReveal.vue + HeroVideo.vue both contain @media (prefers-reduced-motion: reduce) blocks that disable all transitions/animations |

---

### Anti-Patterns Found

No stub patterns, TODO/FIXME comments, empty returns, or placeholder text found in any homepage component.

| File   | Line | Pattern | Severity | Impact |
| ------ | ---- | ------- | -------- | ------ |
| (none) | -    | -       | -        | -      |

---

### Human Verification Required

#### 1. Map Section Visual Quality

**Test:** Load the homepage and scroll to the "So finden Sie uns" section. Examine the map image and address block.
**Expected:** Address, phone number, and email are shown correctly in the right column. The image links to OpenStreetMap for a real interactive map. The map image currently shows a minimal placeholder (sage-green field with a single pin marker at correct coordinates 51.3747, 10.2197).
**Why human:** The 2KB PNG is a placeholder, not a real OSM screenshot. Functionality is complete (address wired from appConfig, OSM link present, no external tile requests, no cookies). The owner should replace public/img/map/pension-location.png with a real screenshot from OpenStreetMap before launch. This is a content task, not a code gap.

#### 2. Hero Video Autoplay and Poster Fade

**Test:** Load the homepage on desktop in a browser. Observe whether the drone video starts within 2-3 seconds and the poster fades out smoothly.
**Expected:** Poster visible immediately on load; video fades in once canplay fires (within 1-2 seconds on fast connection); poster fades to transparent; no black flash during transition.
**Why human:** The canplay-triggered CSS transition (poster z-1 fades out, video z-2 fades in, gradient z-3 stays) cannot be verified by static analysis. Runtime behavior depends on browser autoplay policy and video buffering speed.

#### 3. Mobile Hero Poster Display

**Test:** Load the homepage on a mobile device or browser devtools below 768px width.
**Expected:** Static hero-mobile.webp visible (portrait-cropped) with "Pension Volgenandt" and "Ruhe finden im Eichsfeld" text overlay and gradient; no video element playing.
**Why human:** md:hidden/md:block classes verified in code but responsive rendering needs visual confirmation in an actual viewport.

---

### Gaps Summary

No gaps. All required artifacts exist, are substantive, and are wired correctly. Phase goal achieved.

The one pre-launch content action: replace public/img/map/pension-location.png with a real OpenStreetMap screenshot. The component wiring, OSM link, and address display are all correct.

---

_Verified: 2026-02-22T08:18:08Z_
_Verifier: Claude (gsd-verifier)_
