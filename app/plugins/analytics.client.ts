export default defineNuxtPlugin(() => {
  const { isAllowed } = useCookieConsent()
  const config = useRuntimeConfig()
  const measurementId = config.public.gaMeasurementId as string

  if (!measurementId) return

  let loaded = false

  function loadGA4() {
    if (loaded || !isAllowed('statistics')) return
    loaded = true

    window.dataLayer = window.dataLayer || []
    window.gtag = function (...args: unknown[]) {
      window.dataLayer.push(args)
    }
    window.gtag('js', new Date())
    window.gtag('config', measurementId, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=Lax;Secure',
    })

    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    script.async = true
    document.head.appendChild(script)
  }

  watch(
    () => isAllowed('statistics'),
    (allowed) => {
      if (allowed) loadGA4()
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
