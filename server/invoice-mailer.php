<?php
/**
 * Email helper for the invoice workflow.
 *
 * Public API:
 *   sendMail(string $to, string $toName, string $subject, string $html, string $text, array $attachments): bool
 *   notifySimone(array $draft, bool $isRefresh = false): bool — sends review-link email to ADMIN_EMAIL
 *   buildGuestInvoiceEmailParts(array $draft, bool $isPaid): array — subject+intro only, for the editable preview form
 *   buildGuestInvoiceEmailHtml(array $draft, bool $isPaid, ?string $subjectOverride, ?string $introOverride): array — full subject+html, for preview or send
 *   sendInvoiceToGuest(array $draft, string $pdfBytes, bool $isPaid, ?string $subjectOverride, ?string $introOverride): bool
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
    array  $cc = [],
    array  $bcc = []
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
        foreach ($bcc as $bccAddr) {
            $mail->addBCC($bccAddr);
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

function notifySimone(array $draft, bool $isRefresh = false): bool {
    $guest     = $draft['guest'];
    $stay      = $draft['stay'];
    $totals    = $draft['totals'];
    $token     = $draft['token'];
    $prePaid   = !empty($draft['prePaid']);
    $isNachtrag = ($draft['scenario'] ?? '') === 'C';
    $suggested = peekNextInvoiceNumber();
    $total     = number_format((float)($totals['total'] ?? 0), 2, ',', '.');
    $link      = INVOICE_BASE_URL . '/invoice-review.php?token=' . urlencode($token);

    $checkIn  = $stay['checkIn']  ? date('d.m.Y', strtotime($stay['checkIn']))  : '–';
    $checkOut = $stay['checkOut'] ? date('d.m.Y', strtotime($stay['checkOut'])) : '–';

    if ($isNachtrag) {
        $subject = 'Zusatzrechnung prüfen (Extras): ' . ($guest['name'] ?? '') . ' – ' . $total . ' €';
        $heading = 'Neue Zusatzrechnung für Extras';
        $relatesTo = $draft['relatesTo'] ?? [];
        $intro = '<p style="margin:0 0 16px;line-height:1.6;">Für diese Buchung wurden nach der letzten Rechnung'
            . (!empty($relatesTo) ? ' (' . htmlspecialchars(implode(', ', $relatesTo)) . ')' : '')
            . ' zusätzliche Positionen in Beds24 erfasst. Diese Zusatzrechnung enthält nur die neuen Posten.</p>';
    } elseif ($isRefresh) {
        $subject = 'Rechnungsentwurf aktualisiert: ' . ($guest['name'] ?? '') . ' – ' . $total . ' €';
        $heading = 'Rechnungsentwurf aktualisiert';
        $intro   = '<p style="margin:0 0 16px;line-height:1.6;">Die Zahlen in Beds24 haben sich geändert, seit dieser Entwurf erstellt wurde — bitte noch einmal kurz prüfen, bevor freigegeben wird.</p>';
    } else {
        $subject = ($prePaid ? 'Bereits bezahlt – Rechnungsnummer prüfen: ' : 'Neue Rechnung prüfen: ')
            . ($guest['name'] ?? '') . ' – ' . $total . ' €';
        $heading = $prePaid ? 'Bereits bezahlt – bitte nur kurz prüfen' : 'Neuer Rechnungsentwurf';
        $intro   = $prePaid
            ? '<p style="margin:0 0 16px;line-height:1.6;">Diese Buchung wurde bereits vollständig bezahlt. Bitte kurz die Rechnungsnummer prüfen und freigeben — der Haken &bdquo;Bereits bezahlt&ldquo; ist schon gesetzt.</p>'
            : '';
    }

    $html = '
<div style="font-family:Arial,sans-serif;font-size:14px;color:#333;max-width:540px;">
  <h2 style="color:#3d5a3e;margin:0 0 16px;">' . $heading . '</h2>
  ' . $intro . '
  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
    <tr><td style="padding:6px 10px;color:#666;width:170px;">Voraussichtl. Rechnungs-Nr.</td><td style="padding:6px 10px;"><strong>' . htmlspecialchars($suggested) . '</strong></td></tr>
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
// Guest email — subject/intro (previewable/editable) vs. full send
// ---------------------------------------------------------------------------

/**
 * The scenario-dependent subject and opening paragraph of the guest invoice
 * email — the only two pieces Simone can edit on the review page before
 * sending (see [[invoicing-review-edits]]). Everything else (payment block,
 * bank details, cancellation warning, sign-off) is fixed and built in
 * sendInvoiceToGuest() itself, so those legally/financially relevant parts
 * can't be accidentally edited away.
 *
 * Returns ['subject' => string, 'intro' => string] — 'intro' is inner HTML
 * (inline tags like <strong> allowed), not wrapped in a <p> yet.
 */
