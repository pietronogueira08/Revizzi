const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  for (const y of [300, 700, 1200, 2000, 2800]) {
    await page.evaluate((s) => window.scrollTo(0, s), y);
    await page.waitForTimeout(700);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/hufos/AppData/Local/Temp/home-animated.png', fullPage: true });
  await browser.close();
  console.log('done');
})();
