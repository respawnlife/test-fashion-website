import LinkAlert from './LinkAlert';
import './ProductCard.css';

function ProductCard({ product }) {
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
              查看详情
            </button>
          </div>
        </div>
      </LinkAlert>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">¥{product.price}</p>
      </div>
    </div>
  );
}

export default ProductCard;
