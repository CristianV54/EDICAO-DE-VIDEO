// Enquadramento automatico da camera (funcao pura, sem remotion).
// Cada plano declara az, el, tipo e uma lista "precisa aparecer" (caixas 3D declaradas numa tabela de tamanhos).
// A distancia d e o ponto de mira saem de uma busca binaria; o resultado e guardado em cache no carregamento.
import * as THREE from "three";
import {
  CAMERA_ATO1, CASAL_AMIGOS, CURIOSO, FOTOGRAFO_ATO1, FOTOGRAFO_ATO2, INDICADO_DESTINO, LUGAR_CLIENTE, PECA, TELAO, TOPO, V3,
} from "../dados/posicoes";

export const LARGURA_TELA = 1080;
export const ALTURA_TELA = 1920;
export const FOV = 40; // vertical, igual em todos os planos
export const AZ_ORBITA = 4; // graus de giro durante cada plano

export type Janela = { x0: number; x1: number; y0: number; y1: number };
export const JANELA_UTIL: Janela = { x0: 70, x1: 1010, y0: 470, y1: 1060 };
export const JANELA_FINAL: Janela = { x0: 70, x1: 1010, y0: 700, y1: 1170 };
const MARGEM = 30;
const LARGURA_CLOSE = 0.45 * LARGURA_TELA; // 486 px
const TOLERANCIA = 0.05;
const ALTURA_PERSONAGEM = 2.15;

// ---------- tabela de tamanhos (centro, tamanho) em metros ----------
type Caixa = { c: V3; t: V3 };
const caixa = (c: V3, t: V3): Caixa => ({ c, t });
const emPe = (p: V3, larg: number, prof: number, desloc: [number, number] = [0, 0], alt = ALTURA_PERSONAGEM): Caixa =>
  caixa([p[0] + desloc[0], TOPO + alt / 2, p[2] + desloc[1]], [larg, alt, prof]);
const sobrePlataforma = (p: V3, t: V3): Caixa => caixa([p[0], TOPO + t[1] / 2, p[2]], t);

export const CAIXAS: Record<string, Caixa> = {
  // personagens (alturas de cabeca aos pes); o fotografo inclui a camera na frente
  fotografo1: emPe(FOTOGRAFO_ATO1, 1.5, 1.1, [0.25, 0]),
  fotografo2: emPe(FOTOGRAFO_ATO2, 1.3, 1.4, [0.25, 0.4]),
  casalAmigos: emPe(CASAL_AMIGOS, 1.3, 1.4),
  curioso: emPe(CURIOSO, 1.2, 0.9, [0, 0], 2.5),
  casalCliente6: emPe(LUGAR_CLIENTE[6], 1.5, 1.2),
  casalCliente7: emPe(LUGAR_CLIENTE[7], 1.5, 1.2),
  casalCliente8: emPe(LUGAR_CLIENTE[8], 1.5, 1.2),
  casalCliente9: emPe(LUGAR_CLIENTE[9], 1.5, 1.2),
  casalCliente11: emPe(LUGAR_CLIENTE[11], 1.9, 1.5, [0.2, 0.1]), // inclui o celular na mao da noiva
  casalCliente13: emPe(LUGAR_CLIENTE[11], 1.6, 1.6),
  casalIndicado: emPe(INDICADO_DESTINO, 1.6, 1.6),
  cabecasCliente11: caixa([LUGAR_CLIENTE[11][0], TOPO + 1.85, LUGAR_CLIENTE[11][2]], [1.5, 0.6, 1.0]),
  // cenario e pecas
  telao: sobrePlataforma(TELAO, [2.6, 2.7, 0.3]),
  plataforma: caixa([0, 0.25, 0], [12.2, 0.5, 7.2]),
  camera1: caixa([CAMERA_ATO1[0] + 0.1, CAMERA_ATO1[1] + 0.15, CAMERA_ATO1[2]], [1.5, 1.4, 1.1]),
  album: sobrePlataforma(PECA[5], [1.0, 0.75, 0.85]),
  celular: sobrePlataforma(PECA[6], [0.75, 1.25, 0.55]),
  proposta: sobrePlataforma(PECA[7], [0.95, 1.15, 0.7]),
  contrato: sobrePlataforma(PECA[8], [1.0, 1.15, 0.7]),
  maquininha: sobrePlataforma(PECA[9], [1.25, 0.95, 0.7]),
  hds: sobrePlataforma(PECA[10], [1.6, 1.85, 0.95]),
  cabos10: caixa([(FOTOGRAFO_ATO2[0] + PECA[10][0]) / 2, 1.3, (FOTOGRAFO_ATO2[2] + PECA[10][2]) / 2], [1.2, 1.2, 2.5]),
  tablet: sobrePlataforma(PECA[11], [1.1, 0.95, 0.7]),
  balao: caixa(PECA[12], [1.3, 0.9, 0.25]),
};
// todas as pecas do ato 2 (uniao das caixas)
export const PECAS_ATO2 = ["album", "celular", "proposta", "contrato", "maquininha", "hds", "tablet", "balao"];

