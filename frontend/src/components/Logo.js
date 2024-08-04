import React from 'react';

const Logo = ({ size = 'large' }) => {
  const sizeClass = size === 'large' ? 'w-80 h-80' : 'w-32 h-32';
  
  return (
    <div className={`${sizeClass} mx-auto`}>
      <img src="./logo.png" alt="Tarombo Logo" className="w-full h-full object-contain" />
    </div>
  );
};

export default Logo;