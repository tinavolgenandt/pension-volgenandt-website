# Pension Volgenandt -- Pricing & Competitive Analysis

> **Date:** 2026-02-22
> **Source:** Live Beds24 prices (verified via Playwright), competitor website research, SEO-COMPETITORS.md
> **Scope:** Direct booking prices, all 7 direct competitors in Leinefelde-Worbis / Eichsfeld region

---

## 1. Current Live Beds24 Prices (Verified)

Checked on 2026-02-22 for April 10-12, 2026 (2 nights, 2 adults, direct booking via Website referer).

| Room | Beds24 Total (2n) | Per Night | Per Person/Night | Breakfast |
|---|---|---|---|---|
| Einzelzimmer | ~100 EUR* | **50 EUR** | 50.00 EUR | +10 EUR/pp |
| Balkonzimmer | 116 EUR | **58 EUR** | 29.00 EUR | +10 EUR/pp |
| Rosengarten Zimmer | 116 EUR | **58 EUR** | 29.00 EUR | +10 EUR/pp |
| Wohlfuehl-Appartement | 130 EUR | **65 EUR** | 32.50 EUR | +10 EUR/pp |
| Emil's Kuhwiese (FeWo) | 146 EUR | **73 EUR** | 36.50 EUR | +10 EUR/pp |
| Schoene Aussicht (FeWo) | 252 EUR | **126 EUR** | 21.00 EUR (6 ppl) | +10 EUR/pp |

\* Einzelzimmer did not appear in the Beds24 booking widget for either 1 or 2 adults. Price from YAML config. **This is a bug -- the room may not be bookable online.**

**Key observations:**
- All prices are **flat year-round** -- same rate on Monday as Saturday, same in February as August.
- No length-of-stay discounts configured.
- OTA multipliers: 115% Booking.com, 120% Airbnb (per BEDS24-CURRENT-ASSESSMENT.md).
- Extras: Standard Fruehstueck 10 EUR/pp, Geniesser-Fruehstueck 15 EUR/pp, Hund 10 EUR/night, BBQ-Set 10 EUR/use.

---

## 2. Competitor Pricing (Verified from Websites & Aggregators)

### 2.1 Direct Competitors

#### Leinezimmer Eichsfeld (Leinefelde)
- **Source:** leinezimmer-eichsfeld.de/preise/
- **SEO Score:** 5/10 (best among competitors)

| Room Type | 1 Night | 4+ Nights |
|---|---|---|
| Einzelzimmer | 45 EUR | 35 EUR |
| Doppelzimmer | 70 EUR | 60 EUR |
| DZ als EZ | 50 EUR | 40 EUR |

- Breakfast: not included
- Pricing model: per room, tiered by length of stay
- Entire apartment (4 rooms) available at negotiated rates

#### Pension Schollmeyer (Birkungen)
- **Source:** monteurzimmer.de listing (website SSL expired)
- **SEO Score:** 2/10

| Room Type | Price/Night |
|---|---|
| Einzelzimmer | 25 EUR |
| Doppelzimmer (3 available) | 50 EUR |
| Mehrbettzimmer (3 persons) | 75 EUR |
| Ferienwohnung (2 persons) | 50 EUR |

- Breakfast: unclear if included
- Pricing model: ~25 EUR per person consistently
- Amenities: free parking, refrigerator, TV, WiFi

#### Pension Kullmann (Breitenholz)
- **Source:** finde-unterkunft.de (website SSL invalid, unreachable)
- **SEO Score:** 1/10

| Detail | Info |
|---|---|
| Price category | "niedrige Preiskategorie" (low) |
| Exact prices | Not publicly available |
| Breakfast | Likely included (breakfast room mentioned) |

#### Pension An der Uferpromenade (Worbis)
- **Source:** TripAdvisor, harz-pensionen.de
- **SEO Score:** 1/10

| Room Type | Price/Night |
|---|---|
| Einzelzimmer | from 40 EUR |
| Doppelzimmer | from 52 EUR |
| Ferienwohnung (1-3 persons) | from 69 EUR |
| Ferienwohnung (weekly) | 480 EUR (~69 EUR/night) |

