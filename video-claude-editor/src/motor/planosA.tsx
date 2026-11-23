import React from 'react';
import {AbsoluteFill} from 'remotion';
import {expoOut, mola, power2Out, power4InOut, rampa} from '../anim';
import {C, Etiqueta, Janela, Marca, MONO, SANS, brilho} from '../dois/base';
import type {Ctx} from './motor';

// Peças de animação 2D usadas nas cenas. Cada uma recebe "c", com o quadro atual e os tempos das frases.
type P<T = object> = React.FC<{c: Ctx} & T>;
export const surge = (e: number, dy = 40): React.CSSProperties => ({opacity: e, transform: `translateY(${(1 - e) * dy}px) scale(${0.94 + e * 0.06})`, filter: e < 0.98 ? `blur(${((1 - e) * 8).toFixed(1)}px)` : undefined});
export const ap = (f: number, de: number, n = 14) => rampa(f, de, de + n, expoOut);
const limpa = (x: string) => x.replace(/\*/g, '');

// ---------- Frase grande: as palavras entram quando são ditas ----------
// texto: palavras separadas por espaço; "*" marca a cor de destaque; "|" quebra a linha.
export const PFrase: P<{texto: string; etiqueta?: string; tam?: number; marca?: boolean; sub?: string; subEm?: number; subFrase?: number}> = ({c, texto, etiqueta, tam = 130, marca, sub, subEm, subFrase}) => {
  const linhas = texto.split('|').map((l) => l.trim().split(' '));
  const vistos: Record<string, number> = {};
  let i = 0;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 26}}>
      {marca ? <Marca tam={120} style={{marginBottom: 20, transform: `scale(${mola(c.f, 0, {damping: 10})})`}} /> : null}
      {etiqueta ? <Etiqueta style={{opacity: ap(c.f, 0)}}>{etiqueta}</Etiqueta> : null}
      {linhas.map((palavras, li) => (
        <div key={li} style={{fontFamily: SANS, fontWeight: 900, fontSize: tam, letterSpacing: -3, lineHeight: 1.02, textAlign: 'center'}}>
          {palavras.map((p) => {
            const chave = limpa(p).toLowerCase();
            const n = vistos[chave] ?? 0;
            vistos[chave] = n + 1;
            const falada = c.p(limpa(p), n);
            const de = falada > 0 ? falada : 2 + i * 4;
            i++;
            const e = ap(c.f, de - 1, 9);
            const cor = p.startsWith('*');
            return (
              <span key={`${li}${i}`} style={{display: 'inline-block', marginRight: '0.24em', opacity: e, transform: `translateY(${(1 - e) * 26}px)`, filter: e < 0.98 ? `blur(${((1 - e) * 10).toFixed(1)}px)` : undefined, color: cor ? C.acento : C.texto, textShadow: cor ? brilho(C.acento, 0.9) : 'none'}}>
                {limpa(p)}
              </span>
            );
          })}
        </div>
      ))}
      {sub ? <div style={{fontFamily: MONO, fontSize: 34, color: C.mudo, ...surge(ap(c.f, subFrase !== undefined ? c.t(subFrase) : subEm ?? 20))}}>{sub}</div> : null}
    </AbsoluteFill>
  );
};

