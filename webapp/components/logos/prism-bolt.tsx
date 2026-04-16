import React from "react";

/**
 * Prism Bolt — A thick, rounded lightning bolt with a prism/crystal split.
 * Three gradient bands give a prismatic 3D look like light refracting.
 * Extremely simple silhouette — one shape, three fills.
 * Most brandable: works at 16px favicon and 200px hero.
 */
const PrismBolt = ({
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
      {/* Full bolt gradient */}
      <linearGradient id="pb-main" x1="0.3" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stopColor="#8EC5FF" />
        <stop offset="40%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1A4FA8" />
      </linearGradient>
      {/* Left highlight band */}
      <linearGradient id="pb-hi" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <filter id="pb-glow" x="-30%" y="-20%" width="160%" height="160%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
        <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.23  0 0 0 0 0.51  0 0 0 0 0.96  0 0 0 0.3 0" result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <g filter="url(#pb-glow)">
      {/* Bolt body — thick, rounded, chunky */}
      <path
        d="M19 2.5L7.5 16h6l-2 13.5L25 15h-6.5l2-12.5z"
        fill="url(#pb-main)"
        strokeLinejoin="round"
      />
      {/* Left face highlight for 3D depth */}
      <path
        d="M19 2.5L7.5 16h6l-2 13.5L14 16.5l1-7.5L19 2.5z"
        fill="url(#pb-hi)"
      />
      {/* Right edge darker strip for prism split */}
      <path
        d="M20.5 4L18.5 15H25L15 26l1.2-6.5L14 15l1-7L20.5 4z"
        fill="#1A4FA8"
        fillOpacity="0.2"
      />
    </g>
  </svg>
);

export default PrismBolt;
