
import React from 'react';

const NeumorphicCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 rounded-2xl bg-gray-100 shadow-[7px_7px_15px_#bebebe,_-7px_-7px_15px_#ffffff] transition-all duration-300 ease-in-out ${className}`}>
    {children}
  </div>
);

export default NeumorphicCard;
