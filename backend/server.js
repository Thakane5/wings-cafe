const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000; // ✅ Use Render’s port if provided

app.use(cors());
app.use(bodyParser.json());

const DB_FILE = path.join(__dirname, "data", "database.json");

// Load DB
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify({ products: [], sales: [], transactions: [] }, null, 2)
    );
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
}

// Save DB
function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Create transaction
function addTransaction(db, { name, price, qtyBefore, qtyAfter, action, total }) {
  const transaction = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    name,
    price,
    qtyBefore,
    qtyAfter,
    action,
    total,
  };
  db.transactions.push(transaction);
}

// ---------------------- PRODUCTS ----------------------

// Get all products
app.get("/products", (req, res) => {
  const db = loadDB();
  res.json(db.products);
});

// Add product
app.post("/products", (req, res) => {
  const db = loadDB();
  const newProduct = {
    id: Date.now(),
    name: req.body.name,
    description: req.body.description || "New product",
    category: req.body.category || "General",
    price: req.body.price || 0,
    quantity: req.body.quantity || 0,
    image: req.body.image || "",
  };
  db.products.push(newProduct);

  addTransaction(db, {
    name: newProduct.name,
    price: newProduct.price,
    qtyBefore: 0,
    qtyAfter: newProduct.quantity,
    action: "Added",
    total: newProduct.price * newProduct.quantity,
  });

  saveDB(db);
  res.json(newProduct);
});

// Update product (restock/edit)
app.patch("/products/:id", (req, res) => {
  const db = loadDB();
  const product = db.products.find((p) => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });

  const prevQty = product.quantity;
  Object.assign(product, req.body);

  if (req.body.quantity && req.body.quantity > prevQty) {
    addTransaction(db, {
      name: product.name,
      price: product.price,
      qtyBefore: prevQty,
      qtyAfter: req.body.quantity,
      action: "Restocked",
      total: product.price * (req.body.quantity - prevQty),
    });
  }

  saveDB(db);
  res.json(product);
});

// Delete product
app.delete("/products/:id", (req, res) => {
  const db = loadDB();
  const product = db.products.find((p) => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });

  addTransaction(db, {
    name: product.name,
    price: product.price,
    qtyBefore: product.quantity,
    qtyAfter: 0,
    action: "Deleted",
    total: product.price * product.quantity,
  });

  db.products = db.products.filter((p) => p.id !== product.id);
  saveDB(db);
  res.json({ success: true });
});

// ---------------------- SALES ----------------------
app.post("/sales", (req, res) => {
  const db = loadDB();
  const product = db.products.find((p) => p.id === req.body.productId);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const qty = req.body.quantity;
  if (qty > product.quantity) {
    return res.status(400).json({ error: "Not enough stock" });
  }

  const sale = {
    id: Date.now(),
    productId: product.id,
    productName: product.name,
    quantity: qty,
    total: product.price * qty,
    date: new Date().toLocaleString(),
  };
  db.sales.push(sale);

  const prevQty = product.quantity;
  product.quantity -= qty;

  addTransaction(db, {
    name: product.name,
    price: product.price,
    qtyBefore: prevQty,
    qtyAfter: product.quantity,
    action: "Sold",
    total: sale.total,
  });

  saveDB(db);
  res.json(sale);
});

// ---------------------- TRANSACTIONS ----------------------
app.get("/transactions", (req, res) => {
  const db = loadDB();
  res.json(db.transactions);
});

// ---------------------- SERVER ----------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
