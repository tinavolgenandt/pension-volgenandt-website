<script setup lang="ts">
const siteUrl = 'https://www.pension-volgenandt.de'

definePageMeta({
  breadcrumb: { label: 'Attractions' },
})

useSeoMeta({
  title: 'Attractions in the Eichsfeld',
  ogTitle: 'Attractions in the Eichsfeld | Pension Volgenandt',
  description:
    'Bear park, castles and nature: Discover the best attractions around Pension Volgenandt in the Eichsfeld.',
  ogDescription:
    'Bear park, castles and nature: Discover the best attractions around Pension Volgenandt in the Eichsfeld.',
  ogImage: '/img/homepage/aussicht-panorama.webp',
  ogType: 'website',
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'canonical', href: `${siteUrl}/en/attractions/` },
    { rel: 'alternate', hreflang: 'de', href: `${siteUrl}/ausflugsziele/` },
    { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/en/attractions/` },
    { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}/ausflugsziele/` },
  ],
})

// Fetch all attractions ordered by sortOrder
const { data: attractions } = await useAsyncData('en-attractions', () =>
  queryCollection('attractions').order('sortOrder', 'ASC').all(),
)

// Activity cards data
const activityCards = [
  {
    title: 'Hiking',
    description: 'Hiking trails in the area \u2013 from leisurely to challenging.',
    icon: 'ph:mountains-duotone',
    to: '/en/activities/hiking/',
  },
  {
    title: 'Cycling',
    description: 'The Leine cycle path passes right by Breitenbach.',
    icon: 'ph:bicycle-duotone',
    to: '/en/activities/cycling/',
  },
]
</script>

<template>
  <div>
    <!-- Banner -->
    <SharedPageBanner
      image="/img/garten/einfahrt-sommer.webp"
      image-alt="Pension Volgenandt – entrance with garden view in summer"
      title="Attractions"
      subtitle="Explore the Eichsfeld"
    />

    <!-- Intro -->
    <section class="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p class="text-lg leading-relaxed text-sage-800">
        The Eichsfeld is full of surprises: bears and wolves in the bear park, medieval castles with
        panoramic views and a UNESCO World Heritage Site with a tree canopy trail. All attractions
        are less than one hour from our guesthouse.
      </p>
    </section>

    <!-- Interactive map with consent wrapper -->
    <section class="px-6 py-6 md:py-8">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-6 font-serif text-2xl font-semibold text-sage-900">Attractions on the Map</h2>
        <AttractionsMapConsent
          placeholder-image="/img/map/ausflugsziele-placeholder.webp"
          placeholder-alt="Map of attractions around Pension Volgenandt"
        >
          <AttractionsMap v-if="attractions" :attractions="attractions" />
        </AttractionsMapConsent>
      </div>
    </section>

    <!-- Attraction card grid -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-8 font-serif text-2xl font-semibold text-sage-900">Our Recommendations</h2>
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
        <h2 class="mb-8 font-serif text-2xl font-semibold text-sage-900">Activities</h2>
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
                Learn more
                <Icon name="ph:arrow-right" class="size-4" />
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Booking CTA -->
    <SharedBookingCta text="Return to cosy rooms after an eventful day" button-text="View rooms" />
  </div>
</template>
