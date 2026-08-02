<?php
/**
 * Picnic follow-up mailer — triggered on a schedule (see
 * .github/workflows/picknick-followup.yml), NOT by a user request.
 * Deploy to: https://api.pension-volgenandt.de/picknick-followup.php
 *
 * For every accepted picnic booking that is at least 5 hours past its
 * pickup time and hasn't been processed yet:
 *   - Skip (no email) if the guest also has an overlapping Beds24
 *     accommodation booking — this follow-up is for day guests only.
 *   - Otherwise send a thank-you email with the shared 5% voucher codeword
 *     (PICKNICK_VOUCHER_CODE) and a request for a Google review.
 *
 * The voucher codeword is the SAME for every guest (not per-guest random) —
 * it's redeemed automatically for picnic bookings via vouchers.php (one
 * redemption per email), and separately configured directly in Beds24
 * (Settings -> Booking Engine -> Voucher Codes) so it also works for room
 * bookings through the Beds24 widget, which this codebase doesn't control.
 *
 * Auth: shared secret in X-Followup-Secret header (same pattern as
 * invoice-trigger.php's X-Invoice-Secret).
 */

require_once __DIR__ . '/smtp.php'; // also loads config.php
require_once __DIR__ . '/beds24-api.php';

$bookingsDir = __DIR__ . '/bookings';
$adminEmail  = ADMIN_EMAIL;
$reviewLink  = 'https://maps.app.goo.gl/VJUERCRLaZPPwUQ18';
$followUpDelayHours = 5;

// ---------------------------------------------------------------------------
// Only accept POST, guarded by shared secret
// ---------------------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$secret = defined('PICKNICK_FOLLOWUP_SECRET') ? PICKNICK_FOLLOWUP_SECRET : '';
if ($secret === '' || !hash_equals($secret, $_SERVER['HTTP_X_FOLLOWUP_SECRET'] ?? '')) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// ---------------------------------------------------------------------------
// Email template
// ---------------------------------------------------------------------------
function buildFollowUpEmail(string $name, string $voucherCode, int $discountPercent, string $reviewLink): string {
    $name      = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $code      = htmlspecialchars($voucherCode, ENT_QUOTES, 'UTF-8');
    $reviewUrl = htmlspecialchars($reviewLink, ENT_QUOTES, 'UTF-8');

    return '<!DOCTYPE html>
<html lang="de"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#333;background:#f7f5f0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;padding:24px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;max-width:600px;">
  <tr><td style="background:#3d5a3e;padding:28px 32px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Pension Volgenandt</h1>
    <p style="margin:6px 0 0;color:#c8d8c0;font-size:13px;">Ruhe finden im Eichsfeld</p>
  </td></tr>
  <tr><td style="background:#f0f7ee;padding:20px 32px;text-align:center;border-bottom:1px solid #dde8db;">
    <p style="margin:0;font-size:26px;">&#127811;</p>
    <h2 style="margin:8px 0 4px;font-size:20px;color:#3d5a3e;">Danke f&uuml;r Ihren Besuch, ' . $name . '!</h2>
  </td></tr>
  <tr><td style="padding:32px;">
    <p style="margin:0 0 18px;font-size:15px;line-height:1.7;">
      Liebe/r ' . $name . ',<br><br>
      wir hoffen, Sie hatten heute ein wundersch&ouml;nes Picknick bei uns im Eichsfeld!
      Es freut uns sehr, dass Sie sich f&uuml;r einen Tag bei Pension Volgenandt entschieden haben.
    </p>

    <h2 style="margin:0 0 12px;font-size:16px;color:#3d5a3e;border-bottom:2px solid #e8e4dc;padding-bottom:8px;">Wie hat es Ihnen gefallen?</h2>
    <p style="margin:0 0 18px;font-size:14px;line-height:1.7;color:#555;">
      Wir w&uuml;rden uns riesig freuen, wenn Sie sich kurz Zeit f&uuml;r eine Google-Bewertung nehmen &ndash;
      das hilft uns sehr und dauert nur eine Minute.
    </p>
    <p style="margin:0 0 24px;text-align:center;">
      <a href="' . $reviewUrl . '"
         style="display:inline-block;background:#b8860b;color:#fff;text-decoration:none;
                padding:12px 24px;border-radius:6px;font-size:14px;font-weight:700;">
        &#11088; Jetzt bewerten
      </a>
    </p>

    <h2 style="margin:0 0 12px;font-size:16px;color:#3d5a3e;border-bottom:2px solid #e8e4dc;padding-bottom:8px;">Ihr Dankesch&ouml;n</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef9ee;border-radius:6px;margin:0 0 24px;">
      <tr><td style="padding:20px;text-align:center;">
        <p style="margin:0 0 10px;font-size:14px;line-height:1.6;">
          Als kleines Dankesch&ouml;n schenken wir Ihnen <strong>' . $discountPercent . '&nbsp;% Rabatt</strong>
          auf Ihr n&auml;chstes Picknick oder Ihre n&auml;chste &Uuml;bernachtung bei uns:
        </p>
        <p style="margin:0 0 10px;font-size:22px;font-weight:700;letter-spacing:1px;color:#b8860b;background:#fff;display:inline-block;padding:10px 20px;border-radius:6px;border:2px dashed #e0c88a;">
          ' . $code . '
        </p>
        <p style="margin:0;font-size:12px;color:#888;">
          F&uuml;r ein Picknick geben Sie den Code einfach bei der Buchung ein.
          F&uuml;r eine Zimmerbuchung tragen Sie ihn im Buchungsformular unter &bdquo;Gutschein-Code&ldquo; ein.
        </p>
      </td></tr>
    </table>
    <p style="margin:0 0 24px;text-align:center;">
      <a href="https://www.pension-volgenandt.de"
         style="display:inline-block;background:#3d5a3e;color:#fff;text-decoration:none;
                padding:12px 24px;border-radius:6px;font-size:14px;font-weight:700;">
        &#127811; N&auml;chsten Besuch buchen
      </a>
    </p>

    <p style="margin:0;font-size:15px;line-height:1.8;color:#444;">
      Wir hoffen, Sie bald wieder bei uns begr&uuml;&szlig;en zu d&uuml;rfen!<br><br>
      Herzliche Gr&uuml;&szlig;e,<br>
      <strong>Simone &amp; Ralf Volgenandt</strong><br>
      <span style="font-size:13px;color:#888;">Pension Volgenandt &middot; Breitenbach</span>
    </p>
  </td></tr>
  <tr><td style="background:#f0ede6;padding:16px 32px;text-align:center;font-size:12px;color:#999;line-height:1.6;">
    Pension Volgenandt &middot; Otto-Reuter-Stra&szlig;e 28 &middot; 37327 Leinefelde-Worbis OT Breitenbach<br>
    <a href="https://www.pension-volgenandt.de" style="color:#888;">www.pension-volgenandt.de</a>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>';
}

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------
$beds24  = new Beds24Api();
$checked = 0;
$sent    = 0;
$skipped = 0;

