<script setup lang="ts">
import { amenityMap } from '~/utils/amenities'

const route = useRoute()
const slug = route.params.slug as string

// Fetch current room by slug
const { data: room } = await useAsyncData(`room-${slug}`, () =>
  queryCollection('rooms').where('slug', '=', slug).first(),
)

// 404 if room not found
if (!room.value) {
  throw createError({ statusCode: 404, message: 'Zimmer nicht gefunden' })
}

// Fetch other rooms (exclude current), ordered by sortOrder
const { data: otherRooms } = await useAsyncData(`other-rooms-${slug}`, () =>
  queryCollection('rooms').where('slug', '<>', slug).order('sortOrder', 'ASC').all(),
)

// Dynamic SEO meta
useSeoMeta({
  title: room.value.name,
  ogTitle: `${room.value.name} | Pension Volgenandt`,
  description:
    room.value.shortDescription.length > 155
      ? `${room.value.shortDescription.slice(0, 152)}...`
      : room.value.shortDescription,
  ogDescription:
    room.value.shortDescription.length > 155
      ? `${room.value.shortDescription.slice(0, 152)}...`
      : room.value.shortDescription,
  ogImage: `https://www.pension-volgenandt.de${room.value.heroImage}`,
  ogType: 'website',
})
useHead({
  link: [
    { rel: 'canonical', href: `https://www.pension-volgenandt.de/zimmer/${room.value.slug}/` },
    {
      rel: 'alternate',
      hreflang: 'de',
      href: `https://www.pension-volgenandt.de/zimmer/${room.value.slug}/`,
    },
  ],
})

// HotelRoom + Offer Schema.org structured data
useSchemaOrg([
  {
    '@type': ['HotelRoom', 'Product'],
    name: room.value.name,
    description: room.value.shortDescription,
    image: `https://www.pension-volgenandt.de${room.value.heroImage}`,
    occupancy: {
      '@type': 'QuantitativeValue',
      maxValue: room.value.maxGuests,
    },
    bed: {
      '@type': 'BedDetails',
      typeOfBed: room.value.beds,
    },
    amenityFeature: room.value.amenities.map((a: string) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenityMap[a]?.label ?? a,
      value: true,
    })),
    offers: room.value.pricing.flatMap(
      (period: { label: string; rates: Array<{ occupancy: number; pricePerNight: number }> }) =>
        period.rates.map((rate) => ({
          '@type': 'Offer',
          name: `${room.value!.name} - ${period.label}`,
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: rate.pricePerNight,
            priceCurrency: 'EUR',
            unitCode: 'DAY',
          },
          businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut',
          eligibleQuantity: {
            '@type': 'QuantitativeValue',
            value: rate.occupancy,
            unitText: 'Personen',
          },
        })),
    ),
  },
])
</script>

<template>
  <div v-if="room" class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-4xl space-y-10">
      <!-- 1. Photo Gallery -->
      <RoomsGallery
        :hero-image="room.heroImage"
        :hero-image-alt="room.heroImageAlt"
        :gallery="room.gallery"
      />

      <!-- 2. Title & Category -->
      <div>
        <span
          class="mb-2 inline-block rounded-full bg-sage-100 px-3 py-1 text-xs font-medium tracking-wide text-sage-600"
        >
          {{ room.category }}
        </span>
        <h1 class="font-serif text-3xl font-bold text-sage-800 sm:text-4xl">
          {{ room.name }}
        </h1>
      </div>

      <!-- 3. Description -->
      <RoomsDescription
        :short-description="room.shortDescription"
        :description="room.description"
      />

      <!-- 4. Amenities -->
      <RoomsAmenities
        :amenities="room.amenities"
        :size-m2="room.sizeM2"
        :max-guests="room.maxGuests"
        :beds="room.beds"
      />

      <!-- 5. Price Table -->
      <RoomsPriceTable :pricing="room.pricing" />

      <!-- 6. Extras / Zusatzleistungen -->
      <RoomsExtras :extras="room.extras ?? []" />
    </div>

    <!-- 7. Weitere Zimmer (full width for grid) -->
    <div class="mt-16">
      <RoomsOtherRooms v-if="otherRooms" :rooms="otherRooms" />
    </div>
  </div>
</template>
