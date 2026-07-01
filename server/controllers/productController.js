const mongoose = require("mongoose");
const { v2: cloudinary } = require("cloudinary");
const Product = require("../models/Product");

/**
 * Lấy danh sách sản phẩm (có hỗ trợ tìm kiếm)
 */
const getProducts = async (req, res) => {
  try {
    const search = req.query.search;
    let query = {};
    if (search) {
      query = { name: { $regex: search, $options: "i" } };
    }
    const productsList = await Product.find(query).sort({ created_at: -1 });
    const formattedProducts = productsList.map(p => {
      const obj = p.toObject();
      return {
        ...obj,
        id: obj._id ? obj._id.toString() : obj.id,
      };
    });
    res.json({ success: true, products: formattedProducts });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Tạo sản phẩm mới (Admin)
 */
const createProduct = async (req, res) => {
  try {
    const { name, price, category, description, specs } = req.body;
    let imageUrl = "";

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "techvie_products" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      imageUrl = uploadResult.secure_url;
    } else {
      imageUrl = req.body.image || "";
    }

    let parsedSpecs = [];
    if (specs) {
      parsedSpecs = typeof specs === "string" ? JSON.parse(specs) : specs;
    }

    const newProduct = new Product({
      _id: new mongoose.Types.ObjectId().toString(),
      name,
      price: Number(price),
      category,
      description,
      image: imageUrl,
      specs: parsedSpecs
    });

    await newProduct.save();

    const responseProduct = newProduct.toObject();
    responseProduct.id = responseProduct._id.toString();

    res.status(201).json({
      success: true,
      message: "Sản phẩm đã được lưu trữ thành công!",
      product: responseProduct
    });
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Cập nhật sản phẩm (Admin)
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, description, specs } = req.body;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm." });
    }

    if (name) product.name = name;
    if (price) product.price = Number(price);
    if (category) product.category = category;
    if (description !== undefined) product.description = description;
    if (specs) {
      product.specs = typeof specs === "string" ? JSON.parse(specs) : specs;
    }

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "techvie_products" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      product.image = uploadResult.secure_url;
    } else if (req.body.image) {
      product.image = req.body.image;
    }

    await product.save();

    const responseProduct = product.toObject();
    responseProduct.id = responseProduct._id.toString();

    res.json({
      success: true,
      message: "Cập nhật sản phẩm thành công!",
      product: responseProduct
    });
  } catch (error) {
    console.error("Lỗi khi sửa sản phẩm:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Xóa sản phẩm (Admin)
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (deleted) {
      return res.json({ success: true, message: "Xoá sản phẩm thành công!" });
    }
    res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm." });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Lấy danh mục sản phẩm
 */
const getCategories = (req, res) => {
  res.json({
    success: true,
    categories: ['Tất cả', 'Điện thoại', 'Laptop', 'Đồng hồ', 'Âm thanh', 'Bàn phím']
  });
};

/**
 * Lấy ảnh hero slider
 */
const getHeroImages = (req, res) => {
  res.json([
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80'
  ]);
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getHeroImages,
};
