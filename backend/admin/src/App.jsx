import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Crawler from './pages/Crawler';
import Users from './pages/Users';
import Settings from './pages/Settings';

const API_BASE = '/api';

// Auth context
const AuthContext = React.createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Fetch user error:', error);
    }
  };

  const login = async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('token', data.data.token);
      setToken(data.data.token);
      setUser(data.data.user);
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function PrivateRoute({ children }) {
  const { token } = React.useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}

function Layout({ children }) {
  const { user, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/dashboard', label: '仪表盘', icon: '📊' },
    { path: '/products', label: '商品管理', icon: '🛍️' },
    { path: '/crawler', label: '爬虫系统', icon: '🕷️' },
    { path: '/users', label: '用户管理', icon: '👥' },
    { path: '/settings', label: '设置', icon: '⚙️' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 240 : 64,
        background: '#1a1a2e',
        color: 'white',
        transition: 'width 0.3s',
        overflow: 'hidden'
      }}>
        <div style={{ padding: 20, borderBottom: '1px solid #2d2d44' }}>
          <h2 style={{ fontSize: 18 }}>{sidebarOpen ? '时尚后台' : '👗'}</h2>
        </div>
        <nav style={{ padding: 10 }}>
          {menuItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                color: 'white',
                textAlign: 'left',
                cursor: 'pointer',
                borderRadius: 8,
                marginBottom: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}
              onMouseOver={e => e.target.style.background = '#2d2d44'}
              onMouseOut={e => e.target.style.background = 'transparent'}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{
          background: 'white',
          padding: '16px 24px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer'
            }}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span>{user?.username}</span>
            <button
              onClick={logout}
              style={{
                padding: '8px 16px',
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer'
              }}
            >
              退出登录
            </button>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: 24 }}>
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/products" element={<PrivateRoute><Layout><Products /></Layout></PrivateRoute>} />
          <Route path="/products/new" element={<PrivateRoute><Layout><ProductForm /></Layout></PrivateRoute>} />
          <Route path="/products/:id/edit" element={<PrivateRoute><Layout><ProductForm /></Layout></PrivateRoute>} />
          <Route path="/crawler" element={<PrivateRoute><Layout><Crawler /></Layout></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute><Layout><Users /></Layout></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Layout><Settings /></Layout></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
