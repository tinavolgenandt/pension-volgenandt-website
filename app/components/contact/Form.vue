<script setup lang="ts">
const appConfig = useAppConfig()

const formData = reactive({
  name: '',
  email: '',
  message: '',
})

const isSubmitting = ref(false)
const isSubmitted = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(`https://formspree.io/f/${appConfig.formspreeId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      }),
    })

    if (response.ok) {
      isSubmitted.value = true
    } else {
      const data = await response.json()
      if (data.errors) {
        errorMessage.value = data.errors.map((e: { message: string }) => e.message).join(', ')
      } else {
        errorMessage.value = 'Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
      }
    }
  } catch {
    errorMessage.value =
      'Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder rufen Sie uns an.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <!-- Success state -->
  <div v-if="isSubmitted" class="rounded-lg bg-sage-50 p-8 text-center">
    <Icon name="ph:check-circle-duotone" class="mx-auto mb-4 size-12 text-sage-600" />
    <h3 class="text-xl font-semibold text-sage-900">Vielen Dank!</h3>
    <p class="mt-2 text-sage-700">
      Wir haben Ihre Nachricht erhalten und melden uns schnellstmöglich bei Ihnen.
    </p>
  </div>

  <!-- Form -->
  <form v-else @submit.prevent="handleSubmit">
    <!-- Formspree honeypot (hidden from users, catches bots) -->
    <input type="text" name="_gotcha" style="display: none" tabindex="-1" autocomplete="off" />

    <div class="space-y-6">
      <div>
        <label for="contact-name" class="block text-sm font-medium text-sage-800"> Name </label>
        <input
          id="contact-name"
          v-model="formData.name"
          type="text"
          name="name"
          required
          class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
        />
      </div>

      <div>
        <label for="contact-email" class="block text-sm font-medium text-sage-800"> E-Mail </label>
        <input
          id="contact-email"
          v-model="formData.email"
          type="email"
          name="email"
          required
          class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
        />
      </div>

      <div>
        <label for="contact-message" class="block text-sm font-medium text-sage-800">
          Nachricht
        </label>
        <textarea
          id="contact-message"
          v-model="formData.message"
          name="message"
          rows="5"
          required
          class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
        />
      </div>

      <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4 text-red-700">
        {{ errorMessage }}
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full rounded-lg bg-waldhonig-500 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-waldhonig-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {{ isSubmitting ? 'Wird gesendet...' : 'Nachricht senden' }}
      </button>
    </div>
  </form>
</template>
