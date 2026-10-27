// Log do enquadramento automatico: d calculado, caixa projetada por plano, regra de tamanho minimo e extremos da orbita.
// Rodar: npx esbuild scripts/verificar-enquadramento.ts --bundle --platform=node --format=esm --external:three --outfile=out/enq.mjs && node out/enq.mjs
import { PLANOS_RESOLVIDOS, AZ_ORBITA, FRAC_ALTURA_MIN_PERSONAGEM, projetarEmProg, Resolvido } from "../src/cena/enquadramento";

const n0 = (n: number) => n.toFixed(0).padStart(5);
const R = (r: { xmin: number; xmax: number; ymin: number; ymax: number }) => `x ${n0(r.xmin)}..${n0(r.xmax)}  y ${n0(r.ymin)}..${n0(r.ymax)}`;
let falhou = false;
const cortes: string[] = [];
console.log("plano            tipo      el  az   d (m)  limite   caixa projetada (px)");
for (const r of PLANOS_RESOLVIDOS as Resolvido[]) {
  const p = r.plano;
  console.log(`${p.id.padEnd(16)} ${p.tipo.padEnd(9)} ${String(p.el).padStart(3)} ${String(p.az).padStart(4)} ${r.d.toFixed(2).padStart(7)}  ${r.limite.padEnd(8)} uniao ${R(r.uniao)}  (janela x ${r.janela.x0}..${r.janela.x1}, y ${r.janela.y0}..${r.janela.y1})`);
  if (r.principal) {
    const w = r.principal.xmax - r.principal.xmin;
    const h = r.principal.ymax - r.principal.ymin;
    console.log(`${"".padEnd(16)} principal ${p.principal}: ${R(r.principal)}  largura ${w.toFixed(0)} px = ${((w / 1080) * 100).toFixed(0)}% da tela, altura ${h.toFixed(0)} px${r.limite === "altura" ? " (limitada pela altura da janela)" : ""}`);
  }
  if (r.alturaMaxPersonagem > 0) {
    const jan = r.janela.y1 - r.janela.y0;
    const pct = (r.alturaMaxPersonagem / jan) * 100;
    const ok = r.alturaMaxPersonagem >= FRAC_ALTURA_MIN_PERSONAGEM * jan - 0.5;
    console.log(`${"".padEnd(16)} personagem mais alto: ${r.alturaMaxPersonagem.toFixed(0)} px = ${pct.toFixed(0)}% da janela (minimo ${FRAC_ALTURA_MIN_PERSONAGEM * 100}%) ${ok ? "ok" : "ABAIXO"}`);
    if (p.tipo === "cena" && !ok) {
      falhou = true;
      console.log(`   FALHA: ${p.id} abaixo do tamanho minimo`);
    }
  }
  if (r.removidos.length) {
    const msg = `${p.id}: regra de tamanho minimo tirou da lista: ${r.removidos.join(", ")}`;
    cortes.push(msg);
    console.log(`${"".padEnd(16)} REGRA DE TAMANHO MINIMO: ${msg}`);
  }
  const extremos: string[] = [];
  for (const prog of [0, 0.5, 1]) {
    const caixas = projetarEmProg(p, prog);
    for (const [id, c] of Object.entries(caixas)) {
      const j = r.janela;
      if (c.xmin < j.x0 - 1 || c.xmax > j.x1 + 1 || c.ymin < j.y0 - 1 || c.ymax > j.y1 + 1) extremos.push(`${id} (prog ${prog})`);
    }
  }
  const fora = r.fora.filter((x) => x.indexOf("largura") < 0);
  if (fora.length || extremos.length || p.el < 28 || p.el > 38) {
    falhou = true;
    console.log(`   FALHA em ${p.id}: fora da janela: ${[...fora, ...extremos].join(", ") || "-"}${p.el < 28 || p.el > 38 ? "; el fora de 28..38" : ""}`);
  }
}
console.log(`\n${PLANOS_RESOLVIDOS.length} planos, ${falhou ? "COM FALHAS" : "todos dentro da janela util"}`);
console.log(cortes.length ? `Regra de tamanho minimo atuou em ${cortes.length} plano(s):\n${cortes.join("\n")}` : "Regra de tamanho minimo: nenhum item removido");
process.exit(falhou ? 1 : 0);
