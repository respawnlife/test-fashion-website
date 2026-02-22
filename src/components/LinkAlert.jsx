import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './LinkAlert.css';

function LinkAlert({ url, children, className }) {
  const [showAlert, setShowAlert] = useState(false);
  const { t } = useTranslation();

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
            <h3>{t('linkAlert.title')}</h3>
            <p>{t('linkAlert.message')}</p>
            <p className="link-alert-url">{url}</p>
            <p className="link-alert-note">{t('linkAlert.note')}</p>
            <div className="link-alert-actions">
              <button className="btn-cancel" onClick={cancelLeave}>
                {t('linkAlert.cancel')}
              </button>
              <button className="btn-confirm" onClick={confirmLeave}>
                {t('linkAlert.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LinkAlert;
