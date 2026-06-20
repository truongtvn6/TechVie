const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/database_for_tmdt_01");
    console.log("Kết nối MongoDB thành công!");
    return conn;
  } catch (err) {
    console.error("Lỗi kết nối database:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
