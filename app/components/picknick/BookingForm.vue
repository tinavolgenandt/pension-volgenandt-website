<script setup lang="ts">
const appConfig = useAppConfig()
const router = useRouter()
const { isReady: paypalReady } = usePayPal()

const KIDS_PRICE = 9.5
const EXTRA_DRINK_PRICE = 3

const timeSlots = Array.from({ length: 49 }, (_, i) => {
  const h = Math.floor(i / 4) + 8
  const m = (i % 4) * 15
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}).filter((t) => t <= '20:00')

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

const brunchDrinkOptions = [
  { id: 'kaffee', label: 'Kaffee' },
  { id: 'tee', label: 'Tee' },
]

const kaffeeVarianten = [
  { id: 'schwarz', label: 'Schwarz' },
  { id: 'milch', label: 'Mit Milch' },
  { id: 'hafermilch', label: 'Hafermilch (+1 €)' },
]

const teeVarianten = [
  { id: 'schwarztee', label: 'Schwarztee' },
  { id: 'gruentee', label: 'Grüntee' },
  { id: 'fruechtetee', label: 'Früchtetee' },
  { id: 'kraeutertee', label: 'Kräutertee' },
  { id: 'pfefferminztee', label: 'Pfefferminztee' },
  { id: 'kamillentee', label: 'Kamillentee' },
]

const abendDrinkOptions = [
  { id: 'sekt', label: 'Sekt' },
  { id: 'weiss-wein', label: 'Weißwein' },
  { id: 'rot-wein', label: 'Rotwein' },
  { id: 'bier', label: 'Bier' },
  { id: 'aperol', label: 'Aperol Spritz' },
  { id: 'sekt-alkoholfrei', label: 'Alkoholfreier Sekt' },
  { id: 'bier-alkoholfrei', label: 'Alkoholfreies Bier' },
]

const kidsKorbInhalt = [
  '1 Brötchen mit Marmelade oder Nutella',
  'Mini-Joghurt',
  'Apfelschorle',
  'Obstspieß (saisonal)',
  '1 hartgekochtes Ei',
  'Kleine Überraschung',
]

const extrasOptions = [
  {
    id: 'vegetarisch',
    label: 'Ausschließlich vegetarische Auswahl',
    price: 0,
    unit: '',
    brunchOnly: false,
  },
  { id: 'hummus', label: 'Hausgemachter Hummus', price: 2, unit: '', brunchOnly: false },
  {
    id: 'lachs',
    label: 'Lachs mit Frischkäse & Dill',
    price: 4,
    unit: 'Person',
    brunchOnly: false,
  },
  { id: 'croissants', label: 'Croissant', price: 2, unit: 'Stück', brunchOnly: false },
  { id: 'sekt', label: 'Sekt', price: 3, unit: 'Person', brunchOnly: true },
  { id: 'decke-extra', label: 'Extra Decke', price: 2, unit: 'Stück', brunchOnly: false },
  {
    id: 'blumenstrauss',
    label: 'Kleiner Blumenstrauß',
    price: 6,
    unit: 'Stück',
    brunchOnly: false,
  },
]

const isQuantifiable = (extra: (typeof extrasOptions)[0]) => extra.unit !== ''

const filteredExtras = computed(() => extrasOptions.filter((e) => !e.brunchOnly || isBrunch.value))

function extraPriceLabel(extra: (typeof extrasOptions)[0]): string {
  if (extra.price === 0) return 'kostenlos'
  if (extra.unit) return `+${extra.price} € / ${extra.unit}`
  return `+${extra.price} €`
}

function extraCost(extra: (typeof extrasOptions)[0], qty: number): number {
  if (extra.unit === 'Person') return extra.price * qty
  return extra.price * qty
}

// Compute min date on client only to avoid SSR/client hydration mismatch
// (SSR bakes in build-time date, client computes current date)
const minDate = ref('')
if (import.meta.client) {
  const d = new Date()
  // Nach 12 Uhr: übermorgen (keine 24h mehr bis morgen früh)
  d.setDate(d.getDate() + (d.getHours() >= 12 ? 2 : 1))
  minDate.value = d.toISOString().slice(0, 10)
}

// Load blocked dates (days with 2+ confirmed baskets)
const blockedDates = ref<string[]>([])
if (import.meta.client) {
  fetch('https://api.pension-volgenandt.de/get-blocked-dates.php')
    .then((r) => r.json())
    .then((data) => {
      blockedDates.value = data.blockedDates ?? []
    })
    .catch(() => {})
}
const isDateBlocked = computed(() => blockedDates.value.includes(form.date))

