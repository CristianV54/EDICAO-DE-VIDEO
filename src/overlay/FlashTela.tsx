import React from "react";
import { useCurrentFrame } from "remotion";
import { FRAMES_FLASH } from "../util/tempo";

export const FlashTela: React.FC = () => {
  const frame = useCurrentFrame();
  let op = 0;
  for (const f0 of FRAMES_FLASH) {
    const d = frame - f0;
    if (d >= 0 && d < 5) op = Math.max(op, 0.85 * (1 - d / 5));
  }
  if (op <= 0) return null;
  return <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", opacity: op }} />;
};
