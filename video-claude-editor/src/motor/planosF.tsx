import React from 'react';
import {AbsoluteFill} from 'remotion';
import {expoOut, mola, power2Out, power4InOut, rampa} from '../anim';
import {C, Etiqueta, Janela, Marca, MONO, Quadro, SANS, brilho} from '../dois/base';
import {cenaLegenda} from '../papel';
import real from './real.json';
import type {Ctx} from './motor';
import {ap, surge} from './planosA';

// Peças do roteiro versão 4: níveis com meta, metas batidas, as três regras e os planos com dados reais
// (src/motor/real.json vem de ferramentas/gravacao_teste.py, que roda Whisper, auto-editor e FFmpeg de verdade).
type P<T = object> = React.FC<{c: Ctx} & T>;
const q = (c: Ctx, palavra: string, reserva: number, n = 0) => c.p(palavra, n) || reserva;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const R = real as unknown as {duracao: number; depois: number; final: number; onda: number[]; silencios: {ini: number; fim: number; nome: string}[]; palavras: {txt: string; ini: number; fim: number}[]; comandos: string[]};
const seg = (s: number) => `${s.toFixed(1).replace('.', ',')} s`;
const NIVEIS: [string, string][] = [
  ['Limpar', '20:00 vira 12:00'],
  ['Cortes', '1 vídeo, 10 cortes'],
  ['Vídeo inteiro', 'do bruto ao pronto'],
];

// ---------- Gancho: os três níveis em escada, a meta e o pedido ----------
export const PNiveis: P = ({c}) => {
  const t = [q(c, 'três', 20), q(c, 'fácil', 50), q(c, 'pesado', 80)];
  const tM = q(c, 'meta', c.t(1) + 20);
  const tP = q(c, 'pedido', tM + 30);
  const tF = c.t(2);
  const pedido = '> tire os silêncios e os erros deste vídeo';
  return (
    <AbsoluteFill>
      {NIVEIS.map(([nome, meta], i) => {
        const e = mola(c.f, Math.max(t[i], (t[i - 1] ?? -99) + 8) - 3, {damping: 12});
        const m = rampa(c.f, tM + i * 5, tM + 10 + i * 5);
        return (
          <div key={nome} style={{position: 'absolute', left: 170 + i * 545, top: 470 - i * 120, width: 500, height: 290, borderRadius: 28, background: C.cartao, border: `1px solid ${C.borda}`, padding: '26px 34px', transform: `translateY(${(1 - Math.min(1, e)) * 160}px) scale(${Math.max(0.001, e)})`, boxShadow: '0 24px 60px rgba(0,0,0,0.55)'}}>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 20}}>
              <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 130, lineHeight: 1, color: C.acento, textShadow: brilho(C.acento, 0.8)}}>{i + 1}</span>
              <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 52, letterSpacing: -1.5, color: C.texto}}>{nome}</span>
            </div>
            <div style={{fontFamily: MONO, fontSize: 30, marginTop: 26, color: m > 0.5 ? '#141413' : C.mudo, background: `rgba(242,98,46,${m})`, borderRadius: 12, padding: '10px 16px', display: 'inline-block'}}>meta: {meta}</div>
          </div>
        );
      })}
      <Janela titulo="claude code" style={{left: 170, top: 800, width: 1100, height: 150, ...surge(ap(c.f, tP - 6), 60)}} luz={1}>
        <div style={{padding: '26px 34px', fontFamily: MONO, fontSize: 36, color: C.texto, whiteSpace: 'nowrap'}}>
          {pedido.slice(0, Math.max(0, Math.floor((c.f - tP) * 0.95)))}
          <span style={{color: C.acento, opacity: Math.floor(c.f / 6) % 2 ? 1 : 0.2}}>▌</span>
        </div>
      </Janela>
      <div style={{position: 'absolute', right: 170, top: 800, fontFamily: SANS, fontWeight: 900, fontSize: 110, color: C.acento, textShadow: brilho(C.acento, 1), transform: `rotate(-5deg) scale(${Math.max(0.001, mola(c.f, tF, {damping: 9}))})`}}>fica aí</div>
    </AbsoluteFill>
  );
};

// ---------- Passagem do gancho para a cena 2: a pasta nasce ----------
const PastaGrande: React.FC<{tam: number; aceso?: number}> = ({tam, aceso = 0}) => (
  <svg width={tam} height={tam * 0.78} viewBox="0 0 100 78">
    <path d="M4 12 Q4 4 12 4 L36 4 L46 14 L88 14 Q96 14 96 22 L96 66 Q96 74 88 74 L12 74 Q4 74 4 66 Z" fill={`rgba(242,98,46,${0.12 + aceso * 0.5})`} stroke={aceso > 0.4 ? C.acento : 'rgba(255,255,255,0.5)'} strokeWidth={2.4} />
  </svg>
);
export const PAmbiente: P = ({c}) => {
  const e = mola(c.f, 4, {damping: 10});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 30}}>
      <Etiqueta style={{opacity: ap(c.f, 0)}}>PRIMEIRO</Etiqueta>
      <div style={{transform: `scale(${Math.max(0.001, e)}) rotate(${(1 - Math.min(1, e)) * -14}deg)`, filter: `drop-shadow(0 0 40px rgba(242,98,46,0.45))`}}>
        <PastaGrande tam={330} aceso={rampa(c.f, 14, 30)} />
      </div>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 150, letterSpacing: -4, color: C.texto, ...surge(ap(c.f, q(c, 'ambiente', 20) - 4), 30)}}>
        o <span style={{color: C.acento, textShadow: brilho(C.acento, 0.9)}}>ambiente</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Cena 2: "Ambiente montado. Só que tem um problema." ----------
