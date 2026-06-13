<script setup lang="ts">
import { t } from '~/utils/translations'
import { useJsonLd } from '~/composables/useJsonLd'

definePageMeta({
  breadcrumb: { label: 'Über uns' },
})

useSeoMeta({
  title: 'Über uns – Simone & Ralf Volgenandt',
  ogTitle: 'Über uns | Pension Volgenandt',
  description:
    'Lernen Sie Ihre Gastgeber kennen: Simone & Ralf Volgenandt führen ihre Pension in Breitenbach mit Herzlichkeit und Liebe zur Natur.',
  ogDescription:
    'Lernen Sie Ihre Gastgeber kennen: Simone & Ralf Volgenandt führen ihre Pension in Breitenbach mit Herzlichkeit und Liebe zur Natur.',
  ogImage: '/img/content/gastgeber-portrait.webp',
  ogType: 'profile',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://www.pension-volgenandt.de/willkommen/' },
    { rel: 'alternate', hreflang: 'de', href: 'https://www.pension-volgenandt.de/willkommen/' },
    { rel: 'alternate', hreflang: 'en', href: 'https://www.pension-volgenandt.de/en/about/' },
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: 'https://www.pension-volgenandt.de/willkommen/',
    },
  ],
})

useJsonLd(
  [
    {
      '@type': 'AboutPage',
      '@id': 'https://www.pension-volgenandt.de/willkommen/#about-page',
      url: 'https://www.pension-volgenandt.de/willkommen/',
      name: 'Über uns – Simone & Ralf Volgenandt',
      description:
        'Lernen Sie Ihre Gastgeber kennen: Simone & Ralf Volgenandt führen ihre Pension in Breitenbach mit Herzlichkeit und Liebe zur Natur.',
    },
    {
      '@type': 'Person',
      name: 'Simone Volgenandt',
      jobTitle: 'Gastgeberin',
      worksFor: {
        '@id': 'https://www.pension-volgenandt.de/#identity',
      },
      url: 'https://www.pension-volgenandt.de/willkommen/',
      image: 'https://www.pension-volgenandt.de/img/content/gastgeber-portrait.webp',
    },
    {
      '@type': 'Person',
      name: 'Ralf Volgenandt',
      jobTitle: 'Gastgeber',
      worksFor: {
        '@id': 'https://www.pension-volgenandt.de/#identity',
      },
      url: 'https://www.pension-volgenandt.de/willkommen/',
      image: 'https://www.pension-volgenandt.de/img/content/gastgeber-portrait.webp',
    },
  ],
  'about-schema-de',
)

const { locale } = useLocale()
</script>

<template>
  <div>
    <!-- Hero photo banner -->
    <SharedPageBanner
      image="/img/content/gastgeber-portrait.webp"
      image-alt="Simone und Ralf Volgenandt – Ihre Gastgeber in Breitenbach"
      title="Über uns"
      subtitle="Herzlich willkommen in unserem Zuhause"
    />

    <!-- Intro section -->
    <section class="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <h2 class="font-serif text-2xl font-semibold text-sage-900">
        {{ t('home.welcomeTitle', locale) }}
      </h2>
      <div class="mt-6 space-y-5 text-lg leading-relaxed text-sage-700">
        <p>{{ t('home.welcomeParagraph1', locale) }}</p>
        <p>{{ t('home.welcomeParagraph2', locale) }}</p>
        <p>{{ t('home.welcomeParagraph3', locale) }}</p>
      </div>
    </section>

    <!-- Values / Philosophie -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-4xl">
        <h2 class="mb-10 text-center font-serif text-2xl font-semibold text-sage-900">
          Was uns wichtig ist
        </h2>
        <div class="grid gap-8 sm:grid-cols-3">
          <div class="text-center">
            <Icon name="ph:sun-duotone" class="mx-auto size-10 text-waldhonig-500" />
            <h3 class="mt-4 font-serif text-lg font-semibold text-sage-900">Nachhaltigkeit</h3>
            <p class="mt-2 text-sm leading-relaxed text-sage-600">
              Solarenergie vom eigenen Dach, biologische Kläranlage und ein naturnaher Garten –
              Umweltbewusstsein ist Teil unseres Alltags.
            </p>
          </div>
          <div class="text-center">
            <Icon name="ph:house-line-duotone" class="mx-auto size-10 text-waldhonig-500" />
            <h3 class="mt-4 font-serif text-lg font-semibold text-sage-900">
              Familiäre Atmosphäre
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-sage-600">
              Keine Hotelkälte, sondern echtes Zuhause-Gefühl. Wir sind für Sie da und freuen uns
              auf persönliche Begegnungen.
            </p>
          </div>
          <div class="text-center">
            <Icon name="ph:map-pin-duotone" class="mx-auto size-10 text-waldhonig-500" />
            <h3 class="mt-4 font-serif text-lg font-semibold text-sage-900">Region mit Herz</h3>
            <p class="mt-2 text-sm leading-relaxed text-sage-600">
              Das Eichsfeld ist unsere Heimat. Wir zeigen Ihnen gerne die schönsten Ecken und
              Ausflugsziele rund um Breitenbach.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Foto + Kurzbeschreibung -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 md:items-center">
        <NuxtImg
          src="/img/homepage/gebaeude-innenhof.webp"
          alt="Pension Volgenandt – Gebäude und Innenhof in Breitenbach"
          class="w-full rounded-lg object-cover shadow-sm"
          loading="lazy"
          sizes="100vw md:50vw"
        />
        <div class="space-y-4 text-sage-700">
          <h2 class="font-serif text-2xl font-semibold text-sage-900">
            Unsere Pension in Breitenbach
          </h2>
          <p class="leading-relaxed">
            Unsere Pension liegt ruhig am Ortsrand von Breitenbach, eingebettet in die grüne
            Hügellandschaft des Eichsfelds. Sieben Zimmer und Ferienwohnungen bieten Platz für
            Paare, Familien und auch für Monteur­gäste.
          </p>
          <p class="leading-relaxed">
            Von hier aus erreichen Sie in wenigen Minuten die Natur und in 15 Minuten die Kleinstadt
            Leinefelde-Worbis mit allen Einkaufsmöglichkeiten.
          </p>
          <NuxtLink
            to="/zimmer/"
            class="mt-2 inline-flex items-center gap-2 rounded-lg bg-waldhonig-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-waldhonig-600"
          >
            Zimmer & Preise ansehen
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <SharedBookingCta :text="t('bookingCta.default', locale)" />
  </div>
</template>
