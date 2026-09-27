<script setup lang="ts">
import { t } from '~/utils/translations'

const { locale } = useLocale()
const { hasConsented, acceptAll, rejectAll } = useCookieConsent()

// Focus the reject button (first actionable choice) when banner appears (WCAG 2.4.3)
const rejectBtn = ref<HTMLButtonElement | null>(null)
watch(
  () => hasConsented.value,
  (consented) => {
    if (!consented) {
      nextTick(() => rejectBtn.value?.focus())
    }
  },
  { immediate: true },
)
</script>

<template>
  <div
    v-if="!hasConsented"
    role="dialog"
    :aria-label="t('cookie.settings', locale)"
    class="fixed inset-x-0 bottom-0 z-50 border-t border-sage-200 bg-warm-white shadow-lg"
  >
    <div class="mx-auto max-w-screen-xl p-3 sm:p-6">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <!-- Info text -->
        <p class="font-sans text-sm text-sage-700 sm:text-base">
          {{ t('cookie.bannerText', locale) }}
          <NuxtLink
            :to="locale === 'en' ? '/en/privacy/' : '/datenschutz/'"
            class="text-waldhonig-600 underline hover:text-waldhonig-700"
          >
            {{ t('cookie.privacyLink', locale) }}</NuxtLink
          >.
        </p>

        <!-- Equal-prominence buttons (TDDDG § 25 / LEGL-04) -->
        <div class="flex shrink-0 gap-2 sm:gap-3">
          <button
            ref="rejectBtn"
            type="button"
            class="rounded-lg bg-sage-700 px-4 py-2.5 font-sans text-sm font-semibold text-white transition-colors duration-200 hover:bg-sage-800 sm:px-6 sm:py-3 sm:text-base"
            @click="rejectAll"
          >
            {{ t('cookie.rejectAll', locale) }}
          </button>
          <button
            type="button"
            class="rounded-lg bg-waldhonig-500 px-4 py-2.5 font-sans text-sm font-semibold text-white transition-colors duration-200 hover:bg-waldhonig-600 sm:px-6 sm:py-3 sm:text-base"
            @click="acceptAll"
          >
            {{ t('cookie.acceptAll', locale) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
