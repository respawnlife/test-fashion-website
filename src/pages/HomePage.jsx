import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/products';
import './HomePage.css';

function HomePage() {
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">发现你的时尚风格</h1>
          <p className="hero-subtitle">精选女装、鞋包，展现优雅与自信</p>
          <Link to="/women" className="hero-btn">
            立即探索
          </Link>
        </div>
        <div className="hero-overlay"></div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">浏览分类</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <Link 
                to={`/${category.id}`} 
                key={category.id} 
                className="category-card"
              >
                <div className="category-image-wrapper">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="category-image"
                    loading="lazy"
                  />
                  <div className="category-overlay">
                    <h3 className="category-name">{category.name}</h3>
                    <p className="category-desc">{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">精选商品</h2>
            <Link to="/all" className="view-all-link">
              查看全部 →
            </Link>
          </div>
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">✨</div>
              <h3>精选品质</h3>
              <p>每一件商品都经过精心挑选</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🚚</div>
              <h3>快速配送</h3>
              <p>合作商家提供高效物流服务</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💳</div>
              <h3>安全支付</h3>
              <p>支持多种安全支付方式</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💝</div>
              <h3>售后保障</h3>
              <p>享受完善的售后服务</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
