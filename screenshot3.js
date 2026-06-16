const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);

  // force all animated elements visible (bypass GSAP)
  await page.evaluate(() => {
    const sel = '.hero-anim, .hero-badge, .hero-bg, .animate-section, .category-card, .trust-badge';
    document.querySelectorAll(sel).forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.visibility = 'visible';
    });
  });
  await page.waitForTimeout(300);

  // hero
  await page.screenshot({ path: 'C:/Users/hufos/AppData/Local/Temp/hero-forced.png' });
  
  // categories
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'C:/Users/hufos/AppData/Local/Temp/categories-forced.png' });

  // products
  await page.evaluate(() => window.scrollTo(0, 1700));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'C:/Users/hufos/AppData/Local/Temp/products-forced.png' });

  await browser.close();
  console.log('done');
})();
