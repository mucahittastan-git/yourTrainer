import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Pull-to-refresh hook for mobile interfaces
 * @param {Function} onRefresh Function to call when refresh is triggered
 * @param {Object} options Configuration options
 * @returns {Object} Pull-to-refresh state and handlers
 */
const usePullToRefresh = (onRefresh, options = {}) => {
  const {
    threshold = 80,
    disabled = false,
    maxPullDistance = 150,
    refreshTimeout = 2000
  } = options;

  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [canRefresh, setCanRefresh] = useState(false);

  const elementRef = useRef(null);
  const touchStartY = useRef(0);
  const touchCurrentY = useRef(0);
  const isDragging = useRef(false);

  // Check if we can start pulling (at top of scroll)
  const canStartPull = useCallback(() => {
    if (disabled) return false;
    
    const element = elementRef.current;
    if (!element) return false;
    
    // Check if we're at the top of the scrollable area
    return element.scrollTop === 0;
  }, [disabled]);

  // Handle touch start
  const handleTouchStart = useCallback((e) => {
    if (!canStartPull()) return;
    
    touchStartY.current = e.touches[0].clientY;
    touchCurrentY.current = e.touches[0].clientY;
    isDragging.current = false;
  }, [canStartPull]);

  // Handle touch move
  const handleTouchMove = useCallback((e) => {
    if (disabled || isRefreshing) return;
    
    touchCurrentY.current = e.touches[0].clientY;
    const deltaY = touchCurrentY.current - touchStartY.current;
    
    // Only start pulling if we're moving downward and at top
    if (deltaY > 0 && canStartPull()) {
      isDragging.current = true;
      setIsPulling(true);
      
      // Calculate pull distance with resistance
      const resistance = 0.5;
      const distance = Math.min(deltaY * resistance, maxPullDistance);
      setPullDistance(distance);
      
      // Check if we've pulled far enough to trigger refresh
      setCanRefresh(distance >= threshold);
      
      // Prevent default scroll behavior when pulling
      e.preventDefault();
    }
  }, [disabled, isRefreshing, canStartPull, threshold, maxPullDistance]);

  // Handle touch end
  const handleTouchEnd = useCallback(async () => {
    if (!isDragging.current || isRefreshing) return;
    
    isDragging.current = false;
    setIsPulling(false);
    
    if (canRefresh && onRefresh) {
      setIsRefreshing(true);
      setCanRefresh(false);
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        // Minimum refresh time for better UX
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, Math.max(500, refreshTimeout));
      }
    } else {
      // Animate back to original position
      setPullDistance(0);
      setCanRefresh(false);
    }
  }, [canRefresh, onRefresh, isRefreshing, refreshTimeout]);

  // Attach event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element || disabled) return;

    const options = { passive: false };
    
    element.addEventListener('touchstart', handleTouchStart, options);
    element.addEventListener('touchmove', handleTouchMove, options);
    element.addEventListener('touchend', handleTouchEnd, options);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, disabled]);

  // Reset states when disabled
  useEffect(() => {
    if (disabled) {
      setIsPulling(false);
      setIsRefreshing(false);
      setPullDistance(0);
      setCanRefresh(false);
    }
  }, [disabled]);

  // Calculate progress percentage
  const progress = Math.min((pullDistance / threshold) * 100, 100);

  return {
    ref: elementRef,
    isPulling,
    isRefreshing,
    pullDistance,
    canRefresh,
    progress,
    // Inline styles for pull indicator
    pullIndicatorStyle: {
      transform: `translateY(${pullDistance}px)`,
      opacity: isPulling ? 1 : 0,
      transition: isPulling ? 'none' : 'all 0.3s ease-out'
    },
    // Container style with transform
    containerStyle: {
      transform: `translateY(${isPulling ? pullDistance : 0}px)`,
      transition: isPulling ? 'none' : 'transform 0.3s ease-out'
    }
  };
};

export default usePullToRefresh;
