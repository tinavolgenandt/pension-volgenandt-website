<script setup lang="ts">
definePageMeta({
  breadcrumb: { label: 'Aktuelles' },
})

useSeoMeta({
  title: 'Aktuelles aus dem Eichsfeld',
  ogTitle: 'Aktuelles aus dem Eichsfeld | Pension Volgenandt',
  description:
    'Neuigkeiten, Veranstaltungen und Tipps rund um die Pension Volgenandt und das Eichsfeld.',
  ogDescription:
    'Neuigkeiten, Veranstaltungen und Tipps rund um die Pension Volgenandt und das Eichsfeld.',
  ogImage: '/img/content/garten-bluehwiese-fruehsommer.webp',
  ogType: 'website',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://www.pension-volgenandt.de/aktuelles/' },
    { rel: 'alternate', hreflang: 'de', href: 'https://www.pension-volgenandt.de/aktuelles/' },
  ],
})

const { data: articles } = await useAsyncData('news', () =>
  queryCollection('news').order('sortOrder', 'ASC').all(),
)
</script>

<template>
  <div>
    <SharedPageBanner
      image="/img/garten/einfahrt-sommer.webp"
      image-alt="Pension Volgenandt – Einfahrt mit Gartenblick im Sommer"
      title="Aktuelles"
      subtitle="Neuigkeiten aus der Region"
    />

    <section class="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p class="text-lg leading-relaxed text-sage-800">
        Was gibt es Neues im Eichsfeld? Hier finden Sie aktuelle Veranstaltungen, regionale
        Neuigkeiten und Tipps für Ihren Aufenthalt bei uns.
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

    <SharedBookingCta
      text="Planen Sie Ihren Aufenthalt im Eichsfeld"
      button-text="Zimmer ansehen"
    />
  </div>
</template>
