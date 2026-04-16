import React from "react";

/**
 * Bolt Mark — A geometric lightning bolt with depth.
 * The bolt IS the logo. No container. Gradient fills + shadow layer for 3D.
 * Inspired by the button gradient: light blue top → primary → dark blue bottom.
 */
const BoltMark = ({
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
      {/* Main gradient — matches button exactly */}
      <linearGradient id="bolt-grad" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#6BA4FF" />
        <stop offset="60%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D5BBE" />
      </linearGradient>
      {/* Highlight for the top face (3D illusion) */}
      <linearGradient id="bolt-hi" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      {/* Shadow beneath */}
      <filter id="bolt-shadow" x="-20%" y="-10%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" floodColor="#1D5BBE" floodOpacity="0.35" />
      </filter>
    </defs>

    {/* Main bolt shape */}
    <path
      d="M18.5 3L7 17.5h7.5L13 29l12-15h-7.5L18.5 3z"
      fill="url(#bolt-grad)"
      filter="url(#bolt-shadow)"
    />
    {/* Highlight overlay — top half only for 3D */}
    <path
      d="M18.5 3L7 17.5h7.5l-0.8 2.5L25 14h-7.5L18.5 3z"
      fill="url(#bolt-hi)"
      clipPath="inset(0 0 50% 0)"
    />
  </svg>
);

export default BoltMark;
