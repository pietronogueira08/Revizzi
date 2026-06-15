import React from 'react';

interface RevizziLogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: 'full' | 'icon' | 'text';
  color?: 'black' | 'white' | 'gradient';
}

export function RevizziLogo({
  className = '',
  width = 160,
  height = 56,
  variant = 'full',
  color = 'black',
}: RevizziLogoProps) {
  const fillColor = color === 'white' ? '#FFFFFF' : '#0A0A0A';

  if (variant === 'icon') {
    // Just the F1 car icon
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 120 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <CarPath fill={fillColor} />
      </svg>
    );
  }

  if (variant === 'text') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <TextPath fill={fillColor} />
      </svg>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 220 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Revizzi Centro Automotivo"
    >
      {/* F1 Car */}
      <g transform="translate(20, 0)">
        <CarPath fill={fillColor} />
      </g>
      {/* REVIZZI text */}
      <text
        x="110"
        y="38"
        textAnchor="middle"
        fontFamily="'Inter', system-ui, sans-serif"
        fontWeight="700"
        fontSize="22"
        fill={fillColor}
        letterSpacing="2"
      >
        REVIZZI
      </text>
      {/* CENTRO AUTOMOTIVO text */}
      <text
        x="110"
        y="54"
        textAnchor="middle"
        fontFamily="'Inter', system-ui, sans-serif"
        fontWeight="400"
        fontSize="9"
        fill={fillColor}
        letterSpacing="3"
        opacity="0.7"
      >
        CENTRO AUTOMOTIVO
      </text>
    </svg>
  );
}

function CarPath({ fill }: { fill: string }) {
  return (
    <g>
      {/* Simplified F1 car silhouette */}
      {/* Main body */}
      <path
        d="M8 32 C8 28 12 24 18 22 L35 18 C42 16 52 15 62 16 L80 18 C88 19 95 22 100 26 L105 30 L108 32 L108 36 C108 38 106 40 104 40 L90 40 C88 42 84 44 80 44 C76 44 72 42 70 40 L45 40 C43 42 39 44 35 44 C31 44 27 42 25 40 L12 40 C10 40 8 38 8 36 Z"
        fill={fill}
      />
      {/* Front wing */}
      <path
        d="M100 30 L115 28 L118 32 L115 34 L105 34 Z"
        fill={fill}
      />
      {/* Rear wing */}
      <path
        d="M8 24 L2 22 L2 28 L8 28 Z"
        fill={fill}
      />
      {/* Rear wing vertical */}
      <path
        d="M4 20 L6 20 L6 26 L4 26 Z"
        fill={fill}
      />
      {/* Cockpit */}
      <ellipse cx="58" cy="20" rx="12" ry="6" fill={fill} opacity="0.9" />
      {/* Helmet */}
      <circle cx="58" cy="17" r="5" fill={fill} />
      {/* Front wheel */}
      <circle cx="80" cy="43" r="7" fill={fill} />
      <circle cx="80" cy="43" r="3" fill="white" opacity="0.3" />
      {/* Rear wheel */}
      <circle cx="32" cy="43" r="8" fill={fill} />
      <circle cx="32" cy="43" r="3.5" fill="white" opacity="0.3" />
      {/* Exhaust lines */}
      <path d="M18 26 L10 24" stroke={fill} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M18 28 L8 27" stroke={fill} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </g>
  );
}

function TextPath({ fill }: { fill: string }) {
  return (
    <g>
      <text
        x="100"
        y="26"
        textAnchor="middle"
        fontFamily="'Inter', system-ui, sans-serif"
        fontWeight="700"
        fontSize="26"
        fill={fill}
        letterSpacing="2"
      >
        REVIZZI
      </text>
      <text
        x="100"
        y="38"
        textAnchor="middle"
        fontFamily="'Inter', system-ui, sans-serif"
        fontWeight="400"
        fontSize="9"
        fill={fill}
        letterSpacing="3"
        opacity="0.6"
      >
        CENTRO AUTOMOTIVO
      </text>
    </g>
  );
}

export default RevizziLogo;
