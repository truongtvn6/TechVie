const mongoose = require("mongoose");
require("dotenv").config();
const dns = require("dns");

// Use public DNS to resolve MongoDB Atlas SRV records correctly
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/techvie_db");
    console.log("Kết nối MongoDB thành công!");
    return conn;
  } catch (err) {
    console.log("⚠ [DATABASE] Không thể kết nối MongoDB Atlas (Đang hoạt động offline).");
    return null;
  }
};

module.exports = connectDB;
