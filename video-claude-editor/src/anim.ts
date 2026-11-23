import {Easing, interpolate, spring} from 'remotion';

export const FPS = 30;
export type V3 = [number, number, number];

// 0 a 1 entre dois quadros, com suavização.
export const rampa = (frame: number, de: number, ate: number, suave: (n: number) => number = Easing.inOut(Easing.cubic)): number =>
  interpolate(frame, [de, ate], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: suave});

// Mola que começa em "inicio".
export const mola = (frame: number, inicio: number, cfg: {damping?: number; mass?: number; stiffness?: number} = {}): number =>
  spring({frame: frame - inicio, fps: FPS, config: {damping: 12, mass: 0.7, stiffness: 120, ...cfg}});

// Caminho de câmera ou de objeto: lista de quadros e de posições.
export const caminho = (frame: number, quadros: number[], pontos: V3[]): V3 =>
  [0, 1, 2].map((k) => interpolate(frame, quadros, pontos.map((p) => p[k]), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)})) as V3;

export const aleatorio = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// ---- Curvas por papel (do guia de ofício de motion) ----
export const power2Out = Easing.out(Easing.poly(2));
export const power3Out = Easing.out(Easing.poly(3));
export const power3In = Easing.in(Easing.poly(3));
export const power4In = Easing.in(Easing.poly(4));
export const power4InOut = Easing.inOut(Easing.poly(4));
export const expoOut = Easing.out(Easing.exp);

// Caminho suave por pontos-chave, sem a velocidade cair a zero em cada ponto
// (a câmera "truncada", que para e recomeça, é o que mais parece amador).
const hermite = (p1: number, p2: number, m1: number, m2: number, u: number) => {
  const u2 = u * u;
  const u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * p1 + (u3 - 2 * u2 + u) * m1 + (-2 * u3 + 3 * u2) * p2 + (u3 - u2) * m2;
};
export const trilho1 = (f: number, quadros: number[], valores: number[]): number => {
  const n = quadros.length;
  if (f <= quadros[0]) return valores[0];
  if (f >= quadros[n - 1]) return valores[n - 1];
  let i = 0;
  while (i < n - 2 && f >= quadros[i + 1]) i++;
  const t1 = quadros[i];
  const t2 = quadros[i + 1];
  const u = (f - t1) / (t2 - t1);
  const i0 = Math.max(0, i - 1);
  const i3 = Math.min(n - 1, i + 2);
  const m1 = i === 0 ? 0 : ((valores[i + 1] - valores[i0]) / (t2 - quadros[i0])) * (t2 - t1);
  const m2 = i + 1 === n - 1 ? 0 : ((valores[i3] - valores[i]) / (quadros[i3] - t1)) * (t2 - t1);
  return hermite(valores[i], valores[i + 1], m1, m2, u);
};
export const trilho = (f: number, quadros: number[], pontos: V3[]): V3 => [0, 1, 2].map((k) => trilho1(f, quadros, pontos.map((p) => p[k]))) as V3;

// Troca de cena com speed ramp: a saída acelera, o corte cai no quadro mais rápido,
// e a chegada vem na mesma direção e freia devagar.
export const saidaRampa = (f: number, duracao: number, n = 14): number => rampa(f, duracao - n, duracao, power4In);
export const chegadaRampa = (f: number, n = 30): number => 1 - rampa(f, 0, n, expoOut);
export const somar = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
