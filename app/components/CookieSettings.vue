<script setup lang="ts">
import type { ConsentPreferences } from '~/composables/useCookieConsent'
import { t } from '~/utils/translations'

const { locale } = useLocale()

const { consent, settingsOpen, acceptAll, updateCategory, closeSettings } = useCookieConsent()

// Local draft state so toggles work before saving
const draft = ref<ConsentPreferences>({
  essential: true,
  booking: false,
  media: false,
  statistics: false,
})

// Sync draft from cookie when panel opens
watch(settingsOpen, (open) => {
  if (open) {
    draft.value = {
      essential: true,
      booking: consent.value?.booking ?? false,
      media: consent.value?.media ?? false,
      statistics: consent.value?.statistics ?? false,
    }
  }
})

// Lock body scroll when settings panel is open
if (import.meta.client) {
  const isLocked = useScrollLock(document.body)
  watch(settingsOpen, (open) => {
    isLocked.value = open
  })
}

function saveAndClose() {
  updateCategory('booking', draft.value.booking)
  updateCategory('media', draft.value.media)
  updateCategory('statistics', draft.value.statistics)
  closeSettings()
}

function acceptAllAndClose() {
  acceptAll()
  closeSettings()
}

interface CategoryInfo {
  key: keyof ConsentPreferences
  label: string
  description: string
  disabled: boolean
}

const categoryKeys: (keyof ConsentPreferences)[] = ['essential', 'booking', 'media', 'statistics']

const categories = computed<CategoryInfo[]>(() =>
  categoryKeys.map((key) => ({
    key,
    label: t(`cookie.category.${key}.label`, locale.value),
    description: t(`cookie.category.${key}.description`, locale.value),
    disabled: key === 'essential',
  })),
)
</script>

<template>
  <!-- Backdrop overlay -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="settingsOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-900/60 p-4"
        @click.self="closeSettings"
      >
        <!-- Settings panel -->
        <div
          role="dialog"
          :aria-label="t('cookie.settings', locale)"
          aria-modal="true"
          class="relative w-full max-w-lg rounded-lg bg-warm-white p-6 shadow-xl sm:p-8"
        >
          <!-- Close button -->
          <button
            type="button"
            class="absolute top-4 right-4 rounded-lg p-2 text-sage-500 transition-colors duration-200 hover:text-sage-700"
            :aria-label="t('common.close', locale)"
            @click="closeSettings"
          >
            <svg
              class="size-5"
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

          <!-- Heading -->
          <h2 class="font-serif text-xl font-semibold text-sage-900">
            {{ t('cookie.settings', locale) }}
          </h2>
          <p class="mt-2 font-sans text-sm text-sage-600">
            {{ t('cookie.settingsIntro', locale) }}
          </p>

          <!-- Category toggles -->
          <div class="mt-6 space-y-4">
            <div
              v-for="cat in categories"
              :key="cat.key"
              class="flex items-start justify-between gap-4 rounded-lg border border-sage-200 p-4"
            >
              <div class="min-w-0 flex-1">
                <p class="font-sans font-semibold text-sage-800">{{ cat.label }}</p>
                <p class="mt-1 font-sans text-sm text-sage-600">{{ cat.description }}</p>
              </div>

              <!-- Toggle switch -->
              <button
                type="button"
                role="switch"
                :aria-checked="cat.key === 'essential' ? true : draft[cat.key]"
                :aria-label="`${cat.label} ${cat.key === 'essential' || draft[cat.key] ? t('cookie.enabled', locale) : t('cookie.disabled', locale)}`"
                :disabled="cat.disabled"
                class="relative mt-1 inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-waldhonig-500"
                :class="[
                  cat.key === 'essential' || draft[cat.key] ? 'bg-waldhonig-500' : 'bg-sage-300',
                  cat.disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
                ]"
                @click="!cat.disabled && (draft[cat.key] = !draft[cat.key])"
              >
                <span
                  class="pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200"
                  :class="
                    cat.key === 'essential' || draft[cat.key] ? 'translate-x-5' : 'translate-x-0.5'
                  "
                />
              </button>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              class="rounded-lg bg-sage-700 px-6 py-3 font-sans font-semibold text-white transition-colors duration-200 hover:bg-sage-800"
              @click="saveAndClose"
            >
              {{ t('cookie.save', locale) }}
            </button>
            <button
              type="button"
              class="rounded-lg bg-waldhonig-500 px-6 py-3 font-sans font-semibold text-white transition-colors duration-200 hover:bg-waldhonig-600"
              @click="acceptAllAndClose"
            >
              {{ t('cookie.acceptAll', locale) }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
