// File: server/controllers/productController.js
import Product from "../models/Product.js";

// ✅ Create Product
export const createProduct = async (req, res) => {
  try {
    const imageFilenames = req.files.map(file => file.filename); // only filename, not base64
    const newProduct = new Product({
      ...req.body,
      images: imageFilenames,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (err) {
    console.error("❌ Error in createProduct:", err);
    res.status(500).json({ message: "Failed to create product" });
  }
};


// ✅ Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// ✅ Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product" });
  }
};

// ✅ Update
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating product" });
  }
};

// ✅ Delete
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product" });
  }
};

// ✅ Popular Services
export const getPopularServices = async (req, res) => {
  try {
    const popular = await Product.find().sort({ createdAt: -1 }).limit(6);
    res.status(200).json(popular);
  } catch (err) {
    res.status(500).json({ message: "Failed to load popular services" });
  }
};

