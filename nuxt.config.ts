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

  // TypeScript strict mode
  typescript: {
    strict: true,
    typeCheck: 'build',
  },

  // Image optimization
  image: {
    format: ['avif', 'webp'],
    quality: 80,
  },

  // Content module (better-sqlite3 build approved in package.json pnpm config)
  content: {},

  // Icon module: Lucide icon set with server bundle for SSG
  icon: {
    serverBundle: 'local',
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
        '/aktivitaeten/',
        '/kontakt/',
        // Phase 4 attraction pages
        '/ausflugsziele/',
        '/ausflugsziele/baerenpark-worbis/',
        '/ausflugsziele/burg-bodenstein/',
        '/ausflugsziele/burg-hanstein/',
        '/ausflugsziele/skywalk-sonnenstein/',
        '/ausflugsziele/baumkronenpfad-hainich/',
        // Phase 4 activity pages
        '/aktivitaeten/wandern/',
        '/aktivitaeten/radfahren/',
      ],
      failOnError: false,
    },
  },

  // Global head defaults
  app: {
    head: {
      htmlAttrs: { lang: 'de' },
      title: 'Pension Volgenandt | Ruhe finden im Eichsfeld',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },
})
