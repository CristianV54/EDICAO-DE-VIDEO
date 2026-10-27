import React, { createContext, useContext, useMemo } from "react";
import * as THREE from "three";

type Def = { t: string; fg: string; bg?: string; w: number; h: number; peso: number; fonte?: number };
const DEFS = {
  auto: { t: "AUTO", fg: "#FFFFFF", w: 256, h: 128, peso: 900 },
  m: { t: "M", fg: "#3DDC84", w: 256, h: 128, peso: 900 },
  lente: { t: "50mm", fg: "#D4A537", w: 384, h: 128, peso: 900 },
  sd: { t: "SD", fg: "#FFFFFF", w: 256, h: 128, peso: 900 },
  rs: { t: "R$", fg: "#3DDC84", w: 256, h: 128, peso: 900 },
  trinta: { t: "30%", fg: "#F5C542", w: 256, h: 128, peso: 900 },
  sab: { t: "SÁB", fg: "#1A1A1A", w: 256, h: 128, peso: 900 },
  plq_portfolio: { t: "PORTFÓLIO", fg: "#1A1A1A", bg: "#F7F5F0", w: 512, h: 160, peso: 800 },
  plq_instagram: { t: "INSTAGRAM", fg: "#1A1A1A", bg: "#F7F5F0", w: 512, h: 160, peso: 800 },
  plq_proposta: { t: "PROPOSTA", fg: "#1A1A1A", bg: "#F7F5F0", w: 512, h: 160, peso: 800 },
  plq_contrato: { t: "CONTRATO", fg: "#1A1A1A", bg: "#F7F5F0", w: 512, h: 160, peso: 800 },
  plq_sinal: { t: "SINAL", fg: "#1A1A1A", bg: "#F7F5F0", w: 512, h: 160, peso: 800 },
  plq_backup: { t: "BACKUP", fg: "#1A1A1A", bg: "#F7F5F0", w: 512, h: 160, peso: 800 },
  plq_galeria: { t: "GALERIA", fg: "#1A1A1A", bg: "#F7F5F0", w: 512, h: 160, peso: 800 },
  plq_depoimento: { t: "DEPOIMENTO", fg: "#1A1A1A", bg: "#F7F5F0", w: 512, h: 160, peso: 800 },
  folha_proposta: { t: "PROPOSTA", fg: "#1A1A1A", w: 512, h: 128, peso: 900 },
  assinado: { t: "ASSINADO", fg: "#2BB673", w: 512, h: 160, peso: 900 },
} satisfies Record<string, Def>;

export type NomeTex = keyof typeof DEFS;
type Mapa = Record<NomeTex, THREE.CanvasTexture>;
const Ctx = createContext<Mapa | null>(null);

export const FONTES_USADAS = [
  "700 40px Montserrat",
  "800 40px Montserrat",
  "900 40px Montserrat",
  "italic 900 40px Montserrat",
  "500 40px 'JetBrains Mono'",
];

export const esperarFontes = async () => {
  await Promise.all(FONTES_USADAS.map((f) => document.fonts.load(f, "AaÇÃÊÓ0123%$")));
  await document.fonts.ready;
};

const desenhar = (d: Def): THREE.CanvasTexture => {
  const c = document.createElement("canvas");
  c.width = d.w;
  c.height = d.h;
  const g = c.getContext("2d")!;
  if (d.bg) {
    // plaquinha de cantos arredondados
    const r = d.h * 0.28;
    g.fillStyle = d.bg;
    g.beginPath();
    g.moveTo(r, 0);
    g.arcTo(d.w, 0, d.w, d.h, r);
    g.arcTo(d.w, d.h, 0, d.h, r);
    g.arcTo(0, d.h, 0, 0, r);
    g.arcTo(0, 0, d.w, 0, r);
    g.closePath();
    g.fill();
    g.fillStyle = d.fg;
  }
  g.fillStyle = d.fg;
  g.textAlign = "center";
  g.textBaseline = "middle";
  let fs = d.h * 0.72;
  g.font = `${d.peso} ${fs}px Montserrat`;
  const larg = g.measureText(d.t).width;
  if (larg > d.w * 0.92) {
    fs *= (d.w * 0.92) / larg;
    g.font = `${d.peso} ${fs}px Montserrat`;
  }
  g.fillText(d.t, d.w / 2, d.h / 2 + fs * 0.04);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
};

// As fontes ja foram esperadas antes de montar o canvas (ver Video.tsx), entao as texturas saem sincronas.
export const TexturasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mapa = useMemo(() => {
    const m = {} as Mapa;
    (Object.keys(DEFS) as NomeTex[]).forEach((k) => {
      m[k] = desenhar(DEFS[k]);
    });
    return m;
  }, []);
  return <Ctx.Provider value={mapa}>{children}</Ctx.Provider>;
};

export const useTex = (n: NomeTex): THREE.CanvasTexture => useContext(Ctx)![n];
