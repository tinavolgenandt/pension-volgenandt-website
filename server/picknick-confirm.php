<?php
/**
 * Picknick booking confirmation / decline handler.
 * Deploy to: https://api.pension-volgenandt.de/picknick-confirm.php
 *
 * Called by admin (Simone) via links in the notification email.
 * GET  ?token=xxx&action=accept|decline  → shows preview page with confirm button
 * POST ?token=xxx&action=accept|decline  → sends guest email, marks booking handled
 */

require_once __DIR__ . '/smtp.php';

$bookingsDir = __DIR__ . '/bookings';
$adminEmail  = 'kontakt@pension-volgenandt.de';

// ---------------------------------------------------------------------------
// Package contents (kept in sync with content/picknick/packages.yml)
// ---------------------------------------------------------------------------
$packageContents = [
    'Brunch' => [
        'Frische Brötchen (2 pro Person)',
        'Hausgemachte Marmelade mit Obst aus dem eigenen Garten',
        'Aufstriche nach Muttis Rezepten',
        'Käse- &amp; Wurstaufschnitt',
        'Hartgekochtes Ei (1 pro Person)',
        'Joghurt',
        'Orangensaft',
        'Frisches, saisonales Obst',
    ],
    'Abendschmaus' => [
        'Regionale Käse-Wurst-Platte',
        'Brezeln (2 pro Person)',
        'Hausgemachte Aufstriche',
        'Nussmischung',
        'Saisonales Obst',
        'Extra Wolldecke inklusive',
        'Kerze / Windlicht',
    ],
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function parseBookingMessage(string $msg): array {
    $result = [
        'datum'          => '',
        'uhrzeit'        => '',
        'paket'          => '',
        'paket_name'     => '',
        'erwachsene'     => 0,
        'kinder'         => 0,
        'getraenke'      => '–',
        'extras'         => 'keine',
        'sonderwuensche' => '–',
    ];
    $lines           = explode("\n", str_replace("\r\n", "\n", $msg));
    $inPriceSection  = false;
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '') { $inPriceSection = true; continue; }
        if ($inPriceSection) continue;
        if (preg_match('/^Datum:\s*(.+)$/u', $line, $m))          $result['datum'] = trim($m[1]);
        elseif (preg_match('/^Uhrzeit:\s*(.+)$/u', $line, $m))    $result['uhrzeit'] = trim($m[1]);
        elseif (preg_match('/^Paket:\s*(.+)$/u', $line, $m)) {
            $result['paket']      = trim($m[1]);
            $result['paket_name'] = trim(preg_replace('/\s*\(.*$/', '', trim($m[1])));
        }
        elseif (preg_match('/^Erwachsene:\s*(\d+)$/u', $line, $m)) $result['erwachsene'] = (int)$m[1];
        elseif (preg_match('/^Kinder:\s*(\d+)/u', $line, $m))      $result['kinder'] = (int)$m[1];
        elseif (preg_match('/^Getränke:\s*(.+)$/u', $line, $m))    $result['getraenke'] = trim($m[1]);
        elseif (preg_match('/^Extras:\s*(.+)$/u', $line, $m))      $result['extras'] = trim($m[1]);
        elseif (preg_match('/^Sonderwünsche:\s*(.+)$/u', $line, $m)) $result['sonderwuensche'] = trim($m[1]);
    }
    return $result;
}

function itemListHtml(array $items): string {
    $html = '';
    foreach ($items as $item) {
        $html .= '<li>' . $item . '</li>';
    }
    return $html;
}

function extrasListHtml(string $extrasText): string {
    if (in_array(strtolower(trim($extrasText)), ['keine', '–', '-', ''], true)) return '';
    $parts = array_filter(array_map('trim', explode(',', $extrasText)));
    $html  = '';
    foreach ($parts as $part) {
        $html .= '<li>' . htmlspecialchars($part, ENT_QUOTES, 'UTF-8') . '</li>';
    }
    return $html;
}

