<script setup lang="ts">
defineProps<{
  name: string
  location: string
  distanceKm: number
  description: string
  image: string | null
  imageAlt: string | null
  imagePosition?: string
}>()
</script>

<template>
  <div class="overflow-hidden rounded-lg bg-white shadow-sm">
    <!-- Photo or placeholder -->
    <div class="relative aspect-[4/3] overflow-hidden">
      <NuxtImg
        v-if="image"
        :src="image"
        :alt="imageAlt ?? name"
        class="h-full w-full object-cover"
        :style="imagePosition ? { objectPosition: imagePosition } : {}"
        loading="lazy"
        sizes="100vw sm:50vw lg:33vw"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center bg-sage-100"
      >
        <Icon name="ph:map-pin-duotone" class="size-12 text-sage-300" />
      </div>

      <!-- Distance badge -->
      <span
        v-if="distanceKm === 0"
        class="absolute top-3 right-3 rounded-full bg-sage-700/90 px-2.5 py-1 text-xs font-medium text-white"
      >
        Im Garten
      </span>
      <span
        v-else
        class="absolute top-3 right-3 rounded-full bg-waldhonig-500/90 px-2.5 py-1 text-xs font-medium text-white"
      >
        {{ distanceKm }} km
      </span>
    </div>

    <!-- Text -->
    <div class="p-4">
      <p class="text-xs font-medium uppercase tracking-wide text-sage-400">{{ location }}</p>
      <h3 class="mt-1 font-serif text-base font-semibold text-sage-900">{{ name }}</h3>
      <p class="mt-1.5 text-sm leading-relaxed text-sage-600">{{ description }}</p>
    </div>
  </div>
</template>