// ---------- Janela do Claude Code: pedido digitado e linhas de trabalho ----------
export type LinhaLog = [string, number | string, number?]; // [texto, frase (ou palavra) em que aparece, frase em que fica pronta]
export const PTerminal: P<{pedido?: string; pedidoEm?: number; linhas?: LinhaLog[]; rotulo?: string; tam?: number; larg?: number}> = ({c, pedido, pedidoEm = 0, linhas = [], rotulo, tam = 46, larg = 1500}) => {
  const ini = c.t(pedidoEm);
  const letras = pedido ? Math.max(0, Math.min(pedido.length, Math.floor((c.f - ini - 2) * 0.82))) : 0;
  const alt = 190 + (pedido ? 110 : 0) + linhas.length * (tam + 34);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: larg, ...surge(ap(c.f, 0))}}>
        {rotulo ? <Etiqueta style={{marginBottom: 22}}>{rotulo}</Etiqueta> : null}
        <Janela titulo="claude code · ~/meus-videos" style={{position: 'relative', width: larg, height: alt}} luz={1.1}>
          <div style={{padding: '44px 50px', fontFamily: MONO, fontSize: tam, color: C.texto}}>
            {pedido ? (
              <div style={{whiteSpace: 'pre-wrap', lineHeight: 1.3, marginBottom: 34}}>
                <span style={{color: C.acento}}>&gt; </span>
                {pedido.slice(0, letras)}
                <span style={{color: C.acento, opacity: Math.floor(c.f / 7) % 2 ? 1 : 0.2}}>▌</span>
              </div>
            ) : null}
            {linhas.map(([txt, em, pronto], i) => {
              const de = typeof em === 'string' ? c.p(em) || 10 + i * 12 : c.t(em) + (em === 0 && !pedido ? 4 + i * 5 : 0);
              const e = ap(c.f, de);
              const ok = pronto !== undefined ? c.f >= c.t(pronto) : c.f >= de + 34;
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 26, fontSize: tam * 0.78, opacity: e, transform: `translateX(${(1 - e) * 30}px)`}}>
                  <span style={{width: 16, height: 16, borderRadius: 8, background: ok ? C.texto : C.acento, boxShadow: ok ? 'none' : `0 0 16px ${C.acento}`, opacity: ok ? 1 : 0.55 + 0.45 * Math.sin(c.f / 2.5)}} />
                  <span style={{color: ok ? C.mudo : C.texto}}>{txt}</span>
                  {ok ? <span style={{marginLeft: 'auto', color: C.acento}}>pronto</span> : null}
                </div>
              );
            })}
          </div>
        </Janela>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Cartões em fileira ou grade ----------
