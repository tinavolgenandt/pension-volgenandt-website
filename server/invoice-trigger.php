<?php
/**
 * Beds24 webhook receiver — invoice trigger.
 * Deploy to: https://api.pension-volgenandt.de/invoice-trigger.php
 *
 * Phase 0: Receives and logs all Beds24 booking webhooks.
 * Phase 1: Will generate invoice drafts for unpaid confirmed bookings.
 *
 * Beds24 webhook setup:
 *   Settings → Properties → Access → Booking webhooks
 *   URL: https://api.pension-volgenandt.de/invoice-trigger.php
 *   Custom header: X-Invoice-Secret: {value of INVOICE_WEBHOOK_SECRET in config.php}
 *   Events: New Booking, Booking Modified
 */

require_once __DIR__ . '/config.php';

$logsDir = __DIR__ . '/invoices/logs';

// ---------------------------------------------------------------------------
// Only accept POST
// ---------------------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// ---------------------------------------------------------------------------
// Validate webhook secret (when configured)
// Skip validation if secret is not yet set (Phase 0 setup)
// ---------------------------------------------------------------------------
$secret = INVOICE_WEBHOOK_SECRET;
if ($secret !== '') {
    $provided = $_SERVER['HTTP_X_INVOICE_SECRET'] ?? '';
    if (!hash_equals($secret, $provided)) {
        http_response_code(403);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
}

// ---------------------------------------------------------------------------
// Read raw payload
// ---------------------------------------------------------------------------
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

// ---------------------------------------------------------------------------
// Log everything to a daily log file (Phase 0: inspect real payloads)
// ---------------------------------------------------------------------------
if (!is_dir($logsDir)) {
    mkdir($logsDir, 0750, true);
}

$logEntry = [
    'receivedAt'  => date('c'),
    'remoteAddr'  => $_SERVER['REMOTE_ADDR'] ?? '',
    'headers'     => [
        'Content-Type'     => $_SERVER['CONTENT_TYPE'] ?? '',
        'X-Invoice-Secret' => isset($_SERVER['HTTP_X_INVOICE_SECRET']) ? '[present]' : '[missing]',
    ],
    'rawPayload'  => $raw,
    'parsedData'  => $data,
];

$logFile = $logsDir . '/webhooks-' . date('Y-m-d') . '.log';
file_put_contents($logFile, json_encode($logEntry, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n---\n", FILE_APPEND);

// ---------------------------------------------------------------------------
// Return 200 immediately so Beds24 doesn't retry
// ---------------------------------------------------------------------------
if ($data === null && $raw !== '') {
    // Received something but couldn't parse as JSON — still log + return 200
    http_response_code(200);
    echo json_encode(['ok' => true, 'note' => 'logged_raw']);
    exit;
}

// ---------------------------------------------------------------------------
// Phase 1: Generate invoice draft for qualifying bookings.
// ---------------------------------------------------------------------------

require_once __DIR__ . '/invoice-draft.php';

// Beds24 v2 webhook wraps booking data under a 'booking' key
$bookingId = (int)($data['booking']['id'] ?? $data['bookingId'] ?? $data['id'] ?? 0);

// Invoice items come from the webhook payload, not from the API
$webhookItems = $data['invoiceItems'] ?? [];

if ($bookingId > 0) {
    $result = generateInvoiceDraftIfNeeded($bookingId, $webhookItems);

    // Append draft result to the day's webhook log
    $logFile = $logsDir . '/webhooks-' . date('Y-m-d') . '.log';
    file_put_contents($logFile, 'draft_result: ' . json_encode($result) . "\n---\n", FILE_APPEND);
}

http_response_code(200);
echo json_encode(['ok' => true, 'status' => 'logged']);
