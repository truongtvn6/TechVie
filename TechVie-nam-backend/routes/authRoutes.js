const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

// Route Đăng ký: POST /api/auth/register
router.post("/register", authController.register);

// Route Đăng nhập: POST /api/auth/login
router.post("/login", authController.login);

// Route Lấy Profile: GET /api/auth/profile (Yêu cầu đăng nhập)
router.get("/profile", authMiddleware, authController.getProfile);

module.exports = router;
