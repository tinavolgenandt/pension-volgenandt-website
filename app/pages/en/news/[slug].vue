<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: article } = await useAsyncData(`news-en-${slug}`, () =>
  queryCollection('newsEn').where('slug', '=', slug).first(),
)

if (!article.value) {
  throw createError({ statusCode: 404, message: 'Article not found' })
}

// Optional: load rooms for event articles with showRooms flag
const { data: rooms } = await useAsyncData(
  `news-en-rooms-${slug}`,
  () => queryCollection('roomsEn').order('sortOrder', 'ASC').all(),
  { immediate: article.value.showRooms },
)

useSeoMeta({
  title: article.value.seoTitle,
  ogTitle: article.value.seoTitle,
  description: article.value.seoDescription,
  ogDescription: article.value.seoDescription,
  ogImage: `https://www.pension-volgenandt.de${article.value.heroImage}`,
  ogType: 'article',
})

useHead({
  htmlAttrs: { lang: 'en' },
  titleTemplate: '%s | Pension Volgenandt',
  link: [
    {
      rel: 'canonical',
      href: `https://www.pension-volgenandt.de/en/news/${article.value.slug}/`,
    },
    {
      rel: 'alternate',
      hreflang: 'de',
      href: `https://www.pension-volgenandt.de/aktuelles/${article.value.slug}/`,
    },
    {
      rel: 'alternate',
      hreflang: 'en',
      href: `https://www.pension-volgenandt.de/en/news/${article.value.slug}/`,
    },
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: `https://www.pension-volgenandt.de/aktuelles/${article.value.slug}/`,
    },
  ],
})

// Article structured data
const schemaItems: Record<string, unknown>[] = [
  {
    '@type': 'NewsArticle',
    headline: article.value.seoTitle,
    description: article.value.seoDescription,
    image: `https://www.pension-volgenandt.de${article.value.heroImage}`,
    datePublished: article.value.publishedDate,
    author: {
      '@type': 'Organization',
      name: 'Pension Volgenandt',
    },
  },
]

// Add Event schema when event dates are present
if (article.value.eventStartDate && article.value.eventEndDate) {
  schemaItems.push({
    '@type': 'Event',
    name: article.value.title,
    startDate: article.value.eventStartDate,
    endDate: article.value.eventEndDate,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: 'State Garden Show Leinefelde-Worbis',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Leinefelde-Worbis',
        addressRegion: 'Thuringia',
        addressCountry: 'DE',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Landesgartenschau Leinefelde-Worbis 2026 gGmbH',
      url: 'https://www.lgs-leinefelde-worbis.de/',
    },
    offers: {
      '@type': 'Offer',
      name: 'Accommodation for the State Garden Show 2026',
      url: `https://www.pension-volgenandt.de/en/news/${article.value.slug}/`,
      priceCurrency: 'EUR',
      price: '50',
      availability: 'https://schema.org/InStock',
    },
  })
}

useSchemaOrg(schemaItems)

definePageMeta({
  breadcrumb: { label: 'Article' },
})

const categoryBadge: Record<string, { label: string; class: string }> = {
  veranstaltung: { label: 'Event', class: 'bg-waldhonig-500 text-white' },
  region: { label: 'Region', class: 'bg-sage-700 text-white' },
  pension: { label: 'Guesthouse', class: 'bg-charcoal-600 text-white' },
}

const contentParagraphs = computed(() => {
  if (!article.value?.content) return []
  return article.value.content.split(/\n\n+/).filter((p) => p.trim())
})

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <div v-if="article">
    <SharedPageBanner
      :image="article.heroImage"
      :image-alt="article.heroImageAlt"
      :title="article.title"
    />

    <div class="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <!-- Date + category badge -->
      <div class="mb-8 flex items-center gap-3">
        <time :datetime="article.publishedDate" class="text-sm text-sage-500">
          {{ formatDate(article.publishedDate) }}
        </time>
        <span
          :class="categoryBadge[article.category]?.class"
          class="rounded-full px-3 py-1 text-xs font-semibold"
        >
          {{ categoryBadge[article.category]?.label }}
        </span>
      </div>

      <!-- Intro -->
      <section class="mb-10">
        <p class="text-lg leading-relaxed text-sage-800">
          {{ article.intro }}
        </p>
      </section>

      <!-- Content paragraphs -->
      <section class="mb-10 space-y-4">
        <p
          v-for="(paragraph, index) in contentParagraphs"
          :key="index"
          class="leading-relaxed text-sage-700"
        >
          {{ paragraph }}
        </p>
      </section>

      <!-- Room cards (for event articles with showRooms) -->
      <section v-if="article.showRooms && rooms?.length" class="mb-10">
        <h2 class="mb-6 font-serif text-xl font-semibold text-sage-900">Our rooms for your stay</h2>
        <div class="grid gap-6 sm:grid-cols-2">
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
            :beds24-property-id="room.beds24PropertyId"
            :beds24-room-id="room.beds24RoomId"
            locale="en"
            compact
          />
        </div>
        <div class="mt-6 text-center">
          <NuxtLink
            to="/en/rooms/"
            class="inline-block rounded-lg bg-waldhonig-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-waldhonig-600"
          >
            Book a room now
          </NuxtLink>
        </div>
      </section>

      <!-- External links -->
      <section v-if="article.externalLinks?.length" class="mb-10">
        <h2 class="mb-4 font-serif text-xl font-semibold text-sage-900">Further Links</h2>
        <div class="rounded-lg border border-sage-200 bg-sage-50 p-6">
          <ul class="space-y-3">
            <li
              v-for="link in article.externalLinks"
              :key="link.url"
              class="flex items-start gap-3"
            >
              <Icon name="ph:arrow-square-out" class="mt-0.5 size-5 shrink-0 text-sage-600" />
              <a
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-waldhonig-600 underline hover:text-waldhonig-700"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>
      </section>
    </div>

    <SharedSoftCta text="Have questions about this event? We're happy to help." />
    <SharedBookingCta text="Stay with us in the Eichsfeld" />
  </div>
</template>
