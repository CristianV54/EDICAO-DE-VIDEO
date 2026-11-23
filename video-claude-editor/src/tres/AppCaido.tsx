import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Ícone de programa de edição, rachado e apagado. Desenho próprio, simplificado,
// feito só para lembrar o programa de que o vídeo fala.
type Tipo = 'premiere' | 'davinci';

const desenhar = (tipo: Tipo): THREE.CanvasTexture => {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const g = c.getContext('2d')!;
  g.clearRect(0, 0, 512, 512);
  if (tipo === 'premiere') {
    g.strokeStyle = '#8f8fe6';
    g.lineWidth = 16;
    g.beginPath();
    g.roundRect(34, 34, 444, 444, 70);
    g.stroke();
    g.fillStyle = '#9d9df0';
    g.font = 'bold 250px Arial, "DejaVu Sans", sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('Pr', 256, 272);
  } else {
    const petala = (ang: number, cor: string) => {
      g.save();
      g.translate(256, 268);
      g.rotate(ang);
      g.fillStyle = cor;
      g.beginPath();
      g.ellipse(0, -92, 78, 104, 0, 0, Math.PI * 2);
      g.fill();
      g.restore();
    };
    g.globalAlpha = 0.92;
    petala(0, '#e8b53a');
    petala((Math.PI * 2) / 3, '#3fa7c9');
    petala((Math.PI * 4) / 3, '#d9566a');
    g.globalAlpha = 1;
  }
  // rachaduras
  const rachar = (x: number, y: number, ang: number, n: number, semente: number) => {
    g.beginPath();
    g.moveTo(x, y);
    let a = ang;
    for (let i = 0; i < n; i++) {
      a += Math.sin(semente * 7.3 + i * 2.9) * 0.7;
      x += Math.cos(a) * 58;
      y += Math.sin(a) * 58;
      g.lineTo(x, y);
    }
    g.strokeStyle = '#050505';
    g.lineWidth = 17;
    g.lineJoin = 'miter';
    g.stroke();
    g.strokeStyle = 'rgba(255,255,255,0.22)';
    g.lineWidth = 2;
    g.stroke();
  };
  const [ox, oy] = tipo === 'premiere' ? [330, 150] : [170, 190];
  for (let i = 0; i < 7; i++) rachar(ox, oy, (i / 7) * Math.PI * 2 + 0.4, 8, i + (tipo === 'premiere' ? 1 : 9));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

export const AppCaido: React.FC<{
  tipo: Tipo;
  posicao: [number, number, number];
  rotacao: [number, number, number];
  escala?: number;
}> = ({tipo, posicao, rotacao, escala = 1}) => {
  const corpo = useMemo(() => new RoundedBoxGeometry(2.2, 2.2, 0.5, 8, 0.26), []);
  const tex = useMemo(() => desenhar(tipo), [tipo]);
  const cor = tipo === 'premiere' ? '#2a2070' : '#2e323b';
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      <mesh geometry={corpo} castShadow receiveShadow>
        <meshStandardMaterial color={cor} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0, 0.256]}>
        <planeGeometry args={[2.05, 2.05]} />
        <meshStandardMaterial map={tex} transparent roughness={0.6} />
      </mesh>
    </group>
  );
};
