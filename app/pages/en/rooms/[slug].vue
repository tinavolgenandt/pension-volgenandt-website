<script setup lang="ts">
import { t } from '~/utils/translations'
import { getAmenityLabel } from '~/utils/amenities'

const route = useRoute()
const slug = route.params.slug as string
const config = useAppConfig()
const siteUrl = 'https://www.pension-volgenandt.de'

// Fetch current room by slug (EN collection)
const { data: room } = await useAsyncData(`room-en-${slug}`, () =>
  queryCollection('roomsEn').where('slug', '=', slug).first(),
)

// 404 if room not found
if (!room.value) {
  throw createError({ statusCode: 404, message: t('room.notFound', 'en') })
}

// Fetch other rooms (exclude current), ordered by sortOrder
const { data: otherRooms } = await useAsyncData(`other-rooms-en-${slug}`, () =>
  queryCollection('roomsEn').where('slug', '<>', slug).order('sortOrder', 'ASC').all(),
)

// Type labels for badge display
const typeLabel: Record<string, string> = {
  ferienwohnung: t('room.type.ferienwohnung', 'en'),
  doppelzimmer: t('room.type.doppelzimmer', 'en'),
  zweibettzimmer: t('room.type.zweibettzimmer', 'en'),
  einzelzimmer: t('room.type.einzelzimmer', 'en'),
}

// Booking consent check (SSG-safe, same pattern as MapConsent)
const { isAllowed } = useCookieConsent()
const isClient = import.meta.client
const showBooking = computed(() => isClient && isAllowed('booking'))

// Direct booking URL for Beds24
const bookingUrl = computed(() => {
  if (!room.value?.beds24PropertyId) return null
  const params = new URLSearchParams({
    propid: String(room.value.beds24PropertyId),
    lang: 'en',
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
useHead({
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'canonical', href: `${siteUrl}/en/rooms/${room.value.slug}/` },
    {
      rel: 'alternate',
      hreflang: 'en',
      href: `${siteUrl}/en/rooms/${room.value.slug}/`,
    },
    {
      rel: 'alternate',
      hreflang: 'de',
      href: `${siteUrl}/zimmer/${room.value.slug}/`,
    },
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${siteUrl}/zimmer/${room.value.slug}/`,
    },
  ],
})

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
  ogImage: `${siteUrl}${room.value.heroImage}`,
  ogType: 'website',
})

// HotelRoom + Offer Schema.org structured data (English)
useSchemaOrg([
  {
    '@type': ['HotelRoom', 'Product'],
    name: room.value.name,
    description: room.value.shortDescription,
    image: `${siteUrl}${room.value.heroImage}`,
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
      name: getAmenityLabel(a, 'en'),
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
            unitText: t('schema.persons', 'en'),
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
          {{ typeLabel[room.type] || room.category }}
        </span>
        <h1 class="font-serif text-3xl font-bold text-sage-800 sm:text-4xl">
          {{ room.name }}
        </h1>
        <p class="mt-2 text-lg">
          <span class="text-sm text-sage-600">{{ t('room.from', 'en') }} </span>
          <span class="font-semibold text-waldhonig-600">{{ room.startingPrice }} EUR</span>
          <span class="text-sm text-sage-600"> {{ t('room.perNight', 'en') }}</span>
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
          {{ t('cta.bookNow', 'en') }}
        </a>

        <!-- Weekend-only notice -->
        <div
          v-if="room.weekendOnly"
          class="mt-4 flex items-start gap-2 rounded-lg border border-waldhonig-200 bg-waldhonig-50 px-4 py-3 text-sm text-waldhonig-800"
        >
          <Icon name="lucide:calendar-clock" :size="16" class="mt-0.5 shrink-0" aria-hidden="true" />
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="t('room.weekendOnly', 'en')" />
        </div>
      </div>

      <!-- 3. Booking Widgets (consent-gated, completely absent when not granted) -->
      <ClientOnly>
        <section v-if="showBooking && room.beds24PropertyId" :aria-label="t('room.availabilityBooking', 'en')">
          <h2 class="mb-4 font-serif text-2xl font-semibold text-sage-800">
            {{ t('room.availabilityBooking', 'en') }}
          </h2>
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <BookingBeds24Calendar
              :beds24-property-id="room.beds24PropertyId"
              :beds24-room-id="room.beds24RoomId"
              :room-name="room.name"
              lang="en"
            />
            <BookingBeds24Widget
              :beds24-property-id="room.beds24PropertyId"
              :beds24-room-id="room.beds24RoomId"
              :room-name="room.name"
              lang="en"
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
          {{ t('room.phoneOnly', 'en') }}
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
      <RoomsPriceTable :pricing="room.pricing" :max-guests="room.maxGuests" locale="en" />

      <!-- 5. Amenities -->
      <RoomsAmenities
        :amenities="room.amenities"
        :size-m2="room.sizeM2"
        :max-guests="room.maxGuests"
        :beds="room.beds"
        locale="en"
      />

      <!-- 6. Description -->
      <RoomsDescription
        :short-description="room.shortDescription"
        :description="room.description"
        locale="en"
      />

      <!-- 7. Extras / Add-ons -->
      <RoomsExtras :extras="room.extras ?? []" locale="en" />
    </div>

    <!-- 8. Other rooms (full width for grid) -->
    <div class="mt-16">
      <RoomsOtherRooms v-if="otherRooms" :rooms="otherRooms" locale="en" />
    </div>
  </div>
</template>
