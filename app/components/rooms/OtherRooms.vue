<script setup lang="ts">
interface Room {
  name: string
  slug: string
  shortDescription: string
  heroImage: string
  heroImageAlt: string
  startingPrice: number
  maxGuests: number
  highlights: string[]
}

interface Props {
  rooms: Room[]
}

defineProps<Props>()
</script>

<template>
  <div v-if="rooms.length > 0" class="room-other-rooms">
    <h2 class="mb-6 font-serif text-2xl font-semibold text-sage-800">Weitere Zimmer</h2>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <RoomsCard
        v-for="room in rooms"
        :key="room.slug"
        :name="room.name"
        :slug="room.slug"
        :short-description="room.shortDescription"
        :hero-image="room.heroImage"
        :hero-image-alt="room.heroImageAlt"
        :starting-price="room.startingPrice"
        :max-guests="room.maxGuests"
        :highlights="room.highlights"
        :compact="true"
      />
    </div>
  </div>
</template>
