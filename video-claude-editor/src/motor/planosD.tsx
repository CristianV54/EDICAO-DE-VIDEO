import React from 'react';
import {AbsoluteFill} from 'remotion';
import {mola, power2Out, power4InOut, rampa} from '../anim';
import {C, Etiqueta, Janela, Marca, MONO, Quadro, SANS, brilho} from '../dois/base';
import {cenaLegenda} from '../papel';
import type {Ctx} from './motor';
import {ap, surge} from './planosA';

// Peças novas do mapa do vídeo (MAPA-VIDEO.md): analogias, objeções e os planos que faltavam.
type P<T = object> = React.FC<{c: Ctx} & T>;
const q = (c: Ctx, palavra: string, reserva: number, n = 0) => c.p(palavra, n) || reserva;

// ---------- Objeção: "Mas Claude, ..." e a resposta ----------
export const PObjecao: P<{pergunta: string; resposta: string; respostaEm: number; nota?: string; notaEm?: number}> = ({c, pergunta, resposta, respostaEm, nota, notaEm = 2}) => {
  const tR = c.t(respostaEm);
  const e = ap(c.f, 2, 16);
  const r = ap(c.f, tR, 14);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 250, top: 250, width: 1300, ...surge(e, 50)}}>
        <div style={{fontFamily: MONO, fontSize: 34, color: C.mudo, marginBottom: 18}}>mas Claude,</div>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 96, lineHeight: 1.05, letterSpacing: -2, color: C.texto, background: '#1d2226', border: `1px solid ${C.borda}`, borderRadius: '46px 46px 46px 10px', padding: '44px 56px', transform: `scale(${1 + (1 - rampa(c.f, 2, 26, power2Out)) * 0.06})`}}>{pergunta}</div>
      </div>
      <div style={{position: 'absolute', right: 250, top: 690, display: 'flex', alignItems: 'center', gap: 26, ...surge(r, 50)}}>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 84, letterSpacing: -2, color: '#141413', background: C.acento, borderRadius: '40px 40px 10px 40px', padding: '32px 50px', boxShadow: brilho(C.acento, 0.9)}}>{resposta}</div>
        <Marca tam={110} />
      </div>
      {nota ? <div style={{position: 'absolute', left: 0, right: 0, top: 900, textAlign: 'center', fontFamily: MONO, fontSize: 40, color: C.texto, ...surge(ap(c.f, c.t(notaEm)), 20)}}>{nota}</div> : null}
    </AbsoluteFill>
  );
};

