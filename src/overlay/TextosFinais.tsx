import React from "react";
import { useCurrentFrame } from "remotion";
import { LINHAS, entrada } from "../util/tempo";
import { LARGURA_SEGURA, MONTSERRAT, contorno, tamanhoQueCabe } from "../util/texto";

const LINHAS_FINAIS = [
  { t: "COMENTA QUAL PEÇA", cor: "#FFFFFF", fs: 64, italico: false, y: 420, borda: 7 },
  { t: "VOCÊ QUER VER", cor: "#F5C542", fs: 118, italico: true, y: 540, borda: 8 },
  { t: "DESMONTADA", cor: "#4DA3FF", fs: 128, italico: true, y: 670, borda: 8 },
];

export const TextosFinais: React.FC = () => {
  const frame = useCurrentFrame();
  const ini = LINHAS[14].sol;
  if (frame < ini) return null;
  return (
    <>
      {LINHAS_FINAIS.map((l, k) => {
        const e = entrada(frame - ini - k * 6, 6);
        const fs = tamanhoQueCabe(l.t, l.fs, LARGURA_SEGURA, 900, l.italico, l.borda);
        return (
          <div key={l.t} style={{ position: "absolute", left: 540 - LARGURA_SEGURA / 2, width: LARGURA_SEGURA, top: l.y, transform: `translateY(-50%) scale(${e})`, textAlign: "center", opacity: e > 0 ? 1 : 0 }}>
            <span style={{ fontFamily: MONTSERRAT, fontWeight: 900, fontStyle: l.italico ? "italic" : "normal", fontSize: fs, color: l.cor, lineHeight: 1, whiteSpace: "nowrap", ...contorno(l.borda, "#000000") }}>{l.t}</span>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 540 - LARGURA_SEGURA / 2, width: LARGURA_SEGURA, top: 1440, transform: `translateY(-50%) scale(${entrada(frame - ini - 18, 6)})`, textAlign: "center" }}>
        <span style={{ display: "inline-block", padding: "12px 34px", borderRadius: 999, background: "#1B1D24", color: "#FFFFFF", fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 34 }}>@ramesfares</span>
      </div>
    </>
  );
};
