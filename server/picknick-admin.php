<?php
/**
 * Picknick admin dashboard for Pension Volgenandt.
 * Deploy to: https://api.pension-volgenandt.de/picknick-admin.php
 *
 * Password-protected overview of all picknick bookings with
 * accept / decline / cancel actions.
 */

session_start();

require_once __DIR__ . '/config.php';

$bookingsDir = __DIR__ . '/bookings';
$confirmBase = 'https://api.pension-volgenandt.de/picknick-confirm.php';
$cancelBase  = 'https://api.pension-volgenandt.de/picknick-cancel.php';

// --- Auth ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['pw'])) {
    if (hash_equals(PICKNICK_ADMIN_PW, $_POST['pw'])) {
        $_SESSION['pk_admin'] = true;
    } else {
        $loginError = true;
    }
}
if (isset($_POST['logout'])) {
    session_destroy();
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit;
}

$loggedIn = !empty($_SESSION['pk_admin']);

// --- Parse booking message ---
function parseMsg(string $msg): array {
    $r = ['datum' => '', 'uhrzeit' => '', 'paket' => '', 'erwachsene' => 0, 'kinder' => 0];
    foreach (explode("\n", str_replace("\r\n", "\n", $msg)) as $line) {
        $line = trim($line);
        if ($line === '') break;
        if (preg_match('/^Datum:\s*(.+)$/u', $line, $m))            $r['datum']     = trim($m[1]);
        elseif (preg_match('/^Uhrzeit:\s*(.+)$/u', $line, $m))      $r['uhrzeit']   = trim($m[1]);
        elseif (preg_match('/^Paket:\s*(.+)$/u', $line, $m))        $r['paket']     = trim(preg_replace('/\s*\(.*$/', '', trim($m[1])));
        elseif (preg_match('/^Erwachsene:\s*(\d+)$/u', $line, $m))  $r['erwachsene'] = (int)$m[1];
        elseif (preg_match('/^Kinder:\s*(\d+)/u', $line, $m))       $r['kinder']    = (int)$m[1];
    }
    return $r;
}

// --- Load bookings ---
$bookings = [];
if ($loggedIn && is_dir($bookingsDir)) {
    foreach (glob($bookingsDir . '/*.json') as $file) {
        $data = json_decode(file_get_contents($file), true);
        if (is_array($data)) {
            $data['_parsed'] = parseMsg($data['message'] ?? '');
            $bookings[] = $data;
        }
    }
    // Pending first, then by bookingDate ascending
    usort($bookings, function ($a, $b) {
        $order = ['pending' => 0, 'accepted' => 1, 'declined' => 2, 'cancelled' => 3];
        $oa = $order[$a['status'] ?? 'pending'] ?? 9;
        $ob = $order[$b['status'] ?? 'pending'] ?? 9;
        if ($oa !== $ob) return $oa - $ob;
        return strcmp($a['bookingDate'] ?? '', $b['bookingDate'] ?? '');
    });
}

function statusBadge(string $status): string {
    return match ($status) {
        'pending'   => '<span class="badge badge-yellow">&#9203; Ausstehend</span>',
        'accepted'  => '<span class="badge badge-green">&#10003; Best&auml;tigt</span>',
        'declined'  => '<span class="badge badge-red">&#10005; Abgelehnt</span>',
        'cancelled' => '<span class="badge badge-grey">&#128683; Storniert</span>',
        default     => '<span class="badge badge-grey">' . htmlspecialchars($status, ENT_QUOTES, 'UTF-8') . '</span>',
    };
}

function rowBg(string $status): string {
    return match ($status) {
        'pending'   => '#fffbf0',
        'accepted'  => '#f0f9f2',
        'declined'  => '#fdf0f0',
        'cancelled' => '#f8f8f8',
        default     => '#fff',
    };
}

