// QR 코드 생성 (goqr.me API) (open api)
export default async function qrCode() {
  const website = document.getElementById("cardWebsite").textContent.trim();
  const qrCodeDiv = document.getElementById("qrCode"); 
  const qrCodeContainer = document.getElementById("cardQr");
  const qrCodeText = document.getElementById("qrCodeText");
  const websiteOutput = document.getElementById("cardWebsite");

  // 초기 상태 설정 - 텍스트는 표시, QR코드 이미지 영역은 비우기
  qrCodeText.style.display = "block";
  qrCodeDiv.innerHTML = "";
  qrCodeContainer.classList.remove("hidden");

  // 정보 입력 검증 (필수 입력 사항 확인)
  const requiredFields = ["name", "job", "company", "email", "phone", "address"];
  for (const fieldId of requiredFields) {
    const field = document.getElementById(fieldId);
    if (!field || !field.value.trim()) {
      // 필수 입력 사항이 비어있으면 QR코드 생성을 하지 않음
      qrCodeDiv.innerHTML = "";
      qrCodeText.style.display = "block";
      return;
    }
  }

  if (!website) {
    // 웹사이트 정보가 없으면 QR코드와 텍스트 숨기기
    qrCodeDiv.innerHTML = "";
    qrCodeText.style.display = "none";
    return;
  }

  // 도메인이 유효한 URL인지 확인
  let domain = "";
  let urlToCheck = "";
  
  try {
    const url = new URL(website.startsWith("http") ? website : "https://" + website);
    domain = url.hostname;
    urlToCheck = url.origin;

    if (!domain.includes(".")) throw new Error("Invalid domain");

    // 도메인 존재 여부 확인
    const isReachable = await isWebsiteReachable(urlToCheck);
    if (!isReachable) {
      qrCodeDiv.innerHTML = "";
      qrCodeText.style.display = "none";
      websiteOutput.textContent = "";
      alert("유효하지 않은 웹사이트입니다. QR코드는 생성되지 않습니다.");
      console.warn("유효하지 않은 도메인 또는 연결 불가");
      return;
    }

  } catch (e) {
    // 잘못된 URL 형식 → QR코드 생성 취소
    qrCodeDiv.innerHTML = "";
    qrCodeText.style.display = "none";
    websiteOutput.textContent = "";
    console.warn("QR 생성을 중단한 이유:", e);
    return;
  }

  try {
    // QR 코드 API 요청
    const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(website)}&size=120x120`);
    const blob = await response.blob();

    // Blob을 Base64 형식으로 변환하기
    const reader = new FileReader();
    reader.onload = function(event) {
      const base64String = event.target.result;
      qrCodeDiv.innerHTML = `<img src="${base64String}" alt="QR 코드">`;
      qrCodeText.style.display = "none";
    };
    reader.readAsDataURL(blob);

  } catch (error) {
    console.error("QR 코드 생성 중 오류가 발생했습니다:", error);
    
  }
}

async function isWebsiteReachable(url) {
  try {
    await fetch(url, { method: "HEAD", mode: "no-cors" });
    return true;
  } catch (err) {
    return false;
  }
}