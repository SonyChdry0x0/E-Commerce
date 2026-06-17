import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    description: { type: String },
    price:       { type: Number, required: true },
    image:       { type: String },
    images:      [String],
    category:    { type: String },
    brand:       { type: String },
    sizes:       [String],
    stock:       { type: Number, default: 0 },
    featured:    { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false }, // ← renamed from isNew
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;