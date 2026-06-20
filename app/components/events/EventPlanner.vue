<script setup lang="ts">
const appConfig = useAppConfig()
const { trackEvent } = useAnalytics()

// Pricing config lives in YAML (content/events/config.yml) so the owners can
// edit prices without touching code. All values are provisional Richtwerte.
const { data: config } = await useAsyncData('event-config', () =>
  queryCollection('eventConfig').first(),
)

const occasions = computed(() => config.value?.occasions ?? [])
const cateringTiers = computed(() => config.value?.cateringTiers ?? [])
const addons = computed(() => config.value?.addons ?? [])
const guestRange = computed(() => config.value?.guestRange ?? { min: 20, max: 80, default: 40 })
const basePackage = computed(
  () => config.value?.basePackage ?? { label: 'Grundpauschale', description: '', price: 0 },
)
const bufferPercent = computed(() => config.value?.rangeBufferPercent ?? 15)

const form = reactive({
  occasionId: '',
  date: '',
  guests: guestRange.value.default,
  cateringId: cateringTiers.value[0]?.id ?? '',
  addons: {} as Record<string, boolean>,
  name: '',
  email: '',
  phone: '',
  notes: '',
})

// Seed defaults once config is available (handles async load on the client)
watchEffect(() => {
  if (!form.cateringId && cateringTiers.value[0]) {
    form.cateringId = cateringTiers.value[0].id
  }
  for (const addon of addons.value) {
    if (!(addon.id in form.addons)) {
      form.addons[addon.id] = addon.default ?? false
    }
  }
})

const minDate = ref('')
if (import.meta.client) {
  // Events need lead time — earliest selectable date is two weeks out.
  const d = new Date()
  d.setDate(d.getDate() + 14)
  minDate.value = d.toISOString().slice(0, 10)
}

const selectedCatering = computed(
  () => cateringTiers.value.find((c) => c.id === form.cateringId) ?? cateringTiers.value[0],
)

const selectedOccasion = computed(() => occasions.value.find((o) => o.id === form.occasionId))

function addonCost(addon: (typeof addons.value)[number]): number {
  return addon.unit === 'person' ? addon.price * form.guests : addon.price
}

const selectedAddons = computed(() => addons.value.filter((a) => form.addons[a.id]))

const cateringTotal = computed(() => (selectedCatering.value?.pricePerPerson ?? 0) * form.guests)
const addonsTotal = computed(() => selectedAddons.value.reduce((sum, a) => sum + addonCost(a), 0))
const estimate = computed(() => basePackage.value.price + cateringTotal.value + addonsTotal.value)
const estimateUpper = computed(() => Math.round(estimate.value * (1 + bufferPercent.value / 100)))
const perGuest = computed(() => (form.guests > 0 ? Math.round(estimate.value / form.guests) : 0))

function formatEuro(value: number): string {
  return value.toLocaleString('de-DE')
}

const isSubmitting = ref(false)
const isSubmitted = ref(false)
const errorMessage = ref('')

const isFormValid = computed(
  () =>
    form.occasionId !== '' &&
    form.guests >= guestRange.value.min &&
    form.name.trim() !== '' &&
    form.email.trim() !== '' &&
    form.phone.trim() !== '',
)

const leadTracked = ref(false)
watch(
  () => form.name,
  (val) => {
    if (val && !leadTracked.value) {
      leadTracked.value = true
      trackEvent('generate_lead')
    }
  },
)

function buildMessage(): string {
  const addonLines = selectedAddons.value.map((a) => `- ${a.label}: ${formatEuro(addonCost(a))} €`)
  return [
    `Anlass: ${selectedOccasion.value?.label ?? '–'}`,
    `Wunschtermin: ${form.date || 'noch offen'}`,
    `Gäste: ${form.guests}`,
    `Catering: ${selectedCatering.value?.label} (${selectedCatering.value?.pricePerPerson} € / Person)`,
    '',
    'Zusatzleistungen:',
    addonLines.length > 0 ? addonLines.join('\n') : '- keine',
    '',
    `${basePackage.value.label}: ${formatEuro(basePackage.value.price)} €`,
    `Catering: ${form.guests} × ${selectedCatering.value?.pricePerPerson} € = ${formatEuro(cateringTotal.value)} €`,
    addonsTotal.value > 0 ? `Zusatzleistungen gesamt: ${formatEuro(addonsTotal.value)} €` : null,
    `Geschätzter Richtwert: ${formatEuro(estimate.value)} – ${formatEuro(estimateUpper.value)} € (ca. ${formatEuro(perGuest.value)} € / Person)`,
    '',
    `Nachricht: ${form.notes || '–'}`,
  ]
    .filter(Boolean)
    .join('\n')
}

