import React from "react";
import { useCurrentFrame } from "remotion";
import { ROTEIRO } from "../dados/roteiro";
import { CARD_SLIDE, FPS, LINHAS, cardVisivel, easeInOutCubic, segDe } from "../util/tempo";
import { MONO } from "../util/texto";

const DESLOCA = 560;

// O card entra deslizando de cima no inicio de cada segmento (s01 a s13), digita, mostra o check no momento da peca
// e sai deslizando para cima em max(momento + 0,5 s, min(momento + 1,2 s, contexto - 0,3 s)). Em s00 e s14 nao aparece.
export const CardAnotacoes: React.FC = () => {
  const frame = useCurrentFrame();
  if (!cardVisivel(frame)) return null;
  const i = segDe(frame);
  const L = LINHAS[i];
  const entra = easeInOutCubic((frame - L.ini) / CARD_SLIDE);
  const sai = easeInOutCubic((frame - L.cardSai) / CARD_SLIDE);
  const y = -(1 - entra) * DESLOCA - sai * DESLOCA;

  const tarefa = ROTEIRO[i].tarefa ?? "";
  const n = Math.min(L.nChars, Math.floor((Math.max(0, frame - L.cardIni) / FPS) * L.vel));
  const concluido = n >= L.nChars && frame >= L.toque;
  const cursor = Math.floor(frame / 15) % 2 === 0;

  return (
    <div style={{ position: "absolute", top: 250, left: 60, width: 960, transform: `translateY(${y}px)`, background: "#1B1D24", borderRadius: 22, boxShadow: "0 18px 40px rgba(0,0,0,0.35)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 26px", borderBottom: "1px solid #2A2D37" }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 20, height: 20, borderRadius: 10, background: c }} />
        ))}
        <div style={{ marginLeft: 14, fontFamily: MONO, fontWeight: 500, fontSize: 26, color: "#8A8F9C" }}>anotações · carreira</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", padding: "26px 30px 30px", fontFamily: MONO, fontWeight: 500, fontSize: 40, color: "#FFFFFF", whiteSpace: "pre", height: 52 }}>
        <span style={{ color: "#D4A537" }}>{"> "}</span>
        <span>{tarefa.slice(0, n)}</span>
        {!concluido && <span style={{ display: "inline-block", width: 22, height: 44, marginLeft: 4, background: cursor ? "#D4A537" : "transparent" }} />}
        {concluido && (
          <svg width={44} height={44} viewBox="0 0 24 24" style={{ marginLeft: 18 }}>
            <path d="M4 12.5l5 5L20 6.5" fill="none" stroke="#3DDC84" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </div>
  );
};
