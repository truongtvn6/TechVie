require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const chalk = require("chalk");
const mongoose = require("mongoose");
const connectDB = require("./config/db"); // Trỏ đúng đến file db.js trong thư mục config
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const Category = require("./models/Category");

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Cấu hình CORS (Cho phép giao diện kết nối không bị chặn)
app.use(cors());

// 2. Cấu hình đọc dữ liệu JSON & URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Logger Middleware với Chalk để giao diện console chuyên nghiệp hơn
app.use(
  morgan((tokens, req, res) => {
    const status = tokens.status(req, res);
    const statusColor =
      status >= 500
        ? chalk.red
        : status >= 400
          ? chalk.yellow
          : status >= 300
            ? chalk.cyan
            : chalk.green;

    return [
      chalk.yellow(`[REQUEST]`),
      chalk.gray(new Date().toISOString()),
      chalk.bold(tokens.method(req, res)),
      tokens.url(req, res),
      statusColor(status),
      chalk.gray(`${tokens["response-time"](req, res)} ms`),
    ].join(" ");
  })
);

// 4. Route mặc định kiểm tra trạng thái hoạt động của Backend
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Chào bạn, Backend TechVie đã hoạt động ổn định!",
  });
});

// 5. Route kiểm tra kết nối database
app.get("/test-db", async (req, res) => {
  try {
    // Kiểm tra trạng thái kết nối của Mongoose (1 = Connected)
    const state = mongoose.connection.readyState;
    if (state === 1) {
      res.status(200).json({
        success: true,
        message: "Kết nối Database (MongoDB) thành công!",
        dbName: mongoose.connection.name,
      });
    } else {
      throw new Error(`Trạng thái kết nối: ${state}`);
    }
  } catch (err) {
    console.error(chalk.red("✖ Lỗi kết nối database:"), err);
    res.status(500).json({
      success: false,
      message: "Kết nối Database thất bại!",
      error: err.message,
    });
  }
});

// 6. Định nghĩa API Authentication Routes
app.use("/api/auth", authRoutes);

// 7. Định nghĩa API Products Routes (kết nối MongoDB & Cloudinary)
app.use("/api/products", productRoutes);

// 8. Định nghĩa API Categories Routes
app.use("/api/categories", categoryRoutes);

// Route 2: Nhận email đăng ký nhận tin từ Homepage
app.post("/api/subscribe", (req, res) => {
  const { email } = req.body;
  console.log(chalk.cyan(`[NEWSLETTER] Nhận email đăng ký từ Frontend: ${email}`));
  
  if (!email) {
    return res.status(400).json({ success: false, message: "Email không được để trống!" });
  }
  
  res.status(200).json({ 
    success: true, 
    message: "Đăng ký thành công! Email đã được ghi nhận trên backend." 
  });
});

// Hàm tự động seed danh mục mặc định nếu trống
async function seedDefaultCategories() {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      const defaultCategories = [
        { name: "Điện thoại" },
        { name: "Laptop" },
        { name: "Đồng hồ" },
        { name: "Âm thanh" },
        { name: "Bàn phím" }
      ];
      await Category.insertMany(defaultCategories);
      console.log(chalk.green.bold("✔ [SEED] Đã tự động chèn các danh mục mặc định vào database!"));
    } else {
      console.log(chalk.blue("ℹ [SEED] Danh mục đã tồn tại trong database, không cần seed."));
    }
  } catch (error) {
    console.error(chalk.red("✖ Lỗi tự động seed danh mục:"), error);
  }
}

// 7. Khởi chạy Server (Kết nối MongoDB trước khi chạy)
connectDB().then(async () => {
  await seedDefaultCategories();

  app.listen(PORT, () => {
    console.log(
      chalk.green.bold(`✔ [SERVER] Server đang chạy tại http://localhost:${PORT}`)
    );
    console.log(
      chalk.blue.bold(`ℹ [DATABASE] Máy chủ Database: ${mongoose.connection.host}`)
    );
    console.log(
      chalk.blue.bold(`ℹ [DATABASE] Tên Database đang sử dụng: ${mongoose.connection.name}`)
    );
    console.log(
      chalk.blue(`ℹ [DATABASE] Trạng thái kết nối Mongoose: ${mongoose.connection.readyState} (Đã sẵn sàng)`)
    );

    // Báo cáo cấu hình Cloudinary
    const cloudinary = require("cloudinary").v2;
    const cloudConfig = cloudinary.config();
    if (cloudConfig.cloud_name) {
      console.log(
        chalk.magenta.bold(`✔ [CLOUDINARY] Đã kết nối với Cloud Name: ${cloudConfig.cloud_name}`)
      );
      console.log(
        chalk.magenta(`ℹ [CLOUDINARY] Trạng thái API Key: ${cloudConfig.api_key ? "Đã bật (Active)" : "N/A"}`)
      );
    } else {
      console.log(
        chalk.yellow.bold(`⚠ [CLOUDINARY] Chưa được cấu hình hoặc thiếu các biến môi trường!`)
      );
    }
  });
});