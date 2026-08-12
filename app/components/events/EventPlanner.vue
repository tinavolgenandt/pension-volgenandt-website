<script setup lang="ts">
const appConfig = useAppConfig()
const { trackEvent } = useAnalytics()

// Pricing config lives in YAML (content/events/config.yml) so the owners can
// edit prices without touching code. All values are provisional Richtwerte.
const { data: config } = await useAsyncData('event-config', () =>
  queryCollection('eventConfig').first(),
)

// --- Types ----------------------------------------------------------------
// A single catalogue option. Different groups use different price fields
// (fixed `price`, `pricePerPerson`, or `pricePerPersonPerHour`); the unit on
// the group decides which one applies and how it scales.
interface CatalogOption {
  id: string
  label: string
  description: string
  detail?: string
  image?: string
  imageAlt?: string
  price?: number
  pricePerPerson?: number
  pricePerPersonPerHour?: number
}
type Unit = 'flat' | 'person' | 'personHour'
type SelectKey =
  | 'cateringId'
  | 'drinkId'
  | 'ceremonyId'
  | 'photographyId'
  | 'musicId'
  | 'decorationId'
  | 'cakeId'
  | 'photoboothId'
  | 'stylingId'
  | 'tableId'
  | 'chairCoverId'
  | 'dishwareId'
  | 'flooringId'
interface WizardGroup {
  key: SelectKey
  unit: Unit
  legend: string
  note?: string
  options: CatalogOption[]
}
interface WizardStep {
  title: string
  intro?: string
  groups: WizardGroup[]
}

// --- Config accessors ------------------------------------------------------
const opts = (key: keyof NonNullable<typeof config.value>): CatalogOption[] =>
  (config.value?.[key] as CatalogOption[] | undefined) ?? []

const occasions = computed(() => config.value?.occasions ?? [])
const guestRange = computed(() => config.value?.guestRange ?? { min: 10, max: 80, default: 40 })
const partyDuration = computed(() => config.value?.partyDuration ?? { min: 3, max: 12, default: 6 })
const basePackage = computed(() => config.value?.basePackage)

// --- Form state ------------------------------------------------------------
const form = reactive({
  occasionId: '',
  customOccasion: '',
  date: '',
  guests: guestRange.value.default,
  hours: partyDuration.value.default,
  cateringId: '',
  drinkId: '',
  ceremonyId: '',
  photographyId: '',
  musicId: '',
  decorationId: '',
  cakeId: '',
  photoboothId: '',
  stylingId: '',
  tableId: '',
  chairCoverId: '',
  dishwareId: '',
  flooringId: '',
  name: '',
  email: '',
  phone: '',
  notes: '',
})

