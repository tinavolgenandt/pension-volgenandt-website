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
const drinkOptions = computed(() => config.value?.drinkOptions ?? [])
const musicOptions = computed(() => config.value?.musicOptions ?? [])
const decorationOptions = computed(() => config.value?.decorationOptions ?? [])
const tableOptions = computed(() => config.value?.tableOptions ?? [])
const chairCoverOptions = computed(() => config.value?.chairCoverOptions ?? [])
const dishwareOptions = computed(() => config.value?.dishwareOptions ?? [])
const flooringOptions = computed(() => config.value?.flooringOptions ?? [])
const guestRange = computed(() => config.value?.guestRange ?? { min: 10, max: 80, default: 40 })
const partyDuration = computed(() => config.value?.partyDuration ?? { min: 3, max: 12, default: 6 })
const basePackage = computed(() => config.value?.basePackage)

const form = reactive({
  occasionId: '',
  customOccasion: '',
  date: '',
  guests: guestRange.value.default,
  hours: partyDuration.value.default,
  cateringId: cateringTiers.value[0]?.id ?? '',
  drinkId: '',
  musicId: '',
  tableId: '',
  chairCoverId: '',
  dishwareId: '',
  flooringId: '',
  decorationId: '',
  name: '',
  email: '',
  phone: '',
  notes: '',
})

// Seed defaults once config is available (handles async load on the client)
watchEffect(() => {
  if (!form.cateringId && cateringTiers.value[0]) form.cateringId = cateringTiers.value[0].id
  if (!form.drinkId) {
    // default to self-service if present, else the first option
    const def = drinkOptions.value.find((d) => d.pricePerPersonPerHour > 0) ?? drinkOptions.value[0]
    if (def) form.drinkId = def.id
  }
  if (!form.musicId && musicOptions.value[0]) form.musicId = musicOptions.value[0].id
  if (!form.tableId && tableOptions.value[0]) form.tableId = tableOptions.value[0].id
  if (!form.chairCoverId && chairCoverOptions.value[0])
    form.chairCoverId = chairCoverOptions.value[0].id
  if (!form.dishwareId && dishwareOptions.value[0]) form.dishwareId = dishwareOptions.value[0].id
  if (!form.flooringId && flooringOptions.value[0]) form.flooringId = flooringOptions.value[0].id
  if (!form.decorationId && decorationOptions.value[0])
    form.decorationId = decorationOptions.value[0].id
})

// Furniture & equipment groups — rendered generically (all are per-person radios)
type FurnitureKey = 'tableId' | 'chairCoverId' | 'dishwareId' | 'flooringId'
const furnitureGroups = computed<
  {
    key: FurnitureKey
    label: string
    options: { id: string; label: string; description: string; pricePerPerson: number }[]
  }[]
>(() => [
  { key: 'tableId', label: 'Tische', options: tableOptions.value },
  { key: 'chairCoverId', label: 'Stuhlhussen', options: chairCoverOptions.value },
  { key: 'dishwareId', label: 'Geschirr & Gläser', options: dishwareOptions.value },
  { key: 'flooringId', label: 'Bodenbelag / Tanzfläche', options: flooringOptions.value },
])

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
const selectedDrink = computed(() => drinkOptions.value.find((d) => d.id === form.drinkId))
const selectedMusic = computed(() => musicOptions.value.find((m) => m.id === form.musicId))
const selectedDecoration = computed(() =>
  decorationOptions.value.find((d) => d.id === form.decorationId),
)

const isCustomOccasion = computed(() => form.occasionId === 'andere')
const occasionLabel = computed(() => {
  if (isCustomOccasion.value) return form.customOccasion.trim() || 'Eigener Anlass'
  return occasions.value.find((o) => o.id === form.occasionId)?.label ?? ''
})

// Base price is banded by guest count (the included tent scales with size).
const basePrice = computed(() => {
  const bands = basePackage.value?.guestBands ?? []
  const band = bands.find((b) => form.guests <= b.maxGuests) ?? bands[bands.length - 1]
  return band?.price ?? 0
})

function formatEuro(value: number): string {
  return value.toLocaleString('de-DE')
}

const cateringTotal = computed(() => (selectedCatering.value?.pricePerPerson ?? 0) * form.guests)
const drinksTotal = computed(
  () => (selectedDrink.value?.pricePerPersonPerHour ?? 0) * form.guests * form.hours,
)
const musicTotal = computed(() => selectedMusic.value?.price ?? 0)
const decorationTotal = computed(
  () => (selectedDecoration.value?.pricePerPerson ?? 0) * form.guests,
)

