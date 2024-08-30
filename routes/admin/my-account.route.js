const express = require("express");
const multer = require("multer"); //upload ảnh
const router = express.Router();

const upload = multer(); // upload online nên không cần truyền thư mục

const controller = require("../../controllers/admin/my-account.controller");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index);

router.get("/edit", controller.edit);

router.patch(
  "/edit",
  upload.single("avatar"),
  uploadCloud.upload,
  controller.editPatch
);

module.exports = router;
