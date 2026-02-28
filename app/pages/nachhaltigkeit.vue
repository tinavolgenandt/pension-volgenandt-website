<script setup lang="ts">
definePageMeta({
  breadcrumb: {
    label: 'Nachhaltigkeit',
  },
})

useSeoMeta({
  title: 'Nachhaltigkeit',
  ogTitle: 'Nachhaltigkeit | Pension Volgenandt',
  description:
    'Solarenergie, Kompostierung, Insektenschutz – nachhaltig urlauben in der Pension Volgenandt im Eichsfeld.',
  ogDescription:
    'Solarenergie, Kompostierung, Insektenschutz – nachhaltig urlauben in der Pension Volgenandt im Eichsfeld.',
  ogImage: '/img/banners/nachhaltigkeit-banner.webp',
  ogType: 'website',
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://www.pension-volgenandt.de/nachhaltigkeit/',
    },
    {
      rel: 'alternate',
      hreflang: 'de',
      href: 'https://www.pension-volgenandt.de/nachhaltigkeit/',
    },
  ],
})

const sustainabilityFeatures = [
  {
    icon: 'ph:sun-duotone',
    title: 'Solarenergie',
    description: 'Strom aus eigener Photovoltaikanlage',
  },
  {
    icon: 'ph:recycle-duotone',
    title: 'Kompost & Gemüsegarten',
    description: 'Eigener Kreislauf mit Mülltrennung',
  },
  {
    icon: 'ph:drop-duotone',
    title: 'Eigener Brunnen',
    description: 'Eigenes Wasser mit UV-Aufbereitung',
  },
  {
    icon: 'ph:waves-duotone',
    title: 'Vollbiologische Kläranlage',
    description: 'Natürliche Abwasserreinigung ohne Chemie',
  },
  {
    icon: 'ph:butterfly-duotone',
    title: 'Insektenschutz',
    description: 'Blühwiese und Totholzecke',
  },
  {
    icon: 'ph:tree-duotone',
    title: 'Naturnaher Garten',
    description: 'Einheimische Pflanzen und alte Obstsorten',
  },
  {
    icon: 'ph:leaf-duotone',
    title: 'Regionale Produkte',
    description: 'Frühstück mit Zutaten aus der Region',
  },
]
</script>

