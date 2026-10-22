<?php
/**
 * Contact form mail handler for Pension Volgenandt.
 * Deploy this file to IONOS Webhosting Essential.
 *
 * Receives POST (name, email, message) → sends email to kontakt@pension-volgenandt.de
 */

require_once __DIR__ . '/smtp.php';
require_once __DIR__ . '/security.php';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
$recipientEmail = 'kontakt@pension-volgenandt.de';
$eventsEmail    = 'events@pension-volgenandt.de'; // event inquiries + CC on partner mails

// Inquiries the frontend marks with _topic go to that inbox instead of kontakt@.
// Allow-listed like $partnerEmails, never a raw address from the client.
$topicRecipients = [
    'events' => $eventsEmail,
];
$subjectPrefix  = '[Pension Volgenandt]';

// Verified partner inboxes we're allowed to route inquiries to directly.
// Keyed by a fixed identifier the frontend sends — never trust a raw email
// address from the client as the recipient.
$partnerEmails = [
    'grillverein-thalwenden' => 'grillverein-thalwenden@gmx.de',
    'lamaru-patisserie'      => 'maryna.hefel@lamaru-patisserie.de',
];
// Name used in our copy. Every key in $partnerEmails needs one. A new partner
// = one line in each list (keys match `partner` in content/events/config.yml),
// then upload this file to IONOS.
$partnerNames = [
    'grillverein-thalwenden' => 'Grillverein Thalwenden',
    'lamaru-patisserie'      => 'LaMaru Pâtisserie',
];
// Greeting when it differs from the name ("Hallo Maryna," not "Hallo LaMaru …")
$partnerGreetings = [
    'lamaru-patisserie' => 'Maryna',
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

// Anyone can post here, and a partner inquiry also mails the partner. Keep a
// script from using us to flood our inboxes or theirs.
enforceRateLimit('send-mail', 5, 600);

// ---------------------------------------------------------------------------
// Parse input
// ---------------------------------------------------------------------------
$input = json_decode(file_get_contents('php://input', false, null, 0, 65536), true);

if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request body']);
    exit;
}

$name           = limitText($input['name'] ?? '', 120);
$email          = limitText($input['email'] ?? '', 254);
$phone          = limitText($input['phone'] ?? '', 40);
$message        = limitText($input['message'] ?? '', 10000);
$gotcha         = limitText($input['_gotcha'] ?? '', 200);
$customSubject  = limitText($input['_subject'] ?? '', 150);
$partnerKey     = limitText($input['_partner'] ?? '', 64);
$partnerEmail   = $partnerEmails[$partnerKey] ?? null;
$topic          = limitText($input['_topic'] ?? '', 32);
$internalTo     = $topicRecipients[$topic] ?? $recipientEmail;

