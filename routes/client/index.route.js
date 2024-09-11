const categoryMiddleWare = require("../../middlewares/client/category.middleware");
const cartMiddleWare = require("../../middlewares/client/cart.middleware");


const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");



module.exports = (app) => {
// app.use(categoryMiddleWare.category): app sẽ use hàm category cho all các route ở dưới
  app.use(categoryMiddleWare.category);

// app.use(categoryMiddleWare.cartId): app sẽ use hàm category cho all các route ở dưới
  app.use(cartMiddleWare.cartId);

  app.use("/", homeRoutes);

  app.use("/products", productRoutes);

  app.use("/search", searchRoutes);

  app.use("/cart", cartRoutes);
};
