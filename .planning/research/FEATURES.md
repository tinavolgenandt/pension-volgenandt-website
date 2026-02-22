# Feature Landscape: German Pension / Guesthouse Website

**Domain:** Hospitality -- family-run guesthouse (Pension), 7 room types, rural Thuringia
**Researched:** 2026-02-21
**Overall confidence:** HIGH (well-established domain with clear legal framework)

---

## Table Stakes

Features guests expect from any pension website in 2026. Missing any of these makes the site feel incomplete, unprofessional, or untrustworthy. Guests will leave for a competitor or OTA listing.

| #   | Feature                                         | Why Expected                                                                                                                                                                                | Complexity | In Proposal? | Notes                                                                                                                                             |
| --- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| T1  | **Clear room pages with photos**                | Guests want to see exactly what they are booking. OTAs show 20+ photos per room; a direct site must compete.                                                                                | Medium     | Yes          | Individual room detail pages with gallery proposed. Ensure 5-8 photos per room minimum (current 8 images total is insufficient for 7 room types). |
| T2  | **Visible pricing on room cards**               | Guests will not click through to a booking engine to discover prices. "ab EUR X / Nacht" on every room card is non-negotiable. PAngV requires total price display.                          | Low        | Yes          | Prices visible on room cards and detail pages. Must include VAT, show "pro Nacht" clearly.                                                        |
| T3  | **Integrated booking / availability check**     | Guests expect to check availability and book without leaving the site. External redirects kill conversion -- 25-40% drop-off when branding mismatches.                                      | High       | Yes          | Beds24 widget embedded on every page. Critical to style the widget to match the site design.                                                      |
| T4  | **Mobile-first responsive design**              | 70%+ of hotel bookings happen on mobile devices. A non-mobile site is effectively invisible.                                                                                                | Medium     | Yes          | Explicitly mobile-first in the proposal.                                                                                                          |
| T5  | **Contact information (phone, email, address)** | Guests 50-60 still call to book or ask questions. Phone number must be visible in header and clickable (tel: link) on mobile.                                                               | Low        | Yes          | Header, footer, contact page. Ensure `tel:` and `mailto:` links.                                                                                  |
| T6  | **Location / map**                              | Guests need to know where the pension is and how to get there. Especially important for rural locations like Breitenbach that are not well-known.                                           | Low        | Yes          | Contact page with embedded map + homepage location section.                                                                                       |
| T7  | **Guest reviews / social proof**                | 93% of travelers say online reviews influence booking decisions. A site without reviews feels like it has something to hide.                                                                | Low        | Yes          | Testimonials carousel on homepage. Source from Booking.com / Google reviews.                                                                      |
| T8  | **Fast page load (<3s)**                        | Every second of delay increases bounce rate. Google uses Core Web Vitals as ranking signal. Average hotel site conversion drops 7% per second of load time.                                 | Medium     | Yes          | SSG + CDN targets <2.5s LCP.                                                                                                                      |
| T9  | **SSL / HTTPS**                                 | Browsers show "Not Secure" warning without HTTPS. Instant trust killer. Also required for any payment-adjacent flow.                                                                        | Low        | Yes          | Free via Netlify/Cloudflare.                                                                                                                      |
| T10 | **Legal pages (Impressum, Datenschutz)**        | German law mandates both. Missing Impressum carries fines and is an Abmahnung risk (competitor cease-and-desist). Current site is missing both -- this is a compliance emergency.           | Low        | Yes          | See Legal Requirements section below for specifics.                                                                                               |
| T11 | **Cookie consent banner**                       | TTDSG Section 25 mandates explicit consent before non-essential cookies. Fines up to EUR 300,000.                                                                                           | Medium     | Yes          | See Cookie Consent section below for implementation details.                                                                                      |
| T12 | **SEO basics (meta, sitemap, alt text)**        | Direct bookings depend on organic search visibility. Without meta tags, sitemap, and alt text, the pension is invisible to Google for "Pension Eichsfeld" queries.                          | Low        | Yes          | Comprehensive SEO planned with nuxt modules.                                                                                                      |
| T13 | **Amenity information per room**                | Guests need to know: room size, bed type, bathroom (private/shared), Wi-Fi, TV, balcony, parking. Missing amenity info creates uncertainty and drives guests to OTAs for the same property. | Low        | Yes          | Amenity icons on room cards and detail pages.                                                                                                     |
| T14 | **Breakfast information**                       | For a Pension, breakfast is a core expectation. Guests need to know: included or extra, price, what is served, dietary options.                                                             | Low        | Partial      | Breakfast pricing mentioned (EUR 10/15). Add description of breakfast offerings.                                                                  |
| T15 | **Check-in / check-out times**                  | Basic operational info every guest needs before arrival.                                                                                                                                    | Low        | Not explicit | Add to room detail pages, footer, or FAQ section. Include in Schema.org data.                                                                     |
| T16 | **Directions / Anfahrt**                        | Rural location makes this critical. Many guests will drive. Clear directions from nearest Autobahn exit, train station, and major cities.                                                   | Low        | Partial      | Map is planned. Add written directions with landmarks, distance from Leinefelde station, A38 exit.                                                |
| T17 | **Parking information**                         | German pension guests almost always arrive by car. "Is parking available? Is it free?" is a top-3 question.                                                                                 | Low        | Not explicit | Add to contact page or as amenity on room pages. Mention in Schema.org (parking property).                                                        |

