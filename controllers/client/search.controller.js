const Product = require("../../models/product.model");
const productHelper = require("../../helpers/products");

// [GET]/search/
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;

  //khai báo newProducts ở ngoài để đưa vào render
  let newProducts = [];

  if (keyword) {
    const keywordRegex = new RegExp(keyword, "i"); //"i": search không phân bt chữ hoa và thường

    const products = await Product.find({
      title: keywordRegex,
      status: "active",
      deleted: false,
    });

    // thêm key giá sp sau khi giảm
    newProducts = productHelper.priceNewProducts(products);

    // console.log(newProducts);
  }

  res.render("client/pages/search/index", {
    pageTitle: "Kết quả tìm kiếm",
    keyword: keyword,
    products: newProducts,
  });
};
