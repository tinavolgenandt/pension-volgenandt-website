<script setup lang="ts">
defineProps<{
  features: Array<{
    icon: string
    title: string
    description: string
  }>
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <div v-for="feature in features" :key="feature.title" class="text-center">
      <Icon :name="feature.icon" class="size-10 text-sage-600" />
      <h3 class="mt-3 text-lg font-semibold text-sage-900">
        {{ feature.title }}
      </h3>
      <p class="mt-1 text-sm leading-relaxed text-sage-700">
        {{ feature.description }}
      </p>
    </div>
  </div>
</template>
