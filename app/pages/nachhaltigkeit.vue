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
    'Solarenergie, eigener Brunnen, Blühwiese und Gemüsegarten – nachhaltig urlauben in der Pension Volgenandt im Eichsfeld.',
  ogDescription:
    'Solarenergie, eigener Brunnen, Blühwiese und Gemüsegarten – nachhaltig urlauben in der Pension Volgenandt im Eichsfeld.',
  ogImage: '/img/content/garten-sonnenhut-blumen.webp',
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
  // Säule 1: Energie
  {
    icon: 'ph:sun-duotone',
    title: 'Solarenergie',
    description: 'Strom aus eigener Photovoltaikanlage',
  },
  {
    icon: 'ph:fire-duotone',
    title: 'Holzpelletsheizung',
    description: 'Klimaneutrale Wärme aus regionalem Holz',
  },
  // Säule 2: Wasser
  {
    icon: 'ph:drop-duotone',
    title: 'Eigener Brunnen',
    description: 'Trinkwasser mit UV-Aufbereitung',
  },
  {
    icon: 'ph:waves-duotone',
    title: 'Vollbiologische Kläranlage',
    description: 'Natürliche Abwasserreinigung ohne Chemie',
  },
  // Säule 3: Artenvielfalt
  {
    icon: 'ph:butterfly-duotone',
    title: 'Blühwiese & Totholzecke',
    description: 'Lebensraum für Insekten und Kleintiere',
  },
  // Säule 4: Kreislauf
  {
    icon: 'ph:tree-duotone',
    title: 'Eigener Garten',
    description: 'Obst, Beeren und Gemüse aus eigenem Anbau',
  },
  {
    icon: 'ph:recycle-duotone',
    title: 'Kompost & Mülltrennung',
    description: 'Geschlossener Kreislauf vom Garten bis zum Tisch',
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
    <SharedPageBanner
      image="/img/garten/einfahrt-sommer.webp"
      image-alt="Pension Volgenandt – Einfahrt mit Gartenblick im Sommer"
      title="Nachhaltigkeit"
      subtitle="Verantwortung für Natur und Umgebung"
    />

    <!-- 2. Personal intro -->
    <section class="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p class="text-lg leading-relaxed text-sage-800">
        Nachhaltigkeit ist für uns kein Trend, sondern eine Selbstverständlichkeit. Wir leben mitten
        in der Natur und möchten, dass das auch in Zukunft so bleibt. Deshalb ruht unsere
        Nachhaltigkeit auf vier Säulen: eigene Energieerzeugung, eine unabhängige Wasserversorgung,
        aktiver Schutz der Artenvielfalt und ein geschlossener Kreislauf vom Garten bis auf den
        Frühstückstisch.
      </p>
    </section>

    <!-- 3. Icon feature grid -->
    <section class="bg-cream px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <h2 class="mb-8 text-center font-serif text-2xl font-semibold text-sage-900">
          Unsere Nachhaltigkeitsstrategie auf einen Blick
        </h2>
        <SharedFeatureGrid :features="sustainabilityFeatures" />
      </div>
    </section>

    <!-- 4. Säule 1: Energie -->
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
          <p class="mt-4 leading-relaxed text-sage-800">
            Für Wärme und Heizung nutzen wir eine moderne Holzpelletsanlage. Pellets aus
            regionalen Holzresten verbrennen besonders sauber und gelten als klimaneutral –
            das freigesetzte CO₂ wurde zuvor beim Baumwachstum gebunden.
          </p>
        </div>
        <NuxtImg
          src="/img/content/photovoltaik-anlage.webp"
          alt="Photovoltaikanlage auf dem Dach der Pension mit grünem Garten"
          class="rounded-lg"
          loading="lazy"
          sizes="100vw md:50vw"
        />
      </div>
    </section>

    <!-- 5. Säule 2: Wasser -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <div class="grid items-center gap-8 md:grid-cols-2">
          <NuxtImg
            src="/img/content/nachhaltigkeit-brunnen-quelle.webp"
            alt="Wasser sprudelt aus einem Naturstein – eigener Brunnen der Pension Volgenandt"
            class="rounded-lg"
            loading="lazy"
            sizes="100vw md:50vw"
          />
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
              wie in einem gesunden Gewässer. Nach der biologischen Reinigung wird das saubere
              Wasser in den natürlichen Kreislauf zurückgeführt.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Säule 3: Artenvielfalt -->
    <section class="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <div class="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h2 class="font-serif text-2xl font-bold text-sage-900">Artenvielfalt vor der Haustür</h2>
          <p class="mt-4 leading-relaxed text-sage-800">
            Unsere Blühwiese wurde von
            <a
              href="https://www.immerbunt.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-waldhonig-600 underline hover:text-waldhonig-700"
              >ImmerBunt</a
            >
            angelegt – Deutschlands erster Blühwiesen-Agentur. Die Wiese bietet Bienen,
            Schmetterlingen und anderen Insekten reichlich Nahrung.
          </p>
          <p class="mt-4 leading-relaxed text-sage-800">
            In der Totholzecke finden Käfer, Wildbienen und Igel Unterschlupf – ein bewusst
            belassenes Stück wilde Natur. Zusammen mit einheimischen Wildblumen und alten Obstarten
            entsteht ein vielfältiger Lebensraum direkt vor unserer Haustür.
          </p>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <NuxtImg
            src="/img/content/garten-schmetterling-flieder.webp"
            alt="Tagpfauenauge auf Sommerflieder im Garten der Pension"
            class="rounded-lg aspect-square object-cover w-full"
            loading="lazy"
            sizes="50vw md:25vw"
          />
          <NuxtImg
            src="/img/content/amphibien-gartenteich.webp"
            alt="Amphibien am Gartenteich der Pension Volgenandt"
            class="rounded-lg aspect-square object-cover w-full"
            loading="lazy"
            sizes="50vw md:25vw"
          />
        </div>
      </div>
    </section>

    <!-- 7. Säule 4: Vom Garten auf den Tisch -->
    <section class="bg-sage-50 px-6 py-12 md:py-16">
      <div class="mx-auto max-w-5xl">
        <div class="grid items-center gap-8 md:grid-cols-2">
          <NuxtImg
            src="/img/content/garten-apfelbaeume.webp"
            alt="Apfelbäume mit reifen Früchten im Garten der Pension"
            class="rounded-lg"
            loading="lazy"
            sizes="100vw md:50vw"
          />
          <div>
            <h2 class="font-serif text-2xl font-bold text-sage-900">Vom Garten auf den Tisch</h2>
            <p class="mt-4 leading-relaxed text-sage-800">
              In unserem Garten wachsen verschiedene Obstarten, Beeren und Gemüse. Wir ernten alles
              selbst und verarbeiten vieles davon – ob als hausgemachte Marmelade, frische Kräuter
              oder saisonales Obst zum Frühstück.
            </p>
            <p class="mt-4 leading-relaxed text-sage-800">
              Was nicht aus dem eigenen Garten kommt, beziehen wir aus der Region:
              Wurstspezialitäten vom Eichsfelder Metzger und andere Zutaten von regionalen
              Erzeugern. Gedüngt wird mit dem hauseigenen Kompost, der organische Abfälle in
              wertvollen Nährstoff verwandelt.
            </p>
            <p class="mt-4 leading-relaxed text-sage-800">
              Damit dieser Kreislauf funktioniert, trennen wir konsequent unseren Müll und bitten
              auch unsere Gäste um Mithilfe bei der Mülltrennung.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. Garten-Impressionen -->
    <section class="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <h2 class="mb-8 text-center font-serif text-2xl font-semibold text-sage-900">
        Unser Garten im Wandel der Jahreszeiten
      </h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <figure>
          <NuxtImg
            src="/img/content/garten-krokusse-fruehling.webp"
            alt="Lila Krokusse im Frühling"
            class="aspect-square rounded-lg object-cover"
            loading="lazy"
            sizes="50vw sm:25vw"
          />
          <figcaption class="mt-2 text-center text-sm text-sage-600">Frühling</figcaption>
        </figure>
        <figure>
          <NuxtImg
            src="/img/content/garten-bluehwiese-fruehsommer.webp"
            alt="Blühwiese mit Margeriten im Frühsommer"
            class="aspect-square rounded-lg object-cover"
            loading="lazy"
            sizes="50vw sm:25vw"
          />
          <figcaption class="mt-2 text-center text-sm text-sage-600">Blühwiese</figcaption>
        </figure>
        <figure>
          <NuxtImg
            src="/img/content/garten-kirschen.webp"
            alt="Reife Kirschen am Baum im Garten"
            class="aspect-square rounded-lg object-cover"
            loading="lazy"
            sizes="50vw sm:25vw"
          />
          <figcaption class="mt-2 text-center text-sm text-sage-600">Kirschernte</figcaption>
        </figure>
        <figure>
          <NuxtImg
            src="/img/content/garten-zwiebeln-eigenanbau.webp"
            alt="Selbst angebaute Zwiebeln zum Trocknen aufgehängt"
            class="aspect-square rounded-lg object-cover"
            loading="lazy"
            sizes="50vw sm:25vw"
          />
          <figcaption class="mt-2 text-center text-sm text-sage-600">Eigenanbau</figcaption>
        </figure>
      </div>
    </section>

    <!-- 9. Soft CTA -->
    <SharedSoftCta text="Haben Sie Fragen zu unseren Nachhaltigkeitsmaßnahmen?" />

    <!-- 9. Booking CTA -->
    <SharedBookingCta text="Nachhaltig urlauben im Eichsfeld" />
  </div>
</template>
