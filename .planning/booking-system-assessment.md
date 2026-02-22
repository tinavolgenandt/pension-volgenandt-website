# Booking System Assessment - Pension Volgenandt

**Date:** 2026-02-21
**Current System:** Beds24 (beds24.com)
**Owner ID:** 135075

---

## 1. Current Booking System Analysis

### What Is Beds24?

Beds24 is a cloud-based (SaaS) all-in-one Property Management System (PMS), Channel Manager, and Online Booking Engine. It is a Booking.com Premier Partner (10+ consecutive years) and Airbnb Preferred+ Software Partner. Based in Europe with a strong German presence (beds24.de).

### Current Configuration

The "Online Buchung" button on the rooms page links to:

```
https://beds24.com/booking2.php?ownerid=135075&referer=BookingLink%27%3EBook
```

**Issue with the link:** The `referer` parameter is malformed (`BookingLink'>Book`) -- it appears an HTML tag was broken into the URL. This should be fixed.

### Properties in Beds24

The pension has **3 separate properties** configured:

| #   | Property Name                 | Property ID | Room Types                                                      | Status             |
| --- | ----------------------------- | ----------- | --------------------------------------------------------------- | ------------------ |
| 1   | Ferienwohnung Emil's Kuhwiese | 257613      | 1 unit (whole apartment)                                        | Active, bookable   |
| 2   | Ferienwohnung Schöne Aussicht | 257610      | 1 unit (whole apartment)                                        | Active, bookable   |
| 3   | Pension Volgenandt            | 261258      | 3 rooms: Balkonzimmer, Rosengarten Zimmer, Wohlfühl-Appartement | Mixed availability |

### Rooms on Website vs. Rooms in Booking System

| Website Page                  | Beds24 Booking                             | Bookable?            |
| ----------------------------- | ------------------------------------------ | -------------------- |
| Ferienwohnung Emil's Kuhwiese | Yes (propid 257613)                        | Yes                  |
| Ferienwohnung Schöne Aussicht | Yes (propid 257610)                        | Yes                  |
| Appartementzimmer             | Not found (likely = Wohlfühl-Appartement?) | Partially            |
| Doppelzimmer                  | Not in booking system                      | **No**               |
| Einzelzimmer                  | Not in booking system                      | **No**               |
| --                            | Balkonzimmer (in Beds24 only)              | Yes (when available) |
| --                            | Rosengarten Zimmer (in Beds24 only)        | Yes (when available) |

**Key finding:** There is a mismatch between what's shown on the website and what's bookable. Some rooms visible on the website are not bookable online, and some bookable rooms (Balkonzimmer, Rosengarten Zimmer) are not described on the website. This is confusing for guests.

### Pricing Observed

| Room                          | Price (2 nights)             | Per Night |
| ----------------------------- | ---------------------------- | --------- |
| Ferienwohnung Emil's Kuhwiese | EUR 140.00                   | ~EUR 70   |
| Rosengarten Zimmer            | ab EUR 110.00                | ~EUR 55   |
| Others                        | Not available for test dates | --        |

**Problem:** Prices are only visible AFTER entering the Beds24 booking system. No prices appear on the pension website itself.

### Extras / Breakfast

- **Breakfast is mentioned as an amenity** ("Frühstück möglich" / "Speisen und Getränke") on some rooms -- but only as a text indicator, NOT as a bookable add-on with pricing
- **No upsell items configured** despite Beds24 supporting up to 20 upsell items per property
- The website lists breakfast at EUR 10.00 and Genießer Frühstück at EUR 15.00, but these cannot be added during the booking process
- BBQ set (EUR 10.00) and dog fee (EUR 10.00) also not bookable as extras

### UX Issues with Current Booking Flow

