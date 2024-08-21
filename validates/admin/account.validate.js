// hàm này khi bắt lỗi khi user dùng f12 xóa đi require trong tiêu đề
module.exports.createPost = (req, res, next) => {
  if(!req.body.fullName){
      req.flash("error", "Vui lòng nhập họ tên!");
      res.redirect("back");
      return;
  }

  if(!req.body.email){
    req.flash("error", "Vui lòng nhập email!");
    res.redirect("back");
    return;
  }

  if(!req.body.password){
    req.flash("error", "Vui lòng nhập mật khẩu!");
    res.redirect("back");
    return;
  }
  
  next(); // next sang bước kế tiếp
}

// hàm này khi bắt lỗi khi user dùng f12 xóa đi require trong tiêu đề
module.exports.editPatch = (req, res, next) => {
  if(!req.body.fullName){
      req.flash("error", "Vui lòng nhập họ tên!");
      res.redirect("back");
      return;
  }

  if(!req.body.email){
    req.flash("error", "Vui lòng nhập email!");
    res.redirect("back");
    return;
  }
  
  next(); // next sang bước kế tiếp
}