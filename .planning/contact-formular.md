# Plan: Kontaktformular → E-Mail via PHP auf IONOS

## Context
Das Kontaktformular soll beim Absenden eine E-Mail an `kontakt@pension-volgenandt.de` senden. Die Website ist SSG auf GitHub Pages, aber es gibt ein IONOS Webhosting Essential mit PHP-Support. Das PHP-Script wird auf dem IONOS-Hosting abgelegt, das Formular sendet die Daten dorthin.

## Änderungen

### 1. PHP-Script erstellen: `public/send-mail.php`
- Nimmt POST-Daten (name, email, message) entgegen
- Validiert Pflichtfelder und E-Mail-Format
- Honeypot-Check gegen Bots (`_gotcha`-Feld)
- Sendet E-Mail via `mail()` an `kontakt@pension-volgenandt.de`
- Setzt CORS-Header für die GitHub-Pages-Domain
- Gibt JSON-Antwort zurück (success/error)
- Wird ins Repo unter `public/` gelegt, damit es beim Deploy auf IONOS verfügbar ist

### 2. Formular-Komponente anpassen: `app/components/contact/Form.vue`
- Fetch-URL von Formspree (`https://formspree.io/f/...`) ändern auf das PHP-Script
- URL konfigurierbar über `app.config.ts` (statt `formspreeId`)
- Fehlerbehandlung an PHP-Antwortformat anpassen

### 3. App-Config: `app/app.config.ts`
- `formspreeId` entfernen
- `contactFormUrl` hinzufügen (URL zum PHP-Script auf IONOS)

## Dateien
- `public/send-mail.php` (neu)
- `app/components/contact/Form.vue` (ändern)
- `app/app.config.ts` (ändern)

## Verifizierung
- Formular ausfüllen → Erfolgsmeldung erscheint
- E-Mail an kontakt@pension-volgenandt.de kommt an
- Leeres Formular absenden → Validierungsfehler
- Honeypot befüllen → Wird als Spam erkannt
