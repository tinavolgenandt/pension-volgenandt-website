# Phase 5: Booking Integration - Research

**Researched:** 2026-02-22
**Domain:** Beds24 iframe embedding, cookie consent gating, dynamic iframe resizing, booking UX
**Confidence:** HIGH

## Summary

This phase integrates the Beds24 booking engine into the Pension Volgenandt website via consent-gated iframes. The pension uses Beds24 (Owner ID 135075) with 3 separate properties configured across 7 room types. The standard approach is: embed the Beds24 `booking2.php` page inside an `<iframe>` on each room detail page, gated behind the existing `useCookieConsent` composable's `booking` category. Visitors who have not granted booking consent see a `BookingConsentPlaceholder` component (modeled on the existing `MapConsent` pattern). A `BookingBar` component provides site-wide booking access.

The key technical challenge is dynamic iframe height. Beds24 officially supports iframeResizer v4.2.10 (they host the child script at `beds24.com/include/iframeresizer/4.2.10/`). The parent page must use a compatible v4.x version. The last MIT-licensed version of iframe-resizer is v4.3.11 -- this is the version to use on the parent side. Version 5.x changed to GPL/commercial licensing (Solo: $16, Professional: $76) and uses a completely different API with separate `@iframe-resizer/parent`, `@iframe-resizer/vue`, etc. packages. Since Beds24 hosts v4.2.10 of the child script and v4.x parent is backwards compatible with older child versions, using the MIT-licensed v4.3.11 parent alongside Beds24's hosted v4.2.10 child is the correct approach.

**Primary recommendation:** Use iframe-resizer v4.3.11 (MIT, `npm install iframe-resizer@4.3.11`) for parent-side dynamic height. Gate all Beds24 iframes with `v-if="isAllowed('booking')"`. Use the existing `MapConsent` component as the architectural template for `BookingConsentPlaceholder`. Build the `BookingBar` as a layout-level component in `default.vue`.

## Standard Stack

### Core

| Library        | Version | Purpose                               | Why Standard                                                                                  |
| -------------- | ------- | ------------------------------------- | --------------------------------------------------------------------------------------------- |
| iframe-resizer | 4.3.11  | Parent-side iframe height auto-sizing | Last MIT-licensed version; Beds24 hosts compatible v4.2.10 child script; backwards compatible |

### Supporting

| Library          | Version    | Purpose                            | When to Use                                       |
| ---------------- | ---------- | ---------------------------------- | ------------------------------------------------- |
| useCookieConsent | (existing) | Consent state for booking category | Gate all Beds24 iframes; already built in Phase 1 |
| @vueuse/nuxt     | (existing) | useScrollLock, useWindowScroll     | BookingBar scroll behavior; already installed     |

### Alternatives Considered

| Instead of                   | Could Use                                   | Tradeoff                                                                                                                                                      |
| ---------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| iframe-resizer v4.3.11 (MIT) | @iframe-resizer/vue v5.x (GPLv3/commercial) | v5 has Vue SFC component but costs $16-$76 for commercial use; Beds24 child script is v4.2.10 so v5 parent would require upgrading the Beds24-side script too |
| iframe-resizer v4.3.11 (MIT) | Custom postMessage height listener          | Requires Beds24 to send height messages (it does not natively); iframeResizer child script already handles this                                               |
| iframe-resizer v4.3.11 (MIT) | Fixed iframe height (e.g., 2000px)          | Creates excess whitespace or scrollbars depending on booking step; poor UX                                                                                    |
| Embedded iframe              | New tab/window for Beds24                   | Breaks browsing experience; user leaves site; current bad UX being replaced                                                                                   |

**Installation:**

```bash
pnpm add iframe-resizer@4.3.11
```

**Note:** Pin to exactly `4.3.11` to avoid accidentally pulling v5+ which has different licensing.

## Architecture Patterns

### Recommended Component Structure

```
app/
├── components/
│   ├── booking/
│   │   ├── BookingWidget.vue          # Beds24 iframe + iframeResizer init
│   │   ├── BookingConsentPlaceholder.vue  # Shown when booking consent not granted
│   │   └── BookingBar.vue             # Sticky desktop bar / floating mobile button
│   └── ...existing components
├── composables/
│   └── useCookieConsent.ts            # (existing, no changes needed)
├── layouts/
│   └── default.vue                    # Add BookingBar here
└── pages/
    └── zimmer/
        └── [slug].vue                 # Add BookingWidget + ConsentPlaceholder here
```

