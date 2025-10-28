import { test } from '@playwright/test';

test('main', async ({ page }) => {
  test.setTimeout(20000);

  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  await page.waitForTimeout(6000);
});
