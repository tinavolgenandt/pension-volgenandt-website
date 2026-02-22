<script setup lang="ts">
defineProps<{
  visible: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    class="scroll-indicator absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-2 border-none bg-transparent p-3 transition-opacity duration-400"
    :class="visible ? 'opacity-100' : 'pointer-events-none opacity-0'"
    aria-label="Zum Inhalt scrollen"
    @click="$emit('click')"
  >
    <!-- Mouse outline with animated scroll dot -->
    <span class="mouse-body" aria-hidden="true">
      <span class="mouse-dot" />
    </span>
  </button>
</template>

<style scoped>
/* Mouse silhouette */
.mouse-body {
  display: block;
  width: 22px;
  height: 36px;
  border: 2px solid currentColor;
  border-radius: 11px;
  position: relative;
  color: rgba(255, 255, 255, 0.75);
  transition: color 0.2s ease;
}

.scroll-indicator:hover .mouse-body {
  color: rgba(255, 255, 255, 1);
}

/* Animated scroll dot */
.mouse-dot {
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 6px;
  background: currentColor;
  border-radius: 2px;
  will-change: transform, opacity;
}

/* Focus style */
.scroll-indicator:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.9);
  outline-offset: 4px;
  border-radius: 4px;
}

/* Scroll dot animation — only for users who haven't requested reduced motion */
@media (prefers-reduced-motion: no-preference) {
  .mouse-dot {
    animation: mouse-dot-scroll 1.5s ease-in-out infinite;
  }
}

@keyframes mouse-dot-scroll {
  0% {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateX(-50%) translateY(14px);
    opacity: 0;
  }
  100% {
    transform: translateX(-50%) translateY(0);
    opacity: 0;
  }
}
</style>