<template>
  <div>
    <!-- 1. Thin photo banner -->
    <ContentPageBanner
      image="/img/banners/nachhaltigkeit-banner.webp"
      image-alt="Blick über den grünen Garten der Pension"
      title="Nachhaltigkeit"
      subtitle="Verantwortung für Natur und Umgebung"
    />

    <!-- 2. Personal intro -->
    <section class="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p class="text-lg leading-relaxed text-sage-800">
        Nachhaltigkeit ist für uns kein Trend, sondern eine Selbstverständlichkeit. Wir leben hier
        mitten in der Natur und möchten, dass das auch in Zukunft so bleibt.
      </p>
      <p class="mt-4 text-lg leading-relaxed text-sage-800">
        Deshalb investieren wir seit Jahren in umweltfreundliche Lösungen – von der eigenen
        Solaranlage bis zum naturnahen Garten mit alten Obstsorten und Blühwiesen.
      </p>
    </section>

    <!-- 3. Icon feature grid -->
    <section class="bg-cream px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <h2 class="mb-8 text-center font-serif text-2xl font-semibold text-sage-900">
          Unsere Maßnahmen für die Umwelt
        </h2>
        <ContentFeatureGrid :features="sustainabilityFeatures" />
      </div>
    </section>

    <!-- 4. Narrative section with photo -->
    <section class="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <div class="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h2 class="font-serif text-2xl font-bold text-sage-900">Energie aus der Sonne</h2>
          <p class="mt-4 leading-relaxed text-sage-800">
            Unsere Photovoltaikanlage auf dem Dach versorgt die Pension mit sauberem Strom. Was wir
            nicht selbst verbrauchen, speisen wir ins Netz ein. So tragen wir aktiv zur Energiewende
            bei.
          </p>
          <p class="mt-4 leading-relaxed text-sage-800">
            Auch beim Warmwasser setzen wir auf effiziente Technik und achten darauf, Ressourcen
            sparsam einzusetzen – ohne dass unsere Gäste auf Komfort verzichten müssen.
          </p>
        </div>
        <NuxtImg
          src="/img/content/nachhaltigkeit-solar.webp"
          alt="Photovoltaikanlage auf dem Dach der Pension Volgenandt"
          class="rounded-lg"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </section>

    <!-- 5. Second narrative block -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <div class="grid items-center gap-8 md:grid-cols-2">
          <NuxtImg
            src="/img/content/nachhaltigkeit-garten.webp"
            alt="Naturnaher Garten mit Blühwiese an der Pension"
            class="rounded-lg"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div>
            <h2 class="font-serif text-2xl font-bold text-sage-900">
              Lebensraum für Bienen und Schmetterlinge
            </h2>
            <p class="mt-4 leading-relaxed text-sage-800">
              Unsere Blühwiese wurde von
              <a
                href="https://www.immerbunt.com/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-waldhonig-600 underline hover:text-waldhonig-700"
              >ImmerBunt</a>
              angelegt – Deutschlands erster Blühwiesen-Agentur, die sich für Artenvielfalt und
              Naturschutz einsetzt. Die Wiese bietet Bienen, Schmetterlingen und anderen Insekten
              reichlich Nahrung. In der Totholzecke finden Käfer, Wildbienen und Igel Unterschlupf –
              ein kleines Stück wilde Natur mitten im Garten. Dazu pflegen wir alte Obstsorten, die
              man in modernen Gärten kaum noch findet.
            </p>
            <p class="mt-4 leading-relaxed text-sage-800">
              In unserem Gemüsegarten ziehen wir eigenes Gemüse und Kräuter – gedüngt mit dem
              hauseigenen Kompost, der organische Abfälle in wertvollen Nährstoff verwandelt.
              Damit dieser Kreislauf funktioniert, trennen wir konsequent unseren Müll und bitten
              auch unsere Gäste um Mithilfe bei der Mülltrennung.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Vollbiologische Kläranlage -->
    <section class="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <div class="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h2 class="font-serif text-2xl font-bold text-sage-900">
            Eigenes Wasser – vom Brunnen bis zur Kläranlage
          </h2>
          <p class="mt-4 leading-relaxed text-sage-800">
            Unser Trinkwasser kommt aus einem eigenen Brunnen auf dem Gelände. Eine UV-Anlage
            bereitet das Wasser auf – zuverlässig und ganz ohne chemische Zusätze. So genießen
            unsere Gäste frisches, sauberes Wasser direkt aus der Natur.
          </p>
          <p class="mt-4 leading-relaxed text-sage-800">
            Auch das Abwasser bleibt in unserem Kreislauf: Unsere vollbiologische Kläranlage
            reinigt es auf natürliche Weise. Mikroorganismen bauen organische Stoffe ab, ähnlich
            wie in einem gesunden Gewässer. Nach der mechanischen Vorklärung und der biologischen
            Reinigung wird das saubere Wasser in den natürlichen Kreislauf zurückgeführt.
          </p>
          <p class="mt-4 leading-relaxed text-sage-800">
            Vom Brunnen bis zur Kläranlage – wir kümmern uns selbst um unser Wasser und schützen
            so das Grundwasser und die Gewässer in unserer Umgebung.
          </p>
        </div>
        <div class="flex items-center justify-center rounded-lg bg-sage-100 p-12">
          <Icon name="ph:drop-duotone" class="size-32 text-sage-400" />
        </div>
      </div>
    </section>

    <!-- 7. Regional products highlight -->
    <section class="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <h2 class="mb-6 text-center font-serif text-2xl font-semibold text-sage-900">
        Regional genießen
      </h2>
      <p class="text-center text-lg leading-relaxed text-sage-800">
        Bei unserem Frühstück setzen wir auf Zutaten aus der Region. Hausgemachte Marmelade,
        regionale Wurstspezialitäten und saisonales Obst – so schmeckt das Eichsfeld.
      </p>
    </section>

    <!-- 8. Soft CTA -->
    <ContentSoftCta text="Haben Sie Fragen zu unseren Nachhaltigkeitsmaßnahmen?" />

    <!-- 9. Booking CTA -->
    <ContentBookingCta text="Nachhaltig urlauben im Eichsfeld" />
  </div>
</template>
