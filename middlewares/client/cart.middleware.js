const Cart = require("../../models/cart.model");
//data của của card phải trả về all các trang nên viết trong middleware
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
    const cart = await Cart.findOne({
      _id: req.cookies.cartId,
    });

    // trong reduce(), có 0 là giá trị cho tham số thứ nhất(sum) trong lần gọi hàm đầu tiên
    // nếu không có 0 thì nó sẽ lấy sum là ptu đầu của arr product + quantity là sai
    cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);

    // tạo biến locals dùng cho file pug 
    res.locals.miniCart = cart;
  }

  next();
};
