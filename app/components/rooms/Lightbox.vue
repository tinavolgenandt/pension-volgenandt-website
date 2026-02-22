<script setup lang="ts">
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import type { GalleryImage } from '~/composables/useGallery'

interface Props {
  images: GalleryImage[]
  currentIndex: number
  isOpen: boolean
  hasNext: boolean
  hasPrev: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  navigate: [index: number]
  next: []
  prev: []
}>()

// Focus trap
const dialogRef = ref<HTMLElement | null>(null)
const { activate, deactivate } = useFocusTrap(dialogRef, {
  immediate: false,
  allowOutsideClick: true,
  escapeDeactivates: false, // We handle Escape manually
})

// Activate/deactivate focus trap when lightbox opens/closes
watch(
  () => props.isOpen,
  async (open) => {
    if (open) {
      await nextTick()
      try {
        activate()
      } catch {
        // Focus trap may fail if dialog is not yet visible
      }
    } else {
      deactivate()
    }
  },
)

// Keyboard navigation
function onKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'Escape':
      emit('close')
      break
    case 'ArrowRight':
      if (props.hasNext) emit('next')
      break
    case 'ArrowLeft':
      if (props.hasPrev) emit('prev')
      break
  }
}

// Touch swipe support
const imageContainerRef = ref<HTMLElement | null>(null)
const { direction } = useSwipe(imageContainerRef, {
  onSwipeEnd() {
    if (direction.value === 'left' && props.hasNext) {
      emit('next')
    } else if (direction.value === 'right' && props.hasPrev) {
      emit('prev')
    }
  },
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      ref="dialogRef"
      role="dialog"
      aria-modal="true"
      aria-label="Bildergalerie"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90"
      @keydown="onKeydown"
    >
      <!-- Close button -->
      <button
        type="button"
        class="absolute top-3 right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Galerie schließen"
        @click="emit('close')"
      >
        <Icon name="lucide:x" :size="24" aria-hidden="true" />
      </button>

      <!-- Previous arrow -->
      <button
        v-if="hasPrev"
        type="button"
        class="absolute top-1/2 left-3 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Vorheriges Bild"
        @click="emit('prev')"
      >
        <Icon name="lucide:chevron-left" :size="28" aria-hidden="true" />
      </button>

      <!-- Next arrow -->
      <button
        v-if="hasNext"
        type="button"
        class="absolute top-1/2 right-3 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Nächstes Bild"
        @click="emit('next')"
      >
        <Icon name="lucide:chevron-right" :size="28" aria-hidden="true" />
      </button>

      <!-- Main image area with swipe support -->
      <div ref="imageContainerRef" class="flex flex-1 items-center justify-center px-16 py-4">
        <NuxtImg
          :key="images[currentIndex]?.src"
          :src="images[currentIndex]?.src"
          :alt="images[currentIndex]?.alt"
          loading="eager"
          sizes="90vw"
          class="max-h-full max-w-full object-contain"
        />
      </div>

      <!-- Image counter -->
      <div class="mb-2 text-sm text-white/70" aria-live="polite">
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>

      <!-- Thumbnail strip at bottom -->
      <div
        class="flex w-full justify-center gap-2 overflow-x-auto px-4 pb-4"
        role="list"
        aria-label="Bildergalerie Navigation"
      >
        <button
          v-for="(image, index) in images"
          :key="image.src"
          type="button"
          role="listitem"
          class="shrink-0 cursor-pointer overflow-hidden rounded transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-white"
          :class="[
            index === currentIndex
              ? 'opacity-100 ring-2 ring-white'
              : 'opacity-60 hover:opacity-90',
          ]"
          :aria-label="`Bild ${index + 1}: ${image.alt}`"
          :aria-current="index === currentIndex ? 'true' : undefined"
          @click="emit('navigate', index)"
        >
          <NuxtImg
            :src="image.src"
            :alt="image.alt"
            loading="lazy"
            width="80"
            height="54"
            sizes="80px"
            class="h-[54px] w-20 object-cover"
          />
        </button>
      </div>
    </div>
  </Teleport>
</template>
