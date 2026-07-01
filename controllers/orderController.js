const Order = require("../models/Order");

// @desc    Tạo đơn hàng mới (Checkout)
// @route   POST /api/checkout
// @access  Public
exports.createOrder = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      address,
      notes,
      paymentMethod,
      deliveryMethod,
      cart,
      finalTotal,
    } = req.body;

    if (!fullName || !phone || !email || !address) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc để tiến hành đặt hàng.",
      });
    }

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Giỏ hàng rỗng.",
      });
    }

    // Chuẩn hóa phương thức thanh toán để khớp với enum của Mongoose
    let normalizedPayment = "cod";
    const pmLower = (paymentMethod || "").toLowerCase();
    if (pmLower.includes("cod") || pmLower.includes("nhận hàng") || pmLower.includes("nhan hang")) {
      normalizedPayment = "cod";
    } else if (pmLower.includes("card") || pmLower.includes("tín dụng") || pmLower.includes("tin dung") || pmLower.includes("online") || pmLower.includes("momo")) {
      normalizedPayment = "card_online";
    } else if (pmLower.includes("transfer") || pmLower.includes("chuyển khoản") || pmLower.includes("chuyen khoan") || pmLower.includes("ngân hàng") || pmLower.includes("ngan hang")) {
      normalizedPayment = "bank_transfer";
    } else {
      // Nếu là bất cứ giá trị nào khác, giữ nguyên nếu nó nằm trong enum, ngược lại default 'cod'
      normalizedPayment = ["cod", "card_online", "bank_transfer"].includes(paymentMethod)
        ? paymentMethod
        : "cod";
    }

    // Chuẩn hóa phương thức vận chuyển để khớp với enum của Mongoose
    let normalizedDelivery = "standard";
    const dmLower = (deliveryMethod || "").toLowerCase();
    if (dmLower.includes("express") || dmLower.includes("hỏa tốc") || dmLower.includes("hoa toc") || dmLower.includes("nhanh")) {
      normalizedDelivery = "express";
    } else if (dmLower.includes("standard") || dmLower.includes("tiêu chuẩn") || dmLower.includes("tieu chuan")) {
      normalizedDelivery = "standard";
    } else {
      normalizedDelivery = ["express", "standard"].includes(deliveryMethod)
        ? deliveryMethod
        : "standard";
    }

    // Ánh xạ danh sách giỏ hàng (cart items)
    const items = cart.map((item) => {
      const prod = item.product || {};
      return {
        product_id: prod.id || prod._id || "unknown-product-id",
        product_name: prod.name || "Sản phẩm TechVie",
        product_price: Number(prod.price) || 0,
        quantity: Number(item.quantity) || 1,
      };
    });

    const newOrder = new Order({
      full_name: fullName,
      phone,
      email,
      address,
      notes: notes || "",
      payment_method: normalizedPayment,
      delivery_method: normalizedDelivery,
      final_total: finalTotal || "0₫",
      items,
      status: "Đang lắp ráp chuẩn bị gửi",
      status_type: "processing",
    });

    await newOrder.save();

    // Tạo bản sao tương thích ngược với cấu trúc Frontend cũ mong đợi
    const responseOrder = {
      orderId: newOrder._id.toString(), // Hoặc sử dụng số nguyên ngẫu nhiên nếu frontend bắt buộc là number
      fullName: newOrder.full_name,
      phone: newOrder.phone,
      email: newOrder.email,
      address: newOrder.address,
      notes: newOrder.notes,
      paymentMethod: paymentMethod || "COD",
      deliveryMethod: deliveryMethod || "Tiêu chuẩn",
      cart: cart,
      finalTotal: newOrder.final_total,
      status: newOrder.status,
      statusType: newOrder.status_type,
      createdAt: newOrder.created_at.toISOString(),
    };

    res.status(201).json({
      success: true,
      message: "Đặt hàng thành công và được ghi nhận tại máy chủ Express!",
      orderId: newOrder._id.toString(),
      order: responseOrder,
    });
  } catch (error) {
    console.error("Lỗi khi xử lý đặt hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi kết nối máy chủ khi xử lý đặt hàng.",
      error: error.message,
    });
  }
};

