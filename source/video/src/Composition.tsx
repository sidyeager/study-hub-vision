import React from "react";
import { Composition, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import "./theme";
import {
  Ask,
  Close,
  Cover,
  How,
  Model,
  Need,
  Problem,
  Product,
  Roadmap,
  Today,
  Vision,
} from "./scenes";

const T = 18; // cross-fade length in frames

const SCENES: [React.FC, number][] = [
  [Cover, 180],
  [Problem, 210],
  [Need, 150],
  [Product, 210],
  [Today, 180],
  [Vision, 165],
  [How, 210],
  [Roadmap, 250],
  [Model, 210],
  [Ask, 180],
  [Close, 180],
];

const TOTAL =
  SCENES.reduce((sum, [, d]) => sum + d, 0) - (SCENES.length - 1) * T;

export const StudyHubPitch: React.FC = () => (
  <>
    {/* "Covert Affair" by Kevin MacLeod (incompetech.com), CC BY 4.0. Mixed by audio/music_mix.py */}
    <Audio src={staticFile("soundtrack.wav")} />
    <TransitionSeries>
      {SCENES.flatMap(([Scene, d], i) => {
        const seq = (
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={d}>
            <Scene />
          </TransitionSeries.Sequence>
        );
        if (i === 0) return [seq];
        return [
          <TransitionSeries.Transition
            key={`t${i}`}
            presentation={fade()}
            timing={linearTiming({ durationInFrames: T })}
          />,
          seq,
        ];
      })}
    </TransitionSeries>
  </>
);

export const MyComposition = () => (
  <Composition
    id="StudyHubPitch"
    component={StudyHubPitch}
    durationInFrames={TOTAL}
    fps={30}
    width={1920}
    height={1080}
  />
);
