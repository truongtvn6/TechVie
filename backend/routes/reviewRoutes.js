const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddleware");

// 1. Lấy tất cả đánh giá của một sản phẩm (Public)
router.get("/:productId", reviewController.getReviewsByProduct);

// 1b. Kiểm tra xem user hiện tại có quyền review sản phẩm này không (Yêu cầu đăng nhập)
router.get("/:productId/can-review", authMiddleware, reviewController.canReview);

// 2. Viết đánh giá mới cho sản phẩm (Yêu cầu đăng nhập & đã mua sản phẩm này)
router.post("/:productId", authMiddleware, reviewController.createReview);

// 3. Xóa đánh giá (Yêu cầu đăng nhập, chỉ chủ đánh giá hoặc admin được xóa)
router.delete("/:reviewId", authMiddleware, reviewController.deleteReview);

module.exports = router;
