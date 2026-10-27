import React, { createContext, useContext, useMemo } from "react";
import * as THREE from "three";
import { ESTADOS, EstadoTelao, criarCanvasTelao } from "./telaoDesenho";

type Def = { t: string; fg: string; bg?: string; w: number; h: number; peso: number };
const PLQ = { fg: "#1A1A1A", bg: "#FFFFFF", w: 512, h: 160, peso: 800 };
const BAL = { fg: "#1A1A1A", bg: "#FFFFFF", w: 640, h: 220, peso: 800 };
const DEFS = {
  auto: { t: "AUTO", fg: "#FFFFFF", w: 256, h: 128, peso: 900 },
  m: { t: "M", fg: "#3DDC84", w: 256, h: 128, peso: 900 },
  lente: { t: "50mm", fg: "#FFFFFF", w: 384, h: 128, peso: 900 },
  rs: { t: "R$", fg: "#1A1A1A", w: 256, h: 128, peso: 900 },
  trinta: { t: "30%", fg: "#1A1A1A", w: 256, h: 128, peso: 900 },
  sab: { t: "SÁB", fg: "#1A1A1A", w: 256, h: 128, peso: 900 },
  tres_x: { t: "3x", fg: "#D4A537", w: 256, h: 192, peso: 900 },
  assinado: { t: "ASSINADO", fg: "#2BB673", w: 512, h: 160, peso: 900 },
  plq_camera: { t: "CÂMERA", ...PLQ },
  plq_portfolio: { t: "PORTFÓLIO", ...PLQ },
  plq_instagram: { t: "INSTAGRAM", ...PLQ },
  plq_proposta: { t: "PROPOSTA", ...PLQ },
  plq_contrato: { t: "CONTRATO", ...PLQ },
  plq_sinal: { t: "SINAL", ...PLQ },
  plq_lente: { t: "LENTE", ...PLQ },
  plq_slots: { t: "2 SLOTS", ...PLQ },
  plq_flash: { t: "FLASH", ...PLQ },
  plq_backup: { t: "BACKUP", ...PLQ },
  plq_galeria: { t: "GALERIA", ...PLQ },
  plq_depoimento: { t: "DEPOIMENTO", ...PLQ },
  plq_indicacao: { t: "INDICAÇÃO", ...PLQ },
  bal_quanto: { t: "quanto custa?", ...BAL },
  bal_madrinha: { t: "você fotografa o meu casamento?", ...BAL, h: 260 },
  x_vermelho: { t: "X", fg: "#FFFFFF", w: 128, h: 128, peso: 900 },
} satisfies Record<string, Def>;

export type NomeTex = keyof typeof DEFS;
type Mapa = Record<NomeTex, THREE.CanvasTexture>;
type Ctx = { tex: Mapa; telao: Record<EstadoTelao, THREE.CanvasTexture>; pixelado: THREE.CanvasTexture; ruido: THREE.CanvasTexture };
const C = createContext<Ctx | null>(null);

export const FONTES_USADAS = ["700 40px Montserrat", "800 40px Montserrat", "900 40px Montserrat", "italic 900 40px Montserrat", "500 40px 'JetBrains Mono'"];

export const esperarFontes = async () => {
  await Promise.all(FONTES_USADAS.map((f) => document.fonts.load(f, "AaÇÃÊÓ0123%$")));
  await document.fonts.ready;
};

const quebra = (g: CanvasRenderingContext2D, texto: string, larg: number): string[] => {
  const pal = texto.split(" ");
  const linhas: string[] = [];
  let atual = "";
  pal.forEach((p) => {
    const t = atual ? `${atual} ${p}` : p;
    if (g.measureText(t).width > larg && atual) {
      linhas.push(atual);
      atual = p;
    } else atual = t;
  });
  if (atual) linhas.push(atual);
  return linhas;
};

const paraTex = (c: HTMLCanvasElement) => {
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
};

const desenhar = (d: Def): THREE.CanvasTexture => {
  const c = document.createElement("canvas");
  c.width = d.w;
  c.height = d.h;
  const g = c.getContext("2d")!;
  if (d.bg) {
    const r = d.h * 0.22;
    g.fillStyle = d.bg;
    g.beginPath();
    g.moveTo(r, 0);
    g.arcTo(d.w, 0, d.w, d.h, r);
    g.arcTo(d.w, d.h, 0, d.h, r);
    g.arcTo(0, d.h, 0, 0, r);
    g.arcTo(0, 0, d.w, 0, r);
    g.closePath();
    g.fill();
  }
  g.fillStyle = d.fg;
  g.textAlign = "center";
  g.textBaseline = "middle";
  const multi = d.t.indexOf(" ") > 0 && d.t.length > 14;
  let fs = d.h * (multi ? 0.3 : 0.62);
  g.font = `${d.peso} ${fs}px Montserrat`;
  if (multi) {
    const linhas = quebra(g, d.t, d.w * 0.86);
    linhas.forEach((l, k) => g.fillText(l, d.w / 2, d.h / 2 + (k - (linhas.length - 1) / 2) * fs * 1.2));
  } else {
    const larg = g.measureText(d.t).width;
    if (larg > d.w * 0.88) {
      fs *= (d.w * 0.88) / larg;
      g.font = `${d.peso} ${fs}px Montserrat`;
    }
    g.fillText(d.t, d.w / 2, d.h / 2 + fs * 0.04);
  }
  return paraTex(c);
};

// foto "pixelada" do celular da noiva: blocos grandes de cor
const desenharPixelado = (): THREE.CanvasTexture => {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 176;
  const g = c.getContext("2d")!;
  const cores = ["#F6C28B", "#F29E7E", "#FFE9A8", "#D9774F", "#FFFFFF", "#C9C9C9", "#8F6C48", "#E9CFA3"];
  for (let y = 0; y < 8; y++) for (let x = 0; x < 6; x++) {
    g.fillStyle = cores[(x * 3 + y * 5 + (x * y) % 3) % cores.length];
    g.fillRect(x * (128 / 6), y * 22, 128 / 6 + 1, 23);
  }
  const t = paraTex(c);
  t.magFilter = THREE.NearestFilter;
  return t;
};

export const TexturasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const valor = useMemo<Ctx>(() => {
    const tex = {} as Mapa;
    (Object.keys(DEFS) as NomeTex[]).forEach((k) => {
      tex[k] = desenhar(DEFS[k]);
    });
    const telao = {} as Record<EstadoTelao, THREE.CanvasTexture>;
    ESTADOS.forEach((e) => {
      telao[e] = paraTex(criarCanvasTelao(e));
    });
    const vazio = document.createElement("canvas");
    vazio.width = 8;
    vazio.height = 8;
    return { tex, telao, pixelado: desenharPixelado(), ruido: paraTex(vazio) };
  }, []);
  return <C.Provider value={valor}>{children}</C.Provider>;
};

export const useTex = (n: NomeTex): THREE.CanvasTexture => useContext(C)!.tex[n];
export const useTelao = (e: EstadoTelao): THREE.CanvasTexture => useContext(C)!.telao[e];
export const usePixelado = (): THREE.CanvasTexture => useContext(C)!.pixelado;
