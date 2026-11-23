import React, {useMemo} from 'react';
import * as THREE from 'three';
import {extrudar, placa} from './formas';
import {Halo} from './Halo';

// Personagem principal: bloco laranja com a estrela clara em relevo.
// Desenho próprio, feito para lembrar o ícone do Claude.
// Cada raio: [ângulo em graus, comprimento, largura na ponta, inclinação do corte da ponta]
const RAIOS: [number, number, number, number][] = [
  [0, 0.84, 0.072, 0.02],
  [27, 0.66, 0.06, -0.03],
  [58, 0.8, 0.07, 0.03],
  [90, 0.72, 0.064, -0.02],
  [121, 0.78, 0.07, 0.03],
  [150, 0.64, 0.06, -0.03],
  [180, 0.84, 0.072, 0.02],
  [209, 0.68, 0.06, 0.03],
  [238, 0.8, 0.07, -0.03],
  [270, 0.72, 0.064, 0.02],
  [300, 0.8, 0.07, -0.02],
  [332, 0.66, 0.06, 0.03],
];

const formaEstrela = (): THREE.Shape[] => {
  const formas: THREE.Shape[] = [];
  for (const [graus, comp, larg, corte] of RAIOS) {
    const a = (graus * Math.PI) / 180;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    const p = (x: number, y: number): [number, number] => [x * cos - y * sin, x * sin + y * cos];
    const s = new THREE.Shape();
    const pts = [p(-0.032, 0), p(0.032, 0), p(larg, comp - corte), p(-larg, comp + corte)];
    s.moveTo(...pts[0]);
    pts.slice(1).forEach((q) => s.lineTo(...q));
    s.closePath();
    formas.push(s);
  }
  const miolo = new THREE.Shape();
  miolo.absarc(0, 0, 0.13, 0, Math.PI * 2, false);
  formas.push(miolo);
  return formas;
};

export const Icone3D: React.FC<{
  posicao?: [number, number, number];
  rotacao?: [number, number, number];
  escala?: number;
  brilho?: number; // 0 a 1: quanto o bloco e a estrela emitem luz
}> = ({posicao = [0, 0, 0], rotacao = [0, 0, 0], escala = 1, brilho = 0.25}) => {
  const corpo = useMemo(() => placa(2.2, 2.2, 0.56, 0.42, 0.12), []);
  const estrela = useMemo(() => formaEstrela().map((f) => extrudar(f, 0.1, 0.016)), []);
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      {brilho > 0 ? <Halo cor="#ff7a3d" tam={6.5} forca={Math.min(1, brilho * 1.6)} /> : null}
      <mesh geometry={corpo} castShadow receiveShadow>
        <meshPhysicalMaterial color="#ea7648" roughness={0.42} clearcoat={0.35} clearcoatRoughness={0.4} emissive="#d2470f" emissiveIntensity={brilho} />
      </mesh>
      <group position={[0, 0, 0.33]}>
        {estrela.map((g, i) => (
          <mesh key={i} geometry={g} castShadow>
            <meshStandardMaterial color="#fffaf2" roughness={0.45} emissive="#fff3e0" emissiveIntensity={0.25 + brilho} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
