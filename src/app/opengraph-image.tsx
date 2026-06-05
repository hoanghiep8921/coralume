import { ImageResponse } from "next/og";

/**
 * OpenGraph Image Generator — SRS §6.1 NFR-003
 * Generates dynamic OG images at /opengraph-image
 *
 * Design: Navy → Teal gradient + Coral accent + brand text.
 * Uses system fonts (no external font loading needed for Edge).
 */

export const runtime = "edge";

export const alt = "Coralume — Nhận nuôi san hô, Gieo mầm cho đại dương";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          background: "linear-gradient(135deg, #0F4C5C 0%, #1a6b7a 40%, #2980a0 100%)",
          padding: 80,
          position: "relative",
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: 50,
            right: 50,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "rgba(232, 119, 80, 0.25)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 70,
            left: 70,
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "rgba(181, 216, 232, 0.2)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 180,
            left: 250,
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(244, 184, 154, 0.3)",
          }}
        />

        {/* English tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#B5D8E8",
            marginBottom: 28,
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Adopt a Coral
        </div>

        {/* Vietnamese headline */}
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: 950,
          }}
        >
          Nhận nuôi san hô
        </div>
        <div
          style={{
            fontSize: 58,
            fontWeight: 700,
            color: "#F4B89A",
            textAlign: "center",
            lineHeight: 1.25,
            marginBottom: 44,
          }}
        >
          Gieo mầm cho đại dương
        </div>

        {/* Accent divider */}
        <div
          style={{
            width: 100,
            height: 5,
            background: "#E87750",
            borderRadius: 3,
            marginBottom: 44,
          }}
        />

        {/* Domain */}
        <div
          style={{
            fontSize: 34,
            color: "#B5D8E8",
            fontWeight: 600,
          }}
        >
          coralume.vn
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
