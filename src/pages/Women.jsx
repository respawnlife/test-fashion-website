import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import './Category.css';

function Women() {
  const womenProducts = products.filter(p => p.category === 'women');

  return (
    <main className="category-page">
      <div className="category-hero">
        <div className="category-hero-content">
          <h1 className="category-title">女装</h1>
          <p className="category-subtitle">优雅时尚的女性服装系列</p>
        </div>
      </div>
      
      <div className="category-products">
        <div className="products-grid">
          {womenProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Women;