### Pattern 1: Consent-Gated Iframe (BookingWidget)

**What:** The Beds24 iframe only exists in the DOM when booking consent is granted. Uses `v-if` (not `v-show`) to prevent any network requests to beds24.com before consent.

**When to use:** On every room detail page where the booking widget appears.

**Example:**

```vue
<script setup lang="ts">
// Source: Existing MapConsent pattern + Beds24 wiki
defineProps<{
  beds24PropertyId: number
  beds24RoomId?: number
  roomName: string
}>()

const { isAllowed } = useCookieConsent()
const bookingConsented = computed(() => isAllowed('booking'))
</script>

<template>
  <section>
    <BookingConsentPlaceholder v-if="!bookingConsented" :room-name="roomName" />
    <BookingWidget v-else :beds24-property-id="beds24PropertyId" :beds24-room-id="beds24RoomId" />
  </section>
</template>
```

### Pattern 2: Beds24 Iframe URL Construction

**What:** Build the Beds24 booking URL from room YAML data (beds24PropertyId, beds24RoomId).

**When to use:** Inside BookingWidget to generate the iframe `src`.

**Key insight:** Rooms in the "Pension Volgenandt" property (propid 261258) have individual `roomid` values. The two Ferienwohnungen (propid 257613 and 257610) are standalone properties with one unit each, so they use `propid` only (no `roomid` needed).

**Example:**

```typescript
// Source: Beds24 Wiki - Embedded Iframe
// https://wiki.beds24.com/index.php/Embedded_Iframe

function buildBeds24Url(propertyId: number, roomId?: number): string {
  const base = 'https://beds24.com/booking2.php'
  const params = new URLSearchParams({
    lang: 'de',
    referer: 'iFrame',
  })

  // Use roomid when available (specific room in multi-room property)
  // Fall back to propid (standalone property like Ferienwohnungen)
  if (roomId) {
    params.set('roomid', String(roomId))
  } else {
    params.set('propid', String(propertyId))
  }

  return `${base}?${params.toString()}`
}
```

**Verified Beds24 URL Parameters:**
| Parameter | Purpose | Example |
|-----------|---------|---------|
| `propid` | Filter to single property | `propid=261258` |
| `roomid` | Filter to single room | `roomid=541340` |
| `ownerid` | Show all properties for owner | `ownerid=135075` |
| `lang` | Language | `lang=de` |
| `referer` | Tracking/display hint | `referer=iFrame` |
| `numadult` | Default adult count | `numadult=2` |
| `numnight` | Default nights | `numnight=2` |
| `hideheader` | Hide booking page header | `hideheader=1` |
| `hidefooter` | Hide booking page footer | `hidefooter=1` |

**IMPORTANT URL STRUCTURE FINDING:** The `booking.php` endpoint is deprecated. Always use `booking2.php`.

### Pattern 3: iframeResizer Initialization (Parent Side)

**What:** Initialize iframeResizer on the parent page to dynamically adjust the Beds24 iframe height.

**When to use:** After the BookingWidget iframe is mounted in the DOM.

**Example:**

```vue
<script setup lang="ts">
// Source: Beds24 Wiki - Iframe Resizing
// https://wiki.beds24.com/index.php/Iframe_Resizing
import iframeResize from 'iframe-resizer/js/iframeResizer'

const iframeRef = ref<HTMLIFrameElement | null>(null)

onMounted(() => {
  if (iframeRef.value) {
    iframeResize(
      {
        checkOrigin: false, // Required for cross-origin Beds24
        scrolling: 'omit', // Let iframeResizer handle scrolling
        warningTimeout: 20000, // Beds24 can be slow to respond
      },
      iframeRef.value,
    )
  }
})

onBeforeUnmount(() => {
  if (iframeRef.value && (iframeRef.value as any).iFrameResizer) {
    ;(iframeRef.value as any).iFrameResizer.close()
  }
})
</script>

<template>
  <iframe
    ref="iframeRef"
    :src="iframeSrc"
    width="100%"
    scrolling="no"
    style="border: none; min-height: 600px;"
    title="Zimmerbuchung"
  />
</template>
```

### Pattern 4: BookingBar (Site-Wide Booking Access)

