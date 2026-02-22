export interface GalleryImage {
  src: string
  alt: string
}

export function useGallery(images: Ref<GalleryImage[]>) {
  const currentIndex = ref(0)
  const isLightboxOpen = ref(false)

  const currentImage = computed(() => images.value[currentIndex.value])

  const hasNext = computed(() => currentIndex.value < images.value.length - 1)
  const hasPrev = computed(() => currentIndex.value > 0)

  function goTo(index: number) {
    currentIndex.value = Math.max(0, Math.min(index, images.value.length - 1))
  }

  function next() {
    if (hasNext.value) {
      currentIndex.value++
    }
  }

  function prev() {
    if (hasPrev.value) {
      currentIndex.value--
    }
  }

  function openLightbox(index?: number) {
    if (index !== undefined) {
      goTo(index)
    }
    isLightboxOpen.value = true
  }

  function closeLightbox() {
    isLightboxOpen.value = false
  }

  return {
    currentIndex: readonly(currentIndex),
    currentImage,
    isLightboxOpen: readonly(isLightboxOpen),
    hasNext,
    hasPrev,
    goTo,
    next,
    prev,
    openLightbox,
    closeLightbox,
  }
}
