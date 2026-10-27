import React from "react";
import { useCurrentFrame } from "remotion";
import { ROTEIRO } from "../dados/roteiro";
import { LINHAS, clamp01, entrada, segDe } from "../util/tempo";
import { LARGURA_SEGURA, MONTSERRAT, contorno, tamanhoQueCabe } from "../util/texto";

export const TituloPeca: React.FC = () => {
  const frame = useCurrentFrame();
  const i = segDe(frame);
  const titulo = ROTEIRO[i].titulo;
  if (!titulo) return null;
  const L = LINHAS[i];
  if (frame >= L.tituloFim + 6) return null;
  const opacidade = 1 - clamp01((frame - L.tituloFim) / 6);
  const escala = 0.6 + 0.4 * entrada(frame - L.ini, 7);
  const fs = tamanhoQueCabe(titulo, 104, LARGURA_SEGURA, 900, true, 7);
  return (
    <div style={{ position: "absolute", left: 540 - LARGURA_SEGURA / 2, width: LARGURA_SEGURA, top: 1020, transform: `translateY(-50%) scale(${escala})`, opacity: opacidade, textAlign: "center" }}>
      <span style={{ fontFamily: MONTSERRAT, fontWeight: 900, fontStyle: "italic", fontSize: fs, color: "#F5C542", whiteSpace: "nowrap", lineHeight: 1, ...contorno(7, "#1A1A1A") }}>{titulo}</span>
    </div>
  );
};
