require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const chalk = require("chalk");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const Product = require("./models/Product");
const { products: mockProducts } = require("./data/mockdata");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const contactRoutes = require("./routes/contactRoutes");
const searchRoutes = require("./routes/searchRoutes");

// Import Controllers (for inline routes)
const { getCategories, getHeroImages } = require("./controllers/productController");
const { getMyOrders } = require("./controllers/orderController");

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Cấu hình CORS (Cho phép frontend kết nối không bị chặn)
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:5000"],
  credentials: true
}));

// 2. Cấu hình đọc dữ liệu JSON & URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

// 5. Route kiểm tra health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// 6. Route kiểm tra kết nối database
app.get("/test-db", async (req, res) => {
  try {
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

// ==========================================
// MOUNT API ROUTES
// ==========================================
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/search", searchRoutes);

// Inline routes (giữ nguyên vị trí như server.ts gốc)
app.get("/api/categories", getCategories);
app.get("/api/hero-images", getHeroImages);
app.get("/api/my-orders", getMyOrders);

// ==========================================
// KHỞI CHẠY SERVER
// ==========================================
connectDB().then(async (conn) => {
  if (conn) {
    // Seed database if empty
    try {
      const productCount = await Product.countDocuments();
      if (productCount === 0) {
        console.log(chalk.blue("Seeding database with mock products..."));
        const productsToInsert = mockProducts.map(p => ({
          _id: p.id,
          name: p.name,
          price: p.price,
          image: p.image,
          category: p.category,
          description: p.description,
          specs: p.specs
        }));
        await Product.insertMany(productsToInsert);
        console.log(chalk.green.bold(`✔ [SEED] Đã tự động chèn ${productsToInsert.length} sản phẩm vào database!`));
      } else {
        console.log(chalk.blue(`ℹ [SEED] Đã có ${productCount} sản phẩm trong database, không cần seed.`));
      }
    } catch (seedErr) {
      console.error(chalk.red("✖ Lỗi tự động seed sản phẩm:"), seedErr);
    }
  } else {
    console.log(chalk.red.bold("⚠ [DATABASE] Không có kết nối Database, bỏ qua seed."));
  }

  app.listen(PORT, () => {
    console.log(
      chalk.green.bold(`✔ [SERVER] Server đang chạy tại http://localhost:${PORT}`)
    );
    if (conn) {
      console.log(
        chalk.blue.bold(`ℹ [DATABASE] Máy chủ Database: ${mongoose.connection.host}`)
      );
      console.log(
        chalk.blue.bold(`ℹ [DATABASE] Tên Database đang sử dụng: ${mongoose.connection.name}`)
      );
    } else {
      console.log(
        chalk.red.bold(`⚠ [DATABASE] Kết nối Database thất bại hoặc chưa sẵn sàng!`)
      );
    }
    console.log(
      chalk.blue(`ℹ [DATABASE] Trạng thái kết nối Mongoose: ${mongoose.connection.readyState}`)
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
