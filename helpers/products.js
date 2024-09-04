
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
