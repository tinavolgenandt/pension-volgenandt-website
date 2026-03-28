<script setup lang="ts">
import { t } from '~/utils/translations'

const { locale } = useLocale()

definePageMeta({
  breadcrumb: { label: 'Ausflugsziele' },
})

useSeoMeta({
  title: 'Ausflugsziele im Eichsfeld',
  ogTitle: 'Ausflugsziele im Eichsfeld | Pension Volgenandt',
  description:
    'Bärenpark, Burgen und Natur: Entdecken Sie die besten Ausflugsziele rund um die Pension Volgenandt im Eichsfeld.',
  ogDescription:
    'Bärenpark, Burgen und Natur: Entdecken Sie die besten Ausflugsziele rund um die Pension Volgenandt im Eichsfeld.',
  ogImage: '/img/homepage/aussicht-panorama.webp',
  ogType: 'website',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://www.pension-volgenandt.de/ausflugsziele/' },
    { rel: 'alternate', hreflang: 'de', href: 'https://www.pension-volgenandt.de/ausflugsziele/' },
    {
      rel: 'alternate',
      hreflang: 'en',
      href: 'https://www.pension-volgenandt.de/en/attractions/',
    },
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: 'https://www.pension-volgenandt.de/ausflugsziele/',
    },
  ],
})

// Fetch all attractions ordered by sortOrder
const { data: attractions } = await useAsyncData('attractions', () =>
  queryCollection('attractions').order('sortOrder', 'ASC').all(),
)

// Activity cards data
const activityCards = computed(() => [
  {
    title: t('activities.hiking.title', locale.value),
    description: t('attractions.hikingDesc', locale.value),
    icon: 'ph:mountains-duotone',
    to: locale.value === 'de' ? '/aktivitaeten/wandern/' : '/en/activities/hiking/',
  },
  {
    title: t('activities.cycling.title', locale.value),
    description: t('attractions.cyclingDesc', locale.value),
    icon: 'ph:bicycle-duotone',
    to: locale.value === 'de' ? '/aktivitaeten/radfahren/' : '/en/activities/cycling/',
  },
])
</script>

<template>
  <div>
    <!-- Banner -->
    <SharedPageBanner
      image="/img/garten/einfahrt-sommer.webp"
      image-alt="Pension Volgenandt – Einfahrt mit Gartenblick im Sommer"
      :title="t('attractions.title', locale)"
      :subtitle="t('attractions.subtitle', locale)"
    />

    <!-- Intro -->
    <section class="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p class="text-lg leading-relaxed text-sage-800">
        {{ t('attractions.intro', locale) }}
      </p>
    </section>

    <!-- Interactive map with consent wrapper -->
    <section class="px-6 py-6 md:py-8">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-6 font-serif text-2xl font-semibold text-sage-900">
          {{ t('attractions.onMap', locale) }}
        </h2>
        <AttractionsMapConsent
          placeholder-image="/img/map/ausflugsziele-placeholder.webp"
          placeholder-alt="Karte der Ausflugsziele rund um die Pension Volgenandt"
        >
          <AttractionsMap v-if="attractions" :attractions="attractions" />
        </AttractionsMapConsent>
      </div>
    </section>

    <!-- Attraction card grid -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-8 font-serif text-2xl font-semibold text-sage-900">
          {{ t('attractions.recommendations', locale) }}
        </h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AttractionsCard
            v-for="attraction in attractions"
            :key="attraction.slug"
            :name="attraction.name"
            :slug="attraction.slug"
            :hero-image="attraction.heroImage"
            :hero-image-alt="attraction.heroImageAlt"
            :distance-km="attraction.distanceKm"
            :driving-minutes="attraction.drivingMinutes"
            :short-description="attraction.shortDescription"
            :category="attraction.category"
          />
        </div>
      </div>
    </section>

    <!-- Activity cards -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-8 font-serif text-2xl font-semibold text-sage-900">
          {{ t('attractions.activitiesHeading', locale) }}
        </h2>
        <div class="grid gap-6 sm:grid-cols-2">
          <NuxtLink
            v-for="activity in activityCards"
            :key="activity.title"
            :to="activity.to"
            class="group flex items-start gap-4 rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <Icon :name="activity.icon" class="size-10 shrink-0 text-sage-600" />
            <div>
              <h3 class="font-serif text-lg font-semibold text-sage-900">
                {{ activity.title }}
              </h3>
              <p class="mt-1 text-sm leading-relaxed text-sage-700">
                {{ activity.description }}
              </p>
              <span
                class="mt-2 inline-flex items-center gap-1 text-sm font-medium text-waldhonig-600"
              >
                {{ t('cta.learnMore', locale) }}
                <Icon name="ph:arrow-right" class="size-4" />
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Booking CTA -->
    <SharedBookingCta
      :text="t('attractions.returnToRooms', locale)"
      :button-text="t('cta.viewRooms', locale)"
    />
  </div>
</template>
