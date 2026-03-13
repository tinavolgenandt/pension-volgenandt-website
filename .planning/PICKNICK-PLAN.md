# Picknick-Korb: Genießer Frühstück to go

> Branch: `feature/picknick-korb`
> Erstellt: 2026-03-12
> Status: Phase 1 – Planung

---

## Konzept

Gäste (auch externe, ohne Übernachtung) buchen einen handgefüllten Picknickkorb mit hausgemachten
Produkten, Decke, Besteck und Geschirr. Abholung an der Pension, dann freie Platzwahl im Garten
oder der näheren Umgebung.

**Kernbotschaft:** Regional. Saisonal. Hausgemacht. Mit Herz.

---

## Preisstruktur

| Position | Preis |
|----------|-------|
| Grundpreis | **19 € / Person** |
| Korbpfand | **100 € / Korb** (wird zurückerstattet bei Rückgabe) |
| Mindestanzahl | 2 Personen (empfohlen) |

Der Pfand wird separat via PayPal erhoben (oder bar bei Abholung).

---

## Pakete

### 1. Genießer Frühstück (07:30 – 10:00 Uhr)
Klassisch, für alle. Brötchen, Aufstrich, Marmelade, Käse, Wurst (Eichsfelder Spezialität),
Yoghurt, frisches Obst, Orangensaft, Kaffee/Tee in Thermoskanne.

### 2. Sonntagsbrunch (09:00 – 12:00 Uhr)
Erweitertes Angebot. Zusätzlich: Ei (hartgekocht), Quiche/Blechkuchen, Sekt, Aufschnitt-Auswahl.

### 3. Kaffeeklatsch (14:00 – 17:00 Uhr)
Kuchen, Gebäck, selbstgemachte Marmelade, Kaffee/Tee in Thermoskanne, Saft,
ein kleines Glas hausgemachtes Eingemachtes als Mitnahmegabe.

### 4. Sonnenuntergang (je nach Saison, ca. 18:00 – 21:00 Uhr)
Käse-Wurst-Platte, Baguette, Aufstriche, Sekt/Prosecco, Trauben & Feigen,
**extra Wolldecke** inklusive. Kerze/Windlicht dabei.

---

## Korbinhalt (Basis, anpassbar)

### Immer dabei
- Handgewebter Weidenkorb (mit Pfand)
- Picknickdecke (wasserfest)
- Besteck + Teller + Gläser (echtes Geschirr, kein Plastik)
- Leinentuch als Abdeckung
- Kleines Begrüßungskärtchen mit Spot-Empfehlungen

### Pflichtkomponenten (je nach Paket)
- Frische Brötchen (vom Bäcker oder hausgebacken)
- Hausgemachte Marmelade (saisonal)
- Hausgemachter Aufstrich (mind. 2 Sorten)
- Frisches Obst (regional/saisonal)
- Thermoskanne mit Kaffee oder Tee

### Optional zubuchbar
- Vegetarisch / Vegan (kein Fleisch/Käse, mehr Aufstriche & Obst)
- Glutenfrei (Brötchen-Variante)
- Kinder-Korb (kleinere Portionen, Saft statt Sekt)
- Extra Sekt/Prosecco (+3 €/Person)
- Extra Wolldecke (+2 €)
- Frühstücks-Ei (+0,50 €/Stück)

---

## Technischer Aufbau (Website)

### Git-Strategie
- Branch: `feature/picknick-korb` (aktuell aktiv)
- Alle Dateien unter klar abgegrenzten Pfaden:
  - `/app/pages/picknick/` – Seiten
  - `/app/components/picknick/` – Komponenten
  - `/content/picknick/` – YAML-Daten
  - `/public/img/picknick/` – Bilder
- Komplett löschbar: Branch löschen oder einzelne Dateien per Commit entfernen

### Seitenstruktur (nicht in Navigation, kein Sitemap-Eintrag)
```
/picknick/              ← Landing: Konzept, Pakete, Spots, Buchungs-CTA
/picknick/buchen/       ← Buchungsformular + PayPal-Weiterleitung
/picknick/danke/        ← Bestätigungsseite nach Zahlung
```

### Komponenten
```
app/components/picknick/
  Hero.vue              ← Fullscreen-Hero mit Gartenfotos
  PackageCard.vue       ← Paket-Karte (4 Stück)
  BasketContents.vue    ← Korbinhalt-Übersicht (Accordion)
  SpotCard.vue          ← Picknick-Spot-Empfehlung
  BookingForm.vue       ← Formular (Datum, Paket, Personen, Extras, Kontakt)
  PfandHinweis.vue      ← Erklärungs-Komponente Korbpfand
```

### Content-Dateien (YAML)
```
content/picknick/
  packages.yml          ← 4 Pakete mit Preisen, Beschreibungen
  basket-items.yml      ← alle Korbinhalte (Pflicht + optional + Preise)
  spots.yml             ← Picknick-Spots (Garten + Umgebung)
```

---

## Buchung & Zahlung: PayPal

