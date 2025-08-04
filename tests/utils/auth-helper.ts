import axios from 'axios';

export async function getSessionToken(email: string, password: string) {
  const csrfRes = await axios.get('http://localhost:3000/api/auth/csrf', {
    withCredentials: true,
  });

  const csrfToken = csrfRes.data.csrfToken;
  const csrfCookie = csrfRes.headers['set-cookie'];

  const loginResponse = await axios.post(
    'http://localhost:3000/api/auth/callback/credentials',
    new URLSearchParams({
      csrfToken,
      email,
      password,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: csrfCookie?.join('; ') || '',
      },
      maxRedirects: 0,
      validateStatus: () => true,
      withCredentials: true,
    }
  );

  console.log('🔍 로그인 응답 상태:', loginResponse.status);
  console.log('🔍 로그인 응답 데이터:', loginResponse.data);
  console.log('🔍 발급된 쿠키:', loginResponse.headers['set-cookie']);

  const cookies = loginResponse.headers['set-cookie'] || [];
  const sessionCookie = cookies.find(
    (cookie) =>
      cookie.startsWith('next-auth.session-token=') ||
      cookie.startsWith('__Secure-next-auth.session-token=')
  );

  const sessionToken = sessionCookie?.split(';')[0].split('=')[1];

  if (!sessionToken) {
    throw new Error(
      `세션 토큰을 가져오지 못했습니다 (상태: ${loginResponse.status}, 응답: ${JSON.stringify(loginResponse.data)})`
    );
  }

  return sessionToken;
}