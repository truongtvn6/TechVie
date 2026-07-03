const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Route công khai: Tạo đơn đặt hàng mới (Checkout)
router.post("/", orderController.createOrder);

// Route công khai: Khách chỉ được kiểm tra trạng thái, không được tự xác nhận đã thanh toán
router.get("/payment/status/:orderId", orderController.getPaymentStatus);

module.exports = router;
