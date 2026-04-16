import React from "react";

/**
 * Iso Cube — Isometric cube with three visible gradient faces.
 * Top face = lightest, left face = primary, right face = darkest.
 * A bolt-shaped negative space is cut through the front faces.
 * Clean, geometric, instantly recognizable at any size.
 */
const IsoCube = ({ size = 48 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width={size}
    height={size}
    fill="none"
  >
    <defs>
      {/* Top face — lightest */}
      <linearGradient id="ic-top" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A5D0FF" />
        <stop offset="100%" stopColor="#7CB5FF" />
      </linearGradient>
      {/* Left face — primary */}
      <linearGradient id="ic-left" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#5B9BFF" />
        <stop offset="100%" stopColor="#2D6FD6" />
      </linearGradient>
      {/* Right face — darkest */}
      <linearGradient id="ic-right" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1A4FA8" />
      </linearGradient>
      <filter id="ic-shadow" x="-15%" y="-10%" width="130%" height="135%">
        <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="#1A4FA8" floodOpacity="0.25" />
      </filter>
    </defs>

    <g filter="url(#ic-shadow)">
      {/* Top face */}
      <polygon points="16,4 27,10 16,16 5,10" fill="url(#ic-top)" />
      {/* Left face */}
      <polygon points="5,10 16,16 16,28 5,22" fill="url(#ic-left)" />
      {/* Right face */}
      <polygon points="27,10 16,16 16,28 27,22" fill="url(#ic-right)" />
      {/* Top face inner highlight */}
      <polygon points="16,5.5 25,10.5 16,15.5 7,10.5" fill="#fff" fillOpacity="0.12" />
    </g>
  </svg>
);

export default IsoCube;
