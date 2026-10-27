// Teste do alinhamento: usa as palavras do tempos.json com ruido (erros de transcricao) e confere os inicios.
import fs from 'node:fs';
import {alinhar} from './gerar-tempos.mjs';
const t = JSON.parse(fs.readFileSync(new URL('../src/dados/tempos.json', import.meta.url)));
const ruido = t.palavras.map((p, i) => {
  let texto = p.texto;
  if (i % 7 === 3) texto = 'xxx';            // palavra errada
  if (texto === 'treze') texto = '13';         // numeral
  if (texto === 'trinta') texto = '30';
  if (texto === 'vinte') texto = '20';
  if (texto === 'cinquenta') texto = '50';
  return {...p, texto};
});
const seg = alinhar(ruido, t.duracaoAudio, 'whisper');
let erros = 0;
seg.forEach((s, i) => {
  const d = Math.abs(s.inicio - t.segmentos[i].inicio);
  if (d > 0.01) { erros++; console.log('ERRO inicio', s.id, s.inicio, t.segmentos[i].inicio); }
});
console.log(erros ? `${erros} erros` : 'ok: 15 inicios alinhados com ruido', seg.map((s) => Object.entries(s._origem).map(([k, v]) => v[0]).join('')).join(' '));
