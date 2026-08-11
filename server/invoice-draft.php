<?php
/**
 * Invoice draft generator.
 * Called by invoice-trigger.php for qualifying bookings.
 *
 * Public API: generateInvoiceDraftIfNeeded(int $bookingId): array
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/beds24-api.php';

define('INV_DRAFTS_DIR',   __DIR__ . '/invoices/drafts');
define('INV_LOGS_DIR',     __DIR__ . '/invoices/logs');
define('INV_COUNTER_FILE', __DIR__ . '/data/invoice-counter.json');

// Issuer data — required on every invoice by German law
define('INV_ISSUER_NAME',   'Zimmervermietung Ralf Volgenandt');
define('INV_ISSUER_STREET', 'Otto-Reuter-Str. 28');
define('INV_ISSUER_CITY',   '37327 Leinefelde-Worbis');
define('INV_ISSUER_TAX_ID', '157/299/10837');

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

/**
 * Main entry point called from invoice-trigger.php.
 *
 * Returns:
 *   ['ok' => true,  'skipped' => true,  'reason' => string]      — no draft needed
 *   ['ok' => true,  'skipped' => false, 'token' => string, ...]  — draft created
 *   ['ok' => false, 'error' => string]                            — failure
 */
function generateInvoiceDraftIfNeeded(int $bookingId, array $webhookItems = []): array {
    if ($bookingId <= 0) {
        return ['ok' => false, 'error' => 'Invalid booking ID'];
    }

    $api     = new Beds24Api();
    $booking = $api->getBooking($bookingId);

    if ($booking === null) {
        draftLog($bookingId, 'error', 'Beds24 API returned null');
        return ['ok' => false, 'error' => 'Booking not found in Beds24'];
    }

    // Gruppenbuchung (e.g. a family/company booking several rooms together):
    // Beds24 links sibling room bookings via `masterId`. Querying `masterId`
    // with a booking's own ID returns that booking plus every sibling whose
    // `masterId` points to it — a standalone booking (no group) just comes
    // back alone. Confirmed 2026-08-03 against a real 5-room group booking.
    // The master's own ID is used as the drafts-lookup key for the whole
    // group (`bookingId` on the draft), so the existing pending/approved/
    // Nachtrag diff logic below works unchanged — it only ever cared about
    // "what's already invoiced under this key", never about single-booking
    // semantics specifically.
    $groupMasterId = (int)($booking['masterId'] ?? $booking['id']);
    $groupBookings = $api->getBookingsByMasterId($groupMasterId);
    if (empty($groupBookings)) {
        $groupBookings = [$booking]; // defensive fallback if the group fetch fails
    }
    $isGroup = count($groupBookings) > 1;

    $masterBooking = $booking;
    foreach ($groupBookings as $b) {
        if ((int)($b['id'] ?? 0) === $groupMasterId) { $masterBooking = $b; break; }
    }

    // Booking.com is the merchant of record for these guests — the pension
    // never charges them directly, so a German Rechnung showing the gross
    // (pre-commission) amount would be wrong. `channel` is Beds24's stable
    // machine code ('booking'); `apiSource` ("Booking.com") is checked too
    // in case a future webhook payload ever lacks `channel`. Checked on the
    // master — group bookings are created together and not expected to mix
    // channels.
    $channel   = strtolower((string)($masterBooking['channel']   ?? ''));
    $apiSource = strtolower((string)($masterBooking['apiSource'] ?? ''));
    if ($channel === 'booking' || str_contains($apiSource, 'booking.com')) {
        draftLog($groupMasterId, 'skip', "booking_com_ota channel={$channel} apiSource={$apiSource}");
        return ['ok' => true, 'skipped' => true, 'reason' => 'booking_com_ota'];
    }

    // Beds24 v2 returns status as a string ('confirmed', 'new', 'request', etc.)
    $status = strtolower((string)($masterBooking['status'] ?? ''));
    if (!in_array($status, ['confirmed', 'new'], true)) {
        draftLog($groupMasterId, 'skip', "status={$status} not invoice-worthy");
        return ['ok' => true, 'skipped' => true, 'reason' => 'status_not_applicable'];
    }

    $repBooking = $isGroup ? buildGroupRepresentativeBooking($groupBookings, $groupMasterId) : $booking;

    $items = [];
    foreach ($groupBookings as $b) {
        $memberWebhookItems = ((int)($b['id'] ?? 0) === $bookingId) ? $webhookItems : [];
        $items = array_merge($items, parseLineItems($b, $memberWebhookItems));
    }

    // Firmenrechnung auto-detection: Fero Fensterbau/Barczewski were set up
    // 2026-08-03 as dedicated Beds24 Offerten (see FIRMENRECHNUNG_OFFERS in
    // config.php), so a booking made with one of those rates carries a
    // matching `offerId` — no manual checkbox needed. Checked across every
    // group member (not just the master) in case a future company books
    // more than one room.
    $companyName = null;
    foreach ($groupBookings as $b) {
        $offerId = (int)($b['offerId'] ?? 0);
        $offers  = defined('FIRMENRECHNUNG_OFFERS') ? FIRMENRECHNUNG_OFFERS : [];
        if (isset($offers[$offerId])) { $companyName = $offers[$offerId]; break; }
    }
    $firmenExtra = $companyName !== null
        ? ['isFirmenrechnung' => true, 'companyName' => $companyName, 'ohneFruehstueck' => true]
        : [];

    $existing = findDraftsForBooking($groupMasterId);
    $pending  = array_values(array_filter($existing, fn(array $d) => ($d['status'] ?? '') === 'pending'));
    // 'ready' = number assigned + PDF generated on the review page, but not
    // yet sent to the guest (see invoice-review.php's pending→ready→approved
    // flow). Treated as "already invoiced" here, same as 'approved' — a
    // webhook firing while a draft sits in 'ready' must diff against its
    // charges (Nachtrag for genuinely new items) rather than spawning a
    // second full-stay draft, since the number/PDF are already fixed and
    // can't be silently refreshed like a true 'pending' draft can.
    $approved = array_values(array_filter($existing, fn(array $d) => in_array($d['status'] ?? '', ['ready', 'approved'], true)));

    // A draft is already awaiting Simone's review — don't spawn a second one
    // just because Beds24 re-fired the webhook. Refresh it in place if the
    // numbers actually moved (e.g. she corrected something in Beds24 before
    // getting to the review), otherwise there's nothing to do.
    if (!empty($pending)) {
        $groupBookingIds = $isGroup ? array_map(fn(array $b) => (int)($b['id'] ?? 0), $groupBookings) : [];
        return refreshPendingDraft($pending[0], $repBooking, $items, $groupBookingIds, $firmenExtra);
    }

    // Already invoiced and approved at least once — only a genuinely new
    // charge (extras added on-site after the stay was already settled)
    // justifies a follow-up Nachtragsrechnung. Diff against everything
    // already invoiced so the follow-up contains just the delta, not the
    // whole stay again.
    if (!empty($approved)) {
        $newItems = diffLineItems($items, $approved);
        if (empty($newItems)) {
            draftLog($groupMasterId, 'skip', 'no_new_charges_since_approval');
            return ['ok' => true, 'skipped' => true, 'reason' => 'no_new_charges'];
        }
        $relatesTo = array_values(array_filter(array_map(fn(array $d) => $d['invoiceNumber'] ?? null, $approved)));
        $note = 'Nachtragsrechnung für zusätzliche Positionen'
            . (!empty($relatesTo) ? ' zu Rechnung ' . implode(', ', $relatesTo) : '') . '.';
        return persistNewDraft($repBooking, $newItems, 'C', array_merge([
            'relatesTo'       => $relatesTo,
            'note'            => $note,
            'groupBookingIds' => $isGroup ? array_map(fn(array $b) => (int)($b['id'] ?? 0), $groupBookings) : [],
        ], $firmenExtra));
    }

    // No prior drafts at all (first time, or every previous draft was
    // rejected) — start fresh with the full stay.
    return persistNewDraft($repBooking, $items, detectScenario($masterBooking), array_merge([
        'groupBookingIds' => $isGroup ? array_map(fn(array $b) => (int)($b['id'] ?? 0), $groupBookings) : [],
    ], $firmenExtra));
}

