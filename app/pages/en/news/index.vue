<script setup lang="ts">
const siteUrl = 'https://www.pension-volgenandt.de'

definePageMeta({
  breadcrumb: { label: 'News' },
})

useSeoMeta({
  title: 'News from the Eichsfeld',
  ogTitle: 'News from the Eichsfeld | Pension Volgenandt',
  description: 'News, events and tips from Pension Volgenandt and the Eichsfeld region.',
  ogDescription: 'News, events and tips from Pension Volgenandt and the Eichsfeld region.',
  ogImage: '/img/content/garten-bluehwiese-fruehsommer.webp',
  ogType: 'website',
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'canonical', href: `${siteUrl}/en/news/` },
    { rel: 'alternate', hreflang: 'de', href: `${siteUrl}/aktuelles/` },
    { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/en/news/` },
    { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}/aktuelles/` },
  ],
})

const { data: articles } = await useAsyncData('en-news', () =>
  queryCollection('newsEn').order('sortOrder', 'ASC').all(),
)
</script>

<template>
  <div>
    <SharedPageBanner
      image="/img/garten/einfahrt-sommer.webp"
      image-alt="Pension Volgenandt – entrance with garden view in summer"
      title="News"
      subtitle="Updates from the Region"
    />

    <section class="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p class="text-lg leading-relaxed text-sage-800">
        What's new in the Eichsfeld? Here you'll find current events, regional news and tips for
        your stay with us.
      </p>
    </section>

    <section class="px-6 pb-12 md:pb-16">
      <div class="mx-auto max-w-6xl">
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <NewsCard
            v-for="article in articles"
            :key="article.slug"
            :title="article.title"
            :slug="article.slug"
            :hero-image="article.heroImage"
            :hero-image-alt="article.heroImageAlt"
            :published-date="article.publishedDate"
            :category="article.category"
            :excerpt="article.excerpt"
          />
        </div>
      </div>
    </section>

    <SharedBookingCta text="Plan your stay in the Eichsfeld" button-text="View rooms" />
  </div>
</template>
