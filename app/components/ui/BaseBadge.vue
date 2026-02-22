<script setup lang="ts">
interface Props {
  variant?: 'sage' | 'waldhonig' | 'neutral'
}

withDefaults(defineProps<Props>(), {
  variant: 'sage',
})

const variantClasses: Record<string, string> = {
  sage: 'bg-sage-100 text-sage-700',
  waldhonig: 'bg-waldhonig-100 text-waldhonig-700',
  neutral: 'bg-sage-50 text-sage-600',
}
</script>

<template>
  <span
    class="inline-flex items-center rounded-md px-2.5 py-1 text-sm font-medium"
    :class="variantClasses[variant]"
  >
    <slot />
  </span>
</template>
