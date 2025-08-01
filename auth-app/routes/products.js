const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Product = require("../models/Product");

// Get all products (protected)
router.get("/", protect, async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Create product (protected)
router.post("/", protect, async (req, res) => {
  const { name, price, category } = req.body;

  try {
    const newProduct = new Product({
      name,
      price,
      category,
      user: req.user.id,
    });

    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
