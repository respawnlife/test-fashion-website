import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = '/api';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = filter === 'all' 
        ? `${API_BASE}/products?limit=100`
        : `${API_BASE}/products?${filter}=true&limit=100`;
      
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setProducts(data.data?.products || []);
    } catch (error) {
      console.error('Fetch products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE}/products/${id}/active`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      fetchProducts();
    } catch (error) {
      console.error('Toggle active error:', error);
    }
  };

  const toggleFeatured = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE}/products/${id}/featured`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_featured: !currentStatus })
      });
      fetchProducts();
    } catch (error) {
      console.error('Toggle featured error:', error);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('确定要删除这个商品吗？')) return;
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchProducts();
    } catch (error) {
      console.error('Delete product error:', error);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>加载中...</div>;
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
      }}>
        <h1 style={{ color: '#1a1a2e' }}>商品管理</h1>
        <button
          onClick={() => navigate('/products/new')}
          style={{
            padding: '12px 24px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          ➕ 添加商品
        </button>
      </div>

      <div style={{
        display: 'flex',
        gap: 12,
        marginBottom: 24,
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="搜索商品..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '10px 16px',
            border: '1px solid #ddd',
            borderRadius: 8,
            minWidth: 200
          }}
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{
            padding: '10px 16px',
            border: '1px solid #ddd',
            borderRadius: 8
          }}
        >
          <option value="all">全部</option>
          <option value="featured">推荐</option>
        </select>
      </div>

      <div style={{
        background: 'white',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: 16, textAlign: 'left' }}>ID</th>
              <th style={{ padding: 16, textAlign: 'left' }}>图片</th>
              <th style={{ padding: 16, textAlign: 'left' }}>名称</th>
              <th style={{ padding: 16, textAlign: 'left' }}>分类</th>
              <th style={{ padding: 16, textAlign: 'left' }}>价格</th>
              <th style={{ padding: 16, textAlign: 'left' }}>状态</th>
              <th style={{ padding: 16, textAlign: 'left' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: 16 }}>{product.id}</td>
                <td style={{ padding: 16 }}>
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }}
                    />
                  )}
                </td>
                <td style={{ padding: 16 }}>{product.name}</td>
                <td style={{ padding: 16 }}>
                  <span style={{
                    padding: '4px 12px',
                    background: '#e3f2fd',
                    color: '#1976d2',
                    borderRadius: 12,
                    fontSize: 13
                  }}>
                    {product.category}
                  </span>
                </td>
                <td style={{ padding: 16 }}>¥{product.price}</td>
                <td style={{ padding: 16 }}>
                  <span style={{
                    padding: '4px 12px',
                    background: product.is_active ? '#e8f5e9' : '#ffebee',
                    color: product.is_active ? '#2e7d32' : '#c62828',
                    borderRadius: 12,
                    fontSize: 13
                  }}>
                    {product.is_active ? '在售' : '下架'}
                  </span>
                  {product.is_featured && (
                    <span style={{
                      marginLeft: 8,
                      padding: '4px 12px',
                      background: '#fff3e0',
                      color: '#f57c00',
                      borderRadius: 12,
                      fontSize: 13
                    }}>
                      ⭐ 推荐
                    </span>
                  )}
                </td>
                <td style={{ padding: 16 }}>
                  <button
                    onClick={() => navigate(`/products/${product.id}/edit`)}
                    style={{
                      padding: '6px 12px',
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer',
                      marginRight: 8
                    }}
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => toggleActive(product.id, product.is_active)}
                    style={{
                      padding: '6px 12px',
                      background: product.is_active ? '#95a5a6' : '#27ae60',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer',
                      marginRight: 8
                    }}
                  >
                    {product.is_active ? '下架' : '上架'}
                  </button>
                  <button
                    onClick={() => toggleFeatured(product.id, product.is_featured)}
                    style={{
                      padding: '6px 12px',
                      background: product.is_featured ? '#95a5a6' : '#f39c12',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer',
                      marginRight: 8
                    }}
                  >
                    {product.is_featured ? '取消推荐' : '推荐'}
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer'
                    }}
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>
            暂无商品
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
