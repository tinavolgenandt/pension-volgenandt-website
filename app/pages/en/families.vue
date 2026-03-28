<script setup lang="ts">
const siteUrl = 'https://www.pension-volgenandt.de'

definePageMeta({
  breadcrumb: {
    label: 'For Families',
  },
})

useSeoMeta({
  title: 'For Families',
  ogTitle: 'For Families | Pension Volgenandt',
  description:
    'Family holiday in the Eichsfeld: playground, garden, ride-on toys, cots and more. Pension Volgenandt in Breitenbach.',
  ogDescription:
    'Family holiday in the Eichsfeld: playground, garden, ride-on toys, cots and more. Pension Volgenandt in Breitenbach.',
  ogImage: '/img/content/terrasse-grill.webp',
  ogType: 'website',
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'canonical', href: `${siteUrl}/en/families/` },
    {
      rel: 'alternate',
      hreflang: 'de',
      href: `${siteUrl}/familie/`,
    },
    {
      rel: 'alternate',
      hreflang: 'en',
      href: `${siteUrl}/en/families/`,
    },
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${siteUrl}/familie/`,
    },
  ],
})

const familyFeatures = [
  {
    icon: 'ph:baby-duotone',
    title: 'Cots & High Chairs',
    description: 'Free in every room',
  },
  {
    icon: 'ph:plant-duotone',
    title: 'Large Garden',
    description: 'Plenty of space to play and explore',
  },
  {
    icon: 'ph:car-duotone',
    title: 'Kids Vehicles',
    description: 'Bobby cars, tricycles and more',
  },
  {
    icon: 'ph:tree-duotone',
    title: 'Playground',
    description: 'Swings, slide and sandpit',
  },
  {
    icon: 'ph:dog-duotone',
    title: 'Pets Welcome',
    description: "Dogs welcome in Emil's Kuhwiese & Balkonzimmer apartments",
  },
  {
    icon: 'ph:mountains-duotone',
    title: 'Explore Nature',
    description: 'Hiking and cycling trails nearby',
  },
]
</script>

<template>
  <div>
    <!-- 1. Thin photo banner -->
    <SharedPageBanner
      image="/img/garten/einfahrt-sommer.webp"
      image-alt="Pension Volgenandt – entrance with garden view in summer"
      title="For Families"
      subtitle="Where Little Ones Are the Stars"
    />

    <!-- 2. Personal intro -->
    <section class="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p class="text-lg leading-relaxed text-sage-800">
        We know how important a relaxing holiday with the whole family is. That is why we have made
        sure that both young and old feel equally at home with us.
      </p>
      <p class="mt-4 text-lg leading-relaxed text-sage-800">
        Our large garden, the peaceful location in the heart of the Eichsfeld and plenty of space to
        run around make Pension Volgenandt the ideal starting point for your family holiday.
      </p>
    </section>

    <!-- 3. Icon feature grid -->
    <section class="bg-cream px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <h2 class="mb-8 text-center font-serif text-2xl font-semibold text-sage-900">
          What Awaits Your Family
        </h2>
        <SharedFeatureGrid :features="familyFeatures" />
      </div>
    </section>

    <!-- 4. Narrative section with photo -->
    <section class="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <div class="grid items-center gap-8 md:grid-cols-2">
        <NuxtImg
          src="/img/content/familie-garten.webp"
          alt="Large garden with playground at Pension Volgenandt"
          class="rounded-lg"
          loading="lazy"
          sizes="100vw md:50vw"
        />
        <div>
          <h2 class="font-serif text-2xl font-bold text-sage-900">
            Our Garden – A Paradise for Children
          </h2>
          <p class="mt-4 leading-relaxed text-sage-800">
            On our large green area, your children can play to their hearts' content and discover
            nature. Swings, a slide and a sandpit invite them to romp around while you relax in the
            sun.
          </p>
          <p class="mt-4 leading-relaxed text-sage-800">
            Bobby cars and tricycles are ready to go, and in the evening we watch the fireflies in
            the garden together. For us, a family holiday is more than just a room – it is the
            little moments that count.
          </p>
        </div>
      </div>
    </section>

    <!-- 5. Terrace & BBQ -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <div class="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h2 class="font-serif text-2xl font-bold text-sage-900">
              Summer Evenings on the Terrace
            </h2>
            <p class="mt-4 leading-relaxed text-sage-800">
              Our covered terrace with barbecue is perfect for cosy family evenings. While the
              children play in the garden, you can fire up the grill and enjoy the view of the
              greenery.
            </p>
            <p class="mt-4 leading-relaxed text-sage-800">
              A barbecue set with utensils and pans can be booked as an extra – just bring your own
              charcoal.
            </p>
          </div>
          <NuxtImg
            src="/img/content/terrasse-grill.webp"
            alt="Covered terrace with barbecue and seating area"
            class="rounded-lg"
            loading="lazy"
            sizes="100vw md:50vw"
          />
        </div>
      </div>
    </section>

    <!-- 6. Breakfast -->
    <section class="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <div class="grid items-center gap-8 md:grid-cols-2">
        <NuxtImg
          src="/img/content/fruehstueck-platte.webp"
          alt="Gourmet breakfast with regional specialities"
          class="rounded-lg"
          loading="lazy"
          sizes="100vw md:50vw"
        />
        <div>
          <h2 class="font-serif text-2xl font-bold text-sage-900">
            Breakfast for the Whole Family
          </h2>
          <p class="mt-4 leading-relaxed text-sage-800">
            A good day starts with a good breakfast. Our gourmet breakfast with regional sausage
            specialities, homemade jam and seasonal fruit from our own garden leaves nothing to be
            desired.
          </p>
          <p class="mt-4 leading-relaxed text-sage-800">
            At breakfast, we are happy to cater to the little ones' wishes – just let us know.
          </p>
        </div>
      </div>
    </section>

    <!-- 7. Additional family info -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-3xl">
        <h2 class="mb-6 text-center font-serif text-2xl font-semibold text-sage-900">
          Practical Tips for Families
        </h2>
        <ul class="space-y-4">
          <li class="flex items-start gap-3">
            <Icon name="ph:check-circle-duotone" class="mt-0.5 size-6 shrink-0 text-sage-600" />
            <span class="leading-relaxed text-sage-800">
              We provide cots and high chairs free of charge in every room – simply let us know when
              booking.
            </span>
          </li>
          <li class="flex items-start gap-3">
            <Icon name="ph:check-circle-duotone" class="mt-0.5 size-6 shrink-0 text-sage-600" />
            <span class="leading-relaxed text-sage-800">
              At breakfast, we are happy to cater to the little ones' wishes.
            </span>
          </li>
          <li class="flex items-start gap-3">
            <Icon name="ph:check-circle-duotone" class="mt-0.5 size-6 shrink-0 text-sage-600" />
            <span class="leading-relaxed text-sage-800">
              The Bear Park Worbis is only 6 km away – a wonderful experience for the whole family.
            </span>
          </li>
          <li class="flex items-start gap-3">
            <Icon name="ph:check-circle-duotone" class="mt-0.5 size-6 shrink-0 text-sage-600" />
            <span class="leading-relaxed text-sage-800">
              Hiking trails and cycling routes nearby – easily accessible by car or rental bike,
              also suitable for little legs.
            </span>
          </li>
        </ul>
      </div>
    </section>

    <!-- 8. Soft CTA -->
    <SharedSoftCta text="Have questions about our family offerings? We're happy to advise." />

    <!-- 9. Booking CTA -->
    <SharedBookingCta text="Plan your family holiday in the Eichsfeld" />
  </div>
</template>
