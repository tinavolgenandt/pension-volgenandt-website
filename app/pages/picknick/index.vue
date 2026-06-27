<script setup lang="ts">
import { useJsonLd } from '~/composables/useJsonLd'

definePageMeta({
  breadcrumb: { label: 'Picknick-Korb' },
})

useSeoMeta({
  title: 'Picknick-Korb ab 19 € | Pension Volgenandt Eichsfeld',
  ogTitle: 'Picknick-Korb | Pension Volgenandt',
  description:
    'Hausgemacht, regional, mit Herz gepackt. Buchen Sie Ihren Picknick-Korb für den Garten oder die Umgebung – ab 19 € pro Person.',
  ogDescription:
    'Hausgemacht, regional, mit Herz gepackt. Buchen Sie Ihren Picknick-Korb für den Garten oder die Umgebung – ab 19 € pro Person.',
  ogImage: '/img/picknick/header-picknick.webp',
  ogType: 'website',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://www.pension-volgenandt.de/picknick/' },
    { rel: 'alternate', hreflang: 'de', href: 'https://www.pension-volgenandt.de/picknick/' },
    { rel: 'alternate', hreflang: 'en', href: 'https://www.pension-volgenandt.de/en/picnic/' },
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: 'https://www.pension-volgenandt.de/picknick/',
    },
  ],
})

useJsonLd(
  {
    '@type': 'Product',
    '@id': 'https://www.pension-volgenandt.de/picknick/#product',
    name: 'Picknick-Korb',
    url: 'https://www.pension-volgenandt.de/picknick/',
    image: ['https://www.pension-volgenandt.de/img/picknick/header-picknick.webp'],
    description:
      'Hausgemachter Picknick-Korb mit regionalen Produkten, Picknickdecke, Geschirr und Besteck. Verschiedene Pakete ab 19 € pro Person.',
    brand: {
      '@type': 'Brand',
      name: 'Pension Volgenandt',
    },
    category: 'Picnic basket',
    offers: {
      '@type': 'Offer',
      price: '19.00',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: 'https://www.pension-volgenandt.de/picknick/',
      seller: {
        '@id': 'https://www.pension-volgenandt.de/#identity',
      },
    },
  },
  'picnic-product-schema-de',
)

const { data: packagesData } = await useAsyncData('picknick-packages', () =>
  queryCollection('picknickPackages').first(),
)
const packages = computed(() => packagesData.value?.items ?? [])

const { data: spotsData } = await useAsyncData('picknick-spots', () =>
  queryCollection('picknickSpots').first(),
)
const gardenSpots = computed(() => (spotsData.value?.items ?? []).filter((s) => s.distanceKm === 0))

const { data: basket } = await useAsyncData('picknick-basket', () =>
  queryCollection('picknickBasket').first(),
)

// Build video source URLs dynamically. A static `src="/video/..."` on <source>
// gets rewritten by Vite's template asset transform (to a broken `/&/...` path),
// so we bind :src with the runtime baseURL instead — same pattern as HeroVideo.
const baseURL = useRuntimeConfig().app.baseURL
const gardenVideoSources = {
  webm: `${baseURL}video/picknick-garten-hero.webm`,
  mp4: `${baseURL}video/picknick-garten-hero.mp4`,
}

// Force muted autoplay. Two gotchas handled here:
//  1. Vue does not always reflect the `muted` attribute to the DOM property, so
//     browsers treat the video as unmuted and block autoplay — we set it in JS.
//  2. Chrome will not start an off-screen muted video reliably, so we play it
//     once it scrolls into view via an IntersectionObserver.
const gardenVideo = ref<HTMLVideoElement | null>(null)
let gardenObserver: IntersectionObserver | null = null

function playGarden() {
  const v = gardenVideo.value
  if (!v) return
  v.muted = true
  v.play().catch(() => {
    /* autoplay may still be blocked (e.g. data saver) — poster stays visible */
  })
}

