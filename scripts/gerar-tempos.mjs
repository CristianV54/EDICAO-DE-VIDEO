// Gera src/dados/tempos.json.
//  - Sem public/narracao.mp3: modo PROVISORIO (ritmo fixo, origem "provisorio").
//  - Com o mp3: ffprobe + whisper (whisper.cpp, depois faster-whisper via pip), origem "audio".
//    Se nenhum whisper funcionar, distribui por caracteres na duracao real (origem "audio-fallback").
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const MP3 = process.env.NARRACAO || path.join(RAIZ, 'public/narracao.mp3');
const SAIDA = process.env.TEMPOS_SAIDA || path.join(RAIZ, 'src/dados/tempos.json');
const SEGMENTOS = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/dados/segmentos.json'), 'utf8'));

const CHARS_POR_SEG = 15;
const PAUSA_PONTO = 0.35;
const PAUSA_VIRGULA = 0.15;
const PAUSA_INTERROGACAO = 0.25;
const r3 = (n) => Math.round(n * 1000) / 1000;

// ---------- normalizacao ----------
const EQUIV = {'3': 'tres', '13': 'treze', '20': 'vinte', '30': 'trinta', '50': 'cinquenta'};
export const norm = (s) => {
  const n = s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
  return EQUIV[n] ?? n;
};
// junta "back up" em "backup" e normaliza
export const normalizarLista = (textos) => {
  const out = [];
  for (let i = 0; i < textos.length; i++) {
    const a = norm(textos[i]);
    if (a === 'back' && i + 1 < textos.length && norm(textos[i + 1]) === 'up') {
      out.push('backup');
      i++;
    } else out.push(a);
  }
  return out;
};
const limparLegenda = (w) => w.replace(/[.,:;!?"“”()]/g, '');

// ---------- modo estimado (provisorio / fallback) ----------
function pausaDe(token) {
  if (/[?]$/.test(token)) return PAUSA_INTERROGACAO;
  if (/[.!]$/.test(token)) return PAUSA_PONTO;
  if (/[,:;]$/.test(token)) return PAUSA_VIRGULA;
  return 0;
}
// devolve segmentos com palavras relativas (inicio em 0) e duracao natural
function estimarSegmento(texto) {
  const tokens = texto.split(/\s+/).filter(Boolean);
  let t = 0;
  const palavras = [];
  for (const tk of tokens) {
    const limpo = limparLegenda(tk);
    const dur = limpo.length / CHARS_POR_SEG;
    palavras.push({texto: limpo, inicio: t, fim: t + dur});
    t += dur + pausaDe(tk);
  }
  return {palavras, duracao: t};
}

// ---------- ancoras ----------
function resolverAncoras(def, inicio, fim, palavrasSeg, origemPalavras) {
  const D = fim - inicio;
  const norms = normalizarLista(palavrasSeg.map((p) => p.texto));
  // normalizarLista pode fundir 2 palavras; para indices usamos lista alinhada
  const alinhadas = [];
  {
    let k = 0;
    for (let i = 0; i < palavrasSeg.length; i++) {
      const a = norm(palavrasSeg[i].texto);
      if (a === 'back' && i + 1 < palavrasSeg.length && norm(palavrasSeg[i + 1].texto) === 'up') {
        alinhadas.push({n: 'backup', p: palavrasSeg[i]});
        i++;
      } else alinhadas.push({n: a, p: palavrasSeg[i]});
      k++;
    }
  }
  void norms;
  const out = {};
  const origem = {};
  for (const nome of Object.keys(def)) {
    const d = def[nome];
    if (!d) continue;
    let t = null;
    if (d.palavra) {
      const minT = d.depois ? out[d.depois] : -Infinity;
      const alvo = norm(d.palavra);
      const hit = alinhadas.find((w) => w.n === alvo && w.p.inicio > minT + 1e-6 && w.p.inicio >= inicio - 1e-6);
      if (hit) {
        t = hit.p.inicio;
        origem[nome] = origemPalavras;
      }
    }
    if (t === null) {
      t = inicio + d.frac * D;
      origem[nome] = 'fracao';
    }
    out[nome] = r3(t);
  }
  return {ancoras: out, origem};
}

// ---------- alinhamento das palavras transcritas com o roteiro ----------
export function alinhar(palavras, duracaoAudio, origemPalavras) {
  const nomes = palavras.map((p) => p.texto);
  const nrm = normalizarLista(nomes);
  // normalizarLista pode encurtar; refaz lista fundida com tempos
  const fund = [];
  for (let i = 0; i < palavras.length; i++) {
    const a = norm(palavras[i].texto);
    if (a === 'back' && i + 1 < palavras.length && norm(palavras[i + 1].texto) === 'up') {
      fund.push({texto: 'backup', inicio: palavras[i].inicio, fim: palavras[i + 1].fim});
      i++;
    } else fund.push(palavras[i]);
  }
  void nrm;
  const N = fund.map((p) => norm(p.texto));
  const esperadas = SEGMENTOS.map((s) => normalizarLista(s.texto.split(/\s+/).map(limparLegenda)));
  const idxInicio = [];
  let prev = 0;
  let acumulado = 0;
  const total = esperadas.reduce((a, e) => a + e.length, 0);
  for (let s = 0; s < SEGMENTOS.length; s++) {
    if (s === 0) {
      idxInicio.push(0);
      acumulado += esperadas[0].length;
      continue;
    }
    const alvo3 = esperadas[s].slice(0, 3);
    const nPrev = esperadas[s - 1].length;
    const esperado = Math.round((acumulado / total) * N.length);
    const lo = prev + Math.max(1, Math.floor(nPrev * 0.5));
    const hi = Math.min(N.length - 1, prev + Math.ceil(nPrev * 1.6));
    const score = (j) => alvo3.reduce((a, w, k) => a + (N[j + k] === w ? 1 : 0), 0);
    let melhor = -1;
    let melhorScore = 0;
    for (let j = lo; j <= hi; j++) {
      const sc = score(j);
      if (sc === 3) { melhor = j; melhorScore = 3; break; }
      if (sc >= 2 && (melhorScore < 2 || Math.abs(j - esperado) < Math.abs(melhor - esperado))) {
        melhor = j; melhorScore = 2;
      }
    }
    if (melhor < 0) return null; // nao achou: deixa o chamador usar fallback
    idxInicio.push(melhor);
    prev = melhor;
    acumulado += esperadas[s].length;
  }
  const segmentos = [];
  for (let s = 0; s < SEGMENTOS.length; s++) {
    const i0 = idxInicio[s];
    const i1 = s + 1 < SEGMENTOS.length ? idxInicio[s + 1] : fund.length;
    const inicio = s === 0 ? 0 : fund[i0].inicio;
    const fim = s + 1 < SEGMENTOS.length ? fund[idxInicio[s + 1]].inicio : duracaoAudio;
    const pal = fund.slice(i0, i1);
    const {ancoras, origem} = resolverAncoras(SEGMENTOS[s].ancoras, inicio, fim, pal, origemPalavras);
    segmentos.push({id: SEGMENTOS[s].id, inicio: r3(inicio), fim: r3(fim), ancoras, _origem: origem});
  }
  return segmentos;
}

// ---------- modo estimado completo ----------
function montarEstimado(duracaoAlvo /* null = provisorio */) {
  const segs = SEGMENTOS.map((s) => estimarSegmento(s.texto));
  const natural = segs.reduce((a, s) => a + s.duracao, 0);
  const escala = duracaoAlvo ? duracaoAlvo / natural : 1;
  let t = 0;
  const palavras = [];
  const segmentos = [];
  segs.forEach((seg, i) => {
    const inicio = t;
    const fim = t + seg.duracao * escala;
    const pal = seg.palavras.map((p) => ({texto: p.texto, inicio: r3(inicio + p.inicio * escala), fim: r3(inicio + p.fim * escala)}));
    palavras.push(...pal);
    const {ancoras, origem} = resolverAncoras(SEGMENTOS[i].ancoras, inicio, fim, pal, 'palavra-estimada');
    segmentos.push({id: SEGMENTOS[i].id, inicio: r3(inicio), fim: r3(fim), ancoras, _origem: origem});
    t = fim;
  });
  return {duracaoAudio: r3(duracaoAlvo ?? natural), palavras, segmentos};
}

// ---------- audio real ----------
function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, {cwd: RAIZ, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 28, ...opts});
}
function duracaoDoAudio() {
  const args = ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', MP3];
  try { return parseFloat(run('npx', ['remotion', 'ffprobe', ...args]).trim()); }
  catch { return parseFloat(run('ffprobe', args).trim()); }
}
function converterWav() {
  fs.mkdirSync(path.join(RAIZ, 'out'), {recursive: true});
  const wav = path.join(RAIZ, 'out/narracao.wav');
  const args = ['-y', '-i', MP3, '-ar', '16000', '-ac', '1', wav];
  try { run('npx', ['remotion', 'ffmpeg', ...args]); } catch { run('ffmpeg', args); }
  return wav;
}
// junta tokens do whisper.cpp em palavras
function palavrasDeTokens(transcription) {
  const out = [];
  for (const seg of transcription) {
    for (const tk of seg.tokens ?? []) {
      const txt = tk.text ?? '';
      if (!txt || /^\[.*\]$/.test(txt.trim()) || /^<\|.*\|>$/.test(txt.trim())) continue;
      const ini = (tk.offsets?.from ?? 0) / 1000;
      const fim = (tk.offsets?.to ?? 0) / 1000;
      const novaPalavra = /^\s/.test(txt) || out.length === 0;
      const limpo = txt.trim();
      if (!limpo) continue;
      if (novaPalavra && !/^[.,!?;:]+$/.test(limpo)) out.push({texto: limpo, inicio: ini, fim});
      else if (out.length) { out[out.length - 1].texto += limpo; out[out.length - 1].fim = Math.max(out[out.length - 1].fim, fim); }
    }
  }
  return out.map((p) => ({...p, texto: limparLegenda(p.texto)})).filter((p) => p.texto);
}
async function whisperCpp(wav) {
  const {installWhisperCpp, downloadWhisperModel, transcribe} = await import('@remotion/install-whisper-cpp');
  const to = path.join(RAIZ, 'whisper.cpp');
  const version = '1.5.5';
  await installWhisperCpp({to, version, printOutput: false});
  await downloadWhisperModel({model: 'small', folder: to, printOutput: false});
  const out = await transcribe({inputPath: wav, whisperPath: to, whisperCppVersion: version, model: 'small', language: 'pt', tokenLevelTimestamps: true, printOutput: false});
  return palavrasDeTokens(out.transcription);
}
function fasterWhisper(wav) {
  const py = `
import sys, json
from faster_whisper import WhisperModel
m = WhisperModel("small", device="cpu", compute_type="int8")
segs, _ = m.transcribe(sys.argv[1], language="pt", word_timestamps=True)
out = []
for s in segs:
    for w in (s.words or []):
        out.append({"texto": w.word.strip(), "inicio": w.start, "fim": w.end})
print(json.dumps(out))
`;
  try { run('python3', ['-c', 'import faster_whisper']); }
  catch { run('python3', ['-m', 'pip', 'install', '--quiet', 'faster-whisper']); }
  const saida = run('python3', ['-c', py, wav]);
  return JSON.parse(saida.trim().split('\n').pop()).map((p) => ({...p, texto: limparLegenda(p.texto)})).filter((p) => p.texto);
}

