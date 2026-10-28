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
// janelas uteis (px): com o card visivel o conteudo fica abaixo dele; sem card sobe ate y = 300
export const JANELA_CARD: Janela = { x0: 50, x1: 1030, y0: 470, y1: 1540 };
export const JANELA_LIVRE: Janela = { x0: 50, x1: 1030, y0: 300, y1: 1540 };
export const JANELA_FINAL: Janela = { x0: -70, x1: 1150, y0: 520, y1: 1560 }; // final: o tabuleiro enche a tela e corta um pouco nas laterais, como na referencia
export const JANELA_TOTAL: Janela = { x0: 0, x1: 1080, y0: 300, y1: 1540 }; // tabuleiro inteiro: a largura toda da tela
export const JANELA_ABERTURA: Janela = { x0: 50, x1: 1030, y0: 480, y1: 1560 }; // s00: fotografo abaixo do card, camera da mao acima da legenda
export const JANELA_UTIL = JANELA_CARD;
const MARGEM = 30;
// metas de tamanho (px)
export const LARG_CLOSE = 0.7 * LARGURA_TELA; // peca: 70% da largura (756 px), como na referencia (45% a 70%), pode cortar em cima e embaixo
export const TOL_CLOSE = 0.05;
export const ALT_CAMINHADA = 0.5 * ALTURA_TELA; // fotografo andando: 50% da altura da tela (960 px)
export const ALT_CENA = 0.4 * ALTURA_TELA; // cena: o fotografo mede ao menos 40% da altura da tela (768 px); o resto pode cortar
export const ALT_ABERTURA = 0.55 * ALTURA_TELA; // s00: fotografo a 55% da altura da tela (1056 px)
export const LARG_CENA_MIN = 0.75 * LARGURA_TELA; // cena: conjunto a 75% da largura (810 px) ...
export const ALT_CENA_MIN = 0.4 * ALTURA_TELA; // ... ou personagem mais alto a 40% da altura (768 px)
export const LARG_DETALHE = 0.45 * LARGURA_TELA;
export const JANELA_CENA: Janela = { x0: -90, x1: 1170, y0: 520, y1: 1560 }; // cena: pode cortar ate 40 px nas laterais
export const JANELA_V: Janela = { x0: 50, x1: 1030, y0: 520, y1: 1560 }; // planos que cortam na vertical: so a largura limita
// legenda: nao pode cobrir cabecas, plaquinhas nem a placa de foto
export const BANDA_LEGENDA = { x0: 80, x1: 1000, y0: 1185, y1: 1295 };

