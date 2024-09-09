const categoryMiddleWare = require("../../middlewares/client/category.middleware");

const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const searchRoutes = require("./search.route");


module.exports = (app) => {
// app.use(categoryMiddleWare.category): app sẽ use hàm category cho all các route ở dưới
  app.use(categoryMiddleWare.category);

  app.use("/", homeRoutes);

  app.use("/products", productRoutes);

  app.use("/search", searchRoutes);
};