const form = reactive({
  date: '',
  time: '',
  packageId: 'brunch',
  adults: 2,
  kids: 0,
  drinks: {} as Record<string, number>,
  kaffeeType: 'schwarz',
  teeType: 'fruechtetee',
  extras: {} as Record<string, number>,
  name: '',
  email: '',
  phone: '',
  notes: '',
})

const isBrunch = computed(() => form.packageId === 'brunch')
const activeDrinkOptions = computed(() => (isBrunch.value ? brunchDrinkOptions : abendDrinkOptions))

watch(
  () => form.packageId,
  () => {
    form.drinks = {}
  },
)

const totalDrinks = computed(() => Object.values(form.drinks).reduce((sum, n) => sum + n, 0))
const includedDrinks = computed(() => form.adults)
const extraDrinkCount = computed(() => Math.max(0, totalDrinks.value - includedDrinks.value))

const isSubmitting = ref(false)
const errorMessage = ref('')

const selectedPackage = computed(
  () => packages.value.find((p) => p.id === form.packageId) ?? packages.value[0],
)

const adultsTotal = computed(() => (selectedPackage.value?.price ?? 19) * form.adults)
const kidsTotal = computed(() => KIDS_PRICE * form.kids)
const hafermilchExtra = computed(() =>
  form.kaffeeType === 'hafermilch' ? (form.drinks['kaffee'] ?? 0) : 0,
)
const drinksExtra = computed(
  () => hafermilchExtra.value + extraDrinkCount.value * EXTRA_DRINK_PRICE,
)
const baseTotal = computed(() => adultsTotal.value + kidsTotal.value + drinksExtra.value)
const totalPersons = computed(() => form.adults + form.kids)

const selectedExtrasWithCost = computed(() =>
  extrasOptions
    .filter((e) => (form.extras[e.id] ?? 0) > 0 && e.price > 0)
    .map((e) => {
      const qty = form.extras[e.id] ?? 0
      return { ...e, qty, cost: extraCost(e, qty) }
    }),
)
const extrasTotal = computed(() => selectedExtrasWithCost.value.reduce((sum, e) => sum + e.cost, 0))
const grandTotal = computed(() => baseTotal.value + extrasTotal.value)

const isFormValid = computed(
  () =>
    form.date !== '' &&
    !isDateBlocked.value &&
    form.time !== '' &&
    form.name.trim() !== '' &&
    form.email.trim() !== '' &&
    form.phone.trim() !== '' &&
    totalDrinks.value >= form.adults &&
    grandTotal.value > 0,
)

const beverageText = computed(() => {
  const parts: string[] = []
  const kaffeeCount = form.drinks['kaffee'] ?? 0
  const teeCount = form.drinks['tee'] ?? 0
  if (isBrunch.value) {
    const kaffeeLabel = kaffeeVarianten.find((k) => k.id === form.kaffeeType)?.label ?? 'Schwarz'
    const teeLabel = teeVarianten.find((t) => t.id === form.teeType)?.label ?? form.teeType
    if (kaffeeCount > 0) parts.push(`${kaffeeCount}× Kaffee (${kaffeeLabel})`)
    if (teeCount > 0) parts.push(`${teeCount}× Tee (${teeLabel})`)
  } else {
    for (const d of abendDrinkOptions) {
      const count = form.drinks[d.id] ?? 0
      if (count > 0) parts.push(`${count}× ${d.label}`)
    }
  }
  return parts.length > 0 ? parts.join(', ') : '–'
})

