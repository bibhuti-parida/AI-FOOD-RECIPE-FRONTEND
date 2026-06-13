import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-logo" onClick={closeMobileMenu}>
          
          <div>
            <h1 className="logo-text">CND</h1>
            <p>Cook Next Door</p>
          </div>
          
        </Link>

        <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${isMobileMenuOpen ? "active" : ""}`}>
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link
            to="/saved"
            className={`nav-link ${location.pathname === "/saved" ? "active" : ""}`}
            onClick={closeMobileMenu}
          >
            Saved Recipes
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
