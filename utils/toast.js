// 토스트 메세지 (js)
export default function showToast(message, inputElement) {
  // 기존의 토스트 메시지가 있으면 삭제
  const existingToast = document.querySelector(".toast-message");
  if (existingToast) existingToast.remove();

  // 새로운 토스트 메시지 요소 생성
  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.textContent = message;

  // 입력 필드의 위치 가져오기
  const rect = inputElement.getBoundingClientRect();
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  // 토스트 메시지를 입력 필드 아래에 배치
  toast.style.position = "absolute";
  toast.style.top = `${rect.bottom + scrollTop + 5}px`;  // 입력 필드 아래로 5px 여백
  toast.style.left = `${rect.left}px`;
  toast.style.width = `${rect.width}px`;

  // 문서에 추가
  document.body.appendChild(toast);

  // 0.1초 후 서서히 나타나도록 설정
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  // 2초 후 사라지게 하기
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
