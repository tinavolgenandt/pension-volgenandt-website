<script setup lang="ts">
import { t } from '~/utils/translations'

const siteUrl = 'https://www.pension-volgenandt.de'

useHead({
  htmlAttrs: { lang: 'en' },
  titleTemplate: '%s',
  link: [
    { rel: 'canonical', href: `${siteUrl}/en/` },
    { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/en/` },
    { rel: 'alternate', hreflang: 'de', href: `${siteUrl}/` },
    { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}/` },
  ],
})

useSeoMeta({
  title: t('home.title', 'en'),
  ogTitle: t('home.title', 'en'),
  description: t('home.description', 'en'),
  ogDescription: t('home.description', 'en'),
  ogImage: '/img/hero/hero-poster.webp',
  ogType: 'website',
})

// Fetch featured rooms (EN)
const { data: featuredRooms } = await useAsyncData('featured-rooms-en', () =>
  queryCollection('roomsEn').where('featured', '=', true).order('sortOrder', 'ASC').limit(3).all(),
)
</script>

<template>
  <div>
    <!-- Hero section (reuses the video component) -->
    <HomeHeroVideo />

    <!-- Welcome section -->
    <UiScrollReveal>
      <section class="py-14 md:py-24">
        <div class="mx-auto max-w-3xl px-6 text-center">
          <h2 class="font-serif text-3xl font-bold text-sage-900 md:text-4xl">
            {{ t('home.welcomeHeading', 'en') }}
          </h2>
          <p class="mt-6 text-lg leading-relaxed text-sage-700">
            {{ t('home.welcomeText', 'en') }}
          </p>
        </div>
      </section>
    </UiScrollReveal>

    <!-- Featured rooms -->
    <UiScrollReveal>
      <section class="py-14 md:py-24">
        <div class="mx-auto max-w-6xl px-6">
          <h2 class="font-serif text-3xl font-bold text-sage-900 md:text-4xl">
            {{ t('home.ourRooms', 'en') }}
          </h2>
          <div v-if="featuredRooms?.length" class="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            <UiScrollReveal
              v-for="(room, index) in featuredRooms"
              :key="room.slug"
              :delay="index * 150"
            >
              <RoomsCard
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
            </UiScrollReveal>
          </div>
          <div class="mt-10 text-center">
            <NuxtLink
              to="/en/rooms/"
              class="inline-flex items-center gap-1 font-sans text-lg font-medium text-sage-600 transition-colors hover:text-sage-700 hover:underline"
            >
              {{ t('cta.allRooms', 'en') }} &rarr;
            </NuxtLink>
          </div>
        </div>
      </section>
    </UiScrollReveal>

    <!-- Location CTA -->
    <UiScrollReveal>
      <section class="bg-sage-50 py-14 md:py-24">
        <div class="mx-auto max-w-3xl px-6 text-center">
          <h2 class="font-serif text-3xl font-bold text-sage-900 md:text-4xl">
            {{ t('home.locationHeading', 'en') }}
          </h2>
          <p class="mt-6 text-lg leading-relaxed text-sage-700">
            {{ t('home.locationText', 'en') }}
          </p>
          <NuxtLink
            to="/en/contact/"
            class="mt-8 inline-flex items-center gap-2 rounded-lg bg-waldhonig-500 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-waldhonig-600"
          >
            {{ t('nav.contact', 'en') }} &amp; {{ t('directions.heading', 'en') }}
          </NuxtLink>
        </div>
      </section>
    </UiScrollReveal>

    <!-- Booking CTA -->
    <section class="bg-waldhonig-50 px-6 py-12">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="font-serif text-2xl font-semibold text-sage-900">
          {{ t('bookingCta.default', 'en') }}
        </h2>
        <NuxtLink
          to="/en/rooms/"
          class="mt-6 inline-block rounded-lg bg-waldhonig-500 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-waldhonig-600"
        >
          {{ t('cta.viewRooms', 'en') }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
