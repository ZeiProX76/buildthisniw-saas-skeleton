import React from "react";

/**
 * Geo B — The letter "B" (for Build) constructed from geometric blocks.
 * Two rounded bumps formed by overlapping circles/rectangles.
 * 3D depth through gradient fills on the left "spine" vs right "bumps".
 * Strong lettermark that's instantly readable.
 */
const GeoB = ({ size = 48 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width={size}
    height={size}
    fill="none"
  >
    <defs>
      {/* Spine — darkest */}
      <linearGradient id="gb-spine" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1A4FA8" />
      </linearGradient>
      {/* Top bump */}
      <linearGradient id="gb-top" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#A5D0FF" />
        <stop offset="60%" stopColor="#5B9BFF" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
      {/* Bottom bump */}
      <linearGradient id="gb-bot" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#7CB5FF" />
        <stop offset="60%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D5BBE" />
      </linearGradient>
      <filter id="gb-shadow" x="-15%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="#1A4FA8" floodOpacity="0.25" />
      </filter>
    </defs>

    <g filter="url(#gb-shadow)">
      {/* Spine / left bar */}
      <rect x="6" y="3" width="6" height="26" rx="2" fill="url(#gb-spine)" />
      {/* Top bump — rounded right side */}
      <rect x="10" y="3" width="13" height="12" rx="6" fill="url(#gb-top)" />
      {/* Bottom bump — slightly wider */}
      <rect x="10" y="16" width="15" height="13" rx="6.5" fill="url(#gb-bot)" />
      {/* Highlight on top-left of B */}
      <rect x="6" y="3" width="6" height="8" rx="2" fill="#fff" fillOpacity="0.12" />
    </g>
  </svg>
);

export default GeoB;
