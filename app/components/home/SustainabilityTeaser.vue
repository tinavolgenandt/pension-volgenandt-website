<script setup lang="ts">
import { t } from '~/utils/translations'

const { locale } = useLocale()

const proofPoints = computed(() => [
  {
    icon: 'lucide:sun',
    title: t('home.sustainabilityFeature1Title', locale.value),
    subtitle: t('home.sustainabilityFeature1Desc', locale.value),
  },
  {
    icon: 'lucide:droplets',
    title: t('home.sustainabilityFeature2Title', locale.value),
    subtitle: t('home.sustainabilityFeature2Desc', locale.value),
  },
  {
    icon: 'lucide:recycle',
    title: t('home.sustainabilityFeature3Title', locale.value),
    subtitle: t('home.sustainabilityFeature3Desc', locale.value),
  },
])
</script>

<template>
  <section class="bg-sage-50 py-20 md:py-24">
    <div class="mx-auto max-w-5xl px-6">
      <div class="grid items-center gap-10 md:grid-cols-2">
        <!-- Left: Image -->
        <NuxtImg
          src="/img/content/garten-sonnenhut-blumen.webp"
          :alt="t('home.sustainabilityImageAlt', locale)"
          class="rounded-lg"
          loading="lazy"
          sizes="100vw md:50vw"
        />

        <!-- Right: Text + proof points -->
        <div class="flex flex-col justify-center md:items-center md:text-center">
          <h2 class="font-serif text-3xl font-bold text-sage-900 md:text-4xl">
            {{ t('home.sustainabilityHeading', locale) }}
          </h2>
          <p class="mt-4 text-lg text-sage-700">
            {{ t('home.sustainabilityText', locale) }}
          </p>

          <!-- Icon proof points -->
          <div class="mt-8 flex flex-col gap-6 md:flex-row md:justify-center">
            <UiScrollReveal
              v-for="(point, index) in proofPoints"
              :key="point.title"
              :delay="index * 150"
            >
              <div class="flex items-center gap-4 md:flex-col md:items-center md:gap-3">
                <!-- Icon circle -->
                <div
                  class="flex size-16 shrink-0 items-center justify-center rounded-full bg-sage-100"
                >
                  <Icon :name="point.icon" class="size-8 text-sage-600" />
                </div>
                <!-- Text -->
                <div class="md:text-center">
                  <h3 class="text-lg font-semibold text-sage-900">{{ point.title }}</h3>
                  <p class="mt-1 text-sage-700">{{ point.subtitle }}</p>
                </div>
              </div>
            </UiScrollReveal>
          </div>

          <!-- CTA text link -->
          <div class="mt-8">
            <NuxtLink
              :to="locale === 'en' ? '/en/sustainability/' : '/nachhaltigkeit/'"
              class="inline-flex items-center gap-1 font-sans font-semibold text-sage-600 transition-colors hover:text-sage-700 hover:underline"
            >
              {{ t('home.learnSustainability', locale) }} &rarr;
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