export const PMontado: P = ({c}) => {
  const t1 = c.t(1);
  const visto = rampa(c.f, 8, 24, power2Out);
  const some = rampa(c.f, t1 - 4, t1 + 10, power4InOut);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: lerp(330, 210, some), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, transform: `scale(${lerp(1, 0.6, some)})`, opacity: lerp(1, 0.55, some)}}>
        <svg width={170} height={170} viewBox="0 0 100 100" style={{transform: `scale(${Math.max(0.001, mola(c.f, 2, {damping: 10}))})`}}>
          <circle cx={50} cy={50} r={44} fill="rgba(242,98,46,0.16)" stroke={C.acento} strokeWidth={5} />
          <path d="M28 52 L44 68 L74 34" fill="none" stroke={C.acento} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={80} strokeDashoffset={80 * (1 - visto)} />
        </svg>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 130, letterSpacing: -3, color: C.texto, ...surge(ap(c.f, 4), 30)}}>ambiente montado</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 170, letterSpacing: -4, color: C.texto, ...surge(ap(c.f, t1), 50)}}>
        só que tem um <span style={{color: C.acento, textShadow: brilho(C.acento, 1), display: 'inline-block', transform: `scale(${1 + (1 - rampa(c.f, q(c, 'problema', t1 + 30), q(c, 'problema', t1 + 30) + 12, expoOut)) * 0.3})`}}>problema</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Abertura de cada nível: cartão grande e a meta animada ----------
export const PNivel: P<{n: number}> = ({c, n}) => {
  const [nome] = NIVEIS[n - 1];
  const tM = c.t(2);
  const sobe = rampa(c.f, tM - 6, tM + 12, power4InOut);
  const tV = n === 1 ? q(c, 'doze', tM + 60) : n === 2 ? q(c, 'dez', tM + 30) : q(c, 'pronto', tM + 60);
  const k = rampa(c.f, tV - 12, tV + 14, power4InOut);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: lerp(250, 110, sobe), textAlign: 'center', transform: `scale(${lerp(1, 0.62, sobe)})`}}>
        <div style={{fontFamily: MONO, fontSize: 44, letterSpacing: 14, color: C.acento, ...surge(ap(c.f, 0), 20)}}>NÍVEL {n}</div>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: n === 3 ? 200 : 260, letterSpacing: -7, lineHeight: 1.05, color: C.texto, ...surge(ap(c.f, c.t(1) - 2), 40)}}>{nome}</div>
      </div>
      <div style={{position: 'absolute', left: 260, right: 260, top: 470, opacity: ap(c.f, tM - 2)}}>
        <Etiqueta style={{marginBottom: 26}}>A META</Etiqueta>
        {n === 1 ? (
          <div>
            <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 250, lineHeight: 1, letterSpacing: -6, color: k > 0.5 ? C.acento : C.texto, textShadow: k > 0.5 ? brilho(C.acento, 1.2) : 'none', transform: `scale(${1 + Math.sin(k * Math.PI) * 0.08})`, transformOrigin: 'left center'}}>{String(Math.round(20 - 8 * k)).padStart(2, '0')}:00</div>
            <div style={{height: 34, borderRadius: 12, background: 'rgba(255,255,255,0.08)', marginTop: 24, overflow: 'hidden'}}>
              <div style={{width: `${100 - 40 * k}%`, height: '100%', background: k > 0.5 ? C.acento : C.texto}} />
            </div>
            <div style={{fontFamily: MONO, fontSize: 34, color: C.mudo, marginTop: 20, ...surge(ap(c.f, q(c, 'sem', tV + 30)), 16)}}>sem silêncio e sem erro</div>
          </div>
        ) : null}
        {n === 2 ? (
          <div>
            <div style={{height: 130, borderRadius: 16, border: '2px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden', opacity: 1 - k * 0.6}}>
              {Array.from({length: 10}).map((_, i) => (
                <div key={i} style={{position: 'absolute', left: `${4 + i * 9.6}%`, top: 0, bottom: 0, width: '5%', background: `rgba(242,98,46,${k * 0.6})`}} />
              ))}
            </div>
            <div style={{display: 'flex', gap: 24, marginTop: 30, justifyContent: 'space-between'}}>
              {Array.from({length: 10}).map((_, i) => {
                const e = mola(c.f, tV + i * 3, {damping: 11});
                return <div key={i} style={{width: 100, height: 178, borderRadius: 16, border: `2px solid ${C.acento}`, background: 'rgba(242,98,46,0.16)', transform: `translateY(${(1 - Math.min(1, e)) * -90}px) scale(${Math.max(0.001, e)})`}} />;
              })}
            </div>
          </div>
        ) : null}
        {n === 3 ? (
          <div style={{position: 'relative', height: 300}}>
            {['bruto', 'cortes', 'animação', 'pronto'].map((p, i) => {
              const a = rampa(k, i / 4, i / 4 + 0.2);
              const de = i === 0 ? tM + 4 : tM + 10 + i * 6;
              return (
                <div key={p} style={{position: 'absolute', left: `${i * 26.5}%`, top: 70, width: '20%', height: 150, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 46, color: a > 0.5 ? '#141413' : C.texto, background: a > 0.5 ? C.acento : C.cartao, border: `1px solid ${C.borda}`, boxShadow: i === 3 && a > 0.5 ? brilho(C.acento, 1.1) : 'none', ...surge(ap(c.f, de), 30)}}>{p}</div>
              );
            })}
            <div style={{position: 'absolute', left: 0, top: 250, height: 8, borderRadius: 4, width: `${k * 100}%`, background: C.acento, boxShadow: brilho(C.acento, 0.8)}} />
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- "Meta batida": o carimbo ----------
export const PMeta: P<{n: number; sub?: string; subFrase?: number}> = ({c, n, sub, subFrase = 1}) => {
  const tB = q(c, 'batida', 30);
  const bate = rampa(c.f, tB - 3, tB + 5, power2Out);
  const treme = c.f >= tB + 4 && c.f < tB + 14 ? Math.sin((c.f - tB) * 2.4) * (1 - (c.f - tB - 4) / 10) * 8 : 0;
  return (
    <AbsoluteFill style={{transform: `translate(${treme}px, ${-treme * 0.6}px)`}}>
      <div style={{position: 'absolute', left: 460, top: 250, width: 1000, height: 420, borderRadius: 36, background: C.cartao, border: `1px solid ${C.borda}`, padding: '44px 60px', ...surge(ap(c.f, 0), 50)}}>
        <div style={{fontFamily: MONO, fontSize: 36, letterSpacing: 10, color: C.acento}}>NÍVEL {n}</div>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 130, letterSpacing: -4, color: C.texto, marginTop: 6}}>{NIVEIS[n - 1][0]}</div>
        <div style={{fontFamily: MONO, fontSize: 44, color: C.mudo, marginTop: 14}}>meta: {NIVEIS[n - 1][1]}</div>
      </div>
      <div style={{position: 'absolute', left: 900, top: 420, transform: `rotate(-9deg) scale(${lerp(3.2, 1, bate)})`, opacity: bate, fontFamily: SANS, fontWeight: 900, fontSize: 120, letterSpacing: 2, color: C.acento, border: `10px solid ${C.acento}`, borderRadius: 24, padding: '8px 40px', background: 'rgba(11,13,15,0.82)', boxShadow: brilho(C.acento, 1.1), whiteSpace: 'nowrap'}}>META BATIDA</div>
      {sub ? <div style={{position: 'absolute', left: 0, right: 0, top: 780, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 70, letterSpacing: -1.5, color: C.texto, ...surge(ap(c.f, c.t(subFrase)), 30)}}>{sub}</div> : null}
    </AbsoluteFill>
  );
};

