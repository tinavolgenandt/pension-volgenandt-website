<script setup lang="ts">
const config = useAppConfig()

// Pension coordinates
const pensionCoords = [51.4124, 10.322] as [number, number]
</script>

<template>
  <section class="py-20 md:py-24">
    <div class="mx-auto max-w-6xl px-6">
      <h2 class="font-serif text-3xl font-bold text-sage-900 md:text-4xl">So finden Sie uns</h2>

      <div class="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        <!-- Interactive map column (consent-gated) -->
        <AttractionsMapConsent
          placeholder-image="/img/map/pension-location.png"
          placeholder-alt="Karte mit Standort der Pension Volgenandt in Breitenbach, Eichsfeld"
        >
          <LMap
            :zoom="13"
            :center="pensionCoords"
            :use-global-leaflet="false"
            style="height: 100%; width: 100%"
          >
            <LTileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
              layer-type="base"
              name="OpenStreetMap"
            />
            <LMarker :lat-lng="pensionCoords">
              <LPopup>
                <strong>Pension Volgenandt</strong><br />
                Otto-Reuter-Straße 28<br />
                37327 Breitenbach
              </LPopup>
            </LMarker>
          </LMap>
        </AttractionsMapConsent>

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
