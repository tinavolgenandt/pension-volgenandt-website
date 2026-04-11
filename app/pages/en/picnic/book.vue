<script setup lang="ts">
const siteUrl = 'https://www.pension-volgenandt.de'

definePageMeta({
  breadcrumb: { label: 'Request a basket' },
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'canonical', href: `${siteUrl}/en/picnic/book/` },
    { rel: 'alternate', hreflang: 'de', href: `${siteUrl}/picknick/buchen/` },
    { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/en/picnic/book/` },
    { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}/picknick/buchen/` },
  ],
})

useSeoMeta({
  title: 'Request a Picnic Basket – Pension Volgenandt',
  description:
    'Request your picnic basket now: choose your date, package and number of guests – we will get back to you within 24 hours.',
  robots: 'noindex',
})
</script>

<template>
  <div class="mx-auto max-w-2xl px-6 py-12 md:py-16">
    <!-- Back -->
    <NuxtLink
      to="/en/picnic/"
      class="mb-8 inline-flex items-center gap-2 text-sm text-sage-500 hover:text-sage-800"
    >
      <Icon name="ph:arrow-left" class="size-4" />
      Back to Picnic Basket
    </NuxtLink>

    <h1 class="font-serif text-3xl font-bold text-sage-900">Request a basket</h1>
    <p class="mt-2 text-sage-600">
      Fill in the form – we will get back to you within 24 hours to confirm.
    </p>

    <!-- Deposit notice -->
    <div class="mt-6 flex gap-3 rounded-lg bg-sage-50 p-4 text-sm text-sage-700">
      <Icon name="ph:info-duotone" class="mt-0.5 size-5 shrink-0 text-sage-500" />
      <div>
        <strong class="font-medium text-sage-900">Basket deposit notice:</strong>
        A deposit of 100 EUR in cash is required upon pickup. You will receive it back when the
        complete basket contents are returned.
      </div>
    </div>

    <div class="mt-8">
      <PicknickBookingForm />
    </div>
  </div>
</template>