// ---------- tabela de caixas (centro, tamanho) em metros ----------
type Caixa = { c: V3; t: V3 };
const emPe = (p: V3, larg: number, prof: number, dz = 0): Caixa => ({ c: [p[0], p[1] + ALTURA_PERSONAGEM / 2, p[2] + dz], t: [larg, ALTURA_PERSONAGEM, prof] });
// pecas: tamanho acima do pedestal (largura, altura, profundidade); a caixa inclui o pedestal
const PECA_TAM: Record<number, V3> = {
  1: [1.1, 0.75, 0.65], 2: [0.95, 0.5, 0.9], 3: [0.8, 1.25, 0.25], 4: [1.05, 1.25, 0.65], 5: [1.05, 1.35, 0.65], 6: [1.2, 1.0, 0.7],
  7: [1.0, 1.0, 0.8], 8: [0.95, 0.75, 0.55], 9: [0.7, 1.3, 0.6], 10: [1.0, 1.95, 0.95], 11: [1.15, 1.05, 0.65], 12: [0.9, 0.05, 0.9], 13: [0.9, 0.05, 0.9],
};
export const caixaDe = (id: string): Caixa => {
  const m = id.match(/^([a-zA-Z]+)(\d+)$/);
  if (!m) {
    if (id === "tabuleiro") return { c: [0, 0.3, 0], t: [TABULEIRO.largura + 0.3, 0.7, TABULEIRO.profundidade + 0.3] };
    if (id === "seta") return { c: [1.2, 1.9, -0.9], t: [12.4, 2.6, 8.2] };
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
    case "plaq": { // plaquinha branca na frente do pedestal
      const p = posPedestal(n);
      return { c: [p[0], p[1], p[2] + 0.452], t: [0.7, 0.22, 0.02] };
    }
    case "placa": {
      const p = posPlaca(n); // cavalete alto: a moldura fica acima das cabecas
      return { c: [p[0], p[1] + 1.15, p[2]], t: [1.2, 2.3, 0.4] };
    }
    case "tela": {
      const p = posPlaca(n);
      return { c: [p[0], p[1] + 1.8, p[2]], t: [1.1, 0.75, 0.05] };
    }
    case "balao": {
      const p = posCli(n);
      return { c: [p[0] - 0.2, Y_CASA + 2.0, p[2] + 0.25], t: [1.05, 0.45, 0.3] };
    }
    case "maoCam": {
      const p = posFot(n);
      return { c: [p[0], p[1] + (n === 8 ? 1.12 : 1.0), p[2] + 0.22], t: [0.45, 0.34, 0.4] }; // s08: sobe para os cartoes da sapata ficarem no centro
    }
    case "notebook": {
      const p = posMesa(n);
      return { c: [p[0], Y_CASA + 0.45, p[2]], t: [0.8, 0.9, 0.6] };
    }
  }
  throw new Error(`caixa desconhecida: ${id}`);
};
// caixa fisica (mais justa que a de enquadramento) usada como oclusor no teste de visibilidade
export const corpoDe = (id: string): Caixa => {
  const m = id.match(/^([a-zA-Z]+)(\d+)$/)!;
  const n = parseInt(m[2], 10);
  const pos: Record<string, V3> = { fot: posFot(n), noiva: posNoiva(n), noivo: posNoivo(n), cli: posCli(n), amigoA: posAmigoA(n), amigoB: posAmigoB(n), madrinha: posCli(n) };
  const p = pos[m[1]];
  return { c: [p[0], p[1] + ALTURA_PERSONAGEM / 2, p[2] + (m[1] === "fot" ? 0.1 : 0)], t: [0.55, ALTURA_PERSONAGEM, m[1] === "fot" ? 0.5 : 0.35] };
};
const EH_PERSONAGEM = /^(fot|noiva|noivo|cli|amigoA|amigoB|madrinha)\d+$/;
const EH_PLACA = /^placa\d+$/;
const EH_PECA = /^peca\d+$/;

export const cabecaDe = (id: string): Caixa => {
  const m = id.match(/^([a-zA-Z]+)(\d+)$/)!;
  const c = corpoDe(id).c;
  void m;
  return { c: [c[0], c[1] + 0.67, c[2]], t: [0.5, 0.55, 0.5] };
};

// ---------- planos ----------
export type TipoPlano = "close" | "cena" | "caminhada" | "detalhe" | "aberto";
export type Plano = {
  id: string;
  tipo: TipoPlano;
  az: number;
  el: number; // 28 a 38
  lista: string[]; // precisa aparecer
  principal?: string; // close, detalhe, caminhada
  larguraPx?: number; // meta de largura do principal
  alturaPx?: number; // meta de altura do principal
  janela?: Janela;
  seguir?: { de: string; para: string }; // caminhada: a mira acompanha o fotografo
  casa?: number; // casa do segmento (plaquinha e placa de foto)
  orbita?: { az: number; push: number }; // abertura e final: giro e push-in maiores que os 5 graus e 6% padrao (nunca parado)
  livreV?: boolean; // so a largura limita; em cima e embaixo pode cortar (como na referencia)
};

// ---------- calculo ----------
const cantosCaixa = (b: Caixa): THREE.Vector3[] => {
  const out: THREE.Vector3[] = [];
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) out.push(new THREE.Vector3(b.c[0] + (sx * b.t[0]) / 2, b.c[1] + (sy * b.t[1]) / 2, b.c[2] + (sz * b.t[2]) / 2));
  return out;
};
const cantos = (id: string): THREE.Vector3[] => cantosCaixa(caixaDe(id));
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

// itens que a legenda nao pode cobrir: cabecas dos personagens, plaquinha da peca e placa de foto
const sensiveis = (lista: string[]): { nome: string; c: Caixa }[] => {
  const out: { nome: string; c: Caixa }[] = [];
  for (const id of lista) {
    if (EH_PERSONAGEM.test(id)) out.push({ nome: `cabeca ${id}`, c: cabecaDe(id) });
    const m = id.match(/^peca(\d+)$/);
    if (m && parseInt(m[1], 10) <= 11) out.push({ nome: `plaquinha ${m[1]}`, c: caixaDe(`plaq${m[1]}`) });
    const q = id.match(/^placa(\d+)$/);
    if (q) out.push({ nome: `placa de foto ${q[1]}`, c: caixaDe(`tela${q[1]}`) });
  }
  return out;
};
const cruza = (r: Retangulo, b: typeof BANDA_LEGENDA) => r.xmax > b.x0 && r.xmin < b.x1 && r.ymax > b.y0 && r.ymin < b.y1;

