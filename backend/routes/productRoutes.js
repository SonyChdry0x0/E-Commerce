import express from "express";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
const BASE_URL = process.env.BACKEND_URL || "http://localhost:8080";

const formatProduct = (p) => {
  if (!p) return null;
  const obj = p._doc || p;
  const images = (obj.images || [])
    .filter((img) => typeof img === "string" && img.trim() !== "")
    .map((img) =>
      img.startsWith("http") ? img : `${BASE_URL}/${img.replace(/^\/+/, "")}`
    );
  const finalImages = images.length > 0 ? images : obj.image ? [obj.image] : [];
  return { ...obj, images: finalImages };
};

const router = express.Router();
console.log("✅ productRoutes loaded");
// ✅ GET ALL PRODUCTS (WITH FILTERS)
router.get("/", async (req, res) => {
  try {
    console.log("🔥 GET /products HIT");
    console.log("QUERY:", req.query);

    const { category, size, minPrice, maxPrice, featured } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (size) filter.sizes = size;

    if (featured === "true") {
      filter.featured = true;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json(products.map(formatProduct));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(formatProduct(product));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(formatProduct(product));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const updateData = { ...req.body };

    // sync singular image field with first image in array
    if (updateData.images?.length > 0) {
      updateData.image = updateData.images[0];
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(formatProduct(product));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
