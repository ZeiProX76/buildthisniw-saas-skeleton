import React from "react";

/**
 * Arrow Block — An isometric 3D arrow/chevron pointing up-right.
 * Made from two extruded parallelogram planes forming an arrow shape.
 * Represents direction, momentum, "build this NOW".
 * Three visible faces for 3D depth.
 */
const ArrowBlock = ({ size = 48 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width={size}
    height={size}
    fill="none"
  >
    <defs>
      {/* Top face — lightest */}
      <linearGradient id="ab-top" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A5D0FF" />
        <stop offset="100%" stopColor="#7CB5FF" />
      </linearGradient>
      {/* Front face — primary */}
      <linearGradient id="ab-front" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#5B9BFF" />
        <stop offset="60%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D5BBE" />
      </linearGradient>
      {/* Right face — darkest */}
      <linearGradient id="ab-right" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3470D4" />
        <stop offset="100%" stopColor="#1A4FA8" />
      </linearGradient>
      <filter id="ab-shadow" x="-15%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="#1A4FA8" floodOpacity="0.25" />
      </filter>
    </defs>

    <g filter="url(#ab-shadow)">
      {/* Top face of the arrow */}
      <polygon points="4,14 16,4 28,14 19,14 19,18 13,18 13,14" fill="url(#ab-top)" />
      {/* Front face — the arrow body extruded down */}
      <polygon points="4,14 16,4 16,8 8,14.5 8,18 4,18" fill="url(#ab-front)" />
      <polygon points="13,18 13,14 4,14 4,18 8,18 8,22 13,22" fill="url(#ab-front)" />
      {/* Right side extrusion */}
      <polygon points="28,14 19,14 19,18 13,18 13,22 17,22 17,18 23,18 28,14" fill="url(#ab-right)" />
      <polygon points="16,4 28,14 28,18 16,8" fill="url(#ab-right)" />
      {/* Bottom extrusion */}
      <polygon points="8,18 8,22 13,22 13,18" fill="url(#ab-right)" />
      {/* Highlight on top edge */}
      <polyline
        points="4,14 16,4 28,14"
        stroke="#fff"
        strokeWidth="0.5"
        strokeOpacity="0.3"
        strokeLinejoin="round"
        fill="none"
      />
    </g>
  </svg>
);

export default ArrowBlock;
