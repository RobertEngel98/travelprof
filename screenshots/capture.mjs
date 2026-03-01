import { chromium } from 'playwright';

const BASE = 'http://localhost:3099/analyse';
const DIR = 'C:/Users/robee/Projects/travelprof/screenshots';

const iPhone = { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true };

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: iPhone.width, height: iPhone.height },
    deviceScaleFactor: iPhone.deviceScaleFactor,
    isMobile: iPhone.isMobile,
    hasTouch: iPhone.hasTouch,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });
  const page = await context.newPage();

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Screenshot Frage 1 (Status)
  await page.screenshot({ path: `${DIR}/01-frage-status.png`, fullPage: false });
  console.log('✓ 01 Frage: Status');

  // Answer Q1: "Etwas Erfahrung" (2nd option)
  const q1options = page.locator('.a-option');
  await q1options.nth(1).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${DIR}/02-frage-lebensphase.png`, fullPage: false });
  console.log('✓ 02 Frage: Lebensphase');

  // Answer Q2: "Angestellt" (2nd option)
  await page.locator('.a-option').nth(1).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${DIR}/03-frage-reisefrequenz.png`, fullPage: false });
  console.log('✓ 03 Frage: Reisefrequenz');

  // Answer Q3: "3-5 mal" (2nd option)
  await page.locator('.a-option').nth(1).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${DIR}/04-frage-reiseziel.png`, fullPage: false });
  console.log('✓ 04 Frage: Reiseziel');

  // Answer Q4: "Fernreise" (2nd option)
  await page.locator('.a-option').nth(1).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${DIR}/05-frage-budget.png`, fullPage: false });
  console.log('✓ 05 Frage: Budget');

  // Answer Q5: "3.000-5.000€" (3rd option = high budget, more impressive result)
  await page.locator('.a-option').nth(2).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${DIR}/06-frage-karten.png`, fullPage: false });
  console.log('✓ 06 Frage: Karten');

  // Answer Q6: "Keine / nur Girokarte" (1st option)
  await page.locator('.a-option').nth(0).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${DIR}/07-frage-ziel.png`, fullPage: false });
  console.log('✓ 07 Frage: Ziel');

  // Answer Q7: "Alles zusammen!" (4th option)
  await page.locator('.a-option').nth(3).click();
  await page.waitForTimeout(600);

  // Now at Paywall
  await page.screenshot({ path: `${DIR}/08-paywall.png`, fullPage: false });
  console.log('✓ 08 Paywall');

  // Scroll paywall to show full content
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${DIR}/09-paywall-scroll.png`, fullPage: false });
  console.log('✓ 09 Paywall (scrolled)');

  // Click "Bereits bezahlt? Ergebnis anzeigen" to bypass payment
  await page.locator('button:has-text("Ergebnis anzeigen")').click();
  await page.waitForTimeout(600);

  // Now at Lead Form
  await page.screenshot({ path: `${DIR}/10-lead-form.png`, fullPage: false });
  console.log('✓ 10 Lead Form');

  // Fill in lead form
  const inputs = page.locator('.a-field input');
  await inputs.nth(0).fill('Max');         // Vorname
  await inputs.nth(1).fill('Mustermann');  // Nachname
  await inputs.nth(2).fill('max@beispiel.de'); // Email
  await inputs.nth(3).fill('+49 176 12345678'); // Telefon
  await page.waitForTimeout(300);

  await page.screenshot({ path: `${DIR}/11-lead-filled.png`, fullPage: false });
  console.log('✓ 11 Lead Form (filled)');

  // Submit
  await page.locator('.a-submit').click();
  await page.waitForTimeout(800);

  // Loading screen
  await page.screenshot({ path: `${DIR}/12-loading.png`, fullPage: false });
  console.log('✓ 12 Loading');

  // Wait for results
  await page.waitForTimeout(2500);

  // Results page - multiple scroll positions
  await page.screenshot({ path: `${DIR}/13-ergebnis-header.png`, fullPage: false });
  console.log('✓ 13 Ergebnis Header');

  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${DIR}/14-ergebnis-meilen.png`, fullPage: false });
  console.log('✓ 14 Ergebnis Meilen');

  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${DIR}/15-ergebnis-karten.png`, fullPage: false });
  console.log('✓ 15 Ergebnis Karten');

  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${DIR}/16-ergebnis-karten-2.png`, fullPage: false });
  console.log('✓ 16 Ergebnis Karten 2');

  await page.evaluate(() => window.scrollTo(0, 2200));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${DIR}/17-ergebnis-sammeltipps.png`, fullPage: false });
  console.log('✓ 17 Ergebnis Sammeltipps');

  await page.evaluate(() => window.scrollTo(0, 3000));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${DIR}/18-ergebnis-buchung.png`, fullPage: false });
  console.log('✓ 18 Ergebnis Buchung');

  await page.evaluate(() => window.scrollTo(0, 4000));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${DIR}/19-ergebnis-partner.png`, fullPage: false });
  console.log('✓ 19 Ergebnis Partner');

  await page.evaluate(() => document.documentElement.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${DIR}/20-ergebnis-cta.png`, fullPage: false });
  console.log('✓ 20 Ergebnis CTA');

  // Full page screenshot
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${DIR}/21-ergebnis-fullpage.png`, fullPage: true });
  console.log('✓ 21 Ergebnis Full Page');

  await browser.close();
  console.log('\n✅ Alle Screenshots gespeichert in:', DIR);
}

main().catch(e => { console.error(e); process.exit(1); });
