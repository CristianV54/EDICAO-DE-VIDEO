import { ETAPAS_SEG, AZ_ORBITA, FOV, poseResolvida, EtapaPlano } from "./enquadramento";
import type { V3 } from "../dados/posicoes";
import { LINHAS, easeInOutCubic, clamp01, lerp, sf } from "../util/tempo";

export type Pose = { pos: V3; alvo: V3; fov: number };

const mix3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const mixPose = (a: Pose, b: Pose, t: number): Pose => ({ pos: mix3(a.pos, b.pos, t), alvo: mix3(a.alvo, b.alvo, t), fov: lerp(a.fov, b.fov, t) });

type Etapa = { inicio: number; fim: number; e: EtapaPlano; transicao: number };

const frameDe = (i: number, e: EtapaPlano): number => {
  const L = LINHAS[i];
  if (e.quando === "ini") return L.ini;
  if (e.quando === "ctx") return L.ctxIni;
  if (e.quando === "sol") return L.sol;
  return L.prob;
};

// sequencia global de etapas (cada plano vale ate o inicio do proximo)
const ETAPAS: Etapa[] = (() => {
  const out: Etapa[] = [];
  ETAPAS_SEG.forEach((lista, i) => {
    lista.forEach((e) => {
      const ini = frameDe(i, e);
      out.push({ inicio: ini, fim: 0, e, transicao: i === 14 ? sf(1.6) : e.quando === "ini" || e.quando === "ctx" ? sf(0.9) : sf(1.1) });
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

// azimute: orbita de AZ_ORBITA graus centrada em torno do az do plano
const poseNaEtapa = (k: number, frame: number): Pose => {
  const et = ETAPAS[k];
  const dur = Math.min(et.fim - et.inicio, 24 * 30);
  const prog = clamp01((frame - et.inicio) / Math.max(1, dur));
  return poseResolvida(et.e.plano, -AZ_ORBITA / 2 + AZ_ORBITA * prog);
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
