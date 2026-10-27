// Geometria pura dos personagens (sem react): usada pelo Personagem e pelo teste de interseccao da camera na mao.
// Eixos locais: y para cima, z para a frente do personagem, x positivo = lado esquerdo do personagem.
export type V3 = [number, number, number];

export const ALT = 1.7;
export const TRONCO = { c: [0, 0.87, 0] as V3, t: [0.5, 0.5, 0.24] as V3 }; // y de 0,62 a 1,12
export const OMBRO_X = 0.3;
export const OMBRO_Y = 1.04;
export const CABECA_Y = 1.47; // centro da cabeca cubica de 0,42
export const CAM_CORPO: V3 = [0.34, 0.24, 0.18]; // corpo da camera na mao
export const COMPR_BRACO = 0.26;

// centro da camera na mao: 0,22 a frente do peito e na altura do peito; levanta (0..1) leva ao rosto
export const centroCamera = (lev: number): V3 => [0, 0.95 + 0.4 * lev, 0.22 + 0.2 * lev];
export const maoNaCamera = (lado: 1 | -1, lev: number): V3 => {
  const c = centroCamera(lev);
  return [lado * 0.2, c[1] - 0.01, c[2]];
};
// alca: sai dos cantos de cima da camera e sobe ate a nuca, passando a frente do pescoco
export const alcaPontos = (lado: 1 | -1, lev: number): { de: V3; para: V3 } => {
  const c = centroCamera(lev);
  return { de: [lado * 0.13, c[1] + CAM_CORPO[1] / 2, c[2] - 0.02], para: [lado * 0.08, 1.17, 0.1] };
};

type Caixa = { c: V3; t: V3 };
export const caixaCamera = (lev: number): Caixa => ({ c: centroCamera(lev), t: CAM_CORPO });

const sobrepoe = (a: Caixa, b: Caixa, folga = 0): boolean => {
  for (let k = 0; k < 3; k++) {
    if (Math.abs(a.c[k] - b.c[k]) >= (a.t[k] + b.t[k]) / 2 - folga) return false;
  }
  return true;
};
// a camera na mao (corpo e alca) nao pode entrar na caixa do tronco
export const cameraAtravessaTronco = (lev: number): boolean => {
  if (sobrepoe(caixaCamera(lev), TRONCO)) return true;
  for (const lado of [1, -1] as const) {
    const { de, para } = alcaPontos(lado, lev);
    for (let k = 0; k <= 20; k++) {
      const p: V3 = [de[0] + ((para[0] - de[0]) * k) / 20, de[1] + ((para[1] - de[1]) * k) / 20, de[2] + ((para[2] - de[2]) * k) / 20];
      if (sobrepoe({ c: p, t: [0.01, 0.01, 0.01] }, TRONCO)) return true;
    }
  }
  return false;
};

// cotovelo por IA de dois segmentos: `polo` indica para onde o cotovelo aponta
export const cotovelo = (ombro: V3, mao: V3, polo: V3): V3 => {
  const d = [mao[0] - ombro[0], mao[1] - ombro[1], mao[2] - ombro[2]];
  let len = Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
  const max = 2 * COMPR_BRACO - 0.002;
  len = Math.max(0.05, Math.min(len, max));
  const u = [d[0] / (len || 1), d[1] / (len || 1), d[2] / (len || 1)];
  const x = len / 2;
  const h = Math.sqrt(Math.max(0, COMPR_BRACO * COMPR_BRACO - x * x));
  const pu = polo[0] * u[0] + polo[1] * u[1] + polo[2] * u[2];
  let q = [polo[0] - pu * u[0], polo[1] - pu * u[1], polo[2] - pu * u[2]];
  const ql = Math.sqrt(q[0] * q[0] + q[1] * q[1] + q[2] * q[2]) || 1;
  q = [q[0] / ql, q[1] / ql, q[2] / ql];
  return [ombro[0] + u[0] * x + q[0] * h, ombro[1] + u[1] * x + q[1] * h, ombro[2] + u[2] * x + q[2] * h];
};

// converte um ponto do mundo para o espaco local de um personagem (posicao + giro em Y)
export const mundoParaLocal = (pos: V3, rotY: number, p: V3): V3 => {
  const dx = p[0] - pos[0];
  const dy = p[1] - pos[1];
  const dz = p[2] - pos[2];
  const c = Math.cos(rotY);
  const s = Math.sin(rotY);
  return [dx * c - dz * s, dy, dx * s + dz * c];
};
export const localParaMundo = (pos: V3, rotY: number, p: V3): V3 => {
  const c = Math.cos(rotY);
  const s = Math.sin(rotY);
  return [pos[0] + p[0] * c + p[2] * s, pos[1] + p[1], pos[2] - p[0] * s + p[2] * c];
};
