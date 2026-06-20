<script setup lang="ts">
const appConfig = useAppConfig()
const { trackEvent } = useAnalytics()

const form = reactive({
  name: '',
  phone: '',
  preferredTime: '',
  notes: '',
})

const isSubmitting = ref(false)
const isSubmitted = ref(false)
const errorMessage = ref('')

const isFormValid = computed(
  () => form.name.trim() !== '' && form.phone.trim() !== '' && form.preferredTime.trim() !== '',
)

async function handleSubmit() {
  errorMessage.value = ''
  if (!isFormValid.value) {
    errorMessage.value = 'Bitte geben Sie Name, Telefon und Ihren Wunschtermin an.'
    return
  }
  isSubmitting.value = true
  try {
    const response = await fetch(appConfig.contactFormUrl, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        message: [
          'Wunsch nach einem persönlichen Gespräch zur Gartenfeier.',
          '',
          `Name: ${form.name}`,
          `Telefon: ${form.phone}`,
          `Wunschtermin für das Gespräch: ${form.preferredTime}`,
          `Anmerkung: ${form.notes || '–'}`,
        ].join('\n'),
        _subject: `Gesprächstermin-Wunsch (Gartenfeier): ${form.name}`,
      }),
    })
    const data = await response.json()
    if (response.ok && data.ok) {
      isSubmitted.value = true
      trackEvent('generate_lead')
    } else if (data.errors) {
      errorMessage.value = data.errors.map((e: { message: string }) => e.message).join(', ')
    } else {
      errorMessage.value =
        data.error || 'Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
    }
  } catch {
    errorMessage.value = 'Netzwerkfehler. Bitte versuchen Sie es erneut oder rufen Sie uns an.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <!-- Success state -->
  <div v-if="isSubmitted" class="mx-auto max-w-md rounded-xl bg-white p-8 text-center">
    <Icon name="ph:check-circle-duotone" class="mx-auto mb-4 size-12 text-sage-600" />
    <h3 class="font-serif text-xl font-semibold text-sage-900">Wir melden uns!</h3>
    <p class="mt-2 text-sage-700">
      Vielen Dank – wir rufen Sie zu Ihrem Wunschtermin zurück, um in Ruhe über Ihre Feier zu
      sprechen.
    </p>
  </div>

  <form v-else class="mx-auto max-w-xl text-left" @submit.prevent="handleSubmit">
    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <label for="cb-name" class="block text-sm font-medium text-sage-800">Name *</label>
        <input
          id="cb-name"
          v-model="form.name"
          type="text"
          required
          autocomplete="name"
          class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
        />
      </div>
      <div>
        <label for="cb-phone" class="block text-sm font-medium text-sage-800">Telefon *</label>
        <input
          id="cb-phone"
          v-model="form.phone"
          type="tel"
          required
          autocomplete="tel"
          class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
        />
      </div>
    </div>
    <div class="mt-4">
      <label for="cb-time" class="block text-sm font-medium text-sage-800">
        Ihr Wunschtermin für das Gespräch *
      </label>
      <input
        id="cb-time"
        v-model="form.preferredTime"
        type="text"
        placeholder="z. B. Samstag vormittags oder werktags ab 18 Uhr"
        class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
      />
    </div>
    <div class="mt-4">
      <label for="cb-notes" class="block text-sm font-medium text-sage-800">
        Worum geht es? <span class="text-sage-400">(optional)</span>
      </label>
      <textarea
        id="cb-notes"
        v-model="form.notes"
        rows="3"
        class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
      />
    </div>

    <div v-if="errorMessage" role="alert" class="mt-4 rounded-lg bg-red-50 p-4 text-red-700">
      {{ errorMessage }}
    </div>

    <button
      type="submit"
      :disabled="isSubmitting"
      class="mt-5 w-full rounded-lg bg-waldhonig-500 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-waldhonig-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Icon v-if="isSubmitting" name="ph:spinner" class="mr-2 inline-block size-5 animate-spin" />
      {{ isSubmitting ? 'Wird gesendet …' : 'Rückruf anfragen' }}
    </button>
    <p class="mt-3 text-center text-sm text-sage-500">
      Einfach Wunschtermin angeben – wir melden uns bei Ihnen.
    </p>
  </form>
</template>
