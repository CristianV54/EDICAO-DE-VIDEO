import React from "react";
import { useCurrentFrame } from "remotion";
import { ROTEIRO, Etiqueta } from "../dados/roteiro";
import { projetar } from "../cena/projecao";
import { LINHAS, cardVisivel, entrada, segDe } from "../util/tempo";
import { MONTSERRAT } from "../util/texto";

const COR_BOLINHA = { problema: "#FF4D4D", solucao: "#3DDC84", cinza: "#9AA0AC" };
const Y_MIN_CARD = 600; // card visivel: abaixo do card e do titulo
const Y_MIN_LIVRE = 300; // card oculto
const Y_MAX = 1040; // acima da legenda (y 1240) e do titulo (y 1110)
const X_MIN = 60;
const X_MAX = 960;

const quandoFrame = (i: number, nome: string): number | null => {
  const v = LINHAS[i].ev[nome];
  return v === undefined ? null : v;
};

const ativa = (i: number, frame: number): { e: Etiqueta; ini: number } | null => {
  let achada: { e: Etiqueta; ini: number } | null = null;
  for (const e of ROTEIRO[i].etiquetas) {
    const q = quandoFrame(i, e.quando);
    if (q === null || frame < q) continue;
    if (e.ate) {
      const fimQ = quandoFrame(i, e.ate);
      if (fimQ !== null && frame >= fimQ) continue;
    }
    achada = { e, ini: q };
  }
  return achada;
};

export const Etiquetas: React.FC = () => {
  const frame = useCurrentFrame();
  const i = segDe(frame);
  const a = ativa(i, frame);
  if (!a) return null;
  const { e, ini } = a;
  const mundo = e.alvo!;
  const p = projetar(frame, mundo);
  const larg = e.texto.length * 20 + 80;
  const x = Math.min(X_MAX - larg / 2, Math.max(X_MIN + larg / 2, p.x));
  const y = Math.min(Y_MAX, Math.max(cardVisivel(frame) ? Y_MIN_CARD : Y_MIN_LIVRE, p.y));
  const escala = entrada(frame - ini, 6);
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${escala})`,
        display: "flex", alignItems: "center", gap: 12, padding: "12px 28px 12px 22px", borderRadius: 999,
        background: "#FFFFFF", border: "3px solid #1A1A1A", fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 30,
        color: "#1A1A1A", whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ width: 14, height: 14, borderRadius: 7, background: COR_BOLINHA[e.tipo] }} />
      {e.texto}
    </div>
  );
};