- Breakfast: **INCLUDED** (homemade buffet)
- Amenities: waterfront, swimming pool, sauna, playground, free parking

#### Pension Eichsfeld (Breitenworbis)
- **Source:** pensioneichsfeld.de, monteurzimmer.de
- **SEO Score:** 3/10
- **Opened:** July 2023 (modern interior)

| Stay Duration | Einzelzimmer | Doppelzimmer |
|---|---|---|
| 1 night | 60 EUR | 75 EUR |
| 2+ nights | 54 EUR | 67.50 EUR |
| 3+ nights | 48 EUR | 60 EUR |
| 5+ nights | 45 EUR | 56.25 EUR |
| 11+ nights | 42 EUR | 52.50 EUR |
| 19+ nights | 36 EUR | 45 EUR |

- Breakfast: not included (kitchenette provided)
- Rooms: 4 total (2 single, 2 double), 10-18 sqm
- Deposit: 50 EUR required
- Aggressive length-of-stay discounts ("up to 40% off")

#### Gasthof Bodenstein (Wintzingerode)
- **Source:** gasthof-bodenstein.de/Ferienwohnungen/
- **SEO Score:** 2/10

| Accommodation | Price |
|---|---|
| Blockhuette (cabin, up to 4 persons, 1 night) | 70 EUR |
| Blockhuette (7 nights) | 420 EUR (60 EUR/night) |
| Breakfast per adult | 14 EUR |
| Breakfast per child | 9 EUR |
| Pet surcharge (one-time) | 15 EUR |

- 6 standalone log cabins, 20 beds total
- Restaurant on-site with regional cuisine
- Reservations by phone ONLY

### 2.2 Indirect Competitors

#### Leinotel (Leinefelde)
- **Source:** KAYAK, Bett+Bike
- **Type:** Modern self-check-in hotel, 19 barrier-free rooms

| Room Type | Price/Night |
|---|---|
| Einzelzimmer | from 68 EUR |
| Doppelzimmer | from 78 EUR |
| MBZ/Gruppe | from 105 EUR |

- Breakfast: included (rich buffet)
- Near A38 motorway, 3 min from train station

#### Hotel am Vitalpark (Heiligenstadt)
- **Source:** hotel-am-vitalpark.de
- **Type:** 4-star superior wellness hotel, 130 rooms
- **Not directly comparable** -- sets the regional upper bound

| Room Category | Price/Person/Night |
|---|---|
| Classic | from 74.50 EUR |
| Superior | from 84.50 EUR |
| Comfort | from 94.50 EUR |
| Deluxe | from 109.50 EUR |
| Suite | from 124.50 EUR |

- Breakfast + bath/sauna landscape included
- Dog: 25 EUR/night, Parking: 7 EUR/day

---

## 3. Regional Benchmarks

| Metric | Price | Source |
|---|---|---|
| Average pension bed/night (Leinefelde-Worbis) | ~50 EUR | preiswert-uebernachten.de |
| Average hotel bed/night | ~65 EUR | preiswert-uebernachten.de |
| Lowest available accommodation | from 26.40 EUR | preiswert-uebernachten.de |
| Monteurzimmer cheapest/pp/night | 9-15 EUR | monteurzimmer.de |
| Monteurzimmer average/pp/night | 22.50-30 EUR | monteurzimmer.de |
| Thuringia pension average | from 29 EUR (budget) | hotel-mix.de |
| 93% of Thuringia pensions | under 100 EUR/night | hotel-mix.de |

---

## 4. Fair Comparison: Effective Cost for a Couple (2 Adults, 1 Night)

This is the fairest comparison -- what a couple actually pays including breakfast.

