<?php
/**
 * Read-only voucher eligibility check for the picnic booking form.
 * Deploy to: https://api.pension-volgenandt.de/voucher-validate.php
 *
 * POST { code, email } -> { valid, discountPercent, reason }
 *
 * This does NOT consume the voucher — actual redemption happens atomically
 * in picknick-booking.php once payment is confirmed, to avoid burning a
 * one-time code on a booking that's never completed.
 */

require_once __DIR__ . '/smtp.php'; // also loads config.php + setCorsHeaders()
require_once __DIR__ . '/vouchers.php';
require_once __DIR__ . '/security.php';

setCorsHeaders($allowedOrigins);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// The code is one shared word: without a limit it could be guessed by script.
enforceRateLimit('voucher-validate', 20, 3600);

$input = json_decode(file_get_contents('php://input', false, null, 0, 8192), true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request body']);
    exit;
}

$code  = limitText($input['code'] ?? '', 64);
$email = limitText($input['email'] ?? '', 254);

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['valid' => false, 'discountPercent' => 0, 'reason' => 'Bitte zuerst eine gültige E-Mail-Adresse eingeben.']);
    exit;
}

echo json_encode(validateVoucher($code, $email));
