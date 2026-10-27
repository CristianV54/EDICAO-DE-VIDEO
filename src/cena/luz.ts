// Intensidade global da luz da cena (multiplicador) e luzes de efeito, tudo em funcao do frame
import { LINHAS, clamp01, easeInOutCubic, lerp } from "../util/tempo";
import { EstrondoFlash } from "./Estacoes";

const r = (f: number, f0: number, d: number) => easeInOutCubic(clamp01((f - f0) / d));

// s07: cai para 55% e volta na troca da lente. s09: cai para 25% em "apagam", sobe para 75% no flash e volta a 100% no fim
export const luzGlobal = (f: number): number => {
  const L7 = LINHAS[7];
  const L9 = LINHAS[9];
  let k = 1;
  k = lerp(k, 0.55, r(f, L7.ini, 12));
  k = lerp(k, 1, r(f, L7.sol + 10, 14));
  k = lerp(k, 0.25, r(f, L9.ev.apagam, 15));
  k = lerp(k, 0.75, r(f, L9.sol, 6));
  k = lerp(k, 1, r(f, L9.fim - 12, 12));
  return k;
};

// luzes coloridas da pista (s09): giram em volta da casa 9, ligam em "apagam" e somem no fim do segmento
export const luzFesta = (f: number): number => r(f, LINHAS[9].ev.apagam, 10) * (1 - r(f, LINHAS[9].fim - 12, 12));
export const luzFlash = (f: number): number => EstrondoFlash(f) * 40;
export const luzFogo = (f: number): number => {
  const L = LINHAS[10];
  const d = f - L.prob;
  return d >= 0 && d < 80 && Math.floor(d / 4) % 2 === 0 ? 7 : 0;
};
