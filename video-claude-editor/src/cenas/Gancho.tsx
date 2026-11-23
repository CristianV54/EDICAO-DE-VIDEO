import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {aleatorio, expoOut, mola, power2Out, power4In, power4InOut, rampa, trilho1} from '../anim';
import {C, Camera2D, Enfase, Etiqueta, Fundo2D, Janela, Marca, MONO, Quadro, SANS, Troca, brilho} from '../dois/base';
import {cenaHistoria, cenaLegenda, cenaLinha, cenaPrograma} from '../papel';
import {EsperaFonte} from '../tres/Rotulo';
import {Tela3D} from '../tres/Tela3D';
import {Camera} from '../tres/Camera';
import {Luzes} from '../tres/pecas';
import {Icone3D} from '../tres/Icone3D';
import {CincoPassos, PassoUm} from './Gancho3D';

// Cena 1 do roteiro: o gancho. Base em 2D, com 3D só em quatro momentos (ver PLANO-3D.md).
// Os tempos vêm das palavras da voz-guia (audio/cena01_palavras.json), em quadros a 30 por segundo.
export const TRECHOS = {
  editor: 193, // "Este vídeo foi editado inteiro por mim, o Claude. Cada corte, cada animação, cada movimento de câmera."
  semPrograma: 75, // "Ninguém abriu um programa de edição."
  humano: 164, // "A voz é do Cristian. Ele gravou e apertou o botão de aprovar: o resto fui eu."
  cincoPassos: 124, // "Em cinco passos, eu te mostro como fazer o mesmo com os seus vídeos:"  (3D)
  doisUsos: 64, // "cortes curtos e vídeos longos."
  ferramentas: 122, // "Com o nome de cada ferramenta e o pedido exato que você escreve."
  passoUm: 63, // "Passo um."  (3D)
};
export const DURACAO_GANCHO = Object.values(TRECHOS).reduce((a, b) => a + b, 0);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ====================== Trecho 1: o editor ======================
// Medidas da janela do editor, em pixels da tela.
const J = {x: 180, y: 110, w: 1560, h: 860};
const PREVIA = {x: 202, y: 176, w: 711, h: 400};
const TRILHA = {x: 270, w: 1448};
const FAIXAS: {nome: string; y: number}[] = [
  {nome: 'V2', y: 634},
  {nome: 'V1', y: 700},
  {nome: 'A1', y: 766},
  {nome: 'A2', y: 832},
];
type Clipe = {faixa: number; ini: number; len: number; audio?: boolean; pedaco?: 'E' | 'M' | 'D'; depois?: boolean};
const CLIPES: Clipe[] = [
  {faixa: 0, ini: 0.04, len: 0.17},
  {faixa: 0, ini: 0.3, len: 0.16},
  {faixa: 0, ini: 0.62, len: 0.26},
  {faixa: 1, ini: 0.02, len: 0.21},
  {faixa: 1, ini: 0.24, len: 0.195},
  {faixa: 1, ini: 0.44, len: 0.075, pedaco: 'E'},
  {faixa: 1, ini: 0.515, len: 0.08, pedaco: 'M'},
  {faixa: 1, ini: 0.595, len: 0.13, pedaco: 'D'},
  {faixa: 1, ini: 0.735, len: 0.2, depois: true},
  {faixa: 2, ini: 0.02, len: 0.52, audio: true},
  {faixa: 2, ini: 0.56, len: 0.4, audio: true},
  {faixa: 3, ini: 0.02, len: 0.94, audio: true},
];
const CORTE1 = 100;
const CORTE2 = 106;
const xCorte = [TRILHA.x + 0.515 * TRILHA.w, TRILHA.x + 0.595 * TRILHA.w];

const Onda: React.FC<{larg: number; semente: number; cor?: string}> = ({larg, semente, cor = 'rgba(255,255,255,0.28)'}) => {
  const n = Math.floor(larg / 7);
  return (
    <svg width={larg} height={46} style={{position: 'absolute', left: 0, top: 6}}>
      {Array.from({length: n}).map((_, k) => {
        const h = 4 + Math.abs(Math.sin(k * 1.7 + semente * 2.3) * Math.cos(k * 0.41 + semente)) * 36;
        return <rect key={k} x={4 + k * 7} y={23 - h / 2} width={3} height={h} rx={1.5} fill={cor} />;
      })}
    </svg>
  );
};

