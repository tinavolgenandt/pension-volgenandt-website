<script setup lang="ts">
definePageMeta({
  breadcrumb: { label: 'Planungshilfen' },
})

useSeoMeta({
  title: 'Planungshilfen für Ihr Fest | Pension Volgenandt',
  description:
    'Zimmerbelegungsplan, Anfahrt & Parken, Ablaufplan und Checkliste für Ihre exklusive Feier bei Pension Volgenandt.',
  robots: 'noindex, nofollow',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://www.pension-volgenandt.de/feiern/planungshilfen/' }],
})

const appConfig = useAppConfig()

type SlotGroup = { label?: string; rows: string[] }
type Unit = { name: string; badge: string; groups: SlotGroup[]; note?: string }

const units: Unit[] = [
  {
    name: 'Ferienwohnung Kuhwiese',
    badge: '4 Plätze · 2 Bett + 2 Schlafcouch',
    groups: [
      {
        rows: [
          'Doppelbett – Platz 1',
          'Doppelbett – Platz 2',
          'Schlafcouch – Platz 1',
          'Schlafcouch – Platz 2',
        ],
      },
    ],
  },
  {
    name: 'Ferienwohnung Schöne Aussicht',
    badge: '9 Plätze · 4 Bett + 5 Schlafcouch',
    groups: [
      {
        label: 'Schlafzimmer 1',
        rows: [
          'Doppelbett – Platz 1',
          'Doppelbett – Platz 2',
          'Schlafcouch – Platz 1',
          'Schlafcouch – Platz 2',
        ],
      },
      {
        label: 'Schlafzimmer 2',
        rows: ['Doppelbett – Platz 1', 'Doppelbett – Platz 2', 'Schlafcouch (max. 1 Person)'],
      },
      { label: 'Wohnzimmer', rows: ['Schlafcouch – Platz 1', 'Schlafcouch – Platz 2'] },
    ],
  },
  {
    name: 'Omas Wohnung',
    badge: '4 Plätze · 4 Bett',
    groups: [
      { label: 'Zimmer 1', rows: ['Doppelbett – Platz 1', 'Doppelbett – Platz 2'] },
      { label: 'Zimmer 2', rows: ['Bett 140 – Platz 1', 'Bett 140 – Platz 2'] },
    ],
    note: 'Wohnzimmer: keine Schlafmöglichkeit.',
  },
  {
    name: 'Zimmer 1 · Wohlfühl-Appartement',
    badge: '4 Plätze · 2 Bett + 2 Schlafcouch',
    groups: [
      {
        rows: [
          'Doppelbett – Platz 1',
          'Doppelbett – Platz 2',
          'Schlafcouch – Platz 1',
          'Schlafcouch – Platz 2',
        ],
      },
    ],
  },
  {
    name: 'Zimmer 4 · Einzelzimmer',
    badge: '2 Plätze · Bett 140',
    groups: [{ rows: ['Bett 140 – Platz 1', 'Bett 140 – Platz 2'] }],
  },
  {
    name: 'Zimmer 5 · Rosengarten',
    badge: '3 Plätze · 2 Bett + 1 Schlafcouch',
    groups: [
      { rows: ['Einzelbett – Platz 1', 'Einzelbett – Platz 2', 'Schlafcouch (max. 1 Person)'] },
    ],
  },
  {
    name: 'Zimmer 6 · Balkonzimmer',
    badge: '2 Plätze · 2 Bett',
    groups: [{ rows: ['Einzelbett – Platz 1', 'Einzelbett – Platz 2'] }],
    note: '2 Babybetten vorhanden – bei Bedarf bitte Kind(er) separat angeben.',
  },
]

const ablaufDefaults = [
  'Check-in / Anreise Übernachtungsgäste',
  'Ankunft Caterer (Aufbau Küche in der Garage)',
  'Aufbau Deko & Technik im Garten',
  'Beginn Programm',
  'Kaffee & Kuchen',
  'Essen',
  'Reden / Anschnitt Torte',
  'Beginn Party / Musik',
  'Ende Musik / Ruhezeit',
  'Check-out (Folgetag)',
]

const included = [
  'Alle Zimmer & Ferienwohnungen exklusiv, bis zu 28 Übernachtungsgäste',
  'Garten als Festfläche',
  'Strom für Musik & Technik aus dem Haus',
  'Sanitäranlagen über die Zimmer, auch für Gäste im Zelt oder Wohnmobil',
  'Küche in der Garage für den Caterer',
  'Persönliche Planung und Koordination vor Ort durch Tina Volgenandt',
]

