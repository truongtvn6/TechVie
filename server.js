require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const chalk = require("chalk");
const mongoose = require("mongoose");
const connectDB = require("./config/db"); // Trỏ đúng đến file db.js trong thư mục config
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");

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

// --- DỮ LIỆU MOCK VÀ API CHO HOMEPAGE ---

const mockProducts = [
  {
    id: "lumina-phone-1",
    name: "Điện Thoại Lumina Ultra v1 (Backend)",
    price: 28990000,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
    category: "Điện thoại",
    description: "Chiếc flagship siêu phẩm tích hợp màn hình Dynamic OLED dải màu vô hạn kết hợp Camera cảm biến ống kính Lumina Pro. Khung vỏ bằng chất liệu Titanium nguyên khối cho trọng lượng siêu nhẹ và chuẩn bền bỉ vượt trội.",
    specs: [
      { label: "Màn hình", value: "6.7\" Dynamic OLED 120Hz" },
      { label: "Vi xử lý", value: "Lumina Core Pro Alpha" },
      { label: "Dung lượng Pin", value: "5000 mAh (Sạc siêu tốc)" },
      { label: "Hệ thống Camera", value: "50MP Tri-Lens v2" }
    ]
  },
  {
    id: "lumina-book-pro",
    name: "Laptop Lumina Book Pro X (Backend)",
    price: 42500000,
    image: "/src/assets/images/regenerated_image_1781784768195.jpg",
    category: "Laptop",
    description: "Trạm làm việc di động tối thượng dành cho các nhà sáng tạo nội dung và kỹ sư lập trình. Thiết kế siêu mỏng nhẹ từ hợp kim nhôm tái chế cao cấp, âm thanh phòng thu 6 loa vòm và bàn phím hành trình sâu êm ái.",
    specs: [
      { label: "Bộ xử lý", value: "Lumina Silicon M1 Ultra" },
      { label: "Bộ nhớ RAM", value: "32GB Unified RAM" },
      { label: "Lưu trữ SSD", value: "1TB NVMe Gen 4" },
      { label: "Thời lượng Pin", value: "Lên tới 20 giờ liên tục" }
    ]
  },
  {
    id: "lumina-watch-ultra",
    name: "Đồng Hồ Lumina Watch Ultra (Backend)",
    price: 19500000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    category: "Đồng hồ",
    description: "Người đồng hành thầm lặng cho mọi cuộc phiêu lưu khắc nghiệt và bảo trợ sức khỏe toàn thời gian. Khung vỏ Titanium chống ăn mòn cấp độ vũ trụ, hệ thống định vị GPS băng kép độc lập và kính Sapphire chống xước tuyệt đối.",
    specs: [
      { label: "Kích thước mặt", value: "49mm Titanium Gasket" },
      { label: "Định vị toàn cầu", value: "GPS Băng tần kép L1+L5" },
      { label: "Chống nước", value: "WR100 (Sâu tới 100m)" },
      { label: "Cảm biến sức khỏe", value: "Nhịp tim, ECG & SpO2 cấp phòng khám" }
    ]
  }
];

// Route 1: Lấy danh sách sản phẩm mẫu cho Homepage
app.get("/api/products", (req, res) => {
  res.status(200).json(mockProducts);
});

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

// 7. Khởi chạy Server (Kết nối MongoDB trước khi chạy)
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      chalk.green.bold(`✔ [SERVER] Server đang chạy tại http://localhost:${PORT}`)
    );
    console.log(chalk.blue(`ℹ [DATABASE] Đang duy trì kết nối tới Database...`));
  });
});