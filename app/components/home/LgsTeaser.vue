<script setup lang="ts">
import { t } from '~/utils/translations'

const { locale } = useLocale()
const { isLive, isExpired, daysUntil } = useLgsCountdown(computed(() => locale.value))

const linkTarget = computed(() =>
  locale.value === 'en' ? '/en/news/landesgartenschau-2026/' : '/aktuelles/landesgartenschau-2026/',
)

const zimmerTarget = computed(() => (locale.value === 'en' ? '/en/rooms/' : '/zimmer/'))
</script>

<template>
  <section v-if="!isExpired" class="bg-sage-800 py-12 md:py-16">
    <div class="mx-auto max-w-4xl px-6">
      <div class="flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-12">
        <!-- Left: Icon + countdown -->
        <div class="flex shrink-0 flex-col items-center text-center">
          <div
            class="flex size-20 items-center justify-center rounded-full bg-waldhonig-500/20 text-4xl"
          >
            🌸
          </div>
          <div v-if="!isLive" class="mt-3">
            <div class="font-serif text-5xl font-bold text-waldhonig-400">{{ daysUntil }}</div>
            <div class="mt-1 text-sm font-medium tracking-wide text-sage-300 uppercase">
              {{ t('lgs.countdownLabel', locale) }}
            </div>
          </div>
          <div v-else class="mt-3">
            <div
              class="inline-flex items-center gap-2 rounded-full bg-waldhonig-500 px-4 py-1.5 text-sm font-semibold text-white"
            >
              <span class="size-2 animate-pulse rounded-full bg-white" />
              {{ t('lgs.liveNow', locale) }}
            </div>
          </div>
        </div>

        <!-- Right: Text + CTAs -->
        <div class="flex-1 text-center md:text-left">
          <p class="mb-1 text-sm font-semibold tracking-wide text-waldhonig-400 uppercase">
            23. April – 11. Oktober 2026
          </p>
          <h2 class="font-serif text-2xl font-bold text-white md:text-3xl">
            {{ t('lgs.teaserTitle', locale) }}
          </h2>
          <p class="mt-3 leading-relaxed text-sage-300">
            {{ t('lgs.teaserText', locale) }}
          </p>
          <div class="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
            <NuxtLink
              :to="zimmerTarget"
              class="rounded-lg bg-waldhonig-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-waldhonig-600"
            >
              {{ t('lgs.bookNow', locale) }}
            </NuxtLink>
            <NuxtLink
              :to="linkTarget"
              class="rounded-lg border border-sage-500 px-6 py-3 font-semibold text-sage-200 transition-colors hover:border-sage-400 hover:text-white"
            >
              {{ t('lgs.moreInfo', locale) }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
