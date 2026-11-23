import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import '../fontes';
import {FundoEstudio} from '../capa/TelaEditor';
import {mola, rampa} from '../anim';

// Fundo de estúdio para o vídeo (o desenho base é 1280x720, aqui ampliado).
export const FundoVideo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#040908'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1280, height: 720, transformOrigin: '0 0', transform: `scale(${1.5 * 1.08}) translate(${-40 + Math.sin(frame / 90) * 18}px, ${-25 + Math.cos(frame / 120) * 10}px)`}}>
        <FundoEstudio />
      </div>
    </AbsoluteFill>
  );
};

const degrade: React.CSSProperties = {background: 'linear-gradient(180deg, #ffb27a 0%, #f2622e 70%, #c2410c 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'};

// Letreiro: frase curta que entra palavra por palavra. Palavras entre * ficam em laranja.
export const Letreiro: React.FC<{
  texto: string;
  de: number;
  ate: number;
  tam?: number;
  topo?: number; // posição vertical em px; se ausente, fica embaixo
}> = ({texto, de, ate, tam = 104, topo}) => {
  const frame = useCurrentFrame();
  if (frame < de || frame > ate) return null;
  const sai = 1 - rampa(frame, ate - 6, ate);
  const palavras = texto.split(' ');
  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        right: 80,
        ...(topo === undefined ? {bottom: 84} : {top: topo}),
        textAlign: 'center',
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 900,
        fontSize: tam,
        lineHeight: 1.02,
        letterSpacing: -2,
        opacity: sai,
        filter: 'drop-shadow(0 6px 0 rgba(0,0,0,0.9)) drop-shadow(0 14px 24px rgba(0,0,0,0.8))',
      }}
    >
      {palavras.map((p, i) => {
        const destaque = p.startsWith('*');
        const limpa = p.replace(/\*/g, '');
        const m = mola(frame, de + i * 3, {damping: 11});
        return (
          <span key={i} style={{display: 'inline-block', marginRight: '0.26em', transform: `translateY(${(1 - m) * 60}px) scale(${0.6 + m * 0.4})`, opacity: Math.min(1, m * 1.5)}}>
            <span style={destaque ? degrade : {color: '#fff'}}>{limpa}</span>
          </span>
        );
      })}
    </div>
  );
};
