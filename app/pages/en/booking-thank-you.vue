<script setup lang="ts">
definePageMeta({
  breadcrumb: { label: 'Booking confirmed' },
})

useHead({
  htmlAttrs: { lang: 'en' },
})

useSeoMeta({
  title: 'Thank you for your booking – Pension Volgenandt',
  robots: 'noindex',
})

const { contact } = useAppConfig()

// Optional booking details passed back by the payment provider
const route = useRoute()
const betrag = computed(() => Number(route.query.amt ?? route.query.betrag) || 0)
const txn = computed(() => String(route.query.tx ?? route.query.txn ?? ''))

// Report the completed booking to GA4 / Google Ads (purchase conversion)
useBookingConversion()
</script>

<template>
  <div class="mx-auto max-w-xl px-6 py-16 text-center md:py-24">
    <Icon name="ph:check-circle-duotone" class="mx-auto size-16 text-sage-500" />

    <h1 class="mt-6 font-serif text-3xl font-bold text-sage-900">Thank you for your booking!</h1>
    <p class="mt-3 text-lg text-sage-700">
      Your payment was processed successfully and your booking is confirmed.
    </p>
    <p class="mt-2 text-sm text-sage-600">
      We have sent a <strong>booking confirmation</strong> with all details to your email address.
    </p>

    <!-- Optional payment summary -->
    <div v-if="betrag > 0" class="mt-10 rounded-xl bg-waldhonig-50 p-6 text-left">
      <h2 class="font-serif text-xl font-semibold text-sage-900">Your payment</h2>
      <dl class="mt-4 space-y-2 text-sm">
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

    <!-- Good to know -->
    <div class="mt-8 rounded-xl bg-sage-50 p-6 text-left">
      <h2 class="font-serif text-xl font-semibold text-sage-900">Good to know</h2>
      <dl class="mt-4 space-y-3 text-sm">
        <div class="flex justify-between gap-4">
          <dt class="text-sage-600">Check-in</dt>
          <dd class="text-right font-medium text-sage-900">from 2:00 pm</dd>
        </div>
        <div class="flex justify-between gap-4 border-t border-sage-200 pt-3">
          <dt class="text-sage-600">Check-out</dt>
          <dd class="text-right font-medium text-sage-900">until 11:00 am</dd>
        </div>
        <div class="flex justify-between gap-4 border-t border-sage-200 pt-3">
          <dt class="text-sage-600">Address</dt>
          <dd class="text-right font-medium text-sage-900">
            {{ contact.address.street }}<br />{{ contact.address.city }}
          </dd>
        </div>
      </dl>
    </div>

    <!-- Contact -->
    <p class="mt-6 text-sm leading-relaxed text-sage-600">
      If you have any questions, reach us anytime at
      <a class="font-medium text-sage-800 hover:underline" :href="`mailto:${contact.email}`">
        {{ contact.email }}
      </a>
      or by phone at
      <a class="font-medium text-sage-800 hover:underline" :href="`tel:${contact.phone}`">
        {{ contact.phoneDisplay }}
      </a>
      .
    </p>

    <p class="mt-6 font-serif text-base text-sage-800">
      We look forward to welcoming you!<br />
      <span class="font-semibold">Simone &amp; Ralf Volgenandt</span>
    </p>

    <!-- Back -->
    <NuxtLink
      to="/en/"
      class="mt-8 inline-flex items-center gap-2 text-sm text-sage-500 hover:text-sage-800"
    >
      <Icon name="ph:arrow-left" class="size-4" />
      Back to home
    </NuxtLink>
  </div>
</template>
