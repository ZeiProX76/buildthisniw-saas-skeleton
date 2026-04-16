import React from "react";

/**
 * Faceted Bolt — A two-face lightning bolt creating a 3D crystal / gem look.
 * Left face is lit (lighter), right face is shadowed (darker).
 * Ultra-simple geometry, extremely recognizable.
 */
const FacetedBolt = ({
  size = 48,
}: {
  size?: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width={size}
    height={size}
    fill="none"
  >
    <defs>
      {/* Left face — lit side */}
      <linearGradient id="fb-left" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7CB5FF" />
        <stop offset="60%" stopColor="#4A90F4" />
        <stop offset="100%" stopColor="#2C6ED4" />
      </linearGradient>
      {/* Right face — shadow side */}
      <linearGradient id="fb-right" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5B8EE8" />
        <stop offset="60%" stopColor="#3470D4" />
        <stop offset="100%" stopColor="#1A4FA8" />
      </linearGradient>
      <filter id="fb-drop" x="-20%" y="-10%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#1A4FA8" floodOpacity="0.3" />
      </filter>
    </defs>

    <g filter="url(#fb-drop)">
      {/* Left face of the bolt (lit) */}
      <path
        d="M17.5 3L7 17h7l-1 12 5.5-7.5L16 15l1.5-12z"
        fill="url(#fb-left)"
      />
      {/* Right face of the bolt (shadow) */}
      <path
        d="M17.5 3L16 15l2.5 6.5L25 14h-7L17.5 3z"
        fill="url(#fb-right)"
      />
      {/* Center seam highlight */}
      <path
        d="M17.5 3L16 15l2.5 6.5"
        stroke="#fff"
        strokeWidth="0.4"
        strokeOpacity="0.5"
      />
    </g>
  </svg>
);

export default FacetedBolt;
