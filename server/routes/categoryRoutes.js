const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Lấy danh sách danh mục (Công khai)
router.get("/", categoryController.getCategories);

// Xóa danh mục (Soft Delete)
router.delete("/:id", categoryController.deleteCategory);

// Khôi phục danh mục
router.patch("/:id/restore", categoryController.restoreCategory);

module.exports = router;
