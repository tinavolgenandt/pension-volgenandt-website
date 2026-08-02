<?php
/**
 * Direct booking cancellation confirmation tool for Pension Volgenandt.
 * Deploy to: https://api.pension-volgenandt.de/storno-direkt.php
 *
 * Password-protected. Calculates the correct refund based on AGB §5 and
 * sends a formatted HTML cancellation confirmation to the guest.
 *
 * Cancellation policy (3 tiers):
 *   > 14 days before arrival  →  0 % fee  (100 % refund)
 *   7–14 days before arrival  →  50 % fee (50 % refund)
 *   < 7 days / no-show        →  100 % fee (0 % refund)
 */

session_start();

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/smtp.php';

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['pw'])) {
    if (hash_equals(STORNO_ADMIN_PW, $_POST['pw'])) {
        $_SESSION['storno_admin'] = true;
    } else {
        $loginError = true;
    }
}
if (isset($_POST['logout'])) {
    session_destroy();
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit;
}
$loggedIn = !empty($_SESSION['storno_admin']);

// ---------------------------------------------------------------------------
// Cancellation calculation (AGB §5)
// ---------------------------------------------------------------------------
function calcStorno(string $arrivalDate, float $total): array
{
    $tz      = new DateTimeZone('Europe/Berlin');
    $today   = new DateTime('today', $tz);
    $arrival = new DateTime($arrivalDate, $tz);
    $days    = $arrival >= $today ? (int) $today->diff($arrival)->days : -1;

    if ($days > 14) {
        $feePct = 0;
    } elseif ($days >= 7) {
        $feePct = 50;
    } else {
        $feePct = 100;
    }

    $fee    = round($total * $feePct / 100, 2);
    $refund = round($total - $fee, 2);

    return ['days' => $days, 'feePct' => $feePct, 'fee' => $fee, 'refund' => $refund];
}

