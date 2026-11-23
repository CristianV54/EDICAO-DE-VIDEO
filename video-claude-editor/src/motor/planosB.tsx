import React from 'react';
import {AbsoluteFill} from 'remotion';
import {mola, power2Out, power4InOut, rampa} from '../anim';
import {C, Etiqueta, Janela, MONO, SANS, brilho} from '../dois/base';
import type {Ctx} from './motor';
import {ap, surge} from './planosA';

type P<T = object> = React.FC<{c: Ctx} & T>;
const altura = (k: number, s = 0) => Math.abs(Math.sin(k * 1.31 + s) * Math.cos(k * 0.37 + s * 2) * Math.sin(k * 0.113 + 1.7));

// ---------- Whisper: a onda de áudio vira texto, e cada palavra ganha o seu tempo ----------
const FALA = ['então', 'hoje', 'eu', 'vou', 'te', 'mostrar', 'como', 'editar', 'um', 'vídeo', 'inteiro', 'sem', 'abrir', 'nenhum', 'programa'];
export const POnda: P<{varrer: number; tempos?: number; temposPalavra?: string; rotulo?: string}> = ({c, varrer, tempos, temposPalavra, rotulo = 'WHISPER'}) => {
  const ini = c.t(varrer);
  const prog = rampa(c.f, ini, Math.min(c.dur - 10, ini + 150), (n) => n);
  const n = 150;
  const tT = (temposPalavra ? c.p(temposPalavra) : 0) || (tempos !== undefined ? c.t(tempos) : 99999);
  return (
    <AbsoluteFill>
      <Etiqueta style={{position: 'absolute', left: 130, top: 150, opacity: ap(c.f, 0)}}>{rotulo}</Etiqueta>
      <svg width={1660} height={300} style={{position: 'absolute', left: 130, top: 210}}>
        {Array.from({length: n}).map((_, k) => {
          const h = 10 + altura(k) * 270;
          const lido = k / n <= prog;
          return <rect key={k} x={k * 11.07} y={150 - h / 2} width={5.5} height={h} rx={2.7} fill={lido ? C.acento : 'rgba(255,255,255,0.22)'} />;
        })}
        <rect x={prog * 1660 - 2} y={0} width={4} height={300} fill="#fff" style={{filter: 'drop-shadow(0 0 8px #fff)'}} />
      </svg>
      <div style={{position: 'absolute', left: 130, top: 560, width: 1660, display: 'flex', flexWrap: 'wrap', gap: '26px 34px'}}>
        {FALA.map((p, i) => {
          const quando = ini + ((i + 0.6) / FALA.length) * (Math.min(c.dur - 10, ini + 150) - ini);
          const e = ap(c.f, quando, 10);
          const tempo = c.f >= tT + i * 2;
          return (
            <div key={i} style={{...surge(e, 30)}}>
              <div style={{fontFamily: MONO, fontSize: 22, color: C.acento, height: 28, opacity: tempo ? 1 : 0, transform: `translateY(${tempo ? 0 : 8}px)`}}>0:{String(Math.floor(i * 0.42 + 1)).padStart(2, '0')}.{String((i * 37) % 100).padStart(2, '0')}</div>
              <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 60, color: C.texto, letterSpacing: -1}}>{p}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- O mapa: o texto do vídeo com erros, silêncios, trechos bons e cortes marcados ----------
type Trecho = {txt: string; tipo: 'normal' | 'erro' | 'silencio' | 'bom' | 'forte'};
const TEXTO: Trecho[] = [
  {txt: 'Então hoje eu vou te mostrar', tipo: 'normal'},
  {txt: 'como é que, como é que a gente,', tipo: 'erro'},
  {txt: 'como a gente edita um vídeo.', tipo: 'normal'},
  {txt: '[ 5 s ]', tipo: 'silencio'},
  {txt: 'A ideia é simples: você grava, e o corte acontece sozinho,', tipo: 'bom'},
  {txt: 'sem arrastar nada.', tipo: 'bom'},
  {txt: 'Editar deixou de ser a parte chata.', tipo: 'forte'},
  {txt: 'Depois disso entra a animação.', tipo: 'normal'},
];
export const PMapa: P<{erro?: number; silencio?: number; bom?: number; forte?: number; legenda?: number; rotulo?: string}> = ({c, erro, silencio, bom, forte, legenda, rotulo = 'O VÍDEO INTEIRO, EM TEXTO'}) => {
  const q = (i?: number) => (i === undefined ? 99999 : c.t(i) + 4);
  const quando: Record<string, number> = {erro: q(erro), silencio: q(silencio), bom: q(bom), forte: q(forte), normal: 99999};
  const tLeg = q(legenda);
  return (
    <AbsoluteFill>
      <Etiqueta style={{position: 'absolute', left: 190, top: 140, opacity: ap(c.f, 0)}}>{rotulo}</Etiqueta>
      <Janela style={{left: 190, top: 195, width: 1540, height: 600}} luz={0.7}>
        <div style={{padding: '46px 56px', fontFamily: SANS, fontWeight: 700, fontSize: 46, lineHeight: 1.75, color: C.texto}}>
          {TEXTO.map((t, i) => {
            const m = rampa(c.f, quando[t.tipo], quando[t.tipo] + 10);
            const e = ap(c.f, 2 + i * 3);
            const estilo: React.CSSProperties =
              t.tipo === 'erro'
                ? {color: m > 0.5 ? C.erro : C.texto, textDecoration: m > 0.5 ? 'line-through' : 'none', background: `rgba(229,72,77,${0.16 * m})`}
                : t.tipo === 'silencio'
                  ? {fontFamily: MONO, fontSize: 34, color: m > 0.5 ? C.erro : C.mudo, background: `rgba(229,72,77,${0.16 * m})`}
                  : t.tipo === 'bom'
                    ? {borderBottom: `5px solid rgba(245,242,236,${m})`}
                    : t.tipo === 'forte'
                      ? {color: m > 0.5 ? '#141413' : C.texto, background: `rgba(242,98,46,${m})`, boxShadow: m > 0.5 ? brilho(C.acento, 0.7) : 'none'}
                      : {};
            return (
              <span key={i} style={{opacity: e, padding: '4px 10px', borderRadius: 10, marginRight: 8, ...estilo}}>
                {t.txt}{' '}
              </span>
            );
          })}
        </div>
      </Janela>
      <div style={{position: 'absolute', left: 190, top: 840, display: 'flex', gap: 60, fontFamily: MONO, fontSize: 32, color: C.texto}}>
        {[
          ['o que sai', C.erro],
          ['o que fica', C.texto],
          ['os melhores momentos', C.acento],
        ].map(([nome, cor], i) => {
          const falada = c.p(i === 0 ? 'sai' : i === 1 ? 'fica' : 'melhores');
          const e = ap(c.f, falada > tLeg - 20 && falada > 0 ? falada : tLeg + i * 14);
          return (
            <div key={nome} style={{display: 'flex', alignItems: 'center', gap: 16, ...surge(e, 20)}}>
              <span style={{width: 26, height: 26, borderRadius: 8, background: cor}} />
              {nome}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Linha do tempo de áudio: o auto-editor acha os silêncios e some com eles ----------
const BLOCOS: [number, boolean][] = [
  [0.14, false],
  [0.07, true],
  [0.2, false],
  [0.05, true],
  [0.17, false],
  [0.09, true],
  [0.28, false],
];
export const PSilencio: P<{medir: number; some: number; rotulo?: string}> = ({c, medir, some, rotulo = 'AUTO-EDITOR'}) => {
  const varre = rampa(c.f, c.t(medir) + 6, c.t(medir) + 96, (n) => n);
  const fecha = rampa(c.f, c.t(some) - 2, c.t(some) + 20, power4InOut);
  const L = 1560;
  let x = 0;
  let xNovo = 0;
  const nomes = ['a pausa para pensar', 'a respiração', 'o tempo morto'];
  let s = -1;
  return (
    <AbsoluteFill>
      <Etiqueta style={{position: 'absolute', left: 180, top: 180, opacity: ap(c.f, 0)}}>{rotulo}</Etiqueta>
      <div style={{position: 'absolute', left: 180, top: 320, width: L, height: 260}}>
        {BLOCOS.map(([larg, sil], i) => {
          const w = larg * L;
          const meu = x;
          const meuNovo = xNovo;
          x += w;
          if (!sil) xNovo += w;
          else s++;
          const achado = sil && varre * L >= meu + w / 2;
          const n = Math.floor(w / 11);
          const esq = meu + (meuNovo - meu) * fecha;
          const nome = sil ? nomes[s] : '';
          const dito = sil ? c.p(s === 0 ? 'pausa' : s === 1 ? 'respiração' : 'morto') : 0;
          return (
            <div key={i} style={{position: 'absolute', left: esq, top: 0, width: sil ? w * (1 - fecha) : w - 4, height: 260, borderRadius: 14, overflow: 'hidden', background: sil ? `rgba(229,72,77,${achado ? 0.2 : 0.03})` : '#15191c', border: `1px solid ${sil && achado ? C.erro : C.borda}`, opacity: sil ? 1 - fecha : 1}}>
              <svg width={w} height={260}>
                {Array.from({length: n}).map((_, k) => {
                  const h = sil ? 6 + altura(k, i) * 10 : 30 + altura(k, i) * 190;
                  return <rect key={k} x={6 + k * 11} y={130 - h / 2} width={5} height={h} rx={2.5} fill={sil ? (achado ? C.erro : 'rgba(255,255,255,0.2)') : 'rgba(245,242,236,0.75)'} />;
                })}
              </svg>
              {sil && dito > 0 && c.f >= dito - 2 ? <div style={{position: 'absolute', left: 0, right: 0, top: 8, textAlign: 'center', fontFamily: MONO, fontSize: 19, color: C.erro, whiteSpace: 'nowrap', opacity: 1 - fecha}}>{nome}</div> : null}
            </div>
          );
        })}
        {varre > 0 && varre < 1 ? <div style={{position: 'absolute', left: varre * L, top: -24, width: 4, height: 308, background: C.acento, boxShadow: brilho(C.acento, 1)}} /> : null}
      </div>
      <div style={{position: 'absolute', left: 180, top: 640, fontFamily: MONO, fontSize: 36, color: C.mudo}}>
        volume medido: <span style={{color: C.texto}}>{varre < 1 ? `${Math.round(varre * 100)} %` : 'pronto'}</span>
        <span style={{marginLeft: 60, color: C.acento, opacity: rampa(c.f, c.t(some), c.t(some) + 10)}}>3 silêncios removidos</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- A lista de cortes que a pessoa lê e aprova ----------
export const PLista: P<{itens: [string, string][]; quando: number[]; aprovar: number; titulo?: string}> = ({c, itens, quando, aprovar, titulo = 'lista de cortes'}) => {
  const tA = c.p('aprova') || c.t(aprovar) + 30;
  const ok = c.f >= tA + 4;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <Janela titulo={titulo} style={{position: 'relative', width: 1300, height: 190 + itens.length * 104 + 150}} luz={0.9}>
        <div style={{padding: '40px 50px'}}>
          {itens.map(([tempo, txt], i) => {
            const e = ap(c.f, c.t(quando[i]) + (quando[i] === quando[0] ? i * 6 : 0));
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, marginBottom: 30, fontFamily: MONO, fontSize: 36, ...surge(e, 24)}}>
                <span style={{width: 40, height: 40, borderRadius: 10, border: `3px solid ${ok ? C.acento : C.mudo}`, background: ok ? C.acento : 'transparent', color: '#141413', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 28}}>{ok ? '✓' : ''}</span>
                <span style={{color: C.acento, width: 130}}>{tempo}</span>
                <span style={{color: C.texto}}>{txt}</span>
              </div>
            );
          })}
          <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 16}}>
            <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 40, padding: '20px 54px', borderRadius: 22, background: ok ? C.acento : C.texto, color: ok ? '#fff' : '#141413', boxShadow: ok ? brilho(C.acento, 1.1) : 'none', transform: `scale(${1 - (c.f >= tA && c.f < tA + 6 ? 0.06 : 0)})`, ...surge(ap(c.f, c.t(aprovar) - 4), 20)}}>{ok ? 'APROVADO' : 'APROVAR'}</div>
          </div>
        </div>
      </Janela>
    </AbsoluteFill>
  );
};

// ---------- O corte entre uma palavra e outra, nunca no meio ----------
export const PEntrePalavras: P<{cortar: number; meio: number}> = ({c, cortar, meio}) => {
  const palavras = ['cada', 'palavra', 'tem', 'o', 'seu', 'tempo'];
  const tC = c.p('entre') || c.t(cortar) + 60;
  const abre = rampa(c.f, tC, tC + 14, power2Out);
  const tM = (c.p('meio') || c.t(meio) + 10) - 8;
  const erra = rampa(c.f, tM, tM + 8) * (1 - rampa(c.f, tM + 20, tM + 28));
  return (
    <AbsoluteFill>
      <Etiqueta style={{position: 'absolute', left: 0, right: 0, top: 220, justifyContent: 'center', opacity: ap(c.f, 0)}}>ONDE O CORTE ACONTECE</Etiqueta>
      <div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', gap: 16}}>
        {palavras.map((p, i) => {
          const e = ap(c.f, 4 + i * 4);
          const lado = i < 3 ? -1 : 1;
          return (
            <div key={i} style={{...surge(e, 30), marginLeft: i === 3 ? abre * 150 : 0, marginRight: i === 2 ? abre * 150 : 0, transform: `translateX(${lado * abre * 0}px)`}}>
              <div style={{fontFamily: MONO, fontSize: 24, color: C.acento, marginBottom: 8}}>0:0{i + 1}.{(i * 31 + 12) % 100}</div>
              <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 88, color: C.texto, background: C.cartaoClaro, border: `1px solid ${C.borda}`, borderRadius: 20, padding: '14px 30px', position: 'relative', overflow: 'hidden'}}>
                {p}
                {i === 1 && erra > 0.02 ? <div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 5, background: C.erro, opacity: erra, boxShadow: `0 0 20px ${C.erro}`}} /> : null}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 960 - 3, top: 340, width: 6, height: 260 * abre, background: '#fff', boxShadow: `0 0 26px #fff, 0 0 60px ${C.acento}`, opacity: abre}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 80, color: C.texto, ...surge(ap(c.f, tM - 2), 20)}}>
        não no <span style={{color: C.erro}}>meio</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Vinte minutos viram doze ----------
export const PContador: P<{virar: number}> = ({c, virar}) => {
  const tV = c.p('vira') || c.t(virar) + 50;
  const k = rampa(c.f, tV - 14, tV + 16, power4InOut);
  const min = Math.round(20 - 8 * k);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 50}}>
      <Etiqueta style={{opacity: ap(c.f, 0)}}>{k < 0.5 ? 'BRUTO' : 'CORTADO'}</Etiqueta>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 330, lineHeight: 1, letterSpacing: -10, color: k > 0.95 ? C.acento : C.texto, textShadow: k > 0.95 ? brilho(C.acento, 1.3) : 'none', ...surge(ap(c.f, 2))}}>{String(min).padStart(2, '0')}:00</div>
      <div style={{width: 1400, height: 70, borderRadius: 16, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', ...surge(ap(c.f, 8))}}>
        <div style={{width: `${100 - 40 * k}%`, height: '100%', background: k > 0.95 ? C.acento : C.texto, borderRadius: 16}} />
      </div>
      <div style={{fontFamily: MONO, fontSize: 36, color: C.mudo, ...surge(ap(c.f, c.p('sem') || tV + 30))}}>sem arrastar nada</div>
    </AbsoluteFill>
  );
};

