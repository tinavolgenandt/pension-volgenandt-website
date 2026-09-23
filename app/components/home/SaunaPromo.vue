<script setup lang="ts">
import { t } from '~/utils/translations'

const { locale } = useLocale()
const show = ref(false)

const ARTICLE_PATH = '/aktuelles/saunafass-im-garten/'

// Bump the version suffix whenever the popup is redesigned so returning
// visitors who dismissed an earlier version see the new one again.
const DISMISS_KEY = 'sauna-promo-dismissed-v1'

let cleanupScroll: (() => void) | null = null

onMounted(() => {
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
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="dismiss" />

      <!-- Card -->
      <div class="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <!-- Close button -->
        <button
          class="absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/50"
          :aria-label="t('saunaPromo.close', locale)"
          @click="dismiss"
        >
          <Icon name="lucide:x" :size="15" />
        </button>

        <!-- Image -->
        <NuxtImg
          src="/img/garten/saunafass-garten.webp"
          :alt="t('saunaPromo.imageAlt', locale)"
          class="h-56 w-full object-cover"
          style="object-position: center 55%"
          width="448"
          height="224"
          loading="lazy"
        />

        <!-- Body -->
        <div class="p-5">
          <div class="flex items-start gap-3">
            <div class="flex-1">
              <h3 class="font-serif text-lg leading-tight font-bold text-sage-900">
                {{ t('saunaPromo.title', locale) }}
              </h3>
              <p class="mt-0.5 text-xs text-sage-500">{{ t('saunaPromo.subtitle', locale) }}</p>
            </div>
            <span
              class="shrink-0 rounded-full bg-waldhonig-100 px-3 py-1 text-sm font-semibold text-waldhonig-700"
            >
              {{ t('saunaPromo.badge', locale) }}
            </span>
          </div>

          <p class="mt-3 text-sm leading-relaxed text-sage-600">
            {{ t('saunaPromo.text', locale) }}
          </p>

          <!-- Day guest highlight -->
          <div
            class="mt-3 flex items-center gap-2 rounded-lg bg-sage-50 px-3 py-2.5 text-sm text-sage-700"
          >
            <Icon
              name="lucide:users"
              :size="16"
              class="shrink-0 text-waldhonig-500"
              aria-hidden="true"
            />
            <span>{{ t('saunaPromo.highlight', locale) }}</span>
          </div>

          <NuxtLink
            :to="ARTICLE_PATH"
            class="mt-4 block rounded-xl bg-waldhonig-500 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-waldhonig-600"
            @click="dismiss"
          >
            {{ t('saunaPromo.cta', locale) }} →
          </NuxtLink>
        </div>
      </div>
    </div>
  </Transition>
</template>
