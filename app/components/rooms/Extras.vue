<script setup lang="ts">
import type { Locale } from '~/composables/useLocale'
import { t } from '~/utils/translations'

interface Extra {
  name: string
  description?: string
  price: number
  unit: string
}

interface Props {
  extras: Extra[]
  locale?: Locale
}

const props = withDefaults(defineProps<Props>(), {
  locale: 'de',
})

const extraIcons: Record<string, string> = {
  Frühstück: 'lucide:egg-fried',
  'Genießer-Frühstück': 'lucide:croissant',
  Hund: 'lucide:dog',
  Aufbettung: 'lucide:bed-single',
  'Grill-Set': 'lucide:flame',
  Breakfast: 'lucide:egg-fried',
  'Gourmet breakfast': 'lucide:croissant',
  Dog: 'lucide:dog',
  'Extra bed': 'lucide:bed-single',
  'BBQ set': 'lucide:flame',
}

function getExtraIcon(name: string): string {
  return extraIcons[name] ?? 'lucide:circle-plus'
}
</script>

<template>
  <div v-if="extras.length > 0" class="room-extras">
    <h3 class="mb-4 font-serif text-xl font-semibold text-sage-800">{{ t('room.extras', props.locale) }}</h3>

    <ul class="divide-y divide-sage-200">
      <li
        v-for="extra in extras"
        :key="extra.name"
        class="flex items-center justify-between gap-4 py-3"
      >
        <div class="flex items-center gap-3">
          <Icon
            :name="getExtraIcon(extra.name)"
            :size="20"
            aria-hidden="true"
            class="shrink-0 text-sage-600"
          />
          <div>
            <span class="font-medium text-sage-800">{{ extra.name }}</span>
            <span v-if="extra.description" class="mt-0.5 block text-sm text-sage-500">
              {{ extra.description }}
            </span>
          </div>
        </div>
        <span class="shrink-0 text-sm font-semibold text-sage-700">
          {{ extra.price }} EUR {{ extra.unit }}
        </span>
      </li>
    </ul>
  </div>
</template>
