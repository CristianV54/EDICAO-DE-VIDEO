import React from 'react';
import {AbsoluteFill} from 'remotion';
import './fontes';
import {cores, fonte, fonteTitulo} from './tema';
import {Personagem} from './Personagem';

// Capa A: 1280x720. Personagem sobre a linha do tempo que se corta sozinha.
const Clipe: React.FC<{x: number; w: number; cor: string; y?: number; giro?: number; op?: number}> = ({x, w, cor, y = 0, giro = 0, op = 1}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: 22 + y,
      width: w,
      height: 106,
      borderRadius: 14,
      background: cor,
      opacity: op,
      transform: `rotate(${giro}deg)`,
      boxShadow: 'inset 0 -14px 0 rgba(0,0,0,0.18)',
    }}
  >
    {/* ondinha de áudio dentro do clipe */}
    <div style={{position: 'absolute', left: 14, right: 14, bottom: 22, height: 26, display: 'flex', alignItems: 'flex-end', gap: 5, overflow: 'hidden'}}>
      {Array.from({length: Math.floor((w - 28) / 11)}).map((_, i) => (
        <div key={i} style={{width: 6, height: 6 + Math.abs(Math.sin(i * 1.9 + x)) * 20, background: 'rgba(0,0,0,0.28)', borderRadius: 3}} />
      ))}
    </div>
  </div>
);

export const Capa: React.FC = () => {
  return (
    <AbsoluteFill style={{background: cores.fundo, fontFamily: fonte, overflow: 'hidden'}}>
      {/* brilho atrás do personagem */}
      <div style={{position: 'absolute', left: 560, top: -180, width: 900, height: 900, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,87,0.42) 0%, rgba(217,119,87,0.12) 38%, rgba(217,119,87,0) 68%)'}} />

      {/* linha do tempo */}
      <div style={{position: 'absolute', left: -60, top: 500, width: 1400, height: 150, background: cores.painel, borderTop: `3px solid ${cores.linha}`, borderBottom: `3px solid ${cores.linha}`, transform: 'rotate(-3deg)'}}>
        <Clipe x={90} w={330} cor={cores.azul} />
        <Clipe x={432} w={300} cor={cores.verde} />
        {/* pedaço cortado caindo */}
        <Clipe x={800} w={190} cor={cores.vermelho} y={70} giro={-15} />
        <Clipe x={1060} w={360} cor={cores.azul} />
        {/* agulha */}
        <div style={{position: 'absolute', left: 1034, top: -52, width: 8, height: 240, background: cores.creme, borderRadius: 4, boxShadow: `0 0 26px ${cores.creme}`}} />
      </div>

      {/* personagem */}
      <div style={{position: 'absolute', left: 742, top: 44, filter: 'drop-shadow(0 18px 30px rgba(0,0,0,0.55))'}}>
        <Personagem tamanho={460} olharX={-0.6} olharY={0.9} giro={8} />
      </div>

      {/* texto */}
      <div style={{position: 'absolute', left: 64, top: 30, fontFamily: fonteTitulo, color: cores.creme, fontSize: 186, lineHeight: 0.98, letterSpacing: 1, textShadow: '0 8px 0 rgba(0,0,0,0.5)'}}>
        <div>EDITADO</div>
        <div>
          POR <span style={{color: cores.laranja}}>IA</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 70, top: 408, background: cores.creme, color: cores.fundo, fontWeight: 800, fontSize: 54, padding: '6px 30px', borderRadius: 16, transform: 'rotate(-3deg)', boxShadow: '0 10px 0 rgba(0,0,0,0.45)'}}>
        0 editores
      </div>
    </AbsoluteFill>
  );
};
