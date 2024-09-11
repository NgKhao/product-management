const Cart = require("../../models/cart.model");

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  const cartId = req.cookies.cartId; //lấy cardId từ cookies
  const productId = req.params.productId; //lấy từ data động trên tên miền
  const quantity = parseInt(req.body.quantity); //lấy từ name của form

  const cart = await Cart.findOne({
    _id: cartId,
  });

  // find id của product đang thêm đã tồn tại trước đó trong cart chưa
  const existProductInCart = cart.products.find(
    (item) => item.product_id == productId
  );

  // nếu đã tồn tại thì tăng số lượng trong obj cũ
  if (existProductInCart) {
    const newQuantity = quantity + existProductInCart.quantity;

    await Cart.updateOne(
      {
        // phải đặt theo JSON nhưng _id là trường đơn giản nên ko cần ""
        _id: cartId,
        "products.product_id": productId,
      },
      {
        // $ được dùng muốn cập nhật một phần tử cụ thể trong một mảng
        // $ đặt ở đó để chỉ ra vị trí quantity trong arr, cho phép truy cập và update trường quantity 
        "products.$.quantity": newQuantity,
      }
    );
  }
  // nếu chưa thì thêm 1 obj mới vào card
  else {
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    };

    // console.log(cartId);
    // console.log(productId);
    // console.log(quantity);

    await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        $push: { products: objectCart },
      }
    );
  }

  req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công!");

  res.redirect("back");
};
