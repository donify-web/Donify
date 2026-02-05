import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-6 h-6" }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="currentColor" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Supporting Hands (Bottom) */}
      <path d="M20,130 C20,175 60,190 100,190 C140,190 180,175 180,130 L160,130 C160,155 130,170 100,170 C70,170 40,155 40,130 Z" />
      
      {/* Jar */}
      <path d="M65,95 L65,145 C65,155 135,155 135,145 L135,95 Z" />
      <rect x="55" y="80" width="90" height="15" rx="4" />
      
      {/* Coin */}
      <circle cx="100" cy="50" r="16" />
      
      {/* Hand Dropping Coin (Top Right) */}
      <path d="M115,50 C135,30 165,25 185,35 L190,55 C170,55 140,75 120,65 Z" />
    </svg>
  );
};