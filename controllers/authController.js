const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const authController = {
  // 1. Đăng ký tài khoản
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập đầy đủ các trường thông tin: username, email, password!",
        });
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email này đã được sử dụng bởi tài khoản khác!",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

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

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập đầy đủ email và password!",
        });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Email hoặc mật khẩu không chính xác!",
        });
      }

      // Kiểm tra tài khoản có bị khóa không
      if (user.status === "blocked") {
        return res.status(403).json({
          success: false,
          message: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên!",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Email hoặc mật khẩu không chính xác!",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.email === "admin@techvie.com" ? "admin" : "user",
        },
        process.env.JWT_SECRET || "techvie_jwt_secret_key_2026",
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        success: true,
        message: "Đăng nhập thành công!",
        token: `Bearer ${token}`,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.created_at,
          role: user.email === "admin@techvie.com" ? "admin" : "user",
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
  },

  // 4. Quên mật khẩu — Gửi email chứa link đặt lại mật khẩu
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập địa chỉ email!",
        });
      }

      // Tìm tài khoản theo email
      const user = await User.findByEmail(email);
      if (!user) {
        // Trả về thông báo chung để tránh lộ thông tin tài khoản
        return res.status(200).json({
          success: true,
          message:
            "Nếu email tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra hộp thư!",
        });
      }

      // Tạo token ngẫu nhiên (32 bytes hex = 64 ký tự)
      const resetToken = crypto.randomBytes(32).toString("hex");

      // Lưu token đã hash vào DB (không lưu token gốc để tránh rủi ro bảo mật)
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      const expireTime = new Date(Date.now() + 15 * 60 * 1000); // Hết hạn sau 15 phút

      await User.updateById(user.id, {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: expireTime,
      });

      // Tạo link reset password gửi cho người dùng
      // Token gốc (chưa hash) được đặt trong URL để người dùng gửi lại
      const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

      // Nội dung email HTML
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #1a1a2e; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #e94560; margin: 0;">TechVie</h1>
            <p style="color: #aaa; margin: 5px 0 0;">Cửa hàng công nghệ hàng đầu</p>
          </div>
          <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
            <h2 style="color: #1a1a2e;">Xin chào, ${user.username}!</h2>
            <p style="color: #555; line-height: 1.6;">
              Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại <strong>TechVie</strong>.
            </p>
            <p style="color: #555; line-height: 1.6;">
              Nhấn vào nút bên dưới để đặt lại mật khẩu. Link này chỉ có hiệu lực trong <strong>15 phút</strong>.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}"
                style="background-color: #e94560; color: white; padding: 14px 32px; text-decoration: none;
                       border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">
                Đặt lại mật khẩu
              </a>
            </div>
            <p style="color: #888; font-size: 13px; line-height: 1.6;">
              Nếu nút trên không hoạt động, hãy sao chép và dán đường dẫn sau vào trình duyệt:<br/>
              <a href="${resetUrl}" style="color: #e94560; word-break: break-all;">${resetUrl}</a>
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #aaa; font-size: 12px;">
              Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này. Tài khoản của bạn vẫn an toàn.
            </p>
          </div>
        </div>
      `;

      // Gửi email
      await sendEmail({
        to: user.email,
        subject: "[TechVie] Yêu cầu đặt lại mật khẩu",
        html: emailHtml,
      });

      return res.status(200).json({
        success: true,
        message:
          "Nếu email tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra hộp thư!",
      });
    } catch (error) {
      console.error("Lỗi quên mật khẩu:", error);

      // Nếu gửi email thất bại, xóa token đã lưu để tránh token "treo"
      try {
        const user = await User.findByEmail(req.body.email);
        if (user) {
          await User.updateById(user.id, {
            resetPasswordToken: null,
            resetPasswordExpire: null,
          });
        }
      } catch (_) {}

      return res.status(500).json({
        success: false,
        message: "Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau!",
        error: error.message,
      });
    }
  },

  // 5. Đặt lại mật khẩu — Xác thực token và cập nhật mật khẩu mới vào DB
  resetPassword: async (req, res) => {
    try {
      const { token } = req.params;       // Token gốc từ URL
      const { newPassword } = req.body;   // Mật khẩu mới người dùng nhập

      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Token đặt lại mật khẩu không hợp lệ!",
        });
      }

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Mật khẩu mới phải có ít nhất 6 ký tự!",
        });
      }

      // Hash token nhận từ URL để so sánh với token đã lưu trong DB
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      // Tìm người dùng có token hợp lệ và chưa hết hạn
      const user = await User.findByResetToken(hashedToken);

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn (15 phút)!",
        });
      }

      // Mã hóa mật khẩu mới
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Cập nhật mật khẩu mới và xóa token trong DB
      await User.updateById(user.id, {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpire: null,
      });

      return res.status(200).json({
        success: true,
        message:
          "Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.",
      });
    } catch (error) {
      console.error("Lỗi đặt lại mật khẩu:", error);
      return res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra khi đặt lại mật khẩu!",
        error: error.message,
      });
    }
  },
};

module.exports = authController;
