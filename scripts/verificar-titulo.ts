// Titulo amarelo: posicao escolhida por segmento e colisao com cabecas e peca durante os 1,4 s de exibicao.
// Rodar: npx esbuild scripts/verificar-titulo.ts --bundle --platform=node --format=esm --external:three --outfile=out/titulo.mjs && node out/titulo.mjs
import { ROTEIRO } from "../src/dados/roteiro";
import { LINHAS } from "../src/util/tempo";
import { dadosTitulo, obstaculos, Y_TITULO } from "../src/overlay/posTitulo";

import { dxTitulo, janelaTitulo, yTitulo as yT } from "../src/overlay/posTitulo";
let falhou = false;
for (let i = 1; i <= 13; i++) {
  const { h, w } = dadosTitulo(i);
  const j = janelaTitulo(i);
  const y = yT(i);
  const dx = dxTitulo(i);
  const batidas = new Set<string>();
  for (let f = j.ini; f <= j.fim + 2; f++)
    for (const o of obstaculos(f, i)) if (o.r.x1 > 540 + dx - w / 2 && o.r.x0 < 540 + dx + w / 2 && o.r.y1 > y - h / 2 && o.r.y0 < y + h / 2) batidas.add(o.nome);
  if (batidas.size) falhou = true;
  console.log(`s${(i < 10 ? "0" : "") + i} ${ROTEIRO[i].titulo?.padEnd(12)} frames ${j.ini}..${j.fim + 2} (${((j.fim - j.ini) / 30).toFixed(1)} s, ${((j.ini - LINHAS[i].ini) / 30).toFixed(1)} s apos o inicio)  y ${y.toFixed(0)}  desloc x ${dx}  caixa ${h.toFixed(0)}x${w.toFixed(0)}  colisoes: ${batidas.size ? [...batidas].join(", ") + "  FALHA" : "nenhuma"}`);
}
void Y_TITULO;
void LINHAS;
process.exit(falhou ? 1 : 0);
