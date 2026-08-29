<script setup lang="ts">
import { useJsonLd } from '~/composables/useJsonLd'

definePageMeta({
  breadcrumb: { label: 'Feiern im Garten' },
})

useSeoMeta({
  title: 'Feiern im Garten | Hochzeit & Feste im Eichsfeld – Pension Volgenandt',
  ogTitle: 'Feiern im Garten | Pension Volgenandt',
  description:
    'Hochzeit, Jugendweihe, Kommunion oder runder Geburtstag: Feiern Sie im Garten der Pension Volgenandt im Eichsfeld. Rundum-sorglos-Paket mit Catering, Eventplanung und Übernachtung. Jetzt Preis berechnen.',
  ogDescription:
    'Ihr Fest im Grünen im Eichsfeld: Rundum-sorglos mit Catering, Eventplanung und Übernachtung für Ihre Gäste.',
  ogImage: '/img/garten/garten-rasen-baeume-sommer.webp',
  ogType: 'website',
  // Prices are still provisional (caterer/insurance not yet confirmed) and the
  // page isn't linked from nav — noindex until it's ready for real customers.
  robots: 'noindex, nofollow',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://www.pension-volgenandt.de/feiern/' }],
})

const appConfig = useAppConfig()

// Prefix static asset paths with baseURL for GitHub Pages subpath deployment —
// a static src="/video/..." gets rewritten by Vite's template asset transform,
// so we bind :src with the runtime baseURL instead (same pattern as HeroVideo).
const baseURL = useRuntimeConfig().app.baseURL
const droneVideoSrc = `${baseURL}video/garten-drohne.mp4`

const { data: config } = await useAsyncData('event-config-page', () =>
  queryCollection('eventConfig').first(),
)
const occasions = computed(() => config.value?.occasions ?? [])

useJsonLd(
  {
    '@type': 'Service',
    '@id': 'https://www.pension-volgenandt.de/feiern/#service',
    name: 'Feiern im Garten – Eventlocation Pension Volgenandt',
    serviceType: 'Eventlocation & Veranstaltungsservice',
    url: 'https://www.pension-volgenandt.de/feiern/',
    image: ['https://www.pension-volgenandt.de/img/garten/garten-rasen-baeume-sommer.webp'],
    description:
      'Full-Service-Eventlocation im Garten der Pension Volgenandt im Eichsfeld für Hochzeiten, Jugendweihe, Konfirmation, Kommunion, Taufe, runde Geburtstage und Jubiläen, inklusive Catering, Eventplanung und Übernachtungsmöglichkeit.',
    areaServed: {
      '@type': 'Place',
      name: 'Eichsfeld, Thüringen',
    },
    provider: {
      '@id': 'https://www.pension-volgenandt.de/#identity',
    },
  },
  'event-service-schema-de',
)

const steps = [
  {
    title: 'Anfrage',
    text: 'Anlass, Termin und Gästezahl unverbindlich über den Rechner senden.',
  },
  {
    title: 'Beratung',
    text: 'Wir melden uns persönlich und besprechen Ihre Wünsche.',
  },
  {
    title: 'Planung',
    text: 'Sie erhalten ein individuelles Angebot, wir kümmern uns um alle Details.',
  },
  {
    title: 'Feiern',
    text: 'Sie feiern im Grünen, wir koordinieren vor Ort.',
  },
]

const included = [
  {
    icon: 'ph:key-duotone',
    title: 'Das ganze Grundstück für Sie allein',
    text: 'Die komplette Pension exklusiv für Ihr Festwochenende: alle Zimmer, bis zu 28 Übernachtungsgäste, keine fremden Gäste.',
  },
  {
    icon: 'ph:tree-duotone',
    title: 'Unser Garten als festliche Kulisse',
    text: 'Ein gepflegter, ruhiger Garten mitten im Grünen, auf Wunsch mit Festzelt.',
  },
  {
    icon: 'ph:fork-knife-duotone',
    title: 'Catering von unserem Partner',
    text: 'Vom rustikalen Buffet bis zum servierten Menü, passend zu Ihrem Anlass, von unserem Partner Grillverein Thalwenden.',
  },
  {
    icon: 'ph:calendar-check-duotone',
    title: 'Eventplanung aus einer Hand',
    text: 'Wir planen und koordinieren alles im Vorfeld, damit Sie sich an Ihrem Tag nur um Ihre Gäste kümmern.',
  },
]
</script>

