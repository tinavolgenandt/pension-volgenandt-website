<script setup lang="ts">
import type { GalleryImage } from '~/composables/useGallery'

interface Props {
  heroImage: string
  heroImageAlt: string
  gallery: { src: string; alt: string }[]
}

const props = defineProps<Props>()

const { onImgError } = useImageFallback()

// Hero image counts as the first slide so the lightbox can page through everything
const allImages = computed<GalleryImage[]>(() => [
  { src: props.heroImage, alt: props.heroImageAlt },
  ...props.gallery,
])

const {
  currentIndex,
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
  <div class="news-gallery">
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <button
        v-for="(image, index) in gallery"
        :key="image.src"
        type="button"
        class="group relative overflow-hidden rounded-xl focus-visible:ring-2 focus-visible:ring-waldhonig-500 focus-visible:ring-offset-2"
        :aria-label="`Bild vergrößern: ${image.alt}`"
        @click="openLightbox(index + 1)"
      >
        <div class="aspect-[4/3] bg-sage-100">
          <NuxtImg
            :src="image.src"
            :alt="image.alt"
            loading="lazy"
            width="480"
            height="360"
            sizes="(min-width: 640px) 33vw, 50vw"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            @error="onImgError"
          />
        </div>
        <span
          class="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10"
          aria-hidden="true"
        />
        <span
          class="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-sage-800 opacity-0 shadow transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        >
          <Icon name="lucide:maximize" :size="16" />
        </span>
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
