<script setup lang="ts">
import type { GalleryImage } from '~/composables/useGallery'

interface Props {
  heroImage: string
  heroImageAlt: string
  gallery: { src: string; alt: string }[]
}

const props = defineProps<Props>()

// Combine hero image with gallery into a single array (hero first)
const allImages = computed<GalleryImage[]>(() => [
  { src: props.heroImage, alt: props.heroImageAlt },
  ...props.gallery,
])

const {
  currentIndex,
  currentImage,
  isLightboxOpen,
  hasNext,
  hasPrev,
  goTo,
  next,
  prev,
  openLightbox,
  closeLightbox,
} = useGallery(allImages)
</script>

<template>
  <div class="room-gallery">
    <!-- Hero image area -->
    <button
      type="button"
      class="relative block w-full cursor-pointer overflow-hidden rounded-xl focus-visible:ring-2 focus-visible:ring-waldhonig-500 focus-visible:ring-offset-2"
      :aria-label="`Bild vergrößern: ${currentImage?.alt}`"
      @click="openLightbox(currentIndex)"
    >
      <div class="aspect-[3/2] bg-sage-100">
        <img
          v-if="currentImage"
          :src="currentImage.src"
          :alt="currentImage.alt"
          loading="eager"
          fetchpriority="high"
          class="h-full w-full object-cover"
        />
      </div>
    </button>

    <!-- Thumbnail strip -->
    <div
      class="mt-3 flex gap-2 overflow-x-auto pb-2"
      role="list"
      aria-label="Bildergalerie Vorschau"
    >
      <button
        v-for="(image, index) in allImages"
        :key="image.src"
        type="button"
        role="listitem"
        class="shrink-0 cursor-pointer overflow-hidden rounded-lg transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-waldhonig-500 focus-visible:ring-offset-2"
        :class="[
          index === currentIndex
            ? 'opacity-100 ring-2 ring-waldhonig-500'
            : 'opacity-60 hover:opacity-90',
        ]"
        :aria-label="`Bild ${index + 1}: ${image.alt}`"
        :aria-current="index === currentIndex ? 'true' : undefined"
        @click="openLightbox(index)"
      >
        <NuxtImg
          :src="image.src"
          :alt="image.alt"
          loading="lazy"
          width="120"
          height="80"
          sizes="120px"
          class="h-20 w-[120px] object-cover"
        />
      </button>
    </div>

    <!-- Lightbox (client-only to prevent hydration mismatches) -->
    <ClientOnly>
      <RoomsLightbox
        :images="allImages"
        :current-index="currentIndex"
        :is-open="isLightboxOpen"
        :has-next="hasNext"
        :has-prev="hasPrev"
        @close="closeLightbox"
        @navigate="goTo"
        @next="next"
        @prev="prev"
      />
    </ClientOnly>
  </div>
</template>
