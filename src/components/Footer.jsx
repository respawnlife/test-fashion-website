import { useTranslation } from 'react-i18next';
import './Footer.css';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3 className="footer-logo">FASHION</h3>
          <p className="footer-tagline">{t('footer.tagline')}</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-section">
            <h4>{t('footer.categories')}</h4>
            <ul>
              <li><a href="/women">{t('nav.women')}</a></li>
              <li><a href="/shoes">{t('nav.shoes')}</a></li>
              <li><a href="/bags">{t('nav.bags')}</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>{t('footer.about')}</h4>
            <ul>
              <li><a href="#about">{t('footer.aboutUs')}</a></li>
              <li><a href="#contact">{t('footer.contact')}</a></li>
              <li><a href="#faq">{t('footer.faq')}</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>{t('footer.follow')}</h4>
            <div className="social-links">
              <a href="#" aria-label={t('footer.wechat')}>{t('footer.wechat')}</a>
              <a href="#" aria-label={t('footer.weibo')}>{t('footer.weibo')}</a>
              <a href="#" aria-label={t('footer.instagram')}>{t('footer.instagram')}</a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>{t('footer.copyright')}</p>
      </div>
    </footer>
  );
}

export default Footer;
