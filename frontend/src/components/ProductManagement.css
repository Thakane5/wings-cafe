import React, { useState, useEffect } from "react";
import "./ProductManagement.css";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [newName, setNewName] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // Use correct environment variable
  const API_BASE = process.env.REACT_APP_API_URL;

  // Fetch all products from backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
      setStatusMessage("⚠️ Could not load products. Is server running?");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add new product
  const handleAddProduct = async () => {
    if (!newName.trim()) return alert("Please enter a product name");

    try {
      const response = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          description: "New product",
          category: "General",
          price: 0,
          quantity: 0,
          image: "",
        }),
      });

      if (!response.ok) throw new Error("Failed to add product");

      const addedProduct = await response.json();
      setProducts((prev) => [...prev, addedProduct]);
      setStatusMessage(`✅ Added product: ${addedProduct.name}`);
      setNewName("");
    } catch (error) {
      console.error("Error adding product:", error);
      setStatusMessage("⚠️ Could not add product");
    }
  };

  return (
    <div className="pm-container">
      <h1>Product Management</h1>
      {statusMessage && <p>{statusMessage}</p>}

      <div className="pm-add-section">
        <h2>Add New Product</h2>
        <input
          type="text"
          placeholder="Enter product name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      <div className="pm-products-section">
        <h2>Available Products ({products.length})</h2>
        {products.length === 0 ? (
          <p>No products available yet</p>
        ) : (
          <div className="pm-products-grid">
            {products.map((product) => (
              <div key={product.id} className="pm-product-card">
                <img
                  src={
                    product.image || "https://via.placeholder.com/150?text=No+Image"
                  }
                  alt={product.name}
                />
                <h3>{product.name}</h3>
                <p>Price: M{product.price}</p>
                <p>Stock: {product.quantity}</p>
                <p>{product.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductManagement;
