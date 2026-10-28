// Ordem dos eventos de cada segmento (problema < entao < queda < toque < solucao < nome < fim) e as folgas em segundos.
// Rodar: npx esbuild scripts/checar-tempos.ts --bundle --platform=node --format=esm --external:three --outfile=out/tempos.mjs && node out/tempos.mjs
import { LINHAS, FPS } from "../src/util/tempo";

const s = (n: number) => (n / FPS).toFixed(2).padStart(6);
let falhou = false;
console.log("seg  prob  entao toque   sol  nome   fim | toque->sol  sol->nome  nome->fim");
for (const L of LINHAS) {
  if (!L.temPeca) continue;
  const ordem = L.prob < L.entao && L.entao <= L.quedaIni && L.quedaIni < L.toque && L.toque < L.sol;
  const nomeOk = L.id === "s13" ? L.nome > L.toque && L.sol > L.nome : L.sol < L.nome;
  const folgaFim = L.fim - (L.id === "s13" ? L.sol : L.nome);
  const ok = ordem && nomeOk && folgaFim >= 30; // pelo menos 1 s depois do ultimo evento ate o fim do segmento
  if (!ok) falhou = true;
  console.log(`${L.id} ${s(L.prob)} ${s(L.entao)} ${s(L.toque)} ${s(L.sol)} ${s(L.nome)} ${s(L.fim)} | ${((L.sol - L.toque) / FPS).toFixed(2).padStart(6)}  ${((L.nome - L.sol) / FPS).toFixed(2).padStart(8)}  ${(folgaFim / FPS).toFixed(2).padStart(8)}  ${ok ? "ok" : "FALHA"}`);
}
process.exit(falhou ? 1 : 0);
