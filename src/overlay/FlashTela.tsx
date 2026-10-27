import React from "react";
import { useCurrentFrame } from "remotion";
import { FLASHES } from "../util/tempo";

export const FlashTela: React.FC = () => {
  const frame = useCurrentFrame();
  let op = 0;
  for (const { f, dur } of FLASHES) {
    const d = frame - f;
    if (d >= 0 && d < dur) op = Math.max(op, 0.85 * (1 - d / (dur + 1)));
  }
  if (op <= 0) return null;
  return <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", opacity: op }} />;
};