/**
 * Merge a Gruppenbuchung's sibling room bookings into one synthetic
 * "booking" that parseGuest()/parseStay()/buildInvoiceDraft() can consume
 * unchanged — one combined Rechnung instead of one per room. Guest fields
 * prefer the master's value, falling back to the first sibling that has it
 * (the master doesn't always carry the fullest contact details, e.g. a
 * sibling's mobile number where the master's is blank — confirmed against a
 * real group booking 2026-08-03). Room name becomes the joined list of every
 * distinct room in the group. `balance` is pre-summed across all members so
 * `extractBalance()` (which checks `balance` before falling back to
 * price−deposit) picks it up without needing its own group-aware branch.
 */
function buildGroupRepresentativeBooking(array $groupBookings, int $groupMasterId): array {
    $master = $groupBookings[0];
    foreach ($groupBookings as $b) {
        if ((int)($b['id'] ?? 0) === $groupMasterId) { $master = $b; break; }
    }

    $merged = $master;
    $guestFields = ['firstName', 'first_name', 'lastName', 'last_name', 'email', 'guestEmail',
        'phone', 'mobile', 'address', 'street', 'zip', 'postcode', 'city', 'country'];
    foreach ($guestFields as $field) {
        if (!empty($merged[$field])) continue;
        foreach ($groupBookings as $b) {
            if (!empty($b[$field])) { $merged[$field] = $b[$field]; break; }
        }
    }

    $roomNames = [];
    foreach ($groupBookings as $b) {
        $name = resolveRoomName($b);
        if (!in_array($name, $roomNames, true)) $roomNames[] = $name;
    }
    // resolveRoomName() looks up BEDS24_ROOM_NAMES[roomId] before falling
    // back to the roomName string below — clearing roomId here is required,
    // otherwise parseStay() would silently show only the master's single
    // room instead of the joined list of every room in the group.
    $merged['roomName'] = implode(', ', $roomNames);
    $merged['roomId']   = null;
    $merged['id']       = $groupMasterId;
    $merged['balance']  = extractGroupBalance($groupBookings);

    return $merged;
}

