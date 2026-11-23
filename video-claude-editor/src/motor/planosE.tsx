import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {expoOut, mola, power2Out, power4InOut, rampa} from '../anim';
import {C, Enfase, Etiqueta, Janela, MONO, Quadro, SANS, brilho} from '../dois/base';
import {cenaHistoria, cenaLegenda} from '../papel';
import {Editor, FERRAMENTAS, Programa} from '../cenas/Gancho';
import {CincoPassos} from '../cenas/Gancho3D';
import type {Ctx} from './motor';
import {ap, surge} from './planosA';

// Os planos do gancho (cena 1), presos às palavras da voz.
type P<T = object> = React.FC<{c: Ctx} & T>;
const q = (c: Ctx, palavra: string, reserva: number, n = 0) => c.p(palavra, n) || reserva;
const mapa = (f: number, de: number[], para: number[]) => interpolate(f, de, para, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ---------- "Este vídeo foi editado por mim, o Claude." ----------
export const PEditorA: P = ({c}) => {
  const tC = q(c, 'claude', 55);
  const fq = mapa(c.f, [0, tC, c.dur], [0, 66, 81]);
  return (
    <AbsoluteFill>
      <Editor fq={fq} parte="A" />
      <Enfase f={c.f} palavras={[['editado', q(c, 'editado', 22)], ['por', q(c, 'por', 34)], ['mim:', q(c, 'mim', 40)], ['*Claude', tC]]} ate={c.dur + 30} style={{bottom: 92}} tam={104} />
    </AbsoluteFill>
  );
};

// ---------- "Cada corte, cada animação, cada movimento de câmera: fui eu." ----------
export const PEditorB: P = ({c}) => {
  const tCo = q(c, 'corte', 17);
  const tAn = Math.max(tCo + 12, q(c, 'animação', 40));
  const tCa = Math.max(tAn + 20, q(c, 'câmera', 88));
  const tFui = Math.max(tCa + 8, c.t(1));
  const fq = mapa(c.f, [0, tCo, tAn, tCa, tFui, c.dur], [86, 100, 116, 170, 185, 193]);
  return (
    <AbsoluteFill>
      <Editor fq={fq} parte="B" />
      <Enfase f={c.f} palavras={[['cada', tCo - 8], ['*corte', tCo]]} ate={tAn - 2} style={{top: 96}} tam={120} />
      <Enfase f={c.f} palavras={[['cada', tAn - 8], ['*animação', tAn]]} ate={tCa - 22} style={{bottom: 80}} tam={104} />
      <Enfase f={c.f} palavras={[['movimento', tCa - 18], ['de', tCa - 6], ['*câmera', tCa]]} ate={tFui} style={{bottom: 80}} tam={104} />
      <Enfase f={c.f} palavras={[['fui', tFui + 1], ['*eu', tFui + 6]]} ate={c.dur + 30} style={{top: 400}} tam={230} />
    </AbsoluteFill>
  );
};

// ---------- "Guarda esse número: zero. É quantas pessoas abriram um programa de edição..." ----------
export const PZero: P = ({c}) => {
  const tZ = q(c, 'zero', 45);
  const fechos = [tZ - 22, tZ - 11, tZ];
  const abertos = 3 - fechos.filter((t) => c.f >= t).length;
  const soco = c.f >= tZ ? 1 + (1 - rampa(c.f, tZ, tZ + 12, expoOut)) * 0.35 : 1;
  const t2 = c.t(2);
  const afunda = rampa(c.f, t2 - 4, t2 + 14, power4InOut);
  const frase = ['pessoas', 'abriram', 'um', 'programa', 'de', 'edição'];
  return (
    <AbsoluteFill>
      <Etiqueta style={{position: 'absolute', left: 0, right: 0, top: 130, justifyContent: 'center', opacity: ap(c.f, 0) * (1 - afunda)}}>GUARDA ESSE NÚMERO</Etiqueta>
      <div style={{position: 'absolute', left: 0, right: 0, top: 220 + afunda * 90, display: 'flex', justifyContent: 'center', gap: 90, opacity: 1 - afunda, filter: afunda > 0.02 ? `blur(${afunda * 10}px)` : undefined}}>
        {[0, 1, 2].map((i) => {
          const e = mola(c.f, i * 3, {damping: 11});
          return (
            <div key={i} style={{transform: `scale(${Math.max(0.001, e)}) translateY(${c.f >= fechos[i] ? rampa(c.f, fechos[i], fechos[i] + 10, power2Out) * 18 : 0}px)`}}>
              <Programa tipo={i} fechado={rampa(c.f, fechos[i], fechos[i] + 7)} />
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 560 - afunda * 420, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 380, lineHeight: 1, color: abertos === 0 ? C.acento : C.texto, textShadow: abertos === 0 ? brilho(C.acento, 1.4) : 'none', transform: `scale(${soco * (1 + Math.sin(c.f / 11) * 0.012)})`}}>{abertos}</div>
      <div style={{position: 'absolute', left: 200, right: 200, top: 610, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 104, letterSpacing: -2, lineHeight: 1.1, color: C.texto}}>
        {frase.map((p, i) => {
          const de = q(c, p === 'um' ? 'um' : p, t2 + 10 + i * 9);
          const e = rampa(c.f, de, de + 8, expoOut);
          const cor = p === 'programa' || p === 'edição';
          return (
            <span key={i} style={{display: 'inline-block', marginRight: '0.26em', opacity: e, transform: `translateY(${(1 - e) * 24}px)`, filter: e < 0.98 ? `blur(${(1 - e) * 10}px)` : undefined, color: cor ? C.acento : C.texto, textShadow: cor ? brilho(C.acento, 0.7) : 'none'}}>
              {p}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- "E você pode fazer o mesmo. O seu trabalho é usar a sua voz, ou uma de IA, dizer o que quer e clicar em aprovar." ----------
export const PVoce: P = ({c}) => {
  const t1 = c.t(1);
  const sobe = rampa(c.f, t1 - 6, t1 + 12, power4InOut);
  const tV = q(c, 'voz', t1 + 40);
  const tI = Math.max(tV + 10, q(c, 'ia', tV + 30));
  const tQ = Math.max(tI + 10, q(c, 'quer', tI + 30));
  const tA = Math.max(tQ + 16, q(c, 'aprovar', c.dur - 20));
  const tB = tQ + 6;
  const botao = mola(c.f, tB, {damping: 12});
  const aperta = c.f >= tA && c.f < tA + 8 ? Math.sin(((c.f - tA) / 8) * Math.PI) : 0;
  const aprovado = c.f >= tA + 2;
  const tc = rampa(c.f, tB + 4, tA, power2Out);
  const cx = lerp(1560, 1130, tc);
  const cy = lerp(1100, 880, tc) - Math.sin(tc * Math.PI) * 90;
  const n = 56;
  const pedido = '> tire os silêncios e me mostre a lista';
  const cartoes: [string, number][] = [
    ['A SUA VOZ', tV],
    ['VOZ DE IA', tI],
    ['O QUE VOCÊ QUER', tQ],
  ];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: lerp(410, 120, sobe), textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: lerp(150, 76, sobe), letterSpacing: -3, color: C.texto, ...surge(ap(c.f, 2), 30)}}>
        você pode fazer o <span style={{color: C.acento, textShadow: brilho(C.acento, 0.9)}}>mesmo</span>
      </div>
      {cartoes.map(([nome, de], i) => {
        const chega = ap(c.f, 10 + i * 6, 18);
        const aceso = rampa(c.f, de - 3, de + 7);
        const feito = rampa(c.f, de, de + 26, (v) => v);
        return (
          <div key={nome} style={{position: 'absolute', left: 150 + i * 560, top: 300, width: 500, height: 350, borderRadius: 26, background: C.cartao, border: `1px solid ${aceso > 0.5 ? C.acento : C.borda}`, boxShadow: aceso > 0.5 ? '0 0 70px rgba(242,98,46,0.28)' : 'none', opacity: chega * (0.3 + 0.7 * aceso), transform: `translateY(${(1 - chega) * 80}px) scale(${0.94 + aceso * 0.06})`, overflow: 'hidden'}}>
            <div style={{fontFamily: MONO, fontSize: 26, letterSpacing: 4, color: aceso > 0.5 ? C.acento : C.mudo, margin: '30px 34px'}}>{nome}</div>
            {i < 2 ? (
              <svg width={440} height={180} style={{position: 'absolute', left: 30, top: 120}}>
                {Array.from({length: n}).map((_, k) => {
                  const ok = k / n <= feito;
                  const h = (8 + Math.abs(Math.sin(k * (i ? 0.9 : 1.3) + i * 2) * Math.cos(k * 0.37 + 1)) * 150) * (ok ? 1 : 0.07);
                  return <rect key={k} x={k * 7.8} y={90 - h / 2} width={4} height={h} rx={2} fill={ok ? (i ? C.texto : C.acento) : 'rgba(255,255,255,0.2)'} />;
                })}
              </svg>
            ) : (
              <div style={{fontFamily: MONO, fontSize: 34, lineHeight: 1.5, color: C.texto, margin: '10px 34px'}}>
                {pedido.slice(0, Math.max(0, Math.floor((c.f - de) * 1.1)))}
                <span style={{color: C.acento, opacity: Math.floor(c.f / 6) % 2 ? 1 : 0.2}}>▌</span>
              </div>
            )}
            <div style={{position: 'absolute', left: 34, bottom: 26, fontFamily: MONO, fontSize: 24, color: C.mudo}}>{i === 0 ? 'gravando' : i === 1 ? 'gerada por código' : 'escrito em português'}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 660, top: 740, transform: `scale(${Math.max(0.001, botao) * (1 - aperta * 0.06)})`, transformOrigin: '300px 80px'}}>
        <div style={{width: 600, height: 150, borderRadius: 40, background: aprovado ? C.acento : C.texto, color: aprovado ? '#fff' : '#141413', fontFamily: SANS, fontWeight: 900, fontSize: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: aprovado ? `0 0 90px ${C.acento}aa, 0 18px 40px rgba(0,0,0,0.6)` : '0 18px 40px rgba(0,0,0,0.6)'}}>{aprovado ? 'APROVADO' : 'APROVAR'}</div>
      </div>
      {c.f >= tB + 4 ? (
        <svg width={64} height={84} viewBox="0 0 64 84" style={{position: 'absolute', left: cx, top: cy, transform: `scale(${1 - aperta * 0.15})`, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.7))'}}>
          <path d="M4 2 L4 62 L20 48 L31 74 L42 69 L31 44 L52 44 Z" fill="#fff" stroke="#141413" strokeWidth={3} strokeLinejoin="round" />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- "O resto eu faço." ----------
export const PResto: P = ({c}) => {
  const barras = rampa(c.f, 4, 34, power2Out);
  const tF = q(c, 'faço', 26);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 190, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 170, letterSpacing: -4, color: C.texto, ...surge(ap(c.f, 2), 30)}}>
        o resto <span style={{color: C.acento, textShadow: brilho(C.acento, 1), display: 'inline-block', transform: `scale(${1 + (1 - rampa(c.f, tF, tF + 12, expoOut)) * 0.25})`, opacity: ap(c.f, tF - 8, 8)}}>eu faço</span>
      </div>
      <div style={{position: 'absolute', left: 200, right: 200, top: 520}}>
        <div style={{display: 'flex', gap: 14, height: 120}}>
          <div style={{width: `${12 * barras}%`, borderRadius: 16, background: C.texto}} />
          <div style={{width: `${88 * barras}%`, borderRadius: 16, background: C.acento, boxShadow: brilho(C.acento, 1)}} />
        </div>
        <div style={{display: 'flex', gap: 12, marginTop: 26, fontFamily: MONO, fontSize: 32, color: C.mudo, opacity: ap(c.f, 10)}}>
          <div style={{width: '12%', whiteSpace: 'nowrap'}}>
            <span style={{color: C.texto}}>Você</span>
            <br />
            aprova
          </div>
          <div style={{marginLeft: 20}}>
            <span style={{color: C.acento}}>Claude</span>
            <br />
            cortes, animações, câmera, som, legendas
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- "Vale para cortes curtos, ou para um vídeo inteiro..." ----------
export const PDoisUsos: P = ({c}) => {
  const a = mola(c.f, q(c, 'cortes', 14) - 8, {damping: 12});
  const b = mola(c.f, q(c, 'vídeo', 60) - 8, {damping: 12});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 250, top: 150, transform: `scale(${Math.max(0.001, a) * 1.18})`, transformOrigin: '170px 380px'}}>
        <div style={{width: 340, height: 660, borderRadius: 50, border: `3px solid rgba(255,255,255,0.22)`, background: '#0c0e10', padding: 14, boxShadow: '0 0 70px rgba(242,98,46,0.22)'}}>
          <div style={{width: 312, height: 632, borderRadius: 38, overflow: 'hidden'}}>
            <Quadro desenhar={cenaLegenda} f={c.f} w={624} h={1264} style={{width: 312, height: 632}} />
          </div>
        </div>
        <div style={{marginTop: 26, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 54, color: C.texto}}>
          cortes <span style={{color: C.acento, textShadow: brilho(C.acento, 0.8)}}>curtos</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 860, top: 230, transform: `scale(${Math.max(0.001, b) * 1.12})`, transformOrigin: '430px 300px'}}>
        <div style={{width: 860, height: 500, borderRadius: 22, border: `3px solid rgba(255,255,255,0.22)`, background: '#0c0e10', padding: 12, boxShadow: '0 0 70px rgba(242,98,46,0.22)'}}>
          <div style={{width: 836, height: 470, borderRadius: 12, overflow: 'hidden'}}>
            <Quadro desenhar={cenaHistoria} f={c.f + 30} w={1280} h={720} style={{width: 836, height: 470}} />
          </div>
        </div>
        <div style={{marginTop: 26, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 54, color: C.texto}}>
          vídeo <span style={{color: C.acento, textShadow: brilho(C.acento, 0.8)}}>inteiro</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- "Com o nome de cada ferramenta e o pedido que você escreve. Fica aí." ----------
const PEDIDO = 'transcreva este vídeo palavra por palavra';
export const PFerramentas: P = ({c}) => {
  const tP = q(c, 'pedido', 56);
  const sobe = rampa(c.f, tP - 12, tP + 4, power4InOut);
  const janela = mola(c.f, tP - 8, {damping: 14});
  const letras = Math.max(0, Math.min(PEDIDO.length, Math.floor((c.f - tP) * 0.9)));
  const tF = c.t(1);
  return (
    <AbsoluteFill>
      <Etiqueta style={{position: 'absolute', left: 130, top: 262 - sobe * 150}}>O NOME DE CADA FERRAMENTA</Etiqueta>
      <div style={{position: 'absolute', left: 130, right: 130, top: 330 - sobe * 150, display: 'flex', gap: 30}}>
        {FERRAMENTAS.map(([nome, faz], i) => {
          const e = rampa(c.f, 6 + i * 5, 21 + i * 5, expoOut);
          return (
            <div key={nome} style={{flex: 1, height: 270, borderRadius: 26, background: C.cartao, border: `1px solid ${C.borda}`, padding: '28px 30px', opacity: e, transform: `translateY(${(1 - e) * 60}px) scale(${0.9 + e * 0.1})`, filter: e < 0.98 ? `blur(${(1 - e) * 8}px)` : undefined, boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
              <div style={{fontFamily: MONO, fontSize: 28, color: C.acento}}>0{i + 1}</div>
              <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 50, color: C.texto, marginTop: 34, letterSpacing: -1.5, whiteSpace: 'nowrap'}}>{nome}</div>
              <div style={{fontFamily: MONO, fontSize: 28, color: C.mudo, marginTop: 14}}>{faz}</div>
            </div>
          );
        })}
      </div>
      <Etiqueta style={{position: 'absolute', left: 250, top: 520, opacity: janela}}>O PEDIDO QUE VOCÊ ESCREVE</Etiqueta>
      <Janela titulo="claude code" style={{left: 250, top: 575 + (1 - janela) * 300, width: 1420, height: 280, opacity: Math.min(1, janela)}} luz={1.2}>
        <div style={{padding: '50px 44px', fontFamily: MONO, fontSize: 50, color: C.texto, whiteSpace: 'nowrap'}}>
          <span style={{color: C.acento}}>&gt; </span>
          {PEDIDO.slice(0, letras)}
          <span style={{color: C.acento, opacity: Math.floor(c.f / 7) % 2 ? 1 : 0.2}}>▌</span>
        </div>
      </Janela>
      <div style={{position: 'absolute', right: 150, top: 880, fontFamily: SANS, fontWeight: 900, fontSize: 90, color: C.acento, textShadow: brilho(C.acento, 0.9), transform: `rotate(-4deg) scale(${Math.max(0.001, mola(c.f, tF, {damping: 9}))})`}}>fica aí</div>
    </AbsoluteFill>
  );
};

// ---------- "A regra do jogo é simples: cinco passos, quatro ferramentas e dois jeitos de usar." (3D) ----------
export const PRegra: P = ({c}) => {
  const t5 = q(c, 'três', 60);
  const t4 = q(c, 'quatro', t5 + 40);
  const t2 = q(c, 'pasta', t4 + 36);
  const Bloco: React.FC<{n: string; nome: string; de: number}> = ({n, nome, de}) => {
    const e = mola(c.f, de - 2, {damping: 11});
    return (
      <div style={{display: 'flex', alignItems: 'center', gap: 22, background: 'rgba(8,10,12,0.78)', border: `1px solid ${C.borda}`, borderRadius: 30, padding: '18px 38px 18px 26px', transform: `scale(${Math.max(0.001, e)})`}}>
        <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 110, lineHeight: 1, color: C.acento, textShadow: brilho(C.acento, 0.9)}}>{n}</span>
        <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 52, color: C.texto, letterSpacing: -1}}>{nome}</span>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <CincoPassos atraso={Math.max(0, t5 - 26)} sai={c.dur + 40} />
      <Etiqueta style={{position: 'absolute', left: 0, right: 0, top: 90, justifyContent: 'center', opacity: ap(c.f, 8) * (1 - rampa(c.f, t5 - 14, t5 - 6))}}>A REGRA DO JOGO</Etiqueta>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 90, display: 'flex', justifyContent: 'center', gap: 40}}>
        <Bloco n="4" nome="ferramentas" de={t4} />
        <Bloco n="1" nome="pasta" de={t2} />
      </div>
    </AbsoluteFill>
  );
};
