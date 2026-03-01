<script setup lang="ts">
definePageMeta({
  breadcrumb: {
    label: 'Aktivitäten',
  },
})

useSeoMeta({
  title: 'Aktivitäten im Eichsfeld',
  ogTitle: 'Aktivitäten im Eichsfeld | Pension Volgenandt',
  description:
    'Wandern, Radfahren, Burgen und Natur: Entdecken Sie die Aktivitäten rund um die Pension Volgenandt im Eichsfeld.',
  ogDescription:
    'Wandern, Radfahren, Burgen und Natur: Entdecken Sie die Aktivitäten rund um die Pension Volgenandt im Eichsfeld.',
  ogImage: '/img/banners/aktivitaeten-banner.webp',
  ogType: 'website',
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://www.pension-volgenandt.de/aktivitaeten/',
    },
    {
      rel: 'alternate',
      hreflang: 'de',
      href: 'https://www.pension-volgenandt.de/aktivitaeten/',
    },
  ],
})

// Fetch all attractions for the overview
const { data: attractions } = await useAsyncData('aktivitaeten-all-attractions', () =>
  queryCollection('attractions').order('sortOrder', 'ASC').all(),
)

const activityCards = [
  {
    title: 'Wandern',
    description:
      'Das Eichsfeld bietet ein dichtes Netz an Wanderwegen durch sanfte Hügel, tiefe Wälder und entlang historischer Pfade.',
    icon: 'ph:mountains-duotone',
    to: '/aktivitaeten/wandern/',
  },
  {
    title: 'Radfahren',
    description:
      'Ob gemütliche Radtour entlang der Leine oder sportliche Route durch die Hügel – hier ist für jeden etwas dabei.',
    icon: 'ph:bicycle-duotone',
    to: '/aktivitaeten/radfahren/',
  },
]
</script>

<template>
  <div>
    <!-- 1. Thin photo banner -->
    <ContentPageBanner
      image="/img/banners/aktivitaeten-banner.webp"
      image-alt="Wanderweg durch die Hügel des Eichsfelds"
      title="Aktivitäten"
      subtitle="Entdecken Sie das Eichsfeld"
    />

    <!-- 2. Personal intro -->
    <section class="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p class="text-lg leading-relaxed text-sage-800">
        Das Eichsfeld ist ein Paradies für alle, die gerne draußen unterwegs sind. In der
        Umgebung unserer Pension finden Sie zahlreiche Wander- und Radwege, die durch eine der
        schönsten Landschaften Thüringens führen.
      </p>
      <p class="mt-4 text-lg leading-relaxed text-sage-800">
        Ob sportlich oder gemütlich, allein oder mit der Familie – wir beraten Sie gerne zu den
        besten Routen und Ausflugszielen in unserer Nähe.
      </p>
    </section>

    <!-- 3. Beliebte Ausflugsziele -->
    <section class="bg-cream px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <h2 class="mb-8 text-center font-serif text-2xl font-semibold text-sage-900">
          Beliebte Ausflugsziele
        </h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="attraction in attractions"
            :key="attraction.slug"
            :to="`/ausflugsziele/${attraction.slug}/`"
            class="group overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div v-if="attraction.heroImage" class="aspect-[16/10] overflow-hidden bg-sage-100">
              <NuxtImg
                :src="attraction.heroImage"
                :alt="attraction.heroImageAlt"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div v-else class="flex aspect-[16/10] items-center justify-center bg-sage-100">
              <Icon name="ph:map-pin-duotone" class="size-12 text-sage-300" />
            </div>
            <div class="p-5">
              <div class="mb-2">
                <ContentDistanceBadge
                  :distance-km="attraction.distanceKm"
                  :driving-minutes="attraction.drivingMinutes"
                />
              </div>
              <h3 class="font-serif text-lg font-semibold text-sage-900">
                {{ attraction.name }}
              </h3>
              <p class="mt-1 text-sm leading-relaxed text-sage-700">
                {{ attraction.shortDescription }}
              </p>
              <span
                class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-waldhonig-600 transition-colors group-hover:text-waldhonig-700"
              >
                Mehr erfahren
                <Icon name="ph:arrow-right" class="size-4" />
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 4. Sportliche Aktivitäten -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <h2 class="mb-8 text-center font-serif text-2xl font-semibold text-sage-900">
          Sportliche Aktivitäten
        </h2>
        <div class="grid gap-6 sm:grid-cols-2">
          <NuxtLink
            v-for="activity in activityCards"
            :key="activity.title"
            :to="activity.to"
            class="group rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div class="flex items-start gap-4">
              <Icon :name="activity.icon" class="size-10 shrink-0 text-sage-600" />
              <div class="flex-1">
                <h3 class="font-serif text-xl font-semibold text-sage-900">
                  {{ activity.title }}
                </h3>
                <p class="mt-2 leading-relaxed text-sage-700">
                  {{ activity.description }}
                </p>
                <span
                  class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-waldhonig-600 transition-colors group-hover:text-waldhonig-700"
                >
                  Mehr erfahren
                  <Icon name="ph:arrow-right" class="size-4" />
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 5. Auch im Winter -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <div class="grid items-center gap-8 md:grid-cols-2">
          <NuxtImg
            src="/img/content/landschaft-winter.webp"
            alt="Winterlandschaft im Eichsfeld mit verschneiten Feldern"
            class="rounded-lg"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div>
            <h2 class="font-serif text-2xl font-bold text-sage-900">
              Auch im Winter reizvoll
            </h2>
            <p class="mt-4 leading-relaxed text-sage-800">
              Das Eichsfeld ist zu jeder Jahreszeit einen Besuch wert. Im Winter verwandelt sich
              die Landschaft in ein stilles Winterwunderland – ideal für Spaziergänge durch
              verschneite Felder und gemütliche Abende in unserer Pension.
            </p>
            <p class="mt-4 leading-relaxed text-sage-800">
              Die Burgen und Museen der Region sind auch in der kalten Jahreszeit geöffnet, und
              die Eichsfelder Küche wärmt von innen.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Booking CTA -->
    <ContentBookingCta text="Planen Sie Ihren aktiven Urlaub im Eichsfeld" />
  </div>
</template>