export type Cartao = {n?: string; titulo: string; sub?: string; selo?: string};
export const PCartoes: P<{etiqueta?: string; cartoes: Cartao[]; quando: (number | string)[]; colunas?: number; foco?: boolean; titulo?: string; tamTitulo?: number}> = ({c, etiqueta, cartoes, quando, colunas, foco = true, titulo, tamTitulo = 56}) => {
  const col = colunas ?? cartoes.length;
  const tempos = cartoes.map((_, i) => {
    const q = quando[i];
    return typeof q === 'string' ? c.p(q) || 10 + i * 14 : c.t(q);
  });
  // cartões que entram na mesma frase entram em cascata
  const cascata = cartoes.map((_, i) => tempos[i] + cartoes.slice(0, i).filter((__, k) => quando[k] === quando[i]).length * 5);
  const atual = cascata.reduce((a, t, i) => (c.f >= t ? i : a), -1);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      <div style={{width: 1660, transform: `scale(${col <= 2 ? 1.0 : 1})`, zoom: col <= 2 ? 1.0 : 1}}>
        {titulo ? <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 84, color: C.texto, letterSpacing: -2, marginBottom: 14, ...surge(ap(c.f, 0))}}>{titulo}</div> : null}
        {etiqueta ? <Etiqueta style={{marginBottom: 30, opacity: ap(c.f, 0)}}>{etiqueta}</Etiqueta> : null}
        <div style={{display: 'grid', gridTemplateColumns: `repeat(${col}, 1fr)`, gap: 30}}>
          {cartoes.map((ca, i) => {
            const e = ap(c.f, cascata[i], 16);
            const ativo = foco && i === atual;
            return (
              <div key={i} style={{minHeight: col <= 2 ? 330 : col === 3 ? 300 : 260, borderRadius: 26, background: C.cartao, border: `1px solid ${ativo ? C.acento : C.borda}`, padding: '30px 34px', position: 'relative', boxShadow: ativo ? `0 0 60px rgba(242,98,46,0.3), 0 20px 50px rgba(0,0,0,0.5)` : '0 20px 50px rgba(0,0,0,0.5)', ...surge(e, 60), opacity: e * (foco && atual >= 0 && !ativo ? 0.62 : 1)}}>
                {ca.n ? <div style={{fontFamily: MONO, fontSize: 30, color: C.acento}}>{ca.n}</div> : null}
                <div style={{fontFamily: SANS, fontWeight: 900, fontSize: tamTitulo * (col <= 2 ? 1.35 : col === 3 ? 1.12 : 1), color: C.texto, marginTop: ca.n ? 26 : 6, letterSpacing: -1.5, lineHeight: 1.08}}>{ca.titulo}</div>
                {ca.sub ? <div style={{fontFamily: MONO, fontSize: col <= 3 ? 34 : 28, color: C.mudo, marginTop: 16, lineHeight: 1.35}}>{ca.sub}</div> : null}
                {ca.selo ? <div style={{display: 'inline-block', marginTop: 22, fontFamily: MONO, fontSize: 26, color: '#141413', background: C.acento, borderRadius: 12, padding: '6px 18px', boxShadow: brilho(C.acento, 0.6)}}>{ca.selo}</div> : null}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Comparação: o chat de um lado, o Claude Code dentro de uma pasta do outro ----------
export const PComparar: P<{chatEm: number; codeEm: number}> = ({c, chatEm, codeEm}) => {
  const a = ap(c.f, c.t(chatEm) - 6, 16);
  const b = ap(c.f, c.t(codeEm) - 4, 16);
  const troca = rampa(c.f, c.t(codeEm), c.t(codeEm) + 16, power2Out);
  const perg = ap(c.f, c.p('pergunta') || c.t(chatEm) + 20);
  const resp = ap(c.f, c.p('respondo') || c.t(chatEm) + 44);
  const arquivos = ['bruto_01.mp4', 'bruto_02.mp4', 'roteiro.txt', 'cortes.json', 'video_final.mp4'];
  return (
    <AbsoluteFill style={{transform: 'translateY(10px)'}}>
      <div style={{position: 'absolute', left: 130, top: 190, width: 780, ...surge(a), opacity: a * (1 - troca * 0.62), filter: troca > 0.05 ? `saturate(${1 - troca}) blur(${troca * 2}px)` : undefined}}>
        <Etiqueta cor={C.mudo} style={{marginBottom: 20}}>CLAUDE NO CHAT</Etiqueta>
        <Janela style={{position: 'relative', width: 780, height: 560}} luz={0.3}>
          <div style={{padding: 44, display: 'flex', flexDirection: 'column', gap: 30}}>
            <div style={{alignSelf: 'flex-end', background: '#262b30', color: C.texto, fontFamily: SANS, fontWeight: 700, fontSize: 34, padding: '22px 30px', borderRadius: 26, ...surge(perg)}}>como eu corto um vídeo?</div>
            <div style={{alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.borda}`, borderRadius: 26, padding: '24px 30px', width: 560, ...surge(resp)}}>
              {[1, 0.86, 0.94, 0.6].map((w, i) => (
                <div key={i} style={{height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.22)', width: `${w * 100}%`, marginBottom: 16}} />
              ))}
            </div>
            <div style={{fontFamily: MONO, fontSize: 28, color: C.mudo, ...surge(resp)}}>resposta: só texto</div>
          </div>
        </Janela>
      </div>
      <div style={{position: 'absolute', left: 1010, top: 190, width: 780, ...surge(b)}}>
        <Etiqueta style={{marginBottom: 20}}>CLAUDE CODE</Etiqueta>
        <Janela titulo="~/meus-videos" style={{position: 'relative', width: 780, height: 560}} luz={1.4}>
          <div style={{padding: '36px 44px'}}>
            {arquivos.map((n, i) => {
              const e = ap(c.f, c.t(codeEm) + 14 + i * 5);
              const novo = i >= 3;
              return (
                <div key={n} style={{display: 'flex', alignItems: 'center', gap: 20, fontFamily: MONO, fontSize: 32, color: novo ? C.acento : C.texto, marginBottom: 26, ...surge(e, 20)}}>
                  <span style={{width: 34, height: 26, borderRadius: 6, border: `2px solid ${novo ? C.acento : C.mudo}`}} />
                  {n}
                  {novo ? <span style={{marginLeft: 'auto', fontSize: 24, color: C.mudo}}>criado por mim</span> : null}
                </div>
              );
            })}
          </div>
        </Janela>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Pasta do computador: criar, arrastar os vídeos, dividir em três, travar os originais ----------
const Arquivo: React.FC<{nome: string; cor?: string; tam?: number}> = ({nome, cor = C.texto, tam = 1}) => (
  <div style={{width: 170 * tam, textAlign: 'center'}}>
    <div style={{width: 130 * tam, height: 92 * tam, margin: '0 auto', borderRadius: 14, border: `2px solid ${cor}`, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 0, height: 0, borderLeft: `${26 * tam}px solid ${cor}`, borderTop: `${16 * tam}px solid transparent`, borderBottom: `${16 * tam}px solid transparent`, marginLeft: 8}} />
    </div>
    <div style={{fontFamily: MONO, fontSize: 22 * tam, color: C.mudo, marginTop: 10}}>{nome}</div>
  </div>
);
const Pasta: React.FC<{nome: string; aceso?: number; trava?: number; tam?: number}> = ({nome, aceso = 0, trava = 0, tam = 1}) => (
  <div style={{width: 300 * tam, textAlign: 'center', position: 'relative'}}>
    <svg width={220 * tam} height={170 * tam} viewBox="0 0 220 170" style={{filter: aceso > 0.05 ? `drop-shadow(0 0 ${30 * aceso}px rgba(242,98,46,0.7))` : undefined}}>
      <path d="M10 30 Q10 14 26 14 L84 14 L104 36 L194 36 Q210 36 210 52 L210 144 Q210 160 194 160 L26 160 Q10 160 10 144 Z" fill={aceso > 0.5 ? 'rgba(242,98,46,0.22)' : 'rgba(255,255,255,0.06)'} stroke={aceso > 0.5 ? C.acento : 'rgba(255,255,255,0.4)'} strokeWidth={4} />
    </svg>
    {trava > 0.05 ? (
      <svg width={64 * tam} height={74 * tam} viewBox="0 0 64 74" style={{position: 'absolute', left: '50%', top: 62 * tam, marginLeft: -32 * tam, transform: `scale(${trava})`}}>
        <path d="M16 32 L16 22 Q16 6 32 6 Q48 6 48 22 L48 32" fill="none" stroke={C.texto} strokeWidth={7} />
        <rect x={8} y={32} width={48} height={36} rx={8} fill={C.texto} />
      </svg>
    ) : null}
    <div style={{fontFamily: MONO, fontSize: 30 * tam, color: aceso > 0.5 ? C.acento : C.texto, marginTop: 6}}>{nome}</div>
  </div>
);

export const PPasta: P<{criar?: number; arrastar?: number; legenda?: string; legendaEm?: number}> = ({c, criar = 0, arrastar = 0, legenda, legendaEm = 2}) => {
  const pasta = mola(c.f, c.t(criar) + 4, {damping: 11});
  const ini = c.p('arrast') || c.t(arrastar) + 30;
  return (
    <AbsoluteFill>
      <Janela titulo="computador · área de trabalho" style={{left: 210, top: 150, width: 1500, height: 780}} luz={0.6}>
        <div style={{position: 'absolute', left: 620, top: 250, transform: `scale(${pasta})`}}>
          <Pasta nome="meus-videos" aceso={rampa(c.f, ini + 20, ini + 40)} tam={1.25} />
        </div>
        {['gravacao_01.mp4', 'gravacao_02.mp4', 'gravacao_03.mp4'].map((n, i) => {
          const e = ap(c.f, 8 + i * 4);
          const vai = rampa(c.f, ini + i * 7, ini + 22 + i * 7, power4InOut);
          const x0 = 90 + i * 60;
          const y0 = 110 + i * 190;
          return (
            <div key={n} style={{position: 'absolute', left: x0 + (760 - x0) * vai, top: y0 + (330 - y0) * vai - Math.sin(vai * Math.PI) * 70, opacity: e * (1 - rampa(vai, 0.8, 1)), transform: `scale(${1 - vai * 0.55})`}}>
              <Arquivo nome={n} />
            </div>
          );
        })}
        {legenda ? <div style={{position: 'absolute', left: 0, right: 0, bottom: 54, textAlign: 'center', fontFamily: MONO, fontSize: 32, color: C.texto, ...surge(ap(c.f, c.t(legendaEm)), 20)}}>{legenda}</div> : null}
        {c.f >= ini - 4 && c.f < ini + 46 ? (
          <svg width={48} height={64} viewBox="0 0 64 84" style={{position: 'absolute', left: 160 + (840 - 160) * rampa(c.f, ini, ini + 36, power4InOut), top: 420 + (460 - 420) * rampa(c.f, ini, ini + 36)}}>
            <path d="M4 2 L4 62 L20 48 L31 74 L42 69 L31 44 L52 44 Z" fill="#fff" stroke="#141413" strokeWidth={3} strokeLinejoin="round" />
          </svg>
        ) : null}
      </Janela>
    </AbsoluteFill>
  );
};

// A pasta por dentro: três partes, originais travados, cada corte gera um arquivo novo.
export const PPastaDentro: P<{dividir: number; travar?: number; novo?: number; prontas?: boolean; aviso?: string; avisoEm?: number; denovo?: number}> = ({c, dividir, travar, novo, prontas, aviso, avisoEm = 1, denovo}) => {
  const nomes = ['bruto', 'trabalho', 'pronto'];
  const tTrava = travar !== undefined ? c.t(travar) : 99999;
  const tNovo = novo !== undefined ? c.t(novo) : 99999;
  return (
    <AbsoluteFill>
      <Janela titulo="~/meus-videos" style={{left: 210, top: 170, width: 1500, height: 740}} luz={0.9}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center', gap: 130}}>
          {nomes.map((n, i) => {
            const falada = prontas ? 0 : c.p(n);
            const e = mola(c.f, (falada || c.t(dividir) + 10) + (falada ? 0 : i * 8) - 2, {damping: 11});
            return (
              <div key={n} style={{transform: `scale(${e})`}}>
                <Pasta nome={n} aceso={i === 0 ? rampa(c.f, tTrava, tTrava + 12) * 0.2 : i === 1 ? rampa(c.f, tNovo, tNovo + 14) : 0} trava={i === 0 ? mola(c.f, tTrava + 6, {damping: 9}) * (c.f >= tTrava ? 1 : 0) : 0} tam={1.15} />
              </div>
            );
          })}
        </div>
        {c.f >= tNovo ? (
          <div style={{position: 'absolute', left: 620, top: 440, display: 'flex', gap: 30}}>
            {['corte_v1.mp4', 'corte_v2.mp4'].map((n, i) => (
              <div key={n} style={surge(ap(c.f, tNovo + 6 + i * 26))}>
                <Arquivo nome={n} cor={C.acento} tam={0.95} />
              </div>
            ))}
          </div>
        ) : null}
        {aviso ? <div style={{position: 'absolute', left: 0, right: 0, top: 500, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 60, color: C.texto, ...surge(ap(c.f, c.t(avisoEm)), 30)}}>{aviso}</div> : null}
        {denovo !== undefined && c.f >= c.t(denovo) ? (
          <div style={{position: 'absolute', left: 1130, top: 420, display: 'flex', alignItems: 'center', gap: 22, ...surge(ap(c.f, c.t(denovo)), 30)}}>
            <svg width={110} height={110} viewBox="-50 -50 100 100" style={{transform: `rotate(${-(c.f - c.t(denovo)) * 7}deg)`}}>
              <path d="M 34 0 A 34 34 0 1 1 10 -32" fill="none" stroke={C.acento} strokeWidth={9} strokeLinecap="round" />
              <path d="M 0 -48 L 22 -32 L 0 -14 Z" fill={C.acento} />
            </svg>
            <div style={{fontFamily: MONO, fontSize: 32, color: C.texto}}>é só pedir<br />de novo</div>
          </div>
        ) : null}
        {c.f >= tTrava ? <div style={{position: 'absolute', left: 150, top: 470, fontFamily: MONO, fontSize: 28, color: C.mudo, width: 360, textAlign: 'center', ...surge(ap(c.f, tTrava + 16))}}>originais guardados</div> : null}
      </Janela>
    </AbsoluteFill>
  );
};
