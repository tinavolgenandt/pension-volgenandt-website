<?php
/**
 * Shared SMTP configuration and sendSmtp() function.
 * Used by send-mail.php, picknick-booking.php, and invoice scripts.
 */

require_once __DIR__ . '/config.php';

$smtpHost = SMTP_HOST;
$smtpPort = SMTP_PORT;
$smtpUser = SMTP_USER;
$smtpPass = SMTP_PASS;

$allowedOrigins = [
    'https://tinavolgenandt.github.io',
    'https://pension-volgenandt.de',
    'https://www.pension-volgenandt.de',
    'http://localhost:3000',
    'http://localhost:3002',
];

/**
 * Set CORS headers based on allowed origins.
 */
function setCorsHeaders(array $allowedOrigins): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowedOrigins, true)) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        header('Access-Control-Allow-Origin: https://pension-volgenandt.de');
    }

    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Accept');
    header('Content-Type: application/json; charset=utf-8');
}

/**
 * Send an email via SMTP with STARTTLS + AUTH LOGIN.
 */
function sendSmtp(string $host, int $port, string $user, string $pass, string $from, string $to, string $subject, string $body, string $replyToName, string $replyToEmail, string $cc = '', bool $html = false): array {
    // Strip CRLF to prevent header injection
    $replyToName  = str_replace(["\r", "\n"], '', $replyToName);
    $replyToEmail = str_replace(["\r", "\n"], '', $replyToEmail);
    $to           = str_replace(["\r", "\n"], '', $to);
    $cc           = str_replace(["\r", "\n"], '', $cc);

    $errno = 0;
    $errstr = '';
    $conn = @stream_socket_client("tcp://$host:$port", $errno, $errstr, 15);

    if (!$conn) {
        return ['ok' => false, 'error' => "Connection failed: $errstr ($errno)"];
    }

    stream_set_timeout($conn, 15);

    $read = function () use ($conn): string {
        $response = '';
        while ($line = fgets($conn, 512)) {
            $response .= $line;
            if (isset($line[3]) && $line[3] !== '-') break;
        }
        return $response;
    };

    $cmd = function (string $command) use ($conn, $read): string {
        fwrite($conn, $command . "\r\n");
        return $read();
    };

    try {
        $greeting = $read();
        if (strpos($greeting, '220') !== 0) {
            fclose($conn);
            return ['ok' => false, 'error' => "Bad greeting: " . trim($greeting)];
        }

        $ehlo = $cmd("EHLO pension-volgenandt.de");
        if (strpos($ehlo, '250') === false) {
            fclose($conn);
            return ['ok' => false, 'error' => "EHLO failed: " . trim($ehlo)];
        }

        $starttls = $cmd("STARTTLS");
        if (strpos($starttls, '220') !== 0) {
            fclose($conn);
            return ['ok' => false, 'error' => "STARTTLS failed: " . trim($starttls)];
        }

        $tlsResult = stream_socket_enable_crypto($conn, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT);
        if (!$tlsResult) {
            fclose($conn);
            return ['ok' => false, 'error' => "TLS handshake failed"];
        }

        $ehlo2 = $cmd("EHLO pension-volgenandt.de");
        if (strpos($ehlo2, '250') === false) {
            fclose($conn);
            return ['ok' => false, 'error' => "EHLO after TLS failed: " . trim($ehlo2)];
        }

        $authStart = $cmd("AUTH LOGIN");
        if (strpos($authStart, '334') !== 0) {
            fclose($conn);
            return ['ok' => false, 'error' => "AUTH LOGIN failed: " . trim($authStart)];
        }

        $userResp = $cmd(base64_encode($user));
        if (strpos($userResp, '334') !== 0) {
            fclose($conn);
            return ['ok' => false, 'error' => "AUTH user failed: " . trim($userResp)];
        }

        $passResp = $cmd(base64_encode($pass));
        if (strpos($passResp, '235') !== 0) {
            fclose($conn);
            return ['ok' => false, 'error' => "AUTH password failed: " . trim($passResp)];
        }

        $mailFrom = $cmd("MAIL FROM:<$from>");
        if (strpos($mailFrom, '250') !== 0) {
            fclose($conn);
            return ['ok' => false, 'error' => "MAIL FROM failed: " . trim($mailFrom)];
        }

        $rcptTo = $cmd("RCPT TO:<$to>");
        if (strpos($rcptTo, '250') !== 0) {
            fclose($conn);
            return ['ok' => false, 'error' => "RCPT TO failed: " . trim($rcptTo)];
        }

        // CC recipient (if set)
        if ($cc !== '') {
            $rcptCc = $cmd("RCPT TO:<$cc>");
            if (strpos($rcptCc, '250') !== 0) {
                fclose($conn);
                return ['ok' => false, 'error' => "RCPT TO (CC) failed: " . trim($rcptCc)];
            }
        }

        $data = $cmd("DATA");
        if (strpos($data, '354') !== 0) {
            fclose($conn);
            return ['ok' => false, 'error' => "DATA failed: " . trim($data)];
        }

        $date = date('r');
        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $contentType = $html ? 'text/html; charset=UTF-8' : 'text/plain; charset=UTF-8';
        $msgHeaders = "From: Simone & Ralf Volgenandt <$from>\r\n"
            . "To: $to\r\n"
            . ($cc !== '' ? "Cc: $cc\r\n" : '')
            . "Reply-To: $replyToName <$replyToEmail>\r\n"
            . "Subject: $encodedSubject\r\n"
            . "Date: $date\r\n"
            . "MIME-Version: 1.0\r\n"
            . "Content-Type: $contentType\r\n"
            . "Content-Transfer-Encoding: 8bit\r\n"
            . "X-Mailer: PensionVolgenandt/1.0\r\n";

        $bodyLines = explode("\n", str_replace("\r\n", "\n", $body));
        $escapedBody = '';
        foreach ($bodyLines as $line) {
            if (strpos($line, '.') === 0) {
                $escapedBody .= '.' . $line . "\r\n";
            } else {
                $escapedBody .= $line . "\r\n";
            }
        }

        fwrite($conn, $msgHeaders . "\r\n" . $escapedBody . ".\r\n");
        $dataResp = $read();

        if (strpos($dataResp, '250') !== 0) {
            fclose($conn);
            return ['ok' => false, 'error' => "Message rejected: " . trim($dataResp)];
        }

        $cmd("QUIT");
        fclose($conn);

        return ['ok' => true];
    } catch (\Throwable $e) {
        @fclose($conn);
        return ['ok' => false, 'error' => $e->getMessage()];
    }
}
