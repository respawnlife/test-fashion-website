import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './CategorySection.css';

function CategorySection({ categories }) {
  const { t } = useTranslation();

  return (
    <section className="category-section">
      <div className="category-grid">
        {categories.map((category) => (
          <Link to={`/${category.id}`} key={category.id} className="category-card">
            <div className="category-image-wrapper">
              <img 
                src={category.image} 
                alt={t(`categories.${category.id}.name`)}
                className="category-image"
                loading="lazy"
              />
              <div className="category-overlay">
                <div className="category-content">
                  <h3 className="category-title">{t(`categories.${category.id}.name`)}</h3>
                  <p className="category-description">{t(`categories.${category.id}.description`)}</p>
                  <span className="category-link">
                    {t('categoryCard.explore')}
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