### Table Stakes Assessment

The redesign proposal covers 13 of 17 table stakes well. Gaps to fill:

- **T14**: Expand breakfast content beyond pricing to description and dietary options
- **T15**: Add check-in/check-out times prominently
- **T16**: Add written driving directions, not just map
- **T17**: Add parking information (availability, cost, type)

---

## Differentiators

Features that set a pension website apart from competitors. Not expected by every guest, but valued when present. These drive direct bookings over OTAs and create memorable impressions.

| #   | Feature                                     | Value Proposition                                                                                                                                                                                       | Complexity | In Proposal? | Notes                                                                                    |
| --- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------ | ---------------------------------------------------------------------------------------- |
| D1  | **Hero drone video background**             | Immersive first impression. Landing pages with video get 5x more engagement. Communicates the landscape and setting instantly -- worth 1000 words for a rural pension.                                  | Medium     | Yes          | Desktop only, static image on mobile. Good decision.                                     |
| D2  | **Sustainability page**                     | Genuine differentiator for Pension Volgenandt (solar, bio-Klaranlage, composting). Eco-conscious travelers actively search for sustainable stays. Most competitor pensions do not have this.            | Low        | Yes          | Expand with specific numbers (kWh produced, waste diverted).                             |
| D3  | **"Einfach Ankommen" brand philosophy**     | Authentic, emotionally resonant positioning. Most pension websites are purely functional. Having a clear brand voice that communicates "come as you are" creates emotional connection and memorability. | Low        | Yes          | Embedded in design, not a separate feature.                                              |
| D4  | **Distance badges on activities**           | "Baumkronenpfad: 25 min" badges convert browsers into bookers by answering "what can I do there?" without requiring research. Creates tangible value proposition for the location.                      | Low        | Yes          | Activities page with distance badges.                                                    |
| D5  | **Visible pricing everywhere**              | Most OTAs require date entry to see prices. Showing "ab EUR X / Nacht" directly on room cards is a direct booking advantage. Transparency builds trust.                                                 | Low        | Yes          | Room cards and detail pages.                                                             |
| D6  | **Family-specific content page**            | Dedicated "Kind & Kegel" page addressing family needs (safety, activities, child beds, high chairs) is rare for small pensions and directly targets secondary audience.                                 | Low        | Yes          | Strongest existing content, kept and enhanced.                                           |
| D7  | **Seasonal activity suggestions**           | Telling guests what to do in spring, summer, autumn, and winter creates reason to visit year-round and aids SEO with seasonal long-tail keywords.                                                       | Low        | Not explicit | Add seasonal sections or tags to activities page.                                        |
| D8  | **Local partnership badges**                | DEHOGA, Bett+Bike, Wanderbares Deutschland badges in footer create trust signals and signal quality certification. Reference site Pension zur Krone uses these effectively.                             | Low        | Not explicit | Add to footer if pension has certifications.                                             |
| D9  | **"Book direct" value proposition**         | Explicitly telling guests why booking direct is better (best price, flexible cancellation, personal contact) drives traffic away from OTAs. 18-20% revenue uplift from direct bookings.                 | Low        | Not explicit | Add a subtle "Direktbucher-Vorteil" badge or line near booking widget.                   |
| D10 | **Weather widget or current conditions**    | For a nature/outdoor-focused pension, showing current weather in Breitenbach helps guests plan and creates a sense of "real place, right now."                                                          | Low        | No           | Optional nice-to-have. Could add in v1.1. Third-party API dependency.                    |
| D11 | **Structured data for rich search results** | Schema.org LodgingBusiness markup creates enhanced search listings with star ratings, price ranges, and amenities visible directly in Google results. Most small pensions do not implement this.        | Medium     | Yes          | Planned with nuxt-schema-org module. See Schema.org section below.                       |
| D12 | **FAQ section**                             | Addresses common pre-booking questions (parking, pets, breakfast time, check-in). Reduces email/phone inquiries and generates FAQPage rich snippets in Google.                                          | Low        | Not explicit | Add FAQ to contact page or as standalone section. High SEO value with low effort.        |
| D13 | **Pet policy clarity**                      | "Hund willkommen" with clear pricing (EUR 10/Tag) and any restrictions. Pet-friendly accommodation is a major search filter. Many guests will skip a pension without explicit pet information.          | Low        | Partial      | Dog fee mentioned in extras. Make more prominent -- dedicated icon, room-level pet info. |

