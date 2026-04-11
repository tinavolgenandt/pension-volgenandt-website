/**
 * Composable for loading the PayPal JS SDK with DSGVO-compliant consent gating.
 *
 * Scripts are only injected AFTER the visitor grants booking consent.
 * Zero requests to external domains before consent.
 */

declare global {
  interface Window {
     
    paypal?: {
      Buttons: (options: Record<string, unknown>) => {
        render: (container: string | HTMLElement) => Promise<void>
      }
    }
  }
}

let loadPromise: Promise<void> | null = null

function loadPayPalSdk(clientId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src*="paypal.com/sdk"]')
    if (existing) {
      if (window.paypal) {
        resolve()
      } else {
        existing.addEventListener('load', () => resolve())
        existing.addEventListener('error', () => reject(new Error('PayPal SDK failed to load')))
      }
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR&locale=de_DE`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('PayPal SDK failed to load'))
    document.head.appendChild(script)
  })
}

export function usePayPal() {
  const runtimeConfig = useRuntimeConfig()
  const clientId = runtimeConfig.public.paypalClientId as string
  const { isAllowed } = useCookieConsent()
  const isReady = ref(false)

  if (import.meta.client && clientId) {
    const tryLoad = () => {
      if (!isAllowed('booking')) return

      if (!loadPromise) {
        loadPromise = loadPayPalSdk(clientId)
      }

      loadPromise
        .then(() => {
          isReady.value = true
        })
        .catch((err) => {
          console.error('[usePayPal] Failed to load SDK:', err)
          loadPromise = null
        })
    }

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
