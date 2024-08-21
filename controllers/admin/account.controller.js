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