// ---------- planos ----------
export type Plano = {
  id: string;
  az: number;
  el: number; // entre 25 e 40
  tipo: "close" | "contexto";
  principal?: string; // so no close: ocupa 45% da largura
  lista: string[]; // precisa aparecer
  janela?: Janela;
};
const P = (id: string, tipo: "close" | "contexto", az: number, el: number, lista: string[], principal?: string, janela?: Janela): Plano => ({
  id, tipo, az, el, lista, principal, janela,
});

// Etapas de cada segmento: quando a camera troca de plano.
export type Quando = "ini" | "ctx" | "sol" | "prob";
export type EtapaPlano = { quando: Quando; plano: Plano };

const closeCamera = (s: string, az: number, el: number) => P(`${s}-close`, "close", az, el, ["camera1"], "camera1");
const ctxAto1 = (s: string) => P(`${s}-contexto`, "contexto", 30, 30, ["fotografo1", "telao", "casalAmigos"]);

export const ETAPAS_SEG: EtapaPlano[][] = [
  /* s00 */ [
    { quando: "ini", plano: P("s00-abertura", "contexto", 35, 28, ["fotografo1", "casalAmigos"]) },
    { quando: "sol", plano: P("s00-treze", "contexto", 25, 32, ["plataforma"]) },
  ],
  /* s01 */ [{ quando: "ini", plano: closeCamera("s01", 40, 28) }, { quando: "ctx", plano: ctxAto1("s01") }],
  /* s02 */ [{ quando: "ini", plano: closeCamera("s02", 40, 28) }, { quando: "ctx", plano: ctxAto1("s02") }],
  /* s03 */ [{ quando: "ini", plano: closeCamera("s03", 50, 28) }, { quando: "ctx", plano: ctxAto1("s03") }],
  /* s04 */ [{ quando: "ini", plano: closeCamera("s04", 35, 30) }, { quando: "ctx", plano: ctxAto1("s04") }],
  /* s05 */ [
    { quando: "ini", plano: P("s05-close", "close", 20, 30, ["album"], "album") },
    { quando: "ctx", plano: P("s05-contexto", "contexto", 20, 30, ["telao", "album", "fotografo1", "curioso"]) },
  ],
  /* s06 */ [
    { quando: "ini", plano: P("s06-close", "close", 15, 28, ["celular"], "celular") },
    { quando: "ctx", plano: P("s06-contexto", "contexto", 25, 30, ["celular", "casalCliente6", "fotografo2"]) },
  ],
  /* s07 */ [
    { quando: "ini", plano: P("s07-close", "close", 50, 30, ["proposta"], "proposta") },
    { quando: "ctx", plano: P("s07-contexto", "contexto", 30, 30, ["proposta", "casalCliente7", "fotografo2"]) },
  ],
  /* s08 */ [
    { quando: "ini", plano: P("s08-close", "close", 35, 30, ["contrato"], "contrato") },
    { quando: "ctx", plano: P("s08-contexto", "contexto", 40, 30, ["contrato", "casalCliente8", "fotografo2"]) },
  ],
  /* s09 */ [
    { quando: "ini", plano: P("s09-close", "close", 35, 30, ["maquininha"], "maquininha") },
    { quando: "ctx", plano: P("s09-contexto", "contexto", 40, 30, ["maquininha", "contrato", "casalCliente9", "fotografo2"]) },
  ],
  /* s10 */ [
    { quando: "ini", plano: P("s10-close", "close", 20, 30, ["hds"], "hds") },
    { quando: "ctx", plano: P("s10-contexto", "contexto", 20, 32, ["hds", "cabos10", "fotografo2"]) },
  ],
  /* s11 */ [
    { quando: "ini", plano: P("s11-close", "close", 10, 30, ["tablet"], "tablet") },
    { quando: "ctx", plano: P("s11-contexto", "contexto", 15, 30, ["tablet", "casalCliente11", "fotografo2"]) },
  ],
  /* s12 */ [
    { quando: "ini", plano: P("s12-close", "close", 10, 28, ["balao", "cabecasCliente11"], "balao") },
    { quando: "ctx", plano: P("s12-contexto", "contexto", 10, 28, ["balao", "casalCliente11", "celular"]) },
  ],
  /* s13 */ [
    { quando: "ini", plano: P("s13-contexto", "contexto", 30, 30, ["casalCliente13", "casalIndicado", "fotografo2"]) },
    { quando: "sol", plano: P("s13-pronto", "contexto", 25, 32, [...PECAS_ATO2, "fotografo2", "casalCliente13", "casalIndicado"]) },
  ],
  /* s14 */ [
    { quando: "prob", plano: P("s14-final", "contexto", 20, 35, [...PECAS_ATO2, "casalCliente13", "casalIndicado", "fotografo2"], undefined, JANELA_FINAL) },
  ],
];

