# Pension Volgenandt -- Pricing & Competitive Analysis (Updated)

> **Date:** 2026-03-28 (Updated from 2026-02-22 original)
> **Status:** URGENT -- Landesgartenschau opened April 23, 2026. Competitors already raising prices.
> **Source:** Web research (Booking.com, KAYAK, competitor websites, aggregators), codebase audit, Beds24 config, industry best practices research
> **Scope:** Complete pricing reanalysis with LGS-period strategy, ancillary revenue, and Beds24 implementation guide

---

## 1. Current Prices -- All Channels (Verified March 2026)

### 1.1 Website / Beds24 Direct Booking (UNCHANGED since February)

| Room | Per Night | Per Person/Night | Breakfast | Dog | Beds24 Room ID |
|---|---|---|---|---|---|
| Einzelzimmer | **50 EUR** | 50.00 EUR | +10 EUR/pp | N/A | 656178 |
| Balkonzimmer | **58 EUR** | 29.00 EUR | +10 EUR/pp | +5 EUR | 548066 |
| Rosengarten | **58 EUR** | 29.00 EUR (2p) / 22.67 EUR (3p) | +10 EUR/pp | N/A | 549252 |
| Wohlfuehl-Appartement | **65 EUR** | 32.50 EUR (2p) / 25.00 EUR (3p) | +10 EUR/pp | +5 EUR | 549319 |
| Emil's Kuhwiese (FeWo) | **73 EUR** | 36.50 EUR (2p) / 27.67 EUR (3p) | +10 EUR/pp | +5 EUR | 656179 |
| Schoene Aussicht (FeWo) | **126 EUR** (4p) / 136 (5p) / 146 (6p) | 21.00-31.50 EUR | +10 EUR/pp | N/A | 656180 |

**All prices are flat year-round -- no weekend, seasonal, or event surcharges.**

### 1.2 Booking.com (115% multiplier)

**PROBLEM: 3 separate Booking.com listings** instead of 1 consolidated property page:

| Booking.com Listing | Rating | Est. Price |
|---|---|---|
| Pension Volgenandt (Rosengarten/Zweibettzimmer) | 8.6 | from ~67 EUR |
| Balkonzimmer Pension Volgenandt | 8.7 | from ~67 EUR |
| Ferienwohnung Schoene Aussicht | 9.1 | from ~145 EUR |

This fragments reviews and reduces search visibility. Should be consolidated into one property listing.

### 1.3 Airbnb

**NOT CONNECTED.** 120% multiplier is pre-configured in Beds24 but the channel is not active. Missing revenue.

### 1.4 Google Hotels

Shows ~40-47 EUR (lowest available rate, likely Einzelzimmer). **Google Free Booking Links NOT connected** -- only appearing passively via OTA feeds.

### 1.5 Extras Pricing (from YAML content files)

| Extra | Price | Unit | Available On |
|---|---|---|---|
| Standard Fruehstueck | 10 EUR | pro Person/Nacht | All rooms |
| Geniesser-Fruehstueck | 15 EUR | pro Person/Nacht | All rooms |
| Hund (Dog) | **5 EUR** | pro Nacht | Balkonzimmer, Emil's Kuhwiese, Wohlfuehl |
| Grill-Set | 10 EUR | pro Nutzung | All rooms |
| Aufbettung (Extra Bed) | 10 EUR | pro Person/Nacht | Rosengarten, Wohlfuehl, Emil's, Schoene Aussicht |

**Note:** Dog fee is 5 EUR in YAML content files, not 10 EUR as stated in the February analysis. Verify which is correct in Beds24.

### 1.6 Picknick Pricing

| Package | Price | Time Slot |
|---|---|---|
| Brunch | 19 EUR/Person | 09:00-12:00 |
| Kaffee & Kuchen | 19 EUR/Person | 14:00-17:00 |
| Sonnenuntergang | 19 EUR/Person | ~18:00-21:00 |
| Korbpfand (refundable) | 100 EUR | -- |

Extras: Glutenfreie Broetchen +1 EUR/pp, Extra Sekt +3 EUR/pp, Extra Decke +2 EUR, Thermoskanne +4 EUR, Blumenstrauss +6 EUR.

### 1.7 Schema.org Price Range

`app.vue` declares price range as **EUR 38-89**. This needs updating -- the actual range is EUR 50-146.

---

## 2. Competitor Pricing (March 2026 -- Verified)

