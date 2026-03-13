<script setup lang="ts">
definePageMeta({
  breadcrumb: { label: 'Korb anfragen' },
})

useSeoMeta({
  title: 'Picknick-Korb anfragen – Pension Volgenandt',
  description:
    'Jetzt Ihren Picknick-Korb anfragen: Datum, Paket und Personen auswählen – wir melden uns innerhalb von 24 Stunden.',
  robots: 'noindex',
})
</script>

<template>
  <div class="mx-auto max-w-2xl px-6 py-12 md:py-16">
    <!-- Zurück -->
    <NuxtLink
      to="/picknick/"
      class="mb-8 inline-flex items-center gap-2 text-sm text-sage-500 hover:text-sage-800"
    >
      <Icon name="ph:arrow-left" class="size-4" />
      Zurück zum Picknick-Korb
    </NuxtLink>

    <h1 class="font-serif text-3xl font-bold text-sage-900">Korb anfragen</h1>
    <p class="mt-2 text-sage-600">
      Füllen Sie das Formular aus – wir melden uns innerhalb von 24 Stunden zur Bestätigung.
    </p>

    <!-- Pfand-Hinweis -->
    <div class="mt-6 flex gap-3 rounded-lg bg-sage-50 p-4 text-sm text-sage-700">
      <Icon name="ph:info-duotone" class="mt-0.5 size-5 shrink-0 text-sage-500" />
      <div>
        <strong class="font-medium text-sage-900">Hinweis zum Korbpfand:</strong>
        Für den handgefertigten Weidenkorb erheben wir ein Pfand von 100 €. Dieses wird vollständig
        erstattet, sobald der Korb (inkl. Zubehör) zurückgebracht wird.
      </div>
    </div>

    <div class="mt-8">
      <PicknickBookingForm />
    </div>
  </div>
</template>
