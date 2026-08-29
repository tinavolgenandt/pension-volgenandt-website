import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

// Amenity enum: used for both validation and icon mapping
const amenityEnum = z.enum([
  'wifi',
  'tv',
  'balkon',
  'terrasse',
  'kueche',
  'kuehlschrank',
  'kaffeemaschine',
  'dusche',
  'badewanne',
  'parkplatz',
  'garten',
  'bettwaesche',
  'handtuecher',
  'foehn',
  'tisch',
  'heizung',
])

// Pricing period schema: flexible seasonal support
const pricingPeriodSchema = z.object({
  label: z.string(),
  dateRange: z.string().optional(),
  rates: z.array(
    z.object({
      occupancy: z.number(),
      pricePerNight: z.number(),
    }),
  ),
})

// Extra/add-on schema
const extraSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  unit: z.string(),
})

// Room schema
const roomSchema = z.object({
  // Identity
  name: z.string(),
  slug: z.string(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(155).optional(),
  type: z.enum(['ferienwohnung', 'doppelzimmer', 'zweibettzimmer', 'einzelzimmer']),
  category: z.string(),
  shortDescription: z.string(),
  description: z.string(),

  // Availability restrictions
  weekendOnly: z.boolean().default(false),

  // Beds24 integration (needed in Phase 5, define now)
  beds24PropertyId: z.number(),
  beds24RoomId: z.number().optional(),

  // Capacity & features
  maxGuests: z.number(),
  beds: z.string(),
  sizeM2: z.number().optional(),

  // Pricing
  pricing: z.array(pricingPeriodSchema).min(1),
  startingPrice: z.number(),

  // Media
  heroImage: z.string(),
  heroImageAlt: z.string(),
  gallery: z.array(
    z.object({
      src: z.string(),
      alt: z.string(),
    }),
  ),

  // Amenities
  amenities: z.array(amenityEnum),
  highlights: z.array(z.string()),

  // Extras
  extras: z.array(extraSchema).default([]),

  // Display
  sortOrder: z.number().default(0),
  featured: z.boolean().default(false),
})

// Testimonial schema
const testimonialItemSchema = z.object({
  name: z.string(),
  quote: z.string(),
  rating: z.number().min(1).max(5),
})

// Attraction teaser schema (homepage teaser cards)
const attractionTeaserItemSchema = z.object({
  name: z.string(),
  slug: z.string(),
  shortDescription: z.string(),
  image: z.string(),
  imageAlt: z.string(),
  distanceKm: z.number(),
  featured: z.boolean().default(false),
  category: z.enum(['natur', 'kultur']),
})

// Attraction page schema (individual detail pages)
const attractionSchema = z.object({
  name: z.string(),
  slug: z.string(),
  seoTitle: z.string().max(60),
  seoDescription: z.string().max(155),
  heroImage: z.string(),
  heroImageAlt: z.string(),
  distanceKm: z.number(),
  drivingMinutes: z.number(),
  category: z.enum(['natur', 'kultur', 'aktivitaet']),
  shortDescription: z.string(),
  intro: z.string(),
  content: z.string(),
  hostTip: z.string(),
  bestTimeToVisit: z.string().optional(),
  website: z.string().url().optional(),
  additionalWebsites: z
    .array(
      z.object({
        label: z.string(),
        url: z.string().url(),
      }),
    )
    .optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  gallery: z
    .array(
      z.object({
        src: z.string(),
        alt: z.string(),
      }),
    )
    .default([]),
  sortOrder: z.number().default(0),
})

// Activity schema (Wandern, Radfahren pages)
const activitySchema = z.object({
  name: z.string(),
  slug: z.string(),
  seoTitle: z.string().max(60),
  seoDescription: z.string().max(155),
  heroImage: z.string(),
  heroImageAlt: z.string(),
  intro: z.string(),
  regionDescription: z.string(),
  routes: z
    .array(
      z.object({
        name: z.string(),
        distance: z.string(),
        difficulty: z.enum(['leicht', 'mittel', 'schwer']),
        highlight: z.string(),
        externalUrl: z.string().url().optional(),
      }),
    )
    .optional(),
  externalPortals: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url(),
      }),
    )
    .default([]),
})

