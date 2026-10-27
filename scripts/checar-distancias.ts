// Menor distancia entre centros de objetos e personagens em cada segmento (minimo exigido: 1,2).
// Rodar: npx esbuild scripts/checar-distancias.ts --bundle --platform=node --format=esm --outfile=out/checar.mjs && node out/checar.mjs
import { entidadesDoSegmento } from "../src/dados/posicoes";

let falhou = false;
for (let i = 0; i <= 14; i++) {
  const e = entidadesDoSegmento(i);
  let min = Infinity;
  let par = "";
  for (let a = 0; a < e.length; a++)
    for (let b = a + 1; b < e.length; b++) {
      const d = Math.hypot(e[a].x - e[b].x, e[a].z - e[b].z);
      if (d < min) {
        min = d;
        par = `${e[a].nome} / ${e[b].nome}`;
      }
    }
  const ok = min >= 1.2;
  if (!ok) falhou = true;
  console.log(`s${(i < 10 ? "0" : "") + i}  menor distancia ${isFinite(min) ? min.toFixed(2) : "-"}  (${par})  ${ok ? "ok" : "ABAIXO DE 1,2"}`);
}
process.exit(falhou ? 1 : 0);
