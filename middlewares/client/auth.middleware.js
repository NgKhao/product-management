// file này xử lý trường hợp phải login để có tokenUser mới vào được
// còn truy cập trực tiếp link sẽ không có token sẽ về login
const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.tokenUser) {
    //nếu ko có tokenUser thì về login
    res.redirect(`/user/login`);
    return;
  }

  // lấy trừ password
  const user = await User.findOne({
    tokenUser: req.cookies.tokenUser,
  }).select("-password");

  // check xem token đó có giống trong DB?
  // phòng TH sửa token trực tiếp trong devtool
  if (!user) {
    res.redirect(`/user/login`);
    return;
  }

  next();
};
