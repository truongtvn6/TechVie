const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Lấy danh sách danh mục (Công khai)
router.get("/", categoryController.getCategories);

module.exports = router;
