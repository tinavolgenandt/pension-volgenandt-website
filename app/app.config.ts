export default defineAppConfig({
  siteName: 'Pension Volgenandt',
  formspreeId: 'xPLACEHOLDER', // Replace with real Formspree form ID from https://formspree.io
  siteTagline: 'Ruhe finden im Eichsfeld',
  contact: {
    phone: '+49 160 97719112',
    phoneDisplay: '0160 97719112',
    landline: '+49 3605 542772',
    landlineDisplay: '03605 542772',
    mobile: '+49 160 97719112',
    mobileDisplay: '0160 97719112',
    email: 'kontakt@pension-volgenandt.de',
    address: {
      street: 'Otto-Reuter-Straße 28',
      city: '37327 Leinefelde-Worbis OT Breitenbach',
      country: 'Deutschland',
    },
  },
  legal: {
    ownerName: '[INHABER_NAME]',
    taxId: '[STEUERNUMMER_ODER_UST_IDNR]',
    authority: '',
  },
  nav: [
    { label: 'Zimmer', to: '/zimmer' },
    { label: 'Für Familien', to: '/familie' },
    { label: 'Aktivitäten', to: '/aktivitaeten' },
    { label: 'Aktuelles', to: '/aktuelles' },
    { label: 'Nachhaltigkeit', to: '/nachhaltigkeit' },
    { label: 'Kontakt', to: '/kontakt' },
  ],
})
