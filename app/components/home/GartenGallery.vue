<script setup lang="ts">
import { t } from '~/utils/translations'

const { locale } = useLocale()

const photos = computed(() => [
  {
    src: '/img/garten/einfahrt-sommer.webp',
    alt: t('home.gardenPhoto1', locale.value),
  },
  {
    src: '/img/garten/umgebung-wiese-pusteblumen.webp',
    alt: t('home.gardenPhoto2', locale.value),
  },
  {
    src: '/img/garten/garten-biotop-schilf.webp',
    alt: t('home.gardenPhoto3', locale.value),
  },
  {
    src: '/img/garten/garten-apfelbaum-blumen.webp',
    alt: t('home.gardenPhoto4', locale.value),
  },
  {
    src: '/img/garten/pension-eingang-sommer.webp',
    alt: t('home.gardenPhoto5', locale.value),
  },
  {
    src: '/img/garten/umgebung-wiese-sonnenuntergang.webp',
    alt: t('home.gardenPhoto6', locale.value),
  },
  {
    src: '/img/garten/gebaeude-eingang-parkplatz.webp',
    alt: t('home.gardenPhoto7', locale.value),
  },
  {
    src: '/img/garten/pension-winter-schnee.webp',
    alt: t('home.gardenPhoto8', locale.value),
  },
  {
    src: '/img/content/landschaft-winter.webp',
    alt: t('home.gardenPhoto9', locale.value),
  },
])
</script>

<template>
  <section class="py-16 md:py-24">
    <div class="mx-auto max-w-6xl px-6">
      <!-- Heading -->
      <div class="mb-10 text-center">
        <h2 class="font-serif text-3xl font-bold text-sage-900 md:text-4xl">
          {{ t('home.gardenHeading', locale) }}
        </h2>
        <p class="mt-3 text-lg text-sage-600">{{ t('home.gardenSubtitle', locale) }}</p>
      </div>

      <!-- Photo grid -->
      <div class="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        <!-- First photo spans 2 columns and 2 rows -->
        <div class="col-span-2 row-span-2 overflow-hidden rounded-lg">
          <NuxtImg
            :src="photos[0]!.src"
            :alt="photos[0]!.alt"
            class="aspect-[4/3] h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
            sizes="sm:100vw md:50vw"
          />
        </div>

        <!-- Photos 2–5: single cells -->
        <div
          v-for="photo in photos.slice(1, 5)"
          :key="photo.src"
          class="overflow-hidden rounded-lg"
        >
          <NuxtImg
            :src="photo.src"
            :alt="photo.alt"
            class="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
            sizes="sm:50vw md:25vw"
          />
        </div>

        <!-- Photos 6–8: bottom row, full width divided by 3 -->
        <div
          v-for="photo in photos.slice(5)"
          :key="photo.src"
          class="col-span-2 overflow-hidden rounded-lg md:col-span-1"
        >
          <NuxtImg
            :src="photo.src"
            :alt="photo.alt"
            class="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
            sizes="sm:100vw md:25vw"
          />
        </div>
      </div>
    </div>
  </section>
</template>
