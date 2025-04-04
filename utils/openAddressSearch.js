export default function openAddressSearch() {
  new daum.Postcode({
    oncomplete: function(data) {
      let fullAddress = data.address; // 도로명 주소 or 지번 주소
      // 예: 서울 강남구 논현로 508 (우편번호는 data.zonecode)

      // 주소 입력 input에 값 삽입
      document.getElementById("address").value = fullAddress;
    }
  }).open();
}
