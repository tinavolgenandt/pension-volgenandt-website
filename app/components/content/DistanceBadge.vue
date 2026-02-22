<script setup lang="ts">
defineProps<{
  distanceKm: number
  drivingMinutes: number
}>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1 text-sm font-medium text-sage-700"
  >
    <Icon name="ph:map-pin-line" class="size-4" />
    {{ distanceKm }} km / {{ drivingMinutes }} min
  </span>
</template>
