// src/App.jsx
import { BrowserRouter, Link, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Veg from "./Veg";
import Nonveg from "./Nonveg";
import Starters from "./Starters";
import DrinksAndJuices from "./DrinksAndJuices";
import Cart from "./Cart";
import Login from "./Login";
import Home from "./Home";
import Orders from "./Orders";
import ContactUs from "./ContactUs";
import AboutUs from "./AboutUs";
import './App.css';

// Dummy Components
const Terms = () => <div className="page">📜 Terms of Service</div>;
const Privacy = () => <div className="page">🔒 Privacy Policy</div>;

function App() {
  const cartItems = useSelector((state) => state.cart) || [];
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <BrowserRouter>
      {/* Header Section */}
      <header>
        <div className="logo-bar">
          <div className="logo">📦 Spice World</div>
        </div>
        <nav className="nav-bar">
          <ul className="nav-links">
            <li><Link to="/home" className="nav-link">🏠 Home Appliances</Link></li>
            <li><Link to="/veg" className="nav-link">🥦 Veggies</Link></li>
            <li><Link to="/nonveg" className="nav-link">🍗 Non-Veg</Link></li>
            <li><Link to="/starters" className="nav-link">🍢 Starters</Link></li>
            <li><Link to="/drinks" className="nav-link">🥤 Drinks & Juices</Link></li>
            <li><Link to="/login" className="nav-link">🔐 Login</Link></li>
            <li><Link to="/contact" className="nav-link">📬 Contact Us</Link></li>
            <li><Link to="/aboutus" className="nav-link">📄 About Us</Link></li>
            <li><Link to="/orders" className="nav-link">📦 Orders</Link></li>
            <li>
              <Link to="/cart" className="nav-link cart-link">
                🛒 Cart
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/veg" element={<Veg />} />
          <Route path="/nonveg" element={<Nonveg />} />
          <Route path="/starters" element={<Starters />} />
          <Route path="/drinks" element={<DrinksAndJuices />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<div className="page">404 - Page Not Found</div>} />
        </Routes>
      </main>

      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2025 BigBasket Store. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/terms" className="footer-link">Terms of Service</Link>
          <Link to="/privacy" className="footer-link">Privacy Policy</Link>
        </div>
      </footer>
    </BrowserRouter>
  );
}

export default App;
