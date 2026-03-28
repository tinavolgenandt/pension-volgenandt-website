import type { Locale } from '~/composables/useLocale'

const translations: Record<string, Record<Locale, string>> = {
  // Navigation
  'nav.rooms': { de: 'Zimmer', en: 'Rooms' },
  'nav.families': { de: 'Für Familien', en: 'For Families' },
  'nav.activities': { de: 'Aktivitäten', en: 'Activities' },
  'nav.news': { de: 'Aktuelles', en: 'News' },
  'nav.sustainability': { de: 'Nachhaltigkeit', en: 'Sustainability' },
  'nav.contact': { de: 'Kontakt', en: 'Contact' },

  // CTA buttons
  'cta.bookNow': { de: 'Jetzt buchen', en: 'Book now' },
  'cta.book': { de: 'Buchen', en: 'Book' },
  'cta.viewDetails': { de: 'Details ansehen', en: 'View details' },
  'cta.viewRooms': { de: 'Zimmer ansehen', en: 'View rooms' },
  'cta.checkAvailability': { de: 'Verfügbarkeit prüfen', en: 'Check availability' },
  'cta.allRooms': { de: 'Alle Zimmer ansehen', en: 'View all rooms' },

  // Room types
  'room.type.ferienwohnung': { de: 'Ferienwohnung', en: 'Holiday apartment' },
  'room.type.doppelzimmer': { de: 'Doppelzimmer', en: 'Double room' },
  'room.type.zweibettzimmer': { de: 'Zweibettzimmer', en: 'Twin room' },
  'room.type.einzelzimmer': { de: 'Einzelzimmer', en: 'Single room' },

  // Room category headings (plural)
  'room.category.Ferienwohnung': { de: 'Ferienwohnungen', en: 'Holiday Apartments' },
  'room.category.Doppelzimmer': { de: 'Doppel- & Zweibettzimmer', en: 'Double & Twin Rooms' },
  'room.category.Einzelzimmer': { de: 'Einzelzimmer', en: 'Single Rooms' },

  // Room page labels
  'room.from': { de: 'ab', en: 'from' },
  'room.perNight': { de: '/ Nacht inkl. MwSt.', en: '/ night incl. VAT' },
  'room.guest': { de: 'Gast', en: 'guest' },
  'room.guests': { de: 'Gäste', en: 'guests' },
  'room.weekendOnly': {
    de: 'Dieses Zimmer ist <strong>nur freitags bis sonntags</strong> buchbar.',
    en: 'This room is available <strong>Friday to Sunday only</strong>.',
  },
  'room.phoneOnly': {
    de: 'Dieses Zimmer ist nur telefonisch buchbar',
    en: 'This room can only be booked by phone',
  },
  'room.loading': { de: 'Zimmer werden geladen...', en: 'Loading rooms...' },
  'room.notFound': { de: 'Zimmer nicht gefunden', en: 'Room not found' },

  // Room sections
  'room.prices': { de: 'Preise', en: 'Prices' },
  'room.amenities': { de: 'Ausstattung', en: 'Amenities' },
  'room.extras': { de: 'Zusatzleistungen', en: 'Add-ons' },
  'room.otherRooms': { de: 'Weitere Zimmer', en: 'Other Rooms' },
  'room.availability': { de: 'Verfügbarkeit', en: 'Availability' },
  'room.booking': { de: 'Buchung', en: 'Booking' },
  'room.availabilityBooking': {
    de: 'Verfügbarkeit & Buchung',
    en: 'Availability & Booking',
  },

  // Price table
  'price.perNight': { de: 'pro Nacht', en: 'per night' },
  'price.person': { de: 'Person', en: 'person' },
  'price.persons': { de: 'Personen', en: 'persons' },
  'price.allIncl': { de: 'Alle Preise inkl. MwSt.', en: 'All prices incl. VAT' },

  // Description toggle
  'desc.readMore': { de: 'Mehr lesen', en: 'Read more' },
  'desc.showLess': { de: 'Weniger anzeigen', en: 'Show less' },

  // Booking widgets
  'booking.calendarLoading': { de: 'Kalender wird geladen...', en: 'Loading calendar...' },
  'booking.widgetLoading': {
    de: 'Buchungswidget wird geladen...',
    en: 'Loading booking widget...',
  },
  'booking.calendarLabel': {
    de: 'Verfügbarkeitskalender für',
    en: 'Availability calendar for',
  },
  'booking.widgetLabel': { de: 'Buchungswidget für', en: 'Booking widget for' },

  // Contact form
  'contact.heading': { de: 'Kontakt & Anfahrt', en: 'Contact & Directions' },
  'contact.subtitle': { de: 'Wir freuen uns auf Sie', en: 'We look forward to hearing from you' },
  'contact.talkToUs': { de: 'Sprechen Sie uns an', en: 'Get in touch' },
  'contact.talkToUsText': {
    de: 'Ob Sie eine Frage haben, ein Zimmer buchen möchten oder einfach mehr über unsere Pension erfahren wollen – wir sind gerne für Sie da.',
    en: 'Whether you have a question, would like to book a room, or simply want to learn more about our guesthouse – we are happy to help.',
  },
  'contact.mobile': { de: 'Mobil', en: 'Mobile' },
  'contact.landline': { de: 'Festnetz', en: 'Landline' },
  'contact.email': { de: 'E-Mail', en: 'Email' },
  'contact.address': { de: 'Adresse', en: 'Address' },
  'contact.sendMessage': { de: 'Nachricht senden', en: 'Send a message' },
  'contact.sendMessageText': {
    de: 'Schreiben Sie uns – wir antworten in der Regel innerhalb von 24 Stunden.',
    en: 'Write to us – we usually reply within 24 hours.',
  },

  // Contact form fields
  'form.name': { de: 'Name', en: 'Name' },
  'form.email': { de: 'E-Mail', en: 'Email' },
  'form.message': { de: 'Nachricht', en: 'Message' },
  'form.submit': { de: 'Nachricht senden', en: 'Send message' },
  'form.sending': { de: 'Wird gesendet...', en: 'Sending...' },
  'form.successTitle': { de: 'Vielen Dank!', en: 'Thank you!' },
  'form.successText': {
    de: 'Wir haben Ihre Nachricht erhalten und melden uns schnellstmöglich bei Ihnen.',
    en: 'We have received your message and will get back to you as soon as possible.',
  },
  'form.errorGeneric': {
    de: 'Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
    en: 'An error occurred. Please try again.',
  },
  'form.errorNetwork': {
    de: 'Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder rufen Sie uns an.',
    en: 'An error occurred. Please try again or give us a call.',
  },

  // Directions
  'directions.heading': { de: 'Anfahrt', en: 'Directions' },
  'directions.byCar': { de: 'Mit dem Auto (A38)', en: 'By car (A38)' },
  'directions.byCarText': {
    de: 'Von der A38 nehmen Sie die Ausfahrt Leinefelde und folgen der Beschilderung Richtung Breitenbach. Nach etwa 10 Minuten Fahrt erreichen Sie unsere Pension an der Otto-Reuter-Straße 28. Kostenlose Parkplätze stehen direkt vor dem Haus bereit.',
    en: 'From the A38 motorway, take the Leinefelde exit and follow signs towards Breitenbach. After about 10 minutes you will reach our guesthouse at Otto-Reuter-Straße 28. Free parking is available right in front of the building.',
  },
  'directions.byTrain': { de: 'Mit der Bahn', en: 'By train' },
  'directions.byTrainText': {
    de: 'Vom Bahnhof Leinefelde sind es 4 km bis zu unserer Pension. Gerne holen wir Sie nach Absprache vom Bahnhof ab – rufen Sie uns einfach vorher an.',
    en: 'Leinefelde station is 4 km from our guesthouse. We are happy to pick you up by arrangement – just give us a call beforehand.',
  },
  'directions.gps': { de: 'Koordinaten für das Navi', en: 'GPS coordinates' },
  'directions.openMaps': { de: 'In Google Maps öffnen', en: 'Open in Google Maps' },

  // FAQ
  'faq.heading': { de: 'Häufige Fragen', en: 'Frequently Asked Questions' },

  // Footer
  'footer.contact': { de: 'Kontakt', en: 'Contact' },
  'footer.discover': { de: 'Entdecken', en: 'Explore' },
  'footer.legal': { de: 'Rechtliches', en: 'Legal' },
  'footer.cookieSettings': { de: 'Cookie-Einstellungen', en: 'Cookie Settings' },
  'footer.copyright': { de: 'Alle Rechte vorbehalten.', en: 'All rights reserved.' },
  'footer.ctaHeading': {
    de: 'Bereit für Ihren Aufenthalt im Eichsfeld?',
    en: 'Ready for your stay in the Eichsfeld?',
  },
  'footer.ctaButton': { de: 'Verfügbarkeit prüfen', en: 'Check availability' },
  'footer.callUs': { de: 'Oder rufen Sie uns direkt an', en: 'Or call us directly' },

  // Header
  'header.toggleNav': { de: 'Navigation umschalten', en: 'Toggle navigation' },
  'header.mainNav': { de: 'Hauptnavigation', en: 'Main navigation' },
  'header.mobileNav': { de: 'Mobile Navigation', en: 'Mobile navigation' },

  // Homepage EN
  'home.title': {
    de: 'Pension Volgenandt | Ruhe finden im Eichsfeld',
    en: 'Pension Volgenandt | Find Peace in the Eichsfeld',
  },
  'home.description': {
    de: 'Familiär geführte Pension in Breitenbach, Eichsfeld. Ferienwohnungen und Zimmer mit Blick ins Grüne.',
    en: 'Family-run guesthouse in Breitenbach, Eichsfeld. Holiday apartments and rooms with views of the countryside.',
  },

  // Rooms listing page
  'rooms.title': { de: 'Unsere Zimmer', en: 'Our Rooms' },
  'rooms.subtitle': {
    de: 'Ob gemütliche Ferienwohnung für die ganze Familie oder komfortables Doppelzimmer für Paare – bei uns finden Sie den passenden Rückzugsort für Ihren Aufenthalt im Eichsfeld.',
    en: 'Whether a cosy holiday apartment for the whole family or a comfortable double room for couples – you will find the perfect retreat for your stay in the Eichsfeld.',
  },
  'rooms.chooseRoom': {
    de: 'Wählen Sie ein Zimmer, um Verfügbarkeit und Buchungsmöglichkeiten zu sehen.',
    en: 'Select a room to see availability and booking options.',
  },

  // Soft CTA
  'softCta.default': {
    de: 'Haben Sie Fragen? Wir helfen Ihnen gerne weiter.',
    en: 'Have a question? We are happy to help.',
  },
  'softCta.callUs': { de: 'Oder rufen Sie uns direkt an', en: 'Or call us directly' },

  // Booking CTA
  'bookingCta.default': {
    de: 'Finden Sie Ihr perfektes Zimmer',
    en: 'Find your perfect room',
  },

  // Homepage sections (EN)
  'home.welcomeHeading': {
    de: 'Willkommen in Breitenbach',
    en: 'Welcome to Breitenbach',
  },
  'home.welcomeText': {
    de: '',
    en: 'Our family-run guesthouse in the heart of the Eichsfeld region offers the perfect base for a relaxing getaway. Surrounded by rolling hills, castles, and nature, you can unwind in our comfortable rooms and apartments – each with its own character and views of the countryside.',
  },
  'home.ourRooms': { de: 'Unsere Zimmer', en: 'Our Rooms' },
  'home.locationHeading': {
    de: 'So finden Sie uns',
    en: 'How to Find Us',
  },
  'home.locationText': {
    de: '',
    en: 'Pension Volgenandt is located in the village of Breitenbach, part of Leinefelde-Worbis in Thuringia. The A38 motorway is just 10 minutes away, and Leinefelde train station is 4 km from our door.',
  },

  // Hosts
  'hosts.caption': {
    de: 'Simone & Ralf Volgenandt – wir freuen uns auf Sie',
    en: 'Simone & Ralf Volgenandt – we look forward to welcoming you',
  },
  'hosts.buildingCaption': {
    de: 'So empfängt Sie unsere Pension',
    en: 'This is how our guesthouse welcomes you',
  },

  // Schema.org
  'schema.persons': { de: 'Personen', en: 'persons' },
}

/**
 * Look up a translated string by key and locale.
 * Returns the key itself as fallback if not found.
 */
export function t(key: string, locale: Locale): string {
  return translations[key]?.[locale] ?? translations[key]?.de ?? key
}
