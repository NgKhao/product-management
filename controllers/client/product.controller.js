const Product = require("../../models/product.model");
const ProductCategory = require("../../models/products-category.model");

const productsHelper = require("../../helpers/products");
const productsCategoryHelper = require("../../helpers/products-category");

// [GET]/products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" }); //truyền obj sau đó là desc hoặc asc

  const newProduct = productsHelper.priceNewProducts(products);

  // console.log(newProduct[0]);

  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: newProduct,
  });
};

// [GET]/products/:slug
module.exports.detail = async (req, res) => {
  // try cacth để khi user chỉnh sửa trên id trên tên miền sẽ không bị die
  try {
    const find = {
      deleted: false,
      slug: req.params.slug, //lấy được id trên miền
      status: "active",
    };

    const product = await Product.findOne(find);

    // console.log(product);

    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`/products`);
  }
};

// [GET]/products/:slugCategory
module.exports.category = async (req, res) => {
  //   console.log(req.params.slugCategory);

  // find id category based on slug
  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    status: "active",
    deleted: false,
  });
  //   console.log(category.id);
  // end find id category based on slug

  const listSubCategory = await productsCategoryHelper.getSubCategory(
    category.id
  );

  // map: sẽ duyệt qua từng element và trả về 1 arr element.id
  const listSubCategoryId = listSubCategory.map((item) => item.id);

  // console.log(listSubCategoryId);

  const products = await Product.find({
    // $in: toán tử check có value nằm trong danh sách đó ko?
    // ...listSubCategoryId: giải nén arr thành các đối số như 01, 02, 03
    product_category_id: { $in: [category.id, ...listSubCategoryId] },
    deleted: false,
  }).sort({ position: "desc" });

  //   console.log(products);

  const newProducts = productsHelper.priceNewProducts(products);
  res.render("client/pages/products/index", {
    pageTitle: category.title,
    products: newProducts,
  });
};
