import { test } from '@playwright/test';
import { getSessionToken } from './utils/auth-helper';

test('portfolio page with login session', async ({ page, context }) => {
  test.setTimeout(60000);

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
  await page.waitForTimeout(2000);
});