import React, { useState, useRef } from 'react';
import { Trash2, Edit, Phone, MessageCircle } from 'lucide-react';
import useSwipe from '../../hooks/useSwipe';
import useMobile from '../../hooks/useMobile';

const SwipeableCard = ({ 
  children, 
  onEdit, 
  onDelete, 
  onCall,
  onMessage,
  deleteThreshold = 100,
  className = '',
  disabled = false 
}) => {
  const { isMobile } = useMobile();
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [isActionTriggered, setIsActionTriggered] = useState(false);
  const cardRef = useRef(null);

  // Swipe logic using the enhanced hook
  const { handlers } = useSwipe({
    threshold: 30,
    trackTouch: true,
    trackMouse: false,
    onSwiping: (e, { deltaX }) => {
      if (disabled) return;
      
      // We only care about left swipe (negative deltaX) for actions
      if (deltaX < 0) {
        const distance = Math.abs(deltaX);
        setSwipeDistance(Math.min(distance, deleteThreshold + 60));
        
        // Trigger visual feedback if threshold is reached
        if (distance >= deleteThreshold && !isActionTriggered) {
          setIsActionTriggered(true);
          if (navigator.vibrate) navigator.vibrate(40);
        } else if (distance < deleteThreshold && isActionTriggered) {
          setIsActionTriggered(false);
        }
      } else {
        setSwipeDistance(0);
      }
    },
    onSwipeEnd: (e, { deltaX }) => {
      if (disabled) return;

      if (Math.abs(deltaX) >= deleteThreshold && onDelete) {
        // Option A: Auto-delete on full swipe
        // onDelete();
      }
      
      // Reset after a short delay to allow clicking action buttons
      // or if not triggered, reset immediately
      if (!isActionTriggered) {
        setSwipeDistance(0);
      }
    }
  });

  const handleActionClick = (actionFn, e) => {
    e.stopPropagation();
    actionFn();
    setSwipeDistance(0);
    setIsActionTriggered(false);
  };

  const handleCardClick = () => {
    if (swipeDistance > 20) {
      setSwipeDistance(0);
      setIsActionTriggered(false);
    }
  };

  // Don't enable swipe on desktop or when disabled
  if (!isMobile) {
    return (
      <div className={`mobile-card ${className}`}>
        {children}
      </div>
    );
  }

  const actions = [
    onCall && {
      icon: Phone,
      label: 'Ara',
      color: 'bg-blue-500',
      action: onCall
    },
    onMessage && {
      icon: MessageCircle,
      label: 'WP Masaj',
      color: 'bg-green-500',
      action: onMessage
    },
    onEdit && {
      icon: Edit,
      label: 'Düzenle',
      color: 'bg-orange-500',
      action: onEdit
    },
    onDelete && {
      icon: Trash2,
      label: 'Sil',
      color: 'bg-red-500',
      action: onDelete
    }
  ].filter(Boolean);

  return (
    <div className="relative overflow-hidden group">
      {/* Action Buttons Background */}
      <div className="absolute inset-y-0 right-0 flex items-center bg-gray-100 rounded-xl overflow-hidden">
        {actions.map((action, index) => {
          const Icon = action.icon;
          // Calculate individual button reveals
          const totalActions = actions.length;
          const buttonWidth = 64; // w-16 = 4rem = 64px
          const threshold = (index) * (buttonWidth / 2);
          const opacity = swipeDistance > threshold ? 1 : 0;
          
          return (
            <button
              key={index}
              onClick={(e) => handleActionClick(action.action, e)}
              className={`w-16 h-full flex flex-col items-center justify-center text-white text-xs font-medium transition-all duration-200 ${action.color} ${
                opacity ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Card */}
      <div
        ref={cardRef}
        {...handlers}
        onClick={handleCardClick}
        className={`mobile-card relative z-10 transition-transform duration-200 ${
          isActionTriggered ? 'border-red-300' : ''
        } ${className}`}
        style={{
          transform: `translateX(-${swipeDistance}px)`,
          transition: swipeDistance === 0 ? 'transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)' : 'none'
        }}
      >
        {children}
        
        {/* Swipe Indicator */}
        {swipeDistance > 20 && !isActionTriggered && (
          <div className="absolute top-2 right-2 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-primary-400" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SwipeableCard;
