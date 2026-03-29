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
  '/ferienwohnungen': '/holiday-apartments',
  '/monteurzimmer': '/worker-rooms',
}

const enToDe: Record<string, string> = Object.fromEntries(
  Object.entries(deToEn).map(([de, en]) => [en, de]),
)

// German paths that have English counterparts
const translatedDePaths = Object.keys(deToEn)

// Special sub-route mappings (DE slug → EN slug)
const subRouteMappings: Record<string, string> = {
  '/aktivitaeten/wandern': '/activities/hiking',
  '/aktivitaeten/radfahren': '/activities/cycling',
  '/picknick/buchen': '/picnic/book',
  '/picknick/danke': '/picnic/thanks',
}

const subRouteMappingsReverse: Record<string, string> = Object.fromEntries(
  Object.entries(subRouteMappings).map(([de, en]) => [en, de]),
)

function isTranslatedDePage(path: string): boolean {
  const normalized = path.replace(/\/$/, '') || '/'
  if (normalized === '/') return true
  // Exact match on top-level paths
  if (translatedDePaths.includes(normalized)) return true
  // Special sub-route mappings
  if (subRouteMappings[normalized]) return true
  // Any subpage of a translated path (e.g. /ausflugsziele/seeburger-see, /aktuelles/xyz)
  for (const dePath of translatedDePaths) {
    if (normalized.startsWith(dePath + '/')) return true
  }
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
      // EN → DE: strip /en prefix
      let dePath = path.replace(/^\/en/, '') || '/'
      // Check special sub-route mappings first
      for (const [en, de] of Object.entries(subRouteMappingsReverse)) {
        if (dePath === en || dePath === en + '/') {
          return de + '/'
        }
      }
      // Then translate known base paths
      for (const [en, de] of Object.entries(enToDe)) {
        if (dePath.startsWith(en)) {
          dePath = de + dePath.slice(en.length)
          break
        }
      }
      return dePath
    }

    // DE → EN: check special sub-routes first
    const normalized = path.replace(/\/$/, '')
    for (const [de, en] of Object.entries(subRouteMappings)) {
      if (normalized === de) {
        return `/en${en}/`
      }
    }

    // Translate known base paths
    let enPath = path
    for (const [de, en] of Object.entries(deToEn)) {
      if (enPath.startsWith(de)) {
        enPath = en + enPath.slice(de.length)
        break
      }
    }
    return `/en${enPath}`
  })

  return { locale, prefix, beds24Lang, alternateUrl, hasAlternate }
}
