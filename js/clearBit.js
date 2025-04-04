// 회사 로고 (clearBit Logo API) (open api)
export default function updateCompanyLogoFromEmail(email) {
  const logoImg = document.getElementById("companyLogo");

  if (!email || !email.includes("@")) {
    logoImg.style.display = "none";
    return;
  }

  try {
    const domain = email.split("@")[1];
    const logoUrl = `https://logo.clearbit.com/${domain}`;

    const img = new Image();
    img.onload = () => {
      logoImg.src = logoUrl;
      logoImg.style.display = "inline";
    };
    img.onerror = () => {
      logoImg.style.display = "none";
    };
    img.src = logoUrl;
  } catch (e) {
    console.warn("이메일로부터 도메인 추출 실패");
    logoImg.style.display = "none";
  }
}

