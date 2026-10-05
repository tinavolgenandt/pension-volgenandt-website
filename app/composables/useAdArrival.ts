/**
 * Did the visitor come from a Google ad?
 *
 * The ad's click marker (gclid, gbraid, wbraid or utm_medium=cpc) is read once from the address of the first page
 * and kept in memory only: no cookie, nothing stored on the device. While the visitor moves around the site (no
 * full reload), the Beds24 booking links carry referer=GoogleAds instead of referer=Website. Beds24 keeps that
 * referer with the booking, and the booking engine counts these stays as "Buchungen über Anzeigen".
 */
const fromAd = ref(false)

/** Called once for the first page. Only ever switches on: a later page without the marker is still the same visit. */
export function markAdArrival(search: string) {
  if (
    /[?&](gclid|gbraid|wbraid)=/.test(search) ||
    /[?&]utm_medium=(cpc|ppc|paid)(&|$)/i.test(search)
  ) {
    fromAd.value = true
  }
}

export function useAdArrival() {
  return {
    fromAd: readonly(fromAd),
    /** The referer for Beds24 booking links */
    beds24Referer: computed(() => (fromAd.value ? 'GoogleAds' : 'Website')),
  }
}