const selectedTable = computed(() => tableOptions.value.find((o) => o.id === form.tableId))
const selectedChairCover = computed(() =>
  chairCoverOptions.value.find((o) => o.id === form.chairCoverId),
)
const selectedDishware = computed(() => dishwareOptions.value.find((o) => o.id === form.dishwareId))
const selectedFlooring = computed(() => flooringOptions.value.find((o) => o.id === form.flooringId))
const tableTotal = computed(() => (selectedTable.value?.pricePerPerson ?? 0) * form.guests)
const chairCoverTotal = computed(
  () => (selectedChairCover.value?.pricePerPerson ?? 0) * form.guests,
)
const dishwareTotal = computed(() => (selectedDishware.value?.pricePerPerson ?? 0) * form.guests)
const flooringTotal = computed(() => (selectedFlooring.value?.pricePerPerson ?? 0) * form.guests)
const furnitureTotal = computed(
  () => tableTotal.value + chairCoverTotal.value + dishwareTotal.value + flooringTotal.value,
)

const estimate = computed(
  () =>
    basePrice.value +
    cateringTotal.value +
    drinksTotal.value +
    musicTotal.value +
    furnitureTotal.value +
    decorationTotal.value,
)
const perGuest = computed(() => (form.guests > 0 ? Math.round(estimate.value / form.guests) : 0))

const isSubmitting = ref(false)
const isSubmitted = ref(false)
const errorMessage = ref('')

