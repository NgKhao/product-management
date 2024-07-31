const express = require("express");
const multer = require("multer"); //upload ảnh
const router = express.Router();


// const storageMulter = require("../../helpers/storageMulter")
// const upload = multer({ storage: storageMulter() }); //đứng từ thư mục cao nhất lưu ảnh tại thư mục upload
const upload = multer(); // upload online nên không cần truyền thư mục

const controller = require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

router.get("/", controller.index);

// :status, :id là truyền router động
router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

// click vào button thêm mới sẽ chạy vào phương thức get để hiện giao diện thêm sp
router.get("/create", controller.create);

// click vào button tạo mới sẽ vào phương thức post để gửi lên sever
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch
);

router.get("/detail/:id", controller.detail);

module.exports = router;
