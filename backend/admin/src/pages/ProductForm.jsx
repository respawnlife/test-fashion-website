import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE = '/api';

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'women',
    subcategory: '',
    price: '',
    original_price: '',
    brand: '',
    images: '',
    external_url: '',
    source_site: '',
    tags: '',
    is_featured: false,
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/products/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      const product = data.data.product;
      
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || 'women',
        subcategory: product.subcategory || '',
        price: product.price || '',
        original_price: product.original_price || '',
        brand: product.brand || '',
        images: product.images?.join('\n') || '',
        external_url: product.external_url || '',
        source_site: product.source_site || '',
        tags: product.tags?.join(', ') || '',
        is_featured: !!product.is_featured,
        is_active: !!product.is_active
      });
    } catch (error) {
      console.error('Fetch product error:', error);
      setError('加载商品失败');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      images: formData.images.split('\n').filter(url => url.trim()),
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
    };

    try {
      const token = localStorage.getItem('token');
      const url = isEdit ? `${API_BASE}/products/${id}` : `${API_BASE}/products`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (data.success) {
        navigate('/products');
      } else {
        setError(data.message || '保存失败');
      }
    } catch (error) {
      console.error('Save product error:', error);
      setError('保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => navigate('/products')}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#667eea',
            fontSize: 16,
            marginBottom: 16
          }}
        >
          ← 返回列表
        </button>
        <h1 style={{ color: '#1a1a2e' }}>
          {isEdit ? '编辑商品' : '添加商品'}
        </h1>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          background: '#fee',
          color: '#c00',
          borderRadius: 8,
          marginBottom: 20
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{
          background: 'white',
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          maxWidth: 800
        }}>
          <div style={{ display: 'grid', gap: 20 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                商品名称 *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  fontSize: 15
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                商品描述
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  fontSize: 15,
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                  分类 *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #ddd',
                    borderRadius: 8,
                    fontSize: 15
                  }}
                >
                  <option value="women">女装</option>
                  <option value="shoes">鞋子</option>
                  <option value="bags">包包</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                  子分类
                </label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #ddd',
                    borderRadius: 8,
                    fontSize: 15
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                  价格 *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #ddd',
                    borderRadius: 8,
                    fontSize: 15
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                  原价
                </label>
                <input
                  type="number"
                  name="original_price"
                  value={formData.original_price}
                  onChange={handleChange}
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #ddd',
                    borderRadius: 8,
                    fontSize: 15
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                品牌
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  fontSize: 15
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                图片 URLs (每行一个)
              </label>
              <textarea
                name="images"
                value={formData.images}
                onChange={handleChange}
                rows={3}
                placeholder="https://example.com/image1.jpg"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  fontSize: 15,
                  resize: 'vertical'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                外部链接
              </label>
              <input
                type="url"
                name="external_url"
                value={formData.external_url}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  fontSize: 15
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                标签 (逗号分隔)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="时尚，新款，热卖"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  fontSize: 15
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                在售
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                />
                推荐
              </label>
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '14px 32px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? '保存中...' : (isEdit ? '更新商品' : '创建商品')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/products')}
              style={{
                padding: '14px 32px',
                background: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              取消
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
