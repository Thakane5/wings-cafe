import React, { useState, useEffect } from "react";
import "./Sales.css";

function Sales() {
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const API_BASE = process.env.REACT_APP_API_URL;

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setStatusMessage("⚠️ Could not fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSale = async (product) => {
    const qty = parseInt(quantity);
    if (!qty || qty <= 0) return alert("Enter valid quantity");
    if (product.quantity < qty) return alert("Not enough stock");

    try {
      const response = await fetch(`${API_BASE}/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: qty }),
      });

      if (!response.ok) throw new Error("Sale failed");

      const sale = await response.json();
      setStatusMessage(`✅ Sold ${qty} of ${product.name}`);

      // Refresh products list after sale
      fetchProducts();
      setQuantity("");
    } catch (error) {
      console.error("Error making sale:", error);
      setStatusMessage("⚠️ Sale failed");
    }
  };

  return (
    <div className="sales-container">
      <h1>Sales</h1>
      {statusMessage && <p>{statusMessage}</p>}

      <div className="sales-products-grid">
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="sales-product-card">
              <img
                src={product.image || "https://via.placeholder.com/150"}
                alt={product.name}
              />
              <h3>{product.name}</h3>
              <p>Price: M{product.price}</p>
              <p>Stock: {product.quantity}</p>
              <input
                type="number"
                placeholder="Qty"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <button onClick={() => handleSale(product)}>Sell</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Sales;
