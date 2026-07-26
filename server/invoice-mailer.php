<?php
/**
 * Email helper for the invoice workflow.
 *
 * Public API:
 *   sendMail(string $to, string $toName, string $subject, string $html, string $text, array $attachments): bool
 *   notifySimone(array $draft): bool           — sends review-link email to ADMIN_EMAIL
 *   notifySimoneAutoSent(array $draft, bool $emailSent): bool — FYI for auto-sent (fully paid) bookings
 *   sendInvoiceToGuest(array $draft, string $pdfBytes): bool
 */

require_once __DIR__ . '/config.php';

// ---------------------------------------------------------------------------
// Low-level SMTP wrapper (PHPMailer)
// ---------------------------------------------------------------------------

function sendMail(
    string $to,
    string $toName,
    string $subject,
    string $html,
    string $text = '',
    array  $attachments = [],
    array  $cc = []
): bool {
    $autoload = __DIR__ . '/vendor/autoload.php';
    if (!file_exists($autoload)) {
        error_log('[invoice-mailer] vendor/autoload.php not found — run composer install');
        return false;
    }
    require_once $autoload;

    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USER;
        $mail->Password   = SMTP_PASS;
        $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = SMTP_PORT;
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom(SMTP_USER, MAIL_FROM_NAME);
        $mail->addAddress($to, $toName);
        foreach ($cc as $ccAddr) {
            $mail->addCC($ccAddr);
        }
        $mail->Subject = $subject;
        $mail->isHTML(true);
        $mail->Body    = $html;
        $mail->AltBody = $text ?: strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $html));

        foreach ($attachments as $att) {
            $mail->addStringAttachment(
                $att['data'],
                $att['filename'],
                \PHPMailer\PHPMailer\PHPMailer::ENCODING_BASE64,
                $att['mime'] ?? 'application/pdf'
            );
        }

        $mail->send();
        return true;
    } catch (\Exception $e) {
        error_log('[invoice-mailer] ' . $mail->ErrorInfo);
        return false;
    }
}

// ---------------------------------------------------------------------------
// Notify Simone that a new draft is ready to review
// ---------------------------------------------------------------------------

function notifySimone(array $draft): bool {
    $guest   = $draft['guest'];
    $stay    = $draft['stay'];
    $totals  = $draft['totals'];
    $token   = $draft['token'];
    $invNum  = $draft['invoiceNumber'] ?? '';
    $total   = number_format((float)($totals['total'] ?? 0), 2, ',', '.');
    $link    = INVOICE_BASE_URL . '/invoice-review.php?token=' . urlencode($token);

    $checkIn  = $stay['checkIn']  ? date('d.m.Y', strtotime($stay['checkIn']))  : '–';
    $checkOut = $stay['checkOut'] ? date('d.m.Y', strtotime($stay['checkOut'])) : '–';

    $subject = 'Neue Rechnung prüfen: ' . ($guest['name'] ?? '') . ' – ' . $total . ' €';

    $html = '
<div style="font-family:Arial,sans-serif;font-size:14px;color:#333;max-width:540px;">
  <h2 style="color:#3d5a3e;margin:0 0 16px;">Neuer Rechnungsentwurf</h2>
  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
    <tr><td style="padding:6px 10px;color:#666;width:130px;">Rechnungs-Nr.</td><td style="padding:6px 10px;"><strong>' . htmlspecialchars($invNum) . '</strong></td></tr>
    <tr style="background:#f9f9f9;"><td style="padding:6px 10px;color:#666;">Gast</td><td style="padding:6px 10px;">' . htmlspecialchars($guest['name'] ?? '') . '</td></tr>
    <tr><td style="padding:6px 10px;color:#666;">Zimmer</td><td style="padding:6px 10px;">' . htmlspecialchars($stay['roomName'] ?? '') . '</td></tr>
    <tr style="background:#f9f9f9;"><td style="padding:6px 10px;color:#666;">Zeitraum</td><td style="padding:6px 10px;">' . $checkIn . ' – ' . $checkOut . ' (' . (int)($stay['nights'] ?? 0) . ' Nächte)</td></tr>
    <tr><td style="padding:6px 10px;color:#666;">Betrag</td><td style="padding:6px 10px;"><strong>' . $total . ' €</strong></td></tr>
  </table>
  <a href="' . htmlspecialchars($link) . '" style="display:inline-block;background:#3d5a3e;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">Rechnung prüfen &amp; genehmigen →</a>
  <p style="margin-top:20px;font-size:12px;color:#aaa;">
    Oder Link kopieren:<br>' . htmlspecialchars($link) . '
  </p>
</div>';

    return sendMail(ADMIN_EMAIL, 'Simone Volgenandt', $subject, $html);
}