export type Resolvido = {
  plano: Plano;
  d: number; // distancia no inicio do plano (prog 0); no estado medio e d x 0,97
  alvo: V3;
  janela: Janela;
  uniao: Retangulo;
  principal?: Retangulo;
  caixas: Record<string, Retangulo>;
  limite: "largura" | "altura" | "janela";
  fora: string[]; // caixas que ficaram fora da janela (vazio = ok)
  removidos: string[]; // itens tirados da lista pela regra de tamanho minimo
  alturaMaxPersonagem: number; // px do personagem mais alto da lista
  larguraConjunto: number; // px do conjunto da lista
  deslocY: number; // deslocamento vertical da mira (px na tela) para tirar a legenda de cima de cabecas/plaquinhas/placa
  legendaCobre: string[]; // itens que ainda ficaram sob a legenda (vazio = ok)
};

const NUM_ITER = 22;
const MID_D = 1 - PUSH_IN / 2;
const PROGS = [0, 0.5, 1];

function resolverLista(plano: Plano, lista: string[]): Omit<Resolvido, "removidos"> {
  const janela = plano.janela ?? JANELA_CARD;
  const util = { w: janela.x1 - janela.x0 - 2 * MARGEM, h: plano.livreV ? 1e9 : janela.y1 - janela.y0 - 2 * MARGEM };
  const todos = pontosDe(lista);
  const ptsP = plano.principal ? cantos(plano.principal) : null;
  const inicio = centroMundo(todos);
  const azMid = plano.az + AZ_ORBITA / 2;
  const medir = (d: number) => {
    const alvo = inicio.clone();
    centralizar(alvo, d * MID_D, azMid, plano.el, todos, janela);
    return { alvo, u: projetarPontos(todos), p: ptsP ? projetarPontos(ptsP) : null };
  };
  const metrica = (d: number) => {
    const { u, p } = medir(d);
    let m = Math.max((u.xmax - u.xmin) / util.w, (u.ymax - u.ymin) / util.h);
    if (p && plano.alturaPx) m = Math.max(m, (p.ymax - p.ymin) / plano.alturaPx);
    if (p && plano.larguraPx) m = Math.max(m, (p.xmax - p.xmin) / plano.larguraPx);
    return m;
  };
  let lo = 0.8;
  let hi = 250;
  for (let i = 0; i < NUM_ITER; i++) {
    const mid = (lo + hi) / 2;
    if (metrica(mid) > 1) lo = mid;
    else hi = mid;
  }
  const d0 = hi;
  // legenda: desloca a mira na vertical (passos de 10 px) ate nenhuma cabeca, plaquinha ou placa ficar na banda y 1185 a 1295.
  // Se o deslocamento nao cabe na janela, afasta a camera em passos de 3% e tenta de novo.
  const sens = sensiveis(lista);
  let d = d0;
  let alvoF = new THREE.Vector3();
  let deslocY = 0;
  let cobre: string[] = [];
  for (let k = 0; k <= 14; k++) {
    d = d0 * (1 + 0.03 * k);
    const alvo = medir(d).alvo;
    const retsEm = (a: THREE.Vector3, prog: number) => {
      posicionar(a, d * (1 - PUSH_IN * prog), plano.az + AZ_ORBITA * prog, plano.el);
      return { u: projetarPontos(todos), s: sens.map((x) => ({ nome: x.nome, r: projetarPontos(cantosCaixa(x.c)) })) };
    };
    const legendaCobre = (a: THREE.Vector3) => {
      const ruins = new Set<string>();
      PROGS.forEach((pr) => retsEm(a, pr).s.forEach((x) => cruza(x.r, BANDA_LEGENDA) && ruins.add(x.nome)));
      return [...ruins];
    };
    const dentro = (a: THREE.Vector3) =>
      PROGS.every((pr) => {
        const u = retsEm(a, pr).u;
        return u.xmin >= janela.x0 - 1 && u.xmax <= janela.x1 + 1 && (plano.livreV || (u.ymin >= janela.y0 - 1 && u.ymax <= janela.y1 + 1));
      });
    alvoF = alvo.clone();
    deslocY = 0;
    cobre = legendaCobre(alvoF);
    if (cobre.length) {
      posicionar(alvo, d * MID_D, azMid, plano.el);
      const cima = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
      const cands: number[] = [];
      for (let j = 1; j <= 60; j++) cands.push(j * 10, -j * 10);
      cands.sort((x, y) => Math.abs(x) - Math.abs(y));
      for (const dy of cands) {
        const a = alvo.clone().addScaledVector(cima, (dy * d * MID_D) / FOCAL_PX);
        if (!dentro(a)) continue;
        if (legendaCobre(a).length === 0) {
          alvoF = a;
          deslocY = dy;
          cobre = [];
          break;
        }
      }
    }
    if (!cobre.length) break;
  }
  posicionar(alvoF, d * MID_D, azMid, plano.el);
  const u = projetarPontos(todos);
  const p = ptsP ? projetarPontos(ptsP) : null;
  const caixas: Record<string, Retangulo> = {};
  const fora: string[] = [];
  for (const id of lista) {
    const r = projetarPontos(cantos(id));
    caixas[id] = r;
    if (r.xmin < janela.x0 - 0.5 || r.xmax > janela.x1 + 0.5 || (!plano.livreV && (r.ymin < janela.y0 - 0.5 || r.ymax > janela.y1 + 0.5))) fora.push(id);
  }
  let limite: Resolvido["limite"] = "janela";
  if (p && plano.larguraPx) limite = Math.abs(p.xmax - p.xmin - plano.larguraPx) <= plano.larguraPx * TOL_CLOSE ? "largura" : "altura";
  let alturaMax = 0;
  for (const id of lista) if (EH_PERSONAGEM.test(id)) alturaMax = Math.max(alturaMax, caixas[id].ymax - caixas[id].ymin);
  return {
    plano, d, janela, uniao: u, principal: p ?? undefined, caixas, limite, fora, alvo: [alvoF.x, alvoF.y, alvoF.z],
    alturaMaxPersonagem: alturaMax, larguraConjunto: u.xmax - u.xmin, deslocY, legendaCobre: cobre,
  };
}

