<script setup lang="ts">
import { t } from '~/utils/translations'

const { locale } = useLocale()

const EVENT_START = new Date('2026-04-23T00:00:00+02:00')
const EVENT_END = new Date('2026-10-11T23:59:59+02:00')

const now = ref(new Date())
const mounted = ref(false)

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
  <NuxtLink
    v-if="showBanner"
    :to="linkTarget"
    class="group flex items-center gap-3 border-b border-waldhonig-200 bg-waldhonig-50 px-4 py-2.5 md:hidden"
  >
    <span
      v-if="!isLive"
      class="flex size-9 shrink-0 items-center justify-center rounded-full bg-waldhonig-500 font-serif text-base font-bold text-white"
    >
      {{ daysUntil }}
    </span>
    <span
      v-else
      class="flex size-9 shrink-0 items-center justify-center rounded-full bg-waldhonig-500"
    >
      <Icon name="ph:flower-tulip" class="size-4.5 text-white" />
    </span>
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-semibold text-sage-900">
        {{ t('lgs.bannerTitle', locale) }}
        <span class="text-sage-500">&middot;</span>
        <span class="font-normal text-sage-600">{{ countdownText }}</span>
      </p>
    </div>
    <Icon
      name="ph:caret-right-bold"
      class="size-4 shrink-0 text-waldhonig-500 transition-transform group-hover:translate-x-0.5"
    />
  </NuxtLink>
</template>