### Differentiator Assessment

The proposal already includes the strongest differentiators (D1, D2, D4, D5, D6). Recommended additions:

- **D7**: Seasonal content on activities page (low effort, high SEO value)
- **D9**: "Direktbucher-Vorteil" messaging near booking widget
- **D12**: FAQ section with FAQPage schema (high SEO ROI)
- **D13**: More prominent pet policy (major search filter)

---

## Anti-Features

Features to deliberately NOT build. These are common mistakes in pension/hotel websites that hurt conversion, annoy guests, or waste development time.

| #   | Anti-Feature                                     | Why Avoid                                                                                                                                                                | What to Do Instead                                                                                                   |
| --- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| A1  | **Auto-playing background music**                | Universally hated. Causes immediate bounce. Especially harmful for the 50-60 age group who may be startled or confused.                                                  | Silence. The hero video autoplays muted, which is acceptable.                                                        |
| A2  | **Mandatory registration / login to book**       | Adding friction to the booking process causes 25-40% abandonment. Beds24 handles guest data collection during checkout -- do not add a registration layer on top.        | Let Beds24 handle guest identity. No site-level user accounts.                                                       |
| A3  | **Pop-up overlays (newsletter, special offers)** | Pop-ups on entry or during scrolling are the #1 UX complaint. They obscure content and feel aggressive. Google penalizes intrusive interstitials on mobile.              | If newsletter is needed later (v1.1), use a subtle footer signup. Never a pop-up.                                    |
| A4  | **Parallax scrolling / heavy animations**        | Slow performance, motion sickness for some users, breaks on mobile, distracts from content. The target audience (50-60) finds this confusing, not impressive.            | Simple fade-in on scroll (already in proposal). Respect `prefers-reduced-motion`.                                    |
| A5  | **Image sliders / carousels on homepage**        | Studies show only 1% of users click past the first slide. Sliders delay LCP, confuse navigation, and hide content. Exception: room gallery where user actively browses.  | Single hero video/image. Room galleries use explicit thumbnail navigation, not auto-rotating sliders.                |
| A6  | **Stock photography**                            | Guests can spot stock photos instantly. Using stock images for rooms or facilities destroys trust completely -- "this is not what I will get."                           | Use only real photos. If quality is poor, invest in photography (EUR 300-600 as proposed) rather than faking it.     |
| A7  | **Over-designed booking widget**                 | Building a custom booking UI instead of using Beds24's widget introduces bugs, availability sync issues, and double-booking risk.                                        | Embed and style Beds24's widget. Do not rebuild booking logic.                                                       |
| A8  | **Chat widget / WhatsApp button (for v1.0)**     | Requires someone to respond in real-time. If the owner cannot commit to responding within minutes, an unanswered chat is worse than no chat. Creates false expectations. | Phone number + email + contact form. Chat can be added in v1.1 when response capacity is confirmed.                  |
| A9  | **Social media feed embeds**                     | Slow to load (adds 200-500KB), often shows stale content, introduces third-party tracking, and looks broken if the social account is inactive.                           | Link to social profiles in footer with icons. Do not embed feeds.                                                    |
| A10 | **Multi-language toggle (for v1.0)**             | German-only for launch is the right call. Half-translated sites are worse than monolingual ones. English can wait for v1.1 with proper i18n.                             | German only. Clean i18n architecture ready for English later (already planned with @nuxtjs/i18n).                    |
| A11 | **Blog / news section (for v1.0)**               | Requires ongoing content creation. An empty or stale blog signals abandonment. Better to launch without a blog than with one post from 6 months ago.                     | Defer to v1.1 or later. Focus on evergreen content pages.                                                            |
| A12 | **Price comparison / rate parity display**       | Showing "Our price vs Booking.com" comparisons is complex, hard to maintain, and can backfire if OTA prices are actually lower due to promotions.                        | Simple "Bestpreis-Garantie bei Direktbuchung" text if applicable. No live comparison.                                |
| A13 | **Virtual room tour / 360-degree view**          | High production cost, large file sizes, poor mobile UX, and most guests find traditional photos more useful for assessing a room.                                        | Good quality still photos (5-8 per room) with lightbox gallery. The drone video covers the "immersive" need.         |
| A14 | **Overly long room descriptions**                | Users read only 30% of text on pages with 450+ words. Dense text blocks make guests skip the content entirely.                                                           | Short, scannable room descriptions (100-150 words). Use amenity icons for features. Let photos do the heavy lifting. |
| A15 | **Cookie wall (blocking content until consent)** | Illegal under German law (TTDSG). A cookie wall that blocks access until the user accepts is not freely given consent and is invalid.                                    | Non-blocking cookie banner with equal accept/reject buttons. Content accessible regardless of cookie choice.         |

