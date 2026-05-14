<?php
/**
 * Returns inquiry log as JSON. Protected by API key.
 * Deploy to IONOS alongside send-mail.php.
 */

header('Content-Type: application/json; charset=utf-8');

$apiKey      = $_GET['key'] ?? '';
$expectedKey = getenv('INQUIRY_LOG_API_KEY');

if ($apiKey === '' || $expectedKey === false || $expectedKey === '' || $apiKey !== $expectedKey) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$logFile = __DIR__ . '/inquiry-log.csv';

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