// ---------------------------------------------------------------------------
// FYI notice: booking was already paid in full, confirmation auto-sent
// ---------------------------------------------------------------------------

function notifySimoneAutoSent(array $draft, bool $emailSent): bool {
    $guest   = $draft['guest'];
    $stay    = $draft['stay'];
    $totals  = $draft['totals'];
    $token   = $draft['token'];
    $invNum  = $draft['invoiceNumber'] ?? '';
    $total   = number_format((float)($totals['total'] ?? 0), 2, ',', '.');
    $link    = INVOICE_BASE_URL . '/invoice-review.php?token=' . urlencode($token);

    $checkIn  = $stay['checkIn']  ? date('d.m.Y', strtotime($stay['checkIn']))  : '–';
    $checkOut = $stay['checkOut'] ? date('d.m.Y', strtotime($stay['checkOut'])) : '–';

    $subject = 'Buchungsbestätigung automatisch versendet: ' . ($guest['name'] ?? '') . ' – ' . $total . ' €';
    $statusLine = $emailSent
        ? 'Die Buchungsbestätigung wurde bereits automatisch an den Gast gesendet.'
        : 'Achtung: Der Gast hat keine E-Mail-Adresse hinterlegt — die Bestätigung konnte nicht gesendet werden.';

    $html = '
<div style="font-family:Arial,sans-serif;font-size:14px;color:#333;max-width:540px;">
  <h2 style="color:#3d5a3e;margin:0 0 8px;">Buchung bereits vollständig bezahlt</h2>
  <p style="margin:0 0 16px;line-height:1.6;">' . htmlspecialchars($statusLine) . ' Keine Aktion erforderlich — nur zur Info.</p>
  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
    <tr><td style="padding:6px 10px;color:#666;width:130px;">Rechnungs-Nr.</td><td style="padding:6px 10px;"><strong>' . htmlspecialchars($invNum) . '</strong></td></tr>
    <tr style="background:#f9f9f9;"><td style="padding:6px 10px;color:#666;">Gast</td><td style="padding:6px 10px;">' . htmlspecialchars($guest['name'] ?? '') . '</td></tr>
    <tr><td style="padding:6px 10px;color:#666;">Zimmer</td><td style="padding:6px 10px;">' . htmlspecialchars($stay['roomName'] ?? '') . '</td></tr>
    <tr style="background:#f9f9f9;"><td style="padding:6px 10px;color:#666;">Zeitraum</td><td style="padding:6px 10px;">' . $checkIn . ' – ' . $checkOut . ' (' . (int)($stay['nights'] ?? 0) . ' Nächte)</td></tr>
    <tr><td style="padding:6px 10px;color:#666;">Betrag (bezahlt)</td><td style="padding:6px 10px;"><strong>' . $total . ' €</strong></td></tr>
  </table>
  <a href="' . htmlspecialchars($link) . '" style="display:inline-block;background:#3d5a3e;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">Rechnung ansehen →</a>
</div>';

    return sendMail(ADMIN_EMAIL, 'Simone Volgenandt', $subject, $html);
}

// ---------------------------------------------------------------------------
// Send approved invoice PDF to the guest
// ---------------------------------------------------------------------------

