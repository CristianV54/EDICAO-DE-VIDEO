import React from "react";
import { useCurrentFrame } from "remotion";
import { LINHAS, entrada, pop } from "../util/tempo";
import { MONTSERRAT } from "../util/texto";

export const Contador: React.FC = () => {
  const frame = useCurrentFrame();
  const aparece = LINHAS[0].sol; // "treze"
  if (frame < aparece) return null;
  let n = 0;
  let ultimo = Infinity;
  for (let p = 1; p <= 13; p++) {
    const d = frame - LINHAS[p].toque;
    if (d >= 0) {
      n++;
      ultimo = Math.min(ultimo, d);
    }
  }
  const escala = entrada(frame - aparece, 8) * (isFinite(ultimo) ? pop(ultimo, 8, 1.18) : 1);
  return (
    <div
      style={{
        position: "absolute", top: 175, right: 60, padding: "12px 32px", borderRadius: 999,
        background: "#F7F5F0", border: "3px solid #1A1A1A", fontFamily: MONTSERRAT, fontWeight: 800,
        fontSize: 46, color: "#1A1A1A", transform: `scale(${escala})`, transformOrigin: "100% 50%", whiteSpace: "nowrap",
      }}
    >
      PEÇAS <span style={{ color: "#D4A537" }}>{n}</span>/13
    </div>
  );
};