// raycast: fracao da face voltada para a camera (grade 8 x 8) que nao esta coberta por um oclusor
export const fracVisivel = (alvo: Caixa, ocluidores: Caixa[], cam: THREE.Vector3): number => {
  const b = new THREE.Box3(new THREE.Vector3(alvo.c[0] - alvo.t[0] / 2, alvo.c[1] - alvo.t[1] / 2, alvo.c[2] - alvo.t[2] / 2), new THREE.Vector3(alvo.c[0] + alvo.t[0] / 2, alvo.c[1] + alvo.t[1] / 2, alvo.c[2] + alvo.t[2] / 2));
  const c = b.getCenter(new THREE.Vector3());
  const t = b.getSize(new THREE.Vector3());
  const faces = [
    { nz: 1, nx: 0 }, { nz: -1, nx: 0 }, { nz: 0, nx: 1 }, { nz: 0, nx: -1 },
  ];
  const dir = cam.clone().sub(c).normalize();
  faces.sort((a, b2) => b2.nz * dir.z + b2.nx * dir.x - (a.nz * dir.z + a.nx * dir.x));
  const f = faces[0];
  const occ = ocluidores.map((o) => new THREE.Box3(new THREE.Vector3(o.c[0] - o.t[0] / 2, o.c[1] - o.t[1] / 2, o.c[2] - o.t[2] / 2), new THREE.Vector3(o.c[0] + o.t[0] / 2, o.c[1] + o.t[1] / 2, o.c[2] + o.t[2] / 2)));
  let ok = 0;
  for (let i = 0; i < 8; i++)
    for (let j = 0; j < 8; j++) {
      const a = ((i + 0.5) / 8 - 0.5) * 0.94;
      const bb = ((j + 0.5) / 8 - 0.5) * 0.94;
      const p = new THREE.Vector3(c.x, c.y + bb * t.y, c.z);
      if (f.nz) {
        p.x += a * t.x;
        p.z += f.nz * (t.z / 2);
      } else {
        p.z += a * t.z;
        p.x += f.nx * (t.x / 2);
      }
      const dd = p.clone().sub(cam);
      const dist = dd.length();
      const ray = new THREE.Ray(cam, dd.normalize());
      let bloq = false;
      for (const o of occ) {
        const hit = ray.intersectBox(o, new THREE.Vector3());
        if (hit && hit.distanceTo(cam) < dist - 0.02) bloq = true;
      }
      if (!bloq) ok++;
    }
  return ok / 64;
};

