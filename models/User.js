const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: "Chưa cung cấp",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  vipStatus: {
    type: String,
    enum: ["Normal", "Premium"],
    default: "Normal",
  },
  status: {
    type: String,
    enum: ["active", "blocked"],
    default: "active",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const UserModel = mongoose.model("User", userSchema);

const User = {
  // Tìm người dùng qua Email
  findByEmail: async (email) => {
    const doc = await UserModel.findOne({ email, isDeleted: { $ne: true } });
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      username: doc.username,
      email: doc.email,
      password: doc.password,
      phone: doc.phone,
      role: doc.role,
      vipStatus: doc.vipStatus,
      status: doc.status,
      created_at: doc.created_at,
    };
  },

  // Tìm người dùng qua ID
  findById: async (id, includeDeleted = false) => {
    let query = { _id: id };
    if (!includeDeleted) query.isDeleted = { $ne: true };
    const doc = await UserModel.findOne(query);
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      username: doc.username,
      email: doc.email,
      phone: doc.phone,
      role: doc.role,
      vipStatus: doc.vipStatus,
      status: doc.status,
      created_at: doc.created_at,
    };
  },

  // Lấy tất cả người dùng
  findAll: async (includeDeleted = false) => {
    let query = {};
    if (!includeDeleted) query.isDeleted = { $ne: true };
    const docs = await UserModel.find(query).sort({ created_at: -1 });
    return docs.map(doc => ({
      id: doc._id.toString(),
      username: doc.username,
      email: doc.email,
      phone: doc.phone,
      role: doc.role,
      vipStatus: doc.vipStatus,
      status: doc.status,
      created_at: doc.created_at,
    }));
  },

  // Tạo người dùng mới
  create: async ({ username, email, password, phone, role, vipStatus, status }) => {
    const doc = await UserModel.create({ 
      username, 
      email, 
      password,
      phone: phone || "Chưa cung cấp",
      role: role || "user",
      vipStatus: vipStatus || "Normal",
      status: status || "active"
    });
    return {
      id: doc._id.toString(),
      username: doc.username,
      email: doc.email,
      phone: doc.phone,
      role: doc.role,
      vipStatus: doc.vipStatus,
      status: doc.status,
      created_at: doc.created_at,
    };
  },

  // Cập nhật người dùng theo ID
  updateById: async (id, updates) => {
    const doc = await UserModel.findByIdAndUpdate(id, updates, { new: true });
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      username: doc.username,
      email: doc.email,
      phone: doc.phone,
      role: doc.role,
      vipStatus: doc.vipStatus,
      status: doc.status,
      created_at: doc.created_at,
    };
  },

  // Xóa người dùng theo ID
  deleteById: async (id) => {
    const result = await UserModel.findByIdAndUpdate(id, { isDeleted: true, status: 'blocked' });
    return !!result;
  }
};

module.exports = User;
