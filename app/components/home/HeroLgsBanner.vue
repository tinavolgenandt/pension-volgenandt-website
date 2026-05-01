<script setup lang="ts">
import { t } from '~/utils/translations'

const { locale } = useLocale()
const { daysUntil, isLive, showBanner, countdownText, linkTarget } = useLgsCountdown(
  computed(() => locale.value),
)
</script>

<template>
  <!-- Desktop overlay (inside hero) — LGS + Picknick stacked -->
  <div
    v-if="showBanner"
    class="hero-animate absolute right-6 bottom-24 z-20 hidden flex-col gap-2 md:flex lg:right-12"
    style="animation-delay: 2000ms"
  >
    <!-- Picknick card -->
    <NuxtLink
      to="/picknick/"
      class="group flex items-center gap-3 rounded-xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur-md transition-transform hover:scale-[1.03]"
    >
      <Icon name="ph:basket" class="size-5 shrink-0 text-waldhonig-300" />
      <div>
        <p class="text-xs font-semibold tracking-wide text-white/80 uppercase">Neu bei uns</p>
        <p class="text-sm font-semibold text-white">Picknick-Korb</p>
        <p class="text-xs text-white/70">ab 19 € pro Person</p>
      </div>
      <Icon
        name="ph:arrow-right"
        class="ml-1 size-3.5 shrink-0 text-waldhonig-400 transition-colors group-hover:text-waldhonig-300"
      />
    </NuxtLink>
  </div>
</template>