// ---------------------------------------------------------------------------
// Build guest CONFIRMATION email HTML
// ---------------------------------------------------------------------------
function buildConfirmationEmail(array $booking, array $parsed, array $packageContents): string {
    $name            = htmlspecialchars($booking['name'], ENT_QUOTES, 'UTF-8');
    $amountFormatted = number_format($booking['amount'], 2, ',', '.') . '&nbsp;&euro;';
    $txn             = htmlspecialchars($booking['transactionId'] ?? '', ENT_QUOTES, 'UTF-8');
    $datum           = htmlspecialchars($parsed['datum'], ENT_QUOTES, 'UTF-8');
    $uhrzeit         = htmlspecialchars($parsed['uhrzeit'], ENT_QUOTES, 'UTF-8');
    $paketName       = htmlspecialchars($parsed['paket_name'] ?: $parsed['paket'], ENT_QUOTES, 'UTF-8');
    $paketDisplay    = htmlspecialchars($parsed['paket'], ENT_QUOTES, 'UTF-8');
    $erwachsene      = (int)$parsed['erwachsene'];
    $kinder          = (int)$parsed['kinder'];
    $getraenke       = htmlspecialchars($parsed['getraenke'], ENT_QUOTES, 'UTF-8');
    $sonderwuensche  = htmlspecialchars($parsed['sonderwuensche'], ENT_QUOTES, 'UTF-8');

    // Package contents
    $contents      = $packageContents[$parsed['paket_name']] ?? $packageContents['Brunch'];
    $contentsHtml  = itemListHtml($contents);

    // Persons row
    $kinderZeile = $kinder > 0
        ? ', ' . $kinder . '&nbsp;Kind' . ($kinder > 1 ? 'er' : '')
        : '';

    // Kids basket block
    $kinderBlock = '';
    if ($kinder > 0) {
        $kinderBlock = '
    <h2 style="margin:0 0 12px;font-size:16px;color:#3d5a3e;border-bottom:2px solid #e8e4dc;padding-bottom:8px;">
      Kinder-Korb (' . $kinder . '&nbsp;Kind' . ($kinder > 1 ? 'er' : '') . ')
    </h2>
    <ul style="margin:0 0 20px;padding-left:20px;font-size:14px;line-height:1.9;color:#444;">
      <li>1 Br&ouml;tchen</li>
      <li>Hausgemachte Marmelade mit Obst aus dem eigenen Garten</li>
      <li>Joghurt</li>
      <li>Tee oder Apfelschorle</li>
      <li>Frisches, saisonales Obst</li>
      <li>1 hartgekochtes Ei</li>
      <li>Kleine &Uuml;berraschung &#127873;</li>
    </ul>';
    }

    // Extras block
    $extrasHtml  = extrasListHtml($parsed['extras']);
    $extrasBlock = '';
    if ($extrasHtml !== '') {
        $extrasBlock = '
    <h2 style="margin:0 0 12px;font-size:16px;color:#3d5a3e;border-bottom:2px solid #e8e4dc;padding-bottom:8px;">
      Ihre Extras
    </h2>
    <ul style="margin:0 0 24px;padding-left:20px;font-size:14px;line-height:1.9;color:#444;">' . $extrasHtml . '</ul>';
    }

    // Notes block
    $notesBlock = '';
    if ($sonderwuensche !== '' && $sonderwuensche !== '&ndash;' && $sonderwuensche !== '–') {
        $notesBlock = '
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#666;">
      <strong>Ihre Sonderw&uuml;nsche:</strong> ' . $sonderwuensche . '
    </p>';
    }

    return '<!DOCTYPE html>
<html lang="de"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#333;background:#f7f5f0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;padding:24px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;max-width:600px;">
  <tr><td style="background:#3d5a3e;padding:28px 32px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:0.5px;">Pension Volgenandt</h1>
    <p style="margin:6px 0 0;color:#c8d8c0;font-size:13px;">Ruhe finden im Eichsfeld</p>
  </td></tr>
  <tr><td style="background:#f0f7ee;padding:20px 32px;text-align:center;border-bottom:1px solid #dde8db;">
    <p style="margin:0;font-size:26px;">&#127826;</p>
    <h2 style="margin:8px 0 4px;font-size:20px;color:#3d5a3e;">Ihr Picknick-Korb ist best&auml;tigt!</h2>
    <p style="margin:0;font-size:14px;color:#5a7a5c;">Wir freuen uns auf Sie, ' . $name . '.</p>
  </td></tr>
  <tr><td style="padding:32px;">
    <p style="margin:0 0 18px;font-size:15px;line-height:1.7;">
      Liebe/r ' . $name . ',<br><br>
      wir haben Ihre Buchung gepr&uuml;ft und freuen uns sehr, Ihnen mitteilen zu k&ouml;nnen:
      <strong>Ihr Picknick-Korb ist fest eingeplant!</strong>
      Wir bereiten alles liebevoll f&uuml;r Sie vor &ndash; frisch, saisonal und mit Herzblut aus unserer K&uuml;che.
    </p>

    <h2 style="margin:0 0 12px;font-size:16px;color:#3d5a3e;border-bottom:2px solid #e8e4dc;padding-bottom:8px;">Ihre Buchung</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin:0 0 24px;border-collapse:collapse;">
      <tr>
        <td style="padding:7px 0;color:#666;width:40%;">Datum</td>
        <td style="padding:7px 0;font-weight:700;color:#3d5a3e;">' . $datum . '</td>
      </tr>
      <tr style="border-top:1px solid #f0ede6;">
        <td style="padding:7px 0;color:#666;">Uhrzeit</td>
        <td style="padding:7px 0;font-weight:600;">' . $uhrzeit . '</td>
      </tr>
      <tr style="border-top:1px solid #f0ede6;">
        <td style="padding:7px 0;color:#666;">Paket</td>
        <td style="padding:7px 0;font-weight:600;">' . $paketDisplay . '</td>
      </tr>
      <tr style="border-top:1px solid #f0ede6;">
        <td style="padding:7px 0;color:#666;">Personen</td>
        <td style="padding:7px 0;">' . $erwachsene . '&nbsp;Erwachsene' . $kinderZeile . '</td>
      </tr>
      <tr style="border-top:2px solid #3d5a3e;">
        <td style="padding:10px 0;font-weight:700;">Bezahlt per PayPal</td>
        <td style="padding:10px 0;font-weight:700;color:#b8860b;font-size:16px;">' . $amountFormatted . '</td>
      </tr>
      <tr>
        <td style="padding:3px 0;font-size:11px;color:#bbb;">Transaktions-ID</td>
        <td style="padding:3px 0;font-size:11px;color:#bbb;">' . $txn . '</td>
      </tr>
    </table>

    <h2 style="margin:0 0 12px;font-size:16px;color:#3d5a3e;border-bottom:2px solid #e8e4dc;padding-bottom:8px;">Das ist in Ihrem Korb</h2>
    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#3d5a3e;text-transform:uppercase;letter-spacing:0.5px;">Paket: ' . $paketName . '</p>
    <ul style="margin:0 0 14px;padding-left:20px;font-size:14px;line-height:1.9;color:#444;">' . $contentsHtml . '</ul>
    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#3d5a3e;text-transform:uppercase;letter-spacing:0.5px;">Immer dabei</p>
    <ul style="margin:0 0 16px;padding-left:20px;font-size:14px;line-height:1.9;color:#444;">
      <li>Picknickdecke (wasserfest)</li>
      <li>Echtes Geschirr, Besteck &amp; Gl&auml;ser &ndash; kein Plastik</li>
    </ul>
    <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#3d5a3e;text-transform:uppercase;letter-spacing:0.5px;">Ihre Getr&auml;nke-Wahl</p>
    <p style="margin:0 0 20px;font-size:14px;color:#444;">' . $getraenke . '</p>

    ' . $kinderBlock . '
    ' . $extrasBlock . '
    ' . $notesBlock . '

    <h2 style="margin:0 0 12px;font-size:16px;color:#3d5a3e;border-bottom:2px solid #e8e4dc;padding-bottom:8px;">Korbpfand</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef9ee;border-radius:6px;margin:0 0 24px;">
      <tr><td style="padding:16px;">
        <p style="margin:0 0 8px;font-size:14px;line-height:1.6;">
          Bei Abholung bitten wir Sie um <strong>100&nbsp;&euro; in bar</strong> als Pfand f&uuml;r Korb und Geschirr.
          Das Geld erhalten Sie <strong>sofort bei R&uuml;ckgabe</strong> zur&uuml;ck &ndash; einfach den Korb vollst&auml;ndig zur&uuml;ckbringen.
        </p>
        <p style="margin:0;font-size:13px;color:#888;">
          R&uuml;ckgabe bitte sp&auml;testens <strong>1 Stunde nach Ende Ihres Zeitfensters</strong>.
        </p>
      </td></tr>
    </table>

    <h2 style="margin:0 0 12px;font-size:16px;color:#3d5a3e;border-bottom:2px solid #e8e4dc;padding-bottom:8px;">Abholung</h2>
    <p style="margin:0 0 10px;font-size:14px;line-height:1.7;">
      Kommen Sie einfach zur vereinbarten Zeit bei uns vorbei &ndash; Ihr Korb steht bereit.
    </p>
    <p style="margin:0 0 6px;font-size:14px;line-height:1.7;">
      <strong>Pension Volgenandt</strong><br>
      Otto-Reuter-Stra&szlig;e 28<br>
      37327 Leinefelde-Worbis OT Breitenbach
    </p>
    <p style="margin:12px 0 24px;">
      <a href="https://maps.google.com/?q=Otto-Reuter-Stra%C3%9Fe+28+37327+Breitenbach"
         style="display:inline-block;background:#3d5a3e;color:#fff;text-decoration:none;
                padding:9px 18px;border-radius:5px;font-size:13px;font-weight:700;">
        &#128506; Route in Google Maps &ouml;ffnen
      </a>
    </p>

    <h2 style="margin:0 0 12px;font-size:16px;color:#3d5a3e;border-bottom:2px solid #e8e4dc;padding-bottom:8px;">Wetter &amp; Stornierung</h2>
    <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#555;">
      &#9925; Bei schlechtem Wetter steht Ihnen unsere &uuml;berdachte Terrasse als gem&uuml;tlicher Ausweichplatz bereit &ndash; der Genuss ist garantiert.<br><br>
      Kostenfreie Stornierung bis <strong>48&nbsp;Stunden</strong> vor Ihrem Termin &ndash; einfach kurz melden:
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;border-radius:6px;margin:0 0 24px;">
      <tr><td style="padding:16px;font-size:14px;line-height:1.9;">
        &#128222;&nbsp;<a href="tel:+4916097719112" style="color:#3d5a3e;font-weight:600;text-decoration:none;">0160 97719112</a><br>
        &#9993;&nbsp;<a href="mailto:kontakt@pension-volgenandt.de" style="color:#3d5a3e;font-weight:600;text-decoration:none;">kontakt@pension-volgenandt.de</a>
      </td></tr>
    </table>

    <p style="margin:0;font-size:15px;line-height:1.8;color:#444;">
      Wir freuen uns sehr auf Sie und w&uuml;nschen Ihnen schon jetzt einen wundersch&ouml;nen Tag im Eichsfeld &ndash; genießen Sie jeden Augenblick!<br><br>
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
// Build guest DECLINE email HTML
// ---------------------------------------------------------------------------
function buildDeclineEmail(array $booking, array $parsed): string {
    $name    = htmlspecialchars($booking['name'], ENT_QUOTES, 'UTF-8');
    $datum   = htmlspecialchars($parsed['datum'], ENT_QUOTES, 'UTF-8');
    $paket   = htmlspecialchars($parsed['paket'], ENT_QUOTES, 'UTF-8');
    $amount  = number_format($booking['amount'], 2, ',', '.') . '&nbsp;&euro;';

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
      leider m&uuml;ssen wir Ihnen mitteilen, dass wir Ihren Wunschtermin am <strong>' . $datum . '</strong>
      f&uuml;r das Paket <strong>' . $paket . '</strong> nicht best&auml;tigen k&ouml;nnen &ndash;
      dieser Tag ist bei uns leider bereits ausgebucht.
    </p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.7;">
      Es tut uns sehr leid! Wir w&uuml;rden uns freuen, wenn Sie einen anderen Termin w&auml;hlen m&ouml;chten.
      Kommen Sie einfach auf uns zu &ndash; wir helfen Ihnen gerne, einen passenden Tag zu finden.
    </p>

    <h2 style="margin:0 0 12px;font-size:16px;color:#3d5a3e;border-bottom:2px solid #e8e4dc;padding-bottom:8px;">R&uuml;ckerstattung</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef9ee;border-radius:6px;margin:0 0 24px;">
      <tr><td style="padding:16px;font-size:14px;line-height:1.6;">
        Der bezahlte Betrag von <strong>' . $amount . '</strong> wird automatisch &uuml;ber PayPal zur&uuml;ckerstattet.
        Dies kann je nach Bank <strong>3–5 Werktage</strong> dauern.
        Bei Fragen zur R&uuml;ckerstattung melden Sie sich bitte bei uns.
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;border-radius:6px;margin:0 0 24px;">
      <tr><td style="padding:16px;font-size:14px;line-height:1.9;">
        &#128222;&nbsp;<a href="tel:+4916097719112" style="color:#3d5a3e;font-weight:600;text-decoration:none;">0160 97719112</a><br>
        &#9993;&nbsp;<a href="mailto:kontakt@pension-volgenandt.de" style="color:#3d5a3e;font-weight:600;text-decoration:none;">kontakt@pension-volgenandt.de</a>
      </td></tr>
    </table>

    <p style="margin:0 0 18px;">
      <a href="https://www.pension-volgenandt.de/picknick/buchen/"
         style="display:inline-block;background:#3d5a3e;color:#fff;text-decoration:none;
                padding:12px 24px;border-radius:6px;font-size:14px;font-weight:700;">
        &#127826; Neuen Termin w&auml;hlen
      </a>
    </p>

    <p style="margin:0;font-size:15px;line-height:1.8;color:#444;">
      Wir hoffen sehr, Sie bald bei uns begr&uuml;&szlig;en zu d&uuml;rfen!<br><br>
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
// Simple admin response page
// ---------------------------------------------------------------------------
function adminPage(string $title, string $message, string $color = '#3d5a3e'): void {
    header('Content-Type: text/html; charset=UTF-8');
    echo '<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>' . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . '</title>
    <style>body{font-family:Arial,sans-serif;background:#f7f5f0;display:flex;align-items:center;
    justify-content:center;min-height:100vh;margin:0;}
    .box{background:#fff;border-radius:10px;padding:40px 36px;max-width:480px;width:90%;
    box-shadow:0 2px 12px rgba(0,0,0,.08);text-align:center;}
    h1{color:' . $color . ';margin:0 0 16px;font-size:22px;}
    p{color:#555;line-height:1.6;margin:0;font-size:15px;}</style>
    </head><body><div class="box">
    <h1>' . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . '</h1>
    <p>' . $message . '</p>
    </div></body></html>';
    exit;
}

// ---------------------------------------------------------------------------
// Main logic
// ---------------------------------------------------------------------------
$token  = trim($_GET['token'] ?? $_POST['token'] ?? '');
$action = trim($_GET['action'] ?? $_POST['action'] ?? '');

if ($token === '' || !preg_match('/^[a-f0-9]{32}$/', $token)) {
    adminPage('Ungültiger Link', 'Dieser Link ist ungültig oder abgelaufen.', '#c0392b');
}
if (!in_array($action, ['accept', 'decline'], true)) {
    adminPage('Ungültige Aktion', 'Die Aktion ist unbekannt.', '#c0392b');
}

$file = "$bookingsDir/$token.json";
if (!file_exists($file)) {
    adminPage('Buchung nicht gefunden', 'Diese Buchung existiert nicht oder wurde bereits bearbeitet.', '#c0392b');
}

$booking = json_decode(file_get_contents($file), true);
if (!is_array($booking)) {
    adminPage('Fehler', 'Buchungsdaten konnten nicht gelesen werden.', '#c0392b');
}

// Prevent double-processing
if (($booking['status'] ?? 'pending') !== 'pending') {
    $prevAction = $booking['status'] === 'accepted' ? 'bestätigt' : 'abgelehnt';
    adminPage(
        'Bereits bearbeitet',
        'Diese Buchung wurde bereits <strong>' . $prevAction . '</strong> am '
        . htmlspecialchars($booking['handledAt'] ?? '', ENT_QUOTES, 'UTF-8') . '.',
        '#888'
    );
}

$parsed = parseBookingMessage($booking['message'] ?? '');

// ---------------------------------------------------------------------------
// Execute action immediately (GET or POST)
// ---------------------------------------------------------------------------
if ($action === 'accept') {
    $emailHtml    = buildConfirmationEmail($booking, $parsed, $packageContents);
    $emailSubject = 'Ihr Picknick-Korb ist bestätigt! 🧺 – ' . $parsed['datum'];
} else {
    $emailHtml    = buildDeclineEmail($booking, $parsed);
    $emailSubject = 'Ihre Picknick-Anfrage bei Pension Volgenandt';
}

$result = sendSmtp(
    $smtpHost, $smtpPort, $smtpUser, $smtpPass,
    $adminEmail,
    $booking['email'],
    $emailSubject,
    $emailHtml,
    'Simone & Ralf Volgenandt', $adminEmail,
    $adminEmail, true
);

if (!$result['ok']) {
    adminPage('Fehler beim E-Mail-Versand',
        'Die E-Mail konnte nicht gesendet werden. Bitte versuche es erneut oder kontaktiere den Gast manuell unter '
        . htmlspecialchars($booking['email'], ENT_QUOTES, 'UTF-8') . '.<br><br>Fehler: '
        . htmlspecialchars($result['error'] ?? '', ENT_QUOTES, 'UTF-8'),
        '#c0392b'
    );
}

// Mark as handled
$booking['status']    = $action === 'accept' ? 'accepted' : 'declined';
$booking['handledAt'] = date('c');
file_put_contents($file, json_encode($booking, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// Decrement blocked-dates if declined
if ($action === 'decline' && !empty($booking['bookingDate'])) {
    $blockedFile = __DIR__ . '/blocked-dates.json';
    if (file_exists($blockedFile)) {
        $blockedData = json_decode(file_get_contents($blockedFile), true) ?? [];
        $date = $booking['bookingDate'];
        if (isset($blockedData[$date]) && $blockedData[$date] > 0) {
            $blockedData[$date]--;
            if ($blockedData[$date] === 0) unset($blockedData[$date]);
            file_put_contents($blockedFile, json_encode($blockedData, JSON_PRETTY_PRINT));
        }
    }
}

// Success page for admin
if ($action === 'accept') {
    adminPage(
        '✅ Buchung bestätigt',
        'Die Bestätigungs-E-Mail wurde erfolgreich an <strong>'
        . htmlspecialchars($booking['name'], ENT_QUOTES, 'UTF-8') . '</strong> ('
        . htmlspecialchars($booking['email'], ENT_QUOTES, 'UTF-8')
        . ') gesendet.'
    );
} else {
    adminPage(
        '❌ Buchung abgelehnt',
        'Die Absage wurde an <strong>'
        . htmlspecialchars($booking['name'], ENT_QUOTES, 'UTF-8') . '</strong> ('
        . htmlspecialchars($booking['email'], ENT_QUOTES, 'UTF-8')
        . ') gesendet. Vergiss nicht, die PayPal-Rückerstattung manuell auszulösen.',
        '#c0392b'
    );
}