**What:** A sticky bar on desktop / floating button on mobile providing quick access to booking.

**When to use:** On every page (added to default layout).

**Example approach:**

```vue
<!-- Desktop: sticky bar at bottom with check-in picker + CTA -->
<!-- Mobile: floating action button (FAB) in bottom-right corner -->
<template>
  <!-- Desktop sticky bar (hidden on mobile) -->
  <div class="fixed inset-x-0 bottom-0 z-30 hidden md:block ...">
    <UiBaseButton to="/zimmer" variant="primary"> Verfügbarkeit prüfen </UiBaseButton>
  </div>

  <!-- Mobile FAB (hidden on desktop) -->
  <button class="fixed right-6 bottom-6 z-30 md:hidden ...">
    <Icon name="ph:calendar-check-duotone" />
  </button>
</template>
```

### Anti-Patterns to Avoid

- **Using `v-show` instead of `v-if` for consent gating:** `v-show` renders the iframe in the DOM and makes network requests even when hidden. Use `v-if` to prevent any Beds24 loading before consent.
- **Loading iframeResizer child script on parent page:** The child script (`iframeResizer.contentWindow.min.js`) must be loaded INSIDE the Beds24 booking page, not on the parent. Beds24 handles this via their admin settings.
- **Mixing iframe-resizer v4 parent with v5 child (or vice versa):** Version families are not cross-compatible. Beds24 hosts v4.2.10 child, so parent must be v4.x.
- **Using `ownerid` for per-room booking:** `ownerid=135075` shows ALL 3 properties. Use `propid` or `roomid` to filter to a specific room.
- **Hardcoding Beds24 room IDs:** Room IDs should come from the YAML data (`beds24PropertyId`, `beds24RoomId`), not be hardcoded in components.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem                        | Don't Build                 | Use Instead                          | Why                                                                                                          |
| ------------------------------ | --------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Iframe dynamic height          | Custom postMessage listener | iframe-resizer v4.3.11               | Beds24 does not natively send height messages; iframeResizer child script (hosted by Beds24) handles this    |
| Consent state management       | New consent system          | Existing useCookieConsent composable | Already built in Phase 1 with booking category; reactive `isAllowed('booking')`                              |
| Consent placeholder UI pattern | New pattern from scratch    | Clone MapConsent approach            | MapConsent already solves the same two-click consent pattern for media; booking consent follows identical UX |
| Booking URL construction       | Inline URL strings          | Utility function or computed prop    | URL params differ per room (propid vs roomid); centralizing prevents errors                                  |

**Key insight:** The consent system, the consent placeholder pattern (MapConsent), and the room YAML data with Beds24 IDs already exist. Phase 5 is primarily a composition exercise -- assembling existing pieces into booking-specific components.

## Common Pitfalls

### Pitfall 1: Third-Party Cookie Blocking Breaks Widget Data Transfer

**What goes wrong:** Modern browsers (Safari, Firefox, Brave) increasingly block third-party cookies. Beds24 historically used cookies to transfer data between the booking widget and the iframe.
**Why it happens:** The Beds24 iframe is cross-origin (beds24.com loaded inside pension-volgenandt.de). Third-party cookie blocking prevents the iframe from reading/writing cookies set by a widget on the parent page.
**How to avoid:** Pass ALL parameters via URL query string, not cookies. The Beds24 wiki documents a JavaScript solution that reads URL parameters and injects them into the iframe `data-src`. For per-room booking, the parameters are already in the URL (`propid`/`roomid`), so this is the default approach.
**Warning signs:** Widget date/guest selections not carrying over to the iframe booking page in Safari.

### Pitfall 2: iframeResizer Version Mismatch

**What goes wrong:** The iframe does not resize; stays at fixed height or shows scrollbars.
**Why it happens:** Parent page uses a different major version of iframeResizer than the child page. Beds24 hosts v4.2.10 of the child script.
**How to avoid:** Pin parent-side to `iframe-resizer@4.3.11`. Verify in Beds24 admin that the child script is loaded: `(SETTINGS) > BOOKING ENGINE > PROPERTY BOOKING PAGE > DEVELOPER > "Insert in HTML head"` should contain `<script type="text/javascript" src="include/iframeresizer/4.2.10/iframeResizer.contentWindow.min.js"></script>`.
**Warning signs:** Console warnings about "iFrame not responding" or "No response from iFrame".

