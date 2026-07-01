const { Router } = require("express");
const { checkout } = require("../controllers/orderController");

const router = Router();

/**
 * @route   POST /api/checkout
 * @desc    Xử lý đơn đặt hàng từ khách hàng
 * @access  Public
 */
router.post("/", checkout);

module.exports = router;