const toDiscuss = [
  'Festzelt (nicht im Basispreis, wir empfehlen es für jede Feier)',
  'Zelt- und Wohnmobilplätze im Garten (nicht im Basispreis)',
  'Tische, Stühle, Stuhlhussen & Geschirr',
  'Deko & Blumenschmuck',
  'Musik, DJ oder Band',
  'Getränke & Ausschank',
  'Sitzordnung',
  'Kinderbetreuung / Spielecke',
  'Haustiere',
]

const printTarget = ref<string | null>(null)
function printSection(id: string) {
  printTarget.value = id
  nextTick(() => window.print())
}
onMounted(() => {
  window.addEventListener('afterprint', () => {
    printTarget.value = null
  })
})
</script>

<template>
  <div class="hub mx-auto max-w-4xl px-6 py-12 md:py-16" :data-print-target="printTarget ?? ''">
    <NuxtLink
      to="/feiern/"
      class="no-print mb-8 inline-flex items-center gap-2 text-sm text-sage-500 hover:text-sage-800"
    >
      <Icon name="ph:arrow-left" class="size-4" />
      Zurück zu Feiern im Garten
    </NuxtLink>

    <header class="no-print mb-12 text-center">
      <p class="text-sm font-medium tracking-widest text-waldhonig-600 uppercase">
        Pension Volgenandt · Eichsfeld
      </p>
      <h1 class="mt-2 font-serif text-3xl font-bold text-sage-900 md:text-4xl">
        Planungshilfen für Ihr Fest
      </h1>
      <p class="mx-auto mt-3 max-w-xl text-sage-700">
        Was wir zwischen Zusage und Veranstaltungstag gemeinsam planen. Eintragen können Sie alles
        nach der Buchung in unserer Planungs-App. Jeder Abschnitt lässt sich einzeln ausdrucken oder
        als PDF speichern.
      </p>
    </header>

    <!-- Belegungsplan -->
    <section id="belegungsplan" class="plan-section mb-16" data-section-id="belegungsplan">
      <div class="mb-6 flex items-baseline justify-between gap-4">
        <h2 class="font-serif text-2xl font-semibold text-sage-900">Zimmerbelegungsplan</h2>
        <button
          class="no-print rounded-lg border border-sage-300 bg-sage-50 px-4 py-1.5 text-sm font-medium text-sage-700 hover:bg-sage-100"
          @click="printSection('belegungsplan')"
        >
          Drucken / PDF
        </button>
      </div>
      <p class="mb-6 text-sage-700">
        In der Planungs-App tragen Sie ein, wer in welchem Bett übernachtet. So können wir jedem
        Gast direkt seinen Platz zeigen.
      </p>

      <div
        class="mb-4 flex items-center gap-4 rounded-xl border border-sage-200 bg-sage-50 p-4 text-sm text-sage-700"
      >
        <span class="font-serif text-2xl font-bold text-sage-900">28</span>
        <span
          >Plätze in Zimmern: 18 feste Betten + 10 Schlafcouch-Plätze, verteilt auf 7 Wohneinheiten,
          plus 2 Babybetten für Kleinkinder.</span
        >
      </div>

      <div
        v-for="unit in units"
        :key="unit.name"
        class="mb-4 rounded-xl border border-sage-200 p-5"
      >
        <div class="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h3 class="font-serif text-lg font-semibold text-sage-900">{{ unit.name }}</h3>
          <span
            class="rounded bg-waldhonig-100 px-2 py-0.5 font-mono text-xs font-semibold text-waldhonig-700"
            >{{ unit.badge }}</span
          >
        </div>
        <div v-for="group in unit.groups" :key="group.label ?? unit.name" class="mb-3 last:mb-0">
          <p v-if="group.label" class="mb-1 text-xs tracking-wide text-sage-500 uppercase">
            {{ group.label }}
          </p>
          <div
            v-for="row in group.rows"
            :key="row"
            class="flex items-center gap-3 border-t border-dashed border-sage-200 py-2 first:border-t-0"
          >
            <span class="text-sm text-sage-600">{{ row }}</span>
          </div>
        </div>
        <p v-if="unit.note" class="mt-2 text-sm text-sage-500 italic">{{ unit.note }}</p>
      </div>

      <div class="mt-8 rounded-xl border border-sage-200 p-5">
        <p class="text-sm text-sage-600">
          Zelt- und Wohnmobilplätze sind nicht im Basispreis enthalten. Die Anzahl bitte vorab mit
          mir abstimmen.
        </p>
      </div>
    </section>

    <!-- Anfahrt & Parken -->
    <section id="anfahrt" class="plan-section mb-16" data-section-id="anfahrt">
      <div class="mb-6 flex items-baseline justify-between gap-4">
        <h2 class="font-serif text-2xl font-semibold text-sage-900">Anfahrt &amp; Parken</h2>
        <button
          class="no-print rounded-lg border border-sage-300 bg-sage-50 px-4 py-1.5 text-sm font-medium text-sage-700 hover:bg-sage-100"
          @click="printSection('anfahrt')"
        >
          Drucken / PDF
        </button>
      </div>
      <div class="rounded-xl border border-sage-200 p-5">
        <p class="text-sage-800">
          {{ appConfig.contact.address.street }}<br />
          {{ appConfig.contact.address.city }}
        </p>
        <p class="mt-3 text-sage-700">
          Parkplätze stehen direkt auf dem Gelände zur Verfügung, kostenlos.
        </p>
        <a
          href="https://maps.app.goo.gl/pGocG9jFPzXkpvGbA"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-3 inline-flex items-center gap-1 text-sm text-waldhonig-600 underline hover:text-waldhonig-700"
        >
          <Icon name="ph:map-pin" class="size-4" />
          In Google Maps öffnen
        </a>
        <p class="mt-4 text-sm text-sage-500">
          Ausführliche Anfahrtsbeschreibung mit Auto und Bahn:
          <NuxtLink to="/kontakt/" class="text-waldhonig-600 underline hover:text-waldhonig-700"
            >Anfahrt auf der Kontaktseite</NuxtLink
          >.
        </p>
      </div>
    </section>

    <!-- Ablaufplan -->
    <section id="ablaufplan" class="plan-section mb-16" data-section-id="ablaufplan">
      <div class="mb-6 flex items-baseline justify-between gap-4">
        <h2 class="font-serif text-2xl font-semibold text-sage-900">Ablaufplan für den Tag</h2>
        <button
          class="no-print rounded-lg border border-sage-300 bg-sage-50 px-4 py-1.5 text-sm font-medium text-sage-700 hover:bg-sage-100"
          @click="printSection('ablaufplan')"
        >
          Drucken / PDF
        </button>
      </div>
      <p class="mb-6 text-sage-700">
        Diese Punkte planen wir für Ihren Tag. Uhrzeiten und eigene Programmpunkte tragen Sie in der
        Planungs-App ein.
      </p>
      <div class="rounded-xl border border-sage-200 p-5">
        <div
          v-for="item in ablaufDefaults"
          :key="item"
          class="flex items-center gap-3 border-t border-dashed border-sage-200 py-2 first:border-t-0"
        >
          <Icon name="ph:clock-duotone" class="size-4 shrink-0 text-sage-500" />
          <span class="text-sm text-sage-700">{{ item }}</span>
        </div>
      </div>
    </section>

    <!-- Checkliste -->
    <section id="checkliste" class="plan-section" data-section-id="checkliste">
      <div class="mb-6 flex items-baseline justify-between gap-4">
        <h2 class="font-serif text-2xl font-semibold text-sage-900">Checkliste: Was wir stellen</h2>
        <button
          class="no-print rounded-lg border border-sage-300 bg-sage-50 px-4 py-1.5 text-sm font-medium text-sage-700 hover:bg-sage-100"
          @click="printSection('checkliste')"
        >
          Drucken / PDF
        </button>
      </div>
      <div class="grid gap-6 sm:grid-cols-2">
        <div class="rounded-xl border border-sage-200 p-5">
          <h3 class="mb-3 font-serif text-lg font-semibold text-sage-900">Ist bereits inklusive</h3>
          <ul class="space-y-2">
            <li
              v-for="item in included"
              :key="item"
              class="flex items-start gap-2 text-sm text-sage-700"
            >
              <Icon name="ph:check-circle-duotone" class="mt-0.5 size-4 shrink-0 text-sage-600" />
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="rounded-xl border border-sage-200 p-5">
          <h3 class="mb-3 font-serif text-lg font-semibold text-sage-900">Gemeinsam abzustimmen</h3>
          <ul class="space-y-3">
            <li
              v-for="item in toDiscuss"
              :key="item"
              class="flex items-start gap-2 text-sm text-sage-700"
            >
              <Icon
                name="ph:chat-circle-dots-duotone"
                class="mt-0.5 size-4 shrink-0 text-sage-600"
              />
              {{ item }}
            </li>
          </ul>
          <p class="mt-4 text-xs text-sage-500">
            Ich bespreche diese Punkte persönlich mit Ihnen, sobald Ihr Termin feststeht.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
  .hub[data-print-target='belegungsplan'] .plan-section:not([data-section-id='belegungsplan']),
  .hub[data-print-target='anfahrt'] .plan-section:not([data-section-id='anfahrt']),
  .hub[data-print-target='ablaufplan'] .plan-section:not([data-section-id='ablaufplan']),
  .hub[data-print-target='checkliste'] .plan-section:not([data-section-id='checkliste']) {
    display: none !important;
  }
}
</style>
