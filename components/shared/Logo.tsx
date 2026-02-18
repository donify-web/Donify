import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-6 h-6" }) => {
  return (
    <img
      src="/donify_logo.jpg"
      alt="Donify Logo"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};