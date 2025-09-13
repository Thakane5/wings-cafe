import React, { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [products, setProducts] = useState([]);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="dashboard">
      <h1>Welcome to Wings Cafe - taste what we're passionate about
      </h1>
      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className={`product-card ${
                product.quantity < 5 ? "low-stock" : ""
              }`}
            >
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                {product.quantity < 5 && (
                  <div className="low-stock-badge">Low Stock</div>
                )}
              </div>
              <div className="product-info">
                <h2 className="product-name">{product.name}</h2>
                <p className="product-category">{product.category}</p>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">M{product.price}</span>
                  <span className="product-quantity">Qty: {product.quantity}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;