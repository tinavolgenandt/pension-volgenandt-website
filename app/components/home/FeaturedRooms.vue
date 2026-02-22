<script setup lang="ts">
const { data: rooms } = await useAsyncData('featured-rooms', () =>
  queryCollection('rooms').where('featured', '=', true).order('sortOrder', 'ASC').limit(3).all(),
)
</script>

<template>
  <section class="py-14 md:py-24">
    <div class="mx-auto max-w-6xl px-6">
      <h2 class="font-serif text-3xl font-bold text-sage-900 md:text-4xl">Unsere Zimmer</h2>

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
          />
        </UiScrollReveal>
      </div>

      <div class="mt-10 text-center">
        <NuxtLink
          to="/zimmer/"
          class="inline-flex items-center gap-1 font-sans text-lg font-medium text-sage-600 transition-colors hover:text-sage-700 hover:underline"
        >
          Alle Zimmer ansehen &rarr;
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
