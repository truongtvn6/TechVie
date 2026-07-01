const { Router } = require("express");
const { getUsers, createUser, toggleRole, toggleVip, toggleStatus, deleteUser } = require("../controllers/userController");

const router = Router();

/**
 * @route   GET /api/users
 * @desc    Lấy danh sách thành viên (Admin)
 * @access  Private (Admin)
 */
router.get("/", getUsers);

/**
 * @route   POST /api/users
 * @desc    Tạo tài khoản thành viên mới (Admin)
 * @access  Private (Admin)
 */
router.post("/", createUser);

/**
 * @route   PUT /api/users/:id/role
 * @desc    Toggle phân quyền thành viên (Admin)
 * @access  Private (Admin)
 */
router.put("/:id/role", toggleRole);

/**
 * @route   PUT /api/users/:id/vip
 * @desc    Toggle trạng thái VIP thành viên (Admin)
 * @access  Private (Admin)
 */
router.put("/:id/vip", toggleVip);

/**
 * @route   PUT /api/users/:id/status
 * @desc    Toggle trạng thái hoạt động thành viên (Admin)
 * @access  Private (Admin)
 */
router.put("/:id/status", toggleStatus);

/**
 * @route   DELETE /api/users/:id
 * @desc    Xóa tài khoản thành viên (Admin)
 * @access  Private (Admin)
 */
router.delete("/:id", deleteUser);

module.exports = router;
