import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import './Category.css';

function Shoes() {
  const shoesProducts = products.filter(p => p.category === 'shoes');

  return (
    <main className="category-page">
      <div className="category-hero">
        <div className="category-hero-content">
          <h1 className="category-title">鞋子</h1>
          <p className="category-subtitle">舒适与时尚并存的鞋履系列</p>
        </div>
      </div>
      
      <div className="category-products">
        <div className="products-grid">
          {shoesProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Shoes;
