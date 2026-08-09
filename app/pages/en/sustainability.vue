<script setup lang="ts">
const siteUrl = 'https://www.pension-volgenandt.de'

definePageMeta({
  breadcrumb: {
    label: 'Sustainability',
  },
})

useSeoMeta({
  title: 'Sustainability',
  ogTitle: 'Sustainability | Pension Volgenandt',
  description:
    'Solar energy, own well, wildflower meadow and vegetable garden: a sustainable holiday at Pension Volgenandt in the Eichsfeld.',
  ogDescription:
    'Solar energy, own well, wildflower meadow and vegetable garden: a sustainable holiday at Pension Volgenandt in the Eichsfeld.',
  ogImage: '/img/content/garten-sonnenhut-blumen.webp',
  ogType: 'website',
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [
    {
      rel: 'canonical',
      href: `${siteUrl}/en/sustainability/`,
    },
    {
      rel: 'alternate',
      hreflang: 'de',
      href: `${siteUrl}/nachhaltigkeit/`,
    },
    {
      rel: 'alternate',
      hreflang: 'en',
      href: `${siteUrl}/en/sustainability/`,
    },
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${siteUrl}/nachhaltigkeit/`,
    },
  ],
})

const sustainabilityFeatures = [
  // Pillar 1: Energy
  {
    icon: 'ph:sun-duotone',
    title: 'Solar Energy',
    description: 'Electricity from our own photovoltaic system',
  },
  {
    icon: 'ph:fire-duotone',
    title: 'Wood Pellet Heating',
    description: 'Climate-neutral warmth from regional wood',
  },
  // Pillar 2: Water
  {
    icon: 'ph:drop-duotone',
    title: 'Own Well',
    description: 'Drinking water with UV treatment',
  },
  {
    icon: 'ph:waves-duotone',
    title: 'Biological Sewage Plant',
    description: 'Natural wastewater treatment without chemicals',
  },
  // Pillar 3: Biodiversity
  {
    icon: 'ph:butterfly-duotone',
    title: 'Wildflower Meadow & Deadwood Corner',
    description: 'Habitat for insects and small animals',
  },
  // Pillar 4: Closed loop
  {
    icon: 'ph:tree-duotone',
    title: 'Own Garden',
    description: 'Fruit, berries and vegetables from our own cultivation',
  },
  {
    icon: 'ph:recycle-duotone',
    title: 'Composting & Recycling',
    description: 'Closed loop from garden to table',
  },
  {
    icon: 'ph:leaf-duotone',
    title: 'Regional Products',
    description: 'Breakfast with ingredients from the region',
  },
]
</script>

<template>
  <div>
    <!-- 1. Thin photo banner -->
    <SharedPageBanner
      image="/img/garten/einfahrt-sommer.webp"
      image-alt="Entrance of Pension Volgenandt with a garden view in summer"
      title="Sustainability"
      subtitle="Responsibility for Nature and Environment"
    />

    <!-- 2. Personal intro -->
    <section class="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p class="text-lg leading-relaxed text-sage-800">
        Sustainability is not a trend for us. It is a matter of course. We live in the heart of
        nature and want it to stay that way. That is why our sustainability rests on four pillars:
        our own energy generation, an independent water supply, active protection of biodiversity
        and a closed loop from the garden to the breakfast table.
      </p>
    </section>

    <!-- 3. Icon feature grid -->
    <section class="bg-cream px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <h2 class="mb-8 text-center font-serif text-2xl font-semibold text-sage-900">
          Our Sustainability Strategy at a Glance
        </h2>
        <SharedFeatureGrid :features="sustainabilityFeatures" />
      </div>
    </section>

    <!-- 4. Pillar 1: Energy -->
    <section class="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <div class="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h2 class="font-serif text-2xl font-bold text-sage-900">Energy from the Sun</h2>
          <p class="mt-4 leading-relaxed text-sage-800">
            Our rooftop photovoltaic system supplies the guesthouse with clean electricity. Any
            surplus we do not use ourselves is fed into the grid. In this way, we actively
            contribute to the energy transition.
          </p>
          <p class="mt-4 leading-relaxed text-sage-800">
            We also rely on efficient technology for hot water and take care to use resources
            sparingly, without our guests having to compromise on comfort.
          </p>
          <p class="mt-4 leading-relaxed text-sage-800">
            For warmth and heating, we use a modern wood pellet system. Pellets made from regional
            wood residues burn particularly cleanly and are considered climate-neutral, since the
            CO₂ released was previously absorbed during tree growth.
          </p>
        </div>
        <NuxtImg
          src="/img/content/photovoltaik-anlage.webp"
          alt="Photovoltaic system on the guesthouse roof with green garden"
          class="rounded-lg"
          loading="lazy"
          sizes="100vw md:50vw"
        />
      </div>
    </section>

    <!-- 5. Pillar 2: Water -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <div class="grid items-center gap-8 md:grid-cols-2">
          <NuxtImg
            src="/img/content/nachhaltigkeit-brunnen-quelle.webp"
            alt="Water flowing from natural stone at the guesthouse's own well"
            class="rounded-lg"
            loading="lazy"
            sizes="100vw md:50vw"
          />
          <div>
            <h2 class="font-serif text-2xl font-bold text-sage-900">
              Our Own Water: From Well to Treatment Plant
            </h2>
            <p class="mt-4 leading-relaxed text-sage-800">
              Our drinking water comes from our own well on the premises. A UV system treats the
              water reliably and entirely without chemical additives. This way, our guests enjoy
              fresh, clean water straight from nature.
            </p>
            <p class="mt-4 leading-relaxed text-sage-800">
              Our wastewater also stays within our cycle: our biological sewage plant cleans it
              naturally. Microorganisms break down organic matter, similar to a healthy body of
              water. After biological treatment, the clean water is returned to the natural cycle.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Pillar 3: Biodiversity -->
    <section class="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <div class="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h2 class="font-serif text-2xl font-bold text-sage-900">Biodiversity at Our Doorstep</h2>
          <p class="mt-4 leading-relaxed text-sage-800">
            Our wildflower meadow was created by
            <a
              href="https://www.immerbunt.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-waldhonig-600 underline hover:text-waldhonig-700"
              >ImmerBunt</a
            >
            , Germany's first wildflower meadow agency. The meadow provides bees, butterflies and
            other insects with plenty of food.
          </p>
          <p class="mt-4 leading-relaxed text-sage-800">
            In the deadwood corner, beetles, wild bees and hedgehogs find shelter, a deliberately
            preserved piece of wild nature. Together with native wildflowers and heritage fruit
            varieties, a diverse habitat is created right on our doorstep.
          </p>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <NuxtImg
            src="/img/content/garten-schmetterling-flieder.webp"
            alt="Peacock butterfly on buddleia in the guesthouse garden"
            class="aspect-square w-full rounded-lg object-cover"
            loading="lazy"
            sizes="50vw md:25vw"
          />
          <NuxtImg
            src="/img/content/amphibien-gartenteich.webp"
            alt="Amphibians at the garden pond of Pension Volgenandt"
            class="aspect-square w-full rounded-lg object-cover"
            loading="lazy"
            sizes="50vw md:25vw"
          />
        </div>
      </div>
    </section>

    <!-- 7. Pillar 4: From garden to table -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <div class="grid items-center gap-8 md:grid-cols-2">
          <NuxtImg
            src="/img/content/garten-apfelbaeume.webp"
            alt="Apple trees with ripe fruit in the guesthouse garden"
            class="rounded-lg"
            loading="lazy"
            sizes="100vw md:50vw"
          />
          <div>
            <h2 class="font-serif text-2xl font-bold text-sage-900">From Garden to Table</h2>
            <p class="mt-4 leading-relaxed text-sage-800">
              Various fruit, berries and vegetables grow in our garden. We harvest everything
              ourselves and process much of it, whether as homemade jam, fresh herbs or seasonal
              fruit for breakfast.
            </p>
            <p class="mt-4 leading-relaxed text-sage-800">
              What does not come from our own garden, we source from the region: sausage
              specialities from the Eichsfeld butcher and other ingredients from regional producers.
              We fertilise with our own compost, which turns organic waste into valuable nutrients.
            </p>
            <p class="mt-4 leading-relaxed text-sage-800">
              To keep this cycle working, we consistently separate our waste and also ask our guests
              to help with recycling.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. Garden impressions -->
    <section class="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <h2 class="mb-8 text-center font-serif text-2xl font-semibold text-sage-900">
        Our Garden Through the Seasons
      </h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <figure>
          <NuxtImg
            src="/img/content/garten-krokusse-fruehling.webp"
            alt="Purple crocuses in spring"
            class="aspect-square rounded-lg object-cover"
            loading="lazy"
            sizes="50vw sm:25vw"
          />
          <figcaption class="mt-2 text-center text-sm text-sage-600">Spring</figcaption>
        </figure>
        <figure>
          <NuxtImg
            src="/img/content/garten-bluehwiese-fruehsommer.webp"
            alt="Wildflower meadow with daisies in early summer"
            class="aspect-square rounded-lg object-cover"
            loading="lazy"
            sizes="50vw sm:25vw"
          />
          <figcaption class="mt-2 text-center text-sm text-sage-600">Wildflower Meadow</figcaption>
        </figure>
        <figure>
          <NuxtImg
            src="/img/content/garten-kirschen.webp"
            alt="Ripe cherries on the tree in the garden"
            class="aspect-square rounded-lg object-cover"
            loading="lazy"
            sizes="50vw sm:25vw"
          />
          <figcaption class="mt-2 text-center text-sm text-sage-600">Cherry Harvest</figcaption>
        </figure>
        <figure>
          <NuxtImg
            src="/img/content/garten-zwiebeln-eigenanbau.webp"
            alt="Home-grown onions hung up to dry"
            class="aspect-square rounded-lg object-cover"
            loading="lazy"
            sizes="50vw sm:25vw"
          />
          <figcaption class="mt-2 text-center text-sm text-sage-600">Home-grown</figcaption>
        </figure>
      </div>
    </section>

    <!-- 9. Soft CTA -->
    <SharedSoftCta text="Have questions about our sustainability measures?" />

    <!-- 10. Booking CTA -->
    <SharedBookingCta text="A sustainable holiday in the Eichsfeld" />
  </div>
</template>
