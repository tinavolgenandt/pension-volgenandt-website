<script setup lang="ts">
const baseURL = useRuntimeConfig().app.baseURL

useHead({
  link: [
    { rel: 'icon', href: `${baseURL}favicon.ico`, sizes: '32x32' },
    { rel: 'icon', href: `${baseURL}favicon.svg`, type: 'image/svg+xml' },
    { rel: 'apple-touch-icon', href: `${baseURL}apple-touch-icon.png` },
    { rel: 'manifest', href: `${baseURL}site.webmanifest` },
  ],
})

useSchemaOrg([
  {
    '@type': 'BedAndBreakfast',
    '@id': 'https://www.pension-volgenandt.de/#identity',
    name: 'Pension Volgenandt',
    description:
      'Familiär geführte Pension in Breitenbach, Eichsfeld. Ferienwohnungen und Zimmer mit Blick ins Grüne.',
    url: 'https://www.pension-volgenandt.de',
    logo: 'https://www.pension-volgenandt.de/img/logo.webp',
    image: 'https://www.pension-volgenandt.de/img/hero/hero-poster.webp',
    telephone: '+49 3605 542775',
    email: 'kontakt@pension-volgenandt.de',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Otto-Reuter-Straße 28',
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
    checkinTime: '15:00',
    checkoutTime: '10:00',
  },
])
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
