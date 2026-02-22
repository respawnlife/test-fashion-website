import { Link } from 'react-router-dom';
import './CategorySection.css';

function CategorySection({ categories }) {
  return (
    <section className="category-section">
      <div className="category-grid">
        {categories.map((category) => (
          <Link to={`/${category.id}`} key={category.id} className="category-card">
            <div className="category-image-wrapper">
              <img 
                src={category.image} 
                alt={category.name}
                className="category-image"
                loading="lazy"
              />
              <div className="category-overlay">
                <div className="category-content">
                  <h3 className="category-title">{category.name}</h3>
                  <p className="category-description">{category.description}</p>
                  <span className="category-link">
                    探索系列 →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;
