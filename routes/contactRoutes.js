const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const authMiddleware = require("../middlewares/authMiddleware");

// Route công khai: Gửi liên hệ hoặc đăng ký nhận tin
router.post("/", contactController.createContactInquiry);

// Route bảo mật (Admin): Lấy toàn bộ thư góp ý của khách hàng
router.get("/", authMiddleware, authMiddleware.adminOnly, contactController.getContactMessages);

module.exports = router;
