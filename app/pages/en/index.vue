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
</script>

<template>
  <div>
    <HomeHeroVideo />

    <ClientOnly>
      <HomeHeroLgsBannerMobile />
    </ClientOnly>

    <UiScrollReveal>
      <HomeWelcome />
    </UiScrollReveal>

    <UiScrollReveal>
      <HomeGartenGallery />
    </UiScrollReveal>

    <UiScrollReveal>
      <HomeFeaturedRooms />
    </UiScrollReveal>

    <UiScrollReveal>
      <HomeTestimonials />
    </UiScrollReveal>

    <UiScrollReveal>
      <HomeExperienceTeaser />
    </UiScrollReveal>

    <UiScrollReveal>
      <HomeSustainabilityTeaser />
    </UiScrollReveal>

    <UiScrollReveal>
      <HomeLocationMap />
    </UiScrollReveal>
  </div>
</template>
