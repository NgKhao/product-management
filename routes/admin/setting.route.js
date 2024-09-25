const express = require("express");
const multer = require("multer"); //upload ảnh

const router = express.Router();

const upload = multer(); // upload online nên không cần truyền thư mục

const controller = require("../../controllers/admin/setting.controller");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/general", controller.general);

router.patch(
  "/general",
  upload.single("logo"),
  uploadCloud.upload,
  controller.generalPatch
);

module.exports = router;
