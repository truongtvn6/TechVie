const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    description: "Mã chuỗi thiết bị duy nhất. Ví dụ: lumina-book-pro-x",
  },
  name: {
    type: String,
    required: true,
    description: "Tên hiển thị sản phẩm",
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    description: "Giá niêm yết (VND) >= 0",
  },
  category: {
    type: String,
    required: true,
    index: true,
    description: "Phân loại: Điện thoại, Laptop, Đồng hồ...",
  },
  image: {
    type: String,
    description: "URL hình ảnh sản phẩm",
  },
  description: {
    type: String,
    description: "Mô tả tóm tắt tính năng",
  },
  specs: {
    type: mongoose.Schema.Types.Mixed,
    default: [],
    description: "Mảng JSON chứa thông số kỹ thuật",
  },
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Tạo trường ảo 'id' phản ánh giá trị từ '_id'
productSchema.virtual("id").get(function() {
  return this._id;
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
