<script setup lang="ts">
const proofPoints = [
  {
    icon: 'lucide:sun',
    title: 'Solarenergie',
    subtitle: 'Eigener Strom vom Dach',
  },
  {
    icon: 'lucide:droplets',
    title: 'Bio-Kl\u00e4ranlage',
    subtitle: 'Nat\u00fcrliche Abwasserreinigung',
  },
  {
    icon: 'lucide:recycle',
    title: 'Kompost & Kreislauf',
    subtitle: 'Gr\u00fcnschnitt wird zu Gartenerde',
  },
]
</script>

<template>
  <section class="bg-sage-50 py-20 md:py-24">
    <div class="mx-auto max-w-5xl px-6">
      <div class="grid items-center gap-10 md:grid-cols-2">
        <!-- Left: Image -->
        <NuxtImg
          src="/img/content/garten-sonnenhut-blumen.webp"
          alt="Gelber Sonnenhut und bunte Blumen im Garten der Pension"
          class="rounded-lg"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        <!-- Right: Text + proof points -->
        <div>
          <h2 class="font-serif text-3xl font-bold text-sage-900 md:text-4xl">
            Nat&uuml;rlich nachhaltig
          </h2>
          <p class="mt-4 text-lg text-sage-700">
            Nachhaltigkeit ist bei uns kein Trend, sondern gelebter Alltag. Unser Zuhause im
            Eichsfeld pflegen wir mit derselben Sorgfalt wie Ihren Aufenthalt.
          </p>

          <!-- Icon proof points -->
          <div class="mt-8 flex flex-col gap-6">
        <UiScrollReveal
          v-for="(point, index) in proofPoints"
          :key="point.title"
          :delay="index * 150"
        >
          <div class="flex items-center gap-4 md:flex-col md:items-center md:gap-3">
            <!-- Icon circle -->
            <div class="flex size-16 shrink-0 items-center justify-center rounded-full bg-sage-100">
              <Icon :name="point.icon" class="size-8 text-sage-600" />
            </div>
            <!-- Text -->
            <div>
              <h3 class="text-lg font-semibold text-sage-900">{{ point.title }}</h3>
              <p class="mt-1 text-sage-700">{{ point.subtitle }}</p>
            </div>
          </div>
        </UiScrollReveal>
          </div>

          <!-- CTA text link -->
          <div class="mt-8">
            <NuxtLink
              to="/nachhaltigkeit/"
              class="inline-flex items-center gap-1 font-sans font-semibold text-sage-600 transition-colors hover:text-sage-700 hover:underline"
            >
              Mehr &uuml;ber unsere Nachhaltigkeit erfahren &rarr;
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
