<script setup lang="ts">
import { t } from '~/utils/translations'

const { locale } = useLocale()

const EVENT_START = new Date('2026-04-23T00:00:00+02:00')
const EVENT_END = new Date('2026-10-11T23:59:59+02:00')

const now = ref(new Date())
const mounted = ref(false)

// Client-side only — avoids SSG hydration mismatch
onMounted(() => {
  mounted.value = true
  now.value = new Date()

  const interval = setInterval(() => {
    now.value = new Date()
  }, 60_000)

  onUnmounted(() => clearInterval(interval))
})

const daysUntil = computed(() => {
  const diff = EVENT_START.getTime() - now.value.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

const isLive = computed(() => now.value >= EVENT_START && now.value <= EVENT_END)
const isExpired = computed(() => now.value > EVENT_END)
const showBanner = computed(() => mounted.value && !isExpired.value)

const countdownText = computed(() => {
  if (isLive.value) return t('lgs.liveNow', locale.value)
  if (daysUntil.value === 1) return t('lgs.countdownOne', locale.value)
  return t('lgs.countdown', locale.value).replace('{days}', String(daysUntil.value))
})

const linkTarget = computed(() =>
  locale.value === 'en' ? '/en/news/landesgartenschau-2026/' : '/aktuelles/landesgartenschau-2026/',
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
