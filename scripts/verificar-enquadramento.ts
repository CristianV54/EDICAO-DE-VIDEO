// Verifica o enquadramento automatico: imprime, por plano, a distancia d calculada e a caixa projetada
// (x min, x max, y min, y max) e falha se alguma caixa ficou fora da janela util.
// Rodar: npx esbuild scripts/verificar-enquadramento.ts --bundle --platform=node --format=esm --outfile=out/enq.mjs && node out/enq.mjs
import * as THREE from "three";
import { ETAPAS_SEG, PLANOS_RESOLVIDOS, projetarComAz, AZ_ORBITA, Resolvido, visibilidadeDe } from "../src/cena/enquadramento";

const f = (n: number) => n.toFixed(0).padStart(5);
const R = (r: { xmin: number; xmax: number; ymin: number; ymax: number }) => `x ${f(r.xmin)}..${f(r.xmax)}  y ${f(r.ymin)}..${f(r.ymax)}`;
let falhou = false;
console.log("plano            tipo      el  az   d (m)  limite     caixa projetada (px)");
for (const r of PLANOS_RESOLVIDOS) {
  const p = r.plano;
  console.log(`${p.id.padEnd(16)} ${p.tipo.padEnd(9)} ${String(p.el).padStart(3)} ${String(p.az).padStart(3)} ${r.d.toFixed(2).padStart(7)}  ${r.limite.padEnd(9)}  uniao ${R(r.uniao)}  (janela x ${r.janela.x0}..${r.janela.x1}, y ${r.janela.y0}..${r.janela.y1})`);
  if (r.principal) {
    const w = r.principal.xmax - r.principal.xmin;
    console.log(`${"".padEnd(16)} principal ${p.principal}: ${R(r.principal)}  largura ${w.toFixed(0)} px = ${((w / 1080) * 100).toFixed(0)}% da tela${r.limite === "altura" ? " (limitada pela altura da janela)" : ""}`);
  }
  // extremos da orbita (az -2 e +2): tem que continuar dentro da janela
  const extremos: string[] = [];
  for (const dz of [-AZ_ORBITA / 2, AZ_ORBITA / 2]) {
    const caixas = projetarComAz(p, dz);
    for (const [id, c] of Object.entries(caixas)) {
      const j = r.janela;
      if (c.xmin < j.x0 - 1 || c.xmax > j.x1 + 1 || c.ymin < j.y0 - 1 || c.ymax > j.y1 + 1) extremos.push(`${id} (az ${dz > 0 ? "+" : ""}${dz})`);
    }
  }
  if (p.visiveis) {
    const vis = visibilidadeDe(p, new THREE.Vector3(...r.pos));
    console.log(`${"".padEnd(16)} visibilidade de ${p.visiveis.map((v) => v.id).join(" e ")} (sem oclusor na frente): ${(vis * 100).toFixed(0)}%  az escolhido ${p.az}`);
    if (vis < 0.99) extremos.push(`item escondido (${(vis * 100).toFixed(0)}% visivel)`);
  }
  if (r.fora.length || extremos.length || p.el < 25 || p.el > 40) {
    falhou = true;
    console.log(`   FALHA em ${p.id}: fora da janela: ${[...r.fora, ...extremos].join(", ") || "-"}${p.el < 25 || p.el > 40 ? "; el fora de 25..40" : ""}`);
  }
}
const n = ETAPAS_SEG.reduce((a, e) => a + e.length, 0);
console.log(`\n${n} planos, ${falhou ? "COM FALHAS" : "todos dentro da janela util"}`);
void ({} as Resolvido);
process.exit(falhou ? 1 : 0);
