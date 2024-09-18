const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: String, //để làm login
    cart_id: String, // để sau liệt kê các đơn hàng có card_id đó
    userInfo: {
      fullName: String,
      phone: String,
      address: String
    },
    products: [
      {
        product_id: String,
        // có price, discount để tính giá mới
        // không thêm trực tiếp trường newPrice để có thể dễ dàng tăng giảm discount
        price: Number,
        discountPercentage: Number,
        quantity: Number,
      },
    ],
  },
  {
    timestamps: true, // time stamps của mongoose
    //để truyền thời gian tạo và update
  }
);

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;
