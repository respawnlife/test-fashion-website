import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import './Header.css';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

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
            {t('nav.home')}
          </Link>
          <Link 
            to="/women" 
            className={`nav-link ${isActive('/women') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.women')}
          </Link>
          <Link 
            to="/shoes" 
            className={`nav-link ${isActive('/shoes') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.shoes')}
          </Link>
          <Link 
            to="/bags" 
            className={`nav-link ${isActive('/bags') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.bags')}
          </Link>
        </nav>

        <div className="header-actions">
          <LanguageSwitcher />
          
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
      </div>
    </header>
  );
}

export default Header;
