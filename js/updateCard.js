// 명함 정보 업데이트 (js)
import showToast from "../utils/toast.js";
import updateCompanyLogoFromEmail from "./clearBit.js";

export default function updateCard() {

  // 필수 입력 필드
  const requiredFields = [
    { id: "name", message: "이름을 입력하세요." },
    { id: "job", message: "직업/직책을 입력하세요." },
    { id: "company", message: "회사 또는 기관명을 입력하세요." },
    { id: "email", message: "이메일을 입력하세요." },
    { id: "phone", message: "연락처를 입력하세요." },
    { id: "address", message: "주소를 입력하세요." }
  ];

  // 필수 입력값 확인
  for (let field of requiredFields) {
    const inputElement = document.getElementById(field.id);
    const value = inputElement.value.trim();

    if (!value) { // 공백 입력 방지
      showToast(field.message, inputElement);
      inputElement.focus();
      return;
    }

    // 이메일 형식 유효성 검사 추가
    if (field.id === "email") {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!isValidEmail) {
        showToast("올바른 이메일 형식이 아닙니다.", inputElement);
        inputElement.focus();
        inputElement.value = "";
        return;
      }
    }

    if (field.id === "phone") {
      if (!(value.length === 10 || value.length === 11)) {
        showToast("연락처는 10자리 또는 11자리 숫자만 입력 가능합니다.", inputElement);
        inputElement.focus();
        inputElement.value = "";
        return;
      }
    }
  }

  const name = document.getElementById("name").value.trim();
  const job = document.getElementById("job").value.trim();
  const company = document.getElementById("company").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();
  const website = document.getElementById("website").value.trim();

  // 연락처 값 가져오기
  const phoneInput = document.getElementById("phone").value.trim();
  const formattedPhone = formatPhoneNumber(phoneInput);

  document.getElementById("cardName").textContent = name;
  document.getElementById("cardJob").textContent = job;
  document.getElementById("cardCompany").textContent = company;
  document.getElementById("cardEmail").textContent = email;
  document.getElementById("cardPhone").textContent = formattedPhone;
  document.getElementById("cardAddress").textContent = address;
  document.getElementById("cardWebsite").textContent = website;

  updateCompanyLogoFromEmail(email); // 이메일 기반 로고 로드
}

// 전화번호 포맷팅 함수
function formatPhoneNumber(phone) {
  if (phone.length === 11) {
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (phone.length === 10) {
    return phone.replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1-$2-$3');
  }
  return phone;
}
