import React from 'react';

export const ToastItem = ({ message, type = 'info', onClose }) => {
  const colorClass =
    type === 'success' ? 'bg-green-50 text-green-800' :
    type === 'danger' ? 'bg-red-50 text-red-800' :
    type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
    'bg-blue-50 text-blue-800';

  return (
    <div className={`toast-item ${colorClass} p-3 rounded-lg shadow-md flex items-start justify-between space-x-4`}>
      <div className="flex-1 text-sm">{message}</div>
      {onClose && (
        <button onClick={onClose} aria-label="Kapat" className="ml-4 text-sm text-gray-600 hover:text-gray-800">✕</button>
      )}
    </div>
  );
};

export const ToastContainer = ({ children }) => {
  return (
    <div className="toast-container z-toast">
      <div className="space-y-3">{children}</div>
    </div>
  );
};

export default ToastContainer;
