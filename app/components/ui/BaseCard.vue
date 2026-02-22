<script setup lang="ts">
interface Props {
  padded?: boolean
}

withDefaults(defineProps<Props>(), {
  padded: true,
})
</script>

<template>
  <div class="rounded-lg border border-sage-100 bg-white" :class="{ 'p-6': padded }">
    <slot />
  </div>
</template>
