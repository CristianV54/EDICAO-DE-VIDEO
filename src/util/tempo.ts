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
  tituloIni: number; // "Esse e o X": o titulo, o amarelo da peca e o contador acontecem aqui
  tituloFim: number;
  cardIni: number; // "Entao": o card comeca a digitar
  vel: number; // chars/s efetivos
  nChars: number;
  digitaFim: number;
  quedaIni: number; // a peca cai depois de digitado
  toque: number;
  entao: number;
  prob: number;
  segunda: number | null;
  sol: number;
  nome: number; // revelacao do nome da peca
  cenaIni: number; // inicio do plano "cena" da camera (cena do problema)
  ev: Record<string, number>; // frames de todas as ancoras (problema, entao, solucao, nome e eventos extras)
  cardSai: number; // frame em que o card comeca a sair
};

export const WALK = sf(0.9); // caminhada do fotografo ate a casa (s02 a s13)
export const CAMINHADA_MADRINHA = 40; // frames da madrinha ate a casa 13
const GAP = sf(0.4); // tempo minimo entre dois eventos encadeados de um mesmo segmento
const GAP_PRIMEIRO = sf(0.7); // a peca pousa e o publico ve a peca antes de ela agir
const NOME_APOS_SOL: Record<string, number> = { s01: 2.0, s02: 1.6, s07: 2.0, s08: 2.0, s09: 1.8, s12: 1.7 }; // segmentos com corte de placa: o nome so vem depois do resultado

// Ordem de cada segmento (como na referencia): PROBLEMA (cena com os personagens e os objetos do problema), "ENTAO" (o card digita e a peca cai),
// eventos da peca (extras), SOLUCAO (a peca age) e NOME ("Esse e o X": titulo, amarelo, contador).
export const LINHAS: Linha[] = ROTEIRO.map((r, i) => {
  const t = tempos.segmentos[i] as unknown as { inicio: number; fim: number; ancoras: Record<string, number> };
  const ini = sf(t.inicio);
  const fim = i === ROTEIRO.length - 1 ? sf(tempos.duracaoAudio) : sf(t.fim);
  const D = t.fim - t.inicio;
  const k = Math.min(1, D / 4);
  const temPeca = i >= 1 && i <= 13;
  const nChars = r.tarefa ? r.tarefa.length : 0;
  const vel = VEL_DIGITACAO / k;
  const chegada = i >= 2 && i <= 13 ? ini + WALK : ini;
  const anc: Record<string, number> = {};
  Object.entries(t.ancoras).forEach(([nome, seg]) => {
    anc[nome] = sf(seg);
  });
  const ev: Record<string, number> = { ...anc };
  ev.ini = ini; // etiquetas que entram no primeiro frame (s00)
  let entao = ini;
  let cardIni = ini + sf(0.15 * k);
  let digitaFim = cardIni + Math.ceil((nChars / vel) * FPS);
  let quedaIni = digitaFim + sf(0.15 * k);
  let toque = quedaIni + TOQUE_REL;
  let prob = anc.problema;
  let sol = anc.solucao;
  let nome = ini;
  if (temPeca) {
    entao = Math.max(anc.entao, chegada + sf(0.6));
    cardIni = entao - 2;
    digitaFim = cardIni + Math.ceil((nChars / vel) * FPS);
    quedaIni = digitaFim + sf(0.1);
    toque = quedaIni + TOQUE_REL;
    prob = Math.min(Math.max(anc.problema, chegada + 3), entao - sf(0.4));
    // eventos depois do "entao", na ordem em que aparecem no roteiro: cada um pelo menos GAP depois do anterior;
    // o primeiro so depois que a peca pousou
    const chaves = Object.keys(t.ancoras);
    const depois = chaves.slice(chaves.indexOf("entao") + 1);
    let ant = toque + GAP_PRIMEIRO - GAP;
    depois.forEach((nm) => {
      let v = Math.max(anc[nm], ant + GAP);
      if (nm === "nome" && NOME_APOS_SOL[r.id] && ev.solucao !== undefined) v = Math.max(v, ev.solucao + sf(NOME_APOS_SOL[r.id]));
      ev[nm] = v;
      ant = v;
    });
    sol = ev.solucao;
    nome = ev.nome;
    ev.entao = entao;
  } else {
    nome = ini;
  }
  ev.problema = prob;
  ev.solucao = sol;
  if (temPeca) ev.nome = nome;
  const cenaIni = temPeca ? chegada + 6 : ini; // a cena do problema comeca assim que o fotografo chega
  const cardSai = temPeca ? toque + sf(0.9) : toque + sf(1.2);
  return {
    i,
    id: r.id,
    ini,
    fim,
    D,
    k,
    temPeca,
    chegada,
    tituloIni: temPeca ? nome : ini,
    tituloFim: (temPeca ? nome : ini) + sf(1.4 * k),
    cardIni,
    vel,
    nChars,
    digitaFim,
    quedaIni,
    toque,
    entao,
    prob,
    segunda: t.ancoras.segunda !== undefined ? sf(t.ancoras.segunda) : null,
    sol,
    nome,
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
export const MARCOS = LINHAS.map((L) => ({ id: L.id, ini: L.ini, fim: L.fim, chegada: L.chegada, cenaIni: L.cenaIni, entao: L.entao, queda: L.quedaIni, toque: L.toque, prob: L.prob, sol: L.sol, nome: L.nome, cardFim: L.cardSai + CARD_SLIDE, ev: L.ev }));

// o card aparece em "Entao" (s01 a s13) e sai pouco depois da peca pousar; no s00 digita no primeiro segundo
export const cardVisivel = (frame: number): boolean => {
  const i = segDe(frame);
  if (i < 0 || i > 13) return false;
  return frame >= LINHAS[i].cardIni - CARD_SLIDE && frame < LINHAS[i].cardSai + CARD_SLIDE;
};
