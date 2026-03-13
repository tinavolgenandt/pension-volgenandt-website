<script setup lang="ts">
defineProps<{
  name: string
  subtitle: string
  timeSlot: string
  pricePerPerson: number
  description: string
  includes: string[]
  image: string
  imageAlt: string
  imagePosition?: string
}>()
</script>

<template>
  <div class="overflow-hidden rounded-lg bg-white shadow-sm">
    <!-- Image with time slot overlay -->
    <div class="relative aspect-video overflow-hidden">
      <NuxtImg
        :src="image"
        :alt="imageAlt"
        class="h-full w-full object-cover"
        :style="imagePosition ? { objectPosition: imagePosition } : {}"
        loading="lazy"
        sizes="100vw sm:50vw"
      />
    </div>

    <!-- Card body -->
    <div class="p-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="font-serif text-xl font-bold text-sage-900">{{ name }}</h3>
          <p class="text-sm text-sage-500">{{ subtitle }}</p>
        </div>
        <div class="shrink-0 text-right">
          <span class="text-2xl font-bold text-waldhonig-600">{{ pricePerPerson }} €</span>
          <p class="text-xs text-sage-500">pro Person</p>
        </div>
      </div>

      <p class="mt-4 text-sm leading-relaxed text-sage-700">{{ description }}</p>

      <ul class="mt-4 space-y-1.5">
        <li
          v-for="item in includes"
          :key="item"
          class="flex items-center gap-2 text-sm text-sage-700"
        >
          <Icon name="ph:check-circle-duotone" class="size-4 shrink-0 text-sage-500" />
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>
