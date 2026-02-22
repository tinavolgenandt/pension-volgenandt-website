<script setup lang="ts">
// Load attractions teaser data via Nuxt Content queryCollection
const { data: attractionsData } = await useAsyncData('attractionsTeaser', () =>
  queryCollection('attractionsTeaser').all(),
)

const items = computed(() => attractionsData.value?.[0]?.items ?? [])
const featuredAttraction = computed(() =>
  items.value.find((a: { featured?: boolean }) => a.featured),
)
const otherAttractions = computed(() =>
  items.value.filter((a: { featured?: boolean }) => !a.featured),
)
</script>

<template>
  <section class="py-20 md:py-24">
    <div class="mx-auto max-w-6xl px-6">
      <h2 class="font-serif text-3xl font-bold text-sage-900 md:text-4xl">
        Erleben Sie das Eichsfeld
      </h2>

      <div v-if="items.length" class="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <!-- Hero card: featured attraction (Barenpark) spanning 2 columns -->
        <UiScrollReveal v-if="featuredAttraction" :delay="0" class="md:col-span-2 md:row-span-2">
          <NuxtLink
            :to="`/ausflugsziele/${featuredAttraction.slug}/`"
            class="group relative block h-full overflow-hidden rounded-lg"
          >
            <NuxtImg
              :src="featuredAttraction.image"
              :alt="featuredAttraction.imageAlt"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 66vw"
              class="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] md:h-full md:min-h-80"
              width="800"
              height="500"
            />
            <!-- Distance badge -->
            <span
              class="absolute top-3 right-3 rounded-full bg-waldhonig-600 px-3 py-1 text-sm font-semibold text-white"
            >
              {{ featuredAttraction.distanceKm }} km
            </span>
            <!-- Text overlay -->
            <div
              class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6"
            >
              <h3 class="text-xl font-bold text-white md:text-2xl">
                {{ featuredAttraction.name }}
              </h3>
              <p class="mt-1 text-sm text-white/90 md:text-base">
                {{ featuredAttraction.shortDescription }}
              </p>
            </div>
          </NuxtLink>
        </UiScrollReveal>

        <!-- Smaller cards for remaining attractions -->
        <UiScrollReveal
          v-for="(attraction, index) in otherAttractions"
          :key="attraction.slug"
          :delay="Math.min((index + 1) * 150, 400)"
        >
          <NuxtLink
            :to="`/ausflugsziele/${attraction.slug}/`"
            class="group relative block overflow-hidden rounded-lg"
          >
            <NuxtImg
              :src="attraction.image"
              :alt="attraction.imageAlt"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 33vw"
              class="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              width="400"
              height="250"
            />
            <!-- Distance badge -->
            <span
              class="absolute top-3 right-3 rounded-full bg-waldhonig-600 px-3 py-1 text-sm font-semibold text-white"
            >
              {{ attraction.distanceKm }} km
            </span>
            <!-- Text overlay -->
            <div
              class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4"
            >
              <h3 class="text-base font-bold text-white">
                {{ attraction.name }}
              </h3>
              <p class="mt-0.5 text-sm text-white/90">
                {{ attraction.shortDescription }}
              </p>
            </div>
          </NuxtLink>
        </UiScrollReveal>
      </div>

      <!-- CTA link -->
      <div class="mt-10 text-center">
        <NuxtLink
          to="/ausflugsziele/"
          class="inline-flex items-center gap-1 font-sans text-lg font-semibold text-sage-600 transition-colors hover:text-sage-700 hover:underline"
        >
          Alle Ausflugsziele entdecken &rarr;
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
