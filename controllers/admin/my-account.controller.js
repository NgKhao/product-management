const md5 = require("md5"); // thư viện mã hóa password

const Account = require("../../models/account.model");
// [GET] /admin/my-account
module.exports.index = (req, res) => {
  res.render("admin/pages/my-account/index", {
      pageTitle: "Thông tin cá nhân"
  });
};

// [GET] /admin/my-account/edit
module.exports.edit = (req, res) => {
  res.render("admin/pages/my-account/edit", {
      pageTitle: "Thông tin cá nhân"
  });
};

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  const id = res.locals.user._id;

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