const cache = new Map<string, Resolvido>();
// Regra de tamanho minimo (so no plano "cena"): conjunto a 75% da largura da tela OU personagem mais alto a 40% da altura.
// Se nenhum dos dois, tira primeiro a placa de foto da lista e depois a peca (registrado no log).
export const resolverPlano = (plano: Plano): Resolvido => {
  const chave = `${plano.id}|${plano.az}`;
  if (cache.has(chave)) return cache.get(chave)!;
  let lista = [...plano.lista];
  let removidos: string[] = [];
  let r = resolverLista(plano, lista);
  const passa = (x: { alturaMaxPersonagem: number; larguraConjunto: number }) => x.alturaMaxPersonagem === 0 || x.alturaMaxPersonagem >= ALT_CENA_MIN || x.larguraConjunto >= LARG_CENA_MIN;
  if (plano.tipo === "cena") {
    for (const grupo of [EH_PLACA, EH_PECA]) {
      if (passa(r)) break;
      const tirar = lista.filter((id) => grupo.test(id));
      if (!tirar.length) continue;
      lista = lista.filter((id) => !grupo.test(id));
      removidos = [...removidos, ...tirar];
      r = resolverLista({ ...plano, lista }, lista);
    }
  }
  const final: Resolvido = { ...r, plano, removidos };
  cache.set(chave, final);
  return final;
};

// pose em um ponto (prog 0..1) do plano: o azimute cresce 5 graus e a distancia diminui 6%
export const poseResolvida = (plano: Plano, prog: number): { pos: V3; alvo: V3; fov: number } => {
  const r = resolverPlano(plano);
  const az = ((plano.az + (plano.orbita?.az ?? AZ_ORBITA) * prog) * Math.PI) / 180;
  const el = (plano.el * Math.PI) / 180;
  const d = r.d * (1 - (plano.orbita?.push ?? PUSH_IN) * prog);
  const [tx, ty, tz] = r.alvo;
  return { pos: [tx + d * Math.sin(az) * Math.cos(el), ty + d * Math.sin(el), tz + d * Math.cos(az) * Math.cos(el)], alvo: r.alvo, fov: FOV };
};

// retangulos projetados (prog 0, 0,5 ou 1) para a verificacao dos extremos da orbita
export const projetarEmProg = (plano: Plano, prog: number): Record<string, Retangulo> => {
  const r = resolverPlano(plano);
  const alvo = new THREE.Vector3(...r.alvo);
  posicionar(alvo, r.d * (1 - PUSH_IN * prog), plano.az + AZ_ORBITA * prog, plano.el);
  const out: Record<string, Retangulo> = {};
  for (const id of plano.lista.filter((x) => r.removidos.indexOf(x) < 0)) out[id] = projetarPontos(cantos(id));
  return out;
};
// retangulos projetados dos CORPOS (caixa fisica justa, sem a camera da mao) para o teste de sobreposicao entre personagens
export const projetarCorposEmProg = (plano: Plano, prog: number): Record<string, Retangulo> => {
  const r = resolverPlano(plano);
  const alvo = new THREE.Vector3(...r.alvo);
  posicionar(alvo, r.d * (1 - (plano.orbita?.push ?? PUSH_IN) * prog), plano.az + (plano.orbita?.az ?? AZ_ORBITA) * prog, plano.el);
  const out: Record<string, Retangulo> = {};
  for (const id of plano.lista.filter((x) => r.removidos.indexOf(x) < 0 && EH_PERSONAGEM.test(x))) out[id] = projetarPontos(cantosCaixa(corpoDe(id)));
  return out;
};
// projecao das caixas "sensiveis" e do conjunto em um prog (usado pelo log)
export const sensiveisProjetados = (plano: Plano, prog: number): { nome: string; r: Retangulo }[] => {
  const r = resolverPlano(plano);
  const lista = plano.lista.filter((x) => r.removidos.indexOf(x) < 0);
  const alvo = new THREE.Vector3(...r.alvo);
  posicionar(alvo, r.d * (1 - PUSH_IN * prog), plano.az + AZ_ORBITA * prog, plano.el);
  return sensiveis(lista).map((x) => ({ nome: x.nome, r: projetarPontos(cantosCaixa(x.c)) }));
};

