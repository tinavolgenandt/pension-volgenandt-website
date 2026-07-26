<?php
/**
 * Invoice draft generator.
 * Called by invoice-trigger.php for qualifying bookings.
 *
 * Public API: generateInvoiceDraftIfNeeded(int $bookingId): array
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/beds24-api.php';

define('INV_DRAFTS_DIR',     __DIR__ . '/invoices/drafts');
define('INV_LOGS_DIR',       __DIR__ . '/invoices/logs');
define('INV_COUNTER_FILE',   __DIR__ . '/data/invoice-counter.json');
define('INV_PROCESSED_FILE', __DIR__ . '/data/processed-bookings.json');

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

    if (isBookingProcessed($bookingId)) {
        return ['ok' => true, 'skipped' => true, 'reason' => 'already_processed'];
    }

    $api     = new Beds24Api();
    $booking = $api->getBooking($bookingId);

    if ($booking === null) {
        draftLog($bookingId, 'error', 'Beds24 API returned null');
        return ['ok' => false, 'error' => 'Booking not found in Beds24'];
    }

    // Beds24 v2 returns status as a string ('confirmed', 'new', 'request', etc.)
    $status  = strtolower((string)($booking['status'] ?? ''));
    $balance = extractBalance($booking);

    if (!in_array($status, ['confirmed', 'new'], true)) {
        draftLog($bookingId, 'skip', "status={$status} not invoice-worthy");
        return ['ok' => true, 'skipped' => true, 'reason' => 'status_not_applicable'];
    }

    $draft = buildInvoiceDraft($booking, $webhookItems);
    $token = $draft['token'];

    if (!is_dir(INV_DRAFTS_DIR)) {
        mkdir(INV_DRAFTS_DIR, 0750, true);
    }

    $path = INV_DRAFTS_DIR . '/' . $token . '.json';
    if (file_put_contents($path, json_encode($draft, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) === false) {
        return ['ok' => false, 'error' => 'Failed to save draft JSON'];
    }

    markBookingProcessed($bookingId, $token);

    // Booking already fully paid at webhook time — nothing left for Simone to
    // check, so send the Buchungsbestätigung (+ paid invoice) straight to the
    // guest instead of waiting on manual approval.
    if ($balance <= 0.01) {
        $sendResult = autoSendPaidBookingDraft($draft, $path);
        draftLog($bookingId, 'auto_sent', "token={$token} scenario={$draft['scenario']} emailSent=" . ($sendResult['emailSent'] ? '1' : '0'));

        return [
            'ok'       => true,
            'skipped'  => false,
            'token'    => $token,
            'scenario' => $draft['scenario'],
            'autoSent' => true,
        ];
    }

    draftLog($bookingId, 'created', "token={$token} scenario={$draft['scenario']} balance={$balance}");

    // Notify Simone so she can review and approve
    require_once __DIR__ . '/invoice-mailer.php';
    $notified = notifySimone($draft);
    draftLog($bookingId, 'notify', "simone_email=" . ($notified ? 'sent' : 'failed'));

    return ['ok' => true, 'skipped' => false, 'token' => $token, 'scenario' => $draft['scenario']];
}

/**
 * Auto-approve and send a draft for a booking that was already fully paid
 * when the webhook arrived. Skips the Simone review step entirely; she gets
 * an FYI email afterwards instead of an approval request.
 */