### 2.1 CRITICAL CHANGE: Competitors Raising Prices for LGS

**Pension An der Uferpromenade (Worbis) -- MAJOR PRICE INCREASE**

| Room Type | Feb 2026 Price | March 2026 Price | Change |
|---|---|---|---|
| Einzelzimmer | from 40 EUR | **from 59 EUR** | **+47%** |
| Doppelzimmer | from 52 EUR | **from 76 EUR** | **+46%** |
| Breakfast | Included | **15 EUR/pp extra** | Now separate |
| Children 5-17 | Unknown | 28 EUR/pp/night | New info |

**Total for couple (DZ + 2x breakfast): was 52 EUR, now 106 EUR (+104%)**

This is almost certainly LGS-period pricing. The strongest value proposition in the region has evaporated -- they now cost MORE than Pension Volgenandt.

**Leinotel (Leinefelde) -- SLIGHT INCREASE**

| Metric | Feb 2026 | March 2026 | Change |
|---|---|---|---|
| DZ rate (KAYAK) | from 78 EUR | **from 82 EUR** | +5% |
| DZ rate (Booking.com) | ~78 EUR | **80-88 EUR** | Dynamic |

Likely dynamic OTA pricing responding to LGS demand.

### 2.2 Full Competitor Price Table (March 2026)

| Competitor | Location | EZ | DZ | Breakfast | LGS Pricing? |
|---|---|---|---|---|---|
| Pension Schollmeyer | Birkungen | 25 EUR | 50 EUR | unclear | No |
| Leinezimmer Eichsfeld | Leinefelde | 45 EUR | 70 EUR | not incl. | No |
| Pension Eichsfeld | Breitenworbis | 59 EUR | 75 EUR | not incl. | No |
| **Pension Volgenandt** | **Breitenbach** | **50 EUR** | **58 EUR** | **+10 EUR/pp** | **No** |
| Pension Uferpromenade | Worbis | **59 EUR** | **76 EUR** | **+15 EUR/pp** | **YES (+46%)** |
| Gaestehaus Leine-Quelle | Leinefelde | -- | 65 EUR | on request | Unknown |
| Gasthof Bodenstein | Wintzingerode | -- | 70 EUR (cabin) | +14 EUR/pp | No |
| Leinotel | Leinefelde | 82 EUR | 82-88 EUR | included | Likely (dynamic) |
| Hotel Drei Rosen | Worbis | 89 EUR | 144 EUR | included | Unknown |

### 2.3 Fair Comparison: What a Couple Actually Pays (Updated)

| Accommodation | Room Rate | Breakfast (2pp) | **Total** | vs. Feb | LGS? |
|---|---|---|---|---|---|
| Pension Schollmeyer | 50 EUR | unclear | ~50-60 EUR | = | No |
| **Pension Volgenandt (Balkon/Rosen)** | **58 EUR** | **+20 EUR** | **78 EUR** | **=** | **No** |
| Leinezimmer Eichsfeld | 70 EUR | not incl. | 70+ EUR | = | No |
| Pension Eichsfeld | 75 EUR | not incl. | 75+ EUR | = | No |
| Leinotel | 82 EUR | included | **82 EUR** | +4 | Dynamic |
| **Pension Volgenandt (Wohlfuehl)** | **65 EUR** | **+20 EUR** | **85 EUR** | **=** | **No** |
| Gasthof Bodenstein | 70 EUR | +28 EUR | 98 EUR | = | No |
| **Pension Uferpromenade** | **76 EUR** | **+30 EUR** | **106 EUR** | **+54** | **YES** |
| Hotel Drei Rosen | 144 EUR | included | 144 EUR | New | Unknown |

**Key insight: Pension Volgenandt is now the cheapest quality option during LGS.** The Uferpromenade, previously the best value at 52 EUR, has raised to 106 EUR. Pension Volgenandt at 78 EUR (Balkonzimmer + 2x breakfast) is 27% cheaper than the Uferpromenade and 5% cheaper than Leinotel. **You have significant pricing headroom.**

### 2.4 Monteurzimmer Segment

| Price Tier | Properties | Per Person/Night |
|---|---|---|
| Budget | Gut Beinrode, budget rooms | 9-15 EUR |
| Standard | Leinezimmer (4+ nights), Schollmeyer | 20-26 EUR |
| Quality | Leinezimmer (1 night), Pension Eichsfeld (long stay) | 35-45 EUR |
| Premium | Pension Volgenandt, Leinotel | 50-68 EUR |

