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
