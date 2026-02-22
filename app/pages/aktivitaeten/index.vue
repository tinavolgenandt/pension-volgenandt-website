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

// Fetch top 3 attractions for the overview cards
const { data: attractions } = await useAsyncData('aktivitaeten-attractions', () =>
  queryCollection('attractions').order('sortOrder', 'ASC').limit(3).all(),
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
        Das Eichsfeld ist ein Paradies für alle, die gerne draußen unterwegs sind. Direkt vor
        unserer Tür beginnen Wander- und Radwege, die durch eine der schönsten Landschaften
        Thüringens führen.
      </p>
      <p class="mt-4 text-lg leading-relaxed text-sage-800">
        Ob sportlich oder gemütlich, allein oder mit der Familie – wir beraten Sie gerne zu den
        besten Routen und Ausflugszielen in unserer Nähe.
      </p>
    </section>

    <!-- 3. Sportliche Aktivitäten -->
    <section class="bg-cream px-6 py-12 md:py-16">
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

    <!-- 4. Ausflugsziele in der Nähe -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <h2 class="mb-8 text-center font-serif text-2xl font-semibold text-sage-900">
          Ausflugsziele in der Nähe
        </h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="attraction in attractions"
            :key="attraction.slug"
            :to="`/ausflugsziele/${attraction.slug}/`"
            class="group overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div class="aspect-[16/10] overflow-hidden bg-sage-100">
              <NuxtImg
                :src="attraction.heroImage"
                :alt="attraction.heroImageAlt"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
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

        <!-- Link to all attractions -->
        <div class="mt-8 text-center">
          <NuxtLink
            to="/ausflugsziele/"
            class="inline-flex items-center gap-2 font-medium text-waldhonig-600 transition-colors hover:text-waldhonig-700"
          >
            Alle Ausflugsziele ansehen
            <Icon name="ph:arrow-right" class="size-5" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 5. Booking CTA -->
    <ContentBookingCta text="Planen Sie Ihren aktiven Urlaub im Eichsfeld" />
  </div>
</template>
