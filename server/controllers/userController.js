// Mock User Database in memory (synced to Admin Page)
const systemUsers = [
  {
    id: "usr-admin",
    username: "admin",
    email: "admin@techvie.com",
    phone: "0912 345 678",
    role: "admin",
    vipStatus: true,
    status: "active",
    created_at: new Date(Date.now() - 3600000 * 240).toISOString()
  },
  {
    id: "usr-user",
    username: "Nguyễn Minh Tiến",
    email: "mintzinfinity898@gmail.com",
    phone: "0987 654 321",
    role: "user",
    vipStatus: false,
    status: "active",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

/**
 * Lấy danh sách users (Admin)
 */
const getUsers = (req, res) => {
  res.json({ success: true, users: systemUsers });
};

/**
 * Tạo user mới (Admin)
 */
const createUser = (req, res) => {
  const { username, email, phone, role, vipStatus } = req.body;
  const newUser = {
    id: `usr-${Math.random().toString(36).substr(2, 9)}`,
    username: username || "New User",
    email: email || "user@example.com",
    phone: phone || "0900 000 000",
    role: role || "user",
    vipStatus: !!vipStatus,
    status: "active",
    created_at: new Date().toISOString()
  };
  systemUsers.push(newUser);
  res.json({ success: true, message: "Tạo tài khoản thành công!", user: newUser });
};

/**
 * Toggle Role (Admin)
 */
const toggleRole = (req, res) => {
  const { id } = req.params;
  const user = systemUsers.find(u => u.id === id);
  if (user) {
    user.role = user.role === "admin" ? "user" : "admin";
    return res.json({ success: true, message: "Đổi vai trò thành công!", user });
  }
  res.status(404).json({ success: false, message: "Không tìm thấy user." });
};

/**
 * Toggle VIP (Admin)
 */
const toggleVip = (req, res) => {
  const { id } = req.params;
  const user = systemUsers.find(u => u.id === id);
  if (user) {
    user.vipStatus = !user.vipStatus;
    return res.json({ success: true, message: "Đổi trạng thái VIP thành công!", user });
  }
  res.status(404).json({ success: false, message: "Không tìm thấy user." });
};

/**
 * Toggle Status (Admin)
 */
const toggleStatus = (req, res) => {
  const { id } = req.params;
  const user = systemUsers.find(u => u.id === id);
  if (user) {
    user.status = user.status === "active" ? "blocked" : "active";
    return res.json({ success: true, message: "Đổi trạng thái hoạt động thành công!", user });
  }
  res.status(404).json({ success: false, message: "Không tìm thấy user." });
};

/**
 * Xóa user (Admin)
 */
const deleteUser = (req, res) => {
  const { id } = req.params;
  const idx = systemUsers.findIndex(u => u.id === id);
  if (idx !== -1) {
    systemUsers.splice(idx, 1);
    return res.json({ success: true, message: "Xoá tài khoản thành công!" });
  }
  res.status(404).json({ success: false, message: "Không tìm thấy user." });
};

module.exports = {
  getUsers,
  createUser,
  toggleRole,
  toggleVip,
  toggleStatus,
  deleteUser,
};
