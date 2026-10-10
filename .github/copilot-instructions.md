# Anweisungen für GitHub Copilot

Dieses Repo ist die Website der Pension Volgenandt in Breitenbach im Eichsfeld (www.pension-volgenandt.de): Zimmer, Ausflugsziele, Aktuelles, Picknick-Korb und die Links zur Buchung bei Beds24. Simone und Ralf führen die Pension. Sie sind keine Entwickler.

Sprache: Was Gäste lesen, ist auf Deutsch, ein Teil der Seiten auch auf Englisch. Kommentare im Code, Commit-Nachrichten und Code-Namen sind englisch.

Mehr Hintergrund steht in `CLAUDE.md`. Diese Datei gilt für Copilot im Editor und für Reviews von Pull Requests.

## Aufbau

- Nuxt 4 (Vue 3, TypeScript), Tailwind CSS 4, Paketmanager pnpm.
- Inhalte liegen als YAML in `content/` (Zimmer, Ausflugsziele, Aktuelles, FAQ). Das Schema steht in `content.config.ts`. Englische Fassungen liegen in eigenen Ordnern wie `content/rooms-en/` und `content/attractions-en/`.
- Englische Seiten liegen unter `app/pages/en/`. Texte der Oberfläche stehen in `app/i18n/locales/de.json` und `en.json` und werden mit `t(key, locale)` aus `app/utils/translations.ts` geholt.
- Die Website ist statisch und läuft auf GitHub Pages. `.github/workflows/deploy.yml` baut bei jedem Push auf `main` mit `nuxt build --preset github_pages`. Es gibt keine serverseitigen Weiterleitungen. Alte Adressen leiten über kleine HTML-Dateien unter `public/` weiter, zum Beispiel `public/kind-kegel/index.html`.
- `server/` enthält PHP-Skripte (Mails, Rechnungen, Picknick-Buchung), die getrennt von der Website bei IONOS laufen. Zugangsdaten stehen dort in `server/config.php`, die nicht im Repo liegt.
- Es gibt keine Testsuite. Vor jedem Commit laufen `npx eslint .`, `npx prettier --check "app/**/*.{vue,ts,js}" "content/**/*.{yml,yaml}" "nuxt.config.ts" "content.config.ts"` und `npx nuxi typecheck`.

## Worauf ein Review achten soll

1. Kein deutscher Text fest im Template. Jeder sichtbare Text kommt über `t()`. Ein neuer Schlüssel muss in `de.json` und in `en.json` stehen. Fehlt er in einer der beiden Dateien, ist das ein Fund.
2. Bilder in `public/img/` sind WebP. Ein Verweis auf `.jpg` oder `.jpeg` in Vue-Dateien oder in `content/` ist ein Fund. Bilder im Wurzelverzeichnis des Repos auch.
3. Interne Links enden mit Schrägstrich (`/zimmer/`, nicht `/zimmer`). `nuxt.config.ts` setzt `trailingSlash: true`, Sitemap und Canonical-Tags verwenden die Form mit Schrägstrich. Ein Link ohne Schrägstrich erzeugt eine Weiterleitung, die Google als eigene Seite meldet.
4. Hat eine Seite eine englische Fassung, brauchen beide Seiten hreflang-Tags für `de`, `en` und `x-default` (zeigt auf die deutsche Seite).
5. Keine Pfade mit Umlauten unter `public/`. GitHub Pages bricht den Deploy dann ab.
6. Keine Zugangsdaten im Code. Passwörter, Tokens und Schlüssel stehen nur in `server/config.php` auf dem Server oder in den Secrets von GitHub Actions.
7. Nach einer Änderung an `package.json` muss auch `pnpm-lock.yaml` mit im PR sein. Sonst bricht `pnpm install` im Deploy ab.
8. `app/composables/useAdArrival.ts` hängt `referer=GoogleAds` an die Beds24-Links für Besucher mit `gclid`. Änderungen an Buchungslinks dürfen das nicht verlieren.
9. Keine Planungsdokumente, Skripte für einmalige Aufgaben, Screenshots oder Build-Ordner (`.output/`, `.nuxt/`, `.playwright-mcp/`) im PR.

## Texte, die Menschen lesen

Seitentexte, Zimmerbeschreibungen, Fehlermeldungen und Commit-Nachrichten:

- Das Wichtigste im ersten Satz, dann die Fakten mit echten Zahlen.
- Gäste werden gesiezt. Kein Werbeton, keine Ausrufezeichen, keine Floskeln wie „unvergesslich“ oder „perfekt“.
- Keine Öffnungszeiten oder Eintrittspreise fremder Ausflugsziele. Sie ändern sich, und die Seite wäre dann falsch.

## Form der Review-Kommentare

Schreib auf Deutsch. Nenne zuerst den Fehler und die Folge (was auf der Website falsch angezeigt wird oder was beim Deploy bricht), dann den Vorschlag. Reine Stilfragen ohne Folge nur, wenn sie gegen die Regeln oben verstoßen.