// ---------- auto-editor com a onda real da gravação de teste ----------
const L = 1560;
const xDe = (s: number) => (s / R.duracao) * L;
export const PSilencioReal: P<{medir: number}> = ({c, medir}) => {
  const tV = c.t(medir);
  const varre = rampa(c.f, tV + 4, tV + 100, (n) => n);
  const chaves = ['pausa', 'respiração', 'morto'];
  const ditos = R.silencios.map((_, i) => q(c, chaves[i], tV + 110 + i * 40));
  const fecha = rampa(c.f, c.dur - 62, c.dur - 34, power4InOut);
  const n = R.onda.length;
  // posição de cada barra depois que os silêncios encolhem
  const xFinal = (s: number) => {
    let corte = 0;
    R.silencios.forEach((si) => {
      corte += Math.max(0, Math.min(s, si.fim) - si.ini);
    });
    return xDe(s - corte * fecha);
  };
  const largFinal = xFinal(R.duracao);
  return (
    <AbsoluteFill>
      <Etiqueta style={{position: 'absolute', left: 180, top: 170, opacity: ap(c.f, 0)}}>AUTO-EDITOR · GRAVAÇÃO DE TESTE REAL</Etiqueta>
      <div style={{position: 'absolute', left: 180, top: 250, width: L, height: 330, borderRadius: 18, background: '#0d0f11', border: `1px solid ${C.borda}`, ...surge(ap(c.f, 2), 40)}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: largFinal, height: '100%'}}>
          {R.silencios.map((si, i) => {
            const a = rampa(c.f, ditos[i] - 3, ditos[i] + 7) * (1 - fecha);
            return <div key={i} style={{position: 'absolute', left: xFinal(si.ini), width: Math.max(0, xFinal(si.fim) - xFinal(si.ini)), top: 14, bottom: 14, borderRadius: 10, background: `rgba(229,72,77,${a * 0.3})`, border: `2px solid rgba(229,72,77,${a})`}} />;
          })}
          {R.onda.map((v, i) => {
            const s = (i / n) * R.duracao;
            const emSil = R.silencios.some((si) => s >= si.ini && s <= si.fim);
            const h = Math.max(3, v * 420);
            const lido = i / n <= varre;
            return <div key={i} style={{position: 'absolute', left: xFinal(s), top: 165 - h / 2, width: 2.4, height: h, borderRadius: 2, background: lido && !emSil ? C.acento : 'rgba(255,255,255,0.3)', opacity: emSil ? 1 - fecha : 1}} />;
          })}
        </div>
        {/* o limite de volume */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 165 - 16, height: 0, borderTop: `2px dashed rgba(255,255,255,${0.5 * ap(c.f, tV)})`}} />
        <div style={{position: 'absolute', right: 14, top: 165 - 52, fontFamily: MONO, fontSize: 22, color: C.mudo, opacity: ap(c.f, tV) * (1 - fecha)}}>limite de volume</div>
        {varre > 0 && varre < 1 ? <div style={{position: 'absolute', left: varre * L, top: 0, bottom: 0, width: 3, background: '#fff', boxShadow: '0 0 14px #fff'}} /> : null}
      </div>
      {R.silencios.map((si, i) => {
        const e = ap(c.f, ditos[i] - 2) * (1 - fecha);
        return (
          <div key={i} style={{position: 'absolute', left: 180 + xDe((si.ini + si.fim) / 2) - 150, top: 600, width: 300, textAlign: 'center', ...surge(e, 20)}}>
            <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 34, color: C.erro}}>{si.nome}</div>
            <div style={{fontFamily: MONO, fontSize: 28, color: C.mudo}}>{seg(si.fim - si.ini)}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 180, top: 760, display: 'flex', alignItems: 'baseline', gap: 30, fontFamily: SANS, fontWeight: 900, letterSpacing: -2, ...surge(ap(c.f, c.dur - 40), 30)}}>
        <span style={{fontSize: 90, color: C.mudo, textDecoration: 'line-through'}}>{seg(R.duracao)}</span>
        <span style={{fontSize: 70, color: C.mudo}}>→</span>
        <span style={{fontSize: 130, color: C.acento, textShadow: brilho(C.acento, 1)}}>{seg(R.depois)}</span>
        <span style={{fontFamily: MONO, fontWeight: 400, fontSize: 30, letterSpacing: 0, color: C.mudo}}>medido de verdade</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- FFmpeg: os comandos reais e o efeito de cada um ----------
