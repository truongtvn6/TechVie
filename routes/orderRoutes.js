const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

// Áp dụng middleware bảo mật cho toàn bộ các API quản lý đơn hàng
router.use(authMiddleware);
router.use(authMiddleware.adminOnly);

// Lấy danh sách toàn bộ đơn hàng
router.get("/", orderController.getOrders);

// Cập nhật trạng thái đơn hàng (sử dụng POST để tương thích với frontend cũ)
router.post("/:id/status", orderController.updateOrderStatus);

// Xóa sạch toàn bộ đơn hàng
router.delete("/", orderController.clearAllOrders);

module.exports = router;