function buildGuestInvoiceEmailParts(array $draft, bool $isPaid = false): array {
    $stay     = $draft['stay'];
    $invNum   = $draft['invoiceNumber'] ?? '';
    $scenario = $draft['scenario'] ?? 'B';

    $esc      = fn(string $s): string => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
    $checkIn  = ($stay['checkIn']  ?? '') ? date('d.m.Y', strtotime($stay['checkIn']))  : '–';
    $checkOut = ($stay['checkOut'] ?? '') ? date('d.m.Y', strtotime($stay['checkOut'])) : '–';

    if ($scenario === 'A') {
        return [
            'subject' => 'Ihre Rechnung zu Ihrer Buchung – Pension Volgenandt',
            'intro'   => 'vielen Dank für Ihre Buchung — Ihre Buchungsbestätigung haben Sie bereits separat erhalten. '
                . 'Anbei erhalten Sie nun Ihre Rechnung Nr. <strong>' . $esc($invNum) . '</strong> für Ihren Aufenthalt '
                . 'vom ' . $checkIn . ' bis ' . $checkOut . '.',
        ];
    }

    if ($scenario === 'C') {
        $relatesTo = $draft['relatesTo'] ?? [];
        $relatesToText = !empty($relatesTo)
            ? ' Sie ergänzt Ihre bereits erhaltene Rechnung Nr. ' . $esc(implode(', ', $relatesTo)) . '.'
            : '';
        return [
            'subject' => 'Ihre Rechnung für zusätzliche Leistungen – Pension Volgenandt',
            'intro'   => 'anbei erhalten Sie Ihre Rechnung Nr. <strong>' . $esc($invNum) . '</strong> für zusätzliche Leistungen '
                . 'während Ihres Aufenthalts vom ' . $checkIn . ' bis ' . $checkOut . '.' . $relatesToText,
        ];
    }

    return [
        'subject' => 'Ihre aktualisierte Rechnung – Pension Volgenandt',
        'intro'   => 'anbei erhalten Sie Ihre aktualisierte Rechnung Nr. <strong>' . $esc($invNum) . '</strong> für Ihren Aufenthalt '
            . 'vom ' . $checkIn . ' bis ' . $checkOut . '.',
    ];
}

// ---------------------------------------------------------------------------
// Send approved invoice PDF to the guest
// ---------------------------------------------------------------------------

/**
 * Builds the complete guest invoice email (subject + full HTML body) without
 * sending it — used both by sendInvoiceToGuest() and by the "ready" review
 * screen to show Simone exactly what will go out before she clicks send.
 *
 * $subjectOverride/$introOverride come from that review screen, where Simone
 * can tweak the subject/opening paragraph — see buildGuestInvoiceEmailParts()
 * for the defaults they start from. Overrides are treated as plain text
 * (escaped, newlines→<br>), not HTML, since they're typed into a plain
 * textarea.
 */
