<script setup lang="ts">
import { t } from '~/utils/translations'
import { useJsonLd } from '~/composables/useJsonLd'
import type { GalleryImage } from '~/composables/useGallery'

const route = useRoute()
const slug = route.params.slug as string

const { data: article } = await useAsyncData(`news-en-${slug}`, () =>
  queryCollection('newsEn').where('slug', '=', slug).first(),
)

if (!article.value) {
  throw createError({ statusCode: 404, message: 'Article not found' })
}

// Normalize optional collection fields (default([]) still types as possibly undefined)
const galleryPhotos = article.value.gallery ?? []
const factsList = article.value.facts ?? []
const faqItems = article.value.faq ?? []

// Photos with a float + afterParagraph anchor are woven into the article
// text; the rest fall back to a plain grid below the text.
const positionedPhotos = galleryPhotos.filter((p) => p.float && p.afterParagraph !== undefined)
const gridPhotos = galleryPhotos.filter((p) => !(p.float && p.afterParagraph !== undefined))

const { onImgError } = useImageFallback()
const inlineImages = ref<GalleryImage[]>([
  { src: article.value.heroImage, alt: article.value.heroImageAlt },
  ...positionedPhotos.map((photo) => ({ src: photo.image, alt: photo.alt })),
])
const {
  currentIndex,
  isLightboxOpen,
  hasNext,
  hasPrev,
  goTo,
  next,
  prev,
  openLightbox,
  closeLightbox,
} = useGallery(inlineImages)

