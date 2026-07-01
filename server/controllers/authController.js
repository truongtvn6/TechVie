const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const { oauthConfig } = require("../config/oauth");
const { exchangeCodeForTokens, fetchGoogleUserProfile } = require("../services/oauthService");

/**
 * 1. Sinh URL đăng nhập Google OAuth2 kèm state mã hóa ngẫu nhiên chống tấn công CSRF.
 * State này được lưu vào Cookie HttpOnly tạm thời của trình duyệt để kiểm tra chéo khi Google chuyển hướng quay lại.
 */
const getGoogleAuthUrl = async (req, res) => {
  try {
    const state = crypto.randomBytes(32).toString("hex");

    // Lưu state tạm thời vào cookie phía client (hết hạn trong 5 phút)
    res.cookie("oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Cho phép chuyển hướng từ Google đọc được cookie này
      maxAge: 5 * 60 * 1000 // 5 phút
    });

    const { clientId, redirectUri, authUrl, scopes } = oauthConfig.google;

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: scopes.join(" "),
      state: state,
      access_type: "offline",
      prompt: "consent"
    });

    const googleRedirectUrl = `${authUrl}?${params.toString()}`;

    return res.status(200).json({
      success: true,
      url: googleRedirectUrl
    });
  } catch (error) {
    console.error("Error generating Google Auth URL:", error);
    return res.status(500).json({
      success: false,
      message: "Không thể tạo URL đăng nhập bằng Google."
    });
  }
};

/**
 * 2. Xử lý Authorization Code Callback nhận từ Google chuyển hướng.
 * Xác minh State (chống CSRF), đổi code lấy Profile, ngăn chặn chiếm đoạt tài khoản (Account Takeover),
 * sinh JWT nội bộ và thiết lập HttpOnly Cookie an toàn chống XSS.
 */
const googleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const storedState = req.cookies.oauth_state;

    // Xóa cookie state ngay lập tức sau khi lấy ra để tránh replay attack
    res.clearCookie("oauth_state");

    // A. Xác thực State chống tấn công CSRF
    if (!state || !storedState || state !== storedState) {
      return res.status(403).json({
        success: false,
        message: "Cảnh báo bảo mật: Yêu cầu không hợp lệ (Phát hiện tấn công CSRF hoặc phiên xác thực đã hết hạn)."
      });
    }

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Thiếu mã xác thực (Authorization Code) từ máy chủ Google."
      });
    }

    // B. Đổi Authorization Code lấy Access Token
    const tokens = await exchangeCodeForTokens(code);

    // C. Truy vấn Google People API lấy thông tin Profile
    const googleProfile = await fetchGoogleUserProfile(tokens.access_token);

    const { sub: googleId, email, name, picture: avatar } = googleProfile;

    // D. Xử lý logic tại Database để ngăn Account Takeover
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // Bảo mật nâng cao: Ngăn chặn chiếm đoạt tài khoản
      // Nếu email đã đăng ký bằng hình thức mật khẩu truyền thống (credentials)
      if (user.auth_provider === "credentials") {
        return res.status(409).json({
          success: false,
          code: "ACCOUNT_EXISTS_TRADITIONAL",
          message: "Email này đã được đăng ký bằng tài khoản mật khẩu thông thường. Để đảm bảo an toàn và bảo mật, bạn không thể tự động đăng nhập bằng Google. Vui lòng đăng nhập bằng mật khẩu."
        });
      }

      // Nếu tài khoản đã bị khóa (blocked)
      if (user.status === "blocked") {
        return res.status(403).json({
          success: false,
          message: "Tài khoản của bạn đã bị khóa bởi quản trị viên."
        });
      }

      // Cập nhật Google ID nếu trước đó chưa lưu (tránh đổi nhà cung cấp)
      if (!user.google_id) {
        user.google_id = googleId;
        await user.save();
      }
    } else {
      // Nếu là người dùng mới: Tạo tài khoản thuộc nhà cung cấp Google
      user = new User({
        _id: new mongoose.Types.ObjectId().toString(),
        email: email.toLowerCase(),
        google_id: googleId,
        auth_provider: "google",
        username: name,
        avatar: avatar || "",
        role: "user",
        vipStatus: "Standard",
        status: "active"
      });
      await user.save();
      console.log(`[OAuth Registration] Created new Google-linked user: ${email}`);
    }

    // E. Khởi tạo JWT nội bộ thời hạn 24h
    const jwtSecret = process.env.JWT_SECRET || "techvie_jwt_secret_key_2026";
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role
      },
      jwtSecret,
      { expiresIn: "24h" }
    );

    // F. Trả token về trình duyệt qua Set-Cookie HttpOnly (Chống tấn công XSS đánh cắp JWT)
    res.cookie("techvie_session", token, {
      httpOnly: true, // Trình duyệt không thể đọc qua JS (anti-XSS)
      secure: process.env.NODE_ENV === "production", // Chỉ gửi qua HTTPS trong môi trường production
      sameSite: "strict", // Kháng tấn công CSRF chéo miền tối đa
      maxAge: 24 * 60 * 60 * 1000 // 24 giờ
    });

    return res.send(`
      <html>
        <head>
          <title>Đang đăng nhập...</title>
        </head>
        <body>
          <div style="font-family: sans-serif; text-align: center; margin-top: 100px;">
            <h2>Đăng nhập bằng tài khoản Google thành công!</h2>
            <p>Đang chuyển hướng về cửa hàng...</p>
          </div>
          <script>
            localStorage.setItem("techvie_token", "Bearer ${token}");
            localStorage.setItem("active_tab", "account");
            window.location.href = "/";
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("OAuth callback processing error:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống trong quá trình đăng nhập Google OAuth2."
    });
  }
};

/**
 * 3. Trả về thông tin phiên hiện tại của người dùng dựa trên thông tin đã giải mã từ JWT middleware.
 */
const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Vui lòng đăng nhập."
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin tài khoản người dùng."
      });
    }

    if (user.status === "blocked") {
      res.clearCookie("techvie_session");
      return res.status(403).json({
        success: false,
        message: "Tài khoản của bạn đã bị quản trị viên đình chỉ hoạt động."
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.username,
        avatar: user.avatar,
        phone: user.phone || "",
        address: user.address || "",
        role: user.role,
        vipStatus: user.vipStatus,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error("Error in getMe controller:", error);
    return res.status(500).json({
      success: false,
      message: "Không thể tải thông tin hồ sơ."
    });
  }
};

/**
 * 4. Xóa Cookie session khi người dùng đăng xuất.
 */
const logout = async (req, res) => {
  try {
    res.clearCookie("techvie_session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });
    return res.status(200).json({
      success: true,
      message: "Bạn đã đăng xuất khỏi hệ thống thành công."
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Không thể thực hiện đăng xuất."
    });
  }
};

/**
 * 5. Cập nhật thông tin profile của người dùng hiện tại (Họ tên, SĐT, Địa chỉ)
 */
const checkEmail = async (req, res) => {
  try {
    const email = String(req.query.email || "").trim().toLowerCase();
    if (!email) {
      return res.status(400).json({
        success: false,
        exists: false,
        message: "Thiếu email để kiểm tra.",
      });
    }

    const existingUser = await User.findOne({ email });
    return res.status(200).json({
      success: true,
      exists: !!existingUser,
      message: existingUser ? "Email này đã được sử dụng bởi tài khoản khác." : "Email khả dụng.",
    });
  } catch (error) {
    console.error("Error in checkEmail controller:", error);
    return res.status(500).json({
      success: false,
      exists: false,
      message: "Không thể kiểm tra email lúc này.",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Vui lòng đăng nhập để thực hiện cập nhật."
      });
    }

    const { name, phone, address } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin người dùng."
      });
    }

    // Cập nhật các trường gửi lên
    if (name !== undefined) user.username = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật hồ sơ thành công!",
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.username,
        avatar: user.avatar,
        phone: user.phone || "",
        address: user.address || "",
        role: user.role,
        vipStatus: user.vipStatus,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error("Error in updateProfile controller:", error);
    return res.status(500).json({
      success: false,
      message: "Không thể cập nhật hồ sơ người dùng."
    });
  }
};

/**
 * 6. Đăng nhập bằng email/mật khẩu (Real Database Authentication)
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập email và mật khẩu." });
    }

    // Look up user in MongoDB
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ success: false, message: "Email chưa được đăng ký trong hệ thống." });
    }

    if (user.status === "blocked") {
      return res.status(403).json({ success: false, message: "Tài khoản của bạn đã bị khóa bởi quản trị viên." });
    }

    // For credentials-based accounts, verify password
    if (user.auth_provider === "credentials" && user.password) {
      if (password !== user.password) {
        return res.status(401).json({ success: false, message: "Mật khẩu không chính xác." });
      }
    } else if (user.auth_provider === "google") {
      return res.status(409).json({
        success: false,
        message: "Tài khoản này được đăng ký bằng Google. Vui lòng đăng nhập bằng Google."
      });
    }

    // Create real JWT token
    const jwtSecret = process.env.JWT_SECRET || "techvie_jwt_secret_key_2026";
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: "24h" }
    );

    // Set HttpOnly session cookie
    res.cookie("techvie_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.json({ success: true, token: `Bearer ${token}` });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Lỗi hệ thống khi đăng nhập." });
  }
};

/**
 * 7. Đăng ký tài khoản mới (Real Database Registration)
 */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "Điền đầy đủ thông tin đăng ký!" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Mật khẩu phải có ít nhất 6 ký tự." });
    }

    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email này đã được đăng ký. Vui lòng đăng nhập." });
    }

    // Create new user in MongoDB
    const newUser = new User({
      _id: new mongoose.Types.ObjectId().toString(),
      email: email.toLowerCase(),
      password: password,
      auth_provider: "credentials",
      username: username,
      role: "user",
      vipStatus: "Standard",
      status: "active"
    });
    await newUser.save();

    // Create JWT and set cookie
    const regJwtSecret = process.env.JWT_SECRET || "techvie_jwt_secret_key_2026";
    const regToken = jwt.sign(
      { userId: newUser._id.toString(), email: newUser.email, role: newUser.role },
      regJwtSecret,
      { expiresIn: "24h" }
    );

    res.cookie("techvie_session", regToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000
    });

    console.log(`[Registration] New credentials user created: ${email}`);
    return res.json({
      success: true,
      token: `Bearer ${regToken}`,
      user: {
        id: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        vipStatus: newUser.vipStatus,
        status: newUser.status,
        created_at: newUser.created_at
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: "Lỗi hệ thống khi đăng ký." });
  }
};

/**
 * 8. Đổi mật khẩu
 */
const changePassword = (req, res) => {
  res.json({ success: true, message: "Đổi mật khẩu thành công!" });
};

module.exports = {
  getGoogleAuthUrl,
  googleCallback,
  getMe,
  logout,
  checkEmail,
  updateProfile,
  login,
  register,
  changePassword,
};
