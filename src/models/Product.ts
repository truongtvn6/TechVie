import mongoose, { Schema } from "mongoose";

export interface IProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  specs: { label: string; value: string }[];
}

const ProductSchema: Schema = new Schema({
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
  ? (mongoose.models.Product as mongoose.Model<IProduct>)
  : mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
