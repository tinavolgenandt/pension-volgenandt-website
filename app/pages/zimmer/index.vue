<script setup lang="ts">
useSeoMeta({
  title: 'Zimmer & Ferienwohnungen',
  ogTitle: 'Zimmer & Ferienwohnungen | Pension Volgenandt',
  description:
    'Entdecken Sie unsere 7 gemütlichen Zimmer und Ferienwohnungen in Breitenbach im Eichsfeld. Ab 38 EUR pro Nacht inkl. MwSt.',
  ogDescription:
    'Entdecken Sie unsere 7 gemütlichen Zimmer und Ferienwohnungen in Breitenbach im Eichsfeld. Ab 38 EUR pro Nacht inkl. MwSt.',
  ogImage: '/img/rooms/emils-kuhwiese/hero.webp',
  ogType: 'website',
})
useHead({
  link: [
    { rel: 'canonical', href: 'https://www.pension-volgenandt.de/zimmer/' },
    { rel: 'alternate', hreflang: 'de', href: 'https://www.pension-volgenandt.de/zimmer/' },
  ],
})

const { data: rooms } = await useAsyncData('rooms', () =>
  queryCollection('rooms').order('sortOrder', 'ASC').all(),
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

// Category heading labels (plural forms for section headings)
const categoryHeadings: Record<string, string> = {
  Ferienwohnung: 'Ferienwohnungen',
  Doppelzimmer: 'Doppelzimmer',
  Einzelzimmer: 'Einzelzimmer',
}
</script>

<template>
  <div class="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
    <!-- Page heading -->
    <div class="mb-10">
      <h1 class="font-serif text-3xl font-bold text-sage-800 sm:text-4xl">Unsere Zimmer</h1>
      <p class="mt-3 max-w-2xl text-lg text-sage-600">
        Ob gemütliche Ferienwohnung für die ganze Familie oder komfortables Doppelzimmer für Paare
        &ndash; bei uns finden Sie den passenden Rückzugsort für Ihren Aufenthalt im Eichsfeld.
      </p>
    </div>

    <!-- Room groups by category -->
    <div v-if="rooms && rooms.length > 0" class="space-y-12">
      <section v-for="[category, categoryRooms] in groupedRooms" :key="category">
        <h2 class="mb-6 font-serif text-2xl font-semibold text-sage-700">
          {{ categoryHeadings[category] || category }}
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
          />
        </div>
      </section>
    </div>

    <!-- Loading/empty state -->
    <div v-else class="py-12 text-center text-sage-500">
      <p>Zimmer werden geladen...</p>
    </div>
  </div>
</template>
