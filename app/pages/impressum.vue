<script setup lang="ts">
const config = useAppConfig()

useSeoMeta({
  title: 'Impressum',
  description:
    'Impressum der Pension Volgenandt in Leinefelde-Worbis OT Breitenbach. Angaben gemäß DDG § 5.',
})
</script>

<template>
  <div class="mx-auto max-w-screen-xl px-4 py-12">
    <div class="prose-content">
      <h1 class="mb-6 font-serif text-3xl font-bold text-sage-900">Impressum</h1>
      <p class="mb-8 text-sage-600">Angaben gemäß DDG § 5</p>

      <!-- Diensteanbieter -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">Diensteanbieter</h2>
        <p>{{ config.legal.ownerName }}</p>
        <p>{{ config.siteName }}</p>
        <p>{{ config.contact.address.street }}</p>
        <p>{{ config.contact.address.city }}</p>
        <p>{{ config.contact.address.country }}</p>
      </section>

      <!-- Kontakt -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">Kontakt</h2>
        <p>
          Telefon:
          <a
            :href="`tel:${config.contact.phone}`"
            class="text-waldhonig-600 underline hover:text-waldhonig-700"
          >
            {{ config.contact.phoneDisplay }}
          </a>
        </p>
        <p>
          Mobil:
          <a
            :href="`tel:${config.contact.mobile}`"
            class="text-waldhonig-600 underline hover:text-waldhonig-700"
          >
            {{ config.contact.mobileDisplay }}
          </a>
        </p>
        <p>
          E-Mail:
          <a
            :href="`mailto:${config.contact.email}`"
            class="text-waldhonig-600 underline hover:text-waldhonig-700"
          >
            {{ config.contact.email }}
          </a>
        </p>
      </section>

      <!-- Umsatzsteuer-ID -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">
          Umsatzsteuer-ID / Steuernummer
        </h2>
        <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:</p>
        <p class="font-semibold">{{ config.legal.taxId }}</p>
      </section>

      <!-- Verantwortlich für den Inhalt -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">
          Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
        </h2>
        <p>{{ config.legal.ownerName }}</p>
        <p>{{ config.contact.address.street }}</p>
        <p>{{ config.contact.address.city }}</p>
      </section>

      <!-- EU-Streitschlichtung -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">
          EU-Streitschlichtung
        </h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-waldhonig-600 underline hover:text-waldhonig-700"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
        </p>
        <p class="mt-2">Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
      </section>

      <!-- Verbraucherstreitbeilegung -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">
          Verbraucherstreitbeilegung / Universalschlichtungsstelle
        </h2>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </section>

      <!-- Haftungshinweis -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">
          Haftung für Inhalte
        </h2>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten
          nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als
          Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
          Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
          Tätigkeit hinweisen.
        </p>
        <p class="mt-2">
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
          allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch
          erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
          Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend
          entfernen.
        </p>
      </section>

      <!-- Haftung für Links -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">Haftung für Links</h2>
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
          Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
          Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
          Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf
          mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
          Verlinkung nicht erkennbar.
        </p>
        <p class="mt-2">
          Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
          Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
          Rechtsverletzungen werden wir derartige Links umgehend entfernen.
        </p>
      </section>

      <!-- Urheberrecht -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">Urheberrecht</h2>
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
          dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
          der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
          Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind
          nur für den privaten, nicht kommerziellen Gebrauch gestattet.
        </p>
        <p class="mt-2">
          Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die
          Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche
          gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden,
          bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
          werden wir derartige Inhalte umgehend entfernen.
        </p>
      </section>
    </div>
  </div>
</template>