// ---------- Analogia: a legenda do filme na mão ----------
export const PAnalogiaFilme: P = ({c}) => {
  const tL = q(c, 'legenda', 20);
  const tA = c.t(1) + 16;
  const acha = rampa(c.f, tA, tA + 40, power4InOut);
  const alvo = 5;
  return (
    <AbsoluteFill>
      <Etiqueta style={{position: 'absolute', left: 150, top: 170, opacity: ap(c.f, 0)}}>O FILME INTEIRO</Etiqueta>
      <div style={{position: 'absolute', left: 150, top: 230, display: 'flex', gap: 10, padding: '18px 14px', background: '#0d0f11', border: `1px solid ${C.borda}`, borderRadius: 16}}>
        {Array.from({length: 8}).map((_, i) => {
          const e = ap(c.f, 2 + i * 2);
          const aceso = i === alvo ? rampa(c.f, tA + 34, tA + 44) : 0;
          return (
            <div key={i} style={{width: 186, height: 118, borderRadius: 8, background: `rgba(242,98,46,${0.07 + ((i * 37) % 5) * 0.03 + aceso * 0.5})`, border: `2px solid ${aceso > 0.5 ? C.acento : 'transparent'}`, boxShadow: aceso > 0.5 ? brilho(C.acento, 0.9) : 'none', ...surge(e, 20)}}>
              <div style={{margin: '74px 14px 0', height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.3)', width: `${40 + ((i * 23) % 40)}%`}} />
            </div>
          );
        })}
      </div>
      <Etiqueta style={{position: 'absolute', left: 150, top: 480, opacity: ap(c.f, tL - 6)}}>A LEGENDA</Etiqueta>
      <Janela style={{left: 150, top: 540, width: 900, height: 360, ...surge(ap(c.f, tL - 4), 50)}} luz={0.9}>
        <div style={{padding: '34px 40px', fontFamily: MONO, fontSize: 30, lineHeight: 1.9, color: C.mudo}}>
          {['00:04  ele chega em casa', '00:19  abre a carta', '00:41  a notícia', '01:07  a cena que você procura', '01:30  o fim'].map((l, i) => (
            <div key={i} style={{color: i === 3 && acha > 0.1 ? '#141413' : C.mudo, background: i === 3 ? `rgba(242,98,46,${Math.min(1, acha * 2)})` : 'transparent', borderRadius: 8, padding: '0 14px', margin: '0 -14px'}}>{l}</div>
          ))}
        </div>
      </Janela>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <path d={`M 1050 772 C 1300 772, 1250 500, ${164 + alvo * 196 + 93} 366`} fill="none" stroke={C.acento} strokeWidth={6} strokeLinecap="round" strokeDasharray={900} strokeDashoffset={900 * (1 - acha)} style={{filter: `drop-shadow(0 0 10px ${C.acento})`}} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- Analogia: código é como uma receita ----------
export const PReceita: P = ({c}) => {
  const tC = c.t(1);
  const receita = ['1. entra o título', '2. o título cresce', '3. a câmera chega'];
  const codigo = ['titulo.entra(3)', 'titulo.cresce()', 'camera.aproxima()'];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 160, top: 250, width: 720, ...surge(ap(c.f, q(c, 'receita', 60) - 30), 50)}}>
        <Etiqueta cor={C.mudo} style={{marginBottom: 20}}>UMA RECEITA</Etiqueta>
        <div style={{background: '#f5f2ec', borderRadius: 22, padding: '40px 46px', boxShadow: '0 24px 60px rgba(0,0,0,0.6)', transform: 'rotate(-2deg)'}}>
          {receita.map((l, i) => {
            const a = rampa(c.f, tC + i * 20, tC + 8 + i * 20);
            return (
              <div key={i} style={{fontFamily: SANS, fontWeight: 800, fontSize: 50, color: '#141413', padding: '14px 18px', margin: '0 -18px', borderRadius: 12, background: `rgba(242,98,46,${a * 0.35})`}}>{l}</div>
            );
          })}
        </div>
      </div>
      <div style={{position: 'absolute', left: 1020, top: 250, width: 740, ...surge(ap(c.f, 6), 50)}}>
        <Etiqueta style={{marginBottom: 20}}>O CÓDIGO</Etiqueta>
        <Janela titulo="cena.tsx" style={{position: 'relative', width: 740, height: 370}} luz={1}>
          <div style={{padding: '34px 40px'}}>
            {codigo.map((l, i) => {
              const a = rampa(c.f, tC + 6 + i * 20, tC + 14 + i * 20);
              return (
                <div key={i} style={{fontFamily: MONO, fontSize: 40, color: a > 0.5 ? C.acento : C.texto, padding: '16px 18px', margin: '0 -18px', borderRadius: 12, background: `rgba(242,98,46,${a * 0.14})`, textShadow: a > 0.5 ? brilho(C.acento, 0.5) : 'none'}}>{l}</div>
              );
            })}
          </div>
        </Janela>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Tudo que se mexe é código: os elementos do vídeo passam pela tela ----------
export const PTudoCodigo: P = ({c}) => {
  const itens: [string, string][] = [
    ['personagem', 'o personagem'],
    ['linha', 'a linha do tempo'],
    ['câmera', 'a câmera'],
  ];
  const tCod = q(c, 'código', 50);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 130, letterSpacing: -3, color: C.texto, ...surge(ap(c.f, 2), 30)}}>
        tudo que se mexe é <span style={{color: C.acento, textShadow: brilho(C.acento, 0.9), opacity: ap(c.f, tCod - 2, 8)}}>código</span>
      </div>
      <div style={{position: 'absolute', left: 190, right: 190, top: 470, display: 'flex', gap: 40}}>
        {itens.map(([chave, nome], i) => {
          const de = q(c, chave, c.t(1) + 10 + i * 30);
          const e = mola(c.f, de - 2, {damping: 11});
          return (
            <div key={chave} style={{flex: 1, height: 340, borderRadius: 26, background: C.cartao, border: `1px solid ${C.borda}`, transform: `scale(${Math.max(0.001, e)})`, position: 'relative', overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: 0, right: 0, top: 50, display: 'flex', justifyContent: 'center'}}>
                {i === 0 ? <Marca tam={150} style={{transform: `translateY(${Math.abs(Math.sin(c.f / 6)) * -26}px)`}} /> : null}
                {i === 1 ? (
                  <div style={{width: 380}}>
                    {[0.7, 0.45, 0.9].map((w, k) => (
                      <div key={k} style={{height: 34, borderRadius: 8, marginBottom: 14, background: C.cartaoClaro, width: `${w * 100}%`, marginLeft: `${k * 8}%`}} />
                    ))}
                    <div style={{position: 'absolute', left: 90 + ((c.f * 3) % 330), top: 40, width: 3, height: 150, background: '#fff', boxShadow: '0 0 10px #fff'}} />
                  </div>
                ) : null}
                {i === 2 ? <div style={{width: 280, height: 158, borderRadius: 14, border: `3px solid ${C.acento}`, background: 'rgba(242,98,46,0.12)', transform: `perspective(700px) rotateY(${Math.sin(c.f / 14) * 34}deg) rotateX(8deg)`}} /> : null}
              </div>
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 34, textAlign: 'center', fontFamily: MONO, fontSize: 32, color: C.texto}}>{nome}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Três movimentos: os marcadores acendem ----------
export const PMovimentos: P = ({c}) => {
  const t3 = q(c, 'três', 40);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 60}}>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 150, letterSpacing: -4, color: C.texto, ...surge(ap(c.f, 4), 40)}}>
        três <span style={{color: C.acento, textShadow: brilho(C.acento, 0.9)}}>movimentos</span>
      </div>
      <div style={{display: 'flex', gap: 50}}>
        {['instalar', 'criar a pasta', 'pedir'].map((n, i) => {
          const e = mola(c.f, t3 + i * 8, {damping: 10});
          return (
            <div key={n} style={{display: 'flex', alignItems: 'center', gap: 20, transform: `scale(${Math.max(0.001, e)})`}}>
              <div style={{width: 84, height: 84, borderRadius: 24, background: C.acento, color: '#fff', fontFamily: SANS, fontWeight: 900, fontSize: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: brilho(C.acento, 0.8)}}>{i + 1}</div>
              <div style={{fontFamily: MONO, fontSize: 34, color: C.texto}}>{n}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Um arquivo vira cinquenta: o pedido é o mesmo ----------
export const PMultiplica: P = ({c}) => {
  const t50 = q(c, 'cinquenta', 60);
  const tP = q(c, 'pedido', t50 + 30);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 200, top: 190, width: 1520, display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 16}}>
        {Array.from({length: 50}).map((_, i) => {
          const e = i === 0 ? ap(c.f, 2) : ap(c.f, t50 - 14 + i * 0.7, 10);
          return <div key={i} style={{height: 76, borderRadius: 12, border: `2px solid ${i === 0 ? C.acento : 'rgba(255,255,255,0.3)'}`, background: i === 0 ? 'rgba(242,98,46,0.2)' : 'rgba(255,255,255,0.05)', ...surge(e, 16)}} />;
        })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 720, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 110, letterSpacing: -3, color: C.texto, ...surge(ap(c.f, tP - 6), 30)}}>
        o pedido é o <span style={{color: C.acento, textShadow: brilho(C.acento, 0.9)}}>mesmo</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Pedido vago contra pedido claro ----------
export const PVagoClaro: P = ({c}) => {
  const tC = q(c, 'claro', 30);
  const claro = rampa(c.f, tC, tC + 14);
  const Lado: React.FC<{titulo: string; pedido: string; nitido: number; aceso: number}> = ({titulo, pedido, nitido, aceso}) => (
    <div style={{flex: 1, borderRadius: 28, background: C.cartao, border: `1px solid ${aceso > 0.5 ? C.acento : C.borda}`, padding: '34px 40px', boxShadow: aceso > 0.5 ? '0 0 70px rgba(242,98,46,0.3)' : 'none', opacity: 0.55 + aceso * 0.45}}>
      <div style={{fontFamily: MONO, fontSize: 28, color: aceso > 0.5 ? C.acento : C.mudo}}>{titulo}</div>
      <div style={{fontFamily: MONO, fontSize: 36, color: C.texto, marginTop: 18, minHeight: 110}}>&gt; {pedido}</div>
      <div style={{height: 250, borderRadius: 16, background: '#07090a', marginTop: 20, position: 'relative', overflow: 'hidden', filter: `blur(${(1 - nitido) * 9}px)`}}>
        <div style={{position: 'absolute', left: 40, top: 40, fontFamily: SANS, fontWeight: 900, fontSize: 56, color: C.texto}}>Título</div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 34, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 40, color: '#fff'}}>
          legenda <span style={{color: C.acento}}>no centro</span>
        </div>
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 150, right: 150, top: 200, display: 'flex', gap: 40, ...surge(ap(c.f, 2), 40)}}>
        <Lado titulo="pedido vago" pedido="deixa legal" nitido={0} aceso={1 - claro} />
        <Lado titulo="pedido claro" pedido="legenda branca no centro, título no segundo 3" nitido={claro} aceso={claro} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- Da pasta para o mundo ----------
