import type { Locale } from '~/composables/useLocale'

/**
 * Format an ISO date (YYYY-MM-DD) as a long, human-readable date,
 * e.g. "1. März 2027" (de) or "1 March 2027" (en).
 * Parsed as UTC so the day never shifts with the build machine's timezone.
 */
export function formatLongDate(isoDate: string, locale: Locale): string {
  const date = new Date(`${isoDate}T00:00:00Z`)
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}
