<script setup lang="ts">
import { t } from '~/utils/translations'

const props = defineProps<{
  name: string
  slug: string
  heroImage: string
  heroImageAlt: string
  distanceKm: number
  drivingMinutes: number
  shortDescription: string
  category: 'natur' | 'kultur' | 'aktivitaet'
}>()

const { locale } = useLocale()
const { onImgError } = useImageFallback()

const attractionLink = computed(() =>
  locale.value === 'de' ? `/ausflugsziele/${props.slug}/` : `/en/attractions/${props.slug}/`,
)

const categoryBadge: Record<string, { label: string; class: string }> = {
  natur: { label: 'Natur', class: 'bg-sage-700 text-white' },
  kultur: { label: 'Kultur', class: 'bg-waldhonig-500 text-white' },
  aktivitaet: { label: 'Aktivität', class: 'bg-charcoal-600 text-white' },
}
</script>

<template>
  <NuxtLink
    :to="attractionLink"
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
      <h3 class="font-serif text-lg font-semibold text-sage-900">
        {{ name }}
      </h3>
      <SharedDistanceBadge
        :distance-km="distanceKm"
        :driving-minutes="drivingMinutes"
        class="mt-2"
      />
      <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-sage-700">
        {{ shortDescription }}
      </p>
      <span class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-waldhonig-600">
        {{ t('cta.learnMore', locale) }}
        <Icon name="ph:arrow-right" class="size-4" />
      </span>
    </div>
  </NuxtLink>
</template>
