<script setup lang="ts">
const config = useAppConfig()
</script>

<template>
  <section class="py-20 md:py-24">
    <div class="mx-auto max-w-6xl px-6">
      <h2 class="font-serif text-3xl font-bold text-sage-900 md:text-4xl">So finden Sie uns</h2>

      <div class="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        <!-- Map image column -->
        <div>
          <a
            href="https://www.openstreetmap.org/?mlat=51.4124&mlon=10.3220#map=14/51.4124/10.3220"
            target="_blank"
            rel="noopener noreferrer"
            class="group block overflow-hidden rounded-lg"
          >
            <NuxtImg
              src="/img/map/pension-location.png"
              alt="Karte mit Standort der Pension Volgenandt in Breitenbach, Eichsfeld"
              class="w-full transition-transform duration-300 group-hover:scale-[1.02]"
              width="600"
              height="400"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </a>
          <span class="mt-2 block text-sm text-sage-600">
            Klicken f&uuml;r interaktive Karte auf OpenStreetMap
          </span>
        </div>

        <!-- Address + contact column -->
        <div class="flex flex-col justify-center">
          <address class="text-lg text-sage-800 not-italic">
            <p class="font-semibold">{{ config.siteName }}</p>
            <p class="mt-1">{{ config.contact.address.street }}</p>
            <p>{{ config.contact.address.city }}</p>
          </address>

          <div class="mt-6 space-y-3">
            <!-- Phone -->
            <a
              :href="`tel:${config.contact.phone}`"
              class="flex items-center gap-3 text-sage-600 transition-colors hover:text-sage-700 hover:underline"
            >
              <Icon name="lucide:phone" class="size-5 shrink-0" />
              <span>{{ config.contact.phoneDisplay }}</span>
            </a>
            <!-- Email -->
            <a
              :href="`mailto:${config.contact.email}`"
              class="flex items-center gap-3 text-sage-600 transition-colors hover:text-sage-700 hover:underline"
            >
              <Icon name="lucide:mail" class="size-5 shrink-0" />
              <span>{{ config.contact.email }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
