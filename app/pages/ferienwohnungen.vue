<script setup lang="ts">
import { t } from '~/utils/translations'

const { locale } = useLocale()
const siteUrl = 'https://www.pension-volgenandt.de'

useSeoMeta({
  title: 'Ferienwohnung Eichsfeld | Pension Volgenandt Leinefelde',
  ogTitle: 'Ferienwohnung Eichsfeld | Pension Volgenandt Leinefelde',
  description:
    'Ferienwohnungen im Eichsfeld bei Leinefelde-Worbis. Voll ausgestattete Küche, Terrasse & Garten. 2–6 Gäste, ab 73 €/Nacht.',
  ogDescription:
    'Ferienwohnungen im Eichsfeld bei Leinefelde-Worbis. Voll ausgestattete Küche, Terrasse & Garten. 2–6 Gäste, ab 73 €/Nacht.',
  ogImage: `${siteUrl}/img/hero/hero-poster.webp`,
  ogType: 'website',
})

useHead({
  titleTemplate: '%s',
  link: [
    { rel: 'canonical', href: `${siteUrl}/ferienwohnungen/` },
    { rel: 'alternate', hreflang: 'de', href: `${siteUrl}/ferienwohnungen/` },
    { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/en/holiday-apartments/` },
    { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}/ferienwohnungen/` },
  ],
})

useSchemaOrg([
  {
    '@type': 'LodgingBusiness',
    name: 'Pension Volgenandt – Ferienwohnungen',
    description:
      'Ferienwohnungen im Eichsfeld bei Leinefelde-Worbis mit Küche, Terrasse und 25.000 m² Garten.',
    url: `${siteUrl}/ferienwohnungen/`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Breitenbach 12',
      addressLocality: 'Leinefelde-Worbis',
      postalCode: '37327',
      addressRegion: 'Thüringen',
      addressCountry: 'DE',
    },
  },
])

const { data: rooms } = await useAsyncData('ferienwohnungen', () =>
  queryCollection('rooms').where('type', '=', 'ferienwohnung').order('sortOrder', 'ASC').all(),
)
</script>

<template>
  <div>
    <SharedPageBanner
      image="/img/rooms/schoene-aussicht-wohnkueche.webp"
      :image-alt="t('ferienwohnungen.title', locale)"
      :title="t('ferienwohnungen.title', locale)"
      :subtitle="t('ferienwohnungen.subtitle', locale)"
    />

    <div class="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <!-- Intro -->
      <section class="mx-auto mb-12 max-w-3xl text-center">
        <p class="text-lg leading-relaxed text-sage-700">
          {{ t('ferienwohnungen.intro', locale) }}
        </p>
      </section>

      <!-- Highlights -->
      <section class="mb-12">
        <h2 class="mb-6 text-center font-serif text-xl font-semibold text-sage-900">
          {{ t('ferienwohnungen.highlights', locale) }}
        </h2>
        <div class="mx-auto grid max-w-2xl grid-cols-2 gap-4 md:grid-cols-4">
          <div class="flex flex-col items-center gap-2 rounded-lg bg-sage-50 p-4 text-center">
            <Icon name="ph:cooking-pot" class="size-6 text-waldhonig-500" />
            <span class="text-sm font-medium text-sage-700">{{
              t('ferienwohnungen.kitchen', locale)
            }}</span>
          </div>
          <div class="flex flex-col items-center gap-2 rounded-lg bg-sage-50 p-4 text-center">
            <Icon name="ph:sun-horizon" class="size-6 text-waldhonig-500" />
            <span class="text-sm font-medium text-sage-700">{{
              t('ferienwohnungen.terrace', locale)
            }}</span>
          </div>
          <div class="flex flex-col items-center gap-2 rounded-lg bg-sage-50 p-4 text-center">
            <Icon name="ph:tree" class="size-6 text-waldhonig-500" />
            <span class="text-sm font-medium text-sage-700">{{
              t('ferienwohnungen.garden', locale)
            }}</span>
          </div>
          <div class="flex flex-col items-center gap-2 rounded-lg bg-sage-50 p-4 text-center">
            <Icon name="ph:car" class="size-6 text-waldhonig-500" />
            <span class="text-sm font-medium text-sage-700">{{
              t('ferienwohnungen.parking', locale)
            }}</span>
          </div>
        </div>
      </section>

      <!-- Room cards -->
      <section v-if="rooms?.length" class="mb-12">
        <div class="grid gap-8 md:grid-cols-2">
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

    <SharedSoftCta :text="t('ferienwohnungen.bookNow', locale)" />
    <SharedBookingCta />
  </div>
</template>