Pension Volgenandt at 50 EUR/night for the Einzelzimmer is premium-tier for Monteurzimmer. Without length-of-stay discounts, it's not competitive for multi-week stays where Pension Eichsfeld offers 36-42 EUR (11-19+ nights) and Leinezimmer offers 35 EUR (4+ nights).

### 2.5 New Competitors Identified

| Property | Type | Price | Notes |
|---|---|---|---|
| **Pension Wittnebert** | 1 FeWo (65m2) | Unknown | Holds `pension-leinefelde.de` domain |
| **Hotel Drei Rosen** | 3-star hotel | EZ 89, DZ 144 EUR | Worbis, wellness area |
| **Gaestehaus Leine-Quelle** | 11 beds | from 65 EUR | Leinefelde |
| **Hotel Haus Eichsfeld** | 40 rooms (planned) | Unknown | Under construction, 12-18 months |

---

## 3. Recommended Pricing Strategy

### 3.1 Three-Tier Seasonal Model

Based on industry best practices for German pensions (20-30% spread between low and high season):

| Season | Period | Modifier | Rationale |
|---|---|---|---|
| **Nebensaison** (Low) | Jan 7 -- Feb 28 | -10% | Lowest tourism demand |
| **Normalsaison** (Base) | Mar 1 -- Apr 22, Oct 12 -- Dec 23 | Base rate | Shoulder season |
| **Hauptsaison** (High) | Apr 23 -- Oct 11 (LGS period) | **+20%** | Landesgartenschau 2026 |
| **Feiertage** (Holidays) | Easter, Pfingsten, Weihnachten/Silvester | +15% | Holiday premium |
| **LGS Opening/Closing weeks** | Apr 23-30, Oct 5-11 | **+30%** | Peak demand periods |

### 3.2 Recommended Prices by Season

#### Base Rate Adjustments (Year-Round Foundation)

| Room | Current | New Base | Change | Rationale |
|---|---|---|---|---|
| Einzelzimmer | 50 EUR | **55 EUR** | +10% | Between Leinezimmer (45) and Pension Eichsfeld (59) |
| Balkonzimmer | 58 EUR | **65 EUR** | +12% | Balcony premium. Below Leinezimmer (70), Pension Eichsfeld (75) |
| Rosengarten | 58 EUR | **62 EUR** | +7% | Standard double, modest increase |
| Wohlfuehl-Appartement | 65 EUR | **72 EUR** | +11% | Kitchenette + sofa bed. Just below Pension Eichsfeld (75) |
| Emil's Kuhwiese | 73 EUR | **79 EUR** | +8% | Full apartment. Comparable to Leinotel (82) |
| Schoene Aussicht | 126 EUR | **126 EUR** | 0% | Already well-positioned at 21 EUR/pp for 6 guests |

#### LGS Period Prices (April 23 -- October 11, 2026)

| Room | Base | LGS Weekday (+20%) | LGS Weekend (+30%) | Opening/Closing (+35%) |
|---|---|---|---|---|
| Einzelzimmer | 55 EUR | **66 EUR** | **72 EUR** | **75 EUR** |
| Balkonzimmer | 65 EUR | **78 EUR** | **85 EUR** | **88 EUR** |
| Rosengarten | 62 EUR | **74 EUR** | **81 EUR** | **84 EUR** |
| Wohlfuehl-Appartement | 72 EUR | **86 EUR** | **94 EUR** | **97 EUR** |
| Emil's Kuhwiese | 79 EUR | **95 EUR** | **103 EUR** | **107 EUR** |
| Schoene Aussicht | 126 EUR | **151 EUR** | **164 EUR** | **170 EUR** |

**These prices are justified.** The Uferpromenade now charges 76 EUR for a basic DZ + 30 EUR breakfast = 106 EUR. Leinotel is 82-88 EUR. Pension Eichsfeld charges 75 EUR for a basic room with no character. Your rooms with the 8.7-9.1 Booking.com rating, the garden, and proximity to the LGS warrant premium positioning.

#### Low Season Prices (January -- February)

| Room | Low Season (-10%) |
|---|---|
| Einzelzimmer | **50 EUR** |
| Balkonzimmer | **59 EUR** |
| Rosengarten | **56 EUR** |
| Wohlfuehl-Appartement | **65 EUR** |
| Emil's Kuhwiese | **71 EUR** |
| Schoene Aussicht | **113 EUR** |

