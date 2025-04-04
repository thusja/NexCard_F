// 명함을 Base64로 변환하여 반환하는 함수
export default async function captureCardAsBase64() {
  try {
    const canvas = await html2canvas(document.querySelector(".card-preview"), {
      backgroundColor: null, // 배경을 투명하게 설정
      scale: 2, // 해상도 증가 (더 선명한 이미지)
      useCORS: true // 외부 이미지를 캡처할 수 있도록 설정
    });

    // 캔버스를 Base64 데이터로 변환하여 반환
    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("이미지를 캡처하는 중 오류 발생:", error);
    return null;
  }
}
