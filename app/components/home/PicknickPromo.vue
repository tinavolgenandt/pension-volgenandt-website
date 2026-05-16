<script setup lang="ts">
const show = ref(false)

const route = useRoute()
const isPicknickPage = computed(
  () => route.path.startsWith('/picknick') || route.path.startsWith('/en/picnic'),
)

let cleanupScroll: (() => void) | null = null

onMounted(() => {
  if (isPicknickPage.value) return
  try {
    if (localStorage.getItem('picknick-promo-dismissed')) return
  } catch {
    return
  }

  const onScroll = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight
    if (scrollable > 0 && window.scrollY / scrollable > 0.3) {
      show.value = true
      cleanupScroll?.()
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  cleanupScroll = () => window.removeEventListener('scroll', onScroll)
})

onUnmounted(() => cleanupScroll?.())

function dismiss() {
  show.value = false
  try {
    localStorage.setItem('picknick-promo-dismissed', '1')
  } catch {
    // ignore – private browsing or storage full
  }
}
</script>

<template>
  <Transition
    enter-from-class="translate-y-8 opacity-0"
    enter-active-class="transition-all duration-500 ease-out"
    leave-to-class="translate-y-8 opacity-0"
    leave-active-class="transition-all duration-300 ease-in"
  >
    <div
      v-if="show && !isPicknickPage"
      class="fixed right-4 bottom-4 z-50 w-72 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/10 md:right-6 md:bottom-6"
    >
      <!-- Close button -->
      <button
        class="absolute top-2 right-2 z-10 flex size-7 items-center justify-center rounded-full bg-black/25 text-white transition-colors hover:bg-black/40"
        aria-label="Schließen"
        @click="dismiss"
      >
        <Icon name="lucide:x" :size="13" />
      </button>

      <!-- Image -->
      <NuxtImg
        src="/img/picknick/header-picknick.webp"
        alt="Picknick-Korb mit regionalen Produkten"
        class="h-32 w-full object-cover"
        style="object-position: center 55%"
        width="288"
        height="128"
        loading="lazy"
      />

      <!-- Body -->
      <div class="p-4">
        <div class="flex items-center gap-2">
          <h3 class="font-serif text-base font-bold leading-tight text-sage-900">Picknick-Korb</h3>
          <span
            class="ml-auto shrink-0 rounded-full bg-waldhonig-100 px-2.5 py-0.5 text-xs font-semibold text-waldhonig-700"
          >
            ab 19 €
          </span>
        </div>
        <p class="mt-1.5 text-xs leading-relaxed text-sage-600">
          Regional &amp; hausgemacht – im Garten genießen oder auf Ausflug mitnehmen. Wir packen
          alles ein.
        </p>
        <NuxtLink
          to="/picknick/"
          class="mt-3 block rounded-lg bg-waldhonig-500 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-waldhonig-600"
          @click="dismiss"
        >
          Mehr erfahren →
        </NuxtLink>
      </div>
    </div>
  </Transition>
</template>
