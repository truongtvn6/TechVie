import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse request bodies
  app.use(express.json());

  // Keep a simple in-memory database of received orders for demonstration
  const orders: any[] = [];

  // API Route: Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
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

  // API Route: Retrieve all registered orders (optional/admin)
  app.get("/api/orders", (req, res) => {
    res.json({ success: true, count: orders.length, orders });
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
    console.log(`[LUMINA EXPRESS SERVER] online at http://localhost:${PORT}`);
  });
}

startServer();
