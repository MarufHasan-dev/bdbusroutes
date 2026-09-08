import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#006A4E",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: 28,
            backgroundColor: "#ffffff",
            color: "#065f46",
            fontSize: 56,
            fontWeight: 900,
          }}
        >
          বাস
        </div>
        <div style={{ marginTop: 28, fontSize: 72, fontWeight: 900 }}>
          BD Bus Routes
        </div>
        <div style={{ marginTop: 12, fontSize: 32, opacity: 0.9 }}>
          Which bus goes your way? Find it fast. · ঢাকা বাস রুট
        </div>
      </div>
    ),
    { ...size }
  );
}
