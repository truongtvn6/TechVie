const { Router } = require("express");
const { upload } = require("../config/cloudinary");
const { getProducts, createProduct, updateProduct, deleteProduct, getCategories, getHeroImages } = require("../controllers/productController");

const router = Router();

/**
 * @route   GET /api/products
 * @desc    Lấy danh sách sản phẩm (có hỗ trợ ?search=...)
 * @access  Public
 */
router.get("/", getProducts);

/**
 * @route   POST /api/products
 * @desc    Tạo sản phẩm mới (Admin, hỗ trợ upload ảnh)
 * @access  Private (Admin)
 */
router.post("/", upload.single("imageFile"), createProduct);

/**
 * @route   PUT /api/products/:id
 * @desc    Cập nhật sản phẩm (Admin, hỗ trợ upload ảnh)
 * @access  Private (Admin)
 */
router.put("/:id", upload.single("imageFile"), updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Xóa sản phẩm (Admin)
 * @access  Private (Admin)
 */
router.delete("/:id", deleteProduct);

module.exports = router;
