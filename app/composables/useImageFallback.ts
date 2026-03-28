const FALLBACK_IMAGE = '/img/placeholder.svg'

/**
 * Provides an @error handler for <NuxtImg> that swaps in a branded
 * placeholder SVG when the original image fails to load.
 */
export function useImageFallback() {
  const hasError = ref(false)

  function onImgError(e: Event) {
    if (!hasError.value) {
      hasError.value = true
      const img = e.target as HTMLImageElement
      if (!img.src.endsWith('placeholder.svg')) {
        img.src = FALLBACK_IMAGE
      }
    }
  }

  function reset() {
    hasError.value = false
  }

  return { hasError, onImgError, reset }
}