// News article schema
const newsSchema = z.object({
  title: z.string(),
  slug: z.string(),
  seoTitle: z.string().max(60),
  seoDescription: z.string().max(155),
  heroImage: z.string(),
  heroImageAlt: z.string(),
  publishedDate: z.string(),
  category: z.enum(['veranstaltung', 'region', 'pension']),
  excerpt: z.string(),
  intro: z.string(),
  content: z.string(),
  externalLinks: z
    .array(
      z.object({
        label: z.string(),
        url: z.string().url(),
      }),
    )
    .default([]),
  sortOrder: z.number().default(0),

  // Optional: show room cards on event articles
  showRooms: z.boolean().default(false),
  eventStartDate: z.string().optional(),
  eventEndDate: z.string().optional(),
})

// Picknick schemas
const picknickPackageItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  subtitle: z.string(),
  timeSlot: z.string(),
  pricePerPerson: z.number(),
  minPersons: z.number(),
  includes: z.array(z.string()),
  image: z.string(),
  imageAlt: z.string(),
  imagePosition: z.string().optional(),
  sortOrder: z.number().default(0),
})

const picknickSpotItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  distanceKm: z.number(),
  description: z.string(),
  mood: z.string(),
  image: z.string().nullable(),
  imageAlt: z.string().nullable(),
  imagePosition: z.string().optional(),
  sortOrder: z.number().default(0),
})

const basketAlwaysItemSchema = z.object({
  label: z.string(),
  note: z.string().optional(),
})

const basketExtraItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  price: z.number().nullable(),
  unit: z.string().optional(),
})

// Event-garden (Feiern im Garten) schemas — full-service celebration service.
// All prices are provisional "Richtwerte" until the owners confirm; kept in YAML
// so they can be edited without code changes.
const eventOccasionSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  icon: z.string(),
})

// Shared optional fields on every catalogue option: a longer `detail`
// ("what this means for your event", shown in the wizard step) and an owner-
// supplied `image` (photos are added later; the wizard renders one if present).
const eventOptionMediaFields = {
  detail: z.string().optional(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
}

// Catering price bands — the partner-caterer's per-person price drops as the
// guest count grows (bulk pricing). Pick the first band whose maxGuests covers
// the selected guest count, same pattern as the base-package guest bands.
const eventPriceBandSchema = z.object({
  maxGuests: z.number(),
  pricePerPerson: z.number(),
})

const eventCateringTierSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  priceBands: z.array(eventPriceBandSchema).min(1),
  ...eventOptionMediaFields,
})

// Drinks option (radio incl. "none"): priced per person PER HOUR — total scales
// with both guest count and party duration.
const eventDrinkOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  pricePerPersonPerHour: z.number(),
  ...eventOptionMediaFields,
})

// Fixed-price option (radio incl. "none"): used for music, ceremony,
// photography, photobooth and styling. Total = price (independent of guests).
const eventFixedOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  price: z.number(),
  ...eventOptionMediaFields,
})

// Generic per-person choice (radio): used for decoration, cake, tables, chair
// covers, dishware and flooring. The first option is typically the included/
// basic one (pricePerPerson 0); upgrades cost extra. Total = pricePerPerson × guests.
const eventPerPersonChoiceSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  pricePerPerson: z.number(),
  ...eventOptionMediaFields,
})

// Guest band — pick the first band whose maxGuests covers the selected guest
// count. Used for the base price (which bundles the tent that scales with size).
const eventGuestBandSchema = z.object({
  maxGuests: z.number(),
  price: z.number(),
})

