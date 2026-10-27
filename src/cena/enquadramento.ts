// Enquadramento automatico da camera (funcao pura, sem remotion).
// Cada plano declara az, el, tipo e uma lista "precisa aparecer" (caixas 3D de uma tabela de tamanhos).
// A distancia d e o ponto de mira saem de uma busca binaria (20 iteracoes) com FOV fixo, calculada uma vez por plano (cache).
import * as THREE from "three";
import {
  ALTURA_PED, ALTURA_PERSONAGEM, V3, Y_CASA, posAmigoA, posAmigoB, posCli, posFot, posNoiva, posNoivo, posMesa, posPlaca,
  posPedestal, TABULEIRO,
} from "../dados/posicoes";

export const LARGURA_TELA = 1080;
export const ALTURA_TELA = 1920;
export const FOV = 40; // vertical, igual em todos os planos
export const AZ_ORBITA = 5; // graus de giro durante cada plano
export const PUSH_IN = 0.06; // a distancia diminui 6% durante cada plano

export type Janela = { x0: number; x1: number; y0: number; y1: number };
export const JANELA_UTIL: Janela = { x0: 70, x1: 1010, y0: 470, y1: 1060 };
export const JANELA_FINAL: Janela = { x0: 70, x1: 1010, y0: 700, y1: 1170 };
const MARGEM = 30;
export const FRAC_LARGURA_CLOSE = 0.55; // peca ocupa 55% da largura (594 px)
export const FRAC_LARGURA_DETALHE = 0.45; // camera na mao ocupa 45% da largura
const TOLERANCIA = 0.05;
export const FRAC_ALTURA_MIN_PERSONAGEM = 0.38; // personagem mais alto mede ao menos 38% da altura da janela

// ---------- tabela de caixas (centro, tamanho) em metros ----------
type Caixa = { c: V3; t: V3 };
const emPe = (p: V3, larg: number, prof: number, dz = 0): Caixa => ({ c: [p[0], p[1] + ALTURA_PERSONAGEM / 2, p[2] + dz], t: [larg, ALTURA_PERSONAGEM, prof] });
// pecas: tamanho acima do pedestal (largura, altura, profundidade); a caixa inclui o pedestal
const PECA_TAM: Record<number, V3> = {
  1: [1.1, 0.75, 0.65], 2: [0.95, 0.5, 0.9], 3: [0.8, 1.25, 0.25], 4: [1.05, 1.25, 0.65], 5: [1.05, 1.35, 0.65], 6: [1.2, 1.0, 0.7],
  7: [1.0, 1.0, 0.8], 8: [0.95, 0.75, 0.55], 9: [0.7, 1.3, 0.6], 10: [1.3, 1.95, 0.95], 11: [1.15, 1.05, 0.65], 12: [0.9, 0.05, 0.9], 13: [0.9, 0.05, 0.9],
};
export const caixaDe = (id: string): Caixa => {
  const m = id.match(/^([a-zA-Z]+)(\d+)$/);
  if (!m) {
    if (id === "tabuleiro") return { c: [0, 0.3, 0], t: [TABULEIRO.largura + 0.3, 0.7, TABULEIRO.profundidade + 0.3] };
    if (id === "seta") return { c: [1.4, 0.35, -1.05], t: [12.7, 0.6, 8.6] };
    throw new Error(`caixa desconhecida: ${id}`);
  }
  const n = parseInt(m[2], 10);
  switch (m[1]) {
    case "fot": return emPe(posFot(n), 0.75, 0.85, 0.15); // inclui a camera nas maos
    case "noiva": return emPe(posNoiva(n), 0.7, 0.55);
    case "noivo": return emPe(posNoivo(n), 0.6, 0.5);
    case "cli": return emPe(posCli(n), 0.7, 0.55);
    case "amigoA": return emPe(posAmigoA(n), 0.6, 0.5);
    case "amigoB": return emPe(posAmigoB(n), 0.6, 0.5);
    case "madrinha": return emPe(posCli(n), 0.7, 0.55);
    case "peca": {
      if (n === 12) { // balao de depoimento: do rosto da noiva ate o balao
        const p = posCli(12);
        return { c: [p[0], Y_CASA + 1.85, p[2]], t: [1.3, 1.6, 0.5] };
      }
      const [w, h, d] = PECA_TAM[n];
      const p = posPedestal(n);
      const alt = ALTURA_PED + h;
      return { c: [p[0], Y_CASA + alt / 2, p[2]], t: [w, alt, Math.max(d, 0.9)] };
    }
    case "placa": {
      const p = posPlaca(n);
      return { c: [p[0], p[1] + 0.45, p[2]], t: [1.15, 0.9, 0.4] };
    }
    case "balao": {
      const p = posCli(n);
      return { c: [p[0], Y_CASA + 2.3, p[2]], t: [1.2, 0.75, 0.3] };
    }
    case "maoCam": {
      const p = posFot(n);
      return { c: [p[0], p[1] + 1.0, p[2] + 0.22], t: [0.45, 0.34, 0.4] };
    }
    case "notebook": {
      const p = posMesa(n);
      return { c: [p[0], Y_CASA + 0.45, p[2]], t: [0.95, 0.9, 0.7] };
    }
  }
  throw new Error(`caixa desconhecida: ${id}`);
};
const EH_PERSONAGEM = /^(fot|noiva|noivo|cli|amigoA|amigoB|madrinha)\d+$/;
const EH_PLACA = /^placa\d+$/;
const EH_PECA = /^peca\d+$/;

