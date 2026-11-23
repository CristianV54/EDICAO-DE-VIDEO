import React, {useEffect, useMemo, useState} from 'react';
import {continueRender, delayRender} from 'remotion';
import * as THREE from 'three';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js';
import helvetiker from 'three/examples/fonts/helvetiker_bold.typeface.json';

// Espera a fonte dos rótulos carregar antes de mostrar a cena.
// Precisa ficar fora da tela 3D: lá dentro, uma mudança de estado não redesenha o quadro.
export const EsperaFonte: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [pronta, setPronta] = useState(false);
  const [espera] = useState(() => delayRender('fonte dos rótulos'));
  useEffect(() => {
    document.fonts.load('900 80px Montserrat').then(() => {
      setPronta(true);
      continueRender(espera);
    });
  }, [espera]);
  return pronta ? <>{children}</> : null;
};

// Textura desenhada em canvas. Use dentro de EsperaFonte.
export const usarTextura = (chave: string, desenhar: (g: CanvasRenderingContext2D, w: number, h: number) => void, w = 1024, h = 256): THREE.CanvasTexture =>
  useMemo(() => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    desenhar(c.getContext('2d')!, w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [chave]);

// Texto em um plano, para rótulos com acento.
export const Rotulo3D: React.FC<{
  texto: string;
  larg: number;
  posicao?: [number, number, number];
  rotacao?: [number, number, number];
  cor?: string;
  opacidade?: number;
}> = ({texto, larg, posicao = [0, 0, 0], rotacao = [0, 0, 0], cor = '#ffffff', opacidade = 1}) => {
  const tex = usarTextura(`${texto}-${cor}`, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.fillStyle = cor;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    let tam = 170;
    g.font = `900 ${tam}px Montserrat`;
    const m = g.measureText(texto).width;
    if (m > w - 40) tam = (tam * (w - 40)) / m;
    g.font = `900 ${tam}px Montserrat`;
    g.fillText(texto, w / 2, h / 2 + 6);
  });
  return (
    <mesh position={posicao} rotation={rotacao}>
      <planeGeometry args={[larg, larg / 4]} />
      <meshBasicMaterial map={tex} transparent opacity={opacidade} toneMapped={false} depthWrite={false} />
    </mesh>
  );
};

const fonte3d = new FontLoader().parse(helvetiker as never);

// Número ou sigla em relevo (sem acentos).
export const Texto3D: React.FC<{texto: string; tam: number; cor?: string; posicao?: [number, number, number]; emissao?: number; prof?: number}> = ({texto, tam, cor = '#fffaf2', posicao = [0, 0, 0], emissao = 0.2, prof = 0.12}) => {
  const geo = useMemo(() => {
    const g = new TextGeometry(texto, {font: fonte3d, size: tam, depth: prof, curveSegments: 10, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.015, bevelSegments: 3});
    g.computeBoundingBox();
    const b = g.boundingBox!;
    g.translate(-(b.max.x + b.min.x) / 2, -(b.max.y + b.min.y) / 2, 0);
    return g;
  }, [texto, tam, prof]);
  return (
    <mesh geometry={geo} position={posicao} castShadow>
      <meshStandardMaterial color={cor} roughness={0.4} emissive={cor} emissiveIntensity={emissao} />
    </mesh>
  );
};
