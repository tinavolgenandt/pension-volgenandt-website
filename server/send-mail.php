<?php
/**
 * Contact form mail handler for Pension Volgenandt.
 * Deploy this file to IONOS Webhosting Essential.
 *
 * Receives POST (name, email, message) → sends email to kontakt@pension-volgenandt.de
 */

require_once __DIR__ . '/smtp.php';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
$recipientEmail = 'kontakt@pension-volgenandt.de';
$subjectPrefix  = '[Pension Volgenandt]';

// Verified partner inboxes we're allowed to route inquiries to directly.
// Keyed by a fixed identifier the frontend sends — never trust a raw email
// address from the client as the recipient.
$partnerEmails = [
    'grillverein-thalwenden' => 'grillverein-thalwenden@gmx.de',
];

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------
setCorsHeaders($allowedOrigins);

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Only POST allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// ---------------------------------------------------------------------------
// Parse input
// ---------------------------------------------------------------------------
$input = json_decode(file_get_contents('php://input'), true);

if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request body']);
    exit;
}

$name           = trim($input['name'] ?? '');
$email          = trim($input['email'] ?? '');
$phone          = trim($input['phone'] ?? '');
$message        = trim($input['message'] ?? '');
$gotcha         = trim($input['_gotcha'] ?? '');
$customSubject  = trim($input['_subject'] ?? '');
$partnerKey     = trim($input['_partner'] ?? '');
$partnerEmail   = $partnerEmails[$partnerKey] ?? null;

$occasion       = trim($input['occasion'] ?? '');
$eventDate      = trim($input['date'] ?? '');
$guests         = trim($input['guests'] ?? '');
$hours          = trim($input['hours'] ?? '');
$cateringTier   = trim($input['cateringTier'] ?? '');
$notes          = trim($input['notes'] ?? '');
$partnerMessage = trim($input['partnerMessage'] ?? '');

// ---------------------------------------------------------------------------
// Honeypot – if filled, silently pretend success (bot trap)
// ---------------------------------------------------------------------------
if ($gotcha !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
$errors = [];

if ($name === '') {
    $errors[] = ['field' => 'name', 'message' => 'Bitte geben Sie Ihren Namen an.'];
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = ['field' => 'email', 'message' => 'Bitte geben Sie eine gültige E-Mail-Adresse an.'];
}
if ($message === '') {
    $errors[] = ['field' => 'message', 'message' => 'Bitte geben Sie eine Nachricht ein.'];
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['errors' => $errors]);
    exit;
}

// ---------------------------------------------------------------------------
// Build email
// ---------------------------------------------------------------------------
// Every inquiry reaches us as a plain-text mail with the full message,
// including our package price. A catering inquiry additionally goes to the
// partner as a separate HTML mail without our prices (CC to us, so we see
// their reply to the guest).
$isPartnerInquiry = ($partnerEmail !== null && $partnerKey === 'grillverein-thalwenden');

$subject = $customSubject !== ''
    ? "$subjectPrefix $customSubject"
    : "$subjectPrefix Nachricht von $name";

$body = "Neue Kontaktanfrage über die Website:\r\n"
    . "\r\n"
    . "Name:    $name\r\n"
    . "E-Mail:  $email\r\n"
    . ($phone !== '' ? "Telefon: $phone\r\n" : '')
    . "\r\n"
    . "Nachricht:\r\n"
    . $message;

