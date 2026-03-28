export default defineAppConfig({
  siteName: 'Pension Volgenandt',
  contactFormUrl: 'https://api.pension-volgenandt.de/send-mail.php',
  beds24: {
    propId: 261258,
    baseUrl: 'https://beds24.com/booking2.php',
  },
  contact: {
    phone: '+49 160 97719112',
    phoneDisplay: '0160 97719112',
    landline: '+49 3605 542775',
    landlineDisplay: '03605 542775',
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
    ownerName: 'Ralf Volgenandt',
    taxId: '157/299/10837',
    authority: '',
  },
})
