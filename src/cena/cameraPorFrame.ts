import { ETAPAS_SEG, FOV, poseResolvida, EtapaPlano, planoReacao } from "./enquadramento";
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
    // ordena as etapas do segmento pelo frame (em s07, s09 e s13 a queda da peca vem depois do plano cena)
    // etapas que comecariam depois do fim do proprio segmento (ou nos 0,4 s finais) sao descartadas: o plano do segmento seguinte nao pode esperar por elas
    const ordenada = lista.map((e, k) => ({ e, k, f: frameDe(i, e) })).filter((x) => x.f < LINHAS[i].fim - sf(0.4) || x.k === 0).sort((a, b) => a.f - b.f || a.k - b.k).map((x) => x.e);
    ordenada.forEach((e) => {
      let ini = frameDe(i, e);
      if (out.length && ini <= out[out.length - 1].inicio) ini = out[out.length - 1].inicio + 1;
      out.push({ inicio: ini, fim: 0, e, transicao: sf(e.trans ?? 0.5), seg: i });
    });
  });
  out.forEach((et, k) => {
    et.fim = k + 1 < out.length ? out[k + 1].inicio : LINHAS[14].fim + 100000;
  });
  // ritmo: plano cena de mais de 4,2 s ganha um corte de reacao (fotografo mais perto) de 1,3 s, mas nunca por cima de um momento-chave
  // (de 0,3 s antes ate 1,8 s depois de cada ancora: problema, solucao e as extras)
  const final: Etapa[] = [];
  out.forEach((et) => {
    final.push(et);
    const p = et.e.plano;
    if (p.tipo === "cena" && /-cena$/.test(p.id) && et.seg >= 1 && et.seg <= 13 && et.fim - et.inicio > sf(4.2)) {
      const ancoras = Object.values(LINHAS[et.seg].ev);
      const livre = (a: number, b: number) => ancoras.every((f) => b < f - sf(0.3) || a > f + sf(1.8));
      for (let t0 = et.inicio + sf(1.0); t0 + sf(1.3) < et.fim - sf(0.5); t0 += sf(0.25)) {
        const t1 = t0 + sf(1.3);
        if (!livre(t0, t1)) continue;
        final.push({ inicio: t0, fim: t1, e: { quando: et.e.quando, plano: planoReacao(et.seg), trans: 0.3 }, transicao: sf(0.3), seg: et.seg });
        final.push({ inicio: t1, fim: et.fim, e: { quando: et.e.quando, plano: p, trans: 0.4 }, transicao: sf(0.4), seg: et.seg });
        et.fim = t0;
        break;
      }
    }
  });
  return final;
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
