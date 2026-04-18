import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-card border border-gray-200 rounded-xl shadow-sm p-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
