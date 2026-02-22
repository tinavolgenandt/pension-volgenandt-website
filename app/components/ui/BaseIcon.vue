<script setup lang="ts">
interface Props {
  name: string
  size?: number
}

withDefaults(defineProps<Props>(), {
  size: 24,
})
</script>

<template>
  <span class="inline-flex shrink-0 items-center justify-center" :aria-label="name">
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <slot />
    </svg>
  </span>
</template>
