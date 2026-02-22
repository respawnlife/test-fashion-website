import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          发现你的<br />
          <span>时尚风格</span>
        </h1>
        <p className="hero-subtitle">
          精选女装、鞋履与包包，演绎现代女性的优雅与自信
        </p>
        <a href="#collections" className="hero-cta">
          探索系列
        </a>
      </div>
      <div className="hero-image">
        <img 
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=1600&fit=crop" 
          alt="Fashion Hero"
        />
      </div>
    </section>
  );
}

export default Hero;
