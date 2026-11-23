import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import '../fontes';
import {aleatorio, expoOut, power3In, rampa, V3} from '../anim';
import {Tela3D} from '../tres/Tela3D';
import {Camera} from '../tres/Camera';
import {Luzes} from '../tres/pecas';

// ---------- O mundo: chão em grade, névoa, painéis ao longe e poeira no ar ----------
const texturaGrade = (): THREE.CanvasTexture => {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d')!;
  g.fillStyle = '#000';
  g.fillRect(0, 0, 256, 256);
  g.strokeStyle = '#2dd4bf';
  g.lineWidth = 5;
  g.strokeRect(0, 0, 256, 256);
  g.strokeStyle = 'rgba(45,212,191,0.35)';
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(128, 0);
  g.lineTo(128, 256);
  g.moveTo(0, 128);
  g.lineTo(256, 128);
  g.stroke();
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(70, 70);
  t.anisotropy = 16;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

const texturaPainel = (semente: number): THREE.CanvasTexture => {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 288;
  const g = c.getContext('2d')!;
  g.fillStyle = '#071d1b';
  g.fillRect(0, 0, 512, 288);
  const cores = ['#2dd4bf', '#22d3ee', '#f97316', '#818cf8', '#34d399'];
  for (let linha = 0; linha < 5; linha++) {
    let x = 14;
    let k = 0;
    while (x < 490) {
      const w = 40 + aleatorio(semente * 31 + linha * 7 + k) * 130;
      g.fillStyle = cores[Math.floor(aleatorio(semente * 13 + linha * 5 + k * 3) * cores.length)];
      g.globalAlpha = 0.75;
      g.fillRect(x, 26 + linha * 50, Math.min(w, 498 - x), 34);
      x += w + 8;
      k++;
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

const PAINEIS: {p: V3; l: number; r: number}[] = [
  {p: [-26, 9, -34], l: 16, r: 0.5},
  {p: [24, 12, -40], l: 20, r: -0.45},
  {p: [-9, 17, -52], l: 22, r: 0.15},
  {p: [38, 6, -22], l: 12, r: -0.9},
  {p: [-40, 7, -14], l: 12, r: 1.0},
  {p: [8, 22, -60], l: 26, r: -0.1},
  {p: [-30, 20, 26], l: 16, r: 2.4},
  {p: [32, 16, 30], l: 16, r: -2.5},
  {p: [0, 14, 44], l: 22, r: Math.PI},
];

export const Mundo: React.FC<{f: number; escuro?: number}> = ({f, escuro = 0}) => {
  const grade = useMemo(texturaGrade, []);
  const paineis = useMemo(() => PAINEIS.map((_, i) => texturaPainel(i + 1)), []);
  const poeira = useMemo(() => {
    const n = 260;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (aleatorio(i) - 0.5) * 70;
      pos[i * 3 + 1] = aleatorio(i + 500) * 22;
      pos[i * 3 + 2] = (aleatorio(i + 900) - 0.5) * 70;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  return (
    <>
      <fog attach="fog" args={['#04100f', 16, 78]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[280, 280]} />
        <meshStandardMaterial color="#04100f" roughness={0.28} metalness={0.75} emissive="#ffffff" emissiveMap={grade} emissiveIntensity={0.55 * (1 - escuro * 0.7)} />
      </mesh>
      {PAINEIS.map((pa, i) => (
        <mesh key={i} position={[pa.p[0], pa.p[1] + Math.sin(f / 70 + i * 2) * 0.6, pa.p[2]]} rotation={[0, pa.r, Math.sin(f / 110 + i) * 0.03]}>
          <planeGeometry args={[pa.l, pa.l * 0.5625]} />
          <meshBasicMaterial map={paineis[i]} transparent opacity={0.8 * (1 - escuro * 0.8)} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <points geometry={poeira} position={[Math.sin(f / 160) * 2, Math.sin(f / 90) * 0.6, f * 0.012]}>
        <pointsMaterial color="#8ff5e6" size={0.11} sizeAttenuation transparent opacity={0.75} depthWrite={false} />
      </points>
    </>
  );
};

// ---------- Palco: fundo, tela 3D, câmera, luzes e mundo ----------
export const Palco: React.FC<{
  f: number;
  pos: V3;
  alvo: V3;
  rolo?: number;
  fov?: number;
  borrao?: number; // desfoque de movimento nas trocas de cena, em px
  escuro?: number; // 0 a 1: apaga o ambiente
  children: React.ReactNode;
}> = ({f, pos, alvo, rolo = 0, fov = 40, borrao = 0, escuro = 0, children}) => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 38%, #0c3b37 0%, #051514 55%, #020807 100%)'}}>
    <AbsoluteFill style={{filter: borrao > 0.4 ? `blur(${borrao.toFixed(1)}px)` : undefined, transform: borrao > 0.4 ? `scale(${1 + borrao * 0.004})` : undefined}}>
      <Tela3D>
        <Camera pos={pos} alvo={alvo} fov={fov} rolo={rolo} />
        <Luzes corA="#2dd4bf" corB="#22d3ee" forcaA={260 * (1 - escuro * 0.75)} forcaB={220 * (1 - escuro * 0.75)} />
        <Mundo f={f} escuro={escuro} />
        {children}
      </Tela3D>
    </AbsoluteFill>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.62) 100%)', pointerEvents: 'none'}} />
    {escuro > 0 ? <AbsoluteFill style={{background: '#020308', opacity: escuro * 0.45}} /> : null}
  </AbsoluteFill>
);

// ---------- Destaque: só a palavra que importa, na hora em que é dita ----------
const degrade: React.CSSProperties = {
  background: 'linear-gradient(180deg, #ffc091 0%, #f2622e 68%, #c2410c 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  display: 'inline-block',
  padding: '0.1em 0.14em',
  margin: '-0.1em -0.14em',
};

export const Destaque: React.FC<{
  texto: string; // palavras entre * saem em laranja
  de: number;
  ate: number;
  tam?: number;
  onde?: 'baixo' | 'topo' | 'centro';
}> = ({texto, de, ate, tam = 150, onde = 'baixo'}) => {
  const f = useCurrentFrame();
  if (f < de || f > ate) return null;
  const entra = rampa(f, de, de + 8, expoOut);
  const sai = rampa(f, ate - 8, ate, power3In);
  const lugar: React.CSSProperties = onde === 'baixo' ? {bottom: 90} : onde === 'topo' ? {top: 80} : {top: '50%', marginTop: -tam * 0.6};
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        ...lugar,
        textAlign: 'center',
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 900,
        fontSize: tam,
        lineHeight: 1,
        letterSpacing: -4,
        opacity: entra * (1 - sai),
        transform: `scale(${1.35 - entra * 0.35 - sai * 0.2}) translateY(${sai * 70}px)`,
        filter: `blur(${((1 - entra) * 14 + sai * 10).toFixed(1)}px) drop-shadow(0 8px 0 rgba(0,0,0,0.85)) drop-shadow(0 18px 30px rgba(0,0,0,0.8))`,
      }}
    >
      {texto.split(' ').map((p, i) => (
        <span key={i} style={{marginRight: '0.22em'}}>
          <span style={p.startsWith('*') ? degrade : {color: '#fff'}}>{p.replace(/\*/g, '')}</span>
        </span>
      ))}
    </div>
  );
};
