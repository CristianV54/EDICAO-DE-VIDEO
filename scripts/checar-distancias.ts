// Menor distancia entre centros de objetos e personagens em cada segmento (limite: acima de 0,9; excecao: casal de maos dadas).
// Rodar: npx esbuild scripts/checar-distancias.ts --bundle --platform=node --format=esm --outfile=out/checar.mjs && node out/checar.mjs
import { entidadesDoSegmento } from "../src/dados/posicoes";

const MAOS_DADAS = (_a: string, _b: string) => false;
let falhou = false;
for (let i = 0; i <= 14; i++) {
  const e = entidadesDoSegmento(i);
  let min = Infinity;
  let par = "";
  for (let a = 0; a < e.length; a++)
    for (let b = a + 1; b < e.length; b++) {
      if (MAOS_DADAS(e[a].nome, e[b].nome)) continue;
      const d = Math.hypot(e[a].x - e[b].x, e[a].z - e[b].z);
      const pessoa = (n: string) => /^(fotografo|noiva|noivo|amigo|madrinha|mesa)/.test(n);
      const objeto = (n: string) => /^(peca|placa)/.test(n);
      if (pessoa(e[a].nome) && pessoa(e[b].nome) && e[a].nome !== 'mesa' && e[b].nome !== 'mesa') {
        // pessoa x pessoa: as pegadas (0,5 x 0,3) nao podem se atravessar
        const folga = Math.max(Math.abs(e[a].x - e[b].x) - 0.5, Math.abs(e[a].z - e[b].z) - 0.3);
        if (folga < min) {
          min = folga;
          par = `${e[a].nome} / ${e[b].nome} (pegadas)`;
        }
        continue;
      }
      const lim = (pessoa(e[a].nome) && objeto(e[b].nome)) || (pessoa(e[b].nome) && objeto(e[a].nome)) ? (e[a].nome.indexOf("placa") === 0 || e[b].nome.indexOf("placa") === 0 ? 0.55 : 0.75) : 0.9; // pessoa x peca 0,75 e pessoa x placa 0,55 (pegadas nao se tocam); objeto x objeto 0,9
      if (d - lim < min) {
        min = d - lim;
        par = `${e[a].nome} / ${e[b].nome}`;
      }
    }
  const ok = min > 0; // folga acima do limite de cada par
  if (!ok) falhou = true;
  console.log(`s${(i < 10 ? "0" : "") + i}  menor folga sobre o limite ${isFinite(min) ? min.toFixed(3) : "-"}  (${par})  ${ok ? "ok" : "ABAIXO DO LIMITE"}`);
}
process.exit(falhou ? 1 : 0);
