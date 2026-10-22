<script setup lang="ts">
import { useJsonLd } from '~/composables/useJsonLd'
import { t } from '~/utils/translations'

definePageMeta({
  breadcrumb: { label: 'Feiern im Garten' },
})

useSeoMeta({
  title: 'Eventlocation im Eichsfeld',
  ogTitle: 'Eventlocation im Eichsfeld | Pension Volgenandt',
  description:
    'Hochzeit, Jugendweihe oder runder Geburtstag im Garten der Pension Volgenandt im Eichsfeld. Mit Catering von Partnern, Eventplanung und Übernachtung. Preis online berechnen.',
  ogDescription:
    'Ihr Fest im Grünen im Eichsfeld: Catering von unseren Partnern, persönliche Planung und Übernachtung für Ihre Gäste.',
  ogImage: '/img/events/feiern-hero-poster.webp',
  ogType: 'website',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://www.pension-volgenandt.de/feiern/' }],
})

const appConfig = useAppConfig()

// Header video: two parts of the drone flight over the garden (meadow, then
// the overview with the view), cut with HyperFrames. A static src="/video/..."
// gets rewritten by Vite's template asset transform, so we bind :src with the
// runtime baseURL instead (same pattern as HeroVideo).
const baseURL = useRuntimeConfig().app.baseURL
const heroVideoSources = {
  webm: `${baseURL}video/feiern-hero.webm`,
  mp4: `${baseURL}video/feiern-hero.mp4`,
}
// Fade the video in over the poster once its first frame is painted. It also
// plays with prefers-reduced-motion (Windows with animation effects off), like
// the homepage video; hiding it there left desktop visitors with the still.
const heroVideoReady = ref(false)
function onHeroVideoPlaying() {
  requestAnimationFrame(() => requestAnimationFrame(() => (heroVideoReady.value = true)))
}

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
      'Full-Service-Eventlocation im Garten der Pension Volgenandt im Eichsfeld für Hochzeiten, Jugendweihe, Konfirmation, Kommunion, Taufe, runde Geburtstage und Jubiläen, mit Catering von Partnern, Eventplanung und Übernachtungsmöglichkeit.',
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
    text: 'Ich melde mich persönlich und bespreche Ihre Wünsche mit Ihnen.',
  },
  {
    title: 'Planung',
    text: 'Sie erhalten ein Angebot. Nach der Buchung planen wir die Details gemeinsam.',
  },
  {
    title: 'Feiern',
    text: 'Sie feiern im Grünen, ich koordiniere vor Ort.',
  },
]

const included = [
  {
    icon: 'ph:key-duotone',
    title: 'Das ganze Grundstück für Sie allein',
    text: 'Am Festwochenende sind nur Ihre Gäste im Haus. Bis zu 28 schlafen in den Zimmern. Weitere Gäste können im Zelt oder im eigenen Wohnmobil im Garten übernachten.',
  },
  {
    icon: 'ph:tree-duotone',
    title: 'Garten für bis zu 200 Gäste',
    text: 'Ein ruhiger Garten mitten im Grünen. Ist das Wetter unsicher, empfehlen wir ein Festzelt mit Seitenwänden.',
  },
  {
    icon: 'ph:fork-knife-duotone',
    title: 'Catering von unseren Partnern',
    text: 'Sie wählen zwischen einem Grillbuffet und einem regionalen Buffet. Beides kommt von erfahrenen Catering-Partnern.',
  },
  {
    icon: 'ph:moon-stars-duotone',
    title: 'Feiern bis in die Nacht',
    text: 'Wer bei uns übernachtet, muss nachts nicht mehr fahren. Für alle anderen organisiere ich auf Wunsch ein Shuttle oder Taxis. Wie lange die Musik draußen laufen kann, bespreche ich mit Ihnen.',
  },
]

// Photos from our own garden, to show the setting (not the caterers' photos)
const impressions = [
  {
    src: '/img/events/ambiente-tisch-gedeck.webp',
    alt: 'Festlich gedeckter Tisch im Garten mit Weingläsern',
  },
  {
    src: '/img/events/ambiente-tisch-aperol.webp',
    alt: 'Gedeckter Tisch mit Aperol Spritz im Abendlicht',
  },
  {
    src: '/img/events/ambiente-aperol-minze.webp',
    alt: 'Aperol Spritz mit frischer Minze auf dem Gartentisch',
  },
]

