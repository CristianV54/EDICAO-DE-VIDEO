// Estado de cada personagem por frame (funcoes puras). Usado pelo Elenco 3D, pelo teste de interseccao e pelas estacoes.
import {
  ENTRADA_MADRINHA, V3, posAmigoA, posAmigoB, posCli, posFot, posNoiva, posNoivo, rotRepouso,
} from "../dados/posicoes";
import { FLASHES, LINHAS, WALK, CAMINHADA_MADRINHA, clamp01, easeInOutCubic, lerp, segDe } from "../util/tempo";
import { localParaMundo, mundoParaLocal } from "./geometria";
import type { Expr } from "./Personagem";

const mix = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const rampa = (f: number, f0: number, dur: number) => easeInOutCubic(clamp01((f - f0) / dur));
const difAng = (a: number, b: number) => {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
};
const mixAng = (a: number, b: number, t: number) => a + difAng(a, b) * t;

export type Estado = {
  vis: boolean;
  opac: number;
  pos: V3;
  rotY: number;
  passo: number;
  expr: Expr;
  mp?: V3;
  mn?: V3;
  inclina?: number;
  olhar?: number;
  inclinaCabeca?: number;
  celular?: boolean; // celular na mao do lado x positivo
  buque?: boolean; // buque na mao do lado x negativo
};

const INVISIVEL: Estado = { vis: false, opac: 0, pos: [0, 0, 0], rotY: 0, passo: 0, expr: "normal" };

// caminhada de uma casa para a outra no inicio do segmento i (0,9 s, easeInOutCubic)
const andar = (f: number, i: number, de: V3, para: V3, rotDe: number, rotPara: number) => {
  const L = LINHAS[i];
  const u = clamp01((f - L.ini) / WALK);
  const e = easeInOutCubic(u);
  const pos = mix(de, para, e);
  const ang = Math.atan2(para[0] - de[0], para[2] - de[2]);
  let rot = ang;
  if (u < 0.15) rot = mixAng(rotDe, ang, u / 0.15);
  else if (u > 0.7) rot = mixAng(ang, rotPara, (u - 0.7) / 0.3);
  const tSeg = (f - L.ini) / 30;
  const env = u > 0 && u < 1 ? Math.min(1, 3 * Math.sin(Math.PI * u)) : 0;
  return { pos, rotY: rot, passo: 0.5 * Math.sin(2 * Math.PI * tSeg) * env, andando: u < 1 };
};

// bump de clique: a camera sobe ao rosto, segura e desce
export const levantaEm = (f: number): number => {
  let v = 0;
  for (const { f: c } of FLASHES) {
    const d = f - c;
    let x = 0;
    if (d >= -8 && d <= 0) x = easeInOutCubic((d + 8) / 8);
    else if (d > 0 && d <= 4) x = 1;
    else if (d > 4 && d <= 12) x = 1 - easeInOutCubic((d - 4) / 8);
    v = Math.max(v, x);
  }
  return v;
};

export type EstadoFot = Estado & {
  lev: number;
  lente: "kit" | "50";
  troca: number;
  cartoes: "nenhum" | "azuis" | "falha" | "salvo";
  flash: number;
  etiquetaLoja: boolean;
};

export const fotografo = (f: number): EstadoFot => {
  const i = segDe(f);
  const L = LINHAS[i];
  const n = Math.min(Math.max(i, 1), 13);
  let pos = posFot(n);
  let rotY = rotRepouso(n);
  let passo = 0;
  if (i >= 2 && i <= 13) {
    const a = andar(f, i, posFot(i - 1), posFot(i), rotRepouso(i - 1), rotRepouso(i));
    pos = a.pos;
    rotY = a.rotY;
    passo = a.passo;
  }
  let lev = levantaEm(f);
  if (i === 0) lev = Math.max(lev, 0.5 * rampa(f, L.sol, 14));
  if (i === 7) lev = Math.max(lev, 0.15 * rampa(f, LINHAS[7].sol - 12, 8) * (1 - rampa(f, LINHAS[7].sol + 24, 10)));
  if (i === 9) lev = Math.max(lev, 0.12 * rampa(f, LINHAS[9].sol - 10, 8) * (1 - rampa(f, LINHAS[9].sol + 20, 10)));
  const feliz = i >= 1 && f >= L.sol && f < L.sol + 40;
  const L7 = LINHAS[7];
  const lente: "kit" | "50" = i < 7 || (i === 7 && f < L7.sol) ? "kit" : "50";
  const troca = i === 7 ? clamp01((f - L7.sol) / 16) : 0;
  let cartoes: EstadoFot["cartoes"] = "nenhum";
  if (i === 8) cartoes = f < LINHAS[8].prob ? "azuis" : f < LINHAS[8].sol ? "falha" : "salvo";
  else if (i > 8) cartoes = "azuis";
  const flash = i >= 9 && f >= LINHAS[9].sol ? Math.min(1, (f - LINHAS[9].sol) / 6) : 0;
  return { vis: true, opac: 1, pos, rotY, passo, expr: feliz || i === 14 ? "feliz" : "normal", lev, lente, troca, cartoes, flash, etiquetaLoja: i === 0 };
};