function buildGuestInvoiceEmailHtml(
    array $draft,
    bool $isPaid = false,
    ?string $subjectOverride = null,
    ?string $introOverride = null
): array {
    $guest    = $draft['guest'];
    $stay     = $draft['stay'];
    $issuer   = $draft['issuer'];
    $totals   = $draft['totals'];
    $invNum   = $draft['invoiceNumber'] ?? '';
    $scenario = $draft['scenario'] ?? 'B';

    $name = $guest['name'] ?? '';

    $isFirmenrechnung = !empty($draft['isFirmenrechnung']);

    $esc       = fn(string $s): string => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
    $guestName = $esc($name);
    $checkIn   = ($stay['checkIn']  ?? '') ? date('d.m.Y', strtotime($stay['checkIn']))  : '–';
    $checkOut  = ($stay['checkOut'] ?? '') ? date('d.m.Y', strtotime($stay['checkOut'])) : '–';
    $nights    = (int)($stay['nights']   ?? 0);
    $roomName  = $esc($stay['roomName'] ?? 'Zimmer');
    $total     = number_format((float)($totals['total'] ?? 0), 2, ',', '.') . '&nbsp;&euro;';

    $parts    = buildGuestInvoiceEmailParts($draft, $isPaid);
    $subject  = ($subjectOverride !== null && trim($subjectOverride) !== '') ? $subjectOverride : $parts['subject'];
    $introHtml = ($introOverride !== null && trim($introOverride) !== '')
        ? nl2br($esc($introOverride))
        : $parts['intro'];
    $introBlock = '<p style="line-height:1.7;margin:0 0 20px;">' . $introHtml . '</p>';

    // Payment section: either "please pay" (bank/PayPal/cancellation warning)
    // or, for bookings already paid in full via PayPal, a receipt confirmation.
    $bankHtml = '';
    $ppBtn    = '';
    $cancelNote = '';
    $paidNote   = '';

    if ($isPaid) {
        $paidNote = '
<p style="background:#eafaf1;border-left:4px solid #27ae60;padding:12px 16px;border-radius:4px;font-size:13px;line-height:1.7;margin:0 0 20px;">
  <strong>✓ Zahlung eingegangen.</strong> Wir haben Ihre Zahlung in Höhe von ' . $total . ' per PayPal erhalten — vielen Dank! Die Rechnung im Anhang dient als Beleg, es ist keine weitere Zahlung erforderlich.
</p>';
    } else {
        if (!empty($issuer['iban'])) {
            $bn       = !empty($issuer['bankName']) ? $esc($issuer['bankName']) . '<br>' : '';
            $bic      = !empty($issuer['bic'])      ? 'BIC: ' . $esc($issuer['bic']) . '<br>' : '';
            $bankHtml = '
<p style="background:#f0f7ee;padding:12px 16px;border-radius:6px;font-size:13px;line-height:1.9;margin:0 0 16px;">
  Kontoinhaber: Ralf Volgenandt<br>' . $bn . 'IBAN: ' . $esc($issuer['iban']) . '<br>' . $bic . '
  Verwendungszweck: Rechnung ' . $esc($invNum) . ' &ndash; ' . $guestName . '
</p>';
        }

        if (defined('PAYPAL_ME_URL') && PAYPAL_ME_URL !== '') {
            $ppAmount = number_format((float)($totals['total'] ?? 0), 2, '.', '');
            $ppUrl    = $esc(rtrim(PAYPAL_ME_URL, '/') . '/' . $ppAmount);
            $ppBtn    = '
<p style="text-align:center;margin:0 0 4px;font-size:13px;color:#555;">Oder bequem online bezahlen:</p>
<p style="text-align:center;margin:0 0 20px;">
  <a href="' . $ppUrl . '" style="display:inline-block;background:#0070ba;color:#fff;padding:11px 28px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;">Mit PayPal bezahlen</a>
</p>';
        }

        // Skipped for Firmenrechnungen: paymentNote already states the exact
        // due date (see computeDueDate() in invoice-draft.php) — a generic
        // "innerhalb von 7 Tagen" line would be redundant and, if the actual
        // term is 3 Werktage, simply wrong.
        $cancelNote = $isFirmenrechnung ? '' : '
<p style="background:#fff3cd;border-left:4px solid #e6a817;padding:10px 14px;border-radius:4px;font-size:13px;line-height:1.6;margin:0 0 20px;">
  <strong>Wichtiger Hinweis:</strong> Sollte die Zahlung nicht innerhalb von 7 Tagen eingehen,
  behalten wir uns vor, die Buchung automatisch zu stornieren.
</p>';
    }

    // Sign-off
    $signOff = '
<p style="margin:0;">Mit freundlichen Grüßen<br>
  <strong>Simone &amp; Ralf Volgenandt</strong><br>
  <span style="font-size:12px;color:#888;">Tel.: 0160&nbsp;97719112 &middot; kontakt@pension-volgenandt.de</span>
</p>';

    if ($scenario === 'A') {
        // Beds24's own instant "Buchungsbestätigung" already confirmed the stay
        // details (and, for online-paid bookings, already noted the payment) —
        // this email's only job is to deliver the reviewed, compliant invoice
        // that follows once Simone has checked it. Don't restate the booking
        // confirmation, just introduce the attached Rechnung.
        $html = '
<div style="font-family:Arial,sans-serif;font-size:14px;color:#333;max-width:560px;">
  <p style="margin:0 0 12px;">Sehr geehrte/r ' . $guestName . ',</p>
  ' . $introBlock . '

  <table style="width:100%;border-collapse:collapse;margin:0 0 20px;background:#f9f7f3;border-radius:6px;">
    <tr>
      <td style="padding:10px 14px;color:#666;width:38%;">Zimmer</td>
      <td style="padding:10px 14px;font-weight:700;">' . $roomName . '</td>
    </tr>
    <tr style="border-top:1px solid #ede9e1;">
      <td style="padding:10px 14px;color:#666;">Zeitraum</td>
      <td style="padding:10px 14px;">' . $checkIn . ' – ' . $checkOut . ' (' . $nights . ' Nächte)</td>
    </tr>
    <tr style="border-top:1px solid #ede9e1;background:#f0f7ee;">
      <td style="padding:10px 14px;color:#666;">Gesamtbetrag</td>
      <td style="padding:10px 14px;font-weight:700;color:#3d5a3e;">' . $total . '</td>
    </tr>
  </table>

  ' . ($isPaid ? '' : ($isFirmenrechnung
        ? '<p style="line-height:1.7;margin:0 0 12px;">Der Rechnungsbetrag ist ' . lcfirst($esc($draft['paymentNote'] ?? '')) . '</p>'
        : '<p style="line-height:1.7;margin:0 0 12px;">Bitte begleichen Sie den Betrag innerhalb von <strong>7 Tagen</strong>:</p>')) . '
  ' . $paidNote . $bankHtml . $ppBtn . $cancelNote . '

  <p style="font-size:13px;color:#555;margin:0 0 20px;line-height:1.7;">
    Bei Fragen erreichen Sie uns unter
    <a href="mailto:kontakt@pension-volgenandt.de" style="color:#3d5a3e;">kontakt@pension-volgenandt.de</a>
    oder telefonisch unter <strong>0160&nbsp;97719112</strong>.
  </p>

  ' . $signOff . '
