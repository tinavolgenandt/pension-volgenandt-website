import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await context.newPage();

await page.goto('https://mein.ionos.de/websites/website_builder-785858444');

// Wait for login — poll until we're past the login page
console.log('>>> Warte auf Login...');
while (true) {
  const url = page.url();
  if (!url.includes('login') && !url.includes('auth') && url.includes('ionos.de')) {
    // Check if page has real content (not login form)
    const hasContent = await page.locator('[class*="dashboard"], [class*="contract"], [class*="navigation"], [class*="sidebar"]').count();
    if (hasContent > 0) break;
  }
  await page.waitForTimeout(2000);
}

console.log('>>> Eingeloggt! Starte Analyse...');
await page.waitForTimeout(3000);

// Screenshot the current page
await page.screenshot({ path: 'ionos-main.png', fullPage: true });
console.log('Screenshot 1: ionos-main.png');

// Navigate to email section
console.log('\n--- E-Mail Bereich ---');
await page.goto('https://mein.ionos.de/email');
await page.waitForTimeout(5000);
await page.screenshot({ path: 'ionos-email.png', fullPage: true });
console.log('Screenshot 2: ionos-email.png');

// Collect all visible text for analysis
const emailPageText = await page.locator('body').innerText();
console.log('\n--- E-Mail Page Content (first 3000 chars) ---');
console.log(emailPageText.substring(0, 3000));

// Look for upgrade/expand options
const upgradeEls = await page.locator('a, button').filter({ hasText: /erweitern|upgrade|hinzufügen|buchen|tarif|wechseln|paket/i }).all();
console.log(`\n--- ${upgradeEls.length} Upgrade-Elemente gefunden ---`);
for (const el of upgradeEls) {
  const text = (await el.textContent()).trim().replace(/\s+/g, ' ');
  const href = await el.getAttribute('href');
  console.log(`  - "${text}" ${href ? '-> ' + href : ''}`);
}

// Try Microsoft 365 / Office page
console.log('\n--- Office/Microsoft 365 Bereich ---');
await page.goto('https://mein.ionos.de/office');
await page.waitForTimeout(5000);
await page.screenshot({ path: 'ionos-office.png', fullPage: true });
console.log('Screenshot 3: ionos-office.png');

const officePageText = await page.locator('body').innerText();
console.log('\n--- Office Page Content (first 3000 chars) ---');
console.log(officePageText.substring(0, 3000));

// Check account overview for current packages
console.log('\n--- Vertragsübersicht ---');
await page.goto('https://mein.ionos.de/account/contracts');
await page.waitForTimeout(5000);
await page.screenshot({ path: 'ionos-contracts.png', fullPage: true });
console.log('Screenshot 4: ionos-contracts.png');

const contractsText = await page.locator('body').innerText();
console.log('\n--- Contracts Page Content (first 3000 chars) ---');
console.log(contractsText.substring(0, 3000));

console.log('\n>>> FERTIG! Browser bleibt offen.');
// Keep browser open for 5 minutes so user can see
await page.waitForTimeout(300000);
await browser.close();