// fracao de "virar de costas" entre o problema e a solucao
const costas = (f: number, i: number) => rampa(f, LINHAS[i].prob, 8) * (1 - rampa(f, LINHAS[i].sol, 8));

export const noiva = (f: number): Estado => {
  const i = segDe(f);
  const L = LINHAS[i];
  const fimSeg = L.fim;
  let pos: V3 | null = null;
  let rotY = 0;
  let passo = 0;
  let opac = 1;
  let expr: Expr = "normal";
  const e: Estado = { ...INVISIVEL };
  if (i >= 4 && i <= 9) {
    if (i === 4) {
      pos = posCli(4);
      rotY = rotRepouso(4);
      opac = rampa(f, L.ini, 12);
    } else {
      const a = andar(f, i, posNoiva(i - 1), posNoiva(i), rotRepouso(i - 1), rotRepouso(i));
      pos = a.pos;
      rotY = a.rotY;
      passo = a.passo;
    }
    if (i === 9) opac = 1 - rampa(f, fimSeg - 12, 12);
  } else if (i === 10 && f < L.ini) return e;
  else if (i === 11) {
    pos = posCli(11);
    rotY = rotRepouso(11);
    opac = rampa(f, L.ini, 12);
  } else if (i === 12) {
    const a = andar(f, i, posCli(11), posCli(12), rotRepouso(11), rotRepouso(12));
    pos = a.pos;
    rotY = a.rotY;
    passo = a.passo;
  } else if (i === 13) {
    pos = posCli(12);
    rotY = rotRepouso(12);
    opac = 1 - rampa(f, L.ini, 12);
  }
  if (!pos || opac <= 0.01) return e;
  const out: Estado = { vis: true, opac, pos, rotY, passo, expr };
  const prob = L.prob;
  const sol = L.sol;
  if (i === 4) {
    out.rotY += Math.PI * costas(f, 4);
    out.celular = f < sol;
    if (out.celular) out.mp = [0.12, 0.98, 0.3];
    if (f >= sol) {
      out.mp = [0.22, 1.05, 0.5];
      out.expr = "feliz";
    }
  }
  if (i === 5) {
    out.rotY += Math.PI * costas(f, 5);
    if (f >= prob && f < sol) {
      out.mp = [-0.12, 0.88, 0.2];
      out.mn = [0.12, 0.92, 0.2];
    }
    if (f >= sol) out.expr = "feliz";
  }
  if (i === 6 && f >= sol) out.expr = "feliz";
  if (i >= 7 && i <= 9) {
    out.expr = "feliz";
    out.buque = true;
    out.mn = [-0.1, 0.95, 0.32];
    const pv = posNoivo(i);
    const mid: V3 = [(pos[0] + pv[0]) / 2, 0.68, (pos[2] + pv[2]) / 2 + 0.05];
    out.mp = mundoParaLocal(pos, out.rotY, mid);
    if (i === 8) {
      const k = rampa(f, L.ev.sim, 8) * (1 - rampa(f, L.ev.sim + 36, 10));
      out.olhar = 0.35 * k;
      out.inclinaCabeca = -0.12 * k;
    }
    if (i === 9) out.inclina = 0.1 * Math.sin(((f - L.ini) / 30) * 2 * Math.PI * 0.9);
  }
  if (i === 11) {
    out.celular = f < sol;
    if (out.celular) out.mp = [0.12, 0.98, 0.3];
    if (f >= L.prob && f < sol) out.mn = [-0.02, 0.92, 0.22]; // reclama: um braco cruza o corpo, o outro segura o celular
    if (f >= sol) {
      out.expr = "feliz";
      out.rotY = rotRepouso(11) + 0.9 * rampa(f, sol, 10);
    }
  }
  if (i === 12) out.expr = f < L.ev.depoimento ? "emocao" : "feliz";
  if (i === 13) out.expr = "feliz";
  return out;
};

