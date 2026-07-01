const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Route công khai: Tạo đơn đặt hàng mới (Checkout)
router.post("/", orderController.createOrder);

module.exports = router;
