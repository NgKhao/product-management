const express = require("express");
const multer = require("multer"); //upload ảnh
const router = express.Router();

const upload = multer(); // upload online nên không cần truyền thư mục

const controller = require("../../controllers/admin/account.controller");

const validate = require("../../validates/admin/account.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");



router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.editPatch,
  controller.editPatch
);

module.exports = router;
