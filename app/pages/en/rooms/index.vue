<script setup lang="ts">
import { t } from '~/utils/translations'

const siteUrl = 'https://www.pension-volgenandt.de'

useHead({
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'canonical', href: `${siteUrl}/en/rooms/` },
    { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/en/rooms/` },
    { rel: 'alternate', hreflang: 'de', href: `${siteUrl}/zimmer/` },
    { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}/zimmer/` },
  ],
})

useSeoMeta({
  title: 'Rooms & Apartments',
  ogTitle: 'Rooms & Apartments | Pension Volgenandt',
  description:
    'Discover our 6 cosy rooms and holiday apartments in Breitenbach, Eichsfeld. From 50 EUR per night incl. VAT.',
  ogDescription:
    'Discover our 6 cosy rooms and holiday apartments in Breitenbach, Eichsfeld. From 50 EUR per night incl. VAT.',
  ogImage: '/img/rooms/emils-kuhwiese/hero.webp',
  ogType: 'website',
})

const { data: rooms } = await useAsyncData('rooms-en', () =>
  queryCollection('roomsEn').order('sortOrder', 'ASC').all(),
)

// Group rooms by category, preserving insertion order (Ferienwohnungen first via sortOrder)
const groupedRooms = computed(() => {
  const groups = new Map<string, typeof rooms.value>()
  if (!rooms.value) return groups
  for (const room of rooms.value) {
    const category = room.category
    if (!groups.has(category)) {
      groups.set(category, [])
    }
    groups.get(category)!.push(room)
  }
  return groups
})
</script>

<template>
  <div class="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
    <!-- Page heading -->
    <div class="mb-10">
      <h1 class="font-serif text-3xl font-bold text-sage-800 sm:text-4xl">{{ t('rooms.title', 'en') }}</h1>
      <p class="mt-3 max-w-2xl text-lg text-sage-600">
        {{ t('rooms.subtitle', 'en') }}
      </p>
      <p class="mt-2 text-sm text-sage-700">
        {{ t('rooms.chooseRoom', 'en') }}
      </p>
    </div>

    <!-- Room groups by category -->
    <div v-if="rooms && rooms.length > 0" class="space-y-12">
      <section v-for="[category, categoryRooms] in groupedRooms" :key="category">
        <h2 class="mb-6 font-serif text-2xl font-semibold text-sage-700">
          {{ t(`room.category.${category}`, 'en') }}
        </h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          <RoomsCard
            v-for="room in categoryRooms"
            :key="room.slug"
            :name="room.name"
            :slug="room.slug"
            :short-description="room.shortDescription"
            :hero-image="room.heroImage"
            :hero-image-alt="room.heroImageAlt"
            :starting-price="room.startingPrice"
            :max-guests="room.maxGuests"
            :highlights="room.highlights"
            :beds24-property-id="room.beds24PropertyId"
            :beds24-room-id="room.beds24RoomId"
            locale="en"
          />
        </div>
      </section>
    </div>

    <!-- Loading/empty state -->
    <div v-else class="py-12 text-center text-sage-700">
      <p>{{ t('room.loading', 'en') }}</p>
    </div>
  </div>
</template>
