# Phase 1: Foundation & Legal Compliance - Context

**Gathered:** 2026-02-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver a working Nuxt 4 SSG site with design system, responsive layout (header + footer), cookie consent system, and three legal pages (Impressum, Datenschutz, AGB). Eliminates current Abmahnung risk (no Impressum exists on current site) and establishes the full build pipeline. No content pages, no room data, no booking — those are later phases.

</domain>

<decisions>
## Implementation Decisions

### Visual identity & aesthetic direction

- Cozy & traditional aesthetic — feels like a family-run Gasthaus with history, warmth, Eichsfeld character
- Color mood: balanced mix — dark header/footer (charcoal or deep sage-900) for grounding, light cream/warm-white content areas for readability
- Sage green palette with waldhonig CTA buttons, cream/warm backgrounds
- Typography: **Lora Variable** for headings (serif, warm calligraphic character, weights 400-700), **DM Sans Variable** for body/UI (sans-serif)
  - H1: Lora Bold (700), H2/H3: Lora Semibold (600), Body: DM Sans Regular (400), UI/buttons: DM Sans Medium-Semibold (500-600)
  - Both fonts self-hosted via `@fontsource-variable/lora` and `@fontsource-variable/dm-sans` — zero CDN requests
  - CSS: `--font-serif: 'Lora Variable', Georgia, serif` and `--font-sans: 'DM Sans Variable', ui-sans-serif, system-ui, sans-serif`

### Header & navigation

- Sticky header, compresses on scroll (~60-64px), never auto-hides
- **5 flat nav items** (no dropdowns): Zimmer, Familie, Aktivitaeten, Nachhaltigkeit, Kontakt
- Ausflugsziele is NOT a nav item — discoverable via Aktivitaeten page (SEO landing pages don't need nav slots)
- Phone number visible on desktop as clickable `tel:` link with icon; icon-only tap-to-call on mobile
- CTA button: "Verfuegbarkeit pruefen" in waldhonig with white text — lower-commitment language converts 17% better than "Jetzt buchen"
- Mobile breakpoint: ~1024px (test where German-length labels overflow)
- Hamburger button includes "Menu" text label alongside icon — improves discoverability 20% for 50-60 age audience
- Hamburger menu contains: all 5 nav items, divider, phone number (full, tap-to-call), CTA button (full-width)
- CTA button remains visible in header bar at all viewport sizes (never hidden in hamburger)

### Footer layout

- 4-column layout with above-footer CTA bar and sub-footer copyright bar
- **Above-footer CTA bar:** Full-width waldhonig background, "Bereit fuer Ihren Aufenthalt im Eichsfeld?" + "Verfuegbarkeit pruefen" button — captures engaged visitors who scroll to bottom
- **Column 1 (Brand):** Logo (light version for dark bg), tagline "Ruhe finden im Eichsfeld", social icons (Facebook/Instagram if active)
- **Column 2 (Kontakt):** Full address, clickable phone with icon, clickable email — contact info is most sought-after footer element (64% of visitors)
- **Column 3 (Entdecken):** Quick nav links: Zimmer & Preise, Familie & Kinder, Aktivitaeten, Nachhaltigkeit, Ausflugsziele, Kontakt & Anfahrt
- **Column 4 (Rechtliches):** Impressum, Datenschutz, AGB, Cookie-Einstellungen link + trust badges row (DEHOGA, secure booking)
- **Sub-footer:** Copyright line on slightly darker bar
- **Mobile reorder:** CTA bar → Contact (phone first!) → Nav links → Brand → Legal → Copyright

### Cookie consent UX

- Bottom bar (full-width), not modal — less intrusive, content visible above
- Equal-prominence Accept/Reject buttons (roadmap requirement)
- Matches site design: sage/waldhonig palette, Lora/DM Sans typography, rounded corners — integrated feel, not third-party overlay
- Re-access via "Cookie-Einstellungen" link in footer legal column
- No third-party requests before consent granted (roadmap requirement)

### Legal page sourcing

- Use reputable German legal text generators (eRecht24 / IT-Recht Kanzlei style templates) customized with pension details
- **Known details from current site:**
  - Address: Otto-Reuter-Strasse 28, 37327 Leinefelde-Worbis OT Breitenbach
  - Phone: +49 3605 542775
  - Mobile: +49 160 97719112
  - Email: kontakt@pension-volgenandt.de
- **Placeholders needed (owner must fill before launch):**
  - Owner full name (Inhaber/Betreiber)
  - Steuernummer or USt-IdNr
  - Aufsichtsbehoerde (if applicable)
- AGB: Create from standard German Pension/Beherbergungsbetrieb templates (booking, cancellation, house rules, liability) — owner reviews before launch
- All three legal pages must cite DDG SS5 and TDDDG SS25 as appropriate

### Claude's Discretion

- Cookie consent granularity: simple accept/reject vs category toggles — decide based on actual third-party services used
- Loading skeleton design and exact spacing/typography values
- Error state handling patterns
- Exact trust badge selection and styling
- Footer link hover states and focus indicators
- Header compression animation details
- Legal text generator choice (eRecht24 vs IT-Recht Kanzlei vs other)

</decisions>

<specifics>
## Specific Ideas

- The site should feel like arriving at a countryside Gasthaus — warm, welcoming, with character. Not a design hotel, not a rustic cabin, but the comfortable middle ground
- Dark header/footer creates a "warm frame" around clean light content — like a wooden doorframe framing a bright room
- Lora serif headings were chosen specifically for their calligraphic warmth — brush-like stroke endings feel personal and handwritten, matching "family-run pension where the owner greets you personally"
- Phone number must be prominent — primary audience (50-60 couples) often prefers calling over online booking
- "Menu" label on hamburger button is a deliberate accessibility choice for the older target demographic
- Current site has NO Impressum at all (confirmed via web check) — this is the urgent legal liability driving Phase 1 priority
- Current Datenschutz link is also broken on existing site

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 01-foundation-legal-compliance_
_Context gathered: 2026-02-22_
