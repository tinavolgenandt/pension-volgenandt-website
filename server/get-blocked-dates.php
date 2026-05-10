<?php
/**
 * Returns dates that are fully booked (2+ baskets confirmed).
 * Used by the frontend to disable unavailable dates in the date picker.
 */

require_once __DIR__ . '/smtp.php';

setCorsHeaders($allowedOrigins);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$file = __DIR__ . '/blocked-dates.json';
$data = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

// Return dates where count >= 2
$blocked = [];
foreach ($data as $date => $count) {
    if ($count >= 2) {
        $blocked[] = $date;
    }
}

echo json_encode(['blockedDates' => $blocked]);
