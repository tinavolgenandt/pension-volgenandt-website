<?php
/**
 * Invoice PDF generator.
 *
 * Requires mPDF:
 *   cd server && composer require mpdf/mpdf
 *   Then upload the generated vendor/ directory to the server.
 *
 * Public API:
 *   buildInvoiceHtml(array $draft): string   — renders the invoice as HTML
 *   generateInvoicePdf(array $draft): string — returns raw PDF bytes (needs mPDF)
 *
 * Scenario A: Booking confirmation (page 1) + Invoice (page 2) combined PDF.
 * Scenario B: Invoice-only PDF.
 */

require_once __DIR__ . '/config.php';

// ---------------------------------------------------------------------------
// GiroCode (EPC QR) helpers
// ---------------------------------------------------------------------------

function buildGiroCodeData(array $draft): string {
    $issuer = $draft['issuer'];
    $totals = $draft['totals'];
    $invNum = $draft['invoiceNumber'] ?? '';
    $amount = number_format((float)($totals['total'] ?? 0), 2, '.', '');
    $ref    = mb_substr('Rechnung ' . $invNum . ' ' . trim($draft['guest']['name'] ?? ''), 0, 140);

    // EPC QR Code v2 — 12 lines, LF-separated
    return implode("\n", [
        'BCD',               // Service Tag
        '002',               // Version
        '1',                 // Encoding: UTF-8
        'SCT',               // SEPA Credit Transfer
        $issuer['bic']  ?? '',
        $issuer['name'] ?? '',
        $issuer['iban'] ?? '',
        'EUR' . $amount,
        '',                  // Purpose code (empty)
        '',                  // Structured reference (empty)
        $ref,                // Unstructured remittance
        '',                  // Originator info (empty)
    ]);
}

function buildGiroQrImg(array $draft, int $size = 130): string {
    try {
        $autoload = __DIR__ . '/vendor/autoload.php';
        if (!file_exists($autoload)) return '';
        require_once $autoload;
        if (!class_exists('Endroid\\QrCode\\Builder\\Builder')) return '';

        $result = \Endroid\QrCode\Builder\Builder::create()
            ->writer(new \Endroid\QrCode\Writer\SvgWriter())
            ->data(buildGiroCodeData($draft))
            ->errorCorrectionLevel(\Endroid\QrCode\ErrorCorrectionLevel::Medium)
            ->size($size)
            ->margin(4)
            ->build();

        $b64 = base64_encode($result->getString());
        return '<img src="data:image/svg+xml;base64,' . $b64
            . '" width="' . $size . '" height="' . $size . '" style="display:block;margin:0 auto;">';
    } catch (\Throwable $e) {
        return '';
    }
}

// ---------------------------------------------------------------------------
// HTML template
// ---------------------------------------------------------------------------

/**
 * Render the complete invoice HTML.
 * This is also used for the review-page preview (without PDF conversion).
 */
