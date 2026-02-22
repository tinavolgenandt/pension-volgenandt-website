<script setup lang="ts">
interface Props {
  rating: number
  size?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'size-5',
})

const fullStars = computed(() => Math.floor(props.rating))
const hasHalfStar = computed(() => props.rating % 1 >= 0.5)
const emptyStars = computed(() => 5 - fullStars.value - (hasHalfStar.value ? 1 : 0))
</script>

<template>
  <div class="flex items-center gap-0.5" :aria-label="`${rating} von 5 Sternen`" role="img">
    <Icon
      v-for="n in fullStars"
      :key="`full-${n}`"
      name="lucide:star"
      mode="svg"
      :class="[size, 'star-filled']"
    />
    <Icon v-if="hasHalfStar" name="lucide:star-half" mode="svg" :class="[size, 'star-filled']" />
    <Icon
      v-for="n in emptyStars"
      :key="`empty-${n}`"
      name="lucide:star"
      :class="[size, 'text-sage-300']"
    />
  </div>
</template>

<style scoped>
.star-filled {
  color: var(--color-waldhonig-400);
}

.star-filled :deep(path) {
  fill: var(--color-waldhonig-400);
}
</style>
