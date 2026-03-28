import type { Locale } from '~/composables/useLocale'

export interface AmenityInfo {
  icon: string
  label: string
}

export const amenityMap: Record<string, AmenityInfo> = {
  wifi: { icon: 'lucide:wifi', label: 'Kostenloses WLAN' },
  tv: { icon: 'lucide:tv', label: 'Fernseher' },
  balkon: { icon: 'lucide:fence', label: 'Balkon' },
  terrasse: { icon: 'lucide:sun', label: 'Terrasse' },
  kueche: { icon: 'lucide:cooking-pot', label: 'Küche' },
  kuehlschrank: { icon: 'lucide:refrigerator', label: 'Kühlschrank' },
  kaffeemaschine: { icon: 'lucide:coffee', label: 'Kaffeemaschine' },
  wasserkocher: { icon: 'lucide:cup-soda', label: 'Wasserkocher' },
  spuele: { icon: 'lucide:droplets', label: 'Spüle' },
  dusche: { icon: 'lucide:shower-head', label: 'Dusche' },
  badewanne: { icon: 'lucide:bath', label: 'Badewanne' },
  parkplatz: { icon: 'lucide:circle-parking', label: 'Kostenloser Parkplatz' },
  garten: { icon: 'lucide:trees', label: 'Garten' },
  bettwaesche: { icon: 'lucide:bed', label: 'Bettwäsche' },
  handtuecher: { icon: 'lucide:hand', label: 'Handtücher' },
  foehn: { icon: 'lucide:wind', label: 'Föhn' },
  tisch: { icon: 'lucide:lamp-desk', label: 'Kleiner Tisch' },
  heizung: { icon: 'lucide:heater', label: 'Heizung' },
}

export const amenityMapEn: Record<string, string> = {
  wifi: 'Free Wi-Fi',
  tv: 'Television',
  balkon: 'Balcony',
  terrasse: 'Terrace',
  kueche: 'Kitchen',
  kuehlschrank: 'Refrigerator',
  kaffeemaschine: 'Coffee machine',
  wasserkocher: 'Kettle',
  spuele: 'Sink',
  dusche: 'Shower',
  badewanne: 'Bathtub',
  parkplatz: 'Free parking',
  garten: 'Garden',
  bettwaesche: 'Bed linen',
  handtuecher: 'Towels',
  foehn: 'Hair dryer',
  tisch: 'Small table',
  heizung: 'Heating',
}

export function getAmenityLabel(key: string, locale: Locale = 'de'): string {
  if (locale === 'en') return amenityMapEn[key] ?? amenityMap[key]?.label ?? key
  return amenityMap[key]?.label ?? key
}

export function getAmenityIcon(key: string): string {
  return amenityMap[key]?.icon ?? 'lucide:check'
}
