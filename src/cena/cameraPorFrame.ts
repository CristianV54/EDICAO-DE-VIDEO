import { ROTEIRO, POS_PECA, TOPO_PLATAFORMA, Vec3 } from "../dados/roteiro";
import { LINHAS, segDe, easeInOutCubic, clamp01, lerp, sf } from "../util/tempo";

export type Pose = { pos: Vec3; alvo: Vec3; fov: number };

const mix3 = (a: Vec3, b: Vec3, t: number): Vec3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const mixPose = (a: Pose, b: Pose, t: number): Pose => ({
  pos: mix3(a.pos, b.pos, t),
  alvo: mix3(a.alvo, b.alvo, t),
  fov: lerp(a.fov, b.fov, t),
});

export const POSE_GANCHO: Pose = { pos: [-3.4, 2.6, 7.6], alvo: [-6.4, 1.15, 1.2], fov: 46 };
export const POSE_PLATAFORMA_VAZIA: Pose = { pos: [-0.8, 9.5, 14.5], alvo: [-0.8, 0.4, 0.6], fov: 72 };
export const POSE_FINAL: Pose = { pos: [-0.6, 10.5, 14.2], alvo: [-0.6, 1.6, 0.6], fov: 82 };

const ORBITA = 0.08;
const FOV_CLOSE = 54; // vertical; em tela 9:16 o 40 do roteiro enquadra apertado demais
const AJUSTE_ALVO_Y = 0.17; // mira acima do centro da peca: a peca fica no meio da tela, abaixo do card

// Pose de close da peca do segmento i, com `prog` (0..1) do progresso no segmento (orbita lenta).
export const poseCloseSeg = (i: number, prog: number): Pose => {
  const cfg = ROTEIRO[i].cam ?? {};
  const [px, pz] = POS_PECA[i - 1];
  const d = cfg.alvoDelta ?? [0, 0, 0];
  const alvo: Vec3 = [px + d[0], TOPO_PLATAFORMA + AJUSTE_ALVO_Y + d[1], pz + d[2]];
  const ang = -ORBITA / 2 + ORBITA * prog;
  const dist = cfg.dist ?? 3.8;
  const alt = cfg.alt ?? 2.6;
  return {
    pos: [alvo[0] + Math.sin(ang) * dist, TOPO_PLATAFORMA + alt, alvo[2] + Math.cos(ang) * dist],
    alvo,
    fov: cfg.fov ?? FOV_CLOSE,
  };
};

const aoFimDe = (i: number): Pose => {
  if (i === 0) return POSE_PLATAFORMA_VAZIA;
  if (i === 14) return POSE_FINAL;
  return poseCloseSeg(i, 1);
};

export const cameraPorFrame = (frame: number): Pose => {
  const i = segDe(frame);
  const L = LINHAS[i];
  const prog = clamp01((frame - L.ini) / Math.max(1, L.fim - L.ini));

  if (i === 0) {
    // plano medio no gancho; em "treze" recua para a plataforma vazia
    const t = clamp01((frame - L.sol) / sf(1.1));
    return mixPose(POSE_GANCHO, POSE_PLATAFORMA_VAZIA, easeInOutCubic(t));
  }
  if (i === 14) {
    const t = clamp01((frame - L.prob) / sf(1.6));
    return mixPose(aoFimDe(13), POSE_FINAL, easeInOutCubic(t));
  }
  const atual = poseCloseSeg(i, prog);
  const t = clamp01((frame - L.ini) / Math.max(1, L.camFim - L.ini));
  return mixPose(aoFimDe(i - 1), atual, easeInOutCubic(t));
};
