import { useTranslation } from 'react-i18next';
import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import ProductCard from '../components/ProductCard';
import { categories, products as originalProducts } from '../data/products';
import './Home.css';

function Home() {
  const { t, i18n } = useTranslation();

  // Get translated featured products
  const featuredProducts = originalProducts.slice(0, 6).map((product, index) => {
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
    <main className="home">
      <Hero />
      
      <section id="collections" className="section">
        <div className="section-header">
          <h2 className="section-title">{t('home.browseCategories')}</h2>
          <p className="section-subtitle">{t('home.heroSubtitle')}</p>
        </div>
        <CategorySection categories={categories} />
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">{t('home.featuredProducts')}</h2>
          <p className="section-subtitle">{t('home.qualityDesc')}</p>
        </div>
        <div className="featured-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="brand-section">
        <div className="brand-content">
          <h2 className="brand-title">关于 FASHION</h2>
          <p className="brand-text">
            {t('home.heroSubtitle')}
          </p>
        </div>
      </section>
    </main>
  );
}

export default Home;