export const PComandosReal: P<{euEm: number}> = ({c, euEm}) => {
  const chaves = ['corta', 'junta', 'muda'];
  const faz = ['corta o vídeo', 'junta trechos', 'muda o formato'];
  const tEu = c.t(euEm);
  return (
    <AbsoluteFill>
      <Etiqueta style={{position: 'absolute', left: 150, top: 150, opacity: ap(c.f, 0)}}>FFMPEG · OS COMANDOS QUE RODARAM NA GRAVAÇÃO DE TESTE</Etiqueta>
      <Janela titulo="terminal" style={{left: 150, top: 210, width: 1620, height: 620}} luz={0.9}>
        <div style={{padding: '34px 44px'}}>
          {chaves.map((ch, i) => {
            const de = q(c, ch, 30 + i * 30);
            const k = rampa(c.f, de + 6, de + 34, power4InOut);
            const cmd = R.comandos[i + 1];
            return (
              <div key={ch} style={{display: 'flex', alignItems: 'center', height: 168, borderBottom: i < 2 ? `1px solid ${C.borda}` : 'none', opacity: c.f >= de - 3 ? 1 : 0.12}}>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 50, color: C.texto, ...surge(ap(c.f, de - 2), 16)}}>
                    {faz[i].split(' ')[0]} <span style={{color: C.acento}}>{faz[i].split(' ').slice(1).join(' ')}</span>
                  </div>
                  <div style={{fontFamily: MONO, fontSize: 23, color: C.mudo, marginTop: 8, whiteSpace: 'nowrap', overflow: 'hidden'}}>$ {cmd.slice(0, Math.max(0, Math.floor((c.f - de) * 2.6)))}</div>
                </div>
                <div style={{width: 380, height: 120, position: 'relative', marginLeft: 30, opacity: ap(c.f, de)}}>
                  {i === 0 ? (
                    <>
                      <div style={{position: 'absolute', left: 0, top: 36, width: 110, height: 50, borderRadius: 8, background: C.erro, opacity: 1 - k, transform: `translateY(${k * 60}px) rotate(${k * 12}deg)`}} />
                      <div style={{position: 'absolute', left: 118 - k * 118, top: 36, width: 250, height: 50, borderRadius: 8, background: C.cartaoClaro, border: `1px solid ${C.borda}`}} />
                    </>
                  ) : null}
                  {i === 1 ? (
                    <>
                      <div style={{position: 'absolute', left: 40 * (1 - k), top: 36, width: 150, height: 50, borderRadius: 8, background: C.cartaoClaro, border: `1px solid ${k > 0.9 ? C.acento : C.borda}`}} />
                      <div style={{position: 'absolute', left: 230 - 78 * k - 40 * (1 - k) + 40, top: 36, width: 150, height: 50, borderRadius: 8, background: C.cartaoClaro, border: `1px solid ${k > 0.9 ? C.acento : C.borda}`}} />
                    </>
                  ) : null}
                  {i === 2 ? <div style={{position: 'absolute', left: 190 - lerp(100, 34, k), top: 60 - lerp(28, 60, k), width: lerp(200, 68, k), height: lerp(56, 120, k), borderRadius: 10, border: `3px solid ${C.acento}`, background: 'rgba(242,98,46,0.14)'}} /> : null}
                </div>
              </div>
            );
          })}
        </div>
      </Janela>
      <div style={{position: 'absolute', left: 150, top: 860, display: 'flex', alignItems: 'center', gap: 24, ...surge(ap(c.f, tEu), 30)}}>
        <Marca tam={84} />
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 64, letterSpacing: -1.5, color: C.texto}}>
          quem escreve sou <span style={{color: C.acento}}>eu</span>
        </div>
        <div style={{fontFamily: MONO, fontSize: 30, color: C.mudo, marginLeft: 20}}>sem botão, sem tela</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- O corte entre palavras, em cima da onda real ----------
export const PEntreReal: P = ({c}) => {
  // janela da gravação de teste em volta do segundo silêncio
  const si = R.silencios[1];
  const a = si.ini - 2.3;
  const b = si.fim + 2.3;
  const X = (s: number) => ((s - a) / (b - a)) * L;
  const pal = R.palavras.filter((w) => w.ini >= a && w.fim <= b);
  const n = R.onda.length;
  const tC = q(c, 'entre', 60);
  const tM = q(c, 'meio', tC + 50) - 8;
  const corta = rampa(c.f, tC, tC + 10, power2Out);
  const alvoErrado = pal[Math.max(0, pal.findIndex((w) => w.ini >= si.fim))] ?? pal[0];
  const xErr = X((alvoErrado.ini + alvoErrado.fim) / 2);
  const xCerto = X((si.ini + si.fim) / 2);
  return (
    <AbsoluteFill>
      <Etiqueta style={{position: 'absolute', left: 180, top: 190, opacity: ap(c.f, 0)}}>ONDE O CORTE ACONTECE · TEMPOS MEDIDOS PELO WHISPER</Etiqueta>
      <div style={{position: 'absolute', left: 180, top: 270, width: L, height: 260, borderRadius: 18, background: '#0d0f11', border: `1px solid ${C.borda}`, overflow: 'hidden', ...surge(ap(c.f, 2), 40)}}>
        {R.onda.map((v, i) => {
          const s = (i / n) * R.duracao;
          if (s < a || s > b) return null;
          const h = Math.max(3, v * 330);
          return <div key={i} style={{position: 'absolute', left: X(s), top: 130 - h / 2, width: 7, height: h, borderRadius: 3, background: 'rgba(255,255,255,0.34)'}} />;
        })}
        <div style={{position: 'absolute', left: X(si.ini), width: X(si.fim) - X(si.ini), top: 0, bottom: 0, background: `rgba(242,98,46,${0.14 * corta})`}} />
      </div>
      {pal.map((w, i) => {
        const e = ap(c.f, 8 + i * 3);
        return (
          <div key={i} style={{position: 'absolute', left: 180 + X(w.ini), top: 560 + (i % 2) * 96, ...surge(e, 20)}}>
            <div style={{fontFamily: MONO, fontSize: 20, color: C.acento}}>{w.ini.toFixed(2).replace('.', ',')}</div>
            <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 38, color: C.texto, background: C.cartao, border: `1px solid ${C.borda}`, borderRadius: 10, padding: '4px 12px', whiteSpace: 'nowrap'}}>{w.txt}</div>
          </div>
        );
      })}
      {c.f >= tC ? <div style={{position: 'absolute', left: 180 + xCerto - 3, top: 250 - 20 * (1 - corta), width: 6, height: 300, background: '#fff', boxShadow: `0 0 26px #fff, 0 0 60px ${C.acento}`, transform: `scaleY(${corta})`, transformOrigin: 'top'}} /> : null}
      {c.f >= tC + 6 ? <div style={{position: 'absolute', left: 180 + xCerto - 130, top: 196, width: 260, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 40, color: C.acento, ...surge(ap(c.f, tC + 6), 14)}}>o corte cai aqui</div> : null}
      {c.f >= tM && c.f < tM + 34 ? <div style={{position: 'absolute', left: 180 + xErr - 3, top: 270, width: 6, height: 260, background: C.erro, boxShadow: `0 0 20px ${C.erro}`, opacity: Math.sin(((c.f - tM) / 34) * Math.PI)}} /> : null}
      <div style={{position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 80, letterSpacing: -2, color: C.texto, ...surge(ap(c.f, tM + 6), 30)}}>
        não no <span style={{color: C.erro}}>meio</span> de uma palavra
      </div>
    </AbsoluteFill>
  );
};

