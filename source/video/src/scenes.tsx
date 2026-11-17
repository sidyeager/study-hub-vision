import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Bokeh,
  Display,
  FadeUp,
  Grain,
  Header,
  Label,
  Meta,
  Phone,
  Reveal,
} from "./components";
import { C, EASE, EASE_IN_OUT, SANS, SERIF, clamp } from "./theme";

const body = (color: string, size = 32): React.CSSProperties => ({
  fontFamily: SANS,
  fontSize: size,
  lineHeight: 1.4,
  color,
});

// Slow push-in on dark backgrounds.
const Drift: React.FC<{ len: number; children: React.ReactNode }> = ({
  len,
  children,
}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, len], [1.04, 1.14]);
  return <AbsoluteFill style={{ scale: String(s) }}>{children}</AbsoluteFill>;
};

// 1. Cover
export const Cover: React.FC = () => (
  <AbsoluteFill>
    <Drift len={180}>
      <Bokeh />
    </Drift>
    <Grain />
    <Meta
      left={["Presented by", "Siddharth Sharma"]}
      right={["Date", "Nov 17, 2026"]}
      color={C.cream}
      delay={24}
    />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Display size={330} color={C.cream} align="center">
        <Reveal delay={6} dur={36}>
          Study Hub
        </Reveal>
      </Display>
      <FadeUp delay={30}>
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 64,
            color: C.cream,
            opacity: 0.85,
            marginTop: 20,
          }}
        >
          The free home for exam material
        </div>
      </FadeUp>
    </AbsoluteFill>
    <AbsoluteFill
      style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 100 }}
    >
      <FadeUp delay={48}>
        <div style={body(C.cream, 36)}>
          Every university’s papers, syllabus and notices. One free app.
        </div>
      </FadeUp>
    </AbsoluteFill>
  </AbsoluteFill>
);

// 2. Problem
const PROBLEMS = [
  ["Scattered", "Portals, notice boards, WhatsApp groups and photocopy shops."],
  ["Unreliable", "Copies conflict, years go missing, scans are blurry."],
  ["Last-minute", "Datesheets change at short notice. Nobody gets an alert."],
  ["Generic AI", "Chatbots don’t know your university’s syllabus."],
];

