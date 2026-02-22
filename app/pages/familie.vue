<script setup lang="ts">
definePageMeta({
  breadcrumb: {
    label: 'Familie & Kinder',
  },
})

useSeoMeta({
  title: 'Familie & Kinder',
  ogTitle: 'Familie & Kinder | Pension Volgenandt',
  description:
    'Familienurlaub im Eichsfeld: Spielplatz, Garten, Kinderfahrzeuge, Kinderbetten und mehr. Pension Volgenandt in Breitenbach.',
  ogDescription:
    'Familienurlaub im Eichsfeld: Spielplatz, Garten, Kinderfahrzeuge, Kinderbetten und mehr. Pension Volgenandt in Breitenbach.',
  ogImage: '/img/banners/familie-banner.webp',
  ogType: 'website',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://www.pension-volgenandt.de/familie/' },
    {
      rel: 'alternate',
      hreflang: 'de',
      href: 'https://www.pension-volgenandt.de/familie/',
    },
  ],
})

const familyFeatures = [
  {
    icon: 'ph:baby-duotone',
    title: 'Kinderbetten & Hochstühle',
    description: 'Kostenlos in jedem Zimmer verfügbar',
  },
  {
    icon: 'ph:plant-duotone',
    title: 'Großer Garten',
    description: 'Viel Platz zum Spielen und Entdecken',
  },
  {
    icon: 'ph:car-duotone',
    title: 'Kinderfahrzeuge',
    description: 'Bobbycars, Dreirad und mehr',
  },
  {
    icon: 'ph:tree-duotone',
    title: 'Spielplatz',
    description: 'Schaukel, Rutsche und Sandkasten',
  },
  {
    icon: 'ph:dog-duotone',
    title: 'Haustiere willkommen',
    description: 'Hunde sind bei uns gerne gesehen',
  },
  {
    icon: 'ph:mountains-duotone',
    title: 'Natur erleben',
    description: 'Wanderwege direkt vor der Tür',
  },
]
</script>

<template>
  <div>
    <!-- 1. Thin photo banner -->
    <ContentPageBanner
      image="/img/banners/familie-banner.webp"
      image-alt="Kinder spielen im Garten der Pension Volgenandt"
      title="Familie & Kinder"
      subtitle="Bei uns sind die Kleinen die Größten"
    />

    <!-- 2. Personal intro -->
    <section class="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p class="text-lg leading-relaxed text-sage-800">
        Wir wissen, wie wichtig ein entspannter Urlaub mit der ganzen Familie ist. Deshalb haben wir
        uns darauf eingerichtet, dass sich bei uns Groß und Klein gleichermaßen wohlfühlen.
      </p>
      <p class="mt-4 text-lg leading-relaxed text-sage-800">
        Unser großer Garten, die ruhige Lage mitten im Eichsfeld und viel Platz zum Toben machen die
        Pension Volgenandt zum idealen Ausgangspunkt für Ihren Familienurlaub.
      </p>
    </section>

    <!-- 3. Icon feature grid -->
    <section class="bg-cream px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <h2 class="mb-8 text-center font-serif text-2xl font-semibold text-sage-900">
          Das erwartet Ihre Familie
        </h2>
        <ContentFeatureGrid :features="familyFeatures" />
      </div>
    </section>

    <!-- 4. Narrative section with photo -->
    <section class="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <div class="grid items-center gap-8 md:grid-cols-2">
        <NuxtImg
          src="/img/content/familie-garten.webp"
          alt="Großer Garten mit Spielplatz an der Pension Volgenandt"
          class="rounded-lg"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div>
          <h2 class="font-serif text-2xl font-bold text-sage-900">
            Unser Garten – ein Paradies für Kinder
          </h2>
          <p class="mt-4 leading-relaxed text-sage-800">
            Auf unserer großen Grünfläche können Ihre Kinder nach Herzenslust spielen und die Natur
            entdecken. Schaukel, Rutsche und Sandkasten laden zum Toben ein, während Sie in der
            Sonne entspannen.
          </p>
          <p class="mt-4 leading-relaxed text-sage-800">
            Bobbycars und Dreirad stehen bereit, und am Abend beobachten wir gemeinsam die
            Glühwürmchen im Garten. Für uns ist Familienurlaub mehr als nur ein Zimmer – es sind die
            kleinen Momente, die zählen.
          </p>
        </div>
      </div>
    </section>

    <!-- 5. Additional family info -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-3xl">
        <h2 class="mb-6 text-center font-serif text-2xl font-semibold text-sage-900">
          Praktisches für Familien
        </h2>
        <ul class="space-y-4">
          <li class="flex items-start gap-3">
            <Icon name="ph:check-circle-duotone" class="mt-0.5 size-6 shrink-0 text-sage-600" />
            <span class="leading-relaxed text-sage-800">
              Kinderbetten und Hochstühle stellen wir kostenlos in jedem Zimmer bereit – einfach bei
              der Buchung angeben.
            </span>
          </li>
          <li class="flex items-start gap-3">
            <Icon name="ph:check-circle-duotone" class="mt-0.5 size-6 shrink-0 text-sage-600" />
            <span class="leading-relaxed text-sage-800">
              Für unsere kleinen Gäste bieten wir ein Kinderfrühstück mit allem, was schmeckt.
            </span>
          </li>
          <li class="flex items-start gap-3">
            <Icon name="ph:check-circle-duotone" class="mt-0.5 size-6 shrink-0 text-sage-600" />
            <span class="leading-relaxed text-sage-800">
              Der Bärenpark Worbis ist nur 12 km entfernt – ein tolles Erlebnis für die ganze
              Familie.
            </span>
          </li>
          <li class="flex items-start gap-3">
            <Icon name="ph:check-circle-duotone" class="mt-0.5 size-6 shrink-0 text-sage-600" />
            <span class="leading-relaxed text-sage-800">
              Wanderwege und Radtouren starten direkt vor unserer Tür – auch für kleine Beine
              geeignet.
            </span>
          </li>
        </ul>
      </div>
    </section>

    <!-- 6. Soft CTA -->
    <ContentSoftCta text="Haben Sie Fragen zu unserem Familienangebot? Wir beraten Sie gerne." />

    <!-- 7. Booking CTA -->
    <ContentBookingCta text="Planen Sie Ihren Familienurlaub im Eichsfeld" />
  </div>
</template>
