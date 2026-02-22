<script setup lang="ts">
interface Props {
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  direction: 'up',
})

const target = useTemplateRef('reveal')
const { isVisible } = useScrollReveal(target)
</script>

<template>
  <div
    ref="reveal"
    class="scroll-reveal"
    :class="[isVisible ? 'scroll-reveal--visible' : '', `scroll-reveal--${props.direction}`]"
    :style="{ transitionDelay: `${props.delay}ms` }"
  >
    <slot />
  </div>
</template>

<style scoped>
.scroll-reveal {
  opacity: 0;
  transition:
    opacity 700ms ease-out,
    transform 700ms ease-out;
}

.scroll-reveal--up {
  transform: translateY(24px);
}

.scroll-reveal--left {
  transform: translateX(-24px);
}

.scroll-reveal--right {
  transform: translateX(24px);
}

.scroll-reveal--none {
  transform: none;
}

.scroll-reveal--visible {
  opacity: 1;
  transform: translateY(0) translateX(0);
}

@media (prefers-reduced-motion: reduce) {
  .scroll-reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