// ---------- planos ----------
export type TipoPlano = "close" | "cena" | "caminhada" | "detalhe" | "aberto";
export type Plano = {
  id: string;
  tipo: TipoPlano;
  az: number;
  el: number; // 28 a 38
  lista: string[]; // precisa aparecer
  principal?: string; // close e detalhe
  fracLargura?: number;
  fracAltura?: number; // abertura do s00: o personagem ocupa essa fracao da altura da janela
  janela?: Janela;
  seguir?: { de: string; para: string }; // caminhada: a mira acompanha o fotografo (caixa de origem e de destino)
};

// ---------- calculo ----------
const cantos = (id: string): THREE.Vector3[] => {
  const { c, t } = caixaDe(id);
  const out: THREE.Vector3[] = [];
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) out.push(new THREE.Vector3(c[0] + (sx * t[0]) / 2, c[1] + (sy * t[1]) / 2, c[2] + (sz * t[2]) / 2));
  return out;
};
export type Retangulo = { xmin: number; xmax: number; ymin: number; ymax: number };
const camera = new THREE.PerspectiveCamera(FOV, LARGURA_TELA / ALTURA_TELA, 0.1, 500);
const FOCAL_PX = ALTURA_TELA / 2 / Math.tan((FOV * Math.PI) / 360);

const posicionar = (alvo: THREE.Vector3, d: number, azGraus: number, elGraus: number) => {
  const az = (azGraus * Math.PI) / 180;
  const el = (elGraus * Math.PI) / 180;
  camera.position.set(alvo.x + d * Math.sin(az) * Math.cos(el), alvo.y + d * Math.sin(el), alvo.z + d * Math.cos(az) * Math.cos(el));
  camera.lookAt(alvo);
  camera.updateMatrixWorld(true);
};
const projetarPontos = (pts: THREE.Vector3[]): Retangulo => {
  const r: Retangulo = { xmin: Infinity, xmax: -Infinity, ymin: Infinity, ymax: -Infinity };
  const v = new THREE.Vector3();
  for (const p of pts) {
    v.copy(p).project(camera);
    const x = (v.x * 0.5 + 0.5) * LARGURA_TELA;
    const y = (-v.y * 0.5 + 0.5) * ALTURA_TELA;
    r.xmin = Math.min(r.xmin, x); r.xmax = Math.max(r.xmax, x);
    r.ymin = Math.min(r.ymin, y); r.ymax = Math.max(r.ymax, y);
  }
  return r;
};
const centroMundo = (pts: THREE.Vector3[]) => new THREE.Box3().setFromPoints(pts).getCenter(new THREE.Vector3());
const pontosDe = (ids: string[]) => {
  const pts: THREE.Vector3[] = [];
  ids.forEach((id) => pts.push(...cantos(id)));
  return pts;
};

