const { Router } = require("express");
const { getPopularSearches, getSearchHistory } = require("../controllers/searchController");

const router = Router();

/**
 * @route   GET /api/search/popular
 * @desc    Lấy danh sách tìm kiếm phổ biến
 * @access  Public
 */
router.get("/popular", getPopularSearches);

/**
 * @route   GET /api/search/history
 * @desc    Lấy lịch sử tìm kiếm
 * @access  Public
 */
router.get("/history", getSearchHistory);

module.exports = router;
