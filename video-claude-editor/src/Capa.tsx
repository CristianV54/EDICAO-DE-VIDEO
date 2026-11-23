import React from 'react';
import {AbsoluteFill} from 'remotion';
import './fontes';
import {cores, vivas, fonte, fonteTitulo} from './tema';
import {Icone3D} from './tres/Icone3D';
import {DaVinci3D, Premiere3D} from './tres/Apps3D';
import {Tela3D} from './tres/Tela3D';
import {Mascote3D} from './tres/Mascote3D';
import {Estilhacos} from './tres/Estilhacos';
import {FundoEstudio, TelaEditor} from './capa/TelaEditor';
import {Bloco, Clipe3D, Luzes, ChaoSombra} from './tres/pecas';
import {Camera} from './tres/Camera';

const Fundo: React.FC<{brilhoX?: number; brilhoY?: number}> = ({brilhoX = 74, brilhoY = 38}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at ${brilhoX}% ${brilhoY}%, rgba(217,119,87,0.55) 0%, rgba(217,119,87,0.16) 28%, rgba(20,20,19,0) 56%), ${cores.fundo}`,
    }}
  />
);

const sombraTexto = '0 2px 0 #000, 0 5px 0 rgba(0,0,0,0.85), 0 9px 0 rgba(0,0,0,0.6), 0 18px 30px rgba(0,0,0,0.6)';

const Titulo: React.FC<{children: React.ReactNode; tam?: number; left?: number; top?: number}> = ({children, tam = 186, left = 60, top = 26}) => (
  <div style={{position: 'absolute', left, top, fontFamily: fonteTitulo, color: cores.creme, fontSize: tam, lineHeight: 0.98, letterSpacing: 1, textShadow: sombraTexto}}>{children}</div>
);

const Etiqueta: React.FC<{children: React.ReactNode; left: number; top: number; giro?: number; cor?: string; texto?: string; tam?: number}> = ({children, left, top, giro = -3, cor = cores.creme, texto = cores.fundo, tam = 54}) => (
  <div style={{position: 'absolute', left, top, background: cor, color: texto, fontFamily: fonte, fontWeight: 800, fontSize: tam, padding: '6px 30px', borderRadius: 16, transform: `rotate(${giro}deg)`, boxShadow: '0 5px 0 rgba(0,0,0,0.75), 0 16px 26px rgba(0,0,0,0.5)'}}>{children}</div>
);

const degradeLaranja: React.CSSProperties = {background: 'linear-gradient(180deg, #ffb27a 0%, #f2622e 70%, #c2410c 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'};
const textoForte = (tam: number): React.CSSProperties => ({
  position: 'absolute',
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 900,
  fontSize: tam,
  lineHeight: 0.98,
  letterSpacing: -3,
  filter: 'drop-shadow(0 6px 0 rgba(0,0,0,0.9)) drop-shadow(0 14px 22px rgba(0,0,0,0.75))',
});

// Capa A: estúdio ao fundo, tela de edição estilhaçada, bloco do Claude gigante e mascote.
export const CapaA: React.FC = () => (
  <AbsoluteFill style={{fontFamily: fonte}}>
    <FundoEstudio />
    <div style={{position: 'absolute', inset: 0, perspective: 1500}}>
      <TelaEditor larg={760} alt={450} impacto={[78, 46]} estilo={{left: 26, top: 22, transform: 'rotateY(16deg) rotateX(3deg) rotateZ(-2deg)', transformOrigin: 'left center'}} />
    </div>
    <Tela3D>
      <Camera pos={[0, 1.5, 12]} alvo={[0, 1.5, 0]} fov={34} />
      <Luzes corA="#2dd4bf" corB="#22d3ee" forcaA={260} forcaB={220} />
      <Estilhacos centro={[-0.15, 2.5, 0.5]} />
      <Icone3D posicao={[-0.15, 2.5, 2.2]} rotacao={[0.12, 0.38, -0.16]} escala={1.45} brilho={0.4} halo={4.6} />
      <Mascote3D posicao={[4.0, -1.75, 1.5]} rotacao={[0.04, -0.4, 0]} escala={2.15} />
    </Tela3D>
    <div style={{...textoForte(118), left: 44, top: 452}}>
      <div style={{color: '#ffffff'}}>EDITADO</div>
      <div style={degradeLaranja}>POR IA</div>
    </div>
  </AbsoluteFill>
);

// Capa B: metade esquerda cinza (bruto), metade direita viva (Claude), bloco quebrando a divisa.
export const CapaB: React.FC = () => (
  <AbsoluteFill style={{fontFamily: fonte}}>
    <FundoEstudio />
    <div style={{position: 'absolute', inset: 0, perspective: 1500}}>
      <TelaEditor larg={600} alt={360} estilo={{left: 14, top: 170, transform: 'rotateY(20deg) rotateZ(-3deg)', transformOrigin: 'left center'}} />
      <TelaEditor larg={600} alt={360} impacto={[8, 45]} estilo={{left: 666, top: 170, transform: 'rotateY(-20deg) rotateZ(3deg)', transformOrigin: 'right center'}} />
    </div>
    <div style={{position: 'absolute', left: 0, top: 0, width: 640, height: 720, backdropFilter: 'grayscale(1) brightness(0.62) contrast(0.9)', background: 'rgba(30,30,30,0.25)'}} />
    <div style={{position: 'absolute', left: 637, top: 0, width: 6, height: 720, background: '#fff', boxShadow: '0 0 30px #5eead4, 0 0 60px #5eead4'}} />
    <Tela3D>
      <Camera pos={[0, 1.5, 12]} alvo={[0, 1.5, 0]} fov={34} />
      <Luzes corA="#9ca3af" corB="#22d3ee" forcaA={160} forcaB={260} />
      <Estilhacos centro={[0, 1.3, 0.5]} quantos={30} raioMin={2.1} raioMax={4.2} semente={3} />
      <Icone3D posicao={[0, 1.3, 2.2]} rotacao={[0.1, 0.3, -0.12]} escala={1.5} brilho={0.4} halo={4.6} />
    </Tela3D>
    <div style={{...textoForte(116), left: 0, width: 640, top: 22, textAlign: 'center', color: '#b8b8b8'}}>BRUTO</div>
    <div style={{...textoForte(116), left: 640, width: 640, top: 22, textAlign: 'center'}}>
      <span style={degradeLaranja}>CLAUDE</span>
    </div>
  </AbsoluteFill>
);

// Capa C: bloco do Claude brilhando, e os programas de edição caídos e rachados.
export const CapaC: React.FC = () => (
  <AbsoluteFill style={{fontFamily: fonte}}>
    <FundoEstudio />
    <div style={{position: 'absolute', inset: 0, perspective: 1500, filter: 'brightness(0.6)'}}>
      <TelaEditor larg={660} alt={390} impacto={[40, 40]} estilo={{left: 590, top: 40, transform: 'rotateY(-16deg) rotateZ(2deg)', transformOrigin: 'right center'}} />
    </div>
    <Tela3D>
      <Camera pos={[0, 1.5, 12]} alvo={[0, 1.5, 0]} fov={34} />
      <Luzes corA="#2dd4bf" corB="#22d3ee" forcaA={240} forcaB={220} />
      <Estilhacos centro={[-1.3, -0.4, 1]} quantos={26} raioMin={1.6} raioMax={5} semente={5} />
      <Premiere3D rachado vida={0.3} posicao={[-4.0, 0.15, 2.0]} rotacao={[-0.42, 0.42, 0.3]} escala={1.15} />
      <DaVinci3D rachado vida={0.3} posicao={[-0.5, -0.25, 2.6]} rotacao={[-0.5, -0.2, -0.3]} escala={1.12} />
      <Icone3D posicao={[3.75, 2.55, 2]} rotacao={[0.1, -0.42, 0.12]} escala={1.5} brilho={0.5} halo={5} />
    </Tela3D>
    <div style={{...textoForte(112), left: 44, top: 22}}>
      <div style={{color: '#ffffff'}}>ADEUS,</div>
      <div style={degradeLaranja}>EDITOR</div>
    </div>
  </AbsoluteFill>
);