---

## Legal Requirements (Germany-Specific)

These are not optional. Missing any of these creates legal liability, Abmahnung risk, and potential fines.

### L1: Impressum (DDG SS 5, formerly TMG SS 5)

**Confidence:** HIGH (well-established legal requirement, verified across multiple sources)

**Important update:** Since May 14, 2024, the legal basis is the Digitale-Dienste-Gesetz (DDG), not the TMG. References must use "SS 5 DDG" not "SS 5 TMG." The TTDSG was also renamed to TDDDG (Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz).

**Required content:**

| Field                   | Requirement                                                                | Notes                                                                       |
| ----------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Full name of operator   | First and last name of the person responsible                              | For sole proprietorship: owner's full name                                  |
| Legal form              | If applicable (e.g., GbR, GmbH)                                            | Pension likely operates as Einzelunternehmen                                |
| Address                 | Full postal address (no P.O. box)                                          | Otto-Reuter-Strasse 28, 37327 Leinefelde-Worbis OT Breitenbach              |
| Contact                 | Email address + one additional fast contact method (phone or contact form) | Both phone and email recommended                                            |
| VAT ID                  | Umsatzsteuer-Identifikationsnummer if assigned                             | Or note "Kleinunternehmer" if applicable                                    |
| Trade register          | Handelsregisternummer if registered                                        | Only if applicable                                                          |
| Regulatory authority    | Zustandige Aufsichtsbehorde if applicable                                  | May apply for accommodation businesses                                      |
| Responsible for content | "Verantwortlich fur den Inhalt nach SS 18 Abs. 2 MStV"                     | Name of the content editor                                                  |
| ODR platform link       | Link to EU Online Dispute Resolution platform                              | Required for consumer-facing businesses: https://ec.europa.eu/consumers/odr |

**Implementation:**

- Must be reachable within 2 clicks from any page (typically footer link)
- Must be labeled "Impressum" (not "Legal" or "About")
- Must be a separate page, not hidden in a modal or accordion
- Plain text, no images of text (must be machine-readable)

**Penalty for non-compliance:** Abmahnung (cease-and-desist from competitors), fines up to EUR 50,000.

**Source confidence:** HIGH -- verified across IONOS, MTH-Partner, and multiple German legal sources.

### L2: Datenschutzerklarung / Privacy Policy (GDPR Art. 13/14, BDSG)

**Confidence:** HIGH

**Required content for a pension website:**

| Section                 | Must Cover                                                                                                              |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Controller identity     | Name, address, contact of data controller (same as Impressum operator)                                                  |
| Data protection officer | Contact details if one is appointed (not required for businesses with <20 employees regularly processing personal data) |
| Data collected          | What personal data is processed (name, email, IP, cookies, booking data)                                                |
| Legal basis             | Art. 6(1) GDPR basis for each processing activity (consent, contract, legitimate interest)                              |
| Purpose                 | Why each type of data is collected                                                                                      |
| Recipients              | Who receives the data (Beds24, Google Analytics if used, payment processors)                                            |
| Third-country transfers | If data goes outside EU (e.g., Google servers)                                                                          |
| Retention periods       | How long data is stored                                                                                                 |
| Rights of data subjects | Right to access, rectification, erasure, restriction, portability, objection                                            |
| Right to complain       | Supervisory authority contact (Thuringian data protection authority: TLfDI)                                             |
| Cookies                 | Which cookies are used, their purpose, duration, legal basis                                                            |
| Contact form            | What data is collected, legal basis (pre-contractual measures)                                                          |
| Booking system          | Beds24 as processor, what data is shared, legal basis                                                                   |
| Analytics               | If any analytics are used, which ones, opt-out mechanism                                                                |
| Maps                    | If Google Maps/OpenStreetMap is embedded, data processing info                                                          |
| Fonts                   | If Google Fonts is loaded externally (recommend self-hosting to avoid this)                                             |

**Implementation:**

- Separate page at /datenschutz/
- Reachable from every page (footer link)
- Written in clear, plain German
- Updated whenever data processing changes
- Link to supervisory authority: Thuringer Landesbeauftragter fur den Datenschutz und die Informationsfreiheit (TLfDI)

**Note on Google Fonts:** German courts (LG Munchen I, Jan 2022) have ruled that loading Google Fonts from Google servers without consent is a GDPR violation (transfers IP address to US). **Self-host all fonts** to avoid this issue entirely. The proposal uses DM Sans via @nuxt/fonts which supports self-hosting.

### L3: Cookie Consent (TDDDG SS 25, formerly TTDSG SS 25)

**Confidence:** HIGH (verified with CookieYes, Didomi, Usercentrics, and official DSK guidance)

See dedicated Cookie Consent section below.

