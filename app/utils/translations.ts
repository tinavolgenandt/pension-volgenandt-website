import type { Locale } from '~/composables/useLocale'
import de from '~/i18n/locales/de.json'
import en from '~/i18n/locales/en.json'

type NestedRecord = { [key: string]: string | NestedRecord }

const locales: Record<Locale, NestedRecord> = {
  de: de as unknown as NestedRecord,
  en: en as unknown as NestedRecord,
}

function resolve(obj: NestedRecord, path: string): string | undefined {
  const parts = path.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[part]
  }
  return typeof current === 'string' ? current : undefined
}

/**
 * Look up a translated string by dotted key and locale.
 * Fallback chain: requested locale → German → key itself.
 */
export function t(key: string, locale: Locale): string {
  return resolve(locales[locale], key) ?? resolve(locales.de, key) ?? key
}