// ---------- Nível 2: "E a legenda, quem faz?" Remotion ----------
export const PRemotionLegenda: P = ({c}) => {
  const tR = q(c, 'remotion', c.t(1) + 34);
  const tG = q(c, 'grátis', tR + 30);
  const tT = c.t(2);
  const frase = ['a', 'palavra', 'acende', 'na', 'hora', 'certa'];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 250, top: 150, width: 420, height: 780, borderRadius: 54, border: '3px solid rgba(255,255,255,0.22)', background: '#0c0e10', overflow: 'hidden', ...surge(ap(c.f, 0), 50)}}>
        <div style={{position: 'absolute', left: 130, top: 170, width: 160, height: 160, borderRadius: 80, background: '#22272c'}} />
        <div style={{position: 'absolute', left: 60, top: 350, width: 300, height: 300, borderRadius: 150, background: '#22272c'}} />
        <div style={{position: 'absolute', left: 20, right: 20, top: 560, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 46, lineHeight: 1.2}}>
          {frase.map((p, i) => {
            const a = rampa(c.f, tR + 10 + i * 9, tR + 15 + i * 9);
            return (
              <span key={i} style={{display: 'inline-block', margin: '0 7px', color: a > 0.5 ? C.acento : 'rgba(255,255,255,0.2)', textShadow: a > 0.5 ? brilho(C.acento, 0.7) : 'none', transform: `scale(${1 + Math.sin(a * Math.PI) * 0.2})`}}>{p}</span>
            );
          })}
        </div>
      </div>
      <div style={{position: 'absolute', left: 780, top: 220, fontFamily: SANS, fontWeight: 900, fontSize: 84, letterSpacing: -2, color: C.texto, ...surge(ap(c.f, 4), 30)}}>
        e a legenda, <span style={{color: C.acento}}>quem faz?</span>
      </div>
      <div style={{position: 'absolute', left: 774, top: 380, fontFamily: SANS, fontWeight: 900, fontSize: 210, letterSpacing: -6, lineHeight: 1, color: C.acento, textShadow: brilho(C.acento, 1.1), transform: `scale(${Math.max(0.001, mola(c.f, tR - 3, {damping: 11}))})`, transformOrigin: 'left center'}}>Remotion</div>
      <div style={{position: 'absolute', left: 780, top: 630, fontFamily: MONO, fontSize: 34, color: '#141413', background: C.acento, borderRadius: 14, padding: '10px 24px', ...surge(ap(c.f, tG - 2), 20)}}>grátis até 3 pessoas</div>
      <div style={{position: 'absolute', left: 780, top: 740, fontFamily: SANS, fontWeight: 900, fontSize: 70, letterSpacing: -1.5, color: C.texto, ...surge(ap(c.f, tT), 30)}}>
        transforma <span style={{color: C.acento}}>código</span> em vídeo
      </div>
    </AbsoluteFill>
  );
};

// ---------- "A palavra acende na hora em que é falada" ----------
export const PPalavraAcende: P = ({c}) => {
  const frase: [string, string][] = [
    ['a', '0,00'],
    ['palavra', '0,18'],
    ['acende', '0,62'],
    ['na', '1,05'],
    ['hora', '1,21'],
    ['em', '1,58'],
    ['que', '1,70'],
    ['é', '1,86'],
    ['falada', '1,98'],
  ];
  const t0 = q(c, 'acende', 30) - 20;
  const fim = q(c, 'whisper', c.dur - 30);
  const passo = Math.max(7, (fim - t0 - 20) / frase.length);
  const atual = Math.floor((c.f - t0) / passo);
  return (
    <AbsoluteFill>
      <Janela titulo="legenda.tsx" style={{left: 260, top: 180, width: 1400, height: 210, ...surge(ap(c.f, 0), 40)}} luz={1}>
        <div style={{padding: '40px 46px', fontFamily: MONO, fontSize: 46, color: C.texto, whiteSpace: 'nowrap'}}>
          palavra.<span style={{color: C.acento}}>acende</span>(quando: palavra.<span style={{color: C.acento}}>tempo</span>)
        </div>
      </Janela>
      <div style={{position: 'absolute', left: 120, right: 120, top: 520, display: 'flex', justifyContent: 'center', gap: 26, flexWrap: 'wrap'}}>
        {frase.map(([p, t], i) => {
          const aceso = i <= atual;
          const pulso = i === atual ? 1 + Math.sin(((c.f - t0 - i * passo) / passo) * Math.PI) * 0.16 : 1;
          return (
            <div key={i} style={{textAlign: 'center', ...surge(ap(c.f, 4 + i * 2), 20)}}>
              <div style={{fontFamily: MONO, fontSize: 26, color: aceso ? C.acento : C.mudo, marginBottom: 8}}>{t} s</div>
              <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 96, letterSpacing: -2, color: aceso ? C.acento : 'rgba(255,255,255,0.22)', textShadow: aceso ? brilho(C.acento, 0.8) : 'none', transform: `scale(${pulso})`}}>{p}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 830, textAlign: 'center', fontFamily: MONO, fontSize: 38, color: C.mudo, ...surge(ap(c.f, q(c, 'sei', c.dur - 80)), 20)}}>o tempo de cada palavra já veio do Whisper</div>
    </AbsoluteFill>
  );
};

