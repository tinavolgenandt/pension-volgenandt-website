<script setup lang="ts">
const appConfig = useAppConfig()
const router = useRouter()

const packages = [
  { id: 'brunch', name: 'Brunch', timeSlot: '09:00 – 12:00 Uhr', price: 19 },
  { id: 'kaffee-kuchen', name: 'Kaffee & Kuchen', timeSlot: '14:00 – 17:00 Uhr', price: 19 },
  { id: 'sonnenuntergang', name: 'Sonnenuntergang', timeSlot: 'ca. 18:00 – 21:00 Uhr', price: 19 },
]

const extrasOptions = [
  { id: 'vegetarisch', label: 'Vegetarisch / Vegan', price: 0, perPerson: false },
  { id: 'glutenfrei', label: 'Glutenfreie Brötchen', price: 1, perPerson: true },
  { id: 'kinder', label: 'Kinder-Korb', price: 0, perPerson: false },
  { id: 'sekt-extra', label: 'Extra Sekt / Prosecco', price: 3, perPerson: true },
  { id: 'decke-extra', label: 'Extra Decke', price: 2, perPerson: false },
  { id: 'thermoskanne', label: 'Thermoskanne Kaffee oder Tee', price: 4, perPerson: false },
  { id: 'blumenstrauss', label: 'Kleiner Blumenstrauß', price: 6, perPerson: false },
]

function extraPriceLabel(extra: (typeof extrasOptions)[0]): string {
  if (extra.price === 0) return 'kostenlos'
  if (extra.perPerson) return `+${extra.price.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} € / Person`
  return `+${extra.price.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} €`
}

function extraCost(extra: (typeof extrasOptions)[0], persons: number): number {
  return extra.perPerson ? extra.price * persons : extra.price
}

const minDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
})

const form = reactive({
  date: '',
  packageId: 'brunch',
  persons: 2, // minimum 2
  extras: [] as string[],
  name: '',
  email: '',
  phone: '',
  notes: '',
})

const isSubmitting = ref(false)
const errorMessage = ref('')

const selectedPackage = computed(() => packages.find((p) => p.id === form.packageId)!)
const baseTotal = computed(() => selectedPackage.value.price * form.persons)
const selectedExtrasWithCost = computed(() =>
  extrasOptions
    .filter((e) => form.extras.includes(e.id) && e.price > 0)
    .map((e) => ({ ...e, cost: extraCost(e, form.persons) })),
)
const extrasTotal = computed(() =>
  selectedExtrasWithCost.value.reduce((sum, e) => sum + e.cost, 0),
)
const grandTotal = computed(() => baseTotal.value + extrasTotal.value)