<template>
  <div>
    <!-- 1. Hero -->
    <section class="relative h-[60vh] min-h-[420px] overflow-hidden">
      <NuxtImg
        src="/img/garten/garten-rasen-baeume-sommer.webp"
        alt="Weitläufiger Sommergarten der Pension Volgenandt mit Rasen und alten Bäumen"
        class="absolute inset-0 h-full w-full object-cover"
        style="object-position: center 55%"
        width="1920"
        height="1280"
        loading="eager"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div
        class="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-12 text-center md:pb-16"
      >
        <p class="text-sm font-medium tracking-widest text-white/70 uppercase">
          Pension Volgenandt · Eichsfeld
        </p>
        <h1 class="mt-2 max-w-3xl font-serif text-4xl font-bold text-white md:text-5xl">
          Feiern bei Pension Volgenandt
        </h1>
        <p class="mt-3 max-w-2xl text-lg text-white/90 md:text-xl">
          Hochzeit, Jugendweihe oder Geburtstag: rundum sorglos im Grünen.
        </p>
        <a
          href="#rechner"
          class="mt-6 inline-block rounded-lg bg-waldhonig-500 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-waldhonig-600"
        >
          Preis berechnen & anfragen
        </a>
      </div>
    </section>

    <!-- 2. Intro -->
    <section class="mx-auto max-w-3xl px-6 py-12 text-center md:py-16">
      <h2 class="font-serif text-2xl font-semibold text-sage-900 md:text-3xl">
        Ihr Fest ganz ohne Stress
      </h2>
      <p class="mt-4 text-lg leading-relaxed text-sage-800">
        Fürs Festwochenende gehört Ihnen das <strong>gesamte Grundstück allein</strong>: alle
        Zimmer, Ihre Gäste übernachten vor Ort, wir organisieren alles von A bis Z, inklusive
        Catering über unseren Partner und persönlicher Eventplanung.
      </p>
      <p class="mt-4 text-lg leading-relaxed text-sage-800">
        Keine Nachbarn, keine Sperrstunde, kein Stress: Sie feiern, wir kümmern uns um den Rest.
      </p>
    </section>

    <!-- 3. Anlässe -->
    <section class="bg-cream px-6 py-12 md:py-16">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-2 text-center font-serif text-3xl font-bold text-sage-900">
          Für jeden besonderen Anlass
        </h2>
        <p class="mb-10 text-center text-sage-600">
          Ob feierlich oder ausgelassen: wir gestalten Ihren Tag.
        </p>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="occasion in occasions"
            :key="occasion.id"
            class="rounded-xl border border-sage-200 bg-white p-6 text-center"
          >
            <Icon :name="occasion.icon" class="mx-auto size-10 text-waldhonig-500" />
            <h3 class="mt-3 font-serif text-lg font-semibold text-sage-900">
              {{ occasion.label }}
            </h3>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Was ist enthalten -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-2 text-center font-serif text-3xl font-bold text-sage-900">
          Unser Komplettpaket
        </h2>
        <p class="mb-10 text-center text-sage-600">
          Alles aus einer Hand, damit Sie entspannt feiern können.
        </p>
        <div class="grid gap-6 sm:grid-cols-2">
          <div
            v-for="item in included"
            :key="item.title"
            class="flex items-start gap-4 rounded-xl bg-sage-50 p-6"
          >
            <Icon :name="item.icon" class="mt-1 size-8 shrink-0 text-waldhonig-500" />
            <div>
              <h3 class="font-serif text-lg font-semibold text-sage-900">{{ item.title }}</h3>
              <p class="mt-1 text-sm leading-relaxed text-sage-700">{{ item.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Panorama-Trennbild -->
    <div class="relative h-48 overflow-hidden md:h-64">
      <NuxtImg
        src="/img/events/ambiente-tisch-apfelbaum.webp"
        alt="Gedeckter Tisch unter einem tragenden Apfelbaum im Garten der Pension Volgenandt"
        class="absolute inset-0 h-full w-full object-cover"
        width="1600"
        height="1067"
        loading="lazy"
      />
    </div>

    <!-- Impressionen: echte Fotos vom Garten als Festkulisse -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-2 text-center font-serif text-3xl font-bold text-sage-900">Impressionen</h2>
        <p class="mb-10 text-center text-sage-600">So könnte Ihr Fest bei uns aussehen.</p>
        <div class="grid gap-5 sm:grid-cols-3">
          <NuxtImg
            src="/img/events/ambiente-tisch-gedeck.webp"
            alt="Festlich gedeckter Tisch im Garten mit Weingläsern"
            class="h-64 w-full rounded-xl object-cover"
            width="1600"
            height="1067"
            loading="lazy"
          />
          <NuxtImg
            src="/img/events/ambiente-tisch-aperol.webp"
            alt="Gedeckter Tisch mit Aperol Spritz im Abendlicht"
            class="h-64 w-full rounded-xl object-cover"
            width="1600"
            height="1067"
            loading="lazy"
          />
          <NuxtImg
            src="/img/events/ambiente-aperol-minze.webp"
            alt="Aperol Spritz mit frischer Minze auf dem Gartentisch"
            class="h-64 w-full rounded-xl object-cover"
            width="1600"
            height="1067"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <!-- Drohnenvideo: der Garten von oben -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto max-w-4xl">
        <h2 class="mb-2 text-center font-serif text-3xl font-bold text-sage-900">
          Der Garten von oben
        </h2>
        <p class="mb-10 text-center text-sage-600">Ein kurzer Rundflug über unser Grundstück.</p>
        <div class="relative aspect-video overflow-hidden rounded-xl bg-[#2C3E2D] shadow-sm">
          <video
            controls
            preload="none"
            poster="/img/events/drohne-poster.webp"
            class="absolute inset-0 h-full w-full object-cover"
          >
            <source :src="droneVideoSrc" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>

    <!-- Kooperationspartner: Grillverein Thalwenden -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-6xl">
        <div class="mb-10 flex flex-col items-center text-center">
          <img
            src="/img/events/partner-grillverein-logo.webp"
            alt="Logo Grillverein Thalwenden"
            class="size-20 object-contain"
            width="192"
            height="192"
            loading="lazy"
          />
          <h2 class="mt-4 font-serif text-3xl font-bold text-sage-900">
            Unser Partner: Grillverein Thalwenden
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-sage-700">
            Für herzhafte Grillspezialitäten arbeiten wir mit dem Grillverein Thalwenden zusammen.
            Das Team grillt live bei Ihrer Feier, mit hochwertigen, regionalen Zutaten.
          </p>
        </div>
        <div class="grid gap-5 sm:grid-cols-3">
          <NuxtImg
            src="/img/events/partner-grillverein-steak.webp"
            alt="Steaks und Bratwurst brutzeln auf dem Grill des Grillverein Thalwenden"
            class="h-64 w-full rounded-xl object-cover"
            width="1600"
            height="1067"
            loading="lazy"
          />
          <NuxtImg
            src="/img/events/partner-grillverein-grillplatte.webp"
            alt="Große Grillplatte mit Fisch, Spießen, Bratwurst und Burgern"
            class="h-64 w-full rounded-xl object-cover"
            width="1600"
            height="1067"
            loading="lazy"
          />
          <NuxtImg
            src="/img/events/partner-grillverein-team.webp"
            alt="Team des Grillverein Thalwenden mit Grillstand im Garten"
            class="h-64 w-full rounded-xl object-cover"
            width="1600"
            height="1067"
            loading="lazy"
          />
        </div>
        <div class="mt-8 text-center">
          <a
            href="http://grillverein-thalwenden.de/"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-lg border border-sage-300 bg-white px-5 py-2.5 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-100"
          >
            Grillverein Thalwenden entdecken
            <Icon name="ph:arrow-square-out" class="size-4 text-waldhonig-600" />
          </a>
        </div>
      </div>
    </section>

    <!-- 5. So läuft's ab -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-4xl">
        <h2 class="mb-10 text-center font-serif text-3xl font-bold text-sage-900">So läuft's ab</h2>
        <ol class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <li
            v-for="(step, i) in steps"
            :key="step.title"
            class="flex flex-col items-center text-center"
          >
            <span
              class="flex size-12 items-center justify-center rounded-full bg-waldhonig-500 text-xl font-bold text-white"
            >
              {{ i + 1 }}
            </span>
            <h3 class="mt-4 font-serif text-lg font-semibold text-sage-900">{{ step.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-sage-600">{{ step.text }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- Eventmanagerin -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto max-w-4xl">
        <div
          class="grid gap-8 rounded-2xl bg-sage-50 p-8 sm:grid-cols-[auto_1fr] sm:items-center md:p-10"
        >
          <div class="mx-auto size-48 overflow-hidden rounded-full sm:mx-0">
            <img
              src="/img/events/eventmanagerin-tina.webp"
              alt="Tina Volgenandt, Eventmanagerin"
              class="size-full object-cover"
              width="192"
              height="192"
            />
          </div>
          <div class="text-center sm:text-left">
            <p class="text-sm font-medium tracking-wide text-waldhonig-600 uppercase">
              Ihre Eventmanagerin
            </p>
            <h2 class="mt-1 font-serif text-2xl font-semibold text-sage-900">Tina Volgenandt</h2>
            <p class="mt-3 leading-relaxed text-sage-700">
              Als Eventmanagerin plane und koordiniere ich Ihr Fest persönlich, von der ersten Idee
              bis zum Veranstaltungstag.
            </p>
            <a
              href="https://www.linkedin.com/in/tina-volgenandt-9420a2136/"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-4 inline-flex items-center gap-2 rounded-lg border border-sage-300 px-5 py-2.5 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-100"
            >
              <Icon name="ph:linkedin-logo" class="size-5 text-waldhonig-600" />
              Profil auf LinkedIn ansehen
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Preisrechner -->
    <section id="rechner" class="px-6 py-12 md:py-16">
      <div class="mx-auto max-w-2xl">
        <h2 class="text-center font-serif text-3xl font-bold text-sage-900">
          Stellen Sie sich Ihre Feier zusammen
        </h2>
        <p class="mt-3 mb-8 text-center text-sage-600">
          Unser Konfigurator erstellt Schritt für Schritt ein unverbindliches Angebot, damit Sie ein
          Gefühl für den Preis bekommen. Danach melden wir uns persönlich.
        </p>
        <EventsEventPlanner />
      </div>
    </section>

    <!-- 7. Gut zu wissen -->
    <section class="bg-cream px-6 py-12 md:py-16">
      <div class="mx-auto max-w-4xl">
        <h2 class="mb-8 text-center font-serif text-2xl font-semibold text-sage-900">
          Gut zu wissen
        </h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-xl bg-white p-6 text-center">
            <Icon name="ph:shield-check-duotone" class="mx-auto size-9 text-waldhonig-500" />
            <h3 class="mt-3 font-serif text-base font-semibold text-sage-900">Völlig privat</h3>
            <p class="mt-2 text-sm text-sage-600">
              Das Grundstück gehört fürs Wochenende nur Ihnen.
            </p>
          </div>
          <div class="rounded-xl bg-white p-6 text-center">
            <Icon name="ph:moon-stars-duotone" class="mx-auto size-9 text-waldhonig-500" />
            <h3 class="mt-3 font-serif text-base font-semibold text-sage-900">Ohne Sperrstunde</h3>
            <p class="mt-2 text-sm text-sage-600">
              Keine Nachbarn, keine Lärmauflagen: feiern Sie, so lange Sie möchten.
            </p>
          </div>
          <div class="rounded-xl bg-white p-6 text-center">
            <Icon name="ph:cloud-sun-duotone" class="mx-auto size-9 text-waldhonig-500" />
            <h3 class="mt-3 font-serif text-base font-semibold text-sage-900">
              Schlechtwetter-Plan
            </h3>
            <p class="mt-2 text-sm text-sage-600">
              Ein Festzelt mit Seitenwänden schützt vor Regen und Sonne.
            </p>
          </div>
          <div class="rounded-xl bg-white p-6 text-center">
            <Icon name="ph:users-three-duotone" class="mx-auto size-9 text-waldhonig-500" />
            <h3 class="mt-3 font-serif text-base font-semibold text-sage-900">Bis zu 200 Gäste</h3>
            <p class="mt-2 text-sm text-sage-600">
              Feiern Sie mit bis zu 200 Gästen im Garten, bis zu 28 davon übernachten direkt bei
              uns.
            </p>
          </div>
        </div>
        <p class="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-sage-600">
          Sanitäranlagen nutzen Sie über die Zimmer, unser Partner richtet seine Küche in der Garage
          ein, und der Strom für die Musik kommt aus dem Haus.
        </p>
      </div>
    </section>

    <!-- 8. Kontakt-CTA: Gesprächstermin anfragen -->
    <section class="bg-waldhonig-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="font-serif text-2xl font-semibold text-sage-900">Lieber persönlich sprechen?</h2>
        <p class="mt-3 text-sage-700">Geben Sie Ihren Wunschtermin an, wir melden uns bei Ihnen.</p>
        <div class="mt-8">
          <EventsCallbackRequest />
        </div>
        <p class="mt-6 text-sm text-sage-500">
          Oder rufen Sie uns direkt an:
          <a
            :href="`tel:${appConfig.contact.phone}`"
            class="font-medium text-waldhonig-700 hover:underline"
          >
            {{ appConfig.contact.phoneDisplay }}
          </a>
        </p>
      </div>
    </section>
  </div>
</template>
