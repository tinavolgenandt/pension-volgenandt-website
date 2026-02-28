<script setup lang="ts">
definePageMeta({
  breadcrumb: { label: 'Wandern' },
})

// Fetch activity data
const { data: activity } = await useAsyncData('activity-wandern', () =>
  queryCollection('activities').where('slug', '=', 'wandern').first(),
)

if (!activity.value) {
  throw createError({ statusCode: 404, message: 'Aktivität nicht gefunden' })
}

// SEO from YAML
useSeoMeta({
  title: activity.value.seoTitle,
  ogTitle: activity.value.seoTitle,
  description: activity.value.seoDescription,
  ogDescription: activity.value.seoDescription,
  ogImage: `https://www.pension-volgenandt.de${activity.value.heroImage}`,
  ogType: 'website',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://www.pension-volgenandt.de/aktivitaeten/wandern/' },
    {
      rel: 'alternate',
      hreflang: 'de',
      href: 'https://www.pension-volgenandt.de/aktivitaeten/wandern/',
    },
  ],
})

</script>

<template>
  <div v-if="activity">
    <!-- Banner -->
    <ContentPageBanner
      :image="activity.heroImage"
      :image-alt="activity.heroImageAlt"
      title="Wandern im Eichsfeld"
      subtitle="Wege in der Umgebung entdecken"
    />

    <!-- Intro -->
    <section class="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p class="text-lg leading-relaxed text-sage-800">
        {{ activity.intro }}
      </p>
    </section>

    <!-- Region description -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-3xl">
        <h2 class="mb-6 font-serif text-2xl font-semibold text-sage-900">
          Die Wanderregion Eichsfeld
        </h2>
        <p class="leading-relaxed text-sage-700">
          {{ activity.regionDescription }}
        </p>
      </div>
    </section>

    <!-- External portals -->
    <section
      v-if="activity.externalPortals && activity.externalPortals.length > 0"
      class="bg-cream px-6 py-12 md:py-16"
    >
      <div class="mx-auto max-w-3xl text-center">
        <h2 class="mb-6 font-serif text-2xl font-semibold text-sage-900">
          Weitere Touren entdecken
        </h2>
        <p class="mb-8 text-sage-700">
          Finden Sie noch mehr Wandertouren im Eichsfeld auf diesen Portalen:
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a
            v-for="portal in activity.externalPortals"
            :key="portal.name"
            :href="portal.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-lg border border-sage-200 bg-white px-6 py-3 font-medium text-sage-800 transition-colors hover:border-sage-400 hover:shadow-sm"
          >
            {{ portal.name }}
            <Icon name="ph:arrow-square-out" class="size-4 text-sage-500" />
          </a>
        </div>
      </div>
    </section>

    <!-- Soft CTA -->
    <ContentSoftCta text="Brauchen Sie Wandertipps? Wir kennen die besten Wege." />

    <!-- Booking CTA -->
    <ContentBookingCta
      text="Nach der Wanderung in gemütliche Zimmer zurückkehren"
      button-text="Zimmer ansehen"
    />
  </div>
</template>