// desloca o ponto de mira para centralizar o conjunto na janela; 3 repeticoes (o deslocamento muda a projecao)
const centralizar = (alvo: THREE.Vector3, d: number, az: number, el: number, pts: THREE.Vector3[], janela: Janela) => {
  const cx = (janela.x0 + janela.x1) / 2;
  const cy = (janela.y0 + janela.y1) / 2;
  const centro = centroMundo(pts);
  for (let k = 0; k < 3; k++) {
    posicionar(alvo, d, az, el);
    const r = projetarPontos(pts);
    const dx = cx - (r.xmin + r.xmax) / 2;
    const dy = cy - (r.ymin + r.ymax) / 2;
    const frente = camera.getWorldDirection(new THREE.Vector3());
    const prof = Math.max(0.5, centro.clone().sub(camera.position).dot(frente));
    const direita = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
    const cima = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
    alvo.addScaledVector(direita, (-dx * prof) / FOCAL_PX);
    alvo.addScaledVector(cima, (dy * prof) / FOCAL_PX);
  }
  posicionar(alvo, d, az, el);
};

export type Resolvido = {
  plano: Plano;
  d: number; // distancia no estado medio do plano (azimute + 2,5 graus, distancia x 0,97)
  alvo: V3;
  janela: Janela;
  uniao: Retangulo;
  principal?: Retangulo;
  caixas: Record<string, Retangulo>;
  limite: "largura" | "altura" | "janela";
  fora: string[]; // caixas que ficaram fora da janela (vazio = ok)
  removidos: string[]; // itens tirados da lista pela regra de tamanho minimo
  alturaMaxPersonagem: number; // px do personagem mais alto da lista
};

const NUM_ITER = 20;
const MID_D = 1 - PUSH_IN / 2;

function resolverLista(plano: Plano, lista: string[]): Omit<Resolvido, "removidos"> {
  const janela = plano.janela ?? JANELA_UTIL;
  const util = { w: janela.x1 - janela.x0 - 2 * MARGEM, h: janela.y1 - janela.y0 - 2 * MARGEM };
  const todos = pontosDe(lista);
  const ptsP = plano.principal ? cantos(plano.principal) : null;
  const inicio = centroMundo(todos);
  const azMid = plano.az + AZ_ORBITA / 2;
  const medir = (d: number) => {
    const alvo = inicio.clone();
    centralizar(alvo, d * MID_D, azMid, plano.el, todos, janela);
    return { alvo, u: projetarPontos(todos), p: ptsP ? projetarPontos(ptsP) : null };
  };
  const larguraAlvo = (plano.fracLargura ?? 0) * LARGURA_TELA;
  const metrica = (d: number) => {
    const { u, p } = medir(d);
    let m = Math.max((u.xmax - u.xmin) / util.w, (u.ymax - u.ymin) / util.h);
    if (p && plano.fracAltura) m = Math.max(m, (p.ymax - p.ymin) / (plano.fracAltura * (janela.y1 - janela.y0)));
    else if (p && larguraAlvo) m = Math.max(m, (p.xmax - p.xmin) / larguraAlvo);
    return m;
  };
  let lo = 0.8;
  let hi = 200;
  for (let i = 0; i < NUM_ITER; i++) {
    const mid = (lo + hi) / 2;
    if (metrica(mid) > 1) lo = mid;
    else hi = mid;
  }
  const d = hi;
  const { alvo, u, p } = medir(d);
  const caixas: Record<string, Retangulo> = {};
  const fora: string[] = [];
  for (const id of lista) {
    const r = projetarPontos(cantos(id));
    caixas[id] = r;
    if (r.xmin < janela.x0 - 0.5 || r.xmax > janela.x1 + 0.5 || r.ymin < janela.y0 - 0.5 || r.ymax > janela.y1 + 0.5) fora.push(id);
  }
  let limite: Resolvido["limite"] = "janela";
  if (p && larguraAlvo) {
    const w = p.xmax - p.xmin;
    limite = Math.abs(w - larguraAlvo) <= larguraAlvo * TOLERANCIA ? "largura" : "altura";
    // peca estreita e alta: a altura da janela limita antes dos 55% de largura (nao e falha)
    if (w > larguraAlvo * (1 + TOLERANCIA)) fora.push(`${plano.principal} (largura ${w.toFixed(0)} px acima do alvo)`);
  }
  let alturaMax = 0;
  for (const id of lista) if (EH_PERSONAGEM.test(id)) alturaMax = Math.max(alturaMax, caixas[id].ymax - caixas[id].ymin);
  return { plano, d, janela, uniao: u, principal: p ?? undefined, caixas, limite, fora, alvo: [alvo.x, alvo.y, alvo.z], alturaMaxPersonagem: alturaMax };
}