// ---------------------------------------------------------------------------
// HTML email builder
// ---------------------------------------------------------------------------
function buildStornoEmail(
    string $guestName,
    string $arrivalFormatted,
    float  $total,
    array  $storno,
    string $paymentMethod,
    string $bookingRef
): string {
    $feePct   = $storno['feePct'];
    $totalFmt = number_format($total, 2, ',', '.') . '&nbsp;€';
    $feeFmt   = number_format($storno['fee'], 2, ',', '.') . '&nbsp;€';
    $refFmt   = number_format($storno['refund'], 2, ',', '.') . '&nbsp;€';
    $nameEsc  = htmlspecialchars($guestName, ENT_QUOTES, 'UTF-8');
    $refEsc   = htmlspecialchars($bookingRef, ENT_QUOTES, 'UTF-8');
    $payEsc   = htmlspecialchars($paymentMethod, ENT_QUOTES, 'UTF-8');

    // -- Booking ref row (conditional) --
    $refRow = $bookingRef !== ''
        ? "<tr><td style=\"padding:10px 14px;font-weight:600;color:#374151;\">Buchungsreferenz</td>"
          . "<td style=\"padding:10px 14px;\">{$refEsc}</td></tr>"
        : '';

    // -- Rule box + amount block --
    if ($feePct === 0) {
        $ruleBox = '<div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:14px 18px;'
            . 'margin:20px 0;border-radius:0 6px 6px 0;">'
            . '<strong style="color:#166534;">Kostenlose Stornierung</strong><br>'
            . 'Sie haben mehr als 14 Tage vor der Anreise storniert – es entstehen keine Kosten.'
            . '</div>';
        $amountBlock = "<p>Sie erhalten den <strong>vollen Betrag von {$totalFmt}</strong> zurück.</p>";
    } elseif ($feePct === 50) {
        $ruleBox = '<div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:14px 18px;'
            . 'margin:20px 0;border-radius:0 6px 6px 0;">'
            . '<strong style="color:#92400e;">Stornierung 7–14 Tage vor Anreise</strong><br>'
            . 'Gem&auml;&szlig; AGB &sect;5 betr&auml;gt die Stornierungsgeb&uuml;hr 50&nbsp;% des Gesamtpreises.'
            . '</div>';
        $amountBlock = '<table style="width:100%;border-collapse:collapse;margin:16px 0;">'
            . '<tr style="border-bottom:1px solid #e5e7eb;">'
            . '<td style="padding:8px 4px;color:#6b7280;">Gesamtbetrag der Buchung</td>'
            . "<td style=\"padding:8px 4px;text-align:right;\">{$totalFmt}</td></tr>"
            . '<tr style="border-bottom:1px solid #e5e7eb;">'
            . '<td style="padding:8px 4px;color:#6b7280;">Stornierungsgeb&uuml;hr (50&nbsp;%)</td>'
            . "<td style=\"padding:8px 4px;text-align:right;\">&minus;&nbsp;{$feeFmt}</td></tr>"
            . '<tr>'
            . '<td style="padding:10px 4px;font-weight:700;">R&uuml;ckerstattung</td>'
            . "<td style=\"padding:10px 4px;text-align:right;font-weight:700;color:#166534;\">{$refFmt}</td>"
            . '</tr></table>';
    } else {
        $ruleBox = '<div style="background:#fef2f2;border-left:4px solid #ef4444;padding:14px 18px;'
            . 'margin:20px 0;border-radius:0 6px 6px 0;">'
            . '<strong style="color:#991b1b;">Stornierung weniger als 7 Tage vor Anreise</strong><br>'
            . 'Gem&auml;&szlig; AGB &sect;5 betr&auml;gt die Stornierungsgeb&uuml;hr 100&nbsp;% des Gesamtpreises.'
            . '</div>';
        $amountBlock = '<p>Gem&auml;&szlig; unseren Stornierungsbedingungen kann leider '
            . '<strong>keine R&uuml;ckerstattung</strong> erfolgen.</p>';
    }

    // -- Refund method note --
    if ($paymentMethod !== '') {
        $paymentNote = "<p>Die R&uuml;ckerstattung erfolgt auf dem gleichen Weg wie Ihre urspr&uuml;ngliche "
            . "Zahlung: <strong>{$payEsc}</strong>.</p>";
    } else {
        $paymentNote = '<p>Bitte teilen Sie uns Ihre bevorzugte R&uuml;ckerstattungsmethode mit '
            . '(&Uuml;berweisung, PayPal o.&nbsp;&Auml;.), damit wir die Zahlung '
            . 'schnellstm&ouml;glich veranlassen k&ouml;nnen.</p>';
    }

    return <<<HTML
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Stornierungsbest&auml;tigung &ndash; Pension Volgenandt</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;color:#1f2937;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">

          <!-- Header -->
          <tr>
            <td style="background:#4a5e4a;padding:28px 36px;">
              <p style="margin:0;font-family:Georgia,serif;font-size:22px;color:#ffffff;font-weight:bold;">
                Pension Volgenandt
              </p>
              <p style="margin:6px 0 0;font-size:13px;color:#c8d5c8;">
                Stornierungsbest&auml;tigung
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 36px;font-size:15px;line-height:1.7;color:#374151;">

              <p>Liebe/r {$nameEsc},</p>

              <p>wir best&auml;tigen hiermit die Stornierung Ihrer Buchung bei der Pension Volgenandt.</p>

              <!-- Booking summary table -->
              <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
                <tr style="background:#f3f4f6;">
                  <td style="padding:10px 14px;font-weight:600;color:#374151;">Anreisedatum</td>
                  <td style="padding:10px 14px;">{$arrivalFormatted}</td>
                </tr>
                {$refRow}
                <tr style="background:#f3f4f6;">
                  <td style="padding:10px 14px;font-weight:600;color:#374151;">Gebuchter Betrag</td>
                  <td style="padding:10px 14px;">{$totalFmt}</td>
                </tr>
              </table>

              {$ruleBox}

              {$amountBlock}

              {$paymentNote}

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;">

              <p>
                Wir bedauern, dass Sie Ihren Aufenthalt nicht wie geplant antreten konnten,
                und hoffen, Sie zu einem anderen Zeitpunkt bei uns begr&uuml;&szlig;en zu d&uuml;rfen.
              </p>

              <p>Bei Fragen stehen wir Ihnen gerne zur Verf&uuml;gung.</p>

              <p style="margin-top:28px;">
                Herzliche Gr&uuml;&szlig;e<br>
                <strong>Simone &amp; Ralf Volgenandt</strong><br>
                Pension Volgenandt
              </p>

              <p style="font-size:13px;color:#6b7280;margin-top:4px;">
                Otto-Reuter-Stra&szlig;e 28, 37327 Leinefelde-Worbis OT Breitenbach<br>
                Tel.: +49 160 97719112 &nbsp;&middot;&nbsp;
                <a href="mailto:kontakt@pension-volgenandt.de" style="color:#4a5e4a;">
                  kontakt@pension-volgenandt.de
                </a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f3f4f6;padding:16px 36px;font-size:12px;color:#9ca3af;text-align:center;">
              Pension Volgenandt &nbsp;&middot;&nbsp;
              <a href="https://www.pension-volgenandt.de/agb/" style="color:#9ca3af;">
                Stornierungsbedingungen (AGB &sect;5)
              </a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
}

// ---------------------------------------------------------------------------
// Handle send
// ---------------------------------------------------------------------------
$sent      = false;
$sendError = null;

if ($loggedIn && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['send'])) {
    $guestName     = trim($_POST['guest_name'] ?? '');
    $guestEmail    = trim($_POST['guest_email'] ?? '');
    $arrivalDate   = trim($_POST['arrival_date'] ?? '');
    $totalRaw      = trim($_POST['total'] ?? '');
    $paymentMethod = trim($_POST['payment_method'] ?? '');
    $bookingRef    = trim($_POST['booking_ref'] ?? '');

    $total            = (float) str_replace(',', '.', $totalRaw);
    $storno           = calcStorno($arrivalDate, $total);
    $arrivalFormatted = (new DateTime($arrivalDate))->format('d.m.Y');

    $emailHtml = buildStornoEmail(
        $guestName,
        $arrivalFormatted,
        $total,
        $storno,
        $paymentMethod,
        $bookingRef
    );

    $result = sendSmtp(
        $smtpHost, $smtpPort, $smtpUser, $smtpPass,
        $smtpUser,
        $guestEmail,
        'Stornierungsbestätigung Ihrer Buchung – Pension Volgenandt',
        $emailHtml,
        'Simone & Ralf Volgenandt',
        $smtpUser,
        '',
        true
    );

    if ($result['ok']) {
        $sent = true;
    } else {
        $sendError = $result['error'];
    }
}