async function modoAudio() {
  const dur = duracaoDoAudio();
  console.log(`Audio: ${dur.toFixed(2)} s`);
  const wav = converterWav();
  let palavras = null;
  let motor = null;
  for (const [nome, fn] of [['whisper.cpp', () => whisperCpp(wav)], ['faster-whisper', async () => fasterWhisper(wav)]]) {
    try {
      const p = await fn();
      if (p.length > 20) { palavras = p; motor = nome; break; }
    } catch (e) { console.warn(`${nome} falhou: ${String(e.message ?? e).split('\n')[0]}`); }
  }
  if (palavras) {
    const segmentos = alinhar(palavras, dur, 'whisper');
    if (segmentos) return {origem: 'audio', motor, duracaoAudio: r3(dur), palavras: palavras.map((p) => ({texto: p.texto, inicio: r3(p.inicio), fim: r3(p.fim)})), segmentos};
    console.warn('Nao consegui alinhar os segmentos com a transcricao. Usando fallback proporcional.');
  }
  return {origem: 'audio-fallback', motor: 'fallback', ...montarEstimado(dur)};
}

async function main() {
  const existe = fs.existsSync(MP3);
  const base = existe ? await modoAudio() : {origem: 'provisorio', motor: 'estimado', ...montarEstimado(null)};
  const segmentos = base.segmentos.map(({_origem, ...s}) => s);
  const json = {origem: base.origem, motor: base.motor, duracaoAudio: base.duracaoAudio, palavras: base.palavras, segmentos};
  fs.mkdirSync(path.dirname(SAIDA), {recursive: true});
  fs.writeFileSync(SAIDA, JSON.stringify(json, null, 1));
  console.log(`\norigem: ${json.origem} (${json.motor}) | duracaoAudio: ${json.duracaoAudio}s | frames: ${Math.ceil((json.duracaoAudio + 2.5) * 30)}\n`);
  console.log('seg   inicio    fim    dur   ancoras (tempo/origem)');
  base.segmentos.forEach((s) => {
    const anc = Object.entries(s.ancoras).map(([k, v]) => `${k}=${v.toFixed(2)}[${s._origem[k]}]`).join(' ');
    console.log(`${s.id}  ${s.inicio.toFixed(2).padStart(7)} ${s.fim.toFixed(2).padStart(7)} ${(s.fim - s.inicio).toFixed(2).padStart(6)}   ${anc}`);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
