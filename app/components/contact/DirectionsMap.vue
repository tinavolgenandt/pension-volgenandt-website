<script setup lang="ts">
// Pension coordinates
const pensionCoords = [51.4124, 10.322] as [number, number]
</script>

<template>
  <AttractionsMapConsent
    placeholder-image="/img/map/kontakt-placeholder.webp"
    placeholder-alt="Karte mit Standort der Pension Volgenandt in Breitenbach"
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
</template>
