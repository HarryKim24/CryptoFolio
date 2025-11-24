import { test } from '@playwright/test';

test('home', async ({ page }) => {
  test.setTimeout(120000);

  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  await page.waitForSelector('section.panel', {
    state: 'visible',
  });

  await page.waitForTimeout(2000);

  const maxScroll = await page.evaluate(() => {
    const height = document.documentElement.scrollHeight;
    const view = window.innerHeight;
    return height - view;
  });

  const scrollStep = 20;
  const scrollDelay = 10;

  for (let position = 0; position < maxScroll; position += scrollStep) {
    await page.mouse.wheel(0, scrollStep);
    await page.waitForTimeout(scrollDelay);
  }

  await page.waitForTimeout(1000);

  for (let position = maxScroll; position > 0; position -= scrollStep) {
    await page.mouse.wheel(0, -scrollStep);
    await page.waitForTimeout(scrollDelay);
  }

  await page.waitForTimeout(3000);
});