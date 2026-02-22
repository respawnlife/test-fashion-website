import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import { categories, products as originalProducts } from '../data/products';
import './HomePage.css';

function HomePage() {
  const { t, i18n } = useTranslation();

  // Get translated featured products (first 8)
  const featuredProducts = originalProducts.slice(0, 8).map((product, index) => {
    const langProducts = t('products', { returnObjects: true }) || {};
    const categoryProducts = langProducts[product.category] || [];
    const translatedProduct = categoryProducts[index % categoryProducts.length];
    
    return {
      ...product,
      name: translatedProduct ? translatedProduct.name : product.name,
      price: translatedProduct ? translatedProduct.price : product.price
    };
  });

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">{t('home.heroTitle')}</h1>
          <p className="hero-subtitle">{t('home.heroSubtitle')}</p>
          <Link to="/women" className="hero-btn">
            {t('home.exploreBtn')}
          </Link>
        </div>
        <div className="hero-overlay"></div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">{t('home.browseCategories')}</h2>
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
                    alt={t(`categories.${category.id}.name`)}
                    className="category-image"
                    loading="lazy"
                  />
                  <div className="category-overlay">
                    <h3 className="category-name">{t(`categories.${category.id}.name`)}</h3>
                    <p className="category-desc">{t(`categories.${category.id}.description`)}</p>
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
            <h2 className="section-title">{t('home.featuredProducts')}</h2>
            <Link to="/all" className="view-all-link">
              {t('home.viewAll')}
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
              <h3>{t('home.qualityTitle')}</h3>
              <p>{t('home.qualityDesc')}</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🚚</div>
              <h3>{t('home.shippingTitle')}</h3>
              <p>{t('home.shippingDesc')}</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💳</div>
              <h3>{t('home.paymentTitle')}</h3>
              <p>{t('home.paymentDesc')}</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💝</div>
              <h3>{t('home.serviceTitle')}</h3>
              <p>{t('home.serviceDesc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
