import React from 'react';

const TaxIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#ffffff' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
        <path d="M8 8h5a2 2 0 0 1 0 4H8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 12h6a2 2 0 0 1 0 4H8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="11" y1="6" x2="11" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="11" y1="16" x2="11" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export default TaxIcon;
