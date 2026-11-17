import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { C, EASE, SANS, SERIF, clamp } from "./theme";

// A line of text that rises into view from behind a mask.
export const Reveal: React.FC<{
  delay?: number;
  dur?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, dur = 28, children, style }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [delay, delay + dur], [0, 1], {
    ...clamp,
    easing: EASE,
  });
  return (
    <div
      style={{
        overflow: "hidden",
        paddingTop: "0.06em",
        paddingBottom: "0.1em",
        marginTop: "-0.06em",
        marginBottom: "-0.1em",
      }}
    >
      <div style={{ translate: `0 ${(1 - p) * 115}%`, ...style }}>
        {children}
      </div>
    </div>
  );
};

// Fade and lift into place.
export const FadeUp: React.FC<{
  delay?: number;
  dur?: number;
  dist?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, dur = 24, dist = 28, children, style }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [delay, delay + dur], [0, 1], {
    ...clamp,
    easing: EASE,
  });
  return (
    <div style={{ opacity: p, translate: `0 ${(1 - p) * dist}px`, ...style }}>
      {children}
    </div>
  );
};

// Small bold caps label, underlined, like a masthead credit.
export const Label: React.FC<{
  children: React.ReactNode;
  color?: string;
  underline?: boolean;
}> = ({ children, color = C.ink, underline = true }) => (
  <div
    style={{
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 22,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color,
      textDecoration: underline ? "underline" : "none",
      textUnderlineOffset: 6,
      textDecorationThickness: 2,
    }}
  >
    {children}
  </div>
);

// Corner credits: label above a serif value.
export const Meta: React.FC<{
  left: [string, string];
  right: [string, string];
  color: string;
  delay?: number;
}> = ({ left, right, color, delay = 0 }) => (
  <AbsoluteFill style={{ padding: "72px 96px" }}>
    <FadeUp delay={delay} style={{ position: "absolute", left: 96, top: 72 }}>
      <Label color={color}>{left[0]}</Label>
      <div style={{ fontFamily: SERIF, fontSize: 44, color, marginTop: 6 }}>
        {left[1]}
      </div>
    </FadeUp>
    <FadeUp
      delay={delay + 6}
      style={{ position: "absolute", right: 96, top: 72, textAlign: "right" }}
    >
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Label color={color}>{right[0]}</Label>
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 44, color, marginTop: 6 }}>
        {right[1]}
      </div>
    </FadeUp>
  </AbsoluteFill>
);

// Section header for light scenes: number and title left, brand right, a rule drawn under.
export const Header: React.FC<{
  num: string;
  title: string;
  dark?: boolean;
}> = ({ num, title, dark = false }) => {
  const f = useCurrentFrame();
  const ink = dark ? C.cream : C.ink;
  const w = interpolate(f, [4, 40], [0, 1728], { ...clamp, easing: EASE });
  return (
    <>
      <FadeUp delay={2} style={{ position: "absolute", left: 96, top: 84 }}>
        <Label color={ink} underline={false}>
          <span style={{ color: dark ? C.ember : C.rust }}>{num}</span>
          {"  —  "}
          {title}
        </Label>
      </FadeUp>
      <FadeUp delay={6} style={{ position: "absolute", right: 96, top: 84 }}>
        <Label color={ink} underline={false}>
          Study Hub
        </Label>
      </FadeUp>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 136,
          width: w,
          height: 2,
          background: dark ? "rgba(245,238,220,0.25)" : C.line,
        }}
      />
    </>
  );
};

type Blob = { x: number; y: number; r: number; c: string; sp: number; ph: number };

const NIGHT: Blob[] = [
  { x: 0.18, y: 0.72, r: 560, c: "rgba(184,58,14,0.60)", sp: 0.011, ph: 0 },
  { x: 0.78, y: 0.32, r: 640, c: "rgba(232,116,63,0.38)", sp: 0.008, ph: 1.3 },
  { x: 0.56, y: 0.9, r: 440, c: "rgba(245,238,220,0.16)", sp: 0.013, ph: 2.1 },
  { x: 0.92, y: 0.82, r: 400, c: "rgba(184,58,14,0.42)", sp: 0.01, ph: 3.4 },
  { x: 0.1, y: 0.14, r: 380, c: "rgba(245,200,160,0.14)", sp: 0.009, ph: 4.2 },
  { x: 0.45, y: 0.2, r: 300, c: "rgba(232,116,63,0.20)", sp: 0.012, ph: 5.0 },
];

const EMBER: Blob[] = [
  { x: 0.15, y: 0.25, r: 620, c: "rgba(232,116,63,0.55)", sp: 0.009, ph: 0 },
  { x: 0.82, y: 0.78, r: 680, c: "rgba(90,20,4,0.55)", sp: 0.007, ph: 1.7 },
  { x: 0.6, y: 0.15, r: 420, c: "rgba(245,200,160,0.22)", sp: 0.012, ph: 2.6 },
  { x: 0.3, y: 0.9, r: 480, c: "rgba(60,14,3,0.45)", sp: 0.01, ph: 3.9 },
];

// Soft, drifting out-of-focus light, standing in for an editorial photo.
export const Bokeh: React.FC<{ variant?: "night" | "ember" }> = ({
  variant = "night",
}) => {
  const f = useCurrentFrame();
  const blobs = variant === "night" ? NIGHT : EMBER;
  return (
    <AbsoluteFill
      style={{ background: variant === "night" ? C.night : C.rust }}
    >
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: b.x * 1920 - b.r + Math.sin(f * b.sp + b.ph) * 70,
            top: b.y * 1080 - b.r + Math.cos(f * b.sp * 0.8 + b.ph) * 45,
            width: b.r * 2,
            height: b.r * 2,
            borderRadius: "50%",
            background: `radial-gradient(circle at center, ${b.c} 0%, rgba(0,0,0,0) 66%)`,
            filter: "blur(30px)",
          }}
        />
      ))}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Film grain that changes every frame.
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ mixBlendMode: "overlay", opacity }}>
      <svg width="1920" height="1080">
        <filter id={`grain-${f % 8}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            seed={f % 8}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="1920" height="1080" filter={`url(#grain-${f % 8})`} />
      </svg>
    </AbsoluteFill>
  );
};

// A phone showing a real screenshot of the live app.
export const Phone: React.FC<{
  src: string;
  width: number;
  style?: React.CSSProperties;
}> = ({ src, width, style }) => (
  <div
    style={{
      width,
      height: width * 2,
      borderRadius: width * 0.13,
      border: `${Math.round(width * 0.025)}px solid #0E0F11`,
      overflow: "hidden",
      boxShadow:
        "0 60px 120px rgba(20,12,6,0.35), 0 20px 40px rgba(20,12,6,0.25)",
      background: "#0E0F11",
      ...style,
    }}
  >
    <Img
      src={staticFile(src)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </div>
);

export const Display: React.FC<{
  size: number;
  color: string;
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  style?: React.CSSProperties;
}> = ({ size, color, children, align = "left", style }) => (
  <div
    style={{
      fontFamily: SERIF,
      fontSize: size,
      lineHeight: 0.92,
      letterSpacing: "-0.01em",
      textTransform: "uppercase",
      color,
      textAlign: align,
      ...style,
    }}
  >
    {children}
  </div>
);
