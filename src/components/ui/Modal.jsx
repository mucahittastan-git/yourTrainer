import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ open, onClose, title, children }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black bg-opacity-40" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="relative bg-white rounded-xl shadow-lg max-w-2xl w-full mx-auto p-6 z-10">
        <div className="flex items-start justify-between">
          {title ? <h2 id="modal-title" className="text-lg font-semibold text-gray-900">{title}</h2> : null}
          <button onClick={onClose} aria-label="Kapat" className="text-gray-500 hover:text-gray-700">×</button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
