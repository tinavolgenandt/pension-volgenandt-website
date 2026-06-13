<script setup lang="ts">
import { t } from '~/utils/translations'
import { useJsonLd } from '~/composables/useJsonLd'

const { locale } = useLocale()
const siteUrl = 'https://www.pension-volgenandt.de'

useSeoMeta({
  title: 'Monteurzimmer Leinefelde | Pension Volgenandt Eichsfeld',
  ogTitle: 'Monteurzimmer Leinefelde | Pension Volgenandt Eichsfeld',
  description:
    'Günstige Monteurzimmer in Leinefelde-Worbis. WLAN, Parkplatz, Küchenzugang – ideal für Handwerker & Firmen. Ab 50 €/Nacht.',
  ogDescription:
    'Günstige Monteurzimmer in Leinefelde-Worbis. WLAN, Parkplatz, Küchenzugang – ideal für Handwerker & Firmen. Ab 50 €/Nacht.',
  ogImage: `${siteUrl}/img/hero/hero-poster.webp`,
  ogType: 'website',
})

useHead({
  titleTemplate: '%s',
  link: [
    { rel: 'canonical', href: `${siteUrl}/monteurzimmer/` },
    { rel: 'alternate', hreflang: 'de', href: `${siteUrl}/monteurzimmer/` },
    { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/en/worker-rooms/` },
    { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}/monteurzimmer/` },
  ],
})

useJsonLd(
  {
    '@type': 'LodgingBusiness',
    '@id': `${siteUrl}/monteurzimmer/#lodging`,
    name: 'Pension Volgenandt – Monteurzimmer',
    description:
      'Monteurzimmer und Firmenzimmer in Leinefelde-Worbis. Günstig, komfortabel, mit WLAN und Parkplatz.',
    url: `${siteUrl}/monteurzimmer/`,
    image: [`${siteUrl}/img/hero/hero-poster.webp`],
    containedInPlace: {
      '@id': `${siteUrl}/#identity`,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Otto-Reutter-Straße 28',
      addressLocality: 'Leinefelde-Worbis OT Breitenbach',
      postalCode: '37327',
      addressRegion: 'Thüringen',
      addressCountry: 'DE',
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Business travelers',
    },
  },
  'worker-rooms-schema-de',
)

const { data: rooms } = await useAsyncData('monteurzimmer', () =>
  queryCollection('rooms').order('sortOrder', 'ASC').all(),
)
</script>

<template>
  <div>
    <SharedPageBanner
      image="/img/hero/hero-poster.webp"
      :image-alt="t('monteurzimmer.title', locale)"
      :title="t('monteurzimmer.title', locale)"
      :subtitle="t('monteurzimmer.subtitle', locale)"
    />

    <div class="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <!-- Intro -->
      <section class="mx-auto mb-12 max-w-3xl text-center">
        <p class="text-lg leading-relaxed text-sage-700">
          {{ t('monteurzimmer.intro', locale) }}
        </p>
      </section>

      <!-- Benefits -->
      <section class="mb-12">
        <h2 class="mb-6 text-center font-serif text-xl font-semibold text-sage-900">
          {{ t('monteurzimmer.highlights', locale) }}
        </h2>
        <div class="mx-auto grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-3">
          <div class="flex flex-col items-center gap-2 rounded-lg bg-sage-50 p-4 text-center">
            <Icon name="ph:wifi-high" class="size-6 text-waldhonig-500" />
            <span class="text-sm font-medium text-sage-700">{{
              t('monteurzimmer.wifi', locale)
            }}</span>
          </div>
          <div class="flex flex-col items-center gap-2 rounded-lg bg-sage-50 p-4 text-center">
            <Icon name="ph:car" class="size-6 text-waldhonig-500" />
            <span class="text-sm font-medium text-sage-700">{{
              t('monteurzimmer.parking', locale)
            }}</span>
          </div>
          <div class="flex flex-col items-center gap-2 rounded-lg bg-sage-50 p-4 text-center">
            <Icon name="ph:cooking-pot" class="size-6 text-waldhonig-500" />
            <span class="text-sm font-medium text-sage-700">{{
              t('monteurzimmer.kitchen', locale)
            }}</span>
          </div>
          <div class="flex flex-col items-center gap-2 rounded-lg bg-sage-50 p-4 text-center">
            <Icon name="ph:map-pin" class="size-6 text-waldhonig-500" />
            <span class="text-sm font-medium text-sage-700">{{
              t('monteurzimmer.location', locale)
            }}</span>
          </div>
          <div class="flex flex-col items-center gap-2 rounded-lg bg-sage-50 p-4 text-center">
            <Icon name="ph:tree" class="size-6 text-waldhonig-500" />
            <span class="text-sm font-medium text-sage-700">{{
              t('monteurzimmer.quiet', locale)
            }}</span>
          </div>
          <div class="flex flex-col items-center gap-2 rounded-lg bg-sage-50 p-4 text-center">
            <Icon name="ph:calendar-check" class="size-6 text-waldhonig-500" />
            <span class="text-sm font-medium text-sage-700">{{
              t('monteurzimmer.weekly', locale)
            }}</span>
          </div>
        </div>
      </section>

      <!-- Room cards -->
      <section v-if="rooms?.length" class="mb-12">
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <RoomsCard
            v-for="room in rooms"
            :key="room.slug"
            :name="room.name"
            :slug="room.slug"
            :short-description="room.shortDescription"
            :hero-image="room.heroImage"
            :hero-image-alt="room.heroImageAlt"
            :starting-price="room.startingPrice"
            :max-guests="room.maxGuests"
            :highlights="room.highlights"
            :beds24-property-id="room.beds24PropertyId"
            :beds24-room-id="room.beds24RoomId"
            :locale="locale"
          />
        </div>
      </section>
    </div>

    <SharedSoftCta :text="t('monteurzimmer.bookNow', locale)" />
    <SharedBookingCta />
  </div>
</template>