| Issue                                | Severity | Details                                                                                                       |
| ------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------- |
| **External redirect**                | High     | Clicking "Online Buchung" opens beds24.com in a new tab, breaking the browsing experience. Should be embedded |
| **No booking CTA on homepage**       | High     | Only the rooms page has the booking link                                                                      |
| **No prices on website**             | High     | Guests must enter the booking system to discover any pricing                                                  |
| **Room name mismatch**               | Medium   | Website and booking system use different room names                                                           |
| **No extras bookable**               | Medium   | Breakfast, BBQ set, dog fee not offered during booking                                                        |
| **Broken referer parameter**         | Low      | URL has malformed HTML in the referer param                                                                   |
| **Nights dropdown: 1-365**           | Low      | Unreasonably long dropdown, should be capped at 30-60                                                         |
| **No room descriptions**             | Medium   | Beds24 shows only amenity checklists, no descriptive text                                                     |
| **"powered by Beds24.com" branding** | Low      | Reveals the booking backend, looks less professional                                                          |
| **No price breakdown**               | Medium   | Shows only total, not per-night rate                                                                          |

### What Beds24 Does Well (Current)

- German language interface working correctly
- Photo carousels per property/room
- Amenity icons with checkmarks
- Availability calendar per room
- Cancellation policy link present
- Date picker and guest count selectors
- Multiple room quantity selector for Rosengarten Zimmer
- Clean, functional (if basic) UI

---

## 2. Beds24 Capabilities (Not Currently Used)

Beds24 offers many features the pension is not utilizing:

| Feature                               | Available?      | Currently Used?          |
| ------------------------------------- | --------------- | ------------------------ |
| Embeddable booking widget             | Yes             | No (using external link) |
| Upsell items (breakfast, extras)      | Yes (up to 20)  | No                       |
| Channel manager (Booking.com, Airbnb) | Yes (API-based) | Unknown                  |
| Automated guest messaging             | Yes             | Unknown                  |
| Payment processing (Stripe, PayPal)   | Yes             | Unknown                  |
| Dynamic pricing                       | Yes             | Unknown                  |
| Custom booking page branding          | Yes (paid)      | No                       |
| Mobile app for management             | Yes             | Unknown                  |
| Invoicing                             | Yes             | Unknown                  |

### Beds24 Pricing (Current Rates)

| Component                                | Cost            |
| ---------------------------------------- | --------------- |
| Base monthly fee                         | EUR 12.90/month |
| Per room                                 | EUR 2.60/month  |
| Per channel link (per room type per OTA) | EUR 0.55/month  |
| Custom subdomain (remove branding)       | EUR 19.00/month |
| Personal onboarding                      | from EUR 79.00  |

**Estimated cost for current setup (3 properties, ~5-6 room types):**

- Base: EUR 12.90
- Rooms: ~6 x EUR 2.60 = EUR 15.60
- Channel manager (if using Booking.com + Airbnb): ~6 x 2 x EUR 0.55 = EUR 6.60
- **Total: ~EUR 35/month** (without custom branding)

---

## 3. Alternatives Comparison

### Comparison Matrix