### Pitfall 3: Beds24 Child Script Not Configured

**What goes wrong:** iframeResizer on parent page cannot communicate with the iframe. Height stays fixed.
**Why it happens:** The Beds24 admin has not added the iframeResizer child script to the booking page's HTML head. This is a Beds24-side configuration, not something the website code can control.
**How to avoid:** Before development, verify the child script is present in Beds24 admin for ALL 3 properties. This is a prerequisite task.
**Warning signs:** `iframeResizer` logs "iFrame has not responded within 20 seconds" warning.

### Pitfall 4: beds24RoomId Values Are Placeholders

**What goes wrong:** Booking widget shows wrong room or all rooms instead of the specific one.
**Why it happens:** The current room YAML files have `beds24RoomId` values (1-5) that were placeholder assignments from Phase 2. The actual Beds24 room IDs were discovered during research:

- Emil's Kuhwiese: propid 257613, actual roomid **541340** (YAML has no roomId, correct -- use propid only)
- Schone Aussicht: propid 257610, actual roomid **541337** (YAML has no roomId, correct -- use propid only)
- Pension Volgenandt (propid 261258): rooms have Beds24-assigned IDs that may differ from the placeholder 1-5 values
  **How to avoid:** Before implementation, retrieve actual room IDs from Beds24 admin panel or booking page source. The Ferienwohnungen (Emil's Kuhwiese and Schone Aussicht) are standalone properties -- use `propid` alone (no `roomid`). For Pension Volgenandt rooms (Balkonzimmer, Rosengarten, Wohlfuhl-Appartement), extract actual room IDs from the Beds24 booking page.
  **Warning signs:** Wrong room shown in booking widget; booking flow starts with room selection step instead of date selection.

### Pitfall 5: Hydration Mismatch from iframeResizer in SSR

**What goes wrong:** Vue hydration warnings in console; iframe behaves unpredictably on first render.
**Why it happens:** iframeResizer accesses browser APIs (window, document) that don't exist during SSR.
**How to avoid:** Wrap iframe-resizer initialization in `onMounted()` and use `<ClientOnly>` around the iframe element. Never import or initialize iframeResizer at module level.
**Warning signs:** `[Vue warn]: Hydration mismatch` in console.

### Pitfall 6: BookingBar Overlapping Cookie Consent Banner

**What goes wrong:** The fixed-position BookingBar overlaps with the fixed-position CookieConsent banner at the bottom of the screen.
**Why it happens:** Both use `fixed` positioning at the bottom; z-index conflicts.
**How to avoid:** Hide the BookingBar while the cookie consent banner is visible. Use `hasConsented` from `useCookieConsent` -- only show BookingBar when `hasConsented` is `true`. Ensure BookingBar z-index is lower than CookieConsent (consent banner is `z-50`, BookingBar should be `z-30`).
**Warning signs:** Overlapping UI at bottom of viewport on first visit.

## Code Examples

Verified patterns from official sources:

### Beds24 Iframe Embed (from Beds24 Wiki)

```html
<!-- Source: https://wiki.beds24.com/index.php/Embedded_Iframe -->
<iframe
  src="https://beds24.com/booking2.php?propid=261258&lang=de&referer=iFrame"
  width="100%"
  scrolling="no"
  style="border: none;"
>
  <p><a href="https://beds24.com/booking2.php?propid=261258&lang=de">Jetzt buchen</a></p>
</iframe>
```

### iframeResizer Parent Init (from Beds24 Wiki + iframe-resizer docs)

```javascript
// Source: https://wiki.beds24.com/index.php/Iframe_Resizing
// Parent page: import and call after iframe loads
import iframeResize from 'iframe-resizer/js/iframeResizer'

// After iframe is in DOM:
iframeResize({ checkOrigin: false }, '#booking-iframe')
```

### Consent-Gated Iframe (from existing MapConsent pattern)

```vue
<!-- Source: app/components/attractions/MapConsent.vue (existing project code) -->
<script setup lang="ts">
const { isAllowed } = useCookieConsent()
const bookingConsented = computed(() => isAllowed('booking'))
</script>

<template>
  <div>
    <!-- Placeholder until consent -->
    <div v-if="!bookingConsented" class="...">
      <p>Zum Laden des Buchungswidgets wird eine Verbindung zu beds24.com hergestellt.</p>
      <button @click="grantBookingConsent">Buchungswidget laden</button>
    </div>

    <!-- Actual iframe after consent -->
    <ClientOnly v-if="bookingConsented">
      <iframe :src="bookingUrl" ... />
    </ClientOnly>
  </div>
</template>
```

### Complete Room-to-Beds24 Property Mapping

```yaml
# Verified from Beds24 booking pages (February 2026)
# Ferienwohnungen are standalone properties (use propid only):
emils-kuhwiese:      beds24PropertyId: 257613  # No beds24RoomId needed
schoene-aussicht:    beds24PropertyId: 257610  # No beds24RoomId needed

# Pension rooms are within a single property (use propid + roomid):
wohlfuehl-appartement: beds24PropertyId: 261258, beds24RoomId: TBD (placeholder: 1)
balkonzimmer:          beds24PropertyId: 261258, beds24RoomId: TBD (placeholder: 2)
rosengarten:           beds24PropertyId: 261258, beds24RoomId: TBD (placeholder: 3)
doppelzimmer:          beds24PropertyId: 261258, beds24RoomId: TBD (placeholder: 4)
einzelzimmer:          beds24PropertyId: 261258, beds24RoomId: TBD (placeholder: 5)
```

## State of the Art

| Old Approach                      | Current Approach                     | When Changed              | Impact                                                                                        |
| --------------------------------- | ------------------------------------ | ------------------------- | --------------------------------------------------------------------------------------------- |
| `booking.php` endpoint            | `booking2.php` endpoint              | Legacy/current            | `booking.php` is deprecated; always use `booking2.php`                                        |
| iframe-resizer v4 (MIT)           | iframe-resizer v5 (GPLv3/commercial) | June 2024                 | v5 has new API, Vue SFC, but costs $16-$76 for commercial; Beds24 still ships v4 child script |
| Cookie-based widget data transfer | URL parameter data transfer          | Ongoing (browser changes) | Third-party cookie blocking makes cookie-based approach unreliable; use URL params            |
| External booking link (new tab)   | Embedded iframe on-site              | Best practice             | Keeps users on site, better conversion                                                        |

**Deprecated/outdated:**

- `booking.php`: Use `booking2.php` instead (Beds24 responsive booking page)
- iframe-resizer v4.4.0+: License changed from MIT to GPLv3; use v4.3.11 as last MIT version
- Cookie-based widget-to-iframe data passing: Blocked by modern browsers; use URL query parameters

## Room-Specific Booking Strategy

The 7 rooms map to Beds24 differently based on property structure:

### Ferienwohnungen (Standalone Properties)

These are separate Beds24 properties with one unit each. The booking iframe uses `propid` alone:

| Room                          | YAML slug        | Beds24 propid | Booking URL                          |
| ----------------------------- | ---------------- | ------------- | ------------------------------------ |
| Ferienwohnung Emil's Kuhwiese | emils-kuhwiese   | 257613        | `booking2.php?propid=257613&lang=de` |
| Ferienwohnung Schone Aussicht | schoene-aussicht | 257610        | `booking2.php?propid=257610&lang=de` |

### Pension Rooms (Multi-Room Property)

These are rooms within the Pension Volgenandt property (propid 261258). The booking iframe should use `roomid` to pre-filter:

| Room                 | YAML slug             | Beds24 propid | Beds24 roomid | Booking URL                       |
| -------------------- | --------------------- | ------------- | ------------- | --------------------------------- |
| Wohlfuhl-Appartement | wohlfuehl-appartement | 261258        | TBD\*         | `booking2.php?roomid=TBD&lang=de` |
| Balkonzimmer         | balkonzimmer          | 261258        | TBD\*         | `booking2.php?roomid=TBD&lang=de` |
| Rosengarten          | rosengarten           | 261258        | TBD\*         | `booking2.php?roomid=TBD&lang=de` |
| Doppelzimmer         | doppelzimmer          | 261258        | TBD\*         | `booking2.php?roomid=TBD&lang=de` |
| Einzelzimmer         | einzelzimmer          | 261258        | TBD\*         | `booking2.php?roomid=TBD&lang=de` |

\*TBD: Current YAML values (1-5) are placeholders. Actual Beds24 room IDs must be confirmed from the Beds24 admin panel before implementation. The research confirmed that room IDs are system-assigned (e.g., Emil's Kuhwiese roomid is 541340, not 1).

### Fallback Strategy for Unresolved Room IDs

If actual room IDs cannot be confirmed before development:

- Use `propid=261258` for all Pension rooms (shows all 3 rooms with selection)
- This is worse UX (user must select room again) but functionally works
- Update to `roomid=X` when actual IDs are confirmed

## Beds24 Upsell Items (BOOK-06)

**Current state:** Breakfast, dog fee, and BBQ set are listed as extras in the room YAML data and displayed on the website, but are NOT configured as bookable upsell items in Beds24.

**Required Beds24 admin configuration (not website code):**
| Extra | Price | Configuration Location |
|-------|-------|----------------------|
| Fruhstuck (Standard) | EUR 10 / person / night | SETTINGS > PROPERTIES > UPSELL ITEMS |
| Geniesser-Fruhstuck | EUR 15 / person / night | SETTINGS > PROPERTIES > UPSELL ITEMS |
| Hund | EUR 10 / night | SETTINGS > PROPERTIES > UPSELL ITEMS |
| BBQ-Set | EUR 10 / use | SETTINGS > PROPERTIES > UPSELL ITEMS |

**Important:** This is a Beds24 admin task, not a website development task. The website already displays these extras on room pages. The BOOK-06 requirement is about making them selectable during the Beds24 booking flow. This should be done for all 3 Beds24 properties.

## BookingBar Design Considerations

### Desktop Behavior

- Sticky bar at bottom of viewport
- Contains: check-in date hint text, CTA button "Verfugbarkeit prufen"
- Links to the room overview page (`/zimmer/`) or opens a booking modal
- Hidden when cookie consent banner is visible (`v-if="hasConsented"`)
- z-index: 30 (below consent banner at 50, below header at 40)

### Mobile Behavior

- Floating action button (FAB) in bottom-right corner
- Calendar icon with tooltip/label
- Same consent-awareness as desktop
- Must not overlap with scroll-to-top or other floating elements

### On Room Detail Pages

- BookingBar could scroll directly to the embedded booking widget section
- Or provide a "Jetzt buchen" button that smooth-scrolls to the widget

## iframeResizer Setup Requirements

### Parent Page (Website) -- Developer Responsibility

1. Install `iframe-resizer@4.3.11`
2. Import `iframeResizer` in the BookingWidget component
3. Call `iframeResize()` in `onMounted()` targeting the booking iframe
4. Clean up in `onBeforeUnmount()`
5. Wrap iframe in `<ClientOnly>` to prevent SSR issues

### Child Page (Beds24) -- Owner/Admin Responsibility

1. Log into Beds24 control panel
2. For EACH of the 3 properties, navigate to: SETTINGS > BOOKING ENGINE > PROPERTY BOOKING PAGE > DEVELOPER
3. In "Insert in HTML head", add:
   ```html
   <script
     type="text/javascript"
     src="include/iframeresizer/4.2.10/iframeResizer.contentWindow.min.js"
   ></script>
   ```
4. Save for each property

**This is a prerequisite that MUST be done before the iframeResizer integration can be tested.** The website code alone is insufficient -- without the child script on Beds24's side, dynamic resizing will not work.

## Open Questions

Things that couldn't be fully resolved:

1. **Actual Beds24 room IDs for Pension Volgenandt rooms**
   - What we know: Emil's Kuhwiese has roomid 541340, Schone Aussicht has roomid 541337. Pension Volgenandt (propid 261258) has 3 rooms (Balkonzimmer, Rosengarten, Wohlfuhl-Appartement) with system-assigned room IDs.
   - What's unclear: The actual roomid values for the 3 rooms within propid 261258. YAML placeholder values (1-5) are NOT the real Beds24 room IDs.
   - Recommendation: Check Beds24 admin panel or extract from booking page source HTML. Fallback: use `propid=261258` (shows all rooms) until IDs are confirmed.

2. **Doppelzimmer and Einzelzimmer bookability**
   - What we know: The booking system assessment noted these rooms are "Not in booking system". The website has room pages for them with beds24PropertyId 261258 and beds24RoomId placeholders (4 and 5).
   - What's unclear: Whether the owner has since added these rooms to Beds24, or if they remain offline-only.
   - Recommendation: For rooms not in Beds24, show a "Telefonisch buchen" CTA with the phone number instead of the booking widget. Build the component to handle missing/null beds24RoomId gracefully.

3. **iframeResizer child script on Beds24 side**
   - What we know: Beds24 supports it and documents how to add it.
   - What's unclear: Whether the pension owner has already configured this in Beds24 admin.
   - Recommendation: Add as a prerequisite task. If not configured, the iframe will work but won't auto-resize (fallback to generous min-height + overflow:auto).

4. **Beds24 booking page display parameters**
   - What we know: `hideheader`, `hidefooter`, `numdisplayed` parameters exist.
   - What's unclear: Exactly which elements should be hidden when embedded (header is redundant when inside the pension website).
   - Recommendation: Test with `hideheader=1&hidefooter=1` for cleaner embedded appearance. If it hides essential navigation within the booking flow, remove these params.

## Sources

### Primary (HIGH confidence)

- [Beds24 Embedded Iframe Wiki](https://wiki.beds24.com/index.php/Embedded_Iframe) -- iframe code structure, URL parameters, data-src pattern
- [Beds24 Iframe Resizing Wiki](https://wiki.beds24.com/index.php/Iframe_Resizing) -- iframeResizer v4.2.10 setup, parent/child configuration
- [Beds24 Make Your Own Widget](https://wiki.beds24.com/index.php/Make_Your_Own_Booking_Widget) -- custom widget HTML/form approach, URL parameters
- [Beds24 Responsive Booking Page](https://wiki.beds24.com/index.php/Responsive_Booking_Page) -- booking2.php URL structure, layout parameter
- [iframe-resizer v4 npm](https://www.npmjs.com/package/iframe-resizer) -- v4.3.11 last MIT version, v5+ is GPL
- [iframe-resizer Vue SFC](https://iframe-resizer.com/frameworks/vue3/) -- v5 Vue component (reference only; not using v5)
- [iframe-resizer pricing](https://iframe-resizer.com/pricing/) -- Solo $16, Professional $76, Business $486; GPLv3 for open source
- [Existing project code: MapConsent.vue](app/components/attractions/MapConsent.vue) -- consent placeholder pattern
- [Existing project code: useCookieConsent.ts](app/composables/useCookieConsent.ts) -- booking consent category
- [Existing project code: CookieSettings.vue](app/components/CookieSettings.vue) -- draft state pattern for consent

### Secondary (MEDIUM confidence)

- [Beds24 Booking Widget Wiki](https://wiki.beds24.com/index.php/Booking_Widget_opening_Booking_Page_on_Your_Own_Website) -- widget-to-iframe data passing, cookie limitations
- [Beds24 Privacy Policy](https://beds24.com/privacypolicy.html) -- GDPR compliance, cookie usage
- [iframe-resizer license issue #1265](https://github.com/davidjbradshaw/iframe-resizer/issues/1265) -- MIT to GPL change history
- [Beds24 booking page (live, propid 261258)](https://beds24.com/booking2.php?propid=261258&lang=de) -- verified room names, structure

### Tertiary (LOW confidence)

- [Rezonant MIT fork of iframe-resizer](https://github.com/rezonant/iframe-resizer) -- alternative MIT source (unmaintained, single commit July 2024)

### Verified Live Beds24 Pages

- `https://beds24.com/booking2.php?ownerid=135075&lang=de` -- All 3 properties shown, valid
- `https://beds24.com/booking2.php?propid=261258&lang=de` -- Pension Volgenandt: Balkonzimmer, Rosengarten, Wohlfuhl-Appartement
- `https://beds24.com/booking2.php?propid=257613&lang=de` -- Emil's Kuhwiese: single unit, roomid 541340
- `https://beds24.com/booking2.php?propid=257610&lang=de` -- Schone Aussicht: single unit, roomid 541337

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- iframe-resizer v4.3.11 verified as last MIT version; Beds24 iframe embedding well-documented; consent system already built
- Architecture: HIGH -- all patterns verified against existing project code (MapConsent, useCookieConsent) and Beds24 wiki documentation
- Pitfalls: HIGH -- third-party cookie issues, version mismatches, and room ID placeholders all documented with concrete prevention strategies

**Research date:** 2026-02-22
**Valid until:** 2026-03-22 (30 days -- Beds24 documentation is stable; iframe-resizer v4 is frozen)