header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Picknick-Verwaltung &ndash; Pension Volgenandt</title>
<style>
* { box-sizing: border-box; }
body { margin: 0; font-family: Arial, Helvetica, sans-serif; background: #f7f5f0; color: #333; font-size: 14px; }
.topbar { background: #3d5a3e; color: #fff; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; }
.topbar h1 { margin: 0; font-size: 18px; }
.topbar small { color: #c8d8c0; font-size: 12px; display: block; margin-top: 2px; }
.logout-btn { background: rgba(255,255,255,.15); color: #fff; border: 1px solid rgba(255,255,255,.3); padding: 6px 14px; border-radius: 5px; cursor: pointer; font-size: 13px; }
.logout-btn:hover { background: rgba(255,255,255,.25); }
.container { max-width: 1150px; margin: 0 auto; padding: 24px 16px; }
/* Login */
.login-wrap { display: flex; align-items: center; justify-content: center; min-height: 80vh; }
.login-box { background: #fff; border-radius: 10px; padding: 40px; max-width: 380px; width: 90%; box-shadow: 0 2px 12px rgba(0,0,0,.08); text-align: center; }
.login-box h2 { color: #3d5a3e; margin: 0 0 24px; }
.login-box input[type=password] { width: 100%; padding: 10px 14px; border: 1px solid #ddd; border-radius: 6px; font-size: 15px; margin-bottom: 14px; }
.login-box button { width: 100%; background: #3d5a3e; color: #fff; border: none; padding: 11px; border-radius: 6px; font-size: 15px; font-weight: 700; cursor: pointer; }
.login-box button:hover { background: #2e4430; }
.error-msg { background: #fdf0f0; color: #c0392b; padding: 10px 14px; border-radius: 6px; font-size: 13px; margin-bottom: 16px; }
/* Stats */
.summary { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.stat { background: #fff; border-radius: 8px; padding: 14px 20px; box-shadow: 0 1px 4px rgba(0,0,0,.07); min-width: 110px; }
.stat-num { font-size: 26px; font-weight: 700; }
.stat-label { font-size: 12px; color: #888; margin-top: 2px; }
/* Table */
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,.07); }
thead { background: #3d5a3e; color: #fff; }
thead th { padding: 12px 14px; text-align: left; font-size: 13px; font-weight: 700; white-space: nowrap; }
tbody tr td { padding: 11px 14px; border-bottom: 1px solid #f0ede6; vertical-align: middle; }
tbody tr:last-child td { border-bottom: none; }
.amount { font-weight: 700; color: #b8860b; white-space: nowrap; }
.actions { white-space: nowrap; display: flex; gap: 5px; }
.btn { display: inline-block; padding: 5px 11px; border-radius: 5px; font-size: 12px; font-weight: 700; text-decoration: none; cursor: pointer; border: none; line-height: 1.4; }
.btn-green { background: #3d5a3e; color: #fff; }
.btn-red   { background: #c0392b; color: #fff; }
.btn-grey  { background: #7f8c8d; color: #fff; }
.btn:hover { opacity: .85; }
.badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 700; white-space: nowrap; }
.badge-yellow { background: #f5a623; color: #fff; }
.badge-green  { background: #27ae60; color: #fff; }
.badge-red    { background: #c0392b; color: #fff; }
.badge-grey   { background: #7f8c8d; color: #fff; }
.empty { text-align: center; color: #aaa; padding: 40px; }
a.contact { color: #3d5a3e; text-decoration: none; display: block; }
a.contact:hover { text-decoration: underline; }
.refresh { font-size: 12px; color: #aaa; margin-bottom: 14px; }
</style>
</head>
<body>

<div class="topbar">
  <div>
    <h1>&#127826; Picknick-Verwaltung</h1>
    <small>Pension Volgenandt</small>
  </div>
  <?php if ($loggedIn): ?>
  <form method="post" style="margin:0;">
    <button class="logout-btn" name="logout" value="1">Abmelden</button>
  </form>
  <?php endif; ?>
</div>

<?php if (!$loggedIn): ?>

<div class="login-wrap">
  <div class="login-box">
    <h2>&#128274; Anmelden</h2>
    <?php if (!empty($loginError)): ?>
      <div class="error-msg">Falsches Passwort &ndash; bitte erneut versuchen.</div>
    <?php endif; ?>
    <form method="post">
      <input type="password" name="pw" placeholder="Passwort" autofocus>
      <button type="submit">Anmelden</button>
    </form>
  </div>
</div>

<?php else: ?>

<div class="container">

<?php
$counts = ['pending' => 0, 'accepted' => 0, 'declined' => 0, 'cancelled' => 0];
foreach ($bookings as $b) {
    $s = $b['status'] ?? 'pending';
    if (isset($counts[$s])) $counts[$s]++;
}
?>

<div class="summary">
  <div class="stat">
    <div class="stat-num" style="color:#f5a623;"><?= $counts['pending'] ?></div>
    <div class="stat-label">Ausstehend</div>
  </div>
  <div class="stat">
    <div class="stat-num" style="color:#27ae60;"><?= $counts['accepted'] ?></div>
    <div class="stat-label">Best&auml;tigt</div>
  </div>
  <div class="stat">
    <div class="stat-num" style="color:#c0392b;"><?= $counts['declined'] ?></div>
    <div class="stat-label">Abgelehnt</div>
  </div>
  <div class="stat">
    <div class="stat-num" style="color:#7f8c8d;"><?= $counts['cancelled'] ?></div>
    <div class="stat-label">Storniert</div>
  </div>
</div>

<p class="refresh">Stand: <?= date('d.m.Y H:i') ?> Uhr &nbsp;&middot;&nbsp; <a href="" style="color:#3d5a3e;">Aktualisieren</a></p>

<?php if (empty($bookings)): ?>
  <div class="empty">Noch keine Buchungen vorhanden.</div>
<?php else: ?>

<div class="table-wrap">
<table>
  <thead>
    <tr>
      <th>Datum</th>
      <th>Uhrzeit</th>
      <th>Name</th>
      <th>Kontakt</th>
      <th>Paket</th>
      <th>Personen</th>
      <th>Betrag</th>
      <th>Status</th>
      <th>Aktionen</th>
    </tr>
  </thead>
  <tbody>
  <?php foreach ($bookings as $b):
    $s   = $b['status'] ?? 'pending';
    $p   = $b['_parsed'];
    $tok = urlencode($b['token'] ?? '');
    $pers = $p['erwachsene'] . ' Erw.' . ($p['kinder'] > 0 ? ' + ' . $p['kinder'] . ' Kind' . ($p['kinder'] > 1 ? 'er' : '') : '');
  ?>
  <tr style="background:<?= rowBg($s) ?>;">
    <td style="font-weight:700;white-space:nowrap;"><?= htmlspecialchars($p['datum'] ?: ($b['bookingDate'] ?? '–'), ENT_QUOTES, 'UTF-8') ?></td>
    <td style="white-space:nowrap;"><?= htmlspecialchars($p['uhrzeit'] ?: '–', ENT_QUOTES, 'UTF-8') ?></td>
    <td style="font-weight:600;"><?= htmlspecialchars($b['name'] ?? '–', ENT_QUOTES, 'UTF-8') ?></td>
    <td>
      <a class="contact" href="mailto:<?= htmlspecialchars($b['email'] ?? '', ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($b['email'] ?? '–', ENT_QUOTES, 'UTF-8') ?></a>
      <?php if (!empty($b['phone'])): ?>
      <a class="contact" style="color:#666;" href="tel:<?= htmlspecialchars($b['phone'], ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($b['phone'], ENT_QUOTES, 'UTF-8') ?></a>
      <?php endif; ?>
    </td>
    <td><?= htmlspecialchars($p['paket'] ?: '–', ENT_QUOTES, 'UTF-8') ?></td>
    <td style="white-space:nowrap;"><?= htmlspecialchars($pers, ENT_QUOTES, 'UTF-8') ?></td>
    <td class="amount"><?= number_format((float)($b['amount'] ?? 0), 2, ',', '.') ?>&nbsp;&euro;</td>
    <td><?= statusBadge($s) ?></td>
    <td>
      <div class="actions">
        <?php if ($s === 'pending'): ?>
          <a href="<?= $confirmBase ?>?token=<?= $tok ?>&action=accept" class="btn btn-green">&#10003; Best&auml;tigen</a>
          <a href="<?= $confirmBase ?>?token=<?= $tok ?>&action=decline" class="btn btn-red">&#10005; Ablehnen</a>
        <?php elseif ($s === 'accepted'): ?>
          <a href="<?= $cancelBase ?>?token=<?= $tok ?>" class="btn btn-grey">&#128683; Stornieren</a>
        <?php else: ?>
          <span style="color:#ccc;font-size:12px;">&ndash;</span>
        <?php endif; ?>
      </div>
    </td>
  </tr>
  <?php endforeach; ?>
  </tbody>
</table>
</div>

<?php endif; ?>
</div>

<?php endif; ?>
</body>
</html>