$occasion       = limitText($input['occasion'] ?? '', 120);
$eventDate      = limitText($input['date'] ?? '', 40);
$guests         = limitText($input['guests'] ?? '', 10);
$hours          = limitText($input['hours'] ?? '', 10);
$startTime      = limitText($input['startTime'] ?? '', 10);
$cateringTier   = limitText($input['cateringTier'] ?? '', 120);
$notes          = limitText($input['notes'] ?? '', 5000);
$partnerMessage = limitText($input['partnerMessage'] ?? '', 5000);
// Cake / patisserie chosen in the calculator: a second partner mail
$patisserieKey     = limitText($input['_patisserie'] ?? '', 64);
$patisserieChoice  = limitText($input['patisserieChoice'] ?? '', 120);
$patisserieMessage = limitText($input['patisserieMessage'] ?? '', 2000);

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
// Event callback requests only ask for a phone number, so for them a phone
// number is enough. Everyone else needs a valid e-mail address.
$phoneIsEnough = ($topic === 'events' && $phone !== '');
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = ['field' => 'email', 'message' => 'Bitte geben Sie eine gültige E-Mail-Adresse an.'];
} elseif ($email === '' && !$phoneIsEnough) {
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
// Every inquiry reaches us as a plain-text mail with the full message
// (kontakt@, or events@ for event inquiries), including our package price.
// The caterer and the patisserie the guest chose each get a separate HTML mail
// with only their own part and their own price, never ours, and without the
// guest's e-mail or phone. Their reply comes to events@, never to the guest.
$partnerMails = [];
if (isset($partnerEmails[$partnerKey], $partnerNames[$partnerKey])) {
    $partnerMails[] = [
        'key'       => $partnerKey,
        'kind'      => 'Catering',
        'choice'    => $cateringTier ?: 'Catering gewünscht',
        'intro'     => 'euer Catering ausgewählt',
        'heading'   => 'Gewählte Leistungen',
        'selection' => $partnerMessage,
        'kitchen'   => true,
    ];
}
if ($patisserieKey !== $partnerKey && isset($partnerEmails[$patisserieKey], $partnerNames[$patisserieKey])) {
    $partnerMails[] = [
        'key'       => $patisserieKey,
        'kind'      => 'Pâtisserie',
        'choice'    => $patisserieChoice ?: 'Pâtisserie gewünscht',
        'intro'     => 'bei euch Pâtisserie ausgewählt',
        'heading'   => 'Eure Auswahl',
        'selection' => $patisserieMessage,
        'kitchen'   => false,
    ];
}
$isPartnerInquiry = ($partnerMails !== []);

$subject = $customSubject !== ''
    ? "$subjectPrefix $customSubject"
    : "$subjectPrefix Nachricht von $name";

$body = "Neue Kontaktanfrage über die Website:\r\n"
    . "\r\n"
    . "Name:    $name\r\n"
    . "E-Mail:  " . ($email ?: '–') . "\r\n"
    . ($phone !== '' ? "Telefon: $phone\r\n" : '')
    . "\r\n"
    . "Nachricht:\r\n"
    . $message;

$esc = static fn (string $value): string => htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
$row = static fn (string $label, string $value): string =>
    "<tr><td style=\"padding: 6px 12px 6px 0; color: #4a5d3f; font-weight: 600; vertical-align: top; width: 35%;\">$label</td>"
    . "<td style=\"padding: 6px 0;\">$value</td></tr>";

// One partner mail; $job comes from $partnerMails above.
// Partners never get the guest's e-mail or phone: their offer comes to us and
// we pass it on (see Reply-To below).
$buildPartnerBody = static function (array $job, string $greeting) use ($esc, $row, $name, $occasion, $eventDate, $guests, $hours, $startTime, $notes): string {
    $notesBlock = $notes !== ''
        ? "<h3 style=\"font-size: 15px; margin: 24px 0 8px;\">Wünsche und Notizen</h3><p style=\"margin: 0;\">" . nl2br($esc($notes)) . "</p>"
        : '';
    $selectionBlock = $job['selection'] !== ''
        ? "<h3 style=\"font-size: 15px; margin: 24px 0 8px;\">" . $esc($job['heading']) . "</h3><p style=\"margin: 0;\">" . nl2br($esc($job['selection'])) . "</p>"
        : '';
    $kitchenLine = $job['kitchen'] ? "Die Garage dient als Catering-Küche.<br>\n    " : '';

    return "<!DOCTYPE html>
<html>
<head><meta charset=\"UTF-8\"></head>
<body style=\"font-family: Arial, Helvetica, sans-serif; color: #2d3748; font-size: 14px; line-height: 1.5; padding: 16px;\">
  <div style=\"max-width: 640px; margin: 0 auto;\">
    <p>Hallo " . $esc($greeting) . ",</p>
    <p>über den Eventplaner auf unserer Website hat jemand eine Feier im Garten angefragt und " . $esc($job['intro']) . ".</p>

    <table style=\"width: 100%; border-collapse: collapse; margin: 16px 0;\">"
        . $row('Anlass', $esc($occasion ?: '–'))
        . $row('Wunschtermin', $esc($eventDate ?: 'noch offen'))
        . $row('Gäste', $esc($guests ?: '–'))
        . $row('Beginn', $esc($startTime ? "$startTime Uhr" : '–'))
        . $row('Dauer', $esc($hours ? "ca. $hours Stunden" : '–'))
        . $row($esc($job['kind']), $esc($job['choice']))
        . $row('Angefragt von', $esc($name))
        . "</table>

    $notesBlock

    $selectionBlock

    <h3 style=\"font-size: 15px; margin: 24px 0 8px;\">Ort der Feier</h3>
    <p style=\"margin: 0;\">Pension Volgenandt, Otto-Reutter-Straße 28, 37327 Leinefelde-Worbis OT Breitenbach.<br>
    {$kitchenLine}Ansprechpartnerin vor Ort: Tina Volgenandt, 0176 55229201, events@pension-volgenandt.de</p>

    <p style=\"margin-top: 24px;\">Bitte schickt euer Angebot an uns, nicht an den Gast. Eine Antwort auf diese Mail geht an events@pension-volgenandt.de, wir geben das Angebot weiter.</p>
    <p>Viele Grüße aus Breitenbach<br>Tina Volgenandt</p>
  </div>
</body>
</html>";
};

// ---------------------------------------------------------------------------
// Send via SMTP
// ---------------------------------------------------------------------------
$forwardNotes = '';
foreach ($partnerMails as $job) {
    $partnerName  = $partnerNames[$job['key']];
    $partnerEmail = $partnerEmails[$job['key']];
    $details      = array_filter([$guests !== '' ? "$guests Gäste" : '', $eventDate]);
    $partnerSubject = $customSubject !== ''
        ? "$subjectPrefix $customSubject"
        : "$subjectPrefix {$job['kind']}-Anfrage: " . ($occasion ?: 'Feier im Garten') . ($details ? ' (' . implode(', ', $details) . ')' : '');
    $partnerBody = $buildPartnerBody($job, $partnerGreetings[$job['key']] ?? $partnerName);

    // Reply-To is always our events inbox, never the guest
    $partnerResult = sendSmtp($smtpHost, $smtpPort, $smtpUser, $smtpPass, $recipientEmail, $partnerEmail, $partnerSubject, $partnerBody, 'Pension Volgenandt', $eventsEmail, $eventsEmail, true);
    $forwardNotes .= $partnerResult['ok']
        ? "An $partnerName weitergeleitet ($partnerEmail), ohne unsere Preise.\r\n"
        : "ACHTUNG: Weiterleitung an $partnerName fehlgeschlagen. Bitte selbst weitergeben.\r\n";
}
if ($forwardNotes !== '') {
    $body = $forwardNotes . "\r\n" . $body;
}

// Without a guest e-mail, Reply-To points back to our own inbox.
$result = sendSmtp($smtpHost, $smtpPort, $smtpUser, $smtpPass, $recipientEmail, $internalTo, $subject, $body, $name, $email ?: $internalTo);

if ($result['ok']) {
    // Log inquiry to CSV for statistics collection (data/, not web-reachable)
    appendInquiryLog(['timestamp', 'name', 'email', 'type', 'origin'], [
        date('Y-m-d H:i:s'),
        $name,
        $email,
        $customSubject !== '' ? $customSubject : ($isPartnerInquiry ? 'Catering-Anfrage' : 'Kontaktanfrage'),
        $_SERVER['HTTP_REFERER'] ?? '',
    ]);

    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode([
        'error' => 'E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.',
    ]);
}