// ---------------------------------------------------------------------------
// Admin UI
// ---------------------------------------------------------------------------
$v = fn(string $k) => htmlspecialchars($_POST[$k] ?? '', ENT_QUOTES, 'UTF-8');
$sel = fn(string $k, string $val) => (($_POST[$k] ?? '') === $val) ? ' selected' : '';
?><!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Storno – Direktbuchung</title>
  <style>
    body  { font-family:Arial,sans-serif;background:#f3f4f6;margin:0;padding:32px 16px;color:#1f2937; }
    .card { background:#fff;max-width:500px;margin:0 auto;border-radius:8px;padding:32px;
            box-shadow:0 1px 4px rgba(0,0,0,.1); }
    h1    { font-size:19px;margin:0 0 24px;color:#374151; }
    label { display:block;font-size:13px;font-weight:600;color:#374151;margin:16px 0 4px; }
    input, select { width:100%;box-sizing:border-box;padding:9px 12px;border:1px solid #d1d5db;
                    border-radius:6px;font-size:14px; }
    .note { font-size:12px;color:#9ca3af;margin:4px 0 0; }
    .btn  { margin-top:24px;width:100%;padding:11px;background:#4a5e4a;color:#fff;border:none;
            border-radius:6px;font-size:15px;cursor:pointer; }
    .btn:hover { background:#3a4e3a; }
    .btn-sm { background:#6b7280;width:auto;padding:7px 16px;font-size:13px; }
    .ok  { padding:12px 16px;border-radius:6px;background:#f0fdf4;color:#166534;
           border:1px solid #bbf7d0;font-size:14px;margin-bottom:20px; }
    .err { padding:12px 16px;border-radius:6px;background:#fef2f2;color:#991b1b;
           border:1px solid #fecaca;font-size:14px;margin-bottom:20px; }
  </style>
</head>
<body>
<div class="card">

<?php if (!$loggedIn): ?>

  <h1>Storno – Direktbuchung</h1>
  <?php if (!empty($loginError)): ?>
    <div class="err">Falsches Passwort.</div>
  <?php endif; ?>
  <form method="post">
    <label for="pw">Passwort</label>
    <input type="password" id="pw" name="pw" autofocus>
    <button class="btn" type="submit">Anmelden</button>
  </form>

<?php elseif ($sent): ?>

  <div class="ok">Stornierungsbestätigung wurde erfolgreich gesendet.</div>
  <a href="<?= htmlspecialchars($_SERVER['PHP_SELF'], ENT_QUOTES) ?>">← Neue Stornierung</a>

<?php else: ?>

  <?php if ($sendError): ?>
    <div class="err">Fehler beim Senden: <?= htmlspecialchars($sendError) ?></div>
  <?php endif; ?>

  <h1>Stornierungsbestätigung senden</h1>

  <form method="post">
    <label for="guest_name">Name des Gastes</label>
    <input type="text" id="guest_name" name="guest_name" required value="<?= $v('guest_name') ?>">

    <label for="guest_email">E-Mail-Adresse des Gastes</label>
    <input type="email" id="guest_email" name="guest_email" required value="<?= $v('guest_email') ?>">

    <label for="arrival_date">Anreisedatum</label>
    <input type="date" id="arrival_date" name="arrival_date" required value="<?= $v('arrival_date') ?>">
    <p class="note">Wird zur automatischen Berechnung der Stornierungsgebühr verwendet.</p>

    <label for="total">Gesamtbetrag der Buchung (€)</label>
    <input type="text" id="total" name="total" required placeholder="z. B. 180.00"
           value="<?= $v('total') ?>">

    <label for="payment_method">Zahlungsweg (für Rückerstattung)</label>
    <select id="payment_method" name="payment_method">
      <option value="">– nicht angegeben –</option>
      <option value="Überweisung"<?= $sel('payment_method', 'Überweisung') ?>>Überweisung</option>
      <option value="PayPal"<?= $sel('payment_method', 'PayPal') ?>>PayPal</option>
      <option value="Bar"<?= $sel('payment_method', 'Bar') ?>>Bar (keine Erstattung nötig)</option>
    </select>

    <label for="booking_ref">Buchungsreferenz (optional)</label>
    <input type="text" id="booking_ref" name="booking_ref"
           placeholder="z. B. BED-2026-042" value="<?= $v('booking_ref') ?>">

    <button class="btn" type="submit" name="send" value="1">Bestätigung senden</button>
  </form>

  <form method="post" style="margin-top:16px;text-align:right;">
    <input type="hidden" name="logout" value="1">
    <button class="btn btn-sm" type="submit">Abmelden</button>
  </form>

<?php endif; ?>

</div>
</body>
</html>