// --- The catalogue steps (the "click-by-click" interview) ------------------
// Each step is one screen with an explanatory intro and its option cards. The
// large photo at the top of a step is NOT set here — it's the currently
// selected option's own `image` from content/events/config.yml (see
// `topOption` below), so it updates live as the visitor picks an option.
const optionSteps = computed<WizardStep[]>(() => [
  {
    title: 'Catering',
    intro:
      'Unser Partner richtet seine Küche bei uns ein und verwöhnt Ihre Gäste. Preis pro Person.',
    groups: [
      { key: 'cateringId', unit: 'person', legend: 'Catering', options: opts('cateringTiers') },
    ],
  },
  {
    title: 'Getränke',
    intro:
      'Getränke laufen über uns: Selbstbedienung oder Service am Tisch. Abgerechnet pro Person und Stunde.',
    groups: [
      {
        key: 'drinkId',
        unit: 'personHour',
        legend: 'Getränke',
        note: 'Der Preis gilt pro Person und Stunde und wird mit Ihrer Feierdauer multipliziert.',
        options: opts('drinkOptions'),
      },
    ],
  },
  {
    title: 'Freie Trauung',
    intro:
      'Heiraten Sie direkt bei uns im Garten: Ein Trauredner gestaltet Ihre freie Zeremonie. Sonst einfach bei „Keine Trauung“ lassen.',
    groups: [
      {
        key: 'ceremonyId',
        unit: 'flat',
        legend: 'Freie Trauung',
        options: opts('ceremonyOptions'),
      },
    ],
  },
  {
    title: 'Fotograf & Video',
    intro: 'Wir vermitteln erfahrene Fotografen und Videografen, fester Preis für den ganzen Tag.',
    groups: [
      {
        key: 'photographyId',
        unit: 'flat',
        legend: 'Fotograf & Video',
        options: opts('photographyOptions'),
      },
    ],
  },
  {
    title: 'Musik',
    intro: 'Eigene Playlist, Musikanlage oder kompletter DJ. Strom kommt aus dem Haus.',
    groups: [{ key: 'musicId', unit: 'flat', legend: 'Musik', options: opts('musicOptions') }],
  },
  {
    title: 'Dekoration',
    intro:
      'Von schlicht bis aufwändig: Tischdekoration passend zu Ihrer Feier. Abgerechnet pro Person.',
    groups: [
      {
        key: 'decorationId',
        unit: 'person',
        legend: 'Dekoration',
        options: opts('decorationOptions'),
      },
    ],
  },
  {
    title: 'Torte & Sweet Table',
    intro: 'Festtorte vom Konditor, auf Wunsch mit Sweet Table. Abgerechnet pro Person.',
    groups: [
      {
        key: 'cakeId',
        unit: 'person',
        legend: 'Torte & Sweet Table',
        options: opts('cakeOptions'),
      },
    ],
  },
  {
    title: 'Fotobox',
    intro:
      'Fotobox mit Requisiten und Sofortdruck, für viele Lacher und ein Gästebuch voller Erinnerungen.',
    groups: [
      { key: 'photoboothId', unit: 'flat', legend: 'Fotobox', options: opts('photoboothOptions') },
    ],
  },
  {
    title: 'Styling',
    intro: 'Professionelles Haar- und Make-up-Styling direkt vor Ort, mit Probetermin.',
    groups: [
      { key: 'stylingId', unit: 'flat', legend: 'Styling', options: opts('stylingOptions') },
    ],
  },
  {
    title: 'Mobiliar & Ausstattung',
    intro:
      'Tische, Stuhlhussen, Geschirr und Bodenbelag: Die erste Option ist im Basispreis enthalten, jede Aufwertung wird pro Person berechnet.',
    groups: [
      { key: 'tableId', unit: 'person', legend: 'Tische', options: opts('tableOptions') },
      {
        key: 'chairCoverId',
        unit: 'person',
        legend: 'Stuhlhussen',
        options: opts('chairCoverOptions'),
      },
      {
        key: 'dishwareId',
        unit: 'person',
        legend: 'Geschirr & Gläser',
        options: opts('dishwareOptions'),
      },
      {
        key: 'flooringId',
        unit: 'person',
        legend: 'Bodenbelag / Tanzfläche',
        options: opts('flooringOptions'),
      },
    ],
  },
])

// Every group across all steps — used for defaults, totals and the summary.
const allGroups = computed<WizardGroup[]>(() => optionSteps.value.flatMap((s) => s.groups))

// Seed each selection with its first option once config has loaded. The first
// option is deliberately the included/"Keine" one for opt-in extras.
watchEffect(() => {
  for (const group of allGroups.value) {
    if (!form[group.key] && group.options[0]) form[group.key] = group.options[0].id
  }
})

// --- Pricing ---------------------------------------------------------------
function rawPrice(opt: CatalogOption | undefined, unit: Unit): number {
  if (!opt) return 0
  if (unit === 'person') return opt.pricePerPerson ?? 0
  if (unit === 'personHour') return opt.pricePerPersonPerHour ?? 0
  return opt.price ?? 0
}
function optAmount(opt: CatalogOption | undefined, unit: Unit): number {
  const p = rawPrice(opt, unit)
  if (unit === 'person') return p * form.guests
  if (unit === 'personHour') return p * form.guests * form.hours
  return p
}
function unitPriceLabel(opt: CatalogOption, unit: Unit): string {
  const p = rawPrice(opt, unit)
  if (p === 0) return '–'
  if (unit === 'person') return `${p} € / Person`
  if (unit === 'personHour') return `${p} € / Pers. · Std.`
  return `${formatEuro(p)} €`
}
function selectedOption(group: WizardGroup): CatalogOption | undefined {
  return group.options.find((o) => o.id === form[group.key]) ?? group.options[0]
}

