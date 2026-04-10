import React from 'react';

const LandingBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050a1f] via-[#0b1a3a] to-[#070b1b]" />

      {/* Soft grid / map overlay */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="slotGlow" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#09f7ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#08b7ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="skylineGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0b1d3a" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#050b1a" stopOpacity="0.7" />
          </linearGradient>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M80 0 L0 0 0 80" fill="none" stroke="#0e2756" strokeWidth="1" />
          </pattern>
          <linearGradient id="road" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0a1b34" />
            <stop offset="100%" stopColor="#041023" />
          </linearGradient>
          <linearGradient id="building" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0f2b56" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#04101e" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Subtle map grid */}
        <rect width="1200" height="800" fill="url(#grid)" opacity="0.45" />

        {/* Smart city skyline */}
        <g transform="translate(0, 80)">
          <path
            d="M0 560 L0 720 L150 720 L150 580 L260 580 L260 720 L380 720 L380 510 L480 510 L480 720 L600 720 L600 560 L680 560 L680 720 L780 720 L780 620 L860 620 L860 720 L980 720 L980 520 L1080 520 L1080 720 L1200 720 L1200 560 Z"
            fill="url(#building)"
            opacity="0.9"
          />
          <path
            d="M1200 600 L1200 720 L0 720 L0 600 C240 620 480 600 720 620 C960 640 1200 600 1200 600 Z"
            fill="#05111e"
            opacity="0.7"
          />
        </g>

        {/* Parking lot layout */}
        <g transform="translate(140, 210)">
          {/* base road / lot */}
          <rect x="0" y="0" width="920" height="360" rx="28" fill="url(#road)" opacity="0.95" />
          <rect x="10" y="10" width="900" height="340" rx="20" fill="#091737" opacity="0.85" />

          {/* parking spots rows */}
          {[0, 1, 2].map((row) => {
            const y = 30 + row * 110;
            return (
              <g key={row}>
                {[...Array(8)].map((_, col) => {
                  const x = 30 + col * 105;
                  const isAvailable = (row + col) % 3 !== 0;
                  return (
                    <g key={`spot-${row}-${col}`}> 
                      <rect
                        x={x}
                        y={y}
                        width="90"
                        height="70"
                        rx="10"
                        fill="#0f2a4f"
                        stroke={isAvailable ? '#1aed95' : '#ff4c4c'}
                        strokeWidth="2"
                        opacity="0.9"
                      />
                      <circle
                        cx={x + 18}
                        cy={y + 18}
                        r="8"
                        fill={isAvailable ? '#1aed95' : '#ff4c4c'}
                        opacity="0.95"
                      />
                      <path
                        d={`M${x + 28} ${y + 54} h36 l12 -28 h-60 z`}
                        fill="#0a1b34"
                        stroke="#0b2b50"
                        strokeWidth="1"
                        opacity="0.7"
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Glowing path / navigation line */}
          <path
            d="M70 320 C200 270 420 320 560 210 C700 110 820 210 900 180"
            fill="none"
            stroke="#0bf5ff"
            strokeWidth="3"
            strokeOpacity="0.65"
            filter="url(#glow)"
          />
          <circle cx="70" cy="320" r="6" fill="#0bf5ff" opacity="0.9" />
          <circle cx="900" cy="180" r="8" fill="#0bf5ff" opacity="0.9" />

          {/* Soft glow on top */}
          <rect x="0" y="0" width="920" height="360" rx="28" fill="url(#slotGlow)" opacity="0.25" />
        </g>

        {/* Overlay glow and subtle noise */}
        <rect
          width="1200"
          height="800"
          fill="url(#slotGlow)"
          opacity="0.1"
          filter="url(#glow)"
        />
      </svg>
    </div>
  );
};

export default LandingBackground;
