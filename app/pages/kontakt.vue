<script setup lang="ts">
import { t } from '~/utils/translations'
import { useJsonLd } from '~/composables/useJsonLd'

const { locale } = useLocale()

definePageMeta({
  breadcrumb: {
    label: 'Kontakt',
  },
})

useSeoMeta({
  title: 'Kontakt',
  ogTitle: 'Kontakt | Pension Volgenandt',
  description:
    'Kontaktieren Sie die Pension Volgenandt: Telefon, E-Mail oder Kontaktformular. Anfahrt von der A38 und Bahnhof Leinefelde.',
  ogDescription:
    'Kontaktieren Sie die Pension Volgenandt: Telefon, E-Mail oder Kontaktformular. Anfahrt von der A38 und Bahnhof Leinefelde.',
  ogImage: '/img/homepage/gebaeude-innenhof.webp',
  ogType: 'website',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://www.pension-volgenandt.de/kontakt/' },
    {
      rel: 'alternate',
      hreflang: 'de',
      href: 'https://www.pension-volgenandt.de/kontakt/',
    },
    {
      rel: 'alternate',
      hreflang: 'en',
      href: 'https://www.pension-volgenandt.de/en/contact/',
    },
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: 'https://www.pension-volgenandt.de/kontakt/',
    },
  ],
})

const appConfig = useAppConfig()

// Fetch FAQ data
const { data: faqData } = await useAsyncData('faq', () => queryCollection('faq').first())

// FAQPage structured data
const faqItems = computed(() => faqData.value?.items ?? [])

useJsonLd(
  {
    '@type': 'FAQPage',
    '@id': 'https://www.pension-volgenandt.de/kontakt/#faq',
    url: 'https://www.pension-volgenandt.de/kontakt/',
    mainEntity: (faqData.value?.items ?? []).map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.replace(/<[^>]*>/g, ''),
      },
    })),
  },
  'contact-faq-schema-de',
)
</script>

