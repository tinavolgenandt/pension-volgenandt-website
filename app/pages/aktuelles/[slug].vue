<script setup lang="ts">
import { t } from '~/utils/translations'
import { useJsonLd } from '~/composables/useJsonLd'

const { locale } = useLocale()
const route = useRoute()
const slug = route.params.slug as string

const { data: article } = await useAsyncData(`news-${slug}`, () =>
  queryCollection('news').where('slug', '=', slug).first(),
)

if (!article.value) {
  throw createError({ statusCode: 404, message: t('news.notFound', locale.value) })
}

// Optional: load rooms for event articles with showRooms flag
const { data: rooms } = await useAsyncData(
  `news-rooms-${slug}`,
  () => queryCollection('rooms').order('sortOrder', 'ASC').all(),
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
  titleTemplate: '%s | Pension Volgenandt',
  link: [
    {
      rel: 'canonical',
      href: `https://www.pension-volgenandt.de/aktuelles/${article.value.slug}/`,
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
    '@id': `https://www.pension-volgenandt.de/aktuelles/${article.value.slug}/#article`,
    headline: article.value.seoTitle,
    url: `https://www.pension-volgenandt.de/aktuelles/${article.value.slug}/`,
    mainEntityOfPage: `https://www.pension-volgenandt.de/aktuelles/${article.value.slug}/`,
    description: article.value.seoDescription,
    image: [`https://www.pension-volgenandt.de${article.value.heroImage}`],
    datePublished: article.value.publishedDate,
    author: {
      '@type': 'Organization',
      name: 'Pension Volgenandt',
    },
    publisher: {
      '@id': 'https://www.pension-volgenandt.de/#identity',
    },
  },
]

// Add Event schema when event dates are present
if (article.value.eventStartDate && article.value.eventEndDate) {
  schemaItems.push({
    '@type': 'Event',
    '@id': `https://www.pension-volgenandt.de/aktuelles/${article.value.slug}/#event`,
    name: article.value.title,
    url: `https://www.pension-volgenandt.de/aktuelles/${article.value.slug}/`,
    description: article.value.seoDescription,
    image: [`https://www.pension-volgenandt.de${article.value.heroImage}`],
    startDate: article.value.eventStartDate,
    endDate: article.value.eventEndDate,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: 'Landesgartenschau Leinefelde-Worbis',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Leinefelde-Worbis',
        addressRegion: 'Thüringen',
        addressCountry: 'DE',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Landesgartenschau Leinefelde-Worbis 2026 gGmbH',
      url: 'https://www.lgs-leinefelde-worbis.de/',
    },
    performer: {
      '@type': 'Organization',
      name: 'Landesgartenschau Leinefelde-Worbis 2026 gGmbH',
    },
    offers: {
      '@type': 'Offer',
      name: 'Tageskarte',
      url: 'https://www.lgs-leinefelde-worbis.de/besuch/tickets-kaufen/',
      price: '22',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      validFrom: '2025-10-06',
    },
  })
}

useJsonLd(schemaItems, `news-schema-de-${slug}`)

definePageMeta({
  breadcrumb: { label: 'Artikel' },
})

const categoryBadge: Record<string, { label: string; class: string }> = {
  veranstaltung: {
    label: t('news.category.veranstaltung', locale.value),
    class: 'bg-waldhonig-500 text-white',
  },
  region: { label: t('news.category.region', locale.value), class: 'bg-sage-700 text-white' },
  pension: { label: t('news.category.pension', locale.value), class: 'bg-charcoal-600 text-white' },
}

const contentParagraphs = computed(() => {
  if (!article.value?.content) return []
  return article.value.content.split(/\n\n+/).filter((p) => p.trim())
})

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString(locale.value === 'en' ? 'en-GB' : 'de-DE', {
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
        <h2 class="mb-6 font-serif text-xl font-semibold text-sage-900">
          {{ t('lgs.ourRoomsHeading', locale) }}
        </h2>
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
            :locale="locale"
            compact
          />
        </div>
        <div class="mt-6 text-center">
          <NuxtLink
            :to="locale === 'en' ? '/en/rooms/' : '/zimmer/'"
            class="inline-block rounded-lg bg-waldhonig-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-waldhonig-600"
          >
            {{ t('lgs.bookNow', locale) }}
          </NuxtLink>
        </div>
      </section>

      <!-- External links -->
      <section v-if="article.externalLinks?.length" class="mb-10">
        <h2 class="mb-4 font-serif text-xl font-semibold text-sage-900">
          {{ t('news.furtherLinks', locale) }}
        </h2>
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

    <SharedSoftCta :text="t('news.eventQuestion', locale)" />
    <SharedBookingCta :text="t('news.stayWithUs', locale)" />
  </div>
</template>
