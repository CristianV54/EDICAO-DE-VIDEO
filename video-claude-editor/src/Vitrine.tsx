import React from 'react';
import {AbsoluteFill} from 'remotion';
import {cores} from './tema';
import {Tela3D} from './tres/Tela3D';
import {Camera} from './tres/Camera';
import {Luzes, ChaoSombra} from './tres/pecas';
import {Icone3D} from './tres/Icone3D';
import {DaVinci3D, Premiere3D} from './tres/Apps3D';
import {Mascote3D} from './tres/Mascote3D';

// Vitrine dos objetos, para comparar com as referências.
export const Vitrine: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, #3a2a22 0%, ${cores.fundo} 70%)`}}>
    <Tela3D>
      <Camera pos={[0, 2.2, 12.5]} alvo={[0, 1.2, 0]} fov={34} />
      <Luzes />
      <ChaoSombra y={0} opacidade={0.5} />
      <Icone3D posicao={[-4.6, 1.5, 0]} rotacao={[0.12, 0.5, -0.12]} escala={1.05} />
      <Mascote3D posicao={[-1.5, 0, 0.5]} rotacao={[0, 0.45, 0]} escala={1.35} />
      <DaVinci3D posicao={[1.7, 1.5, 0]} rotacao={[0.15, -0.45, 0.1]} escala={1.05} />
      <Premiere3D posicao={[4.9, 1.5, 0]} rotacao={[0.15, -0.55, 0.1]} escala={1.05} />
    </Tela3D>
  </AbsoluteFill>
);