<template>
  <div>
    <!-- 1. Thin photo banner -->
    <SharedPageBanner
      image="/img/garten/einfahrt-sommer.webp"
      image-alt="Pension Volgenandt – Einfahrt mit Gartenblick im Sommer"
      :title="t('contact.heading', locale)"
      :subtitle="t('contact.subtitle', locale)"
    />

    <!-- Section 1: Contact info + Form side by side -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
        <!-- Left column: Contact details -->
        <div>
          <h2 class="font-serif text-2xl font-semibold text-sage-900">
            {{ t('contact.talkToUs', locale) }}
          </h2>
          <p class="mt-4 leading-relaxed text-sage-800">
            {{ t('contact.talkToUsText', locale) }}
          </p>

          <div class="mt-8 space-y-6">
            <!-- Mobile (preferred) -->
            <div class="flex items-start gap-4">
              <Icon name="ph:device-mobile" class="mt-0.5 size-6 shrink-0 text-sage-600" />
              <div>
                <p class="font-semibold text-sage-900">{{ t('contact.mobile', locale) }}</p>
                <a
                  :href="`tel:${appConfig.contact.mobile}`"
                  class="text-lg text-sage-700 transition-colors hover:text-sage-900"
                >
                  {{ appConfig.contact.mobileDisplay }}
                </a>
              </div>
            </div>

            <!-- WhatsApp -->
            <div class="flex items-start gap-4">
              <Icon name="ph:whatsapp-logo" class="mt-0.5 size-6 shrink-0 text-sage-600" />
              <div>
                <p class="font-semibold text-sage-900">{{ t('contact.whatsapp', locale) }}</p>
                <a
                  :href="appConfig.contact.whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-lg text-sage-700 transition-colors hover:text-sage-900"
                >
                  {{ appConfig.contact.mobileDisplay }}
                </a>
              </div>
            </div>

            <!-- Landline -->
            <div class="flex items-start gap-4">
              <Icon name="ph:phone" class="mt-0.5 size-6 shrink-0 text-sage-600" />
              <div>
                <p class="font-semibold text-sage-900">{{ t('contact.landline', locale) }}</p>
                <a
                  :href="`tel:${appConfig.contact.landline}`"
                  class="text-lg text-sage-700 transition-colors hover:text-sage-900"
                >
                  {{ appConfig.contact.landlineDisplay }}
                </a>
              </div>
            </div>

            <!-- Email -->
            <div class="flex items-start gap-4">
              <Icon name="ph:envelope-simple" class="mt-0.5 size-6 shrink-0 text-sage-600" />
              <div>
                <p class="font-semibold text-sage-900">{{ t('contact.email', locale) }}</p>
                <a
                  :href="`mailto:${appConfig.contact.email}`"
                  class="text-lg text-sage-700 transition-colors hover:text-sage-900"
                >
                  {{ appConfig.contact.email }}
                </a>
              </div>
            </div>

            <!-- Address -->
            <div class="flex items-start gap-4">
              <Icon name="ph:map-pin" class="mt-0.5 size-6 shrink-0 text-sage-600" />
              <div>
                <p class="font-semibold text-sage-900">{{ t('contact.address', locale) }}</p>
                <p class="text-sage-700">
                  {{ appConfig.contact.address.street }}<br />
                  {{ appConfig.contact.address.city }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right column: Contact form -->
        <div>
          <h2 class="font-serif text-2xl font-semibold text-sage-900">
            {{ t('contact.sendMessage', locale) }}
          </h2>
          <p class="mt-4 mb-6 leading-relaxed text-sage-800">
            {{ t('contact.sendMessageText', locale) }}
          </p>
          <ContactForm />
        </div>
      </div>
    </section>

    <!-- Section 2: Visual divider with garden + building -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
        <figure>
          <NuxtImg
            src="/img/content/gastgeber-portrait.webp"
            alt="Simone und Ralf Volgenandt – Ihre Gastgeber in Breitenbach"
            class="aspect-[4/3] w-full rounded-lg object-cover"
            loading="lazy"
            sizes="100vw sm:50vw"
          />
          <figcaption class="mt-2 text-center text-sm text-sage-600">
            {{ t('hosts.caption', locale) }}
          </figcaption>
        </figure>
        <figure>
          <NuxtImg
            src="/img/homepage/gebaeude-innenhof.webp"
            alt="Pension Volgenandt – Gebäude und Innenhof"
            class="aspect-[4/3] w-full rounded-lg object-cover"
            loading="lazy"
            sizes="100vw sm:50vw"
          />
          <figcaption class="mt-2 text-center text-sm text-sage-600">
            {{ t('hosts.buildingCaption', locale) }}
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- Section 3: Driving directions + Map -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <h2 class="mb-8 text-center font-serif text-2xl font-semibold text-sage-900">
          {{ t('directions.heading', locale) }}
        </h2>
        <div class="grid gap-8 md:grid-cols-2">
          <!-- Left: Text directions -->
          <div class="space-y-6">
            <div>
              <h3 class="flex items-center gap-2 font-semibold text-sage-900">
                <Icon name="ph:car" class="size-5" />
                {{ t('directions.byCar', locale) }}
              </h3>
              <p class="mt-2 leading-relaxed text-sage-700">
                {{ t('directions.byCarText', locale) }}
              </p>
            </div>
            <div>
              <h3 class="flex items-center gap-2 font-semibold text-sage-900">
                <Icon name="ph:train" class="size-5" />
                {{ t('directions.byTrain', locale) }}
              </h3>
              <p class="mt-2 leading-relaxed text-sage-700">
                {{ t('directions.byTrainText', locale) }}
              </p>
            </div>
            <div>
              <h3 class="flex items-center gap-2 font-semibold text-sage-900">
                <Icon name="ph:navigation-arrow" class="size-5" />
                {{ t('directions.gps', locale) }}
              </h3>
              <p class="mt-2 text-sage-700">
                <span class="font-mono text-sm">51.4124, 10.3220</span>
              </p>
              <a
                href="https://maps.app.goo.gl/pGocG9jFPzXkpvGbA"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-2 inline-flex items-center gap-1 text-sm text-waldhonig-600 underline hover:text-waldhonig-700"
              >
                <Icon name="ph:map-pin" class="size-4" />
                {{ t('directions.openMaps', locale) }}
              </a>
            </div>
          </div>

          <!-- Right: Consent-gated map -->
          <div>
            <ContactDirectionsMap />
          </div>
        </div>
      </div>
    </section>

    <!-- Section 4: FAQ accordion -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto max-w-3xl">
        <h2 class="mb-8 text-center font-serif text-2xl font-semibold text-sage-900">
          {{ t('faq.heading', locale) }}
        </h2>
        <ContactFaqAccordion v-if="faqItems.length" :items="faqItems" />
      </div>
    </section>

    <!-- Soft CTA + Booking CTA -->
    <SharedSoftCta :text="t('softCta.default', locale)" />
    <SharedBookingCta :text="t('bookingCta.default', locale)" />
  </div>
</template>
