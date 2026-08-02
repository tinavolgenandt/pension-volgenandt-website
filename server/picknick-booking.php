<?php
/**
 * Picknick booking handler for Pension Volgenandt.
 * Deploy to: https://api.pension-volgenandt.de/picknick-booking.php
 *
 * Flow:
 *  1. Guest pays via PayPal on the website and submits the booking form.
 *  2. This script verifies the PayPal payment.
 *  3. Stores booking data with a unique token in server/bookings/.
 *  4. Sends guest a "Anfrage erhalten" receipt email.
 *  5. Sends admin (Simone) an email with full details + Accept/Decline buttons.
 *  6. Admin clicks a link → picknick-confirm.php sends the guest confirmation.
 */

require_once __DIR__ . '/smtp.php'; // also loads config.php
require_once __DIR__ . '/vouchers.php';

// ---------------------------------------------------------------------------
// Config (credentials come from config.php via smtp.php)
// ---------------------------------------------------------------------------
$paypalApiBase = PAYPAL_SANDBOX
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

$adminEmail  = ADMIN_EMAIL;
$confirmBase = 'https://api.pension-volgenandt.de/picknick-confirm.php';
$bookingsDir = __DIR__ . '/bookings';

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Parse + validate input
// ---------------------------------------------------------------------------
$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request body']);
    exit;
}

$paypalOrderId = trim($input['paypalOrderId'] ?? '');
$amount        = floatval($input['amount'] ?? 0);
$name          = trim($input['name'] ?? '');
$email         = trim($input['email'] ?? '');
$phone         = trim($input['phone'] ?? '');
$message       = trim($input['message'] ?? '');
$subject       = trim($input['_subject'] ?? '');
$bookingDate   = trim($input['bookingDate'] ?? '');
$bookingTime   = trim($input['bookingTime'] ?? '');
$voucherCode   = trim($input['voucherCode'] ?? '');
$gotcha        = trim($input['_gotcha'] ?? '');

if ($gotcha !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

$errors = [];
if ($paypalOrderId === '') $errors[] = ['field' => 'paypalOrderId', 'message' => 'PayPal Order-ID fehlt.'];
if ($name === '') $errors[] = ['field' => 'name', 'message' => 'Name fehlt.'];
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = ['field' => 'email', 'message' => 'Ungültige E-Mail-Adresse.'];
if ($message === '') $errors[] = ['field' => 'message', 'message' => 'Buchungsdetails fehlen.'];
// Minimum reflects the cheapest possible booking (1 adult, base package ≈ €19)
if ($amount < 10.0) $errors[] = ['field' => 'amount', 'message' => 'Ungültiger Betrag.'];
// Sanity ceiling: max 4 persons × highest package + extras ≈ €200
if ($amount > 250.0) $errors[] = ['field' => 'amount', 'message' => 'Betrag liegt außerhalb des gültigen Bereichs.'];

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['errors' => $errors]);
    exit;
}

// ---------------------------------------------------------------------------
// PayPal: OAuth token
// ---------------------------------------------------------------------------
function paypalRequest(string $url, string $method, ?string $body, array $headers): array {
    $opts = [
        'http' => [
            'method'        => $method,
            'header'        => implode("\r\n", $headers),
            'content'       => $body ?? '',
            'timeout'       => 15,
            'ignore_errors' => true,
        ],
        'ssl'  => ['verify_peer' => true, 'verify_peer_name' => true],
    ];
    $context  = stream_context_create($opts);
    $response = @file_get_contents($url, false, $context);
    if ($response === false) return ['ok' => false, 'error' => 'PayPal API request failed'];
    return ['ok' => true, 'data' => json_decode($response, true)];
}

$authHeader  = 'Authorization: Basic ' . base64_encode(PAYPAL_CLIENT_ID . ':' . PAYPAL_SECRET);
$tokenResult = paypalRequest(
    "$paypalApiBase/v1/oauth2/token", 'POST',
    'grant_type=client_credentials',
    [$authHeader, 'Content-Type: application/x-www-form-urlencoded']
);
if (!$tokenResult['ok'] || empty($tokenResult['data']['access_token'])) {
    http_response_code(500);
    echo json_encode(['error' => 'PayPal-Authentifizierung fehlgeschlagen.']);
    exit;
}
$accessToken = $tokenResult['data']['access_token'];