// One entry per partner (caterers, patisserie): the partner's own logo (taken
// from their website, transparent so it sits on the section colour) and name,
// both linking to their site. width/height are the logo files' real sizes.
const cateringPartners = [
  {
    name: 'Grillverein Thalwenden',
    logo: '/img/events/partner-grillverein-logo.webp',
    width: 242,
    height: 218,
    url: 'https://grillverein-thalwenden.de/',
  },
  {
    name: 'Anja kocht',
    logo: '/img/events/partner-anjakocht-logo.webp',
    width: 427,
    height: 95,
    url: 'https://www.anjakocht.de/',
  },
  {
    name: 'LaMaru Pâtisserie',
    logo: '/img/events/partner-lamaru-logo.webp',
    width: 480,
    height: 358,
    url: 'https://lamaru-patisserie.de/',
  },
]

const planningHelpers = [
  {
    to: '/feiern/planungshilfen/#belegungsplan',
    icon: 'ph:bed-duotone',
    // soft hyphen so the long word breaks inside the narrow phone tile
    title: 'Zimmer­belegungsplan',
    text: 'Wer schläft in welchem Bett.',
  },
  {
    to: '/feiern/planungshilfen/#anfahrt',
    icon: 'ph:car-duotone',
    title: 'Anfahrt & Parken',
    text: 'Adresse, Karte und Parkplätze.',
  },
  {
    to: '/feiern/planungshilfen/#ablaufplan',
    icon: 'ph:clock-duotone',
    title: 'Ablaufplan für den Tag',
    text: 'Die Programmpunkte für Ihren Tag.',
  },
  {
    to: '/feiern/planungshilfen/#checkliste',
    icon: 'ph:list-checks-duotone',
    title: 'Checkliste',
    text: 'Was dabei ist, was wir abstimmen.',
  },
]

const contactTabs = [
  { id: 'rueckruf', label: 'Rückruf vereinbaren' },
  { id: 'nachricht', label: 'Nachricht schreiben' },
] as const
const contactTab = ref<(typeof contactTabs)[number]['id']>('rueckruf')