export const Problem: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Header num="01" title="The problem" />
      <div style={{ position: "absolute", left: 96, top: 210 }}>
        <Display size={176} color={C.ink}>
          <Reveal delay={8}>Exam week starts</Reveal>
          <Reveal delay={16}>
            with a <span style={{ color: C.rust, fontStyle: "italic" }}>hunt.</span>
          </Reveal>
        </Display>
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 690,
          width: 1728,
          display: "flex",
          gap: 48,
        }}
      >
        {PROBLEMS.map(([t, d], i) => {
          const start = 40 + i * 10;
          const w = interpolate(f, [start, start + 30], [0, 100], {
            ...clamp,
            easing: EASE,
          });
          return (
            <div key={t} style={{ flex: 1 }}>
              <div style={{ height: 2, width: `${w}%`, background: C.ink }} />
              <FadeUp delay={start + 6}>
                <div
                  style={{
                    fontFamily: SANS,
                    fontWeight: 700,
                    fontSize: 22,
                    color: C.rust,
                    marginTop: 22,
                  }}
                >
                  0{i + 1}
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 64, color: C.ink, marginTop: 4 }}>
                  {t}
                </div>
                <div style={{ ...body(C.soft, 28), marginTop: 8 }}>{d}</div>
              </FadeUp>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 3. The need: one big number
export const Need: React.FC = () => {
  const f = useCurrentFrame();
  const v = interpolate(f, [10, 70], [0, 4.5], { ...clamp, easing: EASE });
  return (
    <AbsoluteFill>
      <Drift len={150}>
        <Bokeh />
      </Drift>
      <Grain />
      <Header num="02" title="The need" dark />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Display size={380} color={C.cream} align="center">
          <Reveal delay={4} dur={34}>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{v.toFixed(1)}</span>{" "}
            <span style={{ fontStyle: "italic", color: C.ember }}>crore</span>
          </Reveal>
        </Display>
        <FadeUp delay={36}>
          <div style={{ ...body(C.cream, 48), marginTop: 28, textAlign: "center" }}>
            students in Indian higher education, 2023–24
          </div>
        </FadeUp>
      </AbsoluteFill>
      <FadeUp delay={56} style={{ position: "absolute", left: 96, bottom: 84 }}>
        <div style={body("rgba(245,238,220,0.6)", 22)}>
          Source: AISHE 2023–24, as reported by Careers360
        </div>
      </FadeUp>
      <FadeUp delay={64} style={{ position: "absolute", right: 96, bottom: 84 }}>
        <div style={body("rgba(245,238,220,0.85)", 26)}>
          Panjab University alone: about 200 affiliated colleges
        </div>
      </FadeUp>
    </AbsoluteFill>
  );
};

// 4. Product
const FEATURES = [
  ["PYQs", "Every past paper, by year and unit"],
  ["Syllabus", "Your semester, unit by unit"],
  ["Notices", "Datesheets, marked NEW, with alerts"],
  ["Ask AI", "Answers from your papers, sources shown"],
];

export const Product: React.FC = () => {
  const f = useCurrentFrame();
  const rise = interpolate(f, [6, 50], [0, 1], { ...clamp, easing: EASE });
  const float = Math.sin(f / 22) * 6;
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Header num="03" title="The product" />
      <div style={{ position: "absolute", left: 96, top: 210 }}>
        <Display size={200} color={C.ink}>
          <Reveal delay={6}>One place.</Reveal>
        </Display>
      </div>
      <div style={{ position: "absolute", left: 96, top: 470, width: 980 }}>
        {FEATURES.map(([t, d], i) => {
          const start = 26 + i * 12;
          return (
            <FadeUp key={t} delay={start}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 40,
                  borderTop: `2px solid ${C.line}`,
                  padding: "18px 0 14px",
                }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 68,
                    color: i === 3 ? C.rust : C.ink,
                    width: 300,
                  }}
                >
                  {t}
                </div>
                <div style={body(C.soft, 32)}>{d}</div>
              </div>
            </FadeUp>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 1310,
          top: 175,
          opacity: rise,
          translate: `0 ${(1 - rise) * 160 + float}px`,
          rotate: `${interpolate(rise, [0, 1], [-8, -3])}deg`,
        }}
      >
        <Phone src="home.png" width={395} />
      </div>
    </AbsoluteFill>
  );
};

// 5. Live today
const LIVE = [
  "Full PU course list, course and subject pages",
  "Notices and datesheets, filtered by course",
  "Ask AI with cited sources",
  "Installable and open source",
];

export const Today: React.FC = () => {
  const f = useCurrentFrame();
  const a = interpolate(f, [4, 46], [0, 1], { ...clamp, easing: EASE });
  const b = interpolate(f, [16, 58], [0, 1], { ...clamp, easing: EASE });
  const par = interpolate(f, [0, 180], [0, -30]);
  return (
    <AbsoluteFill style={{ background: C.sand }}>
      <Header num="04" title="Where we are" />
      <div style={{ position: "absolute", left: 96, top: 210 }}>
        <Display size={150} color={C.ink}>
          <Reveal delay={6}>Live at</Reveal>
          <Reveal delay={13}>Panjab</Reveal>
          <Reveal delay={20}>
            <span style={{ fontStyle: "italic", color: C.rust }}>University.</span>
          </Reveal>
        </Display>
      </div>
      <div style={{ position: "absolute", left: 96, top: 690 }}>
        {LIVE.map((t, i) => (
          <FadeUp key={t} delay={40 + i * 8}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 14 }}>
              <div style={{ width: 12, height: 12, borderRadius: 6, background: C.rust }} />
              <div style={body(C.ink, 34)}>{t}</div>
            </div>
          </FadeUp>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 1130,
          top: 200,
          opacity: a,
          translate: `0 ${(1 - a) * 140 + par}px`,
          rotate: "-4deg",
        }}
      >
        <Phone src="home.png" width={330} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 1450,
          top: 260,
          opacity: b,
          translate: `0 ${(1 - b) * 180 + par * 1.8}px`,
          rotate: "3deg",
        }}
      >
        <Phone src="notices.png" width={330} />
      </div>
    </AbsoluteFill>
  );
};

