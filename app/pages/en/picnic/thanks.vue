<script setup lang="ts">
definePageMeta({
  breadcrumb: { label: 'Booking confirmed' },
})

useHead({
  htmlAttrs: { lang: 'en' },
})

useSeoMeta({
  title: 'Booking Confirmed – Picnic Basket',
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

    <h1 class="mt-6 font-serif text-3xl font-bold text-sage-900">Thank you!</h1>
    <p class="mt-3 text-lg text-sage-700">
      Your booking is confirmed and payment has been received.
    </p>
    <p class="mt-2 text-sm text-sage-500">
      A confirmation email has been sent to your email address.
    </p>

    <!-- Booking summary -->
    <div v-if="betrag > 0" class="mt-10 rounded-xl bg-waldhonig-50 p-6 text-left">
      <h2 class="font-serif text-xl font-semibold text-sage-900">Your Booking</h2>
      <dl class="mt-4 space-y-2 text-sm">
        <div v-if="paket" class="flex justify-between">
          <dt class="text-sage-600">Package</dt>
          <dd class="font-medium text-sage-900">{{ paket }}</dd>
        </div>
        <div v-if="personen" class="flex justify-between">
          <dt class="text-sage-600">Guests</dt>
          <dd class="font-medium text-sage-900">{{ personen }}</dd>
        </div>
        <div class="flex justify-between border-t border-waldhonig-200 pt-2">
          <dt class="font-semibold text-sage-900">Paid</dt>
          <dd class="font-bold text-waldhonig-700">
            {{ betrag.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €
          </dd>
        </div>
        <div v-if="txn" class="flex justify-between text-xs text-sage-400">
          <dt>Transaction ID</dt>
          <dd>{{ txn }}</dd>
        </div>
      </dl>
    </div>

    <!-- Deposit -->
    <div class="mt-6 rounded-lg bg-sage-50 p-4 text-left text-sm text-sage-700">
      <p>
        <strong class="font-medium text-sage-900">Basket deposit (100 €):</strong>
        The deposit is collected in cash upon pickup and fully refunded when the complete basket
        contents are returned.
      </p>
    </div>

    <!-- Back -->
    <NuxtLink
      to="/en/picnic/"
      class="mt-8 inline-flex items-center gap-2 text-sm text-sage-500 hover:text-sage-800"
    >
      <Icon name="ph:arrow-left" class="size-4" />
      Back to Picnic Basket
    </NuxtLink>
  </div>
</template>
