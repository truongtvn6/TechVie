const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authController = {
  // 1. Đăng ký tài khoản
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Validate thông tin
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập đầy đủ các trường thông tin: username, email, password!",
        });
      }

      // Kiểm tra email trùng lặp
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email này đã được sử dụng bởi tài khoản khác!",
        });
      }

      // Mã hóa mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Lưu người dùng mới vào database
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      return res.status(201).json({
        success: true,
        message: "Đăng ký tài khoản thành công!",
        user: newUser,
      });
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      return res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra trong quá trình đăng ký!",
        error: error.message,
      });
    }
  },

  // 2. Đăng nhập tài khoản
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate thông tin
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập đầy đủ email và password!",
        });
      }

      // Kiểm tra người dùng tồn tại
      // Kiểm tra người dùng tồn tại bằng UserModel gốc để lấy cả user đã xóa
      const user = await User.findByEmail(email); // Vẫn dùng phương thức cũ nếu nó trả về null do bị khóa, nhưng ta cần sửa lại xíu
      // Actually, to get deleted users, we should use UserModel directly or pass includeDeleted.
      // But wait, the easiest way without importing UserModel again is:
      const UserModel = require("../models/User").model ? require("../models/User").model("User") : require("mongoose").model("User");
      const fullUser = await UserModel.findOne({ email });
      if (!fullUser) {
        return res.status(401).json({
          success: false,
          message: "Email hoặc mật khẩu không chính xác!",
        });
      }

      if (fullUser.isDeleted || fullUser.status === 'blocked') {
        return res.status(403).json({
          success: false,
          message: "Tài khoản của bạn đã bị vô hiệu hóa hoặc khóa!",
        });
      }

      // So sánh mật khẩu
      const isMatch = await bcrypt.compare(password, fullUser.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Email hoặc mật khẩu không chính xác!",
        });
      }

      // Tạo mã JWT Token
      const token = jwt.sign(
        { 
          id: fullUser._id.toString(), 
          email: fullUser.email, 
          role: fullUser.email === "admin@techvie.com" ? "admin" : "user" 
        },
        process.env.JWT_SECRET || "techvie_jwt_secret_key_2026",
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        success: true,
        message: "Đăng nhập thành công!",
        token: `Bearer ${token}`,
        user: {
          id: fullUser._id.toString(),
          username: fullUser.username,
          email: fullUser.email,
          created_at: fullUser.created_at,
          role: fullUser.email === "admin@techvie.com" ? "admin" : "user",
        },
      });
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      return res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra trong quá trình đăng nhập!",
        error: error.message,
      });
    }
  },

  // 3. Lấy thông tin cá nhân (Protected Route)
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng!",
        });
      }

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.error("Lỗi lấy thông tin cá nhân:", error);
      return res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra!",
        error: error.message,
      });
    }
  }
};

module.exports = authController;
