<script setup lang="ts">
const { locale, alternateUrl, hasAlternate } = useLocale()
</script>

<template>
  <NuxtLink
    v-if="hasAlternate"
    :to="alternateUrl"
    class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-sage-200 transition-colors duration-200 hover:text-white"
    :title="locale === 'de' ? 'Switch to English' : 'Zur deutschen Seite'"
  >
    <span :class="locale === 'de' ? 'font-bold text-white' : ''">DE</span>
    <span class="text-sage-500">/</span>
    <span :class="locale === 'en' ? 'font-bold text-white' : ''">EN</span>
  </NuxtLink>
</template>
