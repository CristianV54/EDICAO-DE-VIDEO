import { DESLOCA_OLHAR, AZ_PLANO, FOV_CENA, PLANOS, Plano, V3 } from "../dados/roteiro";
import { LINHAS, easeInOutCubic, clamp01, lerp, sf } from "../util/tempo";

export type Pose = { pos: V3; alvo: V3; fov: number };

const mix3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const mixPose = (a: Pose, b: Pose, t: number): Pose => ({ pos: mix3(a.pos, b.pos, t), alvo: mix3(a.alvo, b.alvo, t), fov: lerp(a.fov, b.fov, t) });

const rad = (g: number) => (g * Math.PI) / 180;

// posicao = alvo + d * (sin(az) cos(el), sin(el), cos(az) cos(el)); olha para alvo - (0, 0,08 d, 0)
export const poseDoPlano = (p: Plano, azExtra: number): Pose => {
  const az = rad(p.az + azExtra);
  const el = rad(p.el);
  return {
    pos: [p.alvo[0] + p.d * Math.sin(az) * Math.cos(el), p.alvo[1] + p.d * Math.sin(el), p.alvo[2] + p.d * Math.cos(az) * Math.cos(el)],
    alvo: [p.alvo[0], p.alvo[1] - DESLOCA_OLHAR * p.d, p.alvo[2]],
    fov: FOV_CENA,
  };
};

type Etapa = { inicio: number; fim: number; plano: Plano; transicao: number };

// Sequencia de planos: close do inicio ate (problema - 0,2 s), contexto dali ate o fim.
// Excecoes: s00 e s13 trocam em "treze"/"pronto"; s14 so se mexe em "para".
const ETAPAS: Etapa[] = (() => {
  const out: Etapa[] = [];
  const T = sf(0.9);
  LINHAS.forEach((L, i) => {
    const pl = PLANOS[i];
    if (i === 14) {
      out.push({ inicio: L.prob, fim: L.fim + 100000, plano: pl.contexto, transicao: sf(1.6) });
      return;
    }
    const troca = i === 0 || i === 13 ? L.sol : Math.max(L.ini + 6, L.prob - sf(0.2));
    out.push({ inicio: L.ini, fim: troca, plano: pl.close, transicao: T });
    out.push({ inicio: troca, fim: L.fim, plano: pl.contexto, transicao: T });
  });
  return out;
})();

const etapaDe = (frame: number): number => {
  let k = 0;
  for (let i = 0; i < ETAPAS.length; i++) if (frame >= ETAPAS[i].inicio) k = i;
  return k;
};

const poseNaEtapa = (k: number, frame: number): Pose => {
  const e = ETAPAS[k];
  const dur = Math.min(e.fim - e.inicio, 24 * 30);
  const prog = clamp01((frame - e.inicio) / Math.max(1, dur));
  return poseDoPlano(e.plano, AZ_PLANO * prog);
};

// Unica fonte da verdade da camera: usada pela cena 3D e pelas etiquetas 2D.
export const cameraPorFrame = (frame: number): Pose => {
  const k = etapaDe(frame);
  const e = ETAPAS[k];
  const atual = poseNaEtapa(k, frame);
  const t = frame - e.inicio;
  if (k === 0 || t >= e.transicao) return atual;
  const de = cameraPorFrame(e.inicio - 1);
  return mixPose(de, atual, easeInOutCubic(t / e.transicao));
};
