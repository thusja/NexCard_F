// Google 로그인 관리
let GOOGLE_CLIENT_ID = '';
let tokenClient = null;
let accessToken = '';
let userEmail = '';

export default async function googleAuth() {
  const response = await fetch("https://nexcard-b.onrender.com/api/env"); // 서버로부터 환경 변수 요청
  const env = await response.json();
  GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;

  if (!GOOGLE_CLIENT_ID) {
    console.error("Google Client ID가 설정되지 않았습니다.");
    return;
  }

  // Google API가 로드될 때까지 기다리기
  if (typeof google === 'undefined') {
    console.error("Google Identity Services가 로드되지 않았습니다.");
    return;
  }

  // Google Identity Services를 사용하여 토큰 클라이언트 초기화
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/gmail.send',
    callback: async (response) => {
      if (response.error) {
        console.error('Google 인증 오류:', response.error);
      } else {
        accessToken = response.access_token;
        console.log('Google 인증 성공! 토큰이 발급되었습니다.');

        try {
          const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          const userInfo = await userInfoRes.json();
          userEmail = userInfo.email;
          console.log('로그인된 사용자 이메일:', userEmail);
        } catch (err) {
          console.error('사용자 정보 요청 실패:', err);
        }
      }
    }
  });
}

// Google 로그인 상태 확인
export function checkGoogleLogin() {
  return !!accessToken;  // 토큰이 있으면 true, 없으면 false
}

// Google 로그인 실행
export function loginWithGoogle() {
  if (tokenClient) {
    tokenClient.requestAccessToken();
  } else {
    console.error("Google 인증 클라이언트가 초기화되지 않았습니다.");
  }
}

// 현재 발급된 토큰 반환
export function getAuthToken() {
  return accessToken;
}
