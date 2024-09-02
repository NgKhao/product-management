const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");

// [GET] /
module.exports.index = async (req, res) => {
  //  Lấy ra sp nổi bật
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).limit(6);

  const newProduct = productsHelper.priceNewProducts(productsFeatured);
  //  End Lấy ra sp nổi bật


  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProduct,
  });
};
