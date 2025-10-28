import { test } from '@playwright/test';

test('trends page basic load test', async ({ page }) => {
  test.setTimeout(30000);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000/trends');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(7000);
});