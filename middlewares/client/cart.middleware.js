const Cart = require("../../models/cart.model");

// check trong cookies có cardId chưa từ đó biết được giỏ hàng có tồn tại sản phẩm không
module.exports.cartId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    // khi chưa có giỏ hàng <=> chưa có cardId trong cookies
    const cart = new Cart();
    await cart.save();

    // time 1 năm sau
    const expriesTime = 1000 * 60 * 60 * 24 * 365;

    res.cookie("cartId", cart.id, {
      // thêm time hết hạn của cardID 
      expires: new Date(Date.now() + expriesTime),
    });
  } else {
  }

  next();
};
