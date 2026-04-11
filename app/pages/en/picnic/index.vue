<script setup lang="ts">
const siteUrl = 'https://www.pension-volgenandt.de'

// Not in nav or sitemap until go-live
definePageMeta({
  breadcrumb: { label: 'Picnic Basket' },
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'canonical', href: `${siteUrl}/en/picnic/` },
    { rel: 'alternate', hreflang: 'de', href: `${siteUrl}/picknick/` },
    { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/en/picnic/` },
    { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}/picknick/` },
  ],
})

useSeoMeta({
  title: 'Picnic Basket – Gourmet Breakfast to Go',
  ogTitle: 'Picnic Basket | Pension Volgenandt',
  description:
    'Homemade, regional, packed with love. Book your picnic basket for the garden or the surrounding area – from 19 EUR per person.',
  ogDescription:
    'Homemade, regional, packed with love. Book your picnic basket for the garden or the surrounding area – from 19 EUR per person.',
  ogImage: '/img/garten/garten-sitzbank-apfelbaum-bluete.webp',
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
        src="/img/garten/garten-haengekorb-blumen.webp"
        alt="Hanging flower basket in the garden of Pension Volgenandt"
        class="absolute inset-0 h-full w-full object-cover"
        width="1600"
        height="1060"
        loading="eager"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div
        class="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-10 text-center md:pb-14"
      >
        <p class="text-sm font-medium tracking-widest text-white/70 uppercase">
          Pension Volgenandt
        </p>
        <h1 class="mt-2 font-serif text-4xl font-bold text-white md:text-5xl">Picnic Basket</h1>
        <p class="mt-3 text-lg text-white/90 md:text-xl">
          Regional. Seasonal. Homemade. With love.
        </p>
        <NuxtLink
          to="/en/picnic/book/"
          class="mt-6 inline-block rounded-lg bg-waldhonig-500 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-waldhonig-600"
        >
          Book now
        </NuxtLink>
      </div>
    </section>

    <!-- 2. Intro -->
    <section class="mx-auto max-w-3xl px-6 py-12 text-center md:py-16">
      <p class="text-lg leading-relaxed text-sage-800">
        We pack a hand-filled wicker basket for you with homemade products, a real picnic blanket,
        dishes and cutlery. You choose your favourite spot – in the garden right at the guesthouse
        or somewhere in the beautiful surrounding countryside.
      </p>
      <p class="mt-4 text-lg leading-relaxed text-sage-800">
        From <strong class="text-waldhonig-600">19 EUR per person</strong>. Basket deposit 100 EUR
        cash at pickup (returned upon return).
      </p>
    </section>

    <!-- 3. Packages -->
    <section class="bg-cream px-6 py-12 md:py-16">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-2 text-center font-serif text-3xl font-bold text-sage-900">Our Packages</h2>
        <p class="mb-10 text-center text-sage-600">The right offer for every time of day.</p>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PicknickPackageCard
            v-for="pkg in packages"
            :key="pkg.id"
            :name="pkg.name"
            :subtitle="pkg.subtitle"
            :time-slot="pkg.timeSlot"
            :price-per-person="pkg.pricePerPerson"
            :includes="pkg.includes"
            :image="pkg.image"
            :image-alt="pkg.imageAlt"
            :image-position="pkg.imagePosition"
          />
        </div>
      </div>
    </section>

    <!-- 4. How does it work? -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-4xl">
        <h2 class="mb-10 text-center font-serif text-3xl font-bold text-sage-900">
          How does it work?
        </h2>
        <ol class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <li class="flex flex-col items-center text-center">
            <span
              class="flex size-12 items-center justify-center rounded-full bg-waldhonig-500 text-xl font-bold text-white"
              >1</span
            >
            <h3 class="mt-4 font-serif text-lg font-semibold text-sage-900">Choose a package</h3>
            <p class="mt-2 text-sm leading-relaxed text-sage-600">
              Brunch, coffee & cake, or sunset – pick the option that suits you best.
            </p>
          </li>
          <li class="flex flex-col items-center text-center">
            <span
              class="flex size-12 items-center justify-center rounded-full bg-waldhonig-500 text-xl font-bold text-white"
              >2</span
            >
            <h3 class="mt-4 font-serif text-lg font-semibold text-sage-900">Request</h3>
            <p class="mt-2 text-sm leading-relaxed text-sage-600">
              Enter your preferred date, number of guests and extras in the form and submit.
            </p>
          </li>
          <li class="flex flex-col items-center text-center">
            <span
              class="flex size-12 items-center justify-center rounded-full bg-waldhonig-500 text-xl font-bold text-white"
              >3</span
            >
            <h3 class="mt-4 font-serif text-lg font-semibold text-sage-900">Confirmation</h3>
            <p class="mt-2 text-sm leading-relaxed text-sage-600">
              We will get back to you within 24 hours and confirm your date personally.
            </p>
          </li>
          <li class="flex flex-col items-center text-center">
            <span
              class="flex size-12 items-center justify-center rounded-full bg-waldhonig-500 text-xl font-bold text-white"
              >4</span
            >
            <h3 class="mt-4 font-serif text-lg font-semibold text-sage-900">Pick up & enjoy</h3>
            <p class="mt-2 text-sm leading-relaxed text-sage-600">
              Collect the basket at the guesthouse, find your favourite spot – and enjoy the moment.
            </p>
          </li>
        </ol>
      </div>
    </section>

    <!-- 5. Picnic spots in the garden -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-2 font-serif text-2xl font-semibold text-sage-900">
          Your spots in the garden
        </h2>
        <p class="mb-8 text-sage-600">Right at the guesthouse – no car needed.</p>
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

    <!-- Panorama divider -->
    <div class="relative h-48 overflow-hidden md:h-64">
      <NuxtImg
        src="/img/garten/garten-panorama-felder-fruehling.webp"
        alt="Wide view over the spring fields around Pension Volgenandt"
        class="absolute inset-0 h-full w-full object-cover"
        width="1600"
        height="1060"
        loading="lazy"
      />
    </div>

    <!-- 6. Take the basket on a trip -->
    <section class="px-6 py-10 md:py-12">
      <div class="mx-auto max-w-3xl rounded-xl bg-sage-50 px-8 py-8 text-center">
        <p class="text-sage-700">
          Simply take the basket with you – whether to Burg Hanstein, to Lake Seeburger See or on a
          hike through the Eichsfeld region. There are plenty of beautiful destinations in the area.
        </p>
        <NuxtLink
          to="/en/activities/"
          class="mt-5 inline-block rounded-lg border border-sage-300 px-6 py-2.5 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-100"
        >
          Discover excursion destinations
        </NuxtLink>
      </div>
    </section>

    <!-- 7. What is always included? -->
    <section class="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <h2 class="mb-2 font-serif text-2xl font-semibold text-sage-900">What is always included?</h2>
      <p class="mb-8 text-sage-600">
        Every basket is fully equipped – real dishes, no disposables.
      </p>
      <PicknickBasketContents v-if="basket" :always="basket.always" :extras="basket.extras" />
    </section>

    <!-- 8. Directions & Parking -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <h2 class="mb-2 font-serif text-2xl font-semibold text-sage-900">Directions & Parking</h2>
        <p class="mb-8 text-sage-600">
          Otto-Reuter-Straße 28 · 37327 Leinefelde-Worbis OT Breitenbach
        </p>
        <div class="grid gap-8 md:grid-cols-2 md:items-center">
          <div class="overflow-hidden rounded-lg shadow-sm">
            <NuxtImg
              src="/img/garten/gebaeude-eingang-parkplatz.webp"
              alt="Entrance and parking area of Pension Volgenandt"
              class="h-64 w-full object-cover md:h-72"
              loading="lazy"
              sizes="100vw md:50vw"
            />
          </div>
          <div class="space-y-4 text-sage-700">
            <div class="flex items-start gap-3">
              <Icon name="ph:car-duotone" class="mt-0.5 size-5 shrink-0 text-waldhonig-500" />
              <p>
                <strong class="font-medium text-sage-900">Ample parking</strong> directly on the
                guesthouse grounds – free of charge and easy to find.
              </p>
            </div>
            <div class="flex items-start gap-3">
              <Icon name="ph:map-pin-duotone" class="mt-0.5 size-5 shrink-0 text-waldhonig-500" />
              <p>
                From the car park, picking up the basket is just a few steps away. We will meet you
                at the entrance.
              </p>
            </div>
            <div class="flex items-start gap-3">
              <Icon
                name="ph:navigation-arrow-duotone"
                class="mt-0.5 size-5 shrink-0 text-waldhonig-500"
              />
              <p>
                Navigation destination:
                <span class="font-medium text-sage-900">Otto-Reuter-Straße 28, Breitenbach</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 9. CTA -->
    <section class="bg-waldhonig-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="font-serif text-2xl font-semibold text-sage-900">Fancy a picnic?</h2>
        <p class="mt-3 text-sage-700">
          Request your preferred date now – we will get back to you within 24 hours.
        </p>
        <NuxtLink
          to="/en/picnic/book/"
          class="mt-6 inline-block rounded-lg bg-waldhonig-500 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-waldhonig-600"
        >
          Request a basket
        </NuxtLink>
        <p class="mt-4 text-sm text-sage-500">
          From 19 EUR / person · Basket deposit 100 EUR cash (returned upon return)
        </p>
      </div>
    </section>
  </div>
</template>
