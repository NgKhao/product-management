const categoryMiddleWare = require("../../middlewares/client/category.middleware");
const cartMiddleWare = require("../../middlewares/client/cart.middleware");
const userMiddleWare = require("../../middlewares/client/user.middleware");


const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");


module.exports = (app) => {
// app.use(categoryMiddleWare.category): app sẽ use hàm category cho all các route ở dưới
  app.use(categoryMiddleWare.category);

// app.use(categoryMiddleWare.cartId): app sẽ use hàm category cho all các route ở dưới
  app.use(cartMiddleWare.cartId);

  app.use(userMiddleWare.infoUser);

  app.use("/", homeRoutes);

  app.use("/products", productRoutes);

  app.use("/search", searchRoutes);

  app.use("/cart", cartRoutes);

  app.use("/checkout", checkoutRoutes);

  app.use("/user", userRoutes);

};