$files = is_dir($bookingsDir) ? glob($bookingsDir . '/*.json') : [];

foreach ($files as $file) {
    $booking = json_decode(file_get_contents($file), true);
    if (!is_array($booking)) continue;
    if (($booking['status'] ?? '') !== 'accepted') continue;
    if (!empty($booking['followUpSentAt'])) continue;

    $checked++;

    $bookingDate = $booking['bookingDate'] ?? '';
    $bookingTime = $booking['bookingTime'] ?? '';
    $pickupAt    = ($bookingDate !== '' && $bookingTime !== '')
        ? strtotime("$bookingDate $bookingTime")
        : false;

    if ($pickupAt === false) {
        // No structured pickup time (booking predates this feature) — mark
        // as handled so we don't re-check it on every run.
        $booking['followUpSentAt']        = date('c');
        $booking['followUpSkippedReason'] = 'no_time';
        file_put_contents($file, json_encode($booking, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        $skipped++;
        continue;
    }

    if (time() < $pickupAt + $followUpDelayHours * 3600) {
        // Not due yet — leave untouched, checked again on the next run.
        continue;
    }

    $email = $booking['email'] ?? '';
    $name  = $booking['name'] ?? '';

    if ($beds24->hasAccommodationOverlap($email, $bookingDate)) {
        $booking['followUpSentAt']        = date('c');
        $booking['followUpSkippedReason'] = 'accommodation_guest';
        file_put_contents($file, json_encode($booking, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        $skipped++;
        continue;
    }

    $voucherCode     = defined('PICKNICK_VOUCHER_CODE') ? PICKNICK_VOUCHER_CODE : '';
    $discountPercent = defined('PICKNICK_VOUCHER_DISCOUNT_PERCENT') ? (int)PICKNICK_VOUCHER_DISCOUNT_PERCENT : 5;

    if ($voucherCode === '') {
        // Not configured yet — skip rather than send a broken email.
        continue;
    }

    $emailHtml = buildFollowUpEmail($name, $voucherCode, $discountPercent, $reviewLink);
    $result = sendSmtp(
        $smtpHost, $smtpPort, $smtpUser, $smtpPass,
        $adminEmail,
        $email,
        "Danke für Ihren Besuch – {$discountPercent}% Gutschein für Ihr nächstes Picknick",
        $emailHtml,
        'Simone & Ralf Volgenandt', $adminEmail,
        '', true
    );

    if ($result['ok']) {
        $booking['followUpSentAt']    = date('c');
        $booking['followUpVoucherCode'] = $voucherCode;
        $sent++;
    } else {
        // Sending failed — do NOT mark as sent, so the next run retries.
    }
    file_put_contents($file, json_encode($booking, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

echo json_encode(['ok' => true, 'checked' => $checked, 'sent' => $sent, 'skipped' => $skipped]);
