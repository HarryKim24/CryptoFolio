import { test } from '@playwright/test';

test('home', async ({ page }) => {
  test.setTimeout(120000);

  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  await page.waitForSelector('section.panel', { state: 'visible' });

  await page.waitForTimeout(2000);

  const maxScroll = await page.evaluate(() =>
    document.documentElement.scrollHeight - window.innerHeight
  );

  const step = 20;
  const delay = 10;

  for (let pos = 0; pos < maxScroll; pos += step) {
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(delay);
  }

  await page.waitForTimeout(1000);

  for (let pos = maxScroll; pos > 0; pos -= step) {
    await page.mouse.wheel(0, -step);
    await page.waitForTimeout(delay);
  }

  await page.waitForTimeout(3000);
});