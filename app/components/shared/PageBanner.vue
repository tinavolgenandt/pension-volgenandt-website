<script setup lang="ts">
defineProps<{
  image: string
  imageAlt: string
  title: string
  subtitle?: string
  imageCredit?: string
}>()

const { onImgError } = useImageFallback()
</script>

<template>
  <section class="relative h-[200px] overflow-hidden bg-sage-100 md:h-[300px]">
    <!-- Banner photo -->
    <NuxtImg
      :src="image"
      :alt="imageAlt"
      class="absolute inset-0 h-full w-full object-cover"
      width="1920"
      height="1080"
      loading="eager"
      @error="onImgError"
    />

    <!-- Dark gradient overlay (bottom-to-top, 80% at bottom) -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

    <!-- Optional image credit / AI disclosure badge -->
    <div
      v-if="imageCredit"
      class="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-xs"
    >
      <Icon name="lucide:sparkles" class="size-3 text-waldhonig-400" aria-hidden="true" />
      <span>{{ imageCredit }}</span>
    </div>

    <!-- Text content -->
    <div class="relative z-10 flex h-full flex-col justify-end px-6 pb-6 md:px-12 lg:px-24">
      <UiBreadcrumbNav class="mb-2" />
      <h1 class="font-serif text-3xl font-bold text-white md:text-4xl">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="mt-1 text-lg text-white/90">
        {{ subtitle }}
      </p>
    </div>
  </section>
</template>
