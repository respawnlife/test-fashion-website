import React, { useState, useEffect } from 'react';

const API_BASE = '/api';

function Crawler() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    schedule: '',
    site_config: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/crawler/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setTasks(data.data?.tasks || []);
    } catch (error) {
      console.error('Fetch tasks error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/crawler/tasks/${taskId}/logs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setLogs(data.data?.logs || []);
    } catch (error) {
      console.error('Fetch logs error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/crawler/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (data.success) {
        setShowForm(false);
        setFormData({ name: '', url: '', schedule: '', site_config: '' });
        fetchTasks();
        alert('任务创建成功！\n\nrobots.txt 检查结果：' + data.data.robotsCheck.message);
      } else {
        alert('创建失败：' + data.message);
      }
    } catch (error) {
      console.error('Create task error:', error);
      alert('创建失败');
    }
  };

  const runTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE}/crawler/tasks/${taskId}/run`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('任务已启动，请在日志中查看进度');
      fetchTasks();
    } catch (error) {
      console.error('Run task error:', error);
      alert('启动失败');
    }
  };

  const deleteTask = async (taskId) => {
    if (!confirm('确定要删除这个任务吗？')) return;
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE}/crawler/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchTasks();
    } catch (error) {
      console.error('Delete task error:', error);
    }
  };

  const viewLogs = async (task) => {
    setSelectedTask(task);
    await fetchLogs(task.id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#27ae60';
      case 'running': return '#3498db';
      case 'failed': return '#e74c3c';
      case 'pending': return '#f39c12';
      default: return '#95a5a6';
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
        <h1 style={{ color: '#1a1a2e' }}>爬虫系统</h1>
        <button
          onClick={() => setShowForm(!showForm)}
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
          {showForm ? '取消' : '➕ 新建任务'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{
          background: 'white',
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          marginBottom: 24,
          maxWidth: 600
        }}>
          <h3 style={{ marginBottom: 16 }}>新建爬取任务</h3>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              任务名称 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
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
              目标 URL *
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={e => setFormData({ ...formData, url: e.target.value })}
              required
              placeholder="https://example.com/products"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: 8
              }}
            />
            <small style={{ color: '#666' }}>
              系统将自动检查 robots.txt 合规性
            </small>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              定时调度 (Cron 表达式)
            </label>
            <input
              type="text"
              value={formData.schedule}
              onChange={e => setFormData({ ...formData, schedule: e.target.value })}
              placeholder="0 0 * * * (每天午夜)"
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
            style={{
              padding: '12px 24px',
              background: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            创建任务
          </button>
        </form>
      )}

      <div style={{
        background: 'white',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        marginBottom: 24
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: 16, textAlign: 'left' }}>ID</th>
              <th style={{ padding: 16, textAlign: 'left' }}>名称</th>
              <th style={{ padding: 16, textAlign: 'left' }}>URL</th>
              <th style={{ padding: 16, textAlign: 'left' }}>状态</th>
              <th style={{ padding: 16, textAlign: 'left' }}>商品数</th>
              <th style={{ padding: 16, textAlign: 'left' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: 16 }}>{task.id}</td>
                <td style={{ padding: 16 }}>{task.name}</td>
                <td style={{ padding: 16, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {task.url}
                </td>
                <td style={{ padding: 16 }}>
                  <span style={{
                    padding: '4px 12px',
                    background: getStatusColor(task.status),
                    color: 'white',
                    borderRadius: 12,
                    fontSize: 13
                  }}>
                    {task.status}
                  </span>
                </td>
                <td style={{ padding: 16 }}>{task.products_found || 0}</td>
                <td style={{ padding: 16 }}>
                  <button
                    onClick={() => runTask(task.id)}
                    disabled={task.status === 'running'}
                    style={{
                      padding: '6px 12px',
                      background: task.status === 'running' ? '#95a5a6' : '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      cursor: task.status === 'running' ? 'not-allowed' : 'pointer',
                      marginRight: 8
                    }}
                  >
                    ▶ 运行
                  </button>
                  <button
                    onClick={() => viewLogs(task)}
                    style={{
                      padding: '6px 12px',
                      background: '#9b59b6',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer',
                      marginRight: 8
                    }}
                  >
                    📋 日志
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
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
        {tasks.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>
            暂无爬虫任务
          </div>
        )}
      </div>

      {selectedTask && (
        <div style={{
          background: 'white',
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16
          }}>
            <h3>任务日志：{selectedTask.name}</h3>
            <button
              onClick={() => { setSelectedTask(null); setLogs([]); }}
              style={{
                padding: '6px 12px',
                background: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer'
              }}
            >
              关闭
            </button>
          </div>
          <div style={{
            background: '#1a1a2e',
            color: '#0f0',
            padding: 16,
            borderRadius: 8,
            fontFamily: 'monospace',
            fontSize: 13,
            maxHeight: 400,
            overflow: 'auto'
          }}>
            {logs.map((log, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <span style={{ color: '#666' }}>[{new Date(log.created_at).toLocaleString()}]</span>
                {' '}
                <span style={{
                  color: log.level === 'error' ? '#e74c3c' : log.level === 'warning' ? '#f39c12' : '#0f0'
                }}>
                  [{log.level.toUpperCase()}]
                </span>
                {' '}
                {log.message}
              </div>
            ))}
            {logs.length === 0 && <div>暂无日志</div>}
          </div>
        </div>
      )}

      <div style={{
        marginTop: 24,
        padding: 20,
        background: '#e3f2fd',
        borderRadius: 8,
        border: '1px solid #2196f3'
      }}>
        <strong>📌 爬虫合规说明:</strong>
        <ul style={{ marginTop: 8, marginLeft: 20, lineHeight: 1.8 }}>
          <li>系统会自动检查目标网站的 robots.txt 文件</li>
          <li>仅爬取允许公开访问的页面</li>
          <li>设置合理的爬取延迟，避免对目标网站造成压力</li>
          <li>请确保爬取行为符合当地法律法规</li>
          <li>建议仅爬取提供 API 或明确允许爬取的商业网站</li>
        </ul>
      </div>
    </div>
  );
}

export default Crawler;