function buildMessageText(): string {
  const selectedExtras = extrasOptions.filter((e) => (form.extras[e.id] ?? 0) > 0)
  const extrasText =
    selectedExtras.length > 0
      ? selectedExtras
          .map((e) => {
            const qty = form.extras[e.id] ?? 1
            return qty > 1
              ? `${qty}× ${e.label} (${extraPriceLabel(e)})`
              : `${e.label} (${extraPriceLabel(e)})`
          })
          .join(', ')
      : 'keine'

  return [
    `Datum: ${form.date}`,
    `Uhrzeit: ${form.time} Uhr`,
    `Paket: ${selectedPackage.value?.name} (${selectedPackage.value?.timeSlot})`,
    `Erwachsene: ${form.adults}`,
    form.kids > 0 ? `Kinder: ${form.kids}` : null,
    `Getränke: ${beverageText.value}`,
    `Extras: ${extrasText}`,
    `Sonderwünsche: ${form.notes || '–'}`,
    '',
    `Erwachsene: ${form.adults} × ${selectedPackage.value?.price ?? 19} € = ${adultsTotal.value} €`,
    form.kids > 0
      ? `Kinder: ${form.kids} × ${KIDS_PRICE.toLocaleString('de-DE', { minimumFractionDigits: 2 })} € = ${kidsTotal.value.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`
      : null,
    extraDrinkCount.value > 0
      ? `Extra-Getränke: ${extraDrinkCount.value} × ${EXTRA_DRINK_PRICE} € = +${extraDrinkCount.value * EXTRA_DRINK_PRICE} €`
      : null,
    hafermilchExtra.value > 0 ? `Hafermilch-Aufpreis: +${hafermilchExtra.value} €` : null,
    extrasTotal.value > 0 ? `Extras: ${extrasTotal.value} €` : null,
    `Gesamt: ${grandTotal.value.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`,
    '',
    `Name: ${form.name}`,
    `E-Mail: ${form.email}`,
    `Telefon: ${form.phone}`,
  ]
    .filter(Boolean)
    .join('\n')
}

function buildSubject(): string {
  return `Picknick-Buchung: ${selectedPackage.value?.name} am ${form.date} (${form.adults} Erw.${form.kids > 0 ? `, ${form.kids} Kind.` : ''})`
}

// PayPal button rendering
const paypalContainer = ref<HTMLElement | null>(null)
const paypalRendered = ref(false)

function renderPayPalButton() {
  if (!window.paypal || !paypalContainer.value || paypalRendered.value) return

  paypalRendered.value = true
  window.paypal
    .Buttons({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createOrder: (_data: any, actions: any) => {
        errorMessage.value = ''
        if (!isFormValid.value) {
          errorMessage.value =
            'Bitte füllen Sie alle Pflichtfelder aus und wählen Sie die Getränke.'
          return Promise.reject(new Error('Form invalid'))
        }
        return actions.order.create({
          purchase_units: [
            {
              amount: { value: grandTotal.value.toFixed(2), currency_code: 'EUR' },
              description: `Picknick ${selectedPackage.value?.name} – ${form.adults} Pers.`,
            },
          ],
        })
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onApprove: async (data: { orderID: string }, actions: any) => {
        isSubmitting.value = true
        errorMessage.value = ''

        try {
          // Capture the payment first
          await actions.order.capture()
          const response = await fetch(appConfig.picknickBookingUrl as string, {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paypalOrderId: data.orderID,
              amount: grandTotal.value,
              bookingDate: form.date,
              name: form.name,
              email: form.email,
              phone: form.phone,
              message: buildMessageText(),
              _subject: buildSubject(),
            }),
          })

          const result = await response.json()

          if (response.ok && result.ok) {
            await router.push({
              path: '/picknick/danke/',
              query: {
                betrag: String(grandTotal.value),
                personen: String(totalPersons.value),
                paket: selectedPackage.value?.name ?? '',
                txn: result.transactionId ?? '',
              },
            })
          } else if (result.errors) {
            errorMessage.value = result.errors.map((e: { message: string }) => e.message).join(', ')
          } else {
            errorMessage.value =
              result.error || 'Leider ist ein Fehler aufgetreten. Bitte kontaktieren Sie uns.'
          }
        } catch {
          errorMessage.value =
            'Zahlung erfolgreich, aber Übermittlung fehlgeschlagen. Bitte kontaktieren Sie uns unter kontakt@pension-volgenandt.de.'
        } finally {
          isSubmitting.value = false
        }
      },
      onCancel: () => {
        errorMessage.value = 'Zahlung abgebrochen. Sie können es erneut versuchen.'
      },
      onError: () => {
        errorMessage.value =
          'Bei der Zahlung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
      },
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'pay',
      },
    })
    .render(paypalContainer.value)
}

// Render PayPal button when SDK is ready and container is mounted
if (import.meta.client) {
  watch(
    [paypalReady, paypalContainer],
    ([ready, container]) => {
      if (ready && container && !paypalRendered.value) {
        nextTick(() => renderPayPalButton())
      }
    },
    { immediate: true },
  )
}
</script>

