<script setup lang="ts">
import { t } from '~/utils/translations'

const siteUrl = 'https://www.pension-volgenandt.de'

useSeoMeta({
  title: 'Holiday Apartments Eichsfeld | Pension Volgenandt',
  ogTitle: 'Holiday Apartments Eichsfeld | Pension Volgenandt',
  description:
    'Self-catering holiday apartments near Leinefelde-Worbis, Thuringia. Fully equipped kitchen, terrace & garden. 2–6 guests, from 73 €/night.',
  ogDescription:
    'Self-catering holiday apartments near Leinefelde-Worbis, Thuringia. Fully equipped kitchen, terrace & garden. 2–6 guests, from 73 €/night.',
  ogImage: `${siteUrl}/img/hero/hero-poster.webp`,
  ogType: 'website',
})

useHead({
  htmlAttrs: { lang: 'en' },
  titleTemplate: '%s',
  link: [
    { rel: 'canonical', href: `${siteUrl}/en/holiday-apartments/` },
    { rel: 'alternate', hreflang: 'de', href: `${siteUrl}/ferienwohnungen/` },
    { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/en/holiday-apartments/` },
    { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}/ferienwohnungen/` },
  ],
})

useSchemaOrg([
  {
    '@type': 'LodgingBusiness',
    name: 'Pension Volgenandt – Holiday Apartments',
    description:
      'Holiday apartments in the Eichsfeld region near Leinefelde-Worbis with kitchen, terrace, and 25,000 m² garden.',
    url: `${siteUrl}/en/holiday-apartments/`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Breitenbach 12',
      addressLocality: 'Leinefelde-Worbis',
      postalCode: '37327',
      addressRegion: 'Thuringia',
      addressCountry: 'DE',
    },
  },
])

const { data: rooms } = await useAsyncData('ferienwohnungen-en', () =>
  queryCollection('roomsEn').where('type', '=', 'ferienwohnung').order('sortOrder', 'ASC').all(),
)
</script>

<template>
  <div>
    <SharedPageBanner
      image="/img/rooms/schoene-aussicht-wohnkueche.webp"
      :image-alt="t('ferienwohnungen.title', 'en')"
      :title="t('ferienwohnungen.title', 'en')"
      :subtitle="t('ferienwohnungen.subtitle', 'en')"
    />

    <div class="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <!-- Intro -->
      <section class="mx-auto mb-12 max-w-3xl text-center">
        <p class="text-lg leading-relaxed text-sage-700">
          {{ t('ferienwohnungen.intro', 'en') }}
        </p>
      </section>

      <!-- Highlights -->
      <section class="mb-12">
        <h2 class="mb-6 text-center font-serif text-xl font-semibold text-sage-900">
          {{ t('ferienwohnungen.highlights', 'en') }}
        </h2>
        <div class="mx-auto grid max-w-2xl grid-cols-2 gap-4 md:grid-cols-4">
          <div class="flex flex-col items-center gap-2 rounded-lg bg-sage-50 p-4 text-center">
            <Icon name="ph:cooking-pot" class="size-6 text-waldhonig-500" />
            <span class="text-sm font-medium text-sage-700">{{
              t('ferienwohnungen.kitchen', 'en')
            }}</span>
          </div>
          <div class="flex flex-col items-center gap-2 rounded-lg bg-sage-50 p-4 text-center">
            <Icon name="ph:sun-horizon" class="size-6 text-waldhonig-500" />
            <span class="text-sm font-medium text-sage-700">{{
              t('ferienwohnungen.terrace', 'en')
            }}</span>
          </div>
          <div class="flex flex-col items-center gap-2 rounded-lg bg-sage-50 p-4 text-center">
            <Icon name="ph:tree" class="size-6 text-waldhonig-500" />
            <span class="text-sm font-medium text-sage-700">{{
              t('ferienwohnungen.garden', 'en')
            }}</span>
          </div>
          <div class="flex flex-col items-center gap-2 rounded-lg bg-sage-50 p-4 text-center">
            <Icon name="ph:car" class="size-6 text-waldhonig-500" />
            <span class="text-sm font-medium text-sage-700">{{
              t('ferienwohnungen.parking', 'en')
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
            locale="en"
          />
        </div>
      </section>
    </div>

    <SharedSoftCta :text="t('ferienwohnungen.bookNow', 'en')" />
    <SharedBookingCta />
  </div>
</template>