</div>';
    } elseif ($scenario === 'C') {
        $html = '
<div style="font-family:Arial,sans-serif;font-size:14px;color:#333;max-width:560px;">
  <p style="margin:0 0 12px;">Sehr geehrte/r ' . $guestName . ',</p>
  ' . $introBlock . '
  <table style="width:100%;border-collapse:collapse;margin:0 0 20px;background:#f9f7f3;border-radius:6px;">
    <tr><td style="padding:10px 14px;color:#666;width:38%;">Zimmer</td><td style="padding:10px 14px;">' . $roomName . '</td></tr>
    <tr style="border-top:1px solid #ede9e1;background:#f0f7ee;"><td style="padding:10px 14px;color:#666;">Gesamtbetrag</td><td style="padding:10px 14px;font-weight:700;color:#3d5a3e;">' . $total . '</td></tr>
  </table>
  ' . ($isPaid ? '' : ($isFirmenrechnung
        ? '<p style="line-height:1.7;margin:0 0 12px;">Der Rechnungsbetrag ist ' . lcfirst($esc($draft['paymentNote'] ?? '')) . '</p>'
        : '<p style="line-height:1.7;margin:0 0 12px;">Bitte begleichen Sie den Betrag innerhalb von <strong>7 Tagen</strong>:</p>')) . '
  ' . $paidNote . $bankHtml . $ppBtn . $cancelNote . $signOff . '
