import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ProductManagement from "./components/ProductManagement";
import Sales from "./components/Sales";
import Report from "./components/Report";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app-root">
        <nav className="main-nav">
          <div className="logo-container">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwEZpgSeWCKbv6UNJ3OT0s44CF5skVCOFAafLPMLbzqArtefh0gZOOCpj8UHyyByc8NhI&usqp=CAU" 
              alt="Logo" 
              className="logo" 
            />
            <span className="brand-name">Wings cafe</span>
          </div>

          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/products">Products</Link>
            <Link to="/sales">Sales</Link>
            <Link to="/reports">Reports</Link>
          </div>
        </nav>

        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/reports" element={<Report />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Contact Us</h3>
              <p>Email: thakaneasello@gmail.com</p>
              <p>Phone: +266 59870938</p>
              <p>Address: Berea, Liotloaneng</p>
            </div>
            
            <div className="footer-section">
              <h3>Follow Us</h3>
              <div className="social-icons">
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/124/124010.png" 
                    alt="Facebook" 
                    className="social-icon" 
                  />
                </a>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/174/174855.png" 
                    alt="Instagram" 
                    className="social-icon" 
                  />
                </a>
                <a href="https://wa.me/15551234567" target="_blank" rel="noopener noreferrer">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/124/124034.png" 
                    alt="WhatsApp" 
                    className="social-icon" 
                  />
                </a>
              </div>
            </div>
            
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/support">Support</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Wings Cafe. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
