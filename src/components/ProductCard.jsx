import { useTranslation } from 'react-i18next';
import LinkAlert from './LinkAlert';
import './ProductCard.css';

function ProductCard({ product }) {
  const { t } = useTranslation();

  // Format price based on product data
  const price = product.price || 0;

  return (
    <div className="product-card">
      <LinkAlert url={product.link} className="product-link">
        <div className="product-image-wrapper">
          <img 
            src={product.image} 
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
          <div className="product-overlay">
            <button className="view-btn">
              {t('product.viewDetails')}
            </button>
          </div>
        </div>
      </LinkAlert>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">¥{price}</p>
      </div>
    </div>
  );
}

export default ProductCard;