function sendInvoiceToGuest(array $draft, string $pdfBytes): bool {
    $guest    = $draft['guest'];
    $stay     = $draft['stay'];
    $issuer   = $draft['issuer'];
    $totals   = $draft['totals'];
    $invNum   = $draft['invoiceNumber'] ?? '';
    $scenario = $draft['scenario'] ?? 'B';

    $email = $guest['email'] ?? '';
    $name  = $guest['name']  ?? '';
    if (!$email) return false;

    $esc       = fn(string $s): string => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
    $guestName = $esc($name);
    $checkIn   = ($stay['checkIn']  ?? '') ? date('d.m.Y', strtotime($stay['checkIn']))  : '–';
    $checkOut  = ($stay['checkOut'] ?? '') ? date('d.m.Y', strtotime($stay['checkOut'])) : '–';
    $nights    = (int)($stay['nights']   ?? 0);
    $adults    = (int)($stay['adults']   ?? 1);
    $children  = (int)($stay['children'] ?? 0);
    $roomName  = $esc($stay['roomName'] ?? 'Zimmer');
    $total     = number_format((float)($totals['total'] ?? 0), 2, ',', '.') . '&nbsp;&euro;';
    $personStr = $adults . ' Erwachsene' . ($children > 0 ? ', ' . $children . ' Kinder' : '');

    // Bank transfer block
    $bankHtml = '';
    if (!empty($issuer['iban'])) {
        $bn       = !empty($issuer['bankName']) ? $esc($issuer['bankName']) . '<br>' : '';
        $bic      = !empty($issuer['bic'])      ? 'BIC: ' . $esc($issuer['bic']) . '<br>' : '';
        $bankHtml = '
<p style="background:#f0f7ee;padding:12px 16px;border-radius:6px;font-size:13px;line-height:1.9;margin:0 0 16px;">
  ' . $bn . 'IBAN: ' . $esc($issuer['iban']) . '<br>' . $bic . '
  Verwendungszweck: Rechnung ' . $esc($invNum) . ' &ndash; ' . $guestName . '
</p>';
    }

    // PayPal button
    $ppBtn = '';
    if (defined('PAYPAL_ME_URL') && PAYPAL_ME_URL !== '') {
        $ppAmount = number_format((float)($totals['total'] ?? 0), 2, '.', '');
        $ppUrl    = $esc(rtrim(PAYPAL_ME_URL, '/') . '/' . $ppAmount);
        $ppBtn    = '
<p style="text-align:center;margin:0 0 4px;font-size:13px;color:#555;">Oder bequem online bezahlen:</p>
<p style="text-align:center;margin:0 0 20px;">
  <a href="' . $ppUrl . '" style="display:inline-block;background:#0070ba;color:#fff;padding:11px 28px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;">Mit PayPal bezahlen</a>
</p>';
    }

    // Cancellation warning
    $cancelNote = '
<p style="background:#fff3cd;border-left:4px solid #e6a817;padding:10px 14px;border-radius:4px;font-size:13px;line-height:1.6;margin:0 0 20px;">
  <strong>Wichtiger Hinweis:</strong> Sollte die Zahlung nicht innerhalb von 7 Tagen eingehen,
  behalten wir uns vor, die Buchung automatisch zu stornieren.
</p>';

    // Sign-off
    $signOff = '
<p style="margin:0;">Mit freundlichen Grüßen<br>
  <strong>Simone &amp; Ralf Volgenandt</strong><br>
  <span style="font-size:12px;color:#888;">Tel.: 0160&nbsp;97719112 &middot; kontakt@pension-volgenandt.de</span>
</p>';

    if ($scenario === 'A') {
        $subject = 'Buchungsbestätigung – Pension Volgenandt';
        $html = '
<div style="font-family:Arial,sans-serif;font-size:14px;color:#333;max-width:560px;">
  <h2 style="color:#3d5a3e;margin:0 0 4px;font-size:20px;">Buchungsbestätigung</h2>
  <p style="margin:0 0 20px;font-size:12px;color:#999;">Buchungsdatum: ' . date('d.m.Y') . '</p>

  <p style="margin:0 0 12px;">Sehr geehrte/r ' . $guestName . ',</p>
  <p style="line-height:1.7;margin:0 0 20px;">
    wir freuen uns, Ihre Buchung bestätigen zu können, und heißen Sie herzlich willkommen in unserem Haus.
  </p>

  <table style="width:100%;border-collapse:collapse;margin:0 0 20px;background:#f9f7f3;border-radius:6px;">
    <tr>
      <td style="padding:10px 14px;color:#666;width:38%;">Zimmer</td>
      <td style="padding:10px 14px;font-weight:700;">' . $roomName . '</td>
    </tr>
    <tr style="border-top:1px solid #ede9e1;">
      <td style="padding:10px 14px;color:#666;">Anreise</td>
      <td style="padding:10px 14px;">' . $checkIn . ' ab 14:00 Uhr</td>
    </tr>
    <tr style="border-top:1px solid #ede9e1;">
      <td style="padding:10px 14px;color:#666;">Abreise</td>
      <td style="padding:10px 14px;">' . $checkOut . ' bis 11:00 Uhr</td>
    </tr>
    <tr style="border-top:1px solid #ede9e1;">
      <td style="padding:10px 14px;color:#666;">Personen</td>
      <td style="padding:10px 14px;">' . $personStr . '</td>
    </tr>
    <tr style="border-top:1px solid #ede9e1;">
      <td style="padding:10px 14px;color:#666;">Nächte</td>
      <td style="padding:10px 14px;">' . $nights . '</td>
    </tr>
    <tr style="border-top:1px solid #ede9e1;">
      <td style="padding:10px 14px;color:#666;">Gesamtbetrag</td>
      <td style="padding:10px 14px;font-weight:700;">' . $total . '</td>
    </tr>
  </table>

  <p style="line-height:1.7;margin:0 0 12px;">
    Im Anhang finden Sie Ihre Rechnung Nr. <strong>' . $esc($invNum) . '</strong>.
    Bitte begleichen Sie den Betrag innerhalb von <strong>7 Tagen</strong>:
  </p>

  ' . $bankHtml . $ppBtn . $cancelNote . '

  <p style="font-size:13px;color:#555;margin:0 0 20px;line-height:1.7;">
    Bei Fragen erreichen Sie uns unter
    <a href="mailto:kontakt@pension-volgenandt.de" style="color:#3d5a3e;">kontakt@pension-volgenandt.de</a>
    oder telefonisch unter <strong>0160&nbsp;97719112</strong>.
  </p>

  ' . $signOff . '
</div>';
    } else {
        $subject = 'Ihre aktualisierte Rechnung – Pension Volgenandt';
        $html = '
<div style="font-family:Arial,sans-serif;font-size:14px;color:#333;max-width:560px;">
  <p style="margin:0 0 12px;">Sehr geehrte/r ' . $guestName . ',</p>
  <p style="line-height:1.7;margin:0 0 20px;">anbei erhalten Sie Ihre aktualisierte Rechnung Nr.
     <strong>' . $esc($invNum) . '</strong> für Ihren Aufenthalt
     vom ' . $checkIn . ' bis ' . $checkOut . '.</p>
  <table style="width:100%;border-collapse:collapse;margin:0 0 20px;background:#f9f7f3;border-radius:6px;">
    <tr><td style="padding:10px 14px;color:#666;width:38%;">Zimmer</td><td style="padding:10px 14px;">' . $roomName . '</td></tr>
    <tr style="border-top:1px solid #ede9e1;"><td style="padding:10px 14px;color:#666;">Zeitraum</td><td style="padding:10px 14px;">' . $checkIn . ' – ' . $checkOut . '</td></tr>
    <tr style="border-top:1px solid #ede9e1;background:#f0f7ee;"><td style="padding:10px 14px;color:#666;">Gesamtbetrag</td><td style="padding:10px 14px;font-weight:700;color:#3d5a3e;">' . $total . '</td></tr>
  </table>
  <p style="line-height:1.7;margin:0 0 12px;">Bitte begleichen Sie den Betrag innerhalb von <strong>7 Tagen</strong>:</p>
  ' . $bankHtml . $ppBtn . $cancelNote . $signOff . '
</div>';
    }

    return sendMail($email, $name, $subject, $html, '', [
        ['data' => $pdfBytes, 'filename' => 'Rechnung-' . $invNum . '.pdf', 'mime' => 'application/pdf'],
    ], [ADMIN_EMAIL]);
}
