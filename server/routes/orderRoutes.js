const { Router } = require("express");
const { getOrders, getMyOrders, updateOrderStatus, deleteAllOrders } = require("../controllers/orderController");

const router = Router();

/**
 * @route   GET /api/orders
 * @desc    Lấy toàn bộ đơn hàng (Admin)
 * @access  Private (Admin)
 */
router.get("/", getOrders);

/**
 * @route   POST /api/orders/:id/status
 * @desc    Cập nhật trạng thái đơn hàng (Admin)
 * @access  Private (Admin)
 */
router.post("/:id/status", updateOrderStatus);

/**
 * @route   DELETE /api/orders
 * @desc    Xóa toàn bộ đơn hàng (Admin)
 * @access  Private (Admin)
 */
router.delete("/", deleteAllOrders);

module.exports = router;
