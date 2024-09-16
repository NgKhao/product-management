// cập nhập số lượng sp trong giỏ hàng

// bắt sự kiện khi thay đổi số lượng trong input, sau đó chuyển hướng trang để update trong DB
// return về 1 arr ô input số lượng các sp trong giỏ
const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if(inputsQuantity.length > 0){
  inputsQuantity.forEach(input => {
    input.addEventListener("change", (e) => {
      // input = e.target
      const productId = input.getAttribute("product-id");

      // ép kiểu sang Int vì khi lấy ra từ HTML là String 
      const quantity = parseInt(input.value);
      
      // nếu sl > 0 mới update vào DB
      if(quantity > 0) {
        // chuyển hướng trang trong FE
        window.location.href = `/cart/update/${productId}/${quantity}`;
      }
    })
  })
}
//End  cập nhập số lượng sp trong giỏ hàng