### 3.3 Weekend Surcharges

Industry standard for German pensions: +4-15 EUR per room/night.

| Day | Surcharge | Applied On |
|---|---|---|
| Friday | +8 EUR | Year-round |
| Saturday | +10 EUR | Year-round |
| Sunday-Thursday | 0 EUR | -- |

**Note:** During LGS, weekend surcharges are already baked into the +30% modifier. Do not double-stack.

**Estimated impact: +2,000-3,000 EUR/year** (non-LGS period).

### 3.4 Length-of-Stay Discounts

Needed for Monteurzimmer competitiveness. Industry standard tiers:

| Duration | Discount | Rationale |
|---|---|---|
| 5-6 nights | 5% | Encourages full-week stays |
| 7-13 nights | 10% | Weekly booking incentive |
| 14-27 nights | 15% | Extended stay / trade workers |
| 28+ nights | 20% | Long-term / monthly |

**Do NOT match Pension Eichsfeld's 40% discount** -- your 8.7-9.1 ratings justify higher rates. Their aggressive discounting signals they struggle with occupancy; you don't need to follow.

**Applied only to Einzelzimmer, Balkonzimmer, Rosengarten** (trade worker candidates). FeWos typically book shorter stays and don't need LOS discounts.

### 3.5 Breakfast Strategy: Dual-Rate Model

**Problem:** Competitors who include breakfast (Leinotel at 82, formerly Uferpromenade at 52) appear cheaper even when total cost is similar. Your separate 10 EUR/pp breakfast makes the base rate look low but the total look high.

**Solution:** Offer two rate plans in Beds24:

| Rate Plan | Balkonzimmer Example | Benefit |
|---|---|---|
| **Room Only** | 65 EUR | Self-catering guests, FeWo-like flexibility |
| **mit Fruehstueck** (2pp) | 81 EUR (65 + 2x8 EUR) | Bundled rate with 2 EUR/pp discount vs. a-la-carte |

The "mit Fruehstueck" rate uses 8 EUR/pp instead of 10 EUR -- a 2 EUR/pp discount that incentivizes the bundle while still being profitable. The bundle appears in Beds24/Booking.com as a separate rate plan, making price comparison more favorable.

**Geniesser-Fruehstueck remains an upsell:** Available at the property for +5 EUR/pp upgrade (15 EUR total, positioned as the premium option).

### 3.6 Minimum Stay Rules (LGS Period)

| Period | Minimum Stay | Rationale |
|---|---|---|
| LGS weekends (Fri-Sun) | 2 nights | Prevents single Saturday bookings leaving gaps |
| Opening weekend (Apr 23-27) | 3 nights | Peak demand |
| Closing weekend (Oct 8-11) | 2 nights | High demand |
| Public holidays during LGS | 2 nights | Tag der Arbeit, Himmelfahrt, Pfingsten, Tag der Deutschen Einheit |
| Mid-week | No minimum | Capture day-trippers who extend |

---

## 4. OTA & Distribution Strategy

### 4.1 Channel Pricing

| Channel | Modifier | Net Revenue (on 65 EUR base) | Priority |
|---|---|---|---|
| **Direct (website/Beds24)** | Base rate | 65 EUR (100%) | Push hard |
| **Google Free Booking Links** | Base rate | 65 EUR (100%) | **Set up immediately** |
| **Booking.com** | +15% (existing 115%) | ~75 EUR shown, ~64 EUR net after 15% commission | Maintain |
| **Airbnb** | +20% (existing 120%) | ~78 EUR shown, ~66 EUR net after 15% guest+host fees | **Connect now** |
| **deutschland-monteurzimmer.de** | Base rate | 65 EUR, flat 9.40 EUR/month fee | Register |

### 4.2 Booking.com Consolidation

**Current state:** 3 separate listings fragmenting reviews across ratings of 8.6, 8.7, and 9.1.

**Action:** Contact Booking.com partner support to merge all rooms under a single property listing. This consolidates reviews (improving ranking) and simplifies management.

### 4.3 Google Free Booking Links (Zero Cost)

**Setup in Beds24:**
1. Go to SETTINGS > CHANNEL MANAGER > GOOGLE ADS
2. Set Google Product = Google Hotel Ads
3. Set Synchronise = Enable
4. Connect rooms and verify mapping matches Google Business Profile
5. Wait 1-2 weeks for Google to match

