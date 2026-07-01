// Keep a simple in-memory database of received orders for demonstration
const orders = [];

/**
 * Lấy toàn bộ đơn hàng (Admin)
 */
const getOrders = (req, res) => {
  res.json({ success: true, count: orders.length, orders });
};

/**
 * Lấy đơn hàng theo email
 */
const getMyOrders = (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.json({ success: true, orders: [] });
  }
  const targetEmail = email.toLowerCase();
  const filtered = orders.filter(o => o.email && o.email.toLowerCase() === targetEmail);
  
  // Map server orders format to frontend TabOrders format
  const mapped = filtered.map(o => ({
    id: `ORD-${o.orderId}`,
    date: new Date(o.createdAt).toLocaleDateString("vi-VN"),
    total: `${Number(o.finalTotal.replace(/[^0-9]/g, "")).toLocaleString("vi-VN")}₫`,
    items: o.cart.map((c) => ({
      name: c.product.name,
      type: c.product.category,
      qty: c.quantity
    })),
    status: o.status,
    statusType: o.statusType
  }));
  
  res.json({ success: true, orders: mapped });
};

/**
 * Cập nhật trạng thái đơn hàng (Admin)
 */
const updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status, statusType } = req.body;
  const order = orders.find(o => o.orderId === parseInt(id));
  if (order) {
    order.status = status;
    if (statusType) {
      order.statusType = statusType;
    }
    return res.json({ success: true, message: "Cập nhật trạng thái thành công!", order });
  }
  res.status(404).json({ success: false, message: "Không tìm thấy mã đơn hàng." });
};

/**
 * Xóa toàn bộ đơn hàng (Admin helper)
 */
const deleteAllOrders = (req, res) => {
  orders.length = 0;
  res.json({ success: true, message: "Đã xoá toàn bộ sổ đặt hàng trên máy chủ." });
};

/**
 * Xử lý checkout đơn hàng
 */
const checkout = (req, res) => {
  const { fullName, phone, email, address, notes, paymentMethod, deliveryMethod, cart, finalTotal } = req.body;

  if (!fullName || !phone || !email || !address) {
    return res.status(400).json({
      success: false,
      message: "Thiếu thông tin bắt buộc để tiến hành đặt hàng."
    });
  }

  if (!cart || cart.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Giỏ hàng rỗng."
    });
  }

  // Generate a unique order ID
  const orderId = Math.floor(100000 + Math.random() * 900000);
  const newOrder = {
    orderId,
    fullName,
    phone,
    email,
    address,
    notes,
    paymentMethod,
    deliveryMethod,
    cart,
    finalTotal,
    status: "Đang lắp ráp chuẩn bị gửi",
    statusType: "processing",
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);

  // Simulated confirmation containing real processed payload
  res.status(200).json({
    success: true,
    message: "Đặt hàng thành công và được ghi nhận tại máy chủ Express!",
    orderId,
    order: newOrder
  });
};

module.exports = {
  getOrders,
  getMyOrders,
  updateOrderStatus,
  deleteAllOrders,
  checkout,
};
