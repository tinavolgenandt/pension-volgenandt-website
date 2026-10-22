/**
 * Fires a GA4 `purchase` event when a guest returns from the Beds24 booking
 * engine to our confirmation page (/buchung-danke, /en/booking-thank-you).
 *
 * Beds24 is configured to redirect back with `?amt=<total>&tx=<bookingId>` after
 * a completed booking. The event feeds the "pension-volgenandt.de (web) purchase"
 * conversion in Google Ads, turning finished bookings — not just clicks to
 * beds24.com — into measurable conversions. Consent Mode (see the analytics
 * plugin) governs whether the hit is stored.
 *
 * Attribution works because the event fires back on our own domain, where the
 * Google Ads click cookie (_gcl / GCLID) already lives.
 */
export function useBookingConversion() {
  const { trackEvent } = useAnalytics()
  const route = useRoute()

  onMounted(() => {
    const value = Number(route.query.amt ?? route.query.betrag) || 0
    const txn = String(route.query.tx ?? route.query.txn ?? '')

    // Ignore direct visits that carry no booking context, and anything that
    // does not look like a real Beds24 return (numeric booking ID, plausible
    // total): a hand-made link like ?amt=9999&tx=x must not count as a sale
    // in Google Ads.
    if (!/^\d{5,12}$/.test(txn) || value <= 0 || value > 10000) return

    // Dedupe: GA4/Ads dedupe by transaction_id, but guard page refreshes too.
    const key = `booking_purchase_${txn || value}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')

    trackEvent('purchase', {
      transaction_id: txn || undefined,
      value,
      currency: 'EUR',
      items: [
        {
          item_name: 'Übernachtung Pension Volgenandt',
          price: value,
          quantity: 1,
        },
      ],
    })
  })
}
