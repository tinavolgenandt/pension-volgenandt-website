<script setup lang="ts">
// Not in nav or sitemap until go-live
definePageMeta({
  breadcrumb: { label: 'Picknick-Korb' },
})

useSeoMeta({
  title: 'Picknick-Korb – Genießer Frühstück to go',
  ogTitle: 'Picknick-Korb | Pension Volgenandt',
  description:
    'Hausgemacht, regional, mit Herz gepackt. Buchen Sie Ihren Picknick-Korb für den Garten oder die Umgebung – ab 19 € pro Person.',
  ogDescription:
    'Hausgemacht, regional, mit Herz gepackt. Buchen Sie Ihren Picknick-Korb für den Garten oder die Umgebung – ab 19 € pro Person.',
  ogImage: '/img/garten/garten-sitzbank-apfelbaum-bluete.jpg',
  ogType: 'website',
})

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
</script>

<template>
  <div>
    <!-- 1. Hero -->
    <section class="relative h-[55vh] min-h-[380px] overflow-hidden">
      <NuxtImg
        src="/img/garten/garten-haengekorb-blumen.jpg"
        alt="Hängender Blumenkorb im Garten der Pension Volgenandt"
        class="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        sizes="100vw"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div class="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-10 text-center md:pb-14">
        <p class="text-sm font-medium uppercase tracking-widest text-white/70">
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
        Wir packen für Sie einen handgefüllten Weidenkorb mit hausgemachten Produkten, echter
        Picknickdecke, Geschirr und Besteck. Sie suchen sich Ihren Lieblingsplatz aus – im Garten
        direkt an der Pension oder irgendwo in der wunderschönen Umgebung.
      </p>
      <p class="mt-4 text-lg leading-relaxed text-sage-800">
        Ab <strong class="text-waldhonig-600">19 € pro Person</strong>. Korbpfand 100 €
        (wird bei Rückgabe vollständig erstattet).
      </p>
    </section>

    <!-- 3. Pakete -->
    <section class="bg-cream px-6 py-12 md:py-16">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-2 text-center font-serif text-3xl font-bold text-sage-900">
          Unsere Pakete
        </h2>
        <p class="mb-10 text-center text-sage-600">Für jede Tageszeit das passende Angebot.</p>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PicknickPackageCard
            v-for="pkg in packages"
            :key="pkg.id"
            :name="pkg.name"
            :subtitle="pkg.subtitle"
            :time-slot="pkg.timeSlot"
            :price-per-person="pkg.pricePerPerson"
            :description="pkg.description"
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
            <span class="flex size-12 items-center justify-center rounded-full bg-waldhonig-500 text-xl font-bold text-white">1</span>
            <h3 class="mt-4 font-serif text-lg font-semibold text-sage-900">Paket wählen</h3>
            <p class="mt-2 text-sm leading-relaxed text-sage-600">
              Brunch, Kaffee & Kuchen oder Sonnenuntergang – suchen Sie sich Ihr Wunschangebot aus.
            </p>
          </li>
          <li class="flex flex-col items-center text-center">
            <span class="flex size-12 items-center justify-center rounded-full bg-waldhonig-500 text-xl font-bold text-white">2</span>
            <h3 class="mt-4 font-serif text-lg font-semibold text-sage-900">Anfragen</h3>
            <p class="mt-2 text-sm leading-relaxed text-sage-600">
              Datum, Personenzahl und Extras im Formular eintragen und absenden.
            </p>
          </li>
          <li class="flex flex-col items-center text-center">
            <span class="flex size-12 items-center justify-center rounded-full bg-waldhonig-500 text-xl font-bold text-white">3</span>
            <h3 class="mt-4 font-serif text-lg font-semibold text-sage-900">Bestätigung</h3>
            <p class="mt-2 text-sm leading-relaxed text-sage-600">
              Wir melden uns innerhalb von 24 Stunden und bestätigen Ihren Termin persönlich.
            </p>
          </li>
          <li class="flex flex-col items-center text-center">
            <span class="flex size-12 items-center justify-center rounded-full bg-waldhonig-500 text-xl font-bold text-white">4</span>
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
        <h2 class="mb-2 font-serif text-2xl font-semibold text-sage-900">
          Ihre Plätze im Garten
        </h2>
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

    <!-- Panorama-Trennbild -->
    <div class="relative h-48 overflow-hidden md:h-64">
      <NuxtImg
        src="/img/garten/garten-panorama-felder-fruehling.webp"
        alt="Weiter Blick über die Frühlingsfelder rund um die Pension Volgenandt"
        class="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        sizes="100vw"
      />
    </div>

    <!-- 6. Korb auf Ausflug mitnehmen -->
    <section class="px-6 py-10 md:py-12">
      <div class="mx-auto max-w-3xl rounded-xl bg-sage-50 px-8 py-8 text-center">
        <p class="text-sage-700">
          Den Korb einfach mitnehmen – ob zur Burg Hanstein, an den Seeburger See oder auf
          eine Wanderung im Eichsfeld. Schöne Ausflugsziele gibt es hier in der Umgebung genug.
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
      <PicknickBasketContents
        v-if="basket"
        :always="basket.always"
        :extras="basket.extras"
      />
    </section>

    <!-- 8. Anfahrt & Parken -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <h2 class="mb-2 font-serif text-2xl font-semibold text-sage-900">Anfahrt & Parken</h2>
        <p class="mb-8 text-sage-600">
          Otto-Reuter-Straße 28 · 37327 Leinefelde-Worbis OT Breitenbach
        </p>
        <div class="grid gap-8 md:grid-cols-2 md:items-center">
          <div class="overflow-hidden rounded-lg shadow-sm">
            <NuxtImg
              src="/img/garten/gebaeude-eingang-parkplatz.webp"
              alt="Einfahrt und Parkplatz der Pension Volgenandt"
              class="h-64 w-full object-cover md:h-72"
              loading="lazy"
              sizes="100vw md:50vw"
            />
          </div>
          <div class="space-y-4 text-sage-700">
            <div class="flex items-start gap-3">
              <Icon name="ph:car-duotone" class="mt-0.5 size-5 shrink-0 text-waldhonig-500" />
              <p>
                <strong class="font-medium text-sage-900">Ausreichend Parkplätze</strong> direkt auf
                dem Pensionsgelände – kostenlos und übersichtlich.
              </p>
            </div>
            <div class="flex items-start gap-3">
              <Icon name="ph:map-pin-duotone" class="mt-0.5 size-5 shrink-0 text-waldhonig-500" />
              <p>
                Vom Parkplatz aus ist die Abholung des Korbs nur wenige Schritte entfernt. Wir
                erwarten Sie am Eingang.
              </p>
            </div>
            <div class="flex items-start gap-3">
              <Icon name="ph:navigation-arrow-duotone" class="mt-0.5 size-5 shrink-0 text-waldhonig-500" />
              <p>
                Navigationsziel:
                <span class="font-medium text-sage-900">Otto-Reuter-Straße 28, Breitenbach</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. CTA -->
    <section class="bg-waldhonig-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="font-serif text-2xl font-semibold text-sage-900">
          Lust auf ein Picknick?
        </h2>
        <p class="mt-3 text-sage-700">
          Jetzt Ihren Wunschtermin anfragen – wir melden uns innerhalb von 24 Stunden.
        </p>
        <NuxtLink
          to="/picknick/buchen/"
          class="mt-6 inline-block rounded-lg bg-waldhonig-500 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-waldhonig-600"
        >
          Korb anfragen
        </NuxtLink>
        <p class="mt-4 text-sm text-sage-500">Ab 19 € / Person · Korbpfand 100 € (erstattbar)</p>
      </div>
    </section>
  </div>
</template>
