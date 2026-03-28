import type { Locale } from '~/composables/useLocale'
import { t } from '~/utils/translations'

export const amenityIcons: Record<string, string> = {
  wifi: 'lucide:wifi',
  tv: 'lucide:tv',
  balkon: 'lucide:fence',
  terrasse: 'lucide:sun',
  kueche: 'lucide:cooking-pot',
  kuehlschrank: 'lucide:refrigerator',
  kaffeemaschine: 'lucide:coffee',
  wasserkocher: 'lucide:cup-soda',
  spuele: 'lucide:droplets',
  dusche: 'lucide:shower-head',
  badewanne: 'lucide:bath',
  parkplatz: 'lucide:circle-parking',
  garten: 'lucide:trees',
  bettwaesche: 'lucide:bed',
  handtuecher: 'lucide:hand',
  foehn: 'lucide:wind',
  tisch: 'lucide:lamp-desk',
  heizung: 'lucide:heater',
}

export function getAmenityLabel(key: string, locale: Locale = 'de'): string {
  return t(`amenity.${key}`, locale)
}

export function getAmenityIcon(key: string): string {
  return amenityIcons[key] ?? 'lucide:check'
}
