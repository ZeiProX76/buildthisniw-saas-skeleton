import React from "react";

/**
 * Tri Prism — Upward-pointing triangular prism with 3D depth.
 * Like a "play" button extruded into 3D. Represents go/launch/build.
 * Three faces: front triangle (gradient), left side (dark), bottom edge (mid).
 */
const TriPrism = ({ size = 48 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width={size}
    height={size}
    fill="none"
  >
    <defs>
      {/* Front face — main gradient */}
      <linearGradient id="tp-front" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#8EC5FF" />
        <stop offset="50%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D5BBE" />
      </linearGradient>
      {/* Right extrusion face — darker */}
      <linearGradient id="tp-side" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2D6FD6" />
        <stop offset="100%" stopColor="#153F80" />
      </linearGradient>
      {/* Bottom extrusion — mid */}
      <linearGradient id="tp-bottom" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#3470D4" />
        <stop offset="100%" stopColor="#1A4FA8" />
      </linearGradient>
      <filter id="tp-shadow" x="-15%" y="-10%" width="130%" height="135%">
        <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="#153F80" floodOpacity="0.3" />
      </filter>
    </defs>

    <g filter="url(#tp-shadow)">
      {/* Bottom extrusion edge */}
      <polygon points="6,24 13,28 27,19 20,15" fill="url(#tp-bottom)" />
      {/* Right side extrusion */}
      <polygon points="14,4 20,15 27,19 14,8" fill="url(#tp-side)" />
      {/* Front triangle face */}
      <polygon points="14,4 6,24 20,15" fill="url(#tp-front)" />
      {/* Left edge highlight */}
      <line x1="14" y1="4" x2="6" y2="24" stroke="#fff" strokeWidth="0.5" strokeOpacity="0.3" />
    </g>
  </svg>
);

export default TriPrism;
