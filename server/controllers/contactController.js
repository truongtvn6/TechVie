// Keep a simple in-memory database of customer contacts for demonstration
const contacts = [
  {
    id: 1082,
    name: "Trần Anh Tú",
    email: "tuanhtu@gmail.com",
    subject: "Hợp tác phân phối sỉ",
    message: "Tôi có hệ thống cửa hàng điện máy cao cấp tại Đà Nẵng, muốn liên hệ làm đại lý chính thức để phân phối các dòng máy TechVie Book Pro X.",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString() // 4 hours ago
  },
  {
    id: 1094,
    name: "Hoàng Vy",
    email: "vyhoang99@hotmail.com",
    subject: "Cấu hình custom khắc tên",
    message: "Có chương trình hỗ trợ in ấn khắc laser tên riêng hoặc logo doanh nghiệp lên mặt sau điện thoại Titanium TechVie Ultra v1 không?",
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString() // 1 hour ago
  }
];

/**
 * Gửi liên hệ mới
 */
const createContact = (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: "Họ tên và email là bắt buộc." });
  }
  const newInquiry = {
    id: Math.floor(1000 + Math.random() * 9000),
    name,
    email,
    subject: subject || "Yêu cầu tư vấn thiết bị",
    message: message || "",
    createdAt: new Date().toISOString()
  };
  contacts.push(newInquiry);
  res.json({ success: true, message: "Gửi liên hệ thành công!", inquiry: newInquiry });
};

/**
 * Lấy toàn bộ liên hệ (Admin)
 */
const getContacts = (req, res) => {
  res.json({ success: true, count: contacts.length, contacts });
};

module.exports = {
  createContact,
  getContacts,
};
