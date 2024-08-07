const express = require("express");
const multer = require("multer"); //upload ảnh
const router = express.Router();

const upload = multer(); // upload online nên không cần truyền thư mục

const controller = require("../../controllers/admin/product-category.controller");
const validate = require("../../validates/admin/product-category.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

router.get("/", controller.index);

router.get("/create", controller.create);

// click vào button tạo mới sẽ vào phương thức post để gửi lên sever
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

module.exports = router;
