<script setup lang="ts">
const { hasConsented, acceptAll, rejectAll } = useCookieConsent()
</script>

<template>
  <div
    v-if="!hasConsented"
    role="dialog"
    aria-label="Cookie-Einstellungen"
    class="fixed inset-x-0 bottom-0 z-50 border-t border-sage-200 bg-warm-white shadow-lg"
  >
    <div class="mx-auto max-w-screen-xl p-3 sm:p-6">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <!-- Info text -->
        <p class="font-sans text-sm text-sage-700 sm:text-base">
          Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung zu bieten. Weitere
          Informationen finden Sie in unserer
          <NuxtLink to="/datenschutz" class="text-waldhonig-600 underline hover:text-waldhonig-700">
            Datenschutzerklärung</NuxtLink
          >.
        </p>

        <!-- Equal-prominence buttons (TDDDG § 25 / LEGL-04) -->
        <div class="flex shrink-0 gap-2 sm:gap-3">
          <button
            type="button"
            class="rounded-lg bg-sage-700 px-4 py-2.5 font-sans text-sm font-semibold text-white transition-colors duration-200 hover:bg-sage-800 sm:px-6 sm:py-3 sm:text-base"
            @click="rejectAll"
          >
            Nur Notwendige
          </button>
          <button
            type="button"
            class="rounded-lg bg-waldhonig-500 px-4 py-2.5 font-sans text-sm font-semibold text-white transition-colors duration-200 hover:bg-waldhonig-600 sm:px-6 sm:py-3 sm:text-base"
            @click="acceptAll"
          >
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
