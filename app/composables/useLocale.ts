export type Locale = 'de' | 'en'

// Route slug mappings between German and English
const deToEn: Record<string, string> = {
  '/zimmer': '/rooms',
  '/kontakt': '/contact',
  '/familie': '/families',
  '/aktivitaeten': '/activities',
  '/nachhaltigkeit': '/sustainability',
  '/ausflugsziele': '/attractions',
  '/aktuelles': '/news',
  '/impressum': '/imprint',
  '/datenschutz': '/privacy',
  '/agb': '/terms',
  '/picknick': '/picnic',
}

const enToDe: Record<string, string> = Object.fromEntries(
  Object.entries(deToEn).map(([de, en]) => [en, de]),
)

// German paths that have English counterparts
const translatedDePaths = Object.keys(deToEn)

function isTranslatedDePage(path: string): boolean {
  const normalized = path.replace(/\/$/, '') || '/'
  if (normalized === '/') return true
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
      let dePath = path.replace(/^\/en/, '') || '/'
      for (const [en, de] of Object.entries(enToDe)) {
        if (dePath.startsWith(en)) {
          dePath = dePath.replace(en, de)
          break
        }
      }
      return dePath
    }

    // DE → EN: add /en prefix + translate known slugs
    let enPath = path
    for (const [de, en] of Object.entries(deToEn)) {
      if (enPath.startsWith(de)) {
        enPath = enPath.replace(de, en)
        break
      }
    }
    return `/en${enPath}`
  })

  return { locale, prefix, beds24Lang, alternateUrl, hasAlternate }
}
