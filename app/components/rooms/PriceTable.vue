<script setup lang="ts">
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
}

const props = defineProps<Props>()

// Determine unique occupancy values across all periods, sorted ascending
const occupancyColumns = computed(() => {
  const occupancies = new Set<number>()
  for (const period of props.pricing) {
    for (const rate of period.rates) {
      occupancies.add(rate.occupancy)
    }
  }
  return [...occupancies].sort((a, b) => a - b)
})

// Column header label
function occupancyLabel(occupancy: number): string {
  return occupancy === 1 ? '1 Person' : `${occupancy} Personen`
}

// Get price for a specific period and occupancy, or null if not available
function getRate(period: PricingPeriod, occupancy: number): number | null {
  const rate = period.rates.find((r) => r.occupancy === occupancy)
  return rate ? rate.pricePerNight : null
}
</script>

<template>
  <div class="room-price-table">
    <h3 class="mb-4 font-serif text-xl font-semibold text-sage-800">Preise</h3>

    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b-2 border-sage-200">
            <th class="pr-6 pb-3 text-sm font-semibold text-charcoal-800">Zeitraum</th>
            <th
              v-for="occupancy in occupancyColumns"
              :key="occupancy"
              class="pr-6 pb-3 text-sm font-semibold text-charcoal-800"
            >
              {{ occupancyLabel(occupancy) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="period in pricing" :key="period.label" class="border-b border-sage-200">
            <td class="py-4 pr-6">
              <span class="font-semibold text-sage-800">{{ period.label }}</span>
              <span v-if="period.dateRange" class="mt-0.5 block text-xs text-sage-500">
                {{ period.dateRange }}
              </span>
            </td>
            <td v-for="occupancy in occupancyColumns" :key="occupancy" class="py-4 pr-6">
              <template v-if="getRate(period, occupancy) !== null">
                <span class="font-semibold text-sage-800"
                  >{{ getRate(period, occupancy) }} EUR</span
                >
                <span class="mt-0.5 block text-xs text-sage-500">pro Nacht</span>
              </template>
              <template v-else>
                <span class="text-sage-400">&ndash;</span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- PAngV compliance notice -->
    <p class="mt-3 text-xs text-sage-500">Alle Preise inkl. MwSt.</p>
  </div>
</template>
