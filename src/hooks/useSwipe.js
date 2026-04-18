import { useState, useRef, useCallback } from 'react';

/**
 * Enhanced swipe gesture detection hook with real-time callbacks
 * @param {Object} options Swipe configuration options
 * @returns {Object} Swipe handlers and state
 */
const useSwipe = (options = {}) => {
  const {
    onSwiping = () => {},
    onSwipeEnd = () => {},
    onSwipeLeft = () => {},
    onSwipeRight = () => {},
    threshold = 50,
    trackTouch = true,
    trackMouse = false
  } = options;

  const [isSwiping, setIsSwiping] = useState(false);
  const touchStart = useRef({ x: 0, y: 0, time: 0 });
  const lastDelta = useRef({ x: 0, y: 0 });

  const onStart = useCallback((clientX, clientY) => {
    touchStart.current = {
      x: clientX,
      y: clientY,
      time: Date.now()
    };
    lastDelta.current = { x: 0, y: 0 };
    setIsSwiping(true);
  }, []);

  const onMove = useCallback((clientX, clientY, e) => {
    if (!isSwiping) return;
    
    const deltaX = clientX - touchStart.current.x;
    const deltaY = clientY - touchStart.current.y;
    lastDelta.current = { x: deltaX, y: deltaY };

    // Real-time callback
    onSwiping(e, { deltaX, deltaY });

    // Prevent default to avoid scrolling while swiping horizontally
    if (Math.abs(deltaX) > Math.abs(deltaY) && e.cancelable) {
      // e.preventDefault(); // Handled by caller to avoid violation warnings if not passive
    }
  }, [isSwiping, onSwiping]);

  const onEnd = useCallback((e) => {
    if (!isSwiping) return;
    
    const { x: deltaX, y: deltaY } = lastDelta.current;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    // Generic end callback
    onSwipeEnd(e, { deltaX, deltaY });

    // Trigger directional callbacks if above threshold
    if (absX > threshold || absY > threshold) {
      if (absX > absY) {
        if (deltaX > 0) onSwipeRight();
        else onSwipeLeft();
      }
    }
    
    setIsSwiping(false);
  }, [isSwiping, onSwipeEnd, onSwipeLeft, onSwipeRight, threshold]);

  // Event handlers for React elements
  const handlers = {
    ...(trackTouch ? {
      onTouchStart: (e) => onStart(e.touches[0].clientX, e.touches[0].clientY),
      onTouchMove: (e) => onMove(e.touches[0].clientX, e.touches[0].clientY, e),
      onTouchEnd: (e) => onEnd(e)
    } : {}),
    ...(trackMouse ? {
      onMouseDown: (e) => onStart(e.clientX, e.clientY),
      onMouseMove: (e) => onMove(e.clientX, e.clientY, e),
      onMouseUp: (e) => onEnd(e),
      onMouseLeave: (e) => isSwiping && onEnd(e)
    } : {})
  };

  return {
    handlers,
    isSwiping,
    delta: lastDelta.current
  };
};

export default useSwipe;