| Accommodation | Room Rate | Breakfast | **Total for 2 adults** | Booking.com Rating |
|---|---|---|---|---|
| Pension Schollmeyer | 50 EUR | unclear | ~50-60 EUR | N/A |
| **Pension Uferpromenade** | 52 EUR | **included** | **52 EUR** | N/A |
| **Pension Volgenandt (Balkon/Rosen)** | 58 EUR | +20 EUR (2x10) | **78 EUR** | **8.7-9.1** |
| **Pension Volgenandt (Wohlfuehl)** | 65 EUR | +20 EUR (2x10) | **85 EUR** | **8.7-9.1** |
| Leinezimmer Eichsfeld | 70 EUR | not included | 70+ EUR | N/A |
| Pension Eichsfeld | 75 EUR | not included | 75+ EUR | N/A |
| **Leinotel** | 78 EUR | **included** | **78 EUR** | N/A |
| Gasthof Bodenstein | 70 EUR (cabin) | +28 EUR (2x14) | **98 EUR** | N/A |

**Key insight:** When breakfast is factored in, Pension Volgenandt at 78 EUR (Balkonzimmer + 2x breakfast) is **at parity with Leinotel** (a modern hotel) and **significantly more expensive than Uferpromenade** (52 EUR incl. breakfast + pool + sauna). The base rate alone doesn't tell the full story.

---

## 5. Assessment

### Where pricing is too low (clear cases)

1. **Balkonzimmer at 58 EUR** -- a room with a private balcony priced identically to the standard Rosengarten. Pension Eichsfeld charges 75 EUR for a basic double in a 10-18 sqm room with no character. Leinezimmer charges 70 EUR. The balcony is a real differentiator that isn't being monetized.

2. **Wohlfuehl-Appartement at 65 EUR** -- includes kitchenette (Wasserkocher, Kuehlschrank, Spuele) plus sofa bed. This is functionally a small apartment, priced 10 EUR below Pension Eichsfeld's basic double (75 EUR) and 5 EUR below Gasthof Bodenstein's cabin (70 EUR for up to 4 people).

3. **Einzelzimmer at 50 EUR** -- only 5 EUR above Leinezimmer (45 EUR) but with significantly better reviews and amenities. Pension Eichsfeld charges 60 EUR for a single.

### Where pricing is fair

4. **Rosengarten at 58 EUR** -- standard double without special features. Sits reasonably between Uferpromenade (52 incl. breakfast) and the 70-75 EUR range. A small increase is warranted but not dramatic.

5. **Schoene Aussicht at 126 EUR** -- at 21 EUR/pp for 6 guests, this is well-positioned. A 6-person apartment at this price is competitive with any regional offering.

6. **Emil's Kuhwiese at 73 EUR** -- full apartment with kitchen and terrace. Slightly below Leinotel (78 EUR with breakfast) but the self-catering angle makes this fair.

### Structural pricing problems (bigger than base rate)

7. **No weekend surcharge** -- Friday/Saturday nights should command a premium. Every competitor with business acumen prices weekends higher.

8. **No seasonal pricing** -- flat rate in February = flat rate in August. The Eichsfeld sees significantly more tourism May-October.

9. **No length-of-stay incentive** -- Leinezimmer and Pension Eichsfeld both offer 15-40% discounts for extended stays. This is standard in the region and expected by Monteurzimmer/trade worker guests.

10. **Breakfast not bundled** -- competitors who include breakfast (Uferpromenade, Leinotel) appear cheaper even when the total cost is similar. A bundled "mit Fruehstueck" rate would improve conversion.

---

## 6. Recommendations

### 6.1 Base Rate Adjustments

| Room | Current | Recommended | Change | Rationale |
|---|---|---|---|---|
| Einzelzimmer | 50 EUR | **55 EUR** | +10% | Between Leinezimmer (45) and Pension Eichsfeld (60). Reviews justify upper half. |
| Balkonzimmer | 58 EUR | **65 EUR** | +12% | Balcony premium. Still below Leinezimmer (70) and Pension Eichsfeld (75). |
| Rosengarten | 58 EUR | **62 EUR** | +7% | Standard double, modest increase. Still below comparable doubles (70-75). |
| Wohlfuehl-Appartement | 65 EUR | **72 EUR** | +11% | Kitchenette + sofa bed value. Just below Pension Eichsfeld (75). |
| Emil's Kuhwiese | 73 EUR | **79 EUR** | +8% | Full apartment. Comparable to Leinotel (78) with self-catering premium. |
| Schoene Aussicht | 126 EUR | **126 EUR** | 0% | Already well-positioned at 21 EUR/pp for 6 guests. |

