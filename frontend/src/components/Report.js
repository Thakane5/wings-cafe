import React, { useEffect, useState } from "react";
import "./Report.css";

function Report() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const API_BASE = process.env.REACT_APP_API_URL;

  const fetchData = async () => {
    try {
      const [productsRes, salesRes, transactionsRes] = await Promise.all([
        fetch(`${API_BASE}/products`),
        fetch(`${API_BASE}/sales`),
        fetch(`${API_BASE}/transactions`)
      ]);

      if (!productsRes.ok || !salesRes.ok || !transactionsRes.ok)
        throw new Error("Failed to fetch data");

      const productsData = await productsRes.json();
      const salesData = await salesRes.json();
      const transactionsData = await transactionsRes.json();

      setProducts(productsData);
      setSales(salesData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const lowStockProducts = products.filter((p) => (p.quantity || 0) < 5);
  const totalSales = sales.reduce((sum, s) => sum + (s.total || 0), 0);

  return (
    <div className="report-container">
      <h1>System Report</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <h3>Total Products</h3>
          <p className="stat-number">{totalProducts}</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <h3>Total Stock</h3>
          <p className="stat-number">{totalStock}</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <h3>Low Stock Items</h3>
          <p className="stat-number">{lowStockProducts.length}</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <h3>Total Sales</h3>
          <p className="stat-number">M{totalSales}</p>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="low-stock-section">
          <h2>⚠️ Low Stock Items</h2>
          <ul className="low-stock-list">
            {lowStockProducts.map((p) => (
              <li key={p.id}>
                {p.name} — Only {p.quantity} left
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="transactions-section">
        <h2>Product Transactions</h2>
        {transactions.length === 0 ? (
          <p className="no-activity">No transactions yet.</p>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Price (M)</th>
                <th>Qty Before</th>
                <th>Qty After</th>
                <th>Action</th>
                <th>Total (M)</th>
              </tr>
            </thead>
            <tbody>
              {transactions
                .slice()
                .reverse()
                .map((t, idx) => (
                  <tr key={idx}>
                    <td>{t.date}</td>
                    <td>{t.name}</td>
                    <td>{t.price}</td>
                    <td>{t.qtyBefore}</td>
                    <td>{t.qtyAfter}</td>
                    <td>{t.action}</td>
                    <td>{t.total}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Report;