// A click on an occasion chip preselects it in the planner and jumps there.
const occasionPreset = useState<string>('event-occasion-preset', () => '')
function chooseOccasion(id: string) {
  occasionPreset.value = id
  document.getElementById('rechner')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div>
    <!-- 1. Hero -->
    <section class="relative h-[60vh] min-h-[420px] overflow-hidden">
      <!-- Still = first frame of the video, so the fade-in is seamless. The
           overview shot feiern-hero-poster.webp stays the og:image. -->
      <NuxtImg
        src="/img/events/feiern-hero-start.webp"
        alt="Blick von oben auf Bäume und Wiese im Garten der Pension Volgenandt"
        class="absolute inset-0 h-full w-full object-cover"
        width="1280"
        height="720"
        loading="eager"
        fetchpriority="high"
      />
      <ClientOnly>
        <video
          autoplay
          muted
          loop
          playsinline
          preload="auto"
          aria-hidden="true"
          tabindex="-1"
          class="feiern-hero-video absolute inset-0 h-full w-full object-cover"
          :class="{ 'is-playing': heroVideoReady }"
          @playing.once="onHeroVideoPlaying"
        >
          <source :src="heroVideoSources.webm" type="video/webm" />
          <source :src="heroVideoSources.mp4" type="video/mp4" />
        </video>
      </ClientOnly>
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div
        class="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-12 text-center md:pb-16"
      >
        <p class="text-sm font-medium tracking-widest text-white/70 uppercase">
          Pension Volgenandt
        </p>
        <h1 class="mt-2 max-w-3xl font-serif text-4xl font-bold text-white md:text-5xl">
          Eventlocation im Eichsfeld
        </h1>
        <p class="mt-3 max-w-2xl text-lg text-white/90 md:text-xl">Ihr Fest bei uns im Garten</p>
        <a
          href="#rechner"
          class="mt-6 inline-block rounded-lg bg-waldhonig-500 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-waldhonig-600"
        >
          Preis berechnen & anfragen
        </a>
      </div>
    </section>

    <!-- 2. Anlässe: ein Klick wählt den Anlass im Rechner vor -->
    <section class="mx-auto max-w-3xl px-6 py-12 text-center md:py-16">
      <h2 class="font-serif text-3xl font-bold text-sage-900">Ihr Anlass</h2>
      <div class="mt-6 flex flex-wrap justify-center gap-2">
        <button
          v-for="occasion in occasions"
          :key="occasion.id"
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-4 py-2 text-sm font-medium text-sage-800 transition-colors hover:border-waldhonig-300 hover:bg-waldhonig-50"
          @click="chooseOccasion(occasion.id)"
        >
          <Icon :name="occasion.icon" class="size-5 text-waldhonig-500" />
          {{ occasion.label }}
        </button>
      </div>
    </section>

    <!-- 3. So läuft's ab -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-4xl">
        <h2 class="mb-10 text-center font-serif text-3xl font-bold text-sage-900">So läuft's ab</h2>
        <ol class="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
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
        <div
          class="mx-auto mt-10 flex max-w-2xl items-start gap-4 rounded-xl border border-sage-200 bg-white p-5"
        >
          <Icon name="ph:device-mobile-duotone" class="mt-0.5 size-7 shrink-0 text-waldhonig-500" />
          <p class="text-sm leading-relaxed text-sage-700">
            <strong class="text-sage-900">Unsere Planungs-App:</strong> Nach der Buchung sehen Sie
            dort jederzeit, wie weit die Planung ist: was erledigt ist, was als Nächstes ansteht,
            den Ablauf Ihres Tages und die Kosten.
          </p>
        </div>
      </div>
    </section>

    <!-- 4. Fotos aus unserem Garten als Auflockerung zwischen den Abschnitten -->
    <div class="grid grid-cols-3 gap-1 md:gap-2">
      <NuxtImg
        v-for="photo in impressions"
        :key="photo.src"
        :src="photo.src"
        :alt="photo.alt"
        class="h-32 w-full object-cover sm:h-48 md:h-72"
        width="1600"
        height="1067"
        sizes="xs:33vw"
        loading="lazy"
      />
    </div>

    <!-- 5. Was Sie bei uns bekommen -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-10 text-center font-serif text-3xl font-bold text-sage-900">
          Was Sie bei uns bekommen
        </h2>
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

    <!-- 7. Partner (Catering, Pâtisserie): gleich gewichtet, je Logo und Name -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <h2 class="mb-2 text-center font-serif text-3xl font-bold text-sage-900">Unsere Partner</h2>
        <p class="mb-10 text-center text-sage-600">
          Beide Caterer haben schon viele Veranstaltungen ausgerichtet, kleine Familienfeiern ebenso
          wie große Feste. Torten und Pâtisserie kommen von LaMaru, einer Konditorei in Duderstadt.
        </p>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article v-for="partner in cateringPartners" :key="partner.name" class="flex flex-col">
            <!-- Logo links too; hidden from screen readers, the name below is the link -->
            <a
              :href="partner.url"
              target="_blank"
              rel="noopener"
              tabindex="-1"
              aria-hidden="true"
              class="flex h-48 items-center justify-center p-8"
            >
              <img
                :src="partner.logo"
                alt=""
                :width="partner.width"
                :height="partner.height"
                class="max-h-full w-auto max-w-full object-contain"
                loading="lazy"
              />
            </a>
            <h3 class="px-5 pb-5 text-center font-serif text-xl font-semibold text-sage-900">
              <a
                :href="partner.url"
                target="_blank"
                rel="noopener"
                class="underline decoration-waldhonig-400 underline-offset-4 hover:text-waldhonig-600"
              >
                {{ partner.name }}
              </a>
            </h3>
          </article>
        </div>
      </div>
    </section>

    <!-- 8. Ansprechpartnerin -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto max-w-4xl">
        <div
          class="relative grid gap-8 rounded-2xl bg-sage-50 p-8 sm:grid-cols-[auto_1fr] sm:items-center md:p-10"
        >
          <a
            href="https://www.linkedin.com/in/tina-volgenandt-9420a2136/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Tina Volgenandt auf LinkedIn"
            title="Tina Volgenandt auf LinkedIn"
            class="absolute top-4 right-4 rounded-lg p-2 text-sage-500 transition-colors hover:bg-sage-100 hover:text-waldhonig-600"
          >
            <Icon name="ph:linkedin-logo" class="size-7" />
          </a>
          <div class="mx-auto size-48 overflow-hidden rounded-full sm:mx-0">
            <img
              src="/img/events/eventmanagerin-tina.webp"
              alt="Tina Volgenandt, Ansprechpartnerin für Feiern"
              class="size-full object-cover"
              width="192"
              height="192"
            />
          </div>
          <div class="text-center sm:text-left">
            <p class="text-sm font-medium tracking-wide text-waldhonig-600 uppercase">
              Ihre Ansprechpartnerin
            </p>
            <h2 class="mt-1 font-serif text-2xl font-semibold text-sage-900">Tina Volgenandt</h2>
            <p class="mt-3 leading-relaxed text-sage-700">
              Für alles rund um Ihre Feier sprechen Sie nur mit mir, von der ersten Frage bis zum
              Abschied am Sonntag. Ich war viele Jahre in der Gastronomie und im Verkauf von
              Veranstaltungen tätig. Seit Jahren unterstütze ich meine Eltern in der Pension.
            </p>
            <ul class="mt-4 space-y-2 text-sage-800">
              <li>
                <a
                  :href="`mailto:${appConfig.eventsContact.email}`"
                  class="inline-flex items-center gap-2 font-medium hover:text-waldhonig-700"
                >
                  <Icon name="ph:envelope-simple-duotone" class="size-5 text-waldhonig-500" />
                  {{ appConfig.eventsContact.email }}
                </a>
              </li>
              <li>
                <a
                  :href="`tel:${appConfig.eventsContact.phone}`"
                  class="inline-flex items-center gap-2 font-medium hover:text-waldhonig-700"
                >
                  <Icon name="ph:phone-duotone" class="size-5 text-waldhonig-500" />
                  {{ appConfig.eventsContact.phoneDisplay }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 9. Preisrechner -->
    <section id="rechner" class="scroll-mt-20 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-2xl">
        <h2 class="text-center font-serif text-3xl font-bold text-sage-900">
          Stellen Sie sich Ihre Feier zusammen
        </h2>
        <p class="mt-3 mb-8 text-center text-sage-600">
          Der Rechner zeigt Ihnen Schritt für Schritt einen ersten Richtwert. Danach melde ich mich
          mit einem persönlichen Angebot.
        </p>
        <EventsEventPlanner />
      </div>
    </section>

    <!-- 10. Planungshilfen -->
    <section class="bg-cream px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <h2 class="mb-2 text-center font-serif text-3xl font-bold text-sage-900">
          Hilfreich für Ihre Planung
        </h2>
        <p class="mb-10 text-center text-sage-600">Was wir vor Ihrem Fest gemeinsam planen.</p>
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <NuxtLink
            v-for="helper in planningHelpers"
            :key="helper.to"
            :to="helper.to"
            class="flex flex-col items-center rounded-xl border border-sage-200 bg-white p-5 text-center transition-colors hover:bg-sage-50"
          >
            <Icon :name="helper.icon" class="size-8 text-waldhonig-500" />
            <h3
              class="mt-3 font-serif text-sm font-semibold break-words hyphens-auto text-sage-900 sm:text-base"
            >
              {{ helper.title }}
            </h3>
            <p class="mt-1 text-sm text-sage-600">{{ helper.text }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 11. Kontakt: Rückruf oder Nachricht, beides geht an events@ -->
    <section class="bg-waldhonig-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-2xl">
        <h2 class="text-center font-serif text-2xl font-semibold text-sage-900">
          {{ t('events.contactHeading', 'de') }}
        </h2>
        <p class="mt-3 text-center text-sage-700">{{ t('events.contactText', 'de') }}</p>
        <div
          class="mx-auto mt-8 flex max-w-md rounded-lg border border-sage-200 bg-white p-1"
          role="tablist"
        >
          <button
            v-for="tab in contactTabs"
            :key="tab.id"
            type="button"
            role="tab"
            :aria-selected="contactTab === tab.id"
            class="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            :class="
              contactTab === tab.id
                ? 'bg-waldhonig-500 text-white'
                : 'text-sage-700 hover:bg-sage-50'
            "
            @click="contactTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="mt-8">
          <EventsCallbackRequest v-if="contactTab === 'rueckruf'" />
          <ContactForm v-else topic="events" />
        </div>
        <div
          class="mt-8 flex flex-col items-center justify-center gap-3 text-sage-800 sm:flex-row sm:gap-8"
        >
          <a
            :href="`mailto:${appConfig.eventsContact.email}`"
            class="inline-flex items-center gap-2 font-medium hover:text-waldhonig-700"
          >
            <Icon name="ph:envelope-simple-duotone" class="size-5 text-waldhonig-500" />
            {{ appConfig.eventsContact.email }}
          </a>
          <a
            :href="`tel:${appConfig.eventsContact.phone}`"
            class="inline-flex items-center gap-2 font-medium hover:text-waldhonig-700"
          >
            <Icon name="ph:phone-duotone" class="size-5 text-waldhonig-500" />
            {{ appConfig.eventsContact.phoneDisplay }}
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.feiern-hero-video {
  opacity: 0;
  transition: opacity 600ms ease-in-out;
}
.feiern-hero-video.is-playing {
  opacity: 1;
}
</style>
