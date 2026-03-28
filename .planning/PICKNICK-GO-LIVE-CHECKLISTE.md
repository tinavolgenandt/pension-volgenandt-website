# Picknick-Korb: Go-Live-Checkliste

> Stand: 2026-03-28
> Ziel: Alles durchdenken, bevor das Angebot live geht.

---

## A. Was ist FERTIG (Website)

- [x] 3 Seiten: `/picknick/`, `/picknick/buchen/`, `/picknick/danke/`
- [x] 4 Komponenten: PackageCard, SpotCard, BasketContents, BookingForm
- [x] 3 YAML-Dateien: packages, spots, basket-items
- [x] FAQ-Sektion (8 Fragen)
- [x] Max. 2 Körbe/Tag kommuniziert (Landing, Buchung, Formular-E-Mail)
- [x] Nachhaltigkeit-Hinweis + Wetter-/Stornierungsinfo
- [x] Prerender-Routen eingetragen
- [x] Canonical URL + SEO
- [x] E-Mail-Bestätigungsvorlage (`.planning/PICKNICK-EMAIL-VORLAGE.md`)
- [x] Nicht in Navigation/Sitemap (bewusst verborgen)

---

## B. OFFEN – Vor Go-Live klären

### B1. Betrieb & Logistik

| # | Frage | Status |
|---|-------|--------|
| 1 | **Weidenkörbe**: Wie viele sind vorhanden? Müssen welche angeschafft werden? (Plan sagt 3–5 Stück, ~100–200 €) | ? |
| 2 | **Geschirr & Besteck**: Echtes Porzellan für 2–12 Personen vorrätig? Wie viele Sets? | ? |
| 3 | **Decken**: Wie viele Picknickdecken? Wolldecken für Sonnenuntergang? | ? |
| 4 | **Verpackung/Vorbereitung**: Wie lange dauert es, einen Korb zu packen? (geschätzt 30–45 Min.) | ? |
| 5 | **Zeitablauf morgens**: Brunch-Korb muss um 9:00 fertig sein – ist das machbar neben dem Frühstücksservice für Übernachtungsgäste? | ? |
| 6 | **Lieferanten**: Brötchen vom Bäcker, Feldgieker, Käse – welche konkreten Lieferanten? Wie kurzfristig bestellbar? | ? |
| 7 | **Saisonale Verfügbarkeit**: Welche Korbinhalte ändern sich saisonal? Gibt es einen Plan? | ? |
| 8 | **Lagerung**: Wo werden fertig gepackte Körbe bis zur Abholung aufbewahrt (Kühlkette!)? | ? |

### B2. Pfand & Rückgabe

| # | Frage | Status |
|---|-------|--------|
| 9 | **Pfand-Tracking**: Wie wird dokumentiert, wer Pfand gezahlt hat und ob der Korb zurück ist? (Notizbuch? Excel? App?) | ? |
| 10 | **Korb nicht zurückgebracht**: Was passiert, wenn ein Gast den Korb nicht zurückbringt? 100 € behalten – reicht das als Ersatz? | ? |
| 11 | **Beschädigtes Geschirr**: Teller kaputt → wird aus Pfand einbehalten? Oder kulanz? Klare Regel nötig. | ? |
| 12 | **Rückgabe-Zeitfenster**: FAQ sagt „1h nach Zeitfenster-Ende". Was, wenn der Gast sich verspätet? Wie streng? | ? |

### B3. Zahlung

| # | Frage | Status |
|---|-------|--------|
| 13 | **PayPal.me-Link**: Existiert `paypal.me/PensionVolgenandt`? Ist das PayPal-Konto verifiziert und empfangsbereit? | ? |
| 14 | **Zahlungsablauf**: Grundpreis per PayPal vorher, Pfand bar bei Abholung – ist das der finale Flow? | ? |
| 15 | **Ohne PayPal**: Was, wenn ein Gast kein PayPal hat? Nur bar? Überweisung? | ? |
| 16 | **Quittung/Beleg**: Muss eine Quittung für den Pfand ausgestellt werden? | ? |

### B4. Recht & Steuern