// ---------- calculo ----------
const cantos = (id: string): THREE.Vector3[] => {
  const { c, t } = CAIXAS[id];
  const out: THREE.Vector3[] = [];
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) out.push(new THREE.Vector3(c[0] + (sx * t[0]) / 2, c[1] + (sy * t[1]) / 2, c[2] + (sz * t[2]) / 2));
  return out;
};

type Retangulo = { xmin: number; xmax: number; ymin: number; ymax: number };
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
const centroMundo = (pts: THREE.Vector3[]) => {
  const b = new THREE.Box3().setFromPoints(pts);
  return b.getCenter(new THREE.Vector3());
};

// desloca o ponto de mira (em paralelo ao plano da imagem) para centralizar o conjunto na janela; 3 repeticoes
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
  d: number;
  alvo: V3;
  pos: V3;
  janela: Janela;
  uniao: Retangulo;
  principal?: Retangulo;
  caixas: Record<string, Retangulo>;
  limite: "largura" | "altura" | "contexto";
  fora: string[]; // caixas que ficaram fora da janela (vazio = ok)
};

const NUM_ITER = 20;
const cache = new Map<string, Resolvido>();

export const resolverPlano = (plano: Plano): Resolvido => {
  if (cache.has(plano.id)) return cache.get(plano.id)!;
  const janela = plano.janela ?? JANELA_UTIL;
  const util = { w: janela.x1 - janela.x0 - 2 * MARGEM, h: janela.y1 - janela.y0 - 2 * MARGEM };
  const todos: THREE.Vector3[] = [];
  plano.lista.forEach((id) => todos.push(...cantos(id)));
  const ptsPrincipal = plano.principal ? cantos(plano.principal) : null;
  const inicio = centroMundo(todos);

  const medir = (d: number) => {
    const alvo = inicio.clone();
    centralizar(alvo, d, plano.az, plano.el, todos, janela);
    const u = projetarPontos(todos);
    const p = ptsPrincipal ? projetarPontos(ptsPrincipal) : null;
    return { alvo, u, p };
  };
  // metrica > 1 significa que ainda esta grande demais
  const metrica = (d: number) => {
    const { u, p } = medir(d);
    const mUniao = Math.max((u.xmax - u.xmin) / util.w, (u.ymax - u.ymin) / util.h);
    if (plano.tipo === "contexto" || !p) return mUniao;
    return Math.max(mUniao, (p.xmax - p.xmin) / LARGURA_CLOSE, (p.ymax - p.ymin) / util.h);
  };
  let lo = 0.8;
  let hi = 150;
  for (let i = 0; i < NUM_ITER; i++) {
    const mid = (lo + hi) / 2;
    if (metrica(mid) > 1) lo = mid;
    else hi = mid;
  }
  const d = hi;
  const { alvo, u, p } = medir(d);
  const caixas: Record<string, Retangulo> = {};
  const fora: string[] = [];
  for (const id of plano.lista) {
    const r = projetarPontos(cantos(id));
    caixas[id] = r;
    if (r.xmin < janela.x0 - 0.5 || r.xmax > janela.x1 + 0.5 || r.ymin < janela.y0 - 0.5 || r.ymax > janela.y1 + 0.5) fora.push(id);
  }
  let limite: Resolvido["limite"] = "contexto";
  if (plano.tipo === "close" && p) {
    const w = p.xmax - p.xmin;
    limite = Math.abs(w - LARGURA_CLOSE) <= LARGURA_CLOSE * TOLERANCIA ? "largura" : "altura";
    // abaixo da tolerancia de largura so e aceitavel quando a altura da janela (ou a uniao) limita
    if (w > LARGURA_CLOSE * (1 + TOLERANCIA)) fora.push(`${plano.principal} (largura ${w.toFixed(0)} px)`);
  }
  const res: Resolvido = {
    plano, d, janela, uniao: u, principal: p ?? undefined, caixas, limite, fora,
    alvo: [alvo.x, alvo.y, alvo.z],
    pos: [camera.position.x, camera.position.y, camera.position.z],
  };
  cache.set(plano.id, res);
  return res;
};