function extractGroupBalance(array $groupBookings): float {
    $total = 0.0;
    foreach ($groupBookings as $b) {
        $total += extractBalance($b);
    }
    return round($total, 2);
}

/**
 * Build, save, and notify for a brand-new draft (full stay, or the delta-only
 * Nachtrag for extras added after a prior approval).
 */
function persistNewDraft(array $booking, array $items, string $scenario, array $extra = []): array {
    $bookingId = (int)($booking['id'] ?? 0);
    $balance   = extractBalance($booking);

    $draft = buildInvoiceDraft($booking, $items, $scenario, $extra);
    $draft['prePaid'] = $balance <= 0.01;
    $token = $draft['token'];

    if (!is_dir(INV_DRAFTS_DIR)) {
        mkdir(INV_DRAFTS_DIR, 0750, true);
    }

    $path = INV_DRAFTS_DIR . '/' . $token . '.json';
    if (file_put_contents($path, json_encode($draft, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) === false) {
        return ['ok' => false, 'error' => 'Failed to save draft JSON'];
    }

    draftLog($bookingId, 'created', "token={$token} scenario={$scenario} balance={$balance} prePaid=" . ($draft['prePaid'] ? '1' : '0'));

    // Notify Simone so she can review and approve — always, even when the
    // booking is already fully paid at webhook time. A wrong Rechnungsnummer
    // is exactly the kind of mistake a payment-only check would miss, so
    // nothing ever reaches a guest without her clicking Genehmigen.
    require_once __DIR__ . '/invoice-mailer.php';
    $notified = notifySimone($draft);
    draftLog($bookingId, 'notify', "simone_email=" . ($notified ? 'sent' : 'failed'));

    return ['ok' => true, 'skipped' => false, 'token' => $token, 'scenario' => $scenario];
}

/**
 * A draft is still sitting in Simone's inbox, unreviewed — update it in place
 * instead of creating a second one. No-op (and no re-notify) if nothing about
 * the charges actually changed, since Beds24 can re-fire the same webhook
 * event more than once.
 */
function refreshPendingDraft(array $draft, array $booking, array $items, array $groupBookingIds = [], array $firmenExtra = []): array {
    $bookingId = (int)($draft['bookingId'] ?? $booking['id'] ?? 0);
    $token     = $draft['token'] ?? '';

    // Metadata that doesn't need a re-notify (group membership, Firmenrechnung
    // auto-detection) is applied even when the line items themselves are
    // unchanged — e.g. Simone selects the Fero Fensterbau rate for a booking
    // that already has a pending draft without changing anything else about
    // the charges. Persisted silently either way.
    if (!empty($groupBookingIds)) $draft['groupBookingIds'] = $groupBookingIds;
    foreach ($firmenExtra as $key => $value) $draft[$key] = $value;

    if (itemSetsEqual($items, $draft['lineItems'] ?? [])) {
        $path = INV_DRAFTS_DIR . '/' . $token . '.json';
        file_put_contents($path, json_encode($draft, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        draftLog($bookingId, 'skip', "pending_draft_unchanged token={$token}");
        return ['ok' => true, 'skipped' => true, 'reason' => 'pending_draft_unchanged'];
    }

    $balance = extractBalance($booking);
    $draft['guest']     = parseGuest($booking);
    $draft['stay']      = parseStay($booking);
    $draft['lineItems'] = $items;
    $draft['totals']    = calcTotals($items);
    $draft['prePaid']   = $balance <= 0.01;

    $path = INV_DRAFTS_DIR . '/' . $token . '.json';
    file_put_contents($path, json_encode($draft, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    draftLog($bookingId, 'updated', "pending_draft_refreshed token={$token} balance={$balance}");

    require_once __DIR__ . '/invoice-mailer.php';
    $notified = notifySimone($draft, true);
    draftLog($bookingId, 'notify', "simone_email_refresh=" . ($notified ? 'sent' : 'failed'));

    return ['ok' => true, 'skipped' => false, 'token' => $token, 'scenario' => $draft['scenario'] ?? 'B', 'refreshed' => true];
}

// ---------------------------------------------------------------------------
// Draft builder
// ---------------------------------------------------------------------------

function buildInvoiceDraft(array $booking, array $items, string $scenario, array $extra = []): array {
    $token  = makeUuid();
    $guest  = parseGuest($booking);
    $stay   = parseStay($booking);
    $totals = calcTotals($items);

    return [
        'token'         => $token,
        'createdAt'     => date('c'),
        'status'        => 'pending',
        'scenario'      => $scenario,
        'bookingId'     => (int)($booking['id'] ?? 0),
        // Assigned only when Simone approves (see tryAssignInvoiceNumber) —
        // never at draft creation, so a rejected draft never burns a number.
        'invoiceNumber' => null,
        'invoiceDate'   => null,
        // Invoice number(s) this draft supplements — set only for scenario
        // 'C' (Nachtragsrechnung for extras added after a prior approval).
        'relatesTo'     => $extra['relatesTo'] ?? [],
        // Beds24 booking IDs of every room in this Gruppenbuchung (empty for
        // a standalone booking) — 'bookingId' above is the group's masterId,
        // used as the drafts-lookup key for the whole group.
        'groupBookingIds' => $extra['groupBookingIds'] ?? [],
        'guest'         => $guest,
        'stay'          => $stay,
        'issuer'        => [
            'name'     => INV_ISSUER_NAME,
            'street'   => INV_ISSUER_STREET,
            'city'     => INV_ISSUER_CITY,
            'taxId'    => INV_ISSUER_TAX_ID,
            'bankName' => BANK_NAME,
            'iban'     => BANK_IBAN,
            'bic'      => BANK_BIC,
        ],
        'lineItems'     => $items,
        'totals'        => $totals,
        // Firmenrechnungen (auto-detected below) get the 3-Werktage note right
        // away instead of the generic 7-day text — otherwise the draft/preview
        // shows the wrong term until Simone explicitly re-saves the form.
        'paymentNote'   => !empty($extra['isFirmenrechnung'])
            ? firmenPaymentNote()
            : 'Zahlbar innerhalb von 7 Tagen nach Rechnungsstellung.',
        'note'          => $extra['note'] ?? '',
        'approvedAt'    => null,
        // Firmenrechnung (e.g. Fero Fensterbau, Barczewski) — auto-detected
        // from the booking's `offerId` (see FIRMENRECHNUNG_OFFERS in
        // config.php) when the booking used one of their dedicated Beds24
        // rates; still editable/overridable by Simone on the review page
        // (e.g. a company booking made without selecting the rate by
        // mistake, or vice versa). Drives the shorter payment term
        // (3 Werktage, see computeDueDate()) and the "ohne Frühstück" note.
        'isFirmenrechnung'  => $extra['isFirmenrechnung'] ?? false,
        'companyName'       => $extra['companyName'] ?? '',
        'bookingReference'  => $extra['bookingReference'] ?? '',
        'ohneFruehstueck'   => $extra['ohneFruehstueck'] ?? false,
    ];
}

/**
 * Scenario A = new booking (created within 2h of webhook). Scenario B = modification.
 * Beds24 v2 uses 'bookingTime' as the creation timestamp.
 */
function detectScenario(array $booking): string {
    $raw = $booking['bookingTime'] ?? $booking['createdAt'] ?? $booking['created'] ?? null;
    if ($raw && (time() - strtotime((string)$raw)) < 7200) {
        return 'A';
    }
    return 'B';
}

function parseGuest(array $b): array {
    $first = trim($b['firstName'] ?? $b['first_name'] ?? '');
    $last  = trim($b['lastName']  ?? $b['last_name']  ?? '');

    return [
        'name'    => trim("$first $last") ?: 'Unbekannt',
        'email'   => $b['email']   ?? $b['guestEmail'] ?? '',
        'phone'   => $b['phone']   ?? $b['mobile']     ?? '',
        'address' => $b['address'] ?? $b['street']     ?? '',
        'zip'     => $b['zip']     ?? $b['postcode']   ?? '',
        'city'    => $b['city']    ?? '',
        'country' => $b['country'] ?? 'DE',
    ];
}

function parseStay(array $b): array {
    $in  = $b['arrival']   ?? $b['checkIn']  ?? $b['arrivalDate']   ?? '';
    $out = $b['departure'] ?? $b['checkOut'] ?? $b['departureDate'] ?? '';

    $nights = 0;
    if ($in && $out) {
        $nights = (int)(new \DateTime($in))->diff(new \DateTime($out))->days;
    }

    return [
        'checkIn'  => $in,
        'checkOut' => $out,
        'nights'   => $nights,
        'adults'   => (int)($b['numAdult']  ?? $b['adults']   ?? 1),
        'children' => (int)($b['numChild']  ?? $b['children'] ?? 0),
        // Beds24 v2 returns roomId, not roomName — resolve via config map
        'roomName' => resolveRoomName($b),
        'roomId'   => $b['roomId'] ?? null,
    ];
}

/**
 * Build line items with correct 7%/19% MwSt split.
 * Accommodation → 7%, Breakfast/extras → 19%.
 */
function parseLineItems(array $booking, array $webhookItems = []): array {
    $invoiceItems = $booking['invoice']['items'] ?? $booking['invoiceItems'] ?? $webhookItems;
    $basePrice    = (float)($booking['price'] ?? $booking['totalPrice'] ?? 0);

    // Always name the specific room on the accommodation line — a booking never
    // covers more than one room, but guests/companies often book several rooms
    // together, and each room gets its own invoice. Without the room name those
    // invoices are indistinguishable ("Übernachtung" on all of them).
    $roomLabel = 'Übernachtung – ' . resolveRoomName($booking);

    // Accommodation is billed per night — qty/unit price here (not just the
    // summed gross) is what makeLineItem() shows in the "Anzahl"/"Einzelpreis"
    // columns, previously always defaulted to qty=1/unit=total because neither
    // was passed at all.
    $in  = $booking['arrival']   ?? $booking['checkIn']  ?? $booking['arrivalDate']   ?? '';
    $out = $booking['departure'] ?? $booking['checkOut'] ?? $booking['departureDate'] ?? '';
    $nights = ($in && $out) ? (int)(new \DateTime($in))->diff(new \DateTime($out))->days : 0;
    $nights = max(1, $nights);

    // No itemized invoice — fall back to room price only
    if (empty($invoiceItems)) {
        return $basePrice > 0 ? [makeLineItem($roomLabel, $basePrice, 7, $nights, round($basePrice / $nights, 2))] : [];
    }

    $accommodationGross = 0.0;
    $accommodationCount = 0;
    $breakfastItems     = [];
    $extraItems         = [];

    foreach ($invoiceItems as $raw) {
        // Beds24 v2 invoice items carry a `type` of 'charge' or 'payment' (a
        // payment echoes the charged amount as its own entry, with a negative
        // lineTotal). Only charges belong on the invoice — a payment record
        // was previously being read as an extra accommodation-shaped line
        // (its description is blank, which isAccommodationItem() treats as
        // the native rate line), silently doubling the shown total. Found
        // 2026-08-03 while sampling real bookings for the Gruppenrechnung
        // work; `type` is absent on some raw webhook payloads, so only skip
        // when it's explicitly present and not 'charge'.
        if (isset($raw['type']) && $raw['type'] !== 'charge') continue;

        $desc  = trim($raw['description'] ?? $raw['desc'] ?? '');
        $unit  = (float)($raw['amount'] ?? $raw['unitPrice'] ?? 0);
        $qty   = (float)($raw['qty'] ?? $raw['quantity'] ?? 1);
        $gross = round($unit * $qty, 2);

        if (abs($gross) < 0.01) continue;

        // Strip price text from all descriptions — Anzahl/Einzelpreis columns already show it
        $cleaned = trim(preg_replace('/\s*[\d,.]+\s*(EUR|€)[^\n]*/u', '', $desc) ?? '');
        if ($cleaned !== '') $desc = $cleaned;

        if (isBreakfastItem($desc)) {
            $breakfastItems = array_merge($breakfastItems, splitBreakfastItem($qty, $unit));
        } elseif (isAccommodationItem($desc)) {
            $accommodationGross += $gross;
            $accommodationCount++;
        } else {
            // A genuinely separate service (Minibar, verlängerter Check-out,
            // Parkplatz, ...) added in Beds24 — its own line, not swallowed
            // into the accommodation total. Also what lets a later
            // Nachtragsrechnung (extras added on-site after checkout) isolate
            // exactly this charge instead of re-billing the whole stay.
            $extraItems[] = makeLineItem($desc, $gross, 19, $qty, $unit);
        }
    }

    $items = [];

    if ($accommodationGross > 0.01) {
        // Always one line, always room-named — but if Beds24 sent more than
        // one accommodation-type charge (e.g. a misconfigured Auto Action
        // duplicating the native rate line), don't silently trust the summed
        // total: flag it visibly so Simone checks Beds24 before approving,
        // same "don't guess, make it visible" pattern as the unknown-
        // breakfast-price case below.
        $label = $accommodationCount > 1
            ? $roomLabel . " ({$accommodationCount} Posten summiert – bitte Betrag in Beds24 prüfen!)"
            : $roomLabel;
        $items[] = makeLineItem($label, $accommodationGross, 7, $nights, round($accommodationGross / $nights, 2));
    } elseif (empty($breakfastItems) && empty($extraItems) && $basePrice > 0) {
        $items[] = makeLineItem($roomLabel, $basePrice, 7, $nights, round($basePrice / $nights, 2));
    }

    return array_merge($items, $breakfastItems, $extraItems);
}

/**
 * True for items that represent the room rate itself — Beds24's native rate
 * line has no description, and the one known misconfiguration that ever
 * duplicated it (see [[beds24-auto-preis-duplicate-accommodation]]) labeled
 * its extra line "Übernachtung". Everything else (Minibar, Parkplatz, ...) is
 * a genuinely separate service and must not be summed into the room total.
 *
 * The API also frequently returns the room-charge line with its Beds24 merge
 * tags unresolved — literally "[ROOMNAME1] [FIRSTNIGHT] - [LEAVINGDAY]" —
 * rather than real text. Confirmed 2026-08-03 by sampling ~80 real bookings:
 * this exact placeholder is consistently the accommodation line (never
 * breakfast/Hund/other extras, which always come through with resolved
 * text), so without this check it was previously falling through to the
 * generic 19%-VAT "extra" branch — wrong tax rate, and a guest-visible
 * invoice showing raw template syntax instead of the room name.
 */
function isAccommodationItem(string $desc): bool {
    if ($desc === '') return true;
    $lower = mb_strtolower($desc);
    return str_contains($lower, 'übernachtung')
        || str_contains($lower, 'ubernachtung')
        || str_contains($lower, 'unterkunft')
        || str_contains($lower, 'overnight')
        || str_contains($lower, 'accommodation')
        || str_contains($lower, '[roomname');
}

function resolveRoomName(array $b): string {
    $id  = (int)($b['roomId'] ?? 0);
    $map = defined('BEDS24_ROOM_NAMES') ? BEDS24_ROOM_NAMES : [];
    return $map[$id] ?? $b['roomName'] ?? $b['unitName'] ?? $b['rateDescription'] ?? 'Zimmer';
}

function isBreakfastItem(string $desc): bool {
    $lower = mb_strtolower($desc);
    return str_contains($lower, 'frühstück')
        || str_contains($lower, 'breakfast')
        || str_contains($lower, 'fruehstueck');
}

/**
 * Split a per-person breakfast charge into the legally required Speisen
 * (7%) / Getränke (19%) line items. Beds24 only ever sends one combined
 * "Frühstück" amount, so the split is reconstructed by matching the
 * per-person price against BREAKFAST_TIERS (server/config.php) — a fixed
 * absolute Speisen/Getränke split per tier, not a percentage ratio, since
 * that's how the two breakfast products (normal/Genießer) are actually priced.
 */
function splitBreakfastItem(float $qty, float $unitGross): array {
    $tiers = defined('BREAKFAST_TIERS') ? BREAKFAST_TIERS : [];

    foreach ($tiers as $tier) {
        if (abs($unitGross - (float)$tier['price']) < 0.05) {
            return [
                makeLineItem('Frühstück – Speisen',  $tier['food']  * $qty, 7,  $qty, $tier['food']),
                makeLineItem('Frühstück – Getränke', $tier['drink'] * $qty, 19, $qty, $tier['drink']),
            ];
        }
    }

    // Unknown price — don't guess a split. One clearly-flagged line so it
    // can't be silently approved wrong; Simone can fix it in the editable
    // review form.
    return [
        makeLineItem('Frühstück (Preis unbekannt – bitte Aufteilung prüfen!)', $unitGross * $qty, 19, $qty, $unitGross),
    ];
}

function makeLineItem(string $desc, float $gross, int $vatRate, float $qty = 1.0, float $unitGross = 0.0): array {
    $divisor = 1 + $vatRate / 100;
    $net     = round($gross / $divisor, 2);
    $vat     = round($gross - $net, 2);

    return [
        'description' => $desc,
        'qty'         => max(1.0, round($qty, 2)),
        'unitGross'   => round($unitGross > 0 ? $unitGross : $gross, 2),
        'grossAmount' => round($gross, 2),
        'vatRate'     => $vatRate,
        'netAmount'   => $net,
        'vatAmount'   => $vat,
    ];
}

/**
 * Gauss's Easter algorithm — deliberately not using PHP's easter_date(),
 * which requires the optional `calendar` extension that may not be enabled
 * on shared hosting (would fatal-error in production if missing).
 */
function easterSunday(int $year): \DateTime {
    $a = $year % 19;
    $b = intdiv($year, 100);
    $c = $year % 100;
    $d = intdiv($b, 4);
    $e = $b % 4;
    $f = intdiv($b + 8, 25);
    $g = intdiv($b - $f + 1, 3);
    $h = (19 * $a + $b - $d - $g + 15) % 30;
    $i = intdiv($c, 4);
    $k = $c % 4;
    $l = (32 + 2 * $e + 2 * $i - $h - $k) % 7;
    $m = intdiv($a + 11 * $h + 22 * $l, 451);
    $month = intdiv($h + $l - 7 * $m + 114, 31);
    $day   = (($h + $l - 7 * $m + 114) % 31) + 1;
    return new \DateTime(sprintf('%04d-%02d-%02d', $year, $month, $day));
}

/**
 * Thuringia public holidays for a given year (fixed dates + Easter-derived).
 * Used to compute the Firmenrechnung due date ("3 Werktage, sonst nächster
 * Werktag" — Simone's rule, confirmed 2026-08-03).
 */
function germanPublicHolidays(int $year): array {
    $easter = easterSunday($year);

    $holidays = [
        sprintf('%d-01-01', $year), // Neujahr
        (clone $easter)->modify('-2 days')->format('Y-m-d'), // Karfreitag
        (clone $easter)->modify('+1 day')->format('Y-m-d'),  // Ostermontag
        sprintf('%d-05-01', $year), // Tag der Arbeit
        (clone $easter)->modify('+39 days')->format('Y-m-d'), // Christi Himmelfahrt
        (clone $easter)->modify('+50 days')->format('Y-m-d'), // Pfingstmontag
        sprintf('%d-09-20', $year), // Weltkindertag (Thüringen)
        sprintf('%d-10-03', $year), // Tag der Deutschen Einheit
        sprintf('%d-10-31', $year), // Reformationstag (Thüringen)
        sprintf('%d-12-25', $year), // 1. Weihnachtstag
        sprintf('%d-12-26', $year), // 2. Weihnachtstag
    ];

    return array_flip($holidays); // keyed by date string for O(1) lookup
}

function isBusinessDay(\DateTime $d, array &$holidaysByYear): bool {
    $weekday = (int)$d->format('N'); // 6=Sa, 7=So
    if ($weekday >= 6) return false;
    $year = (int)$d->format('Y');
    $holidays = $holidaysByYear[$year] ??= germanPublicHolidays($year);
    return !isset($holidays[$d->format('Y-m-d')]);
}

/**
 * "3 Werktage nach Rechnungsstellung, sonst der nächste Werktag" — add the
 * fixed number of calendar days, then roll forward to the next business day
 * if that lands on a weekend/holiday. Not the same as "3 business days
 * forward" (which would skip weekends during the count) — this matches
 * Simone's actual wording.
 */
function computeDueDate(\DateTime $invoiceDate, int $days): \DateTime {
    $due = (clone $invoiceDate)->modify("+{$days} days");
    $holidaysByYear = [];
    while (!isBusinessDay($due, $holidaysByYear)) {
        $due->modify('+1 day');
    }
    return $due;
}

/**
 * Firmenrechnung payment-term text — "3 Werktage, sonst nächster Werktag"
 * (Simone's rule, see computeDueDate()), computed from today's date. Used
 * both at draft creation (when a company rate auto-detects Firmenrechnung)
 * and whenever the review-page draft is re-saved with the checkbox on, so
 * the shown term never drifts back to the generic 7-day text. The real,
 * authoritative computation (from the actual invoiceDate) still happens
 * again at final approval.
 */
function firmenPaymentNote(): string {
    $due = computeDueDate(new \DateTime(date('Y-m-d')), 3);
    return 'Zahlbar bis zum ' . $due->format('d.m.Y') . '.';
}

function calcTotals(array $items): array {
    $g7 = $n7 = $v7 = $g19 = $n19 = $v19 = 0.0;

    foreach ($items as $i) {
        if ((int)$i['vatRate'] === 7) {
            $g7  += $i['grossAmount']; $n7  += $i['netAmount']; $v7  += $i['vatAmount'];
        } else {
            $g19 += $i['grossAmount']; $n19 += $i['netAmount']; $v19 += $i['vatAmount'];
        }
    }

    return [
        'gross7'  => round($g7,  2), 'net7'  => round($n7,  2), 'vat7'  => round($v7,  2),
        'gross19' => round($g19, 2), 'net19' => round($n19, 2), 'vat19' => round($v19, 2),
        'total'   => round($g7 + $g19, 2),
    ];
}

function extractBalance(array $booking): float {
    // Beds24 v2 /bookings never populates invoice.balance or balance for this
    // account — only price (total) and deposit (paid to date) are reliable.
    if (isset($booking['invoice']['balance'])) {
        return (float)$booking['invoice']['balance'];
    }
    if (isset($booking['balance'])) {
        return (float)$booking['balance'];
    }
    $price   = (float)($booking['price']   ?? 0);
    $deposit = (float)($booking['deposit'] ?? 0);
    return round($price - $deposit, 2);
}

// ---------------------------------------------------------------------------
// Invoice number — assigned at approval time, not draft creation, so a
// rejected/discarded draft never burns a number and numbers stay in the
// order invoices are actually issued.
// ---------------------------------------------------------------------------

/**
 * Read-only look at what the next invoice number would currently be. Used
 * to prefill the editable Rechnungsnummer field on the review page — this is
 * only a suggestion, nothing is reserved until tryAssignInvoiceNumber().
 */
function peekNextInvoiceNumber(): string {
    $data  = json_decode(@file_get_contents(INV_COUNTER_FILE) ?: '{}', true) ?? [];
    $year  = (int)($data['year'] ?? date('Y'));
    $count = (int)($data['counter'] ?? 0);

    if ($year !== (int)date('Y')) {
        $count = 0;
    }

    return sprintf('%d-%03d', (int)date('Y'), $count + 1);
}

/**
 * Does any other draft already carry this invoice number?
 */
function isInvoiceNumberUsed(string $num, string $excludeToken): bool {
    foreach (glob(INV_DRAFTS_DIR . '/*.json') ?: [] as $file) {
        if (basename($file, '.json') === $excludeToken) continue;
        $data = json_decode(@file_get_contents($file) ?: '', true);
        if (($data['invoiceNumber'] ?? null) === $num) {
            return true;
        }
    }
    return false;
}

/**
 * Atomically validate, reserve, and persist a specific invoice number onto
 * a draft. The whole check-and-write happens while holding the counter
 * lock, so two concurrent approvals can never end up with the same number.
 * Returns false (draft left untouched) if the number is malformed or
 * already used by another draft — callers must not proceed on false.
 */
function tryAssignInvoiceNumber(array &$draft, string $requestedNumber, string $draftPath): bool {
    if (!preg_match('/^(\d{4})-(\d{3,})$/', $requestedNumber, $m)) {
        return false;
    }
    $year  = (int)$m[1];
    $count = (int)$m[2];

    $lock = INV_COUNTER_FILE . '.lock';
    if (!acquireCounterLock($lock)) {
        throw new \RuntimeException('Could not acquire invoice-counter lock');
    }

    try {
        if (isInvoiceNumberUsed($requestedNumber, $draft['token'])) {
            return false;
        }

        $data         = json_decode(@file_get_contents(INV_COUNTER_FILE) ?: '{}', true) ?? [];
        $currentYear  = (int)($data['year']    ?? $year);
        $currentCount = (int)($data['counter'] ?? 0);

        if ($currentYear !== $year || $count > $currentCount) {
            file_put_contents(INV_COUNTER_FILE, json_encode(['year' => $year, 'counter' => $count], JSON_PRETTY_PRINT));
        }

        $draft['invoiceNumber'] = $requestedNumber;
        file_put_contents($draftPath, json_encode($draft, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        return true;
    } finally {
        @unlink($lock);
    }
}

/**
 * Acquire the invoice-counter lock, recovering from a stale lock file left
 * behind by a crashed request (anything older than 10s is treated as
 * orphaned). Returns false if the lock could not be acquired — callers must
 * treat that as a hard failure and never proceed without it, since that is
 * exactly how two invoices could end up with the same number.
 */
function acquireCounterLock(string $lock): bool {
    if (file_exists($lock) && (time() - (int)@filemtime($lock)) > 10) {
        @unlink($lock);
    }

    for ($attempt = 0; $attempt < 20; $attempt++) {
        $fp = @fopen($lock, 'x');
        if ($fp !== false) {
            fclose($fp);
            return true;
        }
        usleep(100_000);
    }
    return false;
}

// ---------------------------------------------------------------------------
// Draft lookup and diffing — the drafts directory is the single source of
// truth for "what has already been invoiced for this booking", replacing the
// old one-shot processed-bookings flag that could never produce a second
// draft (see [[automated-invoicing-project-status]] TODO).
// ---------------------------------------------------------------------------

/**
 * All drafts (any status) for a booking, oldest first.
 */
function findDraftsForBooking(int $bookingId): array {
    $drafts = [];
    foreach (glob(INV_DRAFTS_DIR . '/*.json') ?: [] as $file) {
        $data = json_decode(@file_get_contents($file) ?: '', true);
        if (is_array($data) && (int)($data['bookingId'] ?? 0) === $bookingId) {
            $drafts[] = $data;
        }
    }
    usort($drafts, fn(array $a, array $b) => strcmp($a['createdAt'] ?? '', $b['createdAt'] ?? ''));
    return $drafts;
}

function lineItemKey(array $item): string {
    return ($item['description'] ?? '') . '|'
        . number_format((float)($item['grossAmount'] ?? 0), 2, '.', '') . '|'
        . (int)($item['vatRate'] ?? 0);
}

/**
 * Multiset diff: items in $currentItems with no matching (description,
 * grossAmount, vatRate) counterpart across all $priorDrafts' lineItems.
 * Beds24 invoice items only ever get appended to, never rewritten in place,
 * so this reliably isolates genuinely new charges (e.g. extras added
 * on-site) from the stay's original items.
 */
function diffLineItems(array $currentItems, array $priorDrafts): array {
    $priorCounts = [];
    foreach ($priorDrafts as $draft) {
        foreach (($draft['lineItems'] ?? []) as $item) {
            $key = lineItemKey($item);
            $priorCounts[$key] = ($priorCounts[$key] ?? 0) + 1;
        }
    }

    $newItems = [];
    foreach ($currentItems as $item) {
        $key = lineItemKey($item);
        if (($priorCounts[$key] ?? 0) > 0) {
            $priorCounts[$key]--;
            continue;
        }
        $newItems[] = $item;
    }
    return $newItems;
}

function itemSetsEqual(array $a, array $b): bool {
    return count($a) === count($b) && empty(diffLineItems($a, [['lineItems' => $b]]));
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeUuid(): string {
    $b    = random_bytes(16);
    $b[6] = chr((ord($b[6]) & 0x0f) | 0x40);
    $b[8] = chr((ord($b[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($b), 4));
}

function draftLog(int $bookingId, string $action, string $detail): void {
    if (!is_dir(INV_LOGS_DIR)) mkdir(INV_LOGS_DIR, 0750, true);
    $entry = date('c') . " [{$action}] booking={$bookingId} {$detail}\n";
    file_put_contents(INV_LOGS_DIR . '/drafts-' . date('Y-m-d') . '.log', $entry, FILE_APPEND);
}
