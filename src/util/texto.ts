import type React from "react";
import { fitText } from "@remotion/layout-utils";

export const MONTSERRAT = "Montserrat, sans-serif";
// texto centralizado dentro da area segura do Reels (x entre 60 e 960): 840 px de largura, centrado em 540
export const LARGURA_SEGURA = 840;
export const MONO = "'JetBrains Mono', monospace";

const memo = new Map<string, number>();
// maior tamanho de fonte (ate `max`) em que o texto cabe em `larg` px
// `borda` = contorno do texto em px; a medicao do canvas nao conta contorno nem inclinacao do italico, entao sobra margem
export const tamanhoQueCabe = (texto: string, max: number, larg: number, peso: number, italico = false, borda = 0): number => {
  const chave = `${texto}|${max}|${larg}|${peso}|${italico}|${borda}`;
  if (!memo.has(chave)) {
    const { fontSize } = fitText({
      text: texto,
      withinWidth: larg * (italico ? 0.9 : 0.95) - borda * 2,
      fontFamily: "Montserrat",
      fontWeight: peso,
      additionalStyles: italico ? { fontStyle: "italic" } : undefined,
    });
    memo.set(chave, Math.min(max, Math.floor(fontSize)));
  }
  return memo.get(chave)!;
};

export const contorno = (px: number, cor: string): React.CSSProperties => ({
  WebkitTextStroke: `${px}px ${cor}`,
  paintOrder: "stroke fill",
});
