const md5 = require("md5"); // thư viện mã hóa password

const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  // lấy all trường trừ password và token
  const records = await Account.find(find).select("-password -token");

  // mục đích để có thêm title của role để in ra UI
  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false,
    });
    record.roleTitle = role.title;
    // console.log(record.roleTitle);
  }
  // console.log(records);

  res.render("admin/pages/accounts/index", {
    pageTitle: "Danh sách tài khoản",
    records: records,
  });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });

  res.render("admin/pages/accounts/create", {
    pageTitle: "Tạo mới tài khoản",
    roles: roles,
  });
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  // check xem tài khoản cb tạo có trùng với bất kì 1 tk nào trong DB?
  const accountWithExistingEmail = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });

  if (accountWithExistingEmail) {
    req.flash("error", `Email ${req.body.email} tồn tại`);
    res.redirect("back");
  } else {
    req.body.password = md5(req.body.password);

    const record = new Account(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  const find = {
    _id: req.params.id,
    deleted: false,
  };

  try {
    const data = await Account.findOne(find);

    const roles = await Role.find({
      deleted: false,
    });

    // console.log(data);

    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh sửa tài khoản",
      data: data,
      roles: roles,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  // check xem tài khoản cb cập nhập có trùng với bất kì 1 tk nào trong DB?
  const accountWithExistingEmail = await Account.findOne({
    _id: { $ne: id}, //$ne: xét all id trừ id đang chọn
    // để loại bỏ trường hợp khi không chỉnh sửa sẽ bị lỗi tồn tại
    email: req.body.email,
    deleted: false,
  });

  if (accountWithExistingEmail) {
    req.flash("error", `Email ${req.body.email} tồn tại`);
  } else {
    // xử lý user vẫn để password trống sẽ giữ password cũ
    if(req.body.password){
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password; //xóa key password trong body
    }

    await Account.updateOne({_id: id}, req.body);

    req.flash("success", "Cập nhập tài khoản thành công!");

  }
  res.redirect("back");
};
