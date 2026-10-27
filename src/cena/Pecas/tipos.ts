// Frames desde cada evento da peca (negativo = ainda nao aconteceu).
export type PecaProps = {
  f: number; // frame absoluto
  fp: number; // desde o efeito do problema
  fseg: number; // desde a segunda ancora (so s04)
  fs: number; // desde o efeito da solucao
  fq: number; // desde o toque na plataforma
  fp9?: number; // s08: frames desde o problema do s09 (contrato semitransparente)
  fs9?: number; // s08: frames desde a solucao do s09
};
export const prog = (f: number, dur: number) => Math.min(1, Math.max(0, f / dur));
