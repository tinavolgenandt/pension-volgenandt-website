<script setup lang="ts">
const scrollIndicatorVisible = ref(true)
const posterError = ref(false)
const videoReady = ref(false)

// Prefix static asset paths with baseURL for GitHub Pages subpath deployment
const baseURL = useRuntimeConfig().app.baseURL
const videoSources = {
  webm: `${baseURL}video/hero.webm`,
  mp4: `${baseURL}video/hero.mp4`,
}
const posterPath = `${baseURL}img/hero/hero-poster.webp`

function handleScrollIndicatorClick() {
  const welcome = document.getElementById('willkommen')
  welcome?.scrollIntoView({ behavior: 'smooth' })
}

// Use 'playing' event (not 'canplay') — fires when the first frame is actually
// rendering. Double requestAnimationFrame ensures the frame is painted before
// we start the CSS crossfade, eliminating any black flash.
function onVideoPlaying() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      videoReady.value = true
    })
  })
}

if (import.meta.client) {
  const { y } = useWindowScroll()
  watch(y, (scrollY) => {
    scrollIndicatorVisible.value = scrollY < 100
  })
}
</script>

<template>
  <section class="relative -mt-20 h-dvh w-full overflow-hidden bg-[#2C3E2D]">
    <!-- Desktop poster (landscape, CSS background — video crossfades over it) -->
    <div
      class="hero-poster absolute inset-0 hidden bg-cover bg-center md:block"
      :style="{ backgroundImage: `url('${posterPath}')` }"
    />

    <!-- Mobile poster (portrait crop, better composition for small screens) -->
    <NuxtImg
      v-if="!posterError"
      src="/img/hero/hero-mobile.webp"
      alt="Luftaufnahme der Pension Volgenandt im grünen Eichsfeld"
      class="hero-poster absolute inset-0 h-full w-full object-cover md:hidden"
      loading="eager"
      fetchpriority="high"
      width="405"
      height="720"
      @error="posterError = true"
    />

    <!-- Video (all devices — crossfades over poster once first frame renders) -->
    <ClientOnly>
      <video
        autoplay
        muted
        loop
        playsinline
        preload="auto"
        aria-hidden="true"
        tabindex="-1"
        class="hero-video absolute inset-0 h-full w-full object-cover"
        :class="{ 'is-playing': videoReady }"
        @playing.once="onVideoPlaying"
      >
        <source :src="videoSources.webm" type="video/webm" />
        <source :src="videoSources.mp4" type="video/mp4" />
      </video>
    </ClientOnly>

    <!-- Gradient overlay (sage-charcoal tinted, bottom-to-top) -->
    <div
      class="hero-gradient absolute inset-0 bg-gradient-to-t from-[rgb(44_62_45/0.7)] via-[rgb(44_62_45/0.3)] to-transparent"
    />

    <!-- Text content (bottom-left, pushed above cookie bar on mobile) -->
    <div
      class="absolute inset-x-0 bottom-0 z-10 flex h-full flex-col justify-end px-6 pb-[28%] md:h-[40%] md:px-12 md:pb-20 lg:px-24"
    >
      <h1
        class="hero-animate font-sans text-4xl font-bold tracking-wide text-white md:text-5xl"
        style="
          animation-delay: 300ms;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          letter-spacing: 0.02em;
        "
      >
        Pension Volgenandt
      </h1>
      <p
        class="hero-animate mt-3 font-sans text-lg text-white/90 md:text-[22px]"
        style="animation-delay: 550ms; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3)"
      >
        Ruhe finden im Eichsfeld
      </p>
      <div class="hero-animate mt-4 md:mt-6" style="animation-delay: 800ms">
        <NuxtLink
          to="/zimmer/"
          class="inline-block w-full rounded-lg bg-waldhonig-600 px-6 py-3 text-center font-sans text-base font-semibold text-white transition-[transform,background-color] hover:scale-[1.02] hover:bg-waldhonig-700 md:w-auto md:px-8 md:py-4 md:text-left md:text-lg"
        >
          Zimmer entdecken
        </NuxtLink>
      </div>
    </div>

    <!-- Scroll indicator -->
    <UiScrollIndicator
      :visible="scrollIndicatorVisible"
      class="hero-animate"
      style="animation-delay: 1500ms"
      @click="handleScrollIndicatorClick"
    />
  </section>
</template>

<style scoped>
/* Poster layers — always visible under the video */
.hero-poster {
  z-index: 1;
}

/* Video — crossfades over poster when playing event fires */
.hero-video {
  z-index: 2;
  opacity: 0;
  transition: opacity 400ms ease-in-out;
}

.hero-video.is-playing {
  opacity: 1;
}

/* Gradient stops positioning */
.hero-gradient {
  z-index: 3;
  --tw-gradient-from-position: 0%;
  --tw-gradient-via-position: 40%;
  --tw-gradient-to-position: 60%;
}

/* Staggered entrance animation */
.hero-animate {
  opacity: 0;
  transform: translateY(20px);
  animation: hero-fade-up 700ms ease-out forwards;
}

@keyframes hero-fade-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .hero-animate {
    opacity: 1;
    transform: none;
    animation: none;
  }

  .hero-video {
    display: none;
  }
}

/* Mobile: moderate gradient for text readability over bright poster */
@media (max-width: 767px) {
  .hero-gradient {
    --tw-gradient-from: rgb(44 62 45 / 0.55);
  }
}
</style>
