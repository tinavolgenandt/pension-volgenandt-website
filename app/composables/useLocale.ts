export type Locale = 'de' | 'en'

// German paths that have English counterparts
const translatedDePaths = ['/', '/zimmer', '/kontakt']

function isTranslatedDePage(path: string): boolean {
  // Exact matches for listing pages
  const normalized = path.replace(/\/$/, '') || '/'
  if (translatedDePaths.includes(normalized)) return true
  // Room detail pages: /zimmer/[slug]
  if (/^\/zimmer\/[^/]+\/?$/.test(path)) return true
  return false
}

export function useLocale() {
  const route = useRoute()

  const locale = computed<Locale>(() =>
    route.path.startsWith('/en/') || route.path === '/en' ? 'en' : 'de',
  )

  /** URL prefix for building locale-aware links: '' for DE, '/en' for EN */
  const prefix = computed(() => (locale.value === 'en' ? '/en' : ''))

  /** Beds24 language code */
  const beds24Lang = computed(() => (locale.value === 'en' ? 'en' : 'de'))

  /** Whether the current page has an alternate-language version */
  const hasAlternate = computed(() => {
    if (locale.value === 'en') return true // all EN pages have DE equivalents
    return isTranslatedDePage(route.path)
  })

  /** Map from current page to its alternate-language equivalent */
  const alternateUrl = computed(() => {
    const path = route.path

    if (locale.value === 'en') {
      // EN → DE: strip /en prefix + translate known slugs
      const dePath = path
        .replace(/^\/en/, '')
        .replace(/^\/rooms/, '/zimmer')
        .replace(/^\/contact/, '/kontakt')
      return dePath || '/'
    }

    // DE → EN: add /en prefix + translate known slugs
    const enPath = path
      .replace(/^\/zimmer/, '/rooms')
      .replace(/^\/kontakt/, '/contact')
    return `/en${enPath}`
  })

  return { locale, prefix, beds24Lang, alternateUrl, hasAlternate }
}
