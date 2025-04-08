import { checkGoogleLogin, loginWithGoogle, getAuthToken, getUserEmail } from "./googleAuth.js";
import captureCardAsBase64 from "../utils/captureCardAsBase64.js";

// 유니코드-safe Base64 인코딩 함수
function encodeToBase64(str) {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// 제목 인코딩 함수 추가
function encodeSubject(text) {
  const base64 = btoa(unescape(encodeURIComponent(text)));
  return `=?UTF-8?B?${base64}?=`;
}

export default async function sendEmail() {
  // 로그인 확인
  if (!checkGoogleLogin()) {
    alert("Google 로그인이 필요합니다.");
    loginWithGoogle();
    return;
  }

  // 토큰 확인 
  const accessToken = getAuthToken();
  if (!accessToken) {
    console.error("인증 토큰이 존재하지 않습니다. 다시 로그인해 주세요.");
    return;
  }

  // 본인 이메일 가져오기
  const userEmail = getUserEmail();
  if (!userEmail) {
    alert("사용자 이메일을 확인할 수 없습니다. 다시 로그인해 주세요.");
    return;
  }

  const base64Image = await captureCardAsBase64(); // 명함 이미지를 Base64로 변환

  if (!base64Image) {
    alert("이미지 변환에 실패했습니다.");
    return;
  }

  const subject = encodeSubject('내 명함 정보');

  // 명확한 MIME 구조 (줄바꿈, 헤더 포함 주의)
  const emailContent = [
    'Content-Type: multipart/mixed; boundary="boundary_string"',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    'From: me',
    `To: ${userEmail}`,
    '',
    '--boundary_string',
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: 7bit',
    '',
    '첨부된 이미지는 내 명함입니다.',
    '',
    '--boundary_string',
    'Content-Type: image/png',
    'Content-Transfer-Encoding: base64',
    'Content-Disposition: attachment; filename="business_card.png"',
    '',
    base64Image.split(',')[1], // Data URI에서 base64만 추출
    '',
    '--boundary_string--',
    ''
  ].join('\r\n'); // 줄바꿈 통일

  try {
    // 유니코드-safe base64url 인코딩
    const base64EncodedEmail = encodeToBase64(emailContent);

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        raw: base64EncodedEmail
      })
    });

    if (response.ok) {
      alert("이메일이 성공적으로 전송되었습니다!");
    } else {
      const errorData = await response.json();
      console.error("전체 오류 응답:", JSON.stringify(errorData, null, 2));
      alert("이메일 전송 실패: " + (errorData.error?.message || "알 수 없는 오류"));
    }
  } catch (error) {
    console.error("이메일 전송 중 오류 발생:", error);
    alert("이메일 전송 중 오류 발생: " + error.message);
  }
}
