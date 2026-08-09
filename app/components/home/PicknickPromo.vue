<script setup lang="ts">
const show = ref(false)

const route = useRoute()
const isPicknickPage = computed(
  () => route.path.startsWith('/picknick') || route.path.startsWith('/en/picnic'),
)

// Bump the version suffix whenever the popup is redesigned so returning
// visitors who dismissed an earlier version see the new one again.
const DISMISS_KEY = 'picknick-promo-dismissed-v2'

let cleanupScroll: (() => void) | null = null

onMounted(() => {
  if (isPicknickPage.value) return
  try {
    if (localStorage.getItem(DISMISS_KEY)) return
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
    localStorage.setItem(DISMISS_KEY, '1')
  } catch {
    // ignore – private browsing or storage full
  }
}
</script>

<template>
  <Transition
    enter-from-class="scale-95 opacity-0"
    enter-active-class="transition-all duration-400 ease-out"
    leave-to-class="scale-95 opacity-0"
    leave-active-class="transition-all duration-200 ease-in"
  >
    <div
      v-if="show && !isPicknickPage"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="dismiss" />

      <!-- Card -->
      <div class="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <!-- Close button -->
        <button
          class="absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/50"
          aria-label="Schließen"
          @click="dismiss"
        >
          <Icon name="lucide:x" :size="15" />
        </button>

        <!-- Image -->
        <NuxtImg
          src="/img/picknick/header-picknick.webp"
          alt="Picknick-Korb mit regionalen Produkten"
          class="h-48 w-full object-cover"
          style="object-position: center 55%"
          width="448"
          height="192"
          loading="lazy"
        />

        <!-- Body -->
        <div class="p-5">
          <div class="flex items-start gap-3">
            <div class="flex-1">
              <h3 class="font-serif text-lg leading-tight font-bold text-sage-900">
                Picknick-Korb
              </h3>
              <p class="mt-0.5 text-xs text-sage-500">
                Regional &amp; hausgemacht · mit Geschirr und Decke
              </p>
            </div>
            <span
              class="shrink-0 rounded-full bg-waldhonig-100 px-3 py-1 text-sm font-semibold text-waldhonig-700"
            >
              ab 19 €
            </span>
          </div>

          <p class="mt-3 text-sm leading-relaxed text-sage-600">
            Im Garten der Pension entspannen oder auf einen Ausflug ins Eichsfeld mitnehmen: Wir
            packen alles ein. Ausflugstipps gibt es auf unserer Website.
          </p>

          <!-- Day guest highlight -->
          <div
            class="mt-3 flex items-center gap-2 rounded-lg bg-sage-50 px-3 py-2.5 text-sm text-sage-700"
          >
            <Icon
              name="lucide:sun"
              :size="16"
              class="shrink-0 text-waldhonig-500"
              aria-hidden="true"
            />
            <span>Auch ohne Zimmerbuchung sind <strong>Tagesgäste herzlich willkommen.</strong></span>
          </div>

          <NuxtLink
            to="/picknick/"
            class="mt-4 block rounded-xl bg-waldhonig-500 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-waldhonig-600"
            @click="dismiss"
          >
            Mehr erfahren →
          </NuxtLink>
        </div>
      </div>
    </div>
  </Transition>
</template>