export const PMundo: P = ({c}) => {
  const tM = q(c, 'mundo', c.dur - 30);
  const vai = rampa(c.f, c.t(1) + 6, tM, power4InOut);
  return (
    <AbsoluteFill>
      <Etiqueta style={{position: 'absolute', left: 0, right: 0, top: 190, justifyContent: 'center', opacity: ap(c.f, 0)}}>FALTA SÓ UMA COISA</Etiqueta>
      <div style={{position: 'absolute', left: 300, top: 400, width: 300, height: 230, borderRadius: 26, border: `4px solid rgba(255,255,255,0.4)`, background: 'rgba(255,255,255,0.05)', ...surge(ap(c.f, 4), 30)}}>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: -60, textAlign: 'center', fontFamily: MONO, fontSize: 32, color: C.mudo}}>a pasta</div>
      </div>
      <div style={{position: 'absolute', left: 1180, top: 310, width: 500, height: 400, borderRadius: 30, border: `4px solid ${vai > 0.9 ? C.acento : 'rgba(255,255,255,0.25)'}`, boxShadow: vai > 0.9 ? brilho(C.acento, 1.1) : 'none', ...surge(ap(c.f, 10), 30)}}>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: -60, textAlign: 'center', fontFamily: MONO, fontSize: 32, color: vai > 0.9 ? C.acento : C.mudo}}>o mundo</div>
      </div>
      <div style={{position: 'absolute', left: 350 + (1280 - 350) * vai, top: 440 - Math.sin(vai * Math.PI) * 130 - vai * 30, width: 200 + vai * 100, height: 130 + vai * 70, borderRadius: 16, background: C.acento, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: brilho(C.acento, 0.8), opacity: ap(c.f, 8)}}>
        <div style={{width: 0, height: 0, borderLeft: '44px solid #fff', borderTop: '28px solid transparent', borderBottom: '28px solid transparent', marginLeft: 12}} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- A dica dos cortes: cada trecho com o motivo ----------
