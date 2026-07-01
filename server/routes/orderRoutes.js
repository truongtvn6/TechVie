const { Router } = require("express");
const orderController = require("../controllers/orderController");
const { requireAuth, adminOnly } = require("../middlewares/authMiddleware");

const router = Router();

router.use(requireAuth);

// User can view only their own order history.
router.get("/user", orderController.getUserOrders);

router.use(adminOnly);

// Admin order management.
router.get("/", orderController.getOrders);
router.post("/:id/status", orderController.updateOrderStatus);
router.post("/:id/payment-status", orderController.updatePaymentStatus);
router.delete("/", orderController.clearAllOrders);

module.exports = router;
