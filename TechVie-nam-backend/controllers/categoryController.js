const Category = require("../models/Category");

const categoryController = {
  // Lấy toàn bộ danh sách danh mục xếp theo thứ tự thời gian tạo
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find({}).sort({ created_at: 1 });
      return res.status(200).json({
        success: true,
        categories,
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách danh mục:", error);
      return res.status(500).json({
        success: false,
        message: "Không thể lấy danh sách danh mục từ database!",
        error: error.message,
      });
    }
  },
};

module.exports = categoryController;
