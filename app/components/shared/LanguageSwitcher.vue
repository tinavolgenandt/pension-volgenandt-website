<script setup lang="ts">
const { locale, alternateUrl, hasAlternate } = useLocale()

// Persist language choice in localStorage when user clicks
function savePreference(lang: 'de' | 'en') {
  if (import.meta.client) {
    localStorage.setItem('locale-preference', lang)
  }
}
</script>

<template>
  <div class="flex items-center gap-1.5">
    <Icon name="lucide:globe" :size="15" class="text-sage-400" aria-hidden="true" />
    <div class="flex overflow-hidden rounded-full border border-sage-600/50 text-xs">
      <!-- DE segment -->
      <span
        v-if="locale === 'de'"
        class="bg-white/15 px-2.5 py-1 font-semibold text-white"
        title="Deutsch (aktiv)"
      >
        DE
      </span>
      <NuxtLink
        v-else
        :to="alternateUrl"
        class="px-2.5 py-1 text-sage-400 transition-colors duration-200 hover:text-sage-200"
        title="Zur deutschen Seite"
        @click="savePreference('de')"
      >
        DE
      </NuxtLink>

      <!-- EN segment -->
      <span
        v-if="locale === 'en'"
        class="bg-white/15 px-2.5 py-1 font-semibold text-white"
        title="English (active)"
      >
        EN
      </span>
      <NuxtLink
        v-else-if="hasAlternate"
        :to="alternateUrl"
        class="px-2.5 py-1 text-sage-400 transition-colors duration-200 hover:text-sage-200"
        title="Switch to English"
        @click="savePreference('en')"
      >
        EN
      </NuxtLink>
      <span
        v-else
        class="cursor-default px-2.5 py-1 text-sage-400 opacity-40"
        title="English version not available"
      >
        EN
      </span>
    </div>
  </div>
</template>
