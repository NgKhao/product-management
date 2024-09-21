const User = require("../../models/user.model")

// lấy ra info user dùng trong logout bên folder user của view
module.exports.infoUser = async (req, res, next) => {
  if(req.cookies.tokenUser) {
    // nếu cookies có tokenUser thì tìm và ra info user 
    const user = await User.findOne({
      tokenUser: req.cookies.tokenUser,
      deleted: false  
    }).select("-password");

    if(user) {
      // gán biến user thành toàn cục để dùng trong view 
      res.locals.user = user;
    }
  }
  next();
}