// 6. Vision statement
export const Vision: React.FC = () => (
  <AbsoluteFill>
    <Drift len={165}>
      <Bokeh variant="ember" />
    </Drift>
    <Grain />
    <Header num="05" title="Vision 2031" dark />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Display size={196} color={C.cream} align="center">
        <Reveal delay={6}>Any student.</Reveal>
        <Reveal delay={16}>Any university.</Reveal>
        <Reveal delay={26}>
          <span style={{ fontStyle: "italic" }}>Ten seconds.</span>
        </Reveal>
      </Display>
      <FadeUp delay={52}>
        <div
          style={{
            ...body(C.cream, 38),
            marginTop: 48,
            textAlign: "center",
            maxWidth: 1300,
          }}
        >
          Syllabus, five years of papers and this week’s notices, with an AI tutor
          that answers from your own syllabus and shows its sources.
        </div>
      </FadeUp>
    </AbsoluteFill>
  </AbsoluteFill>
);

// 7. How it works
const STEPS = [
  ["Sources", "Portals, colleges, students"],
  ["Collect", "Each file keeps its source"],
  ["Process", "OCR, tags, duplicate checks"],
  ["Review", "Checked by a moderator"],
  ["Publish", "Search and AI index"],
  ["Students", "Read, save, ask"],
];