| System                    | Monthly Cost (5-8 rooms)     | Self-Hosted | API Channel Mgr | Direct Booking | Extras/Breakfast    | German           | Ease of Use |
| ------------------------- | ---------------------------- | ----------- | --------------- | -------------- | ------------------- | ---------------- | ----------- |
| **Beds24** (current)      | EUR 20-35                    | No          | Yes             | Yes            | Yes (20 items)      | Yes              | Medium      |
| **Smoobu**                | EUR 35                       | No          | Yes             | Yes            | Basic               | Yes (native)     | Easy        |
| **DiBooq**                | EUR 16 + 0.9% commission     | No          | Yes             | Yes            | Unknown             | Yes (German co.) | Easy        |
| **QloApps**               | Free core + USD 30/mo CM     | Yes         | Yes (paid)      | Yes            | Yes                 | Partial          | Hard        |
| **HotelDruid**            | Free                         | Yes         | Limited         | Basic          | Yes + POS           | No German        | Hard        |
| **Nobeds**                | Free (up to 10 rooms)        | No          | Yes (limited)   | Yes            | Basic               | Unknown          | Easy        |
| **HBook** (WordPress)     | USD 79 one-time              | Yes         | iCal only       | Yes            | Limited             | Yes (WPML)       | Medium      |
| **MotoPress** (WordPress) | USD 139/year                 | Yes         | iCal only       | Yes            | Yes                 | Yes (WPML)       | Medium      |
| **Lodgify**               | USD 16-59                    | No          | Yes             | Yes + website  | Via integrations    | Yes              | Easy        |
| **eviivo**                | EUR 40-70 + EUR 0.50/booking | No          | Yes             | Yes            | Yes (syncs to OTAs) | Yes              | Medium      |
| **Little Hotelier**       | EUR 89+                      | No          | Yes             | Yes            | Yes                 | Yes              | Easy        |
| **Cloudbeds**             | USD 108+                     | No          | Yes             | Yes            | Yes                 | Yes              | Medium      |

### Detailed Alternative Reviews

#### Self-Hosted Free Options

**QloApps (Open Source)**

- Free core PMS + booking engine + website
- Channel manager is a PAID add-on: USD 30/month
- Self-hosted (requires PHP/MySQL server)
- Supports extras/services as bookable add-ons
- Total cost with channel manager: ~USD 30/month + hosting (~EUR 5-10/month) = **EUR 35-40/month**
- Verdict: **More expensive than Beds24 when you add channel manager, and requires technical maintenance**

**HotelDruid (Open Source)**

- Completely free, self-hosted
- Includes POS system for bar/restaurant (useful for breakfast!)
- Channel management limited (Booking.com via Octorate only)
- **No German language support**
- Very dated interface, requires technical skills
- Verdict: **Not viable for a non-technical German pension owner**

**Nobeds (Free Cloud)**

- Free for up to 10 rooms including basic channel manager
- 30+ OTA connections
- BUT: 3.3/5 user rating, reports of bugs, poor support
- Free plan limited to 3 channel connections
- Verdict: **Too risky for production use. Bugs in tax/VAT calculations are unacceptable for a German business**

#### WordPress Self-Hosted Options

**HBook (WordPress Plugin)**

- USD 79 one-time purchase
- Good direct booking system
- **iCal-only sync** with OTAs (unreliable, 15min-hours delay, no price sync)
- Can combine with Smoobu for API sync (+EUR 35/month)
- Verdict: **Good for direct bookings only. For OTA sync, total cost exceeds Beds24**

**MotoPress Hotel Booking (WordPress)**

- USD 139/year
- Similar to HBook but annual pricing
- iCal-only sync
- Verdict: **Same limitations as HBook**

#### Cloud Alternatives (Paid)

**Smoobu (German Company)**

- EUR 35/month (Pre-Paid plan, no commission)
- Native German interface and support
- Easiest to use of all options
- Good channel manager (API-based)
- Limited extras/upsell capabilities
- Verdict: **Best choice if simplicity is the #1 priority. Slightly more expensive than Beds24 with fewer features**

**DiBooq (German Company)**

- From EUR 16/month + 0.9% booking commission
- German-focused, simple interface
- Good channel manager
- Relatively new, smaller user base
- Verdict: **Affordable alternative, but commission adds up and platform maturity is uncertain**

**eviivo**

- EUR 40-70/month + EUR 0.50 per booking
- Uniquely syncs extras (breakfast) to OTAs
- Designed specifically for B&Bs
- Good German support
- Verdict: **Best extras management, but per-booking fee makes it expensive**

**Little Hotelier / Cloudbeds**

- EUR 89-108+/month
- Verdict: **Overkill and too expensive for a 5-8 room pension**

---

## 4. Recommendation

### Primary Recommendation: Keep Beds24, Optimize Configuration