function buildInvoiceHtml(array $draft): string {
    $scenario = $draft['scenario'] ?? 'B';
    $guest    = $draft['guest'];
    $stay     = $draft['stay'];
    $issuer   = $draft['issuer'];
    $items    = $draft['lineItems'];
    $totals   = $draft['totals'];

    $invNum  = h($draft['invoiceNumber'] ?? '');
    $invDate = $draft['invoiceDate']
        ? date('d.m.Y', strtotime($draft['invoiceDate']))
        : '(noch nicht freigegeben)';

    $guestName   = h($guest['name']);
    $addrStreet  = h(trim($guest['address'] ?? ''));
    $addrZipCity = h(trim(($guest['zip'] ?? '') . ' ' . ($guest['city'] ?? '')));

    $isFirmenrechnung = !empty($draft['isFirmenrechnung']);
    $companyLine = '';
    if ($isFirmenrechnung && !empty($draft['companyName'])) {
        $companyLine = h($draft['companyName']) . '<br>';
    }
    // Beds24 booking ID — always present on the draft, shown on every invoice
    // so the guest/company reference matches what's in Beds24. Kept separate
    // from the manually-entered Firmenrechnung reference below (a company's
    // own internal order number, when they provide one).
    $bookingIdLine = '<p style="margin:8px 0 0;font-size:11px;color:#666;">Buchungsnummer: ' . h((string)($draft['bookingId'] ?? '')) . '</p>';

    $bookingRefLine = '';
    if ($isFirmenrechnung && !empty($draft['bookingReference'])) {
        $bookingRefLine = '<p style="margin:2px 0 0;font-size:11px;color:#666;">Referenz Firma: ' . h($draft['bookingReference']) . '</p>';
    }

    $checkIn  = formatDate($stay['checkIn']  ?? '');
    $checkOut = formatDate($stay['checkOut'] ?? '');
    $nights   = (int)($stay['nights']   ?? 0);
    $adults   = (int)($stay['adults']   ?? 1);
    $children = (int)($stay['children'] ?? 0);
    $roomName = h($stay['roomName'] ?? 'Zimmer');

    $personStr = $adults . ' Erwachsene' . ($children > 0 ? ', ' . $children . ' Kinder' : '');

    $f = fn(float $v): string => number_format($v, 2, ',', '.') . '&nbsp;&euro;';

    // ------------------------------------------------------------------
    // Invoice page
    // ------------------------------------------------------------------
    $itemRows = '';
    foreach ($items as $item) {
        $qty       = (float)($item['qty']       ?? 1);
        $unitGross = (float)($item['unitGross'] ?? $item['grossAmount']);
        $qtyStr    = (fmod($qty, 1.0) < 0.001) ? (string)(int)$qty : number_format($qty, 1, ',', '.');
        $itemRows .= '<tr>'
            . '<td style="padding:8px 6px;border-bottom:1px solid #eee;">' . h($item['description']) . '</td>'
            . '<td style="padding:8px 6px;border-bottom:1px solid #eee;text-align:center;width:50px;">' . $qtyStr . '</td>'
            . '<td style="padding:8px 6px;border-bottom:1px solid #eee;text-align:right;width:100px;">' . $f($unitGross) . '</td>'
            . '<td style="padding:8px 6px;border-bottom:1px solid #eee;text-align:right;font-weight:600;width:100px;">' . $f((float)$item['grossAmount']) . '</td>'
            . '</tr>';
    }

    $vatSummary = '';
    if ($totals['gross7'] > 0) {
        $vatSummary .= '<tr>'
            . '<td style="padding:5px 0;color:#555;">7% MwSt. auf ' . $f((float)$totals['net7']) . '</td>'
            . '<td style="padding:5px 0;text-align:right;">' . $f((float)$totals['vat7']) . '</td>'
            . '</tr>';
    }
    if ($totals['gross19'] > 0) {
        $vatSummary .= '<tr>'
            . '<td style="padding:5px 0;color:#555;">19% MwSt. auf ' . $f((float)$totals['net19']) . '</td>'
            . '<td style="padding:5px 0;text-align:right;">' . $f((float)$totals['vat19']) . '</td>'
            . '</tr>';
    }

    // PayPal.me link (only when configured in config.php)
    $paypalBlock = '';
    if (defined('PAYPAL_ME_URL') && PAYPAL_ME_URL !== '') {
        $ppAmount = number_format((float)($totals['total'] ?? 0), 2, '.', '');
        $ppUrl    = htmlspecialchars(rtrim(PAYPAL_ME_URL, '/') . '/' . $ppAmount, ENT_QUOTES, 'UTF-8');
        $paypalBlock = '
<table width="100%" style="border-collapse:collapse;margin-top:12px;">
  <tr>
    <td style="background:#eaf4fb;padding:10px 14px;border-radius:5px;text-align:center;">
      <p style="margin:0 0 6px;font-size:11px;color:#555;">Oder bequem online bezahlen:</p>
      <table style="border-collapse:collapse;margin:0 auto;">
        <tr>
          <td style="background:#0070ba;padding:8px 22px;border-radius:4px;">
            <a href="' . $ppUrl . '" style="color:#ffffff;text-decoration:none;font-weight:bold;font-size:13px;">Mit PayPal bezahlen</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>';
    }

    $bankLines = '';
    $qrImg     = '';
    if (!empty($issuer['iban'])) {
        $bnName    = !empty($issuer['bankName']) ? h($issuer['bankName']) . '<br>' : '';
        $bicStr    = !empty($issuer['bic'])      ? 'BIC:&nbsp;' . h($issuer['bic']) . '<br>' : '';
        $bankLines = 'Kontoinhaber:&nbsp;Ralf Volgenandt<br>'
            . $bnName
            . 'IBAN:&nbsp;' . h($issuer['iban']) . '<br>'
            . $bicStr
            . 'Verwendungszweck:&nbsp;Rechnung&nbsp;' . $invNum . '&nbsp;&ndash;&nbsp;' . $guestName;
        $qrImg = buildGiroQrImg($draft);
    }

    $noteBlock = '';
    if (!empty($draft['note'])) {
        $noteBlock = '<div style="margin-top:16px;padding:10px 14px;background:#fef9ee;border-radius:4px;font-size:12px;">'
            . '<strong>Hinweis:</strong> ' . h($draft['note'])
            . '</div>';
    }

    $ohneFruehstueckBlock = '';
    if (!empty($draft['ohneFruehstueck'])) {
        $ohneFruehstueckBlock = '<div style="margin-top:16px;padding:10px 14px;background:#fef9ee;border-radius:4px;font-size:12px;">'
            . '<strong>Hinweis:</strong> Der ausgewiesene Preis versteht sich ohne Frühstück.'
            . '</div>';
    }

    // The generic "storniert nach X Tagen" warning assumes the standard
    // 7-Tage guest term. Firmenrechnungen already state an exact due date in
    // paymentNote (see computeDueDate() in invoice-draft.php) — showing both
    // would be redundant and could disagree if the due date ever needs a
    // manual override, so it's skipped for Firmenrechnungen.
    $stornoWarning = $isFirmenrechnung ? '' : '
    <div style="margin-bottom:12px;padding:10px 14px;background:#fff3cd;border-left:3px solid #e6a817;border-radius:4px;font-size:11px;line-height:1.5;color:#333;">
      <strong>Wichtiger Hinweis:</strong> Sollte die Zahlung nicht innerhalb von 7 Tagen eingehen,
      behalten wir uns vor, die Buchung automatisch zu stornieren.
    </div>';

    return '<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><title>Rechnung ' . $invNum . '</title></head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#333;">
<div style="padding:48px 52px 60px;">
  ' . invoiceHeader($issuer, 'Rechnung', $invDate, $invNum) . '

  <!-- Recipient / stay period -->
  <table width="100%" style="margin:32px 0 28px;border-collapse:collapse;">
    <tr>
      <td style="vertical-align:top;width:50%;">
        <p style="margin:0 0 4px;font-size:10px;color:#999;text-transform:uppercase;letter-spacing:0.5px;">Rechnungsempfänger</p>
        <p style="margin:0;font-size:13px;line-height:1.7;">
          ' . $companyLine . '
          <strong>' . $guestName . '</strong><br>
          ' . ($addrStreet ? $addrStreet . '<br>' : '') . '
          ' . ($addrZipCity ?: '<span style="color:#aaa;">(Adresse nicht angegeben)</span>') . '
        </p>
        ' . $bookingIdLine . '
        ' . $bookingRefLine . '
      </td>
      <td style="vertical-align:top;text-align:right;">
        <p style="margin:0 0 4px;font-size:10px;color:#999;text-transform:uppercase;letter-spacing:0.5px;">Leistungszeitraum</p>
        <p style="margin:0;font-size:13px;line-height:1.7;">
          ' . $checkIn . ' – ' . $checkOut . '<br>
          <span style="color:#666;">' . $nights . ' Nächte · ' . $roomName . '</span>
        </p>
      </td>
    </tr>
  </table>

  <!-- Line items -->
  <table width="100%" style="border-collapse:collapse;margin-bottom:24px;font-size:13px;">
    <thead>
      <tr style="background:#c8e6c9;color:#2d4a2e;">
        <th style="padding:10px 6px;text-align:left;font-weight:600;">Leistung</th>
        <th style="padding:10px 6px;text-align:center;font-weight:600;width:50px;">Anzahl</th>
        <th style="padding:10px 6px;text-align:right;font-weight:600;width:100px;">Einzelpreis</th>
        <th style="padding:10px 6px;text-align:right;font-weight:600;width:100px;">Brutto</th>
      </tr>
    </thead>
    <tbody>' . $itemRows . '</tbody>
  </table>

  <!-- Totals block (right-aligned via outer table — mPDF does not support flexbox) -->
  <table width="100%" style="border-collapse:collapse;margin-bottom:0;">
    <tr>
      <td></td>
      <td width="300">
        <table width="100%" style="font-size:13px;border-collapse:collapse;">
          ' . $vatSummary . '
          <tr style="border-top:2px solid #3d5a3e;">
            <td style="padding:10px 0;font-size:16px;font-weight:700;color:#3d5a3e;">Gesamtbetrag</td>
            <td style="padding:10px 0;text-align:right;font-size:16px;font-weight:700;color:#3d5a3e;padding-left:24px;">' . $f((float)$totals['total']) . '</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  ' . $ohneFruehstueckBlock . '

  <!-- Payment info -->
  <div style="margin-top:28px;padding:14px 0;font-size:12px;line-height:1.8;">
    <p style="margin:0 0 8px;font-size:13px;"><strong>Zahlungsbedingungen:</strong> ' . h($draft['paymentNote'] ?? '') . '</p>
    ' . $stornoWarning . '
    <table width="100%" style="border-collapse:collapse;">
      <tr>
        <td style="vertical-align:top;padding-right:16px;">
          <p style="margin:0 0 4px;font-size:12px;"><strong>Banküberweisung:</strong></p>
          <p style="margin:0;font-size:12px;line-height:1.8;">' . $bankLines . '</p>
        </td>
        ' . ($qrImg ? '
        <td style="vertical-align:top;text-align:center;width:155px;">
          <p style="margin:0 0 4px;font-size:10px;color:#555;text-align:center;"><strong>Per Banking-App scannen:</strong></p>
          ' . $qrImg . '
          <p style="margin:4px 0 0;font-size:9px;color:#aaa;text-align:center;">GiroCode &middot; SEPA-&Uuml;berweisung</p>
        </td>' : '') . '
      </tr>
    </table>
    ' . $paypalBlock . '
  </div>

  ' . $noteBlock . '

  <!-- Page footer -->
  <div style="margin-top:40px;padding-top:14px;border-top:1px solid #ddd;font-size:11px;color:#aaa;text-align:center;">
    ' . h($issuer['name']) . ' · ' . h($issuer['street']) . ' · ' . h($issuer['city']) . ' ·
    Tel.: 0160&nbsp;97719112 · kontakt@pension-volgenandt.de · www.pension-volgenandt.de
  </div>
</div>
</body>
</html>';
}

