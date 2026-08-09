<?php
/**
 * Picknick booking cancellation handler.
 * Deploy to: https://api.pension-volgenandt.de/picknick-cancel.php
 *
 * GET  ?token=xxx  → confirmation page ("Wirklich stornieren?")
 * POST ?token=xxx  → sends cancellation email to guest, marks booking as cancelled
 */

require_once __DIR__ . '/smtp.php';

$bookingsDir = __DIR__ . '/bookings';
$adminEmail  = 'kontakt@pension-volgenandt.de';

function adminPage(string $title, string $message, string $color = '#3d5a3e'): void {
    header('Content-Type: text/html; charset=UTF-8');
    echo '<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>' . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . '</title>
<style>*{box-sizing:border-box;}body{font-family:Arial,sans-serif;background:#f7f5f0;display:flex;
align-items:center;justify-content:center;min-height:100vh;margin:0;}
.box{background:#fff;border-radius:10px;padding:40px 36px;max-width:480px;width:90%;
box-shadow:0 2px 12px rgba(0,0,0,.08);text-align:center;}
h1{color:' . $color . ';margin:0 0 16px;font-size:22px;}
p{color:#555;line-height:1.6;margin:0 0 20px;font-size:15px;}
a.back{display:inline-block;background:#3d5a3e;color:#fff;text-decoration:none;
padding:10px 22px;border-radius:6px;font-size:14px;font-weight:700;}</style>
</head><body><div class="box">
<h1>' . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . '</h1>
<p>' . $message . '</p>
<a class="back" href="picknick-admin.php">&#8592; Zur &Uuml;bersicht</a>
</div></body></html>';
    exit;
}

function parseMsg(string $msg): array {
    $r = ['datum' => '', 'uhrzeit' => '', 'paket' => '', 'erwachsene' => 0, 'kinder' => 0];
    foreach (explode("\n", str_replace("\r\n", "\n", $msg)) as $line) {
        $line = trim($line);
        if ($line === '') break;
        if (preg_match('/^Datum:\s*(.+)$/u', $line, $m))            $r['datum']      = trim($m[1]);
        elseif (preg_match('/^Uhrzeit:\s*(.+)$/u', $line, $m))      $r['uhrzeit']    = trim($m[1]);
        elseif (preg_match('/^Paket:\s*(.+)$/u', $line, $m))        $r['paket']      = trim(preg_replace('/\s*\(.*$/', '', trim($m[1])));
        elseif (preg_match('/^Erwachsene:\s*(\d+)$/u', $line, $m))  $r['erwachsene'] = (int)$m[1];
        elseif (preg_match('/^Kinder:\s*(\d+)/u', $line, $m))       $r['kinder']     = (int)$m[1];
    }
    return $r;
}

function buildCancellationEmail(array $booking, array $parsed): string {
    $name   = htmlspecialchars($booking['name'], ENT_QUOTES, 'UTF-8');
    $datum  = htmlspecialchars($parsed['datum'], ENT_QUOTES, 'UTF-8');
    $paket  = htmlspecialchars($parsed['paket'], ENT_QUOTES, 'UTF-8');
    $amount = number_format($booking['amount'], 2, ',', '.') . '&nbsp;&euro;';

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
  <tr><td style="padding:32px;">
    <p style="margin:0 0 18px;font-size:15px;line-height:1.7;">Liebe/r ' . $name . ',</p>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.7;">
      leider m&uuml;ssen wir Ihre best&auml;tigte Picknick-Buchung am
      <strong>' . $datum . '</strong> (Paket: <strong>' . $paket . '</strong>)
      stornieren. Es tut uns sehr leid!
    </p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.7;">
      Bitte nehmen Sie direkt Kontakt mit uns auf &ndash; wir k&uuml;mmern uns
      umgehend um die R&uuml;ckerstattung des bezahlten Betrags von
      <strong>' . $amount . '</strong>:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;border-radius:6px;margin:0 0 24px;">
      <tr><td style="padding:16px;font-size:14px;line-height:1.9;">
        &#128222;&nbsp;<a href="tel:+4916097719112" style="color:#3d5a3e;font-weight:600;text-decoration:none;">0160 97719112</a><br>
        &#9993;&nbsp;<a href="mailto:kontakt@pension-volgenandt.de" style="color:#3d5a3e;font-weight:600;text-decoration:none;">kontakt@pension-volgenandt.de</a>
      </td></tr>
    </table>

    <p style="margin:0 0 24px;font-size:15px;line-height:1.7;">
      Wir hoffen sehr, Sie bald bei uns begr&uuml;&szlig;en zu d&uuml;rfen!
    </p>

    <p style="margin:0;font-size:15px;line-height:1.8;color:#444;">
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

// --- Main logic ---
$token = trim($_GET['token'] ?? $_POST['token'] ?? '');

if ($token === '' || !preg_match('/^[a-f0-9]{32}$/', $token)) {
    adminPage('Ung&uuml;ltiger Link', 'Dieser Link ist ung&uuml;ltig.', '#c0392b');
}

$file = "$bookingsDir/$token.json";
if (!file_exists($file)) {
    adminPage('Buchung nicht gefunden', 'Diese Buchung existiert nicht.', '#c0392b');
}

$booking = json_decode(file_get_contents($file), true);
if (!is_array($booking)) {
    adminPage('Fehler', 'Buchungsdaten konnten nicht gelesen werden.', '#c0392b');
}

$status = $booking['status'] ?? 'pending';
if ($status !== 'accepted') {
    $hint = $status === 'cancelled'
        ? 'Diese Buchung wurde bereits storniert.'
        : 'Nur best&auml;tigte Buchungen k&ouml;nnen storniert werden.';
    adminPage('Nicht m&ouml;glich', $hint, '#888');
}

$parsed = parseMsg($booking['message'] ?? '');
$name   = htmlspecialchars($booking['name'] ?? '?', ENT_QUOTES, 'UTF-8');
$datum  = htmlspecialchars($parsed['datum'] ?: ($booking['bookingDate'] ?? '?'), ENT_QUOTES, 'UTF-8');
$paket  = htmlspecialchars($parsed['paket'] ?: '?', ENT_QUOTES, 'UTF-8');
$tok    = htmlspecialchars($token, ENT_QUOTES, 'UTF-8');

// GET → confirmation page
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Content-Type: text/html; charset=UTF-8');
    echo '<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Buchung stornieren &ndash; Pension Volgenandt</title>
<style>*{box-sizing:border-box;}body{font-family:Arial,sans-serif;background:#f7f5f0;display:flex;
align-items:center;justify-content:center;min-height:100vh;margin:0;}
.box{background:#fff;border-radius:10px;padding:40px 36px;max-width:460px;width:90%;
box-shadow:0 2px 12px rgba(0,0,0,.08);text-align:center;}
h1{color:#c0392b;margin:0 0 16px;font-size:22px;}
p{color:#555;line-height:1.6;margin:0 0 16px;font-size:15px;}
.info{background:#fdf0f0;border-radius:6px;padding:14px 18px;margin:0 0 20px;font-size:14px;
line-height:1.9;text-align:left;color:#333;}
.warn{font-size:13px;color:#c0392b;margin-bottom:24px;}
.btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
.btn{padding:11px 22px;border-radius:6px;font-size:14px;font-weight:700;text-decoration:none;
border:none;cursor:pointer;display:inline-block;}
.btn-cancel{background:#c0392b;color:#fff;}.btn-cancel:hover{background:#a93226;}
.btn-back{background:#eee;color:#333;}.btn-back:hover{background:#ddd;}</style>
</head><body><div class="box">
<h1>&#128683; Buchung stornieren?</h1>
<p>Bitte best&auml;tige die Stornierung:</p>
<div class="info">
  <strong>Gast:</strong> ' . $name . '<br>
  <strong>Datum:</strong> ' . $datum . '<br>
  <strong>Paket:</strong> ' . $paket . '
</div>
<p class="warn">Der Gast erh&auml;lt eine E-Mail mit der Bitte, sich wegen der R&uuml;ckerstattung zu melden.</p>
<div class="btns">
  <form method="post" style="margin:0;">
    <input type="hidden" name="token" value="' . $tok . '">
    <button type="submit" class="btn btn-cancel">Ja, stornieren</button>
  </form>
  <a href="picknick-admin.php" class="btn btn-back">Abbrechen</a>
</div>
</div></body></html>';
    exit;
}

// POST → execute cancellation
$emailHtml = buildCancellationEmail($booking, $parsed);

$result = sendSmtp(
    $smtpHost, $smtpPort, $smtpUser, $smtpPass,
    $adminEmail,
    $booking['email'],
    'Stornierung Ihrer Picknick-Buchung &ndash; Pension Volgenandt',
    $emailHtml,
    'Simone & Ralf Volgenandt', $adminEmail,
    '', true, $adminEmail
);

if (!$result['ok']) {
    adminPage(
        'Fehler beim E-Mail-Versand',
        'Die E-Mail konnte nicht gesendet werden. Die Buchung wurde <strong>nicht</strong> storniert.<br><br>Fehler: '
        . htmlspecialchars($result['error'] ?? 'unbekannt', ENT_QUOTES, 'UTF-8'),
        '#c0392b'
    );
}

// Mark as cancelled
$booking['status']    = 'cancelled';
$booking['handledAt'] = date('c');
file_put_contents($file, json_encode($booking, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// Free the date slot
if (!empty($booking['bookingDate'])) {
    $blockedFile = __DIR__ . '/blocked-dates.json';
    if (file_exists($blockedFile)) {
        $blockedData = json_decode(file_get_contents($blockedFile), true) ?? [];
        $date        = $booking['bookingDate'];
        if (isset($blockedData[$date]) && $blockedData[$date] > 0) {
            $blockedData[$date]--;
            if ($blockedData[$date] === 0) unset($blockedData[$date]);
            file_put_contents($blockedFile, json_encode($blockedData, JSON_PRETTY_PRINT));
        }
    }
}

adminPage(
    '&#10003; Buchung storniert',
    'Die Stornierungsmail wurde an <strong>'
    . htmlspecialchars($booking['name'], ENT_QUOTES, 'UTF-8')
    . '</strong> (' . htmlspecialchars($booking['email'], ENT_QUOTES, 'UTF-8')
    . ') gesendet.<br><br><strong>Bitte vergiss nicht</strong>, die PayPal-R&uuml;ckerstattung manuell auszul&ouml;sen.'
);
