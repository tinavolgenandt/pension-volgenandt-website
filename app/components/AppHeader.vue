<script setup lang="ts">
import { t } from '~/utils/translations'

const { isCompressed } = useScrollHeader()
const config = useAppConfig()
const route = useRoute()
const { locale, beds24Lang } = useLocale()

const isMenuOpen = ref(false)

// Lock body scroll when mobile menu is open
if (import.meta.client) {
  const isLocked = useScrollLock(document.body)
  watch(isMenuOpen, (open) => {
    isLocked.value = open
  })
}

// Close menu on route change
watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false
  },
)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function isActive(to: string): boolean {
  return route.path === to
}

// Locale-aware nav items
const navItems = computed(() => {
  if (locale.value === 'en') {
    return [
      { label: t('nav.rooms', 'en'), to: '/en/rooms' },
      { label: t('nav.families', 'en'), to: '/en/families' },
      { label: t('nav.activities', 'en'), to: '/en/activities' },
      { label: t('nav.news', 'en'), to: '/en/news' },
      { label: t('nav.picnic', 'en'), to: '/en/picnic' },
      { label: t('nav.sustainability', 'en'), to: '/en/sustainability' },
      { label: t('nav.contact', 'en'), to: '/en/contact' },
    ]
  }
  return [
    { label: t('nav.rooms', 'de'), to: '/zimmer' },
    { label: t('nav.families', 'de'), to: '/familie' },
    { label: t('nav.activities', 'de'), to: '/aktivitaeten' },
    { label: t('nav.news', 'de'), to: '/aktuelles' },
    { label: t('nav.picnic', 'de'), to: '/picknick' },
    { label: t('nav.sustainability', 'de'), to: '/nachhaltigkeit' },
    { label: t('nav.contact', 'de'), to: '/kontakt' },
  ]
})

// Locale-aware booking URL (centralized in app.config.ts)
const bookingUrl = computed(() => {
  const { baseUrl, propId } = config.beds24
  return `${baseUrl}?propid=${propId}&lang=${beds24Lang.value}&referer=Website&numnight=2&numadult=2`
})

// Locale-aware logo link
const logoLink = computed(() => (locale.value === 'en' ? '/en/' : '/'))
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-40 bg-charcoal-900 transition-[padding] duration-300"
    :class="isCompressed ? 'py-2' : 'py-4'"
  >
    <div class="mx-auto flex max-w-screen-xl items-center justify-between px-4 lg:px-6">
      <!-- Logo -->
      <div class="min-w-0 shrink">
        <NuxtLink :to="logoLink" class="group block">
          <span
            class="font-serif text-xl font-bold text-white transition-[font-size] duration-300 nav:text-2xl"
            :class="isCompressed ? 'nav:text-xl' : 'nav:text-2xl'"
          >
            {{ config.siteName }}
          </span>
          <span
            class="block font-sans text-xs text-sage-300 transition-[opacity,height] duration-300 nav:text-sm"
            :class="isCompressed ? 'h-0 overflow-hidden opacity-0' : 'opacity-100'"
          >
            {{ t('site.tagline', locale) }}
          </span>
        </NuxtLink>
      </div>

      <!-- Desktop navigation (>= 1024px / breakpoint-nav) -->
      <nav class="hidden items-center gap-1 nav:flex" :aria-label="t('header.mainNav', locale)">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="rounded-lg px-3 py-2 font-sans text-sm font-medium text-sage-200 transition-colors duration-200 hover:text-white"
          :class="isActive(item.to) ? 'bg-charcoal-800 text-white' : ''"
        >
          {{ item.label }}
        </NuxtLink>

        <!-- Language switcher (desktop) -->
        <SharedLanguageSwitcher />
      </nav>

      <!-- Desktop phone + CTA -->
      <div class="hidden items-center gap-4 nav:flex">
        <!-- Phone link -->
        <a
          :href="`tel:${config.contact.phone}`"
          class="flex items-center gap-2 font-sans text-sm text-sage-200 transition-colors duration-200 hover:text-white"
        >
          <svg
            class="size-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
            />
          </svg>
          <span>{{ config.contact.phoneDisplay }}</span>
        </a>

        <!-- CTA button — direct to Beds24 booking -->
        <UiBaseButton variant="primary" size="md" :to="bookingUrl" target="_blank">
          {{ t('cta.bookNow', locale) }}
        </UiBaseButton>
      </div>

      <!-- Mobile: CTA + Hamburger (< 1024px) -->
      <div class="flex items-center gap-3 nav:hidden">
        <!-- CTA button (always visible, never hidden in hamburger) -->
        <UiBaseButton
          variant="primary"
          size="sm"
          :to="bookingUrl"
          target="_blank"
          class="whitespace-nowrap"
        >
          <span class="min-[480px]:hidden">{{ t('cta.book', locale) }}</span>
          <span class="hidden min-[480px]:inline">{{ t('cta.bookNow', locale) }}</span>
        </UiBaseButton>

        <!-- Hamburger button -->
        <button
          type="button"
          class="rounded-lg p-2 text-sage-200 transition-colors duration-200 hover:text-white"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-menu"
          :aria-label="t('header.toggleNav', locale)"
          @click="toggleMenu"
        >
          <!-- Hamburger icon (3 lines) -->
          <svg
            v-if="!isMenuOpen"
            class="size-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <!-- Close icon (X) -->
          <svg
            v-else
            class="size-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu dropdown -->
    <Transition
      enter-active-class="transition-[opacity,grid-template-rows] duration-300 ease-out"
      enter-from-class="grid-rows-[0fr] opacity-0"
      enter-to-class="grid-rows-[1fr] opacity-100"
      leave-active-class="transition-[opacity,grid-template-rows] duration-200 ease-in"
      leave-from-class="grid-rows-[1fr] opacity-100"
      leave-to-class="grid-rows-[0fr] opacity-0"
    >
      <div
        v-if="isMenuOpen"
        id="mobile-menu"
        class="grid border-t border-sage-700 bg-charcoal-900 nav:hidden"
      >
        <nav
          class="mx-auto max-w-screen-xl overflow-hidden px-4 py-4"
          :aria-label="t('header.mobileNav', locale)"
        >
          <!-- Nav items -->
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="block rounded-lg px-4 py-3 font-sans text-base font-medium text-sage-200 transition-colors duration-200 hover:bg-charcoal-800 hover:text-white"
            :class="isActive(item.to) ? 'bg-charcoal-800 text-white' : ''"
          >
            {{ item.label }}
          </NuxtLink>

          <!-- Language switcher (mobile) -->
          <div class="px-4 py-3">
            <SharedLanguageSwitcher />
          </div>

          <!-- Divider -->
          <div class="my-3 border-t border-sage-700" />

          <!-- Phone number (full, tap-to-call) -->
          <a
            :href="`tel:${config.contact.phone}`"
            class="flex items-center gap-3 rounded-lg px-4 py-3 font-sans text-base text-sage-200 transition-colors duration-200 hover:bg-charcoal-800 hover:text-white"
          >
            <svg
              class="size-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
              />
            </svg>
            <span>{{ config.contact.phoneDisplay }}</span>
          </a>

          <!-- CTA button (full-width) -->
          <div class="mt-3 px-4">
            <UiBaseButton
              variant="primary"
              size="lg"
              :to="bookingUrl"
              target="_blank"
              class="w-full"
            >
              {{ t('cta.bookNow', locale) }}
            </UiBaseButton>
          </div>
        </nav>
      </div>
    </Transition>
  </header>
</template>