const LINHAS_LOG: [string, number, number][] = [
  // texto, quadro em que aparece, quadro em que fica pronto
  ['Lendo a transcrição', 26, 44],
  ['Cortando erros e silêncios', 46, 110],
  ['Desenhando as animações', 62, 146],
  ['Movendo a câmera', 78, 186],
];

const Editor: React.FC = () => {
  const f = useCurrentFrame();
  // câmera 2D: começa perto da linha do tempo, abre, aproxima no corte, entra no monitor, abre de novo
  const q = [0, 40, 92, 101, 116, 124, 148, 160];
  const z = trilho1(f, q, [1.7, 1.0, 1.04, 2.5, 2.62, 2.7, 2.76, 1.0]);
  const fx = trilho1(f, q, [960, 960, 960, 1075, 1075, 557.5, 557.5, 960]);
  const fy = trilho1(f, q, [770, 540, 540, 729, 729, 376, 376, 540]);
  // 3D na palavra "câmera": a janela plana inclina no espaço e a câmera dá a volta nela
  const qc = [150, 163, 176, 186, 193];
  const ry = trilho1(f, qc, [0, -42, 36, -12, 0]);
  const rx = trilho1(f, qc, [0, 12, 15, 6, 0]);
  const rz = trilho1(f, qc, [0, -3, 4, -1.5, 0]);
  const fuga = rampa(f, 184, 193, power4In);

  // corte
  const sep1 = mola(f, CORTE1, {damping: 10});
  const sep2 = mola(f, CORTE2, {damping: 10});
  const marca = rampa(f, CORTE2, CORTE2 + 4);
  const cai = rampa(f, CORTE2 + 5, CORTE2 + 15, (n) => n * n);
  const fecha = mola(f, CORTE2 + 9, {damping: 11, stiffness: 150});
  const xAgulha = trilho1(f, [84, 99, 103, 106, 193], [TRILHA.x + 0.3 * TRILHA.w, xCorte[0], xCorte[0], xCorte[1], xCorte[1] + 90]);
  const agulha = rampa(f, 84, 90);

  // bloco do Claude em 3D: chega na palavra "Claude", depois vira a cabeça da agulha
  const chega = rampa(f, 54, 70, expoOut);
  const vira = rampa(f, 82, 94, power4InOut);
  const heroi = f >= 52 && f < 96;
  const desfoque = chega * (1 - vira);
  // alvo em unidades 3D: a cabeça da agulha na tela (147 px por unidade, com a câmera usada abaixo)
  const alvoX = (xAgulha - 960) / 147;
  const alvoY = (540 - 612) / 147;

  const naLinha = f >= 114 && f < 156;
  const digitado = '> edite este vídeo'.slice(0, Math.max(0, Math.floor((f - 4) * 0.9)));

  return (
    <AbsoluteFill>
      <Fundo2D f={f} />
      <AbsoluteFill style={{perspective: 1700, filter: desfoque > 0.02 || fuga > 0.02 ? `blur(${(desfoque * 9 + fuga * 18).toFixed(1)}px)` : undefined}}>
        <AbsoluteFill style={{transform: `rotateY(${ry}deg) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${1 + fuga * 1.6})`, opacity: 1 - desfoque * 0.35}}>
          <Camera2D z={z} fx={fx} fy={fy}>
            <Janela titulo="claude code · ~/videos/gancho" style={{left: J.x, top: J.y, width: J.w, height: J.h}} luz={0.8}>
              {/* monitor de programa */}
              <div style={{position: 'absolute', left: PREVIA.x - J.x, top: PREVIA.y - J.y, width: PREVIA.w, height: PREVIA.h, borderRadius: 10, overflow: 'hidden', border: `1px solid ${C.borda}`}}>
                <Quadro desenhar={naLinha ? cenaLinha : cenaPrograma} f={naLinha ? (f - 114) * 1.2 : f} w={1920} h={1080} style={{width: PREVIA.w, height: PREVIA.h}} />
              </div>
              {/* painel do Claude trabalhando */}
              <div style={{position: 'absolute', left: PREVIA.x - J.x + PREVIA.w + 22, top: PREVIA.y - J.y, right: 22, height: PREVIA.h, borderRadius: 10, border: `1px solid ${C.borda}`, background: 'rgba(0,0,0,0.35)', padding: '26px 30px', fontFamily: MONO, fontSize: 24, color: C.texto}}>
                <div style={{color: C.mudo, marginBottom: 20}}>
                  {digitado}
                  <span style={{color: C.acento, opacity: f < 26 && Math.floor(f / 6) % 2 ? 1 : 0}}>▌</span>
                </div>
                {LINHAS_LOG.map(([texto, de, pronto], i) => {
                  const e = rampa(f, de, de + 8, expoOut);
                  const ok = f >= pronto;
                  const ativo = f >= de && !ok;
                  return (
                    <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, opacity: e, transform: `translateX(${(1 - e) * 24}px)`}}>
                      <span style={{width: 12, height: 12, borderRadius: 6, background: ok ? C.texto : C.acento, boxShadow: ativo ? `0 0 14px ${C.acento}` : 'none', opacity: ativo ? 0.55 + 0.45 * Math.sin(f / 2.5) : 1}} />
                      <span style={{color: ativo ? C.texto : C.mudo}}>{texto}</span>
                      {ok ? <span style={{color: C.acento, marginLeft: 'auto'}}>pronto</span> : null}
                    </div>
                  );
                })}
              </div>
              {/* régua */}
              <div style={{position: 'absolute', left: TRILHA.x - J.x, top: 598 - J.y, width: TRILHA.w, height: 24, borderBottom: `1px solid ${C.borda}`}}>
                {Array.from({length: 25}).map((_, k) => (
                  <div key={k} style={{position: 'absolute', left: (k / 24) * TRILHA.w, bottom: 0, width: 1, height: k % 4 === 0 ? 14 : 7, background: C.mudo}} />
                ))}
              </div>
              {/* faixas */}
              {FAIXAS.map((fx2) => (
                <React.Fragment key={fx2.nome}>
                  <div style={{position: 'absolute', left: 202 - J.x, top: fx2.y - J.y + 18, fontFamily: MONO, fontSize: 18, color: C.mudo}}>{fx2.nome}</div>
                  <div style={{position: 'absolute', left: TRILHA.x - J.x, top: fx2.y - J.y, width: TRILHA.w, height: 58, borderRadius: 8, background: 'rgba(255,255,255,0.025)'}} />
                </React.Fragment>
              ))}
              {/* clipes */}
              {CLIPES.map((c, i) => {
                const e = rampa(f + 12, 1 + i * 2, 16 + i * 2, expoOut);
                let dx = (1 - e) * 260;
                let dy = 0;
                let op = e;
                let fundo = c.audio ? '#14181b' : '#22282d';
                let borda = 'rgba(255,255,255,0.14)';
                if (c.pedaco === 'E') dx += -3 * sep1 * (1 - fecha);
                if (c.pedaco === 'D') dx += 3 * sep2 * (1 - fecha) - 0.08 * TRILHA.w * fecha;
                if (c.depois) dx += -0.08 * TRILHA.w * fecha;
                if (c.pedaco === 'M') {
                  fundo = marca > 0 ? `rgba(${Math.round(lerp(34, 229, marca))},${Math.round(lerp(40, 72, marca))},${Math.round(lerp(45, 77, marca))},1)` : fundo;
                  borda = marca > 0 ? C.erro : borda;
                  dy = cai * 150;
                  op = e * (1 - cai);
                }
                const larg = c.len * TRILHA.w - (c.pedaco ? 0 : 4);
                return (
                  <div key={i} style={{position: 'absolute', left: TRILHA.x - J.x + c.ini * TRILHA.w + dx, top: FAIXAS[c.faixa].y - J.y + dy, width: larg, height: 58, borderRadius: c.pedaco ? 3 : 8, background: fundo, border: `1px solid ${borda}`, opacity: op, transform: c.pedaco === 'M' ? `rotate(${cai * 9}deg)` : undefined, overflow: 'hidden', boxShadow: c.pedaco === 'M' && marca > 0 ? `0 0 26px ${C.erro}88` : undefined}}>
                    {c.audio ? <Onda larg={larg} semente={i} /> : <div style={{position: 'absolute', left: 8, top: 9, width: Math.min(64, larg - 16), height: 38, borderRadius: 5, background: 'rgba(255,255,255,0.13)'}} />}
                  </div>
                );
              })}
              {/* riscos dos cortes */}
              {[CORTE1, CORTE2].map((tc, k) => {
                if (f < tc || f > tc + 9) return null;
                const luz = 1 - rampa(f, tc, tc + 9);
                return <div key={tc} style={{position: 'absolute', left: xCorte[k] - J.x - 2, top: 700 - J.y - 30 * luz, width: 4, height: 58 + 60 * luz, background: '#fff', boxShadow: `0 0 ${30 * luz}px #fff, 0 0 ${70 * luz}px ${C.acento}`, opacity: luz}} />;
              })}
              {/* agulha, com a marca do Claude na cabeça */}
              <div style={{position: 'absolute', left: xAgulha - J.x - 1, top: 598 - J.y, width: 2, height: 300 * agulha, background: '#fff', boxShadow: '0 0 10px rgba(255,255,255,0.8)'}} />
              <div style={{position: 'absolute', left: xAgulha - J.x - 15, top: 598 - J.y - 18, opacity: rampa(f, 91, 95)}}>
                <Marca tam={30} />
              </div>
            </Janela>
          </Camera2D>
        </AbsoluteFill>
      </AbsoluteFill>
      {/* momento 3D 1: o bloco do Claude chega por cima da janela */}
      {heroi ? (
        <AbsoluteFill style={{opacity: 1 - rampa(f, 92, 96)}}>
          <Tela3D>
            <Camera pos={[0, 0, 12]} alvo={[0, 0, 0]} fov={34} />
            <Luzes corA="#ffe1cf" corB="#f2622e" forcaA={110} forcaB={90} />
            <Icone3D posicao={[lerp(lerp(7, 0, chega), alvoX, vira), lerp(lerp(4, 0.5, chega), alvoY, vira), lerp(lerp(14, 3, chega), 0, vira)]} rotacao={[0, (1 - chega) * -6 + Math.sin(f / 20) * 0.18 * (1 - vira), (1 - chega) * 0.5]} escala={lerp(1.25, 0.11, vira)} brilho={0.45} halo={6} />
          </Tela3D>
        </AbsoluteFill>
      ) : null}
      <Enfase f={f} palavras={[['editado', 24], ['inteiro', 39], ['pelo', 56], ['*Claude', 68]]} ate={92} style={{bottom: 92}} tam={104} />
      <Enfase f={f} palavras={[['cada', 93], ['*corte', 100]]} ate={117} style={{top: 96}} tam={120} />
      <Enfase f={f} palavras={[['cada', 148], ['movimento', 152], ['de', 161], ['*câmera', 173]]} ate={190} style={{bottom: 80}} tam={104} />
    </AbsoluteFill>
  );
};

