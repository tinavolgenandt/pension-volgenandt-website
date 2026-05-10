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
$message        = trim($input['message'] ?? '');
$gotcha         = trim($input['_gotcha'] ?? '');
$customSubject  = trim($input['_subject'] ?? '');

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
$subject = $customSubject !== ''
    ? "$subjectPrefix $customSubject"
    : "$subjectPrefix Nachricht von $name";

$body = "Neue Kontaktanfrage über die Website:\r\n"
    . "\r\n"
    . "Name:    $name\r\n"
    . "E-Mail:  $email\r\n"
    . "\r\n"
    . "Nachricht:\r\n"
    . $message;

// ---------------------------------------------------------------------------
// Send via SMTP
// ---------------------------------------------------------------------------
$result = sendSmtp($smtpHost, $smtpPort, $smtpUser, $smtpPass, $recipientEmail, $recipientEmail, $subject, $body, $name, $email);

if ($result['ok']) {
    // Log inquiry to CSV for statistics collection
    $logFile = __DIR__ . '/inquiry-log.csv';
    $logLine = [
        date('Y-m-d H:i:s'),
        $name,
        $email,
        $customSubject !== '' ? $customSubject : 'Kontaktanfrage',
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
