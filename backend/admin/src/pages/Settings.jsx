import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';

const API_BASE = '/api';

function Settings() {
  const { user } = useContext(AuthContext);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: '两次输入的新密码不一致' });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage({ type: 'error', text: '新密码至少 6 位' });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/auth/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: '密码修改成功' });
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: data.message || '修改失败' });
      }
    } catch (error) {
      console.error('Change password error:', error);
      setMessage({ type: 'error', text: '修改失败' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: '#1a1a2e' }}>设置</h1>

      <div style={{
        background: 'white',
        padding: 24,
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        maxWidth: 600,
        marginBottom: 24
      }}>
        <h3 style={{ marginBottom: 16 }}>账户信息</h3>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, color: '#666' }}>
            用户名
          </label>
          <div style={{ padding: '12px 16px', background: '#f8f9fa', borderRadius: 8 }}>
            {user?.username}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, color: '#666' }}>
            角色
          </label>
          <div style={{ padding: '12px 16px', background: '#f8f9fa', borderRadius: 8 }}>
            <span style={{
              padding: '4px 12px',
              background: user?.role === 'admin' ? '#f3e5f5' : '#e3f2fd',
              color: user?.role === 'admin' ? '#7b1fa2' : '#1976d2',
              borderRadius: 12,
              fontSize: 13
            }}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      <div style={{
        background: 'white',
        padding: 24,
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        maxWidth: 600
      }}>
        <h3 style={{ marginBottom: 16 }}>修改密码</h3>

        {message.text && (
          <div style={{
            padding: '12px 16px',
            background: message.type === 'success' ? '#e8f5e9' : '#fee',
            color: message.type === 'success' ? '#2e7d32' : '#c00',
            borderRadius: 8,
            marginBottom: 20
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleChangePassword}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              当前密码
            </label>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: 8
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              新密码
            </label>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: 8
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              确认新密码
            </label>
            <input
              type="password"
              value={passwords.confirmPassword}
              onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: 8
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? '修改中...' : '修改密码'}
          </button>
        </form>
      </div>

      <div style={{
        marginTop: 24,
        padding: 20,
        background: '#fff3cd',
        borderRadius: 8,
        border: '1px solid #ffc107'
      }}>
        <strong>⚠️ 安全提示:</strong>
        <ul style={{ marginTop: 8, marginLeft: 20, lineHeight: 1.8 }}>
          <li>请定期更换密码以确保账户安全</li>
          <li>不要使用过于简单的密码</li>
          <li>不要在多个网站使用相同密码</li>
          <li>离开电脑时请记得退出登录</li>
        </ul>
      </div>

      <div style={{
        marginTop: 24,
        padding: 20,
        background: '#e3f2fd',
        borderRadius: 8,
        border: '1px solid #2196f3'
      }}>
        <strong>📚 API 文档:</strong>
        <p style={{ marginTop: 8 }}>
          访问 <a href="/api" target="_blank" style={{ color: '#1976d2' }}>/api</a> 查看完整的 API 接口文档
        </p>
      </div>
    </div>
  );
}

export default Settings;