const cache = new Map<string, Resolvido>();
// Regra de tamanho minimo (so no plano "cena"): o personagem mais alto precisa medir 38% da altura da janela.
// Se nao medir, tira primeiro a placa de foto da lista e depois a peca principal.
export const resolverPlano = (plano: Plano): Resolvido => {
  if (cache.has(plano.id)) return cache.get(plano.id)!;
  let lista = [...plano.lista];
  let removidos: string[] = [];
  let r = resolverLista(plano, lista);
  const minimo = FRAC_ALTURA_MIN_PERSONAGEM * ((plano.janela ?? JANELA_UTIL).y1 - (plano.janela ?? JANELA_UTIL).y0);
  if (plano.tipo === "cena") {
    for (const grupo of [EH_PLACA, EH_PECA]) {
      if (r.alturaMaxPersonagem >= minimo || r.alturaMaxPersonagem === 0) break;
      const tirar = lista.filter((id) => grupo.test(id));
      if (!tirar.length) continue;
      lista = lista.filter((id) => !grupo.test(id));
      removidos = [...removidos, ...tirar];
      r = resolverLista({ ...plano, lista }, lista);
    }
  }
  const final: Resolvido = { ...r, plano, removidos };
  cache.set(plano.id, final);
  return final;
};

// pose em um ponto (prog 0..1) do plano: o azimute cresce 5 graus e a distancia diminui 6%
export const poseResolvida = (plano: Plano, prog: number): { pos: V3; alvo: V3; fov: number } => {
  const r = resolverPlano(plano);
  const az = ((plano.az + AZ_ORBITA * prog) * Math.PI) / 180;
  const el = (plano.el * Math.PI) / 180;
  const d = (r.d * (1 - PUSH_IN * prog)) ;
  const [tx, ty, tz] = r.alvo;
  return { pos: [tx + d * Math.sin(az) * Math.cos(el), ty + d * Math.sin(el), tz + d * Math.cos(az) * Math.cos(el)], alvo: r.alvo, fov: FOV };
};

// retangulos projetados (prog 0, 0,5 ou 1) para a verificacao dos extremos da orbita
export const projetarEmProg = (plano: Plano, prog: number): Record<string, Retangulo> => {
  const r = resolverPlano(plano);
  const alvo = new THREE.Vector3(...r.alvo);
  posicionar(alvo, r.d * (1 - PUSH_IN * prog), plano.az + AZ_ORBITA * prog, plano.el);
  const out: Record<string, Retangulo> = {};
  for (const id of plano.lista.filter((x) => !r.removidos.includes(x))) out[id] = projetarPontos(cantos(id));
  return out;
};

// ---------- planos por segmento ----------
export type Ref = { ref: "ini" | "chegada" | "cena" | "ev"; nome?: string; desl?: number };
export type EtapaPlano = { quando: Ref; plano: Plano; trans?: number }; // trans: segundos
const R = (ref: Ref["ref"], nome?: string, desl = 0): Ref => ({ ref, nome, desl });

const AZ_REP = (n: number) => (n >= 6 && n <= 10 ? -30 : 30); // caminhada: o fotografo anda em direcao a camera
// close e cena: azimute negativo em todas as casas. O fotografo fica na frente a direita da peca (x + 0,6, z + 0,55),
// entao com a camera a direita ele tampa a peca; vista da esquerda a peca fica livre.
const AZ_VISTA = -30;
const EL = 32;

// quem esta em cena em cada casa (ordem de prioridade para a regra de tamanho minimo: placa e peca saem primeiro)
const personagensDe = (n: number): string[] => {
  const p: string[] = [`fot${n}`];
  if (n === 2) p.push("amigoA2", "amigoB2");
  if (n >= 4 && n <= 6) p.push(`noiva${n}`);
  if (n >= 7 && n <= 9) p.push(`noiva${n}`, `noivo${n}`);
  if (n === 11 || n === 12) p.push(`noiva${n}`);
  if (n === 13) p.push("madrinha13");
  return p;
};
const extrasDe = (n: number): string[] => {
  const e: string[] = [];
  if (n === 10) e.push("notebook10");
  if (n === 12) e.push("balao12");
  return e;
};
const placaDe = (n: number): string[] => ([1, 7, 8, 9].includes(n) ? [`placa${n}`] : []);