// ---------- planos por segmento ----------
export type Ref = { ref: "ini" | "chegada" | "queda" | "toque" | "cena" | "ev"; nome?: string; desl?: number };
export type EtapaPlano = { quando: Ref; plano: Plano; trans?: number }; // trans: segundos
const R = (ref: Ref["ref"], nome?: string, desl = 0): Ref => ({ ref, nome, desl });

const AZ_REP = (n: number) => (n >= 6 && n <= 10 ? -30 : 30); // caminhada: o fotografo anda em direcao a camera
// close e cena: camera a direita (az +30) em todas as casas; o layout das casas (peca no fundo a direita, personagens a esquerda) foi feito para isso
const AZ_VISTA = 15; // az 15 (minimo do prompt): afasta na tela o que esta a esquerda do que esta a direita
const EL = 38;

// quem esta em cena em cada casa
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
  if (n === 13) e.push("balao13"); // o balao "voce fotografa o meu casamento?" tem que aparecer inteiro
  return e;
};
const sid = (n: number) => `s${String(n).padStart(2, "0")}`;

export const planoCaminhada = (n: number): Plano => ({
  id: `${sid(n)}-caminhada`, tipo: "caminhada", az: AZ_REP(n), el: EL, lista: [`fot${n}`], principal: `fot${n}`, alturaPx: ALT_CAMINHADA, casa: n, livreV: true, janela: JANELA_V,
  seguir: n >= 2 ? { de: `fot${n - 1}`, para: `fot${n}` } : undefined,
});

const baseClose = (n: number): Plano => {
  const madr = n === 13;
  const principal = madr ? "madrinha13" : `peca${n}`;
  return {
    id: `${sid(n)}-close`, tipo: "close", az: AZ_VISTA, el: EL, casa: n, principal,
    lista: madr ? [principal, "balao13"] : n === 12 ? [principal] : [principal, `plaq${n}`], // s13: a madrinha e o balao dela, inteiros
    larguraPx: madr ? undefined : LARG_CLOSE, alturaPx: madr ? 0.4 * ALTURA_TELA : undefined, livreV: !madr, janela: JANELA_V,
  };
};
// close da peca: a lista e so a peca e a plaquinha. Se um personagem cobrir mais de 15% da peca, ou aparecer cortado na tela,
// gira o azimute em passos de 10 graus (ate 30) e fica com o de menor intrusao de personagens no quadro.
export const logAzClose: Record<number, string> = {};
export const planoClose = (n: number): Plano => {
  const base = baseClose(n);
  if (n >= 12) return base;
  const ocl = (n === 2 ? ["fot2"] : personagensDe(n)).map((id) => corpoDe(id)); // s02: os amigos so entram depois do close do album
  let melhor: { p: Plano; k: number; vis: number; intr: number; score: number } | null = null;
  for (const k of [0, 10, -10, 20, -20, 30, -30, 40, -40, 50, -50, 60, -60]) {
    const p = { ...base, az: base.az + k };
    const r = resolverPlano(p);
    const vis = Math.min(...PROGS.map((pr) => fracVisivel(caixaDe(`peca${n}`), ocl, new THREE.Vector3(...poseResolvida(p, pr).pos))));
    const alvo = new THREE.Vector3(...r.alvo);
    let intr = 0;
    for (const pr of PROGS) {
      posicionar(alvo, r.d * (1 - PUSH_IN * pr), p.az + AZ_ORBITA * pr, p.el);
      for (const id of personagensDe(n)) {
        const q = projetarPontos(cantosCaixa(corpoDe(id)));
        const w = Math.max(0, Math.min(q.xmax, LARGURA_TELA) - Math.max(q.xmin, 0));
        const h = Math.max(0, Math.min(q.ymax, ALTURA_TELA) - Math.max(q.ymin, 0));
        intr += (w * h) / (LARGURA_TELA * ALTURA_TELA) / PROGS.length;
      }
    }
    const larg = r.principal ? r.principal.xmax - r.principal.xmin : 0;
    const okTam = larg >= LARG_CLOSE * (1 - TOL_CLOSE) - 1;
    if (vis < 0.85 || !okTam) continue;
    const score = intr * 1000 + Math.abs(k);
    if (!melhor || score < melhor.score) melhor = { p, k, vis, intr, score };
  }
  if (!melhor) {
    logAzClose[n] = "nenhum azimute liberou 85% da peca com o tamanho minimo";
    return base;
  }
  logAzClose[n] = `az ${melhor.p.az.toFixed(1)} (giro ${melhor.k}), peca visivel ${(melhor.vis * 100).toFixed(0)}%, personagens ocupam ${(melhor.intr * 100).toFixed(1)}% do quadro`;
  return melhor.p;
};

