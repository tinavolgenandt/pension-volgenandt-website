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
        $requestedNumber = trim($_POST['invoice_number'] ?? '') ?: peekNextInvoiceNumber();

        if (!tryAssignInvoiceNumber($draft, $requestedNumber, $draftPath)) {
            $flash = 'err:Rechnungsnummer ' . htmlspecialchars($requestedNumber) . ' ist ungültig oder wird bereits verwendet. Bitte eine andere Nummer wählen.';
        } else {
            // Apply guest-data edits
            $draft['guest']['name']    = trim($_POST['guest_name']    ?? '') ?: ($draft['guest']['name'] ?? 'Unbekannt');
            $draft['guest']['email']   = trim($_POST['guest_email']   ?? ($draft['guest']['email']   ?? ''));
            $draft['guest']['address'] = trim($_POST['guest_address'] ?? ($draft['guest']['address'] ?? ''));
            $draft['guest']['zip']     = trim($_POST['guest_zip']     ?? ($draft['guest']['zip']     ?? ''));
            $draft['guest']['city']    = trim($_POST['guest_city']    ?? ($draft['guest']['city']    ?? ''));

            // Apply line-item edits — blank description rows (the spare ones) are dropped
            $editedItems = [];
            foreach (($_POST['item_desc'] ?? []) as $i => $desc) {
                $desc = trim((string)$desc);
                if ($desc === '') continue;
                $qty   = (float)($_POST['item_qty'][$i]  ?? 1);
                $unit  = (float)str_replace(',', '.', (string)($_POST['item_unit'][$i] ?? 0));
                $vat   = (int)($_POST['item_vat'][$i] ?? 7);
                $gross = round($qty * $unit, 2);
                if (abs($gross) < 0.01) continue;
                $editedItems[] = makeLineItem($desc, $gross, $vat, $qty, $unit);
            }
            if (!empty($editedItems)) {
                $draft['lineItems'] = $editedItems;
                $draft['totals']    = calcTotals($editedItems);
            }

            $isFirmenrechnung = ($_POST['is_firmenrechnung'] ?? '') === '1';
            $draft['isFirmenrechnung'] = $isFirmenrechnung;
            $draft['companyName']      = trim($_POST['company_name']      ?? '');
            $draft['bookingReference'] = trim($_POST['booking_reference'] ?? '');
            $draft['ohneFruehstueck']  = $isFirmenrechnung && ($_POST['ohne_fruehstueck'] ?? '') === '1';

            $draft['invoiceDate'] = date('Y-m-d');
            $draft['approvedAt']  = date('c');
            $draft['status']      = 'approved';

            // Firmenrechnung: 3 Werktage statt der üblichen 7 Tage (Simones
            // Regel, 2026-08-03) — always computed from the actual due date
            // rather than trusting free text, so it can't drift out of sync
            // with the "Wichtiger Hinweis" storno wording below.
            if ($isFirmenrechnung) {
                $due = computeDueDate(new \DateTime($draft['invoiceDate']), 3);
                $draft['paymentNote'] = 'Zahlbar bis zum ' . $due->format('d.m.Y') . '.';
            } else {
                $draft['paymentNote'] = trim($_POST['payment_note'] ?? '') ?: ($draft['paymentNote'] ?? '');
            }
            $draft['note']        = $note;

            $isPaid = ($_POST['already_paid'] ?? '') === '1';
            $draft['manuallyMarkedPaid'] = $isPaid;

            // Generate PDF
            $pdfBytes = generateInvoicePdf($draft);

            // Save PDF file
            $sentDir = __DIR__ . '/invoices/sent';
            if (!is_dir($sentDir)) mkdir($sentDir, 0750, true);
            file_put_contents($pdfPath, $pdfBytes);

            // Email guest (Steuerbüro receives a BCC copy automatically)
            $emailSent = sendInvoiceToGuest($draft, $pdfBytes, $isPaid);
            $draft['guestEmailSent'] = $emailSent;

            // Persist
            file_put_contents($draftPath, json_encode($draft, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            draftLog((int)($draft['bookingId'] ?? 0), 'approved', "token={$token} invoiceNumber={$draft['invoiceNumber']} emailSent=" . ($emailSent ? '1' : '0') . ' paid=' . ($isPaid ? '1' : '0'));

            $status = 'approved';
            $flash  = $emailSent
                ? 'ok:Rechnung ' . htmlspecialchars($draft['invoiceNumber']) . ' genehmigt und an ' . htmlspecialchars($draft['guest']['email'] ?? '') . ' gesendet.'
                : 'ok:Rechnung ' . htmlspecialchars($draft['invoiceNumber']) . ' genehmigt. Kein E-Mail-Versand — Gast hat keine E-Mail-Adresse hinterlegt.';
        }

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

// Recompute — invoiceNumber may have just been assigned above (approve), or
// may still be unset (pending), in which case show a live suggestion.
$invNum = $draft['invoiceNumber'] ?? ($status === 'pending' ? peekNextInvoiceNumber() : '');

$statusLabels = ['pending' => 'Ausstehend', 'approved' => 'Genehmigt', 'rejected' => 'Abgelehnt'];
$statusColors = ['pending' => '#e67e22',    'approved' => '#27ae60',   'rejected' => '#c0392b'];
$statusLabel  = $statusLabels[$status] ?? $status;
$statusColor  = $statusColors[$status] ?? '#888';

// Preview needs a non-empty invoice number even before approval — use the
// same live suggestion shown in the form, without persisting it to the draft.
$previewDraft = $draft;
if (empty($previewDraft['invoiceNumber'])) {
    $previewDraft['invoiceNumber'] = $invNum;
}
$previewHtml = htmlspecialchars(buildInvoiceHtml($previewDraft), ENT_QUOTES, 'UTF-8');

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
textarea,
input[type="text"], input[type="email"], input[type="number"] {
  width: 100%; border: 1px solid #d5d5d5; border-radius: 5px; padding: 9px 11px;
  font-size: 13px; resize: vertical; font-family: inherit; margin-bottom: 4px;
}
select { border: 1px solid #d5d5d5; border-radius: 5px; padding: 9px 6px; font-size: 13px; font-family: inherit; width: 100%; }
.field-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 4px; }
.field-row > div { flex: 1; min-width: 140px; }
.section-title { font-size: 15px; color: #3d5a3e; margin: 22px 0 10px; }
.section-title:first-child { margin-top: 0; }
.items-scroll { overflow-x: auto; margin-bottom: 14px; }
table.items-edit { width: 100%; border-collapse: collapse; min-width: 480px; }
table.items-edit th { text-align: left; font-size: 11px; color: #888; font-weight: 600; padding: 4px 6px; }
table.items-edit td { padding: 4px 6px; }
.checkbox-row { display: flex; align-items: flex-start; gap: 8px; font-weight: 400; margin: 16px 0; font-size: 13px; line-height: 1.5; }
.checkbox-row input { width: auto; margin-top: 3px; }
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
    <h1>Rechnung Nr. <?= htmlspecialchars($invNum) ?><?= $status === 'pending' ? ' (Vorschlag)' : '' ?> prüfen</h1>
    <p class="meta">
      Buchung #<?= (int)($draft['bookingId'] ?? 0) ?> &nbsp;·&nbsp;
      Erstellt: <?= date('d.m.Y H:i', strtotime($draft['createdAt'] ?? 'now')) ?> &nbsp;·&nbsp;
      <span class="badge" style="background:<?= $statusColor ?>;"><?= $statusLabel ?></span>
    </p>

    <table class="info">
      <?php if (($draft['scenario'] ?? '') === 'C'): ?>
      <tr><td>Art</td><td><span style="color:#e67e22;font-weight:600;">Zusatzrechnung (Extras)</span><?php if (!empty($draft['relatesTo'])): ?> — ergänzt Rechnung <?= htmlspecialchars(implode(', ', $draft['relatesTo'])) ?><?php endif; ?></td></tr>
      <?php endif; ?>
      <?php if (!empty($draft['groupBookingIds'])): ?>
      <tr><td>Gruppenbuchung</td><td><span style="color:#3d5a3e;font-weight:600;"><?= count($draft['groupBookingIds']) ?> Zimmer</span> — Buchungen #<?= htmlspecialchars(implode(', #', $draft['groupBookingIds'])) ?></td></tr>
      <?php endif; ?>
      <tr><td>Gast</td><td><strong><?= htmlspecialchars($guest['name'] ?? '–') ?></strong></td></tr>
      <tr><td>E-Mail Gast</td><td><?= htmlspecialchars($guest['email'] ?? '–') ?></td></tr>
      <?php if (!empty($draft['isFirmenrechnung'])): ?>
      <tr><td>Firma</td><td><strong><?= htmlspecialchars($draft['companyName'] ?? '–') ?></strong></td></tr>
      <?php if (!empty($draft['bookingReference'])): ?>
      <tr><td>Buchungsnummer</td><td><?= htmlspecialchars($draft['bookingReference']) ?></td></tr>
      <?php endif; ?>
      <?php endif; ?>
      <tr><td>Zimmer</td><td><?= htmlspecialchars($stay['roomName'] ?? '–') ?></td></tr>
      <tr><td>Zeitraum</td><td><?= $checkIn ?> – <?= $checkOut ?> &nbsp;(<?= (int)($stay['nights'] ?? 0) ?> Nächte, <?= (int)($stay['adults'] ?? 0) ?> Erw.)</td></tr>
      <tr><td>Gesamtbetrag</td><td><strong><?= $total ?> €</strong></td></tr>
      <?php if (!empty($draft['prePaid']) && $status === 'pending'): ?>
      <tr><td>Zahlungsstatus</td><td><span style="color:#27ae60;font-weight:600;">Bereits vollständig bezahlt</span> (laut Beds24 bei Buchungseingang)</td></tr>
      <?php endif; ?>
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
      <label for="invoice_number">Rechnungsnummer <span style="font-weight:400;color:#999;">(Vorschlag — bei Bedarf anpassen)</span></label>
      <input type="text" id="invoice_number" name="invoice_number" value="<?= htmlspecialchars($invNum) ?>" pattern="\d{4}-\d{3,}" required>

      <h2 class="section-title">Gastdaten</h2>
      <div class="field-row">
        <div><label for="guest_name">Name</label><input type="text" id="guest_name" name="guest_name" value="<?= htmlspecialchars($guest['name'] ?? '') ?>"></div>
        <div><label for="guest_email">E-Mail</label><input type="email" id="guest_email" name="guest_email" value="<?= htmlspecialchars($guest['email'] ?? '') ?>"></div>
      </div>
      <div class="field-row">
        <div><label for="guest_address">Straße</label><input type="text" id="guest_address" name="guest_address" value="<?= htmlspecialchars($guest['address'] ?? '') ?>"></div>
        <div><label for="guest_zip">PLZ</label><input type="text" id="guest_zip" name="guest_zip" value="<?= htmlspecialchars($guest['zip'] ?? '') ?>"></div>
        <div><label for="guest_city">Ort</label><input type="text" id="guest_city" name="guest_city" value="<?= htmlspecialchars($guest['city'] ?? '') ?>"></div>
      </div>

      <label class="checkbox-row">
        <input type="checkbox" id="is_firmenrechnung" name="is_firmenrechnung" value="1"
               <?= !empty($draft['isFirmenrechnung']) ? 'checked' : '' ?>
               onchange="document.getElementById('firmen-fields').style.display = this.checked ? 'block' : 'none';">
        Firmenrechnung (z.&nbsp;B. Fero Fensterbau, Barczewski) — 3 Werktage Zahlungsziel statt 7 Tage
      </label>
      <div id="firmen-fields" style="display:<?= !empty($draft['isFirmenrechnung']) ? 'block' : 'none' ?>;margin-bottom:16px;">
        <div class="field-row">
          <div><label for="company_name">Firma</label><input type="text" id="company_name" name="company_name" value="<?= htmlspecialchars($draft['companyName'] ?? '') ?>"></div>
          <div><label for="booking_reference">Buchungsnummer <span style="font-weight:400;color:#999;">(optional)</span></label><input type="text" id="booking_reference" name="booking_reference" value="<?= htmlspecialchars($draft['bookingReference'] ?? '') ?>"></div>
        </div>
        <label class="checkbox-row">
          <input type="checkbox" name="ohne_fruehstueck" value="1" <?= !empty($draft['ohneFruehstueck']) ? 'checked' : '' ?>>
          Preis ohne Frühstück — erscheint als Hinweis auf der Rechnung
        </label>
      </div>

      <h2 class="section-title">Positionen</h2>
      <div class="items-scroll">
        <table class="items-edit">
          <thead>
            <tr><th>Beschreibung</th><th>Anzahl</th><th>Einzelpreis brutto</th><th>MwSt.</th></tr>
          </thead>
          <tbody>
            <?php
              $editRows = $draft['lineItems'];
              for ($blank = 0; $blank < 2; $blank++) {
                  $editRows[] = ['description' => '', 'qty' => 1, 'unitGross' => '', 'vatRate' => 7];
              }
              foreach ($editRows as $item):
                  $vatRate = (int)($item['vatRate'] ?? 7);
            ?>
            <tr>
              <td><input type="text" name="item_desc[]" value="<?= htmlspecialchars($item['description'] ?? '') ?>"></td>
              <td><input type="number" step="0.5" min="0" name="item_qty[]" value="<?= htmlspecialchars((string)($item['qty'] ?? 1)) ?>"></td>
              <td><input type="number" step="0.01" min="0" name="item_unit[]" value="<?= htmlspecialchars($item['unitGross'] !== '' ? (string)$item['unitGross'] : '') ?>"></td>
              <td>
                <select name="item_vat[]">
                  <option value="7"  <?= $vatRate === 7  ? 'selected' : '' ?>>7%</option>
                  <option value="19" <?= $vatRate === 19 ? 'selected' : '' ?>>19%</option>
                </select>
              </td>
            </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>

      <label for="payment_note">Zahlungshinweis <span style="font-weight:400;color:#999;">(wird bei Firmenrechnung automatisch auf 3 Werktage berechnet)</span></label>
      <input type="text" id="payment_note" name="payment_note" value="<?= htmlspecialchars($draft['paymentNote'] ?? '') ?>">

      <label for="note">Hinweis / Notiz <span style="font-weight:400;color:#999;">(optional — erscheint auf der Rechnung)</span></label>
      <textarea id="note" name="note" rows="2" placeholder="z.B. Rabatt, Sondervereinbarung ..."><?= htmlspecialchars($draft['note'] ?? '') ?></textarea>

      <label class="checkbox-row">
        <input type="checkbox" name="already_paid" value="1" <?= !empty($draft['prePaid']) ? 'checked' : '' ?>>
        Bereits bezahlt (z.&nbsp;B. bar/Karte vor Ort) — Gast erhält eine Zahlungsbestätigung statt einer Zahlungsaufforderung
      </label>

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
