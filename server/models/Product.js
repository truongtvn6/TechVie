const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  specs: [
    {
      label: { type: String, required: true },
      value: { type: String, required: true }
    }
  ]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

ProductSchema.set("toJSON", { virtuals: true });
ProductSchema.set("toObject", { virtuals: true });

const Product = mongoose.models.Product
  ? mongoose.models.Product
  : mongoose.model("Product", ProductSchema);

module.exports = Product;
