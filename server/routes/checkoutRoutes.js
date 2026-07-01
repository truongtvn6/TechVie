const { Router } = require("express");
const orderController = require("../controllers/orderController");

const router = Router();

/**
 * @route   POST /api/checkout
 * @desc    Xử lý đơn đặt hàng từ khách hàng
 * @access  Public
 */
router.post("/", orderController.createOrder);

/**
 * @route   GET /api/checkout/payment/status/:orderId
 * @desc    Khách chỉ được kiểm tra trạng thái thanh toán
 * @access  Public
 */
router.get("/payment/status/:orderId", orderController.getPaymentStatus);

module.exports = router;
