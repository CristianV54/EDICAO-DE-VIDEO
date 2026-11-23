import React from 'react';
import {useCurrentFrame} from 'remotion';
import {cores} from './tema';

// Personagem: estrela laranja de pontas arredondadas, com olhos.
// Desenho próprio, inspirado no símbolo do Claude.
const RAIOS = [1, 0.78, 0.95, 0.7, 1, 0.8, 0.92, 0.72, 1, 0.76, 0.9, 0.74];

export const Personagem: React.FC<{
  tamanho?: number;
  olharX?: number; // -1 a 1
  olharY?: number;
  giro?: number; // graus
}> = ({tamanho = 300, olharX = 0, olharY = 0, giro = 0}) => {
  const frame = useCurrentFrame();
  const respira = 1 + Math.sin(frame / 9) * 0.025;
  // pisca a cada 75 quadros, por 5 quadros
  const fase = frame % 75;
  const olhoAberto = fase < 5 ? Math.abs(fase - 2.5) / 2.5 : 1;
  return (
    <svg width={tamanho} height={tamanho} viewBox="-100 -100 200 200" style={{overflow: 'visible'}}>
      <g transform={`rotate(${giro}) scale(${respira})`}>
        {RAIOS.map((r, i) => {
          const ang = (i * 360) / RAIOS.length;
          const mexe = Math.sin(frame / 7 + i * 1.7) * 3;
          return (
            <line
              key={i}
              x1={0}
              y1={0}
              x2={0}
              y2={-(88 * r + mexe)}
              stroke={cores.laranja}
              strokeWidth={25}
              strokeLinecap="round"
              transform={`rotate(${ang})`}
            />
          );
        })}
        <circle r={50} fill={cores.laranja} />
      </g>
      <g transform={`translate(${olharX * 7} ${olharY * 6})`}>
        <ellipse cx={-17} cy={-3} rx={9.5} ry={15 * Math.max(0.1, olhoAberto)} fill={cores.fundo} />
        <ellipse cx={17} cy={-3} rx={9.5} ry={15 * Math.max(0.1, olhoAberto)} fill={cores.fundo} />
      </g>
    </svg>
  );
};
