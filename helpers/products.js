
// tính toán giá sau khi giảm, vì dùng ở featured product lists và product lists
// nên bỏ vào helper 
//return 1 arr các products sau khi có giá đã giảm
module.exports.priceNewProducts = (products) => {
  const newProducts = products.map((item) => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(2);
    return item;
  });
  return newProducts;
};

//return giá mới sau khi có giá đã giảm
module.exports.priceNewProduct = (product) => {
  const priceNew = (
    (product.price * (100 - product.discountPercentage)) / 100
  ).toFixed(0);

  return priceNew;
}


// chuyển số thành tiền đ
module.exports.formatVietnamCurrency = (amount, showCurrency = true, roundToThousand = true) => {
  // Làm tròn số về số nguyên
  if (roundToThousand) {
    // Làm tròn đến hàng nghìn gần nhất
    amount = Math.round(amount / 1000) * 1000;
  } else {
    // Làm tròn thành số nguyên thông thường
    amount = Math.round(amount);
  }
  
  // Chuyển số thành chuỗi và thêm dấu phân cách hàng nghìn
  let formattedAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
  // Thêm ký hiệu tiền tệ nếu được yêu cầu
  if (showCurrency) {
    return formattedAmount + " ₫";
  } else {
    return formattedAmount;
  }
}

