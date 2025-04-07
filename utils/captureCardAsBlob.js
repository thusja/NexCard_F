// html2canvas 캡처 함수
export default async function captureCardAsBlob() {
  const cardElement = document.querySelector('.card-preview');
  const canvas = await html2canvas(cardElement, {
    backgroundColor: null, // 배경을 투명하게 설정
    scale: 2, // 해상도 증가 (더 선명한 이미지)
    useCORS: true // 외부 이미지를 캡처할 수 있도록 설정
  });

  // 리사이즈용 새 캔버스 생성
  const targetWidth = 800;
  const targetHeight = 418;
  const resizedCanvas = document.createElement('canvas');
  resizedCanvas.width = targetWidth;
  resizedCanvas.height = targetHeight;

  const ctx = resizedCanvas.getContext('2d');

  // 원본 캔버스를 리사이즈하여 그리기
  ctx.drawImage(originalCanvas, 0, 0, targetWidth, targetHeight);

  // Blob으로 변환
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