export const PBilhetes: P = ({c}) => {
  const motivos = ['começo forte', 'história completa', 'frase de efeito'];
  const tE = q(c, 'explicar', 40);
  return (
    <AbsoluteFill>
      <Etiqueta style={{position: 'absolute', left: 160, top: 150, opacity: ap(c.f, 0)}}>A DICA</Etiqueta>
      <div style={{position: 'absolute', left: 160, top: 210, fontFamily: SANS, fontWeight: 900, fontSize: 86, letterSpacing: -2, color: C.texto, width: 900, lineHeight: 1.05, ...surge(ap(c.f, 4), 30)}}>
        peça o <span style={{color: C.acento, textShadow: brilho(C.acento, 0.8)}}>motivo</span> de cada trecho
      </div>
      <div style={{position: 'absolute', left: 160, top: 470, display: 'flex', gap: 70}}>
        {motivos.map((m, i) => (
          <div key={m} style={{display: 'flex', alignItems: 'center', gap: 24, ...surge(ap(c.f, tE + i * 14), 40)}}>
            <div style={{width: 150, height: 290, borderRadius: 22, border: '3px solid rgba(255,255,255,0.22)', overflow: 'hidden', background: '#0c0e10'}}>
              <Quadro desenhar={cenaLegenda} f={c.f + i * 9} w={312} h={632} style={{width: '100%', height: '100%'}} />
            </div>
            <div style={{fontFamily: MONO, fontSize: 30, color: '#141413', background: '#f5f2ec', borderRadius: 14, padding: '14px 20px', transform: `rotate(${i % 2 ? 2 : -2}deg)`, width: 190}}>{m}</div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 160, top: 820, fontFamily: MONO, fontSize: 36, color: C.mudo, ...surge(ap(c.f, c.t(2)), 20)}}>você aprova antes de eu gerar o arquivo final</div>
    </AbsoluteFill>
  );
};

// ---------- Gravação crua, cheia de erro ----------
export const PCrua: P = ({c}) => (
  <AbsoluteFill>
    <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 96, letterSpacing: -2, color: C.texto, ...surge(ap(c.f, c.t(1) - 6), 30)}}>
      e se você só tem a gravação <span style={{color: C.acento, textShadow: brilho(C.acento, 0.8)}}>crua</span>?
    </div>
    {Array.from({length: 7}).map((_, i) => {
      const e = mola(c.f, 6 + i * 5, {damping: 10});
      return (
        <div key={i} style={{position: 'absolute', left: 190 + i * 225, top: 470 + ((i * 53) % 130), transform: `rotate(${((i * 37) % 30) - 15}deg) scale(${Math.max(0.001, e)})`, fontFamily: MONO, fontSize: 24, color: C.mudo, border: `2px solid ${i % 3 === 1 ? C.erro : 'rgba(255,255,255,0.3)'}`, background: C.cartao, borderRadius: 16, padding: '56px 18px 18px', width: 190}}>
          gravacao_{String(i + 1).padStart(2, '0')}.mp4
          {i % 3 === 1 ? <div style={{color: C.erro, marginTop: 8}}>erro</div> : null}
        </div>
      );
    })}
  </AbsoluteFill>
);

