// 메인 이벤트 핸들러 (js)
import updateCard from "./updateCard.js";
import vCardDownload from "./vCardDownload.js";
import imageDownload from "./imageDownload.js";
import qrCode from "./qrCode.js";
import shareKakao from "./shareKakao.js";
import emailSend from "./emailSend.js";
import googleAuth, { checkGoogleLogin, loginWithGoogle } from "./googleAuth.js";
import openAddressSearch from "../utils/openAddressSearch.js";

// DOM 로드 완료 후 안전하게 이벤트 등록
document.addEventListener("DOMContentLoaded", () => {
  // 버튼 가져오기
  const generateBtn = document.getElementById("generateBtn");
  const imgBtn = document.getElementById("imgBtn");
  const vCardBtn = document.getElementById("vCardBtn");
  const shareBtn = document.getElementById("shareBtn");
  const sendEmailBtn = document.getElementById("sendEmailBtn");
  const addressInput = document.getElementById("address");
  const helpIcon = document.getElementById("helpIcon");
  const modalOverlay = document.getElementById("modalOverlay");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const buttons = document.querySelectorAll(".share-button");
  const errorIcon = document.getElementById("errorIcon");
  const errorModal = document.getElementById("errorModal");
  const closeErrorModalBtn = document.getElementById("closeErrorModalBtn");

  // 명함 생성 버튼
  generateBtn.addEventListener("click", () => {
    updateCard();
    qrCode();
  });

  // 엔터로 명함 생성
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // 기본 Enter 기능 방지 (예: 폼 제출 방지)
      generateBtn.click(); // 버튼 클릭과 동일한 동작 수행
    }
  });

  // 주소 검색
  addressInput.addEventListener("click", openAddressSearch);

  // 이미지 다운로드
  imgBtn.addEventListener("click", imageDownload);

  // vCard 다운로드
  vCardBtn.addEventListener("click", vCardDownload);

  // 카카오 공유
  shareBtn.addEventListener("click", shareKakao);

  // 이메일 전송
  window.addEventListener("load", () => {
    googleAuth(); // Google 로그인 클라이언트 초기화
  });

  sendEmailBtn.addEventListener("click", async () => {
    // 클릭 이벤트 흐름 안에서 팝업 띄워야 함
    if (!checkGoogleLogin()) {
      loginWithGoogle(); // 팝업이 여기서 뜨면 차단 안 됨
      return; // 로그인 완료 후 재시도 유도 or 자동으로 다시 시도하도록 처리 가능
    }
    // 이미 로그인된 경우에만 이메일 전송
    await emailSend();
  });

  // 도움말 모달
  helpIcon.addEventListener("click", () => {
    modalOverlay.style.display = "flex";
  });

  closeModalBtn.addEventListener("click", () => {
    modalOverlay.style.display = "none";
  });

  // 모달 외부 클릭 시 닫기
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.style.display = "none";
    }
  });

  // 에러 모달
  errorIcon.addEventListener("click", () => {
    errorModal.style.display = "flex";
  });

  closeErrorModalBtn.addEventListener("click", () => {
    errorModal.style.display = "none";
  });

  // 모달 외부 클릭 시 닫기
  errorModal.addEventListener("click", (e) => {
    if (e.target === errorModal) {
      errorModal.style.display = "none";
    }
  });

  buttons.forEach(button => {
    button.addEventListener("touchend", () => {
      button.blur(); // 포커스를 제거하면 스타일 초기화됨
    });
  });
});
