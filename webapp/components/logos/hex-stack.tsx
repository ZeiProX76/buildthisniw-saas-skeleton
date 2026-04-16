import React from "react";

/**
 * Hex Stack — Three hexagonal layers stacked in perspective.
 * Bottom layer is darkest, middle is primary, top is lightest.
 * Creates a "building blocks" / "layering" metaphor.
 * Very clean silhouette — works at any size.
 */
const HexStack = ({ size = 48 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width={size}
    height={size}
    fill="none"
  >
    <defs>
      {/* Bottom layer */}
      <linearGradient id="hs-bot" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#2D6FD6" />
        <stop offset="100%" stopColor="#153F80" />
      </linearGradient>
      {/* Middle layer */}
      <linearGradient id="hs-mid" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#5B9BFF" />
        <stop offset="100%" stopColor="#2D6FD6" />
      </linearGradient>
      {/* Top layer */}
      <linearGradient id="hs-top" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#A5D0FF" />
        <stop offset="100%" stopColor="#5B9BFF" />
      </linearGradient>
      <filter id="hs-shadow" x="-15%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodColor="#153F80" floodOpacity="0.25" />
      </filter>
    </defs>

    <g filter="url(#hs-shadow)">
      {/* Bottom hex — largest, offset down */}
      <polygon
        points="16,20 8,24 4,20 4,14 8,10 16,14"
        fill="url(#hs-bot)"
        transform="translate(4,4)"
      />
      {/* Middle hex */}
      <polygon
        points="16,16 24,20 28,16 28,10 24,6 16,10"
        fill="url(#hs-mid)"
        transform="translate(-4,1)"
      />
      {/* Top hex — smallest, brightest */}
      <path
        d="M16 3l6.5 3.75v7.5L16 18l-6.5-3.75v-7.5z"
        fill="url(#hs-top)"
      />
      {/* Top face inner glow */}
      <path
        d="M16 4.5l5 2.9v5.8L16 16l-5-2.9V7.4z"
        fill="#fff"
        fillOpacity="0.1"
      />
    </g>
  </svg>
);

export default HexStack;
