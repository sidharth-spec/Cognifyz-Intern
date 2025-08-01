const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// In-memory database
let products = [
  { id: 1, name: "Laptop", price: 999, category: "Electronics" },
  { id: 2, name: "Smartphone", price: 699, category: "Electronics" },
];

// API Routes
// GET all products
app.get("/api/products", (req, res) => {
  res.json({
    success: true,
    count: products.length,
    data: products,
  });
});

// GET single product
app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({
      success: false,
      error: `Product not found with id ${req.params.id}`,
    });
  }
  res.json({ success: true, data: product });
});

// POST create product
app.post("/api/products", (req, res) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      success: false,
      error: "Please provide name and price",
    });
  }

  const newProduct = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price,
    category: req.body.category || "General",
  };

  products.push(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});

// PUT update product
app.put("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({
      success: false,
      error: `Product not found with id ${req.params.id}`,
    });
  }

  product.name = req.body.name || product.name;
  product.price = req.body.price || product.price;
  product.category = req.body.category || product.category;

  res.json({ success: true, data: product });
});

// DELETE product
app.delete("/api/products/:id", (req, res) => {
  const productIndex = products.findIndex(
    (p) => p.id === parseInt(req.params.id)
  );
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `Product not found with id ${req.params.id}`,
    });
  }

  products.splice(productIndex, 1);
  res.json({ success: true, data: {} });
});

// Frontend Route
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