</div>';
    } else {
        $html = '
<div style="font-family:Arial,sans-serif;font-size:14px;color:#333;max-width:560px;">
  <p style="margin:0 0 12px;">Sehr geehrte/r ' . $guestName . ',</p>
  ' . $introBlock . '
  <table style="width:100%;border-collapse:collapse;margin:0 0 20px;background:#f9f7f3;border-radius:6px;">
    <tr><td style="padding:10px 14px;color:#666;width:38%;">Zimmer</td><td style="padding:10px 14px;">' . $roomName . '</td></tr>
    <tr style="border-top:1px solid #ede9e1;"><td style="padding:10px 14px;color:#666;">Zeitraum</td><td style="padding:10px 14px;">' . $checkIn . ' – ' . $checkOut . '</td></tr>
    <tr style="border-top:1px solid #ede9e1;background:#f0f7ee;"><td style="padding:10px 14px;color:#666;">Gesamtbetrag</td><td style="padding:10px 14px;font-weight:700;color:#3d5a3e;">' . $total . '</td></tr>
  </table>
  ' . ($isPaid ? '' : ($isFirmenrechnung
        ? '<p style="line-height:1.7;margin:0 0 12px;">Der Rechnungsbetrag ist ' . lcfirst($esc($draft['paymentNote'] ?? '')) . '</p>'
        : '<p style="line-height:1.7;margin:0 0 12px;">Bitte begleichen Sie den Betrag innerhalb von <strong>7 Tagen</strong>:</p>')) . '
  ' . $paidNote . $bankHtml . $ppBtn . $cancelNote . $signOff . '
</div>';
    }

    return ['subject' => $subject, 'html' => $html];
}

/**
 * Sends the invoice PDF + email built by buildGuestInvoiceEmailHtml() to the
 * guest, BCC'ing the office/Steuerbüro. Returns false without sending if the
 * guest has no email on file.
 */
function sendInvoiceToGuest(
    array $draft,
    string $pdfBytes,
    bool $isPaid = false,
    ?string $subjectOverride = null,
    ?string $introOverride = null
): bool {
    $guest = $draft['guest'];
    $email = $guest['email'] ?? '';
    $name  = $guest['name']  ?? '';
    if (!$email) return false;

    $invNum = $draft['invoiceNumber'] ?? '';
    $built  = buildGuestInvoiceEmailHtml($draft, $isPaid, $subjectOverride, $introOverride);

    $bcc = [ADMIN_EMAIL];
    if (defined('STEUERBUERO_EMAIL') && STEUERBUERO_EMAIL !== '') {
        $bcc[] = STEUERBUERO_EMAIL;
    }

    return sendMail($email, $name, $built['subject'], $built['html'], '', [
        ['data' => $pdfBytes, 'filename' => 'Rechnung-' . $invNum . '.pdf', 'mime' => 'application/pdf'],
    ], [], $bcc);
}