export const planoCaminhada = (n: number): Plano => ({
  id: `s${String(n).padStart(2, "0")}-caminhada`, tipo: "caminhada", az: AZ_REP(n), el: EL, lista: [`fot${n}`],
  seguir: n >= 2 ? { de: `fot${n - 1}`, para: `fot${n}` } : undefined,
});
export const planoClose = (n: number): Plano => {
  const principal = n === 13 ? "madrinha13" : `peca${n}`;
  return {
    id: `s${String(n).padStart(2, "0")}-close`, tipo: "close", az: AZ_VISTA * 0.85, el: EL, lista: n === 13 ? [principal] : [principal],
    principal, fracLargura: n === 13 ? undefined : FRAC_LARGURA_CLOSE, fracAltura: n === 13 ? 0.7 : undefined,
  };
};
export const planoCena = (n: number): Plano => ({
  id: `s${String(n).padStart(2, "0")}-cena`, tipo: "cena", az: AZ_VISTA, el: EL,
  lista: [...personagensDe(n), ...extrasDe(n), ...placaDe(n), `peca${n}`],
});
export const planoDetalhe = (n: number): Plano => ({
  id: `s${String(n).padStart(2, "0")}-detalhe`, tipo: "detalhe", az: -24, el: 30, lista: [`maoCam${n}`], principal: `maoCam${n}`, fracLargura: FRAC_LARGURA_DETALHE,
});
export const PLANO_ABERTURA: Plano = { id: "s00-abertura", tipo: "close", az: -22, el: 28, lista: ["fot1"], principal: "fot1", fracAltura: 0.55 };
export const PLANO_TABULEIRO: Plano = { id: "s00-tabuleiro", tipo: "aberto", az: -22, el: 34, lista: ["tabuleiro"] };
export const PLANO_PRONTO: Plano = { id: "s13-pronto", tipo: "aberto", az: -22, el: 34, lista: ["tabuleiro", "seta"] };
export const PLANO_FINAL: Plano = { id: "s14-final", tipo: "aberto", az: -22, el: 36, lista: ["tabuleiro", "seta"], janela: JANELA_FINAL };
export const PLANO_VOO: Plano = { id: "s12-voo", tipo: "close", az: -30, el: EL, lista: ["peca3"], principal: "peca3", fracLargura: FRAC_LARGURA_CLOSE };

export const ETAPAS_SEG: EtapaPlano[][] = (() => {
  const out: EtapaPlano[][] = [];
  out.push([
    { quando: R("ini"), plano: PLANO_ABERTURA },
    { quando: R("ev", "solucao", -0.2), plano: PLANO_TABULEIRO, trans: 1.4 },
  ]);
  for (let n = 1; n <= 13; n++) {
    const e: EtapaPlano[] = [];
    if (n >= 2) e.push({ quando: R("ini"), plano: planoCaminhada(n), trans: 0.4 });
    e.push({ quando: R("chegada"), plano: planoClose(n), trans: 0.5 });
    e.push({ quando: R("cena"), plano: planoCena(n), trans: 0.5 });
    if (n === 7 || n === 8 || n === 9) {
      e.push({ quando: R("ev", "solucao", -0.1), plano: planoDetalhe(n), trans: 0.3 });
      e.push({ quando: R("ev", "solucao", 1.1), plano: planoCena(n), trans: 0.4 });
    }
    if (n === 12) e.push({ quando: R("ev", "solucao", 0), plano: PLANO_VOO, trans: 1.2 });
    if (n === 13) e.push({ quando: R("ev", "solucao", -0.2), plano: PLANO_PRONTO, trans: 1.0 });
    out.push(e);
  }
  out.push([{ quando: R("ev", "problema", 0), plano: PLANO_FINAL, trans: 1.6 }]);
  return out;
})();

export const TODOS_PLANOS: Plano[] = (() => {
  const vistos = new Map<string, Plano>();
  ETAPAS_SEG.forEach((l) => l.forEach((e) => vistos.set(e.plano.id, e.plano)));
  return [...vistos.values()];
})();
export const PLANOS_RESOLVIDOS: Resolvido[] = TODOS_PLANOS.map(resolverPlano);
