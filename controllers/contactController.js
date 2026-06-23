const Contact = require("../models/Contact");

// @desc    Gửi liên hệ góp ý hoặc đăng ký nhận tin (Công khai)
// @route   POST /api/contacts
// @access  Public
exports.createContactInquiry = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Họ tên và email là bắt buộc.",
      });
    }

    const newInquiry = new Contact({
      name,
      email,
      subject: subject || "Yêu cầu tư vấn thiết bị",
      message: message || "Khách hàng đăng ký nhận tin",
    });

    await newInquiry.save();

    res.status(201).json({
      success: true,
      message: "Gửi liên hệ thành công!",
      inquiry: newInquiry,
    });
  } catch (error) {
    console.error("Lỗi gửi thư góp ý:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi kết nối máy chủ khi gửi liên hệ.",
      error: error.message,
    });
  }
};

// @desc    Lấy danh sách thư góp ý khách hàng (Chỉ dành cho Admin)
// @route   GET /api/contacts
// @access  Private/Admin
exports.getContactMessages = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ created_at: -1 });
    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error("Lỗi lấy hòm thư góp ý:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi kết nối máy chủ khi lấy danh sách liên hệ.",
      error: error.message,
    });
  }
};
