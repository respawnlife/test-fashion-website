import React, { useState, useEffect } from 'react';

const API_BASE = '/api';

function Users() {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data.data?.users || []);
    } catch (error) {
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/users/logs/admin`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setLogs(data.data?.logs || []);
    } catch (error) {
      console.error('Fetch logs error:', error);
    }
  };

  const toggleActive = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      fetchUsers();
    } catch (error) {
      console.error('Toggle user error:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('确定要删除这个用户吗？')) return;
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE}/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchUsers();
    } catch (error) {
      console.error('Delete user error:', error);
    }
  };

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
        <h1 style={{ color: '#1a1a2e' }}>用户管理</h1>
        <button
          onClick={() => setShowLogs(!showLogs)}
          style={{
            padding: '12px 24px',
            background: '#9b59b6',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          {showLogs ? '隐藏日志' : '📋 查看操作日志'}
        </button>
      </div>

      {showLogs && (
        <div style={{
          background: 'white',
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          marginBottom: 24
        }}>
          <h3 style={{ marginBottom: 16 }}>管理员操作日志</h3>
          <div style={{ maxHeight: 300, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: 12, textAlign: 'left' }}>时间</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>管理员</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>操作</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>详情</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} style={{ borderTop: '1px solid #eee' }}>
                    <td style={{ padding: 12 }}>
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td style={{ padding: 12 }}>{log.username || '系统'}</td>
                    <td style={{ padding: 12 }}>
                      <span style={{
                        padding: '4px 8px',
                        background: '#e3f2fd',
                        color: '#1976d2',
                        borderRadius: 4,
                        fontSize: 12
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: 12, fontSize: 13, color: '#666' }}>
                      {log.entity_type}: {log.entity_id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
              <th style={{ padding: 16, textAlign: 'left' }}>用户名</th>
              <th style={{ padding: 16, textAlign: 'left' }}>邮箱</th>
              <th style={{ padding: 16, textAlign: 'left' }}>角色</th>
              <th style={{ padding: 16, textAlign: 'left' }}>状态</th>
              <th style={{ padding: 16, textAlign: 'left' }}>注册时间</th>
              <th style={{ padding: 16, textAlign: 'left' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: 16 }}>{user.id}</td>
                <td style={{ padding: 16, fontWeight: 500 }}>{user.username}</td>
                <td style={{ padding: 16 }}>{user.email || '-'}</td>
                <td style={{ padding: 16 }}>
                  <span style={{
                    padding: '4px 12px',
                    background: user.role === 'admin' ? '#f3e5f5' : '#e3f2fd',
                    color: user.role === 'admin' ? '#7b1fa2' : '#1976d2',
                    borderRadius: 12,
                    fontSize: 13
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: 16 }}>
                  <span style={{
                    padding: '4px 12px',
                    background: user.is_active ? '#e8f5e9' : '#ffebee',
                    color: user.is_active ? '#2e7d32' : '#c62828',
                    borderRadius: 12,
                    fontSize: 13
                  }}>
                    {user.is_active ? '活跃' : '禁用'}
                  </span>
                </td>
                <td style={{ padding: 16 }}>
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: 16 }}>
                  <button
                    onClick={() => toggleActive(user.id, user.is_active)}
                    style={{
                      padding: '6px 12px',
                      background: user.is_active ? '#95a5a6' : '#27ae60',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer',
                      marginRight: 8
                    }}
                  >
                    {user.is_active ? '禁用' : '启用'}
                  </button>
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => deleteUser(user.id)}
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
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>
            暂无用户
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;
