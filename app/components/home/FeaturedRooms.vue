<script setup lang="ts">
import { t } from '~/utils/translations'

const { locale } = useLocale()

const collection = computed(() => (locale.value === 'en' ? 'roomsEn' : 'rooms'))

const { data: rooms } = await useAsyncData(
  `featured-rooms-${locale.value}`,
  () =>
    queryCollection(collection.value as 'rooms' | 'roomsEn')
      .where('featured', '=', true)
      .order('sortOrder', 'ASC')
      .limit(3)
      .all(),
  { watch: [locale] },
)

const roomsLink = computed(() => (locale.value === 'en' ? '/en/rooms/' : '/zimmer/'))
</script>

<template>
  <section class="py-14 md:py-24">
    <div class="mx-auto max-w-6xl px-6">
      <h2 class="font-serif text-3xl font-bold text-sage-900 md:text-4xl">
        {{ t('home.ourRooms', locale) }}
      </h2>

      <div v-if="rooms?.length" class="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
        <UiScrollReveal v-for="(room, index) in rooms" :key="room.slug" :delay="index * 150">
          <RoomsCard
            :name="room.name"
            :slug="room.slug"
            :short-description="room.shortDescription"
            :hero-image="room.heroImage"
            :hero-image-alt="room.heroImageAlt"
            :starting-price="room.startingPrice"
            :max-guests="room.maxGuests"
            :highlights="room.highlights"
            :locale="locale"
          />
        </UiScrollReveal>
      </div>

      <div class="mt-10 text-center">
        <NuxtLink
          :to="roomsLink"
          class="inline-flex items-center gap-1 font-sans text-lg font-medium text-sage-600 transition-colors hover:text-sage-700 hover:underline"
        >
          {{ t('cta.allRooms', locale) }} &rarr;
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
