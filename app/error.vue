<script setup lang="ts">
const error = useError()

const is404 = computed(() => error.value?.statusCode === 404)
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-6 text-center">
    <h1 class="font-serif text-7xl font-bold text-sage-300">
      {{ is404 ? '404' : (error?.statusCode ?? 'Fehler') }}
    </h1>
    <h2 class="mt-4 font-serif text-2xl font-semibold text-sage-900">
      {{ is404 ? 'Seite nicht gefunden' : 'Ein Fehler ist aufgetreten' }}
    </h2>
    <p class="mt-2 max-w-md text-sage-700">
      {{
        is404
          ? 'Die gesuchte Seite existiert leider nicht oder wurde verschoben.'
          : 'Es tut uns leid, etwas ist schiefgelaufen. Bitte versuchen Sie es später erneut.'
      }}
    </p>
    <div class="mt-8 flex flex-wrap justify-center gap-4">
      <NuxtLink
        to="/"
        class="rounded-lg bg-waldhonig-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-waldhonig-600"
      >
        Zur Startseite
      </NuxtLink>
      <NuxtLink
        to="/zimmer/"
        class="rounded-lg bg-sage-100 px-6 py-3 font-semibold text-sage-800 transition-colors hover:bg-sage-200"
      >
        Zimmer ansehen
      </NuxtLink>
      <NuxtLink
        to="/kontakt/"
        class="rounded-lg bg-sage-100 px-6 py-3 font-semibold text-sage-800 transition-colors hover:bg-sage-200"
      >
        Kontakt
      </NuxtLink>
    </div>
  </div>
</template>