export const planoCena = (n: number): Plano => ({
  id: `${sid(n)}-cena`, tipo: "cena", az: AZ_VISTA, el: EL, casa: n, janela: JANELA_CENA, livreV: true,
  principal: `fot${n}`, alturaPx: ALT_CENA * 1.07, // o fotografo mede 50% da altura da tela; peca e personagens entram pela largura; placa tem plano proprio
  lista: [...personagensDe(n), ...extrasDe(n), ...(n === 12 ? [] : [`peca${n}`])], // s12: o balao tem plano proprio (a caixa dele cobre a noiva e alarga o quadro)
});
// plano da placa de foto: a moldura ocupa 70% da largura (nos momentos em que a foto muda)
export const planoPlaca = (n: number, sufixo: string): Plano => ({
  id: `${sid(n)}-placa${sufixo}`, tipo: "close", az: AZ_VISTA, el: EL, casa: n, lista: [`tela${n}`], principal: `tela${n}`, larguraPx: LARG_CLOSE, livreV: true, janela: JANELA_V,
});
export const planoDetalhe = (n: number): Plano => ({
  id: `${sid(n)}-detalhe`, tipo: "detalhe", az: 24, el: 30, lista: [`maoCam${n}`], principal: `maoCam${n}`, larguraPx: n === 8 ? 0.7 * LARGURA_TELA : LARG_DETALHE, // s08: os dois cartoes ficam grandes janela: JANELA_V, livreV: true, casa: n,
});
export const PLANO_ABERTURA: Plano = { id: "s00-abertura", tipo: "close", az: 22, el: 28, lista: ["fot1"], principal: "fot1", alturaPx: ALT_ABERTURA, janela: JANELA_ABERTURA, livreV: true, casa: 1, orbita: { az: 45, push: 0.1 } };
export const PLANO_TABULEIRO: Plano = { id: "s00-tabuleiro", tipo: "aberto", az: 22, el: 52, lista: ["tabuleiro"], janela: JANELA_TOTAL, orbita: { az: 20, push: 0.06 } };
export const PLANO_PRONTO: Plano = { id: "s13-pronto", tipo: "aberto", az: 22, el: 56, lista: ["tabuleiro", "seta"], janela: JANELA_TOTAL, orbita: { az: 25, push: 0.08 } };
export const PLANO_FINAL: Plano = { id: "s14-final", tipo: "aberto", az: 22, el: 56, lista: ["tabuleiro"], janela: JANELA_FINAL, orbita: { az: 40, push: 0.14 } };
// s02, os tres cliques: fotografo a esquerda virado para os amigos, amigos virados para ele, camera a esquerda vendo os dois em 3/4
export const PLANO_CLIQUE: Plano = { id: "s02-clique", tipo: "cena", az: 0, el: 30, lista: ["fot2", "amigoA2", "amigoB2"], principal: "fot2", alturaPx: ALT_CENA, janela: JANELA_CENA, livreV: true, casa: 2 };
// corte de reacao (ritmo): o fotografo mais perto, no meio dos planos cena longos
export const planoReacao = (n: number): Plano => ({
  id: `${sid(n)}-reacao`, tipo: "close", az: 25, el: 32, lista: [`fot${n}`], principal: `fot${n}`, alturaPx: 0.62 * ALTURA_TELA, livreV: true, janela: JANELA_V, casa: n,
});
export const PLANO_VOO: Plano = { id: "s12-voo", tipo: "close", az: 30, el: EL, lista: ["peca3", "plaq3"], principal: "peca3", larguraPx: LARG_CLOSE, janela: JANELA_V, livreV: true, casa: 3 };

