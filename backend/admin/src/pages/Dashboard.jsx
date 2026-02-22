import React, { useState, useEffect } from 'react';

const API_BASE = '/api';

function StatCard({ title, value, icon, color }) {
  return (
    <div style={{
      background: 'white',
      padding: 24,
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 12,
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 28
      }}>
        {icon}
      </div>
      <div>
        <div style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a2e' }}>{value}</div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    activeProducts: 0,
    featuredProducts: 0,
    crawlerTasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [productsRes, tasksRes] = await Promise.all([
        fetch(`${API_BASE}/products?limit=1`, { headers }),
        fetch(`${API_BASE}/crawler/tasks`, { headers })
      ]);

      const productsData = await productsRes.json();
      const tasksData = await tasksRes.json();

      setStats({
        products: productsData.data?.pagination?.total || 0,
        activeProducts: productsData.data?.products?.filter(p => p.is_active)?.length || 0,
        featuredProducts: productsData.data?.products?.filter(p => p.is_featured)?.length || 0,
        crawlerTasks: tasksData.data?.tasks?.length || 0
      });
    } catch (error) {
      console.error('Fetch stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>加载中...</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: '#1a1a2e' }}>仪表盘</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 24,
        marginBottom: 32
      }}>
        <StatCard
          title="商品总数"
          value={stats.products}
          icon="🛍️"
          color="#e3f2fd"
        />
        <StatCard
          title="在售商品"
          value={stats.activeProducts}
          icon="✅"
          color="#e8f5e9"
        />
        <StatCard
          title="推荐商品"
          value={stats.featuredProducts}
          icon="⭐"
          color="#fff3e0"
        />
        <StatCard
          title="爬虫任务"
          value={stats.crawlerTasks}
          icon="🕷️"
          color="#f3e5f5"
        />
      </div>

      <div style={{
        background: 'white',
        padding: 24,
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{ marginBottom: 16, color: '#1a1a2e' }}>快速操作</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={() => window.location.href = '/products/new'}
            style={{
              padding: '12px 24px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            ➕ 添加商品
          </button>
          <button
            onClick={() => window.location.href = '/crawler'}
            style={{
              padding: '12px 24px',
              background: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            🕷️ 管理爬虫
          </button>
          <button
            onClick={fetchStats}
            style={{
              padding: '12px 24px',
              background: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            🔄 刷新数据
          </button>
        </div>
      </div>

      <div style={{
        marginTop: 24,
        padding: 20,
        background: '#fff3cd',
        borderRadius: 8,
        border: '1px solid #ffc107'
      }}>
        <strong>💡 提示:</strong> 首次使用请前往爬虫系统添加商品源，或手动添加商品信息。
      </div>
    </div>
  );
}

export default Dashboard;
