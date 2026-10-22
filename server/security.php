<?php
/**
 * Shared security helpers for the PHP endpoints (include-only, blocked from
 * direct web access by .htaccess).
 *
 * Runtime state (rate-limit counters, inquiry log, used PayPal orders) lives
 * in data/, which has its own deny-all .htaccess.
 */

define('SECURITY_DATA_DIR', __DIR__ . '/data');

/**
 * Headers for every HTML page we render (admin tools, confirm/cancel pages).
 * They are never meant to be framed, indexed or to leak their URL (which may
 * carry a booking token) via the Referer header.
 */
function sendHtmlSecurityHeaders(): void {
    header('Content-Type: text/html; charset=UTF-8');
    header('X-Frame-Options: DENY');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: no-referrer');
    header('X-Robots-Tag: noindex, nofollow');
    header('Cache-Control: no-store');
    header("Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; img-src 'self' data:; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
}

/**
 * Start the admin session with a hardened cookie.
 */
function startSecureSession(string $name): void {
    session_name($name);
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'secure'   => true,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_start();
}

/**
 * Per-session CSRF token for admin forms.
 */
function csrfToken(): string {
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function csrfValid(): bool {
    return !empty($_SESSION['csrf'])
        && is_string($_POST['csrf'] ?? null)
        && is_string($_SESSION['csrf'])
        && hash_equals($_SESSION['csrf'], $_POST['csrf']);
}

function clientIp(): string {
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

/**
 * Fixed-window rate limit, stored per bucket + IP in data/ratelimit/.
 * Returns true if the request is allowed (and counts it).
 */
function rateLimit(string $bucket, int $max, int $windowSeconds): bool {
    $dir = SECURITY_DATA_DIR . '/ratelimit';
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    $file = $dir . '/' . preg_replace('/[^a-z0-9_-]/i', '', $bucket) . '-' . hash('sha256', clientIp()) . '.json';

    $fp = @fopen($file, 'c+');
    if ($fp === false) {
        return true; // fail open: never lock real guests out because of a disk problem
    }
    flock($fp, LOCK_EX);
    $state = json_decode(stream_get_contents($fp), true);
    $now   = time();
    if (!is_array($state) || ($state['start'] ?? 0) + $windowSeconds <= $now) {
        $state = ['start' => $now, 'count' => 0];
    }
    $state['count']++;
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($state));
    flock($fp, LOCK_UN);
    fclose($fp);

    return $state['count'] <= $max;
}

/**
 * Reject the request with 429 if the bucket is exhausted.
 */
function enforceRateLimit(string $bucket, int $max, int $windowSeconds, bool $json = true): void {
    if (rateLimit($bucket, $max, $windowSeconds)) {
        return;
    }
    http_response_code(429);
    header('Retry-After: ' . $windowSeconds);
    if ($json) {
        echo json_encode(['error' => 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.']);
    } else {
        echo 'Zu viele Versuche. Bitte später erneut versuchen.';
    }
    exit;
}

/**
 * Path of the inquiry log. It used to live in the webspace root, where it was
 * publicly downloadable; move it into data/ on first use.
 */
function inquiryLogPath(): string {
    $new = SECURITY_DATA_DIR . '/inquiry-log.csv';
    $old = __DIR__ . '/inquiry-log.csv';
    if (file_exists($old) && !file_exists($new)) {
        @rename($old, $new);
    }
    return $new;
}

/**
 * Neutralise spreadsheet formulas (=, +, -, @, tab, CR) so a log opened in
 * Excel cannot run anything a visitor typed into a form.
 */
function csvSafe($value): string {
    $value = (string) $value;
    if ($value !== '' && strpbrk($value[0], "=+-@\t\r") !== false) {
        return "'" . $value;
    }
    return $value;
}

/**
 * Append one row to the inquiry log (header row on first write).
 */
function appendInquiryLog(array $header, array $row): void {
    $logFile = inquiryLogPath();
    $fp = @fopen($logFile, 'a');
    if (!$fp) {
        return;
    }
    flock($fp, LOCK_EX);
    clearstatcache(true, $logFile);
    if (filesize($logFile) === 0) {
        fputcsv($fp, $header);
    }
    fputcsv($fp, array_map('csvSafe', $row));
    flock($fp, LOCK_UN);
    fclose($fp);
}

/**
 * Trim a string and cap its length (multibyte-safe).
 */
function limitText($value, int $max): string {
    $value = trim(is_scalar($value) ? (string) $value : '');
    return mb_substr($value, 0, $max, 'UTF-8');
}
