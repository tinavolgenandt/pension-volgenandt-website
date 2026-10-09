<script setup lang="ts">
import type { Locale } from '~/composables/useLocale'
import { t } from '~/utils/translations'
import { formatLongDate } from '~/utils/dates'

interface Props {
  name: string
  slug: string
  shortDescription: string
  heroImage: string
  heroImageAlt: string
  startingPrice: number
  maxGuests: number
  highlights: string[]
  beds24PropertyId?: number
  beds24RoomId?: number
  compact?: boolean
  locale?: Locale
  comingSoon?: boolean
  availableFrom?: string
}

const props = withDefaults(defineProps<Props>(), {
  beds24PropertyId: undefined,
  beds24RoomId: undefined,
  compact: false,
  locale: 'de',
  comingSoon: false,
  availableFrom: undefined,
})

// Locale-aware room detail path
const roomPath = computed(() => {
  if (props.locale === 'en') return `/en/rooms/${props.slug}/`
  return `/zimmer/${props.slug}/`
})

// "Demnächst · Ab 1. März 2027" badge for rooms that are not bookable yet
const comingSoonLabel = computed(() => {
  if (!props.comingSoon) return null
  const label = t('room.comingSoon', props.locale)
  if (!props.availableFrom) return label
  const from = t('room.availableFrom', props.locale).replace(
    '{date}',
    formatLongDate(props.availableFrom, props.locale),
  )
  return `${label} · ${from}`
})

// Direct booking URL for rooms with Beds24 integration (referer GoogleAds for visitors from an ad, see useAdArrival)
const { beds24Referer } = useAdArrival()
const bookingUrl = computed(() => {
  if (props.comingSoon || !props.beds24PropertyId) return null
  const params = new URLSearchParams({
    propid: String(props.beds24PropertyId),
    lang: props.locale === 'en' ? 'en' : 'de',
    referer: beds24Referer.value,
    numnight: '2',
    numadult: '2',
  })
  if (props.beds24RoomId) {
    params.set('roomid', String(props.beds24RoomId))
  }
  return `https://beds24.com/booking2.php?${params}`
})

const { onImgError } = useImageFallback()

const guestLabel = computed(() => {
  const word =
    props.maxGuests === 1 ? t('room.guest', props.locale) : t('room.guests', props.locale)
  return `${props.maxGuests} ${word}`
})
</script>

<template>
  <div
    class="group overflow-hidden rounded-xl bg-white shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg"
  >
    <NuxtLink
      :to="roomPath"
      class="block focus-visible:ring-2 focus-visible:ring-waldhonig-500 focus-visible:ring-offset-2"
    >
      <!-- Image area -->
      <div
        class="relative overflow-hidden bg-sage-100"
        :class="compact ? 'aspect-[3/2]' : 'aspect-[4/3]'"
      >
        <NuxtImg
          :src="heroImage"
          :alt="heroImageAlt"
          loading="lazy"
          sizes="sm:100vw md:50vw"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          @error="onImgError"
        />
        <span
          v-if="comingSoonLabel"
          class="absolute top-3 left-3 rounded-full bg-waldhonig-500 font-semibold text-white shadow-sm"
          :class="compact ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'"
        >
          {{ comingSoonLabel }}
        </span>
      </div>

      <!-- Card body -->
      <div :class="compact ? 'p-3' : 'p-5'">
        <!-- Room name -->
        <h3
          class="font-serif font-semibold text-sage-800"
          :class="compact ? 'text-base' : 'text-lg'"
        >
          {{ name }}
        </h3>

        <!-- Short description (full variant only) -->
        <p v-if="!compact" class="mt-1.5 line-clamp-2 text-sm leading-relaxed text-sage-600">
          {{ shortDescription }}
        </p>

        <!-- Key features row (full variant only) -->
        <div
          v-if="!compact"
          class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-sage-600"
        >
          <span class="inline-flex items-center gap-1">
            <Icon name="lucide:users" :size="16" aria-hidden="true" />
            {{ guestLabel }}
          </span>
          <span
            v-for="highlight in highlights.slice(0, 2)"
            :key="highlight"
            class="inline-flex items-center gap-1"
          >
            <span class="text-sage-300" aria-hidden="true">&middot;</span>
            {{ highlight }}
          </span>
        </div>

        <!-- Starting price -->
        <p :class="compact ? 'mt-2 text-sm' : 'mt-4'">
          <span class="font-normal text-sage-600" :class="compact ? 'text-xs' : 'text-sm'"
            >{{ t('room.from', locale) }}
          </span>
          <span class="font-semibold text-waldhonig-600" :class="compact ? 'text-sm' : 'text-lg'">
            {{ startingPrice }} EUR
          </span>
          <span class="font-normal text-sage-600" :class="compact ? 'text-xs' : 'text-sm'">
            {{ t('room.perNight', locale) }}
          </span>
        </p>
      </div>
    </NuxtLink>

    <!-- CTA buttons (full variant only) -->
    <div v-if="!compact" class="flex gap-2 px-5 pb-5">
      <NuxtLink
        :to="roomPath"
        aria-hidden="true"
        tabindex="-1"
        class="flex-1 rounded-lg border border-sage-200 px-4 py-2.5 text-center text-sm font-semibold text-sage-700 transition-colors duration-200 hover:bg-sage-50"
      >
        {{ t('cta.viewDetails', locale) }}
      </NuxtLink>
      <a
        v-if="bookingUrl"
        :href="bookingUrl"
        target="_blank"
        rel="noopener"
        class="flex-1 rounded-lg bg-waldhonig-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors duration-200 hover:bg-waldhonig-600"
        @click.stop
      >
        {{ t('cta.bookNow', locale) }}
      </a>
    </div>
  </div>
</template>