const isFormValid = computed(
  () =>
    form.occasionId !== '' &&
    (!isCustomOccasion.value || form.customOccasion.trim() !== '') &&
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
  return [
    `Anlass: ${occasionLabel.value || '–'}`,
    `Wunschtermin: ${form.date || 'noch offen'}`,
    `Gäste: ${form.guests}`,
    `Dauer: ca. ${form.hours} Stunden`,
    '',
    `${basePackage.value?.label ?? 'Basispreis'} (${form.guests} Gäste): ${formatEuro(basePrice.value)} €`,
    `Catering: ${selectedCatering.value?.label} – ${form.guests} × ${selectedCatering.value?.pricePerPerson} € = ${formatEuro(cateringTotal.value)} €`,
    `Getränke: ${selectedDrink.value?.label}${(selectedDrink.value?.pricePerPersonPerHour ?? 0) > 0 ? ` – ${form.guests} × ${selectedDrink.value?.pricePerPersonPerHour} € × ${form.hours} h = ${formatEuro(drinksTotal.value)} €` : ''}`,
    `Musik: ${selectedMusic.value?.label}${musicTotal.value > 0 ? ` = ${formatEuro(musicTotal.value)} €` : ''}`,
    `Tische: ${selectedTable.value?.label}${tableTotal.value > 0 ? ` – ${form.guests} × ${selectedTable.value?.pricePerPerson} € = ${formatEuro(tableTotal.value)} €` : ' (im Basispreis)'}`,
    `Stuhlhussen: ${selectedChairCover.value?.label}${chairCoverTotal.value > 0 ? ` – ${form.guests} × ${selectedChairCover.value?.pricePerPerson} € = ${formatEuro(chairCoverTotal.value)} €` : ''}`,
    `Geschirr: ${selectedDishware.value?.label}${dishwareTotal.value > 0 ? ` – ${form.guests} × ${selectedDishware.value?.pricePerPerson} € = ${formatEuro(dishwareTotal.value)} €` : ''}`,
    `Bodenbelag: ${selectedFlooring.value?.label}${flooringTotal.value > 0 ? ` – ${form.guests} × ${selectedFlooring.value?.pricePerPerson} € = ${formatEuro(flooringTotal.value)} €` : ''}`,
    `Dekoration: ${selectedDecoration.value?.label}${decorationTotal.value > 0 ? ` – ${form.guests} × ${selectedDecoration.value?.pricePerPerson} € = ${formatEuro(decorationTotal.value)} €` : ''}`,
    '',
    `Geschätzter Gesamtpreis: ca. ${formatEuro(estimate.value)} € (ca. ${formatEuro(perGuest.value)} € / Person)`,
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
        _subject: `Garten-Feier Anfrage: ${occasionLabel.value || 'Feier'} (${form.guests} Gäste${form.date ? `, ${form.date}` : ''})`,
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
      <!-- Immer enthalten -->
      <div v-if="basePackage" class="rounded-xl border border-sage-200 bg-sage-50/60 p-6">
        <h3 class="font-serif text-lg font-semibold text-sage-900">{{ basePackage.label }}</h3>
        <p class="mt-1 text-sm text-sage-600">{{ basePackage.description }}</p>
        <ul class="mt-4 grid gap-2 sm:grid-cols-2">
          <li
            v-for="(item, i) in basePackage.includes"
            :key="i"
            class="flex items-start gap-2 text-sm text-sage-700"
          >
            <Icon
              name="ph:check-circle-duotone"
              class="mt-0.5 size-4 shrink-0 text-waldhonig-500"
            />
            {{ item }}
          </li>
        </ul>
      </div>

      <!-- Anlass & Eckdaten -->
      <fieldset class="space-y-5">
        <legend class="font-serif text-lg font-semibold text-sage-900">
          1. Ihr Anlass & Eckdaten
        </legend>

        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
              <option value="andere">Anderer Anlass …</option>
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

          <div>
            <label for="ev-hours" class="block text-sm font-medium text-sage-800">
              Dauer (Std.)
              <span class="text-sage-400">({{ partyDuration.min }}–{{ partyDuration.max }})</span>
            </label>
            <input
              id="ev-hours"
              v-model.number="form.hours"
              type="number"
              :min="partyDuration.min"
              :max="partyDuration.max"
              class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
            />
          </div>
        </div>

        <!-- Eigener Anlass -->
        <div v-if="isCustomOccasion">
          <label for="ev-custom-occasion" class="block text-sm font-medium text-sage-800">
            Welcher Anlass? *
          </label>
          <input
            id="ev-custom-occasion"
            v-model="form.customOccasion"
            type="text"
            placeholder="z. B. Abschlussfeier, Vereinsfest, Renteneintritt …"
            class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
          />
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

      <!-- Getränke -->
      <fieldset class="space-y-3">
        <legend class="font-serif text-lg font-semibold text-sage-900">3. Getränke</legend>
        <p class="text-sm text-sage-500">
          Die Getränkepauschale wird pro Person und Stunde berechnet und richtet sich nach der Dauer
          Ihrer Feier ({{ form.hours }} Std.).
        </p>
        <div class="space-y-3">
          <label
            v-for="opt in drinkOptions"
            :key="opt.id"
            class="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-sage-50"
            :class="form.drinkId === opt.id ? 'border-sage-400 bg-sage-50' : 'border-sage-200'"
          >
            <input
              v-model="form.drinkId"
              type="radio"
              name="drinks"
              :value="opt.id"
              class="mt-1 size-4 accent-waldhonig-500"
            />
            <span class="flex-1">
              <span class="flex items-baseline justify-between gap-2">
                <span class="font-medium text-sage-900">{{ opt.label }}</span>
                <span class="shrink-0 text-sm font-semibold text-waldhonig-700">
                  {{
                    opt.pricePerPersonPerHour > 0
                      ? `${opt.pricePerPersonPerHour} € / Pers. · Std.`
                      : '–'
                  }}
                </span>
              </span>
              <span class="mt-1 block text-sm text-sage-600">{{ opt.description }}</span>
            </span>
          </label>
        </div>
      </fieldset>

      <!-- Mobiliar & Ausstattung -->
      <fieldset class="space-y-6">
        <legend class="font-serif text-lg font-semibold text-sage-900">
          4. Mobiliar & Ausstattung
        </legend>
        <div v-for="group in furnitureGroups" :key="group.key" class="space-y-3">
          <p class="text-sm font-medium text-sage-800">{{ group.label }}</p>
          <div class="space-y-3">
            <label
              v-for="opt in group.options"
              :key="opt.id"
              class="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-sage-50"
              :class="form[group.key] === opt.id ? 'border-sage-400 bg-sage-50' : 'border-sage-200'"
            >
              <input
                v-model="form[group.key]"
                type="radio"
                :name="group.key"
                :value="opt.id"
                class="mt-1 size-4 accent-waldhonig-500"
              />
              <span class="flex-1">
                <span class="flex items-baseline justify-between gap-2">
                  <span class="font-medium text-sage-900">{{ opt.label }}</span>
                  <span class="shrink-0 text-sm font-semibold text-waldhonig-700">
                    {{ opt.pricePerPerson > 0 ? `+${opt.pricePerPerson} € / Person` : 'inklusive' }}
                  </span>
                </span>
                <span class="mt-1 block text-sm text-sage-600">{{ opt.description }}</span>
              </span>
            </label>
          </div>
        </div>
      </fieldset>

      <!-- Musik -->
      <fieldset class="space-y-3">
        <legend class="font-serif text-lg font-semibold text-sage-900">5. Musik</legend>
        <div class="space-y-3">
          <label
            v-for="opt in musicOptions"
            :key="opt.id"
            class="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-sage-50"
            :class="form.musicId === opt.id ? 'border-sage-400 bg-sage-50' : 'border-sage-200'"
          >
            <input
              v-model="form.musicId"
              type="radio"
              name="music"
              :value="opt.id"
              class="mt-1 size-4 accent-waldhonig-500"
            />
            <span class="flex-1">
              <span class="flex items-baseline justify-between gap-2">
                <span class="font-medium text-sage-900">{{ opt.label }}</span>
                <span class="shrink-0 text-sm font-semibold text-waldhonig-700">
                  {{ opt.price > 0 ? `${formatEuro(opt.price)} €` : '–' }}
                </span>
              </span>
              <span class="mt-1 block text-sm text-sage-600">{{ opt.description }}</span>
            </span>
          </label>
        </div>
      </fieldset>

      <!-- Dekoration -->
      <fieldset class="space-y-3">
        <legend class="font-serif text-lg font-semibold text-sage-900">6. Dekoration</legend>
        <div class="space-y-3">
          <label
            v-for="opt in decorationOptions"
            :key="opt.id"
            class="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-sage-50"
            :class="form.decorationId === opt.id ? 'border-sage-400 bg-sage-50' : 'border-sage-200'"
          >
            <input
              v-model="form.decorationId"
              type="radio"
              name="decoration"
              :value="opt.id"
              class="mt-1 size-4 accent-waldhonig-500"
            />
            <span class="flex-1">
              <span class="flex items-baseline justify-between gap-2">
                <span class="font-medium text-sage-900">{{ opt.label }}</span>
                <span class="shrink-0 text-sm font-semibold text-waldhonig-700">
                  {{ opt.pricePerPerson > 0 ? `${opt.pricePerPerson} € / Person` : '–' }}
                </span>
              </span>
              <span class="mt-1 block text-sm text-sage-600">{{ opt.description }}</span>
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
            <dt class="text-sage-700">Basispreis · {{ form.guests }} Gäste</dt>
            <dd class="font-medium text-sage-900">{{ formatEuro(basePrice) }} €</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sage-700">
              Catering · {{ form.guests }} × {{ selectedCatering?.pricePerPerson }} €
            </dt>
            <dd class="font-medium text-sage-900">{{ formatEuro(cateringTotal) }} €</dd>
          </div>
          <div v-if="drinksTotal > 0" class="flex justify-between text-sage-600">
            <dt>
              Getränke · {{ form.guests }} × {{ selectedDrink?.pricePerPersonPerHour }} € ×
              {{ form.hours }} h
            </dt>
            <dd>{{ formatEuro(drinksTotal) }} €</dd>
          </div>
          <div v-if="musicTotal > 0" class="flex justify-between text-sage-600">
            <dt>{{ selectedMusic?.label }}</dt>
            <dd>{{ formatEuro(musicTotal) }} €</dd>
          </div>
          <div v-if="tableTotal > 0" class="flex justify-between text-sage-600">
            <dt>
              {{ selectedTable?.label }} · {{ form.guests }} × {{ selectedTable?.pricePerPerson }} €
            </dt>
            <dd>{{ formatEuro(tableTotal) }} €</dd>
          </div>
          <div v-if="chairCoverTotal > 0" class="flex justify-between text-sage-600">
            <dt>Stuhlhussen · {{ form.guests }} × {{ selectedChairCover?.pricePerPerson }} €</dt>
            <dd>{{ formatEuro(chairCoverTotal) }} €</dd>
          </div>
          <div v-if="dishwareTotal > 0" class="flex justify-between text-sage-600">
            <dt>
              {{ selectedDishware?.label }} · {{ form.guests }} ×
              {{ selectedDishware?.pricePerPerson }} €
            </dt>
            <dd>{{ formatEuro(dishwareTotal) }} €</dd>
          </div>
          <div v-if="flooringTotal > 0" class="flex justify-between text-sage-600">
            <dt>
              {{ selectedFlooring?.label }} · {{ form.guests }} ×
              {{ selectedFlooring?.pricePerPerson }} €
            </dt>
            <dd>{{ formatEuro(flooringTotal) }} €</dd>
          </div>
          <div v-if="decorationTotal > 0" class="flex justify-between text-sage-600">
            <dt>Dekoration · {{ form.guests }} × {{ selectedDecoration?.pricePerPerson }} €</dt>
            <dd>{{ formatEuro(decorationTotal) }} €</dd>
          </div>
          <div class="flex items-baseline justify-between border-t border-waldhonig-200 pt-3">
            <dt class="font-semibold text-sage-900">Geschätzter Gesamtpreis</dt>
            <dd class="text-lg font-bold text-waldhonig-700">ca. {{ formatEuro(estimate) }} €</dd>
          </div>
          <p class="text-right text-xs text-sage-500">≈ {{ formatEuro(perGuest) }} € pro Person</p>
        </dl>
        <p class="mt-4 text-xs leading-relaxed text-sage-500">
          {{ config?.disclaimer }}
        </p>
      </div>

      <!-- Kontaktdaten -->
      <fieldset class="space-y-5">
        <legend class="font-serif text-lg font-semibold text-sage-900">7. Ihre Kontaktdaten</legend>
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
