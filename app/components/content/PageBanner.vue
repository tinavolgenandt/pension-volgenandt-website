<script setup lang="ts">
defineProps<{
  image: string
  imageAlt: string
  title: string
  subtitle?: string
}>()
</script>

<template>
  <section class="relative h-[200px] overflow-hidden md:h-[300px]">
    <!-- Banner photo -->
    <NuxtImg
      :src="image"
      :alt="imageAlt"
      class="absolute inset-0 h-full w-full object-cover"
      loading="eager"
    />

    <!-- Dark gradient overlay (bottom-to-top, 80% at bottom) -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

    <!-- Text content -->
    <div class="relative z-10 flex h-full flex-col justify-end px-6 pb-6 md:px-12 lg:px-24">
      <BreadcrumbNav class="mb-2" />
      <h1 class="font-serif text-3xl font-bold text-white md:text-4xl">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="mt-1 text-lg text-white/90">
        {{ subtitle }}
      </p>
    </div>
  </section>
</template>