function inlinePhotoIndex(image: string) {
  return inlineImages.value.findIndex((img) => img.src === image)
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
const heroImageSchema = article.value.heroImageAiGenerated
  ? {
      '@type': 'ImageObject',
      '@id': `https://www.pension-volgenandt.de${article.value.heroImage}#image`,
      url: `https://www.pension-volgenandt.de${article.value.heroImage}`,
      contentUrl: `https://www.pension-volgenandt.de${article.value.heroImage}`,
      caption: article.value.heroImageAlt,
      creditText: article.value.heroImageCredit || 'AI-generated visualisation',
      digitalSourceType: 'https://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia',
      creator: {
        '@type': 'Organization',
        name: 'Pension Volgenandt',
      },
    }
  : `https://www.pension-volgenandt.de${article.value.heroImage}`

const schemaItems: Record<string, unknown>[] = [
  {
    '@type': 'NewsArticle',
    '@id': `https://www.pension-volgenandt.de/en/news/${article.value.slug}/#article`,
    headline: article.value.seoTitle,
    url: `https://www.pension-volgenandt.de/en/news/${article.value.slug}/`,
    mainEntityOfPage: `https://www.pension-volgenandt.de/en/news/${article.value.slug}/`,
    description: article.value.seoDescription,
    image: [
      heroImageSchema,
      ...galleryPhotos.map((photo) => `https://www.pension-volgenandt.de${photo.image}`),
    ],
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

if (article.value.heroImageAiGenerated && typeof heroImageSchema === 'object') {
  schemaItems.push(heroImageSchema)
}

// FAQ structured data, when the article defines FAQ entries
if (faqItems.length) {
  schemaItems.push({
    '@type': 'FAQPage',
    '@id': `https://www.pension-volgenandt.de/en/news/${article.value.slug}/#faq`,
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  })
}

// Add Event schema when event dates are present
if (article.value.eventStartDate && article.value.eventEndDate) {
  schemaItems.push({
    '@type': 'Event',
    '@id': `https://www.pension-volgenandt.de/en/news/${article.value.slug}/#event`,
    name: article.value.title,
    url: `https://www.pension-volgenandt.de/en/news/${article.value.slug}/`,
    description: article.value.seoDescription,
    image: [`https://www.pension-volgenandt.de${article.value.heroImage}`],
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
    performer: {
      '@type': 'Organization',
      name: 'Landesgartenschau Leinefelde-Worbis 2026 gGmbH',
    },
    offers: {
      '@type': 'Offer',
      name: 'Day ticket',
      url: 'https://www.lgs-leinefelde-worbis.de/besuch/tickets-kaufen/',
      price: '22',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      validFrom: '2025-10-06',
    },
  })
}

useJsonLd(schemaItems, `news-schema-en-${slug}`)

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
  // YAML folded block scalars (`>-`) collapse a blank line between
  // paragraphs into a single \n, never \n\n, so that's the real separator.
  return article.value.content.split(/\n+/).filter((p) => p.trim())
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
      :image-credit="article.heroImageCredit"
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

      <!-- Intro + content, with positioned photos floated alongside the text -->
      <div class="prose prose-lg mb-10 max-w-none">
        <p class="lead">{{ article.intro }}</p>

        <template v-for="(paragraph, index) in contentParagraphs" :key="index">
          <button
            v-for="photo in positionedPhotos.filter((p) => p.afterParagraph === index)"
            :key="photo.image"
            type="button"
            class="group not-prose relative mb-4 block w-full overflow-hidden rounded-xl focus-visible:ring-2 focus-visible:ring-waldhonig-500 focus-visible:ring-offset-2 sm:clear-none sm:w-60"
            :class="photo.float === 'right' ? 'sm:float-right sm:ml-6' : 'sm:float-left sm:mr-6'"
            :aria-label="`Enlarge photo: ${photo.alt}`"
            @click="openLightbox(inlinePhotoIndex(photo.image))"
          >
            <div class="aspect-[4/3] bg-sage-100">
              <NuxtImg
                :src="photo.image"
                :alt="photo.alt"
                loading="lazy"
                width="480"
                height="360"
                sizes="(min-width: 640px) 240px, 100vw"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                @error="onImgError"
              />
            </div>
            <span
              class="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10"
              aria-hidden="true"
            />
          </button>
          <p>{{ paragraph }}</p>
        </template>

        <div class="clear-both" />
      </div>

      <!-- Fallback photo grid, for gallery photos without an inline position -->
      <section v-if="gridPhotos.length" class="mb-10">
        <NewsGallery
          :hero-image="article.heroImage"
          :hero-image-alt="article.heroImageAlt"
          :gallery="gridPhotos.map((photo) => ({ src: photo.image, alt: photo.alt }))"
        />
      </section>

      <!-- Lightbox for the inline-positioned photos -->
      <ClientOnly>
        <RoomsLightbox
          :images="inlineImages"
          :current-index="currentIndex"
          :is-open="isLightboxOpen"
          :has-next="hasNext"
          :has-prev="hasPrev"
          @close="closeLightbox"
          @navigate="goTo"
          @next="next"
          @prev="prev"
        />
      </ClientOnly>

      <!-- Good-to-know facts callout -->
      <section v-if="factsList.length" class="mb-10">
        <h2 class="mb-4 font-serif text-xl font-semibold text-sage-900">
          {{ t('news.goodToKnow', 'en') }}
        </h2>
        <div class="rounded-lg border border-sage-200 bg-sage-50 p-6">
          <ul class="space-y-3">
            <li v-for="(fact, index) in factsList" :key="index" class="flex items-start gap-3">
              <Icon name="ph:leaf" class="mt-0.5 size-5 shrink-0 text-sage-600" />
              <span class="leading-relaxed text-sage-700">{{ fact }}</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- FAQ -->
      <section v-if="faqItems.length" class="mb-10">
        <h2 class="mb-4 font-serif text-xl font-semibold text-sage-900">
          {{ t('news.faq', 'en') }}
        </h2>
        <div class="space-y-4">
          <div v-for="(item, index) in faqItems" :key="index">
            <h3 class="mb-1 font-semibold text-sage-900">{{ item.question }}</h3>
            <p class="leading-relaxed text-sage-700">{{ item.answer }}</p>
          </div>
        </div>
      </section>

      <!-- Room cards (for event articles with showRooms) -->
      <section v-if="article.showRooms && rooms?.length" class="mb-10">
        <h2 class="mb-6 font-serif text-xl font-semibold text-sage-900">
          {{ t('lgs.ourRoomsHeading', 'en') }}
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
            locale="en"
            compact
          />
        </div>
        <div class="mt-6 text-center">
          <NuxtLink
            to="/en/rooms/"
            class="inline-block rounded-lg bg-waldhonig-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-waldhonig-600"
          >
            {{ t('lgs.bookNow', 'en') }}
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

    <SharedSoftCta :text="t('news.articleQuestion', 'en')" />
    <SharedBookingCta :text="t('news.stayWithUs', 'en')" />
  </div>
</template>
