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
  fotografo2: emPe(FOTOGRAFO_ATO2, 1.3, 1.4, [0.1, 0.35]),
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
  // camera de verdade: corpo 0,75 x 0,55 x 0,42 (gira 90 graus), lente a frente, visor em cima
  camera1: caixa([CAMERA_ATO1[0] + 0.12, CAMERA_ATO1[1] + 0.03, CAMERA_ATO1[2]], [1.0, 0.72, 0.78]),
  camera1Flash: caixa([CAMERA_ATO1[0] + 0.05, CAMERA_ATO1[1] + 0.3, CAMERA_ATO1[2]], [1.25, 1.3, 1.1]), // com o flash na sapata e as maos
  album: sobrePlataforma(PECA[5], [0.95, 0.55, 0.8]),
  celular: sobrePlataforma(PECA[6], [0.75, 1.1, 0.5]),
  proposta: sobrePlataforma(PECA[7], [1.4, 1.0, 0.6]),
  contrato: sobrePlataforma(PECA[8], [1.4, 1.0, 0.6]),
  maquininha: sobrePlataforma(PECA[9], [1.15, 0.95, 0.6]),
  hds: sobrePlataforma(PECA[10], [1.9, 1.75, 0.9]),
  cabos10: caixa([(FOTOGRAFO_ATO2[0] + PECA[10][0]) / 2, 1.3, (FOTOGRAFO_ATO2[2] + PECA[10][2]) / 2], [1.2, 1.2, 2.5]),
  tablet: sobrePlataforma(PECA[11], [1.1, 0.8, 0.6]),
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
  // contexto: cada item de `visiveis` nao pode ficar escondido atras dos seus oclusores (o azimute e escolhido por busca)
  visiveis?: { id: string; oclusores: string[] }[];
};
const P = (id: string, tipo: "close" | "contexto", az: number, el: number, lista: string[], principal?: string, janela?: Janela, visiveis?: { id: string; oclusores: string[] }[]): Plano => ({
  id, tipo, az, el, lista, principal, janela, visiveis,
});
// contexto das pecas do ato 2: a peca nao pode ficar atras do fotografo nem do casal
const ctxPeca = (seg: string, az: number, el: number, lista: string[], peca: string, casal: string, extra: { id: string; oclusores: string[] }[] = []) =>
  P(`${seg}-contexto`, "contexto", az, el, lista, undefined, undefined, [{ id: peca, oclusores: [casal, "fotografo2"] }, ...extra]);

// Etapas de cada segmento: quando a camera troca de plano.
export type Quando = "ini" | "ctx" | "sol" | "prob";
// desl: segundos somados ao instante; trans: duracao da transicao (s). Padrao 0 e 0,5 s (chega 0,2 s depois do inicio do contexto).
export type EtapaPlano = { quando: Quando; plano: Plano; desl?: number; trans?: number };

const closeCamera = (s: string, az: number, el: number) => P(`${s}-close`, "close", az, el, ["camera1"], "camera1");
const ctxAto1 = (s: string) => P(`${s}-contexto`, "contexto", 30, 30, ["fotografo1", "telao", "casalAmigos"]);

