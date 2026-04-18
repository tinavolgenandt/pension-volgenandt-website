export default defineNuxtPlugin(() => {
  const { isAllowed, consent } = useCookieConsent()
  const config = useRuntimeConfig()
  const measurementId = config.public.gaMeasurementId as string
  const googleAdsId = config.public.googleAdsId as string

  if (!measurementId && !googleAdsId) return

  // Initialise dataLayer + gtag stub before any calls
  window.dataLayer = window.dataLayer || []
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args)
  }

  // Consent Mode v2 — deny everything by default before the script loads.
  // gtag will still send cookieless modeling pings so GA4 can estimate traffic
  // for non-consenting users without touching cookies or personal data.
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  })

  window.gtag('js', new Date())

  if (measurementId) {
    window.gtag('config', measurementId, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=Lax;Secure',
    })
  }
  if (googleAdsId) {
    window.gtag('config', googleAdsId)
  }

  // Load gtag.js for all users — required for modeling to work
  const primaryId = measurementId || googleAdsId
  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${primaryId}`
  script.async = true
  document.head.appendChild(script)

  // Map our consent categories → Google consent signals
  function syncConsent() {
    const granted = isAllowed('statistics') ? 'granted' : 'denied'
    window.gtag?.('consent', 'update', {
      analytics_storage: granted,
      ad_storage: granted,
      ad_user_data: granted,
      ad_personalization: granted,
    })
  }

  // Apply saved consent immediately so returning visitors aren't blocked
  if (consent.value !== null) syncConsent()

  // Re-sync whenever the user changes their choice
  watch(() => consent.value, (val) => {
    if (val !== null) syncConsent()
  })

  // Track Beds24 form submissions as booking interest.
  // submit catches native form submissions; click catches jQuery-triggered submits.
  const fireBuchungsinteressierte = () => window.gtag?.('event', 'Buchungsinteressierte')

  document.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement
    if (form?.action?.includes('beds24.com')) fireBuchungsinteressierte()
  }, true)

  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('button, input[type="submit"]')
    const form = btn?.closest('form') as HTMLFormElement | null
    if (form?.action?.includes('beds24.com')) fireBuchungsinteressierte()
  }, true)

  // Track route changes — Consent Mode handles whether events are stored
  const router = useRouter()
  router.afterEach((to) => {
    window.gtag?.('event', 'page_view', {
      page_path: to.fullPath,
      page_title: document.title,
    })
  })
})