export const ETAPAS_SEG: EtapaPlano[][] = (() => {
  const out: EtapaPlano[][] = [];
  out.push([
    { quando: R("ini"), plano: PLANO_ABERTURA },
    { quando: R("ev", "solucao", 0), plano: PLANO_TABULEIRO, trans: 1.4 },
  ]);
  for (let n = 1; n <= 13; n++) {
    const e: EtapaPlano[] = [];
    // caminhada (e fotografo parado nela) ate a peca comecar a cair
    e.push({ quando: R("ini"), plano: planoCaminhada(n), trans: n === 1 ? 0.6 : 0.4 });
    // o close so comeca quando a peca comeca a cair (s13: quando a madrinha chega)
    e.push({ quando: R(n === 13 ? "toque" : "queda"), plano: planoClose(n), trans: 0.35 });
    e.push({ quando: R("cena"), plano: planoCena(n), trans: 0.5 });
    if (n === 7 || n === 8 || n === 9) {
      e.push({ quando: R("ev", "solucao", -0.1), plano: planoDetalhe(n), trans: 0.3 });
      if (n === 7) e.push({ quando: R("ev", "solucao", 1.1), plano: { ...planoClose(7), id: "s07-lente" }, trans: 0.3 }); // a lente gigante inteira, sem ninguem na frente
      e.push({ quando: R("ev", "solucao", n === 7 ? 2.4 : 1.1), plano: planoPlaca(n, ""), trans: 0.3 });
      e.push({ quando: R("ev", "solucao", n === 7 ? 3.8 : 2.5), plano: planoCena(n), trans: 0.4 });
    }
    if (n === 7 || n === 9) e.push({ quando: R("chegada", undefined, 1.0), plano: planoCena(n), trans: 0.5 }); // a peca so cai na ancora: antes disso mostra a cena (portal, casal), nao o fotografo parado
    // a placa de foto tem corte proprio quando a foto muda (s01: clique e manual; s08: foto corrompida)
    if (n === 1) {
      e.push({ quando: R("ev", "problema", 0.3), plano: planoPlaca(1, "a"), trans: 0.3 });
      e.push({ quando: R("ev", "problema", 1.4), plano: planoCena(1), trans: 0.4 });
      e.push({ quando: R("ev", "solucao", 0.1), plano: planoPlaca(1, "b"), trans: 0.3 });
      e.push({ quando: R("ev", "solucao", 1.4), plano: planoCena(1), trans: 0.4 });
    }
    if (n === 8) { // cartao corrompe: primeiro na camera da mao (cartao vermelho), depois na placa
      e.push({ quando: R("ev", "problema", -0.1), plano: planoDetalhe(8), trans: 0.3 });
      e.push({ quando: R("ev", "problema", 1.1), plano: planoPlaca(8, "a"), trans: 0.3 });
      e.push({ quando: R("ev", "problema", 2.3), plano: planoCena(8), trans: 0.4 });
    }
    if (n === 2) {
      e.push({ quando: R("ev", "amigos", -0.3), plano: PLANO_CLIQUE, trans: 0.4 });
      e.push({ quando: R("ev", "solucao", -0.1), plano: planoClose(2), trans: 0.35 }); // o album abre
      e.push({ quando: R("ev", "solucao", 1.8), plano: planoCena(2), trans: 0.4 });
    }
    if (n === 7) { // foto escura na placa (antes da troca da lente)
      e.push({ quando: R("ev", "problema", 0.3), plano: planoPlaca(7, "a"), trans: 0.3 });
      e.push({ quando: R("ev", "problema", 1.5), plano: planoCena(7), trans: 0.4 });
    }
    if (n === 9) { // foto granulada na placa
      e.push({ quando: R("ev", "segunda", 0.1), plano: planoPlaca(9, "a"), trans: 0.3 });
      e.push({ quando: R("ev", "segunda", 1.3), plano: planoCena(9), trans: 0.4 });
    }
    if (n === 12) {
      e.push({ quando: R("ev", "depoimento", -0.2), plano: { ...planoClose(12), id: "s12-balao" }, trans: 0.4 }); // estrelas acendendo
      e.push({ quando: R("ev", "solucao", 0), plano: PLANO_VOO, trans: 1.2 });
    }
    if (n === 13) {
      e.push({ quando: R("toque", undefined, 1.3), plano: planoCena(13), trans: 0.5 }); // balao da madrinha legivel
      e.push({ quando: R("ev", "solucao", 0), plano: PLANO_PRONTO, trans: 1.0 });
    }
    out.push(e);
  }
  out.push([{ quando: R("ev", "problema", 0), plano: PLANO_FINAL, trans: 1.6 }]);
  return out;
})();

export const TODOS_PLANOS: Plano[] = (() => {
  const vistos = new Map<string, Plano>();
  ETAPAS_SEG.forEach((l) => l.forEach((e) => vistos.set(e.plano.id, e.plano)));
  for (let n = 1; n <= 13; n++) vistos.set(planoReacao(n).id, planoReacao(n));
  return [...vistos.values()];
})();
export const PLANOS_RESOLVIDOS: Resolvido[] = TODOS_PLANOS.map(resolverPlano);