// @desc    Lấy sổ danh sách đơn đặt hàng (Chỉ dành cho Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ created_at: -1 });
    
    // Ánh xạ ngược lại định dạng frontend mong muốn
    const mappedOrders = orders.map((o) => {
      // Ánh xạ lại cart items từ schema
      const mappedCart = o.items.map((item) => ({
        product: {
          id: item.product_id,
          name: item.product_name,
          price: item.product_price,
        },
        quantity: item.quantity,
      }));

      // Chuyển đổi payment/delivery method từ enum sang hiển thị tiếng Việt
      let displayPayment = "Thanh toán khi nhận hàng (COD)";
      if (o.payment_method === "card_online") displayPayment = "Thẻ tín dụng / Thẻ ghi nợ";
      if (o.payment_method === "bank_transfer") displayPayment = "Chuyển khoản ngân hàng";

      let displayDelivery = "Tiêu chuẩn (Standard)";
      if (o.delivery_method === "express") displayDelivery = "Hỏa tốc (Express)";

      return {
        orderId: o._id.toString(),
        fullName: o.full_name,
        phone: o.phone,
        email: o.email,
        address: o.address,
        notes: o.notes,
        paymentMethod: displayPayment,
        deliveryMethod: displayDelivery,
        cart: mappedCart,
        finalTotal: o.final_total,
        status: o.status,
        statusType: o.status_type,
        createdAt: o.created_at.toISOString(),
      };
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders: mappedOrders,
    });
  } catch (error) {
    console.error("Lỗi lấy sổ đơn đặt hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi kết nối máy chủ khi lấy danh sách đơn hàng.",
      error: error.message,
    });
  }
};

// @desc    Cập nhật trạng thái bưu kiện đơn hàng (Chỉ dành cho Admin)
// @route   POST /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, statusType } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy mã đơn hàng.",
      });
    }

    if (status) {
      order.status = status;
    }
    if (statusType) {
      order.status_type = statusType;
    }

    await order.save();

    // Ánh xạ lại cart items
    const mappedCart = order.items.map((item) => ({
      product: {
        id: item.product_id,
        name: item.product_name,
        price: item.product_price,
      },
      quantity: item.quantity,
    }));

    // Chuyển đổi phương thức hiển thị
    let displayPayment = "Thanh toán khi nhận hàng (COD)";
    if (order.payment_method === "card_online") displayPayment = "Thẻ tín dụng / Thẻ ghi nợ";
    if (order.payment_method === "bank_transfer") displayPayment = "Chuyển khoản ngân hàng";

    let displayDelivery = "Tiêu chuẩn (Standard)";
    if (order.delivery_method === "express") displayDelivery = "Hỏa tốc (Express)";

    const responseOrder = {
      orderId: order._id.toString(),
      fullName: order.full_name,
      phone: order.phone,
      email: order.email,
      address: order.address,
      notes: order.notes,
      paymentMethod: displayPayment,
      deliveryMethod: displayDelivery,
      cart: mappedCart,
      finalTotal: order.final_total,
      status: order.status,
      statusType: order.status_type,
      createdAt: order.created_at.toISOString(),
    };

    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái thành công!",
      order: responseOrder,
    });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái đơn hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi kết nối máy chủ khi cập nhật đơn hàng.",
      error: error.message,
    });
  }
};

// @desc    Xóa sạch toàn bộ đơn đặt hàng trên máy chủ (Chỉ dành cho Admin)
// @route   DELETE /api/orders
// @access  Private/Admin
exports.clearAllOrders = async (req, res) => {
  try {
    await Order.deleteMany();
    res.status(200).json({
      success: true,
      message: "Đã xoá toàn bộ sổ đặt hàng trên máy chủ.",
    });
  } catch (error) {
    console.error("Lỗi xóa sạch đơn đặt hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi kết nối máy chủ khi dọn sổ đơn hàng.",
      error: error.message,
    });
  }
};

// @desc    Lấy danh sách đơn hàng của người dùng hiện tại
// @route   GET /api/orders/user
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const email = req.user.email;
    const orders = await Order.find({ email }).sort({ created_at: -1 });

    const mappedOrders = orders.map((o) => {
      const mappedCart = o.items.map((item) => ({
        name: item.product_name,
        qty: item.quantity,
        type: "Thiết bị TechVie",
      }));

      return {
        id: o._id.toString(),
        date: o.created_at.toLocaleDateString("vi-VN"),
        total: o.final_total,
        status: o.status,
        statusType: o.status_type,
        items: mappedCart,
      };
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders: mappedOrders,
    });
  } catch (error) {
    console.error("Lỗi lấy đơn hàng của người dùng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi kết nối máy chủ khi tải đơn hàng.",
      error: error.message,
    });
  }
};