// ---------------------------------------------------------------------------
// PayPal: Verify order
// ---------------------------------------------------------------------------
$orderResult = paypalRequest(
    "$paypalApiBase/v2/checkout/orders/$paypalOrderId", 'GET', null,
    ["Authorization: Bearer $accessToken", 'Content-Type: application/json']
);
if (!$orderResult['ok'] || empty($orderResult['data'])) {
    http_response_code(500);
    echo json_encode(['error' => 'PayPal-Bestellprüfung fehlgeschlagen.']);
    exit;
}
$order = $orderResult['data'];
if (($order['status'] ?? '') !== 'COMPLETED') {
    http_response_code(400);
    echo json_encode(['error' => 'Zahlung nicht abgeschlossen. Status: ' . ($order['status'] ?? 'unbekannt')]);
    exit;
}
$paidAmount   = floatval($order['purchase_units'][0]['amount']['value'] ?? 0);
$paidCurrency = $order['purchase_units'][0]['amount']['currency_code'] ?? '';
if ($paidCurrency !== 'EUR') {
    http_response_code(400);
    echo json_encode(['error' => 'Ungültige Währung: ' . $paidCurrency]);
    exit;
}
if (abs($paidAmount - $amount) > 0.01) {
    http_response_code(400);
    echo json_encode(['error' => "Betrag stimmt nicht überein. Erwartet: $amount €, Bezahlt: $paidAmount €"]);
    exit;
}
$transactionId = $order['purchase_units'][0]['payments']['captures'][0]['id'] ?? $paypalOrderId;

// ---------------------------------------------------------------------------
// Store booking with unique token
// ---------------------------------------------------------------------------
if (!is_dir($bookingsDir)) {
    mkdir($bookingsDir, 0750, true);
}

$token = bin2hex(random_bytes(16));

// ---------------------------------------------------------------------------
// Redeem voucher (if provided) — payment is already captured at this point,
// so a stale/invalid code does NOT block the booking; it's flagged for the
// admin to check manually instead.
// ---------------------------------------------------------------------------
$voucherApplied = false;
$voucherIssue   = '';
if ($voucherCode !== '') {
    $redeemResult = redeemVoucher($voucherCode, $email, $token);
    $voucherApplied = $redeemResult['valid'];
    if (!$voucherApplied) {
        $voucherIssue = $redeemResult['reason'];
    }
}

$booking = [
    'token'           => $token,
    'createdAt'       => date('c'),
    'status'          => 'pending',
    'name'            => $name,
    'email'           => $email,
    'phone'           => $phone,
    'message'         => $message,
    'subject'         => $subject,
    'bookingDate'     => $bookingDate,
    'bookingTime'     => $bookingTime,
    'amount'          => $paidAmount,
    'transactionId'   => $transactionId,
    'paypalOrderId'   => $paypalOrderId,
    'voucherCode'     => $voucherCode !== '' ? $voucherCode : null,
    'voucherApplied'  => $voucherCode !== '' ? $voucherApplied : null,
    'voucherIssue'    => $voucherIssue !== '' ? $voucherIssue : null,
];
file_put_contents("$bookingsDir/$token.json", json_encode($booking, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// ---------------------------------------------------------------------------
// Log to CSV
// ---------------------------------------------------------------------------
$logFile = __DIR__ . '/inquiry-log.csv';
$fp = @fopen($logFile, 'a');
if ($fp) {
    if (filesize($logFile) === 0) {
        fputcsv($fp, ['timestamp', 'token', 'name', 'email', 'type', 'amount']);
    }
    fputcsv($fp, [date('Y-m-d H:i:s'), $token, $name, $email, $subject ?: 'Picknick-Buchung', $paidAmount]);
    fclose($fp);
}

// ---------------------------------------------------------------------------
// Update blocked dates
// ---------------------------------------------------------------------------
if ($bookingDate !== '') {
    $blockedFile = __DIR__ . '/blocked-dates.json';
    $blockedData = file_exists($blockedFile) ? json_decode(file_get_contents($blockedFile), true) : [];
    $blockedData[$bookingDate] = ($blockedData[$bookingDate] ?? 0) + 1;
    file_put_contents($blockedFile, json_encode($blockedData, JSON_PRETTY_PRINT));
}

// ---------------------------------------------------------------------------
// Email 1: Guest receipt ("Anfrage erhalten")
// ---------------------------------------------------------------------------
$amountFormatted = number_format($paidAmount, 2, ',', '.') . '&nbsp;&euro;';
$messageHtml     = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));

