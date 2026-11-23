import React, {useMemo} from 'react';
import * as THREE from 'three';
import {cores} from '../tema';

// Personagem em 3D: miolo arredondado, 12 pontas em cápsula e dois olhos.
// Desenho próprio, inspirado no símbolo do Claude.
const RAIOS = [1, 0.78, 0.95, 0.7, 1, 0.8, 0.92, 0.72, 1, 0.76, 0.9, 0.74];

export const Personagem3D: React.FC<{
  posicao?: [number, number, number];
  rotacao?: [number, number, number];
  escala?: number;
  tempo?: number; // em quadros, para o balanço das pontas
  olhar?: [number, number]; // -1 a 1
  piscar?: number; // 1 aberto, 0 fechado
}> = ({posicao = [0, 0, 0], rotacao = [0, 0, 0], escala = 1, tempo = 0, olhar = [0, 0], piscar = 1}) => {
  const mat = useMemo(
    () => new THREE.MeshPhysicalMaterial({color: cores.laranja, roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.35}),
    []
  );
  const matOlho = useMemo(() => new THREE.MeshStandardMaterial({color: '#141413', roughness: 0.25}), []);
  const matBrilho = useMemo(() => new THREE.MeshBasicMaterial({color: '#ffffff'}), []);
  return (
    <group position={posicao} rotation={rotacao} scale={escala}>
      <mesh material={mat} castShadow scale={[1, 1, 0.62]}>
        <sphereGeometry args={[0.56, 48, 32]} />
      </mesh>
      {RAIOS.map((r, i) => {
        const ang = (i / RAIOS.length) * Math.PI * 2;
        const comp = 1.0 * r + Math.sin(tempo / 7 + i * 1.7) * 0.03;
        return (
          <group key={i} rotation={[0, 0, ang]}>
            <mesh material={mat} castShadow position={[0, comp / 2, 0]}>
              <capsuleGeometry args={[0.145, comp, 12, 24]} />
            </mesh>
          </group>
        );
      })}
      {[-0.19, 0.19].map((x) => (
        <group key={x} position={[x + olhar[0] * 0.05, -0.02 + olhar[1] * 0.05, 0.3]}>
          <mesh material={matOlho} scale={[1, Math.max(0.12, piscar) * 1.55, 0.5]}>
            <sphereGeometry args={[0.105, 24, 16]} />
          </mesh>
          <mesh material={matBrilho} position={[0.03, 0.07 * piscar, 0.05]}>
            <sphereGeometry args={[0.025, 12, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
