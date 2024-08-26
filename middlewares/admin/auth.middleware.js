// file này xử lý trường hợp phải login để có token với vào được
// còn truy cập trực tiếp link sẽ không có token sẽ về login
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {
    //nếu ko có token thì về login
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } else {
    // check xem token đó có giống trong DB?
    // phòng TH sửa token trực tiếp trong devtool
    // lấy trừ password
    const user = await Account.findOne({ token: req.cookies.token }).select(
      "-password"
    );
    if (!user) {
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
      const role = await Role.findOne({
        _id: user.role_id,
      }).select("title permissions");
      // user thành biến local dùng cho all file pug
      res.locals.user = user;
      res.locals.role = role;
      next();
    }
  }
};
