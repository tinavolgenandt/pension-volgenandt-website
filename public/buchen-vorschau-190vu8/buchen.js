// Guest-facing booking form. Talks to /v1/public/* - the same availability, prices and rules the admin uses.
const { createApp, ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } = Vue;

// Served by the booking server itself: empty. Served from our website: <meta name="pv-api-base" content="https://…">.
const API_BASE = (document.querySelector('meta[name="pv-api-base"]')?.content || '').replace(/\/$/, '');
const ON_BOOKING_SERVER = API_BASE === '';
const ADMIN_URL = API_BASE + (ON_BOOKING_SERVER ? '../admin/' : '/admin/');

async function call(path, body) {
  let res;
  try {
    res = await fetch(API_BASE + '/v1/public/' + path, {
      method: body ? 'POST' : 'GET',
      credentials: 'same-origin', // on the website: no cookies towards the booking server - it needs none
      headers: { 'X-PV-Admin': '1', ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    throw new Error('Keine Verbindung zum Buchungsserver. Bitte versuchen Sie es gleich noch einmal.');
  }
  let data = null;
  try { data = await res.json(); } catch (e) { /* not json */ }
  if (res.status === 401) {
    const err = new Error('login');
    err.login = true;
    throw err;
  }
  if (!res.ok || !data || data.ok === false) {
    throw new Error((data && data.error) || 'Das hat leider nicht geklappt. Bitte versuchen Sie es noch einmal.');
  }
  return data;
}

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const plus = (days, from = new Date()) => { const d = new Date(from); d.setDate(d.getDate() + days); return iso(d); };
const money = (v) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(Number(v || 0));
const nice = (s) => { if (!s) return ''; const [y, m, d] = s.split('-'); return `${d}.${m}.${y}`; };

createApp({
  setup() {
    const route = ref('booking'); // 'booking' | 'storno'
    const config = ref(null);
    const needLogin = ref(false);
    const stay = reactive({ arrival: plus(14), departure: plus(16), adults: 2, children: 0 });
    const rooms = ref(null);
    const roomId = ref(null);
    const extras = reactive({});
    const guest = reactive({ first_name: '', last_name: '', email: '', phone: '', address: '', postcode: '', city: '' });
    const more = reactive({ arrival_time: '', comments: '', accept_terms: false, website: '' });

    // Vouchers
    const voucherInput = ref('');
    const voucher = ref(null);
    const voucherError = ref('');
    const voucherBusy = ref(false);

    // Payment
    const paymentMethod = ref('bank_transfer'); // 'bank_transfer' | 'paypal'
    const paypalReady = ref(false);
    const paypalRendered = ref(false);

    // General state
    const error = ref('');
    const busy = ref(false);
    const done = ref(null);

    // Storno self-service
    const storno = reactive({
      token: '',
      booking: null,
      loading: false,
      error: '',
      success: '',
      confirm: false,
    });

    function parseHash() {
      const h = window.location.hash || '';
      const m = h.match(/^#\/?storno\/([a-f0-9]{64})$/i) || h.match(/^#storno-([a-f0-9]{64})$/i);
      if (m) {
        route.value = 'storno';
        storno.token = m[1];
        loadStornoBooking(m[1]);
      } else {
        route.value = 'booking';
      }
    }

    async function loadStornoBooking(tok) {
      storno.loading = true;
      storno.error = '';
      storno.success = '';
      storno.confirm = false;
      try {
        storno.booking = await call('booking/' + tok);
      } catch (e) {
        storno.booking = null;
        storno.error = e.message;
      } finally {
        storno.loading = false;
      }
    }

    async function cancelStornoBooking() {
      if (!storno.token) return;
      storno.loading = true;
      storno.error = '';
      try {
        const res = await call('booking/' + storno.token + '/cancel', {});
        storno.success = 'Ihre Buchung wurde erfolgreich storniert. Sie erhalten eine Bestätigung per E-Mail.';
        storno.booking = await call('booking/' + storno.token);
      } catch (e) {
        storno.error = e.message;
      } finally {
        storno.loading = false;
        storno.confirm = false;
      }
    }

    // Gallery & Lightbox
    const galleryIndex = reactive({});
    function getGalleryIndex(id) {
      return galleryIndex[id] || 0;
    }
    function prevGalleryImage(r, ev) {
      if (ev) ev.stopPropagation();
      const len = (r.images && r.images.length) || 1;
      galleryIndex[r.id] = (getGalleryIndex(r.id) - 1 + len) % len;
    }
    function nextGalleryImage(r, ev) {
      if (ev) ev.stopPropagation();
      const len = (r.images && r.images.length) || 1;
      galleryIndex[r.id] = (getGalleryIndex(r.id) + 1) % len;
    }
    function setGalleryIndex(r, idx, ev) {
      if (ev) ev.stopPropagation();
      galleryIndex[r.id] = idx;
    }

    const lightbox = reactive({
      open: false,
      room: null,
      index: 0,
    });
    function openLightbox(r, idx, ev) {
      if (ev) ev.stopPropagation();
      lightbox.room = r;
      lightbox.index = idx !== undefined ? idx : getGalleryIndex(r.id);
      lightbox.open = true;
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.open = false;
      lightbox.room = null;
      document.body.style.overflow = '';
    }
    function prevLightboxImage() {
      if (!lightbox.room || !lightbox.room.images) return;
      const len = lightbox.room.images.length;
      lightbox.index = (lightbox.index - 1 + len) % len;
    }
    function nextLightboxImage() {
      if (!lightbox.room || !lightbox.room.images) return;
      const len = lightbox.room.images.length;
      lightbox.index = (lightbox.index + 1) % len;
    }
    function handleKeydown(e) {
      if (!lightbox.open) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') prevLightboxImage();
      else if (e.key === 'ArrowRight') nextLightboxImage();
    }

    onMounted(async () => {
      window.addEventListener('hashchange', parseHash);
      window.addEventListener('keydown', handleKeydown);
      parseHash();

      try {
        const c = await call('config');
        config.value = c;
        if (c.test_mode && c.tester_email) {
          guest.email = c.tester_email;
          guest.first_name = c.tester_name || 'Test';
          guest.last_name = 'Testgast';
        }
      } catch (e) {
        if (e.login) needLogin.value = true;
        else error.value = e.message;
      }
    });

    onUnmounted(() => {
      window.removeEventListener('hashchange', parseHash);
      window.removeEventListener('keydown', handleKeydown);
    });

    async function search() {
      error.value = '';
      busy.value = true;
      roomId.value = null;
      try {
        rooms.value = (await call('availability', stay)).rooms;
      } catch (e) {
        rooms.value = null;
        error.value = e.message;
      }
      busy.value = false;
    }

    function changedStay() {
      rooms.value = null;
      roomId.value = null;
      voucher.value = null;
      voucherError.value = '';
      if (stay.departure <= stay.arrival) {
        stay.departure = plus(1, new Date(stay.arrival + 'T12:00:00'));
      }
    }

    const room = computed(() => (rooms.value || []).find(r => r.id === roomId.value) || null);
    const roomExtras = computed(() => !config.value || !room.value ? [] : config.value.extras.filter(e => !e.room_ids.length || e.room_ids.includes(Number(room.value.id))));
    const hiddenExtras = computed(() => !config.value || !room.value ? [] : config.value.extras.filter(e => e.room_ids.length && !e.room_ids.includes(Number(room.value.id))));
    const extraHint = computed(() => hiddenExtras.value.map(e => `„${e.name}“ ist buchbar in: ${(rooms.value || []).filter(r => e.room_ids.includes(r.id)).map(r => r.name).join(', ')}.`).join(' '));
    const extrasTotal = computed(() => !config.value || !room.value ? 0 : roomExtras.value.reduce((sum, e) => sum + Number(extras[e.id] || 0) * Number(e.price) * (e.period === 'daily' ? room.value.nights : 1), 0));

    const voucherDiscount = computed(() => voucher.value ? Number(voucher.value.discount_amount || 0) : 0);
    const total = computed(() => {
      if (!room.value) return 0;
      return Math.max(0, room.value.total + extrasTotal.value - voucherDiscount.value);
    });

    watch(roomId, () => {
      if (!config.value) return;
      const allowed = new Set(roomExtras.value.map(e => e.id));
      Object.keys(extras).forEach((id) => { if (!allowed.has(Number(id))) delete extras[id]; });
      if (voucher.value) {
        applyVoucher();
      }
    });

    async function applyVoucher() {
      const code = voucherInput.value.trim();
      if (!code) return;
      voucherBusy.value = true;
      voucherError.value = '';
      try {
        const res = await call('voucher', {
          code,
          room_id: roomId.value,
          arrival: stay.arrival,
          departure: stay.departure,
          adults: stay.adults,
          children: stay.children,
        });
        voucher.value = res;
        voucherInput.value = res.code;
      } catch (e) {
        voucher.value = null;
        voucherError.value = e.message;
      } finally {
        voucherBusy.value = false;
      }
    }

    function removeVoucher() {
      voucher.value = null;
      voucherInput.value = '';
      voucherError.value = '';
    }

    // PayPal button mounting
    function getSelectedExtras() {
      return Object.entries(extras)
        .filter(([, q]) => Number(q) > 0)
        .map(([id, qty]) => ({ id: Number(id), qty: Number(qty) }));
    }

    function setupPayPal() {
      if (paymentMethod.value !== 'paypal') return;
      const clientId = config.value?.paypal?.client_id;
      if (!clientId) return;

      if (!window.paypal) {
        if (!document.getElementById('paypal-sdk-script')) {
          const s = document.createElement('script');
          s.id = 'paypal-sdk-script';
          s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=EUR&locale=de_DE`;
          s.onload = () => renderPayPalButtons();
          document.head.appendChild(s);
        }
      } else {
        renderPayPalButtons();
      }
    }

    function renderPayPalButtons() {
      nextTick(() => {
        const container = document.getElementById('paypal-button-container');
        if (!container || !window.paypal || paypalRendered.value) return;
        container.innerHTML = '';

        window.paypal.Buttons({
          style: {
            color: 'gold',
            shape: 'rect',
            label: 'pay',
            height: 44,
          },
          createOrder: async () => {
            error.value = '';
            try {
              const res = await call('paypal/order', {
                arrival: stay.arrival,
                departure: stay.departure,
                adults: stay.adults,
                children: stay.children,
                room_id: roomId.value,
                voucher_code: voucher.value ? voucher.value.code : undefined,
                extras: getSelectedExtras(),
                guest,
                ...more,
              });
              return res.order_id;
            } catch (e) {
              error.value = e.message;
              throw e;
            }
          },
          onApprove: async (data) => {
            busy.value = true;
            error.value = '';
            try {
              const captureRes = await call('paypal/capture', {
                order_id: data.orderID,
                arrival: stay.arrival,
                departure: stay.departure,
                adults: stay.adults,
                children: stay.children,
                room_id: roomId.value,
                voucher_code: voucher.value ? voucher.value.code : undefined,
                extras: getSelectedExtras(),
                guest,
                ...more,
              });
              done.value = captureRes;
              window.scrollTo(0, 0);
            } catch (e) {
              error.value = e.message;
            } finally {
              busy.value = false;
            }
          },
          onError: (err) => {
            error.value = 'PayPal-Fehler: Die Zahlung konnte nicht abgeschlossen werden.';
          },
        }).render('#paypal-button-container');

        paypalRendered.value = true;
      });
    }

    watch(paymentMethod, (m) => {
      if (m === 'paypal') {
        paypalRendered.value = false;
        setupPayPal();
      }
    });

    async function book() {
      error.value = '';
      busy.value = true;
      try {
        done.value = await call('bookings', {
          ...stay,
          room_id: roomId.value,
          guest,
          ...more,
          payment_method: 'bank_transfer',
          voucher_code: voucher.value ? voucher.value.code : undefined,
          extras: getSelectedExtras(),
        });
        window.scrollTo(0, 0);
      } catch (e) {
        error.value = e.message;
      } finally {
        busy.value = false;
      }
    }

    function again() {
      done.value = null;
      rooms.value = null;
      roomId.value = null;
      Object.keys(extras).forEach(k => delete extras[k]);
      more.accept_terms = false;
      more.comments = '';
      voucher.value = null;
      voucherInput.value = '';
      voucherError.value = '';
      paymentMethod.value = 'bank_transfer';
      paypalRendered.value = false;
      window.location.hash = '';
      closeLightbox();
    }

    return {
      route,
      config,
      needLogin,
      adminUrl: ADMIN_URL,
      stay,
      rooms,
      roomId,
      room,
      extras,
      guest,
      more,
      voucherInput,
      voucher,
      voucherError,
      voucherBusy,
      applyVoucher,
      removeVoucher,
      voucherDiscount,
      paymentMethod,
      total,
      roomExtras,
      extraHint,
      extrasTotal,
      search,
      changedStay,
      book,
      again,
      money,
      nice,
      today: iso(new Date()),
      error,
      busy,
      done,
      storno,
      cancelStornoBooking,
      galleryIndex,
      getGalleryIndex,
      prevGalleryImage,
      nextGalleryImage,
      setGalleryIndex,
      lightbox,
      openLightbox,
      closeLightbox,
      prevLightboxImage,
      nextLightboxImage,
    };
  },
  template: `
    <header class="top">
      <h1>Pension Volgenandt</h1>
      <p>Ruhe finden im Eichsfeld · Zimmer online buchen</p>
    </header>

    <main v-if="needLogin">
      <div class="card">
        <h2>Nur für das Team</h2>
        <p>Dieses Buchungsformular läuft noch im Testbetrieb. Bitte zuerst in der Verwaltung anmelden – danach diese Seite neu laden.</p>
        <p><a class="btn" :href="adminUrl">Zur Anmeldung</a></p>
      </div>
    </main>

    <!-- SELF-SERVICE STORNO VIEW -->
    <template v-else-if="route === 'storno'">
      <main>
        <div class="card">
          <h2><span class="n">✓</span>Buchungsdetails & Stornierung</h2>

          <div v-if="storno.loading" class="boot">Buchung wird geladen …</div>
          <div class="note bad" v-else-if="storno.error">{{ storno.error }}</div>

          <div v-else-if="storno.booking">
            <div class="note ok" v-if="storno.success" style="margin-bottom:14px"><b>{{ storno.success }}</b></div>

            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
              <span style="font-size:18px">Buchungsnummer: <b>{{ storno.booking.booking_number }}</b></span>
              <span class="status-pill" :class="storno.booking.status">
                {{ storno.booking.status === 'confirmed' ? 'Bestätigt' : (storno.booking.status === 'cancelled' ? 'Storniert' : 'Anfrage') }}
              </span>
            </div>

            <div class="storno-details">
              <div class="storno-row">
                <span class="label">Gast</span>
                <span class="val">{{ storno.booking.guest_name }}</span>
              </div>
              <div class="storno-row">
                <span class="label">Zimmer</span>
                <span class="val">{{ storno.booking.room_name }}</span>
              </div>
              <div class="storno-row">
                <span class="label">Zeitraum</span>
                <span class="val">{{ nice(storno.booking.arrival) }} – {{ nice(storno.booking.departure) }}</span>
              </div>
              <div class="storno-row">
                <span class="label">Personen</span>
                <span class="val">{{ storno.booking.num_adult }} Erw. {{ storno.booking.num_child ? ', ' + storno.booking.num_child + ' Kind(er)' : '' }}</span>
              </div>
              <div class="storno-row">
                <span class="label">Zahlungsart</span>
                <span class="val">{{ storno.booking.payment_method === 'paypal' ? 'PayPal' : 'Überweisung' }} ({{ storno.booking.payment_status === 'paid' ? 'Bezahlt' : 'Offen' }})</span>
              </div>
              <div class="storno-row">
                <span class="label">Gesamtbetrag</span>
                <span class="val" style="color:var(--green);font-size:17px">{{ money(storno.booking.total) }}</span>
              </div>
            </div>

            <!-- Cancellation actions -->
            <div v-if="storno.booking.status === 'cancelled'" class="note" style="margin-top:16px">
              <b>Diese Buchung wurde storniert.</b><br>
              <span v-if="storno.booking.cancelled_at">Stornierungszeitpunkt: {{ storno.booking.cancelled_at }}</span>
            </div>

            <div v-else-if="storno.booking.can_cancel" style="margin-top:20px;border-top:1px solid var(--line);padding-top:16px">
              <p class="note ok" style="margin-bottom:12px">
                Eine kostenlose Online-Stornierung ist für diese Buchung bis zum <b>{{ nice(storno.booking.cancellation_deadline) }}</b> möglich.
              </p>

              <div v-if="!storno.confirm">
                <button class="btn bad" @click="storno.confirm = true">Buchung jetzt stornieren</button>
              </div>
              <div v-else class="note bad" style="margin-top:10px">
                <p style="margin:0 0 10px font-weight:600">Möchten Sie diese Buchung wirklich verbindlich stornieren?</p>
                <div style="display:flex;gap:10px">
                  <button class="btn bad sm" :disabled="storno.loading" @click="cancelStornoBooking">Ja, verbindlich stornieren</button>
                  <button class="btn ghost sm" @click="storno.confirm = false">Abbrechen</button>
                </div>
              </div>
            </div>

            <div v-else class="note" style="margin-top:16px">
              Die Frist für eine kostenlose Online-Stornierung (bis {{ nice(storno.booking.cancellation_deadline) }}) ist abgelaufen. Bitte kontaktieren Sie uns direkt per Telefon oder E-Mail.
            </div>

            <p style="margin-top:24px"><a class="btn ghost" href="#/">← Zur Buchungsmaske</a></p>
          </div>
        </div>
      </main>
    </template>

    <!-- STANDARD BOOKING FUNNEL -->
    <template v-else-if="config">
      <div class="testbar" v-if="config.test_mode">
        <b>Testbetrieb.</b> Jede Buchung hier ist eine Testbuchung: Sie erscheint in der Verwaltung mit der Markierung „Test“, und die Mails gehen an {{ config.tester_email || 'das Team' }}.
      </div>

      <main v-if="done">
        <div class="card done">
          <div class="big">✓</div>
          <h2 style="justify-content:center;margin-top:10px">
            {{ done.payment_method === 'paypal' ? 'Vielen Dank für Ihre Buchung!' : 'Vielen Dank für Ihre Buchungsanfrage!' }}
          </h2>
          <p>Ihre Buchungsnummer: <b>{{ done.booking_number }}</b> · Gesamtbetrag <b>{{ money(done.total) }}</b></p>
          
          <p v-if="done.payment_method === 'paypal'">
            Ihre Zahlung per PayPal wurde erfolgreich verbucht. Ihre Buchung ist damit <b>sofort bestätigt</b>. Sie erhalten alle Details per E-Mail.
          </p>
          <p v-else>
            Wir haben Ihnen soeben eine E-Mail mit den Zahlungsinformationen geschickt. Sobald Ihre Überweisung eingegangen ist, erhalten Sie die Buchungsbestätigung.
          </p>

          <div class="token-box" v-if="done.cancellation_token">
            <b>Buchungsverwaltung & Stornierung:</b><br>
            Sie können Ihre Buchung jederzeit online einsehen oder stornieren unter:<br>
            <a :href="'#/storno/' + done.cancellation_token" style="color:var(--green);font-weight:600">
              Buchung online aufrufen
            </a>
          </div>

          <div class="note" v-if="done.is_test" style="text-align:left;margin-top:14px">
            <b>Für dich als Testerin:</b> In der Verwaltung steht die Buchung mit Status „{{ done.status }}“ und der Markierung „Test“. Dort unter „Nachrichten“ siehst du, welche Mails ausgelöst wurden.
          </div>
          <p style="margin-top:18px">
            <a class="btn" :href="adminUrl + '#mailtest'" v-if="done.is_test">Zur Verwaltung → Mails testen</a>
            <button class="btn ghost" @click="again">Weitere Buchung</button>
          </p>
        </div>
      </main>

      <main v-else>
        <!-- Step 1: Dates & Guests -->
        <div class="card">
          <h2><span class="n">1</span>Wann möchten Sie kommen?</h2>
          <div class="grid">
            <label>Anreise<input type="date" v-model="stay.arrival" :min="today" @change="changedStay"></label>
            <label>Abreise<input type="date" v-model="stay.departure" :min="stay.arrival" @change="changedStay"></label>
            <label>Erwachsene<select v-model.number="stay.adults" @change="changedStay"><option v-for="n in config.max_guests" :key="n" :value="n">{{ n }}</option></select></label>
            <label>Kinder<select v-model.number="stay.children" @change="changedStay"><option v-for="n in 5" :key="n" :value="n - 1">{{ n - 1 }}</option></select></label>
          </div>
          <p style="margin:14px 0 0"><button class="btn" :disabled="busy" @click="search">Verfügbarkeit prüfen</button></p>
        </div>

        <div class="note bad" v-if="error" role="alert">{{ error }}</div>

        <!-- Step 2: Room Selection -->
        <div class="card" v-if="rooms">
          <h2><span class="n">2</span>Ihr Zimmer</h2>
          <p class="note" v-if="!rooms.some(r => r.available)">
            In diesem Zeitraum ist leider nichts frei. Bitte probieren Sie andere Tage – oder rufen Sie uns an: {{ config.property.phone }}.
          </p>

          <div class="rooms-list">
            <div v-for="r in rooms" :key="r.id"
                 class="room-card"
                 :class="{ on: roomId === r.id, off: !r.available }"
                 @click="r.available && (roomId = r.id)"
                 role="button"
                 :tabindex="r.available ? 0 : -1"
                 :aria-pressed="roomId === r.id">

              <!-- Left/Gallery column -->
              <div class="room-gallery" v-if="r.images && r.images.length">
                <div class="room-gallery-viewport" @click.stop="openLightbox(r, getGalleryIndex(r.id), $event)" title="Klicken für Großansicht">
                  <img :src="r.images[getGalleryIndex(r.id)].src"
                       :alt="r.images[getGalleryIndex(r.id)].caption || r.name"
                       class="room-gallery-img"
                       loading="lazy" />
                  <span class="gallery-badge" v-if="r.images.length > 1">
                    📷 {{ getGalleryIndex(r.id) + 1 }} / {{ r.images.length }}
                  </span>
                  <button v-if="r.images.length > 1"
                          type="button"
                          class="gallery-arrow prev"
                          @click.stop="prevGalleryImage(r, $event)"
                          aria-label="Vorheriges Bild">‹</button>
                  <button v-if="r.images.length > 1"
                          type="button"
                          class="gallery-arrow next"
                          @click.stop="nextGalleryImage(r, $event)"
                          aria-label="Nächstes Bild">›</button>
                </div>
                <div class="gallery-dots" v-if="r.images.length > 1">
                  <span v-for="(img, idx) in r.images"
                        :key="idx"
                        class="gallery-dot"
                        :class="{ active: getGalleryIndex(r.id) === idx }"
                        @click.stop="setGalleryIndex(r, idx, $event)"></span>
                </div>
                <div class="gallery-caption" v-if="r.images[getGalleryIndex(r.id)].caption">
                  {{ r.images[getGalleryIndex(r.id)].caption }}
                </div>
              </div>

              <!-- Right/Details column -->
              <div class="room-info">
                <div class="room-header-row">
                  <div class="room-title-group">
                    <b class="room-title">{{ r.name }}</b>
                    <div class="room-meta">
                      bis {{ r.max_guests }} {{ r.max_guests === 1 ? 'Person' : 'Personen' }}
                      <template v-if="!r.available"> · <span class="unavail-reason">{{ r.reason }}</span></template>
                    </div>
                  </div>
                  <div class="room-price-box" v-if="r.available">
                    <b class="room-price-total">{{ money(r.total) }}</b>
                    <div class="room-price-sub">{{ r.nights }} {{ r.nights === 1 ? 'Nacht' : 'Nächte' }} · {{ money(r.per_night) }} / Nacht</div>
                  </div>
                </div>

                <p class="room-desc" v-if="r.description">{{ r.description }}</p>

                <div class="pills">
                  <span class="pill pill-type">{{ r.room_type === 'ferienwohnung' ? '🏡 Ferienwohnung' : '🛏️ Zimmer' }}</span>
                  <span class="pill">Kostenloses WLAN</span>
                  <span class="pill">Eigenes Bad</span>
                  <span class="pill" v-if="r.room_type === 'ferienwohnung'">Eigene Küche</span>
                  <span class="pill" v-if="r.name.includes('Balkon') || r.name.includes('Appartement')">Balkon</span>
                  <span class="pill" v-if="r.name.includes('Kuhwiese')">Terrasse</span>
                  <span class="pill" v-if="r.name.includes('Aussicht')">Panoramablick</span>
                </div>

                <div class="room-footer-row" v-if="r.available">
                  <span class="select-indicator" :class="{ selected: roomId === r.id }">
                    {{ roomId === r.id ? '✓ Ausgewählt' : 'Auswählen' }}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Steps 3-5: Once Room picked -->
        <template v-if="room">
          <!-- Step 3: Extras & Voucher -->
          <div class="card">
            <h2><span class="n">3</span>Darf es noch etwas sein?</h2>
            <div class="extra" v-for="e in roomExtras" :key="e.id">
              <div class="grow">
                <b>{{ e.name }}</b> · {{ money(e.price) }} {{ e.per_unit === 'person' ? 'pro Person' : '' }}{{ e.period === 'daily' ? ' und Tag' : '' }}
                <div class="sub" style="font-size:14px;color:var(--ink-2)">{{ e.description }}</div>
              </div>
              <select v-model.number="extras[e.id]" :aria-label="e.name + ' – Anzahl'">
                <option :value="undefined">–</option>
                <option v-for="n in (e.per_unit === 'person' ? stay.adults + stay.children : 3)" :key="n" :value="n">
                  {{ n }} {{ e.per_unit === 'person' ? 'Pers.' : '×' }}
                </option>
              </select>
            </div>
            <p class="hint" v-if="extraHint">{{ extraHint }}</p>

            <!-- Voucher Section -->
            <div class="voucher-section">
              <label style="font-weight:600;margin-bottom:6px">Gutscheincode</label>
              <div v-if="!voucher" class="voucher-form">
                <input v-model="voucherInput" placeholder="z. B. SOMMER10" @keyup.enter="applyVoucher">
                <button class="btn ghost sm" :disabled="voucherBusy || !voucherInput.trim()" @click="applyVoucher">
                  {{ voucherBusy ? '…' : 'Einlösen' }}
                </button>
              </div>
              <div v-else class="voucher-active">
                <div>
                  <span class="voucher-tag">✓ {{ voucher.code }}</span>
                  <span style="margin-left:8px;font-size:14px;color:var(--green)">
                    Rabatt: {{ money(voucher.discount_amount) }}
                  </span>
                </div>
                <button class="btn ghost sm" style="border:none;color:var(--bad)" @click="removeVoucher">Entfernen</button>
              </div>
              <div class="note bad" v-if="voucherError" style="margin-top:8px">{{ voucherError }}</div>
            </div>
          </div>

          <!-- Step 4: Guest Details -->
          <div class="card">
            <h2><span class="n">4</span>Ihre Angaben</h2>
            <div class="grid">
              <label>Vorname *<input v-model="guest.first_name" autocomplete="given-name" required></label>
              <label>Nachname *<input v-model="guest.last_name" autocomplete="family-name" required></label>
              <label>E-Mail *<input type="email" v-model="guest.email" autocomplete="email" required></label>
              <label>Telefon<input type="tel" v-model="guest.phone" autocomplete="tel"></label>
              <label class="wide">Straße und Hausnummer<input v-model="guest.address" autocomplete="street-address"></label>
              <label>PLZ<input v-model="guest.postcode" autocomplete="postal-code"></label>
              <label>Ort<input v-model="guest.city" autocomplete="address-level2"></label>
              <label>Voraussichtliche Ankunftszeit<input v-model="more.arrival_time" placeholder="z. B. 16–17 Uhr"></label>
              <label class="wide">Wünsche oder Fragen<textarea v-model="more.comments"></textarea></label>
            </div>
            <div class="hp" aria-hidden="true"><label>Website<input v-model="more.website" tabindex="-1" autocomplete="off"></label></div>
          </div>

          <!-- Step 5: Summary & Payment -->
          <div class="card">
            <h2><span class="n">5</span>Zahlung & Abschluss</h2>
            
            <div class="sum">
              <span>{{ room.name }} · {{ nice(stay.arrival) }} – {{ nice(stay.departure) }} · {{ room.nights }} {{ room.nights === 1 ? 'Nacht' : 'Nächte' }}</span>
              <span>{{ money(room.total) }}</span>
              <template v-if="extrasTotal">
                <span>Ausgewählte Extras</span><span>{{ money(extrasTotal) }}</span>
              </template>
              <template v-if="voucherDiscount">
                <span class="discount">Gutschein ({{ voucher.code }})</span>
                <span class="discount">-{{ money(voucherDiscount) }}</span>
              </template>
              <span class="total">Gesamtbetrag (inkl. MwSt.)</span>
              <span class="total">{{ money(total) }}</span>
            </div>

            <h3 style="font-size:16px;margin:18px 0 10px;color:var(--green)">Zahlungsart wählen</h3>
            <div class="pay-options">
              <label class="pay-card" :class="{ active: paymentMethod === 'bank_transfer' }">
                <input type="radio" value="bank_transfer" v-model="paymentMethod">
                <div class="grow">
                  <b>Banküberweisung (Vorkasse / Anfrage)</b>
                  <p>Sie erhalten die Buchungsanfrage und Bankverbindung per E-Mail. Nach Überweisungseingang ist das Zimmer fest gebucht.</p>
                </div>
              </label>

              <label class="pay-card" :class="{ active: paymentMethod === 'paypal' }">
                <input type="radio" value="paypal" v-model="paymentMethod">
                <div class="grow">
                  <b>PayPal / Kreditkarte</b>
                  <p>Direkte und sichere Online-Zahlung. Ihre Buchung wird sofort verbindlich bestätigt.</p>
                </div>
              </label>
            </div>

            <p class="note" style="margin:14px 0">
              Check-in ab {{ config.checkin_from }} Uhr, Check-out bis {{ config.checkout_until }} Uhr.
            </p>

            <details class="note" v-if="config.cancellation_policy" style="margin-bottom:14px">
              <summary style="cursor:pointer">Stornobedingungen</summary>
              <p style="white-space:pre-wrap;margin:8px 0 0">{{ config.cancellation_policy }}</p>
            </details>

            <label class="check">
              <input type="checkbox" v-model="more.accept_terms">
              <span>Ich habe die Buchungs- und Stornobedingungen gelesen und bin einverstanden.</span>
            </label>

            <!-- Action button for Bank Transfer -->
            <div v-if="paymentMethod === 'bank_transfer'" style="margin-top:16px">
              <button class="btn" style="width:100%;font-size:17px" :disabled="busy || !more.accept_terms || !guest.first_name || !guest.last_name || !guest.email" @click="book">
                {{ busy ? 'Buchung wird verarbeitet …' : 'Zahlungspflichtig anfragen' }}
              </button>
            </div>

            <!-- Action container for PayPal -->
            <div v-else style="margin-top:16px">
              <div v-if="!more.accept_terms || !guest.first_name || !guest.last_name || !guest.email" class="note" style="margin-bottom:10px">
                Bitte füllen Sie Ihre Kontaktdaten aus und akzeptieren Sie die Bedingungen, um die PayPal-Zahlung zu starten.
              </div>
              <div id="paypal-button-container" :style="{ opacity: (!more.accept_terms || !guest.first_name || !guest.last_name || !guest.email) ? '0.4' : '1', pointerEvents: (!more.accept_terms || !guest.first_name || !guest.last_name || !guest.email) ? 'none' : 'auto' }"></div>
            </div>
          </div>
        </template>
      </main>
      <!-- Lightbox Modal -->
      <div class="lightbox-overlay" v-if="lightbox.open" @click="closeLightbox">
        <div class="lightbox-content" @click.stop>
          <button type="button" class="lightbox-close" @click="closeLightbox" aria-label="Schließen">✕</button>
          <div class="lightbox-body">
            <img :src="lightbox.room.images[lightbox.index].src"
                 :alt="lightbox.room.images[lightbox.index].caption || lightbox.room.name"
                 class="lightbox-img" />
            <button v-if="lightbox.room.images.length > 1"
                    type="button"
                    class="lightbox-arrow prev"
                    @click.stop="prevLightboxImage"
                    aria-label="Vorheriges Bild">‹</button>
            <button v-if="lightbox.room.images.length > 1"
                    type="button"
                    class="lightbox-arrow next"
                    @click.stop="nextLightboxImage"
                    aria-label="Nächstes Bild">›</button>
          </div>
          <div class="lightbox-footer">
            <div class="lightbox-info">
              <b class="lightbox-room-name">{{ lightbox.room.name }}</b>
              <span class="lightbox-caption" v-if="lightbox.room.images[lightbox.index].caption">
                · {{ lightbox.room.images[lightbox.index].caption }}
              </span>
            </div>
            <div class="lightbox-counter">{{ lightbox.index + 1 }} / {{ lightbox.room.images.length }}</div>
          </div>
        </div>
      </div>

      <footer>{{ config.property.name }} · {{ config.property.phone }} · {{ config.property.email }}</footer>
    </template>
    <main v-else-if="error"><div class="note bad">{{ error }}</div></main>
    <p v-else class="boot">Buchung wird geladen …</p>`,
}).mount('#app');
