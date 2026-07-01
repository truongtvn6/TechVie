const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

// Route Google OAuth
router.get("/google", authController.getGoogleAuthUrl);
router.get("/google/callback", authController.googleCallback);

// Route Đăng ký: POST /api/auth/register
router.post("/register", authController.register);

// Route Đăng nhập: POST /api/auth/login
router.post("/login", authController.login);

// Route Lấy Profile: GET /api/auth/profile (Yêu cầu đăng nhập)
router.get("/profile", authMiddleware, authController.getProfile);

// Route Quên Mật Khẩu: POST /api/auth/forgot-password
// Body: { email }
// → Gửi email chứa link đặt lại mật khẩu (token hết hạn sau 15 phút)
router.post("/forgot-password", authController.forgotPassword);

// Route Đặt Lại Mật Khẩu: POST /api/auth/reset-password/:token
// Params: token (lấy từ link email)
// Body: { newPassword }
// → Xác thực token, cập nhật mật khẩu mới vào DB, xóa token
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