// ---------- A parte chata: ouvir tudo de novo ----------
export const PFone: P = ({c}) => {
  const tO = q(c, 'ouvir', c.t(1));
  const tS = c.t(2);
  const lento = rampa(c.f, tO, tS, (n) => n) * 0.34;
  const troca = rampa(c.f, tS + 4, tS + 22, power4InOut);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 200, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 110, letterSpacing: -3, color: C.texto, ...surge(ap(c.f, 4), 30)}}>
        a parte mais <span style={{color: C.acento, textShadow: brilho(C.acento, 0.9)}}>chata</span>
      </div>
      <div style={{position: 'absolute', left: 300, right: 300, top: 470, ...surge(ap(c.f, tO - 6), 30)}}>
        <div style={{display: 'flex', fontFamily: MONO, fontSize: 34, color: C.mudo, marginBottom: 18}}>
          <span>{troca < 0.5 ? 'você, ouvindo tudo de novo' : 'o Claude, lendo o texto'}</span>
          <span style={{marginLeft: 'auto', color: troca < 0.5 ? C.texto : C.acento}}>{troca < 0.5 ? `${Math.round(lento * 60)} min de 60` : 'pronto'}</span>
        </div>
        <div style={{height: 70, borderRadius: 18, background: 'rgba(255,255,255,0.07)', overflow: 'hidden'}}>
          <div style={{width: `${Math.max(lento, troca) * 100}%`, height: '100%', background: troca > 0.5 ? C.acento : C.texto, boxShadow: troca > 0.5 ? brilho(C.acento, 1) : 'none'}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 84, color: C.texto, ...surge(ap(c.f, tS + 16), 30)}}>deixa de ser sua</div>
    </AbsoluteFill>
  );
};

