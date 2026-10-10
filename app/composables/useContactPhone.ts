/**
 * Phone number to show in header, footer and page CTAs. The Feiern page shows
 * Tina's events number instead of the pension phone.
 */
export function useContactPhone() {
  const config = useAppConfig()
  const route = useRoute()
  return computed(() => (route.path.startsWith('/feiern') ? config.eventsContact : config.contact))
}
