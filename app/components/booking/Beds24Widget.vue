<script setup lang="ts">
interface Props {
  beds24PropertyId: number
  beds24RoomId?: number
  roomName: string
}

const props = defineProps<Props>()

const { isAllowed } = useCookieConsent()
const { isReady } = useBeds24Widget()
const containerRef = ref<HTMLElement | null>(null)

const isClient = import.meta.client
const showWidget = computed(() => isClient && isAllowed('booking'))

// Initialize widget when scripts are loaded and container is mounted
watch(
  [isReady, containerRef],
  ([ready, container]) => {
    if (!ready || !container) return

    const $ = (window as any).jQuery
    if (!$) return

    $(container).bookWidget({
      widgetType: 'BookingBox',
      propid: props.beds24PropertyId,
      ...(props.beds24RoomId != null ? { roomid: props.beds24RoomId } : {}),
      formAction: 'https://beds24.com/booking2.php',
      formTarget: '_blank',
      widgetLang: 'de',
      dateSelection: 3,
      peopleSelection: 2,
      defaultNumNight: 2,
      defaultNumAdult: 2,
      // Design system colors
      buttonColor: '#c8913a', // waldhonig-500
      color: '#2d4a3e', // sage-800
      backgroundColor: '#f9f7f4', // warm-white
      borderColor: '#bfc9c3', // sage-300
    })
  },
  { flush: 'post' },
)
</script>

<template>
  <!-- Completely absent from DOM when consent not granted -->
  <div v-if="showWidget" class="rounded-lg border border-sage-200 bg-white p-4 shadow-sm sm:p-6">
    <h3 class="mb-4 font-serif text-lg font-semibold text-sage-800">Buchung</h3>
    <div
      v-if="isReady"
      ref="containerRef"
      :aria-label="`Buchungswidget für ${roomName}`"
      role="region"
    />
    <div v-else class="flex items-center gap-2 py-4 text-sm text-sage-500">
      <svg class="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      Buchungswidget wird geladen...
    </div>
  </div>
</template>
