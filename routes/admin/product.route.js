const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/product.controller");
router.get("/", controller.index);

// :status, :id là truyền router động 
router.patch("/change-status/:status/:id", controller.changeStatus);


router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);


module.exports = router;