import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

// Study Hub brand, taken from the live app: rust accent, warm paper, charcoal.
export const C = {
  night: "#16181B",
  ink: "#1F2328",
  cream: "#F5EEDC",
  paper: "#FAF7F2",
  sand: "#F1EBE2",
  rust: "#B83A0E",
  ember: "#E8743F",
  soft: "#5A5F66",
  line: "#D9CFBF",
};

export const SERIF = "'Instrument Serif', Georgia, serif";
export const SANS = "'Plus Jakarta Sans', Arial, sans-serif";

// Apple-style ease-out: fast start, long soft landing.
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

loadFont({
  family: "Instrument Serif",
  url: staticFile("fonts/instrument-serif-latin-400-normal.woff2"),
  weight: "400",
});
loadFont({
  family: "Instrument Serif",
  url: staticFile("fonts/instrument-serif-latin-400-italic.woff2"),
  weight: "400",
  style: "italic",
});
loadFont({
  family: "Plus Jakarta Sans",
  url: staticFile("fonts/plus-jakarta-sans-latin-wght-normal.woff2"),
  weight: "200 800",
});
