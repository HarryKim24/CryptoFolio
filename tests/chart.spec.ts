import { test } from '@playwright/test';

test('chart page interaction test', async ({ page }) => {
  test.setTimeout(120000);

  await page.goto('http://localhost:3000/chart/KRW-BTC');
  await page.waitForLoadState('networkidle');

  await page.waitForSelector('input[placeholder="코인명 또는 심볼 검색"]', { state: 'visible' });
  await page.waitForTimeout(2000);

  const searchInput = page.locator('input[placeholder="코인명 또는 심볼 검색"]');
  const inputs = ['ㅇ', 'ㅇㄷ', 'ㅇㄷㄹ', 'ㅇㄷㄹㅇ'];

  for (const value of inputs) {
    await searchInput.fill(value);
    await page.waitForTimeout(500);
  }

  const firstCoinItem = page.locator(
    'div.flex.justify-between.items-start.px-2.py-1.rounded.cursor-pointer'
  ).first();
  await firstCoinItem.waitFor({ state: 'visible', timeout: 10000 });
  await firstCoinItem.scrollIntoViewIfNeeded();
  await firstCoinItem.click();
  await page.waitForTimeout(2000);

  const weekButton = page.locator('button:has-text("주")');
  await weekButton.waitFor({ state: 'visible', timeout: 5000 });
  await weekButton.click();
  await page.waitForTimeout(2000);

  const monthButton = page.locator('button:has-text("월")');
  await monthButton.waitFor({ state: 'visible', timeout: 5000 });
  await monthButton.click();
  await page.waitForTimeout(2000);

  await page.waitForTimeout(2000);
});
