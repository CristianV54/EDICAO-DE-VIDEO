import { spring } from "remotion";
import tempos from "../dados/tempos.json";
import { ROTEIRO } from "../dados/roteiro";

export const FPS = 30;
export const LARGURA = 1080;
export const ALTURA = 1920;
export const SEGURANCA_FINAL_S = 2.5;

export const sf = (s: number) => Math.round(s * FPS);
export const DURACAO_FRAMES = Math.ceil((tempos.duracaoAudio + SEGURANCA_FINAL_S) * FPS);

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
export const easeInOutCubic = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
export const easeOutBack = (t: number) => {
  const x = clamp01(t);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// pop 1 -> escala maxima -> 1 em `dur` frames
export const pop = (f: number, dur = 8, max = 1.18) => {
  if (f < 0 || f >= dur) return 1;
  return 1 + (max - 1) * Math.sin((f / dur) * Math.PI);
};
// entrada 0 -> 1 com leve overshoot
export const entrada = (f: number, dur = 6) => (f < 0 ? 0 : easeOutBack(f / dur));

const SPRING_CFG = { damping: 12, mass: 0.8 };
export const springQueda = (f: number) => spring({ frame: f, fps: FPS, config: SPRING_CFG });
// primeiro frame (desde o inicio da queda) em que a peca encosta na plataforma
export const TOQUE_REL = (() => {
  for (let f = 0; f < 120; f++) if (springQueda(f) >= 1) return f;
  return 30;
})();

export const VEL_DIGITACAO = 22; // caracteres por segundo

export type Linha = {
  i: number;
  id: string;
  ini: number;
  fim: number;
  D: number; // segundos
  k: number; // compressao para segmentos curtos
  temPeca: boolean;
  camFim: number;
  tituloFim: number;
  cardIni: number;
  vel: number; // chars/s efetivos
  nChars: number;
  digitaFim: number;
  quedaIni: number;
  toque: number;
  prob: number;
  segunda: number | null;
  sol: number;
  caboIni: number;
  caboFim: number;
};

export const LINHAS: Linha[] = ROTEIRO.map((r, i) => {
  const t = tempos.segmentos[i] as { inicio: number; fim: number; ancoras: Record<string, number> };
  const ini = sf(t.inicio);
  const fim = i === ROTEIRO.length - 1 ? sf(tempos.duracaoAudio) : sf(t.fim);
  const D = t.fim - t.inicio;
  const k = Math.min(1, D / 4);
  const temPeca = i >= 1 && i <= 13;
  const nChars = r.tarefa ? r.tarefa.length : 0;
  const vel = VEL_DIGITACAO / k;
  const cardIni = ini + sf(0.15 * k);
  const digitaFim = cardIni + Math.ceil((nChars / vel) * FPS);
  const quedaIni = digitaFim + sf(0.15 * k);
  const toque = quedaIni + TOQUE_REL;
  const aProb = sf(t.ancoras.problema);
  const aSol = sf(t.ancoras.solucao);
  const prob = temPeca ? Math.max(aProb, toque + 3) : aProb;
  const sol = temPeca && r.id !== "s04" ? Math.max(aSol, prob + sf(0.5 * k)) : aSol;
  const dur = fim - ini;
  return {
    i,
    id: r.id,
    ini,
    fim,
    D,
    k,
    temPeca,
    camFim: ini + sf(0.9 * k),
    tituloFim: ini + sf(1.4 * k),
    cardIni,
    vel,
    nChars,
    digitaFim,
    quedaIni,
    toque,
    prob,
    segunda: t.ancoras.segunda !== undefined ? sf(t.ancoras.segunda) : null,
    sol,
    caboIni: ini + Math.round(dur * 0.8),
    caboFim: ini + Math.round(dur * 0.95),
  };
});

export const segDe = (frame: number): number => {
  let idx = 0;
  for (let i = 0; i < LINHAS.length; i++) if (frame >= LINHAS[i].ini) idx = i;
  return idx;
};

export const PALAVRAS = tempos.palavras as { texto: string; inicio: number; fim: number }[];
export const ORIGEM_TEMPOS = (tempos as { origem: string }).origem;

// flashes brancos de tela: clique do gancho e estouro do flash
export const FRAMES_FLASH = [LINHAS[0].prob, LINHAS[4].sol];

// frames efetivos de cada segmento (usados pelo script de stills, via calculateMetadata)
export const MARCOS = LINHAS.map((L) => ({ id: L.id, ini: L.ini, fim: L.fim, toque: L.toque, prob: L.prob, sol: L.sol }));
