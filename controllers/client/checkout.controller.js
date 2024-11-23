const moment = require("moment");
const axios = require("axios").default; // npm install axios
const CryptoJS = require("crypto-js"); // npm install crypto-js
const qs = require("qs");

const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

const productHelper = require("../../helpers/products");
const Order = require("../../models/order.model");

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

// [POST] / checkout/order
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;

  // lấy cái data từ body gán vào trường của userInfo trong model order
  const userInfo = req.body;

  // lấy ra 1 arr products
  const cart = await Cart.findOne({
    _id: cartId,
  });

  let products = [];

  for (const product of cart.products) {
    const objectProduct = {
      product_id: product.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: product.quantity,
    };

    //truy vấn vào Product để lấy price and discount
    const productInfo = await Product.findOne({
      _id: product.product_id,
    });

    objectProduct.price = productInfo.price;
    objectProduct.discountPercentage = productInfo.discountPercentage;

    products.push(objectProduct);
  }

  const objectOrder = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products,
    status: "pending", // tạo status chờ
  };

  const order = new Order(objectOrder);
  await order.save();

  const transID = Math.floor(Math.random() * 1000000);
  const amount = products.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const orderData = {
    app_id: process.env.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
    app_user: userInfo.fullName || "guest",
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(products),
    embed_data: JSON.stringify({}),
    amount: amount || 1,
    description: `Payment for the order #${order.id}`,
    bank_code: "zalopayapp",
    callback_url:
      "https://759c-2405-4802-9150-1af0-9c0e-8ecd-46d2-6554.ngrok-free.app/callback",
  };

  // appid|app_trans_id|appuser|amount|apptime|embeddata|item
  const data = `${process.env.app_id}|${orderData.app_trans_id}|${orderData.app_user}|${orderData.amount}|${orderData.app_time}|${orderData.embed_data}|${orderData.item}`;
  orderData.mac = CryptoJS.HmacSHA256(data, process.env.key1).toString();

  try {
    const paymentResponse = await axios.post(process.env.endpoint, null, {
      params: orderData,
    });

    console.log("Payment response:", paymentResponse.data);
    console.log(data);

    if (paymentResponse.data.return_code === 1) {
      res.redirect(paymentResponse.data.order_url); // Chuyển hướng người dùng đến trang thanh toán
    } else {
      order.status = "failed";
      await order.save();
      res.redirect(`/checkout/failure/${order.id}`);
    }
  } catch (error) {
    console.error("Payment error:", error);
    order.status = "failed";
    await order.save();
    res.status(500).send("Có lỗi xảy ra khi thanh toán.");
  }

  // res.redirect(`/checkout/success/${order.id}`);
};

// [POST] /callback
module.exports.callbackPayment = async (req, res) => {
  let result = {};

  try {
    const dataStr = req.body.data;
    const reqMac = req.body.mac;

    // Tạo MAC từ dữ liệu nhận được
    const mac = CryptoJS.HmacSHA256(dataStr, process.env.key2).toString();

    if (reqMac !== mac) {
      // MAC không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // Callback hợp lệ, cập nhật trạng thái đơn hàng
      const dataJson = JSON.parse(dataStr);
      const appTransId = dataJson["app_trans_id"];

      await Order.updateOne(
        { app_trans_id: appTransId },
        { status: "success" }
      );

      // sau khi order thì update lại cart is empty
      await Cart.updateOne(
        {
          _id: cartId,
        },
        {
          products: [],
        }
      );

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (error) {
    result.return_code = 0; // ZaloPay server sẽ callback lại nếu thất bại
    result.return_message = error.message;
  }

  res.json(result); // Trả về kết quả cho ZaloPay
};

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
  // console.log(req.params.orderId);

  const order = await Order.findOne({
    _id: req.params.orderId,
  });

  for (const product of order.products) {
    // truy vấn để lấy title, thumnail đưa vào trường productInfo
    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("title thumbnail");

    product.productInfo = productInfo;

    product.priceNew = productHelper.priceNewProduct(product);

    // Tổng tiền 1 loại sp
    product.totalPrice = product.priceNew * product.quantity;
  }
  // console.log(order);

  // tổng tiền đơn đặt
  // phải có tham số 0 trong reduce() để gán cho sum,
  // nếu ko có nó sẽ lấy cả item gán sum chứ ko phải item.totalPrice
  order.totalPrice = order.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  res.render("client/pages/checkout/success", {
    pageTitle: "Đặt hàng thành công",
    order: order,
  });
};
