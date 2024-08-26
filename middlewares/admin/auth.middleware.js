// file này xử lý trường hợp phải login để có token với vào được
// còn truy cập trực tiếp link sẽ không có token sẽ về login
const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");

module.exports.requireAuth = async (req, res, next) => {
  if(!req.cookies.token) { //nếu ko có token thì về login
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  }
  else {
    // check xem token đó có giống trong DB?
    // phòng TH sửa token trực tiếp trong devtool
    const user = await Account.findOne({token: req.cookies.token});
    if(!user) {
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
    else{
      next();
    }
  }
}