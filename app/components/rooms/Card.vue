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
  compact?: boolean
}

withDefaults(defineProps<Props>(), {
  compact: false,
})
</script>

<template>
  <NuxtLink
    :to="`/zimmer/${slug}`"
    class="group block overflow-hidden rounded-xl bg-white shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-waldhonig-500 focus-visible:ring-offset-2"
  >
    <!-- Image area -->
    <div class="relative overflow-hidden" :class="compact ? 'aspect-[3/2]' : 'aspect-[4/3]'">
      <NuxtImg
        :src="heroImage"
        :alt="heroImageAlt"
        loading="lazy"
        sizes="sm:100vw md:50vw"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        placeholder
      />
    </div>

    <!-- Card body -->
    <div :class="compact ? 'p-3' : 'p-5'">
      <!-- Room name -->
      <h3 class="font-serif font-semibold text-sage-800" :class="compact ? 'text-base' : 'text-lg'">
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
        <span class="font-normal text-sage-500" :class="compact ? 'text-xs' : 'text-sm'">ab </span>
        <span class="font-semibold text-waldhonig-600" :class="compact ? 'text-sm' : 'text-lg'">
          {{ startingPrice }} EUR
        </span>
        <span class="font-normal text-sage-500" :class="compact ? 'text-xs' : 'text-sm'">
          / Nacht inkl. MwSt.
        </span>
      </p>

      <!-- CTA button (full variant only) -->
      <div
        v-if="!compact"
        class="mt-4 rounded-lg bg-waldhonig-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors duration-200 group-hover:bg-waldhonig-600"
      >
        Verfügbarkeit prüfen
      </div>
    </div>
  </NuxtLink>
</template>
