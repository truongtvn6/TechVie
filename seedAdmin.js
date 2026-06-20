const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Kết nối model User
const UserModel = require("./models/User"); 

async function seedAdmin() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/database_for_tmdt_01";
  console.log("➔ Đang kết nối tới MongoDB...");
  
  try {
    await mongoose.connect(uri);
    console.log("✔ Kết nối MongoDB thành công!");

    const adminEmail = "admin@lumina.com";
    const adminPassword = "admin123";

    // Tìm xem đã có admin chưa
    const existingAdmin = await mongoose.model("User").findOne({ email: adminEmail });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    if (existingAdmin) {
      console.log(`ℹ Tài khoản Admin (${adminEmail}) đã tồn tại. Đang cập nhật lại mật khẩu chuẩn...`);
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log(`✔ Cập nhật mật khẩu Admin thành công!`);
    } else {
      console.log(`➔ Đang khởi tạo tài khoản Admin (${adminEmail})...`);
      
      await mongoose.model("User").create({
        username: "Administrator",
        email: adminEmail,
        password: hashedPassword,
      });

      console.log(`✔ Khởi tạo tài khoản Admin thành công!`);
      console.log(`Email: ${adminEmail}`);
      console.log(`Mật khẩu: ${adminPassword}`);
    }

  } catch (error) {
    console.error("❌ Có lỗi xảy ra trong quá trình seed Admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("➔ Đã ngắt kết nối MongoDB.");
  }
}

seedAdmin();
