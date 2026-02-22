<script setup lang="ts">
defineProps<{
  tip: string
}>()
</script>

<template>
  <div class="rounded-r-lg border-l-4 border-waldhonig-400 bg-cream p-6">
    <div class="flex items-start gap-3">
      <Icon name="ph:lightbulb-duotone" class="size-8 shrink-0 text-waldhonig-500" />
      <div>
        <p class="font-semibold text-sage-900">Unser Tipp</p>
        <p class="mt-1 leading-relaxed text-sage-700">
          {{ tip }}
        </p>
      </div>
    </div>
  </div>
</template>
