export interface ConsentPreferences {
  essential: boolean // Always true, cannot be toggled
  booking: boolean // Beds24 widget (Phase 5)
  media: boolean // YouTube, Maps (Phase 3+)
}

export function useCookieConsent() {
  const consent = useCookie<ConsentPreferences | null>('cookie_consent', {
    maxAge: 60 * 60 * 24 * 180, // 180 days
    sameSite: 'lax',
    path: '/',
    default: () => null, // null = no choice made yet
  })

  const settingsOpen = ref(false)

  const hasConsented = computed(() => consent.value !== null)

  function acceptAll() {
    consent.value = { essential: true, booking: true, media: true }
  }

  function rejectAll() {
    consent.value = { essential: true, booking: false, media: false }
  }

  function updateCategory(category: keyof ConsentPreferences, value: boolean) {
    if (category === 'essential') return
    if (!consent.value) {
      consent.value = { essential: true, booking: false, media: false }
    }
    consent.value = { ...consent.value, [category]: value }
  }

  function isAllowed(category: keyof ConsentPreferences): boolean {
    if (category === 'essential') return true
    return consent.value?.[category] ?? false
  }

  function openSettings() {
    settingsOpen.value = true
  }

  function closeSettings() {
    settingsOpen.value = false
  }

  function revokeConsent() {
    consent.value = null
  }

  return {
    consent: readonly(consent),
    hasConsented,
    settingsOpen,
    acceptAll,
    rejectAll,
    updateCategory,
    isAllowed,
    openSettings,
    closeSettings,
    revokeConsent,
  }
}
