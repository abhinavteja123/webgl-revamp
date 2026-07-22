import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const sizes = {
  small: 24,
  medium: 32,
  large: 48,
};

const Logo: React.FC<LogoProps> = ({ size = 'medium', className = '' }) => {
  const dimension = sizes[size];

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e27533" />
          <stop offset="100%" stopColor="#f28c38" />
        </linearGradient>
        <filter id="logoGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#e27533" floodOpacity="0.25" />
        </filter>
      </defs>
      {/* Background rounded square with gradient and subtle drop shadow */}
      <rect
        x="8"
        y="8"
        width="240"
        height="240"
        rx="52"
        fill="url(#logoGrad)"
        filter="url(#logoGlow)"
      />
      
      {/* High-fidelity abstract 'b' formed by node streams */}
      <g stroke="#FFFFFF" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round">
        {/* Left vertical trunk line */}
        <path d="M85 70V186" />
        {/* Upper network loop (interconnected nodes) */}
        <path d="M85 128H115C140 128 150 105 145 92C140 80 125 70 100 70H85" strokeWidth="18" />
        {/* Lower network loop (interconnected nodes) */}
        <path d="M85 128H125C155 128 170 148 165 162C160 176 140 186 110 186H85" />
      </g>
      {/* Central routing node points */}
      <circle cx="85" cy="128" r="8" fill="#e27533" stroke="#FFFFFF" strokeWidth="6" />
      <circle cx="110" cy="70" r="8" fill="#e27533" stroke="#FFFFFF" strokeWidth="6" />
      <circle cx="125" cy="186" r="8" fill="#e27533" stroke="#FFFFFF" strokeWidth="6" />
    </svg>
  );
};

export default Logo;
