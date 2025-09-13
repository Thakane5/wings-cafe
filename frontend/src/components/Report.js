import React, { useEffect, useState } from "react";
import "./Report.css";

function Report() {
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState({});
  const [sales, setSales] = useState([]);
  const [transactions, setTransactions] = useState([]);

  //  detects added/restocked/deleted products
  const [prevProducts, setPrevProducts] = useState([]);
  const [prevStock, setPrevStock] = useState({});

  // Load all data from localStorage
  const loadData = () => {
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
    const savedStock = JSON.parse(localStorage.getItem("stock")) || {};
    const savedSales = JSON.parse(localStorage.getItem("sales")) || [];

    setProducts(savedProducts);
    setStock(savedStock);
    setSales(savedSales);

    // Compute transactions 
    const newTransactions = [];

    
    savedProducts.forEach((product) => {
      const prevQty = prevStock[product.id] || 0;
      const currentQty = savedStock[product.id] || 0;

      if (!prevProducts.find((p) => p.id === product.id)) {
        // New product added
        newTransactions.push({
          date: new Date().toLocaleString(),
          name: product.name,
          price: product.price,
          qtyBefore: 0,
          qtyAfter: currentQty,
          action: "Added",
          total: product.price * currentQty,
        });
      } else if (currentQty > prevQty) {
        // Restocked
        newTransactions.push({
          date: new Date().toLocaleString(),
          name: product.name,
          price: product.price,
          qtyBefore: prevQty,
          qtyAfter: currentQty,
          action: "Restocked",
          total: product.price * (currentQty - prevQty),
        });
      }
    });

    // Deleted products
    prevProducts.forEach((prevProd) => {
      if (!savedProducts.find((p) => p.id === prevProd.id)) {
        const prevQty = prevStock[prevProd.id] || 0;
        newTransactions.push({
          date: new Date().toLocaleString(),
          name: prevProd.name,
          price: prevProd.price,
          qtyBefore: prevQty,
          qtyAfter: 0,
          action: "Deleted",
          total: prevProd.price * prevQty,
        });
      }
    });

    // Sold products
    savedSales.forEach((sale) => {
      const currentQty = savedStock[sale.productId] || 0;
      const qtyBefore = currentQty + sale.quantity;

      newTransactions.push({
        date: sale.date,
        name: sale.productName,
        price: sale.total / sale.quantity,
        qtyBefore: qtyBefore,
        qtyAfter: currentQty,
        action: "Sold",
        total: sale.total,
      });
    });

    setTransactions(newTransactions);

   
    setPrevProducts(savedProducts);
    setPrevStock(savedStock);
  };

  useEffect(() => {
    loadData();

    // Listen to localStorage changes
    const handleStorageChange = () => loadData();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (stock[p.id] || 0), 0);
  const lowStockProducts = products.filter((p) => (stock[p.id] || 0) < 5);
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

      {/* ✅ Low stock items list */}
      {lowStockProducts.length > 0 && (
        <div className="low-stock-section">
          <h2>⚠️ Low Stock Items</h2>
          <ul className="low-stock-list">
            {lowStockProducts.map((p) => (
              <li key={p.id}>
                {p.name} — Only {stock[p.id] || 0} left
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
