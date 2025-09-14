const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database file path
const DB_FILE = path.join(__dirname, "database.json");

// Load DB
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify({ products: [], sales: [], transactions: [] }, null, 2)
    );
  }
  const data = fs.readFileSync(DB_FILE);
  return JSON.parse(data);
}

// Save DB
function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// Add transaction helper
function addTransaction(db, { name, price, qtyBefore, qtyAfter, action, total }) {
  db.transactions.push({
    id: Date.now(),
    date: new Date().toLocaleString(),
    name,
    price,
    qtyBefore,
    qtyAfter,
    action,
    total,
  });
}

// ---------------------- PRODUCTS ----------------------
app.get("/products", (req, res) => {
  const db = loadDB();
  res.json(db.products);
});

app.post("/products", (req, res) => {
  const db = loadDB();
  const { name, description, category, price, quantity, image } = req.body;

  if (!name) return res.status(400).json({ error: "Product name required" });

  const newProduct = {
    id: Date.now(),
    name,
    description: description || "New product",
    category: category || "General",
    price: price || 0,
    quantity: quantity || 0,
    image: image || "",
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
      qtyAfter: product.quantity,
      action: "Restocked",
      total: product.price * (req.body.quantity - prevQty),
    });
  }

  saveDB(db);
  res.json(product);
});

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
app.get("/sales", (req, res) => {
  const db = loadDB();
  res.json(db.sales);
});

app.post("/sales", (req, res) => {
  const db = loadDB();
  const { productId, quantity } = req.body;

  if (!productId || !quantity) return res.status(400).json({ error: "Invalid sale data" });

  const product = db.products.find((p) => p.id === parseInt(productId));
  if (!product) return res.status(404).json({ error: "Product not found" });
  if (quantity > product.quantity) return res.status(400).json({ error: "Not enough stock" });

  const sale = {
    id: Date.now(),
    productId: product.id,
    productName: product.name,
    quantity,
    total: product.price * quantity,
    date: new Date().toLocaleString(),
  };

  db.sales.push(sale);

  const prevQty = product.quantity;
  product.quantity -= quantity;

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

// ---------------------- START SERVER ----------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
