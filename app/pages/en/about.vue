<script setup lang="ts">
import { t } from '~/utils/translations'
import { useJsonLd } from '~/composables/useJsonLd'

useHead({
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'canonical', href: 'https://www.pension-volgenandt.de/en/about/' },
    { rel: 'alternate', hreflang: 'en', href: 'https://www.pension-volgenandt.de/en/about/' },
    { rel: 'alternate', hreflang: 'de', href: 'https://www.pension-volgenandt.de/willkommen/' },
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: 'https://www.pension-volgenandt.de/willkommen/',
    },
  ],
})

useSeoMeta({
  title: 'About Us – Simone & Ralf Volgenandt',
  ogTitle: 'About Us | Pension Volgenandt',
  description:
    'Meet your hosts: Simone & Ralf Volgenandt run their guesthouse in Breitenbach with warmth and a love of nature.',
  ogDescription:
    'Meet your hosts: Simone & Ralf Volgenandt run their guesthouse in Breitenbach with warmth and a love of nature.',
  ogImage: '/img/content/gastgeber-portrait.webp',
  ogType: 'profile',
})

useJsonLd(
  [
    {
      '@type': 'AboutPage',
      '@id': 'https://www.pension-volgenandt.de/en/about/#about-page',
      url: 'https://www.pension-volgenandt.de/en/about/',
      name: 'About Us – Simone & Ralf Volgenandt',
      description:
        'Meet your hosts: Simone & Ralf Volgenandt run their guesthouse in Breitenbach with warmth and a love of nature.',
    },
    {
      '@type': 'Person',
      name: 'Simone Volgenandt',
      jobTitle: 'Host',
      worksFor: {
        '@id': 'https://www.pension-volgenandt.de/#identity',
      },
      url: 'https://www.pension-volgenandt.de/en/about/',
      image: 'https://www.pension-volgenandt.de/img/content/gastgeber-portrait.webp',
    },
    {
      '@type': 'Person',
      name: 'Ralf Volgenandt',
      jobTitle: 'Host',
      worksFor: {
        '@id': 'https://www.pension-volgenandt.de/#identity',
      },
      url: 'https://www.pension-volgenandt.de/en/about/',
      image: 'https://www.pension-volgenandt.de/img/content/gastgeber-portrait.webp',
    },
  ],
  'about-schema-en',
)
</script>

<template>
  <div>
    <!-- Hero photo banner -->
    <SharedPageBanner
      image="/img/content/gastgeber-portrait.webp"
      image-alt="Simone and Ralf Volgenandt, your hosts in Breitenbach"
      title="About Us"
      subtitle="Welcome to our home in the Eichsfeld"
    />

    <!-- Intro section -->
    <section class="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <h2 class="font-serif text-2xl font-semibold text-sage-900">
        {{ t('home.welcomeTitle', 'en') }}
      </h2>
      <div class="mt-6 space-y-5 text-lg leading-relaxed text-sage-700">
        <p>{{ t('home.welcomeParagraph1', 'en') }}</p>
        <p>{{ t('home.welcomeParagraph2', 'en') }}</p>
        <p>{{ t('home.welcomeParagraph3', 'en') }}</p>
      </div>
    </section>

    <!-- Values -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-4xl">
        <h2 class="mb-10 text-center font-serif text-2xl font-semibold text-sage-900">
          What matters to us
        </h2>
        <div class="grid gap-8 sm:grid-cols-3">
          <div class="text-center">
            <Icon name="ph:sun-duotone" class="mx-auto size-10 text-waldhonig-500" />
            <h3 class="mt-4 font-serif text-lg font-semibold text-sage-900">Sustainability</h3>
            <p class="mt-2 text-sm leading-relaxed text-sage-600">
              Solar panels on our own roof, a biological wastewater system and a nature-friendly
              garden: environmental awareness is part of our everyday life.
            </p>
          </div>
          <div class="text-center">
            <Icon name="ph:house-line-duotone" class="mx-auto size-10 text-waldhonig-500" />
            <h3 class="mt-4 font-serif text-lg font-semibold text-sage-900">Home atmosphere</h3>
            <p class="mt-2 text-sm leading-relaxed text-sage-600">
              No hotel formality, just a genuine home feeling. We are here for you and look forward
              to personal encounters with our guests.
            </p>
          </div>
          <div class="text-center">
            <Icon name="ph:map-pin-duotone" class="mx-auto size-10 text-waldhonig-500" />
            <h3 class="mt-4 font-serif text-lg font-semibold text-sage-900">Region with heart</h3>
            <p class="mt-2 text-sm leading-relaxed text-sage-600">
              The Eichsfeld is our home. We are happy to share our favourite spots and day-trip
              destinations around Breitenbach with you.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Photo + description -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 md:items-center">
        <NuxtImg
          src="/img/homepage/gebaeude-innenhof.webp"
          alt="Building and courtyard of Pension Volgenandt in Breitenbach"
          class="w-full rounded-lg object-cover shadow-sm"
          loading="lazy"
          sizes="100vw md:50vw"
        />
        <div class="space-y-4 text-sage-700">
          <h2 class="font-serif text-2xl font-semibold text-sage-900">
            Our guesthouse in Breitenbach
          </h2>
          <p class="leading-relaxed">
            Our guesthouse sits quietly on the edge of Breitenbach, in the green hills of the
            Eichsfeld. Seven rooms and holiday apartments accommodate couples, families
            and also business travellers.
          </p>
          <p class="leading-relaxed">
            From here you can reach nature within minutes and the town of Leinefelde-Worbis with all
            amenities within 15 minutes.
          </p>
          <NuxtLink
            to="/en/rooms/"
            class="mt-2 inline-flex items-center gap-2 rounded-lg bg-waldhonig-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-waldhonig-600"
          >
            View rooms & prices
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <SharedBookingCta :text="t('bookingCta.default', 'en')" />
  </div>
</template>
