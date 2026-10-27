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

export const CARD_SLIDE = 6; // frames para o card entrar/sair
export const VEL_DIGITACAO = 22; // caracteres por segundo

export type Linha = {
  i: number;
  id: string;
  ini: number;
  fim: number;
  D: number; // segundos
  k: number; // compressao para segmentos curtos
  temPeca: boolean;
  chegada: number; // fim da caminhada ate a casa
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
  cenaIni: number; // inicio do plano "cena" da camera
  ev: Record<string, number>; // frames de todas as ancoras (problema, solucao e eventos extras)
  cardSai: number; // frame em que o card comeca a sair
};

export const WALK = sf(0.9); // caminhada do fotografo ate a casa (s02 a s13)
export const CAMINHADA_MADRINHA = 66; // frames da madrinha ate a casa 13

export const LINHAS: Linha[] = ROTEIRO.map((r, i) => {
  const t = tempos.segmentos[i] as unknown as { inicio: number; fim: number; ancoras: Record<string, number> };
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
  // s07 e s09: o momento da peca e a propria ancora da solucao (lente cai, flash estoura)
  const momentoNaAncora = r.id === "s07" || r.id === "s09";
  // s13: o momento da peca e a chegada da madrinha, que comeca a andar na ancora "madrinha"
  const madrinha = r.id === "s13";
  const prob = temPeca && !momentoNaAncora && !madrinha ? Math.max(aProb, toque + sf(0.8)) : aProb;
  const toqueFinal = momentoNaAncora ? aSol : madrinha ? prob + CAMINHADA_MADRINHA : toque;
  const sol = temPeca && !momentoNaAncora ? Math.max(aSol, prob + sf(0.5 * k)) : aSol;
  const chegada = i >= 2 && i <= 13 ? ini + WALK : ini;
  // plano "cena": comeca 0,2 s antes do problema (e nunca antes de o fotografo chegar)
  const cenaIni = temPeca ? Math.max(chegada + 6, prob - sf(0.2)) : ini;
  // o card sai em max(momento + 0,5 s, min(momento + 1,2 s, cena - 0,3 s))
  const cardSai = Math.max(toqueFinal + sf(0.5), Math.min(toqueFinal + sf(1.2), cenaIni - sf(0.3)));
  const ev: Record<string, number> = {};
  Object.entries(t.ancoras).forEach(([nome, seg]) => {
    ev[nome] = sf(seg);
  });
  ev.problema = prob;
  ev.solucao = sol;
  return {
    i,
    id: r.id,
    ini,
    fim,
    D,
    k,
    temPeca,
    chegada,
    tituloFim: ini + sf(1.4 * k),
    cardIni,
    vel,
    nChars,
    digitaFim,
    quedaIni: momentoNaAncora || madrinha ? toqueFinal - TOQUE_REL : quedaIni,
    toque: toqueFinal,
    prob,
    segunda: t.ancoras.segunda !== undefined ? sf(t.ancoras.segunda) : null,
    sol,
    cenaIni,
    ev,
    cardSai,
  };
});

export const segDe = (frame: number): number => {
  let idx = 0;
  for (let i = 0; i < LINHAS.length; i++) if (frame >= LINHAS[i].ini) idx = i;
  return idx;
};

export const PALAVRAS = tempos.palavras as { texto: string; inicio: number; fim: number }[];
export const ORIGEM_TEMPOS = (tempos as { origem: string }).origem;

// flashes brancos de tela: cliques do fotografo (s01, s02 x3 de 3 frames, s08), flash de luz do s07 e estouro do flash (s09)
export const FLASHES: { f: number; dur: number }[] = [
  { f: LINHAS[1].prob, dur: 5 },
  { f: LINHAS[2].ev.amigos, dur: 3 },
  { f: LINHAS[2].ev.amigos + 11, dur: 3 },
  { f: LINHAS[2].ev.amigos + 22, dur: 3 },
  { f: LINHAS[7].sol + 14, dur: 5 },
  { f: LINHAS[8].ev.sim + 10, dur: 5 },
  { f: LINHAS[9].sol, dur: 5 },
];
export const FRAMES_FLASH = FLASHES.map((x) => x.f);

// frames efetivos de cada segmento (usados pelo script de stills, via calculateMetadata)
export const MARCOS = LINHAS.map((L) => ({ id: L.id, ini: L.ini, fim: L.fim, chegada: L.chegada, cenaIni: L.cenaIni, toque: L.toque, prob: L.prob, sol: L.sol, cardFim: L.cardSai + CARD_SLIDE }));

// o card aparece nos segmentos s01 a s13, do inicio do segmento ate terminar de sair
export const cardVisivel = (frame: number): boolean => {
  const i = segDe(frame);
  if (i < 1 || i > 13) return false;
  return frame < LINHAS[i].cardSai + CARD_SLIDE;
};
