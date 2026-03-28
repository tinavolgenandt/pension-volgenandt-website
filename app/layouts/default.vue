<script setup lang="ts">
import { t } from '~/utils/translations'

const { locale } = useLocale()
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <!-- Skip navigation (WCAG 2.4.1) -->
    <a
      href="#main-content"
      class="sr-only bg-waldhonig-500 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-[60]"
    >
      {{ t('layout.skipToContent', locale) }}
    </a>

    <AppHeader />
    <main id="main-content" class="flex-1 pt-20">
      <!-- pt-20 (~80px) offsets fixed header height -->
      <slot />
    </main>
    <AppFooter />
    <ClientOnly>
      <CookieConsent />
      <CookieSettings />
    </ClientOnly>
  </div>
</template>