// ---------- "Agora o nível três. Esse é o que eu fiz com o vídeo que você está vendo." ----------
export const PCongela: P = ({c}) => {
  const t1 = c.t(1);
  const k = rampa(c.f, t1 - 4, t1 + 14, power4InOut);
  const caixas: [number, number, number, number, string][] = [
    [330, 300, 520, 130, 'título'],
    [330, 470, 300, 260, 'personagem'],
    [690, 470, 900, 260, 'linha do tempo'],
    [1250, 290, 340, 150, 'câmera'],
  ];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: lerp(400, 90, k), textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: lerp(200, 90, k), letterSpacing: -4, color: C.texto, ...surge(ap(c.f, 2), 40)}}>
        agora o nível <span style={{color: C.acento, textShadow: brilho(C.acento, 1)}}>3</span>
      </div>
      <div style={{position: 'absolute', left: 280, top: 240, width: 1360, height: 560, borderRadius: 26, background: '#0d0f11', border: `1px solid ${C.borda}`, opacity: k}}>
        <div style={{position: 'absolute', left: 70, top: 86, fontFamily: SANS, fontWeight: 900, fontSize: 80, color: C.texto}}>este vídeo</div>
        <div style={{position: 'absolute', left: 120, top: 280}}>
          <Marca tam={150} />
        </div>
        {[0.6, 0.4, 0.8].map((w, i) => (
          <div key={i} style={{position: 'absolute', left: 430 + i * 50, top: 260 + i * 70, width: 800 * w, height: 50, borderRadius: 10, background: C.cartaoClaro}} />
        ))}
        <div style={{position: 'absolute', left: 1000, top: 70, width: 280, height: 110, borderRadius: 12, border: '3px solid rgba(255,255,255,0.3)', transform: 'perspective(600px) rotateY(-24deg)'}} />
      </div>
      {caixas.map(([x, y, w, h, nome], i) => {
        const a = rampa(c.f, t1 + 10 + i * 7, t1 + 20 + i * 7);
        return (
          <div key={nome} style={{position: 'absolute', left: x, top: y, width: w, height: h, border: `3px dashed rgba(242,98,46,${a})`, borderRadius: 14, boxShadow: a > 0.5 ? '0 0 30px rgba(242,98,46,0.35)' : 'none'}}>
            <div style={{position: 'absolute', left: 0, top: -40, fontFamily: MONO, fontSize: 26, color: C.acento, opacity: a}}>{nome}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 850, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 76, letterSpacing: -2, color: C.texto, ...surge(ap(c.f, q(c, 'fiz', t1 + 30)), 30)}}>
        foi o que eu fiz com <span style={{color: C.acento}}>este vídeo</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Nível 3: o pedido do título, com o mini quadro fazendo o que o pedido diz ----------
export const PPedidoMini: P<{pedido: string; pedidoEm: number}> = ({c, pedido, pedidoEm}) => {
  const ini = c.t(pedidoEm);
  const letras = Math.max(0, Math.min(pedido.length, Math.floor((c.f - ini - 2) * 0.82)));
  const tE = q(c, 'entrar', ini + 50);
  const tA = q(c, 'aproximar', tE + 50);
  const entra = rampa(c.f, tE, tE + 16, expoOut);
  const zoom = rampa(c.f, tA - 6, tA + 30, power4InOut);
  return (
    <AbsoluteFill>
      <Etiqueta style={{position: 'absolute', left: 130, top: 190, opacity: ap(c.f, 0)}}>O SEU PEDIDO</Etiqueta>
      <Janela titulo="claude code · ~/meus-videos" style={{left: 130, top: 250, width: 940, height: 420, ...surge(ap(c.f, 2), 40)}} luz={1}>
        <div style={{padding: '40px 44px', fontFamily: MONO, fontSize: 40, lineHeight: 1.45, color: C.texto}}>
          <span style={{color: C.acento}}>&gt; </span>
          {pedido.slice(0, letras)}
          <span style={{color: C.acento, opacity: Math.floor(c.f / 6) % 2 ? 1 : 0.2}}>▌</span>
        </div>
      </Janela>
      <Etiqueta style={{position: 'absolute', left: 1150, top: 190, opacity: ap(c.f, tE - 20)}}>O QUE APARECE</Etiqueta>
      <div style={{position: 'absolute', left: 1150, top: 250, width: 640, height: 420, borderRadius: 18, border: `1px solid ${C.borda}`, background: '#07090a', overflow: 'hidden', ...surge(ap(c.f, tE - 20), 40)}}>
        <div style={{position: 'absolute', inset: 0, transform: `scale(${1 + zoom * 0.5})`, transformOrigin: '40% 50%'}}>
          <div style={{position: 'absolute', left: 60, top: 150, fontFamily: SANS, fontWeight: 900, fontSize: 76, color: C.texto, opacity: entra, transform: `translateX(${(1 - entra) * -120}px)`}}>
            O <span style={{color: C.acento}}>título</span>
          </div>
          <div style={{position: 'absolute', left: 60, top: 260, width: 300 * entra, height: 8, borderRadius: 4, background: C.acento}} />
        </div>
        <div style={{position: 'absolute', left: 20, bottom: 16, fontFamily: MONO, fontSize: 24, color: C.mudo}}>00:0{Math.min(5, Math.max(0, Math.floor(3 + (c.f - tE) / 30)))}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- As três regras ----------
export const PRegra: P<{n: number; palavra: string; tipo: 'aprove' | 'partes' | 'assista'}> = ({c, n, palavra, tipo}) => {
  const tP = c.t(1);
  const peso = mola(c.f, tP - 2, {damping: 10});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 150, top: 150, fontFamily: SANS, fontWeight: 900, fontSize: 560, lineHeight: 0.9, color: 'rgba(242,98,46,0.16)', transform: `scale(${Math.max(0.001, mola(c.f, 0, {damping: 12}))})`, transformOrigin: 'left top'}}>{n}</div>
      <Etiqueta style={{position: 'absolute', left: 430, top: 200, opacity: ap(c.f, 0)}}>REGRA {n}</Etiqueta>
      <div style={{position: 'absolute', left: 424, top: 250, fontFamily: SANS, fontWeight: 900, fontSize: tipo === 'partes' ? 150 : 210, letterSpacing: -5, lineHeight: 1, color: C.acento, textShadow: brilho(C.acento, 1), transform: `scale(${Math.max(0.001, peso)})`, transformOrigin: 'left center', whiteSpace: 'nowrap'}}>{palavra}</div>
      <div style={{position: 'absolute', left: 430, right: 150, top: 520}}>
        {tipo === 'aprove' ? (
          <>
            {['02:00  erro: frase errada', '07:00  repetição', '11:40  silêncio de 6 s'].map((l, i) => {
              const tL = q(c, 'lista', tP + 20);
              const ok = c.f >= tL + 8 + i * 6;
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, fontFamily: MONO, fontSize: 38, color: C.texto, marginBottom: 16, ...surge(ap(c.f, tP + 6 + i * 5), 24)}}>
                  <span style={{width: 40, height: 40, borderRadius: 10, border: `2px solid ${ok ? C.acento : C.mudo}`, background: ok ? C.acento : 'transparent', color: '#141413', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 28}}>{ok ? '✓' : ''}</span>
                  {l}
                </div>
              );
            })}
            <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 68, letterSpacing: -1.5, color: C.texto, marginTop: 30, ...surge(ap(c.f, c.t(2)), 30)}}>
              o vídeo é <span style={{color: C.acento}}>seu</span>, não só meu
            </div>
          </>
        ) : null}
        {tipo === 'partes' ? (
          <>
            <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
              {['limpar', 'cortar', 'animar'].map((p, i) => {
                const de = q(c, p, c.t(2) + 10 + i * 26);
                const e = mola(c.f, de - 2, {damping: 11});
                return (
                  <React.Fragment key={p}>
                    {i ? <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 60, color: C.mudo, opacity: ap(c.f, de - 4)}}>→</span> : null}
                    <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 64, color: '#141413', background: C.texto, borderRadius: 20, padding: '22px 44px', transform: `scale(${Math.max(0.001, e)})`}}>
                      {i + 1}. {p}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 50, ...surge(ap(c.f, c.t(3)), 30)}}>
              <div style={{fontFamily: MONO, fontSize: 36, color: C.mudo, border: `2px dashed ${C.mudo}`, borderRadius: 16, padding: '16px 28px', filter: 'blur(1.6px)'}}>&gt; deixa legal</div>
              <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 50, color: C.mudo}}>→</span>
              <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 50, color: C.erro}}>corte genérico</div>
            </div>
          </>
        ) : null}
        {tipo === 'assista' ? (
          <>
            {[
              ['o começo está lento', 'começo'],
              ['a música está alta aqui', 'música'],
            ].map(([fala, ch], i) => {
              const de = q(c, ch, c.t(2) + 6 + i * 40);
              const tC = q(c, 'corrijo', c.dur - 40);
              return (
                <div key={ch} style={{display: 'flex', alignItems: 'center', gap: 30, marginBottom: 24, ...surge(ap(c.f, de - 3), 30)}}>
                  <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.texto, background: '#1d2226', border: `1px solid ${C.borda}`, borderRadius: '30px 30px 30px 8px', padding: '20px 36px'}}>{fala}</div>
                  <div style={{fontFamily: MONO, fontSize: 34, color: C.acento, ...surge(ap(c.f, tC + i * 6), 14)}}>corrigido ✓</div>
                </div>
              );
            })}
            <div style={{fontFamily: MONO, fontSize: 36, color: C.mudo, marginTop: 20, ...surge(ap(c.f, q(c, 'exporto', c.dur - 20) - 4), 16)}}>e exporto de novo</div>
          </>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export const PRegrasJuntas: P = ({c}) => {
  const tG = q(c, 'gosto', c.t(1) + 30);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 200, right: 200, top: 190, display: 'flex', gap: 34}}>
        {['APROVE', 'PEÇA POR PARTES', 'ASSISTA'].map((p, i) => (
          <div key={p} style={{flex: 1, height: 240, borderRadius: 26, background: C.cartao, border: `1px solid ${C.borda}`, padding: '26px 30px', ...surge(ap(c.f, 2 + i * 5), 50)}}>
            <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 90, lineHeight: 1, color: C.acento}}>{i + 1}</div>
            <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 46, letterSpacing: -1, color: C.texto, marginTop: 20}}>{p}</div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', fontFamily: MONO, fontSize: 40, color: C.mudo, ...surge(ap(c.f, 10), 20)}}>não é papo de coach</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 620, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 150, letterSpacing: -4, color: C.texto, ...surge(ap(c.f, c.t(1)), 40)}}>
        o <span style={{color: C.acento, textShadow: brilho(C.acento, 1), display: 'inline-block', margin: '0 0.12em', transform: `scale(${1 + (1 - rampa(c.f, tG, tG + 12, expoOut)) * 0.14})`}}>gosto</span> continua seu
      </div>
    </AbsoluteFill>
  );
};

