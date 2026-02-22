import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import { products as originalProducts } from '../data/products';
import './CategoryPage.css';

function CategoryPage() {
  const { category } = useParams();
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const { t, i18n } = useTranslation();

  // Get translated products based on current language
  const translatedProducts = useMemo(() => {
    const lang = i18n.language;
    const langProducts = t('products', { returnObjects: true });
    
    // Map original products with translated names
    const getTranslatedName = (originalProduct, index) => {
      const categoryProducts = langProducts[originalProduct.category] || [];
      if (categoryProducts[index]) {
        return categoryProducts[index].name;
      }
      return originalProduct.name;
    };

    const getTranslatedPrice = (originalProduct, index) => {
      const categoryProducts = langProducts[originalProduct.category] || [];
      if (categoryProducts[index]) {
        return categoryProducts[index].price;
      }
      return originalProduct.price;
    };

    return originalProducts.map((product, index) => ({
      ...product,
      name: getTranslatedName(product, index),
      price: getTranslatedPrice(product, index)
    }));
  }, [i18n.language, t]);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    let result = translatedProducts;
    
    if (category !== 'all') {
      result = translatedProducts.filter(p => p.category === category);
    }
    
    // Sort products
    switch (sortBy) {
      case 'price-asc':
        return [...result].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...result].sort((a, b) => b.price - a.price);
      case 'name':
        return [...result].sort((a, b) => a.name.localeCompare(b.name, i18n.language));
      default:
        return result;
    }
  }, [category, sortBy, translatedProducts, i18n.language]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get category name
  const categoryName = category ? t(`category.${category}`) : t('category.all');

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>{categoryName}</h1>
        <p>{t('category.totalProducts', { count: filteredProducts.length })}</p>
      </div>

      <div className="container">
        {/* Filters and Sort */}
        <div className="toolbar">
          <div className="sort-container">
            <label>{t('category.sort')}：</label>
            <select 
              value={sortBy} 
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="sort-select"
            >
              <option value="default">{t('category.sortDefault')}</option>
              <option value="price-asc">{t('category.sortPriceAsc')}</option>
              <option value="price-desc">{t('category.sortPriceDesc')}</option>
              <option value="name">{t('category.sortName')}</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {paginatedProducts.length > 0 ? (
          <div className="products-grid">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>{t('category.noProducts')}</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              {t('category.prevPage')}
            </button>
            
            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              {t('category.nextPage')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