const eventConfigSchema = z.object({
  guestRange: z.object({
    min: z.number(),
    max: z.number(),
    default: z.number(),
  }),
  // Party duration in hours (drives the per-hour drinks pauschale)
  partyDuration: z.object({
    min: z.number(),
    max: z.number(),
    default: z.number(),
  }),
  // Base price = exclusive whole-property weekend + everything in `includes`
  // (tent, cleaning, coordination, insurance, …). Banded by guest count because
  // the included tent scales with size. Inclusions are listed WITHOUT prices.
  basePackage: z.object({
    label: z.string(),
    description: z.string(),
    guestBands: z.array(eventGuestBandSchema).min(1),
    includes: z.array(z.string()).min(1),
  }),
  cateringTiers: z.array(eventCateringTierSchema).min(1),
  // Drinks: radio incl. a "Keine" option; priced per person per hour
  drinkOptions: z.array(eventDrinkOptionSchema).min(1),
  // Freie Trauung (on-site ceremony with a celebrant): radio incl. "Keine"; fixed
  ceremonyOptions: z.array(eventFixedOptionSchema).min(1),
  // Photographer / videographer: radio incl. "Keine"; fixed price
  photographyOptions: z.array(eventFixedOptionSchema).min(1),
  // Music: radio incl. a "Keine" option; fixed price
  musicOptions: z.array(eventFixedOptionSchema).min(1),
  // Wedding cake / sweet table: radio incl. "Keine"; priced per person
  cakeOptions: z.array(eventPerPersonChoiceSchema).min(1),
  // Photobooth (Fotobox): radio incl. "Keine"; fixed price
  photoboothOptions: z.array(eventFixedOptionSchema).min(1),
  // Hair & make-up styling: radio incl. "Keine"; fixed price
  stylingOptions: z.array(eventFixedOptionSchema).min(1),
  // Furniture & equipment — each a per-person radio (first option = included/basic)
  tableOptions: z.array(eventPerPersonChoiceSchema).min(1),
  chairCoverOptions: z.array(eventPerPersonChoiceSchema).min(1),
  dishwareOptions: z.array(eventPerPersonChoiceSchema).min(1),
  flooringOptions: z.array(eventPerPersonChoiceSchema).min(1),
  // Decoration: radio incl. a "Keine" option; priced per person
  decorationOptions: z.array(eventPerPersonChoiceSchema).min(1),
  occasions: z.array(eventOccasionSchema).min(1),
  disclaimer: z.string(),
})

// FAQ item schema
const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
  category: z.enum(['buchung', 'ausstattung', 'umgebung', 'anreise']),
  relatedPage: z.string().optional(),
  sortOrder: z.number().default(0),
})

export default defineContentConfig({
  collections: {
    rooms: defineCollection({
      type: 'data',
      source: 'rooms/*.yml',
      schema: roomSchema,
    }),
    roomsEn: defineCollection({
      type: 'data',
      source: 'rooms-en/*.yml',
      schema: roomSchema,
    }),
    testimonials: defineCollection({
      type: 'data',
      source: 'testimonials/index.yml',
      schema: z.object({
        items: z.array(testimonialItemSchema).min(3),
      }),
    }),
    attractionsTeaser: defineCollection({
      type: 'data',
      source: 'attractions-teaser/index.yml',
      schema: z.object({
        items: z.array(attractionTeaserItemSchema).min(4),
      }),
    }),
    attractions: defineCollection({
      type: 'data',
      source: 'attractions/*.yml',
      schema: attractionSchema,
    }),
    attractionsEn: defineCollection({
      type: 'data',
      source: 'attractions-en/*.yml',
      schema: attractionSchema,
    }),
    activities: defineCollection({
      type: 'data',
      source: 'activities/*.yml',
      schema: activitySchema,
    }),
    activitiesEn: defineCollection({
      type: 'data',
      source: 'activities-en/*.yml',
      schema: activitySchema,
    }),
    news: defineCollection({
      type: 'data',
      source: 'news/*.yml',
      schema: newsSchema,
    }),
    newsEn: defineCollection({
      type: 'data',
      source: 'news-en/*.yml',
      schema: newsSchema,
    }),
    faq: defineCollection({
      type: 'data',
      source: 'faq/index.yml',
      schema: z.object({
        items: z.array(faqItemSchema),
      }),
    }),
    faqEn: defineCollection({
      type: 'data',
      source: 'faq-en/index.yml',
      schema: z.object({
        items: z.array(faqItemSchema),
      }),
    }),
    picknickPackages: defineCollection({
      type: 'data',
      source: 'picknick/packages.yml',
      schema: z.object({
        items: z.array(picknickPackageItemSchema),
      }),
    }),
    picknickSpots: defineCollection({
      type: 'data',
      source: 'picknick/spots.yml',
      schema: z.object({
        items: z.array(picknickSpotItemSchema),
      }),
    }),
    eventConfig: defineCollection({
      type: 'data',
      source: 'events/config.yml',
      schema: eventConfigSchema,
    }),
    picknickBasket: defineCollection({
      type: 'data',
      source: 'picknick/basket-items.yml',
      schema: z.object({
        always: z.array(basketAlwaysItemSchema),
        extras: z.array(basketExtraItemSchema),
      }),
    }),
  },
})
