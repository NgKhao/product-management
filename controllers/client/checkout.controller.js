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
  };

  const order = new Order(objectOrder);
  await order.save();

  // sau khi order thì update lại cart is empty
  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      products: [],
    }
  );

  res.redirect(`/checkout/success/${order.id}`);
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
