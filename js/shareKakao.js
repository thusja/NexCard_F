// 소셜 미디어 공유 (api) (카카오톡 공유 API)
import captureCardAsBlob from "../utils/captureCardAsBlob.js";

export default async function shareKakao() {
    const response = await fetch("https://nexcard-b.onrender.com/api/env"); // 서버로부터 환경 변수 요청
    const env = await response.json();
    const KAKAO_APP_KEY = env.KAKAO_APP_KEY;

    if (!KAKAO_APP_KEY) {
        console.error("Kakao App Key가 설정되지 않았습니다.");
        return;
    }

    // Kakao 초기화
    if (!window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_APP_KEY);
    }

    try {
        // 카드 영역을 캡쳐하여 이미지로 변환
        const blob = await captureCardAsBlob();

        // 이미지 서버로 전송
        const formData = new FormData();
        formData.append('image', blob, 'business_card.png');

        const uploadResponse = await fetch("https://nexcard-b.onrender.com/api/upload", {
            method: 'POST',
            body: formData
        });

        const uploadResult = await uploadResponse.json();
        
        if (uploadResult.error) {
            throw new Error(uploadResult.error);
        }

        const imageUrl = uploadResult.imageUrl;

        // 카카오톡 공유하기
        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: document.getElementById("cardName").textContent + "님의 명함",
                description: document.getElementById("cardJob").textContent,
                imageUrl: imageUrl,
                link: {
                    mobileWebUrl: imageUrl,
                    webUrl: imageUrl
                }
            }
        });
    } catch (error) {
        console.error("이미지 캡처 또는 공유 중 오류 발생:", error);
        alert("카카오톡 공유에 실패했습니다.");
    }
}
