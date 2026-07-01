const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    _id: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: false
    },
    google_id: {
      type: String,
      required: false,
      sparse: true,
      index: true
    },
    auth_provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
      required: true
    },
    username: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      required: false
    },
    address: {
      type: String,
      required: false
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true
    },
    vipStatus: {
      type: String,
      default: "Standard",
      required: true
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
      required: true
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

const User = mongoose.models.User
  ? mongoose.models.User
  : mongoose.model("User", UserSchema);

module.exports = User;