// ---------------------------------------------------------------------------
// Shared header block
// ---------------------------------------------------------------------------

function invoiceHeader(array $issuer, string $docType, string $date, string $docNumber = ''): string {
    $numLine = $docNumber ? '<span style="font-size:13px;color:#555;">Nr. ' . h($docNumber) . '</span><br>' : '';

    return '
<table width="100%" style="border-collapse:collapse;">
  <tr>
    <td style="vertical-align:top;">
      <strong style="font-size:20px;">' . h($issuer['name']) . '</strong><br>
      <span style="font-size:12px;color:#666;">' . h($issuer['street']) . '</span><br>
      <span style="font-size:12px;color:#666;">' . h($issuer['city']) . '</span><br>
      <span style="font-size:11px;color:#999;">Steuernummer: ' . h($issuer['taxId']) . '</span>
    </td>
    <td style="text-align:right;vertical-align:top;">
      <strong style="font-size:16px;">' . h($docType) . '</strong><br>
      ' . $numLine . '
      <span style="font-size:12px;color:#888;">Datum: ' . h($date) . '</span>
    </td>
  </tr>
</table>';
}

// ---------------------------------------------------------------------------
// PDF generation (requires mPDF — see installation note at top of file)
// ---------------------------------------------------------------------------

/**
 * Generate a PDF from a draft. Returns raw PDF bytes (string).
 *
 * Installation:
 *   cd server && composer require mpdf/mpdf
 *   Upload the generated vendor/ directory to the server.
 */
function generateInvoicePdf(array $draft): string {
    $autoload = __DIR__ . '/vendor/autoload.php';
    if (!file_exists($autoload)) {
        throw new \RuntimeException(
            'mPDF not installed. Run: cd server && composer require mpdf/mpdf'
        );
    }

    require_once $autoload;

    $mpdf = new \Mpdf\Mpdf([
        'mode'          => 'utf-8',
        'format'        => 'A4',
        'margin_top'    => 0,
        'margin_bottom' => 0,
        'margin_left'   => 0,
        'margin_right'  => 0,
        'tempDir'       => sys_get_temp_dir(),
    ]);

    $mpdf->WriteHTML(buildInvoiceHtml($draft));

    return $mpdf->Output('', 'S');
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function h(string $s): string {
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

function formatDate(string $date): string {
    if (!$date) return '–';
    $ts = strtotime($date);
    return $ts !== false ? date('d.m.Y', $ts) : h($date);
}