export const noivo = (f: number): Estado => {
  const i = segDe(f);
  const L = LINHAS[i];
  if (i < 7 || i > 9) return { ...INVISIVEL };
  let pos: V3;
  let rotY: number;
  let passo = 0;
  let opac = 1;
  if (i === 7) {
    pos = posNoivo(7);
    rotY = rotRepouso(7);
    opac = rampa(f, L.ini, 12);
  } else {
    const a = andar(f, i, posNoivo(i - 1), posNoivo(i), rotRepouso(i - 1), rotRepouso(i));
    pos = a.pos;
    rotY = a.rotY;
    passo = a.passo;
  }
  if (i === 9) opac = 1 - rampa(f, L.fim - 12, 12);
  const out: Estado = { vis: true, opac, pos, rotY, passo, expr: "feliz" };
  const pn = noiva(f);
  if (pn.vis) {
    const mid: V3 = [(pos[0] + pn.pos[0]) / 2, 0.68, (pos[2] + pn.pos[2]) / 2 + 0.05];
    out.mn = mundoParaLocal(pos, rotY, mid);
  }
  if (i === 8) {
    const k = rampa(f, L.ev.sim, 8) * (1 - rampa(f, L.ev.sim + 36, 10));
    out.olhar = -0.35 * k;
    out.inclinaCabeca = 0.12 * k;
  }
  if (i === 9) out.inclina = -0.1 * Math.sin(((f - L.ini) / 30) * 2 * Math.PI * 0.9);
  return out;
};

// casal de amigos do s02: de maos dadas, posam em "amigos" e acenam na solucao
export const amigos = (f: number): { a: Estado; b: Estado } => {
  const i = segDe(f);
  const L = LINHAS[i];
  const inv = { a: { ...INVISIVEL }, b: { ...INVISIVEL } };
  if (i !== 2) return inv;
  const opac = Math.min(rampa(f, L.ini, 8), 1 - rampa(f, L.fim - 12, 12));
  if (opac <= 0.01) return inv;
  const pa = posAmigoA(2);
  const pb = posAmigoB(2);
  const pose = rampa(f, L.ev.amigos, 8) * (1 - rampa(f, L.ev.amigos + 50, 10));
  const mid: V3 = [(pa[0] + pb[0]) / 2, lerp(0.7, 1.0, pose), (pa[2] + pb[2]) / 2 + 0.05];
  const ra = rotRepouso(2);
  const a: Estado = { vis: true, opac, pos: pa, rotY: ra, passo: 0, expr: "feliz", mp: mundoParaLocal(pa, ra, mid), inclina: -0.06 * pose };
  const b: Estado = { vis: true, opac, pos: pb, rotY: ra, passo: 0, expr: "feliz", mn: mundoParaLocal(pb, ra, mid), inclina: 0.06 * pose };
  if (f >= L.sol) {
    const w = rampa(f, L.sol, 6);
    const osc = Math.sin(f * 0.7) * 0.08;
    a.mn = [lerp(-0.36, -0.46, w), lerp(0.57, 1.45, w) + osc * w, 0.1];
    b.mp = [lerp(0.36, 0.46, w), lerp(0.57, 1.45, w) + osc * w, 0.1];
  }
  return { a, b };
};

export const madrinha = (f: number): Estado => {
  const i = segDe(f);
  const L = LINHAS[13];
  if (i < 13) return { ...INVISIVEL };
  const ini = L.prob;
  if (f < ini) return { ...INVISIVEL };
  const u = clamp01((f - ini) / CAMINHADA_MADRINHA);
  const alvo = posCli(13);
  const pos = mix(ENTRADA_MADRINHA, alvo, u);
  const ang = Math.atan2(alvo[0] - ENTRADA_MADRINHA[0], alvo[2] - ENTRADA_MADRINHA[2]);
  const rot = u < 0.7 ? ang : mixAng(ang, rotRepouso(13), easeInOutCubic((u - 0.7) / 0.3));
  const env = u > 0 && u < 1 ? 1 : 0;
  return {
    vis: true, opac: rampa(f, ini, 6), pos, rotY: rot, passo: 0.5 * Math.sin(((f - ini) / 30) * 2 * Math.PI) * env,
    expr: u >= 1 ? "feliz" : "normal", mp: [0.12, 1.0, 0.3], celular: true,
  };
};

export const maoNoivaMundo = (f: number): V3 => {
  const n = noiva(f);
  return localParaMundo(n.pos, n.rotY, n.mp ?? [0.22, 1.05, 0.5]);
};
