<script setup lang="ts">
import { t } from '~/utils/translations'

const { locale } = useLocale()
const { daysUntil, isLive, showBanner, countdownText, linkTarget } = useLgsCountdown(
  computed(() => locale.value),
)
</script>

<template>
  <!-- Desktop overlay (inside hero) -->
  <NuxtLink
    v-if="showBanner"
    :to="linkTarget"
    class="hero-animate group absolute right-6 bottom-24 z-20 hidden flex-col items-center rounded-xl border border-white/20 bg-white/15 px-5 py-4 text-center backdrop-blur-md transition-transform hover:scale-[1.03] md:flex lg:right-12"
    style="animation-delay: 2000ms"
  >
    <span class="text-xs font-semibold tracking-wide text-white/80 uppercase">
      {{ t('lgs.bannerTitle', locale) }}
    </span>
    <span v-if="!isLive" class="mt-1 font-serif text-3xl font-bold text-waldhonig-400">
      {{ daysUntil }}
    </span>
    <span class="mt-1 text-sm font-medium text-white">
      {{ countdownText }}
    </span>
    <span
      class="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-waldhonig-400 transition-colors group-hover:text-waldhonig-300"
    >
      {{ t('lgs.linkText', locale) }}
      <Icon name="ph:arrow-right" class="size-3.5" />
    </span>
  </NuxtLink>
</template>
