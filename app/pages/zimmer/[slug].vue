<script setup lang="ts">
import { amenityMap } from '~/utils/amenities'

const route = useRoute()
const slug = route.params.slug as string
const config = useAppConfig()

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

// Booking consent check (SSG-safe, same pattern as MapConsent)
const { isAllowed } = useCookieConsent()
const isClient = import.meta.client
const showBooking = computed(() => isClient && isAllowed('booking'))

// Direct booking URL for Beds24
const bookingUrl = computed(() => {
  if (!room.value?.beds24PropertyId) return null
  const params = new URLSearchParams({
    propid: String(room.value.beds24PropertyId),
    lang: 'de',
    referer: 'Website',
    numnight: '2',
    numadult: '2',
  })
  if (room.value.beds24RoomId) {
    params.set('roomid', String(room.value.beds24RoomId))
  }
  return `https://beds24.com/booking2.php?${params}`
})

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

      <!-- 2. Title & Category with price and direct booking link -->
      <div>
        <span
          class="mb-2 inline-block rounded-full bg-sage-100 px-3 py-1 text-xs font-medium tracking-wide text-sage-600"
        >
          {{ room.category }}
        </span>
        <h1 class="font-serif text-3xl font-bold text-sage-800 sm:text-4xl">
          {{ room.name }}
        </h1>
        <p class="mt-2 text-lg">
          <span class="text-sm text-sage-500">ab </span>
          <span class="font-semibold text-waldhonig-600">{{ room.startingPrice }} EUR</span>
          <span class="text-sm text-sage-500"> / Nacht inkl. MwSt.</span>
        </p>
        <!-- Direct booking link -->
        <a
          v-if="bookingUrl"
          :href="bookingUrl"
          target="_blank"
          rel="noopener"
          class="mt-4 inline-flex items-center gap-2 rounded-lg bg-waldhonig-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-waldhonig-600"
        >
          <Icon name="lucide:calendar-check" :size="18" aria-hidden="true" />
          Jetzt buchen
        </a>
      </div>

      <!-- 3. Booking Widgets (consent-gated, completely absent when not granted) -->
      <ClientOnly>
        <section v-if="showBooking && room.beds24PropertyId" aria-label="Verfügbarkeit & Buchung">
          <h2 class="mb-4 font-serif text-2xl font-semibold text-sage-800">
            Verfügbarkeit & Buchung
          </h2>
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <BookingBeds24Calendar
              :beds24-property-id="room.beds24PropertyId"
              :beds24-room-id="room.beds24RoomId"
              :room-name="room.name"
            />
            <BookingBeds24Widget
              :beds24-property-id="room.beds24PropertyId"
              :beds24-room-id="room.beds24RoomId"
              :room-name="room.name"
            />
          </div>
        </section>
      </ClientOnly>

      <!-- Phone CTA fallback for rooms without beds24PropertyId -->
      <div
        v-if="!room.beds24PropertyId"
        class="rounded-lg border border-sage-200 bg-sage-50 p-6 text-center"
      >
        <p class="font-serif text-lg font-semibold text-sage-800">
          Dieses Zimmer ist nur telefonisch buchbar
        </p>
        <a
          :href="`tel:${config.contact.phone}`"
          class="mt-3 inline-flex items-center gap-2 rounded-lg bg-waldhonig-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-waldhonig-600"
        >
          <Icon name="lucide:phone" :size="18" aria-hidden="true" />
          {{ config.contact.phoneDisplay }}
        </a>
      </div>

      <!-- 4. Price Table -->
      <RoomsPriceTable :pricing="room.pricing" :max-guests="room.maxGuests" />

      <!-- 5. Amenities -->
      <RoomsAmenities
        :amenities="room.amenities"
        :size-m2="room.sizeM2"
        :max-guests="room.maxGuests"
        :beds="room.beds"
      />

      <!-- 6. Description -->
      <RoomsDescription
        :short-description="room.shortDescription"
        :description="room.description"
      />

      <!-- 7. Extras / Zusatzleistungen -->
      <RoomsExtras :extras="room.extras ?? []" />
    </div>

    <!-- 8. Weitere Zimmer (full width for grid) -->
    <div class="mt-16">
      <RoomsOtherRooms v-if="otherRooms" :rooms="otherRooms" />
    </div>
  </div>
</template>
