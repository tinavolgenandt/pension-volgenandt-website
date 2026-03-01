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
  type: z.enum(['ferienwohnung', 'doppelzimmer', 'einzelzimmer']),
  category: z.string(),
  shortDescription: z.string(),
  description: z.string(),

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
    activities: defineCollection({
      type: 'data',
      source: 'activities/*.yml',
      schema: activitySchema,
    }),
    news: defineCollection({
      type: 'data',
      source: 'news/*.yml',
      schema: newsSchema,
    }),
    faq: defineCollection({
      type: 'data',
      source: 'faq/index.yml',
      schema: z.object({
        items: z.array(faqItemSchema),
      }),
    }),
  },
})