$guestReceiptHtml = '<!DOCTYPE html>
<html lang="de"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#333;background:#f7f5f0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;padding:24px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;max-width:600px;">
  <tr><td style="background:#3d5a3e;padding:28px 32px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Pension Volgenandt</h1>
    <p style="margin:6px 0 0;color:#c8d8c0;font-size:13px;">Ruhe finden im Eichsfeld</p>
  </td></tr>
  <tr><td style="padding:32px;">
    <p style="margin:0 0 18px;font-size:15px;line-height:1.6;">Liebe/r ' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . ',</p>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.6;">herzlichen Dank f&uuml;r Ihre Picknick-Anfrage &ndash; und daf&uuml;r, dass Sie uns Ihr Vertrauen schenken! Ihre Zahlung ist sicher bei uns eingegangen.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef9ee;border-radius:6px;margin:0 0 24px;">
      <tr><td style="padding:16px;">
        <p style="margin:0 0 6px;font-size:13px;color:#b8860b;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Bitte kurz warten</p>
        <p style="margin:0;font-size:14px;line-height:1.6;">Wir pr&uuml;fen gerade die Verf&uuml;gbarkeit f&uuml;r Ihren Wunschtermin und melden uns <strong>innerhalb von 24&nbsp;Stunden</strong> mit einer Buchungsbest&auml;tigung bei Ihnen.</p>
      </td></tr>
    </table>
    <h2 style="margin:0 0 12px;font-size:16px;color:#3d5a3e;border-bottom:2px solid #e8e4dc;padding-bottom:8px;">Ihre Anfrage</h2>
    <div style="font-size:14px;line-height:1.8;margin:0 0 20px;color:#444;">' . $messageHtml . '</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 24px;">
      <tr style="border-top:2px solid #3d5a3e;">
        <td style="padding:10px 0;font-weight:700;">Bezahlt per PayPal</td>
        <td style="padding:10px 0;text-align:right;font-weight:700;color:#b8860b;font-size:16px;">' . $amountFormatted . '</td>
      </tr>
      <tr>
        <td style="padding:3px 0;font-size:11px;color:#bbb;">Transaktions-ID</td>
        <td style="padding:3px 0;text-align:right;font-size:11px;color:#bbb;">' . htmlspecialchars($transactionId, ENT_QUOTES, 'UTF-8') . '</td>
      </tr>
    </table>
    <p style="margin:0 0 6px;font-size:14px;line-height:1.6;">Bei Fragen k&ouml;nnen Sie uns jederzeit erreichen:</p>
    <p style="margin:0 0 24px;font-size:14px;line-height:1.8;">
      &#128222; <a href="tel:+4916097719112" style="color:#3d5a3e;font-weight:600;text-decoration:none;">0160 97719112</a><br>
      &#9993; <a href="mailto:kontakt@pension-volgenandt.de" style="color:#3d5a3e;font-weight:600;text-decoration:none;">kontakt@pension-volgenandt.de</a>
    </p>
    <p style="margin:0;font-size:15px;line-height:1.7;">Herzliche Gr&uuml;&szlig;e,<br>
    <strong>Simone &amp; Ralf Volgenandt</strong><br>
    <span style="font-size:13px;color:#888;">Pension Volgenandt &middot; Breitenbach</span></p>
  </td></tr>
  <tr><td style="background:#f0ede6;padding:16px 32px;text-align:center;font-size:12px;color:#999;line-height:1.6;">
    Pension Volgenandt &middot; Otto-Reuter-Stra&szlig;e 28 &middot; 37327 Leinefelde-Worbis OT Breitenbach<br>
    <a href="https://www.pension-volgenandt.de" style="color:#888;">www.pension-volgenandt.de</a>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>';

sendSmtp(
    $smtpHost, $smtpPort, $smtpUser, $smtpPass,
    $adminEmail,          // from
    $email,               // to (guest)
    'Ihre Picknick-Anfrage bei Pension Volgenandt',
    $guestReceiptHtml,
    'Simone & Ralf Volgenandt', $adminEmail,
    '', true
);

// ---------------------------------------------------------------------------
// Email 2: Admin notification with Accept / Decline buttons
// ---------------------------------------------------------------------------
$acceptUrl  = $confirmBase . '?token=' . urlencode($token) . '&action=accept';
$declineUrl = $confirmBase . '?token=' . urlencode($token) . '&action=decline';

$voucherWarningHtml = '';
if ($voucherCode !== '' && !$voucherApplied) {
    $voucherWarningHtml = '
  <tr><td style="padding:0 32px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdecea;border-radius:6px;">
      <tr><td style="padding:14px 16px;font-size:13px;line-height:1.6;color:#c0392b;">
        &#9888;&#65039; <strong>Gutschein-Code &bdquo;' . htmlspecialchars($voucherCode, ENT_QUOTES, 'UTF-8') . '&ldquo; konnte nicht best&auml;tigt werden:</strong><br>
        ' . htmlspecialchars($voucherIssue, ENT_QUOTES, 'UTF-8') . '<br>
        Bitte bezahlten Betrag vor Best&auml;tigung manuell pr&uuml;fen.
      </td></tr>
    </table>
  </td></tr>';
}

