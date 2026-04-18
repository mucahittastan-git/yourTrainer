import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const Toast = ({ toast, onRemove }) => {
  const [progress, setProgress] = React.useState(100);
  const timeLeftRef = React.useRef(toast.duration);

  React.useEffect(() => {
    if (toast.duration <= 0 || !toast.isVisible) return;

    const interval = setInterval(() => {
      const newTime = Math.max(0, timeLeftRef.current - 100);
      timeLeftRef.current = newTime;
      const newProgress = (newTime / toast.duration) * 100;
      setProgress(newProgress);
    }, 100);

    return () => clearInterval(interval);
  }, [toast.duration, toast.isVisible]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  };

  const progressColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  const Icon = icons[toast.type] || Info;

  return (
    <div 
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className={`
        w-full max-w-sm sm:max-w-md
        ${colors[toast.type]} 
        border rounded-xl shadow-xl backdrop-blur-sm
        pointer-events-auto 
        transform transition-all duration-300 ease-in-out
        hover:shadow-2xl
        ${toast.isVisible 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
        }
      `}
    >
      {/* Progress Bar */}
      {toast.duration > 0 && (
        <div className="h-1 w-full bg-gray-200 rounded-t-xl overflow-hidden">
          <div 
            className={`h-full transition-all duration-100 ease-linear ${progressColors[toast.type]}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${iconColors[toast.type]}`} />
          </div>
          <div className="ml-3 flex-1 min-w-0">
            {toast.title && (
              <p className="text-sm font-semibold leading-5 break-words">{toast.title}</p>
            )}
            <p className={`text-sm leading-5 break-words ${toast.title ? 'mt-1' : ''}`}>
              {toast.message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={() => onRemove(toast.id)}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-md p-1 transition-colors duration-200"
              aria-label={`${toast.title || 'Bildirim'} - Kapat`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => 
      prev.map(toast => 
        toast.id === id ? { ...toast, isVisible: false } : toast
      )
    );

    // Animasyon tamamlandıktan sonra DOM'dan kaldır
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 350); // Biraz daha uzun süre bekle animasyon için
  }, []);

  // Toast sayısını sınırla (max 5 toast)
  const MAX_TOASTS = 5;
  
  React.useEffect(() => {
    if (toasts.length > MAX_TOASTS) {
      const oldestToast = toasts[0];
      removeToast(oldestToast.id);
    }
  }, [toasts, removeToast]);

  const addToast = useCallback((toastConfig) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      duration: 4000,
      ...toastConfig,
      isVisible: false
    };

    setToasts(prev => [...prev, newToast]);

    // Animasyon için kısa gecikme
    requestAnimationFrame(() => {
      setTimeout(() => {
        setToasts(prev => 
          prev.map(t => t.id === id ? { ...t, isVisible: true } : t)
        );
      }, 50);
    });

    // Otomatik kaldırma
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, [removeToast]);

  // Clear all toasts function
  const clearAllToasts = useCallback(() => {
    // Önce tüm toast'ları invisible yap
    setToasts(prev => prev.map(toast => ({ ...toast, isVisible: false })));
    
    // Sonra DOM'dan kaldır
    setTimeout(() => {
      setToasts([]);
    }, 350);
  }, []);

  // Kısayol fonksiyonları
  const toast = {
    success: (message, options = {}) => addToast({ 
      type: 'success', 
      message, 
      title: options.title || 'Başarılı!',
      duration: options.duration || 4000,
      ...options 
    }),
    error: (message, options = {}) => addToast({ 
      type: 'error', 
      message, 
      title: options.title || 'Hata!',
      duration: options.duration || 6000,
      ...options 
    }),
    warning: (message, options = {}) => addToast({ 
      type: 'warning', 
      message, 
      title: options.title || 'Uyarı!',
      duration: options.duration || 5000,
      ...options 
    }),
    info: (message, options = {}) => addToast({ 
      type: 'info', 
      message, 
      title: options.title || 'Bilgi',
      duration: options.duration || 4000,
      ...options 
    }),
    // Basit mesaj (title olmadan)
    show: (message, type = 'info', duration = 4000) => addToast({
      type,
      message,
      duration,
      title: null
    }),
    // Persistent toast (manuel kapatma gerekir)
    persistent: (message, type = 'info', options = {}) => addToast({
      type,
      message,
      duration: 0, // Otomatik kapanmaz
      title: options.title || null,
      ...options
    }),
    // Loading toast
    loading: (message, options = {}) => addToast({
      type: 'info',
      message,
      title: options.title || 'Yükleniyor...',
      duration: 0,
      ...options
    })
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearAllToasts, toast }}>
      {children}
      
      {/* Toast Container */}
      <div
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-sm"
        aria-label="Bildirimler"
        role="region"
      >
        {toasts.map((toastItem, index) => (
          <div
            key={toastItem.id}
            className="pointer-events-auto"
            style={{ zIndex: 9999 - index }}
          >
            <Toast toast={toastItem} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
