<script setup lang="ts">
defineProps<{
  always: Array<{ label: string; note?: string }>
  extras: Array<{
    id: string
    label: string
    description: string
    price: number | null
    unit?: string
  }>
}>()
</script>

<template>
  <div class="grid gap-10 md:grid-cols-2">
    <!-- Always included -->
    <div>
      <h3 class="font-serif text-lg font-semibold text-sage-900">Immer dabei</h3>
      <ul class="mt-4 space-y-3">
        <li v-for="item in always" :key="item.label" class="flex items-start gap-3">
          <Icon name="ph:basket-duotone" class="mt-0.5 size-5 shrink-0 text-waldhonig-500" />
          <div>
            <span class="text-sm font-medium text-sage-900">{{ item.label }}</span>
            <span v-if="item.note" class="ml-1 text-xs text-sage-500">({{ item.note }})</span>
          </div>
        </li>
      </ul>
    </div>

    <!-- Optional extras -->
    <div>
      <h3 class="font-serif text-lg font-semibold text-sage-900">Optional zubuchbar</h3>
      <ul class="mt-4 space-y-4">
        <li v-for="extra in extras" :key="extra.id" class="flex items-start gap-3">
          <Icon name="ph:plus-circle-duotone" class="mt-0.5 size-5 shrink-0 text-sage-400" />
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm font-medium text-sage-900">{{ extra.label }}</span>
              <span
                v-if="extra.price"
                class="rounded-full bg-waldhonig-50 px-2 py-0.5 text-xs text-waldhonig-700"
              >
                +{{ extra.price }} € / {{ extra.unit }}
              </span>
              <span
                v-else-if="extra.price === null"
                class="rounded-full bg-sage-100 px-2 py-0.5 text-xs text-sage-600"
              >
                auf Anfrage
              </span>
            </div>
            <p class="mt-0.5 text-xs text-sage-600">{{ extra.description }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
