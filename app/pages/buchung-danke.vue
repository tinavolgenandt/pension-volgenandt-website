<script setup lang="ts">
definePageMeta({
  breadcrumb: { label: 'Buchung bestätigt' },
})

useHead({
  htmlAttrs: { lang: 'de' },
})

useSeoMeta({
  title: 'Vielen Dank für Ihre Buchung – Pension Volgenandt',
  robots: 'noindex',
})

const { contact } = useAppConfig()

// Optional booking details passed back by the payment provider
const route = useRoute()
const betrag = computed(() => Number(route.query.amt ?? route.query.betrag) || 0)
const txn = computed(() => String(route.query.tx ?? route.query.txn ?? ''))
</script>

<template>
  <div class="mx-auto max-w-xl px-6 py-16 text-center md:py-24">
    <Icon name="ph:check-circle-duotone" class="mx-auto size-16 text-sage-500" />

    <h1 class="mt-6 font-serif text-3xl font-bold text-sage-900">Vielen Dank für Ihre Buchung!</h1>
    <p class="mt-3 text-lg text-sage-700">
      Ihre Zahlung wurde erfolgreich verarbeitet und Ihre Buchung ist bestätigt.
    </p>
    <p class="mt-2 text-sm text-sage-600">
      Eine <strong>Buchungsbestätigung</strong> mit allen Details haben wir Ihnen per E-Mail
      gesendet. Ihre Rechnung erhalten Sie separat per E-Mail.
    </p>

    <!-- Optionale Zahlungszusammenfassung -->
    <div v-if="betrag > 0" class="mt-10 rounded-xl bg-waldhonig-50 p-6 text-left">
      <h2 class="font-serif text-xl font-semibold text-sage-900">Ihre Zahlung</h2>
      <dl class="mt-4 space-y-2 text-sm">
        <div class="flex justify-between border-t border-waldhonig-200 pt-2">
          <dt class="font-semibold text-sage-900">Bezahlt</dt>
          <dd class="font-bold text-waldhonig-700">
            {{ betrag.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €
          </dd>
        </div>
        <div v-if="txn" class="flex justify-between text-xs text-sage-400">
          <dt>Transaktions-ID</dt>
          <dd>{{ txn }}</dd>
        </div>
      </dl>
    </div>

    <!-- Wichtige Informationen zu Ihrem Aufenthalt -->
    <div class="mt-8 rounded-xl bg-sage-50 p-6 text-left">
      <h2 class="font-serif text-xl font-semibold text-sage-900">Gut zu wissen</h2>
      <dl class="mt-4 space-y-3 text-sm">
        <div class="flex justify-between gap-4">
          <dt class="text-sage-600">Anreise</dt>
          <dd class="text-right font-medium text-sage-900">ab 14:00 Uhr</dd>
        </div>
        <div class="flex justify-between gap-4 border-t border-sage-200 pt-3">
          <dt class="text-sage-600">Abreise</dt>
          <dd class="text-right font-medium text-sage-900">bis 11:00 Uhr</dd>
        </div>
        <div class="flex justify-between gap-4 border-t border-sage-200 pt-3">
          <dt class="text-sage-600">Adresse</dt>
          <dd class="text-right font-medium text-sage-900">
            {{ contact.address.street }}<br />{{ contact.address.city }}
          </dd>
        </div>
      </dl>
    </div>

    <!-- Kontakt -->
    <p class="mt-6 text-sm leading-relaxed text-sage-600">
      Bei Fragen erreichen Sie uns jederzeit unter
      <a class="font-medium text-sage-800 hover:underline" :href="`mailto:${contact.email}`">
        {{ contact.email }}
      </a>
      oder telefonisch unter
      <a class="font-medium text-sage-800 hover:underline" :href="`tel:${contact.phone}`">
        {{ contact.phoneDisplay }}
      </a>
      .
    </p>

    <p class="mt-6 font-serif text-base text-sage-800">
      Wir freuen uns auf Ihren Besuch!<br />
      <span class="font-semibold">Simone &amp; Ralf Volgenandt</span>
    </p>

    <!-- Zurück -->
    <NuxtLink
      to="/"
      class="mt-8 inline-flex items-center gap-2 text-sm text-sage-500 hover:text-sage-800"
    >
      <Icon name="ph:arrow-left" class="size-4" />
      Zurück zur Startseite
    </NuxtLink>
  </div>
</template>
