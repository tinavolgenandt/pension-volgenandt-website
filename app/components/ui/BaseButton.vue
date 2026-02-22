<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  target?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  to: undefined,
  target: undefined,
  type: 'button',
  disabled: false,
})

const variantClasses: Record<string, string> = {
  primary: 'bg-waldhonig-500 text-white hover:bg-waldhonig-600 focus-visible:ring-waldhonig-500',
  secondary: 'bg-sage-700 text-white hover:bg-sage-800 focus-visible:ring-sage-700',
  outline: 'border-2 border-sage-300 text-sage-700 hover:bg-sage-50 focus-visible:ring-sage-500',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

const baseClasses =
  'inline-flex items-center justify-center rounded-lg font-sans font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

const classes = computed(() => {
  return [baseClasses, variantClasses[props.variant], sizeClasses[props.size]].join(' ')
})
</script>

<template>
  <NuxtLink v-if="to" :to="to" :target="target" :class="classes">
    <slot />
  </NuxtLink>
  <button v-else :type="type" :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>