### L4: AGB / Terms and Conditions

**Confidence:** MEDIUM (not legally mandatory to have, but strongly recommended for accommodation businesses)

AGB are **not legally required** in Germany. However, for accommodation bookings, they are strongly recommended because:

- They define cancellation policies (critical for revenue protection)
- They set payment terms and methods
- They limit liability
- They establish house rules
- Without AGB, general German civil law (BGB) applies, which may be less favorable for the operator

**Standard hotel/pension AGB sections:**

| Section               | Content                                                      |
| --------------------- | ------------------------------------------------------------ |
| Scope                 | These terms apply to accommodation contracts                 |
| Contract formation    | When booking becomes binding                                 |
| Services              | What is included in the room rate                            |
| Prices and payment    | Total prices incl. VAT, payment methods, when payment is due |
| Cancellation policy   | Deadlines, fees, no-show charges                             |
| Arrival and departure | Check-in/check-out times, early/late arrangements            |
| Liability             | Limitation of liability, valuables, damage                   |
| Pet policy            | Conditions and fees for pets                                 |
| House rules           | Quiet hours, smoking policy, fire safety                     |
| Data protection       | Reference to Datenschutzerklarung                            |
| Dispute resolution    | Reference to ODR platform, applicable law                    |

**Implementation:**

- Separate page at /agb/
- Must be presented before booking confirmation (link in booking flow)
- Customer must be able to read and accept before completing a booking

### L5: Price Display (PAngV -- Preisangabenverordnung)

**Confidence:** HIGH (verified with IHK and legal sources)

**Requirements for accommodation websites:**

| Requirement            | Detail                                                                                          |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| Total price (Endpreis) | All prices must include VAT and all mandatory surcharges                                        |
| Per unit               | Prices must be shown "pro Nacht" or "pro Ubernachtung"                                          |
| Breakfast              | If breakfast costs extra, price must be stated separately. If included, state "inkl. Fruhstuck" |
| Tourist tax            | If Kurtaxe applies, must be shown separately as it varies                                       |
| Cleaning fee           | If applicable, must be included in total or shown separately                                    |
| Clear assignment       | Each price must be clearly assigned to a specific room/service                                  |
| Legibility             | Prices must be easily recognizable and clearly legible                                          |

**Implementation for Pension Volgenandt:**

- Room cards: "ab EUR X / Nacht inkl. MwSt."
- Room detail: Full price table with base price, breakfast option, extras
- Extras: Each add-on with clear price ("Fruhstuck: EUR 10 / Person")
- If seasonal pricing exists, show range: "EUR 55 - 75 / Nacht"

### L6: Accessibility (BFSG -- Barrierefreiheitsstarkungsgesetz)

**Confidence:** MEDIUM (law is clear, but application to small pensions is nuanced)

**Effective:** June 28, 2025 (already in effect)

The BFSG implements the European Accessibility Act (EAA) in Germany and requires WCAG 2.1 Level AA compliance for websites offering e-commerce services, including accommodation bookings.

**Micro-enterprise exemption:** Businesses with fewer than 10 employees AND less than EUR 2 million annual turnover are exempt from service-related obligations. HOWEVER, if the website includes a booking function (which Pension Volgenandt does via Beds24), it may be classified as providing a digital product/service, which could override the micro-exemption.

**Recommendation:** Comply with WCAG 2.1 AA regardless of exemption status because:

1. The legal interpretation is still evolving -- safer to comply
2. The target audience (50-60 year olds) directly benefits from accessibility
3. Accessibility improves SEO (Google considers accessibility signals)
4. The proposal already targets 95+ Lighthouse accessibility score
5. Fines of up to EUR 100,000 for non-compliance

**Key WCAG 2.1 AA requirements for a pension website:**

| Principle      | Key Requirements                                                                                                       |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Perceivable    | Alt text on all images, 4.5:1 contrast ratio for text, captions for video, no information conveyed by color alone      |
| Operable       | Full keyboard navigation, no keyboard traps, focus indicators visible, skip-to-content link, touch targets min 44x44px |
| Understandable | Language declared in HTML (lang="de"), clear error messages in forms, consistent navigation                            |
| Robust         | Valid HTML, ARIA labels where needed, compatible with screen readers                                                   |

---

## Cookie Consent Implementation

**Confidence:** HIGH (verified across multiple German legal sources: CookieYes, Didomi, Usercentrics, DSK guidance)

### Legal Framework

TDDDG SS 25 (formerly TTDSG SS 25) requires explicit, informed, freely given consent before placing any non-essential cookies or accessing information on user devices. This applies alongside GDPR for personal data processing.

### What Requires Consent