| # | Frage | Status |
|---|-------|--------|
| 17 | **Lebensmittelhygiene**: Ist die Pension beim Veterinäramt/Lebensmittelüberwachung für die Abgabe von Speisen registriert? (Vermutlich ja wegen Frühstücksservice – aber prüfen ob Picknick to-go davon abgedeckt ist.) | ? |
| 18 | **Allergen-Kennzeichnung**: Muss eine Allergenliste beigelegt werden? (Ja, LMIV gilt auch bei loser Abgabe – zumindest mündlich oder schriftlich auf Nachfrage.) | ? |
| 19 | **Umsatzsteuer**: Welcher Satz? 19 % Gastro oder 7 % Lebensmittel-Mitnahme? (Picknick to-go = vermutlich 7 % ermäßigt, aber Sekt/Getränke sind 19 %. Steuerberater fragen.) | ? |
| 20 | **Haftpflicht**: Deckt die bestehende Betriebshaftpflicht das Picknick-Angebot ab? (Insbesondere: Gast isst im Freien, Korb wird mitgenommen.) | ? |
| 21 | **AGB**: Braucht das Picknick-Angebot eigene Buchungsbedingungen? Oder reichen die bestehenden AGB? | ? |

### B5. Fotos & Inhalte

| # | Frage | Status |
|---|-------|--------|
| 22 | **Echte Korbfotos**: Es gibt aktuell nur Gartenfotos. Vor Go-Live brauchen wir Fotos vom tatsächlichen Korb mit Inhalt. | ? |
| 23 | **Foto-Shooting planen**: Alle 3 Pakete einzeln fotografieren (Brunch, Kaffee & Kuchen, Sonnenuntergang). Goldene Stunde nutzen. | ? |
| 24 | **Begrüßungskärtchen**: Im Plan steht „Kleines Begrüßungskärtchen mit Spot-Empfehlungen" – muss noch gestaltet/gedruckt werden. | ? |

### B6. Testlauf

| # | Frage | Status |
|---|-------|--------|
| 25 | **Probebuchung**: Einmal den kompletten Flow testen – Formular ausfüllen → E-Mail kommt an → Bestätigungs-E-Mail senden → PayPal-Link funktioniert → Danke-Seite korrekt. | ? |
| 26 | **Probe-Korb packen**: Mindestens 1 Korb komplett packen (mit Zeitstoppuhr), selbst testen, Feedback sammeln. | ? |
| 27 | **Kalkulation prüfen**: Was kostet ein Korb in der Herstellung (Zutaten + Arbeitszeit)? Stimmt die Marge bei 19 €/Person? | ? |

### B7. Go-Live-Schritte (Website)

| # | Aufgabe | Status |
|---|---------|--------|
| 28 | Korbfotos einsetzen (Platzhalterbilder ersetzen) | ? |
| 29 | Nav-Link hinzufügen (`app.config.ts` → nav Array) | ? |
| 30 | Sitemap: Picknick-Seiten von `noindex` befreien (buchen.vue bleibt noindex) | ? |
| 31 | Push + Deploy | ? |
| 32 | Google My Business: „Picknick-Korb" als Dienstleistung eintragen | ? |
| 33 | Instagram: Launch-Post + Highlight | ? |

---

## C. Entscheidungen / Diskussionspunkte

### C1. Saison-Start & -Ende
- Plan sagt April–Oktober. Konkretes Startdatum?
- LGS-Eröffnung 23. April wäre ideal. Ist das realistisch?

### C2. Frühbucher / Stammgäste
- Marketing-Plan schlägt vor: Stammgästen ermäßigtes Pfand (50 statt 100 €) oder kostenlosen Test-Korb anzubieten.
- Wollen wir das machen?

### C3. Gutschein DANKE5
- Es gibt bereits einen 5%-Voucher `DANKE5` (Beds24). Soll der auch für Picknick gelten? Oder eigener Rabattcode?

### C4. Sonnenuntergang-Paket Zeitfenster
- Aktuell: „Ca. 18:00 – 21:00 Uhr (saisonal)". Im Hochsommer Sonnenuntergang erst ~21:30. Zeitfenster flexibel halten oder feste Zeiten pro Monat?

### C5. Maximale Personenzahl
- Formular erlaubt 2–12 Personen. Bei 12 Personen: Passt alles in einen Korb? Oder braucht man dann 2 Körbe? Wie wird das logistisch gelöst?

### C6. Kinder-Preis
- Aktuell: „Kinder-Korb" als kostenlose Extra-Option. Aber zahlen Kinder auch 19 €? Oder gibt es einen Kinderpreis (z.B. 9,50 € unter 12)?

---

## D. Reihenfolge (empfohlen)

1. **Zuerst klären:** B4 (Recht & Steuern) – damit das Angebot überhaupt zulässig ist
2. **Dann:** B1 (Logistik) + B2 (Pfand-Regeln) + B3 (Zahlung) – operative Grundlagen
3. **Dann:** B6 (Testlauf) – einen echten Korb packen, Kosten kalkulieren
4. **Dann:** B5 (Fotos) – während des Testlaufs gleich fotografieren
5. **Zuletzt:** B7 (Go-Live) – Website finalisieren und launchen
