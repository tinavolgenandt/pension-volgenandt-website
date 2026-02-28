<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

// Fetch attraction by slug
const { data: attraction } = await useAsyncData(`attraction-${slug}`, () =>
  queryCollection('attractions').where('slug', '=', slug).first(),
)

// Handle 404
if (!attraction.value) {
  throw createError({ statusCode: 404, message: 'Ausflugsziel nicht gefunden' })
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
  titleTemplate: '%s',
  link: [
    {
      rel: 'canonical',
      href: `https://www.pension-volgenandt.de/ausflugsziele/${attraction.value.slug}/`,
    },
    {
      rel: 'alternate',
      hreflang: 'de',
      href: `https://www.pension-volgenandt.de/ausflugsziele/${attraction.value.slug}/`,
    },
  ],
})

// Breadcrumb with dynamic label
definePageMeta({
  breadcrumb: { label: 'Ausflugsziel' },
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
      label: 'Beste Reisezeit',
      value: attraction.value.bestTimeToVisit,
    })
  }
  if (attraction.value.website) {
    items.push({ icon: 'ph:globe', label: 'Website', value: attraction.value.website, isLink: true })
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
    <ContentPageBanner
      :image="attraction.heroImage"
      :image-alt="attraction.heroImageAlt"
      :title="attraction.name"
    />

    <div class="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <!-- Distance badge -->
      <ContentDistanceBadge
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
        <ContentHostTip :tip="attraction.hostTip" />
      </section>

      <!-- Practical info -->
      <section v-if="practicalInfo.length > 0" class="mb-10">
        <h2 class="mb-6 font-serif text-xl font-semibold text-sage-900">
          Praktische Informationen
        </h2>
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
        <h2 class="mb-6 font-serif text-xl font-semibold text-sage-900">Impressionen</h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <NuxtImg
            v-for="(image, index) in attraction.gallery"
            :key="index"
            :src="image.src"
            :alt="image.alt"
            class="rounded-lg object-cover"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>
      </section>
    </div>

    <!-- Soft CTA -->
    <ContentSoftCta text="Planen Sie Ihren Ausflug? Wir beraten Sie gerne." />

    <!-- Booking CTA -->
    <ContentBookingCta
      text="Buchen Sie Ihre Unterkunft für den perfekten Tagesausflug"
      button-text="Zimmer ansehen"
    />
  </div>
</template>
