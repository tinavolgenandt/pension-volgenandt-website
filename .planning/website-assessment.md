# Pension Volgenandt Website Assessment

**URL:** https://www.pension-volgenandt.de
**Date:** 2026-02-21
**Platform:** 1&1 IONOS Website Builder
**Assessor:** Senior Frontend Designer / Developer / UI-UX / SEO Specialist

---

## Executive Summary

The current Pension Volgenandt website is a basic 1&1 website builder site with charming content but **significant technical, design, and SEO shortcomings**. The site conveys a warm, family-run atmosphere through its photos and text, but falls short of modern hospitality website standards in nearly every measurable category. The biggest concerns are **extremely poor mobile performance**, **missing legal requirements** (Impressum), **near-total absence of image alt text**, **no structured data**, and a **dated visual design** that undermines trust and conversion potential.

**Overall Rating: 3.5 / 10**

---

## Page-by-Page Analysis

---

### 1. Homepage (Über uns)

**URL:** https://www.pension-volgenandt.de/

#### Lighthouse Scores

| Category       | Mobile           | Desktop          |
| -------------- | ---------------- | ---------------- |
| Performance    | **48** (Poor)    | **78** (Average) |
| Accessibility  | **70** (Average) | **61** (Poor)    |
| Best Practices | **73** (Average) | **73** (Average) |
| SEO            | **83** (Average) | **83** (Average) |

#### Core Web Vitals (Mobile)

| Metric      | Value | Rating                   |
| ----------- | ----- | ------------------------ |
| FCP         | 8.2s  | Poor (target: <1.8s)     |
| LCP         | 22.3s | Critical (target: <2.5s) |
| TBT         | 370ms | Poor (target: <200ms)    |
| CLS         | 0     | Good                     |
| Speed Index | 8.2s  | Poor                     |

#### Core Web Vitals (Desktop)

| Metric      | Value | Rating                            |
| ----------- | ----- | --------------------------------- |
| FCP         | 0.8s  | Good                              |
| LCP         | 2.8s  | Needs Improvement (target: <2.5s) |
| TBT         | 180ms | Needs Improvement                 |
| CLS         | 0.034 | Good                              |
| Speed Index | 1.1s  | Good                              |

#### Design Review

