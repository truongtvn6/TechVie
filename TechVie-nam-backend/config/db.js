const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/database_for_tmdt_01";
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Kết nối MongoDB thành công!");
    return conn;
  } catch (err) {
    console.log("⚠ [DATABASE] Không thể kết nối MongoDB Atlas (Đang hoạt động offline).");
    console.log(`[DATABASE] Chi tiết lỗi: ${err.name || "Error"}${err.code ? ` (${err.code})` : ""} - ${err.message}`);
    return null;
  }
};

module.exports = connectDB;