Da kein Stripe-Account vorhanden → **PayPal MVP-Flow**:

### Flow
1. Gast füllt Buchungsformular aus (Datum, Uhrzeit, Paket, Personen, Extras, Kontakt)
2. Formular wird via **Formspree** als E-Mail an Pension gesendet
3. Gleichzeitig: Weiterleitung zu **PayPal.me** mit vorberechneter Summe (Grundpreis × Personen)
4. Pfand wird **separat** angefordert (PayPal-Link in der Bestätigungs-E-Mail der Pension ODER bar bei Abholung)
5. Pension bestätigt die Buchung manuell per E-Mail/WhatsApp

### Preisberechnung (Beispiel)
- 2 Personen × 19 € = 38 € Grundpreis → PayPal-Link: `paypal.me/PensionVolgenandt/38`
- Pfand: 100 € → separat in E-Mail oder bar

### PayPal.me-Link Aufbau
```
https://paypal.me/PensionVolgenandt/{BETRAG}
```
(Betrag wird im Formular dynamisch berechnet)

### Spätere Erweiterung (Phase 2)
- PayPal Checkout-Button direkt auf der Seite einbetten (PayPal JS SDK)
- Automatische E-Mail-Bestätigung
- Kalender-Integration (z.B. Calendly oder Cal.com) für Verfügbarkeit

---

## Bilder

### Gartenfotos (bereits vorhanden)
- `/img/garten/garten-sitzbank-apfelbaum-bluete.jpg` → Hero (Spring)
- `/img/garten/garten-sitzecke-apfelbaum.jpg` → Spot-Karte: Sitzecke
- `/img/garten/garten-laube-herbst.jpg` → Spot-Karte: Laube
- `/img/garten/gartenteich-abend.jpg` → Paket: Sonnenuntergang
- `/img/garten/garten-rasen-baeume-sommer.jpg` → Spot-Karte: Wiese
- `/img/content/terrasse-grill.webp` → Spot-Karte: Terrasse
- `/img/garten/umgebung-wiese-sonnenuntergang.jpg` → Paket: Sonnenuntergang Hero

### Picknickkorb-Placeholder
- Exemplarisches Stockfoto (Unsplash / Pixabay, lizenzfrei)
- Später ersetzen durch echte Fotos der Körbe

---

## Picknick-Spots

### Im Garten (direkt an der Pension)
1. **Unter dem Apfelbaum** – schattig, romantisch, nah am Biotop
2. **Auf der Blühwiese** – sonnig, Blick in die Felder
3. **An der Laube** – halbschattig, geschützt
4. **Am Gartenteich** – idyllisch, abends wunderschön
5. **Auf der Terrasse** – überdacht (bei Regen)

### In der näheren Umgebung (<10 km, zu Fuß / Rad)
6. **Wiesen entlang der Leine** – Breitenbach Richtung Uder, Bachaue
7. **Aussichtspunkte Eichsfelder Hügelland** – Blick über Felder und Dörfer

### Weiter (15–35 km, Auto)
8. **Seeburger See** (25 km) – Sandstrand, Seerosen, Badestimmung
9. **Burg Hanstein** (ca. 20 km) – Ruine, Panorama-Ausblick
10. **Baumkronenpfad Hainich** (ca. 35 km) – Natur pur, Weltnaturerbe
11. **Burg Bodenstein** (ca. 15 km) – mittelalterliche Kulisse

---

## Phasen

### Phase 1: Branch + Grundgerüst (März 2026)
- [x] Branch `feature/picknick-korb` angelegt
- [ ] Content-YAMLs anlegen (packages, items, spots)
- [ ] Landing-Page `/picknick/` anlegen (ohne Nav-Link)
- [ ] Pakete visuell gestalten (PackageCard-Komponente)
- [ ] Spot-Empfehlungen einbauen

### Phase 2: Buchungsformular + PayPal (April 2026)
- [ ] BookingForm-Komponente bauen
- [ ] Formspree-Integration (E-Mail-Weiterleitung)
- [ ] Dynamische PayPal.me-Weiterleitung
- [ ] Bestätigungsseite `/picknick/danke/`
- [ ] Pfand-Erklärung klar kommunizieren

### Phase 3: Go Live (auf Zuruf)
- [ ] Foto echter Körbe einsetzen
- [ ] Nav-Link hinzufügen
- [ ] Sitemap ergänzen
- [ ] Merge in `main`

### Phase 4: PayPal-Checkout (optional)
- [ ] PayPal JS SDK einbetten
- [ ] Automatische Buchungsbestätigung

---

## Löschbarkeit / Exit-Strategie

Falls das Angebot eingestellt wird:
1. `git branch -D feature/picknick-korb` (wenn nie gemergt)
2. ODER nach Merge: alle Dateien unter `/picknick/` entfernen + Nav-Link + Sitemap-Eintrag löschen
3. Kein Drittanbieter-Lock-in (kein Monats-Abo), nur PayPal.me-Link (kostenfrei)
