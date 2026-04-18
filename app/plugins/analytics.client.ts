export default defineNuxtPlugin(() => {
  const { isAllowed } = useCookieConsent()
  const config = useRuntimeConfig()
  const measurementId = config.public.gaMeasurementId as string
  const googleAdsId = config.public.googleAdsId as string

  if (!measurementId && !googleAdsId) return

  let loaded = false

  function loadAnalytics() {
    if (loaded || !isAllowed('statistics')) return
    loaded = true

    window.dataLayer = window.dataLayer || []
    window.gtag = function (...args: unknown[]) {
      window.dataLayer.push(args)
    }
    window.gtag('js', new Date())

    // GA4
    if (measurementId) {
      window.gtag('config', measurementId, {
        anonymize_ip: true,
        cookie_flags: 'SameSite=Lax;Secure',
      })
    }

    // Google Ads
    if (googleAdsId) {
      window.gtag('config', googleAdsId)
    }

    // Load gtag.js once (use GA4 ID if available, otherwise Ads ID)
    const primaryId = measurementId || googleAdsId
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${primaryId}`
    script.async = true
    document.head.appendChild(script)

    // Track Beds24 booking widget form submissions as booking interest
    document.addEventListener(
      'submit',
      (e) => {
        const form = e.target as HTMLFormElement
        if (form?.action?.includes('beds24.com') && window.gtag) {
          window.gtag('event', 'Buchungsinteressierte')
        }
      },
      true,
    )
  }

  watch(
    () => isAllowed('statistics'),
    (allowed) => {
      if (allowed) loadAnalytics()
    },
    { immediate: true },
  )

  const router = useRouter()
  router.afterEach((to) => {
    if (loaded && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: to.fullPath,
        page_title: document.title,
      })
    }
  })
})
