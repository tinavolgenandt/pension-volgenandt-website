<script setup lang="ts">
defineProps<{
  attractions: Array<{
    name: string
    slug: string
    coordinates: { lat: number; lng: number }
    distanceKm: number
    shortDescription: string
  }>
}>()

// Pension coordinates (center of map)
const pensionCoords = [51.4124, 10.322] as [number, number]
</script>

<template>
  <LMap
    :zoom="10"
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

    <!-- Pension marker -->
    <LMarker :lat-lng="pensionCoords">
      <LPopup>
        <strong>Pension Volgenandt</strong><br />
        Otto-Reuter-Straße 28<br />
        37327 Breitenbach
      </LPopup>
    </LMarker>

    <!-- Attraction markers -->
    <LMarker
      v-for="attraction in attractions"
      :key="attraction.slug"
      :lat-lng="[attraction.coordinates.lat, attraction.coordinates.lng]"
    >
      <LPopup>
        <strong>{{ attraction.name }}</strong
        ><br />
        {{ attraction.distanceKm }} km von der Pension<br />
        <NuxtLink :to="`/ausflugsziele/${attraction.slug}/`"> Mehr erfahren </NuxtLink>
      </LPopup>
    </LMarker>
  </LMap>
</template>
