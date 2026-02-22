<script setup lang="ts">
const config = useAppConfig()

useSeoMeta({
  title: 'Datenschutzerklärung',
  description:
    'Datenschutzerklärung der Pension Volgenandt gemäß DSGVO und TDDDG. Informationen zu Cookies, Ihren Rechten und der Datenverarbeitung.',
})
</script>

<template>
  <div class="mx-auto max-w-screen-xl px-4 py-12">
    <div class="prose-content">
      <h1 class="mb-6 font-serif text-3xl font-bold text-sage-900">Datenschutzerklärung</h1>
      <p class="mb-8 text-sage-600">Stand: Februar 2026</p>

      <!-- 1. Datenschutz auf einen Blick -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">
          1. Datenschutz auf einen Blick
        </h2>

        <h3 class="mt-6 mb-3 font-serif text-lg font-semibold text-sage-800">
          Allgemeine Hinweise
        </h3>
        <p>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
          personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten
          sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche
          Informationen zum Thema Datenschutz entnehmen Sie unserer nachfolgend aufgeführten
          Datenschutzerklärung.
        </p>

        <h3 class="mt-6 mb-3 font-serif text-lg font-semibold text-sage-800">
          Datenerfassung auf dieser Website
        </h3>
        <p class="mt-4 font-semibold">
          Wer ist verantwortlich für die Datenerfassung auf dieser Website?
        </p>
        <p>
          Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen
          Kontaktdaten können Sie dem Abschnitt „Hinweis zur verantwortlichen Stelle" in dieser
          Datenschutzerklärung entnehmen.
        </p>

        <p class="mt-4 font-semibold">Wie erfassen wir Ihre Daten?</p>
        <p>
          Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es
          sich z.&nbsp;B. um Daten handeln, die Sie in ein Kontaktformular eingeben oder bei einer
          Buchungsanfrage übermitteln.
        </p>
        <p class="mt-2">
          Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch
          unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.&nbsp;B.
          Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser
          Daten erfolgt automatisch, sobald Sie diese Website betreten.
        </p>

        <p class="mt-4 font-semibold">Wofür nutzen wir Ihre Daten?</p>
        <p>
          Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu
          gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden,
          sofern Sie hierzu Ihre Einwilligung erteilt haben.
        </p>

        <p class="mt-4 font-semibold">Welche Rechte haben Sie bezüglich Ihrer Daten?</p>
        <p>
          Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck
          Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die
          Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur
          Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft
          widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der
          Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein
          Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
        </p>
        <p class="mt-2">
          Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns
          wenden.
        </p>
      </section>

      <!-- 2. Allgemeine Hinweise und Pflichtinformationen -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">
          2. Allgemeine Hinweise und Pflichtinformationen
        </h2>

        <h3 class="mt-6 mb-3 font-serif text-lg font-semibold text-sage-800">Datenschutz</h3>
        <p>
          Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir
          behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen
          Datenschutzvorschriften sowie dieser Datenschutzerklärung.
        </p>
        <p class="mt-2">
          Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben.
          Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können.
          Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie
          nutzen. Sie erläutert auch, wie und zu welchem Zweck das geschieht.
        </p>
        <p class="mt-2">
          Wir weisen darauf hin, dass die Datenübertragung im Internet (z.&nbsp;B. bei der
          Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der
          Daten vor dem Zugriff durch Dritte ist nicht möglich.
        </p>

        <h3 class="mt-6 mb-3 font-serif text-lg font-semibold text-sage-800">
          Hinweis zur verantwortlichen Stelle
        </h3>
        <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
        <p class="mt-2">
          {{ config.legal.ownerName }}<br />
          {{ config.siteName }}<br />
          {{ config.contact.address.street }}<br />
          {{ config.contact.address.city }}<br />
          {{ config.contact.address.country }}
        </p>
        <p class="mt-2">
          Telefon:
          <a
            :href="`tel:${config.contact.phone}`"
            class="text-waldhonig-600 underline hover:text-waldhonig-700"
          >
            {{ config.contact.phoneDisplay }} </a
          ><br />
          E-Mail:
          <a
            :href="`mailto:${config.contact.email}`"
            class="text-waldhonig-600 underline hover:text-waldhonig-700"
          >
            {{ config.contact.email }}
          </a>
        </p>
        <p class="mt-2">
          Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder
          gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen
          Daten (z.&nbsp;B. Namen, E-Mail-Adressen o.&nbsp;Ä.) entscheidet.
        </p>

        <h3 class="mt-6 mb-3 font-serif text-lg font-semibold text-sage-800">Speicherdauer</h3>
        <p>
          Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt
          wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die
          Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder
          eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir
          keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen
          Daten haben (z.&nbsp;B. steuer- oder handelsrechtliche Aufbewahrungsfristen); im
          letztgenannten Fall erfolgt die Löschung nach Fortfall dieser Gründe.
        </p>

        <h3 class="mt-6 mb-3 font-serif text-lg font-semibold text-sage-800">
          Allgemeine Hinweise zu den Rechtsgrundlagen der Datenverarbeitung
        </h3>
        <p>
          Sofern Sie in die Datenverarbeitung eingewilligt haben, verarbeiten wir Ihre
          personenbezogenen Daten auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO bzw. Art. 9 Abs. 2
          lit. a DSGVO, sofern besondere Datenkategorien nach Art. 9 Abs. 1 DSGVO verarbeitet
          werden. Im Falle einer ausdrücklichen Einwilligung in die Übertragung personenbezogener
          Daten in Drittstaaten erfolgt die Datenverarbeitung außerdem auf Grundlage von Art. 49
          Abs. 1 lit. a DSGVO. Sofern Sie in die Speicherung von Cookies oder in den Zugriff auf
          Informationen in Ihr Endgerät (z.&nbsp;B. via Device-Fingerprinting) eingewilligt haben,
          erfolgt die Datenverarbeitung zusätzlich auf Grundlage von § 25 Abs. 1 TDDDG. Die
          Einwilligung ist jederzeit widerrufbar. Sind Ihre Daten zur Vertragserfüllung oder zur
          Durchführung vorvertraglicher Maßnahmen erforderlich, verarbeiten wir Ihre Daten auf
          Grundlage des Art. 6 Abs. 1 lit. b DSGVO. Des Weiteren verarbeiten wir Ihre Daten, sofern
          diese zur Erfüllung einer rechtlichen Verpflichtung erforderlich sind auf Grundlage von
          Art. 6 Abs. 1 lit. c DSGVO. Die Datenverarbeitung kann ferner auf Grundlage unseres
          berechtigten Interesses nach Art. 6 Abs. 1 lit. f DSGVO erfolgen. Über die jeweils im
          Einzelfall einschlägigen Rechtsgrundlagen wird in den folgenden Absätzen dieser
          Datenschutzerklärung informiert.
        </p>

        <h3 class="mt-6 mb-3 font-serif text-lg font-semibold text-sage-800">
          Widerruf Ihrer Einwilligung zur Datenverarbeitung
        </h3>
        <p>
          Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich.
          Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der
          bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
        </p>

        <h3 class="mt-6 mb-3 font-serif text-lg font-semibold text-sage-800">
          Widerspruchsrecht gegen die Datenerhebung in besonderen Fällen (Art. 21 DSGVO)
        </h3>
        <p>
          Wenn die Datenverarbeitung auf Grundlage von Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt,
          haben Sie jederzeit das Recht, aus Gründen, die sich aus Ihrer besonderen Situation
          ergeben, gegen die Verarbeitung Ihrer personenbezogenen Daten Widerspruch einzulegen. Die
          jeweilige Rechtsgrundlage, auf der eine Verarbeitung beruht, entnehmen Sie dieser
          Datenschutzerklärung. Wenn Sie Widerspruch einlegen, werden wir Ihre betroffenen
          personenbezogenen Daten nicht mehr verarbeiten, es sei denn, wir können zwingende
          schutzwürdige Gründe für die Verarbeitung nachweisen, die Ihre Interessen, Rechte und
          Freiheiten überwiegen oder die Verarbeitung dient der Geltendmachung, Ausübung oder
          Verteidigung von Rechtsansprüchen.
        </p>

        <h3 class="mt-6 mb-3 font-serif text-lg font-semibold text-sage-800">
          Beschwerderecht bei der zuständigen Aufsichtsbehörde
        </h3>
        <p>
          Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer
          Aufsichtsbehörde zu, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthalts,
          ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes. Das Beschwerderecht besteht
          unbeschadet anderweitiger verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.
        </p>
      </section>

      <!-- 3. Hosting -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">3. Hosting</h2>
        <p>
          Wir hosten die Inhalte unserer Website bei einem externen Dienstleister (Hoster). Die
          personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des
          Hosters gespeichert. Hierbei kann es sich v.&nbsp;a. um IP-Adressen, Kontaktanfragen,
          Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und
          sonstige Daten, die über eine Website generiert werden, handeln.
        </p>
        <p class="mt-2">
          Der Einsatz des Hosters erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren
          potenziellen und bestehenden Kunden (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse einer
          sicheren, schnellen und effizienten Bereitstellung unseres Online-Angebots durch einen
          professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO).
        </p>
        <p class="mt-2">
          Unser Hoster wird Ihre Daten nur insoweit verarbeiten, wie dies zur Erfüllung seiner
          Leistungspflichten erforderlich ist und unsere Weisungen in Bezug auf diese Daten
          befolgen.
        </p>
      </section>

      <!-- 4. Ihre Rechte als betroffene Person -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">
          4. Ihre Rechte als betroffene Person
        </h2>

        <h3 class="mt-6 mb-3 font-serif text-lg font-semibold text-sage-800">
          Recht auf Auskunft (Art. 15 DSGVO)
        </h3>
        <p>
          Sie haben das Recht, eine Bestätigung darüber zu verlangen, ob betreffende Daten
          verarbeitet werden und auf Auskunft über diese Daten sowie auf weitere Informationen und
          Kopie der Daten entsprechend den gesetzlichen Vorgaben.
        </p>

        <h3 class="mt-6 mb-3 font-serif text-lg font-semibold text-sage-800">
          Recht auf Berichtigung (Art. 16 DSGVO)
        </h3>
        <p>
          Sie haben entsprechend den gesetzlichen Vorgaben das Recht, die Vervollständigung der Sie
          betreffenden Daten oder die Berichtigung der Sie betreffenden unrichtigen Daten zu
          verlangen.
        </p>

        <h3 class="mt-6 mb-3 font-serif text-lg font-semibold text-sage-800">
          Recht auf Löschung (Art. 17 DSGVO)
        </h3>
        <p>
          Sie haben das Recht, zu verlangen, dass betreffende Daten unverzüglich gelöscht werden,
          bzw. alternativ nach Maßgabe der gesetzlichen Vorgaben eine Einschränkung der Verarbeitung
          der Daten zu verlangen.
        </p>

        <h3 class="mt-6 mb-3 font-serif text-lg font-semibold text-sage-800">
          Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)
        </h3>
        <p>
          Sie haben das Recht, zu verlangen, dass die Verarbeitung Ihrer Daten eingeschränkt wird,
          wenn eine der gesetzlichen Voraussetzungen gegeben ist.
        </p>

        <h3 class="mt-6 mb-3 font-serif text-lg font-semibold text-sage-800">
          Recht auf Datenübertragbarkeit (Art. 20 DSGVO)
        </h3>
        <p>
          Sie haben das Recht, die Sie betreffenden Daten, die Sie uns bereitgestellt haben, in
          einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten oder die
          Übermittlung an einen anderen Verantwortlichen zu fordern.
        </p>

        <h3 class="mt-6 mb-3 font-serif text-lg font-semibold text-sage-800">
          Recht auf Widerspruch (Art. 21 DSGVO)
        </h3>
        <p>
          Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben,
          jederzeit gegen die Verarbeitung der Sie betreffenden personenbezogenen Daten Widerspruch
          einzulegen.
        </p>
      </section>

      <!-- 5. Cookies und Einwilligungsverwaltung -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">
          5. Cookies und Einwilligungsverwaltung
        </h2>

        <h3 class="mt-6 mb-3 font-serif text-lg font-semibold text-sage-800">
          Einsatz von Cookies (TDDDG § 25)
        </h3>
        <p>
          Unsere Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem Endgerät
          gespeichert werden und die Ihr Browser speichert. Sie richten keinen Schaden an und
          enthalten keine Viren.
        </p>
        <p class="mt-2">
          Gemäß § 25 Abs. 1 TDDDG (Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz) holen wir
          Ihre Einwilligung ein, bevor wir Cookies oder ähnliche Technologien auf Ihrem Endgerät
          speichern oder auf dort gespeicherte Informationen zugreifen, es sei denn, dies ist
          technisch unbedingt erforderlich (§ 25 Abs. 2 TDDDG).
        </p>

        <h3 class="mt-6 mb-3 font-serif text-lg font-semibold text-sage-800">Cookie-Kategorien</h3>
        <p>Wir unterscheiden folgende Kategorien von Cookies:</p>

        <p class="mt-4 font-semibold">Notwendige Cookies (immer aktiv)</p>
        <p>
          Diese Cookies sind für die Grundfunktionen der Website erforderlich. Sie ermöglichen
          grundlegende Funktionen wie die Cookie-Einwilligungsverwaltung und können nicht
          deaktiviert werden. Rechtsgrundlage: § 25 Abs. 2 Nr. 2 TDDDG (technisch erforderlich) und
          Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).
        </p>
        <ul class="mt-2 ml-6 list-disc space-y-1">
          <li>
            <strong>cookie_consent</strong> – Speichert Ihre Cookie-Präferenzen. Speicherdauer: 180
            Tage.
          </li>
        </ul>

        <p class="mt-4 font-semibold">Buchung (Einwilligung erforderlich)</p>
        <p>
          Diese Cookies ermöglichen die Einbindung des Buchungswidgets unseres Partners Beds24, über
          das Sie direkt Zimmer buchen können. Ohne Ihre Einwilligung wird das Buchungswidget nicht
          geladen und es werden keine Daten an Beds24 übermittelt. Rechtsgrundlage: Art. 6 Abs. 1
          lit. a DSGVO (Einwilligung) und § 25 Abs. 1 TDDDG.
        </p>

        <p class="mt-4 font-semibold">Medien (Einwilligung erforderlich)</p>
        <p>
          Diese Cookies ermöglichen die Einbindung externer Medien wie YouTube-Videos oder Google
          Maps Karten. Ohne Ihre Einwilligung werden diese Inhalte nicht geladen und es werden keine
          Daten an Drittanbieter übermittelt. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO
          (Einwilligung) und § 25 Abs. 1 TDDDG.
        </p>

        <h3 class="mt-6 mb-3 font-serif text-lg font-semibold text-sage-800">
          Verwaltung Ihrer Cookie-Einstellungen
        </h3>
        <p>
          Sie können Ihre Cookie-Einstellungen jederzeit über den Link „Cookie-Einstellungen" in der
          Fußzeile unserer Website aufrufen und ändern. Zudem können Sie Ihren Browser so
          einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im
          Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell
          ausschließen sowie das automatische Löschen der Cookies beim Schließen des Browsers
          aktivieren.
        </p>
      </section>

      <!-- 6. Kontaktformular -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">6. Kontaktformular</h2>
        <p>
          Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem
          Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung
          der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben
          wir nicht ohne Ihre Einwilligung weiter.
        </p>
        <p class="mt-2">
          Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern
          Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung
          vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die
          Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns
          gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs.
          1 lit. a DSGVO) sofern diese abgefragt wurde.
        </p>
        <p class="mt-2">
          Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei uns, bis Sie uns zur
          Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die
          Datenspeicherung entfällt (z.&nbsp;B. nach abgeschlossener Bearbeitung Ihrer Anfrage).
          Zwingende gesetzliche Bestimmungen – insbesondere Aufbewahrungsfristen – bleiben
          unberührt.
        </p>
      </section>

      <!-- 7. Buchungswidget (Beds24) -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">
          7. Buchungswidget (Beds24)
        </h2>
        <p>
          Für die Online-Buchung von Zimmern nutzen wir das Buchungssystem des Drittanbieters Beds24
          (Beds24 Online Ltd). Das Buchungswidget wird erst nach Ihrer ausdrücklichen Einwilligung
          (Cookie-Kategorie „Buchung") geladen.
        </p>
        <p class="mt-2">
          Wenn Sie das Buchungswidget nutzen, werden Ihre Buchungsdaten (Name, Kontaktdaten,
          Reisedaten, Zahlungsinformationen) direkt an Beds24 übermittelt. Beds24 verarbeitet diese
          Daten als eigenständiger Verantwortlicher zum Zweck der Buchungsabwicklung.
        </p>
        <p class="mt-2">
          Rechtsgrundlage für die Datenübermittlung an Beds24 ist Ihre Einwilligung (Art. 6 Abs. 1
          lit. a DSGVO und § 25 Abs. 1 TDDDG) sowie die Vertragserfüllung (Art. 6 Abs. 1 lit. b
          DSGVO) bei Abschluss einer Buchung.
        </p>
        <p class="mt-2">
          Weitere Informationen zum Datenschutz bei Beds24 finden Sie in der Datenschutzerklärung
          von Beds24 unter
          <a
            href="https://www.beds24.com/en/legal-privacy.html"
            target="_blank"
            rel="noopener noreferrer"
            class="text-waldhonig-600 underline hover:text-waldhonig-700"
          >
            https://www.beds24.com/en/legal-privacy.html </a
          >.
        </p>
      </section>

      <!-- 8. SSL-/TLS-Verschlüsselung -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">
          8. SSL-/TLS-Verschlüsselung
        </h2>
        <p>
          Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher
          Inhalte, wie zum Beispiel Buchungsanfragen oder Kontaktanfragen, die Sie an uns als
          Seitenbetreiber senden, eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung
          erkennen Sie daran, dass die Adresszeile des Browsers von „http://" auf „https://"
          wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
        </p>
        <p class="mt-2">
          Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns
          übermitteln, nicht von Dritten mitgelesen werden.
        </p>
      </section>

      <!-- 9. Änderung der Datenschutzerklärung -->
      <section>
        <h2 class="mt-8 mb-4 font-serif text-xl font-semibold text-sage-800">
          9. Änderung dieser Datenschutzerklärung
        </h2>
        <p>
          Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen
          rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der
          Datenschutzerklärung umzusetzen, z.&nbsp;B. bei der Einführung neuer Services. Für Ihren
          erneuten Besuch gilt dann die neue Datenschutzerklärung.
        </p>
      </section>
    </div>
  </div>
</template>
