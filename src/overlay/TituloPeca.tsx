import React from "react";
import { useCurrentFrame } from "remotion";
import { ROTEIRO } from "../dados/roteiro";
import { clamp01, entrada, segDe } from "../util/tempo";
import { dxTitulo, janelaTitulo, yTitulo } from "./posTitulo";
import { LARGURA_SEGURA, MONTSERRAT, contorno, tamanhoQueCabe } from "../util/texto";

export const TituloPeca: React.FC = () => {
  const frame = useCurrentFrame();
  const i = segDe(frame);
  const titulo = ROTEIRO[i].titulo;
  if (!titulo) return null;
  const j = janelaTitulo(i);
  if (frame < j.ini || frame >= j.fim + 2) return null;
  const opacidade = 1 - clamp01((frame - j.fim) / 2);
  const escala = 0.6 + 0.4 * entrada(frame - j.ini, 7);
  const fs = tamanhoQueCabe(titulo, titulo.length >= 12 ? 78 : 104, LARGURA_SEGURA, 900, true, 7);
  return (
    <div style={{ position: "absolute", left: 540 + dxTitulo(i) - LARGURA_SEGURA / 2, width: LARGURA_SEGURA, top: yTitulo(i), transform: `translateY(-50%) scale(${escala})`, opacity: opacidade, textAlign: "center" }}>
      <span style={{ fontFamily: MONTSERRAT, fontWeight: 900, fontStyle: "italic", fontSize: fs, color: "#F5C542", whiteSpace: "nowrap", lineHeight: 1, ...contorno(7, "#1A1A1A") }}>{titulo}</span>
    </div>
  );
};
