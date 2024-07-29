// hàm này khi bắt lỗi khi user dùng f12 xóa đi require trong tiêu đề
module.exports.createPost = (req, res, next) => {
    if(!req.body.title){
        req.flash("error", "Vui lòng nhập tiêu đề!");
        res.redirect("back");
        return;
    }
    next(); // next sang bước kế tiếp
}