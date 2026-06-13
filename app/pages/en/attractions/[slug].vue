<script setup lang="ts">
import { useJsonLd } from '~/composables/useJsonLd'

const route = useRoute()
const slug = route.params.slug as string

// Fetch attraction by slug
const { data: attraction } = await useAsyncData(`attraction-en-${slug}`, () =>
  queryCollection('attractionsEn').where('slug', '=', slug).first(),
)

// Handle 404
if (!attraction.value) {
  throw createError({ statusCode: 404, message: 'Attraction not found' })
}

// SEO from YAML data
useSeoMeta({
  title: attraction.value.seoTitle,
  ogTitle: attraction.value.seoTitle,
  description: attraction.value.seoDescription,
  ogDescription: attraction.value.seoDescription,
  ogImage: `https://www.pension-volgenandt.de${attraction.value.heroImage}`,
  ogType: 'article',
})

useHead({
  htmlAttrs: { lang: 'en' },
  titleTemplate: '%s | Pension Volgenandt',
  link: [
    {
      rel: 'canonical',
      href: `https://www.pension-volgenandt.de/en/attractions/${attraction.value.slug}/`,
    },
    {
      rel: 'alternate',
      hreflang: 'de',
      href: `https://www.pension-volgenandt.de/ausflugsziele/${attraction.value.slug}/`,
    },
    {
      rel: 'alternate',
      hreflang: 'en',
      href: `https://www.pension-volgenandt.de/en/attractions/${attraction.value.slug}/`,
    },
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: `https://www.pension-volgenandt.de/ausflugsziele/${attraction.value.slug}/`,
    },
  ],
})

// TouristAttraction structured data
useJsonLd(
  {
    '@type': 'TouristAttraction',
    '@id': `https://www.pension-volgenandt.de/en/attractions/${attraction.value.slug}/#attraction`,
    name: attraction.value.name,
    description: attraction.value.seoDescription,
    image: [`https://www.pension-volgenandt.de${attraction.value.heroImage}`],
    url: `https://www.pension-volgenandt.de/en/attractions/${attraction.value.slug}/`,
    ...(attraction.value.website ? { sameAs: attraction.value.website } : {}),
  },
  `attraction-schema-en-${slug}`,
)

// Breadcrumb with dynamic label
definePageMeta({
  breadcrumb: { label: 'Attraction' },
})

// Split content on double newlines for paragraph rendering
const contentParagraphs = computed(() => {
  if (!attraction.value?.content) return []
  return attraction.value.content.split(/\n\n+/).filter((p) => p.trim())
})

// Practical info items (only show if data exists)
const practicalInfo = computed(() => {
  if (!attraction.value) return []
  const items: Array<{ icon: string; label: string; value: string; isLink?: boolean }> = []
  if (attraction.value.bestTimeToVisit) {
    items.push({
      icon: 'ph:sun',
      label: 'Best time to visit',
      value: attraction.value.bestTimeToVisit,
    })
  }
  if (attraction.value.website) {
    items.push({
      icon: 'ph:globe',
      label: 'Website',
      value: attraction.value.website,
      isLink: true,
    })
  }
  if (attraction.value.additionalWebsites) {
    for (const site of attraction.value.additionalWebsites) {
      items.push({ icon: 'ph:globe', label: site.label, value: site.url, isLink: true })
    }
  }
  return items
})
</script>

<template>
  <div v-if="attraction">
    <!-- Banner -->
    <SharedPageBanner
      :image="attraction.heroImage"
      :image-alt="attraction.heroImageAlt"
      :title="attraction.name"
    />

    <div class="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <!-- Distance badge -->
      <SharedDistanceBadge
        :distance-km="attraction.distanceKm"
        :driving-minutes="attraction.drivingMinutes"
        class="mb-8"
      />

      <!-- Personal intro -->
      <section class="mb-10">
        <p class="text-lg leading-relaxed text-sage-800">
          {{ attraction.intro }}
        </p>
      </section>

      <!-- Main content (split into paragraphs) -->
      <section class="mb-10 space-y-4">
        <p
          v-for="(paragraph, index) in contentParagraphs"
          :key="index"
          class="leading-relaxed text-sage-700"
        >
          {{ paragraph }}
        </p>
      </section>

      <!-- Host Tip -->
      <section class="mb-10">
        <SharedHostTip :tip="attraction.hostTip" />
      </section>

      <!-- Practical info -->
      <section v-if="practicalInfo.length > 0" class="mb-10">
        <h2 class="mb-6 font-serif text-xl font-semibold text-sage-900">Practical Information</h2>
        <div class="rounded-lg border border-sage-200 bg-sage-50 p-6">
          <dl class="space-y-4">
            <div v-for="info in practicalInfo" :key="info.label" class="flex items-start gap-3">
              <Icon :name="info.icon" class="mt-0.5 size-5 shrink-0 text-sage-600" />
              <div>
                <dt class="text-sm font-semibold text-sage-800">{{ info.label }}</dt>
                <dd class="text-sm text-sage-700">
                  <a
                    v-if="info.isLink"
                    :href="info.value"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-waldhonig-600 underline hover:text-waldhonig-700"
                  >
                    {{ info.value }}
                  </a>
                  <span v-else>{{ info.value }}</span>
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </section>

      <!-- Gallery (if images available) -->
      <section v-if="attraction.gallery && attraction.gallery.length > 0" class="mb-10">
        <h2 class="mb-6 font-serif text-xl font-semibold text-sage-900">Gallery</h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <NuxtImg
            v-for="(image, index) in attraction.gallery"
            :key="index"
            :src="image.src"
            :alt="image.alt"
            class="rounded-lg object-cover"
            loading="lazy"
            sizes="100vw sm:50vw"
          />
        </div>
      </section>
    </div>

    <!-- Soft CTA -->
    <SharedSoftCta text="Planning a trip? We're happy to advise." />

    <!-- Booking CTA -->
    <SharedBookingCta
      text="Book your accommodation for the perfect day trip"
      button-text="View rooms"
    />
  </div>
</template>
