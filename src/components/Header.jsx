import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          FASHION
        </Link>
        
        <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            首页
          </Link>
          <Link 
            to="/women" 
            className={`nav-link ${isActive('/women') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            女装
          </Link>
          <Link 
            to="/shoes" 
            className={`nav-link ${isActive('/shoes') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            鞋子
          </Link>
          <Link 
            to="/bags" 
            className={`nav-link ${isActive('/bags') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            包包
          </Link>
        </nav>

        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

export default Header;
