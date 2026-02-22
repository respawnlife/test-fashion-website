import { useState } from 'react';
import './LinkAlert.css';

function LinkAlert({ url, children, className }) {
  const [showAlert, setShowAlert] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setShowAlert(true);
  };

  const confirmLeave = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowAlert(false);
  };

  const cancelLeave = () => {
    setShowAlert(false);
  };

  return (
    <>
      <a 
        href={url} 
        onClick={handleClick}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>

      {showAlert && (
        <div className="link-alert-overlay" onClick={cancelLeave}>
          <div className="link-alert-modal" onClick={(e) => e.stopPropagation()}>
            <div className="link-alert-icon">⚠️</div>
            <h3>即将离开本站</h3>
            <p>您即将跳转到外部网站：</p>
            <p className="link-alert-url">{url}</p>
            <p className="link-alert-note">请注意个人信息和财产安全</p>
            <div className="link-alert-actions">
              <button className="btn-cancel" onClick={cancelLeave}>
                取消
              </button>
              <button className="btn-confirm" onClick={confirmLeave}>
                继续访问
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LinkAlert;
