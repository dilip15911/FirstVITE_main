import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        {type === 'error' && <span className="toast-icon">⚠️</span>}
        {type === 'success' && <span className="toast-icon">✅</span>}
        {type === 'info' && <span className="toast-icon">ℹ️</span>}
        <p>{message}</p>
      </div>
      <button onClick={onClose} className="toast-close">×</button>
    </div>
  );
};

export default Toast;
