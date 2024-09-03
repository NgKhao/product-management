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

  const newProductFeatured = productsHelper.priceNewProducts(productsFeatured);
  //  End Lấy ra sp nổi bật

//  Lấy ra sp mới nhất
  const productsNew = await Product.find({
    deleted: false,
    status: "active"
  }).sort({ position: "desc"}).limit(6);

  const newProductNew = productsHelper.priceNewProducts(productsNew);

//  End Lấy ra sp mới nhất

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProductFeatured,
    productsNew: newProductNew
  });
};