// ---------- A linha do tempo já cortada, pronta para abrir no programa de edição ----------
export const PEditores: P<{entrega: number}> = ({c, entrega}) => {
  const nomes = ['Premiere', 'DaVinci Resolve', 'Final Cut', 'Shotcut', 'Kdenlive'];
  const tE = c.p('entrega') || c.t(entrega) + 90;
  return (
    <AbsoluteFill>
      <Etiqueta style={{position: 'absolute', left: 180, top: 170, opacity: ap(c.f, 0)}}>ACABAMENTO COM AS PRÓPRIAS MÃOS</Etiqueta>
      <Janela titulo="linha do tempo cortada" style={{left: 180, top: 230, width: 1560, height: 300}} luz={0.8}>
        <div style={{position: 'absolute', left: 30, right: 30, top: 80, height: 60, display: 'flex', gap: 6}}>
          {[0.2, 0.14, 0.26, 0.1, 0.3].map((w, i) => (
            <div key={i} style={{flex: w, borderRadius: 10, background: '#22282d', border: `1px solid ${C.borda}`, ...surge(ap(c.f, 6 + i * 3), 20)}} />
          ))}
        </div>
        <svg width={1500} height={90} style={{position: 'absolute', left: 30, top: 160}}>
          {Array.from({length: 136}).map((_, k) => {
            const h = 8 + altura(k, 3) * 70;
            return <rect key={k} x={k * 11} y={45 - h / 2} width={5} height={h} rx={2.5} fill="rgba(245,242,236,0.5)" />;
          })}
        </svg>
      </Janela>
      <div style={{position: 'absolute', left: 180, right: 180, top: 640, display: 'flex', gap: 24, justifyContent: 'center'}}>
        {nomes.map((n, i) => (
          <div key={n} style={{fontFamily: SANS, fontWeight: 900, fontSize: 40, color: C.texto, background: C.cartao, border: `1px solid ${C.borda}`, borderRadius: 20, padding: '22px 34px', ...surge(ap(c.f, tE + i * 5), 50), transform: `translateY(${(1 - ap(c.f, tE + i * 5)) * -70}px)`}}>{n}</div>
        ))}
      </div>
      <svg width={8} height={90} style={{position: 'absolute', left: 956, top: 540, opacity: ap(c.f, tE - 6)}}>
        <line x1={4} y1={0} x2={4} y2={90} stroke={C.acento} strokeWidth={4} strokeDasharray="10 8" />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- Um motor: comandos passando, sem botão nem tela ----------
export const PComandos: P<{rotulo?: string}> = ({c, rotulo = 'FFMPEG'}) => {
  const linhas = ['ffmpeg -i bruto.mp4 -ss 00:02:14 -to 00:02:31 corte_01.mp4', 'ffmpeg -f concat -i lista.txt -c copy video.mp4', 'ffmpeg -i video.mp4 -vf scale=1080:1920 vertical.mp4'];
  const faz = ['corta o vídeo', 'junta trechos', 'muda o formato'];
  const chaves = ['corta', 'junta', 'muda'];
  return (
    <AbsoluteFill>
      <Etiqueta style={{position: 'absolute', left: 180, top: 170, opacity: ap(c.f, 0)}}>{rotulo}</Etiqueta>
      <Janela titulo="terminal" style={{left: 180, top: 230, width: 1560, height: 520}} luz={0.9}>
        <div style={{padding: '40px 46px'}}>
          {linhas.map((l, i) => {
            const de = c.p(chaves[i]) || 20 + i * 30;
            const letras = Math.max(0, Math.floor((c.f - de) * 2.6));
            return (
              <div key={i} style={{marginBottom: 30, opacity: c.f >= de - 2 ? 1 : 0}}>
                <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 44, color: C.texto, ...surge(ap(c.f, de - 2), 16)}}>
                  {faz[i].split(' ')[0]} <span style={{color: C.acento}}>{faz[i].split(' ').slice(1).join(' ')}</span>
                </div>
                <div style={{fontFamily: MONO, fontSize: 27, color: C.mudo, marginTop: 6, whiteSpace: 'nowrap'}}>
                  $ {l.slice(0, letras)}
                </div>
              </div>
            );
          })}
        </div>
      </Janela>
    </AbsoluteFill>
  );
};

// usado por outras peças
export {altura, mola};
