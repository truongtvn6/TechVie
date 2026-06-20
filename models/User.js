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
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("User", userSchema);

const User = {
  // Tìm người dùng qua Email
  findByEmail: async (email) => {
    const doc = await UserModel.findOne({ email });
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      username: doc.username,
      email: doc.email,
      password: doc.password,
      created_at: doc.created_at,
    };
  },

  // Tìm người dùng qua ID
  findById: async (id) => {
    const doc = await UserModel.findById(id);
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      username: doc.username,
      email: doc.email,
      created_at: doc.created_at,
    };
  },

  // Tạo người dùng mới
  create: async ({ username, email, password }) => {
    const doc = await UserModel.create({ username, email, password });
    return {
      id: doc._id.toString(),
      username: doc.username,
      email: doc.email,
      created_at: doc.created_at,
    };
  },
};

module.exports = User;
