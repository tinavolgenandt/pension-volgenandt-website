<script setup lang="ts">
const config = useAppConfig()

const footerNav = [
  { label: 'Zimmer & Preise', to: '/zimmer' },
  { label: 'Familie & Kinder', to: '/familie' },
  { label: 'Aktivitäten', to: '/aktivitaeten' },
  { label: 'Nachhaltigkeit', to: '/nachhaltigkeit' },
  { label: 'Ausflugsziele', to: '/ausflugsziele' },
  { label: 'Kontakt & Anfahrt', to: '/kontakt' },
]

const legalNav = [
  { label: 'Impressum', to: '/impressum' },
  { label: 'Datenschutz', to: '/datenschutz' },
  { label: 'AGB', to: '/agb' },
]

const { openSettings } = useCookieConsent()

function openCookieSettings() {
  openSettings()
}
</script>

<template>
  <footer>
    <!-- Above-footer CTA bar -->
    <section class="bg-waldhonig-500">
      <div class="mx-auto max-w-screen-xl px-4 py-8 text-center">
        <h2 class="font-serif text-2xl font-semibold text-white">
          Bereit für Ihren Aufenthalt im Eichsfeld?
        </h2>
        <div class="mt-4">
          <NuxtLink
            to="/zimmer"
            class="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 font-sans font-semibold text-waldhonig-600 transition-colors duration-200 hover:bg-waldhonig-50"
          >
            Verfügbarkeit prüfen
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Main footer: 4-column grid -->
    <section class="bg-charcoal-900 text-sage-200">
      <div class="mx-auto max-w-screen-xl px-4 py-12">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 nav:grid-cols-4">
          <!-- Column 1: Brand (order-3 on mobile, order-1 on desktop) -->
          <div class="order-3 nav:order-1">
            <p class="font-serif text-xl font-bold text-white">
              {{ config.siteName }}
            </p>
            <p class="mt-2 font-sans text-sage-300 italic">
              {{ config.siteTagline }}
            </p>
            <!-- Social icons placeholder: include when active per CONTEXT -->
            <!-- Facebook | Instagram links: pending owner confirmation of active profiles -->
          </div>

          <!-- Column 2: Kontakt (order-1 on mobile = phone first, order-2 on desktop) -->
          <div class="order-1 nav:order-2">
            <h3 class="mb-4 font-serif text-lg font-semibold text-white">Kontakt</h3>

            <!-- Address -->
            <address class="leading-relaxed not-italic">
              <p>{{ config.contact.address.street }}</p>
              <p>{{ config.contact.address.city }}</p>
              <p>{{ config.contact.address.country }}</p>
            </address>

            <!-- Phone -->
            <a
              :href="`tel:${config.contact.phone}`"
              class="mt-4 flex items-center gap-2 text-sage-300 transition-colors duration-200 hover:text-white"
            >
              <svg
                class="size-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                />
              </svg>
              <span>{{ config.contact.phoneDisplay }}</span>
            </a>

            <!-- Email -->
            <a
              :href="`mailto:${config.contact.email}`"
              class="mt-2 flex items-center gap-2 text-sage-300 transition-colors duration-200 hover:text-white"
            >
              <svg
                class="size-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>{{ config.contact.email }}</span>
            </a>
          </div>

          <!-- Column 3: Entdecken (order-2 on mobile, order-3 on desktop) -->
          <div class="order-2 nav:order-3">
            <h3 class="mb-4 font-serif text-lg font-semibold text-white">Entdecken</h3>
            <ul class="space-y-2">
              <li v-for="item in footerNav" :key="item.to">
                <NuxtLink
                  :to="item.to"
                  class="inline-block py-1 text-sage-300 transition-colors duration-200 hover:text-white"
                >
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Column 4: Rechtliches (order-4 on both) -->
          <div class="order-4">
            <h3 class="mb-4 font-serif text-lg font-semibold text-white">Rechtliches</h3>
            <ul class="space-y-2">
              <li v-for="item in legalNav" :key="item.to">
                <NuxtLink
                  :to="item.to"
                  class="inline-block py-1 text-sage-300 transition-colors duration-200 hover:text-white"
                >
                  {{ item.label }}
                </NuxtLink>
              </li>
              <li>
                <button
                  type="button"
                  data-cookie-settings
                  class="inline-block py-1 text-sage-300 transition-colors duration-200 hover:text-white"
                  @click="openCookieSettings"
                >
                  Cookie-Einstellungen
                </button>
              </li>
            </ul>

            <!-- Trust badges placeholder -->
            <div class="mt-6">
              <!-- DEHOGA / Secure Booking badges: pending owner confirmation -->
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sub-footer copyright bar -->
    <section class="bg-charcoal-950">
      <div class="mx-auto max-w-screen-xl px-4 py-4 text-center text-sm text-sage-400">
        &copy; {{ new Date().getFullYear() }} {{ config.siteName }}. Alle Rechte vorbehalten.
      </div>
    </section>
  </footer>
</template>
