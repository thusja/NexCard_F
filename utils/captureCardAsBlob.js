// html2canvas 캡처 함수
export default async function captureCardAsBlob() {
  const cardElement = document.querySelector('.card-preview');
  const canvas = await html2canvas(cardElement, {
    backgroundColor: null, // 배경을 투명하게 설정
    scale: 2, // 해상도 증가 (더 선명한 이미지)
    useCORS: true // 외부 이미지를 캡처할 수 있도록 설정
  });
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        alert("⚠️ 이미지 생성 실패 (blob이 null)");
        console.error("canvas.toBlob 결과가 null입니다.");
        reject("Blob 생성 실패");
      } else {
        resolve(blob);
      }
    }, "image/png");
  });
}
