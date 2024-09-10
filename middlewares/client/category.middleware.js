const ProductCategory = require("../../models/products-category.model");
const createTreeHelper = require("../../helpers/createTree");

// chuyển này qua middleware để layoutProductsCategory dùng biến toàn cục
// để dùng cho trang product luôn
module.exports.category = async (req, res, next) => {
  let find = {
    status: "active",
    deleted: false,
  };

  const productsCategory = await ProductCategory.find(find);

  const newproductsCategory = createTreeHelper.tree(productsCategory);

  res.locals.layoutProductsCategory = newproductsCategory;

  next();
};