// ---------- Fechamento: "Começa pelo nível um, hoje, com um vídeo só." ----------
export const PHoje: P = ({c}) => {
  const t1 = c.t(1);
  const tH = q(c, 'hoje', t1 + 40);
  const k = rampa(c.f, t1 - 4, t1 + 12, power4InOut);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: lerp(420, 130, k), textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: lerp(150, 70, k), letterSpacing: -3, color: lerp(1, 0.6, k) > 0.8 ? C.texto : C.mudo, ...surge(ap(c.f, 2), 30)}}>não deixa para depois</div>
      <div style={{position: 'absolute', left: 360, top: 330, width: 560, height: 380, borderRadius: 34, background: C.cartao, border: `2px solid ${C.acento}`, padding: '36px 46px', boxShadow: '0 0 80px rgba(242,98,46,0.3)', ...surge(ap(c.f, t1), 60)}}>
        <div style={{fontFamily: MONO, fontSize: 34, letterSpacing: 8, color: C.acento}}>NÍVEL</div>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 210, lineHeight: 1, color: C.acento, textShadow: brilho(C.acento, 1)}}>1</div>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 60, color: C.texto}}>Limpar</div>
      </div>
      <div style={{position: 'absolute', left: 1010, top: 360, fontFamily: SANS, fontWeight: 900, fontSize: 250, letterSpacing: -6, lineHeight: 1, color: C.texto, transform: `scale(${Math.max(0.001, mola(c.f, tH - 2, {damping: 9}))})`, transformOrigin: 'left center'}}>hoje</div>
      <div style={{position: 'absolute', left: 1016, top: 620, fontFamily: MONO, fontSize: 46, color: C.mudo, ...surge(ap(c.f, q(c, 'vídeo', tH + 20) - 4), 20)}}>com um vídeo só</div>
    </AbsoluteFill>
  );
};