async function handleSubmit() {
  errorMessage.value = ''
  if (!isFormValid.value) {
    errorMessage.value = 'Bitte füllen Sie Anlass, Name, E-Mail und Telefon aus.'
    return
  }
  isSubmitting.value = true
  try {
    const response = await fetch(appConfig.contactFormUrl, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: buildMessage(),
        _subject: `Garten-Feier Anfrage: ${selectedOccasion.value?.label ?? 'Feier'} (${form.guests} Gäste${form.date ? `, ${form.date}` : ''})`,
      }),
    })
    const data = await response.json()
    if (response.ok && data.ok) {
      isSubmitted.value = true
      trackEvent('generate_lead', { value: estimate.value, currency: 'EUR' })
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
  <div>
    <!-- Success state -->
    <div v-if="isSubmitted" class="rounded-xl bg-sage-50 p-8 text-center">
      <Icon name="ph:check-circle-duotone" class="mx-auto mb-4 size-12 text-sage-600" />
      <h3 class="font-serif text-xl font-semibold text-sage-900">Vielen Dank für Ihre Anfrage!</h3>
      <p class="mx-auto mt-2 max-w-md text-sage-700">
        Wir haben Ihre Anfrage erhalten und melden uns innerhalb von 24 Stunden persönlich bei
        Ihnen, um Ihre Feier in Ruhe zu besprechen.
      </p>
    </div>

    <form v-else class="space-y-8" @submit.prevent="handleSubmit">
      <!-- Anlass & Eckdaten -->
      <fieldset class="space-y-5">
        <legend class="font-serif text-lg font-semibold text-sage-900">
          1. Ihr Anlass & Eckdaten
        </legend>

        <div class="grid gap-5 sm:grid-cols-3">
          <div>
            <label for="ev-occasion" class="block text-sm font-medium text-sage-800">
              Anlass *
            </label>
            <select
              id="ev-occasion"
              v-model="form.occasionId"
              class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
            >
              <option value="" disabled>Bitte wählen</option>
              <option v-for="o in occasions" :key="o.id" :value="o.id">{{ o.label }}</option>
            </select>
          </div>

          <div>
            <label for="ev-date" class="block text-sm font-medium text-sage-800">
              Wunschtermin
            </label>
            <input
              id="ev-date"
              v-model="form.date"
              type="date"
              :min="minDate"
              class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label for="ev-guests" class="block text-sm font-medium text-sage-800">
              Gäste * <span class="text-sage-400">({{ guestRange.min }}–{{ guestRange.max }})</span>
            </label>
            <input
              id="ev-guests"
              v-model.number="form.guests"
              type="number"
              :min="guestRange.min"
              :max="guestRange.max"
              class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
            />
          </div>
        </div>
      </fieldset>

      <!-- Catering -->
      <fieldset class="space-y-3">
        <legend class="font-serif text-lg font-semibold text-sage-900">2. Catering</legend>
        <div class="space-y-3">
          <label
            v-for="tier in cateringTiers"
            :key="tier.id"
            class="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-sage-50"
            :class="form.cateringId === tier.id ? 'border-sage-400 bg-sage-50' : 'border-sage-200'"
          >
            <input
              v-model="form.cateringId"
              type="radio"
              name="catering"
              :value="tier.id"
              class="mt-1 size-4 accent-waldhonig-500"
            />
            <span class="flex-1">
              <span class="flex items-baseline justify-between gap-2">
                <span class="font-medium text-sage-900">{{ tier.label }}</span>
                <span class="shrink-0 text-sm font-semibold text-waldhonig-700">
                  {{ tier.pricePerPerson }} € / Person
                </span>
              </span>
              <span class="mt-1 block text-sm text-sage-600">{{ tier.description }}</span>
            </span>
          </label>
        </div>
      </fieldset>

      <!-- Zusatzleistungen -->
      <fieldset class="space-y-3">
        <legend class="font-serif text-lg font-semibold text-sage-900">
          3. Zusatzleistungen <span class="text-sm font-normal text-sage-500">(optional)</span>
        </legend>
        <div class="grid gap-3 sm:grid-cols-2">
          <label
            v-for="addon in addons"
            :key="addon.id"
            class="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-sage-50"
            :class="form.addons[addon.id] ? 'border-sage-400 bg-sage-50' : 'border-sage-200'"
          >
            <input
              v-model="form.addons[addon.id]"
              type="checkbox"
              class="mt-1 size-4 accent-waldhonig-500"
            />
            <span class="flex-1">
              <span class="flex items-baseline justify-between gap-2">
                <span class="flex items-center gap-1.5 font-medium text-sage-900">
                  <Icon :name="addon.icon" class="size-4 text-sage-500" />
                  {{ addon.label }}
                </span>
                <span class="shrink-0 text-sm font-semibold text-waldhonig-700">
                  {{ formatEuro(addon.price) }} €{{ addon.unit === 'person' ? ' / Pers.' : '' }}
                </span>
              </span>
              <span class="mt-1 block text-sm text-sage-600">{{ addon.description }}</span>
            </span>
          </label>
        </div>
      </fieldset>

      <!-- Preis-Richtwert -->
      <div class="rounded-xl bg-waldhonig-50 p-6">
        <div class="flex items-center justify-between">
          <h3 class="font-serif text-base font-semibold text-sage-900">Ihr Richtwert</h3>
          <span
            class="rounded-full bg-waldhonig-100 px-3 py-1 text-xs font-medium text-waldhonig-700"
          >
            unverbindlich
          </span>
        </div>
        <dl class="mt-4 space-y-2 text-sm">
          <div class="flex justify-between">
            <dt class="text-sage-700">{{ basePackage.label }}</dt>
            <dd class="font-medium text-sage-900">{{ formatEuro(basePackage.price) }} €</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sage-700">
              Catering · {{ form.guests }} × {{ selectedCatering?.pricePerPerson }} €
            </dt>
            <dd class="font-medium text-sage-900">{{ formatEuro(cateringTotal) }} €</dd>
          </div>
          <div
            v-for="addon in selectedAddons"
            :key="addon.id"
            class="flex justify-between text-sage-600"
          >
            <dt>{{ addon.label }}</dt>
            <dd>+ {{ formatEuro(addonCost(addon)) }} €</dd>
          </div>
          <div class="flex items-baseline justify-between border-t border-waldhonig-200 pt-3">
            <dt class="font-semibold text-sage-900">Geschätzter Richtwert</dt>
            <dd class="text-lg font-bold text-waldhonig-700">
              ca. {{ formatEuro(estimate) }} – {{ formatEuro(estimateUpper) }} €
            </dd>
          </div>
          <p class="text-right text-xs text-sage-500">≈ {{ formatEuro(perGuest) }} € pro Person</p>
        </dl>
        <p class="mt-4 text-xs leading-relaxed text-sage-500">
          {{ config?.disclaimer }}
        </p>
      </div>

      <!-- Kontaktdaten -->
      <fieldset class="space-y-5">
        <legend class="font-serif text-lg font-semibold text-sage-900">4. Ihre Kontaktdaten</legend>
        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label for="ev-name" class="block text-sm font-medium text-sage-800">Name *</label>
            <input
              id="ev-name"
              v-model="form.name"
              type="text"
              required
              autocomplete="name"
              class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
            />
          </div>
          <div>
            <label for="ev-email" class="block text-sm font-medium text-sage-800">E-Mail *</label>
            <input
              id="ev-email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label for="ev-phone" class="block text-sm font-medium text-sage-800">Telefon *</label>
          <input
            id="ev-phone"
            v-model="form.phone"
            type="tel"
            required
            autocomplete="tel"
            class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
          />
        </div>
        <div>
          <label for="ev-notes" class="block text-sm font-medium text-sage-800">
            Ihre Wünsche <span class="text-sage-400">(optional)</span>
          </label>
          <textarea
            id="ev-notes"
            v-model="form.notes"
            rows="4"
            placeholder="Erzählen Sie uns von Ihrer Feier – Uhrzeit, Stil, besondere Wünsche …"
            class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
          />
        </div>
      </fieldset>

      <div v-if="errorMessage" role="alert" class="rounded-lg bg-red-50 p-4 text-red-700">
        {{ errorMessage }}
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full rounded-lg bg-waldhonig-500 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-waldhonig-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Icon v-if="isSubmitting" name="ph:spinner" class="mr-2 inline-block size-5 animate-spin" />
        {{ isSubmitting ? 'Wird gesendet …' : 'Unverbindliche Anfrage senden' }}
      </button>
      <p class="text-center text-sm text-sage-500">
        Kostenlos & unverbindlich. Wir melden uns innerhalb von 24 Stunden.
      </p>
    </form>
  </div>
</template>
