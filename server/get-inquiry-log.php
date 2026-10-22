<?php
/**
 * Returns inquiry log as JSON. Protected by API key.
 * Deploy to IONOS alongside send-mail.php.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/security.php';

header('Content-Type: application/json; charset=utf-8');

// Prefer the X-Api-Key header: a key in the URL ends up in server logs.
// ?key= still works for existing callers.
$apiKey      = (string) ($_SERVER['HTTP_X_API_KEY'] ?? $_GET['key'] ?? '');
$expectedKey = INQUIRY_LOG_API_KEY;

enforceRateLimit('inquiry-log', 30, 3600);

if ($apiKey === '' || $expectedKey === '' || $expectedKey === 'CHANGE_ME' || !hash_equals($expectedKey, $apiKey)) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$logFile = inquiryLogPath();

if (!file_exists($logFile) || filesize($logFile) === 0) {
    echo json_encode(['entries' => []]);
    exit;
}

$entries = [];
$fp = fopen($logFile, 'r');
$headers = fgetcsv($fp);

if ($headers) {
    while (($row = fgetcsv($fp)) !== false) {
        if (count($row) === count($headers)) {
            $entries[] = array_combine($headers, $row);
        }
    }
}

fclose($fp);

// Optional: filter by month (e.g., ?month=2026-03)
$monthFilter = $_GET['month'] ?? '';
if ($monthFilter !== '') {
    $entries = array_values(array_filter($entries, function ($e) use ($monthFilter) {
        return strpos($e['timestamp'], $monthFilter) === 0;
    }));
}

echo json_encode(['entries' => $entries, 'total' => count($entries)]);
