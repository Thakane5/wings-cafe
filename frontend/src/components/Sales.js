import React, { useState, useEffect } from "react";
import "./Sales.css";

function Sales() {
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState({});
  const [sales, setSales] = useState([]);
  const [quantity, setQuantity] = useState("");

  // Load data from localStorage
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
    const savedStock = JSON.parse(localStorage.getItem("stock")) || {};
    const savedSales = JSON.parse(localStorage.getItem("sales")) || [];

    setProducts(savedProducts);
    setStock(savedStock);
    setSales(savedSales);
  }, []);

  // Save sales and stock whenever they change
  useEffect(() => {
    localStorage.setItem("sales", JSON.stringify(sales));
    localStorage.setItem("stock", JSON.stringify(stock));
  }, [sales, stock]);

  const handleSale = (product) => {
    const qty = parseInt(quantity);

    if (!qty || qty <= 0) {
      alert("Please enter a valid quantity!");
      return;
    }

    if ((stock[product.id] || 0) < qty) {
      alert("Not enough stock!");
      return;
    }

    // Create sale record
    const newSale = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      quantity: qty,
      total: product.price * qty,
      date: new Date().toLocaleString(),
    };

    setSales([...sales, newSale]);

    // Update stock
    setStock({
      ...stock,
      [product.id]: (stock[product.id] || product.quantity) - qty,
    });

    setQuantity("");
  };

  return (
    <div className="sales-container">
      <h1 className="page-title">Sales</h1>

      {/* Product Cards */}
      <div className="sales-products-grid">
        {products.length === 0 ? (
          <p>No products available. Add some first.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="sales-product-card">
              <img
                src={product.image || "https://via.placeholder.com/150"}
                alt={product.name}
              />
              <h3>{product.name}</h3>
              <p>Price: M{product.price}</p>
              <p>Stock: {stock[product.id] || 0}</p>
              <input
                type="number"
                placeholder="Qty"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <button onClick={() => handleSale(product)} className="btn-primary">
                Sell
              </button>
            </div>
          ))
        )}
      </div>

      {/* Sales History */}
      <div className="sales-history">
        <h2>Sales History</h2>
        {sales.length === 0 ? (
          <p>No sales recorded yet.</p>
        ) : (
          <table className="sales-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total (M)</th>
              </tr>
            </thead>
            <tbody>
              {sales
                .slice()
                .reverse()
                .map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.date}</td>
                    <td>{sale.productName}</td>
                    <td>{sale.quantity}</td>
                    <td>{sale.total}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Sales;
