<?php
/**
 * Beds24 v2 API client.
 * Uses a Long Life Token (set in config.php as BEDS24_REFRESH_TOKEN) which
 * works directly as the `token` header — no token-exchange step required.
 */

require_once __DIR__ . '/config.php';

class Beds24Api {
    private const BASE_URL = 'https://api.beds24.com/v2';

    private string $propertyId;
    private string $accessToken;

    public function __construct() {
        $this->accessToken = BEDS24_REFRESH_TOKEN;
        $this->propertyId  = BEDS24_PROPERTY_ID;
    }

    public function authenticate(): bool {
        return !empty($this->accessToken);
    }

    /**
     * Fetch a single booking by ID, including invoice items.
     * Returns booking array or null on failure.
     */
    public function getBooking(int $bookingId): ?array {
        if (!$this->accessToken && !$this->authenticate()) return null;

        $response = $this->request('GET', '/bookings', null, [], [
            'id'                  => $bookingId,
            'includeInvoiceItems' => 'true',
        ]);

        if (!$response['ok']) return null;

        // Beds24 v2: response is {'success':true,'data':[...]}
        $bookings = $response['data']['data'] ?? [];
        return isset($bookings[0]) ? $bookings[0] : null;
    }

    /**
     * Fetch every booking sharing a group — the master booking itself plus all
     * its room bookings. Beds24 v2's `masterId` query param is special: passing
     * a booking's own ID (whether it's the master or a standalone booking with
     * no group at all) returns that booking plus any children whose `masterId`
     * points to it. A standalone booking returns just itself (count 1).
     * Confirmed 2026-08-03 against a real 5-room group booking (#82870776).
     */
    public function getBookingsByMasterId(int $masterId): array {
        if (!$this->accessToken && !$this->authenticate()) return [];

        $response = $this->request('GET', '/bookings', null, [], [
            'masterId'            => $masterId,
            'includeInvoiceItems' => 'true',
        ]);

        if (!$response['ok']) return [];

        return $response['data']['data'] ?? [];
    }

    /**
     * Fetch all confirmed/new bookings with an unpaid balance for a date window.
     * Used as a backup poll to catch any webhooks we may have missed.
     * Returns array of bookings or empty array.
     */
    public function getUnpaidBookings(string $from, string $to): array {
        if (!$this->accessToken && !$this->authenticate()) return [];

        $response = $this->request('GET', '/bookings', null, [], [
            'propertyId'          => $this->propertyId,
            'arrivalFrom'         => $from,
            'arrivalTo'           => $to,
            'includeInvoiceItems' => 'true',
        ]);

        if (!$response['ok']) return [];

        // Beds24 v2: response is {'success':true,'data':[...]}
        $bookings = $response['data']['data'] ?? [];

        // Filter: only confirmed/new with outstanding balance
        // Beds24 v2 /bookings never populates invoice.balance or balance for
        // this account — fall back to price minus deposit (amount paid).
        return array_values(array_filter($bookings, function (array $b): bool {
            $status = strtolower((string)($b['status'] ?? ''));
            if (isset($b['invoice']['balance'])) {
                $balance = (float)$b['invoice']['balance'];
            } elseif (isset($b['balance'])) {
                $balance = (float)$b['balance'];
            } else {
                $balance = (float)($b['price'] ?? 0) - (float)($b['deposit'] ?? 0);
            }
            return in_array($status, ['confirmed', 'new'], true) && $balance > 0.01;
        }));
    }

    /**
     * Best-effort check whether a guest email has an overlapping accommodation
     * booking around a given date (used to skip the picnic follow-up email
     * for guests who are also staying with us). Matches only by email — a
     * guest using a different email for their picnic order than for their
     * room booking will not be detected.
     */
    public function hasAccommodationOverlap(string $email, string $date): bool {
        if (!$this->accessToken && !$this->authenticate()) return false;
        $email = strtolower(trim($email));
        if ($email === '') return false;

        $from = date('Y-m-d', strtotime($date . ' -7 days'));
        $to   = date('Y-m-d', strtotime($date . ' +1 day'));

        $response = $this->request('GET', '/bookings', null, [], [
            'propertyId'  => $this->propertyId,
            'arrivalFrom' => $from,
            'arrivalTo'   => $to,
        ]);

        if (!$response['ok']) return false;

        $bookings = $response['data']['data'] ?? [];
        foreach ($bookings as $b) {
            $status = strtolower((string)($b['status'] ?? ''));
            if (!in_array($status, ['confirmed', 'new'], true)) continue;

            $guestEmail = strtolower(trim((string)($b['email'] ?? $b['guestEmail'] ?? '')));
            if ($guestEmail !== $email) continue;

            $arrival   = (string)($b['arrival']   ?? $b['checkIn']  ?? $b['arrivalDate']   ?? '');
            $departure = (string)($b['departure'] ?? $b['checkOut'] ?? $b['departureDate'] ?? '');
            if ($arrival === '' || $departure === '') continue;

            if ($arrival <= $to && $departure >= $date) {
                return true;
            }
        }

        return false;
    }

    /**
     * Low-level HTTP request helper.
     */
    private function request(string $method, string $path, ?string $body, array $extraHeaders = [], array $queryParams = []): array {
        $url = self::BASE_URL . $path;
        if (!empty($queryParams)) {
            $url .= '?' . http_build_query($queryParams);
        }

        $headers = ['Content-Type: application/json'];
        foreach ($extraHeaders as $key => $value) {
            $headers[] = "$key: $value";
        }
        if ($this->accessToken) {
            $headers[] = 'token: ' . $this->accessToken;
        }

        $opts = [
            'http' => [
                'method'        => $method,
                'header'        => implode("\r\n", $headers),
                'content'       => $body ?? '',
                'timeout'       => 20,
                'ignore_errors' => true,
            ],
            'ssl' => ['verify_peer' => true, 'verify_peer_name' => true],
        ];

        $context  = stream_context_create($opts);
        $raw      = @file_get_contents($url, false, $context);

        if ($raw === false) {
            return ['ok' => false, 'error' => 'Request failed: ' . $url];
        }

        $data = json_decode($raw, true);
        return ['ok' => true, 'data' => $data];
    }
}
