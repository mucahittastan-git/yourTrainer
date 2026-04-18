import React, { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import useMobile from '../../hooks/useMobile';

const FloatingActionButton = ({ 
  actions = [], 
  mainAction: _mainAction,
  position: _position = 'bottom-right',
  disabled = false,
  className = '' 
}) => {
  // ✅ ALL HOOKS FIRST - Before any conditional returns
  const { isMobile } = useMobile();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const fabRef = useRef(null);

  // Close on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isExpanded) {
        setIsExpanded(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isExpanded]);

  // ✅ CONDITIONAL RETURNS AFTER ALL HOOKS
  // Don't show on desktop or when no actions
  if (!isMobile || actions.length === 0) {
    return null;
  }

  const handleMainClick = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsExpanded(!isExpanded);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const handleActionClick = (action) => {
    if (isAnimating) return;
    
    setIsExpanded(false);
    setTimeout(() => {
      action.onClick();
    }, 150);
  };

  const handleBackdropClick = () => {
    setIsExpanded(false);
  };

  return (
    <>
      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300 backdrop-blur-sm"
          onClick={handleBackdropClick}
        />
      )}

      {/* FAB Container */}
      <div 
        ref={fabRef}
        className={`fixed bottom-24 right-6 z-50 ${className}`}
      >
        {/* Action Menu */}
        <div className={`absolute bottom-16 right-0 transform transition-all duration-300 origin-bottom-right ${
          isExpanded ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}>
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 min-w-[200px]">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleActionClick(action)}
                  disabled={disabled || isAnimating}
                  className={`
                    w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200
                    hover:bg-gray-50 active:bg-gray-100 touch-manipulation
                    transform hover:scale-105 active:scale-95
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${isExpanded ? 'animate-slide-up' : ''}
                  `}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${action.color || 'bg-primary-100'} ${action.textColor || 'text-primary-600'}
                  `}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-gray-900 text-sm">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main FAB Button */}
        <button
          onClick={handleMainClick}
          disabled={disabled || isAnimating}
          className={`
            btn-fab group relative overflow-hidden
            ${isExpanded ? 'scale-110 shadow-2xl' : 'scale-100'}
            ${isAnimating ? 'pointer-events-none' : ''}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {/* Background Gradient */}
          <div className={`
            absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 
            transition-all duration-300 ${isExpanded ? 'scale-110' : 'scale-100'}
          `} />
          
          {/* Icon Container */}
          <div className="relative z-10 flex items-center justify-center">
            <Plus className={`
              h-6 w-6 transition-all duration-300 transform
              ${isExpanded ? 'rotate-45 scale-110' : 'rotate-0 scale-100'}
            `} />
          </div>

          {/* Ripple Effect */}
          <div className={`
            absolute inset-0 bg-white bg-opacity-20 rounded-full transform
            transition-all duration-300 ${isExpanded ? 'scale-150 opacity-0' : 'scale-0 opacity-100'}
          `} />

          {/* Pulse Animation */}
          {!isExpanded && (
            <div className="absolute inset-0 rounded-full bg-primary-400 animate-ping opacity-75" />
          )}
        </button>

        {/* Quick Label (appears on first load) */}
        {!isExpanded && (
          <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
              Hızlı İşlemler
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FloatingActionButton;