| Cookie/Technology                             | Consent Required? | Legal Basis                                                                                 |
| --------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------- |
| Session cookies (essential for site function) | No                | Strictly necessary exemption                                                                |
| Language preference cookie                    | No                | Strictly necessary                                                                          |
| Cookie consent state cookie                   | No                | Strictly necessary                                                                          |
| Beds24 booking widget cookies                 | Depends           | If purely functional for booking: no. If tracking: yes. Investigate Beds24 cookie behavior. |
| Google Analytics                              | Yes               | Consent (Art. 6(1)(a) GDPR)                                                                 |
| Google Maps embed                             | Yes               | Consent (loads third-party scripts, transfers IP)                                           |
| YouTube video embed                           | Yes               | Consent (loads third-party scripts). Use youtube-nocookie.com domain or facade pattern.     |
| Google Fonts (external)                       | Yes (avoid)       | Self-host fonts to eliminate this requirement entirely                                      |
| Social media share buttons                    | Yes               | If they load third-party scripts                                                            |
| Matomo/Plausible (self-hosted, cookieless)    | No                | No cookies, no personal data transfer                                                       |

### Banner Requirements

**Must have:**

- Displayed before any non-essential cookies are set
- Clear, plain German language
- "Akzeptieren" and "Ablehnen" buttons with **equal visual prominence** (same size, same styling weight, same position level)
- Granular category selection (e.g., "Notwendig" always on, "Statistik" optional, "Marketing" optional)
- Link to full Datenschutzerklarung
- Information about what cookies are used and why

**Must NOT have:**

- Pre-checked consent boxes
- "Accept" button prominently styled while "Reject" is a small text link (dark pattern)
- Cookie wall blocking content access
- Implied consent from scrolling or continued browsing
- Deceptive button labels

**Withdrawal:**

- Users must be able to withdraw consent as easily as granting it
- Implement a persistent footer link like "Cookie-Einstellungen" that reopens the consent dialog
- Consent state stored in a first-party cookie (this cookie itself is strictly necessary and exempt)

### Recommended Implementation

For a small SSG site like Pension Volgenandt, a lightweight custom cookie consent is preferable over heavyweight third-party solutions (Cookiebot, Usercentrics) because:

1. SSG means minimal cookies to manage
2. Third-party consent tools add 50-200KB of JavaScript
3. Third-party tools themselves set cookies (ironic)
4. The pension likely uses only 2-3 cookie categories

**Suggested approach:**

- Custom Vue component (`CookieConsent.vue`)
- Cookie categories: "Notwendig" (always on), "Statistik" (if analytics used), "Externe Medien" (YouTube, Maps)
- Store consent in localStorage or first-party cookie
- Block third-party scripts (YouTube, Maps, Analytics) until consent is granted
- Use Nuxt `@nuxt/scripts` module for conditional script loading based on consent
- Facade pattern for YouTube: show thumbnail + play button, load iframe only after consent + click

**If analytics is needed:** Use Plausible Analytics or Matomo (self-hosted, cookieless mode) to avoid the consent requirement for analytics entirely. Both provide GDPR-compliant analytics without cookies.

### Record-Keeping

Store a timestamp of when consent was granted, what was consented to, and the consent version. This provides proof of compliance if challenged. No specific retention period is mandated by law.

---

## Schema.org Structured Data Recommendations

**Confidence:** HIGH (verified with Schema.org official docs and Google Developers documentation)

### Primary Schema Types to Implement

#### 1. LodgingBusiness (Homepage)

The pension is best represented as `LodgingBusiness` (parent type) rather than `Hotel` (which implies a larger, star-rated establishment) or `BedAndBreakfast` (which implies breakfast is always included).

```json
{
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "Pension Volgenandt",
  "description": "Familiengeführte Pension im Eichsfeld...",
  "url": "https://www.pension-volgenandt.de",
  "telephone": "+49-XXXX-XXXXXX",
  "email": "info@pension-volgenandt.de",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Otto-Reuter-Straße 28",
    "addressLocality": "Leinefelde-Worbis",
    "addressRegion": "Thüringen",
    "postalCode": "37327",
    "addressCountry": "DE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "XX.XXXXX",
    "longitude": "XX.XXXXX"
  },
  "image": "https://www.pension-volgenandt.de/img/pension-exterior.webp",
  "priceRange": "EUR 45-90",
  "checkinTime": "15:00",
  "checkoutTime": "10:00",
  "numberOfRooms": 7,
  "petsAllowed": true,
  "amenityFeature": [
    { "@type": "LocationFeatureSpecification", "name": "Kostenloses WLAN", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Kostenloser Parkplatz", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Garten", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Frühstück verfügbar", "value": true }
  ],
  "availableLanguage": ["de"],
  "currenciesAccepted": "EUR",
  "paymentAccepted": "Cash, Bank Transfer"
}
```

**SEO impact:** HIGH -- enables Google Knowledge Panel, Local Pack results, and rich snippets showing price range, amenities, and contact info directly in search results.

