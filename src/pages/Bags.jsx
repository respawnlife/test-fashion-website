import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import './Category.css';

function Bags() {
  const bagsProducts = products.filter(p => p.category === 'bags');

  return (
    <main className="category-page">
      <div className="category-hero">
        <div className="category-hero-content">
          <h1 className="category-title">包包</h1>
          <p className="category-subtitle">精致的配饰点缀你的生活</p>
        </div>
      </div>
      
      <div className="category-products">
        <div className="products-grid">
          {bagsProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Bags;
