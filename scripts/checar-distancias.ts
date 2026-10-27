// Menor distancia entre centros de objetos e personagens em cada segmento (limite: acima de 0,9; excecao: casal de maos dadas).
// Rodar: npx esbuild scripts/checar-distancias.ts --bundle --platform=node --format=esm --outfile=out/checar.mjs && node out/checar.mjs
import { entidadesDoSegmento } from "../src/dados/posicoes";

const MAOS_DADAS = (a: string, b: string) => (a === "amigo-a" && b === "amigo-b") || (a === "noiva" && b === "noivo");
let falhou = false;
for (let i = 0; i <= 14; i++) {
  const e = entidadesDoSegmento(i);
  let min = Infinity;
  let par = "";
  for (let a = 0; a < e.length; a++)
    for (let b = a + 1; b < e.length; b++) {
      if (MAOS_DADAS(e[a].nome, e[b].nome)) continue;
      const d = Math.hypot(e[a].x - e[b].x, e[a].z - e[b].z);
      if (d < min) {
        min = d;
        par = `${e[a].nome} / ${e[b].nome}`;
      }
    }
  const ok = min > 0.9;
  if (!ok) falhou = true;
  console.log(`s${(i < 10 ? "0" : "") + i}  menor distancia ${isFinite(min) ? min.toFixed(4) : "-"}  (${par})  ${ok ? "ok" : "NAO ESTA ACIMA DE 0,9"}`);
}
process.exit(falhou ? 1 : 0);
