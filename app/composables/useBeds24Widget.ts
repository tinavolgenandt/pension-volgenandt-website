/**
 * Composable for loading Beds24 booking widget scripts (jQuery + bookWidget.min.js)
 * with DSGVO-compliant consent gating.
 *
 * Scripts are only injected AFTER the visitor grants booking consent.
 * Zero requests to external domains before consent.
 */

// Module-level promise to prevent duplicate loading across components
let loadPromise: Promise<void> | null = null

function loadScript(src: string, options?: { integrity?: string; crossOrigin?: string }): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = true

    if (options?.integrity) {
      script.integrity = options.integrity
    }
    if (options?.crossOrigin) {
      script.crossOrigin = options.crossOrigin
    }

    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))

    document.head.appendChild(script)
  })
}

async function loadBeds24Scripts(): Promise<void> {
  // Load jQuery first (required by bookWidget.min.js)
  await loadScript('https://code.jquery.com/jquery-3.7.1.min.js', {
    integrity: 'sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=',
    crossOrigin: 'anonymous',
  })

  // Then load Beds24 widget script (depends on jQuery)
  await loadScript('https://media.xmlcal.com/widget/1.00/js/bookWidget.min.js')
}

export function useBeds24Widget() {
  const { isAllowed } = useCookieConsent()
  const isReady = ref(false)

  if (import.meta.client) {
    const tryLoad = () => {
      if (!isAllowed('booking')) return

      // Reuse module-level promise to prevent duplicate loading
      if (!loadPromise) {
        loadPromise = loadBeds24Scripts()
      }

      loadPromise
        .then(() => {
          isReady.value = true
        })
        .catch((err) => {
          console.error('[useBeds24Widget] Failed to load scripts:', err)
          // Reset promise so it can be retried
          loadPromise = null
        })
    }

    // Watch for consent changes (visitor may grant consent after page load)
    watch(
      () => isAllowed('booking'),
      (allowed) => {
        if (allowed) tryLoad()
      },
      { immediate: true },
    )
  }

  return {
    isReady: readonly(isReady),
  }
}
