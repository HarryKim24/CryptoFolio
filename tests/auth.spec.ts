import { test } from '@playwright/test';

test('access register page and wait', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('http://localhost:3000/register');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
});