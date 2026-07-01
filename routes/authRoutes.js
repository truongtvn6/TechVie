const { Router } = require("express");
const { getGoogleAuthUrl, googleCallback, getMe, logout, updateProfile, login, register, changePassword } = require("../controllers/authController");
const { requireAuth } = require("../middlewares/authMiddleware");

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
 * @route   POST /api/auth/login
 * @desc    Đăng nhập bằng email/mật khẩu
 * @access  Public
 */
router.post("/login", login);

/**
 * @route   POST /api/auth/register
 * @desc    Đăng ký tài khoản mới
 * @access  Public
 */
router.post("/register", register);

/**
 * @route   POST /api/auth/change-password
 * @desc    Đổi mật khẩu
 * @access  Private
 */
router.post("/change-password", changePassword);

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

module.exports = router;
