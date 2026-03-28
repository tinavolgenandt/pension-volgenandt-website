<script setup lang="ts">
/**
 * Non-intrusive banner suggesting English version to English-speaking visitors.
 * Only shown on the German homepage (/), only if:
 * - Browser language starts with 'en'
 * - User has not previously chosen a language (no localStorage preference)
 * Per Google guidelines: never auto-redirect, only suggest.
 */
const show = ref(false)

onMounted(() => {
  const stored = localStorage.getItem('locale-preference')
  if (stored) return // user already made a choice

  const browserLang = navigator.languages?.[0] || navigator.language
  if (browserLang?.startsWith('en')) {
    show.value = true
  }
})

function dismiss() {
  show.value = false
  localStorage.setItem('locale-preference', 'de')
}

function switchToEnglish() {
  localStorage.setItem('locale-preference', 'en')
  navigateTo('/en/')
}
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="-translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-full opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-x-0 top-0 z-50 bg-charcoal-800 px-4 py-3 text-center text-sm text-sage-200 shadow-lg"
    >
      <div class="mx-auto flex max-w-screen-lg items-center justify-center gap-3">
        <Icon name="lucide:globe" :size="16" class="shrink-0 text-sage-400" aria-hidden="true" />
        <span>This page is also available in English.</span>
        <button
          type="button"
          class="rounded-full bg-waldhonig-500 px-4 py-1 text-xs font-semibold text-white transition-colors hover:bg-waldhonig-600"
          @click="switchToEnglish"
        >
          Switch to English
        </button>
        <button
          type="button"
          class="text-sage-400 transition-colors hover:text-white"
          aria-label="Dismiss"
          @click="dismiss"
        >
          <Icon name="lucide:x" :size="16" />
        </button>
      </div>
    </div>
  </Transition>
</template>
