<script setup lang="ts">
const siteUrl = 'https://www.pension-volgenandt.de'

definePageMeta({
  breadcrumb: {
    label: 'Activities',
  },
})

useSeoMeta({
  title: 'Activities in the Eichsfeld',
  ogTitle: 'Activities in the Eichsfeld | Pension Volgenandt',
  description:
    'Hiking, cycling, castles and nature: Discover the activities around Pension Volgenandt in the Eichsfeld.',
  ogDescription:
    'Hiking, cycling, castles and nature: Discover the activities around Pension Volgenandt in the Eichsfeld.',
  ogImage: '/img/homepage/aussicht-panorama.webp',
  ogType: 'website',
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [
    {
      rel: 'canonical',
      href: `${siteUrl}/en/activities/`,
    },
    {
      rel: 'alternate',
      hreflang: 'de',
      href: `${siteUrl}/aktivitaeten/`,
    },
    {
      rel: 'alternate',
      hreflang: 'en',
      href: `${siteUrl}/en/activities/`,
    },
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${siteUrl}/aktivitaeten/`,
    },
  ],
})

// Fetch attractions with photos only (no-photo ones tracked in .planning/missing-attraction-photos.md)
const { data: attractionsRaw } = await useAsyncData('en-activities-all-attractions', () =>
  queryCollection('attractionsEn').order('distanceKm', 'ASC').all(),
)
const attractions = computed(() => attractionsRaw.value?.filter((a) => a.heroImage) ?? [])

const activityCards = [
  {
    title: 'Hiking',
    description:
      'The Eichsfeld offers a dense network of hiking trails through gentle hills, deep forests and along historic paths.',
    icon: 'ph:mountains-duotone',
    to: '/en/activities/hiking/',
  },
  {
    title: 'Cycling',
    description:
      'Whether a leisurely cycle along the Leine or a sporty route through the hills \u2013 there is something for everyone.',
    icon: 'ph:bicycle-duotone',
    to: '/en/activities/cycling/',
  },
]
</script>

<template>
  <div>
    <!-- 1. Thin photo banner -->
    <SharedPageBanner
      image="/img/garten/einfahrt-sommer.webp"
      image-alt="Pension Volgenandt – entrance with garden view in summer"
      title="Activities"
      subtitle="Explore the Eichsfeld"
    />

    <!-- 2. Personal intro -->
    <section class="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p class="text-lg leading-relaxed text-sage-800">
        The Eichsfeld is a paradise for anyone who loves the outdoors. In the area around our
        guesthouse you will find numerous hiking and cycling trails that lead through one of the
        most beautiful landscapes in Thuringia.
      </p>
      <p class="mt-4 text-lg leading-relaxed text-sage-800">
        Whether sporty or leisurely, alone or with the family &ndash; we are happy to advise you on
        the best routes and attractions nearby.
      </p>
    </section>

    <!-- 3. Popular Attractions -->
    <section class="bg-cream px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <h2 class="mb-8 text-center font-serif text-2xl font-semibold text-sage-900">
          Popular Attractions
        </h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="attraction in attractions"
            :key="attraction.slug"
            :to="`/en/attractions/${attraction.slug}/`"
            class="group overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div v-if="attraction.heroImage" class="aspect-[16/10] overflow-hidden bg-sage-100">
              <NuxtImg
                :src="attraction.heroImage"
                :alt="attraction.heroImageAlt"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                sizes="100vw sm:50vw lg:33vw"
              />
            </div>
            <div v-else class="flex aspect-[16/10] items-center justify-center bg-sage-100">
              <Icon name="ph:map-pin-duotone" class="size-12 text-sage-300" />
            </div>
            <div class="p-5">
              <div class="mb-2">
                <SharedDistanceBadge
                  :distance-km="attraction.distanceKm"
                  :driving-minutes="attraction.drivingMinutes"
                />
              </div>
              <h3 class="font-serif text-lg font-semibold text-sage-900">
                {{ attraction.name }}
              </h3>
              <p class="mt-1 text-sm leading-relaxed text-sage-700">
                {{ attraction.shortDescription }}
              </p>
              <span
                class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-waldhonig-600 transition-colors group-hover:text-waldhonig-700"
              >
                Learn more
                <Icon name="ph:arrow-right" class="size-4" />
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 4. Sporting Activities -->
    <section class="px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <h2 class="mb-8 text-center font-serif text-2xl font-semibold text-sage-900">
          Sporting Activities
        </h2>
        <div class="grid gap-6 sm:grid-cols-2">
          <NuxtLink
            v-for="activity in activityCards"
            :key="activity.title"
            :to="activity.to"
            class="group rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div class="flex items-start gap-4">
              <Icon :name="activity.icon" class="size-10 shrink-0 text-sage-600" />
              <div class="flex-1">
                <h3 class="font-serif text-xl font-semibold text-sage-900">
                  {{ activity.title }}
                </h3>
                <p class="mt-2 leading-relaxed text-sage-700">
                  {{ activity.description }}
                </p>
                <span
                  class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-waldhonig-600 transition-colors group-hover:text-waldhonig-700"
                >
                  Learn more
                  <Icon name="ph:arrow-right" class="size-4" />
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 5. Picnic Basket -->
    <section class="bg-waldhonig-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <div class="flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-12">
          <div class="shrink-0 overflow-hidden rounded-xl md:w-80">
            <NuxtImg
              src="/img/picknick/header-picknick.webp"
              alt="Picnic basket with contents on the meadow"
              class="h-52 w-full object-cover"
              style="object-position: center 60%"
              loading="lazy"
              sizes="100vw md:320px"
              width="640"
              height="416"
            />
          </div>
          <div>
            <h2 class="font-serif text-2xl font-semibold text-sage-900">
              Picnic Basket – Your Outing with a Twist
            </h2>
            <p class="mt-3 leading-relaxed text-sage-700">
              Take our homemade picnic basket along on your trip – to Burg Hanstein, Seeburger See,
              or simply into the garden. Local, seasonal, with real crockery. From €19 per person.
            </p>
            <NuxtLink
              to="/en/picnic/"
              class="mt-5 inline-flex items-center gap-1 font-semibold text-waldhonig-600 transition-colors hover:text-waldhonig-700 hover:underline"
            >
              Discover Picnic Basket
              <Icon name="ph:arrow-right" class="size-4" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Booking CTA -->
    <SharedBookingCta text="Plan your active holiday in the Eichsfeld" />
  </div>
</template>
