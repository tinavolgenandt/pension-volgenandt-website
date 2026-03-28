<script setup lang="ts">
const appConfig = useAppConfig()
const router = useRouter()

const KIDS_PRICE = 9.5

// Load package data from YAML for ingredient display
const { data: packagesData } = await useAsyncData('booking-packages', () =>
  queryCollection('picknickPackages').first(),
)
const packages = computed(() =>
  (packagesData.value?.items ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    timeSlot: p.timeSlot,
    price: p.pricePerPerson,
    includes: p.includes,
  })),
)

const teaOptions = [
  { id: 'schwarztee', label: 'Schwarztee' },
  { id: 'gruentee', label: 'Grüntee' },
  { id: 'fruechtetee', label: 'Früchtetee' },
  { id: 'kraeutertee', label: 'Kräutertee' },
  { id: 'pfefferminze', label: 'Pfefferminztee' },
  { id: 'kamille', label: 'Kamillentee' },
]

const milkOptions = [
  { id: 'schwarz', label: 'Schwarz', extra: 0 },
  { id: 'milch', label: 'Mit Milch', extra: 0 },
  { id: 'hafermilch', label: 'Hafermilch', extra: 1 },
  { id: 'sojamilch', label: 'Sojamilch', extra: 1 },
  { id: 'reisdrink', label: 'Reisdrink', extra: 1 },
]

const kidsKorbInhalt = [
  '1 Brötchen mit Marmelade oder Nutella',
  'Mini-Joghurt',
  'Apfelschorle',
  'Obstspieß (saisonal)',
  '1 hartgekochtes Ei',
  'Kleiner Keks oder Waffel',
]

const extrasOptions = [
  { id: 'vegetarisch', label: 'Vegetarisch / Vegan', price: 0, perPerson: false },
  { id: 'glutenfrei', label: 'Glutenfreie Brötchen', price: 1, perPerson: true },
  { id: 'hummus', label: 'Hausgemachter Hummus', price: 2, perPerson: false },
  { id: 'lachs', label: 'Lachs mit Frischkäse & Dill', price: 4, perPerson: true },
  { id: 'croissants', label: 'Croissants (zusätzlich)', price: 2, perPerson: true },
  { id: 'pancakes', label: 'Pancakes', price: 5, perPerson: true },
  { id: 'sekt', label: 'Sekt / Prosecco', price: 3, perPerson: true },
  { id: 'sekt-alkoholfrei', label: 'Alkoholfreier Sekt', price: 3, perPerson: true },
  { id: 'decke-extra', label: 'Extra Decke', price: 2, perPerson: false },
  { id: 'blumenstrauss', label: 'Kleiner Blumenstrauß', price: 6, perPerson: false },
]

function extraPriceLabel(extra: (typeof extrasOptions)[0]): string {
  if (extra.price === 0) return 'kostenlos'
  if (extra.perPerson) return `+${extra.price} € / Person`
  return `+${extra.price} €`
}

function extraCost(extra: (typeof extrasOptions)[0], adults: number): number {
  return extra.perPerson ? extra.price * adults : extra.price
}

const minDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
})

const form = reactive({
  date: '',
  packageId: 'brunch',
  adults: 2,
  kids: 0,
  wantKaffee: true,
  wantTee: false,
  milkType: 'schwarz',
  teaType: 'fruechtetee',
  extras: [] as string[],
  name: '',
  email: '',
  phone: '',
  notes: '',
})

const isSubmitting = ref(false)
const errorMessage = ref('')

const selectedPackage = computed(
  () => packages.value.find((p) => p.id === form.packageId) ?? packages.value[0],
)

const adultsTotal = computed(() => (selectedPackage.value?.price ?? 19) * form.adults)
const kidsTotal = computed(() => KIDS_PRICE * form.kids)
const milkExtra = computed(() => {
  if (!form.wantKaffee) return 0
  return milkOptions.find((m) => m.id === form.milkType)?.extra ?? 0
})
const baseTotal = computed(() => adultsTotal.value + kidsTotal.value + milkExtra.value)
const totalPersons = computed(() => form.adults + form.kids)

const selectedExtrasWithCost = computed(() =>
  extrasOptions
    .filter((e) => form.extras.includes(e.id) && e.price > 0)
    .map((e) => ({ ...e, cost: extraCost(e, form.adults) })),
)
const extrasTotal = computed(() => selectedExtrasWithCost.value.reduce((sum, e) => sum + e.cost, 0))
const grandTotal = computed(() => baseTotal.value + extrasTotal.value)

const beverageText = computed(() => {
  const parts: string[] = []
  if (form.wantKaffee) {
    const milk = milkOptions.find((m) => m.id === form.milkType)
    parts.push(`Kaffee (${milk?.label ?? 'Schwarz'})`)
  }
  if (form.wantTee) {
    const tea = teaOptions.find((t) => t.id === form.teaType)
    parts.push(`Tee: ${tea?.label ?? form.teaType}`)
  }
  return parts.join(' + ') || '–'
})