// The large photo at the top of a catalogue step: the currently selected
// option's own image (of the step's first/primary group), so it updates live
// as the visitor picks a different option.
const topOption = computed<CatalogOption | undefined>(() => {
  const group = activeStep.value?.groups[0]
  return group ? selectedOption(group) : undefined
})
function formatEuro(value: number): string {
  return value.toLocaleString('de-DE')
}

// Base price is banded by guest count (the included tent scales with size).
const basePrice = computed(() => {
  const bands = basePackage.value?.guestBands ?? []
  const band = bands.find((b) => form.guests <= b.maxGuests) ?? bands[bands.length - 1]
  return band?.price ?? 0
})

const estimate = computed(
  () =>
    basePrice.value +
    allGroups.value.reduce((sum, g) => sum + optAmount(selectedOption(g), g.unit), 0),
)
const perGuest = computed(() => (form.guests > 0 ? Math.round(estimate.value / form.guests) : 0))

// Line items for the summary + the enquiry email.
interface Line {
  label: string
  detail: string
  amount: number
}
const summaryLines = computed<Line[]>(() => {
  const lines: Line[] = [
    {
      label: basePackage.value?.label ?? 'Basispreis',
      detail: `${basePackage.value?.label ?? 'Basispreis'} · ${form.guests} Gäste`,
      amount: basePrice.value,
    },
  ]
  for (const group of allGroups.value) {
    const sel = selectedOption(group)
    if (!sel) continue
    const amount = optAmount(sel, group.unit)
    if (amount <= 0) continue
    let detail = `${group.legend}: ${sel.label}`
    if (group.unit === 'person')
      detail = `${group.legend}: ${sel.label} · ${form.guests} × ${sel.pricePerPerson} €`
    else if (group.unit === 'personHour')
      detail = `${group.legend}: ${sel.label} · ${form.guests} × ${sel.pricePerPersonPerHour} € × ${form.hours} h`
    lines.push({ label: group.legend, detail, amount })
  }
  return lines
})

// --- Occasion helpers ------------------------------------------------------
const isCustomOccasion = computed(() => form.occasionId === 'andere')
const occasionLabel = computed(() => {
  if (isCustomOccasion.value) return form.customOccasion.trim() || 'Eigener Anlass'
  return occasions.value.find((o) => o.id === form.occasionId)?.label ?? ''
})

// --- Wizard navigation -----------------------------------------------------
// Step 0 = intro/questions, 1..N = catalogue steps, N+1 = summary + contact.
const currentStep = ref(0)
const totalSteps = computed(() => optionSteps.value.length + 2)
const isIntro = computed(() => currentStep.value === 0)
const isSummary = computed(() => currentStep.value === totalSteps.value - 1)
const activeStep = computed<WizardStep | undefined>(() =>
  isIntro.value || isSummary.value ? undefined : optionSteps.value[currentStep.value - 1],
)
const progressPercent = computed(() =>
  Math.round((currentStep.value / (totalSteps.value - 1)) * 100),
)
const stepTitle = computed(() => {
  if (isIntro.value) return 'Ihr Anlass & Eckdaten'
  if (isSummary.value) return 'Zusammenfassung & Anfrage'
  return activeStep.value?.title ?? ''
})

const introValid = computed(
  () =>
    form.occasionId !== '' &&
    (!isCustomOccasion.value || form.customOccasion.trim() !== '') &&
    form.guests >= guestRange.value.min &&
    form.guests <= guestRange.value.max,
)