async function handleSubmit() {
  isSubmitting.value = true
  errorMessage.value = ''

  const selectedExtras = extrasOptions.filter((e) => form.extras.includes(e.id))
  const extrasText =
    selectedExtras.length > 0
      ? selectedExtras.map((e) => `${e.label} (${extraPriceLabel(e)})`).join(', ')
      : 'keine'

  const messageText = [
    '=== PICKNICK-ANFRAGE ===',
    '',
    `Datum: ${form.date}`,
    `Paket: ${selectedPackage.value.name} (${selectedPackage.value.timeSlot})`,
    `Personen: ${form.persons}`,
    `Extras: ${extrasText}`,
    `Sonderwünsche: ${form.notes || '–'}`,
    '',
    `Grundpreis: ${form.persons} × 19 € = ${baseTotal.value} €`,
    extrasTotal.value > 0 ? `Extras: ${extrasTotal.value} €` : null,
    'Korbpfand: 100 € (wird bei Rückgabe erstattet)',
    `Gesamtbetrag (ohne Pfand): ${grandTotal.value} €`,
    '',
    '=== KONTAKT ===',
    `Name: ${form.name}`,
    `E-Mail: ${form.email}`,
    `Telefon: ${form.phone || '–'}`,
  ].filter(Boolean).join('\n')

  try {
    const response = await fetch(`https://formspree.io/f/${appConfig.picknickFormspreeId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        message: messageText,
        _subject: `Picknick-Anfrage: ${selectedPackage.value.name} am ${form.date}`,
      }),
    })

    if (response.ok) {
      await router.push({
        path: '/picknick/danke/',
        query: {
          betrag: String(grandTotal.value),
          personen: String(form.persons),
          paket: selectedPackage.value.name,
        },
      })
    } else {
      const data = await response.json()
      errorMessage.value = data.errors
        ? data.errors.map((e: { message: string }) => e.message).join(', ')
        : 'Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
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
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <!-- Honeypot -->
    <input type="text" name="_gotcha" style="display: none" tabindex="-1" autocomplete="off" />

    <!-- Datum & Paket -->
    <fieldset class="space-y-5">
      <legend class="font-serif text-lg font-semibold text-sage-900">Ihr Wunschtermin</legend>

      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label for="pk-date" class="block text-sm font-medium text-sage-800">Datum *</label>
          <input
            id="pk-date"
            v-model="form.date"
            type="date"
            name="date"
            :min="minDate"
            required
            class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
          />
        </div>

        <div>
          <label for="pk-package" class="block text-sm font-medium text-sage-800">Paket *</label>
          <select
            id="pk-package"
            v-model="form.packageId"
            name="paket"
            required
            class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
          >
            <option v-for="pkg in packages" :key="pkg.id" :value="pkg.id">
              {{ pkg.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="sm:w-40">
        <label for="pk-persons" class="block text-sm font-medium text-sage-800">Personen *</label>
        <input
          id="pk-persons"
          v-model.number="form.persons"
          type="number"
          name="personen"
          min="2"
          max="12"
          required
          class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
        />
      </div>
    </fieldset>

    <!-- Extras -->
    <fieldset class="space-y-3">
      <legend class="font-serif text-lg font-semibold text-sage-900">
        Extras <span class="text-sm font-normal text-sage-500">(optional)</span>
      </legend>
      <div class="grid gap-3 sm:grid-cols-2">
        <label
          v-for="extra in extrasOptions"
          :key="extra.id"
          class="flex cursor-pointer items-start gap-3 rounded-lg border border-sage-200 p-3 hover:bg-sage-50"
          :class="{ 'border-sage-400 bg-sage-50': form.extras.includes(extra.id) }"
        >
          <input
            v-model="form.extras"
            type="checkbox"
            :value="extra.id"
            class="mt-0.5 size-4 accent-waldhonig-500"
          />
          <span class="text-sm text-sage-800">
            {{ extra.label }}
            <span class="ml-1 text-xs" :class="extra.price === 0 ? 'text-sage-400' : 'text-waldhonig-600'">
              ({{ extraPriceLabel(extra) }})
            </span>
          </span>
        </label>
      </div>
    </fieldset>

    <!-- Kontaktdaten -->
    <fieldset class="space-y-5">
      <legend class="font-serif text-lg font-semibold text-sage-900">Ihre Kontaktdaten</legend>

      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label for="pk-name" class="block text-sm font-medium text-sage-800">Name *</label>
          <input
            id="pk-name"
            v-model="form.name"
            type="text"
            name="name"
            required
            class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
          />
        </div>
        <div>
          <label for="pk-email" class="block text-sm font-medium text-sage-800">E-Mail *</label>
          <input
            id="pk-email"
            v-model="form.email"
            type="email"
            name="email"
            required
            class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label for="pk-phone" class="block text-sm font-medium text-sage-800">
          Telefon <span class="text-sage-400">(optional)</span>
        </label>
        <input
          id="pk-phone"
          v-model="form.phone"
          type="tel"
          name="telefon"
          class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
        />
      </div>

      <div>
        <label for="pk-notes" class="block text-sm font-medium text-sage-800">
          Sonderwünsche <span class="text-sage-400">(optional)</span>
        </label>
        <textarea
          id="pk-notes"
          v-model="form.notes"
          name="anmerkungen"
          rows="3"
          class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
        />
      </div>
    </fieldset>

    <!-- Preisübersicht -->
    <div class="rounded-lg bg-waldhonig-50 p-5">
      <h3 class="font-serif text-base font-semibold text-sage-900">Preisübersicht</h3>
      <dl class="mt-3 space-y-2 text-sm">
        <div class="flex justify-between">
          <dt class="text-sage-700">{{ form.persons }} × 19 € (Grundpreis)</dt>
          <dd class="font-semibold text-sage-900">{{ baseTotal }} €</dd>
        </div>
        <div
          v-for="extra in selectedExtrasWithCost"
          :key="extra.id"
          class="flex justify-between text-sage-600"
        >
          <dt>{{ extra.label }}</dt>
          <dd>+ {{ extra.cost.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} €</dd>
        </div>
        <div class="flex justify-between text-sage-500">
          <dt>Korbpfand (wird bei Rückgabe erstattet)</dt>
          <dd>100 €</dd>
        </div>
        <div class="flex justify-between border-t border-waldhonig-200 pt-2">
          <dt class="font-semibold text-sage-900">Gesamt</dt>
          <dd class="text-base font-bold text-waldhonig-700">{{ grandTotal + 100 }} €</dd>
        </div>
      </dl>
    </div>

    <!-- Fehler -->
    <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4 text-red-700">
      {{ errorMessage }}
    </div>

    <!-- Absenden -->
    <button
      type="submit"
      :disabled="isSubmitting"
      class="w-full rounded-lg bg-waldhonig-500 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-waldhonig-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {{ isSubmitting ? 'Wird gesendet...' : 'Anfrage absenden' }}
    </button>
  </form>
</template>