// ---------- Fechamento: a caixa de comentário ----------
export const PComentar: P = ({c}) => {
  const linhas: [string, number][] = [
    ['gostei', q(c, 'gostou', c.t(1))],
    ['quero mais vídeo assim', q(c, 'quer', c.t(2))],
  ];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 110, letterSpacing: -3, color: C.texto, ...surge(ap(c.f, 2), 30)}}>
        me conta nos <span style={{color: C.acento, textShadow: brilho(C.acento, 0.9)}}>comentários</span>
      </div>
      <Janela titulo="comentários" style={{left: 380, top: 380, width: 1160, height: 480, ...surge(ap(c.f, 8), 60)}} luz={1}>
        <div style={{padding: '34px 44px'}}>
          {linhas.map(([txt, de], i) => {
            const letras = Math.max(0, Math.floor((c.f - de) * 1.3));
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, marginBottom: 36, opacity: c.f >= de - 6 ? 1 : 0.15}}>
                <div style={{width: 84, height: 84, borderRadius: 42, background: i ? C.cartaoClaro : '#2a3036', flexShrink: 0}} />
                <div style={{flex: 1, height: 110, borderRadius: 22, background: '#0d0f11', border: `1px solid ${letras > 0 && letras < txt.length + 8 ? C.acento : C.borda}`, display: 'flex', alignItems: 'center', padding: '0 34px', fontFamily: SANS, fontWeight: 800, fontSize: 56, color: C.texto}}>
                  {txt.slice(0, letras)}
                  {letras < txt.length ? <span style={{color: C.acento, opacity: Math.floor(c.f / 6) % 2 ? 1 : 0.2}}>▌</span> : null}
                </div>
              </div>
            );
          })}
        </div>
      </Janela>
    </AbsoluteFill>
  );
};

// ---------- Fechamento: inscrever e ativar o sininho ----------
export const PSininho: P = ({c}) => {
  const tS = q(c, 'sininho', c.dur - 30);
  const bal = c.f >= tS ? Math.sin((c.f - tS) / 2.2) * 22 * Math.max(0, 1 - (c.f - tS) / 40) : 0;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 50}}>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 100, color: '#fff', background: C.acento, borderRadius: 44, padding: '38px 96px', boxShadow: brilho(C.acento, 1.3), transform: `scale(${Math.max(0.001, mola(c.f, q(c, 'inscreve', 30) - 4, {damping: 10}))})`}}>INSCREVA-SE</div>
      <svg width={170} height={170} viewBox="0 0 100 100" style={{transform: `scale(${Math.max(0.001, mola(c.f, tS - 4, {damping: 9}))}) rotate(${bal}deg)`, transformOrigin: '50% 10%'}}>
        <path d="M50 12 C30 12 24 30 24 46 L24 62 L14 74 L86 74 L76 62 L76 46 C76 30 70 12 50 12 Z" fill={C.texto} />
        <circle cx={50} cy={84} r={9} fill={C.acento} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- Cena 7: a parte que importa, guardada para o final ----------
export const PCaixa: P = ({c}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 40}}>
    <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 130, letterSpacing: -3, color: C.texto, ...surge(ap(c.f, q(c, 'parte', 30) - 6), 30)}}>
      a parte que <span style={{color: C.acento, textShadow: brilho(C.acento, 0.9)}}>importa</span>
    </div>
    <div style={{width: 260, height: 220, borderRadius: 30, border: `4px solid ${C.acento}`, background: 'rgba(242,98,46,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 150, color: C.acento, boxShadow: `0 0 ${50 + Math.sin(c.f / 6) * 30}px rgba(242,98,46,0.4)`, transform: `scale(${Math.max(0.001, mola(c.f, 8, {damping: 10})) * (1 + Math.sin(c.f / 6) * 0.03)})`}}>?</div>
    <div style={{fontFamily: MONO, fontSize: 44, color: C.mudo, ...surge(ap(c.f, c.t(1)), 20)}}>eu falo qual no final</div>
  </AbsoluteFill>
);

// usado para mostrar um celular com legenda em outras peças
export const Celular: React.FC<{f: number; tam?: number}> = ({f, tam = 1}) => (
  <div style={{width: 150 * tam, height: 290 * tam, borderRadius: 22 * tam, border: '3px solid rgba(255,255,255,0.22)', overflow: 'hidden', background: '#0c0e10'}}>
    <Quadro desenhar={cenaLegenda} f={f} w={312} h={632} style={{width: '100%', height: '100%'}} />
  </div>
);
