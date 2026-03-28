<script setup lang="ts">
import type { Locale } from '~/composables/useLocale'
import { t } from '~/utils/translations'

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
  locale?: Locale
}

const props = withDefaults(defineProps<Props>(), {
  locale: 'de',
})
</script>

<template>
  <div v-if="rooms.length > 0" class="room-other-rooms">
    <h2 class="mb-6 font-serif text-2xl font-semibold text-sage-800">
      {{ t('room.otherRooms', props.locale) }}
    </h2>

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
        :locale="props.locale"
      />
    </div>
  </div>
</template>
