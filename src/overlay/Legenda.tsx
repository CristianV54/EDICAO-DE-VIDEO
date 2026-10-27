import React from "react";
import { useCurrentFrame } from "remotion";
import { FPS, PALAVRAS } from "../util/tempo";
import { LARGURA_SEGURA, MONTSERRAT, contorno, tamanhoQueCabe } from "../util/texto";

const SEGURA_S = 0.6;

export const Legenda: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let idx = -1;
  for (let k = 0; k < PALAVRAS.length; k++) {
    if (PALAVRAS[k].inicio <= t + 1e-6) idx = k;
    else break;
  }
  if (idx < 0) return null;
  const w = PALAVRAS[idx];
  if (t - w.fim > SEGURA_S) return null;
  const f = frame - Math.round(w.inicio * FPS);
  const escala = 1 + 0.12 * (1 - Math.min(1, Math.max(0, f / 4)));
  const fs = tamanhoQueCabe(w.texto, 110, LARGURA_SEGURA, 900, false, 10);
  return (
    <div style={{ position: "absolute", left: 540 - LARGURA_SEGURA / 2, width: LARGURA_SEGURA, top: 1240, transform: `translateY(-50%) scale(${escala})`, textAlign: "center" }}>
      <span style={{ fontFamily: MONTSERRAT, fontWeight: 900, fontSize: fs, color: "#FFFFFF", lineHeight: 1, whiteSpace: "nowrap", ...contorno(10, "#000000") }}>{w.texto}</span>
    </div>
  );
};
