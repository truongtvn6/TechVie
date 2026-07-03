const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/database_for_tmdt_01", {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Kết nối MongoDB thành công!");
    return conn;
  } catch (err) {
    console.log("⚠ [DATABASE] Không thể kết nối MongoDB Atlas (Đang hoạt động offline).", err.message);
    return null;
  }
};

module.exports = connectDB;
