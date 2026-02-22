<script setup lang="ts">
useSeoMeta({
  title: 'Pension Volgenandt | Ruhe finden im Eichsfeld',
  ogTitle: 'Pension Volgenandt | Ruhe finden im Eichsfeld',
  description:
    'Familiär geführte Pension in Breitenbach, Eichsfeld. Ferienwohnungen und Zimmer mit Blick ins Grüne. Wandern, Burgen, Bärenpark in der Nähe.',
  ogDescription:
    'Familiär geführte Pension in Breitenbach, Eichsfeld. Ferienwohnungen und Zimmer mit Blick ins Grüne. Wandern, Burgen, Bärenpark in der Nähe.',
  ogImage: '/img/hero/hero-poster.webp',
  ogType: 'website',
})
useHead({
  titleTemplate: '%s',
  link: [
    { rel: 'canonical', href: 'https://www.pension-volgenandt.de/' },
    { rel: 'alternate', hreflang: 'de', href: 'https://www.pension-volgenandt.de/' },
  ],
})
</script>

<template>
  <div>
    <HomeHeroVideo />

    <UiScrollReveal>
      <HomeWelcome />
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
