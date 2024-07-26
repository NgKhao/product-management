const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/product.controller");
router.get("/", controller.index);

// :status, :id là truyền router động 
router.patch("/change-status/:status/:id", controller.changeStatus);


router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

// click vào button thêm mới sẽ chạy vào phương thức get để hiện giao diện thêm sp
router.get("/create", controller.create);

// click vào button tạo mới sẽ vào phương thức post để gửi lên sever
router.post("/create", controller.createPost);

module.exports = router;