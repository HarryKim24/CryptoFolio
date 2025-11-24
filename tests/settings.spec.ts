import { test, expect } from '@playwright/test';
import { getSessionToken } from './utils/auth-helper';

test('change password on settings page', async ({ page, context }) => {
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

  await page.goto('http://localhost:3000/settings');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  const editButton = page.locator('button:has-text("수정")');
  await editButton.click();
  await page.waitForTimeout(2000);

  const currentPasswordInput = page.locator(
    'input[placeholder="현재 비밀번호"]'
  );

  const currentPasswordSteps = [
    't',
    'te',
    'tes',
    'test',
    'test1',
    'test12',
    'test123',
    'test1234',
  ];

  for (const value of currentPasswordSteps) {
    await currentPasswordInput.fill(value);
    await page.waitForTimeout(200);
  }

  await page.waitForTimeout(1000);

  const newPasswordInput = page.locator('input[placeholder="새 비밀번호"]');

  const newPasswordSteps = [
    't',
    'te',
    'tes',
    'test',
    'test1',
    'test12',
    'test123',
    'test1234',
    'test12345',
  ];

  for (const value of newPasswordSteps) {
    await newPasswordInput.fill(value);
    await page.waitForTimeout(200);
  }

  await page.waitForTimeout(1000);

  const confirmPasswordInput = page.locator(
    'input[placeholder="새 비밀번호 확인"]'
  );

  for (const value of newPasswordSteps) {
    await confirmPasswordInput.fill(value);
    await page.waitForTimeout(200);
  }

  await page.waitForTimeout(1000);

  const saveButton = page.locator('button:has-text("저장")');
  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toContain('수정 완료');
    await dialog.accept();
  });

  await page.waitForTimeout(3000);
});