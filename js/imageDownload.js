// 명함 이미지 다운로드 (js)
import captureCardAsBlob from "../utils/captureCardAsBlob.js";

// 모바일 브라우저 판별 함수
function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// 카카오톡 인앱 브라우저 감지 함수
function isKakaoInAppBrowser() {
  return /KAKAOTALK/i.test(navigator.userAgent);
}

export default async function imageDownload() {
  // 카카오 인앱 브라우저에서 다운로드 차단 안내
  if (isKakaoInAppBrowser()) {
    alert("카카오톡 브라우저에서는 이미지 다운로드가 제한됩니다.\n다른 브라우저로 열어주세요.");
    return;
  }

  try {
    const blob = await captureCardAsBlob();
    const fileName = "business_card.png";

    // 모바일인 경우
    if (isMobile()) {
      const blobUrl = URL.createObjectURL(blob);

      // a 태그로 시도
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      a.target = "_blank"; // 모바일 브라우저 다운로드 대응
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // 만약 다운로드가 안 되면 fallback: 새 창으로 열기
      setTimeout(() => {
        window.open(blobUrl, "_blank");
      }, 300);
      return;
    }

    // PC에서 showSaveFilePicker 사용 가능하면 활용
    if (window.showSaveFilePicker && window.isSecureContext) {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [{
          description: "PNG Image",
          accept: { "image/png": [".png"] }
        }]
      });

      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
    }

    // PC fallback (showSaveFilePicker 미지원 브라우저)
    else {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }

  } catch (error) {
    console.error("이미지 저장 중 오류:", error);
    alert("이미지 저장 중 오류가 발생했습니다.");
  }
}
