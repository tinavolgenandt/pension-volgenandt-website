<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: article } = await useAsyncData(`news-${slug}`, () =>
  queryCollection('news').where('slug', '=', slug).first(),
)

if (!article.value) {
  throw createError({ statusCode: 404, message: 'Artikel nicht gefunden' })
}

useSeoMeta({
  title: article.value.seoTitle,
  ogTitle: article.value.seoTitle,
  description: article.value.seoDescription,
  ogDescription: article.value.seoDescription,
  ogImage: `https://www.pension-volgenandt.de${article.value.heroImage}`,
  ogType: 'article',
})

useHead({
  titleTemplate: '%s',
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
  ],
})

definePageMeta({
  breadcrumb: { label: 'Artikel' },
})

const categoryBadge: Record<string, { label: string; class: string }> = {
  veranstaltung: { label: 'Veranstaltung', class: 'bg-waldhonig-500 text-white' },
  region: { label: 'Region', class: 'bg-sage-500 text-white' },
  pension: { label: 'Pension', class: 'bg-charcoal-600 text-white' },
}

const contentParagraphs = computed(() => {
  if (!article.value?.content) return []
  return article.value.content.split(/\n\n+/).filter((p) => p.trim())
})

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <div v-if="article">
    <ContentPageBanner
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

      <!-- External links -->
      <section v-if="article.externalLinks?.length" class="mb-10">
        <h2 class="mb-4 font-serif text-xl font-semibold text-sage-900">Weiterführende Links</h2>
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

    <ContentSoftCta text="Haben Sie Fragen zu dieser Veranstaltung? Wir beraten Sie gerne." />
    <ContentBookingCta text="Übernachten Sie bei uns im Eichsfeld" />
  </div>
</template>
