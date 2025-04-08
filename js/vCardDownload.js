// vCard 다운로드 (js)
export default async function vCardDownload() {
  // 값 가져오기 (값이 없을 경우 빈 문자열로 설정)
  const name = document.getElementById("cardName")?.textContent.trim() || "";
  const company = document.getElementById("cardCompany")?.textContent.trim() || "";
  const email = document.getElementById("cardEmail")?.textContent.trim() || "";
  const phone = document.getElementById("cardPhone")?.textContent.trim() || "";
  const address = document.getElementById("cardAddress")?.textContent.trim() || "";
  const website = document.getElementById("cardWebsite")?.textContent.trim() || "";

  // vCard 데이터 생성
  const vCardData = 
`BEGIN:VCARD\r\n` +
`VERSION:3.0\r\n` +
`N:${name};;;;\r\n` +
`FN:${name}\r\n` +
`ORG:${company}\r\n` +
`EMAIL;TYPE=INTERNET:${email}\r\n` +
`TEL;TYPE=CELL:${phone}\r\n` +
`ADR;TYPE=WORK:;;${address};;;;\r\n` +
`${website ? `URL:${website}\r\n` : ""}` +
`END:VCARD\r\n`;

  // Blob 생성 (BOM 없이 저장 - Outlook 호환을 위해)
  const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" });

  // showSaveFilePicker 지원 여부 확인
  if (!window.showSaveFilePicker) {
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "business_card.vcf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
    return;
  }

  try {
    // 파일 저장 다이얼로그 열기
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: "business_card.vcf",
      types: [{
        description: "vCard File",
        accept: { "text/vcard": [".vcf"] }
      }]
    });

    // 파일에 데이터 쓰기
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();

  } catch (error) {
    console.error("파일 저장이 취소되었거나 오류가 발생했습니다.", error);
  }
}
