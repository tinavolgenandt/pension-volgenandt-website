<script setup lang="ts">
import { t } from '~/utils/translations'

const props = defineProps<{
  text?: string
  buttonText?: string
}>()

const { locale } = useLocale()
</script>

<template>
  <section class="bg-waldhonig-50 px-6 py-12">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="font-serif text-2xl font-semibold text-sage-900">
        {{ props.text ?? t('bookingCta.default', locale) }}
      </h2>
      <NuxtLink
        :to="locale === 'en' ? '/en/rooms/' : '/zimmer/'"
        class="mt-6 inline-block rounded-lg bg-waldhonig-500 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-waldhonig-600"
      >
        {{ props.buttonText ?? t('cta.viewRooms', locale) }}
      </NuxtLink>
    </div>
  </section>
</template>
