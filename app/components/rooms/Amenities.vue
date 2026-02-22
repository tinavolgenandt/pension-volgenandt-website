<script setup lang="ts">
import { amenityMap } from '~/utils/amenities'

interface Props {
  amenities: string[]
  sizeM2?: number
  maxGuests: number
  beds: string
}

const props = defineProps<Props>()

// Build display items: fixed specs first, then dynamic amenities
interface AmenityItem {
  icon: string
  label: string
  key: string
}

const displayItems = computed<AmenityItem[]>(() => {
  const items: AmenityItem[] = []

  // Fixed room specs
  items.push({
    key: '_guests',
    icon: 'lucide:users',
    label: `${props.maxGuests} ${props.maxGuests === 1 ? 'Gast' : 'Gäste'}`,
  })
  items.push({
    key: '_beds',
    icon: 'lucide:bed-double',
    label: props.beds,
  })
  if (props.sizeM2) {
    items.push({
      key: '_size',
      icon: 'lucide:ruler',
      label: `ca. ${props.sizeM2} m²`,
    })
  }

  // Dynamic amenities from the amenityMap
  for (const amenity of props.amenities) {
    const info = amenityMap[amenity]
    if (info) {
      items.push({
        key: amenity,
        icon: info.icon,
        label: info.label,
      })
    } else {
      // Fallback for unknown amenities
      items.push({
        key: amenity,
        icon: 'lucide:check',
        label: amenity,
      })
    }
  }

  return items
})
</script>

<template>
  <div class="room-amenities">
    <h3 class="mb-4 font-serif text-xl font-semibold text-sage-800">Ausstattung</h3>
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      <div v-for="item in displayItems" :key="item.key" class="flex items-center gap-3">
        <Icon :name="item.icon" :size="20" aria-hidden="true" class="shrink-0 text-sage-600" />
        <span class="text-sm text-sage-700">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>