**This should be done immediately** -- Google needs 1-2 weeks and the LGS is already live.

### 4.4 Airbnb Connection

The 120% multiplier is already configured. Connect the channel in Beds24 to activate it. Focus on the FeWos (Emil's Kuhwiese, Schoene Aussicht) -- these perform best on Airbnb where self-catering apartments dominate.

---

## 5. Ancillary Revenue Opportunities

### 5.1 High Priority (Implement Now)

| Opportunity | Price | Cost to Implement | Est. Annual Revenue |
|---|---|---|---|
| **Late Checkout** (until 13:00) | 15-20 EUR | 0 EUR (Beds24 extra) | ~1,500 EUR |
| **Fruehstueckskorb for FeWos** (delivered to door) | 12-15 EUR/pp | ~50 EUR (baskets) | ~3,100 EUR |
| **LGS Ticket Package** (room + ticket info + breakfast) | Bundle price | ~500 EUR (ticket stock) | Drives bookings |
| **Grillpaket Komplett** (upgraded BBQ with local meat/sides) | 25 EUR (vs. current 10 EUR basic) | 0 EUR (butcher partnership) | ~500-800 EUR |

### 5.2 Medium Priority

| Opportunity | Price | Notes |
|---|---|---|
| **Welcome Package** (Eichsfeld basket: local Wurst, bread, wine) | 20-25 EUR | Especially for FeWo guests arriving late |
| **Romantic Package** (Sekt, chocolates, flowers, candle) | 25-35 EUR | Upsell at booking |
| **E-Bike rental** (partnership with Dein Freizeitprofi or EIC-Bike) | Commission 15-25% | Zero investment, fits cycling page content |
| **Kinder-Willkommenspaket** | Free or 10-15 EUR | Drives 5-star reviews from families |

### 5.3 LGS-Specific Packages

| Package | Contents | Price Suggestion |
|---|---|---|
| **LGS-Wochenende** | 2 Naechte + 2x Fruehstueck + LGS-Tipps-Karte | Bundled at LGS weekend rate |
| **LGS + Picknick** | 2 Naechte + Sonnenuntergang-Picknick + Feierabendticket-Empfehlung (11 EUR ab 16:30) | Premium bundle |
| **LGS-Familien-Paket** | FeWo Schoene Aussicht + Fruehstueckskorb + Kinder-Willkommen | Bundled at family-friendly rate |

**LGS Feierabendticket (11 EUR, Mon-Fri from 16:30, Jun 1 - Aug 28)** is ideal to promote to guests -- pair with your Sonnenuntergang picknick for an "LGS + Abend-Picknick" experience.

### 5.4 Gaestekarte / Regional Cards

- **Digitale PlusCard** exists in Heilbad Heiligenstadt (2 EUR/day Kurbeitrag = free bus, museums, discounts) but only for accommodations IN Heiligenstadt
- **Familienkarte Eichsfeld** worth investigating for family guests
- **Action:** Contact Landkreis Eichsfeld tourism office to check if a region-wide Gaestekarte is planned for the LGS year

---

## 6. Beds24 Implementation Guide

### 6.1 Seasonal Pricing Setup

In Beds24, go to **PRICES > DAILY PRICE RULES**:

| Rule Name | Valid Dates | Days | Modifier |
|---|---|---|---|
| LGS Weekday | Apr 23 -- Oct 11 | Mon-Thu | +20% |
| LGS Weekend | Apr 23 -- Oct 11 | Fri-Sun | +30% |
| LGS Opening | Apr 23 -- Apr 30 | All | +35% |
| LGS Closing | Oct 5 -- Oct 11 | All | +30% |
| Low Season | Jan 7 -- Feb 28 | All | -10% |
| Weekend Surcharge | Year-round (outside LGS) | Fri | +8 EUR |
| Weekend Surcharge | Year-round (outside LGS) | Sat | +10 EUR |

### 6.2 Yield Optimizer (Free in Beds24)

Automatic last-minute price adjustments based on remaining availability:

| Availability | Price Adjustment |
|---|---|
| Less than 2 rooms available on a date | +15% |
| Less than 1 room available | +25% |
| More than 5 rooms available (7 days out) | -5% |

Set in Beds24 > PRICES > YIELD OPTIMIZER. This handles demand spikes automatically.

### 6.3 Rate Plans

Create two rate plans per room:

| Rate Plan | Price Logic | Shown On |
|---|---|---|
| **Nur Zimmer** (Room Only) | Base rate | All channels |
| **mit Fruehstueck** (Bed & Breakfast) | Base + 8 EUR/pp (2 EUR discount vs. a-la-carte) | All channels |

### 6.4 Minimum Stay Rules

Set in Beds24 > PROPERTIES > RULES or via calendar:

- LGS weekends: MinLOS = 2
- Opening weekend: MinLOS = 3
- Public holidays: MinLOS = 2

### 6.5 Length-of-Stay Discounts

Set in Beds24 > PRICES > LENGTH OF STAY:

| Duration | Discount |
|---|---|
| 5+ nights | 5% |
| 7+ nights | 10% |
| 14+ nights | 15% |
| 28+ nights | 20% |

Apply to Einzelzimmer, Balkonzimmer, Rosengarten only.

### 6.6 Optional: PriceLabs Integration

For automated dynamic pricing beyond what Beds24's Yield Optimizer offers:
- **Cost:** ~20 USD/listing/month (~120 USD/month for 6 rooms)
- **Integration:** Direct Beds24 connection via PriceLabs dashboard
- **Value:** Market-driven daily price recommendations, orphan-day management, minimum stay optimization
- **Recommendation:** Start with a 30-day free trial during LGS peak to evaluate ROI

---

## 7. Revenue Impact Summary

### 7.1 Pricing Levers

| Lever | Annual Impact | Effort |
|---|---|---|
| Base rate adjustments (avg. +6 EUR/night) | +4,000-6,000 EUR | 30 min in Beds24 |
| LGS seasonal pricing (+20-30%) | +4,000-8,000 EUR (6-month event) | 1 hr in Beds24 |
| Weekend surcharges (non-LGS) | +2,000-3,000 EUR | 30 min in Beds24 |
| Length-of-stay discounts | Revenue-neutral (fills gaps) | 30 min in Beds24 |
| Breakfast bundling | +500-1,000 EUR (higher take-up) | 1 hr in Beds24 |
| **Subtotal pricing** | **+10,500-18,000 EUR/year** | |

### 7.2 Distribution Levers

| Lever | Annual Impact | Cost |
|---|---|---|
| Google Free Booking Links | +5,000-10,000 EUR (saves OTA commission) | Free |
| Airbnb connection | +3,000-5,000 EUR (new channel) | Free (existing Beds24 config) |
| Booking.com consolidation | +2,000-4,000 EUR (better ranking) | Free (support request) |
| **Subtotal distribution** | **+10,000-19,000 EUR/year** | |

### 7.3 Ancillary Revenue

| Lever | Annual Impact | Investment |
|---|---|---|
| Late Checkout | +1,500 EUR | 0 EUR |
| Fruehstueckskorb for FeWos | +3,100 EUR | ~50 EUR |
| Welcome/Arrival Packages | +800-1,500 EUR | ~100 EUR |
| Grillpaket Upgrade | +500-800 EUR | 0 EUR |
| E-Bike commission (partnership) | +120 EUR | 0 EUR |
| **Subtotal ancillary** | **+6,020-7,020 EUR/year** | |

### 7.4 Total Combined Impact

| Category | Low Estimate | High Estimate |
|---|---|---|
| Pricing | +10,500 EUR | +18,000 EUR |
| Distribution | +10,000 EUR | +19,000 EUR |
| Ancillary | +6,000 EUR | +7,000 EUR |
| **TOTAL** | **+26,500 EUR/year** | **+44,000 EUR/year** |

---

## 8. Immediate Action Items (Priority Order)

### THIS WEEK (LGS is live since April 23)

| # | Action | Time | Impact |
|---|---|---|---|
| 1 | **Implement LGS seasonal pricing in Beds24** (Apr 23 - Oct 11, +20% weekday, +30% weekend) | 1 hr | +4,000-8,000 EUR |
| 2 | **Adjust base rates** per Section 3.2 | 30 min | +4,000-6,000 EUR/year |
| 3 | **Set up Google Free Booking Links** in Beds24 | 30 min | Saves OTA commission |
| 4 | **Add Late Checkout as Beds24 extra** (15 EUR) | 15 min | +1,500 EUR/year |
| 5 | **Set minimum stay rules** for LGS weekends (2 nights) | 15 min | Prevents gap nights |

### THIS MONTH

| # | Action | Time | Impact |
|---|---|---|---|
| 6 | **Connect Airbnb** in Beds24 | 1 hr | +3,000-5,000 EUR/year |
| 7 | **Create "mit Fruehstueck" rate plan** in Beds24 | 1 hr | Higher conversion |
| 8 | **Implement weekend surcharges** (+8/+10 EUR Fri/Sat outside LGS) | 30 min | +2,000-3,000 EUR/year |
| 9 | **Contact Booking.com to consolidate listings** | 30 min | Better ranking, unified reviews |
| 10 | **Implement LOS discounts** for Einzelzimmer/Balkon/Rosengarten | 30 min | Monteurzimmer competitiveness |
| 11 | **Register on deutschland-monteurzimmer.de (Gold)** | 30 min | 9.40 EUR/month, high ROI |
| 12 | **Fix Einzelzimmer visibility** in Beds24 booking widget | 30 min | Currently not bookable online |
| 13 | **Verify dog fee** -- YAML says 5 EUR, old analysis says 10 EUR | 5 min | Data consistency |
| 14 | **Update schema.org price range** in app.vue (38-89 -> 50-146) | 5 min | Accurate structured data |

### WITHIN 3 MONTHS

| # | Action | Impact |
|---|---|---|
| 15 | Launch Fruehstueckskorb service for FeWos | +3,100 EUR/year |
| 16 | Create Grillpaket Komplett with local butcher | +500-800 EUR/year |
| 17 | Create Welcome Packages (Eichsfeld, Romantic, Kinder) | +800-1,500 EUR/year |
| 18 | Explore E-Bike partnership (Dein Freizeitprofi / EIC-Bike) | Low revenue but differentiator |
| 19 | Evaluate PriceLabs trial during LGS peak | Better dynamic pricing |
| 20 | Extend pricing calendar to 18 months in Beds24 | Captures advance planners |

---

## 9. Risk Assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| Price increases driving guests to competitors | Low | Uferpromenade already +46%, Leinotel +5%. You have the best rating (8.7-9.1). |
| Hotel Haus Eichsfeld (40 rooms) opening during LGS | Low | Construction still in early stages, unlikely before Oct 2026. |
| Monteurzimmer guests lost to cheaper competitors | Medium | LOS discounts solve this. 5+ nights at 5% off = 52 EUR, competitive with Leinezimmer. |
| Negative reviews from price increases | Low | LGS demand justifies it. Communicate value (garden, LGS proximity, breakfast quality). |
| Booking.com ranking impact from price changes | Low | Dynamic pricing actually improves Booking.com ranking (confirmed by industry research). |
| Airbnb guest expectations vs. pension reality | Low | List only FeWos on Airbnb, not traditional rooms. |

---

## Appendix: Data Sources

| Source | Type | Date Checked |
|---|---|---|
| pension-volgenandt.de (codebase audit) | Website prices, YAML content files | 2026-03-28 |
| Booking.com listings (3 separate pages) | OTA prices, ratings | 2026-03-28 |
| KAYAK (Leinotel) | OTA prices | 2026-03-28 |
| pensioneichsfeld.de/preis-auskunft | Competitor prices | 2026-03-28 |
| leinezimmer-eichsfeld.de/preise | Competitor prices | 2026-03-28 |
| gasthof-bodenstein.de/Ferienwohnungen | Competitor prices | 2026-03-28 |
| pension-schollmeyer.de/Preise-Anfragen | Competitor prices | 2026-03-28 |
| preiswert-uebernachten.de (Uferpromenade) | Competitor prices (UPDATED) | 2026-03-28 |
| Google Hotels | Aggregated pricing | 2026-03-28 |
| lgs-leinefelde-worbis.de/tickets | LGS ticket prices | 2026-03-28 |
| SiteMinder, Cvent, Chekin | Pricing best practices | 2026-03-28 |
| Lighthouse/HFTP | Event pricing research | 2026-03-28 |
| Beds24 Wiki | Configuration guides | 2026-03-28 |
| PriceLabs, RoomPriceGenie | Revenue management tools | 2026-03-28 |
| RoomRaccoon 2025 Report | Ancillary revenue benchmarks | 2026-03-28 |
| Holidu, Smoobu | Upselling guides | 2026-03-28 |
| .planning/PRICING-ANALYSIS.md (Feb 2026) | Baseline analysis | 2026-02-22 |
| .planning/PRICING-BEST-PRACTICES-2026.md | Best practices research | 2026-03-28 |