async function handleSubmit() {
  if (!form.wantKaffee && !form.wantTee) {
    errorMessage.value = 'Bitte wählen Sie mindestens Kaffee oder Tee.'
    return
  }

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
    `Paket: ${selectedPackage.value?.name} (${selectedPackage.value?.timeSlot})`,
    `Erwachsene: ${form.adults}`,
    form.kids > 0 ? `Kinder: ${form.kids}` : null,
    `Thermoskanne: ${beverageText.value}`,
    `Extras: ${extrasText}`,
    `Sonderwünsche: ${form.notes || '–'}`,
    '',
    `Erwachsene: ${form.adults} × ${selectedPackage.value?.price ?? 19} € = ${adultsTotal.value} €`,
    form.kids > 0
      ? `Kinder: ${form.kids} × ${KIDS_PRICE.toLocaleString('de-DE', { minimumFractionDigits: 2 })} € = ${kidsTotal.value.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`
      : null,
    milkExtra.value > 0 ? `Pflanzenmilch: +${milkExtra.value} €` : null,
    extrasTotal.value > 0 ? `Extras: ${extrasTotal.value} €` : null,
    'Korbpfand: Bei Abholung (100 € bar oder Autoschlüssel)',
    `Gesamtbetrag (ohne Pfand): ${grandTotal.value.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`,
    '',
    'Hinweis: Max. 2 Körbe/Tag – Verfügbarkeit wird geprüft.',
    '',
    '=== KONTAKT ===',
    `Name: ${form.name}`,
    `E-Mail: ${form.email}`,
    `Telefon: ${form.phone}`,
  ]
    .filter(Boolean)
    .join('\n')

  try {
    const response = await fetch(appConfig.contactFormUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        message: messageText,
        _subject: `Picknick-Anfrage: ${selectedPackage.value?.name} am ${form.date} (${form.adults} Erw.${form.kids > 0 ? `, ${form.kids} Kind.` : ''})`,
      }),
    })

    const data = await response.json()

    if (response.ok && data.ok) {
      await router.push({
        path: '/picknick/danke/',
        query: {
          betrag: String(grandTotal.value),
          personen: String(totalPersons.value),
          paket: selectedPackage.value?.name ?? '',
        },
      })
    } else if (data.errors) {
      errorMessage.value = data.errors.map((e: { message: string }) => e.message).join(', ')
    } else {
      errorMessage.value =
        data.error || 'Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
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
  <form class="space-y-8" @submit.prevent="handleSubmit">
    <!-- Honeypot -->
    <input
      type="text"
      name="_gotcha"
      style="display: none"
      tabindex="-1"
      autocomplete="off"
      aria-hidden="true"
    />

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

      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label for="pk-adults" class="block text-sm font-medium text-sage-800"
            >Erwachsene *</label
          >
          <input
            id="pk-adults"
            v-model.number="form.adults"
            type="number"
            name="erwachsene"
            min="2"
            max="12"
            required
            class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
          />
        </div>
        <div>
          <label for="pk-kids" class="block text-sm font-medium text-sage-800">
            Kinder <span class="text-sage-400">(bis 12 Jahre)</span>
          </label>
          <input
            id="pk-kids"
            v-model.number="form.kids"
            type="number"
            name="kinder"
            min="0"
            max="8"
            class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
          />
        </div>
      </div>
    </fieldset>

    <!-- Paket-Inhalt -->
    <div v-if="selectedPackage?.includes?.length" class="rounded-lg border border-sage-200 p-5">
      <h3 class="font-serif text-base font-semibold text-sage-900">
        Im Paket „{{ selectedPackage.name }}" enthalten
      </h3>
      <ul class="mt-3 space-y-1.5">
        <li
          v-for="(item, i) in selectedPackage.includes"
          :key="i"
          class="flex items-start gap-2 text-sm text-sage-700"
        >
          <Icon name="ph:check-duotone" class="mt-0.5 size-4 shrink-0 text-sage-500" />
          {{ item }}
        </li>
      </ul>
    </div>

    <!-- Kinder-Korb Info -->
    <div v-if="form.kids > 0" class="rounded-lg border border-waldhonig-200 bg-waldhonig-50/50 p-5">
      <h3 class="font-serif text-base font-semibold text-sage-900">
        Kinder-Korb ({{ KIDS_PRICE.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} € /
        Kind)
      </h3>
      <p class="mt-1 text-xs text-sage-500">Kindgerechte Portionen für kleine Genießer</p>
      <ul class="mt-3 space-y-1.5">
        <li
          v-for="(item, i) in kidsKorbInhalt"
          :key="i"
          class="flex items-start gap-2 text-sm text-sage-700"
        >
          <Icon name="ph:check-duotone" class="mt-0.5 size-4 shrink-0 text-waldhonig-500" />
          {{ item }}
        </li>
      </ul>
    </div>

    <!-- Thermoskanne -->
    <fieldset class="space-y-4">
      <legend class="font-serif text-lg font-semibold text-sage-900">Thermoskanne</legend>
      <p class="text-sm text-sage-500">Im Paket enthalten. Wählen Sie Kaffee, Tee oder beides.</p>

      <div class="space-y-4">
        <!-- Kaffee -->
        <div
          class="rounded-lg border p-4"
          :class="form.wantKaffee ? 'border-sage-400 bg-sage-50' : 'border-sage-200'"
        >
          <label class="flex cursor-pointer items-center gap-2">
            <input v-model="form.wantKaffee" type="checkbox" class="size-4 accent-waldhonig-500" />
            <span class="text-sm font-medium text-sage-800">Kaffee</span>
          </label>
          <div v-if="form.wantKaffee" class="mt-3 flex flex-wrap gap-2 pl-6">
            <label
              v-for="milk in milkOptions"
              :key="milk.id"
              class="flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs"
              :class="form.milkType === milk.id ? 'border-sage-400 bg-white' : 'border-sage-200'"
            >
              <input
                v-model="form.milkType"
                type="radio"
                name="milch"
                :value="milk.id"
                class="accent-waldhonig-500"
              />
              <span class="text-sage-800">{{ milk.label }}</span>
              <span v-if="milk.extra > 0" class="text-waldhonig-600">(+{{ milk.extra }} €)</span>
            </label>
          </div>
        </div>

        <!-- Tee -->
        <div
          class="rounded-lg border p-4"
          :class="form.wantTee ? 'border-sage-400 bg-sage-50' : 'border-sage-200'"
        >
          <label class="flex cursor-pointer items-center gap-2">
            <input v-model="form.wantTee" type="checkbox" class="size-4 accent-waldhonig-500" />
            <span class="text-sm font-medium text-sage-800">Tee</span>
          </label>
          <div v-if="form.wantTee" class="mt-3 pl-6">
            <select
              v-model="form.teaType"
              class="w-full rounded-lg border border-sage-300 px-3 py-2 text-sm focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none sm:w-56"
            >
              <option v-for="tea in teaOptions" :key="tea.id" :value="tea.id">
                {{ tea.label }}
              </option>
            </select>
          </div>
        </div>
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
            <span
              class="ml-1 text-xs"
              :class="extra.price === 0 ? 'text-sage-400' : 'text-waldhonig-600'"
            >
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
            aria-required="true"
            autocomplete="name"
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
            aria-required="true"
            autocomplete="email"
            class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label for="pk-phone" class="block text-sm font-medium text-sage-800">Telefon *</label>
        <input
          id="pk-phone"
          v-model="form.phone"
          type="tel"
          name="telefon"
          required
          aria-required="true"
          autocomplete="tel"
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
          <dt class="text-sage-700">
            {{ form.adults }} × {{ selectedPackage?.price ?? 19 }} € (Erwachsene)
          </dt>
          <dd class="font-semibold text-sage-900">
            {{ adultsTotal.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €
          </dd>
        </div>
        <div v-if="form.kids > 0" class="flex justify-between">
          <dt class="text-sage-700">
            {{ form.kids }} ×
            {{ KIDS_PRICE.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} € (Kinder)
          </dt>
          <dd class="font-semibold text-sage-900">
            {{ kidsTotal.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €
          </dd>
        </div>
        <div v-if="milkExtra > 0" class="flex justify-between text-sage-600">
          <dt>Pflanzenmilch</dt>
          <dd>+ {{ milkExtra.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €</dd>
        </div>
        <div
          v-for="extra in selectedExtrasWithCost"
          :key="extra.id"
          class="flex justify-between text-sage-600"
        >
          <dt>{{ extra.label }}</dt>
          <dd>+ {{ extra.cost.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €</dd>
        </div>
        <div class="flex justify-between text-sage-500">
          <dt>Korbpfand bei Abholung (bar oder Autoschlüssel)</dt>
          <dd>100 €</dd>
        </div>
        <div class="flex justify-between border-t border-waldhonig-200 pt-2">
          <dt class="font-semibold text-sage-900">Gesamt</dt>
          <dd class="text-base font-bold text-waldhonig-700">
            {{ (grandTotal + 100).toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €
          </dd>
        </div>
      </dl>
    </div>

    <!-- Fehler -->
    <div v-if="errorMessage" role="alert" class="rounded-lg bg-red-50 p-4 text-red-700">
      {{ errorMessage }}
    </div>

    <!-- Wetter & Stornierung -->
    <p class="text-sm leading-relaxed text-sage-500">
      <Icon name="ph:cloud-sun-duotone" class="inline-block size-4 align-text-bottom" />
      Bei schlechtem Wetter steht unsere überdachte Terrasse bereit. Kostenfreie Stornierung bis
      48&#8201;h vorher.
    </p>

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
