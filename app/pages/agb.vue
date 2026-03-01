<script setup lang="ts">
const config = useAppConfig()

useSeoMeta({
  title: 'AGB',
  description:
    'Allgemeine Geschäftsbedingungen der Pension Volgenandt. Buchungsbedingungen, Stornierung, An- und Abreise.',
})
</script>

<template>
  <div class="mx-auto max-w-screen-xl px-4 py-12">
    <div class="prose-content">
      <h1 class="mb-6 font-serif text-3xl font-bold text-sage-900">
        Allgemeine Geschäftsbedingungen (AGB)
      </h1>
      <p class="mb-4 text-sage-600">{{ config.siteName }}</p>
      <!-- 1. Geltungsbereich -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">1. Geltungsbereich</h2>
        <p>
          Diese Allgemeinen Geschäftsbedingungen gelten für Verträge über die mietweise Überlassung
          von Zimmern zur Beherbergung sowie alle weiteren Leistungen und Lieferungen der Pension
          Volgenandt (nachfolgend „Pension") an den Gast.
        </p>
        <p class="mt-2">
          Die Untervermietung oder Weitervermietung der überlassenen Zimmer sowie deren Nutzung zu
          anderen als Beherbergungszwecken bedürfen der vorherigen schriftlichen Zustimmung der
          Pension.
        </p>
        <p class="mt-2">
          Abweichende Geschäftsbedingungen des Gastes finden nur Anwendung, wenn dies vorher
          ausdrücklich schriftlich vereinbart wurde.
        </p>
      </section>

      <!-- 2. Vertragsschluss -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">2. Vertragsschluss</h2>
        <p>
          Der Beherbergungsvertrag kommt durch die Annahme des Angebots des Gastes durch die Pension
          zustande. Die Annahme kann schriftlich, telefonisch, per E-Mail oder über das
          Online-Buchungssystem erfolgen. Bei Online-Buchungen über das Buchungswidget (Beds24)
          kommt der Vertrag mit Erhalt der Buchungsbestätigung zustande.
        </p>
        <p class="mt-2">
          Die Pension ist berechtigt, die Buchung eines Zimmers von einer angemessenen Vorauszahlung
          oder der Angabe einer gültigen Kreditkarte abhängig zu machen.
        </p>
        <p class="mt-2">
          Die Vertragspartner sind der Gast und die Pension. Hat ein Dritter für den Gast bestellt,
          so haftet er der Pension gegenüber als Gesamtschuldner zusammen mit dem Gast für alle
          Verpflichtungen aus dem Beherbergungsvertrag, sofern eine entsprechende Erklärung des
          Dritten vorliegt.
        </p>
      </section>

      <!-- 3. Leistungen -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">3. Leistungen</h2>
        <p>
          Die Pension ist verpflichtet, das vom Gast gebuchte Zimmer bereitzuhalten und die
          vereinbarten Leistungen zu erbringen. Der Umfang der Leistungen ergibt sich aus der
          Buchungsbestätigung.
        </p>
        <p class="mt-2">
          Die Pension ist berechtigt, ein gleichwertiges Zimmer zur Verfügung zu stellen
          (Zimmeränderung), sofern dies für den Gast zumutbar ist, die vereinbarten Leistungen
          gleichwertig erbracht werden und die Gesamtumstände des Aufenthalts nicht beeinträchtigt
          werden.
        </p>
        <p class="mt-2">
          Sonderwünsche des Gastes werden nach Möglichkeit berücksichtigt, begründen jedoch keinen
          Rechtsanspruch.
        </p>
      </section>

      <!-- 4. Preise und Zahlung -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">
          4. Preise und Zahlung
        </h2>
        <p>
          Es gelten die zum Zeitpunkt der Buchung auf der Website oder in der Buchungsbestätigung
          angegebenen Preise. Die Preise verstehen sich pro Nacht und Zimmer inklusive der
          gesetzlichen Mehrwertsteuer sowie anfallender Steuern und Abgaben, sofern nicht
          ausdrücklich anders angegeben.
        </p>
        <p class="mt-2">
          Die Zahlung des Gesamtbetrags ist bei Anreise fällig, sofern nicht abweichend vereinbart.
          Die Pension akzeptiert folgende Zahlungsmittel: Barzahlung, Überweisung. Weitere
          Zahlungsmethoden können bei der Buchung angeboten werden.
        </p>
        <p class="mt-2">
          Die Pension ist berechtigt, bei Vertragsschluss oder danach eine angemessene Vorauszahlung
          oder Sicherheitsleistung zu verlangen.
        </p>
        <p class="mt-2">
          Sollte der Gast mit der Zahlung in Verzug geraten, gelten die gesetzlichen Bestimmungen.
        </p>
      </section>

      <!-- 5. Rücktritt und Stornierung -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">
          5. Rücktritt und Stornierung
        </h2>
        <p>
          Der Gast kann vom Beherbergungsvertrag zurücktreten. Die Stornierung muss schriftlich, per
          E-Mail oder telefonisch erfolgen. Es gelten folgende Stornierungsbedingungen:
        </p>

        <div class="mt-4 overflow-x-auto">
          <table class="w-full border-collapse text-left">
            <thead>
              <tr class="border-b-2 border-sage-300">
                <th class="px-4 py-3 font-semibold text-sage-800">Zeitpunkt der Stornierung</th>
                <th class="px-4 py-3 font-semibold text-sage-800">Stornierungsgebühr</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-sage-200">
                <td class="px-4 py-3">Mehr als 14 Tage vor Anreise</td>
                <td class="px-4 py-3">Kostenlos</td>
              </tr>
              <tr class="border-b border-sage-200">
                <td class="px-4 py-3">14 bis 7 Tage vor Anreise</td>
                <td class="px-4 py-3">50 % des Gesamtpreises</td>
              </tr>
              <tr class="border-b border-sage-200">
                <td class="px-4 py-3">7 bis 2 Tage vor Anreise</td>
                <td class="px-4 py-3">80 % des Gesamtpreises</td>
              </tr>
              <tr class="border-b border-sage-200">
                <td class="px-4 py-3">Weniger als 2 Tage vor Anreise oder Nichtanreise</td>
                <td class="px-4 py-3">100 % des Gesamtpreises</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="mt-4">
          Der Gast hat das Recht nachzuweisen, dass der Pension kein oder ein wesentlich geringerer
          Schaden entstanden ist als die pauschalierte Stornierungsgebühr.
        </p>
        <p class="mt-2">
          Die Pension hat das Recht, vom Vertrag aus sachlich gerechtfertigtem Grund zurückzutreten,
          insbesondere bei höherer Gewalt oder anderen von der Pension nicht zu vertretenden
          Umständen, die die Erfüllung des Vertrags unmöglich machen, bei irreführend oder falsch
          angegebenen wesentlichen Tatsachen (z.&nbsp;B. Person des Gastes, Zahlungsfähigkeit) oder
          wenn die Pension begründeten Anlass zu der Annahme hat, dass die Inanspruchnahme der
          Leistung den reibungslosen Geschäftsbetrieb, die Sicherheit oder das Ansehen der Pension
          gefährden kann.
        </p>
      </section>

      <!-- 6. An- und Abreise -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">6. An- und Abreise</h2>
        <p>
          Das gebuchte Zimmer steht dem Gast ab <strong>15:00 Uhr</strong> (Check-in) des
          vereinbarten Anreisetages zur Verfügung. Ein früherer Check-in ist nach Verfügbarkeit und
          vorheriger Absprache möglich.
        </p>
        <p class="mt-2">
          Am Abreisetag ist das Zimmer bis <strong>11:00 Uhr</strong> (Check-out) zu räumen. Bei
          verspäteter Räumung kann die Pension bis 18:00 Uhr 50 % und danach 100 % des
          Übernachtungspreises für die zusätzliche Nutzung berechnen.
        </p>
        <p class="mt-2">
          Erscheint der Gast nicht bis 18:00 Uhr des Anreisetages, ohne die Pension vorher zu
          informieren, erlischt die Reservierungspflicht der Pension. Die Stornierungsbedingungen
          gemäß Punkt 5 gelten entsprechend.
        </p>
      </section>

      <!-- 7. Haftung -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">7. Haftung</h2>
        <p>
          Die Pension haftet für ihre Verpflichtungen aus dem Vertrag mit der Sorgfalt eines
          ordentlichen Kaufmanns. Schadensersatzansprüche des Gastes sind ausgeschlossen, soweit
          nicht nachfolgend etwas anderes bestimmt ist. Dies gilt nicht für Schäden aus der
          Verletzung des Lebens, des Körpers oder der Gesundheit sowie für Schäden, die auf einer
          vorsätzlichen oder grob fahrlässigen Pflichtverletzung der Pension beruhen.
        </p>
        <p class="mt-2">
          Die Pension haftet dem Gast für eingebrachte Sachen nach den gesetzlichen Bestimmungen
          gemäß §§ 701 ff. BGB. Die Pension empfiehlt die Nutzung des Zimmersafes (soweit
          vorhanden). Wertsachen und größere Bargeldbeträge sollten nicht ungesichert im Zimmer
          aufbewahrt werden.
        </p>
        <p class="mt-2">
          Soweit dem Gast ein Stellplatz in der Parkanlage der Pension zur Verfügung gestellt wird,
          kommt dadurch kein Verwahrungsvertrag zustande. Bei Verlust oder Beschädigung von auf dem
          Gelände der Pension geparkten Fahrzeugen und deren Inhalten haftet die Pension nur bei
          Vorsatz oder grober Fahrlässigkeit.
        </p>
        <p class="mt-2">
          Für Schäden, die der Gast am Eigentum der Pension verursacht, haftet der Gast. Dies gilt
          insbesondere für Schäden an Einrichtungsgegenständen, Inventar und dem Gebäude.
        </p>
      </section>

      <!-- 8. Hausordnung -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">8. Hausordnung</h2>
        <p>
          Der Gast verpflichtet sich, die Hausordnung der Pension zu beachten. Die Hausordnung ist
          in den Zimmern ausgelegt und kann an der Rezeption eingesehen werden.
        </p>
        <p class="mt-2">
          In allen Zimmern und Gemeinschaftsräumen der Pension gilt ein striktes Rauchverbot. Bei
          Verstoß gegen das Rauchverbot behält sich die Pension das Recht vor, eine Reinigungsgebühr
          in Höhe von 150,00 EUR zu erheben.
        </p>
        <p class="mt-2">
          Haustiere sind nur nach vorheriger Absprache und gegen einen zusätzlichen Aufpreis
          gestattet. Bitte teilen Sie uns bei der Buchung mit, ob Sie ein Haustier mitbringen
          möchten.
        </p>
        <p class="mt-2">Im Interesse aller Gäste bitten wir um Nachtruhe ab 22:00 Uhr.</p>
      </section>

      <!-- 9. Datenschutz -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">9. Datenschutz</h2>
        <p>
          Die Pension erhebt und verarbeitet personenbezogene Daten des Gastes im Rahmen der
          Vertragserfüllung und zur Wahrung eigener berechtigter Geschäftsinteressen. Näheres regelt
          unsere
          <NuxtLink to="/datenschutz" class="text-waldhonig-600 underline hover:text-waldhonig-700">
            Datenschutzerklärung</NuxtLink
          >.
        </p>
      </section>

      <!-- 10. Schlussbestimmungen -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">
          10. Schlussbestimmungen
        </h2>
        <p>
          Änderungen oder Ergänzungen des Beherbergungsvertrags, der Antragsannahme oder dieser AGB
          bedürfen der Schriftform. Einseitige Änderungen oder Ergänzungen durch den Gast sind
          unwirksam.
        </p>
        <p class="mt-2">
          Erfüllungs- und Zahlungsort ist der Sitz der Pension in
          {{ config.contact.address.city }}.
        </p>
        <p class="mt-2">
          Es gilt ausschließlich deutsches Recht. Die Anwendung des UN-Kaufrechts und des
          Kollisionsrechts ist ausgeschlossen.
        </p>
        <p class="mt-2">
          Sollten einzelne Bestimmungen dieser AGB unwirksam oder nichtig sein oder werden, so wird
          dadurch die Wirksamkeit der übrigen Bestimmungen nicht berührt. Im Übrigen gelten die
          gesetzlichen Vorschriften.
        </p>
      </section>

      <!-- Stand -->
      <section class="mt-12 border-t border-sage-200 pt-6">
        <p class="text-sm text-sage-500">Stand: Februar 2026</p>
        <p class="mt-1 text-sm text-sage-500">
          {{ config.siteName }}, {{ config.contact.address.city }}
        </p>
      </section>
    </div>
  </div>
</template>
