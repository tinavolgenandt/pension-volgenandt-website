<script setup lang="ts">
import { t } from '~/utils/translations'

const siteUrl = 'https://www.pension-volgenandt.de'

const { data: faqData } = await useAsyncData('faq-en', () => queryCollection('faqEn').first())
const faqItems = computed(() => faqData.value?.items ?? [])

useSchemaOrg([
  defineWebPage({
    '@type': 'FAQPage',
  }),
  ...(faqData.value?.items ?? []).map((item) =>
    defineQuestion({
      name: item.question,
      acceptedAnswer: item.answer.replace(/<[^>]*>/g, ''),
    }),
  ),
])

useHead({
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'canonical', href: `${siteUrl}/en/contact/` },
    { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/en/contact/` },
    { rel: 'alternate', hreflang: 'de', href: `${siteUrl}/kontakt/` },
    { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}/kontakt/` },
  ],
})

useSeoMeta({
  title: 'Contact',
  ogTitle: 'Contact | Pension Volgenandt',
  description:
    'Contact Pension Volgenandt: phone, email or contact form. Directions from the A38 motorway and Leinefelde station.',
  ogDescription:
    'Contact Pension Volgenandt: phone, email or contact form. Directions from the A38 motorway and Leinefelde station.',
  ogImage: '/img/homepage/gebaeude-innenhof.webp',
  ogType: 'website',
})

const appConfig = useAppConfig()
</script>

<template>
  <div>
    <!-- 1. Thin photo banner -->
    <SharedPageBanner
      image="/img/garten/einfahrt-sommer.webp"
      image-alt="Pension Volgenandt – Entrance with garden view in summer"
      :title="t('contact.heading', 'en')"
      :subtitle="t('contact.subtitle', 'en')"
    />

    <!-- Section 1: Contact info + Form side by side -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
        <!-- Left column: Contact details -->
        <div>
          <h2 class="font-serif text-2xl font-semibold text-sage-900">
            {{ t('contact.talkToUs', 'en') }}
          </h2>
          <p class="mt-4 leading-relaxed text-sage-800">
            {{ t('contact.talkToUsText', 'en') }}
          </p>

          <div class="mt-8 space-y-6">
            <!-- Mobile (preferred) -->
            <div class="flex items-start gap-4">
              <Icon name="ph:device-mobile" class="mt-0.5 size-6 shrink-0 text-sage-600" />
              <div>
                <p class="font-semibold text-sage-900">{{ t('contact.mobile', 'en') }}</p>
                <a
                  :href="`tel:${appConfig.contact.mobile}`"
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
                <p class="font-semibold text-sage-900">{{ t('contact.landline', 'en') }}</p>
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
                <p class="font-semibold text-sage-900">{{ t('contact.email', 'en') }}</p>
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
                <p class="font-semibold text-sage-900">{{ t('contact.address', 'en') }}</p>
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
            {{ t('contact.sendMessage', 'en') }}
          </h2>
          <p class="mt-4 mb-6 leading-relaxed text-sage-800">
            {{ t('contact.sendMessageText', 'en') }}
          </p>
          <ContactForm locale="en" />
        </div>
      </div>
    </section>

    <!-- Section 2: Visual divider with garden + building -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
        <figure>
          <NuxtImg
            src="/img/content/gastgeber-portrait.webp"
            alt="Simone and Ralf Volgenandt – Your hosts in Breitenbach"
            class="aspect-[4/3] w-full rounded-lg object-cover"
            loading="lazy"
            sizes="100vw sm:50vw"
          />
          <figcaption class="mt-2 text-center text-sm text-sage-600">
            {{ t('hosts.caption', 'en') }}
          </figcaption>
        </figure>
        <figure>
          <NuxtImg
            src="/img/homepage/gebaeude-innenhof.webp"
            alt="Pension Volgenandt – Building and courtyard"
            class="aspect-[4/3] w-full rounded-lg object-cover"
            loading="lazy"
            sizes="100vw sm:50vw"
          />
          <figcaption class="mt-2 text-center text-sm text-sage-600">
            {{ t('hosts.buildingCaption', 'en') }}
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- Section 3: Driving directions + Map -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <h2 class="mb-8 text-center font-serif text-2xl font-semibold text-sage-900">
          {{ t('directions.heading', 'en') }}
        </h2>
        <div class="grid gap-8 md:grid-cols-2">
          <!-- Left: Text directions -->
          <div class="space-y-6">
            <div>
              <h3 class="flex items-center gap-2 font-semibold text-sage-900">
                <Icon name="ph:car" class="size-5" />
                {{ t('directions.byCar', 'en') }}
              </h3>
              <p class="mt-2 leading-relaxed text-sage-700">
                {{ t('directions.byCarText', 'en') }}
              </p>
            </div>
            <div>
              <h3 class="flex items-center gap-2 font-semibold text-sage-900">
                <Icon name="ph:train" class="size-5" />
                {{ t('directions.byTrain', 'en') }}
              </h3>
              <p class="mt-2 leading-relaxed text-sage-700">
                {{ t('directions.byTrainText', 'en') }}
              </p>
            </div>
            <div>
              <h3 class="flex items-center gap-2 font-semibold text-sage-900">
                <Icon name="ph:navigation-arrow" class="size-5" />
                {{ t('directions.gps', 'en') }}
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
                {{ t('directions.openMaps', 'en') }}
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
          {{ t('faq.heading', 'en') }}
        </h2>
        <ContactFaqAccordion v-if="faqItems.length" :items="faqItems" />
      </div>
    </section>

    <!-- Soft CTA + Booking CTA -->
    <section class="bg-sage-50 px-6 py-12">
      <div class="mx-auto max-w-2xl text-center">
        <Icon name="ph:phone" class="mx-auto mb-4 size-8 text-sage-600" />
        <p class="text-lg leading-relaxed text-sage-800">
          {{ t('softCta.default', 'en') }}
        </p>
        <p class="mt-4">
          <a
            :href="`tel:${appConfig.contact.phone}`"
            class="text-xl font-semibold text-sage-700 transition-colors hover:text-sage-900"
          >
            {{ appConfig.contact.phoneDisplay }}
          </a>
        </p>
        <p class="mt-2 text-sm text-sage-500">{{ t('softCta.callUs', 'en') }}</p>
      </div>
    </section>

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
