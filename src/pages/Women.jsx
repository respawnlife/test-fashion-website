import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import { products as originalProducts } from '../data/products';
import './Category.css';

function Women() {
  const { t, i18n } = useTranslation();

  // Get translated products
  const translatedProducts = originalProducts
    .filter(p => p.category === 'women')
    .map((product, index) => {
      const langProducts = t('products.women', { returnObjects: true }) || [];
      if (langProducts[index]) {
        return {
          ...product,
          name: langProducts[index].name,
          price: langProducts[index].price
        };
      }
      return product;
    });

  return (
    <main className="category-page">
      <div className="category-hero">
        <div className="category-hero-content">
          <h1 className="category-title">{t('categories.women.name')}</h1>
          <p className="category-subtitle">{t('categories.women.description')}</p>
        </div>
      </div>
      
      <div className="category-products">
        <div className="products-grid">
          {translatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Women;
