<script setup lang="ts">
const photos = [
  {
    src: '/img/garten/garten-sonnenaufgang-einfahrt.jpg',
    alt: 'Sonnenaufgang über dem Hof und Garten der Pension Volgenandt',
  },
  {
    src: '/img/garten/umgebung-pension-kornfeld.jpg',
    alt: 'Pension Volgenandt eingebettet in die Eichsfelder Kornfelder',
  },
  {
    src: '/img/garten/umgebung-wiese-pusteblumen.jpg',
    alt: 'Frühlingswiese mit Pusteblumen direkt neben der Pension',
  },
  {
    src: '/img/garten/garten-biotop-schilf.jpg',
    alt: 'Naturteich mit Schilf und Wildblumen im Garten der Pension',
  },
  {
    src: '/img/garten/garten-apfelbaum-blumen.jpg',
    alt: 'Apfelbaum mit reifen Früchten und Blumenbeeten im Pensionsgarten',
  },
  {
    src: '/img/garten/garten-laube-herbst.jpg',
    alt: 'Gartenlaube mit buntem Herbstgarten der Pension',
  },
  {
    src: '/img/garten/umgebung-felder-abendsonne.jpg',
    alt: 'Abendstimmung über den Feldern des Eichsfelds vom Garten aus',
  },
  {
    src: '/img/garten/pension-winter-schnee.jpg',
    alt: 'Pension Volgenandt im Winter mit tiefem Schnee und blauem Himmel',
  },
  {
    src: '/img/content/landschaft-winter.webp',
    alt: 'Winterlandschaft im Eichsfeld mit verschneiten Feldern und Sonnenschein',
  },
]
</script>

<template>
  <section class="py-16 md:py-24">
    <div class="mx-auto max-w-6xl px-6">
      <!-- Heading -->
      <div class="mb-10 text-center">
        <h2 class="font-serif text-3xl font-bold text-sage-900 md:text-4xl">
          Garten &amp; Umgebung
        </h2>
        <p class="mt-3 text-lg text-sage-600">
          Vier Jahreszeiten &ndash; ein Ort der Ruhe
        </p>
      </div>

      <!-- Photo grid -->
      <div class="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        <!-- First photo spans 2 columns and 2 rows -->
        <div class="col-span-2 row-span-2 overflow-hidden rounded-lg">
          <NuxtImg
            :src="photos[0].src"
            :alt="photos[0].alt"
            class="aspect-[4/3] w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
            sizes="sm:100vw md:50vw"
          />
        </div>

        <!-- Photos 2–5: single cells -->
        <div
          v-for="photo in photos.slice(1, 5)"
          :key="photo.src"
          class="overflow-hidden rounded-lg"
        >
          <NuxtImg
            :src="photo.src"
            :alt="photo.alt"
            class="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
            sizes="sm:50vw md:25vw"
          />
        </div>

        <!-- Photos 6–8: bottom row, full width divided by 3 -->
        <div
          v-for="photo in photos.slice(5)"
          :key="photo.src"
          class="col-span-2 overflow-hidden rounded-lg md:col-span-1"
        >
          <NuxtImg
            :src="photo.src"
            :alt="photo.alt"
            class="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
            sizes="sm:100vw md:25vw"
          />
        </div>
      </div>
    </div>
  </section>
</template>
