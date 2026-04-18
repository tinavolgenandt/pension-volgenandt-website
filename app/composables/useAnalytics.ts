export function useAnalytics() {
  function trackEvent(name: string, params?: Record<string, unknown>) {
    if (import.meta.server) return
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params)
    }
  }

  return { trackEvent }
}
