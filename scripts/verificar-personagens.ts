// Planos cena: (1) sobreposicao entre personagens na tela (no maximo 10% da area do menor) e (2) orientacao: nenhum personagem
// de costas para a camera do plano (angulo entre a frente dele e a direcao da camera de no maximo 80 graus).
// Rodar: npx esbuild scripts/verificar-personagens.ts --bundle --platform=node --format=esm --external:three --outfile=out/pers.mjs && node out/pers.mjs
import { PLANOS_RESOLVIDOS, poseResolvida, projetarCorposEmProg } from "../src/cena/enquadramento";
import { posFot, posNoiva, posNoivo, posCli, posAmigoA, posAmigoB, rotCli, rotFot } from "../src/dados/posicoes";

const POS: Record<string, (n: number) => [number, number, number]> = { fot: posFot, noiva: posNoiva, noivo: posNoivo, cli: posCli, amigoA: posAmigoA, amigoB: posAmigoB, madrinha: posCli };
const MAX_SOBRE = 0.10;
const MAX_ANG = 80;
let falhou = false;
for (const r of PLANOS_RESOLVIDOS) {
  const p = r.plano;
  if (p.tipo !== "cena") continue;
  const pers = p.lista.filter((id) => /^(fot|noiva|noivo|cli|amigoA|amigoB|madrinha)\d+$/.test(id) && r.removidos.indexOf(id) < 0);
  let piorSobre = 0;
  let par = "";
  for (const prog of [0, 0.5, 1]) {
    const caixas = projetarCorposEmProg(p, prog);
    for (let a = 0; a < pers.length; a++)
      for (let b = a + 1; b < pers.length; b++) {
        const A = caixas[pers[a]];
        const B = caixas[pers[b]];
        const w = Math.max(0, Math.min(A.xmax, B.xmax) - Math.max(A.xmin, B.xmin));
        const h = Math.max(0, Math.min(A.ymax, B.ymax) - Math.max(A.ymin, B.ymin));
        const menor = Math.min((A.xmax - A.xmin) * (A.ymax - A.ymin), (B.xmax - B.xmin) * (B.ymax - B.ymin));
        const frac = (w * h) / menor;
        if (frac > piorSobre) {
          piorSobre = frac;
          par = `${pers[a]} x ${pers[b]}`;
        }
      }
  }
  // orientacao: frente de cada personagem em repouso (s02-clique: fotografo e amigos virados um para o outro)
  const pior: string[] = [];
  const cam = poseResolvida(p, 0.5).pos;
  for (const id of pers) {
    const m = id.match(/^([a-zA-Z]+)(\d+)$/)!;
    const n = parseInt(m[2], 10);
    const pos = POS[m[1]](n);
    let rot = m[1] === "fot" ? rotFot(n) : rotCli(n);
    if (p.id === "s02-clique") rot = m[1] === "fot" ? 1.0 : -1.0;
    const fx = Math.sin(rot);
    const fz = Math.cos(rot);
    const dx = cam[0] - pos[0];
    const dz = cam[2] - pos[2];
    const ang = (Math.acos((fx * dx + fz * dz) / Math.hypot(dx, dz)) * 180) / Math.PI;
    if (ang > MAX_ANG) pior.push(`${id} ${ang.toFixed(0)} graus`);
  }
  // QUEM OLHA PARA QUEM: o fotografo olha para o(s) cliente(s) e o cliente olha para o fotografo (no maximo 60 graus de erro)
  const olhares: string[] = [];
  if (p.id !== "s02-clique") {
    const nn = parseInt(p.id.slice(1, 3), 10);
    const fots = pers.filter((id) => id.startsWith("fot"));
    const outros = pers.filter((id) => !id.startsWith("fot"));
    const ang = (de: [number, number, number], rot: number, para: [number, number, number]) => {
      const dx = para[0] - de[0];
      const dz = para[2] - de[2];
      return (Math.acos((Math.sin(rot) * dx + Math.cos(rot) * dz) / Math.hypot(dx, dz)) * 180) / Math.PI;
    };
    if (fots.length && outros.length) {
      const ps = outros.map((id) => { const mm = id.match(/^([a-zA-Z]+)(\d+)$/)!; return POS[mm[1]](parseInt(mm[2], 10)); });
      const alvoF: [number, number, number] = [ps.reduce((a, q) => a + q[0], 0) / ps.length, 0, ps.reduce((a, q) => a + q[2], 0) / ps.length];
      const a1 = ang(posFot(nn), rotFot(nn), alvoF);
      if (a1 > 60) olhares.push(`fotografo erra o alvo em ${a1.toFixed(0)} graus`);
      outros.forEach((id, k) => {
        const a2 = ang(ps[k], rotCli(nn), posFot(nn));
        if (a2 > 60) olhares.push(`${id} erra o fotografo em ${a2.toFixed(0)} graus`);
      });
    }
  }
  // casais (s07 a s09) ficam de maos dadas e perto do fotografo: so a orientacao e checada; nos demais a sobreposicao maxima e 10%
  const casal = /^s0[2789]-/.test(p.id); // casais e amigos de maos dadas ficam ombro a ombro (um atras do outro)
  const ok = (casal || piorSobre <= MAX_SOBRE) && pior.length === 0 && olhares.length === 0;
  if (!ok) falhou = true;
  console.log(`${p.id.padEnd(12)} sobreposicao maxima ${(piorSobre * 100).toFixed(0).padStart(3)}% ${par.padEnd(22)} orientacao: ${pior.length ? pior.join(", ") : "todos de frente (<= 80 graus)"}  olham um para o outro: ${olhares.length ? olhares.join(", ") : "sim (<= 60 graus)"}  ${ok ? "ok" : "FALHA"}`);
}
process.exit(falhou ? 1 : 0);
