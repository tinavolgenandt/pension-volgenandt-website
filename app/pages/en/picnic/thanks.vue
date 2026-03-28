<script setup lang="ts">
definePageMeta({
  breadcrumb: { label: 'Request received' },
})

useHead({
  htmlAttrs: { lang: 'en' },
})

useSeoMeta({
  title: 'Request Received – Picnic Basket',
  robots: 'noindex',
})

const route = useRoute()
const betrag = computed(() => Number(route.query.betrag) || 0)
const personen = computed(() => Number(route.query.personen) || 0)
const paket = computed(() => String(route.query.paket || ''))

const paypalUrl = computed(() => `https://paypal.me/PensionVolgenandt/${betrag.value}EUR`)
</script>

<template>
  <div class="mx-auto max-w-xl px-6 py-16 text-center md:py-24">
    <Icon name="ph:check-circle-duotone" class="mx-auto size-16 text-sage-500" />

    <h1 class="mt-6 font-serif text-3xl font-bold text-sage-900">Thank you!</h1>
    <p class="mt-3 text-lg text-sage-700">
      Your request has been received. We will get back to you within
      <strong>24 hours</strong> to confirm.
    </p>

    <!-- PayPal -->
    <div v-if="betrag > 0" class="mt-10 rounded-xl bg-waldhonig-50 p-6 text-left">
      <h2 class="font-serif text-xl font-semibold text-sage-900">Pay the base price now</h2>
      <p class="mt-2 text-sm text-sage-700">
        To secure your request, you can transfer the base price directly via PayPal:
      </p>

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
          <dt class="font-semibold text-sage-900">Base price</dt>
          <dd class="font-bold text-waldhonig-700">{{ betrag }} EUR</dd>
        </div>
      </dl>

      <a
        :href="paypalUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-5 flex items-center justify-center gap-2 rounded-lg bg-[#0070ba] px-6 py-3.5 font-semibold text-white transition-opacity hover:opacity-90"
      >
        <Icon name="ph:currency-dollar-duotone" class="size-5" />
        Pay {{ betrag }} EUR via PayPal
      </a>
      <p class="mt-3 text-center text-xs text-sage-500">PayPal recipient: PensionVolgenandt</p>
    </div>

    <!-- Deposit -->
    <div class="mt-6 rounded-lg bg-sage-50 p-4 text-left text-sm text-sage-700">
      <p>
        <strong class="font-medium text-sage-900">Basket deposit (100 EUR):</strong>
        We will discuss the deposit with you by email – either via PayPal as well or in cash upon
        collection. It is fully refunded when the complete basket contents are returned.
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
