<script setup lang="ts">
definePageMeta({
  breadcrumb: { label: 'Korb buchen' },
})

useSeoMeta({
  title: 'Picknick-Korb buchen – Pension Volgenandt',
  description:
    'Picknick-Korb buchen: Datum, Paket und Personen auswählen und direkt per PayPal bezahlen.',
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

    <h1 class="font-serif text-3xl font-bold text-sage-900">Korb buchen</h1>
    <p class="mt-2 text-sage-600">
      Füllen Sie das Formular aus und bezahlen Sie direkt per PayPal.
    </p>

    <!-- Pfand-Hinweis -->
    <div class="mt-6 flex gap-3 rounded-lg bg-sage-50 p-4 text-sm text-sage-700">
      <Icon name="ph:info-duotone" class="mt-0.5 size-5 shrink-0 text-sage-500" />
      <div>
        <strong class="font-medium text-sage-900">Hinweis zum Korbpfand:</strong>
        Bei Abholung hinterlegen Sie 100 € in bar als Korbpfand. Bei Rückgabe des Korbes
        sowie des vollständigen Inhalts erhalten Sie das Pfand sofort zurück.
      </div>
    </div>

    <div class="mt-8">
      <PicknickBookingForm />
    </div>
  </div>
</template>
