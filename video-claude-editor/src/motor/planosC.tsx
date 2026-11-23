import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile} from 'remotion';
import {chegadaRampa, expoOut, mola, power2Out, power4InOut, rampa, somar, trilho} from '../anim';
import {C, Etiqueta, Janela, Marca, MONO, Quadro, SANS, brilho} from '../dois/base';
import {cenaHistoria, cenaLegenda} from '../papel';
import {Palco, TEMAS, Destaque} from '../cenas/mundo';
import {Mascote3D} from '../tres/Mascote3D';
import {Bloco} from '../tres/pecas';
import {Texto3D} from '../tres/Rotulo';
import type {Ctx} from './motor';
import {ap, surge} from './planosA';
import {altura} from './planosB';
import * as THREE from 'three';

type P<T = object> = React.FC<{c: Ctx} & T>;

// ---------- Código de um lado, a cena do outro: muda um número, a cena muda ----------
export const PCodigo: P<{mudar: number; rotulo?: string}> = ({c, mudar, rotulo = 'REMOTION'}) => {
  const tM = c.p('mudo') || c.t(mudar) + 10;
  const k = rampa(c.f, tM + 14, tM + 34, power4InOut);
  const x = Math.round(300 + 520 * k);
  const linhas: [string, string][] = [
    ['const', ' entra = mola(quadro, 8);'],
    ['const', ` x = ${x};`],
    ['', ''],
    ['return', ' ('],
    ['', '  <Bloco posicao={[x, 300]}'],
    ['', '    escala={entra} />'],
    ['', ');'],
  ];
  return (
    <AbsoluteFill>
      <Etiqueta style={{position: 'absolute', left: 130, top: 150, opacity: ap(c.f, 0)}}>{rotulo}</Etiqueta>
      <Janela titulo="abertura.tsx" style={{left: 130, top: 210, width: 800, height: 620, ...surge(ap(c.f, 2))}} luz={0.7}>
        <div style={{padding: '38px 44px', fontFamily: MONO, fontSize: 34, lineHeight: 1.75, color: C.texto, whiteSpace: 'pre'}}>
          {linhas.map(([a, b], i) => (
            <div key={i} style={{background: i === 1 && c.f >= tM ? `rgba(242,98,46,${0.2 * (1 - rampa(c.f, tM + 50, tM + 70))})` : 'transparent', borderRadius: 8, padding: '0 10px', margin: '0 -10px'}}>
              <span style={{color: C.acento}}>{a}</span>
              {b || ' '}
            </div>
          ))}
        </div>
      </Janela>
      <Janela titulo="o vídeo" style={{left: 990, top: 210, width: 800, height: 620, ...surge(ap(c.f, 8))}} luz={1.1}>
        <div style={{position: 'absolute', left: 30, right: 30, top: 74, bottom: 30, borderRadius: 12, background: '#07090a', overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 40, right: 40, top: 280, height: 2, background: 'rgba(255,255,255,0.14)'}} />
          <div style={{position: 'absolute', left: 30 + (x - 300) * 0.98, top: 190, transform: `scale(${mola(c.f, 14, {damping: 9})})`}}>
            <Marca tam={150} />
          </div>
          <div style={{position: 'absolute', left: 40, bottom: 30, fontFamily: MONO, fontSize: 26, color: C.mudo}}>x = {x}</div>
        </div>
      </Janela>
    </AbsoluteFill>
  );
};