// ====================== Trecho 2: nenhum programa de edição ======================
const Programa: React.FC<{tipo: number; fechado: number}> = ({tipo, fechado}) => (
  <div style={{width: 270, height: 270, borderRadius: 62, position: 'relative', background: tipo === 0 ? '#1d1466' : tipo === 1 ? '#22262d' : '#1b1f23', border: `2px solid ${tipo === 0 ? '#9d9df0' : 'rgba(255,255,255,0.2)'}`, filter: `grayscale(${fechado}) brightness(${1 - fechado * 0.55})`, transform: `scale(${1 - fechado * 0.12})`, boxShadow: fechado < 0.5 ? '0 0 40px rgba(255,255,255,0.12)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    {tipo === 0 ? <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 132, color: '#a3a3ff'}}>Pr</span> : null}
    {tipo === 1 ? (
      <svg width={176} height={176} viewBox="-60 -60 120 120">
        {['#2fd8ea', '#f7e11c', '#f2415c'].map((cor, i) => (
          <path key={cor} d="M0,-6 C-22,-18 -24,-52 0,-52 C24,-52 22,-18 0,-6 Z" fill={cor} transform={`rotate(${i * 120})`} />
        ))}
      </svg>
    ) : null}
    {tipo === 2 ? (
      <svg width={160} height={160} viewBox="0 0 110 110">
        <rect x={10} y={34} width={90} height={62} rx={8} fill="none" stroke="#cfd6dc" strokeWidth={7} />
        <path d="M10 34 L24 12 L100 12 L100 34" fill="none" stroke="#cfd6dc" strokeWidth={7} strokeLinejoin="round" />
        <path d="M48 52 L70 65 L48 78 Z" fill="#cfd6dc" />
      </svg>
    ) : null}
    {fechado > 0.5 ? <div style={{position: 'absolute', right: -12, top: -12, width: 46, height: 46, borderRadius: 23, background: '#0c0e10', border: `2px solid ${C.mudo}`, color: C.texto, fontFamily: MONO, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>×</div> : null}
  </div>
);

const SemPrograma: React.FC = () => {
  const f = useCurrentFrame();
  const fechos = [14, 24, 34];
  const abertos = 3 - fechos.filter((t) => f >= t).length;
  const soco = f >= 34 ? 1 + (1 - rampa(f, 34, 46, expoOut)) * 0.35 : 1;
  return (
    <AbsoluteFill>
      <Fundo2D f={f} x={50} y={18} forca={0.6} />
      <Etiqueta style={{position: 'absolute', left: 0, right: 0, top: 130, justifyContent: 'center'}}>PROGRAMAS DE EDIÇÃO ABERTOS</Etiqueta>
      <div style={{position: 'absolute', left: 0, right: 0, top: 220, display: 'flex', justifyContent: 'center', gap: 90}}>
        {[0, 1, 2].map((i) => {
          const e = mola(f, i * 3, {damping: 11});
          return (
            <div key={i} style={{transform: `scale(${e}) translateY(${f >= fechos[i] ? rampa(f, fechos[i], fechos[i] + 10, power2Out) * 18 : 0}px)`}}>
              <Programa tipo={i} fechado={rampa(f, fechos[i], fechos[i] + 7)} />
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 380, lineHeight: 1, color: abertos === 0 ? C.acento : C.texto, textShadow: abertos === 0 ? brilho(C.acento, 1.4) : 'none', transform: `scale(${soco})`}}>{abertos}</div>
    </AbsoluteFill>
  );
};

// ====================== Trecho 3: a voz e o botão de aprovar ======================
const Humano: React.FC = () => {
  const f = useCurrentFrame();
  const grava = rampa(f, 2, 70, (n) => n);
  const encolhe = rampa(f, 74, 90, power4InOut);
  const botao = mola(f, 80, {damping: 12});
  const clique = 103;
  const aperta = f >= clique && f < clique + 8 ? Math.sin(((f - clique) / 8) * Math.PI) : 0;
  const aprovado = f >= clique + 2;
  const tc = rampa(f, 86, clique, power2Out);
  const cx = lerp(1500, 1130, tc);
  const cy = lerp(1010, 640, tc) - Math.sin(tc * Math.PI) * 90;
  const barras = rampa(f, 124, 150, power2Out);
  const sobe = rampa(f, 118, 132, power4InOut);
  const n = 120;
  return (
    <AbsoluteFill>
      <Fundo2D f={f} x={24} y={72} />
      {/* cartão de gravação */}
      <Janela titulo="gravação · voz" style={{left: lerp(310, 120, encolhe), top: lerp(330, 180 - sobe * 70, encolhe), width: 1300, height: 380, transform: `scale(${lerp(1, 0.5, encolhe)})`, transformOrigin: '0 0', opacity: 1 - sobe}}>
        <div style={{position: 'absolute', left: 36, top: 70, right: 36, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 24, color: C.mudo}}>
          <span style={{width: 16, height: 16, borderRadius: 8, background: C.erro, boxShadow: `0 0 16px ${C.erro}`, opacity: f < 72 && Math.floor(f / 10) % 2 ? 0.3 : 1, marginRight: 14}} />
          {f < 72 ? 'GRAVANDO' : 'GRAVADO'}
          <span style={{marginLeft: 'auto', color: C.texto}}>00:{String(Math.min(25, Math.floor(grava * 25))).padStart(2, '0')}</span>
        </div>
        <svg width={1228} height={200} style={{position: 'absolute', left: 36, top: 130}}>
          {Array.from({length: n}).map((_, k) => {
            const gravado = k / n <= grava;
            const viva = gravado && k / n > grava - 0.06 ? 1.25 : 1;
            const h = (8 + Math.abs(Math.sin(k * 1.3) * Math.cos(k * 0.37 + 1) * Math.sin(k * 0.11 + 2)) * 170) * (gravado ? viva : 0.06);
            return <rect key={k} x={k * 10.2} y={100 - h / 2} width={5} height={h} rx={2.5} fill={gravado ? C.acento : 'rgba(255,255,255,0.18)'} />;
          })}
        </svg>
      </Janela>
      {/* botão de aprovar */}
      <div style={{position: 'absolute', left: 660, top: 500 - sobe * 120, transform: `scale(${Math.max(0.001, botao) * (1 - aperta * 0.06)})`, transformOrigin: '300px 80px', opacity: 1 - sobe}}>
        <div style={{width: 600, height: 160, borderRadius: 40, background: aprovado ? C.acento : C.texto, color: aprovado ? '#fff' : '#141413', fontFamily: SANS, fontWeight: 900, fontSize: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: aprovado ? `0 0 90px ${C.acento}aa, 0 18px 40px rgba(0,0,0,0.6)` : '0 18px 40px rgba(0,0,0,0.6)'}}>{aprovado ? 'APROVADO' : 'APROVAR'}</div>
      </div>
      {f >= 86 && f < 124 ? (
        <svg width={64} height={84} viewBox="0 0 64 84" style={{position: 'absolute', left: cx, top: cy, opacity: 1 - rampa(f, 116, 124), transform: `scale(${1 - aperta * 0.15})`, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.7))'}}>
          <path d="M4 2 L4 62 L20 48 L31 74 L42 69 L31 44 L52 44 Z" fill="#fff" stroke="#141413" strokeWidth={3} strokeLinejoin="round" />
        </svg>
      ) : null}
      {/* quem fez o quê */}
      <div style={{position: 'absolute', left: 200, right: 200, top: 520, opacity: rampa(f, 122, 130)}}>
        <div style={{display: 'flex', gap: 14, height: 120}}>
          <div style={{width: `${12 * barras}%`, borderRadius: 16, background: C.texto}} />
          <div style={{width: `${88 * barras}%`, borderRadius: 16, background: C.acento, boxShadow: brilho(C.acento, 1)}} />
        </div>
        <div style={{display: 'flex', gap: 12, marginTop: 26, fontFamily: MONO, fontSize: 32, color: C.mudo}}>
          <div style={{width: '12%', whiteSpace: 'nowrap'}}>
            <span style={{color: C.texto}}>Cristian</span>
            <br />
            voz e aprovação
          </div>
          <div style={{marginLeft: 60}}>
            <span style={{color: C.acento}}>Claude</span>
            <br />
            cortes, animações, câmera, som, legendas
          </div>
        </div>
      </div>
      <Enfase f={f} palavras={[['a', 4], ['voz', 6], ['é', 14], ['do', 19], ['*Cristian', 22]]} ate={70} style={{top: 150}} tam={104} />
      <Enfase f={f} palavras={[['o', 127], ['resto', 131], ['fui', 139], ['*eu', 150]]} ate={164} style={{top: 250}} tam={150} />
    </AbsoluteFill>
  );
};

// ====================== Trecho 5: os dois usos ======================
const DoisUsos: React.FC = () => {
  const f = useCurrentFrame();
  const a = mola(f, 0, {damping: 12});
  const b = mola(f, 28, {damping: 12});
  return (
    <AbsoluteFill>
      <Fundo2D f={f} x={80} y={42} />
      <div style={{position: 'absolute', left: 250, top: 150, transform: `scale(${a * 1.18})`, transformOrigin: '170px 380px'}}>
        <div style={{width: 340, height: 660, borderRadius: 50, border: `3px solid rgba(255,255,255,0.22)`, background: '#0c0e10', padding: 14, boxShadow: '0 0 70px rgba(242,98,46,0.22)'}}>
          <div style={{width: 312, height: 632, borderRadius: 38, overflow: 'hidden'}}>
            <Quadro desenhar={cenaLegenda} f={f} w={624} h={1264} style={{width: 312, height: 632}} />
          </div>
        </div>
        <div style={{marginTop: 26, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 54, color: C.texto}}>
          cortes <span style={{color: C.acento, textShadow: brilho(C.acento, 0.8)}}>curtos</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 860, top: 230, transform: `scale(${Math.max(0.001, b) * 1.12})`, transformOrigin: '430px 300px'}}>
        <div style={{width: 860, height: 500, borderRadius: 22, border: `3px solid rgba(255,255,255,0.22)`, background: '#0c0e10', padding: 12, boxShadow: '0 0 70px rgba(242,98,46,0.22)'}}>
          <div style={{width: 836, height: 470, borderRadius: 12, overflow: 'hidden'}}>
            <Quadro desenhar={cenaHistoria} f={f + 30} w={1280} h={720} style={{width: 836, height: 470}} />
          </div>
        </div>
        <div style={{marginTop: 26, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 54, color: C.texto}}>
          vídeos <span style={{color: C.acento, textShadow: brilho(C.acento, 0.8)}}>longos</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ====================== Trecho 6: as ferramentas e o pedido ======================
const FERRAMENTAS: [string, string][] = [
  ['Whisper', 'transcreve'],
  ['auto-editor', 'tira o silêncio'],
  ['FFmpeg', 'corta e exporta'],
  ['Remotion', 'anima'],
];
const PEDIDO = 'transcreva este vídeo palavra por palavra';

const Ferramentas: React.FC = () => {
  const f = useCurrentFrame();
  const sobe = rampa(f, 48, 64, power4InOut);
  const janela = mola(f, 52, {damping: 14});
  const letras = Math.max(0, Math.min(PEDIDO.length, Math.floor((f - 60) * 0.78)));
  return (
    <AbsoluteFill>
      <Fundo2D f={f} x={22} y={26} />
      <Etiqueta style={{position: 'absolute', left: 130, top: 262 - sobe * 150}}>O NOME DE CADA FERRAMENTA</Etiqueta>
      <div style={{position: 'absolute', left: 130, right: 130, top: 330 - sobe * 150, display: 'flex', gap: 30}}>
        {FERRAMENTAS.map(([nome, faz], i) => {
          const e = rampa(f, 6 + i * 5, 21 + i * 5, expoOut);
          return (
            <div key={nome} style={{flex: 1, height: 270, borderRadius: 26, background: C.cartao, border: `1px solid ${C.borda}`, padding: '28px 30px', opacity: e, transform: `translateY(${(1 - e) * 60}px) scale(${0.9 + e * 0.1})`, filter: `blur(${(1 - e) * 8}px)`, boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
              <div style={{fontFamily: MONO, fontSize: 28, color: C.acento}}>0{i + 1}</div>
              <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 50, color: C.texto, marginTop: 34, letterSpacing: -1.5, whiteSpace: 'nowrap'}}>{nome}</div>
              <div style={{fontFamily: MONO, fontSize: 28, color: C.mudo, marginTop: 14}}>{faz}</div>
            </div>
          );
        })}
      </div>
      <Etiqueta style={{position: 'absolute', left: 250, top: 520, opacity: janela}}>O PEDIDO EXATO</Etiqueta>
      <Janela titulo="claude code" style={{left: 250, top: 575 + (1 - janela) * 300, width: 1420, height: 280, opacity: janela}} luz={1.2}>
        <div style={{padding: '50px 44px', fontFamily: MONO, fontSize: 50, color: C.texto, whiteSpace: 'nowrap'}}>
          <span style={{color: C.acento}}>&gt; </span>
          {PEDIDO.slice(0, letras)}
          <span style={{color: C.acento, opacity: Math.floor(f / 7) % 2 ? 1 : 0.2}}>▌</span>
        </div>
      </Janela>
    </AbsoluteFill>
  );
};

// ====================== Som ======================
// Cada efeito: [arquivo, quadro em que começa, volume]. O pico dos whooshes fica perto da troca.
const SFX: [string, number, number][] = [
  ['whoosh_grave', 52, 0.5], // bloco do Claude chegando
  ['impacto', 69, 0.55], // palavra "Claude"
  ['corte', 100, 0.6],
  ['corte', 106, 0.6],
  ['whoosh', 110, 0.35], // trecho cortado caindo
  ['pop', 115, 0.3],
  ['subida', 118, 0.3], // linha se desenhando
  ['whoosh_grave', 146, 0.5], // câmera dá a volta
  ['whoosh', 182, 0.5], // troca
  ['pop', 193, 0.3],
  ['apagar', 207, 0.45],
  ['apagar', 217, 0.45],
  ['apagar', 227, 0.5],
  ['impacto', 228, 0.4], // o zero
  ['whoosh', 258, 0.4],
  ['pop', 348, 0.35], // botão aparece
  ['clique', 371, 0.7],
  ['ding', 372, 0.5],
  ['whoosh', 388, 0.3],
  ['whoosh_grave', 420, 0.5], // troca para a escada
  ['degrau1', 456, 0.5],
  ['degrau2', 473, 0.5],
  ['degrau3', 490, 0.5],
  ['degrau4', 507, 0.5],
  ['degrau5', 524, 0.55],
  ['whoosh', 546, 0.45],
  ['pop', 556, 0.35],
  ['pop', 584, 0.35],
  ['whoosh', 610, 0.4],
  ['pop', 626, 0.3],
  ['pop', 631, 0.3],
  ['pop', 636, 0.3],
  ['pop', 641, 0.3],
  ['whoosh', 668, 0.3],
  ['whoosh_grave', 732, 0.5], // troca para o passo um
  ['subida', 742, 0.35],
  ['impacto', 775, 0.6],
];
const TECLAS = Array.from({length: 21}).map((_, i) => 681 + i * 2.6);

export const SomGancho: React.FC<{voz?: boolean}> = ({voz = true}) => (
  <>
    {voz ? <Audio src={staticFile('som/cena01_guia.wav')} volume={1} /> : null}
    <Audio src={staticFile('som/musica.wav')} volume={(q) => 0.16 * Math.min(1, q / 20) * Math.min(1, (DURACAO_GANCHO - q) / 24)} />
    {SFX.map(([nome, de, vol], i) => (
      <Sequence key={i} from={Math.max(0, de)} layout="none">
        <Audio src={staticFile(`som/${nome}.wav`)} volume={vol * 0.55} />
      </Sequence>
    ))}
    {TECLAS.map((de, i) => (
      <Sequence key={`t${i}`} from={Math.round(de)} layout="none">
        <Audio src={staticFile('som/tecla.wav')} volume={0.18 + aleatorio(i) * 0.1} />
      </Sequence>
    ))}
  </>
);

// ====================== Cena completa ======================
export const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const ordem: [keyof typeof TRECHOS, React.FC][] = [
    ['editor', Editor],
    ['semPrograma', SemPrograma],
    ['humano', Humano],
    ['cincoPassos', CincoPassos],
    ['doisUsos', DoisUsos],
    ['ferramentas', Ferramentas],
    ['passoUm', PassoUm],
  ];
  let inicio = 0;
  return (
    <AbsoluteFill style={{background: C.fundo}}>
      <EsperaFonte>
        {ordem.map(([nome, Trecho]) => {
          const de = inicio;
          const dur = TRECHOS[nome];
          inicio += dur;
          return (
            <Sequence key={nome} from={de} durationInFrames={dur} name={nome}>
              <Troca f={f - de} dur={nome === 'editor' ? 99999 : dur}>
                <Trecho />
              </Troca>
            </Sequence>
          );
        })}
      </EsperaFonte>
      <SomGancho />
    </AbsoluteFill>
  );
};