$adminHtml = '<!DOCTYPE html>
<html lang="de"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#333;background:#f7f5f0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;padding:24px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;max-width:600px;">
  <tr><td style="background:#3d5a3e;padding:24px 32px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">&#127826; Neue Picknick-Anfrage</h1>
    <p style="margin:4px 0 0;color:#c8d8c0;font-size:13px;">Bitte bestätigen oder ablehnen</p>
  </td></tr>
  <tr><td style="padding:28px 32px 0;">
    <h2 style="margin:0 0 12px;font-size:16px;color:#3d5a3e;border-bottom:2px solid #e8e4dc;padding-bottom:8px;">Gast &amp; Kontakt</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin:0 0 24px;border-collapse:collapse;">
      <tr>
        <td style="padding:6px 0;color:#666;width:35%;">Name</td>
        <td style="padding:6px 0;font-weight:700;">' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '</td>
      </tr>
      <tr style="border-top:1px solid #f0ede6;">
        <td style="padding:6px 0;color:#666;">E-Mail</td>
        <td style="padding:6px 0;"><a href="mailto:' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '" style="color:#3d5a3e;">' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '</a></td>
      </tr>
      <tr style="border-top:1px solid #f0ede6;">
        <td style="padding:6px 0;color:#666;">Telefon</td>
        <td style="padding:6px 0;"><a href="tel:' . htmlspecialchars($phone, ENT_QUOTES, 'UTF-8') . '" style="color:#3d5a3e;">' . htmlspecialchars($phone, ENT_QUOTES, 'UTF-8') . '</a></td>
      </tr>
      <tr style="border-top:2px solid #3d5a3e;">
        <td style="padding:10px 0;font-weight:700;">Bezahlt</td>
        <td style="padding:10px 0;font-weight:700;color:#b8860b;font-size:16px;">' . $amountFormatted . '</td>
      </tr>
      <tr>
        <td style="padding:3px 0;font-size:11px;color:#bbb;">PayPal Txn</td>
        <td style="padding:3px 0;font-size:11px;color:#bbb;">' . htmlspecialchars($transactionId, ENT_QUOTES, 'UTF-8') . '</td>
      </tr>
    </table>
    <h2 style="margin:0 0 12px;font-size:16px;color:#3d5a3e;border-bottom:2px solid #e8e4dc;padding-bottom:8px;">Buchungsdetails</h2>
    <div style="font-size:14px;line-height:1.8;margin:0 0 28px;color:#444;background:#f7f5f0;padding:16px;border-radius:6px;">' . $messageHtml . '</div>
  </td></tr>
' . $voucherWarningHtml . '
  <!-- Accept / Decline buttons -->
  <tr><td style="padding:0 32px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="width:48%;padding-right:8px;">
          <a href="' . htmlspecialchars($acceptUrl, ENT_QUOTES, 'UTF-8') . '"
             style="display:block;background:#3d5a3e;color:#fff;text-decoration:none;
                    text-align:center;padding:16px 12px;border-radius:8px;
                    font-size:17px;font-weight:700;letter-spacing:0.3px;">
            &#9989; Bestätigen
          </a>
        </td>
        <td style="width:48%;padding-left:8px;">
          <a href="' . htmlspecialchars($declineUrl, ENT_QUOTES, 'UTF-8') . '"
             style="display:block;background:#c0392b;color:#fff;text-decoration:none;
                    text-align:center;padding:16px 12px;border-radius:8px;
                    font-size:17px;font-weight:700;letter-spacing:0.3px;">
            &#10060; Ablehnen
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:14px 0 0;font-size:12px;color:#aaa;text-align:center;">
      Diese Links sind einmalig verwendbar. Nach dem Klick wird automatisch eine E-Mail an den Gast gesendet.
    </p>
  </td></tr>

  <tr><td style="background:#f0ede6;padding:16px 32px;text-align:center;font-size:12px;color:#999;">
    Pension Volgenandt &middot; Picknick-Buchungssystem &middot; Token: ' . htmlspecialchars($token, ENT_QUOTES, 'UTF-8') . '
  </td></tr>
</table>
</td></tr>
</table>
</body></html>';

sendSmtp(
    $smtpHost, $smtpPort, $smtpUser, $smtpPass,
    $adminEmail,          // from
    $adminEmail,          // to (admin)
    '🧺 Neue Picknick-Anfrage: ' . $name . ' – ' . $bookingDate,
    $adminHtml,
    htmlspecialchars($name, ENT_QUOTES, 'UTF-8'), $email, // reply-to guest
    '', true
);

// ---------------------------------------------------------------------------
// Success response
// ---------------------------------------------------------------------------
echo json_encode(['ok' => true, 'transactionId' => $transactionId]);