// ---------- Quadro por quadro: o Remotion desenha cada imagem e entrega o vídeo ----------
export const PQuadros: P<{rotulo?: string}> = ({c, rotulo = 'QUADRO POR QUADRO'}) => {
  const n = 9;
  const prog = rampa(c.f, 10, Math.max(40, c.dur - 30), (v) => v);
  return (
    <AbsoluteFill>
      <Etiqueta style={{position: 'absolute', left: 130, top: 250, opacity: ap(c.f, 0)}}>{rotulo}</Etiqueta>
      <div style={{position: 'absolute', left: 130, top: 320, display: 'flex', gap: 14}}>
        {Array.from({length: n}).map((_, i) => {
          const feito = prog * n >= i + 0.3;
          return (
            <div key={i} style={{width: 170, height: 110, borderRadius: 12, border: `2px solid ${feito ? C.acento : C.borda}`, background: feito ? 'rgba(242,98,46,0.12)' : 'rgba(255,255,255,0.03)', position: 'relative', overflow: 'hidden', boxShadow: feito && prog * n < i + 1.3 ? brilho(C.acento, 0.8) : 'none'}}>
              {feito ? <div style={{position: 'absolute', left: 14 + i * 13, top: 34, width: 40, height: 40, borderRadius: 10, background: C.acento}} /> : null}
              <div style={{position: 'absolute', right: 8, bottom: 6, fontFamily: MONO, fontSize: 18, color: C.mudo}}>{String(i + 1).padStart(3, '0')}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 130, top: 500, width: 1642, height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.08)'}}>
        <div style={{width: `${prog * 100}%`, height: '100%', borderRadius: 6, background: C.acento, boxShadow: brilho(C.acento, 0.8)}} />
      </div>
      <div style={{position: 'absolute', left: 130, top: 580, fontFamily: SANS, fontWeight: 900, fontSize: 96, color: C.texto, letterSpacing: -2, ...surge(ap(c.f, c.p('entrega') || c.dur - 40))}}>
        código vira <span style={{color: C.acento, textShadow: brilho(C.acento, 0.8)}}>vídeo</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Telas com vídeo passando: legenda no celular, fotos na tela larga, dez cortes ----------
const Celular: React.FC<{f: number; larg: number; semente?: number}> = ({f, larg, semente = 0}) => (
  <div style={{width: larg, height: larg * 1.94, borderRadius: larg * 0.15, border: '3px solid rgba(255,255,255,0.22)', background: '#0c0e10', padding: larg * 0.04, boxShadow: '0 0 50px rgba(242,98,46,0.2)'}}>
    <div style={{width: '100%', height: '100%', borderRadius: larg * 0.11, overflow: 'hidden'}}>
      <Quadro desenhar={cenaLegenda} f={f + semente * 7} w={312} h={632} style={{width: '100%', height: '100%'}} />
    </div>
  </div>
);
export const PDezCortes: P<{soltar: number}> = ({c, soltar}) => {
  const t0 = c.t(soltar);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 130, top: 120, width: 1660, height: 200, borderRadius: 18, border: `1px solid ${C.borda}`, background: '#101316', overflow: 'hidden', ...surge(ap(c.f, 0))}}>
        <svg width={1660} height={200}>
          {Array.from({length: 150}).map((_, k) => {
            const h = 14 + altura(k, 5) * 150;
            const escolhido = [8, 23, 37, 52, 66, 81, 95, 110, 124, 139].some((p, i) => Math.abs(k - p) < 4 && c.f >= t0 + i * 4);
            return <rect key={k} x={8 + k * 11} y={100 - h / 2} width={5} height={h} rx={2.5} fill={escolhido ? C.acento : 'rgba(255,255,255,0.3)'} />;
          })}
        </svg>
        <div style={{position: 'absolute', left: 20, top: 14, fontFamily: MONO, fontSize: 24, color: C.mudo}}>podcast.mp4 · 1:12:40</div>
      </div>
      <div style={{position: 'absolute', left: 130, right: 130, top: 400, display: 'flex', justifyContent: 'space-between'}}>
        {Array.from({length: 10}).map((_, i) => {
          const e = mola(c.f, t0 + 10 + i * 4, {damping: 12});
          return (
            <div key={i} style={{transform: `translateY(${(1 - e) * -160}px) scale(${Math.max(0.001, e)})`, opacity: Math.min(1, e * 1.4)}}>
              <Celular f={c.f} larg={148} semente={i} />
              <div style={{textAlign: 'center', fontFamily: MONO, fontSize: 24, color: C.mudo, marginTop: 12}}>{String(i + 1).padStart(2, '0')}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
export const PFotos: P = ({c}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    <div style={{width: 1240, height: 720, borderRadius: 24, border: '3px solid rgba(255,255,255,0.22)', background: '#0c0e10', padding: 14, boxShadow: '0 0 70px rgba(242,98,46,0.22)', ...surge(ap(c.f, 0))}}>
      <div style={{width: '100%', height: '100%', borderRadius: 14, overflow: 'hidden'}}>
        <Quadro desenhar={cenaHistoria} f={c.f} w={1280} h={720} style={{width: '100%', height: '100%'}} />
      </div>
    </div>
  </AbsoluteFill>
);

// ---------- Várias gravações, a mesma frase repetida três vezes, fica a melhor ----------
export const PRepetidas: P<{repetiu: number}> = ({c, repetiu}) => {
  const tR = c.t(repetiu);
  const tFica = c.p('melhor') || tR + 80;
  const frases = ['então hoje eu vou... não, peraí', 'então hoje eu vou te mostrar como', 'então hoje eu vou te mostrar como editar'];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 150, top: 150, display: 'flex', gap: 22}}>
        {['gravacao_01', 'gravacao_02', 'gravacao_03', 'gravacao_04', 'gravacao_05'].map((n, i) => (
          <div key={n} style={{fontFamily: MONO, fontSize: 26, color: C.mudo, border: `1px solid ${C.borda}`, background: C.cartao, borderRadius: 14, padding: '16px 22px', ...surge(ap(c.f, 2 + i * 4), 30)}}>
            {n}.mp4
          </div>
        ))}
      </div>
      <Etiqueta style={{position: 'absolute', left: 150, top: 300, opacity: ap(c.f, tR - 8)}}>A MESMA FRASE, TRÊS VEZES</Etiqueta>
      <div style={{position: 'absolute', left: 150, top: 360, width: 1620}}>
        {frases.map((t, i) => {
          const e = ap(c.f, tR + i * 10);
          const perde = i < 2 ? rampa(c.f, tFica - 4, tFica + 8) : 0;
          const ganha = i === 2 ? rampa(c.f, tFica, tFica + 10) : 0;
          return (
            <div key={i} style={{fontFamily: SANS, fontWeight: 800, fontSize: 56, color: ganha > 0.5 ? '#141413' : C.texto, background: ganha > 0.5 ? C.acento : C.cartao, border: `1px solid ${C.borda}`, borderRadius: 20, padding: '26px 36px', marginBottom: 24, textDecoration: perde > 0.5 ? 'line-through' : 'none', opacity: e * (1 - perde * 0.6), boxShadow: ganha > 0.5 ? brilho(C.acento, 0.9) : 'none', ...surge(e, 30)}}>
              <span style={{fontFamily: MONO, fontSize: 30, marginRight: 26, opacity: 0.7}}>take {i + 1}</span>
              {t}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Fotos tiradas do vídeo nos momentos certos ----------
export const PCapturas: P = ({c}) => {
  const tF = c.p('fotos') || 40;
  const pontos = [0.18, 0.47, 0.78];
  return (
    <AbsoluteFill>
      <Etiqueta style={{position: 'absolute', left: 150, top: 170, opacity: ap(c.f, 0)}}>QUANDO O QUE IMPORTA É A IMAGEM</Etiqueta>
      <div style={{position: 'absolute', left: 150, top: 240, width: 1620, height: 150, borderRadius: 16, border: `1px solid ${C.borda}`, background: '#101316', display: 'flex', gap: 6, padding: 8, ...surge(ap(c.f, 2))}}>
        {Array.from({length: 14}).map((_, i) => (
          <div key={i} style={{flex: 1, borderRadius: 8, background: `rgba(242,98,46,${0.06 + ((i * 37) % 5) * 0.035})`}} />
        ))}
      </div>
      {pontos.map((p, i) => {
        const de = tF + i * 16;
        const clarao = c.f >= de ? 1 - rampa(c.f, de, de + 8) : 0;
        const e = ap(c.f, de + 2, 16);
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: 150 + p * 1620 - 3, top: 226, width: 6, height: 178, background: '#fff', opacity: c.f >= de ? 1 : 0, boxShadow: `0 0 ${30 + clarao * 60}px #fff`}} />
            <div style={{position: 'absolute', left: 190 + i * 540, top: 470, width: 460, ...surge(e, -70)}}>
              <div style={{height: 259, borderRadius: 16, border: '8px solid #f5f2ec', background: `linear-gradient(${150 + i * 30}deg, #3a2a24, #f2622e ${130 + i * 20}%)`, boxShadow: '0 20px 50px rgba(0,0,0,0.6)', position: 'relative'}}>
                <div style={{position: 'absolute', left: 30, right: 120 - i * 30, bottom: 28, height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.5)'}} />
              </div>
              <div style={{fontFamily: MONO, fontSize: 26, color: C.mudo, marginTop: 14}}>foto em {['02:14', '11:40', '27:05'][i]}</div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Exportar: as camadas viram um arquivo, e a conferência ----------
export const PExportar: P<{juntar: number}> = ({c, juntar}) => {
  const t0 = c.t(juntar);
  const prog = rampa(c.f, t0 + 10, Math.min(c.dur - 20, t0 + 130), (v) => v);
  const camadas: [string, string][] = [
    ['cortes', 'cortes'],
    ['animações', 'animações'],
    ['música', 'música'],
  ];
  return (
    <AbsoluteFill>
      <Etiqueta style={{position: 'absolute', left: 220, top: 170, opacity: ap(c.f, 0)}}>EXPORTANDO</Etiqueta>
      <div style={{position: 'absolute', left: 220, top: 240, width: 1480}}>
        {camadas.map(([nome, chave], i) => {
          const e = ap(c.f, c.p(chave) || t0 + 10 + i * 14);
          return (
            <div key={nome} style={{display: 'flex', alignItems: 'center', gap: 30, marginBottom: 22, ...surge(e, 30)}}>
              <div style={{fontFamily: MONO, fontSize: 32, color: C.mudo, width: 240}}>{nome}</div>
              <div style={{flex: 1, height: 62, borderRadius: 14, background: C.cartaoClaro, border: `1px solid ${C.borda}`, overflow: 'hidden'}}>
                <div style={{width: `${prog * 100}%`, height: '100%', background: 'rgba(242,98,46,0.5)'}} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 220, top: 560, width: 1480, height: 26, borderRadius: 13, background: 'rgba(255,255,255,0.08)'}}>
        <div style={{width: `${prog * 100}%`, height: '100%', borderRadius: 13, background: C.acento, boxShadow: brilho(C.acento, 1)}} />
      </div>
      <div style={{position: 'absolute', left: 220, top: 630, right: 220, display: 'flex', alignItems: 'baseline', fontFamily: SANS, fontWeight: 900, fontSize: 120, color: C.texto, letterSpacing: -3}}>
        {Math.round(prog * 100)}%
        <span style={{marginLeft: 'auto', fontFamily: MONO, fontWeight: 400, fontSize: 40, letterSpacing: 0, color: prog >= 1 ? C.acento : C.mudo}}>video_final.mp4</span>
      </div>
    </AbsoluteFill>
  );
};

export const PConfere: P<{itens: number; fotos: number}> = ({c, itens, fotos}) => {
  const lista = ['tamanho da imagem', 'duração', 'volume do áudio'];
  const chaves = ['tamanho', 'duração', 'volume'];
  const valores = ['1920 × 1080', '09:20', '−14 LUFS'];
  const tF = c.t(fotos);
  const varre = rampa(c.f, tF + 10, Math.min(c.dur - 10, tF + 150), (v) => v);
  const ruim = 6;
  return (
    <AbsoluteFill>
      <Etiqueta style={{position: 'absolute', left: 180, top: 130, opacity: ap(c.f, 0)}}>CONFERÊNCIA</Etiqueta>
      <div style={{position: 'absolute', left: 180, top: 200, display: 'flex', gap: 30}}>
        {lista.map((n, i) => {
          const e = ap(c.f, c.p(chaves[i]) || c.t(itens) + i * 18);
          return (
            <div key={n} style={{width: 500, borderRadius: 24, background: C.cartao, border: `1px solid ${C.borda}`, padding: '28px 34px', ...surge(e, 40)}}>
              <div style={{fontFamily: MONO, fontSize: 28, color: C.mudo}}>{n}</div>
              <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 58, color: C.texto, marginTop: 10, display: 'flex', alignItems: 'center'}}>
                {valores[i]}
                <span style={{marginLeft: 'auto', color: C.acento, fontSize: 46}}>✓</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 180, top: 500, display: 'flex', gap: 16, opacity: ap(c.f, tF - 4)}}>
        {Array.from({length: 10}).map((_, i) => {
          const visto = varre * 10 >= i + 0.5;
          const problema = i === ruim && visto;
          return (
            <div key={i} style={{width: 142, height: 86, borderRadius: 10, border: `2px solid ${problema ? C.erro : visto ? 'rgba(245,242,236,0.6)' : C.borda}`, background: i === ruim ? '#000' : `rgba(242,98,46,${0.06 + ((i * 37) % 5) * 0.04})`, boxShadow: problema ? `0 0 26px ${C.erro}` : 'none', position: 'relative'}}>
              {i !== ruim ? <div style={{position: 'absolute', left: 14, right: 40 + ((i * 13) % 40), bottom: 12, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.4)'}} /> : null}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 180 + varre * 1564, top: 480, width: 4, height: 126, background: '#fff', boxShadow: '0 0 12px #fff', opacity: varre > 0 && varre < 1 ? 1 : 0}} />
      <div style={{position: 'absolute', left: 180, top: 660, display: 'flex', gap: 26, fontFamily: MONO, fontSize: 34}}>
        {['tela preta', 'texto cortado', 'legenda fora do lugar'].map((n, i) => {
          const e = ap(c.f, c.p(['preta', 'cortado', 'legenda'][i]) || tF + 60 + i * 20);
          return (
            <div key={n} style={{color: i === 0 ? C.erro : C.mudo, border: `1px solid ${i === 0 ? C.erro : C.borda}`, borderRadius: 16, padding: '14px 26px', ...surge(e, 24)}}>
              {n}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Você assiste e fala o que sentiu: cada comentário vira um ajuste ----------
export const PComentarios: P<{falas: string[]; chaves: string[]; corrige: string}> = ({c, falas, chaves, corrige}) => {
  const tC = c.p(corrige) || c.dur - 40;
  return (
    <AbsoluteFill>
      <Etiqueta style={{position: 'absolute', left: 240, top: 150, opacity: ap(c.f, 0)}}>O QUE VOCÊ SENTIU</Etiqueta>
      <div style={{position: 'absolute', left: 240, top: 220, width: 1440}}>
        {falas.map((t, i) => {
          const de = c.p(chaves[i]) || 10 + i * 40;
          const e = ap(c.f, de - 4);
          const feito = rampa(c.f, tC + i * 6, tC + 10 + i * 6);
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 30, marginBottom: 30, ...surge(e, 40)}}>
              <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 54, color: C.texto, background: '#22272c', borderRadius: '30px 30px 30px 6px', padding: '26px 40px'}}>{t}</div>
              <div style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 32, color: C.acento, opacity: feito, transform: `translateX(${(1 - feito) * 30}px)`}}>corrigido ✓</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- As versões de verdade da abertura deste vídeo ----------
export const PVersoes: P<{quando: number[]; rotulos?: string[]; chaves?: string[]; chavesRotulo?: string[]; imagens?: number[]; semNumero?: boolean; misterio?: boolean; etiqueta?: string}> = ({c, quando, rotulos = [], chaves = [], chavesRotulo = [], imagens, semNumero = false, misterio = false, etiqueta = 'A ABERTURA DESTE VÍDEO, VERSÃO POR VERSÃO'}) => {
  const n = quando.length;
  return (
    <AbsoluteFill>
      <Etiqueta style={{position: 'absolute', left: 110, top: 190, opacity: ap(c.f, 0)}}>{etiqueta}</Etiqueta>
      <div style={{position: 'absolute', left: 110, right: 110, top: 270, display: 'flex', gap: 22}}>
        {Array.from({length: n}).map((_, i) => {
          const de = (chaves[i] ? c.p(chaves[i]) : 0) || c.t(quando[i]) + (quando.filter((q, k) => k < i && q === quando[i]).length) * 8;
          const e = ap(c.f, de - 2, 16);
          const oculta = misterio && i > 0;
          const ultima = !misterio && i === n - 1;
          const riscada = !ultima && !oculta && c.f >= de + 22;
          return (
            <div key={i} style={{flex: 1, ...surge(e, 60)}}>
              <div style={{borderRadius: 16, overflow: 'hidden', border: `2px solid ${ultima ? C.acento : C.borda}`, position: 'relative', boxShadow: ultima ? brilho(C.acento, 0.9) : 'none', opacity: riscada ? 0.5 : 1}}>
                {oculta ? (
                  <div style={{aspectRatio: '16 / 9', background: C.cartaoClaro, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 90, color: C.mudo}}>?</div>
                ) : (
                  <Img src={staticFile(`versoes/v${imagens ? imagens[i] : i + 1}.jpg`)} style={{width: '100%', display: 'block'}} />
                )}
                {riscada ? (
                  <svg viewBox="0 0 100 56" preserveAspectRatio="none" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
                    <line x1={6} y1={6} x2={94} y2={50} stroke={C.erro} strokeWidth={2.5} />
                  </svg>
                ) : null}
              </div>
              {semNumero ? null : <div style={{fontFamily: MONO, fontSize: 26, color: ultima ? C.acento : C.mudo, marginTop: 14}}>{oculta ? 'passo 5' : `versão ${i + 1}`}</div>}
              {rotulos[i] ? <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, color: C.texto, marginTop: 6, lineHeight: 1.15, ...surge(ap(c.f, (chavesRotulo[i] ? c.p(chavesRotulo[i]) : 0) || de + 10), 14)}}>{rotulos[i]}</div> : null}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- A conta: quanto custa de verdade ----------
export const PConta: P<{ferramentas: number; claude: number; valor: number; nota?: string; notaEm?: number}> = ({c, ferramentas, claude, valor, nota, notaEm = 4}) => {
  const nomes = ['Whisper', 'auto-editor', 'FFmpeg', 'Remotion'];
  const tZ = c.p('zero') || c.t(ferramentas) + 30;
  const tC = c.t(claude);
  const tV = c.p('vinte') || c.t(valor) + 60;
  const tA = c.p('dezessete') || tV + 60;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 300, top: 150, width: 1320}}>
        {nomes.map((n, i) => (
          <div key={n} style={{display: 'flex', alignItems: 'baseline', fontFamily: SANS, fontWeight: 800, fontSize: 56, color: C.texto, borderBottom: `1px solid ${C.borda}`, padding: '20px 0', ...surge(ap(c.f, c.t(ferramentas) + i * 5), 30)}}>
            {n}
            <span style={{marginLeft: 'auto', fontFamily: MONO, fontWeight: 600, color: c.f >= tZ ? C.texto : C.mudo, opacity: ap(c.f, tZ + i * 3)}}>US$ 0</span>
          </div>
        ))}
        <div style={{display: 'flex', alignItems: 'baseline', fontFamily: SANS, fontWeight: 900, fontSize: 70, color: C.acento, padding: '30px 0 0', ...surge(ap(c.f, tC), 30)}}>
          Claude Pro
          <span style={{marginLeft: 'auto', fontFamily: MONO, fontWeight: 600, fontSize: 80, textShadow: brilho(C.acento, 1), opacity: ap(c.f, tV)}}>US$ 20</span>
          <span style={{fontFamily: MONO, fontSize: 34, color: C.mudo, marginLeft: 16, opacity: ap(c.f, tV)}}>por mês</span>
        </div>
        <div style={{textAlign: 'right', fontFamily: MONO, fontSize: 36, color: C.mudo, marginTop: 12, ...surge(ap(c.f, tA), 20)}}>
          ou <span style={{color: C.texto}}>US$ 17</span> por mês no plano anual
        </div>
        {nota ? <div style={{textAlign: 'right', fontFamily: MONO, fontSize: 30, color: C.mudo, marginTop: 26, ...surge(ap(c.f, c.t(notaEm)), 20)}}>{nota}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Momento 3D: a escada, com o mascote subindo até o degrau do passo ----------
const DEG = [0, 1, 2].map((i) => ({x: -3.4 + i * 3.4, h: (i + 1) * 1.15}));
const Degraus: React.FC<{acesos: number[]}> = ({acesos}) => (
  <>
    {DEG.map((d, i) => {
      const cor = new THREE.Color('#15191c').lerp(new THREE.Color('#ea7648'), acesos[i]).getStyle();
      return (
        <group key={i} position={[d.x, 0, 0]}>
          <Bloco tam={[3.3, d.h, 3.2]} cor={cor} raio={0.12} posicao={[0, d.h / 2, 0]} emissivo="#d2470f" intensidade={acesos[i] * 0.45} rugosidade={0.4} />
          <Texto3D texto={String(i + 1)} tam={0.5} posicao={[0, d.h - 0.43, 1.62]} emissao={0.25 + acesos[i] * 0.6} prof={0.08} />
        </group>
      );
    })}
  </>
);
// passo: 1 a 5. O mascote está no degrau anterior, pula para o degrau do passo, e a câmera mergulha no número.
export const PEscada: P<{passo: number; nome: string}> = ({c, passo, nome}) => {
  const f = c.f;
  const i = passo - 1;
  const de: [number, number] = i === 0 ? [-7, 0] : [DEG[i - 1].x, DEG[i - 1].h];
  const para: [number, number] = [DEG[i].x, DEG[i].h];
  const pulo = rampa(f, 14, 30, Easing.inOut(Easing.quad));
  const xM = de[0] + (para[0] - de[0]) * pulo;
  const yM = de[1] + (para[1] - de[1]) * pulo + Math.sin(pulo * Math.PI) * 1.5;
  const acesos = DEG.map((_, k) => (k < i ? 1 : k === i ? rampa(f, 29, 34) : 0));
  const chega = chegadaRampa(f, 20);
  const mergulho = rampa(f, 36, Math.min(c.dur - 4, 70), power4InOut);
  const largo: [number, number, number] = [DEG[i].x * 0.4 + 1, 5.6, 16];
  const perto: [number, number, number] = [DEG[i].x, DEG[i].h - 0.3, 5.2];
  const pos = somar([largo[0] + (perto[0] - largo[0]) * mergulho, largo[1] + (perto[1] - largo[1]) * mergulho, largo[2] + (perto[2] - largo[2]) * mergulho], [0, 0, 8], chega);
  const alvo: [number, number, number] = [0.5 + (DEG[i].x - 0.5) * mergulho, 2.4 + (DEG[i].h - 0.43 - 2.4) * mergulho, 0];
  return (
    <AbsoluteFill>
      <Palco f={f} pos={pos} alvo={alvo} tema={TEMAS.aurora} borrao={chega * chega * 16}>
        <Degraus acesos={acesos} />
        <Mascote3D posicao={[xM, yM, 0.2]} rotacao={[0, 0.45, 0]} escala={0.85} passo={f * 0.8} />
      </Palco>
      <Destaque texto={`NÍVEL ${passo}`} de={4} ate={Math.min(40, c.dur)} onde="topo" tam={110} />
      <Destaque texto={`*${nome}`} de={40} ate={c.dur + 20} tam={170} />
    </AbsoluteFill>
  );
};
// fechamento: a escada inteira acesa, a câmera recuando
export const PEscadaFinal: P = ({c}) => {
  const f = c.f;
  const pos = trilho(f, [0, c.dur], [
    [-4, 3, 9],
    [3, 7, 19],
  ]);
  return (
    <AbsoluteFill>
      <Palco f={f} pos={pos} alvo={[0, 2.2, 0]} tema={TEMAS.aurora} borrao={chegadaRampa(f, 20) ** 2 * 16}>
        <Degraus acesos={[1, 1, 1]} />
        <Mascote3D posicao={[3.4, 3.45 + Math.abs(Math.sin(f / 6)) * 0.5, 0.2]} rotacao={[0, -0.3, 0]} escala={0.85} passo={f * 0.8} />
      </Palco>
    </AbsoluteFill>
  );
};

// ---------- A linha do tempo deste vídeo, com as dez cenas ----------
export const PLinhaVideo: P<{cenas: string[]; duracoes: number[]}> = ({c, cenas, duracoes}) => {
  const total = duracoes.reduce((a, b) => a + b, 0);
  let x = 0;
  return (
    <AbsoluteFill>
      <Etiqueta style={{position: 'absolute', left: 110, top: 300, opacity: ap(c.f, 0)}}>A LINHA DO TEMPO DESTE VÍDEO</Etiqueta>
      <div style={{position: 'absolute', left: 110, top: 370, width: 1700, height: 170}}>
        {cenas.map((nome, i) => {
          const w = (duracoes[i] / total) * 1700;
          const meu = x;
          x += w;
          const e = ap(c.f, 6 + i * 4, 16);
          return (
            <div key={i} style={{position: 'absolute', left: meu, top: 0, width: w - 6, height: 170, borderRadius: 14, background: i === cenas.length - 1 ? 'rgba(242,98,46,0.25)' : C.cartaoClaro, border: `1px solid ${i === cenas.length - 1 ? C.acento : C.borda}`, ...surge(e, 50), overflow: 'hidden'}}>
              <div style={{fontFamily: MONO, fontSize: 22, color: C.acento, margin: '14px 0 0 14px'}}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 24, color: C.texto, margin: '8px 0 0 14px', lineHeight: 1.1}}>{nome}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 110, top: 600, fontFamily: SANS, fontWeight: 900, fontSize: 110, color: C.texto, letterSpacing: -3, ...surge(ap(c.f, c.p('nenhum') || c.p('dez') || 60))}}>
        {cenas.length} cenas, <span style={{color: C.acento, textShadow: brilho(C.acento, 0.9)}}>0 programas</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Chamadas: inscrever no meio, e comentar 1 ou 2 no fim ----------
export const PInscrever: P<{pergunta?: boolean; opcoes?: [string, string]; frase?: number}> = ({c, pergunta = false, opcoes = ['vídeo curto', 'vídeo longo'], frase = 0}) => {
  const e = mola(c.f, 4, {damping: 11});
  const t1 = c.p('cortes') || c.t(frase) + 22;
  const t2 = Math.max(t1 + 12, c.p('montando') || c.t(frase) + 58);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 60}}>
      {!pergunta ? (
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 90, color: '#fff', background: C.acento, borderRadius: 40, padding: '34px 90px', boxShadow: brilho(C.acento, 1.3), transform: `scale(${e})`}}>INSCREVA-SE</div>
      ) : (
        <>
          <Etiqueta style={{opacity: ap(c.f, 0)}}>COMENTA AQUI EMBAIXO</Etiqueta>
          <div style={{display: 'flex', gap: 60}}>
            {[
              ['1', opcoes[0], t1],
              ['2', opcoes[1], t2],
            ].map(([n, txt, t]) => {
              const m = mola(c.f, Number(t) - 2, {damping: 10});
              return (
                <div key={String(n)} style={{width: 620, borderRadius: 40, background: C.cartao, border: `2px solid ${C.acento}`, padding: '40px 0', textAlign: 'center', transform: `scale(${Math.max(0.001, m)})`, boxShadow: '0 0 70px rgba(242,98,46,0.3)'}}>
                  <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 280, lineHeight: 1, color: C.acento, textShadow: brilho(C.acento, 1.2)}}>{n}</div>
                  <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 60, color: C.texto, marginTop: 10}}>{txt}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

export {expoOut, power2Out};
