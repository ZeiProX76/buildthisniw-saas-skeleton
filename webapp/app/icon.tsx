import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <svg
          viewBox="0 0 32 32"
          width="32"
          height="32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top face — lightest */}
          <polygon points="16,4 27,10 16,16 5,10" fill="#8EC5FF" />
          {/* Left face — primary */}
          <polygon points="5,10 16,16 16,28 5,22" fill="#4490F0" />
          {/* Right face — darkest */}
          <polygon points="27,10 16,16 16,28 27,22" fill="#2566C5" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
