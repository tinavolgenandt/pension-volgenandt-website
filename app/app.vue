<script setup lang="ts">
import { useJsonLd } from '~/composables/useJsonLd'

const baseURL = useRuntimeConfig().app.baseURL
const { locale } = useLocale()

// nuxt-seo-utils sets <html lang> from site.defaultLocale ('de') with
// tagPriority 'low', which unhead applies after normal-priority entries.
// Register ours at the same priority (later wins) so /en/* renders lang="en".
useHead({ htmlAttrs: { lang: locale } }, { tagPriority: 'low' })

const BRAND = 'Pension Volgenandt'

useHead({
  // Append the brand only when the page title doesn't already contain it
  titleTemplate: (title?: string) =>
    !title ? BRAND : title.includes(BRAND) ? title : `${title} | ${BRAND}`,
  link: [
    { rel: 'icon', href: `${baseURL}favicon.ico`, sizes: '16x16 32x32 48x48' },
    { rel: 'icon', href: `${baseURL}favicon.svg`, type: 'image/svg+xml' },
    { rel: 'icon', href: `${baseURL}favicon-48x48.png`, sizes: '48x48', type: 'image/png' },
    { rel: 'apple-touch-icon', href: `${baseURL}apple-touch-icon.png` },
    { rel: 'manifest', href: `${baseURL}site.webmanifest` },
    { rel: 'preconnect', href: 'https://beds24.com' },
    { rel: 'dns-prefetch', href: 'https://beds24.com' },
  ],
})

// Global social meta: twitter card + og:locale (follows the route locale)
useSeoMeta({
  twitterCard: 'summary_large_image',
  ogLocale: () => (locale.value === 'en' ? 'en_GB' : 'de_DE'),
  ogLocaleAlternate: () => (locale.value === 'en' ? 'de_DE' : 'en_GB'),
  ogSiteName: 'Pension Volgenandt',
})

useJsonLd(
  [
    {
      '@type': 'WebSite',
      name: 'Pension Volgenandt',
      url: 'https://www.pension-volgenandt.de',
      inLanguage: 'de-DE',
    },
    {
      '@type': 'BedAndBreakfast',
      '@id': 'https://www.pension-volgenandt.de/#identity',
      name: 'Pension Volgenandt',
      description:
        'Familiär geführte Pension in Breitenbach, Eichsfeld. Ferienwohnungen und Zimmer mit Blick ins Grüne.',
      url: 'https://www.pension-volgenandt.de',
      logo: 'https://www.pension-volgenandt.de/favicon.svg',
      image: 'https://www.pension-volgenandt.de/img/hero/hero-poster.webp',
      telephone: '+49 160 97719112',
      email: 'kontakt@pension-volgenandt.de',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Otto-Reutter-Straße 28',
        addressLocality: 'Leinefelde-Worbis OT Breitenbach',
        postalCode: '37327',
        addressRegion: 'Thüringen',
        addressCountry: 'DE',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 51.4124,
        longitude: 10.322,
      },
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'WiFi', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Parking', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Breakfast', value: true },
      ],
      petsAllowed: true,
      priceRange: 'EUR 38-89',
      checkinTime: '14:00',
      checkoutTime: '11:00',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '08:00',
          closes: '22:00',
        },
      ],
      sameAs: [
        'https://maps.app.goo.gl/pGocG9jFPzXkpvGbA',
        'https://www.booking.com/hotel/de/pension-volgenandt.de.html',
      ],
    },
  ],
  'global-structured-data',
)
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