// pose da camera para um plano, com o azimute deslocado (orbita lenta de AZ_ORBITA graus em volta de az)
export const poseResolvida = (plano: Plano, azExtra: number): { pos: V3; alvo: V3; fov: number } => {
  const r = resolverPlano(plano);
  const az = ((plano.az + azExtra) * Math.PI) / 180;
  const el = (plano.el * Math.PI) / 180;
  const [tx, ty, tz] = r.alvo;
  return {
    pos: [tx + r.d * Math.sin(az) * Math.cos(el), ty + r.d * Math.sin(el), tz + r.d * Math.cos(az) * Math.cos(el)],
    alvo: r.alvo,
    fov: FOV,
  };
};

// calcula todos os planos no carregamento do modulo
export const PLANOS_RESOLVIDOS: Resolvido[] = [];
ETAPAS_SEG.forEach((et) => et.forEach((e) => PLANOS_RESOLVIDOS.push(resolverPlano(e.plano))));

// retangulos projetados com o azimute deslocado (usado na verificacao dos extremos da orbita)
export const projetarComAz = (plano: Plano, azExtra: number): Record<string, Retangulo> => {
  const r = resolverPlano(plano);
  const alvo = new THREE.Vector3(...r.alvo);
  posicionar(alvo, r.d, plano.az + azExtra, plano.el);
  const out: Record<string, Retangulo> = {};
  for (const id of plano.lista) out[id] = projetarPontos(cantos(id));
  return out;
};
