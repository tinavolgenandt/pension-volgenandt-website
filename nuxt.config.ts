import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Global CSS entry point (contains @theme tokens)
  css: ['~/assets/css/main.css'],

  // Nuxt modules (order matters: @nuxtjs/seo must load before @nuxt/content)
  modules: [
    '@nuxtjs/seo',
    '@nuxtjs/leaflet',
    // Strip leaflet CSS pushed by @nuxtjs/leaflet (causes 404 with pnpm/Vite).
    // We @import it in main.css instead where Vite bundles it correctly.
    (_options, nuxt) => {
      nuxt.options.css = nuxt.options.css.filter((c) => !c.includes('leaflet'))
    },
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/eslint',
    '@vueuse/nuxt',
    '@nuxt/content',
    '@nuxt/icon',
  ],

  // Central site config, shared by all SEO sub-modules
  site: {
    url: 'https://www.pension-volgenandt.de',
    name: 'Pension Volgenandt',
    description:
      'Familiär geführte Pension in Breitenbach, Eichsfeld. Ferienwohnungen und Zimmer mit Blick ins Grüne.',
    defaultLocale: 'de',
  },

  // Sitemap configuration
  sitemap: {
    // Auto-discovers all prerendered routes
  },

  // Robots configuration
  robots: {
    groups: [{ userAgent: '*', allow: '/' }],
  },

  // Link checker: warn only during incremental build (pages added across phases)
  linkChecker: {
    failOnError: false,
  },

  // Tailwind v4 via Vite plugin (NOT @nuxtjs/tailwindcss)
  vite: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins: [tailwindcss() as any],

    // Dev server performance (Windows)
    server: {
      hmr: {
        protocol: 'ws',
        host: 'localhost',
      },
    },

    // Pre-bundle CJS deps to avoid mid-session reload loops
    optimizeDeps: {
      include: ['focus-trap'],
    },
  },

  // Runtime configuration
  runtimeConfig: {
    public: {
      gaMeasurementId: '', // Set via NUXT_PUBLIC_GA_MEASUREMENT_ID
      googleAdsId: '', // Set via NUXT_PUBLIC_GOOGLE_ADS_ID
      paypalClientId: '', // Set via NUXT_PUBLIC_PAYPAL_CLIENT_ID
    },
  },

  // TypeScript strict mode
  typescript: {
    strict: true,
    typeCheck: 'build',
  },

  // Image — custom pass-through provider that prepends app.baseURL for GitHub Pages subpath
  image: {
    provider: 'static',
    providers: {
      static: {
        provider: '~/providers/static.ts',
      },
    },
  },

  // Content module (better-sqlite3 build approved in package.json pnpm config)
  content: {},

  // Icon module: SVG mode avoids hydration mismatch (CSS mode renders <span> on SSR, <svg> on client)
  icon: {
    mode: 'svg',
    serverBundle: 'local',
    clientBundle: {
      scan: true,
    },
  },

  // SSG configuration: prerender routes for all static pages
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        // Phase 1 routes
        '/',
        '/impressum',
        '/datenschutz',
        '/agb',
        // Phase 2 room routes
        '/zimmer/',
        '/zimmer/emils-kuhwiese',
        '/zimmer/schoene-aussicht',
        '/zimmer/balkonzimmer',
        '/zimmer/rosengarten',
        '/zimmer/wohlfuehl-appartement',
        '/zimmer/doppelzimmer',
        '/zimmer/einzelzimmer',
        // Phase 4 content pages
        '/familie/',
        '/nachhaltigkeit/',
        '/picknick/',
        '/picknick/buchen/',
        '/aktivitaeten/',
        '/kontakt/',
        // Phase 4 attraction pages
        '/ausflugsziele/',
        '/ausflugsziele/baerenpark-worbis/',
        '/ausflugsziele/eiscafe-san-remo/',
        '/ausflugsziele/burg-bodenstein/',
        '/ausflugsziele/burg-hanstein/',
        '/ausflugsziele/skywalk-sonnenstein/',
        '/ausflugsziele/burg-scharfenstein/',
        '/ausflugsziele/grenzlandmuseum/',
        '/ausflugsziele/vitalpark-heiligenstadt/',
        '/ausflugsziele/seeburger-see/',
        '/ausflugsziele/baumkronenpfad-hainich/',
        '/ausflugsziele/wartburg/',
        '/ausflugsziele/harz/',
        // Phase 4 activity pages
        '/aktivitaeten/wandern/',
        '/aktivitaeten/radfahren/',
        // SEO landing pages
        '/ferienwohnungen/',
        '/monteurzimmer/',
        // News pages
        '/aktuelles/',
        '/aktuelles/landesgartenschau-2026/',
        '/aktuelles/open-air-burg-scharfenstein-2026/',
        '/aktuelles/neuer-radweg-unstrut-leine/',
        '/aktuelles/baerenpark-festival-2026/',
        // English pages
        '/en/',
        '/en/rooms/',
        '/en/rooms/emils-kuhwiese/',
        '/en/rooms/schoene-aussicht/',
        '/en/rooms/balkonzimmer/',
        '/en/rooms/rosengarten/',
        '/en/rooms/wohlfuehl-appartement/',
        '/en/rooms/einzelzimmer/',
        '/en/contact/',
        '/en/families/',
        '/en/sustainability/',
        '/en/activities/',
        '/en/activities/hiking/',
        '/en/activities/cycling/',
        '/en/attractions/',
        '/en/attractions/baerenpark-worbis/',
        '/en/attractions/eiscafe-san-remo/',
        '/en/attractions/burg-bodenstein/',
        '/en/attractions/burg-hanstein/',
        '/en/attractions/skywalk-sonnenstein/',
        '/en/attractions/burg-scharfenstein/',
        '/en/attractions/grenzlandmuseum/',
        '/en/attractions/vitalpark-heiligenstadt/',
        '/en/attractions/seeburger-see/',
        '/en/attractions/baumkronenpfad-hainich/',
        '/en/attractions/wartburg/',
        '/en/attractions/harz/',
        '/en/news/',
        '/en/news/landesgartenschau-2026/',
        '/en/news/open-air-burg-scharfenstein-2026/',
        '/en/news/neuer-radweg-unstrut-leine/',
        '/en/news/baerenpark-festival-2026/',
        // English SEO landing pages
        '/en/holiday-apartments/',
        '/en/worker-rooms/',
        // English legal pages
        '/en/imprint/',
        '/en/privacy/',
        '/en/terms/',
        // English picnic pages
        '/en/picnic/',
        '/en/picnic/book/',
        '/en/picnic/thanks/',
      ],
      failOnError: false,
    },
  },

  // Global head defaults
  app: {
    head: {
      // lang is set dynamically in app.vue based on locale
      titleTemplate: '%s | Pension Volgenandt',
      title: 'Ruhe finden im Eichsfeld',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'geo.region', content: 'DE-TH' },
        { name: 'geo.placename', content: 'Leinefelde-Worbis' },
        { name: 'geo.position', content: '51.4124;10.322' },
      ],
      // Favicon/manifest links are in app.vue useHead() so baseURL is applied dynamically
    },
  },
})