<template>
  <div class="space-y-8">
    <!-- Datum & Paket -->
    <fieldset class="space-y-5">
      <legend class="font-serif text-lg font-semibold text-sage-900">Ihr Wunschtermin</legend>

      <div class="grid gap-5 sm:grid-cols-3">
        <div>
          <label for="pk-date" class="block text-sm font-medium text-sage-800">Datum *</label>
          <input
            id="pk-date"
            v-model="form.date"
            type="date"
            name="date"
            :min="minDate"
            class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
          />
          <p v-if="isDateBlocked" class="mt-1 text-xs font-medium text-red-600">
            Dieses Datum ist leider ausgebucht. Bitte wählen Sie einen anderen Tag.
          </p>
        </div>

        <div>
          <label for="pk-time" class="block text-sm font-medium text-sage-800">Uhrzeit *</label>
          <select
            id="pk-time"
            v-model="form.time"
            name="time"
            class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
          >
            <option value="" disabled>Bitte wählen</option>
            <option v-for="t in timeSlots" :key="t" :value="t">{{ t }} Uhr</option>
          </select>
        </div>

        <div>
          <label for="pk-package" class="block text-sm font-medium text-sage-800">Paket *</label>
          <select
            id="pk-package"
            v-model="form.packageId"
            name="paket"
            class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
          >
            <option v-for="pkg in packages" :key="pkg.id" :value="pkg.id">
              {{ pkg.name }}
            </option>
          </select>
        </div>
      </div>

      <p class="text-xs text-sage-500">Max. 4 Personen pro Korb (inkl. Kinder).</p>
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
            min="1"
            :max="4 - form.kids"
            class="mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none"
          />
        </div>
        <div>
          <label for="pk-kids" class="block text-sm font-medium text-sage-800">
            Kinder <span class="text-sage-400">(bis 6 Jahre)</span>
          </label>
          <input
            id="pk-kids"
            v-model.number="form.kids"
            type="number"
            name="kinder"
            min="0"
            :max="4 - form.adults"
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

    <!-- Getränke -->
    <fieldset class="space-y-4">
      <legend class="font-serif text-lg font-semibold text-sage-900">Getränke</legend>
      <p class="text-sm text-sage-500">
        1 Getränk pro Person inklusive. Jedes weitere +{{ EXTRA_DRINK_PRICE }} €.
        <span v-if="totalDrinks < form.adults" class="font-medium text-waldhonig-600">
          (noch {{ form.adults - totalDrinks }} wählen)
        </span>
        <span v-if="extraDrinkCount > 0" class="font-medium text-waldhonig-600">
          ({{ extraDrinkCount }} Extra = +{{
            (extraDrinkCount * EXTRA_DRINK_PRICE).toLocaleString('de-DE')
          }}
          €)
        </span>
      </p>
      <div class="space-y-2">
        <div
          v-for="drink in activeDrinkOptions"
          :key="drink.id"
          class="rounded-lg border px-4 py-3"
          :class="
            (form.drinks[drink.id] ?? 0) > 0 ? 'border-sage-400 bg-sage-50' : 'border-sage-200'
          "
        >
          <div class="flex items-center justify-between">
            <span class="text-sm text-sage-800">{{ drink.label }}</span>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="flex size-8 items-center justify-center rounded-full border border-sage-300 text-sage-600 transition-colors hover:bg-sage-100 disabled:opacity-30"
                :disabled="(form.drinks[drink.id] ?? 0) <= 0"
                @click="form.drinks[drink.id] = (form.drinks[drink.id] ?? 0) - 1"
              >
                −
              </button>
              <span class="w-6 text-center text-sm font-semibold text-sage-900">
                {{ form.drinks[drink.id] ?? 0 }}
              </span>
              <button
                type="button"
                class="flex size-8 items-center justify-center rounded-full border border-sage-300 text-sage-600 transition-colors hover:bg-sage-100 disabled:opacity-30"
                @click="form.drinks[drink.id] = (form.drinks[drink.id] ?? 0) + 1"
              >
                +
              </button>
            </div>
          </div>
          <!-- Kaffee-Variante Dropdown -->
          <div
            v-if="isBrunch && drink.id === 'kaffee' && (form.drinks['kaffee'] ?? 0) > 0"
            class="mt-3"
          >
            <select
              v-model="form.kaffeeType"
              class="w-full rounded-lg border border-sage-300 px-3 py-2 text-sm focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none sm:w-56"
            >
              <option v-for="v in kaffeeVarianten" :key="v.id" :value="v.id">
                {{ v.label }}
              </option>
            </select>
          </div>
          <!-- Tee-Variante Dropdown -->
          <div v-if="isBrunch && drink.id === 'tee' && (form.drinks['tee'] ?? 0) > 0" class="mt-3">
            <select
              v-model="form.teeType"
              class="w-full rounded-lg border border-sage-300 px-3 py-2 text-sm focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none sm:w-56"
            >
              <option v-for="v in teeVarianten" :key="v.id" :value="v.id">
                {{ v.label }}
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
        <template v-for="extra in filteredExtras" :key="extra.id">
          <!-- Checkbox für ja/nein-Extras -->
          <label
            v-if="!isQuantifiable(extra)"
            class="flex cursor-pointer items-start gap-3 rounded-lg border border-sage-200 p-3 hover:bg-sage-50"
            :class="{ 'border-sage-400 bg-sage-50': (form.extras[extra.id] ?? 0) > 0 }"
          >
            <input
              type="checkbox"
              :checked="(form.extras[extra.id] ?? 0) > 0"
              class="mt-0.5 size-4 accent-waldhonig-500"
              @change="form.extras[extra.id] = (form.extras[extra.id] ?? 0) > 0 ? 0 : 1"
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

          <!-- +/− für Stück-Extras -->
          <div
            v-else
            class="flex items-center justify-between rounded-lg border px-3 py-3"
            :class="
              (form.extras[extra.id] ?? 0) > 0 ? 'border-sage-400 bg-sage-50' : 'border-sage-200'
            "
          >
            <span class="text-sm text-sage-800">
              {{ extra.label }}
              <span class="ml-1 text-xs text-waldhonig-600"> ({{ extraPriceLabel(extra) }}) </span>
            </span>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="flex size-7 items-center justify-center rounded-full border border-sage-300 text-sage-600 transition-colors hover:bg-sage-100 disabled:opacity-30"
                :disabled="(form.extras[extra.id] ?? 0) <= 0"
                @click="form.extras[extra.id] = (form.extras[extra.id] ?? 0) - 1"
              >
                −
              </button>
              <span class="w-5 text-center text-sm font-semibold text-sage-900">
                {{ form.extras[extra.id] ?? 0 }}
              </span>
              <button
                type="button"
                class="flex size-7 items-center justify-center rounded-full border border-sage-300 text-sage-600 transition-colors hover:bg-sage-100"
                @click="form.extras[extra.id] = (form.extras[extra.id] ?? 0) + 1"
              >
                +
              </button>
            </div>
          </div>
        </template>
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
        <div v-if="extraDrinkCount > 0" class="flex justify-between text-sage-600">
          <dt>{{ extraDrinkCount }} Extra-Getränke (à {{ EXTRA_DRINK_PRICE }} €)</dt>
          <dd>
            +
            {{
              (extraDrinkCount * EXTRA_DRINK_PRICE).toLocaleString('de-DE', {
                minimumFractionDigits: 2,
              })
            }}
            €
          </dd>
        </div>
        <div v-if="hafermilchExtra > 0" class="flex justify-between text-sage-600">
          <dt>Hafermilch-Aufpreis</dt>
          <dd>+ {{ hafermilchExtra.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €</dd>
        </div>
        <div
          v-for="extra in selectedExtrasWithCost"
          :key="extra.id"
          class="flex justify-between text-sage-600"
        >
          <dt>{{ extra.qty > 1 ? `${extra.qty}× ` : '' }}{{ extra.label }}</dt>
          <dd>+ {{ extra.cost.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €</dd>
        </div>
        <div class="flex justify-between border-t border-waldhonig-200 pt-2">
          <dt class="font-semibold text-sage-900">Zu zahlen</dt>
          <dd class="text-base font-bold text-waldhonig-700">
            {{ grandTotal.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €
          </dd>
        </div>
        <p class="mt-2 text-xs text-sage-500">
          Zusätzlich: 100 € Korbpfand in bar bei Abholung (bei Rückgabe zurück).
        </p>
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

    <!-- PayPal Button -->
    <div v-if="paypalReady" ref="paypalContainer" class="min-h-[55px]" />
    <div v-else class="rounded-lg bg-sage-100 p-4 text-center text-sm text-sage-600">
      <p>PayPal wird geladen...</p>
    </div>
    <p v-if="paypalReady && !isFormValid" class="text-center text-sm text-sage-500">
      Bitte füllen Sie alle Pflichtfelder aus, um bezahlen zu können.
    </p>

    <!-- Loading overlay after payment -->
    <div
      v-if="isSubmitting"
      class="rounded-lg bg-waldhonig-50 p-4 text-center text-sm text-sage-700"
    >
      <Icon name="ph:spinner" class="mr-2 inline-block size-4 animate-spin" />
      Buchung wird verarbeitet...
    </div>
  </div>
</template>
