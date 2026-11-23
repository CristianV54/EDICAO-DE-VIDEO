import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {extrudar} from './formas';

// Mascote em blocos: corpo retangular, dois bracinhos, oito perninhas e olhos em seta.
// Desenho próprio, feito para lembrar o mascote do Claude Code.
const seta = (dir: 1 | -1): THREE.Shape => {
  const s = new THREE.Shape();
  const e = 0.065; // espessura do traço
  const pts: [number, number][] = [
    [-0.16, 0.16],
    [0.16, 0],
    [-0.16, -0.16],
    [-0.16, -0.16 + e * 1.5],
    [0.16 - e * 2.6, 0],
    [-0.16, 0.16 - e * 1.5],
  ];
  pts.forEach(([x, y], i) => (i === 0 ? s.moveTo(x * dir, y) : s.lineTo(x * dir, y)));
  s.closePath();
  return s;
};

export const Mascote3D: React.FC<{
  posicao?: [number, number, number];
  rotacao?: [number, number, number];
  escala?: number;
  passo?: number; // fase da caminhada, em radianos
}> = ({posicao = [0, 0, 0], rotacao = [0, 0, 0], escala = 1, passo = 0}) => {
  const caixa = (w: number, h: number, d: number) => new RoundedBoxGeometry(w, h, d, 3, 0.025);
  const corpo = useMemo(() => caixa(1.7, 1.1, 0.95), []);
  const braco = useMemo(() => caixa(0.22, 0.32, 0.42), []);
  const perna = useMemo(() => caixa(0.17, 0.42, 0.17), []);
  const olhoD = useMemo(() => extrudar(seta(1), 0.03, 0.006), []);
  const olhoE = useMemo(() => extrudar(seta(-1), 0.03, 0.006), []);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({color: '#e98a52', roughness: 0.62}), []);
  const matOlho = useMemo(() => new THREE.MeshStandardMaterial({color: '#1c1b1a', roughness: 0.5}), []);
  const xs = [-0.66, -0.4, 0.4, 0.66];
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      {/* origem nos pés */}
      <group position={[0, 0.42 + 0.55, 0]}>
        <mesh geometry={corpo} material={mat} castShadow receiveShadow />
        <mesh geometry={braco} material={mat} position={[-0.95, 0.02, 0]} castShadow />
        <mesh geometry={braco} material={mat} position={[0.95, 0.02, 0]} castShadow />
        <mesh geometry={olhoD} material={matOlho} position={[-0.42, 0.08, 0.475]} />
        <mesh geometry={olhoE} material={matOlho} position={[0.42, 0.08, 0.475]} />
      </group>
      {[0.3, -0.3].map((z, fila) =>
        xs.map((x, i) => {
          const sobe = Math.max(0, Math.sin(passo + i * 1.6 + fila * Math.PI)) * 0.1;
          return <mesh key={`${fila}${i}`} geometry={perna} material={mat} position={[x, 0.21 + sobe, z]} castShadow />;
        })
      )}
    </group>
  );
};
