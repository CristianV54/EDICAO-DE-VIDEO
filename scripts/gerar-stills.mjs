// Gera os stills de verificacao da V3 (secao 8 do prompt): frames efetivos vindos do proprio projeto (MARCOS).
//   node scripts/gerar-stills.mjs                  -> todos
//   node scripts/gerar-stills.mjs s03 s05 final    -> so esses grupos
//   node scripts/gerar-stills.mjs --frame=teste:120 -> um frame avulso (nome:frame)
// Por segmento s01 a s13: a_caminhada (meio da caminhada), b_close (chegada + 0,4 s), c_problema (+0,4 s), d_solucao (+0,4 s);
// s07, s08 e s09 ainda ganham e_corte (corte de detalhe da camera na mao) e f_cena (plano cena depois do corte).
// Saida: verificacao/NOME.png (1080x1920)
import fs from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SAIDA = process.env.STILLS_DIR || path.join(RAIZ, 'verificacao');
const FPS = 30;
const WALK = 27;
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
const total = comp.durationInFrames;
const m = comp.props.marcos;
const f = (frame) => Math.min(total - 1, Math.max(0, Math.round(frame)));
const alvos = [];
// s00: abertura em close, etiqueta, abre para o tabuleiro
{
  const s = m[0];
  alvos.push({grupo: 's00', nome: 's00_a_abertura', frame: f(s.ini + 0.5 * FPS)});
  alvos.push({grupo: 's00', nome: 's00_b_problema', frame: f(s.prob + 0.4 * FPS)});
  alvos.push({grupo: 's00', nome: 's00_c_tabuleiro', frame: f(s.sol + 1.6 * FPS)});
}
m.slice(1, 14).forEach((s) => {
  const n = parseInt(s.id.slice(1), 10);
  alvos.push({grupo: s.id, nome: `${s.id}_a_caminhada`, frame: f(n === 1 ? s.ini + 0.9 * FPS : s.ini + WALK / 2)});
  // o close so comeca quando a peca comeca a cair; a peca pousa em toque
  alvos.push({grupo: s.id, nome: `${s.id}_b_close`, frame: f(s.toque + 0.4 * FPS)});
  alvos.push({grupo: s.id, nome: `${s.id}_c_problema`, frame: f(s.prob + 0.4 * FPS)});
  alvos.push({grupo: s.id, nome: `${s.id}_d_solucao`, frame: f(s.sol + 0.4 * FPS)});
  if (n === 7 || n === 8 || n === 9) {
    alvos.push({grupo: s.id, nome: `${s.id}_e_corte`, frame: f(s.sol + 0.7 * FPS)});
    alvos.push({grupo: s.id, nome: `${s.id}_f_cena`, frame: f(s.sol + 1.7 * FPS)});
  }
  if (n === 1) {
    alvos.push({grupo: s.id, nome: `${s.id}_e_placa_auto`, frame: f(s.prob + 0.8 * FPS)});
    alvos.push({grupo: s.id, nome: `${s.id}_f_placa_manual`, frame: f(s.sol + 0.5 * FPS)});
  }
  if (n === 10) alvos.push({grupo: s.id, nome: `${s.id}_e_tres_copias`, frame: f(s.sol + 1.2 * FPS)});
  if (n === 7) alvos.push({grupo: s.id, nome: `${s.id}_g_lente_inteira`, frame: f(s.sol + 1.7 * FPS)});
  if (n === 12) alvos.push({grupo: s.id, nome: `${s.id}_e_voo`, frame: f(s.sol + 0.6 * FPS)});
  if (n === 13) alvos.push({grupo: s.id, nome: `${s.id}_e_pronto`, frame: f(s.sol + 1.5 * FPS)});
});
// card saindo (s01, s05, s09, s13)
for (const id of ['s01', 's05', 's09', 's13']) {
  const s = m.find((x) => x.id === id);
  alvos.push({grupo: 'card', nome: `card_${id}_a_saindo`, frame: f(s.cardFim - 3)});
  alvos.push({grupo: 'card', nome: `card_${id}_b_saiu`, frame: f(s.cardFim)});
}
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
