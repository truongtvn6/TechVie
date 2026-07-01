const Category = require("../models/Category");

const categoryController = {
  // Lấy toàn bộ danh sách danh mục xếp theo thứ tự thời gian tạo
  getCategories: async (req, res) => {
    try {
      const { includeDeleted } = req.query;
      let query = {};
      
      // Nếu không yêu cầu lấy dữ liệu đã xóa, mặc định bỏ qua chúng
      if (includeDeleted !== 'true') {
        query.isDeleted = { $ne: true };
      }

      const categories = await Category.find(query).sort({ created_at: 1 });
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

  // Xóa mềm danh mục
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy danh mục!",
        });
      }

      category.isDeleted = true;
      await category.save();

      return res.status(200).json({
        success: true,
        message: "Xóa mềm danh mục thành công!",
        category,
      });
    } catch (error) {
      console.error("Lỗi xóa danh mục:", error);
      return res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra khi xóa danh mục!",
        error: error.message,
      });
    }
  },

  // Khôi phục danh mục
  restoreCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy danh mục!",
        });
      }

      category.isDeleted = false;
      await category.save();

      return res.status(200).json({
        success: true,
        message: "Khôi phục danh mục thành công!",
        category,
      });
    } catch (error) {
      console.error("Lỗi khôi phục danh mục:", error);
      return res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra khi khôi phục danh mục!",
        error: error.message,
      });
    }
  },
};

module.exports = categoryController;
