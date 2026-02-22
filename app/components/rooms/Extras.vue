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
</script>

<template>
  <div v-if="extras.length > 0" class="room-extras">
    <h3 class="mb-4 font-serif text-xl font-semibold text-sage-800">Zusatzleistungen</h3>

    <ul class="divide-y divide-sage-200">
      <li
        v-for="extra in extras"
        :key="extra.name"
        class="flex items-baseline justify-between gap-4 py-3"
      >
        <div>
          <span class="font-medium text-sage-800">{{ extra.name }}</span>
          <span v-if="extra.description" class="mt-0.5 block text-sm text-sage-500">
            {{ extra.description }}
          </span>
        </div>
        <span class="shrink-0 text-sm font-semibold text-sage-700">
          {{ extra.price }} EUR {{ extra.unit }}
        </span>
      </li>
    </ul>
  </div>
</template>
