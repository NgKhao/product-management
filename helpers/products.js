
// tính toán giá sau khi giảm, vì dùng ở featured product lists và product lists
// nên bỏ vào helper 
module.exports.priceNewProducts = (products) => {
  const newProduct = products.map((item) => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(2);
    return item;
  });
  return newProduct;
};
