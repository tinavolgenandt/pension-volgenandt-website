<?php
/**
 * Voucher validation helpers for the single shared "thank you" codeword
 * (PICKNICK_VOUCHER_CODE, set in config.php).
 *
 * The same code is also configured directly in Beds24 (Settings -> Booking
 * Engine -> Voucher Codes) so it works for room bookings through the Beds24
 * widget, which we don't control. This file only handles redemption for
 * picnic bookings, which run through our own PayPal checkout.
 *
 * Because it's one memorable phrase (not a random per-guest code), we can't
 * stop it from being shared beyond its intended recipient — the only guard
 * we can enforce on our side is one redemption per guest email. That's an
 * accepted tradeoff for a 5% discount on a small family business's picnic
 * orders, not a high-value target.
 *
 * Redeemed emails are stored in vouchers.json, guarded by flock() to avoid
 * a double-redemption race under concurrent requests.
 */

define('VOUCHERS_FILE', __DIR__ . '/vouchers.json');

/**
 * Read-only eligibility check — does NOT record a redemption.
 * Returns ['valid' => bool, 'discountPercent' => int, 'reason' => string].
 */
function validateVoucher(string $code, string $email): array {
    $email    = strtolower(trim($email));
    $redeemed = file_exists(VOUCHERS_FILE)
        ? (json_decode(file_get_contents(VOUCHERS_FILE), true)['redeemedEmails'] ?? [])
        : [];

    return validateVoucherAgainst($code, $email, $redeemed);
}

/**
 * Atomically re-validate and, if eligible, record the redemption for this
 * email. Returns the same shape as validateVoucher().
 */
function redeemVoucher(string $code, string $email, string $bookingToken): array {
    $email = strtolower(trim($email));

    $fp = fopen(VOUCHERS_FILE, 'c+');
    if ($fp === false) {
        return ['valid' => false, 'discountPercent' => 0, 'reason' => 'Gutschein konnte nicht geprüft werden.'];
    }
    flock($fp, LOCK_EX);
    $raw  = stream_get_contents($fp);
    $data = $raw !== '' ? (json_decode($raw, true) ?? []) : [];
    if (!isset($data['redeemedEmails']) || !is_array($data['redeemedEmails'])) {
        $data['redeemedEmails'] = [];
    }

    $result = validateVoucherAgainst($code, $email, $data['redeemedEmails']);
    if ($result['valid']) {
        $data['redeemedEmails'][$email] = [
            'redeemedAt'   => date('c'),
            'bookingToken' => $bookingToken,
        ];
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        fflush($fp);
    }

    flock($fp, LOCK_UN);
    fclose($fp);
    return $result;
}

/**
 * Shared eligibility check used by both validateVoucher() and the locked
 * section of redeemVoucher() (which reads its own copy of $redeemedEmails).
 */
function validateVoucherAgainst(string $code, string $email, array $redeemedEmails): array {
    $configuredCode = defined('PICKNICK_VOUCHER_CODE') ? PICKNICK_VOUCHER_CODE : '';
    $code = trim($code);

    if ($code === '' || $configuredCode === '' || strcasecmp($code, $configuredCode) !== 0) {
        return ['valid' => false, 'discountPercent' => 0, 'reason' => 'Dieser Gutschein-Code ist ungültig.'];
    }
    if (isset($redeemedEmails[$email])) {
        return ['valid' => false, 'discountPercent' => 0, 'reason' => 'Sie haben diesen Gutschein-Code bereits eingelöst.'];
    }

    $discountPercent = defined('PICKNICK_VOUCHER_DISCOUNT_PERCENT') ? (int)PICKNICK_VOUCHER_DISCOUNT_PERCENT : 5;
    return ['valid' => true, 'discountPercent' => $discountPercent, 'reason' => ''];
}
