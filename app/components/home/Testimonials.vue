<script setup lang="ts">
import useEmblaCarousel from 'embla-carousel-vue'
import Autoplay from 'embla-carousel-autoplay'

// Load testimonials via Nuxt Content queryCollection
const { data: testimonialsData } = await useAsyncData('testimonials', () =>
  queryCollection('testimonials').all(),
)

const items = computed(() => testimonialsData.value?.[0]?.items ?? [])

// Carousel setup — Accessibility plugin removed (v9 RC incompatible with Embla v8)
const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' }, [
  Autoplay({ delay: 6000, stopOnInteraction: true }),
])

// Navigation state
const selectedIndex = ref(0)
const scrollSnaps = ref<number[]>([])

function scrollPrev() {
  emblaApi.value?.scrollPrev()
}

function scrollNext() {
  emblaApi.value?.scrollNext()
}

function scrollTo(index: number) {
  emblaApi.value?.scrollTo(index)
}

function onSelect() {
  if (!emblaApi.value) return
  selectedIndex.value = emblaApi.value.selectedScrollSnap()
}

function onInit() {
  if (!emblaApi.value) return
  scrollSnaps.value = emblaApi.value.scrollSnapList()
  onSelect()
}

// Watch for emblaApi readiness
watch(emblaApi, (api) => {
  if (!api) return
  onInit()
  api.on('select', onSelect)
  api.on('reInit', onInit)
})
</script>

<template>
  <section class="bg-sage-50 py-20 md:py-24">
    <div class="mx-auto max-w-4xl px-6">
      <h2 class="text-center font-serif text-3xl font-bold text-sage-900 md:text-4xl">
        Was unsere G&auml;ste sagen
      </h2>

      <div v-if="items.length" class="mt-12">
        <!-- Embla carousel -->
        <div class="relative">
          <!-- Viewport -->
          <div ref="emblaRef" class="overflow-hidden">
            <div class="flex">
              <div
                v-for="(testimonial, index) in items"
                :key="index"
                class="min-w-0 flex-[0_0_100%]"
              >
                <div class="px-4 py-6 text-center md:px-12">
                  <!-- Decorative quote mark -->
                  <span
                    class="mb-4 block font-serif text-6xl leading-none text-sage-200"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  <!-- Quote text -->
                  <p class="text-lg leading-relaxed text-sage-800 italic md:text-xl">
                    {{ testimonial.quote }}
                  </p>
                  <!-- Star rating -->
                  <div class="mt-4 flex justify-center">
                    <UiStarRating :rating="testimonial.rating" />
                  </div>
                  <!-- Name + source -->
                  <p class="mt-4 font-semibold text-sage-600">
                    {{ testimonial.name }}
                  </p>
                  <p class="mt-1 text-xs text-sage-400">Google Bewertung</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Prev / Next arrows (client-only to avoid hydration mismatch with Embla state) -->
          <ClientOnly>
            <button
              type="button"
              class="absolute top-1/2 left-2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-sage-700 shadow-sm transition-colors hover:bg-white md:left-0"
              aria-label="Vorheriges Zitat"
              @click="scrollPrev"
            >
              <Icon name="lucide:chevron-left" class="size-5" />
            </button>
            <button
              type="button"
              class="absolute top-1/2 right-2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-sage-700 shadow-sm transition-colors hover:bg-white md:right-0"
              aria-label="Nächstes Zitat"
              @click="scrollNext"
            >
              <Icon name="lucide:chevron-right" class="size-5" />
            </button>
          </ClientOnly>
        </div>

        <!-- Dot indicators -->
        <ClientOnly>
          <div class="mt-6 flex items-center justify-center gap-2">
            <button
              v-for="(_, index) in scrollSnaps"
              :key="index"
              type="button"
              class="size-2.5 rounded-full transition-colors"
              :class="index === selectedIndex ? 'bg-sage-700' : 'bg-sage-300'"
              :aria-label="`Zitat ${index + 1} von ${scrollSnaps.length}`"
              @click="scrollTo(index)"
            />
          </div>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>
