import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import Product from "./src/models/Product";
import { upload, uploadToCloudinary } from "./src/config/cloudinary";
import { products as mockProducts } from "./src/data_mockdata";
import authRoutes from "./src/routes/authRoutes";

// Use public DNS to resolve MongoDB Atlas SRV records correctly
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 5000;

  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ MongoDB connected");

    // Seed database if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log("Seeding database with mock products...");
      const productsToInsert = mockProducts.map(p => ({
        _id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        category: p.category,
        description: p.description,
        specs: p.specs
      }));
      await Product.insertMany(productsToInsert as any[]);
      console.log(`Successfully seeded ${productsToInsert.length} products!`);
    }
  } catch (err) {
    console.error("❌ MongoDB error", err);
    process.exit(1);
  }

  // Middleware to parse request bodies
  app.use(express.json());
  app.use(cookieParser());

  // Mount Auth routes
  app.use("/api/auth", authRoutes);

  // Mock User Database in memory (synced to Admin Page)
  const systemUsers = [
    {
      id: "usr-admin",
      username: "admin",
      email: "admin@techvie.com",
      phone: "0912 345 678",
      role: "admin",
      vipStatus: true,
      status: "active",
      created_at: new Date(Date.now() - 3600000 * 240).toISOString()
    },
    {
      id: "usr-user",
      username: "Nguyễn Minh Tiến",
      email: "mintzinfinity898@gmail.com",
      phone: "0987 654 321",
      role: "user",
      vipStatus: false,
      status: "active",
      created_at: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  ];

  // Keep a simple in-memory database of received orders for demonstration
  const orders: any[] = [];

  // API Route: Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  // ==========================================
  // PRODUCT API ROUTES
  // ==========================================

  // Get products (with optional search filter)
  app.get("/api/products", async (req, res) => {
    try {
      const search = req.query.search as string;
      let query: any = {};
      if (search) {
        query = { name: { $regex: search, $options: "i" } };
      }
      const productsList = await Product.find(query).sort({ created_at: -1 });
      const formattedProducts = productsList.map(p => {
        const obj = p.toObject() as any;
        return {
          ...obj,
          id: obj._id ? obj._id.toString() : obj.id,
        };
      });
      res.json({ success: true, products: formattedProducts });
    } catch (err: any) {
      console.error("Error fetching products:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // Create product (Admin)
  app.post("/api/products", upload.single("imageFile"), async (req, res) => {
    try {
      const { name, price, category, description, specs } = req.body;
      let imageUrl = "";

      if (req.file) {
        const uploadResult = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "techvie_products" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          uploadStream.end(req.file!.buffer);
        });
        imageUrl = uploadResult.secure_url;
      } else {
        imageUrl = req.body.image || "";
      }

      let parsedSpecs = [];
      if (specs) {
        parsedSpecs = typeof specs === "string" ? JSON.parse(specs) : specs;
      }

      const newProduct = new Product({
        _id: new mongoose.Types.ObjectId().toString(),
        name,
        price: Number(price),
        category,
        description,
        image: imageUrl,
        specs: parsedSpecs
      });

      await newProduct.save();

      const responseProduct = newProduct.toObject() as any;
      responseProduct.id = responseProduct._id.toString();

      res.status(201).json({
        success: true,
        message: "Sản phẩm đã được lưu trữ thành công!",
        product: responseProduct
      });
    } catch (error: any) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Update product (Admin)
  app.put("/api/products/:id", upload.single("imageFile"), async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price, category, description, specs } = req.body;
      
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm." });
      }

      if (name) product.name = name;
      if (price) product.price = Number(price);
      if (category) product.category = category;
      if (description !== undefined) product.description = description;
      if (specs) {
        product.specs = typeof specs === "string" ? JSON.parse(specs) : specs;
      }

      if (req.file) {
        const uploadResult = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "techvie_products" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          uploadStream.end(req.file!.buffer);
        });
        product.image = uploadResult.secure_url;
      } else if (req.body.image) {
        product.image = req.body.image;
      }

      await product.save();

      const responseProduct = product.toObject() as any;
      responseProduct.id = responseProduct._id.toString();

      res.json({
        success: true,
        message: "Cập nhật sản phẩm thành công!",
        product: responseProduct
      });
    } catch (error: any) {
      console.error("Lỗi khi sửa sản phẩm:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Delete product (Admin)
  app.delete("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Product.findByIdAndDelete(id);
      if (deleted) {
        return res.json({ success: true, message: "Xoá sản phẩm thành công!" });
      }
      res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm." });
    } catch (error: any) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // ==========================================
  // AUTHENTICATION & USER MANAGEMENT API
  // ==========================================

  // Auth: Login
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (email === "admin@techvie.com" && password === "admin123") {
      return res.json({ success: true, token: "Bearer mock_admin_token" });
    } else if (email === "mintzinfinity898@gmail.com" && password === "123456") {
      return res.json({ success: true, token: "Bearer mock_user_token" });
    }
    // Find in systemUsers
    const user = systemUsers.find(u => u.email === email);
    if (user) {
      return res.json({ success: true, token: `Bearer mock_token_${user.id}` });
    }
    res.status(401).json({ success: false, message: "Sai thông tin đăng nhập!" });
  });

  // Auth: Register
  app.post("/api/auth/register", (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "Điền đầy đủ thông tin đăng ký!" });
    }
    const newUser = {
      id: `usr-${Math.random().toString(36).substr(2, 9)}`,
      username,
      email,
      phone: "0900 000 000",
      role: "user",
      vipStatus: false,
      status: "active",
      created_at: new Date().toISOString()
    };
    systemUsers.push(newUser);
    res.json({ success: true, user: newUser });
  });

  // Auth: Change Password
  app.post("/api/auth/change-password", (req, res) => {
    res.json({ success: true, message: "Đổi mật khẩu thành công!" });
  });

  // Admin: Get Users
  app.get("/api/users", (req, res) => {
    res.json({ success: true, users: systemUsers });
  });

  // Admin: Create User
  app.post("/api/users", (req, res) => {
    const { username, email, phone, role, vipStatus } = req.body;
    const newUser = {
      id: `usr-${Math.random().toString(36).substr(2, 9)}`,
      username: username || "New User",
      email: email || "user@example.com",
      phone: phone || "0900 000 000",
      role: role || "user",
      vipStatus: !!vipStatus,
      status: "active",
      created_at: new Date().toISOString()
    };
    systemUsers.push(newUser);
    res.json({ success: true, message: "Tạo tài khoản thành công!", user: newUser });
  });

  // Admin: Toggle Role
  app.put("/api/users/:id/role", (req, res) => {
    const { id } = req.params;
    const user = systemUsers.find(u => u.id === id);
    if (user) {
      user.role = user.role === "admin" ? "user" : "admin";
      return res.json({ success: true, message: "Đổi vai trò thành công!", user });
    }
    res.status(404).json({ success: false, message: "Không tìm thấy user." });
  });

  // Admin: Toggle VIP
  app.put("/api/users/:id/vip", (req, res) => {
    const { id } = req.params;
    const user = systemUsers.find(u => u.id === id);
    if (user) {
      user.vipStatus = !user.vipStatus;
      return res.json({ success: true, message: "Đổi trạng thái VIP thành công!", user });
    }
    res.status(404).json({ success: false, message: "Không tìm thấy user." });
  });

  // Admin: Toggle Status
  app.put("/api/users/:id/status", (req, res) => {
    const { id } = req.params;
    const user = systemUsers.find(u => u.id === id);
    if (user) {
      user.status = user.status === "active" ? "blocked" : "active";
      return res.json({ success: true, message: "Đổi trạng thái hoạt động thành công!", user });
    }
    res.status(404).json({ success: false, message: "Không tìm thấy user." });
  });

  // Admin: Delete User
  app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const idx = systemUsers.findIndex(u => u.id === id);
    if (idx !== -1) {
      systemUsers.splice(idx, 1);
      return res.json({ success: true, message: "Xoá tài khoản thành công!" });
    }
    res.status(404).json({ success: false, message: "Không tìm thấy user." });
  });

  // ==========================================
  // SEARCH HISTORY & POPULAR API
  // ==========================================
  app.get("/api/search/popular", (req, res) => {
    res.json({
      success: true,
      popular: ["TechVie Ultra v1", "ZenBoard v2", "Sound Buds Pro", "Laptop Book Pro X"]
    });
  });

  app.get("/api/search/history", (req, res) => {
    res.json({
      success: true,
      history: ["TechVie Book Pro X", "Tai nghe sound buds"]
    });
  });

  // API Route: Handle real checkout orders
  app.post("/api/checkout", (req, res) => {
    const { fullName, phone, email, address, notes, paymentMethod, deliveryMethod, cart, finalTotal } = req.body;

    if (!fullName || !phone || !email || !address) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc để tiến hành đặt hàng."
      });
    }

    if (!cart || cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Giỏ hàng rỗng."
      });
    }

    // Generate a unique order ID
    const orderId = Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      orderId,
      fullName,
      phone,
      email,
      address,
      notes,
      paymentMethod,
      deliveryMethod,
      cart,
      finalTotal,
      status: "Đang lắp ráp chuẩn bị gửi",
      statusType: "processing",
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);

    // Simulated confirmation containing real processed payload
    res.status(200).json({
      success: true,
      message: "Đặt hàng thành công và được ghi nhận tại máy chủ Express!",
      orderId,
      order: newOrder
    });
  });

  // Keep a simple in-memory database of customer contacts for demonstration
  const contacts: any[] = [
    {
      id: 1082,
      name: "Trần Anh Tú",
      email: "tuanhtu@gmail.com",
      subject: "Hợp tác phân phối sỉ",
      message: "Tôi có hệ thống cửa hàng điện máy cao cấp tại Đà Nẵng, muốn liên hệ làm đại lý chính thức để phân phối các dòng máy TechVie Book Pro X.",
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString() // 4 hours ago
    },
    {
      id: 1094,
      name: "Hoàng Vy",
      email: "vyhoang99@hotmail.com",
      subject: "Cấu hình custom khắc tên",
      message: "Có chương trình hỗ trợ in ấn khắc laser tên riêng hoặc logo doanh nghiệp lên mặt sau điện thoại Titanium TechVie Ultra v1 không?",
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString() // 1 hour ago
    }
  ];

  // API Route: Send user contact inquiries
  app.post("/api/contacts", (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Họ tên và email là bắt buộc." });
    }
    const newInquiry = {
      id: Math.floor(1000 + Math.random() * 9000),
      name,
      email,
      subject: subject || "Yêu cầu tư vấn thiết bị",
      message: message || "",
      createdAt: new Date().toISOString()
    };
    contacts.push(newInquiry);
    res.json({ success: true, message: "Gửi liên hệ thành công!", inquiry: newInquiry });
  });

  // API Route: Retrieve all registered contacts (admin)
  app.get("/api/contacts", (req, res) => {
    res.json({ success: true, count: contacts.length, contacts });
  });

  // API Route: Update an order status (admin)
  app.post("/api/orders/:id/status", (req, res) => {
    const { id } = req.params;
    const { status, statusType } = req.body;
    const order = orders.find(o => o.orderId === parseInt(id));
    if (order) {
      order.status = status;
      if (statusType) {
        order.statusType = statusType;
      }
      return res.json({ success: true, message: "Cập nhật trạng thái thành công!", order });
    }
    res.status(404).json({ success: false, message: "Không tìm thấy mã đơn hàng." });
  });

  // API Route: Delete all orders (admin helper)
  app.delete("/api/orders", (req, res) => {
    orders.length = 0;
    res.json({ success: true, message: "Đã xoá toàn bộ sổ đặt hàng trên máy chủ." });
  });

  // API Route: Feed premium home slider hero images
  app.get("/api/hero-images", (req, res) => {
    res.json([
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80'
    ]);
  });

  // API Route: Feed product categories
  app.get("/api/categories", (req, res) => {
    res.json({
      success: true,
      categories: ['Tất cả', 'Điện thoại', 'Laptop', 'Đồng hồ', 'Âm thanh', 'Bàn phím']
    });
  });

  // API Route: Retrieve all registered orders (optional/admin)
  app.get("/api/orders", (req, res) => {
    res.json({ success: true, count: orders.length, orders });
  });

  // API Route: Retrieve orders matching a specific email query parameter
  app.get("/api/my-orders", (req, res) => {
    const { email } = req.query;
    if (!email) {
      return res.json({ success: true, orders: [] });
    }
    const targetEmail = (email as string).toLowerCase();
    const filtered = orders.filter(o => o.email && o.email.toLowerCase() === targetEmail);
    
    // Map server orders format to frontend TabOrders format
    const mapped = filtered.map(o => ({
      id: `ORD-${o.orderId}`,
      date: new Date(o.createdAt).toLocaleDateString("vi-VN"),
      total: `${Number(o.finalTotal.replace(/[^0-9]/g, "")).toLocaleString("vi-VN")}₫`,
      items: o.cart.map((c: any) => ({
        name: c.product.name,
        type: c.product.category,
        qty: c.quantity
      })),
      status: o.status,
      statusType: o.statusType
    }));
    
    res.json({ success: true, orders: mapped });
  });

  // Vite middleware setup for Development or Static Fileserving in Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[TECHVIE EXPRESS SERVER] online at http://localhost:${PORT}`);
  });
}

startServer();