#### 2. HotelRoom + Offer (Room Detail Pages)

Each room page should include `HotelRoom` linked to an `Offer` for pricing.

```json
{
  "@context": "https://schema.org",
  "@type": "HotelRoom",
  "name": "Ferienwohnung Emil's Kuhwiese",
  "description": "Gemütliche Ferienwohnung mit Terrasse...",
  "image": ["url1.webp", "url2.webp"],
  "occupancy": {
    "@type": "QuantitativeValue",
    "value": 4
  },
  "bed": {
    "@type": "BedDetails",
    "typeOfBed": "Doppelbett",
    "numberOfBeds": 1
  },
  "amenityFeature": [
    { "@type": "LocationFeatureSpecification", "name": "Terrasse", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Küche", "value": true }
  ],
  "containedInPlace": {
    "@type": "LodgingBusiness",
    "name": "Pension Volgenandt"
  },
  "offers": {
    "@type": "Offer",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "price": "70.00",
      "priceCurrency": "EUR",
      "unitCode": "DAY"
    },
    "availability": "https://schema.org/InStock"
  }
}
```

**SEO impact:** HIGH -- enables room-level rich results with pricing in Google search.

#### 3. BreadcrumbList (All Subpages)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://..." },
    { "@type": "ListItem", "position": 2, "name": "Zimmer", "item": "https://..." },
    { "@type": "ListItem", "position": 3, "name": "Emil's Kuhwiese" }
  ]
}
```

**SEO impact:** MEDIUM -- improves breadcrumb display in search results, aids crawling.

#### 4. FAQPage (Contact Page or Dedicated FAQ)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Gibt es kostenlose Parkplätze?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ja, kostenlose Parkplätze stehen direkt am Haus zur Verfügung."
      }
    }
  ]
}
```

**SEO impact:** HIGH -- FAQ rich snippets occupy significant SERP real estate, directly answering searcher questions. Excellent for long-tail queries like "Pension Eichsfeld Parkplatz."

#### 5. Review / AggregateRating (Homepage or Room Pages)

```json
{
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "Pension Volgenandt",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "47",
    "bestRating": "5"
  }
}
```

**SEO impact:** HIGH -- star ratings in search results dramatically increase click-through rates.

**Important caveat:** Google's guidelines require that reviews shown in structured data are collected on the site itself or legitimately aggregated. Do NOT mark up reviews scraped from Booking.com as your own. Use only reviews collected directly (via contact form, email follow-up, or Google reviews).

### Schema Implementation Priority

| Priority | Type                  | Where                      | Impact                      |
| -------- | --------------------- | -------------------------- | --------------------------- |
| P0       | LodgingBusiness       | Homepage                   | Knowledge Panel, Local Pack |
| P0       | BreadcrumbList        | All subpages               | Breadcrumb display in SERP  |
| P1       | HotelRoom + Offer     | Room detail pages          | Room-level rich results     |
| P1       | FAQPage               | Contact page / FAQ section | FAQ rich snippets           |
| P2       | AggregateRating       | Homepage                   | Star ratings in SERP        |
| P2       | Event (if applicable) | Activities page            | Local events rich snippets  |

### Implementation Tool

Use `nuxt-schema-org` module (already in the proposal). It provides Vue composables like `useSchemaOrg()` that generate valid JSON-LD and handle nesting, page-level overrides, and validation.

---

## Feature Dependencies

```
Legal Compliance (L1-L6)
  |
  +-- Cookie Consent (L3) --> blocks: Analytics, Maps embed, YouTube embed
  |
  +-- Impressum (L1) --> blocks: Launch (legally required)
  |
  +-- Datenschutz (L2) --> blocks: Cookie Consent, Contact Form, Booking Integration
  |
  +-- PAngV Pricing (L5) --> blocks: Room Cards, Room Detail Pages

Room Pages (T1, T2, T13)
  |
  +-- Room Photos (T1) --> blocks: Room Cards, Room Detail
  |
  +-- Pricing Data (T2) --> blocks: Room Cards, Room Detail, Schema.org
  |
  +-- Amenity Data (T13) --> blocks: Room Cards, Room Detail, Schema.org

Booking Integration (T3)
  |
  +-- Beds24 Widget Embedding --> blocks: BookingWidget, BookingBar
  |
  +-- Cookie Consent (for Beds24 cookies) --> depends on: L3
  |
  +-- AGB (L4) --> should be available before booking goes live

Schema.org (D11)
  |
  +-- LodgingBusiness --> depends on: Contact info, geo coords, amenity list
  |
  +-- HotelRoom --> depends on: Room data (T1, T2, T13)
  |
  +-- FAQPage --> depends on: FAQ content (D12)
  |
  +-- BreadcrumbList --> depends on: Page structure, routing
```

---

## MVP Recommendation

