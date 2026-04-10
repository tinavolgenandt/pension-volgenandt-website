<script setup lang="ts">
definePageMeta({
  breadcrumb: { label: 'Buchung bestätigt' },
})

useSeoMeta({
  title: 'Buchung bestätigt – Picknick-Korb',
  robots: 'noindex',
})

const route = useRoute()
const betrag = computed(() => Number(route.query.betrag) || 0)
const personen = computed(() => Number(route.query.personen) || 0)
const paket = computed(() => String(route.query.paket || ''))
const txn = computed(() => String(route.query.txn || ''))
</script>

<template>
  <div class="mx-auto max-w-xl px-6 py-16 text-center md:py-24">
    <Icon name="ph:check-circle-duotone" class="mx-auto size-16 text-sage-500" />

    <h1 class="mt-6 font-serif text-3xl font-bold text-sage-900">Vielen Dank!</h1>
    <p class="mt-3 text-lg text-sage-700">
      Ihre Buchung ist bestätigt und die Zahlung eingegangen.
    </p>
    <p class="mt-2 text-sm text-sage-500">
      Eine Bestätigungs-E-Mail wurde an Ihre E-Mail-Adresse gesendet.
    </p>

    <!-- Buchungszusammenfassung -->
    <div v-if="betrag > 0" class="mt-10 rounded-xl bg-waldhonig-50 p-6 text-left">
      <h2 class="font-serif text-xl font-semibold text-sage-900">Ihre Buchung</h2>
      <dl class="mt-4 space-y-2 text-sm">
        <div v-if="paket" class="flex justify-between">
          <dt class="text-sage-600">Paket</dt>
          <dd class="font-medium text-sage-900">{{ paket }}</dd>
        </div>
        <div v-if="personen" class="flex justify-between">
          <dt class="text-sage-600">Personen</dt>
          <dd class="font-medium text-sage-900">{{ personen }}</dd>
        </div>
        <div class="flex justify-between border-t border-waldhonig-200 pt-2">
          <dt class="font-semibold text-sage-900">Bezahlt</dt>
          <dd class="font-bold text-waldhonig-700">
            {{ betrag.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €
          </dd>
        </div>
        <div v-if="txn" class="flex justify-between text-xs text-sage-400">
          <dt>Transaction-ID</dt>
          <dd>{{ txn }}</dd>
        </div>
      </dl>
    </div>

    <!-- Pfand -->
    <div class="mt-6 rounded-lg bg-sage-50 p-4 text-left text-sm text-sage-700">
      <p>
        <strong class="font-medium text-sage-900">Korbpfand (100 €):</strong>
        Das Pfand wird bei Abholung in bar hinterlegt und bei Rückgabe des vollständigen
        Korb-Inhalts sofort erstattet.
      </p>
    </div>

    <!-- Zurück -->
    <NuxtLink
      to="/picknick/"
      class="mt-8 inline-flex items-center gap-2 text-sm text-sage-500 hover:text-sage-800"
    >
      <Icon name="ph:arrow-left" class="size-4" />
      Zurück zum Picknick-Korb
    </NuxtLink>
  </div>
</template>
