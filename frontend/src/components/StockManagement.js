import React, { useState, useEffect } from "react";

function StockManagement() {
  const [products, setProducts] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const API_BASE = process.env.REACT_APP_API_URL;

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setStatusMessage("⚠️ Could not load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateStock = async (product, change) => {
    const newQty = Math.max(0, product.quantity + change);
    try {
      const res = await fetch(`${API_BASE}/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });

      if (!res.ok) throw new Error("Failed to update stock");

      setStatusMessage(`${change > 0 ? "➕ Restocked" : "➖ Reduced"} ${product.name}`);
      fetchProducts();
    } catch (error) {
      console.error("Error updating stock:", error);
      setStatusMessage("⚠️ Could not update stock");
    }
  };

  return (
    <div>
      <h1>Stock Management</h1>
      {statusMessage && <p>{statusMessage}</p>}

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Image</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>
                  <img
                    src={product.image || "https://via.placeholder.com/50"}
                    alt={product.name}
                    width="50"
                    height="50"
                  />
                </td>
                <td>M{product.price}</td>
                <td>{product.quantity}</td>
                <td>
                  <button onClick={() => updateStock(product, 1)}>+1</button>
                  <button onClick={() => updateStock(product, 5)}>+5</button>
                  <button onClick={() => updateStock(product, -1)}>-1</button>
                  <button onClick={() => updateStock(product, -5)}>-5</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StockManagement;
