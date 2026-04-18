import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, X } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, title, message, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Otomatik kapanma
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative bg-white rounded-2xl shadow-2xl transform transition-all duration-300 max-w-md w-full ${
            isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="btn-icon absolute top-4 right-4 w-8 h-8 rounded-lg"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Content */}
          <div className="p-8 text-center">
            {/* Success Icon with Animation */}
            <div className="mx-auto mb-6">
              <div className={`w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center transition-all duration-500 ${
                isVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
              }`}>
                <CheckCircle className={`h-12 w-12 text-green-600 transition-all duration-700 delay-200 ${
                  isVisible ? 'scale-100' : 'scale-0'
                }`} />
              </div>
            </div>

            {/* Title */}
            <h3 className={`text-xl font-bold text-gray-900 mb-3 transition-all duration-500 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              {title}
            </h3>

            {/* Message */}
            <p className={`text-gray-600 mb-6 transition-all duration-500 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              {message}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
              <div 
                className={`bg-green-600 h-1 rounded-full transition-all duration-300 ease-linear ${
                  isVisible ? 'animate-progress-countdown' : 'w-full'
                }`}
                style={{
                  animationDuration: isVisible ? `${duration}ms` : 'none'
                }}
              />
            </div>

            {/* Action Button */}
            <button
              onClick={handleClose}
              className={`btn-success w-full py-3 px-6 rounded-xl font-black text-sm transition-all duration-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              Tamam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
