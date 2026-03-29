<script setup lang="ts">
import { t } from '~/utils/translations'

const { locale } = useLocale()
const { daysUntil, isLive, showBanner, countdownText, linkTarget } = useLgsCountdown(
  computed(() => locale.value),
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
