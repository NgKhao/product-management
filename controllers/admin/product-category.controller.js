const ProductCategory = require("../../models/products-category.model");

const systemConfig = require("../../config/system");

const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
  });
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);

  // console.log(newRecords);

  res.render("admin/pages/products-category/create", {
    pageTitle: "Tạo danh mục sản phẩm",
    records: newRecords,
  });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const record = new ProductCategory(req.body);
  await record.save();

  // prefixAdmin khai báo local trong index chỉ dùng dc trong toàn bộ file pug
  // còn file js phải khai bao request mới dùng đc
  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await ProductCategory.findOne({
      _id: id,
      deleted: false,
    });

    // console.log(data);

    const records = await ProductCategory.find({
      deleted: false,
    });

    // console.log(records);

    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/edit", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      data: data,
      records: newRecords,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.position = parseInt(req.body.position);

  await ProductCategory.updateOne({ _id: id }, req.body);

  res.redirect("back");
};

// [GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
  const id = req.params.id;

  const find = {
    _id: id,
    deleted: false,
  };

  const productCategory = await ProductCategory.findOne(find);

  if (productCategory.parent_id) {
    const parentProductCategory = await ProductCategory.findOne({
      _id: productCategory.parent_id,
      deleted: false,
    });

    productCategory.parentTitle = parentProductCategory.title;
  }

  // console.log(productCategory);

  res.render("admin/pages/products-category/detail", {
    pageTitle: productCategory.title,
    productCategory: productCategory,
  });
};

// [PATCH] /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await ProductCategory.updateOne({ _id: id }, { deleted: true });

  req.flash("success", "Dã xóa thành công sản phẩm");

  res.redirect("back");
};
