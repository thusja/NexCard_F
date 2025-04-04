import { checkGoogleLogin, loginWithGoogle, getAuthToken } from "./googleAuth.js";
import captureCardAsBase64 from "../utils/captureCardAsBase64.js";

export default async function sendEmail() {
  if (!checkGoogleLogin()) {
    alert("Google 로그인이 필요합니다.");
    loginWithGoogle();
    return;
  }

  const accessToken = getAuthToken();
  if (!accessToken) {
    console.error("인증 토큰이 존재하지 않습니다. 다시 로그인해 주세요.");
    return;
  }

  const base64Image = await captureCardAsBase64(); // 명함 이미지를 Base64로 변환

  if (!base64Image) {
    alert("이미지 변환에 실패했습니다.");
    return;
  }

  const emailContent = `
  Content-Type: multipart/mixed; boundary="boundary_string"
  MIME-Version: 1.0
  Subject: 내 명함 정보
  From: me
  To: your-email@example.com

  --boundary_string
  Content-Type: text/plain; charset="UTF-8"
  Content-Transfer-Encoding: 7bit

  첨부된 이미지는 내 명함입니다.

  --boundary_string
  Content-Type: image/png
  Content-Transfer-Encoding: base64
  Content-Disposition: attachment; filename="business_card.png"

  ${base64Image.split(",")[1]}
  --boundary_string--
  `;

  try {
    // base64 인코딩 방식 수정 (유니코드 대응)
    const base64EncodedEmail = btoa(unescape(encodeURIComponent(emailContent)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

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
      console.error("이메일 전송 오류:", errorData);
      alert("이메일 전송 실패: " + (errorData.error || "알 수 없는 오류"));
    }
  } catch (error) {
    console.error("이메일 전송 중 오류 발생:", error);
    alert("이메일 전송 중 오류 발생: " + error.message);
  }
}
