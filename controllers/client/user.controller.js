const md5 = require("md5"); //libary mã hóa password

const User = require("../../models/user.model");

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng kí tài khoản",
  });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  //check xem email có tồn tại?
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });

  if (existEmail) {
    req.flash("error", "Email đã tồn tại");
    res.redirect("back");
    return;
  }

  req.body.password = md5(req.body.password); //mã hóa password
  const user = new User(req.body);
  await user.save();

  console.log(user);

  // phản hồi đưa tokenUser vào cookie
  res.cookie("tookenUser", user.tokenUser);

  // chuyển về trang chủ
  res.redirect("/");
};
