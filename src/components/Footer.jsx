import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3 className="footer-logo">FASHION</h3>
          <p className="footer-tagline">发现你的时尚风格</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-section">
            <h4>分类</h4>
            <ul>
              <li><a href="/women">女装</a></li>
              <li><a href="/shoes">鞋子</a></li>
              <li><a href="/bags">包包</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>关于</h4>
            <ul>
              <li><a href="#about">关于我们</a></li>
              <li><a href="#contact">联系方式</a></li>
              <li><a href="#faq">常见问题</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>关注</h4>
            <div className="social-links">
              <a href="#" aria-label="WeChat">微信</a>
              <a href="#" aria-label="Weibo">微博</a>
              <a href="#" aria-label="Instagram">Instagram</a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 FASHION. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
