import { test, expect } from '@playwright/test';

test('register and login flow', async ({ page }) => {
  test.setTimeout(200000);

  await page.goto('http://localhost:3000/register');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  const nameInput = page.locator('input[placeholder="이름"]');
  const nameSteps = ['t', 'te', 'tes', 'test'];
  for (const value of nameSteps) { await nameInput.fill(value); await page.waitForTimeout(150); }
  await page.waitForTimeout(500);

  const emailInput = page.locator('input[placeholder="이메일"]');
  const emailSteps = ['t','te','tes','test','test5','test5@','test5@n','test5@na','test5@nav','test5@naver','test5@naver.','test5@naver.c','test5@naver.co','test5@naver.com'];
  for (const value of emailSteps) { await emailInput.fill(value); await page.waitForTimeout(150); }
  await page.waitForTimeout(500);

  const passwordInput = page.locator('input[placeholder="비밀번호"]');
  const passwordSteps = ['t','te','tes','test','test1','test12','test123','test1234'];
  for (const value of passwordSteps) { await passwordInput.fill(value); await page.waitForTimeout(150); }
  await page.waitForTimeout(500);

  const confirmPasswordInput = page.locator('input[placeholder="비밀번호 확인"]');
  for (const value of passwordSteps) { await confirmPasswordInput.fill(value); await page.waitForTimeout(150); }
  await page.waitForTimeout(500);

  const registerButton = page.locator('button:has-text("회원가입")');
  await expect(registerButton).toBeEnabled({ timeout: 5000 });
  await page.waitForTimeout(300);
  await registerButton.hover();
  await registerButton.click({ force: true });
  await page.waitForTimeout(2000);

  const loginEmailInput = page.locator('input[placeholder="이메일"]');
  const loginEmailSteps = ['t','te','tes','test','test5','test5@','test5@n','test5@na','test5@nav','test5@naver','test5@naver.','test5@naver.c','test5@naver.co','test5@naver.com'];
  for (const value of loginEmailSteps) { await loginEmailInput.fill(value); await page.waitForTimeout(150); }
  await page.waitForTimeout(500);

  const loginPasswordInput = page.locator('input[placeholder="비밀번호"]');
  const loginPasswordSteps = ['t','te','tes','test','test1','test12','test123','test1234'];
  for (const value of loginPasswordSteps) { await loginPasswordInput.fill(value); await page.waitForTimeout(150); }
  await page.waitForTimeout(500);

  const loginButton = page.locator('form button:has-text("로그인")');
  await expect(loginButton).toBeEnabled({ timeout: 5000 });
  await page.waitForTimeout(300);
  await loginButton.hover();
  await loginButton.click({ force: true });
  await page.waitForTimeout(4000);

  await expect(page).toHaveURL('http://localhost:3000/');
});