### 6.2 Pricing Structure Changes (in Beds24)

| Change | Detail | Estimated Impact |
|---|---|---|
| **Weekend surcharge** | +8-10 EUR on Friday and Saturday nights | +2,000-3,000 EUR/year |
| **Seasonal pricing** | +10-15% May-October (peak tourism), -5-10% January-February (low season) | +1,500-2,500 EUR/year |
| **Length-of-stay discount** | -5% at 5+ nights, -10% at 7+ nights | Competitive parity, encourages longer stays |
| **Breakfast bundle rate** | Offer "Zimmer mit Fruehstueck" as a separate rate plan at room + 8 EUR/pp (instead of +10 as add-on). Displayed as "ab 71 EUR" for Balkonzimmer instead of "58 EUR + extras". | Higher conversion, perceived value |
| **Extend pricing calendar** | Currently ~11 months out. Should be 18 months for advance tourism bookings. | Captures early planners |

### 6.3 Revenue Impact Estimate

Assumptions: ~60% average occupancy, 6 bookable units, 365 days.

| Lever | Annual Impact |
|---|---|
| Base rate increases (avg. +6 EUR/night) | +4,000-6,000 EUR |
| Weekend surcharges | +2,000-3,000 EUR |
| Seasonal pricing | +1,500-2,500 EUR |
| **Total estimated additional revenue** | **+7,500-11,500 EUR/year** |

### 6.4 Risk Assessment

- **Low risk:** The 8.7-9.1 Booking.com rating is the strongest in the region. Guests paying for quality are less price-sensitive.
- **Low risk:** No competitor in the 58-75 EUR range offers a compelling modern web presence. The new website gives pricing power others don't have.
- **Mitigating factor:** Length-of-stay discounts offset any sticker shock for Monteurzimmer/long-stay guests.
- **Watch:** Pension Uferpromenade at 52 EUR incl. breakfast + pool remains the strongest value proposition in the region. Competing on price alone against them is not viable -- compete on reviews, garden experience, and direct booking convenience instead.

---

## 7. Immediate Action Items

1. **Fix Einzelzimmer visibility** -- it does not appear in the Beds24 booking widget. This may mean the room is not bookable online at all.
2. **Implement weekend surcharge** in Beds24 rate rules (+8-10 EUR Fri/Sat).
3. **Implement seasonal pricing** in Beds24 (at minimum: +10% May-October).
4. **Adjust base rates** per section 6.1 above.
5. **Create a "mit Fruehstueck" rate plan** in Beds24 to improve price presentation.
6. **Extend pricing calendar** to 18 months.

---

## Appendix: Data Sources

| Source | URL / Location | Data Retrieved |
|---|---|---|
| Beds24 live booking (propid 261258) | beds24.com/booking2.php?propid=261258 | Room prices, availability |
| Beds24 live booking (propid 257613) | beds24.com/booking2.php?propid=257613 | Emil's Kuhwiese price |
| Beds24 live booking (propid 257610) | beds24.com/booking2.php?propid=257610 | Schoene Aussicht price |
| Leinezimmer Eichsfeld | leinezimmer-eichsfeld.de/preise/ | Pricing tiers |
| Pension Schollmeyer | monteurzimmer.de listing | Per-person rates |
| Pension Kullmann | finde-unterkunft.de | Category only |
| Pension Uferpromenade | TripAdvisor, harz-pensionen.de | Room rates |
| Pension Eichsfeld | pensioneichsfeld.de, monteurzimmer.de | Tiered pricing |
| Gasthof Bodenstein | gasthof-bodenstein.de/Ferienwohnungen/ | Cabin rates |
| Leinotel | KAYAK, Bett+Bike | Hotel rates |
| Hotel am Vitalpark | hotel-am-vitalpark.de | Wellness hotel rates |
| Regional benchmarks | preiswert-uebernachten.de, monteurzimmer.de, hotel-mix.de | Market averages |
| Internal SEO analysis | .planning/research/SEO-COMPETITORS.md | Competitor profiles |
| Internal Beds24 audit | .planning/BEDS24-CURRENT-ASSESSMENT.md | Configuration issues |
