import React from "react";

/**
 * Diamond Facet — An isometric diamond viewed from above.
 * Four triangular faces radiating from center, each a different gradient shade.
 * Looks like a cut gemstone. Extremely clean silhouette.
 * Symbolizes value, precision, quality.
 */
const DiamondFacet = ({ size = 48 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width={size}
    height={size}
    fill="none"
  >
    <defs>
      {/* Top-left face — brightest */}
      <linearGradient id="df-tl" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#B8D9FF" />
        <stop offset="100%" stopColor="#7CB5FF" />
      </linearGradient>
      {/* Top-right face — light */}
      <linearGradient id="df-tr" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8EC5FF" />
        <stop offset="100%" stopColor="#5B9BFF" />
      </linearGradient>
      {/* Bottom-left face — primary */}
      <linearGradient id="df-bl" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#5B9BFF" />
        <stop offset="100%" stopColor="#2D6FD6" />
      </linearGradient>
      {/* Bottom-right face — darkest */}
      <linearGradient id="df-br" x1="1" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1A4FA8" />
      </linearGradient>
      <filter id="df-shadow" x="-15%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="#1A4FA8" floodOpacity="0.25" />
      </filter>
    </defs>

    <g filter="url(#df-shadow)">
      {/* Top-left face */}
      <polygon points="16,3 3,16 16,16" fill="url(#df-tl)" />
      {/* Top-right face */}
      <polygon points="16,3 29,16 16,16" fill="url(#df-tr)" />
      {/* Bottom-left face */}
      <polygon points="3,16 16,29 16,16" fill="url(#df-bl)" />
      {/* Bottom-right face */}
      <polygon points="29,16 16,29 16,16" fill="url(#df-br)" />
      {/* Center cross highlight */}
      <line x1="3" y1="16" x2="29" y2="16" stroke="#fff" strokeWidth="0.4" strokeOpacity="0.35" />
      <line x1="16" y1="3" x2="16" y2="29" stroke="#fff" strokeWidth="0.4" strokeOpacity="0.2" />
    </g>
  </svg>
);

export default DiamondFacet;
