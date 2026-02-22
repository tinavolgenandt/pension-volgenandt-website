<script setup lang="ts">
interface Extra {
  name: string
  description?: string
  price: number
  unit: string
}

interface Props {
  extras: Extra[]
}

defineProps<Props>()

const extraIcons: Record<string, string> = {
  Frühstück: 'lucide:egg-fried',
  'Genießer-Frühstück': 'lucide:croissant',
  Hund: 'lucide:dog',
  'BBQ-Set': 'lucide:flame',
}

function getExtraIcon(name: string): string {
  return extraIcons[name] ?? 'lucide:circle-plus'
}
</script>

<template>
  <div v-if="extras.length > 0" class="room-extras">
    <h3 class="mb-4 font-serif text-xl font-semibold text-sage-800">Zusatzleistungen</h3>

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
