// Gera os stills de verificacao (secao 8): frames efetivos vindos do proprio projeto (calculateMetadata / MARCOS).
//   node scripts/gerar-stills.mjs                 -> todos
//   node scripts/gerar-stills.mjs s03 s05 final   -> so esses grupos
//   node scripts/gerar-stills.mjs --frame=teste:120 -> um frame avulso (nome:frame)
// Saida: verificacao/NOME.png (1080x1920)
import fs from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SAIDA = process.env.STILLS_DIR || path.join(RAIZ, 'verificacao');
const FPS = 30;
const args = process.argv.slice(2);
let lista = [];
const avulsos = args.filter((a) => a.startsWith('--frame='));
if (avulsos.length) {
  lista = avulsos.map((a) => {
    const [nome, fr] = a.slice(8).split(':');
    return {grupo: 'avulso', nome, frame: parseInt(fr, 10)};
  });
}

fs.mkdirSync(SAIDA, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(RAIZ, 'src/index.ts'), rootDir: RAIZ});
const browser = await openBrowser('chrome', {chromiumOptions: {gl: 'swangle'}});
const comp = await selectComposition({serveUrl, id: 'PecasFotografo', puppeteerInstance: browser});
// marcos: frames efetivos de cada segmento (a ancora so vale depois que a peca pousou)
const total = comp.durationInFrames;
const m = comp.props.marcos;
const f = (frame) => Math.min(total - 1, Math.max(0, Math.round(frame)));
const alvos = [];
m.slice(0, 15).forEach((s) => {
  alvos.push({grupo: s.id, nome: `${s.id}_a_momento`, frame: f((s.id === 's00' || s.id === 's14' ? s.ini + 1.5 * FPS : s.toque + 0.3 * FPS))});
  alvos.push({grupo: s.id, nome: `${s.id}_b_problema`, frame: f(s.prob + 0.3 * FPS)});
  alvos.push({grupo: s.id, nome: `${s.id}_c_solucao`, frame: f(s.sol + 0.3 * FPS)});
});
alvos.push({grupo: 'final', nome: 'final_a_para_1.8s', frame: f(m[14].prob + 1.8 * FPS)});
alvos.push({grupo: 'final', nome: 'final_b_comenta_0.5s', frame: f(m[14].sol + 0.5 * FPS)});
alvos.push({grupo: 'final', nome: 'final_c_ultimo_frame', frame: total - 1});
if (!avulsos.length && args.length) lista = alvos.filter((a) => args.includes(a.grupo));
else if (!avulsos.length) lista = alvos;
for (const a of lista) {
  const output = path.join(SAIDA, `${a.nome}.png`);
  await renderStill({composition: comp, serveUrl, output, frame: a.frame, puppeteerInstance: browser, imageFormat: 'png'});
  console.log(`${a.nome}  frame ${a.frame}  (${(a.frame / FPS).toFixed(2)} s)`);
}
await browser.close({silent: true});
process.exit(0);
