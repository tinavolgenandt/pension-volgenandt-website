<script setup lang="ts">
import type { Locale } from '~/composables/useLocale'
import { t } from '~/utils/translations'
import { getAmenityIcon, getAmenityLabel } from '~/utils/amenities'

interface Props {
  amenities: string[]
  sizeM2?: number
  maxGuests: number
  beds: string
  locale?: Locale
}

const props = withDefaults(defineProps<Props>(), {
  sizeM2: undefined,
  locale: 'de',
})

// Build display items: fixed specs first, then dynamic amenities
interface AmenityItem {
  icon: string
  label: string
  key: string
}

const displayItems = computed<AmenityItem[]>(() => {
  const items: AmenityItem[] = []

  // Fixed room specs
  const guestWord =
    props.maxGuests === 1 ? t('room.guest', props.locale) : t('room.guests', props.locale)
  items.push({
    key: '_guests',
    icon: 'lucide:users',
    label: `${props.maxGuests} ${guestWord}`,
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

  // Dynamic amenities using locale-aware functions
  for (const amenity of props.amenities) {
    items.push({
      key: amenity,
      icon: getAmenityIcon(amenity),
      label: getAmenityLabel(amenity, props.locale),
    })
  }

  return items
})
</script>

<template>
  <div class="room-amenities">
    <h3 class="mb-4 font-serif text-xl font-semibold text-sage-800">
      {{ t('room.amenities', locale) }}
    </h3>
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      <div v-for="item in displayItems" :key="item.key" class="flex items-center gap-3">
        <Icon :name="item.icon" :size="20" aria-hidden="true" class="shrink-0 text-sage-600" />
        <span class="text-sm text-sage-700">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>
