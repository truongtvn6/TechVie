const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");
const mongoose = require("mongoose");
const User = require("../models/User");

// 1. Lấy danh sách đánh giá của sản phẩm (Public)
exports.getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Tìm tất cả các reviews chưa bị xóa của sản phẩm
    const reviews = await Review.find({ product_id: productId, isDeleted: { $ne: true } })
      .populate("user_id", "username avatar email")
      .sort({ created_at: -1 });

    // Tính toán phân bổ số sao (Breakdown)
    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;

    reviews.forEach(review => {
      if (breakdown[review.rating] !== undefined) {
        breakdown[review.rating]++;
      }
      totalRating += review.rating;
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ? Math.round((totalRating / totalReviews) * 10) / 10 : 0;

    return res.status(200).json({
      success: true,
      reviews,
      summary: {
        averageRating,
        reviewCount: totalReviews,
        breakdown,
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách đánh giá sản phẩm!",
      error: error.message,
    });
  }
};

// 1b. Kiểm tra quyền đánh giá sản phẩm (Auth required)
// Logic: tìm order chứa sản phẩm này theo email của tài khoản (không phải email nhập tay trong form)
exports.canReview = async (req, res) => {
  try {
    const { productId } = req.params;

    // Lấy email thực của tài khoản đang đăng nhập từ DB (không dùng email trong form checkout)
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, canReview: false, message: "Không tìm thấy tài khoản!" });
    }

    // Tìm đơn hàng đã hoàn thành có chứa sản phẩm này, liên kết qua email tài khoản
    const purchasedOrder = await Order.findOne({
      email: user.email,
      "items.product_id": productId,
      status_type: "success",
    });

    if (!purchasedOrder) {
      return res.status(200).json({ success: true, canReview: false, reason: "not_purchased" });
    }

    // Kiểm tra đã review chưa
    const existingReview = await Review.findOne({
      product_id: productId,
      user_id: req.user.id,
      isDeleted: { $ne: true },
    });

    if (existingReview) {
      return res.status(200).json({ success: true, canReview: false, reason: "already_reviewed" });
    }

    return res.status(200).json({ success: true, canReview: true });
  } catch (error) {
    return res.status(500).json({ success: false, canReview: false, message: error.message });
  }
};

// 2. Tạo đánh giá mới (Auth required)
exports.createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ số sao đánh giá (rating) và bình luận (comment)!",
      });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Số sao đánh giá phải từ 1 đến 5!",
      });
    }

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm cần đánh giá!",
      });
    }

    // Lấy thông tin user hiện tại
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin tài khoản người dùng!",
      });
    }

    // Kiểm tra xem người dùng đã mua sản phẩm này chưa qua đơn hàng (Order)
    // Liên kết qua email của tài khoản
    const purchasedOrder = await Order.findOne({
      email: user.email,
      "items.product_id": productId,
      status_type: "success",
    });

    if (!purchasedOrder) {
      return res.status(403).json({
        success: false,
        message: "Bạn chỉ có thể đánh giá sản phẩm khi đã mua sản phẩm này và đơn hàng được giao thành công!",
      });
    }

    // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa (Tránh đánh giá nhiều lần)
    const existingReview = await Review.findOne({
      product_id: productId,
      user_id: req.user.id,
      isDeleted: { $ne: true },
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã đánh giá sản phẩm này rồi! Mỗi sản phẩm chỉ được đánh giá một lần.",
      });
    }

    // Tạo review mới
    const newReview = new Review({
      product_id: productId,
      user_id: req.user.id,
      username: user.username || "Người dùng TechVie",
      order_id: purchasedOrder._id,
      rating: numericRating,
      title: title || "",
      comment,
      verified_purchase: true,
    });

    await newReview.save();

    return res.status(201).json({
      success: true,
      message: "Đăng đánh giá thành công!",
      review: newReview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi gửi đánh giá sản phẩm!",
      error: error.message,
    });
  }
};

// 3. Xóa đánh giá (Auth required: Chỉ người đánh giá hoặc Admin được xóa)
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review || review.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá!",
      });
    }

    // Kiểm tra quyền: Phải là chủ đánh giá hoặc Admin
    const isOwner = review.user_id.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xóa đánh giá này!",
      });
    }

    // Thực hiện soft delete để kích hoạt Hook Mongoose
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { isDeleted: true },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Đã xóa đánh giá thành công!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi xóa đánh giá!",
      error: error.message,
    });
  }
};