export const How: React.FC = () => {
  const f = useCurrentFrame();
  const x0 = 240;
  const step = 288;
  const y = 690;
  const p = interpolate(f, [24, 110], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Header num="06" title="How it works" />
      <div style={{ position: "absolute", left: 96, top: 210 }}>
        <Display size={168} color={C.ink}>
          <Reveal delay={6}>
            Nothing skips <span style={{ fontStyle: "italic", color: C.rust }}>review.</span>
          </Reveal>
        </Display>
        <FadeUp delay={18}>
          <div style={{ ...body(C.soft, 34), marginTop: 20 }}>
            Every document is checked by a person before students see it.
          </div>
        </FadeUp>
      </div>
      <div
        style={{
          position: "absolute",
          left: x0,
          top: y - 1,
          width: step * 5 * p,
          height: 2,
          background: C.ink,
        }}
      />
      {STEPS.map(([t, d], i) => {
        const at = 24 + (i / 5) * 86;
        const on = interpolate(f, [at, at + 16], [0, 1], { ...clamp, easing: EASE });
        const key = i === 3;
        const r = key ? 20 : 11;
        return (
          <React.Fragment key={t}>
            <div
              style={{
                position: "absolute",
                left: x0 + i * step - r,
                top: y - r,
                width: r * 2,
                height: r * 2,
                borderRadius: r,
                background: key ? C.rust : C.paper,
                border: key ? "none" : `2px solid ${C.ink}`,
                scale: String(on),
              }}
            />
            <div
              style={{
                position: "absolute",
                left: x0 + i * step - 130,
                top: y + 44,
                width: 260,
                textAlign: "center",
                opacity: on,
                translate: `0 ${(1 - on) * 20}px`,
              }}
            >
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, color: C.rust }}>
                0{i + 1}
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: key ? 68 : 56,
                  color: key ? C.rust : C.ink,
                  marginTop: 4,
                }}
              >
                {t}
              </div>
              <div style={{ ...body(C.soft, 26), marginTop: 6 }}>{d}</div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// 8. Roadmap
const PHASES = [
  ["2027", "PU complete", "Gate: 10,000 monthly students"],
  ["2028", "Platform", "Gate: 75,000 across 4 universities"],
  ["2029", "Region", "Gate: 200,000; Plus pays costs"],
  ["2030", "Partners", "Gate: 500,000; 5 partnerships"],
  ["2031", "National", "Goal: 1 million and break-even"],
];

export const Roadmap: React.FC = () => {
  const f = useCurrentFrame();
  const ts = [40, 80, 120, 160, 200];
  const uni = Math.round(interpolate(f, ts, [1, 4, 10, 30, 100], clamp));
  const mau = Math.round(
    interpolate(f, ts, [10000, 75000, 200000, 500000, 1000000], clamp),
  );
  const x0 = 240;
  const step = 320;
  const y = 650;
  const line = interpolate(f, [30, 210], [0, 1580], { ...clamp, easing: EASE_IN_OUT });
  return (
    <AbsoluteFill>
      <Drift len={240}>
        <Bokeh />
      </Drift>
      <Grain />
      <Header num="07" title="Roadmap" dark />
      <div style={{ position: "absolute", left: 96, top: 210 }}>
        <Display size={168} color={C.cream}>
          <Reveal delay={6}>Five phases.</Reveal>
          <Reveal delay={14}>
            <span style={{ fontStyle: "italic", color: C.ember }}>One gate each.</span>
          </Reveal>
        </Display>
      </div>
      <FadeUp delay={20} style={{ position: "absolute", right: 96, top: 200, textAlign: "right" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Label color={C.cream}>Universities</Label>
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 220,
            lineHeight: 1,
            color: C.cream,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {uni}
        </div>
        <div style={{ ...body("rgba(245,238,220,0.8)", 30), fontVariantNumeric: "tabular-nums" }}>
          {mau.toLocaleString("en-US")} monthly students
        </div>
      </FadeUp>
      <div
        style={{
          position: "absolute",
          left: x0,
          top: y - 1,
          width: line,
          height: 2,
          background: "rgba(245,238,220,0.6)",
        }}
      />
      {PHASES.map(([yr, name, gate], i) => {
        const on = interpolate(f, [ts[i] - 10, ts[i] + 10], [0, 1], { ...clamp, easing: EASE });
        const last = i === 4;
        return (
          <React.Fragment key={yr}>
            <div
              style={{
                position: "absolute",
                left: x0 + i * step - 12,
                top: y - 12,
                width: 24,
                height: 24,
                rotate: "45deg",
                background: last ? C.ember : C.night,
                border: `2px solid ${last ? C.ember : C.cream}`,
                scale: String(on),
              }}
            />
            <div
              style={{
                position: "absolute",
                left: x0 + i * step - 12,
                top: y + 44,
                width: 290,
                opacity: on,
                translate: `0 ${(1 - on) * 20}px`,
              }}
            >
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, color: C.ember }}>
                {yr}
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 62, color: C.cream, marginTop: 2 }}>
                {name}
              </div>
              <div style={{ ...body("rgba(245,238,220,0.78)", 26), marginTop: 6 }}>{gate}</div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// 9. Business model
const STREAMS = [
  ["Study Hub Plus", "₹299 a year", "Unlimited AI, offline packs"],
  ["Campus partners", "₹25k–1L a year", "Verified notice channel"],
  ["Sponsored", "Labelled listings", "Matched by course, never tracked"],
];

export const Model: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Header num="08" title="Business model" />
      <div style={{ position: "absolute", left: 96, top: 200 }}>
        <Display size={230} color={C.ink}>
          <Reveal delay={6}>Free.</Reveal>
          <Reveal delay={14}>
            <span style={{ fontStyle: "italic", color: C.rust }}>Forever.</span>
          </Reveal>
        </Display>
        <FadeUp delay={26}>
          <div style={{ ...body(C.soft, 34), marginTop: 18 }}>
            Papers, syllabus and notices never go behind a paywall.
          </div>
        </FadeUp>
      </div>
      <FadeUp delay={34} style={{ position: "absolute", right: 96, top: 250, width: 560, textAlign: "right" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Label color={C.ink}>2031 model</Label>
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 96, color: C.ink, lineHeight: 1, marginTop: 14 }}>
          ≈ ₹1.4 crore
        </div>
        <div style={{ ...body(C.soft, 28), marginTop: 10 }}>
          a year by 2031, enough to break even
        </div>
      </FadeUp>
      <div style={{ position: "absolute", left: 96, top: 770, width: 1728, display: "flex", gap: 48 }}>
        {STREAMS.map(([t, v, d], i) => {
          const start = 46 + i * 10;
          const w = interpolate(f, [start, start + 30], [0, 100], { ...clamp, easing: EASE });
          return (
            <div key={t} style={{ flex: 1 }}>
              <div style={{ height: 2, width: `${w}%`, background: C.ink }} />
              <FadeUp delay={start + 6}>
                <div style={{ marginTop: 20 }}>
                  <Label color={C.rust} underline={false}>
                    {t}
                  </Label>
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 60, color: C.ink, marginTop: 6 }}>{v}</div>
                <div style={body(C.soft, 26)}>{d}</div>
              </FadeUp>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 10. The ask
const ASKS = [
  ["₹3–5L", "Running costs and legal advice for 2027"],
  ["10", "Campus ambassadors in PU’s largest colleges"],
  ["2", "Advisors: a PU faculty member and a lawyer"],
  ["1", "PU department to link its official papers"],
];

export const Ask: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.sand }}>
      <Header num="09" title="The ask" />
      <div style={{ position: "absolute", left: 96, top: 210 }}>
        <Display size={168} color={C.ink}>
          <Reveal delay={6}>What Phase 1 needs.</Reveal>
        </Display>
        <FadeUp delay={16}>
          <div style={{ ...body(C.soft, 34), marginTop: 18 }}>
            To make Panjab University complete before the May 2027 exams.
          </div>
        </FadeUp>
      </div>
      <div style={{ position: "absolute", left: 96, top: 560, width: 1728, display: "flex", gap: 48 }}>
        {ASKS.map(([n, d], i) => {
          const start = 28 + i * 10;
          const w = interpolate(f, [start, start + 30], [0, 100], { ...clamp, easing: EASE });
          return (
            <div key={n} style={{ flex: 1 }}>
              <div style={{ height: 2, width: `${w}%`, background: C.ink }} />
              <FadeUp delay={start + 6}>
                <div style={{ fontFamily: SERIF, fontSize: 150, lineHeight: 1, color: i === 0 ? C.rust : C.ink, marginTop: 18 }}>
                  {n}
                </div>
                <div style={{ ...body(C.soft, 30), marginTop: 10 }}>{d}</div>
              </FadeUp>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 11. Close
export const Close: React.FC = () => {
  const f = useCurrentFrame();
  const out = interpolate(f, [150, 180], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Drift len={180}>
        <Bokeh />
      </Drift>
      <Grain />
      <Meta
        left={["Study Hub", "Pitch, 2026"]}
        right={["Live now", "pu-study-hub-orcin.vercel.app"]}
        color={C.cream}
        delay={20}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Display size={250} color={C.cream} align="center">
          <Reveal delay={6}>Free for every</Reveal>
          <Reveal delay={16}>
            <span style={{ fontStyle: "italic", color: C.ember }}>student.</span>
          </Reveal>
        </Display>
        <FadeUp delay={40}>
          <div style={{ ...body(C.cream, 40), marginTop: 40 }}>
            Built with universities, not against them.
          </div>
        </FadeUp>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#000", opacity: out }} />
    </AbsoluteFill>
  );
};
