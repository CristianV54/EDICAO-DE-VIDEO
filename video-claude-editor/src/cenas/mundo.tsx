import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import '../fontes';
import {aleatorio, expoOut, power3In, rampa, V3} from '../anim';
import {Tela3D} from '../tres/Tela3D';
import {Camera} from '../tres/Camera';
import {Luzes} from '../tres/pecas';
import {texturaHalo} from '../tres/formas';

// ---------- O mundo: chão em grade, névoa, painéis ao longe e poeira no ar ----------
const texturaGrade = (cor: string): THREE.CanvasTexture => {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d')!;
  g.fillStyle = '#000';
  g.fillRect(0, 0, 256, 256);
  g.strokeStyle = cor;
  g.lineWidth = 5;
  g.strokeRect(0, 0, 256, 256);
  g.strokeStyle = cor;
  g.globalAlpha = 0.35;
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

// Cada trecho do vídeo tem o seu ambiente, para o fundo não ser sempre o mesmo.
export type Tema = {grade: string; neblina: string; ceu: string; luzA: string; luzB: string; poeira: string; extra?: 'espuma' | 'furos' | 'sol'};
const base = {grade: '#343c43', neblina: '#050607', luzA: '#ffe1cf', luzB: '#f2622e', poeira: '#cfd6dc'};
const brilho = (x: number, y: number, forca: number) => `radial-gradient(ellipse at ${x}% ${y}%, rgba(242,98,46,${forca}) 0%, rgba(5,6,7,0) 46%), radial-gradient(ellipse at ${100 - x}% ${100 - y}%, rgba(255,255,255,0.045) 0%, rgba(5,6,7,0) 40%), #050607`;
export const TEMAS: Record<string, Tema> = {
  estudio: {...base, ceu: brilho(74, 78, 0.2)},
  cemiterio: {...base, ceu: brilho(50, 12, 0.1)},
  gravacao: {...base, ceu: brilho(22, 70, 0.2), extra: 'espuma'},
  aurora: {...base, ceu: brilho(60, 92, 0.3), extra: 'sol'},
  vitrine: {...base, ceu: brilho(82, 40, 0.18)},
  oficina: {...base, ceu: brilho(20, 22, 0.16), extra: 'furos'},
};

const texturaEspuma = (): THREE.CanvasTexture => {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const g = c.getContext('2d')!;
  const tri = (pts: number[], cor: string) => {
    g.fillStyle = cor;
    g.beginPath();
    g.moveTo(pts[0], pts[1]);
    g.lineTo(pts[2], pts[3]);
    g.lineTo(pts[4], pts[5]);
    g.fill();
  };
  tri([0, 0, 128, 0, 64, 64], '#24282c');
  tri([128, 0, 128, 128, 64, 64], '#191c1f');
  tri([0, 128, 128, 128, 64, 64], '#101214');
  tri([0, 0, 0, 128, 64, 64], '#1e2225');
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(34, 12);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};
const texturaFuros = (): THREE.CanvasTexture => {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const g = c.getContext('2d')!;
  g.fillStyle = '#14171a';
  g.fillRect(0, 0, 64, 64);
  g.fillStyle = '#060708';
  g.beginPath();
  g.arc(32, 32, 9, 0, Math.PI * 2);
  g.fill();
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(70, 26);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

const LUZES_LONGE: {p: V3; t: number}[] = Array.from({length: 26}).map((_, i) => {
  const ang = (i / 26) * Math.PI * 2 + aleatorio(i + 70) * 0.5;
  const raio = 30 + aleatorio(i + 80) * 26;
  return {p: [Math.sin(ang) * raio, 2 + aleatorio(i + 90) * 22, Math.cos(ang) * raio] as V3, t: 5 + aleatorio(i + 100) * 9};
});

export const Mundo: React.FC<{f: number; escuro?: number; tema?: Tema}> = ({f, escuro = 0, tema = TEMAS.estudio}) => {
  const grade = useMemo(() => texturaGrade(tema.grade), [tema.grade]);
  const bokehA = useMemo(() => texturaHalo(tema.luzA), [tema.luzA]);
  const bokehB = useMemo(() => texturaHalo(tema.luzB), [tema.luzB]);
  const espuma = useMemo(() => (tema.extra === 'espuma' ? texturaEspuma() : null), [tema.extra]);
  const furos = useMemo(() => (tema.extra === 'furos' ? texturaFuros() : null), [tema.extra]);
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
      <fog attach="fog" args={[tema.neblina, 11, 52]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[280, 280]} />
        <meshStandardMaterial color={tema.neblina} roughness={0.28} metalness={0.75} emissive="#ffffff" emissiveMap={grade} emissiveIntensity={0.16 * (1 - escuro * 0.7)} />
      </mesh>
      {/* luzes desfocadas ao longe, no lugar de objetos nítidos que brigam com a frente */}
      {LUZES_LONGE.map((l, i) => (
        <sprite key={i} position={[l.p[0] + Math.sin(f / 120 + i) * 1.2, l.p[1] + Math.cos(f / 95 + i * 2) * 0.8, l.p[2]]} scale={[l.t, l.t, 1]}>
          <spriteMaterial map={i % 3 === 0 ? bokehB : bokehA} transparent opacity={(i % 3 === 0 ? 0.16 : 0.05) * (1 + 0.4 * Math.sin(f / 40 + i * 1.7)) * (1 - escuro * 0.7) * (tema.extra === 'espuma' || tema.extra === 'furos' ? 0.5 : 1)} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} />
        </sprite>
      ))}
      {espuma ? (
        <mesh position={[6, 11, -8]} receiveShadow>
          <planeGeometry args={[110, 38]} />
          <meshStandardMaterial map={espuma} roughness={0.95} />
        </mesh>
      ) : null}
      {furos ? (
        <mesh position={[0, 11, -5]} receiveShadow>
          <planeGeometry args={[120, 44]} />
          <meshStandardMaterial map={furos} roughness={0.8} />
        </mesh>
      ) : null}
      {tema.extra === 'sol' ? (
        <group position={[5, 7, -30]}>
          <mesh>
            <circleGeometry args={[11, 64]} />
            <meshBasicMaterial color="#ff7a3d" fog={false} />
          </mesh>
          <mesh position={[0, 0, -0.5]}>
            <circleGeometry args={[19, 64]} />
            <meshBasicMaterial color="#ff7a3d" transparent opacity={0.22} fog={false} />
          </mesh>
        </group>
      ) : null}
      <points geometry={poeira} position={[Math.sin(f / 160) * 2, Math.sin(f / 90) * 0.6, f * 0.012]}>
        <pointsMaterial color={tema.poeira} size={0.07} sizeAttenuation transparent opacity={0.45} depthWrite={false} />
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
  tema?: Tema;
  children: React.ReactNode;
}> = ({f, pos, alvo, rolo = 0, fov = 40, borrao = 0, escuro = 0, tema = TEMAS.estudio, children}) => (
  <AbsoluteFill style={{background: tema.ceu}}>
    <AbsoluteFill style={{filter: borrao > 0.4 ? `blur(${borrao.toFixed(1)}px)` : undefined, transform: borrao > 0.4 ? `scale(${1 + borrao * 0.004})` : undefined}}>
      <Tela3D>
        <Camera pos={pos} alvo={alvo} fov={fov} rolo={rolo} />
        <Luzes corA={tema.luzA} corB={tema.luzB} forcaA={110 * (1 - escuro * 0.75)} forcaB={90 * (1 - escuro * 0.75)} />
        <Mundo f={f} escuro={escuro} tema={tema} />
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
  quadro?: number; // se a cena for cortada em duas partes, o quadro contínuo dela
}> = ({texto, de, ate, tam = 150, onde = 'baixo', quadro}) => {
  const atual = useCurrentFrame();
  const f = quadro ?? atual;
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
