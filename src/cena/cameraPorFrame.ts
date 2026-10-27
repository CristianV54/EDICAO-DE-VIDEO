import { ETAPAS_SEG, FOV, poseResolvida, EtapaPlano } from "./enquadramento";
import { posFot } from "../dados/posicoes";
import type { V3 } from "../dados/posicoes";
import { LINHAS, WALK, easeInOutCubic, clamp01, lerp, sf } from "../util/tempo";

export type Pose = { pos: V3; alvo: V3; fov: number };

const mix3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const mixPose = (a: Pose, b: Pose, t: number): Pose => ({ pos: mix3(a.pos, b.pos, t), alvo: mix3(a.alvo, b.alvo, t), fov: lerp(a.fov, b.fov, t) });

type Etapa = { inicio: number; fim: number; e: EtapaPlano; transicao: number; seg: number };

const frameDe = (i: number, e: EtapaPlano): number => {
  const L = LINHAS[i];
  const r = e.quando;
  let base = L.ini;
  if (r.ref === "chegada") base = L.chegada;
  else if (r.ref === "cena") base = L.cenaIni;
  else if (r.ref === "queda") base = L.quedaIni;
  else if (r.ref === "toque") base = L.toque;
  else if (r.ref === "ev") base = L.ev[r.nome ?? "problema"];
  return base + sf(r.desl ?? 0);
};

// sequencia global de etapas (cada plano vale ate o inicio do proximo)
export const ETAPAS: Etapa[] = (() => {
  const out: Etapa[] = [];
  ETAPAS_SEG.forEach((lista, i) => {
    lista.forEach((e) => {
      let ini = frameDe(i, e);
      if (out.length && ini <= out[out.length - 1].inicio) ini = out[out.length - 1].inicio + 1;
      out.push({ inicio: ini, fim: 0, e, transicao: sf(e.trans ?? 0.5), seg: i });
    });
  });
  out.forEach((et, k) => {
    et.fim = k + 1 < out.length ? out[k + 1].inicio : LINHAS[14].fim + 100000;
  });
  return out;
})();

const etapaDe = (frame: number): number => {
  let k = 0;
  for (let i = 0; i < ETAPAS.length; i++) if (frame >= ETAPAS[i].inicio) k = i;
  return k;
};

export const progEtapa = (k: number, frame: number): number => {
  const et = ETAPAS[k];
  const dur = Math.min(et.fim - et.inicio, 24 * 30);
  return clamp01((frame - et.inicio) / Math.max(1, dur));
};

const poseNaEtapa = (k: number, frame: number): Pose => {
  const et = ETAPAS[k];
  const base = poseResolvida(et.e.plano, progEtapa(k, frame));
  const seguir = et.e.plano.seguir;
  if (!seguir) return base;
  // travelling: a mira acompanha o fotografo da casa anterior ate a atual
  const n = parseInt(seguir.para.replace(/\D/g, ""), 10);
  const a = posFot(n - 1);
  const b = posFot(n);
  const u = easeInOutCubic(clamp01((frame - LINHAS[et.seg].ini) / WALK));
  const d: V3 = [(a[0] - b[0]) * (1 - u), (a[1] - b[1]) * (1 - u), (a[2] - b[2]) * (1 - u)];
  return { pos: [base.pos[0] + d[0], base.pos[1] + d[1], base.pos[2] + d[2]], alvo: [base.alvo[0] + d[0], base.alvo[1] + d[1], base.alvo[2] + d[2]], fov: base.fov };
};

// Unica fonte da verdade da camera: usada pela cena 3D e pelas etiquetas 2D.
export const cameraPorFrame = (frame: number): Pose => {
  const k = etapaDe(frame);
  const et = ETAPAS[k];
  const atual = poseNaEtapa(k, frame);
  const t = frame - et.inicio;
  if (k === 0 || t >= et.transicao) return atual;
  const de = cameraPorFrame(et.inicio - 1);
  return mixPose(de, atual, easeInOutCubic(t / et.transicao));
};

export { FOV };
