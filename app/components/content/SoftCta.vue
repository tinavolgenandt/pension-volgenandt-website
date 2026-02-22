<script setup lang="ts">
const props = defineProps<{
  text?: string
  phone?: string
}>()

const appConfig = useAppConfig()

const displayText = computed(() => props.text ?? 'Haben Sie Fragen? Wir helfen Ihnen gerne weiter.')
const phoneNumber = computed(() => props.phone ?? appConfig.contact.phone)
const phoneDisplay = computed(() => {
  if (props.phone) return props.phone
  return appConfig.contact.phoneDisplay ?? appConfig.contact.phone
})
</script>

<template>
  <section class="bg-sage-50 px-6 py-12">
    <div class="mx-auto max-w-2xl text-center">
      <Icon name="ph:phone" class="mx-auto mb-4 size-8 text-sage-600" />
      <p class="text-lg leading-relaxed text-sage-800">
        {{ displayText }}
      </p>
      <p class="mt-4">
        <a
          :href="`tel:${phoneNumber}`"
          class="text-xl font-semibold text-sage-700 transition-colors hover:text-sage-900"
        >
          {{ phoneDisplay }}
        </a>
      </p>
      <p class="mt-2 text-sm text-sage-500">Oder rufen Sie uns direkt an</p>
    </div>
  </section>
</template>
