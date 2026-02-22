<script setup lang="ts">
defineProps<{
  placeholderImage: string
  placeholderAlt: string
  height?: string
}>()

const mapConsented = ref(false)
const { isAllowed } = useCookieConsent()

// Start with placeholder on SSG, check consent only on client
const isClient = import.meta.client
const shouldShowMap = computed(() => mapConsented.value || (isClient && isAllowed('media')))

function loadMap() {
  mapConsented.value = true
}
</script>

<template>
  <div :class="height ?? 'h-[350px] md:h-[450px]'" class="relative overflow-hidden rounded-lg">
    <!-- Placeholder (shown until consent) -->
    <div v-if="!shouldShowMap" class="relative h-full">
      <NuxtImg
        :src="placeholderImage"
        :alt="placeholderAlt"
        class="h-full w-full object-cover"
        loading="lazy"
      />
      <div class="absolute inset-0 flex flex-col items-center justify-center bg-black/50 px-4">
        <Icon name="ph:map-pin-duotone" class="mb-3 size-12 text-white" />
        <p class="mb-4 max-w-md text-center text-white">
          Zum Laden der interaktiven Karte wird eine Verbindung zu OpenStreetMap-Servern
          hergestellt.
        </p>
        <button
          class="rounded-lg bg-waldhonig-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-waldhonig-600"
          @click="loadMap"
        >
          Karte laden
        </button>
        <a
          href="https://www.openstreetmap.org/?mlat=51.4124&mlon=10.3220#map=13/51.4124/10.3220"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-2 text-sm text-white/80 underline"
        >
          Auf OpenStreetMap ansehen
        </a>
      </div>
    </div>

    <!-- Interactive Leaflet map (loaded after consent) -->
    <ClientOnly v-if="shouldShowMap">
      <slot />
    </ClientOnly>
  </div>
</template>
