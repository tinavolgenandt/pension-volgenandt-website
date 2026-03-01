<script setup lang="ts">
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
}

const props = withDefaults(defineProps<Props>(), {
  beds24PropertyId: undefined,
  beds24RoomId: undefined,
  compact: false,
})

// Direct booking URL for rooms with Beds24 integration
const bookingUrl = computed(() => {
  if (!props.beds24PropertyId) return null
  const params = new URLSearchParams({
    propid: String(props.beds24PropertyId),
    lang: 'de',
    referer: 'Website',
    numnight: '2',
    numadult: '2',
  })
  if (props.beds24RoomId) {
    params.set('roomid', String(props.beds24RoomId))
  }
  return `https://beds24.com/booking2.php?${params}`
})
</script>

<template>
  <div
    class="group overflow-hidden rounded-xl bg-white shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg"
  >
    <NuxtLink
      :to="`/zimmer/${slug}`"
      class="block focus-visible:ring-2 focus-visible:ring-waldhonig-500 focus-visible:ring-offset-2"
    >
      <!-- Image area -->
      <div class="relative overflow-hidden" :class="compact ? 'aspect-[3/2]' : 'aspect-[4/3]'">
        <NuxtImg
          :src="heroImage"
          :alt="heroImageAlt"
          loading="lazy"
          sizes="sm:100vw md:50vw"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
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
            {{ maxGuests }} {{ maxGuests === 1 ? 'Gast' : 'Gäste' }}
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
            >ab
          </span>
          <span class="font-semibold text-waldhonig-600" :class="compact ? 'text-sm' : 'text-lg'">
            {{ startingPrice }} EUR
          </span>
          <span class="font-normal text-sage-600" :class="compact ? 'text-xs' : 'text-sm'">
            / Nacht inkl. MwSt.
          </span>
        </p>
      </div>
    </NuxtLink>

    <!-- CTA buttons (full variant only) -->
    <div v-if="!compact" class="flex gap-2 px-5 pb-5">
      <NuxtLink
        :to="`/zimmer/${slug}`"
        class="flex-1 rounded-lg border border-sage-200 px-4 py-2.5 text-center text-sm font-semibold text-sage-700 transition-colors duration-200 hover:bg-sage-50"
      >
        Details ansehen
      </NuxtLink>
      <a
        v-if="bookingUrl"
        :href="bookingUrl"
        target="_blank"
        rel="noopener"
        class="flex-1 rounded-lg bg-waldhonig-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors duration-200 hover:bg-waldhonig-600"
        @click.stop
      >
        Jetzt buchen
      </a>
    </div>
  </div>
</template>
