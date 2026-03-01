<script setup lang="ts">
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
  ogImage: '/img/banners/ausflugsziele-banner.webp',
  ogType: 'website',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://www.pension-volgenandt.de/ausflugsziele/' },
    { rel: 'alternate', hreflang: 'de', href: 'https://www.pension-volgenandt.de/ausflugsziele/' },
  ],
})

// Fetch all attractions ordered by sortOrder
const { data: attractions } = await useAsyncData('attractions', () =>
  queryCollection('attractions').order('sortOrder', 'ASC').all(),
)

// Activity cards data
const activityCards = [
  {
    title: 'Wandern',
    description: 'Wanderwege in der Umgebung – von gemütlich bis anspruchsvoll.',
    icon: 'ph:mountains-duotone',
    to: '/aktivitaeten/wandern/',
  },
  {
    title: 'Radfahren',
    description: 'Der Leine-Radweg führt direkt an Breitenbach vorbei.',
    icon: 'ph:bicycle-duotone',
    to: '/aktivitaeten/radfahren/',
  },
]
</script>

<template>
  <div>
    <!-- Banner -->
    <ContentPageBanner
      image="/img/banners/ausflugsziele-banner.webp"
      image-alt="Blick über das Eichsfeld"
      title="Ausflugsziele"
      subtitle="Entdecken Sie das Eichsfeld"
    />

    <!-- Intro -->
    <section class="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p class="text-lg leading-relaxed text-sage-800">
        Das Eichsfeld ist voller Überraschungen: Bären und Wölfe im Bärenpark, mittelalterliche
        Burgen mit Panoramablick und ein UNESCO-Weltnaturerbe mit Baumkronenpfad. Alle Ausflugsziele
        sind in weniger als einer Stunde von unserer Pension erreichbar.
      </p>
    </section>

    <!-- Interactive map with consent wrapper -->
    <section class="px-6 py-6 md:py-8">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-6 font-serif text-2xl font-semibold text-sage-900">
          Ausflugsziele auf der Karte
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
        <h2 class="mb-8 font-serif text-2xl font-semibold text-sage-900">Unsere Empfehlungen</h2>
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
        <h2 class="mb-8 font-serif text-2xl font-semibold text-sage-900">Aktivitäten</h2>
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
                Mehr erfahren
                <Icon name="ph:arrow-right" class="size-4" />
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Booking CTA -->
    <ContentBookingCta
      text="Nach einem erlebnisreichen Tag zurück in gemütliche Zimmer"
      button-text="Zimmer ansehen"
    />
  </div>
</template>
