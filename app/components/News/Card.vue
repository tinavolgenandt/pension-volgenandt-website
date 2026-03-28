<script setup lang="ts">
import { t } from '~/utils/translations'

const props = defineProps<{
  title: string
  slug: string
  heroImage: string
  heroImageAlt: string
  publishedDate: string
  category: 'veranstaltung' | 'region' | 'pension'
  excerpt: string
}>()

const { locale } = useLocale()
const { onImgError } = useImageFallback()

const categoryBadge = computed(() => ({
  veranstaltung: {
    label: t('news.category.veranstaltung', locale.value),
    class: 'bg-waldhonig-500 text-white',
  },
  region: {
    label: t('news.category.region', locale.value),
    class: 'bg-sage-700 text-white',
  },
  pension: {
    label: t('news.category.pension', locale.value),
    class: 'bg-charcoal-600 text-white',
  },
}))

const cardLink = computed(() =>
  locale.value === 'en' ? `/en/news/${props.slug}/` : `/aktuelles/${props.slug}/`,
)

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
  <NuxtLink
    :to="cardLink"
    class="group overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
  >
    <!-- Image with category badge -->
    <div class="relative aspect-video overflow-hidden bg-sage-100">
      <NuxtImg
        :src="heroImage"
        :alt="heroImageAlt"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        sizes="100vw sm:50vw lg:33vw"
        @error="onImgError"
      />
      <span
        :class="categoryBadge[category]?.class"
        class="absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold"
      >
        {{ categoryBadge[category]?.label }}
      </span>
    </div>

    <!-- Card body -->
    <div class="p-5">
      <time :datetime="publishedDate" class="text-xs text-sage-500">
        {{ formatDate(publishedDate) }}
      </time>
      <h3 class="mt-1 font-serif text-lg font-semibold text-sage-900">
        {{ title }}
      </h3>
      <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-sage-700">
        {{ excerpt }}
      </p>
      <span class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-waldhonig-600">
        {{ t('cta.readMore', locale) }}
        <Icon name="ph:arrow-right" class="size-4" />
      </span>
    </div>
  </NuxtLink>
</template>
