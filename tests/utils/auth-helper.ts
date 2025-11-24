import axios from 'axios';

export async function getSessionToken(email: string, password: string) {
  const csrfResponse = await axios.get('http://localhost:3000/api/auth/csrf', {
    withCredentials: true,
  });

  const csrfToken = csrfResponse.data.csrfToken;
  const csrfCookies = csrfResponse.headers['set-cookie'];

  let csrfCookieHeader = '';

  if (csrfCookies && Array.isArray(csrfCookies)) {
    csrfCookieHeader = csrfCookies.join('; ');
  }

  const loginBody = new URLSearchParams({
    csrfToken,
    email,
    password,
  });

  const loginResponse = await axios.post(
    'http://localhost:3000/api/auth/callback/credentials',
    loginBody,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: csrfCookieHeader,
      },
      maxRedirects: 0,
      validateStatus: () => true,
      withCredentials: true,
    }
  );

  console.log('로그인 응답 상태:', loginResponse.status);
  console.log('로그인 응답 데이터:', loginResponse.data);
  console.log('발급된 쿠키:', loginResponse.headers['set-cookie']);

  const responseCookies = loginResponse.headers['set-cookie'] || [];
  let sessionCookie = '';
  let sessionToken = '';

  for (const cookie of responseCookies) {
    const isSessionToken =
      cookie.startsWith('next-auth.session-token=') ||
      cookie.startsWith('__Secure-next-auth.session-token=');

    if (isSessionToken) {
      sessionCookie = cookie;
      break;
    }
  }

  if (sessionCookie) {
    const cookieParts = sessionCookie.split(';')[0];
    const tokenParts = cookieParts.split('=');

    if (tokenParts.length > 1) {
      sessionToken = tokenParts[1];
    }
  }

  if (!sessionToken) {
    throw new Error(
      `세션 토큰을 가져오지 못했습니다 (상태: ${loginResponse.status}, 응답: ${JSON.stringify(
        loginResponse.data
      )})`
    );
  }

  return sessionToken;
}