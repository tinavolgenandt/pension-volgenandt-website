import { t } from '~/utils/translations'
import type { Locale } from '~/composables/useLocale'

const EVENT_START = new Date('2026-04-23T00:00:00+02:00')
const EVENT_END = new Date('2026-10-11T23:59:59+02:00')

export function useLgsCountdown(locale: Ref<Locale>) {
  const now = ref(new Date())
  const mounted = ref(false)

  onMounted(() => {
    mounted.value = true
    now.value = new Date()

    const interval = setInterval(() => {
      now.value = new Date()
    }, 60_000)

    onUnmounted(() => clearInterval(interval))
  })

  const daysUntil = computed(() => {
    const diff = EVENT_START.getTime() - now.value.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  })

  const isLive = computed(() => now.value >= EVENT_START && now.value <= EVENT_END)
  const isExpired = computed(() => now.value > EVENT_END)
  const showBanner = computed(() => mounted.value && !isExpired.value)

  const countdownText = computed(() => {
    if (isLive.value) return t('lgs.liveNow', locale.value)
    if (daysUntil.value === 1) return t('lgs.countdownOne', locale.value)
    return t('lgs.countdown', locale.value).replace('{days}', String(daysUntil.value))
  })

  const linkTarget = computed(() =>
    locale.value === 'en'
      ? '/en/news/landesgartenschau-2026/'
      : '/aktuelles/landesgartenschau-2026/',
  )

  return { daysUntil, isLive, isExpired, showBanner, countdownText, linkTarget }
}