- **Hero Image:** Large property photo at top creates a decent first impression, but it is not optimized (contributes to 22.3s LCP on mobile)
- **Typography:** Decorative handwriting-style font ("Kind & Kegel" style) for all headings. While charming, it reduces readability significantly, especially for older users or on small screens
- **Text Alignment:** Body text uses full justification (`text-align: justify`), creating awkward word spacing, particularly on mobile
- **Color Palette:** Olive green (#5a7a2e) navigation on white. Limited contrast. Heading text uses rainbow/multi-color effect which feels dated
- **Photo Gallery:** 12 images in a 3x4 grid with no captions, no alt text, no lazy loading. Mixed formats (JPG, JPEG, PNG) with no optimization
- **YouTube Embed:** Drone footage video adds value but the iframe has no title attribute (accessibility issue)
- **Naturhaeuschen Badge:** Present but oddly placed at the very bottom with empty paragraphs as spacers
- **No booking CTA** on the homepage at all
- **No prices** or availability information
- **No guest reviews** or testimonials
- **Footer:** Minimal - just "Druckversion | Sitemap" and "Login". No contact info, no address, no social links

#### SEO Analysis

| Element          | Status                                   |
| ---------------- | ---------------------------------------- |
| Title            | Present: "Pension Volgenandt - Über uns" |
| Meta Description | Present (good)                           |
| Canonical URL    | **MISSING**                              |
| Structured Data  | **NONE** (critical for hospitality)      |
| H1 Tags          | 1 (correct)                              |
| Images w/o alt   | **16 of 17** (94%)                       |
| Open Graph       | Present                                  |
| hreflang         | Missing                                  |
| Impressum link   | **MISSING** (legally required in DE)     |

#### Page Rating: **3/10**

**Strengths:** Warm welcome text, nice property photos, YouTube drone video
**Weaknesses:** Catastrophic mobile performance (22.3s LCP), no booking CTA, no structured data, nearly all images lack alt text, dated design, no Impressum

---

### 2. Ferienwohnungen & Zimmer (Apartments & Rooms)

**URL:** https://www.pension-volgenandt.de/ferienwohnungen-zimmer/

#### Lighthouse Scores (Mobile)

| Category       | Score   | Rating  |
| -------------- | ------- | ------- |
| Performance    | **67**  | Average |
| Accessibility  | **58**  | Poor    |
| Best Practices | **100** | Good    |
| SEO            | **83**  | Average |

#### Core Web Vitals (Mobile)

| Metric      | Value | Rating   |
| ----------- | ----- | -------- |
| FCP         | 3.2s  | Poor     |
| LCP         | 8.0s  | Critical |
| TBT         | 0ms   | Good     |
| CLS         | 0     | Good     |
| Speed Index | 4.8s  | Poor     |

#### Design Review

- **"Online Buchung" Button:** Present at the top - the ONLY page with a booking CTA. It links to an external beds24.com booking system
- **Room Listings:** 4 accommodation types listed vertically (Ferienwohnung Emil's Kuhwiese, Ferienwohnung Schöne Aussicht, Appartementzimmer, Doppel- und Einzelzimmer)
- **Room Descriptions:** Text-only descriptions without visual hierarchy. No icons for amenities. No pricing per room type
- **Photo Galleries:** Each room has a thumbnail gallery carousel. Some images have alt text (Schöne Aussicht, Doppelzimmer), but the first apartment has **zero** alt text on all images
- **Pricing Table:** Only shows extra costs (breakfast, dog fee, etc.) but **no room base prices** - a major conversion killer
- **Typos Found:** "Sclafzimmer 1" instead of "Schlafzimmer 1", "Schlazimmer 2" instead of "Schlafzimmer 2"
- **Multiple H1 Tags:** 5 H1 tags on one page (should be exactly 1)
- **No comparison table** between room types
- **No availability calendar** or date picker

#### SEO Analysis

| Element          | Status              |
| ---------------- | ------------------- |
| Title            | Present             |
| Meta Description | Present             |
| Canonical URL    | **MISSING**         |
| Structured Data  | **NONE**            |
| H1 Tags          | **5 (should be 1)** |
| Images w/o alt   | **64 of 65** (98%)  |
| Room Schema      | **MISSING**         |

#### Page Rating: **4/10**

**Strengths:** Has a booking link, decent room photos, additional costs table
**Weaknesses:** No room prices, 98% images lack alt text, 5 H1 tags, no structured data, no amenity icons, typos, no comparison functionality

---

### 3. Kind & Kegel (Kids & Family)

**URL:** https://www.pension-volgenandt.de/kind-kegel/

#### Design Review

- **Layout:** Alternating image/text cards in a 2-column grid. This is the best-designed page on the site
- **Content:** 6 family-friendly features highlighted (children's vehicles, playground, garden, toys, highchairs, children's beds)
- **Photos:** Warm, authentic photos showing actual amenities
- **Typography:** Same decorative font for headings, which works better here for a playful theme
- **Structure:** Clear H2 headings for each feature
- **No CTA** to book or check rooms

#### Estimated Lighthouse Scores (Based on Template Similarity)

| Category       | Estimated Score |
| -------------- | --------------- |
| Performance    | ~65-70          |
| Accessibility  | ~60-65          |
| Best Practices | ~100            |
| SEO            | ~83             |

#### Page Rating: **5/10**

**Strengths:** Most visually appealing page, good content structure, emotionally engaging
**Weaknesses:** No CTA, same template limitations apply, missing alt text, no structured data

---

### 4. Aktivitaeten (Activities)

**URL:** https://www.pension-volgenandt.de/aktivit%C3%A4ten/

#### Design Review

- **Layout:** Same alternating card layout as Kind & Kegel
- **Content:** 6 local activities with descriptions and "Mehr Informationen" (More Information) links to external sites
- **External Links:** All open to relevant external sites (Bärenpark, Museum, Castle, Draisine, Vitalpark, Sielmann Foundation) - good for local context
- **Intro Text:** Bold text linking to the Eichsfeld touring portal
- **Photos:** Decent quality images of each attraction
- **URL Issue:** Contains umlaut (ä) in URL - should use ASCII-safe slugs for better SEO

#### Page Rating: **4.5/10**

**Strengths:** Good local content, useful external links, nice card layout
**Weaknesses:** Umlaut in URL, no map showing locations relative to pension, no distances listed, template limitations

---

### 5. Ein kleiner Umweltgedanke (Environmental)

**URL:** https://www.pension-volgenandt.de/ein-kleiner-umweltgedanke/

#### Design Review

- **Layout:** Same alternating card layout
- **Content:** 6 environmental initiatives (solar energy, bio sewage, recycling, composting, insect protection, ecosystem)
- **Unique Selling Point:** This page showcases a genuine differentiator - the eco-friendly approach
- **No H1 Heading:** The page lacks a main heading entirely (only H2s inside cards)
- **No eco-certification badges** or official sustainability metrics

#### Page Rating: **4/10**

**Strengths:** Unique content differentiator, authentic environmental commitment
**Weaknesses:** No page heading, no eco-certification proof, not prominently featured, template limitations

---

### 6. Kontakt (Contact)

**URL:** https://www.pension-volgenandt.de/kontakt/

#### Lighthouse Scores (Mobile)

| Category       | Score   | Rating  |
| -------------- | ------- | ------- |
| Performance    | **67**  | Average |
| Accessibility  | **61**  | Poor    |
| Best Practices | **100** | Good    |
| SEO            | **83**  | Average |

#### Core Web Vitals (Mobile)

| Metric      | Value | Rating   |
| ----------- | ----- | -------- |
| FCP         | 3.2s  | Poor     |
| LCP         | 7.4s  | Critical |
| TBT         | 0ms   | Good     |
| CLS         | 0     | Good     |
| Speed Index | 4.9s  | Poor     |

#### Design Review

- **Contact Info:** Name, address, phone, mobile, email listed clearly - good
- **Contact Form:** Basic form with Name, Email, Message + CAPTCHA. Functional but visually dated
- **CAPTCHA:** Old-style image CAPTCHA that is difficult to read - likely causes user friction and abandonment
- **Data Consent Checkbox:** Present - GDPR compliant
- **Links:** Datenschutzerklarung and AGB links at the bottom
- **Datenschutzerklarung Link:** Points to an editor URL (https://128.sb.mywebsite-editor.com/...) - **broken/internal link exposed**
- **No Google Map** embedded (users cannot see where the pension is located)
- **No click-to-call** on phone numbers (not wrapped in `tel:` links)
- **No directions** or "How to get here" information
- **Form labels** not properly associated with inputs (accessibility issue)

#### Page Rating: **3/10**

**Strengths:** Contact info clearly displayed, GDPR consent checkbox
**Weaknesses:** No map, broken Datenschutz link, no click-to-call, old-style CAPTCHA, no directions, form accessibility issues

---

## Cross-Site Issues

### Critical Legal Issues (Germany-Specific)

| Issue                     | Status                                           | Severity                                                                                                         |
| ------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| **Impressum**             | **MISSING entirely**                             | **CRITICAL** - legally mandatory for commercial German websites (TMG §5). Risk of Abmahnung (legal warning/fine) |
| **Datenschutzerklarung**  | Link broken on Contact page (editor URL exposed) | **HIGH** - GDPR requirement                                                                                      |
| **Cookie Consent Banner** | **MISSING**                                      | **HIGH** - GDPR/ePrivacy requirement, especially with YouTube embed setting cookies                              |
| **AGB**                   | Link present on Contact page                     | OK                                                                                                               |

### Technical Issues (All Pages)

| Issue                            | Impact              | Details                                                                                               |
| -------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------- |
| No canonical URLs                | SEO                 | Risk of duplicate content                                                                             |
| No structured data / Schema.org  | SEO                 | No LodgingBusiness, no FAQPage, no LocalBusiness schema. Invisible to Google Travel, Knowledge Panels |
| `maximum-scale=1` in viewport    | Accessibility       | Prevents user zoom - violates WCAG 2.1                                                                |
| No semantic HTML landmarks       | Accessibility       | No `<main>`, `<nav>` (proper), `<footer>`, `<header>` elements                                        |
| Images without alt text          | SEO + Accessibility | 80+ images across site with no alt text. Nearly 95% coverage gap                                      |
| No lazy loading on images        | Performance         | All images load at once                                                                               |
| No WebP/AVIF image formats       | Performance         | All images are JPG/JPEG/PNG, some uncompressed                                                        |
| No image width/height attributes | Performance         | Causes CLS issues                                                                                     |
| Render-blocking resources        | Performance         | CSS and JS blocking first paint                                                                       |
| No cache headers                 | Performance         | 5.5 MB of uncached resources                                                                          |
| Unused JavaScript (~613 KiB)     | Performance         | Dead code from website builder                                                                        |
| Unused CSS (~89 KiB)             | Performance         | Dead code from website builder                                                                        |
| No CSP headers                   | Security            | No Content-Security-Policy                                                                            |
| No HSTS headers                  | Security            | No HTTP Strict Transport Security                                                                     |
| Console errors                   | Quality             | Broken image URL reference on homepage                                                                |
| Non-crawlable links              | SEO                 | `javascript:` links for print and view switching                                                      |
| Third-party cookies              | Privacy             | YouTube embed sets tracking cookies without consent                                                   |

### Design Issues (All Pages)

| Issue                       | Impact           | Details                                                                            |
| --------------------------- | ---------------- | ---------------------------------------------------------------------------------- |
| Dated visual design         | Trust/Conversion | Website builder template looks circa 2015. Does not inspire confidence for booking |
| Decorative heading font     | Readability      | Handwriting-style font reduces scanability                                         |
| Multi-color heading text    | Professionalism  | Rainbow-colored heading text looks unprofessional                                  |
| Justified text alignment    | Readability      | Creates awkward spacing, especially on mobile                                      |
| No consistent CTA           | Conversion       | "Book Now" button only appears on rooms page                                       |
| No pricing visible          | Conversion       | Room prices completely absent - forces users to leave site                         |
| No guest reviews            | Trust            | No testimonials, no Booking.com/Google review integration                          |
| No footer with contact info | UX               | Footer contains only print/sitemap/login links                                     |
| Touch targets too small     | Mobile UX        | Navigation and gallery thumbnails too small for mobile tapping                     |
| Color contrast insufficient | Accessibility    | Several text/background combinations fail WCAG AA                                  |

---

## Lighthouse Score Summary

### Mobile Scores

| Page        | Perf.    | Access.  | Best Pr. | SEO      | Avg      |
| ----------- | -------- | -------- | -------- | -------- | -------- |
| Homepage    | 48       | 70       | 73       | 83       | **68.5** |
| Rooms       | 67       | 58       | 100      | 83       | **77.0** |
| Kontakt     | 67       | 61       | 100      | 83       | **77.8** |
| **Average** | **60.7** | **63.0** | **91.0** | **83.0** | **74.4** |

### Desktop Scores (Homepage)

| Page     | Perf. | Access. | Best Pr. | SEO |
| -------- | ----- | ------- | -------- | --- |
| Homepage | 78    | 61      | 73       | 83  |

---

## Overall Rating Per Page

| Page                     | Rating (1-10) | Summary                                                                        |
| ------------------------ | ------------- | ------------------------------------------------------------------------------ |
| Homepage (Über uns)      | **3.0**       | Catastrophic mobile performance, no CTA, no structured data, missing Impressum |
| Ferienwohnungen & Zimmer | **4.0**       | Has booking link but no prices, 5 H1 tags, 98% images lack alt text, typos     |
| Kind & Kegel             | **5.0**       | Best visual page, good content, but no CTA and template limitations            |
| Aktivitaeten             | **4.5**       | Useful local content, decent layout, umlaut URL issue                          |
| Umweltgedanke            | **4.0**       | Nice differentiator but no page heading, underutilized                         |
| Kontakt                  | **3.0**       | Broken links, no map, no click-to-call, old CAPTCHA, form a11y issues          |

### **Overall Website Rating: 3.5 / 10**

---

## Recommendations (Priority Order)

### P0 - Critical / Legal (Do Immediately)

1. **Add Impressum page** - Legally mandatory under German Telemediengesetz (TMG) §5. Include: full name, address, phone, email, tax ID, responsible person. Risk of Abmahnung if not addressed immediately
2. **Fix Datenschutzerklarung** - Currently links to internal editor URL. Must be a proper, accessible page with GDPR-compliant privacy policy
3. **Add Cookie Consent Banner** - YouTube embed sets cookies. GDPR and ePrivacy Directive require consent before non-essential cookies

### P1 - High Priority (SEO & Performance)

4. **Add structured data (Schema.org)** - Implement `LodgingBusiness` schema with property info, rooms, amenities, pricing, contact. This enables rich results in Google Search and Google Travel
5. **Add alt text to ALL images** - Currently ~95% of images lack alt text. This is both an SEO and accessibility failure. Describe each image meaningfully
6. **Fix H1 tag structure** - Each page should have exactly 1 H1. The rooms page has 5. Use H2/H3 for sub-sections
7. **Add canonical URLs** to every page
8. **Add room pricing** - Visitors leave when they can't find prices. Display base price per night for each room type
9. **Optimize images** - Convert to WebP format, add explicit width/height, implement lazy loading, compress aggressively. This alone could improve mobile LCP from 22s to under 5s
10. **Remove `maximum-scale=1`** from viewport meta - allows user zoom (WCAG requirement)

### P2 - High Impact (Conversion & UX)

11. **Add prominent "Book Now" CTA** on every page, especially the homepage. Make it sticky in the header
12. **Embed Google Map** on the Contact page with the pension's location
13. **Add click-to-call links** - Wrap phone numbers in `<a href="tel:+493605542775">`
14. **Display guest reviews** - Integrate Google Reviews or manual testimonials near booking CTAs
15. **Add room comparison** - Side-by-side comparison of room types with amenities, capacity, and pricing
16. **Add directions** - "How to get here" section with car/train/bus instructions
17. **Fix typos** - "Sclafzimmer" and "Schlazimmer" on the rooms page

### P3 - Medium Priority (Design & Modernization)

18. **Redesign the website** - The 1&1 website builder template is outdated and severely limits optimization. Consider migrating to a modern framework (Next.js, Astro, or even a modern WordPress theme) that allows:
    - Modern, responsive design with hospitality-focused layouts
    - Full control over performance optimization
    - Proper semantic HTML
    - Schema.org structured data
    - Image optimization pipelines (WebP/AVIF, responsive images)
    - Proper caching and CDN
19. **Replace decorative heading font** with a professional, readable typeface. Use decorative accents sparingly
20. **Remove multi-color text effect** on headings - use a single brand color
21. **Switch from justified to left-aligned text** for better readability
22. **Design a proper footer** with: address, phone, email, social links, Impressum, Datenschutz, quick links
23. **Add breadcrumb navigation** for better UX and SEO
24. **Improve color contrast** to meet WCAG AA (4.5:1 for body text, 3:1 for large text)
25. **Replace image CAPTCHA** on contact form with a modern solution (hCaptcha, reCAPTCHA v3, or honeypot technique)

### P4 - Nice to Have (Future Enhancements)

26. **Add multi-language support** (English at minimum) with hreflang tags - the Eichsfeld region attracts international visitors
27. **Integrate a booking widget** directly on the homepage (date picker, room selector)
28. **Add a photo gallery page** with professional, full-screen images and virtual tours
29. **Create a blog/news section** with seasonal content, local events, travel tips (SEO value)
30. **Add FAQ page** with structured data (FAQPage schema)
31. **Implement service worker** for offline capability
32. **Set up Google Search Console** and submit XML sitemap
33. **Claim and optimize Google Business Profile** with consistent NAP data
34. **Add social media integration** (Instagram feed, Facebook page link)
35. **Implement proper analytics** (privacy-compliant: Plausible, Fathom, or consented Google Analytics)

---

## Competitive Benchmark

For a family-run pension in rural Thuringia, the current website is below the standard expected by modern travelers. Competing platforms like Booking.com, Airbnb, and even other small pension websites now offer:

- Instant price visibility
- Real-time availability
- Professional photography
- Guest reviews and ratings
- Mobile-first responsive design
- Fast loading times (<3s)
- Structured data for rich search results

The current site risks losing direct bookings to OTA platforms (Booking.com, Airbnb) where the pension must pay 15-20% commission per booking.

---

## Quick Wins (Can Be Done Within the 1&1 Builder)

Even without a full redesign, these changes can be made within the existing 1&1 builder:

1. Add Impressum page (legal requirement)
2. Fix Datenschutz link
3. Add alt text to all images
4. Add room prices
5. Add phone link formatting
6. Fix typos
7. Add Google Maps iframe to Contact page
8. Move "Online Buchung" button to all pages
9. Remove justified text alignment
10. Write better meta descriptions for each page

---

_Assessment conducted using Google Lighthouse v13.0.1 via PageSpeed Insights, Playwright browser automation, and manual design review against 2025-2026 hospitality website best practices._
