import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import './fontes';
import {cores, vivas, fonte, fonteTitulo} from './tema';
import {Personagem3D} from './tres/Personagem3D';
import {Bloco, Clipe3D, Luzes, ChaoSombra} from './tres/pecas';
import {Camera} from './tres/Camera';

const Fundo: React.FC<{brilhoX?: number; brilhoY?: number}> = ({brilhoX = 74, brilhoY = 38}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at ${brilhoX}% ${brilhoY}%, rgba(217,119,87,0.55) 0%, rgba(217,119,87,0.16) 28%, rgba(20,20,19,0) 56%), ${cores.fundo}`,
    }}
  />
);

const Tela3D: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows
      gl={{antialias: true, alpha: true}}
      onCreated={({gl}) => {
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
      }}
      style={{position: 'absolute', inset: 0}}
    >
      {children}
    </ThreeCanvas>
  );
};

const sombraTexto = '0 2px 0 #000, 0 5px 0 rgba(0,0,0,0.85), 0 9px 0 rgba(0,0,0,0.6), 0 18px 30px rgba(0,0,0,0.6)';

const Titulo: React.FC<{children: React.ReactNode; tam?: number; left?: number; top?: number}> = ({children, tam = 186, left = 60, top = 26}) => (
  <div style={{position: 'absolute', left, top, fontFamily: fonteTitulo, color: cores.creme, fontSize: tam, lineHeight: 0.98, letterSpacing: 1, textShadow: sombraTexto}}>{children}</div>
);

const Etiqueta: React.FC<{children: React.ReactNode; left: number; top: number; giro?: number; cor?: string; texto?: string; tam?: number}> = ({children, left, top, giro = -3, cor = cores.creme, texto = cores.fundo, tam = 54}) => (
  <div style={{position: 'absolute', left, top, background: cor, color: texto, fontFamily: fonte, fontWeight: 800, fontSize: tam, padding: '6px 30px', borderRadius: 16, transform: `rotate(${giro}deg)`, boxShadow: '0 5px 0 rgba(0,0,0,0.75), 0 16px 26px rgba(0,0,0,0.5)'}}>{children}</div>
);

// Capa A: personagem em cima da linha do tempo que se corta sozinha.
export const CapaA: React.FC = () => (
  <AbsoluteFill style={{fontFamily: fonte}}>
    <Fundo />
    <Tela3D>
      <Camera pos={[-1.7, 2.7, 9.4]} alvo={[-0.95, 1.55, 0]} fov={34} />
      <Luzes />
      <ChaoSombra y={-0.62} />
      {/* trilho */}
      <Bloco tam={[30, 0.5, 2]} cor="#33302d" posicao={[0, -0.36, 0]} raio={0.12} rugosidade={0.8} />
      <Clipe3D larg={2.6} cor={vivas.azul} posicao={[-5.5, 0.2, 0]} semente={1} />
      <Clipe3D larg={2.9} cor={vivas.verde} posicao={[-2.6, 0.2, 0]} semente={2} />
      <Clipe3D larg={1.5} cor={vivas.vermelho} posicao={[0.2, 0.75, 1.0]} rotacao={[0.55, 0.3, -0.42]} semente={3} />
      <Clipe3D larg={4.6} cor={vivas.azul} posicao={[4.75, 0.2, 0]} semente={4} />
      {/* agulha luminosa */}
      <Bloco tam={[0.08, 2.0, 0.08]} cor={cores.creme} posicao={[2.15, 0.55, 0.9]} raio={0.03} emissivo={cores.creme} intensidade={2.2} sombra={false} />
      <Personagem3D posicao={[2.15, 2.72, 0.1]} rotacao={[0.1, -0.42, 0.12]} escala={1.28} olhar={[-0.7, -0.6]} />
    </Tela3D>
    <Titulo>
      <div>EDITADO</div>
      <div>
        POR <span style={{color: cores.laranja}}>IA</span>
      </div>
    </Titulo>
    <Etiqueta left={66} top={398}>
      0 editores
    </Etiqueta>
  </AbsoluteFill>
);

// Capa B: bruto de um lado, pronto do outro, personagem na divisa.
const bagunca: [number, number, number, number, number, number, number][] = [
  // x, y, z, rotX, rotY, rotZ, largura
  [-6.3, 0.45, 0.2, 0.3, 0.5, 0.35, 2.0],
  [-4.3, 0.2, 0.9, -0.2, -0.4, -0.12, 2.4],
  [-2.5, 0.75, -0.2, 0.5, 0.2, 0.5, 1.6],
  [-5.2, 1.7, -0.6, 0.2, -0.3, -0.45, 1.8],
  [-3.1, 2.1, -0.3, -0.4, 0.4, 0.22, 1.5],
  [-6.6, 2.7, -0.9, 0.3, 0.2, 0.7, 1.3],
];
const arrumado: [number, number, number, string][] = [
  // x, y, largura, cor
  [2.55, 0.3, 2.3, vivas.azul],
  [5.05, 0.3, 2.5, vivas.verde],
  [2.2, 1.0, 1.6, cores.laranja],
  [4.2, 1.0, 2.2, vivas.azul],
  [6.25, 1.0, 1.7, vivas.verde],
  [2.9, 1.7, 3.0, vivas.verde],
  [5.6, 1.7, 2.2, cores.laranja],
];

export const CapaB: React.FC = () => (
  <AbsoluteFill style={{fontFamily: fonte}}>
    <AbsoluteFill style={{background: 'linear-gradient(90deg, #232323 0%, #2c2c2c 50%, #141413 50%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(circle at 76% 62%, rgba(217,119,87,0.6) 0%, rgba(217,119,87,0.18) 30%, rgba(20,20,19,0) 55%)', clipPath: 'inset(0 0 0 50%)'}} />
    <Tela3D>
      <Camera pos={[0, 2.5, 12.2]} alvo={[0, 1.75, 0]} fov={34} />
      <Luzes />
      <ChaoSombra y={-0.05} opacidade={0.5} />
      {bagunca.map(([x, y, z, rx, ry, rz, l], i) => (
        <Clipe3D key={i} larg={l} cor={vivas.cinza} posicao={[x, y, z]} rotacao={[rx, ry, rz]} semente={i} />
      ))}
      {arrumado.map(([x, y, l, cor], i) => (
        <Clipe3D key={i} larg={l} cor={cor} posicao={[x, y, 0]} rotacao={[0.25, 0, 0]} semente={i + 7} />
      ))}
      {/* divisa luminosa */}
      <Bloco tam={[0.09, 9, 0.09]} cor={cores.creme} posicao={[0, 3, 0]} raio={0.03} emissivo={cores.creme} intensidade={2.4} sombra={false} />
      <Personagem3D posicao={[0, 1.6, 1.6]} rotacao={[0.05, 0.3, -0.1]} escala={1.5} olhar={[0.7, 0.2]} />
    </Tela3D>
    <div style={{position: 'absolute', left: 0, width: 640, top: 14, textAlign: 'center', fontFamily: fonteTitulo, fontSize: 168, color: '#b9b6b0', textShadow: sombraTexto, letterSpacing: 2}}>BRUTO</div>
    <div style={{position: 'absolute', left: 640, width: 640, top: 14, textAlign: 'center', fontFamily: fonteTitulo, fontSize: 168, color: cores.laranja, textShadow: sombraTexto, letterSpacing: 2}}>CLAUDE</div>
  </AbsoluteFill>
);

// Capa C: personagem com a tesoura cortando a tira de filme.
const Filme: React.FC<{posicao: [number, number, number]; rotacao: [number, number, number]; quadros: string[]}> = ({posicao, rotacao, quadros}) => {
  const larg = quadros.length * 1.5 + 0.2;
  return (
    <group position={posicao} rotation={rotacao}>
      <Bloco tam={[larg, 1.7, 0.16]} cor="#262422" raio={0.06} rugosidade={0.5} />
      {quadros.map((cor, i) => (
        <Bloco key={i} tam={[1.25, 0.95, 0.06]} cor={cor} raio={0.05} posicao={[-larg / 2 + 0.85 + i * 1.5, 0, 0.09]} sombra={false} />
      ))}
      {Array.from({length: Math.floor(larg / 0.42)}).map((_, i) =>
        [-0.68, 0.68].map((y) => <Bloco key={`${i}${y}`} tam={[0.2, 0.16, 0.05]} cor={cores.creme} raio={0.03} posicao={[-larg / 2 + 0.3 + i * 0.42, y, 0.08]} sombra={false} />)
      )}
    </group>
  );
};

const Tesoura: React.FC<{posicao: [number, number, number]; rotacao: [number, number, number]; escala?: number}> = ({posicao, rotacao, escala = 1}) => (
  <group position={posicao} rotation={rotacao} scale={escala}>
    {[1, -1].map((s) => (
      <group key={s} rotation={[0, 0, s * 0.4]} position={[0, 0, s * 0.04]}>
        <Bloco tam={[2.2, 0.34, 0.08]} cor="#f1eee6" raio={0.035} rugosidade={0.2} posicao={[1.05, 0, 0]} />
        <mesh position={[-0.86, -s * 0.2, 0]} castShadow>
          <torusGeometry args={[0.38, 0.12, 16, 40]} />
          <meshStandardMaterial color={cores.laranja} roughness={0.4} />
        </mesh>
      </group>
    ))}
    <mesh position={[0, 0, 0.1]}>
      <cylinderGeometry args={[0.09, 0.09, 0.12, 20]} />
      <meshStandardMaterial color="#8a877f" roughness={0.3} />
    </mesh>
  </group>
);

export const CapaC: React.FC = () => (
  <AbsoluteFill style={{fontFamily: fonte}}>
    <Fundo brilhoX={82} brilhoY={36} />
    <Tela3D>
      <Camera pos={[0, 1.6, 12]} alvo={[0, 1.35, 0]} fov={34} />
      <Luzes />
      <ChaoSombra y={-1.9} opacidade={0.4} />
      <Filme posicao={[-3.05, -0.55, 0]} rotacao={[0.1, 0.25, -0.2]} quadros={[vivas.azul, vivas.verde, vivas.azul, vivas.vermelho]} />
      <Filme posicao={[5.2, -0.2, 0.2]} rotacao={[0.1, -0.2, 0.3]} quadros={[vivas.verde, vivas.azul]} />
      <Tesoura posicao={[1.95, 0.75, 1.2]} rotacao={[0, -0.15, -1.72]} escala={0.95} />
      <Personagem3D posicao={[4.35, 2.75, 0.6]} rotacao={[0.1, -0.4, 0.1]} escala={1.35} olhar={[-0.8, -0.8]} />
    </Tela3D>
    <Titulo tam={200} left={56} top={22}>
      <div>
        <span style={{color: cores.laranja}}>5</span> PASSOS
      </div>
    </Titulo>
    <Etiqueta left={62} top={262} tam={50}>
      para editar com IA
    </Etiqueta>
  </AbsoluteFill>
);
