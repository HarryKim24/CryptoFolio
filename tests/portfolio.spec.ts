import { test, expect } from '@playwright/test';
import { getSessionToken } from './utils/auth-helper';

test('portfolio page with login session', async ({ page, context }) => {
  test.setTimeout(200000);

  const sessionToken = await getSessionToken('test2@naver.com', 'test1234');

  await context.addCookies([
    {
      name: 'next-auth.session-token',
      value: sessionToken,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);

  await page.goto('http://localhost:3000/portfolio');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const confirmButton = page.locator('button:has-text("확인")');
  if (await confirmButton.isVisible()) {
    await confirmButton.click();
  }

  await page.waitForTimeout(1000);

  const addTransactionButton = page.locator('button:has-text("거래 추가")');
  await addTransactionButton.click();
  await page.waitForTimeout(1000);

  const buyButton = page.locator('button:has-text("구매")');
  await buyButton.click();
  await page.waitForTimeout(1000);

  const searchInput = page.locator('input[placeholder="코인 검색"]');
  const inputs = ['ㅂ', 'ㅂㅌ', 'ㅂㅌㅋ', 'ㅂㅌㅋㅇ'];

  for (const value of inputs) {
    await searchInput.fill(value);
    await page.waitForTimeout(300);
  }

  await searchInput.fill('비트코인 (BTC)');
  await page.waitForTimeout(1000);

  const quantityInput = page.locator('input[placeholder="수량"]');
  await quantityInput.fill('1');
  await page.waitForTimeout(300);

  const priceInput = page.locator('input[placeholder="코인당 가격"]');
  const priceValues = ['1', '10', '100', '1000', '10000', '100000', '1000000', '10000000', '100000000'];

  for (const value of priceValues) {
    await priceInput.fill(value);
    await page.waitForTimeout(150);
  }

  await page.waitForTimeout(1000);

  const datePickerInput = page.locator('input[placeholder="날짜 선택"]');
  await datePickerInput.click();
  await page.waitForTimeout(500);

  const dateCell = page.locator('.react-datepicker__day').nth(10);
  await dateCell.click();
  await page.waitForTimeout(500);

  const saveButton = page.locator('form button:has-text("거래 추가")');
  await expect(saveButton).toBeEnabled({ timeout: 5000 });
  await page.waitForTimeout(300);
  await saveButton.hover();
  await saveButton.click({ force: true });
  await page.waitForTimeout(4000);
});