const scrollAnchor = ref<HTMLElement | null>(null)
function scrollToTop() {
  if (import.meta.client) scrollAnchor.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function next() {
  if (isIntro.value && !introValid.value) return
  if (currentStep.value < totalSteps.value - 1) {
    currentStep.value++
    scrollToTop()
  }
}
function prev() {
  if (currentStep.value > 0) {
    currentStep.value--
    scrollToTop()
  }
}

const minDate = ref('')
if (import.meta.client) {
  // Events need lead time — earliest selectable date is two weeks out.
  const d = new Date()
  d.setDate(d.getDate() + 14)
  minDate.value = d.toISOString().slice(0, 10)
}

// --- Submission ------------------------------------------------------------
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const errorMessage = ref('')

const isFormValid = computed(
  () =>
    introValid.value &&
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
  const lines = [
    `Anlass: ${occasionLabel.value || '–'}`,
    `Wunschtermin: ${form.date || 'noch offen'}`,
    `Gäste: ${form.guests}`,
    `Dauer: ca. ${form.hours} Stunden`,
    '',
    ...summaryLines.value.map((l) => `${l.detail} = ${formatEuro(l.amount)} €`),
    '',
    `Geschätzter Gesamtpreis: ca. ${formatEuro(estimate.value)} € (ca. ${formatEuro(perGuest.value)} € / Person)`,
    '',
    `Nachricht: ${form.notes || '–'}`,
  ]
  return lines.join('\n')
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
        // Catering runs exclusively over our partner Grillverein Thalwenden —
        // forward the complete request directly to them (see send-mail.php).
        _partner: form.cateringId ? 'grillverein-thalwenden' : undefined,
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

// Photo slots are wired into the config, but the real WebP files are dropped in
// later (see content/events/config.yml). Rather than render an <img> that might
// 404, we probe each source in the browser and only reveal it once it actually
// loads — so there is never a broken image, and a slot "lights up" on its own
// the moment the owner adds the file. Probing is lazy, per step.
const readyImages = reactive<Record<string, boolean>>({})
function probeImage(src?: string) {
  if (!src || readyImages[src] || !import.meta.client) return
  const img = new Image()
  img.onload = () => {
    readyImages[src] = true
  }
  img.src = src
}

// Probe the active step's photos (step hero + each option) when the step opens,
// so only files that exist are revealed.
watch(
  () => currentStep.value,
  () => {
    const step = activeStep.value
    if (!step) return
    for (const group of step.groups) for (const o of group.options) probeImage(o.image)
  },
  { immediate: true },
)

const inputClass =
  'mt-1 w-full rounded-lg border border-sage-300 px-4 py-3 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 focus:outline-none'
</script>

<template>
  <div ref="scrollAnchor" class="scroll-mt-28">
    <!-- Success state -->
    <div v-if="isSubmitted" class="rounded-xl bg-sage-50 p-8 text-center">
      <Icon name="ph:check-circle-duotone" class="mx-auto mb-4 size-12 text-sage-600" />
      <h3 class="font-serif text-xl font-semibold text-sage-900">Vielen Dank für Ihre Anfrage!</h3>
      <p class="mx-auto mt-2 max-w-md text-sage-700">
        Wir haben Ihre Anfrage erhalten und melden uns innerhalb von 24 Stunden persönlich bei
        Ihnen, um Ihre Feier in Ruhe zu besprechen.
      </p>
    </div>

    <div v-else class="overflow-hidden rounded-2xl border border-sage-200 bg-white shadow-sm">
      <!-- Progress header -->
      <div class="border-b border-sage-100 bg-sage-50/60 px-6 py-4">
        <div class="flex items-baseline justify-between">
          <p class="text-xs font-medium tracking-wide text-waldhonig-600 uppercase">
            Schritt {{ currentStep + 1 }} von {{ totalSteps }}
          </p>
          <p class="text-xs text-sage-500">{{ progressPercent }} %</p>
        </div>
        <h3 class="mt-1 font-serif text-lg font-semibold text-sage-900">{{ stepTitle }}</h3>
        <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-sage-200">
          <div
            class="h-full rounded-full bg-waldhonig-500 transition-all duration-300"
            :style="{ width: `${progressPercent}%` }"
          />
        </div>
      </div>

      <div class="p-6 md:p-8">
        <!-- ============ STEP 0: Intro & Eckdaten ============ -->
        <div v-if="isIntro" class="space-y-8">
          <div v-if="basePackage" class="rounded-xl border border-sage-200 bg-sage-50/60 p-6">
            <h4 class="font-serif text-lg font-semibold text-sage-900">{{ basePackage.label }}</h4>
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

          <div>
            <p class="text-sage-700">
              Beantworten Sie zunächst ein paar kurze Fragen. Danach führen wir Sie Schritt für
              Schritt durch alle Möglichkeiten. Bei jeder Auswahl sehen Sie sofort, was sie für Ihre
              Feier bedeutet und was sie kostet.
            </p>

            <div class="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label for="ev-occasion" class="block text-sm font-medium text-sage-800">
                  Anlass *
                </label>
                <select id="ev-occasion" v-model="form.occasionId" :class="inputClass">
                  <option value="" disabled>Bitte wählen</option>
                  <option v-for="o in occasions" :key="o.id" :value="o.id">{{ o.label }}</option>
                  <option value="andere">Anderer Anlass …</option>
                </select>
              </div>

              <div v-if="isCustomOccasion">
                <label for="ev-custom-occasion" class="block text-sm font-medium text-sage-800">
                  Welcher Anlass? *
                </label>
                <input
                  id="ev-custom-occasion"
                  v-model="form.customOccasion"
                  type="text"
                  placeholder="z. B. Abschlussfeier, Vereinsfest …"
                  :class="inputClass"
                />
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
                  :class="inputClass"
                />
              </div>

              <div>
                <label for="ev-guests" class="block text-sm font-medium text-sage-800">
                  Gäste *
                  <span class="text-sage-400">({{ guestRange.min }}–{{ guestRange.max }})</span>
                </label>
                <input
                  id="ev-guests"
                  v-model.number="form.guests"
                  type="number"
                  :min="guestRange.min"
                  :max="guestRange.max"
                  :class="inputClass"
                />
              </div>

              <div>
                <label for="ev-hours" class="block text-sm font-medium text-sage-800">
                  Dauer (Std.)
                  <span class="text-sage-400">
                    ({{ partyDuration.min }}–{{ partyDuration.max }})
                  </span>
                </label>
                <input
                  id="ev-hours"
                  v-model.number="form.hours"
                  type="number"
                  :min="partyDuration.min"
                  :max="partyDuration.max"
                  :class="inputClass"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- ============ STEPS 1..N: Catalogue ============ -->
        <div v-else-if="activeStep" class="space-y-6">
          <NuxtImg
            v-if="topOption?.image && readyImages[topOption.image]"
            :src="topOption.image"
            :alt="topOption.imageAlt ?? topOption.label"
            class="h-48 w-full rounded-xl object-cover md:h-56"
            width="800"
            height="450"
            loading="lazy"
          />
          <p v-if="activeStep.intro" class="leading-relaxed text-sage-700">
            {{ activeStep.intro }}
          </p>

          <fieldset v-for="group in activeStep.groups" :key="group.key" class="space-y-3">
            <legend v-if="activeStep.groups.length > 1" class="text-sm font-semibold text-sage-800">
              {{ group.legend }}
            </legend>
            <p v-if="group.note" class="text-sm text-sage-500">{{ group.note }}</p>
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
                class="mt-1 size-4 shrink-0 accent-waldhonig-500"
              />
              <NuxtImg
                v-if="opt.image && readyImages[opt.image]"
                :src="opt.image"
                :alt="opt.imageAlt ?? opt.label"
                class="h-16 w-20 shrink-0 rounded-md object-cover"
                width="160"
                height="128"
                loading="lazy"
              />
              <span class="flex-1">
                <span class="flex items-baseline justify-between gap-2">
                  <span class="font-medium text-sage-900">{{ opt.label }}</span>
                  <span class="shrink-0 text-sm font-semibold text-waldhonig-700">
                    {{ unitPriceLabel(opt, group.unit) }}
                  </span>
                </span>
                <span class="mt-1 block text-sm text-sage-600">{{ opt.description }}</span>
                <span
                  v-if="opt.detail"
                  class="mt-2 block border-l-2 border-sage-200 pl-3 text-sm text-sage-500 italic"
                >
                  {{ opt.detail }}
                </span>
              </span>
            </label>
          </fieldset>
        </div>

        <!-- ============ STEP N+1: Summary & contact ============ -->
        <form v-else class="space-y-8" @submit.prevent="handleSubmit">
          <div class="rounded-xl bg-waldhonig-50 p-6">
            <div class="flex items-center justify-between">
              <h4 class="font-serif text-base font-semibold text-sage-900">Ihr Richtwert</h4>
              <span
                class="rounded-full bg-waldhonig-100 px-3 py-1 text-xs font-medium text-waldhonig-700"
              >
                unverbindlich
              </span>
            </div>
            <dl class="mt-4 space-y-2 text-sm">
              <div
                v-for="(line, i) in summaryLines"
                :key="i"
                class="flex justify-between gap-4"
                :class="i === 0 ? 'text-sage-800' : 'text-sage-600'"
              >
                <dt>{{ line.detail }}</dt>
                <dd class="shrink-0 font-medium">{{ formatEuro(line.amount) }} €</dd>
              </div>
              <div class="flex items-baseline justify-between border-t border-waldhonig-200 pt-3">
                <dt class="font-semibold text-sage-900">Geschätzter Gesamtpreis</dt>
                <dd class="text-xl font-bold text-waldhonig-700">
                  ca. {{ formatEuro(estimate) }} €
                </dd>
              </div>
              <p class="text-right text-xs text-sage-500">
                ≈ {{ formatEuro(perGuest) }} € pro Person
              </p>
            </dl>
            <p class="mt-4 text-xs leading-relaxed text-sage-500">{{ config?.disclaimer }}</p>
          </div>

          <fieldset class="space-y-5">
            <legend class="font-serif text-lg font-semibold text-sage-900">
              Ihre Kontaktdaten
            </legend>
            <p class="text-sm text-sage-600">
              Senden Sie uns Ihre Zusammenstellung. Wir melden uns innerhalb von 24 Stunden mit
              einem persönlichen, unverbindlichen Angebot.
            </p>
            <div class="grid gap-5 sm:grid-cols-2">
              <div>
                <label for="ev-name" class="block text-sm font-medium text-sage-800">Name *</label>
                <input
                  id="ev-name"
                  v-model="form.name"
                  type="text"
                  required
                  autocomplete="name"
                  :class="inputClass"
                />
              </div>
              <div>
                <label for="ev-email" class="block text-sm font-medium text-sage-800">
                  E-Mail *
                </label>
                <input
                  id="ev-email"
                  v-model="form.email"
                  type="email"
                  required
                  autocomplete="email"
                  :class="inputClass"
                />
              </div>
            </div>
            <div>
              <label for="ev-phone" class="block text-sm font-medium text-sage-800">
                Telefon *
              </label>
              <input
                id="ev-phone"
                v-model="form.phone"
                type="tel"
                required
                autocomplete="tel"
                :class="inputClass"
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
                :class="inputClass"
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
            <Icon
              v-if="isSubmitting"
              name="ph:spinner"
              class="mr-2 inline-block size-5 animate-spin"
            />
            {{ isSubmitting ? 'Wird gesendet …' : 'Unverbindliche Anfrage senden' }}
          </button>
        </form>
      </div>

      <!-- Sticky running total + navigation -->
      <div
        class="sticky bottom-0 z-10 flex items-center justify-between gap-4 border-t border-sage-200 bg-white/95 px-6 py-4 backdrop-blur"
      >
        <div>
          <p class="text-xs text-sage-500">
            {{ isSummary ? 'Gesamtpreis (Richtwert)' : 'Zwischensumme' }}
          </p>
          <p class="font-serif text-xl font-bold text-waldhonig-700">
            ca. {{ formatEuro(estimate) }} €
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="currentStep > 0"
            type="button"
            class="rounded-lg border border-sage-300 px-4 py-2.5 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-50"
            @click="prev"
          >
            Zurück
          </button>
          <button
            v-if="!isSummary"
            type="button"
            :disabled="isIntro && !introValid"
            class="rounded-lg bg-waldhonig-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-waldhonig-600 disabled:cursor-not-allowed disabled:opacity-50"
            @click="next"
          >
            Weiter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
