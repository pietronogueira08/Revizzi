const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // viewport screenshot (above the fold)
  await page.screenshot({ path: 'C:/Users/hufos/AppData/Local/Temp/hero-viewport.png' });
  
  // scroll down to categories
  await page.evaluate(() => window.scrollTo(0, 750));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'C:/Users/hufos/AppData/Local/Temp/categories.png' });

  // scroll to products
  await page.evaluate(() => window.scrollTo(0, 1600));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'C:/Users/hufos/AppData/Local/Temp/products.png' });

  console.log('Console errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})();
