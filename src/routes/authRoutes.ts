import { Router } from "express";
import { getGoogleAuthUrl, googleCallback, getMe, logout, updateProfile } from "../controllers/authController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @route   GET /api/auth/google/url
 * @desc    Lấy URL xác thực Google OAuth2 và lưu state tạm thời chống CSRF vào cookie
 * @access  Public
 */
router.get("/google/url", getGoogleAuthUrl);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Nhận authorization code từ Google, xác thực CSRF state, đổi mã và khởi tạo session cookie
 * @access  Public
 */
router.get("/google/callback", googleCallback);

/**
 * @route   GET /api/auth/me
 * @desc    Lấy thông tin người dùng hiện tại dựa trên Session Cookie chứa JWT
 * @access  Private (Yêu cầu đăng nhập)
 */
router.get("/me", requireAuth, getMe);

/**
 * @route   PUT /api/auth/profile
 * @desc    Cập nhật thông tin hồ sơ của người dùng (name, phone, address)
 * @access  Private (Yêu cầu đăng nhập)
 */
router.put("/profile", requireAuth, updateProfile);

/**
 * @route   POST /api/auth/logout
 * @desc    Xóa Session Cookie xác thực người dùng
 * @access  Public
 */
router.post("/logout", logout);

export default router;