if ($isPartnerInquiry) {
    $details = array_filter([$guests !== '' ? "$guests Gäste" : '', $eventDate]);
    $partnerSubject = $customSubject !== ''
        ? "$subjectPrefix $customSubject"
        : "$subjectPrefix Catering-Anfrage: " . ($occasion ?: 'Feier im Garten') . ($details ? ' (' . implode(', ', $details) . ')' : '');

    $safeName         = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $safeEmail        = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $safePhone        = htmlspecialchars($phone ?: '–', ENT_QUOTES, 'UTF-8');
    $safeOccasion     = htmlspecialchars($occasion ?: '–', ENT_QUOTES, 'UTF-8');
    $safeDate         = htmlspecialchars($eventDate ?: 'noch offen', ENT_QUOTES, 'UTF-8');
    $safeGuests       = htmlspecialchars($guests ?: '–', ENT_QUOTES, 'UTF-8');
    $safeHours        = htmlspecialchars($hours ? "ca. $hours Stunden" : '–', ENT_QUOTES, 'UTF-8');
    $safeCateringTier = htmlspecialchars($cateringTier ?: 'Catering gewünscht', ENT_QUOTES, 'UTF-8');
    $safeNotes        = nl2br(htmlspecialchars($notes, ENT_QUOTES, 'UTF-8'));
    $safeSelection    = nl2br(htmlspecialchars($partnerMessage, ENT_QUOTES, 'UTF-8'));

    $row = static fn (string $label, string $value): string =>
        "<tr><td style=\"padding: 6px 12px 6px 0; color: #4a5d3f; font-weight: 600; vertical-align: top; width: 35%;\">$label</td>"
        . "<td style=\"padding: 6px 0;\">$value</td></tr>";

    $notesBlock = $notes !== ''
        ? "<h3 style=\"font-size: 15px; margin: 24px 0 8px;\">Wünsche und Notizen</h3><p style=\"margin: 0;\">$safeNotes</p>"
        : '';

    $selectionBlock = $partnerMessage !== ''
        ? "<h3 style=\"font-size: 15px; margin: 24px 0 8px;\">Gewählte Leistungen</h3><p style=\"margin: 0;\">$safeSelection</p>"
        : '';

    $partnerBody = "<!DOCTYPE html>
<html>
<head><meta charset=\"UTF-8\"></head>
<body style=\"font-family: Arial, Helvetica, sans-serif; color: #2d3748; font-size: 14px; line-height: 1.5; padding: 16px;\">
  <div style=\"max-width: 640px; margin: 0 auto;\">
    <p>Hallo Grillverein Thalwenden,</p>
    <p>über den Eventplaner auf unserer Website hat jemand eine Feier im Garten angefragt und euer Catering ausgewählt.</p>

    <table style=\"width: 100%; border-collapse: collapse; margin: 16px 0;\">"
        . $row('Anlass', $safeOccasion)
        . $row('Wunschtermin', $safeDate)
        . $row('Gäste', $safeGuests)
        . $row('Dauer', $safeHours)
        . $row('Catering', $safeCateringTier)
        . "</table>

    <h3 style=\"font-size: 15px; margin: 24px 0 8px;\">Kontakt</h3>
    <table style=\"width: 100%; border-collapse: collapse;\">"
        . $row('Name', $safeName)
        . $row('E-Mail', "<a href=\"mailto:$safeEmail\" style=\"color: #4a5d3f;\">$safeEmail</a>")
        . $row('Telefon', $safePhone)
        . "</table>

    $notesBlock

    $selectionBlock

    <h3 style=\"font-size: 15px; margin: 24px 0 8px;\">Ort der Feier</h3>
    <p style=\"margin: 0;\">Pension Volgenandt, Otto-Reutter-Straße 28, 37327 Leinefelde-Worbis OT Breitenbach.<br>
    Die Garage dient als Catering-Küche.<br>
    Ansprechpartnerin vor Ort: Tina Volgenandt, 0176 55229201, events@pension-volgenandt.de</p>

    <p style=\"margin-top: 24px;\">Wenn ihr auf diese Mail antwortet, geht die Antwort direkt an {$safeName}. Wir stehen in Kopie.</p>
    <p>Viele Grüße aus Breitenbach<br>Tina Volgenandt</p>
  </div>
</body>
</html>";
}

// ---------------------------------------------------------------------------
// Send via SMTP
// ---------------------------------------------------------------------------
if ($isPartnerInquiry) {
    $partnerResult = sendSmtp($smtpHost, $smtpPort, $smtpUser, $smtpPass, $recipientEmail, $partnerEmail, $partnerSubject, $partnerBody, $name, $email, $recipientEmail, true);
    $body = ($partnerResult['ok']
            ? "An Grillverein Thalwenden weitergeleitet ($partnerEmail), ohne unsere Preise.\r\n\r\n"
            : "ACHTUNG: Weiterleitung an Grillverein Thalwenden fehlgeschlagen. Bitte selbst weitergeben.\r\n\r\n")
        . $body;
}

$result = sendSmtp($smtpHost, $smtpPort, $smtpUser, $smtpPass, $recipientEmail, $recipientEmail, $subject, $body, $name, $email);

if ($result['ok']) {
    // Log inquiry to CSV for statistics collection
    $logFile = __DIR__ . '/inquiry-log.csv';
    $logLine = [
        date('Y-m-d H:i:s'),
        $name,
        $email,
        $customSubject !== '' ? $customSubject : ($isPartnerInquiry ? 'Catering-Anfrage' : 'Kontaktanfrage'),
        $_SERVER['HTTP_REFERER'] ?? '',
    ];
    $fp = @fopen($logFile, 'a');
    if ($fp) {
        if (@filesize($logFile) === 0 || !file_exists($logFile)) {
            fputcsv($fp, ['timestamp', 'name', 'email', 'type', 'origin']);
        }
        fputcsv($fp, $logLine);
        fclose($fp);
    }

    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode([
        'error' => 'E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.',
    ]);
}