onMounted(() => {
  nextTick(() => {
    const v = gardenVideo.value
    if (!v) return
    playGarden()
    if ('IntersectionObserver' in window) {
      gardenObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) playGarden()
          }
        },
        { threshold: 0.25 },
      )
      gardenObserver.observe(v)
    }
  })
})

onBeforeUnmount(() => gardenObserver?.disconnect())
</script>

<template>
  <div>
    <!-- 1. Hero -->
    <section class="relative h-[55vh] min-h-[380px] overflow-hidden">
      <NuxtImg
        src="/img/picknick/header-picknick.webp"
        alt="Picknickkorb mit Geschirr und Blumen auf der Wiese"
        class="absolute inset-0 h-full w-full object-cover"
        style="object-position: center 60%"
        width="1920"
        height="1280"
        loading="eager"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div
        class="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-10 text-center md:pb-14"
      >
        <p class="text-sm font-medium tracking-widest text-white/70 uppercase">
          Pension Volgenandt
        </p>
        <h1 class="mt-2 font-serif text-4xl font-bold text-white md:text-5xl">Picknick-Korb</h1>
        <p class="mt-3 text-lg text-white/90 md:text-xl">
          Regional. Saisonal. Hausgemacht. Mit Herz.
        </p>
        <NuxtLink
          to="/picknick/buchen/"
          class="mt-6 inline-block rounded-lg bg-waldhonig-500 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-waldhonig-600"
        >
          Jetzt buchen
        </NuxtLink>
      </div>
    </section>

    <!-- 2. Intro -->
    <section class="mx-auto max-w-3xl px-6 py-12 text-center md:py-16">
      <p class="text-lg leading-relaxed text-sage-800">
        Wir packen für Sie einen Picknickkorb mit hausgemachten Produkten, echter Picknickdecke,
        Geschirr und Besteck. Sie suchen sich Ihren Lieblingsplatz aus – im Garten direkt an der
        Pension oder irgendwo in der wunderschönen Umgebung.
      </p>
      <p class="mt-4 text-lg leading-relaxed text-sage-800">
        Ab <strong class="text-waldhonig-600">19 € pro Person</strong>. Korbpfand 50 € in bar bei
        Abholung (bei Rückgabe zurück). Für unsere Übernachtungsgäste entfällt das Pfand.
      </p>
    </section>

    <!-- 3. Pakete -->
    <section class="bg-cream px-6 py-12 md:py-16">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-2 text-center font-serif text-3xl font-bold text-sage-900">Unsere Pakete</h2>
        <p class="mb-10 text-center text-sage-600">Für jede Tageszeit das passende Angebot.</p>
        <div class="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          <PicknickPackageCard
            v-for="pkg in packages"
            :key="pkg.id"
            :name="pkg.name"
            :subtitle="pkg.subtitle"
            :price-per-person="pkg.pricePerPerson"
            :includes="pkg.includes"
            :image="pkg.image"
            :image-alt="pkg.imageAlt"
            :image-position="pkg.imagePosition"
          />
        </div>
      </div>
    </section>

    <!-- 4. Wie funktioniert's? -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-4xl">
        <h2 class="mb-10 text-center font-serif text-3xl font-bold text-sage-900">
          Wie funktioniert's?
        </h2>
        <ol class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <li class="flex flex-col items-center text-center">
            <span
              class="flex size-12 items-center justify-center rounded-full bg-waldhonig-500 text-xl font-bold text-white"
              >1</span
            >
            <h3 class="mt-4 font-serif text-lg font-semibold text-sage-900">Paket wählen</h3>
            <p class="mt-2 text-sm leading-relaxed text-sage-600">
              Brunch oder Sonnenuntergang – suchen Sie sich Ihr Wunschangebot aus.
            </p>
          </li>
          <li class="flex flex-col items-center text-center">
            <span
              class="flex size-12 items-center justify-center rounded-full bg-waldhonig-500 text-xl font-bold text-white"
              >2</span
            >
            <h3 class="mt-4 font-serif text-lg font-semibold text-sage-900">Anfragen</h3>
            <p class="mt-2 text-sm leading-relaxed text-sage-600">
              Datum, Personenzahl und Extras im Formular eintragen und absenden.
            </p>
          </li>
          <li class="flex flex-col items-center text-center">
            <span
              class="flex size-12 items-center justify-center rounded-full bg-waldhonig-500 text-xl font-bold text-white"
              >3</span
            >
            <h3 class="mt-4 font-serif text-lg font-semibold text-sage-900">Bestätigung</h3>
            <p class="mt-2 text-sm leading-relaxed text-sage-600">
              Wir melden uns innerhalb von 24 Stunden und bestätigen Ihren Termin persönlich.
            </p>
          </li>
          <li class="flex flex-col items-center text-center">
            <span
              class="flex size-12 items-center justify-center rounded-full bg-waldhonig-500 text-xl font-bold text-white"
              >4</span
            >
            <h3 class="mt-4 font-serif text-lg font-semibold text-sage-900">Abholen & genießen</h3>
            <p class="mt-2 text-sm leading-relaxed text-sage-600">
              Korb an der Pension abholen, Lieblingsplatz aussuchen – und den Moment genießen.
            </p>
          </li>
        </ol>
      </div>
    </section>

    <!-- 5. Picknick-Spots im Garten -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-2 font-serif text-2xl font-semibold text-sage-900">Ihre Plätze im Garten</h2>
        <p class="mb-8 text-sage-600">Direkt an der Pension – kein Auto nötig.</p>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <PicknickSpotCard
            v-for="spot in gardenSpots"
            :key="spot.id"
            :name="spot.name"
            :location="spot.location"
            :distance-km="spot.distanceKm"
            :description="spot.description"
            :image="spot.image"
            :image-alt="spot.imageAlt"
            :image-position="spot.imagePosition"
          />
        </div>
      </div>
    </section>

    <!-- Drohnen-Gartenflug — centered mid-width clip: poster paints first, the
         muted drone clip plays over it; prefers-reduced-motion keeps the still. -->
    <section class="px-6 py-12 md:py-16">
      <div
        class="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-xl bg-[#2C3E2D] shadow-sm"
      >
        <NuxtImg
          src="/img/picknick/picknick-garten-hero-poster.webp"
          alt="Blick aus der Luft über den grünen Garten der Pension Volgenandt"
          class="absolute inset-0 h-full w-full object-cover"
          width="1280"
          height="720"
          loading="lazy"
        />
        <ClientOnly>
          <video
            ref="gardenVideo"
            autoplay
            muted
            loop
            playsinline
            preload="auto"
            aria-hidden="true"
            tabindex="-1"
            class="picknick-garten-video absolute inset-0 h-full w-full object-cover"
            @loadeddata="playGarden"
            @canplay="playGarden"
          >
            <source :src="gardenVideoSources.webm" type="video/webm" />
            <source :src="gardenVideoSources.mp4" type="video/mp4" />
          </video>
        </ClientOnly>
      </div>
    </section>

    <!-- Panorama-Trennbild -->
    <div class="relative h-48 overflow-hidden md:h-64">
      <NuxtImg
        src="/img/garten/garten-panorama-felder-fruehling.webp"
        alt="Weiter Blick über die Frühlingsfelder rund um die Pension Volgenandt"
        class="absolute inset-0 h-full w-full object-cover"
        width="1600"
        height="1060"
        loading="lazy"
      />
    </div>

    <!-- 6. Korb auf Ausflug mitnehmen -->
    <section class="px-6 py-10 md:py-12">
      <div class="mx-auto max-w-3xl rounded-xl bg-sage-50 px-8 py-8 text-center">
        <p class="text-sage-700">
          Den Korb einfach mitnehmen – ob zur Burg Hanstein, an den Seeburger See oder auf eine
          Wanderung im Eichsfeld. Schöne Ausflugsziele gibt es hier in der Umgebung genug.
        </p>
        <NuxtLink
          to="/aktivitaeten/"
          class="mt-5 inline-block rounded-lg border border-sage-300 px-6 py-2.5 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-100"
        >
          Ausflugsziele entdecken
        </NuxtLink>
      </div>
    </section>

    <!-- 7. Was ist immer dabei? -->
    <section class="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <h2 class="mb-2 font-serif text-2xl font-semibold text-sage-900">Was ist immer dabei?</h2>
      <p class="mb-8 text-sage-600">
        Jeder Korb ist vollständig ausgestattet – echtes Geschirr, keine Einwegprodukte.
      </p>
      <PicknickBasketContents v-if="basket" :always="basket.always" :extras="basket.extras" />
    </section>

    <!-- 8. Anfahrt & Parken -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <h2 class="mb-2 font-serif text-2xl font-semibold text-sage-900">Anfahrt & Parken</h2>
        <p class="mb-8 text-sage-600">
          Otto-Reutter-Straße 28 · 37327 Leinefelde-Worbis OT Breitenbach
        </p>
        <div class="grid gap-8 md:grid-cols-2 md:items-center">
          <div class="overflow-hidden rounded-lg shadow-sm">
            <NuxtImg
              src="/img/garten/gebaeude-eingang-parkplatz.webp"
              alt="Einfahrt und Parkplatz der Pension Volgenandt"
              class="h-64 w-full object-cover md:h-72"
              style="object-position: center 80%"
              loading="lazy"
              sizes="100vw md:50vw"
            />
          </div>
          <div class="space-y-4 text-sage-700">
            <div class="flex items-start gap-3">
              <Icon name="ph:car-duotone" class="mt-0.5 size-5 shrink-0 text-waldhonig-500" />
              <p>
                <strong class="font-medium text-sage-900">Ausreichend Parkplätze</strong> direkt auf
                dem Pensionsgelände.
              </p>
            </div>
            <div class="flex items-start gap-3">
              <Icon name="ph:map-pin-duotone" class="mt-0.5 size-5 shrink-0 text-waldhonig-500" />
              <p>
                Wir erwarten Sie zur angegebenen Uhrzeit. Melden Sie sich einfach telefonisch oder
                klingeln Sie, wenn Sie vor Ort sind.
              </p>
            </div>
            <a
              href="https://maps.app.goo.gl/5BuHhrNp5buK8pKp8"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-2 inline-flex items-center gap-2 rounded-lg bg-waldhonig-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-waldhonig-600"
            >
              <Icon name="ph:map-trifold-duotone" class="size-4" />
              In Google Maps öffnen
            </a>
          </div>
        </div>
        <!-- Google Maps Embed -->
        <div class="mt-8 overflow-hidden rounded-lg shadow-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2500!2d10.322024!3d51.4122668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a4e7f6898bd1e7%3A0xba82640946e15fd5!2sPension%20Volgenandt!5e0!3m2!1sde!2sde!4v1"
            class="h-64 w-full md:h-80"
            style="border: 0"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>

    <!-- 8. CTA -->
    <section class="bg-waldhonig-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="font-serif text-2xl font-semibold text-sage-900">Lust auf ein Picknick?</h2>
        <p class="mt-3 text-sage-700">
          Jetzt Ihren Wunschtermin anfragen – wir melden uns innerhalb von 24 Stunden.
        </p>
        <NuxtLink
          to="/picknick/buchen/"
          class="mt-6 inline-block rounded-lg bg-waldhonig-500 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-waldhonig-600"
        >
          Korb anfragen
        </NuxtLink>
        <p class="mt-4 text-sm text-sage-500">
          Ab 19 € / Person · Korbpfand 50 € bar (bei Rückgabe zurück) · für Übernachtungsgäste
          entfällt es
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* The drone clip sits over its poster image; reduced-motion users keep the still. */
.picknick-garten-video {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .picknick-garten-video {
    display: none;
  }
}
</style>
