import React from 'react';

export const Logo: React.FC<{ className?: string; size?: number }> = ({ className, size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="brand-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F72585" />
        <stop offset="100%" stopColor="#00F5D4" />
      </linearGradient>
    </defs>
    
    <rect x="9" y="3" width="34" height="46" rx="6" stroke="url(#brand-gradient)" strokeWidth="3"/>
    <circle cx="26" cy="42" r="2" stroke="url(#brand-gradient)" strokeWidth="2.5"/>
    <path d="M18 32V25" stroke="url(#brand-gradient)" strokeWidth="3" strokeLinecap="round"/>
    <path d="M26 32V20" stroke="url(#brand-gradient)" strokeWidth="3" strokeLinecap="round"/>
    <path d="M34 32V27" stroke="url(#brand-gradient)" strokeWidth="3" strokeLinecap="round"/>
    <path d="M16 22L24 16L29 20L36 14" stroke="url(#brand-gradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M32 14H36V18" stroke="url(#brand-gradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);