Beds24 is already the correct choice for Pension Volgenandt. It offers the best price-to-feature ratio for small properties, has strong German support, and the pension already has an active account. **The problem is not the system -- it's the configuration.**

#### Immediate Improvements (No Cost)

1. **Configure upsell items** for breakfast (EUR 10 / EUR 15), dog fee (EUR 10), BBQ set (EUR 10)
2. **Embed the booking widget** on the website instead of linking to external beds24.com
3. **Add the booking widget to ALL pages**, not just the rooms page
4. **Fix the broken booking URL** (remove malformed referer parameter)
5. **Align room names** between website and Beds24 (or add descriptions in Beds24)
6. **Add room descriptions** in Beds24 booking pages
7. **Show prices on the website** directly (at least starting prices per room type)
8. **Limit the nights dropdown** to a reasonable max (30-60 nights)
9. **Configure all rooms** that should be bookable online -- consider adding Doppelzimmer and Einzelzimmer with appropriate availability controls

#### Managing Occupancy / Preventing Overbooking

Beds24 supports several ways to control which rooms are bookable without stressing the owner:

- **Close/open rooms by date:** Manually block dates to keep rooms unavailable
- **Allotment control:** Set how many of each room type are available online (e.g., make only 2 of 4 double rooms bookable, keeping 2 for walk-ins/phone bookings)
- **Minimum stay rules:** Already in use (2-night minimum on apartments)
- **Max occupancy per property:** Set a cap on total guests across all rooms
- **Auto-close on threshold:** Automatically close availability when a certain number of rooms are booked

#### Optional Paid Improvement

- **Custom booking subdomain** (EUR 19/month): Removes "powered by Beds24.com" branding and gives a professional booking URL like `buchen.pension-volgenandt.de`

### Alternative Recommendation: Smoobu (If Switching)

If the owner finds Beds24 too complex to manage and wants to start fresh:

- **Smoobu at EUR 35/month** offers the simplest German-language experience
- Native German company with German phone support
- Easier initial setup
- Trade-off: Fewer features, weaker extras management

### NOT Recommended

| Option                                            | Reason                                                                    |
| ------------------------------------------------- | ------------------------------------------------------------------------- |
| Self-hosted (QloApps, HotelDruid)                 | Requires technical maintenance, not cheaper when channel manager is added |
| Free options (Nobeds)                             | Unreliable, buggy, risky for a real business                              |
| WordPress plugins (HBook, MotoPress)              | iCal-only sync is inadequate for multi-channel management                 |
| Enterprise solutions (Cloudbeds, Little Hotelier) | Overpriced for 5-8 rooms                                                  |

---

## 5. Summary

| Aspect                     | Current State                       | Recommended Action                         |
| -------------------------- | ----------------------------------- | ------------------------------------------ |
| **Booking System**         | Beds24 (correct choice)             | Keep, optimize configuration               |
| **Booking Link**           | External redirect, broken URL       | Embed widget, fix URL                      |
| **Booking CTA**            | Only on rooms page                  | Add to every page                          |
| **Pricing**                | Hidden in booking system            | Show on website                            |
| **Extras (Breakfast)**     | Not bookable                        | Configure upsell items in Beds24           |
| **Room Management**        | 3 of ~7 rooms bookable              | Add more rooms with allotment controls     |
| **Channel Sync**           | Unknown if Booking/Airbnb connected | Verify and configure API connections       |
| **Occupancy Control**      | Rooms excluded from system entirely | Use Beds24 allotment controls instead      |
| **Estimated Monthly Cost** | ~EUR 35/month                       | Same (no additional cost for improvements) |

**Bottom line:** The pension already has the right booking system. The investment should go into **properly configuring Beds24** and **integrating it better with the website**, not into switching platforms. Most improvements listed above are free and can be done within the existing Beds24 account.

---

_Assessment based on live testing of the Beds24 booking system via Playwright browser automation and comprehensive market research of 14 alternative booking platforms._
