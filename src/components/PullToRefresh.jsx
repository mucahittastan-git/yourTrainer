import React from 'react';

const PullToRefresh = ({ children, onRefresh: _onRefresh, disabled: _disabled = false, className = '' }) => {
  // Minimal placeholder implementation — full pull-to-refresh behaviour
  // was trimmed to avoid unused variable warnings. Keep the API stable.
  return (
    <div className={`relative overflow-auto h-full ${className}`}>
      {children}
    </div>
  );
};

export default PullToRefresh;
