const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Product = require("./models/Product");
const Category = require("./models/Category");
require("./models/User");

const UserModel = mongoose.model("User");

const categories = [
  "Điện thoại",
  "Laptop",
  "Đồng hồ",
  "Âm thanh",
  "Bàn phím",
];

const products = [
  {
    _id: "techvie-phone-1",
    name: "Điện Thoại TechVie Ultra v1",
    price: 28990000,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
    category: "Điện thoại",
    description: "Flagship TechVie với màn hình Dynamic OLED 120Hz, khung titanium và cụm camera Tri-Lens.",
    specs: [
      { label: "Màn hình", value: "6.7 inch Dynamic OLED 120Hz" },
      { label: "Vi xử lý", value: "TechVie Core Pro Alpha" },
      { label: "Pin", value: "5000 mAh, sạc nhanh" },
      { label: "Camera", value: "50MP Tri-Lens v2" },
    ],
  },
  {
    _id: "techvie-book-pro",
    name: "Laptop TechVie Book Pro X",
    price: 42500000,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80",
    category: "Laptop",
    description: "Trạm làm việc di động cho sáng tạo nội dung, lập trình và xử lý tác vụ hiệu năng cao.",
    specs: [
      { label: "CPU", value: "TechVie Silicon M1 Ultra" },
      { label: "RAM", value: "32GB Unified RAM" },
      { label: "SSD", value: "1TB NVMe Gen 4" },
      { label: "Pin", value: "Lên tới 20 giờ" },
    ],
  },
  {
    _id: "techvie-watch-ultra",
    name: "Đồng Hồ TechVie Watch Ultra",
    price: 19500000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    category: "Đồng hồ",
    description: "Đồng hồ thông minh khung titanium, định vị GPS băng kép và bộ cảm biến sức khỏe toàn thời gian.",
    specs: [
      { label: "Kích thước", value: "49mm Titanium" },
      { label: "Định vị", value: "GPS L1 + L5" },
      { label: "Chống nước", value: "WR100" },
      { label: "Cảm biến", value: "Nhịp tim, ECG, SpO2" },
    ],
  },
  {
    _id: "techvie-buds-2",
    name: "Tai Nghe Sound Buds Pro v2",
    price: 6800000,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
    category: "Âm thanh",
    description: "Tai nghe chống ồn chủ động ANC, âm thanh không gian và hộp sạc không dây.",
    specs: [
      { label: "ANC", value: "48dB Adaptive" },
      { label: "Driver", value: "Dynamic Driver 11mm Dual" },
      { label: "Pin", value: "36 giờ với hộp sạc" },
      { label: "Độ trễ", value: "20ms Gaming Mode" },
    ],
  },
  {
    _id: "techvie-keyboard-zen",
    name: "Bàn Phím Cơ TechVie ZenBoard v2",
    price: 4900000,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    category: "Bàn phím",
    description: "Bàn phím cơ gasket mount, khung CNC aluminum, switch lube sẵn và hỗ trợ hot-swap.",
    specs: [
      { label: "Layout", value: "75% Gasket Mount" },
      { label: "Kết nối", value: "Type-C, Bluetooth, 2.4GHz" },
      { label: "Keycaps", value: "Double-shot PBT" },
      { label: "Tính năng", value: "Hot-swap 5-pin, QMK/VIA" },
    ],
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/database_for_tmdt_01";
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });

  for (const name of categories) {
    await Category.updateOne({ name }, { $setOnInsert: { name } }, { upsert: true });
  }

  await Product.bulkWrite(
    products.map((product) => ({
      updateOne: {
        filter: { _id: product._id },
        update: { $set: product },
        upsert: true,
      },
    }))
  );

  const adminEmail = "admin@techvie.com";
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await UserModel.updateOne(
    { email: adminEmail },
    {
      $set: {
        username: "Administrator",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        vipStatus: "Premium",
        status: "active",
      },
    },
    { upsert: true }
  );

  const counts = {
    products: await Product.countDocuments(),
    categories: await Category.countDocuments(),
    users: await UserModel.countDocuments(),
  };

  console.log("Seed dữ liệu test thanh toán hoàn tất:", counts);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error("Seed dữ liệu test thất bại:", error);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
