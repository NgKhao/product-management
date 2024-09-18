const express = require("express");
const router = express.Router();

// file checkout.route để dùng trong trang thanh toán

const controller = require("../../controllers/client/checkout.controller");

router.get("/", controller.index);

module.exports = router;