<script setup lang="ts">
import type { Locale } from '~/composables/useLocale'
import { t } from '~/utils/translations'

interface Rate {
  occupancy: number
  pricePerNight: number
}

interface PricingPeriod {
  label: string
  dateRange?: string
  rates: Rate[]
}

interface Props {
  pricing: PricingPeriod[]
  maxGuests: number
  locale?: Locale
}

const props = withDefaults(defineProps<Props>(), {
  locale: 'de',
})

// Flatten all rates across periods for simple display
const allRates = computed(() => {
  const rates: { occupancy: number; pricePerNight: number; periodLabel: string }[] = []
  for (const period of props.pricing) {
    for (const rate of period.rates) {
      rates.push({ ...rate, periodLabel: period.label })
    }
  }
  return rates.sort((a, b) => a.occupancy - b.occupancy)
})

// Check if we have a simple single-rate setup
const isSimple = computed(() => allRates.value.length === 1)

function occupancyLabel(occupancy: number): string {
  if (occupancy === 1) return `1 ${t('price.person', props.locale)}`
  return `${occupancy} ${t('price.persons', props.locale)}`
}
</script>

<template>
  <div class="room-price-table">
    <h3 class="mb-4 font-serif text-xl font-semibold text-sage-800">{{ t('room.prices', locale) }}</h3>

    <!-- Simple display for single rate -->
    <div v-if="isSimple" class="rounded-lg border border-sage-200 bg-sage-50 px-5 py-4 text-center">
      <div class="flex items-baseline justify-center gap-2">
        <span class="text-2xl font-bold text-sage-800">{{ allRates[0]?.pricePerNight }} EUR</span>
        <span class="text-sm text-sage-600">{{ t('price.perNight', locale) }}</span>
      </div>
      <p class="mt-1 text-sm text-sage-600">{{ locale === 'de' ? 'für' : 'for' }} {{ occupancyLabel(allRates[0]?.occupancy ?? 1) }}</p>
    </div>

    <!-- Multi-rate table for rooms with multiple occupancy levels -->
    <div v-else class="overflow-x-auto">
      <div
        class="grid gap-3"
        :class="
          allRates.length <= 3 ? `grid-cols-${allRates.length}` : 'grid-cols-2 sm:grid-cols-3'
        "
      >
        <div
          v-for="rate in allRates"
          :key="rate.occupancy"
          class="rounded-lg border border-sage-200 bg-sage-50 px-5 py-4"
        >
          <p class="text-sm font-medium text-sage-600">{{ occupancyLabel(rate.occupancy) }}</p>
          <div class="mt-1 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-sage-800">{{ rate.pricePerNight }} EUR</span>
            <span class="text-sm text-sage-600">{{ t('price.perNight', locale) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- PAngV compliance notice -->
    <p class="mt-3 text-xs text-sage-600">{{ t('price.allIncl', locale) }}</p>
  </div>
</template>