function autoSendPaidBookingDraft(array $draft, string $draftPath): array {
    require_once __DIR__ . '/invoice-pdf.php';
    require_once __DIR__ . '/invoice-mailer.php';

    $draft['invoiceDate'] = date('Y-m-d');
    $draft['approvedAt']  = date('c');
    $draft['status']      = 'approved';
    $draft['note']        = 'Automatisch versendet – Buchung war bei Eingang bereits vollständig bezahlt.';

    $pdfBytes = generateInvoicePdf($draft);

    $sentDir = __DIR__ . '/invoices/sent';
    if (!is_dir($sentDir)) {
        mkdir($sentDir, 0750, true);
    }
    file_put_contents($sentDir . '/' . $draft['token'] . '.pdf', $pdfBytes);

    $emailSent               = sendInvoiceToGuest($draft, $pdfBytes);
    $draft['guestEmailSent'] = $emailSent;

    file_put_contents($draftPath, json_encode($draft, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    notifySimoneAutoSent($draft, $emailSent);

    return ['emailSent' => $emailSent];
}

// ---------------------------------------------------------------------------
// Draft builder
// ---------------------------------------------------------------------------

function buildInvoiceDraft(array $booking, array $webhookItems = []): array {
    $token    = makeUuid();
    $invNum   = nextInvoiceNumber();
    $scenario = detectScenario($booking);
    $guest    = parseGuest($booking);
    $stay     = parseStay($booking);
    $items    = parseLineItems($booking, $webhookItems);
    $totals   = calcTotals($items);

    return [
        'token'         => $token,
        'createdAt'     => date('c'),
        'status'        => 'pending',
        'scenario'      => $scenario,
        'bookingId'     => (int)($booking['id'] ?? 0),
        'invoiceNumber' => $invNum,
        'invoiceDate'   => null,
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
        'paymentNote'   => 'Zahlbar innerhalb von 7 Tagen nach Rechnungsstellung.',
        'note'          => '',
        'approvedAt'    => null,
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

    // No itemized invoice — fall back to room price only
    if (empty($invoiceItems)) {
        return $basePrice > 0 ? [makeLineItem('Übernachtung', $basePrice, 7)] : [];
    }

    $accommodationGross = 0.0;
    $breakfastItems     = [];

    foreach ($invoiceItems as $raw) {
        $desc  = trim($raw['description'] ?? $raw['desc'] ?? '');
        $unit  = (float)($raw['amount'] ?? $raw['unitPrice'] ?? 0);
        $qty   = (float)($raw['qty'] ?? $raw['quantity'] ?? 1);
        $gross = round($unit * $qty, 2);

        if (abs($gross) < 0.01) continue;

        // Strip price text from all descriptions — Anzahl/Einzelpreis columns already show it
        $cleaned = trim(preg_replace('/\s*[\d,.]+\s*(EUR|€)[^\n]*/u', '', $desc) ?? '');
        if ($cleaned !== '') $desc = $cleaned;

        if (isBreakfastItem($desc)) {
            $breakfastItems[] = makeLineItem($desc ?: 'Frühstück', $gross, 19, $qty, $unit);
        } else {
            $accommodationGross += $gross;
        }
    }

    $items = [];

    if ($accommodationGross > 0.01) {
        $items[] = makeLineItem('Übernachtung', $accommodationGross, 7);
    } elseif (empty($breakfastItems) && $basePrice > 0) {
        $items[] = makeLineItem('Übernachtung', $basePrice, 7);
    }

    return array_merge($items, $breakfastItems);
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
// Invoice number (atomic file-lock increment)
// ---------------------------------------------------------------------------

function nextInvoiceNumber(): string {
    $file = INV_COUNTER_FILE;
    $lock = $file . '.lock';

    for ($attempt = 0; $attempt < 10; $attempt++) {
        $fp = @fopen($lock, 'x');
        if ($fp !== false) { fclose($fp); break; }
        usleep(100_000);
    }

    try {
        $data  = json_decode(@file_get_contents($file) ?: '{}', true) ?? [];
        $year  = (int)($data['year']    ?? date('Y'));
        $count = (int)($data['counter'] ?? 0);

        if ($year !== (int)date('Y')) {
            $year  = (int)date('Y');
            $count = 0;
        }

        $count++;
        file_put_contents($file, json_encode(['year' => $year, 'counter' => $count], JSON_PRETTY_PRINT));

        return sprintf('%d-%03d', $year, $count);
    } finally {
        @unlink($lock);
    }
}

// ---------------------------------------------------------------------------
// Processed-bookings index (idempotency)
// ---------------------------------------------------------------------------

function isBookingProcessed(int $id): bool {
    return isset(loadProcessed()[(string)$id]);
}

function markBookingProcessed(int $id, string $token): void {
    $data          = loadProcessed();
    $data[(string)$id] = ['token' => $token, 'at' => date('c')];
    file_put_contents(INV_PROCESSED_FILE, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function loadProcessed(): array {
    if (!file_exists(INV_PROCESSED_FILE)) return [];
    return json_decode(@file_get_contents(INV_PROCESSED_FILE) ?: '{}', true) ?? [];
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