// ---------- A balança: a parte repetitiva vai para o Claude, a ideia fica com você ----------
export const PBalanca: P = ({c}) => {
  const tI = q(c, 'ideia', c.t(1));
  const tD = c.t(2);
  const tarefas = ['ouvir tudo de novo', 'tirar silêncio', 'legendar'];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 150, top: 220, width: 760, ...surge(ap(c.f, 4), 40)}}>
        <Etiqueta cor={C.mudo} style={{marginBottom: 24}}>A PARTE REPETITIVA · FICA COMIGO</Etiqueta>
        {tarefas.map((t, i) => {
          const e = ap(c.f, 12 + i * 12);
          return (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 22, fontFamily: SANS, fontWeight: 800, fontSize: 50, color: C.texto, background: C.cartao, border: `1px solid ${C.borda}`, borderRadius: 20, padding: '24px 30px', marginBottom: 20, ...surge(e, 30)}}>
              <Marca tam={54} />
              {t}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 1040, top: 220, width: 730, ...surge(ap(c.f, tI - 30), 40)}}>
        <Etiqueta style={{marginBottom: 24}}>A PARTE QUE É SUA</Etiqueta>
        <div style={{height: 330, borderRadius: 30, border: `2px solid ${C.acento}`, background: 'rgba(242,98,46,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 170, letterSpacing: -5, color: C.acento, textShadow: brilho(C.acento, 1.1), boxShadow: '0 0 90px rgba(242,98,46,0.3)', transform: `scale(${0.9 + mola(c.f, tI - 2, {damping: 9}) * 0.1})`}}>
          <span style={{opacity: ap(c.f, tI - 2, 8)}}>a ideia</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 96, letterSpacing: -2, color: C.texto, ...surge(ap(c.f, tD), 30)}}>
        eu corto, <span style={{color: C.acento}}>você decide</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Saudação e despedida ----------
export const PSaudacao: P<{linha1: string; linha2: string; quando2: number}> = ({c, linha1, linha2, quando2}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 34}}>
    <Marca tam={190} style={{transform: `scale(${mola(c.f, 0, {damping: 9}) * (1 + Math.sin(c.f / 9) * 0.03)})`}} />
    <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 130, letterSpacing: -3, color: C.texto, ...surge(ap(c.f, 6), 30)}}>{linha1}</div>
    <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 100, letterSpacing: -2, color: C.acento, textShadow: brilho(C.acento, 0.9), ...surge(ap(c.f, c.t(quando2)), 30)}}>{linha2}</div>
  </AbsoluteFill>
);

// ---------- Canal dark ----------
export const PCanalDark: P = ({c}) => (
  <AbsoluteFill>
    <div style={{position: 'absolute', left: 250, top: 250, width: 520, height: 520, borderRadius: 50, background: '#07090b', border: `1px solid ${C.borda}`, overflow: 'hidden', ...surge(ap(c.f, 2), 40)}}>
      <div style={{position: 'absolute', left: 170, top: 110, width: 180, height: 180, borderRadius: 90, background: '#22272c'}} />
      <div style={{position: 'absolute', left: 80, top: 320, width: 360, height: 360, borderRadius: 180, background: '#22272c'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 130, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 130, color: C.acento, opacity: 0.6 + Math.sin(c.f / 7) * 0.4}}>?</div>
    </div>
    <div style={{position: 'absolute', left: 870, top: 330, fontFamily: SANS, fontWeight: 900, fontSize: 170, letterSpacing: -5, color: C.texto, ...surge(ap(c.f, q(c, 'canal', 30) - 4), 30)}}>
      canal <span style={{color: C.acento, textShadow: brilho(C.acento, 1)}}>dark</span>
    </div>
    <div style={{position: 'absolute', left: 876, top: 560, fontFamily: MONO, fontSize: 40, color: C.mudo, ...surge(ap(c.f, c.t(1)), 20)}}>assunto para outro vídeo</div>
  </AbsoluteFill>
);
