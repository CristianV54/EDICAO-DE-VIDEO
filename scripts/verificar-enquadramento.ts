// Log do enquadramento: d, caixa projetada, MEDIDAS em px (personagem mais alto, largura do conjunto, principal), minimos
// obrigatorios por tipo de plano, legenda sobre cabecas/plaquinhas/placa, regra de tamanho minimo e extremos da orbita.
// Rodar: npx esbuild scripts/verificar-enquadramento.ts --bundle --platform=node --format=esm --external:three --outfile=out/enq.mjs && node out/enq.mjs
import {
  ALT_ABERTURA, ALT_CAMINHADA, ALT_CENA_MIN, BANDA_LEGENDA, LARG_CENA_MIN, LARG_CLOSE, LARG_DETALHE, PLANOS_RESOLVIDOS, TOL_CLOSE,
  Resolvido, logAzClose, projetarEmProg, sensiveisProjetados,
} from "../src/cena/enquadramento";

const n0 = (n: number) => n.toFixed(0).padStart(5);
const R = (r: { xmin: number; xmax: number; ymin: number; ymax: number }) => `x ${n0(r.xmin)}..${n0(r.xmax)}  y ${n0(r.ymin)}..${n0(r.ymax)}`;
let falhou = false;
const cortes: string[] = [];
const falhas: string[] = [];
const falha = (m: string) => {
  falhou = true;
  falhas.push(m);
  console.log(`   FALHA: ${m}`);
};
for (const r of PLANOS_RESOLVIDOS as Resolvido[]) {
  const p = r.plano;
  const jan = r.janela;
  const alt = r.principal ? r.principal.ymax - r.principal.ymin : 0;
  const larg = r.principal ? r.principal.xmax - r.principal.xmin : 0;
  console.log(`${p.id.padEnd(15)} ${p.tipo.padEnd(9)} el ${p.el} az ${String(p.az).padStart(5)}  d ${r.d.toFixed(2).padStart(6)} m  janela y ${jan.y0}..${jan.y1}  deslocY ${r.deslocY} px`);
  console.log(`${"".padEnd(15)} conjunto ${R(r.uniao)}  largura ${r.larguraConjunto.toFixed(0)} px (${((r.larguraConjunto / 1080) * 100).toFixed(0)}% da tela)  personagem mais alto ${r.alturaMaxPersonagem.toFixed(0)} px (${((r.alturaMaxPersonagem / 1920) * 100).toFixed(0)}% da tela)`);
  if (r.principal) console.log(`${"".padEnd(15)} principal ${p.principal}: ${R(r.principal)}  largura ${larg.toFixed(0)} px (${((larg / 1080) * 100).toFixed(0)}%)  altura ${alt.toFixed(0)} px (${((alt / 1920) * 100).toFixed(0)}%)`);
  console.log(`${"".padEnd(15)} legenda (y ${BANDA_LEGENDA.y0}..${BANDA_LEGENDA.y1}): ${r.legendaCobre.length ? "cobre " + r.legendaCobre.join(", ") : "nao cobre cabecas, plaquinhas nem placa de foto"}`);
  // minimos por tipo
  if (p.tipo === "caminhada" && alt < ALT_CAMINHADA - 3) falha(`${p.id}: fotografo ${alt.toFixed(0)} px < ${ALT_CAMINHADA.toFixed(0)} px (45% da tela)`);
  if (p.id === "s00-abertura" && alt < ALT_ABERTURA - 3) falha(`${p.id}: fotografo ${alt.toFixed(0)} px < ${ALT_ABERTURA.toFixed(0)} px (55% da tela)`);
  if (p.tipo === "close" && p.larguraPx) {
    const altJan = jan.y1 - jan.y0 - 60;
    const okLarg = larg >= p.larguraPx * (1 - TOL_CLOSE) - 1;
    const okAlt = alt >= altJan * 0.97; // peca alta e estreita: a altura da janela limita antes dos 55% de largura
    if (!okLarg && !okAlt) falha(`${p.id}: peca ${larg.toFixed(0)} px de largura < ${(LARG_CLOSE * (1 - TOL_CLOSE)).toFixed(0)} px e nao preenche a janela`);
    else if (!okLarg) console.log(`${"".padEnd(15)} AVISO: peca limitada pela altura da janela (largura ${larg.toFixed(0)} px = ${((larg / 1080) * 100).toFixed(0)}% < 55%), altura ${alt.toFixed(0)} px de ${altJan} px`);
  }
  if (p.tipo === "detalhe" && Math.abs(larg - LARG_DETALHE) > LARG_DETALHE * 0.05 + 1) falha(`${p.id}: camera na mao ${larg.toFixed(0)} px != ${LARG_DETALHE.toFixed(0)} px (45%)`);
  if (p.tipo === "cena") {
    const ok = r.larguraConjunto >= LARG_CENA_MIN - 1 || r.alturaMaxPersonagem >= ALT_CENA_MIN - 1;
    console.log(`${"".padEnd(15)} cena: conjunto ${r.larguraConjunto.toFixed(0)} px (min ${LARG_CENA_MIN.toFixed(0)}) OU personagem ${r.alturaMaxPersonagem.toFixed(0)} px (min ${ALT_CENA_MIN.toFixed(0)})  ${ok ? "ok" : "ABAIXO"}`);
    if (!ok) falha(`${p.id}: cena abaixo do minimo`);
  }
  if (r.removidos.length) {
    const msg = `${p.id}: regra de tamanho minimo tirou da lista: ${r.removidos.join(", ")}`;
    cortes.push(msg);
    console.log(`${"".padEnd(15)} REGRA DE TAMANHO MINIMO: ${msg}`);
  }
  // janela e extremos da orbita
  const extremos: string[] = [];
  for (const prog of [0, 0.5, 1]) {
    for (const [id, c] of Object.entries(projetarEmProg(p, prog))) {
      if (c.xmin < jan.x0 - 1 || c.xmax > jan.x1 + 1 || c.ymin < jan.y0 - 1 || c.ymax > jan.y1 + 1) extremos.push(`${id} (prog ${prog})`);
    }
    for (const s of sensiveisProjetados(p, prog)) {
      if (s.r.xmax > BANDA_LEGENDA.x0 && s.r.xmin < BANDA_LEGENDA.x1 && s.r.ymax > BANDA_LEGENDA.y0 && s.r.ymin < BANDA_LEGENDA.y1) extremos.push(`${s.nome} sob a legenda (prog ${prog})`);
    }
  }
  if (r.fora.length || extremos.length || (p.tipo !== "aberto" && (p.el < 28 || p.el > 38))) falha(`${p.id}: fora da janela/legenda: ${[...r.fora, ...extremos].join(", ") || "-"}${(p.tipo !== "aberto" && (p.el < 28 || p.el > 38)) ? "; el fora de 28..38" : ""}`);
}
console.log(`\nAzimute dos closes (giro em passos de 10 graus quando personagem cobre mais de 15% da peca):`);
Object.keys(logAzClose).forEach((k) => console.log(`  s${k.padStart(2, "0")}: ${logAzClose[Number(k)]}`));
console.log(`\n${PLANOS_RESOLVIDOS.length} planos, ${falhou ? `${falhas.length} FALHA(S)` : "todos dentro dos minimos"}`);
console.log(cortes.length ? `Regra de tamanho minimo atuou em ${cortes.length} plano(s):\n${cortes.join("\n")}` : "Regra de tamanho minimo: nenhum item removido");
process.exit(falhou ? 1 : 0);
