<script setup lang="ts">
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
  ogImage: '/img/banners/kontakt-banner.webp',
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
  ],
})

const appConfig = useAppConfig()

// Fetch FAQ data
const { data: faqData } = await useAsyncData('faq', () => queryCollection('faq').first())

// FAQPage structured data
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
</script>

<template>
  <div>
    <!-- 1. Thin photo banner -->
    <ContentPageBanner
      image="/img/banners/kontakt-banner.webp"
      image-alt="Eingangsbereich der Pension Volgenandt"
      title="Kontakt & Anfahrt"
      subtitle="Wir freuen uns auf Sie"
    />

    <!-- Section 1: Contact info + Form side by side -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
        <!-- Left column: Contact details -->
        <div>
          <h2 class="font-serif text-2xl font-semibold text-sage-900">Sprechen Sie uns an</h2>
          <p class="mt-4 leading-relaxed text-sage-800">
            Ob Sie eine Frage haben, ein Zimmer buchen möchten oder einfach mehr über unsere Pension
            erfahren wollen – wir sind gerne für Sie da.
          </p>

          <div class="mt-8 space-y-6">
            <!-- Phone -->
            <div class="flex items-start gap-4">
              <Icon name="ph:phone" class="mt-0.5 size-6 shrink-0 text-sage-600" />
              <div>
                <p class="font-semibold text-sage-900">Telefon</p>
                <a
                  :href="`tel:${appConfig.contact.phone}`"
                  class="text-lg text-sage-700 transition-colors hover:text-sage-900"
                >
                  {{ appConfig.contact.phoneDisplay }}
                </a>
              </div>
            </div>

            <!-- Mobile -->
            <div class="flex items-start gap-4">
              <Icon name="ph:device-mobile" class="mt-0.5 size-6 shrink-0 text-sage-600" />
              <div>
                <p class="font-semibold text-sage-900">Mobil</p>
                <a
                  :href="`tel:${appConfig.contact.mobile}`"
                  class="text-lg text-sage-700 transition-colors hover:text-sage-900"
                >
                  {{ appConfig.contact.mobileDisplay }}
                </a>
              </div>
            </div>

            <!-- Email -->
            <div class="flex items-start gap-4">
              <Icon name="ph:envelope-simple" class="mt-0.5 size-6 shrink-0 text-sage-600" />
              <div>
                <p class="font-semibold text-sage-900">E-Mail</p>
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
                <p class="font-semibold text-sage-900">Adresse</p>
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
          <h2 class="font-serif text-2xl font-semibold text-sage-900">Nachricht senden</h2>
          <p class="mt-4 mb-6 leading-relaxed text-sage-800">
            Schreiben Sie uns – wir antworten in der Regel innerhalb von 24 Stunden.
          </p>
          <ContactForm />
        </div>
      </div>
    </section>

    <!-- Section 2: Driving directions + Map -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <h2 class="mb-8 text-center font-serif text-2xl font-semibold text-sage-900">Anfahrt</h2>
        <div class="grid gap-8 md:grid-cols-2">
          <!-- Left: Text directions -->
          <div class="space-y-6">
            <div>
              <h3 class="flex items-center gap-2 font-semibold text-sage-900">
                <Icon name="ph:car" class="size-5" />
                Mit dem Auto (A38)
              </h3>
              <p class="mt-2 leading-relaxed text-sage-700">
                Von der A38 nehmen Sie die Ausfahrt Leinefelde und folgen der Beschilderung Richtung
                Breitenbach. Nach etwa 10 Minuten Fahrt erreichen Sie unsere Pension an der
                Otto-Reuter-Straße 28. Kostenlose Parkplätze stehen direkt vor dem Haus bereit.
              </p>
            </div>
            <div>
              <h3 class="flex items-center gap-2 font-semibold text-sage-900">
                <Icon name="ph:train" class="size-5" />
                Mit der Bahn
              </h3>
              <p class="mt-2 leading-relaxed text-sage-700">
                Vom Bahnhof Leinefelde sind es 4 km bis zu unserer Pension. Gerne holen wir Sie nach
                Absprache vom Bahnhof ab – rufen Sie uns einfach vorher an.
              </p>
            </div>
            <div>
              <h3 class="flex items-center gap-2 font-semibold text-sage-900">
                <Icon name="ph:navigation-arrow" class="size-5" />
                Koordinaten für das Navi
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
                In Google Maps öffnen
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

    <!-- Section 3: FAQ accordion -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto max-w-3xl">
        <h2 class="mb-8 text-center font-serif text-2xl font-semibold text-sage-900">
          Häufige Fragen
        </h2>
        <ContactFaqAccordion v-if="faqItems.length" :items="faqItems" />
      </div>
    </section>

    <!-- Soft CTA + Booking CTA -->
    <ContentSoftCta text="Noch eine Frage? Wir sind gerne für Sie da." />
    <ContentBookingCta text="Finden Sie Ihr perfektes Zimmer" />
  </div>
</template>