export const ETAPAS_SEG: EtapaPlano[][] = [
  /* s00 */ [
    { quando: "ini", plano: P("s00-abertura", "contexto", 35, 28, ["fotografo1", "casalAmigos"]) },
    { quando: "sol", plano: P("s00-treze", "contexto", 25, 32, ["plataforma"]), desl: -0.3, trans: 0.8 },
  ],
  /* s01 */ [{ quando: "ini", plano: closeCamera("s01", 40, 28) }, { quando: "ctx", plano: ctxAto1("s01") }],
  /* s02 */ [
    { quando: "ini", plano: closeCamera("s02", 40, 28) },
    { quando: "ctx", plano: ctxAto1("s02") },
    { quando: "sol", plano: closeCamera("s02-lente", 40, 28), desl: -0.6, trans: 0.6 }, // a 50mm chega: volta ao close antes dela
  ],
  /* s03 */ [{ quando: "ini", plano: closeCamera("s03", 50, 28) }, { quando: "ctx", plano: ctxAto1("s03") }],
  /* s04 */ [
    { quando: "ini", plano: closeCamera("s04", 35, 30) },
    { quando: "ctx", plano: ctxAto1("s04") },
    { quando: "sol", plano: P("s04-flash", "close", 35, 30, ["camera1Flash"], "camera1Flash"), desl: -0.6, trans: 0.6 }, // o flash estoura: close
  ],
  /* s05 */ [
    { quando: "ini", plano: P("s05-close", "close", 20, 30, ["album"], "album") },
    { quando: "ctx", plano: P("s05-contexto", "contexto", 20, 30, ["telao", "album", "fotografo1", "curioso"]) },
  ],
  /* s06 */ [
    { quando: "ini", plano: P("s06-close", "close", 15, 28, ["celular"], "celular") },
    { quando: "ctx", plano: ctxPeca("s06", 5, 38, ["celular", "casalCliente6", "fotografo2"], "celular", "casalCliente6") },
  ],
  /* s07 */ [
    { quando: "ini", plano: P("s07-close", "close", 20, 30, ["proposta"], "proposta") },
    { quando: "ctx", plano: ctxPeca("s07", 5, 38, ["proposta", "casalCliente7", "fotografo2"], "proposta", "casalCliente7") },
  ],
  /* s08 */ [
    { quando: "ini", plano: P("s08-close", "close", 35, 30, ["contrato"], "contrato") },
    { quando: "ctx", plano: ctxPeca("s08", 5, 38, ["contrato", "casalCliente8", "fotografo2"], "contrato", "casalCliente8") },
  ],
  /* s09 */ [
    { quando: "ini", plano: P("s09-close", "close", 35, 30, ["maquininha"], "maquininha") },
    { quando: "ctx", plano: ctxPeca("s09", 5, 38, ["maquininha", "contrato", "casalCliente9", "fotografo2"], "maquininha", "casalCliente9") },
  ],
  /* s10 */ [
    { quando: "ini", plano: P("s10-close", "close", 20, 30, ["hds"], "hds") },
    { quando: "ctx", plano: ctxPeca("s10", 5, 38, ["hds", "cabos10", "fotografo2"], "hds", "casalCliente9", [{ id: "fotografo2", oclusores: ["hds", "casalCliente9"] }]) },
  ],
  /* s11 */ [
    { quando: "ini", plano: P("s11-close", "close", 10, 30, ["tablet"], "tablet") },
    { quando: "ctx", plano: ctxPeca("s11", 5, 38, ["tablet", "casalCliente11", "fotografo2"], "tablet", "casalCliente11") },
  ],
  /* s12 */ [
    { quando: "ini", plano: P("s12-close", "close", 10, 28, ["balao", "cabecasCliente11"], "balao") },
    { quando: "ctx", plano: P("s12-contexto", "contexto", 10, 28, ["balao", "casalCliente11", "celular"]) },
  ],
  /* s13 */ [
    { quando: "ini", plano: P("s13-contexto", "contexto", 30, 30, ["casalCliente13", "casalIndicado", "fotografo2"]) },
    { quando: "sol", plano: P("s13-pronto", "contexto", 25, 32, [...PECAS_ATO2, "fotografo2", "casalCliente13", "casalIndicado"]), desl: -0.3, trans: 0.6 },
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

// ---------- oclusao: o raio da camera ate os cantos da peca nao pode atravessar o cilindro de um personagem ----------
// corpo real do personagem: 67% da caixa declarada
const cilindroDe = (id: string) => {
  const { c, t } = CAIXAS[id];
  return { x: c[0], z: c[2], r: (Math.max(t[0], t[2]) / 2) * 0.67, y0: c[1] - t[1] / 2, y1: c[1] + t[1] / 2 };
};
const bloqueia = (cam: THREE.Vector3, alvo: THREE.Vector3, cil: ReturnType<typeof cilindroDe>): boolean => {
  const dx = alvo.x - cam.x;
  const dz = alvo.z - cam.z;
  const a = dx * dx + dz * dz;
  if (a < 1e-9) return false;
  const fx = cam.x - cil.x;
  const fz = cam.z - cil.z;
  const b = 2 * (fx * dx + fz * dz);
  const c = fx * fx + fz * fz - cil.r * cil.r;
  const disc = b * b - 4 * a * c;
  if (disc < 0) return false;
  const sq = Math.sqrt(disc);
  const t1 = (-b - sq) / (2 * a);
  const t2 = (-b + sq) / (2 * a);
  const lo = Math.max(0, t1);
  const hi = Math.min(1, t2);
  if (lo > hi) return false;
  // altura do raio dentro do intervalo [lo, hi]
  const y = (t: number) => cam.y + (alvo.y - cam.y) * t;
  const ymin = Math.min(y(lo), y(hi));
  const ymax = Math.max(y(lo), y(hi));
  return ymax >= cil.y0 && ymin <= cil.y1;
};
// menor fracao (entre os itens exigidos) dos 8 cantos + centro que a camera enxerga sem oclusor na frente
export const visibilidadeDe = (plano: Plano, camPos: THREE.Vector3): number => {
  if (!plano.visiveis) return 1;
  let pior = 1;
  for (const v of plano.visiveis) {
    const pts = cantos(v.id);
    const { c } = CAIXAS[v.id];
    pts.push(new THREE.Vector3(c[0], c[1], c[2]));
    const cils = v.oclusores.map(cilindroDe);
    let vistos = 0;
    for (const p of pts) if (!cils.some((cl) => bloqueia(camPos, p, cl))) vistos++;
    pior = Math.min(pior, vistos / pts.length);
  }
  return pior;
};

function resolverComAz(plano: Plano, az: number): Resolvido {
  return resolverPlanoBase({ ...plano, az });
}
export const resolverPlano = (plano: Plano): Resolvido => {
  if (cache.has(plano.id)) return cache.get(plano.id)!;
  let melhor: Resolvido | null = null;
  let melhorScore = Infinity;
  let reserva: Resolvido | null = null;
  let reservaVis = -1;
  if (plano.visiveis) {
    // varre o azimute de -90 a +90 graus em passos de 5: o menor d (peca maior) entre os que enxergam tudo, com pequena
    // penalidade por se afastar do azimute pedido
    for (let k = -18; k <= 18; k++) {
      const r = resolverComAz(plano, plano.az + k * 5);
      if (r.fora.length) continue;
      const vis = visibilidadeDe(plano, new THREE.Vector3(...r.pos));
      if (vis >= 0.99) {
        const score = r.d + 0.06 * Math.abs(k * 5);
        if (score < melhorScore) { melhorScore = score; melhor = r; }
      } else if (vis > reservaVis) { reservaVis = vis; reserva = r; }
    }
  }
  const res = melhor ?? reserva ?? resolverPlanoBase(plano);
  const final = { ...res, plano: { ...plano, az: res.plano.az } };
  cache.set(plano.id, final);
  return final;
};

function resolverPlanoBase(plano: Plano): Resolvido {
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
    // 45% da largura (486 px), tolerancia de 5% para os dois lados. Pecas altas e estreitas (celular) so chegam a menos que
    // isso porque a altura da janela util (590 px) limita antes: nesse caso o limite e "altura" e nao e falha.
    const h = p.ymax - p.ymin;
    const limitadaPelaAltura = h >= util.h - 1;
    if (limitadaPelaAltura && w < LARGURA_CLOSE * (1 - TOLERANCIA)) limite = "altura";
    else if (Math.abs(w - LARGURA_CLOSE) > LARGURA_CLOSE * TOLERANCIA) fora.push(`${plano.principal} (largura ${w.toFixed(0)} px, esperado 486 +- 5%)`);
  }
  const res: Resolvido = {
    plano, d, janela, uniao: u, principal: p ?? undefined, caixas, limite, fora,
    alvo: [alvo.x, alvo.y, alvo.z],
    pos: [camera.position.x, camera.position.y, camera.position.z],
  };
  return res;
}

// pose da camera para um plano, com o azimute deslocado (orbita lenta de AZ_ORBITA graus em volta de az)
export const poseResolvida = (plano: Plano, azExtra: number): { pos: V3; alvo: V3; fov: number } => {
  const r = resolverPlano(plano);
  const az = ((r.plano.az + azExtra) * Math.PI) / 180; // azimute resolvido (a busca de oclusao pode te-lo mudado)
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
  posicionar(alvo, r.d, r.plano.az + azExtra, plano.el);
  const out: Record<string, Retangulo> = {};
  for (const id of plano.lista) out[id] = projetarPontos(cantos(id));
  return out;
};

// varredura de azimute (diagnostico): distancia d, visibilidade da peca e se coube na janela
export const varrerAzimute = (plano: Plano, de = -90, ate = 90, passo = 5) => {
  const out: { az: number; d: number; vis: number; ok: boolean }[] = [];
  for (let az = de; az <= ate; az += passo) {
    const r = resolverComAz(plano, az);
    out.push({ az, d: r.d, vis: visibilidadeDe(plano, new THREE.Vector3(...r.pos)), ok: r.fora.length === 0 });
  }
  return out;
};
