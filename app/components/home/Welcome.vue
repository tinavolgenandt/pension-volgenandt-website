<script setup lang="ts">
import { t } from '~/utils/translations'

defineOptions({
  inheritAttrs: true,
})

const { locale } = useLocale()
</script>

<template>
  <section id="willkommen" tabindex="-1" class="py-14 md:py-24">
    <div class="mx-auto max-w-6xl px-6">
      <div class="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <!-- Text content -->
        <div>
          <h2 class="font-serif text-3xl font-bold text-sage-900 md:text-4xl">
            {{ t('home.welcomeTitle', locale) }}
          </h2>

          <div class="mt-6 space-y-4 text-lg leading-relaxed text-sage-700">
            <p>
              {{ t('home.welcomeParagraph1', locale) }}
            </p>
            <p>
              {{ t('home.welcomeParagraph2', locale) }}
            </p>
            <p>
              {{ t('home.welcomeParagraph3', locale) }}
            </p>
          </div>
        </div>

        <!-- Lifestyle image -->
        <div class="order-first md:order-last">
          <NuxtImg
            src="/img/content/gastgeber-portrait.webp"
            :alt="t('home.welcomeImageAlt', locale)"
            class="w-full rounded-lg object-cover shadow-sm"
            loading="lazy"
            sizes="sm:100vw md:50vw"
            width="800"
            height="985"
          />
        </div>
      </div>
    </div>
  </section>
</template>
