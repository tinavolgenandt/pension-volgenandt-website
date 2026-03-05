<script setup lang="ts">
defineOptions({
  inheritAttrs: true,
})
</script>

<template>
  <section id="willkommen" tabindex="-1" class="py-14 md:py-24">
    <div class="mx-auto max-w-6xl px-6">
      <div class="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <!-- Text content -->
        <div>
          <h2 class="font-serif text-3xl font-bold text-sage-900 md:text-4xl">
            Willkommen bei uns
          </h2>

          <div class="mt-6 space-y-4 text-lg leading-relaxed text-sage-700">
            <p>
              Wir sind Simone &amp; Ralf Volgenandt und freuen uns, Sie in unserem Zuhause im
              Eichsfeld willkommen zu heißen. Unsere Pension liegt etwa einen Kilometer außerhalb
              von Breitenbach, eingebettet in die sanfte Hügellandschaft Thüringens – ein Ort, an
              dem die Zeit ein wenig langsamer vergeht.
            </p>
            <p>
              Ob Sie die Burgen und Wanderwege der Region erkunden, den nahen Bärenpark besuchen
              oder einfach die Stille genießen möchten: Bei uns finden Sie den Ausgangspunkt für
              erholsame Tage. Unsere Ferienwohnungen und Zimmer bieten Ihnen Platz, Komfort und
              einen Blick ins Grüne.
            </p>
            <p>
              Wir bewirtschaften unser Haus mit Sorgfalt und Liebe zur Natur – mit Solarenergie vom
              eigenen Dach, einer biologischen Kläranlage und einem Garten, der zum Verweilen
              einlädt.
            </p>
          </div>
        </div>

        <!-- Lifestyle image -->
        <div class="order-first md:order-last">
          <NuxtImg
            src="/img/content/gastgeber-portrait.webp"
            alt="Simone und Ralf Volgenandt – Ihre Gastgeber in Breitenbach"
            class="w-full rounded-lg object-cover shadow-sm"
            loading="lazy"
            sizes="sm:100vw md:50vw"
            width="800"
            height="985"
          />
        </div>
      </div>
    </div>
  </section>
</template>
