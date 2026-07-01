const { Router } = require("express");
const { createContact, getContacts } = require("../controllers/contactController");

const router = Router();

/**
 * @route   GET /api/contacts
 * @desc    Lấy toàn bộ liên hệ (Admin)
 * @access  Private (Admin)
 */
router.get("/", getContacts);

/**
 * @route   POST /api/contacts
 * @desc    Gửi liên hệ mới
 * @access  Public
 */
router.post("/", createContact);

module.exports = router;
