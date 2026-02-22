<script setup lang="ts">
definePageMeta({
  breadcrumb: { label: 'Radfahren' },
})

// Fetch activity data
const { data: activity } = await useAsyncData('activity-radfahren', () =>
  queryCollection('activities').where('slug', '=', 'radfahren').first(),
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
    { rel: 'canonical', href: 'https://www.pension-volgenandt.de/aktivitaeten/radfahren/' },
    {
      rel: 'alternate',
      hreflang: 'de',
      href: 'https://www.pension-volgenandt.de/aktivitaeten/radfahren/',
    },
  ],
})

// Difficulty badge colors
const difficultyBadge: Record<string, { label: string; class: string }> = {
  leicht: { label: 'Leicht', class: 'bg-sage-100 text-sage-700' },
  mittel: { label: 'Mittel', class: 'bg-waldhonig-100 text-waldhonig-700' },
  schwer: { label: 'Schwer', class: 'bg-charcoal-100 text-charcoal-700' },
}
</script>

<template>
  <div v-if="activity">
    <!-- Banner -->
    <ContentPageBanner
      :image="activity.heroImage"
      :image-alt="activity.heroImageAlt"
      title="Radfahren im Eichsfeld"
      subtitle="Der Leine-Radweg führt direkt vorbei"
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
          Die Radregion Eichsfeld
        </h2>
        <p class="leading-relaxed text-sage-700">
          {{ activity.regionDescription }}
        </p>
      </div>
    </section>

    <!-- Route recommendations -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto max-w-4xl">
        <h2 class="mb-8 font-serif text-2xl font-semibold text-sage-900">
          Unsere Routenempfehlungen
        </h2>
        <div class="space-y-6">
          <div
            v-for="route in activity.routes"
            :key="route.name"
            class="rounded-lg border border-sage-200 bg-white p-6 shadow-sm"
          >
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div class="flex-1">
                <h3 class="flex items-center gap-2 font-serif text-lg font-semibold text-sage-900">
                  <Icon name="ph:bicycle-duotone" class="size-6 text-sage-600" />
                  {{ route.name }}
                </h3>
                <p class="mt-2 text-sm leading-relaxed text-sage-700">
                  {{ route.highlight }}
                </p>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-sm font-medium text-sage-600">
                  {{ route.distance }}
                </span>
                <span
                  :class="difficultyBadge[route.difficulty]?.class"
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                >
                  {{ difficultyBadge[route.difficulty]?.label }}
                </span>
              </div>
            </div>
            <a
              v-if="route.externalUrl"
              :href="route.externalUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-waldhonig-600 hover:text-waldhonig-700"
            >
              Route auf komoot ansehen
              <Icon name="ph:arrow-square-out" class="size-4" />
            </a>
          </div>
        </div>
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
          Finden Sie noch mehr Radtouren im Eichsfeld auf diesen Portalen:
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
    <ContentSoftCta text="Fragen zur Radregion? Wir kennen die besten Strecken." />

    <!-- Booking CTA -->
    <ContentBookingCta text="Idealer Ausgangspunkt für Ihre Radtour" button-text="Zimmer ansehen" />
  </div>
</template>