For v1.0 launch, prioritize in this order:

**Must have (blocks launch):**

1. All table stakes (T1-T17) -- these are baseline expectations
2. All legal requirements (L1-L6) -- non-negotiable for German law
3. Cookie consent (L3) -- required before any tracking/embeds
4. Schema.org basics (LodgingBusiness + BreadcrumbList) -- high SEO ROI for low effort

**Should have (launch is weaker without):** 5. Hero drone video (D1) -- first impression differentiator 6. Sustainability page (D2) -- unique selling point 7. FAQ section with FAQPage schema (D12) -- high SEO value 8. Pet policy prominence (D13) -- major search filter 9. HotelRoom schema on room pages (D11) -- price-level rich results

**Defer to v1.1:**

- Multi-language (A10) -- German only for launch
- Blog/news (A11) -- requires ongoing content
- Chat widget (A8) -- requires response capacity
- Weather widget (D10) -- nice-to-have, third-party dependency
- Newsletter signup -- low priority, adds complexity
- Advanced analytics (start with cookieless Plausible if needed)

---

## Sources

### Legal Requirements

- [IONOS: Impressum Requirements 2025](https://www.ionos.com/digitalguide/websites/digital-law/a-case-for-thinking-global-germanys-impressum-laws/) -- HIGH confidence
- [MTH-Partner: DDG Imprint Obligation](https://www.mth-partner.de/en/internet-law-imprint-obligation-according-to-the-german-gdpr-create-a-legally-compliant-imprint/) -- HIGH confidence
- [Win With Words: Update German Impressum 2024](https://www.winwithwords.nl/blog/update-your-german-impressum-2024) -- MEDIUM confidence
- [IHK Bonn: DDG replaces TMG](https://www.ihk-bonn.de/recht-und-steuern/recht/aktuelles/das-digitale-dienste-gesetz-ersetzt-das-telemediengesetz) -- HIGH confidence
- [ITMediaLaw: PAngV Price Indication](https://itmedialaw.com/en/wissensdatenbank/price-indication-ordinance-pangv/) -- HIGH confidence

### Cookie Consent / TTDSG

- [CookieYes: Cookie Consent Requirements Germany](https://www.cookieyes.com/blog/cookie-consent-requirements-germany/) -- HIGH confidence
- [Didomi: German Consent Management Ordinance](https://www.didomi.io/blog/german-consent-management-ordinance) -- HIGH confidence
- [Securiti: German Guide on TDDDG](https://securiti.ai/blog/german-ttdsg-guide/) -- MEDIUM confidence
- [Usercentrics: Cookie Consent Ordinance](https://usercentrics.com/knowledge-hub/cookie-flood-control-consent-management-ordinance-tdddg/) -- HIGH confidence

### Accessibility / BFSG

- [svaerm: Mandatory Accessible Website 2025](https://svaerm.com/en/blog/mandatory-accessible-website-2025-bfsg-eaa-wcag/) -- MEDIUM confidence
- [barrierefix: EAA Timeline](https://www.barrierefix.de/en/blog/ab-wann-gilt-bfsg-timeline-2025-2040) -- HIGH confidence
- [barrierefix: BFSG Compliance Guide for SMEs](https://www.barrierefix.de/en/blog/bfsg-2025-ultimativer-compliance-guide-kmu) -- MEDIUM confidence

### Schema.org

- [Schema.org: Hotels Documentation](https://schema.org/docs/hotels.html) -- HIGH confidence (official source)
- [Schema.org: LodgingBusiness Type](https://schema.org/LodgingBusiness) -- HIGH confidence (official source)
- [Google Developers: Hotel Lodging Schema](https://developers.google.com/hotels/hotel-content/proto-reference/lodging-schema) -- HIGH confidence (official source)
- [Dan Taylor: Schema for Hotels](https://dantaylor.online/blog/schema-for-hotels-travel-accommodations/) -- MEDIUM confidence
- [Hotel Growth Agency: Structured Data for Hotels](https://hotelgrowth.agency/2025/03/28/how-to-use-structured-data-to-improve-hotel-visibility/) -- MEDIUM confidence

### Conversion / UX

- [Spilt Milk: CRO for Boutique Hotels 2025](https://spiltmilkwebdesign.com/conversion-rate-optimization-website-ux-for-boutique-hotels-in-2025/) -- MEDIUM confidence
- [Little Hotelier: Hotel Website Conversion](https://www.littlehotelier.com/blog/get-more-bookings/hotel-website-conversion-rate/) -- MEDIUM confidence
- [Revfine: 20 Hotel Website Mistakes](https://www.revfine.com/hotel-website-mistakes/) -- MEDIUM confidence
- [Roomstay: Hotel Conversion Rate Benchmarks 2026](https://www.roomstay.io/blog/optimising-hotel-average-conversion-rate) -- MEDIUM confidence
