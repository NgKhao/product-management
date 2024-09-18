const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

const productHelper = require("../../helpers/products");

// [GET] / checkout/
module.exports.index = async (req, res) => {
  // lấy cartId từ cookies
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId,
  });

  // nếu exist product trong cart
  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;

      const productInfo = await Product.findOne({
        _id: productId,
      });

      // thêm trường giá mới cho thông tin sp
      productInfo.priceNew = productHelper.priceNewProduct(productInfo);

      // thêm trường thông tin sp cho sp
      item.productInfo = productInfo;

      // thêm trường tổng tiền mỗi loại sản phẩm
      item.totalPrice = item.productInfo.priceNew * item.quantity;
    }
  }

  // tính tổng tiền của đơn hàng
  // phải có tham số 0 trong reduce() để gán cho sum,
  // nếu ko có nó sẽ lấy cả item gán sum chứ ko phải item.totalPrice
  cart.totalPrice = cart.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  res.render("client/pages/checkout/index", {
    pageTitle: "Đặt hàng",
    cartDetail: cart,
  });
};
