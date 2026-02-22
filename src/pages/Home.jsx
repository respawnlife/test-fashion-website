import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import ProductCard from '../components/ProductCard';
import { categories, products } from '../data/products';
import './Home.css';

function Home() {
  const featuredProducts = products.slice(0, 6);

  return (
    <main className="home">
      <Hero />
      
      <section id="collections" className="section">
        <div className="section-header">
          <h2 className="section-title">探索系列</h2>
          <p className="section-subtitle">发现属于你的完美风格</p>
        </div>
        <CategorySection categories={categories} />
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">精选商品</h2>
          <p className="section-subtitle">本季热门推荐</p>
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
            我们致力于为您带来最前沿的时尚单品，从优雅的女装到精致的鞋履，
            从实用的包包到时尚的配饰，每一件产品都经过精心挑选，
            只为展现最完美的你。
          </p>
        </div>
      </section>
    </main>
  );
}

export default Home;
