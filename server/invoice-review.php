<?php
/**
 * Invoice draft review page.
 * Simone visits this page via the link in her notification email.
 *
 * GET  ?token=UUID          — show draft + approve/reject form
 * GET  ?token=UUID&dl=1     — download approved PDF
 * POST action=approve       — finalize: generate PDF, email guest, mark approved
 * POST action=reject        — mark rejected
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/invoice-draft.php';
require_once __DIR__ . '/invoice-pdf.php';
require_once __DIR__ . '/invoice-mailer.php';

// ---------------------------------------------------------------------------
// Load and validate draft
// ---------------------------------------------------------------------------

$token     = preg_replace('/[^a-f0-9\-]/', '', $_GET['token'] ?? '');
$draftPath = INV_DRAFTS_DIR . '/' . $token . '.json';

if (!$token || !file_exists($draftPath)) {
    http_response_code(404);
    die(reviewPage('Entwurf nicht gefunden', '<p>Dieser Link ist ungültig oder abgelaufen.</p>'));
}

$draft  = json_decode(file_get_contents($draftPath), true);
$status = $draft['status'] ?? 'pending';
$invNum = $draft['invoiceNumber'] ?? '';
$pdfPath = __DIR__ . '/invoices/sent/' . $token . '.pdf';

// ---------------------------------------------------------------------------
// PDF download
// ---------------------------------------------------------------------------

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['dl']) && $status === 'approved' && file_exists($pdfPath)) {
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="Rechnung-' . $invNum . '.pdf"');
    header('Content-Length: ' . filesize($pdfPath));
    readfile($pdfPath);
    exit;
}

// ---------------------------------------------------------------------------
// POST: approve or reject
// ---------------------------------------------------------------------------

$flash = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $status === 'pending') {
    $action = $_POST['action'] ?? '';
    $note   = trim($_POST['note'] ?? '');

    if ($action === 'approve') {
        $draft['note']        = $note;
        $draft['invoiceDate'] = date('Y-m-d');
        $draft['approvedAt']  = date('c');
        $draft['status']      = 'approved';

        // Generate PDF
        $pdfBytes = generateInvoicePdf($draft);

        // Save PDF file
        $sentDir = __DIR__ . '/invoices/sent';
        if (!is_dir($sentDir)) mkdir($sentDir, 0750, true);
        file_put_contents($pdfPath, $pdfBytes);

        // Email guest
        $emailSent = sendInvoiceToGuest($draft, $pdfBytes);
        $draft['guestEmailSent'] = $emailSent;

        // Persist
        file_put_contents($draftPath, json_encode($draft, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        draftLog((int)($draft['bookingId'] ?? 0), 'approved', "token={$token} emailSent=" . ($emailSent ? '1' : '0'));

        $status = 'approved';
        $flash  = $emailSent
            ? 'ok:Rechnung genehmigt und an ' . htmlspecialchars($draft['guest']['email'] ?? '') . ' gesendet.'
            : 'ok:Rechnung genehmigt. Kein E-Mail-Versand — Gast hat keine E-Mail-Adresse hinterlegt.';

    } elseif ($action === 'reject') {
        $draft['note']       = $note;
        $draft['status']     = 'rejected';
        $draft['rejectedAt'] = date('c');
        file_put_contents($draftPath, json_encode($draft, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        draftLog((int)($draft['bookingId'] ?? 0), 'rejected', "token={$token}");

        $status = 'rejected';
        $flash  = 'err:Rechnung abgelehnt.';
    }
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

$guest    = $draft['guest'];
$stay     = $draft['stay'];
$totals   = $draft['totals'];
$checkIn  = $stay['checkIn']  ? date('d.m.Y', strtotime($stay['checkIn']))  : '–';
$checkOut = $stay['checkOut'] ? date('d.m.Y', strtotime($stay['checkOut'])) : '–';
$total    = number_format((float)($totals['total'] ?? 0), 2, ',', '.');

$statusLabels = ['pending' => 'Ausstehend', 'approved' => 'Genehmigt', 'rejected' => 'Abgelehnt'];
$statusColors = ['pending' => '#e67e22',    'approved' => '#27ae60',   'rejected' => '#c0392b'];
$statusLabel  = $statusLabels[$status] ?? $status;
$statusColor  = $statusColors[$status] ?? '#888';

$previewHtml = htmlspecialchars(buildInvoiceHtml($draft), ENT_QUOTES, 'UTF-8');

[$flashType, $flashMsg] = $flash ? explode(':', $flash, 2) : ['', ''];

ob_start();
?>
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rechnung <?= htmlspecialchars($invNum) ?> prüfen</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #333; background: #f2f4f3; }
.wrap  { max-width: 860px; margin: 0 auto; padding: 28px 16px 60px; }
.card  { background: #fff; border-radius: 8px; padding: 24px; margin-bottom: 18px; box-shadow: 0 1px 3px rgba(0,0,0,.09); }
h1 { font-size: 19px; color: #3d5a3e; margin-bottom: 4px; }
.meta { font-size: 12px; color: #999; margin-bottom: 18px; }
.badge { display:inline-block; padding: 3px 11px; border-radius: 12px; font-size: 12px; font-weight: 600; color: #fff; }
table.info { width: 100%; border-collapse: collapse; }
table.info td { padding: 8px 10px; border-bottom: 1px solid #f0f0f0; }
table.info td:first-child { color: #777; width: 150px; white-space: nowrap; }
.actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 18px; }
.btn { padding: 11px 22px; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; }
.btn-green { background: #3d5a3e; color: #fff; }
.btn-green:hover { background: #2e4530; }
.btn-red   { background: #c0392b; color: #fff; }
.btn-red:hover   { background: #a93226; }
.btn-link  { background: none; border: 1px solid #ccc; color: #555; }
.btn-link:hover  { border-color: #999; }
textarea { width: 100%; border: 1px solid #d5d5d5; border-radius: 5px; padding: 9px 11px; font-size: 13px; resize: vertical; font-family: inherit; }
.flash-ok  { background: #eafaf1; border: 1px solid #a9dfbf; color: #1e8449; border-radius: 6px; padding: 13px 16px; margin-bottom: 18px; }
.flash-err { background: #fdecea; border: 1px solid #f5b7b1; color: #c0392b; border-radius: 6px; padding: 13px 16px; margin-bottom: 18px; }
.preview iframe { width: 100%; height: 680px; border: none; display: block; border-radius: 0 0 8px 8px; }
.preview-head { background: #f8f8f8; border-bottom: 1px solid #e0e0e0; padding: 10px 16px; font-size: 12px; color: #888; border-radius: 8px 8px 0 0; }
label { display: block; font-weight: 600; margin-bottom: 6px; }
</style>
</head>
<body>
<div class="wrap">

  <?php if ($flashMsg): ?>
  <div class="flash-<?= $flashType === 'ok' ? 'ok' : 'err' ?>">
    <?= $flashType === 'ok' ? '✓' : '✗' ?> <?= htmlspecialchars($flashMsg) ?>
    <?php if ($status === 'approved' && file_exists($pdfPath)): ?>
    &nbsp;·&nbsp; <a href="?token=<?= urlencode($token) ?>&dl=1" style="font-weight:700;">PDF herunterladen</a>
    <?php endif; ?>
  </div>
  <?php endif; ?>

  <div class="card">
    <h1>Rechnung Nr. <?= htmlspecialchars($invNum) ?> prüfen</h1>
    <p class="meta">
      Buchung #<?= (int)($draft['bookingId'] ?? 0) ?> &nbsp;·&nbsp;
      Erstellt: <?= date('d.m.Y H:i', strtotime($draft['createdAt'] ?? 'now')) ?> &nbsp;·&nbsp;
      <span class="badge" style="background:<?= $statusColor ?>;"><?= $statusLabel ?></span>
    </p>

    <table class="info">
      <tr><td>Gast</td><td><strong><?= htmlspecialchars($guest['name'] ?? '–') ?></strong></td></tr>
      <tr><td>E-Mail Gast</td><td><?= htmlspecialchars($guest['email'] ?? '–') ?></td></tr>
      <tr><td>Zimmer</td><td><?= htmlspecialchars($stay['roomName'] ?? '–') ?></td></tr>
      <tr><td>Zeitraum</td><td><?= $checkIn ?> – <?= $checkOut ?> &nbsp;(<?= (int)($stay['nights'] ?? 0) ?> Nächte, <?= (int)($stay['adults'] ?? 0) ?> Erw.)</td></tr>
      <tr><td>Gesamtbetrag</td><td><strong><?= $total ?> €</strong></td></tr>
      <?php if (!empty($draft['approvedAt'])): ?>
      <tr><td>Genehmigt</td><td><?= date('d.m.Y H:i', strtotime($draft['approvedAt'])) ?></td></tr>
      <?php endif; ?>
      <?php if (!empty($draft['note'])): ?>
      <tr><td>Notiz</td><td><?= htmlspecialchars($draft['note']) ?></td></tr>
      <?php endif; ?>
    </table>
  </div>

  <?php if ($status === 'pending'): ?>
  <div class="card">
    <form method="post">
      <label for="note">Hinweis / Notiz <span style="font-weight:400;color:#999;">(optional — erscheint auf der Rechnung)</span></label>
      <textarea id="note" name="note" rows="2" placeholder="z.B. Rabatt, Sondervereinbarung ..."><?= htmlspecialchars($draft['note'] ?? '') ?></textarea>
      <div class="actions">
        <button type="submit" name="action" value="approve" class="btn btn-green">✓ Genehmigen &amp; an Gast senden</button>
        <button type="submit" name="action" value="reject"  class="btn btn-red"
                onclick="return confirm('Entwurf wirklich ablehnen?');">✗ Ablehnen</button>
      </div>
    </form>
  </div>
  <?php elseif ($status === 'approved' && file_exists($pdfPath)): ?>
  <div class="card">
    <a href="?token=<?= urlencode($token) ?>&dl=1" class="btn btn-link">⬇ Genehmigte Rechnung herunterladen</a>
  </div>
  <?php endif; ?>

  <div class="preview">
    <div class="preview-head">Rechnungsvorschau</div>
    <iframe srcdoc="<?= $previewHtml ?>"></iframe>
  </div>

</div>
</body>
</html>
<?php
$body = ob_get_clean();
echo $body;

// ---------------------------------------------------------------------------
// Helper: bare error page
// ---------------------------------------------------------------------------

function reviewPage(string $title, string $body): string {
    return '<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><title>' . htmlspecialchars($title)
        . '</title></head><body style="font-family:Arial;padding:40px;color:#333;"><h2>' . htmlspecialchars($title)
        . '</h2>' . $body . '</body></html>';
}
