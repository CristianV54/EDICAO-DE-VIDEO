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
