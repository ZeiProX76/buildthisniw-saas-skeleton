import { ImageResponse } from "next/og";

export const alt = "Build This Now — Ship Your Next MVP in 48 Hours";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "edge";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #080818 0%, #0c1025 40%, #0f1630 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle radial glow */}
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -55%)",
            display: "flex",
          }}
        />

        {/* Iso Cube */}
        <svg
          viewBox="0 0 32 32"
          width="140"
          height="140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="16,4 27,10 16,16 5,10" fill="#8EC5FF" />
          <polygon points="5,10 16,16 16,28 5,22" fill="#4490F0" />
          <polygon points="27,10 16,16 16,28 27,22" fill="#2566C5" />
        </svg>

        {/* Text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 36,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              display: "flex",
            }}
          >
            Build This Now
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 400,
              color: "#7CB5FF",
              marginTop: 10,
              display: "flex",
            }}
          >
            Ship Your Next MVP in 48 Hours
          </div>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, transparent, #3B82F6, transparent)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
